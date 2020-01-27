import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { LoaderService } from '../../../../services/loader.service';
import { QuotationService } from '../../../../platform/quotation/quotation.service';
import { CategoryService} from '../category.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css'],
  providers: [CategoryService, QuotationService]

})
export class ViewCategoryComponent implements OnInit {
	approve_boq_list: any = [];
	project_id;
  project_name;
  priceForm: FormGroup;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  // priceForm: FormGroup;
  rejectForm:FormGroup;
  project_status: any;
  doc_Id:any;
  formType: string;
  priceErroralert: boolean;

  constructor(
  	private router: Router,
  	private loaderService : LoaderService,
  	private categoryService:CategoryService,
    private quotationService:QuotationService,
  	private route:ActivatedRoute,
    private _location: Location,
    private formBuilder: FormBuilder,
  ) {
      this.priceForm = formBuilder.group({
        'price' : ['', Validators.required],
        'category_remark': ['',Validators.required],
        'status': ['']
      });
      this.rejectForm = formBuilder.group({
        'price' : [''],
        'category_remark': ['',Validators.required],
        'status': ['']
      });

  }

  ngOnInit() {
  	 this.route.params.subscribe(
      params => {
        this.project_id = params['projectId'];
      }
    );
    this.route.queryParams.subscribe(
      params => {
        this.project_name = params['project_name'];
      }
    );
  	this.getApproveBoqList(this.project_id);
    this.getCustomElement();
  }
  // method for getting list for approved boqs by customer
  getApproveBoqList(value){
    this.loaderService.display(true);
  	this.categoryService.getApprovedBoqList(value,this.state).subscribe(
  		res=>{
  			this.approve_boq_list = res.proposal_docs;
         this.loaderService.display(false);
  		},
  		err=>{
  			
        this.loaderService.display(false);
  		});


  }
  customList;
  getCustomElement(){
    this.categoryService.getCustomElements(this.project_id).subscribe(
      res=>{
        this.customList = res['custom_elements'];
      },
      err=>{
        
      });
  }
  backClicked() {
    this._location.back();
  }
  state = 'initial_design';
  selectSet(set){
    this.state = set;
    if( this.state == 'final_design'){
      this.getApproveBoqList(this.project_id);

    }
    if(this.state == 'floorplan'){
      this.fetchFloorplan();
    }
    else if(this.state == 'cad'){
      this.fetchCad();
    }
    else if(this.state == 'uploaded-boq'){
      this.fetchBoqList();
    }
    else if(this.state == 'uploaded-ppt'){
      this.fetchPptList();
    }
    else{
      this.getApproveBoqList(this.project_id);
    }


  }
  ppt_list:any = [];
  fetchPptList(){
    this.loaderService.display(true);
    this.categoryService.fetchPptList(this.project_id).subscribe(
      res=>{
        this.ppt_list = res['boq_and_ppt_uploads'];
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

  cad_list:any = [];
  fetchCad(){
    this.loaderService.display(true);
    this.categoryService.fetchCad(this.project_id).subscribe(
      res=>{
        this.cad_list = res['cad_drawings'];
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }
  boq_list =[];
  fetchBoqList(){
    this.loaderService.display(true);
    this.categoryService.fetchBoqList(this.project_id).subscribe(
      res=>{
        // this.boq_list = res['floorplans'];
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

  floorplan_list:any = [];
  fetchFloorplan(){
    this.loaderService.display(true);
    this.categoryService.fetchFloorplan(this.project_id).subscribe(
      res=>{
        this.floorplan_list = res['floorplans'];
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

  confirmAndApproveQuote(boqId,quoteType){
    this.loaderService.display(true);
    this.quotationService.confirmAndApproveQuote(this.project_id,boqId,quoteType).subscribe(
      res=>{
         alert(res.message);
         this.getApproveBoqList(this.project_id);
         this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

  // Custom element approval and rejection starts
  setDocId(doc_Id,formType){
    this.doc_Id = doc_Id;
    this.formType=formType;
  }

  closeModals(){
    (<any>$('#rejectModal')).modal('hide');
    (<any>$('#approveModal')).modal('hide');
    this.priceErroralert= false;
    this.priceForm.reset();
    this.rejectForm.reset();
  }

  onSubmit(){
    var form:any;
    if(this.formType==="approved"){
      form = this.priceForm;
    }else {
      form = this.rejectForm;
    }
    if((form.controls['price'].value != null && form.controls['price'].value != '')
     || this.formType === 'rejected'){
      this.loaderService.display(true);
      form.controls['status'].patchValue(this.formType);
      this.categoryService.addCustomPrice(form.value,this.doc_Id,this.project_id).subscribe(
        res=>{
          form.reset();
          this.categoryService.getCustomElements(this.project_id).subscribe(
            res=>{
              this.customList = res['custom_elements'];
             },
            err=>{
              
            });
          
          this.successalert = true;
          this.closeModals();
          if(this.formType==="approved"){
            this.successMessage = "Approved successfully";
          }else {
            this.successMessage = "Rejected successfully";
          }
          setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
          this.loaderService.display(false);
        },
        err=>{
         
        });
      }else {
        this.priceErroralert = true;
      }
  }


}
