import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
declare var $:any;

@Component({
  selector: 'app-file-ppt',
  templateUrl: './file-ppt.component.html',
  styleUrls: ['./file-ppt.component.css']
})
export class FilePptComponent implements OnInit {
  @Input() pptFileList:any = [];
  // @Input() pptList:any = [];
  lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  ppt_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  lead_status;
  submitted = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute,
    private ref:ChangeDetectorRef



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
        this.defaultPptList();
      },
      err => {
        
      }
    );
  }
  file_name:any = "";
  onChange(event) {
  	this.file_name = event.target.files[0].name
    this.ppt_file =event.target.files[0] || event.srcElement.files[0];
     var fileReader = new FileReader();
        var base64;
         fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.basefile = base64.result;
          //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
        };
     fileReader.readAsDataURL(this.ppt_file);
  }
  onSubmit(data) {
       this.submitted = true;
       let postData = {
	       		"boq_and_ppt_upload": {
	       			"upload": this.basefile,
	       			"upload_type": 'ppt',
	       			"file_name": this.file_name,
              "name": data.name
	       		}
       		}
       		
       this.loaderService.display(true);
       this.leadService.uploadPpt(this.project_id,postData)
       .subscribe(
           cad => {
             this.loaderService.display(false);
             this.successalert = true;
             this.successMessage = "PPT file uploaded successfully !!";
             // this.fetchCadElevation();
             setTimeout(function() {
               $("#pptModal").modal("hide");
               this.createPptForm.reset();
               // this.router.navigate(['/projects/view/'+this.project_id],{queryParams: { customer_status: this.customer_status }} );
               this.successalert = false;
              }.bind(this), 800);
             this.fetchPptList(); 
             // this.defaultPptList();
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
	  fetchPptList(){
	    this.loaderService.display(true);
	    this.leadService.fetchPptlist(this.project_id).subscribe(
	      res => {
	        this.loaderService.display(false);
	        this.pptFileList = res['boq_and_ppt_uploads'];
          
	      },
	      err => {
	        this.loaderService.display(false);
	        
	      }
	    );
	  }
    // default ppt
   ppt_list;
   view_all;
   sample_ppt_name;
  defaultPptList(){
    
    this.loaderService.display(true);
    this.leadService.defaultPptList(this.project_id).subscribe(
      res => {
        
        // this.ppt_list = Object.keys(res);
        this.view_all = res;
        this.sample_ppt_name=res.sample_ppt_name;
        
        
        this.ref.detectChanges();
         
        this.loaderService.display(false);

      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }
	  deleteObject(obj_id){
	    if (confirm("Are You Sure you want to delete this PPT File?") == true) {
	      this.loaderService.display(true);
	      this.leadService.deletePpt(this.project_id,obj_id)
	      .subscribe(
	          res => {
	            this.loaderService.display(false);
	            this.successalert = true;
	            this.successMessage = "PPT deleted successfully !!";
	            this.fetchPptList();
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
  shareWithCustomer(value){
  	this.loaderService.display(true);
  	this.leadService.shareWithCustomer(this.project_id,value).subscribe(
  		res=>{
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "PPT Has Shared successfully !!";
        this.fetchPptList();
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 800);

  		},
  		err=>{
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
           this.erroralert = false;
         }.bind(this), 10000);

        this.loaderService.display(false);
      });

  }
  confirmAndShare(value) {
    if (confirm("Are You Sure You Want To Share?") == true) {
      this.shareWithCustomer(value);
    }
  }

}
