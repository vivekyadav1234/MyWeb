import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { QuotationService } from '../../quotation/quotation.service';
import {BusinessHeadService} from '../business-head.service';
import { LoaderService } from '../../../services/loader.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Observable'; 
import { LeadService } from '../../lead/lead.service';
declare var $:any;

@Component({
  selector: 'app-boq-view',
  templateUrl: './boq-view.component.html',
  styleUrls: ['./boq-view.component.css'],
  providers: [QuotationService,LeadService, BusinessHeadService]
})
export class BoqViewComponent implements OnInit {
	project_id:any;
  quotation_id:any;
  cadUploadForm:FormGroup;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
  	public activatedRoute: ActivatedRoute,
    private loaderService : LoaderService,
    private quotationService:QuotationService,
    private businessHeadService:BusinessHeadService,
    private route: ActivatedRoute,
    private router:Router,
    private formBuilder:FormBuilder,
    private _location: Location, 
    private fb: FormBuilder
  ) {
  	this.cadUploadForm = this.formBuilder.group({
      upload_name : new FormControl("",Validators.required),
      upload_type : new FormControl("",Validators.required),
      status : new FormControl("pending",Validators.required),
      upload : new FormControl("",Validators.required),
      quotation_id : new FormControl("",Validators.required)
    })
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.project_id = params['projectId'];
        this.quotation_id = params['quoteId'];
      }
    );
    this.fetchQuotation();

  }

  attachment_file;
  attachment_file_name;
  basefile;
  onChange(event) {
   this.attachment_file =event.target.files[0] || event.srcElement.files[0];
   this.attachment_file_name = this.attachment_file['name'];
    var fileReader = new FileReader();
       var base64;
        fileReader.onload = (fileLoadedEvent) => {
         base64 = fileLoadedEvent.target;
         this.basefile = base64.result;
       };
    fileReader.readAsDataURL(this.attachment_file);
  }

  quotation:any = {};
  modular_jobs_kitchen_array:any = [];
  modular_jobs_wardrobe_array:any = [];
  loose_jobs_array:any = [];
  service_jobs_array:any = [];
  appliance_jobs_array:any = [];
  custom_jobs_array:any = [];
  extra_jobs_array:any = [];
  boqProducts:any = [];
  fetchQuotation(){
    this.loaderService.display(true);
    this.businessHeadService.getQuotationDetails(this.project_id,this.quotation_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.quotation = res.quotation;

        if(Object.keys(this.quotation.modular_jobs_kitchen).length>0){
          for(var l=0;l<Object.keys(this.quotation.modular_jobs_kitchen).length;l++){
            let obj = this.quotation.modular_jobs_kitchen[Object.keys(this.quotation.modular_jobs_kitchen)[l]]
            for(var m=0;m<obj.length;m++){
              this.modular_jobs_kitchen_array.push(obj[m]);
            }
          }
        }

        if(Object.keys(this.quotation.modular_jobs_wardrobe).length>0){
          for(var l=0;l<Object.keys(this.quotation.modular_jobs_wardrobe).length;l++){
            let obj = this.quotation.modular_jobs_wardrobe[Object.keys(this.quotation.modular_jobs_wardrobe)[l]]
            for(var m=0;m<obj.length;m++){
              this.modular_jobs_wardrobe_array.push(obj[m]);
            }
          }
        }

        if(Object.keys(this.quotation.boqjobs).length>0){
          // 
          for(var l=0;l<Object.keys(this.quotation.boqjobs).length;l++){
            let obj = this.quotation.boqjobs[Object.keys(this.quotation.boqjobs)[l]]

            for(var m=0;m<obj.length;m++){
              this.loose_jobs_array.push(obj[m]);
            }
          }
        }

        if(Object.keys(this.quotation.service_jobs).length>0){
          for(var l=0;l<Object.keys(this.quotation.service_jobs).length;l++){
            let obj = this.quotation.service_jobs[Object.keys(this.quotation.service_jobs)[l]]
            for(var m=0;m<obj.length;m++){
              this.service_jobs_array.push(obj[m]);
            }
          }
        }

        if(Object.keys(this.quotation.appliance_jobs).length>0){
          for(var l=0;l<Object.keys(this.quotation.appliance_jobs).length;l++){
            let obj = this.quotation.appliance_jobs[Object.keys(this.quotation.appliance_jobs)[l]]
            for(var m=0;m<obj.length;m++){
              this.appliance_jobs_array.push(obj[m]);
            }
          }
        }

        if(Object.keys(this.quotation.custom_jobs).length>0){
          for(var l=0;l<Object.keys(this.quotation.custom_jobs).length;l++){
            let obj = this.quotation.custom_jobs[Object.keys(this.quotation.custom_jobs)[l]]
            for(var m=0;m<obj.length;m++){
              this.custom_jobs_array.push(obj[m]);
            }
          }
        }

        if(Object.keys(this.quotation.extra_jobs).length>0){
          for(var l=0;l<Object.keys(this.quotation.extra_jobs).length;l++){
            let obj = this.quotation.extra_jobs[Object.keys(this.quotation.extra_jobs)[l]]
            for(var m=0;m<obj.length;m++){
              this.extra_jobs_array.push(obj[m]);
            }
          }
        }
      }, 
      err => {
        
        this.loaderService.display(false);
      });
  }

  selectedParentSet:any = "line_items"
  getParentSet(type){
    this.selectedParentSet = type;
  }

  selectedSet:any = "loose"
  getSet(type){
    this.selectedSet = type;
  }

  resetForm(){
    this.cadUploadForm.reset();
    this.cadUploadForm.controls['status'].setValue("pending");
  }

  getObjSize(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
  };

}
