import { Component, OnInit ,OnDestroy ,AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
import { DesignerService } from '../designer.service';
import { LoaderService } from '../../../services/loader.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
declare var Layout:any;
declare var $:any;

@Component({
  selector: 'app-deadlines-list',
  templateUrl: './deadlines-list.component.html',
  styleUrls: ['./deadlines-list.component.css'],
  providers: [ProjectService,DesignerService]
})
export class DeadlinesListComponent implements OnInit, OnDestroy, AfterViewInit {
  observableProjects: Observable<Project[]>
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:string;
  designerId:string;
  deadlinesList;
  usersList;
  project_status;
  paramsActivated:string;
  statusDetails: any = {};
  statusChangeForm:FormGroup;


  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private projectService:ProjectService,
    private loaderService : LoaderService,
    private designerService : DesignerService,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.loaderService.display(true);
    this.role = localStorage.getItem('user');
    this.designerId = localStorage.getItem('userId');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.project_status = params['project_status'];
      this.paramsActivated = params['project_status'].split("_"). join(" ").toUpperCase();
      this.getDeadlinesList(params['project_status']);
    });
    this.statusChangeForm = this.formBuilder.group({
        reson_for_lost: new FormControl("",Validators.required),
        lost_remarks:new FormControl("")
      })
  }

  getDeadlinesList(project_status){
    this.designerService.getDeadlinesList(project_status, this.designerId).subscribe(
      res => {
        this.deadlinesList = res["users"];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
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

  onStatusChange(customerId, status){
      this.statusDetails["customer_status"] = status;
      // this.statusDetails["customer_remarks"] = "";
      // this.statusDetails["customer_meeting_time"] = "";
      this.statusDetails["customer_id"] = customerId;

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
        $("#statusModal").modal("hide");
        this.statusDetails["customer_meeting_time"] = $("#followup-details").val();
        this.statusDetails['remarks']= $("#followup_remarks").val();
        this.updateNewStatus();
      }
    }

    reasonForLostDropdownChange(val){
      if(val=='others'){
        document.getElementById('lostRemarkRow').classList.remove('d-none');
        this.statusChangeForm.controls['lost_remarks'].setValidators([Validators.required]);
      } else {
        if(document.getElementById('lostRemarkRow'))
          document.getElementById('lostRemarkRow').classList.add('d-none');
          this.statusChangeForm.controls['lost_remarks'].setValue("");
          this.statusChangeForm.controls['lost_remarks'].validator=null;
      }
      this.statusChangeForm.controls['lost_remarks'].updateValueAndValidity();
    }

    updateNewStatus(){
      this.designerService.statusUpdate(this.statusDetails,this.designerId).subscribe(
          res => {

            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = 'Status updated successfully!';
            this.getDeadlinesList(this.project_status);
            this.statusChangeForm.reset();
            this.statusChangeForm.controls['reson_for_lost'].setValue("");
            if(document.getElementById('lostRemarkRow')){
              document.getElementById('lostRemarkRow').classList.add('d-none');
            }

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

}
