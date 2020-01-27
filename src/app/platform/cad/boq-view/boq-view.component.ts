import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { QuotationService } from '../../quotation/quotation.service';
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
  providers: [QuotationService,LeadService]
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

  oncadUploadFormSubmit(){
    this.loaderService.display(true);
    this.quotationService.onCadUploadFormSubmit(this.project_id, this.quotation_id, this.basefile,this.attachment_file_name, this.cadUploadForm.value).subscribe(
      res => {
        this.loaderService.display(false);
        this.fetchCadFiles();
        $("#uploadCadModal").modal("hide");
        alert("Uploaded successfully");
        this.cadUploadForm.reset();
        this.cadUploadForm.controls['status'].setValue("pending");
      }, 
      err => {
        this.loaderService.display(false);
        
        var error_data = JSON.parse(err._body)['message']
        alert(error_data);
        $("#uploadCadModal").modal("hide");
      });
  }

  tagging_file_id:any;
  initTagging(stage = 'init', file){
    this.tag_array = [];
    this.tag_array_ids = [];
    this.tagging_file_id = file.id;
    $("#taggingModal").modal("show");
    this.selectedSet = 'loose';
    if(stage = 'update'){
      this.tagging_file_id = file.id;
      $("#taggingModal").modal("show");

      if(Object.keys(file.modular_jobs_kitchen).length>0){
        for(var l=0;l<Object.keys(file.modular_jobs_kitchen).length;l++){
          let arr = file.modular_jobs_kitchen[Object.keys(file.modular_jobs_kitchen)[l]]
          for (let entry of arr) {
            let obj = {
              "uploadable_type": 'ModularJob',
              "uploadable_id": entry['id']
            }
            this.tag_array.push(obj);
            this.tag_array_ids.push('ModularJob'+entry['id'].toString());
          }
        }
      }

      if(Object.keys(file.boqjobs).length>0){
        for(var l=0;l<Object.keys(file.boqjobs).length;l++){
          let arr = file.boqjobs[Object.keys(file.boqjobs)[l]]
          for (let entry of arr) {
            let obj = {
              "uploadable_type": 'Boqjob',
              "uploadable_id": entry['id']
            }
            this.tag_array.push(obj);
            this.tag_array_ids.push('Boqjob'+entry['id'].toString());
          }
        }
      }

      if(Object.keys(file.modular_jobs_wardrobe).length>0){
        for(var l=0;l<Object.keys(file.modular_jobs_wardrobe).length;l++){
          let arr = file.modular_jobs_wardrobe[Object.keys(file.modular_jobs_wardrobe)[l]]
          for (let entry of arr) {
            let obj = {
              "uploadable_type": 'ModularJob',
              "uploadable_id": entry['id']
            }
            this.tag_array.push(obj);
            this.tag_array_ids.push('ModularJob'+entry['id'].toString());
          }
        }
      }

      if(Object.keys(file.service_jobs).length>0){
        for(var l=0;l<Object.keys(file.service_jobs).length;l++){
          let arr = file.service_jobs[Object.keys(file.service_jobs)[l]]
          for (let entry of arr) {
            let obj = {
              "uploadable_type": 'ServiceJob',
              "uploadable_id": entry['id']
            }
            this.tag_array.push(obj);
            this.tag_array_ids.push('ServiceJob'+entry['id'].toString());
          }
        }
      }

      if(Object.keys(file.appliance_jobs).length>0){
        for(var l=0;l<Object.keys(file.appliance_jobs).length;l++){
          let arr = file.appliance_jobs[Object.keys(file.appliance_jobs)[l]]
          for (let entry of arr) {
            let obj = {
              "uploadable_type": 'ApplianceJob',
              "uploadable_id": entry['id']
            }
            this.tag_array.push(obj);
            this.tag_array_ids.push('ApplianceJob'+entry['id'].toString());
          }
        }
      }

      if(Object.keys(file.custom_jobs).length>0){
        for(var l=0;l<Object.keys(file.custom_jobs).length;l++){
          let arr = file.custom_jobs[Object.keys(file.custom_jobs)[l]]
          for (let entry of arr) {
            let obj = {
              "uploadable_type": 'CustomJob',
              "uploadable_id": entry['id']
            }
            this.tag_array.push(obj);
            this.tag_array_ids.push('CustomJob'+entry['id'].toString());
          }
        }
      }

      if(Object.keys(file.extra_jobs).length>0){
        for(var l=0;l<Object.keys(file.extra_jobs).length;l++){
          let arr = file.extra_jobs[Object.keys(file.extra_jobs)[l]]
          for (let entry of arr) {
            let obj = {
              "uploadable_type": 'ExtraJob',
              "uploadable_id": entry['id']
            }
            this.tag_array.push(obj);
            this.tag_array_ids.push('ExtraJob'+entry['id'].toString());
          }
        }
      }
      this.selectedSet = 'loose';
    }
    
  }

  tag_array:any = [];
  tag_array_ids:any = [];
  populateTags(uploadable_type, uploadable_id, event){
    if(event.target.checked){
      let obj = {
          "uploadable_type": uploadable_type,
          "uploadable_id": uploadable_id
        }

      this.tag_array.push(obj);
      this.tag_array_ids.push(uploadable_type.toString()+uploadable_id.toString());
    }
    else{
      for(var l=0;l<this.tag_array.length;l++){
        if(this.tag_array[l].uploadable_id == uploadable_id){
          this.tag_array.splice(l, 1);
        }
      }
      var index = this.tag_array_ids.indexOf(uploadable_type.toString()+uploadable_id.toString(), 0);
      if (index > -1) {
         this.tag_array_ids.splice(index, 1);
      }
    }
  }

  tagItem(){
    this.loaderService.display(true);
    if(this.tag_array.length > 0){
      this.quotationService.tagItem(this.project_id,this.quotation_id, this.tagging_file_id, this.tag_array).subscribe(
        res => {
          this.fetchCadFiles();
          $("#taggingModal").modal("hide");
          alert("Tagged successfully");
        }, 
        err => {
          
          this.loaderService.display(false);
          alert("Something went wrong");
        });
    }
    else{
      this.loaderService.display(false);
      alert("Please select atleast one item");
    }
    
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
    this.quotationService.viewQuotationDetails(this.project_id,this.quotation_id).subscribe(
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
