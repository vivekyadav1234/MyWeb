import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { FloorplanService } from '../../floorplans/floorplan/floorplan.service';
import { Floorplan } from '../../floorplans/floorplan/floorplan';
import { Angular2TokenService } from 'angular2-token';

declare var $:any;


@Component({
  selector: 'app-files-floorplan',
  templateUrl: './files-floorplan.component.html',
  styleUrls: ['./files-floorplan.component.css'],
  providers: [LeadService, LoaderService, FloorplanService]
})
export class FilesFloorplanComponent implements OnInit {
	@Input() floorplans_list:any = [];
	lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  floorplan : Floorplan[];
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  submitted = false;
  lead_status;
  id: any;
  name: any;
  customerDetails;
  neha: string;

  constructor(
  	public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public floorplanService : FloorplanService,

    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
        this.name = params['name'];
        this.id = params['id'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
  }
  client_name;
  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.client_name = res['lead'].project_details.name;
        
      },
      err => {
        
      }
    );
  }

  fetchFloorplans(){
    this.leadService.getFloorplans(this.project_id).subscribe(
      res => {
        
        this.floorplans_list = res['floorplans'];
        
      },
      err => {
        
      }
    );
  }

  // create floorplan code starts
  file_name:any = "";
  onChange(event) {
  	this.file_name = event.target.files[0].name
    this.attachment_file =event.target.files[0] || event.srcElement.files[0];
     var fileReader = new FileReader();
        var base64;
         fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.basefile = base64.result;
          //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
        };
     fileReader.readAsDataURL(this.attachment_file);
   }
   onSubmit(data) {

       this.submitted = true;
       let postData = {name: data.name, details: data.details};
       this.loaderService.display(true);
       this.floorplanService.postWithFile(this.project_id,postData,this.basefile, this.file_name)
       .subscribe(
           floorplan => {
             floorplan = floorplan;
             Object.keys(floorplan).map((key)=>{ floorplan= floorplan[key];});
             this.loaderService.display(false);
             this.successalert = true;
             this.successMessage = "Floorplan plan created successfully !!";
             this.fetchFloorplans();
             setTimeout(function() {
               $("#floorplanModal").modal("hide");
               this.createFloorplanForm.reset()
               // this.router.navigate(['/projects/view/'+this.project_id],{queryParams: { customer_status: this.customer_status }} );
               this.successalert = false;
              }.bind(this), 800);
             return floorplan;
           },
           error => {
             this.erroralert = true;
             this.errorMessage = JSON.parse(error['_body']).message;
             setTimeout(function() {
                this.erroralert = false;
              }.bind(this), 10000);

             this.loaderService.display(false);
             return Observable.throw(error);
           }
       );
    }
  // create floorplan code ends

  deleteObject(obj_id){
    if (confirm("Are You Sure you want to delete this floorplan?") == true) {
      this.loaderService.display(true);
      this.floorplanService.deleteFloorPlan(this.project_id,obj_id)
      .subscribe(
          res => {
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Floorplan deleted successfully !!";
            this.fetchFloorplans();
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

  sendSmsFloorplanLink(contact_no) {
      this.loaderService.display(true);
      this.leadService.getSmsLink(this.project_id,this.client_name,contact_no).subscribe(
        res=>{
          this.successalert = true;
          this.successMessage = "Link is sent successfully !!";
           this.loaderService.display(false);
        },
        err=>{
          this.erroralert = true;
          this.errorMessage = "error";
          this.loaderService.display(false);
        });

  }

  showSuccessMessage(msg){
    this.successalert = true;
      this.successMessage = msg;
      setTimeout(function() {
                this.successalert = false;
             }.bind(this), 23000);
  }

  showErrorMessage(msg){
    this.erroralert = true;
      this.errorMessage = msg;
      setTimeout(function() {
                this.successalert = false;
             }.bind(this), 23000);
  }

  getCustomerDetails(){
    this.leadService.getCustomerCallDetails(this.lead_id).subscribe(
      res => {
        this.customerDetails = res['lead'].contacts;
        this.neha = 'neha';
      },
      err => {
        
      }
    );
  }

}
