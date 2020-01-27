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
// import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $:any;

@Component({
  selector: 'app-cm-site-request',
  templateUrl: './cm-site-request.component.html',
  styleUrls: ['./cm-site-request.component.css'],
  providers: [CommunitymanagerService,DesignerService,LeadService]
})
export class CmSiteRequestComponent implements OnInit {

	errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  requestList:any = [];
  ssList:any = [];

  constructor(
  	private loaderService : LoaderService,
    private cmService : CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder:FormBuilder,
    private designerService:DesignerService,
    private route:ActivatedRoute
  ) { }

  // this.erroralert = true;
  // this.loaderService.display(false);
  //   this.errorMessage = JSON.parse(err['_body']).message;
  //   setTimeout(function() {
  //        this.erroralert = false;
  //   }.bind(this), 2000);

  ngOnInit() {
  	this.loaderService.display(true);
  	this.fetchRequests();
  }

  fetchRequests(){
  	this.cmService.fetchRequests().subscribe(
  	  res => {
  	  	this.loaderService.display(false);
  	  	this.requestList = res['site_measurement_requests'];
  	  	this.fetchSiteSupervisors();
  	  },
  	  err => {
  	    this.loaderService.display(false);
  	  });
  }

  fetchSiteSupervisors(){
  	this.cmService.fetchSiteSupervisors().subscribe(
  	  res => {
  	  	this.ssList = res.sitesupervisors;
  	  },
  	  err => {
  	    this.loaderService.display(false);
  	  });
  }
	ss_id:any;
	selectedIndex: any;
  setSupervisor(ss_id, index){
		this.ss_id = ss_id;
		this.selectedIndex = index
  }

  assignSiteSupervisor(req_id){
  	if(this.ss_id){
  		this.cmService.assignSiteSupervisor(req_id, this.ss_id).subscribe(
  		  res => {
  		  	this.ssList = res.sitesupervisors;
  		  	this.successalert = true;
				  this.loaderService.display(false);
						this.successMessage = "Assigned Successfully";
						this.selectedIndex = "";
				    setTimeout(function() {
				         this.successalert = false;
				    }.bind(this), 2000);
				  this.fetchRequests();
  		  },
  		  err => {
  		    this.loaderService.display(false);
  		    this.erroralert = true;
  		    this.loaderService.display(false);
  		      this.errorMessage = "Something went wrong";
  		      setTimeout(function() {
  		           this.erroralert = false;
  		      }.bind(this), 2000);
  		  });
  	}
  }

  reschedule_request_id:any;
  reschedule(id){
  	this.reschedule_request_id = id;
  	var record;
  	for(let obj of this.requestList){
  		if(obj.id == id){
  			record = obj;
  		}
  	}

  	$("#rescheduleModal").modal("show");
  }

  rescheduleEvent(){
  	this.loaderService.display(true);
  	var event = $('#scheduled_at').val()
		this.cmService.rescheduleEvent(this.reschedule_request_id, event).subscribe(
		  res => {
		  	this.fetchRequests();
		    this.loaderService.display(false);
		    this.successalert = true;
		    this.successMessage = "Rescheduled request";
		    setTimeout(function() {
		           this.successalert = false;
		      }.bind(this), 2000);
		    this.reschedule_request_id = undefined;
		    $("#rescheduleModal").modal("hide");
		  },
		  err => {
		    this.loaderService.display(false);
		    this.erroralert = true;
		      this.errorMessage = "Something went wrong";
		      setTimeout(function() {
		           this.erroralert = false;
		      }.bind(this), 2000);
		  });
  }

  discardRequest(id){
  	this.loaderService.display(true);
		this.cmService.discardRequest(id).subscribe(
		  res => {
		  	this.fetchRequests();
		    this.loaderService.display(false);
		    this.successalert = true;
		    this.successMessage = "Request discarded";
		    setTimeout(function() {
		           this.successalert = false;
		      }.bind(this), 2000);

		    $("#rescheduleModal").modal("hide");
		  },
		  err => {
		    this.loaderService.display(false);
		    this.erroralert = true;
		      this.errorMessage = "Something went wrong";
		      setTimeout(function() {
		           this.erroralert = false;
		      }.bind(this), 2000);
		  });
  }

}
