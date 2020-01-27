import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';

declare var $:any;

@Component({
  selector: 'app-files-site-measurement',
  templateUrl: './files-site-measurement.component.html',
  styleUrls: ['./files-site-measurement.component.css'],
  providers: [LeadService, LoaderService]
})
export class FilesSiteMeasurementComponent implements OnInit {
	@Input() siteRequestList:any = [];

	lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  submitted = false;
  lead_status;
  createRequestForm: FormGroup;

  constructor(
  	public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,

    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
    this.initializeRequestForm();
  }

  initializeRequestForm(){
    this.createRequestForm = new FormGroup({
      'request_type': new FormControl("", Validators.required),
      'address': new FormControl("", Validators.required),
      'scheduled_at': new FormControl("", Validators.required),
      'project_id': new FormControl("")
    });
  }

  onRequest(){
    this.loaderService.display(true);
    this.createRequestForm.patchValue({project_id: this.project_id});
    this.leadService.createSiteRequest(this.createRequestForm.value).subscribe(
      res => {
        $("#siteModal").modal("hide");
        // this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Request sent"
        setTimeout(function() {
                  this.successalert = false;
               }.bind(this), 2000);
        this.fetchSiteRequest();
        this.createRequestForm.reset();
        
      },
      err => {
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "Something went wrong. Please try again"
        setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 2000);
        
      });
  }

  fetchSiteRequest(){
    this.loaderService.display(true);
    this.leadService.fetchSiteRequest(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.siteRequestList = res['site_measurement_requests'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
      },
      err => {
        
      }
    );
  }

  imageGallery:any = [];
  getGallery(req_id, remark){
    this.loaderService.display(true);
    this.leadService.getGallery(req_id).subscribe(
      res => {
        $("#completeRequestModal").modal("hide");
        this.loaderService.display(false);
        this.imageGallery = res['site_galleries'];
        $(".remarks").html(remark);
        $("#viewGalleryModal").modal("show");
      },
      err => {
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "Something went wrong";
        this.imageGallery = [];
      }
    );
  }

  deleteObject(obj_id){
    if (confirm("Are You Sure you want to delete this Site Request Files?") == true) {
      this.loaderService.display(true);
      this.leadService.deleteSiteMeasurement(obj_id)
      .subscribe(
          res => {
            $("#viewGalleryModal").modal("hide");
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Files deleted successfully !!";
            this.fetchSiteRequest();
            setTimeout(function() {
              this.successalert = false;
             }.bind(this), 800);
          },
          err => {
            this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
               this.erroralert = false;
             }.bind(this), 10000);

            this.loaderService.display(false);
          });
    }
  }

}
