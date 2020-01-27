import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuotationService } from '../../../quotation/quotation.service';
declare var $:any;

@Component({
  selector: 'app-cad-approvals',
  templateUrl: './cad-approvals.component.html',
  styleUrls: ['./cad-approvals.component.css','../tasks/tasks.component.css'],
  providers:[CategoryService, QuotationService]
})
export class CadApprovalsComponent implements OnInit {
	project_list;
  boq_list;
  headers_res;
  per_page;
  total_page;
  current_page;
  selectedProjectIndex;
  selectedProject;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  approvalForm:FormGroup;
  // priceForm: FormGroup;
  project_id;

  constructor(
  	private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService,
    private formBuilder:FormBuilder,
  ) {
  	this.approvalForm = this.formBuilder.group({
      status : new FormControl("",Validators.required),
      approval_comment : new FormControl("",Validators.required)
    })
  }

  ngOnInit() {
  	this.getProjectList(1);
  }

  ngAfterViewInit(){
    $(".boq_div_"+this.boq_id).css("color", "#b31036");
  }

  approveProject(index){
    this.boq_list = this.project_list[index].boq_list;
  }

  getProjectList(page?){
    this.loaderService.display(true);
  	this.categoryService.getCadApprovalProjectList(page).subscribe(
  		res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();

        this.project_list = res.quotations;
        
        this.loaderService.display(false);
  		},
  		err=>{
  			
         this.loaderService.display(false);
  		});
  }

  getProjectDetails(q_id,proj_id,cad_files){

    this.cad_files_list = cad_files;
    $(".new-"+q_id).html("");
    this.categoryService.updateCASeen(proj_id,q_id).subscribe(
      res=>{
        
       },
      err=>{
        
      });
  }

  boq_id:any;
  cad_files_list: any = [];
  getCADFiles(boq_id){
  	this.boq_id=boq_id;
  	$(".boq_div").css("color", "#000");
    this.categoryService.getCADFiles(this.project_id,boq_id).subscribe(
      res=>{
        // 
        this.cad_files_list = JSON.parse(res['_body'])['cad_uploads'];
        $(".boq_div_"+this.boq_id).css("color", "#b31036");
       },
      err=>{
        
      });
  }

  //To toggle row for displaying boqs
  toggleRow(row,i) {
    row.expanded = ! row.expanded;
	  // this.selectedBOQIndex = -1;
	  // this.selectedLineItemIndex=-1;
	  // this.selectedSublineItemIndex = -1;
	  // this.selectedBOQ={};
	  // this.selectedLineItem={};
	  // this.selectedSublineItem={};
	  // this.showBOQList(i);
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

  selectedSet:any = "loose"
  getSet(type){
    this.selectedSet = type;
  }

  resetForm(){
    this.approvalForm.reset();
  }

  tagging_file_id:any;
  tagging_proj_id:any;
  tagging_quote_id:any;
  tagging_status:any;
  initApproval(quote_id, proj_id,file_id, status){
  	this.tagging_file_id = file_id;
    this.tagging_proj_id = proj_id;
    this.tagging_quote_id = quote_id;
  	this.approvalForm.controls['status'].setValue(status);
  	if(status == "approved"){
      this.tagging_status = "Approved";
  		this.approvalSubmit();
  	}
  	else if(status == "rejected"){
  		$("#approvalModal").modal("show");
      this.tagging_status = "Rejected";
  	}
  }

  approvalSubmit(){
	  this.quotationService.approvalSubmit(this.tagging_proj_id,this.tagging_quote_id, this.tagging_file_id, this.approvalForm.value).subscribe(
	    res => {
	      // this.getCADFiles(this.tagging_quote_id);
        $('.btn-'+this.tagging_file_id).html("");
        $('.status-'+this.tagging_file_id).html(this.tagging_status);
        this.approvalForm.reset();
	      $("#approvalModal").modal("hide");
        if(this.tagging_status == "Approved"){
          alert("CAD file is approved successfully");
        }
        else{
          alert("CAD file is rejected successfully");
        }
	      
	    }, 
	    err => {
	      
	      this.loaderService.display(false);
	      alert("Something went wrong");
	  });
	}

	searchCategoryProjects(searchparam){
		this.loaderService.display(true);
		if(searchparam != ""){
			this.categoryService.searchCategoryProjects('cad_approvals',searchparam).subscribe(
				res=>{
					res= res.json();
					this.project_list = res.quotations;
					 this.loaderService.display(false);
           
				},
				err=>{
					
					 this.loaderService.display(false);
				});
		}else {
			this.getProjectList(1);
		}
	}

  convertToAbs(number){
    return Math.abs(number);
  }

}
