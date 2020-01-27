import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray  } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { CalenderService } from '../../calender/calender.service';
import { environment } from 'environments/environment';
declare var $:any;

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
  providers: [LeadService, LoaderService, CalenderService,DesignerService]
})
export class CalenderComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  meetingform: FormGroup;
  mom:FormGroup;
  updatemeetingform: FormGroup;
  statusChangeForm: FormGroup;
  markDoneform: FormGroup;
  loc:any;
  todayDate = new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19);
  public latestevent:any
  public leads:any = []
  public projectUsers:any
  public events:any = []
  public currentuser:any = localStorage.getItem("userId");
  public calElem:any = $('#calendar')
  public currentEvent:any
  errorMessage : string;
  checkStatus:any;
  erroralert = false;
  successalert = false;
  successMessage : string;
  initLoader:any = true;
  lead_status;
  statusDetails: any = {};
  designerId;
  eventId:any;
  Emails=  [];
  calEvent:any;
  view_mom:any;
  mom_status:any;
  is_manualevent:any;


  // Date
  date = new Date();
  y = this.date.getFullYear();
  m = this.date.getMonth();
  from_date:any = new Date(this.y, this.m, 1);
  to_date:any = new Date(this.y, this.m + 1, 0);
  status: any;

  constructor(
    public route: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public calenderService : CalenderService,
    private designerService : DesignerService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.designerId = localStorage.getItem('userId');
    this.statusChangeForm = new FormGroup({
        reson_for_lost: new FormControl("",Validators.required),
        lost_remarks:new FormControl("")
      });
    this.mom = new FormGroup({
      mom_description: new FormControl("",Validators.required),
      emails: new FormArray([],Validators.required),
    });
    this.role = localStorage.getItem('user');

    this.fetchBasicDetails();
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        var ownerableId;
        var ownerableType;
        if(this.role == "designer"){
          ownerableId = this.lead_details.project_details.id;
          ownerableType = "Project"
        }
        else if(this.role == "community_manager" || this.role== "city_gm" || this.role=="business_head" || this.role=="design_manager"){
          ownerableId = this.lead_details.project_details.id;
          ownerableType = "Project"
        }
        this.calElem = $('#calendar');
        this.meetingform = new FormGroup({
          project: new FormControl(ownerableId, Validators.required),
          ownerable_type: new FormControl(ownerableType, Validators.required),
          agenda: new FormControl(null, Validators.required),
          contact_type: new FormControl(null, Validators.required),
          description: new FormControl(),
          scheduled_at: new FormControl(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19)),
          location: new FormControl(),
          email: new FormControl(null, Validators.required),
        });

        this.updatemeetingform = new FormGroup({
            project: new FormControl(ownerableId, Validators.required),
            ownerable_type: new FormControl(ownerableType, Validators.required),
            agenda: new FormControl(null, Validators.required),
            contact_type: new FormControl(null, Validators.required),
            description: new FormControl(),
            scheduled_at: new FormControl(),
            location: new FormControl(),
            remark: new FormControl(),
            email: new FormControl(null, Validators.required),
          });
        this.markDoneform = new FormGroup({
          remark: new FormControl(null, Validators.required),
          status: new FormControl('')

        });

        this.onProjectChange(ownerableId)
      },
      err => {
        
      }
    );
  }

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation"]
    if(this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }

  ownerableType:any;
  ownerableId:any;
  ngAfterViewInit(){
    this.loaderService.display(true);

    this.calenderService.fetchLead().subscribe(
        leads => {
          // this.leads = leads;
          // this.leads = leads;
          Object.keys(leads).map((key)=>{ this.leads=leads[key];});
        },
        error => {
          
        }
      );

    if(["designer", "community_manager","business_head","design_manager","city_gm"].includes(this.role)){
      this.ownerableType = "Project"
      this.ownerableId = this.lead_details.project_details.id;
    }

    this.fetchLeadEvent(this.ownerableType, this.ownerableId, this.from_date, this.to_date);
  }

  fetchLeadEvent(ownerableType, ownerableId, from_date, to_date){
    this.calenderService.fetchLeadEvent(ownerableType, ownerableId, from_date, to_date).subscribe(
        events => {
          events = events;
          Object.keys(events).map((key)=>{ this.events=events[key]; });
          this.populateCalender();
          this.calElem.fullCalendar( 'removeEvents' )
          this.calElem.fullCalendar( 'addEventSource', this.events )
          this.initLoader = false;
        },
        error => {
          
          this.initLoader = false;
        }
      );
  }

  onStatusChange(status){
    this.statusDetails["customer_status"] = status;
      this.statusDetails["customer_id"] = this.current_user_id;
      this.statusDetails['project_id'] = this.current_project_id;
      
      this.loaderService.display(true);

      if(this.statusDetails["customer_status"] == "follow_up"){
        $("#followup-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
        // $("#followup_remarks").val();
        this.loaderService.display(false);
        $("#statusModal").modal("show");
      }else if(this.statusDetails["customer_status"] == "lost"){
        this.loaderService.display(false);
        $("#loststatusModal").modal("show");
      }
      else{
        this.updateNewStatus();
      }
  }
  onCallbackChange(status){
      this.loaderService.display(true);
      if(status=='lost'){
        $("#loststatusModal").modal("hide");
        this.statusDetails["reason_for_lost"] = $("#lost_reason").val();
        this.statusDetails['remarks']= $("#lost_remarks").val();
        this.updateNewStatus();

      }
      if(status=='follow_up'){
        if($("#followup-details").val() != ''){
         $("#statusModal").modal("hide");
        this.statusDetails["customer_meeting_time"] = $("#followup-details").val();
        this.statusDetails['remarks']= $("#followup_remarks").val();
        this.updateNewStatus();
        }
        else{
          this.loaderService.display(false);
          this.erroralert = true;
            this.errorMessage = 'CallBack Date is required';
            setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 2000);
              
        }
      }
    }
    reasonForLostDropdownChange(val){
      this.statusChangeForm.controls['lost_remarks'].setValidators([Validators.required]);
      this.statusChangeForm.controls['lost_remarks'].updateValueAndValidity();
    }
    month:any;
    day:any;
    year:any
    // Disable calender date
    disableDate(){
      var datep = $('#followup-details').val();
      datep = datep.substring(0,10);

      var dtToday = new Date();
        
       this.month = dtToday.getMonth() + 1;
       this.day = dtToday.getDate();
       this.year = dtToday.getFullYear();
      if(this.month < 10)
          this.month = '0' + this.month.toString();
      if(this.day < 10)
          this.day = '0' + this.day.toString();
      
      var maxDate = this.year + '-' + this.month + '-' + this.day;
      $('#followup-details').attr('min', maxDate);
      if (datep < maxDate) {
        alert("selected date is in past");
        $('#followup-details').val(maxDate);
      }
      

    }

    updateNewStatus(){
      this.designerService.statusUpdate(this.statusDetails,this.designerId).subscribe(
          res => {

            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = 'Status updated successfully!';
            this.statusChangeForm.reset();
            this.statusChangeForm.controls['reson_for_lost'].setValue("");
            // if(document.getElementById('lostRemarkRow')){
            //   document.getElementById('lostRemarkRow').classList.add('d-none');
            // }
            setTimeout(function() {
                   this.successalert = false;
              }.bind(this), 2000);
            $('#viewEventModal').modal("hide");
            $('#statusModal').modal("hide");
            this.repopulateCalendar();
              
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

  getFromTo(date){
    this.y = date.getFullYear();
    this.m = date.getMonth();
    this.from_date = new Date(this.y, this.m, 1);
    this.to_date = new Date(this.y, this.m + 1, 0);

    this.fetchLeadEvent(this.ownerableType, this.ownerableId, this.from_date, this.to_date);
    // this.calElem.fullCalendar("refetchEvents");

    // this.calElem.fullCalendar( 'removeEvents' )
    // this.calElem.fullCalendar( 'addEventSource', this.events )

  }

  current_project_id;
  current_user_id;
  cal_lead_id;
  populateCalender(){
    this.calElem = $('#calendar');
    var parentThis = this
    this.calElem.fullCalendar({
      customButtons: {
        Prev: {
          text: 'Prev',
          click: function(calEvent) {
            parentThis.calElem.fullCalendar("prev");
            parentThis.calElem.fullCalendar( 'removeEvents', parentThis.events )
            parentThis.getFromTo(parentThis.calElem.fullCalendar('getDate')._d);
            
          }
        },
        Next: {
          text: 'Next',
          click: function(calEvent) {
            parentThis.calElem.fullCalendar("next");
            parentThis.calElem.fullCalendar( 'removeEvents', parentThis.events )
            parentThis.getFromTo(parentThis.calElem.fullCalendar('getDate')._d);
          }
        },
        Today: {
          text: 'Today',
          click: function(calEvent) {
            parentThis.calElem.fullCalendar("today");
            parentThis.calElem.fullCalendar( 'removeEvents', parentThis.events )
            parentThis.getFromTo(parentThis.calElem.fullCalendar('getDate')._d);
          }
        }
      },
      header: {
        left:   'Today Prev,Next',
        center: 'title',
        right:  'month basicWeek basicDay'
      },
      navLinks: true,
      dayClick: function(date, jsEvent, view){
        if(parentThis.isProjectInWip()){
          parentThis.meetingform.controls['scheduled_at'].setValue(new Date(date._i).toJSON().slice(0,19));
          $("#eventModal").modal("show");
        }
      },

      events: this.events,

      eventClick:function( calEvent, jsEvent, view ) {
        $("#viewEventModal").modal("show");
        parentThis.currentEvent = calEvent;
        this.calEvent = calEvent;
        this.mom_status = calEvent.mom_status
        
        
        this.is_manualevent =calEvent.is_manual_event;
        if( this.is_manualevent == false){
          $('#mom-add').css({ 'display' : 'none'});
          $('#momview').css({ 'display' : 'none'})
        }
        if(this.mom_status == "shared" && this.is_manualevent == true){
          // $('#momview').show();
          $('#mom-add').css({ 'display' : 'none'});
          $('#momview').css({ 'display' : 'block'})
          // $('#remark-hide').show();
        }

        if(this.mom_status == "pending" && this.is_manualevent == true){
          $('#momview').css({ 'display' : 'none'});
          $('#mom-add').css({ 'display' : 'block'})

        }

        if(this.mom_status == "present" && this.is_manualevent == true){
          $('#mom-add').css({ 'display' : 'none'});
          $('#momview').css({ 'display' : 'block'})
        }


        if(calEvent.location == null){
          calEvent.location = "None"

        }
        if(calEvent.description == null){
          calEvent.description = "None"

        }
        parentThis.current_project_id=calEvent.ownerable_id;
        parentThis.current_user_id = calEvent.customer_id;
        parentThis.cal_lead_id = calEvent.lead_id;
        $(".modal-project").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.ownerable_name+"</p>");
        $(".modal-agenda").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.agenda.split('_').join(' ')+"</p>");
        if(calEvent.agenda == 'follow_up'){
          $('#furemark-hide').show();
        }
        else{
          $('#furemark-hide').hide();
        }
        if(calEvent.agenda == 'follow_up' || calEvent.agenda == 'follow_up_for_not_contactable' ){
          $('#designer-hide').hide();
        }
        else{
          $('#designer-hide').show();
        }
        if(calEvent.agenda == 'follow_up' || calEvent.agenda == 'follow_up_for_not_contactable'  || calEvent.agenda == 'lead_assigned'){

          $('#status-change').show();
        }
        else{

           $('#status-change').hide();
        }
        $(".modal-type").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.contact_type.split('_').join(' ')+"</p>");
        $(".modal-description").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.description+"</p>");
        $(".modal-date").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.datetime+"</p>");
        $(".modal-location").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.location+"</p>");
        //$(".modal-members").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.users.join("<br/>")+"</p>");
        
        
        let i =0;
        let data = "";
        for( i; i<calEvent.users.length; i++){
          
          data += calEvent.users[i].name+" ("+calEvent.users[i].email+"), ";
        }

        $(".modal-members").html("<p style = 'padding-top: .35rem!important;'>"+data+"</p>");

        $(".modal-status").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.status+"</p>");
        $(".modal-remark").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.remark+"</p>");
        
        $(".modal-furemark").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.ownerable_remark+"</p>");

        $(".modal-lead").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.customer_name+"</p>");
        $(".modal-designer").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.designer.name+calEvent.designer.email+"</p>");
        
        if(calEvent.status == 'done' || calEvent.status == 'cancelled'){
          $('#btn-hide').css({ 'display' : 'none'});
          $('#btn-hides').css({ 'display' : 'none'});
          $('#btn-cancel-hide').css({ 'display' : 'none'});
          $('#remark-hide').show();
          $('#status-change').hide();
        }
        else if(calEvent.status == 'rescheduled'){
          $('#remark-hide').show();
          $('#btn-hide').css({ 'display' : 'block'});
          $('#btn-hides').css({ 'display' : 'block'});
          $('#btn-cancel-hide').css({ 'display' : 'block'});

        }

        
        else{
          $('#btn-hide').css({ 'display' : 'block'});
          $('#btn-hides').css({ 'display' : 'block'});
          $('#btn-cancel-hide').css({ 'display' : 'block'});
          $('#remark-hide').hide();

        }

        parentThis.updatemeetingform.controls['project'].setValue(calEvent.ownerable_id);
        parentThis.updatemeetingform.controls['ownerable_type'].setValue(calEvent.ownerable_type);
        parentThis.updatemeetingform.controls['agenda'].setValue(calEvent.agenda);
        parentThis.updatemeetingform.controls['contact_type'].setValue(calEvent.contact_type);
        parentThis.updatemeetingform.controls['description'].setValue(calEvent.description);
        parentThis.updatemeetingform.controls['scheduled_at'].setValue(new Date(Date.parse(calEvent.scheduled_at) + 330*60000).toJSON().slice(0,19));
        parentThis.updatemeetingform.controls['location'].setValue(calEvent.location);
        parentThis.updatemeetingform.controls['remark'].setValue(calEvent.remark);
        parentThis.updatemeetingform.controls['email'].setValue(calEvent.users.join(";"));
        // 
        // 
        // 
        // if (calEvent.title) {
        //     alert(calEvent.title);
        //     // return false;
        // }
      },

      selectable: true,
      eventBackgroundColor: '#A73E57',
      eventBorderColor: '#A73E57',
      eventTextColor: '#ffffff'

    });
    this.loaderService.display(false);
  }

  createEvent(){
    var parentThis = this
    if (this.meetingform.valid) {
      this.loaderService.display(true);
      this.calenderService.createEvent(this.meetingform.value).subscribe(
        event => {
          event = event;
          Object.keys(event).map((key)=>{ this.latestevent= event[key];});
          alert("Event created successfully");
          this.repopulateCalendar();
          // this.meetingform.reset();
          this.projectUsers=[];
          this.ref.detectChanges();
         setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
          this.successalert = true;
          this.successMessage = "Event successfully created";
          this.loaderService.display(false);
          setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
        },
        error => {
          
          var msg = error.json()["message"];
          
          
          if(msg){
            this.erroralert = true;

             this.errorMessage = msg;
             this.loaderService.display(false);
              setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 2000);
          }
          else{
            this.erroralert = true;
            this.errorMessage = "Agenda First meeting is already scheduled";
          }
          // this.meetingform.reset();
          this.projectUsers=[];
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
        }
      );
      this.CreateMeetingForm();
      
      $(':input[type="select"]').prop('disabled', true); 
      $("#eventModal").modal("hide");
    }
  }

  repopulateCalendar(){
    this.calElem.fullCalendar( 'removeEvents' )
    if(this.role == "designer"){
      var ownerableType = "Project"
      var ownerableId = this.lead_details.project_details.id;
    }
    else if(this.role == "community_manager" || this.role== "city_gm" || this.role=="business_head" || this.role=="design_manager"){
      var ownerableType = "Project"
      var ownerableId = this.lead_details.project_details.id;
    }

    this.calenderService.fetchLeadEvent(ownerableType,ownerableId, this.from_date, this.to_date).subscribe(
      events => {
        events = events;
        Object.keys(events).map((key)=>{ this.events=events[key]; });
        // $(".calendar-container").html("<div id='calendar' #calendar></div>");
        // this.calElem = $("#calendar");
        // this.populateCalender();
        // this.calElem.fullCalendar( 'refetchEvents' );
        this.calElem.fullCalendar( 'addEventSource', this.events )
        this.initLoader = false;
      },
      error => {
        
        this.initLoader = false;
      }
    );
  }
  usersList:any = [];
  updateStatus(status){
    this.usersList = [];
    this.status = status;
    var calEvent = this.currentEvent;
    if(status == "reschedule"){
      for(let obj of calEvent.users){
        this.usersList.push(obj.email);

      }

      this.updatemeetingform.reset();
      this.updatemeetingform.controls['project'].setValue(calEvent.ownerable_id);
      this.updatemeetingform.controls['ownerable_type'].setValue(calEvent.ownerable_type);
      this.updatemeetingform.controls['agenda'].setValue(calEvent.agenda);
      this.firstMeeting(calEvent.agenda);
      this.updatemeetingform.controls['contact_type'].setValue(calEvent.contact_type);
      this.updatemeetingform.controls['description'].setValue(calEvent.description);
      this.updatemeetingform.controls['scheduled_at'].setValue(new Date(calEvent.scheduled_at).toJSON().slice(0,19));
      this.updatemeetingform.controls['location'].setValue(calEvent.location);
      this.updatemeetingform.controls['remark'].setValue(calEvent.remark);
      this.updatemeetingform.controls['email'].setValue(this.usersList.join(";"));
      


      $("#updateEventModal").modal("show");
    }
    else if((status == "done") || (status == "cancelled")){
      this.markDoneform.controls['status'].setValue(status);
      $("#markModal").modal("show");


    }
  }

  updateEvent(){
    var calEvent = this.currentEvent;
    if (this.updatemeetingform.valid) {
      this.calenderService.updateEvent(this.updatemeetingform.value, calEvent.id).subscribe(
        event => {
          event = event;
          this.successalert = true;
          this.successMessage = "Event updated";
          $("#updateEventModal").modal("hide");
          $("#viewEventModal").modal("hide");
          this.repopulateCalendar();
        },
        error => {
          var msg = error.json()["message"];
          if(msg){
            alert(msg);
          }
          else{
            this.erroralert = true;
            this.errorMessage = "Error updating event";
          }

        }
      );
      this.meetingform.reset();
      $("#eventModal").modal("hide");
    }
  }

  onProjectChange(val){
    // 
    // 
    // for(let lead of this.leads){
    //   if(lead.ownerable_id == val){
    //     this.meetingform.controls['ownerable_type'].setValue(lead.ownerable_type);
    //     this.updatemeetingform.controls['ownerable_type'].setValue(lead.ownerable_type);
    //   }
    // }

    this.calenderService.fetchUsers(val).subscribe(
      users => {
        Object.keys(users).map((key)=>{ this.projectUsers= users[key];});
      },
      error => {
        this.erroralert = true;
        this.errorMessage = "Error updating event";
      }
    );
  }

  remarkEvent(){
    var calEvent = this.currentEvent;
    if(this.markDoneform.valid){
     this.calenderService.updateStatus(this.markDoneform.value,calEvent.id).subscribe(
        event => {
          event = event;
          this.successalert = true;
          if(this.status == "done"){
          this.successMessage = "Event  Marked as Done";
          }
          if(this.status == "cancelled"){
            this.successMessage = "Event  Marked as cancelled";
          }
          $("#updateEventModal").modal("hide");
          $("#viewEventModal").modal("hide");
          $("#markModal").modal("hide");
          this.repopulateCalendar();
        },
        error => {
          this.erroralert = true;
          this.errorMessage = "Error updating event";
          
        }
      );
    }
  }


  onMeetingUserChange(event,target){

    var val = event.target.value
    if(target == "meeting"){
      var exist_value = $(".meeting-control").val();
    }
    else if (target == "update") {
      var exist_value = $(".update-control").val();
    }
    var new_val;
    if(event.srcElement.checked){
      if(exist_value != undefined && exist_value != "" && exist_value != null){
        new_val = exist_value+";"+val;
      }
      else{
        new_val = val;
      }
    }
    else{
      if(exist_value != undefined && exist_value != "" && exist_value != null){
        var arr = exist_value.split(";");
        var index = arr.indexOf(val, 0);
        if (index > -1) {
           arr.splice(index, 1);
        }
        new_val = arr.join(";");
      }
    }
    if(target == "meeting"){
      $(".meeting-control").val(new_val);
      this.meetingform.controls['email'].setValue(new_val);
    }
    else if (target == "update") {
      $(".update-control").val(new_val);
      this.meetingform.controls['email'].setValue(new_val);
    }

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
  CreateMeetingForm(){
    this.meetingform.controls['agenda'].reset();
    this.meetingform.controls['contact_type'].reset();
    this.meetingform.controls['location'].reset();
    this.meetingform.controls['description'].reset();



  }

  firstMeeting(value?){
    if(value){
      this.loc = value;

    }
    else{


      this.loc = $('#agendaType').val();
    }
    
    
    if(this.loc == 'null'){
      $(':input[type="select"]').prop('disabled', true); 
    }  
    else{
      $(':input[type="select"]').prop('disabled', false); 
    }
  }


  showMOM(){
    
    
    this.calEvent = this.currentEvent.users;
    
    this.eventId = this.currentEvent.id;
    
    this.momView()
  }

  showcreateMOM(){
    
    
    this.calEvent = this.currentEvent.users;
    
    this.eventId = this.currentEvent.id;
    
  }

  OnEmailSelect(event){
    var val = event.target.value
    
    // this.mom.controls['emails'].setValue(val);
    (<FormArray>this.mom.controls['emails']).push(new FormControl(event.target.value));
  }

  //To create MOM
  createMOM(){
    if (this.mom.valid) {
      this.loaderService.display(true);
      this.calenderService.createMOM(this.mom.value,this.eventId).subscribe(
        event => {
         setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
          this.successalert = true;
          this.successMessage = "MOM successfully created";
          location.reload(true);
          this.loaderService.display(false);
          setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
        },
        error => {
          this.erroralert = true;
          this.errorMessage = "MOM not created";
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
        }
      );
      this.mom.reset();
      $("#addmom").modal("hide");
      setTimeout(function() {
       location.reload(true);
       }.bind(this), 1000);

    }
  }


  //To View MOM
  momView(){
     
    this.calenderService.momView(this.eventId).subscribe(
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
    $("#viewmom").modal("hide");
  }
  setCurrentTimestamp(){
    this.meetingform.controls['scheduled_at'].setValue(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
  }
}
