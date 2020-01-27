import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'final-boq-approvals',
  templateUrl: './final-boq-approvals.component.html',
  styleUrls: ['./final-boq-approvals.component.css','../tasks/tasks.component.css'],
  providers:[CategoryService]
})
export class FinalBoqApprovalsComponent implements OnInit {
  project_list;
  boq_list;
  headers_res;
  per_page;
  total_page;
  current_page;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(private loaderService : LoaderService,
    private categoryService:CategoryService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getProjectList(1);
  }

  approveBOQs(index){
    this.boq_list = this.project_list[index].boq_list;
  }

  getQuotationListByStatus(id){
    this.loaderService.display(true);
      this.categoryService.getBoqListForTasksTab('final_design',id).subscribe(
      res => {
        this.loaderService.display(false);
        res = res.json();
        
        this.boq_list = res.proposal_docs;
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  getProjectList(page?){
    this.loaderService.display(true);
  	this.categoryService.getProjectListForTasksTab("final_design",page).subscribe(
  		res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        
        this.project_list = res.proposal_docs;
        this.loaderService.display(false);
  		},
  		err=>{
  			
         this.loaderService.display(false);
  		});
  }

  boqApproval(boq_id, status,projectid){
    this.loaderService.display(true);
    this.categoryService.boqApproval(projectid,boq_id,status).subscribe(
      res => {
        
        this.getProjectList(1);
        // this.getQuotationListByStatus(projectid);
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
        if(this.invoicemodal_data){
          this.closeInvoiceModal();
        }
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
  
  selected_boq_details:any;
  invoicemodal_data;
  openBoq(projectid,boq_id,obj){
    this.invoicemodal_data = obj;
    $(".InvoiceModal").on("contextmenu",function(e){
        return false;
    });
    this.loaderService.display(true);
    this.categoryService.getQuotation(projectid,boq_id).subscribe(
      res=>{
        this.selected_boq_details = res;
        
        
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

    });
    $('#InvoiceModal').modal('show');
    $('#boqModal').modal('hide');
    $('#InvoiceModal').css({'overflow-y':'auto'});
  }

  closeInvoiceModal(){
    this.invoicemodal_data =undefined;
    $('#InvoiceModal').modal('hide');
    // $('#boqModal').modal('show');
    // $('#boqModal').css({'overflow-y':'auto'});
  }

  searchCategoryProjects(searchparam){
    this.loaderService.display(true);
    if(searchparam != ""){
    this.categoryService.searchCategoryProjects('final_design',searchparam).subscribe(
      res=>{
        res= res.json();
        this.project_list = res.proposal_docs;
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

  update_seen(obj_id,project_id,quote_id){
    $(".new-"+obj_id).html("");
    this.categoryService.updateFBASeen(project_id,quote_id).subscribe(
      res=>{
        res= res.json();
        this.project_list = res.projects;
         this.loaderService.display(false);
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }
}
