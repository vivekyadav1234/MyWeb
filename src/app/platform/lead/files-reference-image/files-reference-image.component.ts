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
  selector: 'app-files-reference-image',
  templateUrl: './files-reference-image.component.html',
  styleUrls: ['./files-reference-image.component.css'],
  providers: [LoaderService,LeadService]
})
export class FilesReferenceImageComponent implements OnInit {
  @Input() referenceImageList: any = [];
  lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  reference_drawing: any;
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
  // create elevation code starts
  file_name:any = "";
  file_size:any="";
   onChange(event) {
  	this.file_name = event.target.files[0].name;
    this.basefile =event.target.files[0] || event.srcElement.files[0];
     var fileReader = new FileReader();
        var base64;
         fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.basefile = base64.result;
          //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
        };
     fileReader.readAsDataURL(this.basefile);
   }
  onSubmit(data) {
  	 
       this.submitted = true;
       let postData = {
	       		'reference_image':{
	       			"attachments": this.basefile,
               "file_name": this.file_name,
	       			"name": data.name
	       		}	
	       		
       		}
       		
       this.loaderService.display(true);
       this.leadService.uploadReference(this.project_id,postData)
       .subscribe(
           cad => {
             this.loaderService.display(false);
             this.successalert = true;
             this.successMessage = "Reference file uploaded successfully !!";
             
             this.fetcReferenceList();
             setTimeout(function() {
               $("#referenceModal").modal("hide");
               this.createReferenceForm.reset();
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
  fetcReferenceList(){
    this.loaderService.display(true);
    this.leadService.fetcReferenceList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.referenceImageList = res['reference_images'];
         
      },
      err => {
        this.loaderService.display(false);
        
      }
    );

  }


}
