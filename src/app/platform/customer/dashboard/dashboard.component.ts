import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import  { CustomerService} from '../customer.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
import { LoaderService } from '../../../services/loader.service';
import {LeadService} from '../../lead/lead.service';
import { FormBuilder, FormGroup, Validators } from '../../../../../node_modules/@angular/forms';

declare var $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ProjectService, UserDetailsService,CustomerService, LeadService]
})

export class DashboardComponent implements OnInit{

	observableProjects: Observable<Project[]>
 	projects: Project[];
  roleFlag:boolean;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  projectList:any;

  selected_project:any;
  selected_boq:any;

  progress_bar:any = '0%';

  book_order_class:any = "active";
  finalize_design_class:any = "";
  prod_kickoff_class:any = "";
  last_mile_class:any = "";
  approvalForm:FormGroup;


  constructor(
    private userDetailsService:UserDetailsService,
    private router: Router,
    private projectService:ProjectService,
    private loaderService : LoaderService,
    private leadService : LeadService,
    private customerService : CustomerService,
    private formBuilder: FormBuilder
  ) {
  this.approvalForm = formBuilder.group({
        'remark' : ['']
      });
  }

  ngOnChanges(): void {
    // this.getProjectListFromService();
  }

  ngOnInit(): void{
    // this.getProjectListFromService();
    this.getAllProjectList();
    if(localStorage.getItem('user')!== 'customer')
      this.roleFlag=false;
    else
      this.roleFlag = true;
    // this.loaderService.display(false);
    $('[data-toggle="tooltip"]').tooltip();
  }

  stageActivate(event,quote_id){
    this.loaderService.display(true);
    this.selected_boq = quote_id;
    if(event.target.value == "book_order"){
      $(".hide_div").hide();
      $(".book_order_"+quote_id).toggle();
      this.getBookOrderDetails();
    }
    else if(event.target.value == "finalize_design"){
     
      $(".hide_div").hide();
      $(".finalize_design_"+quote_id).toggle();
      this.getFinalizeDesignDetails();
    }
    else if(event.target.value == "prod_kickoff"){
      $(".hide_div").hide();
      $(".prod_kickoff_"+quote_id).toggle();
    }
    else if(event.target.value == "last_mile"){
      $(".hide_div").hide();
      $(".last_mile_"+quote_id).toggle();
    }
  }

  book_order_details:any
  selected_ppt:any = [];
  selected_uploaded_ppt:any =[];
  boq_percent_type:any;
  getBookOrderDetails(){
    this.projectService.bookOrderDetails(this.selected_boq).subscribe(
        book_order_details => {
          this.loaderService.display(false);
          this.book_order_details = book_order_details.data;
          
          this.selected_ppt = book_order_details.data.attributes.proposed_ppts;
          this.selected_uploaded_ppt = book_order_details.data.attributes.proposed_uploaded_ppts;
          this.boq_percent_type = "10_percent";
        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(error['_body']).message;
          setTimeout(function() {
              this.erroralert = false;
            }.bind(this), 2000);
        }
    );
  }
   
  finalize_design_details:any
  getFinalizeDesignDetails(){
    this.projectService.getFinalizeDesignDetails(this.selected_boq).subscribe(
        finalize_design_details => {
          
          this.loaderService.display(false);
          this.finalize_design_details = finalize_design_details.data[0];
          this.selected_ppt = finalize_design_details.data[0].attributes.proposed_ppts;
          this.selected_uploaded_ppt = finalize_design_details.data[0].attributes.proposed_uploaded_ppts;
          this.boq_percent_type = "40_percent"
          
          
          

        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(error['_body']).message;
          setTimeout(function() {
              this.erroralert = false;
            }.bind(this), 2000);
        }
    );
  }


  getAllProjectList(){
    this.loaderService.display(true);
    this.customerService.getAllProjetcList().subscribe(
      res=>{
        this.projectList = res;
        this.selected_project = this.projectList[0].id;
        this.setActiveProject(this.selected_project);
        
    },
    err=>{
      
      this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

    });

  }

  client_quotation:any = [];
  getAllBoqList(projectId){
    this.loaderService.display(true);
    this.customerService.getAllBoqList(projectId).subscribe(
      res=>{
        this.client_quotation = res;
        
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      })
  }

  selected_boq_details:any;
  delivery_tnc;
  display_boq_label;
  openBoq(boq_id){
    $(".InvoiceModal").on("contextmenu",function(e){
        return false;
    });
    this.display_boq_label = "true" ?  false : false
    this.loaderService.display(true);
    this.projectService.getQuotation(this.selected_project, boq_id,this.display_boq_label).subscribe(
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

      })
  }

  assignProgress(finalize_design_present,production_kickoff,last_mile){
    if(last_mile){
      this.progress_bar = "100%"
      this.last_mile_class = "active"
    }
    else if(production_kickoff){
      this.progress_bar = "65%"
      this.prod_kickoff_class = "active"
    }
    else if(finalize_design_present){
      this.progress_bar = "30%"
      this.finalize_design_class = "active"
    }
    else{
      this.progress_bar = "0%"
    }

    return this.progress_bar
  }

  book_order_progress_bar:any = "0%"
  assignSubProgress(is_approved,payment_done){
    if(payment_done){
      this.book_order_progress_bar = "100%"
    }
    else if(is_approved){
      this.book_order_progress_bar = "65%"
    }

    else{
      this.book_order_progress_bar = "0%"
    }

    return this.book_order_progress_bar
  }

  finalize_design_progress_bar:any = "30%"
  assignFinalProgress(ppt_present,final_ppt_present,payment_done){
    if(payment_done){
      this.finalize_design_progress_bar = "100%"
    }
    else if(ppt_present){
      this.finalize_design_progress_bar = "65%"
    }else if(final_ppt_present){
       this.finalize_design_progress_bar = "65%"
    }

    else{
      this.finalize_design_progress_bar = "30%"
    }

    return this.finalize_design_progress_bar
  }

  stageActiveTab(status){
    var activeStage = ""
    if(status){
      activeStage = "active"
    }
    else{
      activeStage = ""
    }
    return activeStage
  }

  ActivateTab(type,id){
    var activeStage = ""
    if(type == "project"){
      if(this.selected_project == id){
        activeStage = "active"
      }
      else{
        activeStage = ""
      }
    }
    else if(type == "boq"){
      if(this.selected_boq == id){
        activeStage = "active"
      }
      else{
        activeStage = ""
      }
    }
    return activeStage
  }

  setActiveProject(project_id){
    this.loaderService.display(true);
    this.selected_project = project_id
    this.getAllBoqList(this.selected_project);
  }

  approveBoq(boq_id){
    this.loaderService.display(true);
     var obj = {
       "proposal_doc_id" : boq_id, 
       "is_approved" : true
     }
    this.customerService.boqApproval(obj).subscribe(
      res=>{
        // this.selected_boq_details = res;
        this.successalert = true;
        this.loaderService.display(false);
        $('.modal').modal('hide');
        this.successMessage = 'BOQ Approved successfully!';
        setTimeout(function() {
             this.successalert = false;
        }.bind(this), 5000);
        this.getAllProjectList();
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      })
  }

  rejectBoq(){
    this.loaderService.display(true);
    var obj = {
       "proposal_doc_id" : this.selected_boq_details.proposal_doc_id, 
       "is_approved" : false,
       "customer_remark":this.approvalForm.controls['remark'].value
     }
     // $('#rejectBOQModal').hide();
    this.customerService.boqApproval(obj).subscribe(
      res=>{
        // this.selected_boq_details = res;
        this.loaderService.display(false);
        $('.modal').modal('hide');
        alert('BOQ Rejected successfully!');
        this.successMessage = 'BOQ Rejected successfully!';
        setTimeout(function() {
             this.successalert = false;
        }.bind(this), 5000);
        this.getAllProjectList();
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      })
  }

  cancelBoq(){
    $('#approvalModal').modal('hide');
    
  }
  removeRightClick(){
    $(".pptModal").on("contextmenu",function(e){
        return false;
    });
    $("#approvalModal").on("contextmenu",function(e){
        return false;
    });

  }
  selectedSet = 'created_ppt';
  getSet(state){
    this.selectedSet = state;


  }

   removeSet(){
     this.selectedSet = 'created_ppt';


   }
   resetForm(){
     
   }
   serial_num;
  test(i:number){
    this.serial_num = i +1;
     

  }



}
