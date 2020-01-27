import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
import { Project } from '../../project/project/project';
import { DesignerService } from '../designer.service';
import { LeadService } from '../../lead/lead.service';
import { PlatformLocation } from '@angular/common';
import {Location} from '@angular/common';
import { OrderPipe } from 'ngx-order-pipe';
declare var $:any;


@Component({
  selector: 'app-designer-tasks',
  templateUrl: './designer-tasks.component.html',
  styleUrls: ['./designer-tasks.component.css'],
  providers: [ DesignerService , LeadService]
})
export class DesignerTasksComponent implements OnInit {

  selectSection = 'outstanding';
  shapeImage = true;
  exclamImage = false;
  taskCounts;
  boqProjectDeatil: any;
  quoationList = [];
  Lead_list =[];
  role;
  flag = false;
  order: string = 'attributes.client_info.lead_name';
  reverse: boolean = false;
  sortedCollection: any[];
  projectTaskCount;
  PreTen;
  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private loaderService : LoaderService,
    private designerService : DesignerService,
    public leadService : LeadService,
    private orderPipe: OrderPipe,
    private location: Location

    ) {  }

  ngOnInit() {
    this.role =localStorage.getItem('user');
    this.route.queryParams.subscribe(params => {
        this.page_number = params['page'];
        // this.search_filter = params['search'];
      });
    if(this.page_number){
      this.getAllProjectDetails(this.page_number,this.search_filter);

    }
    else{
     this.getAllProjectDetails(1);
    }
     
    // this.getTaskCounts();
    
  }

  //  Methos for fecthing project deatil
  task_change;
  headers_res;
  per_page;
  total_page;
  current_page;
  page_number;
  selectedClient:any = [];
  search_filter;

  getAllProjectDetails(page?,search?){
    this.page_number = page;
    this.search_filter = search;
    this.location.go('/tasks/task-list?page='+this.page_number);


    this.loaderService.display(true);
    this.designerService.getAllProjects(this.task_status_filter,this.task_stage_filter,this.wip_filter,this.Lead_id,this.column_value,this.sort_state,page,search).subscribe(
      res=>{
        
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.boqProjectDeatil = res.designer_task_set;
        this.taskCounts = res.counts;
        this.Lead_list = res.lead_list;
        var obj ={
          'name':'Client',
          'id': ''
        }
        this.Lead_list.unshift(obj);
        
        this.loaderService.display(false);

      },
      err=>{
        
        this.loaderService.display(false);

      });
  }

  setOrder(value: string) {

    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  search_value;
    onKey(event: any) { // without type info
      this.search_value = event.target.value ;
      var  i=0;
      if(true){

        this.getAllProjectDetails('',this.search_value);
        i++;
      }
    } 
  date_from;
  date_to;
  disable_to;

  changeDateFrom(val){
    this.date_from = val;
    this.disable_to = false;
    // $(".to_date_container").css("display", "block");
  }

  changeDateTo(val){
    this.date_to = val;
  }  

  

  stage;



 //   cards for tasks count
  selectedSection(tasks){
    if( tasks == 'outstanding'){
      this.shapeImage = true;
      this.exclamImage = false;

    }
    else if( tasks == 'overdue-task'){
      this.exclamImage = true;
      this.shapeImage = false;

    }
    else{
      this.shapeImage = false;
      this.exclamImage = false;

    }
    
    this.selectSection = tasks;
    


  }

  convertToAbs(number){
    return Math.abs(number);
  }
  quoteId;
  selectBoqTask(quoteId,stage){
    this.quoteId = quoteId;
    if( stage == '10 %'){
      this.stage = 'tenPercent'

    }
    else if(stage == '10% - 40%'){
      this.stage = 'tenForty';

    }
    this.getBoqTaskCount();
    
    if(this.stage == 'tenPercent'){
      this.flag = true;
      
      this.getBoqTaskLst(this.quoteId);
      $('.rect2').css('cursor','not-allowed');
    }
    else{
      this.getBoqTaskLstForTenToForty();
      this.stage = 'tenForty';
    }
  }
  parentBoq;
  getBoqTaskLstForTenToForty(){
    this.loaderService.display(true);
    this.designerService.getBoqTaskLstForTenToForty(this.quoteId).subscribe(
      res=>{
        this.loaderService.display(false);
        this.boq_reference = res.reference_number;
        this.project_id = res.project_id;
        this.lead_id = res.lead_id;
        
        this.parentBoq = res.parent_quotation;
        this.taskList = res.stage_wise_task;
        

      },
      err=>{
        this.loaderService.display(false);
        

      })

  }

  boqTaskCount;
  getBoqTaskCount(){
    this.designerService.getBoqTaskCount(this.quoteId).subscribe(
      res=>{
        
        this.boqTaskCount = res.counts;
        

      },
      err=>{
        

      })

  }
  boq_reference;
  lead_id;
  project_id;
  taskList:any;

  getBoqTaskLst(quoteId){
    this.loaderService.display(true);
    this.designerService.getBoqTaskLst(quoteId).subscribe(
      res=>{
        this.loaderService.display(false);
        this.boq_reference = res.reference_number;
        this.project_id = res.project_id;
        this.lead_id = res.lead_id;
        
        this.taskList = res.stage_wise_task;
        
         this.fetchBasicDetails();

      },
      err=>{
        this.loaderService.display(false);
        

      })
  }
  client_name;
  project_name;
  lead_details:any;

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.client_name =  this.lead_details.name;
        this.project_name = this.lead_details.project_details.name;
      },
      err => {
        
      }
    );
  }
  FortyChange(){
    this.getBoqTaskLstForTenToForty();
    this.stage = 'tenForty';
   

  }
  FortyChangeCheck(){
    
    this.stage = 'tenPercent';
    this.getBoqTaskLst(this.parentBoq);
  }
  direction: number;
  isDesc: boolean = true;
  column: string;

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
  projectId;
  selectProjectTask(projectId){
    this.projectId = projectId;

    $('#projectTaskModal').modal('show');
    this.getTaskList();
    this.getProjectTaskCount();

  }
  getProjectTaskCount(){
    this.loaderService.display(false);
    this.designerService.getProjectTaskCount(this.projectId).subscribe(
      res=>{
        
        this.projectTaskCount = res.counts;
        
      },
      err=>{
        

      });

  }

  //Method for getting task list
  getTaskList(){
    this.loaderService.display(false);
    this.designerService.getTaskList(this.projectId).subscribe(
      res=>{
        
        this.lead_id = res.lead_id;
        this.taskList = res.stage_wise_task;
      },
      err=>{
        

      });
      
  }


  //Method for changing new staus
  newStatusChange(status,TaskId){

    
    if(status == true){
      
      
      this.designerService.newStatusChange(TaskId).subscribe(
        res=>{
          
          

        },
        err=>{
          

        });
      
    }

  }
  wip_filter;
  filterColumDropdownChange3(filterValue){
    this.wip_filter = filterValue;


  }
  task_status_filter;
  filterColumDropdownChange1(filterValue){
    this.task_status_filter = filterValue;


  }
  task_stage_filter;
  filterColumDropdownChange2(filterValue){
    this.task_stage_filter = filterValue;


  }
  filterData(){
    this.getAllProjectDetails(1,'');

  }

  //get list for outstanding task
  stageCount ='outstanding';
  getTaskListForStatus(stageCount){
    this.stageCount = stageCount;
    // this.designerService.getOutstandingList().subscribe(
    //   res=>{

    //   },err=>{

    // });
  }


  filterAccordintToDate(){
    $("#to_date_div").removeClass("d-none");
    $("#from_date_div").removeClass("d-none");

  }
  Lead_id;
  filterColumDropdownChange4(LeadId){
    this.Lead_id = LeadId;
     var count =0;


    for(var i=0; i< this.Lead_list.length; i++){

       if(this.Lead_id == this.Lead_list[i].id){
         break;


       }
    }

    this.selectedClient = this.Lead_list[i];
    

  }
  sort_state = '';
  column_value;
  sortData(value){
    this.column_value = value;
    if(this.sort_state == 'ASC'){

        this.sort_state = 'DESC';

      }
      else if(this.sort_state == 'DESC'){

        this.sort_state = 'ASC';

      }
      else{
         this.sort_state = 'ASC';

      }
    this.getAllProjectDetails(this.page_number,'');  


  }
  progressChange(status){


  }
  clearSort(){
    this.column_value = '';
    this.sort_state = '';
    this.getAllProjectDetails(this.page_number,'');


  }

  

}
