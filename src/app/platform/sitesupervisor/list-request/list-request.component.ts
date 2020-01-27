import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { SitesupervisorService } from '../sitesupervisor.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $:any;

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.css'],
  providers: [SitesupervisorService,SchedulerService,DesignerService]
})
export class ListRequestComponent implements OnInit {

	errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  errorMessagemodal : string;
  erroralertmodal = false;
  successalertmodal = false;
  successMessagemodal : string;

  requestList:any = []
  completeRequestForm: FormGroup;
  addImageForm: FormGroup;
  selected_project:any;

  constructor(
  	private loaderService : LoaderService,
    private ssService : SitesupervisorService,
    private formBuilder:FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  	this.loaderService.display(true);
  	this.completeRequestForm = new FormGroup({
  		status: new FormControl("complete", Validators.required),
      remark: new FormControl(null, Validators.required),
    });
    this.addImageForm = new FormGroup({
      status: new FormControl("complete", Validators.required)
    });
    this.route.queryParams
      .filter(params => params.project_id)
      .subscribe(params => {
      	this.selected_project = params.project_id;
      });

    if(this.selected_project){
    	this.getProjectRequestList(this.selected_project);
    }
    else{
    	this.getRequestList();
    }
  }

  getProjectRequestList(project_id){
    this.ssService.getProjectRequestList(project_id).subscribe(
      res => {
        this.requestList = res['site_measurement_requests'];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  requestStatus;
  getRequestList(){
    this.ssService.getRequestList().subscribe(
      res => {
        this.requestList = res['site_measurement_requests'];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  current_request:any
  completeRequestModal(req_id){
  	$("#completeRequestModal").modal("show");
  	this.current_request = req_id
  }

  attached_files:any = []
  attachFile(event){
  	// 
  	var fileReader;
  	var base64;
  	for (let file of event.target.files) {

		    fileReader = new FileReader();
		    fileReader.onload = (fileLoadedEvent) => {
		      base64 = fileLoadedEvent.target;
		      // this.basefile = base64.result;
          var file_obj = {
            "image": base64.result,
            "file_name": file.name
          }
		      this.attached_files.push(file_obj);
		      // this.paymentForm.patchValue({image: this.basefile})
		    };
		    
		    fileReader.readAsDataURL(file);

		}

  }

  // onChange(event) {
  //      this.attachment_file =event.target.files[0] || event.srcElement.files[0];
  //       var fileReader = new FileReader();
  //          var base64;
  //           fileReader.onload = (fileLoadedEvent) => {
  //            base64 = fileLoadedEvent.target;
  //            this.basefile = base64.result;
  //            //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
  //          };
  //       fileReader.readAsDataURL(this.attachment_file);
  //     }
  // anannya open modal for adding more image files
  requestCheck;
  addMoreFiles(requestId){
   $("#addMoreImageModal").modal("show");
    this.requestCheck = requestId;
  }
  // end here
  addImageSubmit(){
    this.loaderService.display(true);
    this.ssService.addImageSubmit(this.requestCheck,this.addImageForm,this.attached_files).subscribe(
      res=>{
        $("#addMoreImageModal").modal("hide");
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Image Uploaded Sucessfully";
        this.addImageForm.reset();
        this.attached_files = [];
      },
      err=>{
       
       this.loaderService.display(false);
      }
      );
  }

  completeRequest(){
  	this.loaderService.display(true);
  	
  	this.ssService.completeRequest(this.current_request, this.completeRequestForm.value, this.attached_files).subscribe(
      res => {
        $("#completeRequestModal").modal("hide");
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Request Completed";
        this.completeRequestForm.reset();
        this.attached_files = [];
        this.getRequestList();
      },
      err => {
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "Something went wrong";
        $("#completeRequestModal").modal("hide");
        this.completeRequestForm.reset();
        this.attached_files = [];
      }
    );
  }

  imageGallery:any = [];
  getGallery(req_id, remark){
  	this.loaderService.display(true);
  	this.ssService.getGallery(req_id).subscribe(
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

}
