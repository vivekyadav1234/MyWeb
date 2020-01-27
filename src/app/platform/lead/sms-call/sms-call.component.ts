import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { DesignerService } from '../../designer/designer.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { ActivityLogsService } from '../../activity-logs/activity-logs.service';
declare var $:any;

@Component({
  selector: 'app-sms-call',
  templateUrl: './sms-call.component.html',
  styleUrls: ['./sms-call.component.css'],
  providers: [LeadService,DesignerService,ActivityLogsService]
})
export class SmsCallComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  pid : number;
  pname;
  project_id;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;
  smsDetails: any = {};
  smsList:any;
  customerDetails: any;
  contact_number_for_sms;
  mom_events:any= [];
  mom:FormGroup;
  current_eventid: any;
  view_mom: any;

  constructor(

    private activatedRoute: ActivatedRoute,
    private router:Router,
    public leadService : LeadService,    
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    public loaderService : LoaderService,
    private designerService: DesignerService,
    public activityLogsService:ActivityLogsService



    ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
    });

    this.mom = new FormGroup({
      emails: new FormArray([],Validators.required),
    });

    this.fetchBasicDetails();
    
  }

  fetchBasicDetails(){
      this.leadService.getLeadLogs(this.lead_id).subscribe(
        res => {
          
          this.lead_details = res['lead'];
          this.project_id = res['lead'].project_details.id;
          this.pname = res['lead'].project_details.name;
          

          
          //this.getSections();
        },
        err => {
        }
      );
  }

  callResponse: any;
    callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLead(localStorage.getItem('userId'),contact).subscribe(
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
        $('#alternateNumberModal').modal('hide');
        this.successalert = true;
        this.successMessage = 'Message sent  successfully!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
        this.contact_number_for_sms = undefined;
        $("#sms_send").val('');
      },
      err=>{
        

      })

  }

  getSmsHistory(){
    this.loaderService.display(true);
    this.leadService.getSmsHistory(this.project_id).subscribe(
      res=>{
        
        this.smsList = res;
        this.loaderService.display(false);

      },
      err=>{
        
        this.loaderService.display(false);

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
