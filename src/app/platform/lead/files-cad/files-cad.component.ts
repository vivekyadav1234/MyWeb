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
  selector: 'app-files-cad',
  templateUrl: './files-cad.component.html',
  styleUrls: ['./files-cad.component.css'],
  providers: [LeadService, LoaderService]
})
export class FilesCadComponent implements OnInit {
	@Input() cadElevationList:any = [];
	lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  cad_drawing: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  submitted = false;
  lead_status;

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

  fetchCadElevation(){
    this.loaderService.display(true);
    this.leadService.fetchCadElevation(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.cadElevationList = res['cad_drawings'];
        
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  // create cad code starts
  file_name:any = "";
  onChange(event) {
  	this.file_name = event.target.files[0].name
    this.cad_drawing =event.target.files[0] || event.srcElement.files[0];
     var fileReader = new FileReader();
        var base64;
         fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.basefile = base64.result;
          //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
        };
     fileReader.readAsDataURL(this.cad_drawing);
   }
   onSubmit(data) {
       this.submitted = true;
       let postData = {
	       		"cad_drawing": {
	       			"cad_drawing": this.basefile,
	       			"name": data.name,
	       			"file_name": this.file_name
	       		}
       		}
       		
       this.loaderService.display(true);
       this.leadService.uploadCad(this.project_id,postData)
       .subscribe(
           cad => {
             this.loaderService.display(false);
             this.successalert = true;
             this.successMessage = "CAD file uploaded successfully !!";
             this.fetchCadElevation();
             setTimeout(function() {
               $("#cadModal").modal("hide");
               this.createCadForm.reset()
               // this.router.navigate(['/projects/view/'+this.project_id],{queryParams: { customer_status: this.customer_status }} );
               this.successalert = false;
              }.bind(this), 800);
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

  deleteObject(obj_id){
    if (confirm("Are You Sure you want to delete this CAD File?") == true) {
      this.loaderService.display(true);
      this.leadService.deleteCad(this.project_id,obj_id)
      .subscribe(
          res => {
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Cad deleted successfully !!";
            this.fetchCadElevation();
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
