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
  selector: 'app-file-boq',
  templateUrl: './file-boq.component.html',
  styleUrls: ['./file-boq.component.css']
})
export class FileBoqComponent implements OnInit {
	@Input() boqFileList:any = [];
	lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  boq_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  lead_status;
  submitted = false;
  completeRequestForm: FormGroup;
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
  file_name:any = "";
  size;
  sizeKB;
  onChange(event) {
     this.size = event.target.files[0].size;
    this.sizeKB = this.size/1000;
  	this.file_name = event.target.files[0].name
    this.boq_file =event.target.files[0] || event.srcElement.files[0];
     var fileReader = new FileReader();
        var base64;
         fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.basefile = base64.result;
         };
     fileReader.readAsDataURL(this.boq_file);
   }
  
  onSubmit(data) {
       this.submitted = true;
       let postData = {
	       		  "line_marking": {
               "file_name": this.file_name,
              "name": data.name,
              "description": data.details,
               "attachments":{
                "document_file_name":this.file_name,
                "document_content_type": this.basefile,
                "document_file_size":this.sizeKB,
               }
             }
           }
	       		   
       this.loaderService.display(true);
       this.leadService.uploadLineMarking(this.project_id,postData)
       .subscribe(
           cad => {
             
             this.loaderService.display(false);
             this.successalert = true;
             this.successMessage = "Line Marking file uploaded successfully !!";
             setTimeout(function() {
               $("#linemarkingModal").modal("hide");
               this.createBoqForm.reset();
               // this.router.navigate(['/projects/view/'+this.project_id],{queryParams: { customer_status: this.customer_status }} );
               this.successalert = false;
              }.bind(this), 800);
             this.fetchLineMarkingList(); 
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
   
  fetchLineMarkingList(){
    this.loaderService.display(true);
    this.leadService.fetchLineMarkingList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.boqFileList = res['line_markings'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  deleteObject(obj_id){
    if (confirm("Are You Sure you want to delete this Line Marking File?") == true) {
      this.loaderService.display(true);
      this.leadService.deleteLineMarking(this.project_id,obj_id)
      .subscribe(
          res => {
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Line Marking deleted successfully !!";
            this.fetchLineMarkingList();
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
