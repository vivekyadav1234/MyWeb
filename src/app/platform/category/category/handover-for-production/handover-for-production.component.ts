import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import {QuotationService} from '../../../quotation/quotation.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../../lead/lead.service';

declare let $: any;

@Component({
  selector: 'app-handover-for-production',
  templateUrl: './handover-for-production.component.html',
  styleUrls: ['./handover-for-production.component.css'],
  providers: [CategoryService,QuotationService,LeadService]
})
export class HandoverForProductionComponent implements OnInit {
  project_list;
  boq_list;
  headers_res;
  per_page;
  total_page;
  current_page;
  erroralert:boolean=false;
  errorMessage:string;
  request: FormGroup;
  lead_id:any;
  successalert = false;
  successMessage : string;
  lead_details:any;
  project_id:any;

  constructor(
    private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService,
    public leadService : LeadService,
    ) { }

  ngOnInit() {


    this.getProjectList();

    //request form
    this.request = new FormGroup({
      remark_description: new FormControl("",Validators.required),
    });
  }
  selectSection;
  slectBtn(section){
  	this.selectSection = section;
  	 

  }

  page_number;

  //to get projects_for_handover
  getProjectList(page?,search?){
    this.page_number = page;
    this.loaderService.display(true);
    this.categoryService.getProjectList(page,search).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
         
        res= res.json();
        this.project_list = res.projects;
        
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  //for collapsable row table
  toggleRow(row,i) {
    this.project_id = row.id;
    this.categoryService.newFalse(this.project_id).subscribe(
      res=>{
        res= res;
        this.loaderService.display(false);

        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        
        this.erroralert = true;
        this.loaderService.display(false);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
    this.project_list.forEach(project => {
      if(row.id !== project.id){
        project['expanded'] = false;
      }else {
        row.expanded = !row.expanded;
      }
    });
  }

  //to get lead ID and project_id
  leadID(lead_id,project_id){
    this.lead_id = lead_id;
    this.project_id = project_id
    
    
  }

  //to generate request
  sendRequest(){
    this.loaderService.display(true);
    this.categoryService.sendRequest(this.request.value,this.project_id).subscribe(
      res=>{
        res= res;
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Request successfully send";
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
        this.getProjectList();
      },
      err=>{
        
        this.erroralert = true;
        this.errorMessage = "Request not send";
        this.loaderService.display(false);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
    this.request.reset();
    $('#requestModal').modal('hide');
  }


  searchCategoryProjects(searchparam){
    this.loaderService.display(true);
     
    if(searchparam != ""){
      this.getProjectList(1,searchparam);

      
    }else {
      this.getProjectList(1);
    }
  }
}
