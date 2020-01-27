import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { QuotationService } from '../../../quotation/quotation.service';
import { LoaderService } from '../../../../services/loader.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Observable'; 
import { LeadService } from '../../../lead/lead.service';
declare var $:any;

@Component({
  selector: 'app-sd-drawings',
  templateUrl: './sd-drawings.component.html',
  styleUrls: ['./sd-drawings.component.css'],
  providers: [QuotationService,LeadService]
})
export class SdDrawingsComponent implements OnInit {
	project_id:any;
  	quotation_id:any;
	approvalForm:FormGroup;
	errorMessage : string;
	erroralert = false;
	successalert = false;
	successMessage : string;

  constructor(
  	public activatedRoute: ActivatedRoute,
    private loaderService : LoaderService,
    private quotationService:QuotationService,
    private route: ActivatedRoute,
    private router:Router,
    private formBuilder:FormBuilder,
    private _location: Location, 
    private fb: FormBuilder
  ) {
  	this.approvalForm = this.formBuilder.group({
      status : new FormControl("",Validators.required),
      approval_comment : new FormControl("",Validators.required)
    })
  }

  ngOnInit() {
  	this.route.params.subscribe(
      params => {
        this.project_id = params['project_id'];
        this.quotation_id = params['quotation_id'];
      }
    );
    this.fetchCadFiles();
  }

  files:any = []
  fetchCadFiles(){
    this.loaderService.display(true);
    this.quotationService.fetchCadFiles(this.project_id,this.quotation_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.files = res.cad_uploads;
      }, 
      err => {
        this.loaderService.display(false);
        
      });
  }

  attachment_file;
  basefile;
  onChange(event) {
   this.attachment_file =event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
       var base64;
        fileReader.onload = (fileLoadedEvent) => {
         base64 = fileLoadedEvent.target;
         this.basefile = base64.result;
       };
    fileReader.readAsDataURL(this.attachment_file);
  }

  selectedSet:any = "loose"
  getSet(type){
    this.selectedSet = type;
  }

  resetForm(){
    this.approvalForm.reset();
  }

  tagging_file_id:any;
  initApproval(file_id, status){
  	this.tagging_file_id = file_id;
  	this.approvalForm.controls['status'].setValue(status);
  	if(status == "approved"){
  		this.approvalSubmit();
  	}
  	else if(status == "rejected"){
  		$("#approvalModal").modal("show");
  	}
  }

  approvalSubmit(){
	  this.quotationService.approvalSubmit(this.project_id,this.quotation_id, this.tagging_file_id, this.approvalForm.value).subscribe(
	    res => {
	      this.fetchCadFiles();
	      $("#approvalModal").modal("hide");
	      alert("Status Updated");
	    }, 
	    err => {
	      
	      this.loaderService.display(false);
	      alert("Something went wrong");
	  });
	}

	modular_jobs_kitchen_array:any = [];
  modular_jobs_wardrobe_array:any = [];
  loose_jobs_array:any = [];
  service_jobs_array:any = [];
  appliance_jobs_array:any = [];
  custom_jobs_array:any = [];
  extra_jobs_array:any = [];
  viewTaggedItems(file){
  	this.modular_jobs_kitchen_array = [];
  	this.modular_jobs_wardrobe_array = [];
  	this.loose_jobs_array = [];
  	this.service_jobs_array = [];
  	this.appliance_jobs_array = [];
  	this.custom_jobs_array = [];
  	this.extra_jobs_array = [];
  	$("#taggedModal").modal("show");
  	if(Object.keys(file.modular_jobs_kitchen).length>0){
  	  for(var l=0;l<Object.keys(file.modular_jobs_kitchen).length;l++){
  	    let obj = file.modular_jobs_kitchen[Object.keys(file.modular_jobs_kitchen)[l]]
  	    if(l == 0){
  	      this.modular_jobs_kitchen_array = obj;
  	    }
  	    else{
  	      this.modular_jobs_kitchen_array.push(obj);
  	    }
  	  }
  	}

  	if(Object.keys(file.modular_jobs_wardrobe).length>0){
  	  for(var l=0;l<Object.keys(file.modular_jobs_wardrobe).length;l++){
  	    let obj = file.modular_jobs_wardrobe[Object.keys(file.modular_jobs_wardrobe)[l]]
  	    if(l == 0){
  	      this.modular_jobs_wardrobe_array = obj;
  	    }
  	    else{
  	      this.modular_jobs_wardrobe_array.push(obj);
  	    }
  	  }
  	}

  	if(Object.keys(file.boqjobs).length>0){
  	  for(var l=0;l<Object.keys(file.boqjobs).length;l++){
  	    let obj = file.boqjobs[Object.keys(file.boqjobs)[l]]
  	    if(l == 0){
  	      this.loose_jobs_array = obj;
  	    }
  	    else{
  	      this.loose_jobs_array.push(obj);
  	    }
  	  }
  	}

  	if(Object.keys(file.service_jobs).length>0){
  	  for(var l=0;l<Object.keys(file.service_jobs).length;l++){
  	    let obj = file.service_jobs[Object.keys(file.service_jobs)[l]]
  	    if(l == 0){
  	      this.service_jobs_array = obj;
  	    }
  	    else{
  	      this.service_jobs_array.push(obj);
  	    }
  	  }
  	}

  	if(Object.keys(file.appliance_jobs).length>0){
  	  for(var l=0;l<Object.keys(file.appliance_jobs).length;l++){
  	    let obj = file.appliance_jobs[Object.keys(file.appliance_jobs)[l]]
  	    if(l == 0){
  	      this.appliance_jobs_array = obj;
  	    }
  	    else{
  	      this.appliance_jobs_array.push(obj);
  	    }
  	  }
  	}

  	if(Object.keys(file.custom_jobs).length>0){
  	  for(var l=0;l<Object.keys(file.custom_jobs).length;l++){
  	    let obj = file.custom_jobs[Object.keys(file.custom_jobs)[l]]
  	    if(l == 0){
  	      this.custom_jobs_array = obj;
  	    }
  	    else{
  	      this.custom_jobs_array.push(obj);
  	    }
  	  }
  	}

  	if(Object.keys(file.extra_jobs).length>0){
  	  for(var l=0;l<Object.keys(file.extra_jobs).length;l++){
  	    let obj = file.extra_jobs[Object.keys(file.extra_jobs)[l]]
  	    if(l == 0){
  	      this.extra_jobs_array = obj;
  	    }
  	    else{
  	      this.extra_jobs_array.push(obj);
  	    }
  	  }
  	}
  }

}
