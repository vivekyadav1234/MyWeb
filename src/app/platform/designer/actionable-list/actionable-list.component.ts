import { Component, OnInit,OnDestroy ,AfterViewInit } from '@angular/core';
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
  selector: 'app-actionable-list',
  templateUrl: './actionable-list.component.html',
  styleUrls: ['./actionable-list.component.css'],
  providers: [ProjectService,DesignerService]
})
export class ActionableListComponent implements OnInit, OnDestroy ,AfterViewInit {
  observableProjects: Observable<Project[]>
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:string;
  designerId:string;
  actionableList;
  usersList;
  paramsActivated:string;
  statusDetails: any = {};
  statusChangeForm:FormGroup;
  project_status;

  headers_res;
  per_page;
  total_page;
  current_page;


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
      this.getActionableList(params['project_status'], 1);
    });
    this.statusChangeForm = this.formBuilder.group({
        reson_for_lost: new FormControl("",Validators.required),
        lost_remarks:new FormControl("")
      })
  }

  getActionableList(project_status, page){
    this.designerService.getActionableList(project_status, this.designerId, page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.actionableList = res.leads;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  nextPage(page){
    this.loaderService.display(true);
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.getActionableList(params['project_status'], page);
    });
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

  onStatusChange(customerId, ProjectId,status){
      this.statusDetails["customer_status"] = status;
      // this.statusDetails["customer_remarks"] = "";
      // this.statusDetails["customer_meeting_time"] = "";
      this.statusDetails["customer_id"] = customerId;
      this.statusDetails['project_id'] = ProjectId;

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
      else if(this.statusDetails["customer_status"] == "inactive"){
        
        this.loaderService.display(false);
        $("#statusModal2").modal("show");
      }
      else if(this.statusDetails["customer_status"] == "on_hold"){
        $('#onhold-details').val('');
        
        
        // $("#onhold-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
        this.loaderService.display(false);
        $("#statusModal1").modal("show");
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
    onhold_date;
    month:any;
    day:any;
    year:any;
    disableDate1(event){
  
       
        this.onhold_date = event.target.value;
        

    
     

  }

    onCallbackChange1(){
      this.loaderService.display(true);
      $("#statusModal1").modal("hide");
      this.statusDetails["customer_meeting_time"] = this.onhold_date;
      this.statusDetails['remarks']= $("#on_hold_remark").val();
      
      
      this.updateNewStatus();
     
      
      
    }
    onCallbackChange2(){
      this.loaderService.display(true);
      $("#statusModal2").modal("hide");
      this.statusDetails['remarks']= $("#inactive_remarks").val();  
      this.updateNewStatus();
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
            this.getActionableList(this.project_status, 1);
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
  direction: number;
  isDesc: boolean = true;
  column: string;
  // Change sort function to this: 
  sort(property){
      this.isDesc = !this.isDesc; //change the direction    
      this.column = property;
      this.direction = this.isDesc ? 1 : -1; 
  }

  sortFunc(records: Array<any>, args?: any){
    this.column = args.property;
    this.direction = args.direction;
    return records.sort(function(a, b){
      if(a[args.property] !=undefined && b[args.property] != undefined) {
        if(args.property=="id"){
           if(a[args.property] < b[args.property]){
                return -1 * args.direction;
            }
            else if( a[args.property] > b[args.property]){
                return 1 * args.direction;
            }
            else{
                return 0;
            } 
        } else {
            if(a[args.property].toLowerCase() < b[args.property].toLowerCase()){
                return -1 * args.direction;
            }
            else if( a[args.property].toLowerCase() > b[args.property].toLowerCase()){
                return 1 * args.direction;
            }
            else{
                return 0;
            }
        }
      }
    });
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
