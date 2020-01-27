import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActivityLogsService } from '../activity-logs.service';
import { environment } from 'environments/environment';
import {Location} from '@angular/common';
import { LeadService } from '../../lead/lead.service';
import { LoaderService } from '../../../services/loader.service';
import { DesignerService } from '../../designer/designer.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';



declare let $: any;

@Component({
  selector: 'app-viewlogs',
  templateUrl: './viewlogs.component.html',
  styleUrls: ['./viewlogs.component.css'],
  providers: [ActivityLogsService, LeadService,LoaderService,DesignerService]
})
export class ViewlogsComponent implements OnInit {

  public lead_id:any
  public lead_logs:any
  public filtered_logs:any = []
  public log_owners:any = []
  public role:string;
  lead_status;
  pageSource;
  public project_details:any
  lead_details:any;
  project_id;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;
  smsList = [];
  smsDetails: any = {};
  customerDetails: any;
  contact_number_for_sms;
  mom_events:any= [];
  mom:FormGroup;
  current_eventid: any;
  view_mom: any;


  constructor(
    public activatedRoute: ActivatedRoute,
    public activityLogsService : ActivityLogsService,
    private _location: Location,
    private route:ActivatedRoute,
    public leadService : LeadService,
    private designerService: DesignerService,
    public loaderService : LoaderService,
  ) { }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params['leadId'];
    });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
      });
    this.role = localStorage.getItem('user');

    this.mom = new FormGroup({
      emails: new FormArray([],Validators.required),
    });

    this.fetchBasicDetails();

    this.activityLogsService.getLeadLogs(this.lead_id).subscribe(
      res => {
        Object.keys(res).map((key)=>{ this.lead_logs= res[key];})
        this.filtered_logs = this.lead_logs.change_log;
        var temp_email = []
        for (let log of this.lead_logs.change_log){
          if(log.whodunnit !== "" && log.whodunnit !== null){
            if(!temp_email.includes(log.whodunnit)){
              var json = {
                "name": log.name,
                "email": log.whodunnit,
                "image": log.user_image,
              }
              this.log_owners.push(json);
              temp_email.push(log.whodunnit)
            }
            
          } 
        }
      },
      err => {
        
      }
    );
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
      },
      err => {
        
      }
    );
  }

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }

  filterLogs(e,filter = "all"){
    var arr = [];
    $(".dropdownButton1").html('<img src="'+e.srcElement.childNodes[1].currentSrc+'" class="img-fluid myFluit mr-2" style = "border-radius: 50px;width: 1.5rem;box-shadow: 0 0 0px 2px #ccc;"><span>'+e.srcElement.childNodes[2].nodeValue+'</span>');
    if(filter == "all"){
      this.filtered_logs = this.lead_logs.change_log;
    }
    else{
      for (let log of this.lead_logs.change_log){
        if(log.whodunnit == filter){
          arr.push(log)
        }
      }
      this.filtered_logs = arr;

    }
  }

  sortLogs(e,filter){
    var arr = [];
    if(filter == "oldest"){
      $(".dropdownButton2").html('Oldest First');
      this.filtered_logs = this.lead_logs.change_log;
    }
    else if(filter == "newest"){
      $(".dropdownButton2").html('Newest First');
      this.filtered_logs = this.lead_logs.change_log.reverse();
    }
  }

  direction: number;
  isDesc: boolean = true;
  column: string = 'CategoryName';
  // Change sort function to this: 
  sort(property, sort){
    if(sort == "oldest"){
      $(".dropdownButton2").html('Oldest First');
      this.isDesc = true; //change the direction
    }
    else if(sort == "newest"){
      $(".dropdownButton2").html('Newest First');
      this.isDesc = false; //change the direction
    }
    this.column = property;
    this.direction = this.isDesc ? 1 : -1; 
  }

      directionlog: number;
    isDesclog: boolean = true;
    columnlog: string = 'CategoryName';
  // Change sort function to this: 
  sortlog(property, sort){
    if(sort == "oldest"){
      $(".dropdownButton2").html('Oldest First');
      this.isDesclog = true; //change the direction
    }
    else if(sort == "newest"){
      $(".dropdownButton2").html('Newest First');
      this.isDesclog = false; //change the direction
    }
    this.columnlog = property;
    this.directionlog = this.isDesclog ? 1 : -1; 
  }
  callResponse: any;
  callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLeadWithAlternateNumber(localStorage.getItem('userId'),contact).subscribe(
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
            $('#alternateNumberModal').modal('hide');
          }
        },
        err => {
          this.loaderService.display(false);
          
        }
     );
  }
  sendSmsToLead(){
    this.smsDetails['message'] = $("#sms_send").val();
    this.leadService.sendSmsToLead(this.smsDetails,this.project_id,this.contact_number_for_sms).subscribe(
      res=>{
        
        $('#SmsModal').modal('hide');
        this.successalert = true;
        this.successMessage = 'Message sent  successfully!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
          this.contact_number_for_sms = undefined;
          $("#sms_send").val('');
          $('#alternateNumberModal').modal('hide');
      },
      err=>{
        

      })

  }

  getSmsHistory(){
    this.leadService.getSmsHistory(this.project_id).subscribe(
      res=>{
        
        this.smsList = res;

      },
      err=>{
        

      });

  }
  getSmsHis(){
    this.getSmsHistory();

  }

  getCustomerDetails(){
    this.leadService.getCustomerCallDetails(this.lead_id).subscribe(
      res => {
        this.customerDetails = res['lead'].contacts;
      },
      err => {
        
      }
    );
  }

  //to get all events
  getMOMevents(){
    this.loaderService.display(true);
    this.activityLogsService.getMOMevents(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.mom_events = res.events;
        
      },
      err => {
        
      }
    );
  }

  closeMOM(){
    $('#mom-modal').modal('hide');
  }

  OnEmailSelect(event){
    var val = event.target.value
    
    // this.mom.controls['emails'].setValue(val);
    (<FormArray>this.mom.controls['emails']).push(new FormControl(event.target.value));
  }
  user_list;
  share(event){
    this.current_eventid = event.id;
    this.user_list = event.users;
  }

  //To share ,MOM
  momShare(){
    this.activityLogsService.momShare(this.mom.value,this.current_eventid).subscribe(
      event => {
       setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
        this.successalert = true;
        this.successMessage = "MOM successfully shared";
        this.loaderService.display(false);
        setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
      },
      error => {
        this.erroralert = true;
        this.errorMessage = "MOM not shared";
        this.loaderService.display(false);
        setTimeout(function() {
            this.erroralert = false;
         }.bind(this), 2000);
      }
    );
    $('#share-mom').modal('hide');
    $('#mom-modal').modal('hide');
  }

  //To delete MOM
  deleteMOM(eventid){
    this.activityLogsService.deleteMOM(eventid).subscribe(
      event => {
       setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
        this.successalert = true;
        this.successMessage = "MOM successfully deleted";
        this.loaderService.display(false);
        setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
      },
      error => {
        this.erroralert = true;
        this.errorMessage = "MOM not deleted";
        this.loaderService.display(false);
        setTimeout(function() {
            this.erroralert = false;
         }.bind(this), 2000);
      }
    );
    $('#mom-modal').modal('hide');
  }

  //To View MOM
  momView(eventid){
    this.activityLogsService.momView(eventid).subscribe(
      res => {
        this.view_mom = res;
       setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
        this.loaderService.display(false);
        setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
      },
      error => {
        this.erroralert = true;
        this.loaderService.display(false);
        setTimeout(function() {
            this.erroralert = false;
         }.bind(this), 2000);
      }
    );
  }

  //to close view mom
  closeViewMoM(){
    $("#view-mom").modal("hide");
  }

}
