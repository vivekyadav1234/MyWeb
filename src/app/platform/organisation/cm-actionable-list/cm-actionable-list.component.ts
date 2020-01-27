import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { Project, IGanttOptions, Zooming, Task } from '../../../shared/gantt-chart/interfaces';
declare var gantt: any;
declare var $: any;

@Component({
  selector: 'app-cm-actionable-list',
  templateUrl: './cm-actionable-list.component.html',
  styleUrls: ['./cm-actionable-list.component.css'],
  providers: [CommunitymanagerService, SchedulerService, DesignerService, LeadService]
})
export class CmActionableListComponent implements OnInit, OnDestroy, AfterViewInit {
  CMId: string;
  usersList;
  userData;
  assignedDesignerId = [];
  projecttask_name = [];
  projecttask_id = [];
  projecttask_duration = [];
  projecttask_action_point = [];
  projecttask_process_owner = [];
  projecttask_percent_completion = [];
  projecttask_previous_dependency = [];
  projecttask_remarks = [];
  projecttask_start_date = [];
  projecttask_end_date = [];
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  errorMessagemodal: string;
  erroralertmodal = false;
  successalertmodal = false;
  successMessagemodal: string;
  updateProjectTaksForm: FormGroup;
  formattedProjectTasksObj: Project;
  startDateForGanttChart: Date;
  endDateForGanttChart: Date;
  options: IGanttOptions;
  updateLeadquestionnaireForm: FormGroup;
  designerBookingForm1: FormGroup;
  project: any;
  calls_for = 0;
  agenda = 0;
  lead_category = 0;
  meetings_for = 0;
  designer_id = 0;
  customer_status = 0;
  leadsList: any = [];
  statusDetails: any = {};
  query_params: any = {};


  constructor(
    private loaderService: LoaderService,
    private cmService: CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    private designerService: DesignerService,
    private route: ActivatedRoute
  ) {
    this.CMId = localStorage.getItem('userId');
  }

  headers_res;
  per_page;
  total_page;
  current_page;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.calls_for = params['calls_for'];
      // this.agenda = params['agenda'];
      this.lead_category = params['lead_category'];
      this.customer_status = params['customer_status'];
      this.meetings_for = params['meetings_for'];
      this.agenda = params['agenda'];
    });
    this.route.queryParams.subscribe(params => {
      if (params['designer_id']) {
        this.designer_id = params['designer_id'];
        this.getActionableList1(1);
        this.loaderService.display(true);
      }
      else{
        this.getActionableList(1,'');
        this.loaderService.display(true);
      }
    });

    // Collecting Params
    this.route.queryParams.subscribe(params => {
      if (params['lead_status']) {
        this.query_params['lead_status'] = params['lead_status'];
      }

      if (params['lead_category']) {
        this.query_params['lead_category'] = params['lead_category'];
      }

    });
    // Collecting Params
  }
  search_value: any;
  onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    var  i=0;
    if(true){
      this.getActionableList('',this.search_value);
      i++;
    }
  } 




  getActionableList(page?,search?){
    // this.loaderService.display(true);
    this.cmService.getActionableList(this.CMId,this.calls_for,this.agenda,this.lead_category, this.meetings_for, this.customer_status, page,search).subscribe(
      res => {
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res = res.json();
        // this.usersList = res.leads;
        this.leadsList = res.leads;
        // Object.keys(res.leads).map((key)=>{ this.usersList= res[key];});
        // this.sortBasedOnDesignerStatus(this.usersList);
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  getActionableList1(page?) {
    this.loaderService.display(true);
    this.cmService.getActionableList1(this.CMId, this.calls_for,this.agenda,this.lead_category, this.meetings_for, this.customer_status, this.designer_id, page).subscribe(
      res => {
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res = res.json();
        // this.usersList = res.leads;
        this.leadsList = res.leads;
        // Object.keys(res.leads).map((key)=>{ this.usersList= res[key];});
        // this.sortBasedOnDesignerStatus(this.usersList);
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  direction: number;
  isDesc: boolean = true;
  column: string;
  // Change sort function to this:
  sort(property) {
    this.isDesc = !this.isDesc; // change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: 'hover'
    });
    // $(this).popover();
    $(function () {
      $('.pop').popover({
        trigger: 'hover'
      });
    });
  }

  nextPage(page){
    this.route.queryParams.subscribe(params => {
      if (params['designer_id']) {
        this.designer_id = params['designer_id'];
        this.getActionableList1(page);
        this.loaderService.display(true);
      }
      else {
        this.getActionableList(page);
        this.loaderService.display(true);
      }
    });
  }

  
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    });
  }
  ngAfterViewInit() {
    $(function () {
      $('.pop').popover({
        trigger: 'hover'
      });
    });
  }

  filtercol1Val: any = 'all';
  filtercol2Val: any = '';
  from_date: any;
  to_date: any;
  filteredleads: any[];

  filterColumDropdownChange(colVal) {
    this.from_date = undefined;
    this.to_date = undefined;
    if (colVal == 'all') {
      document.getElementById('fromDateFilter').classList.add('d-none');
      document.getElementById('toDateFilter').classList.add('d-none');
    }
    else {
      this.filtercol1Val = colVal;
      document.getElementById('fromDateFilter').classList.add('d-none');
      document.getElementById('toDateFilter').classList.add('d-none');
    }
  }

  filterSubmit() {
    this.loaderService.display(true);
    if (this.filtercol1Val == 'all') {
      this.getActionableList();
    }
    else if (this.filtercol1Val == 'todays_lead' || this.filtercol1Val == 'old_lead') {
      this.cmService.filterDataForNA(this.filtercol1Val, this.CMId)
        .subscribe(
          res => {
            this.loaderService.display(false);
            this.leadsList = res.leads;
          },
          err => {
            this.loaderService.display(false);
            
          }
        );

    }
  }
}