import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $:any;

@Component({
  selector: 'app-cm-wip',
  templateUrl: './cm-wip.component.html',
  styleUrls: ['./cm-wip.component.css'],
  providers: [CommunitymanagerService,SchedulerService,DesignerService,LeadService]
})
export class CmWipComponent implements OnInit {
  CMId : string;
  usersList;
    userData ;
  assignedDesignerId = [];
  projecttask_name = [];
  projecttask_id = [];
  projecttask_duration = [];
  projecttask_action_point = [];
  projecttask_process_owner = [];
  projecttask_percent_completion = [];
  projecttask_previous_dependency = [];
  projecttask_remarks =[];
  projecttask_start_date  = [];
  projecttask_end_date = [];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  errorMessagemodal : string;
  erroralertmodal = false;
  successalertmodal = false;
  successMessagemodal : string;
  updateProjectTaksForm: FormGroup;
  startDateForGanttChart : Date;
  endDateForGanttChart : Date;
  updateLeadquestionnaireForm : FormGroup;
  designerBookingForm1: FormGroup;
  project:any;
  lead_status;
  designersList;
  statusDetails: any = {};
  wipList:any = [];

  custom_status:string;
  headers_res;
  per_page;
  total_page;
  current_page;
  search_value: any;
  current_user_id: any;
   
  constructor(
    private loaderService : LoaderService,
    private cmService : CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder:FormBuilder,
    private schedulerService : SchedulerService,
    private designerService:DesignerService,
    private route:ActivatedRoute
  ) { 
      this.CMId = localStorage.getItem('userId');
    }


  onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    var  i=0;
    if(true){
      this.getWipList('',this.search_value);
      i++;
    }

  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.custom_status = params['customer_status'];
        
      });
    this.route.queryParams.subscribe(params => {
        this.designer_id = params['designer_id'];
     });
    this.getWipList(1,'');
    this.loaderService.display(true);
    this.current_user_id  = localStorage.getItem('userId');
  }
  direction: number;
  isDesc: boolean = true;
  column: string;
  // Change sort function to this: 
  sort(property){
      this.isDesc = !this.isDesc; //change the direction    
      this.column = property;
      this.direction = this.isDesc ? 1 : -1; 
  }    
  page_number;
  getWipList(page?,search?){
    this.page_number = page;
    this.loaderService.display(true);
    this.cmService.getWipList(this.CMId,this.custom_status, this.designer_id, page,search).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        // this.usersList = res.leads;
        this.wipList = res.leads;
       
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }


  onCallbackChange2(){
      this.loaderService.display(true);
      $("#statusModal2").modal("hide");
      this.statusDetails['remarks']= $("#inactive_remarks").val();
      this.statusDetails['reason_for_lost']=$("#inactive_reason").val();
      this.dropdownDropType='Select Reason';
      this.updateNewStatus();
  }  

  callResponse: any;
  callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLead(localStorage.getItem('userId'), contact).subscribe(
        res => {
           this.loaderService.display(false);
          if(res.inhouse_call.call_response.code == '403'){
            this.erroralert = true;
            this.errorMessage = JSON.parse(res.message.body).RestException.Message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 10000);
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse =  JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage = 'Calling from - '+this.callResponse.Call.From;
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 10000);
          }
        },
        err => {
          this.loaderService.display(false);
        }
     );
  }

  onStatusChange(projectId,customerId, status){
    this.statusDetails["customer_status"] = status;
    // this.statusDetails["customer_remarks"] = "";
    // this.statusDetails["customer_meeting_time"] = "";
    this.statusDetails["customer_id"] = customerId;
    this.statusDetails["project_id"] = projectId;

    this.loaderService.display(true);

    if(this.statusDetails["customer_status"] == "on_hold"){
      $("#followup-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
      this.loaderService.display(false);
      $("#statusModal").modal("show");
    }
    else if(this.statusDetails["customer_status"] == "inactive"){
        
        this.loaderService.display(false);
        $("#statusModal2").modal("show");
      }
      
    else{
      this.updateNewStatus();
    }
  }

  onSubStatusChange(projectId,customerId, substatus){
    this.statusDetails["sub_status"] = substatus;
    // this.statusDetails["customer_remarks"] = "";
    // this.statusDetails["customer_meeting_time"] = "";
    this.statusDetails["customer_id"] = customerId;
    this.statusDetails["project_id"] = projectId;
    this.loaderService.display(true);
    
    this.designerService.subStatusUpdate(this.statusDetails,this.CMId).subscribe(
      res => {

        this.getWipList(1);
        this.successalert = true;
        this.successMessage = 'Status updated successfully!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
          
      },
      err => {

        this.erroralert = true;
        this.loaderService.display(false);
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 2000);

      }
    )

  }

  isProjectInWipAndActive(status):boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation"]
    if(wip_array.includes(status)){
      return true
    }
    else{
      return false
    }
  }

  onCallbackChange(){
    this.loaderService.display(true);
    $("#statusModal").modal("hide");
    this.statusDetails["customer_meeting_time"] = $("#followup-details").val();
    this.statusDetails['remarks']= $("#followup_remarks").val();
    this.updateNewStatus();
  }

  updateNewStatus(){
    this.designerService.statusUpdate(this.statusDetails,this.CMId).subscribe(
      res => {

        this.getWipList(1);
        this.successalert = true;
        this.successMessage = 'Status updated successfully!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
          
      },
      err => {

        this.erroralert = true;
        this.loaderService.display(false);
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 2000);

      }
    )
  }


  openpopup(event,id){
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });
   
    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    }) 
  }

  
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
  
  ngAfterViewInit(){

    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })
  }

  to_date;
  from_date;
  filtercol1Val : any = 'all';
  filterColumDropdownChange(colVal) {
    // this.from_date = undefined;
    // this.to_date = undefined;
    this.filtercol1Val = colVal;
    if(colVal == 'all'){
      this.designer_id = ""
      this.from_date = "";
      this.to_date = "";
      document.getElementById('fromDateFilter').classList.add('d-none');
      document.getElementById('toDateFilter').classList.add('d-none');
      document.getElementById('designer_list').setAttribute('style','display:none');
    } 
    else if(colVal == 'list_designer') {
       
      this.myDesigners();
      document.getElementById('fromDateFilter').classList.add('d-none');
      document.getElementById('toDateFilter').classList.add('d-none');
      document.getElementById('designer_list').setAttribute('style','display:inline-block');
    }
  }

  my_designers;
  designer_id;
  myDesigners(){
    this.loaderService.display(true);
    this.cmService.getListOfDesigner(this.current_user_id).subscribe(
      res => {
        this.my_designers = res.users;
        this.designer_id = this.my_designers[0]["id"];
        
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  onDesignerFilterSelect($event){
    this.designer_id = $event.target.value
  }

  filterSubmit(){
    if(this.filtercol1Val == 'all'){
        this.getWipList(1);
    }
    else{
      this.getWipList(this.page_number);
    }
  } 
  dropdownDropType;
    submitDropLeadType(type){
      this.dropdownDropType=type;
      //this.dropLeadForm.controls['drop_reason'].setValue(this.dropdownDropType);
    }

}
