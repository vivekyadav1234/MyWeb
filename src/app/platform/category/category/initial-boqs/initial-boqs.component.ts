import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import {QuotationService} from '../../../quotation/quotation.service';
declare var $:any;
@Component({
  selector: 'initial-boqs',
  templateUrl: './initial-boqs.component.html',
  styleUrls: ['./initial-boqs.component.css','../tasks/tasks.component.css'],
  providers: [CategoryService,QuotationService]
})
export class InitialBoqsComponent implements OnInit {
  project_list;
  boq_list;
  headers_res;
  per_page;
  total_page;
  current_page;
  erroralert:boolean=false;
  errorMessage:string;

  constructor(private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService) { }

  ngOnInit() {
    this.getProjectList(1);
  }

  getQuotationListByStatus(id){
    this.loaderService.display(true);
      this.categoryService.getBoqListForTasksTab('initial_design',id).subscribe(
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
  	this.categoryService.getProjectListForTasksTab("initial_design",page).subscribe(
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
  		});
  }

  selected_boq_details:any;
  openBoq(projectid,boq_id){
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
    $('#boqModal').modal('show');
    $('#boqModal').css({'overflow-y':'auto'});
  }
  searchCategoryProjects(searchparam){
    this.loaderService.display(true);
    if(searchparam != ""){
      this.categoryService.searchCategoryProjects('initial_design',searchparam).subscribe(
        res=>{
          res= res.json();
          this.project_list = res.projects;
           this.loaderService.display(false);
           
        },
        err=>{
          
           this.loaderService.display(false);
        });
    }else {
      this.getProjectList(1);
    }
  }

}
