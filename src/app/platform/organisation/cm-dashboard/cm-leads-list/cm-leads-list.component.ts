import { Component, OnInit,OnDestroy ,AfterViewInit, Input } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../communitymanager.service';
import { LeadService } from '../../../lead/lead.service';
import { DesignerService } from '../../../designer/designer.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
// import { CategoryPipe } from '../../../../shared/category.pipe';
import { SortPipe } from '../../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../../scheduler/scheduler.service';
import { Project, IGanttOptions, Zooming, Task } from '../../../../shared/gantt-chart/interfaces';
import { DynamicFormService } from '../../../../shared/dynamic-form/dynamic-form.service';
import { FormBase } from '../../../../shared/dynamic-form/form-base';
declare var gantt : any;
declare var $:any;


@Component({
  selector: 'app-cm-leads-list',
  templateUrl: './cm-leads-list.component.html',
  styleUrls: ['./cm-leads-list.component.css'],
  providers: [CommunitymanagerService,SchedulerService,DesignerService,LeadService,DynamicFormService]
})

export class CmLeadsListComponent implements OnInit, OnDestroy ,AfterViewInit {


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
  formattedProjectTasksObj : Project;
  startDateForGanttChart : Date;
  endDateForGanttChart : Date;
  options: IGanttOptions;
  search_value: any;
  updateLeadquestionnaireForm : FormGroup;
  designerBookingForm1: FormGroup;
  project:any;
  lead_status;
  role;
  designer_id;
  designersList;
  my_designers:any = []
  statusDetails: any = {};
  smartshareHistoryList;
  statusChangeForm:FormGroup;
  dropLeadForm:FormGroup = new FormGroup({
    lost_remark: new FormControl("",Validators.required),
    drop_reason:new FormControl("")
  })

  showAlternateForm: boolean;
  staticFields: any;
  alternateNumberForm: FormGroup;
  @Input() fields: FormBase<any>[] = [];

    constructor(
      private loaderService : LoaderService,
      private cmService : CommunitymanagerService,
      private leadService: LeadService,
      private formBuilder:FormBuilder,
      private schedulerService : SchedulerService,
      private designerService:DesignerService,
      private route:ActivatedRoute,
      private dynamicFormService: DynamicFormService
    ) {
      this.CMId = localStorage.getItem('userId');
    }

    addTaskForm = this.formBuilder.group({
      name :new FormControl('',Validators.required),
      remarks: new FormControl(''),
      percent_completion: new FormControl('',Validators.required),
      start_date: new FormControl(),
      end_date: new FormControl(),
      action_point:new FormControl(),
      upstream_dependencies:new FormControl(),
      duration : new FormControl(),
      process_owner: new FormControl()
    });
   onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    var  i=0;
    if(true){
      this.getUserList('',this.search_value);
      i++;
      
    }
  }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
      this.designer_id = params['designer_id'];
      this.to_date = params['to_date'];
      this.from_date = params['from_date'];
    });
    this.getUserList(1,'');
    //this.getDesignerList();
    this.loaderService.display(true);
    this.updateProjectTaksForm = this.formBuilder.group({
    project_tasks: this.formBuilder.array( [this.buildItem('')])
    })
    // this.from_date = "";
    // this.to_date = "";
    this.updateLeadquestionnaireForm = this.formBuilder.group({
        customer_name : new FormControl("",Validators.required),
        phone : new FormControl("",Validators.required),
        project_name: new FormControl(""),
        city : new FormControl("",Validators.required),
        location: new FormControl("",Validators.required),
        project_type :new FormControl("",Validators.required),
        accomodation_type: new FormControl("",Validators.required),
        scope_of_work : new FormArray([],Validators.required),
        budget_value:new FormControl(),
        home_value: new FormControl(),
        possession_status :new FormControl("",Validators.required),
        remarks_of_sow: new FormControl(),
        possession_status_date:new FormControl(),
        have_homeloan: new FormControl("",Validators.required),
        call_back_day: new FormControl("",Validators.required),
        call_back_time: new FormControl("",Validators.required),
        have_floorplan: new FormControl("",Validators.required),
        lead_floorplan:new FormControl(""),
        additional_comments :new FormControl(""),
      ownerable_type : new FormControl('Lead'),
      user_id : new FormControl(localStorage.getItem('userId')),
      ownerable_id : new FormControl()
    });

    this.designerBookingForm1 = this.formBuilder.group({
        customer_name : new FormControl(),
        customer_age : new FormControl(),
        profession : new FormControl(),
        family_profession : new FormControl(),
        age_house : new FormControl(),
        lifestyle : new FormControl(),
        house_positive_features : new FormControl(),
        house_negative_features : new FormControl(),
        inspiration : new FormControl(),
        color_tones : new FormControl(),
        theme : new FormControl(),
        functionality : new FormControl(),
        false_ceiling : new FormControl(),
        electrical_points : new FormControl(),
        special_needs : new FormControl(),
        vastu_shastra : new FormControl(),
        all_at_once : new FormControl(),
        budget_range : new FormControl(),
        design_style_tastes : new FormControl(),
        storage_space : new FormControl(),
        mood : new FormControl(),
        enhancements : new FormControl(),
        discuss_in_person : new FormControl(),
        mk_age:new FormControl(),
        mk_gut_kitchen :new FormControl(),
        mk_same_layout :new FormControl(),
        mk_improvements :new FormControl(),
        mk_special_requirements :new FormControl(),
        mk_cooking_details :new FormControl(),
        mk_appliances :new FormControl(),
        mk_family_eating_area :new FormControl(),
        mk_guest_frequence :new FormControl(),
        mk_storage_patterns :new FormControl(),
        mk_cabinet_finishing :new FormControl(),
        mk_countertop_materials:new FormControl(),
        mk_mood:new FormControl(),
        mk_lifestyle : new FormControl()
      });

    this.statusChangeForm = this.formBuilder.group({
        reson_for_lost: new FormControl(""),
        lost_remarks:new FormControl("",Validators.required),
       // reason:new FormControl("")
      })

      this.staticFields = [{
        "attr_name": "name",
        "attr_type": "text_field",
        "attr_data_type": "string",
        "attr_value":"string",
        "required":true
          },{
            "attr_name": "relation",
            "attr_type": "text_field",
            "attr_data_type": "string",
            "attr_value":"string",
            "required":true
          },{
          "attr_name": "contact",
          "attr_type": "text_field",
          "attr_data_type": "string",
          "attr_value":"string",
          "required":true
        }];
  
        this.fields=[];
        this.staticFields.forEach(elem =>{
            this.fields.push(elem);
        });
        this.alternateNumberForm = this.dynamicFormService.toFormGroup(this.fields);
    }

    buildItem(val: string) {
      return new FormGroup({
        id: new FormControl(""),
        name: new FormControl(""),
        duration: new FormControl(""),
        percent_completion: new FormControl(""),
        action_point: new FormControl(""),
        end_date: new FormControl(""),
        process_owner: new FormControl(""),
        upstream_dependency_id: new FormControl(""),
        remarks: new FormControl(""),
        start_date: new FormControl("")
      })
  }

  getJobAttributes(updateProjectTaksForm){
  return updateProjectTaksForm.get('project_tasks').controls
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

  pushJobAttributes(updateProjectTaksForm){
  return updateProjectTaksForm.get('project_tasks').push(this.buildItem(''))
  }


  headers_res;
  per_page;
  total_page;
  current_page;

  dropleadId;

  passDropLeadData(id){
    this.dropleadId =id;
    this.dropLeadForm.controls['lost_remark'].setValidators([Validators.required]);
    this.dropLeadForm.controls['lost_remark'].updateValueAndValidity();
  }
  getUserList(page?,search?) {
    
    this.loaderService.display(true);
    this.cmService.getQualifiedUserList(this.CMId,this.lead_status,page,search,this.designer_id, this.to_date, this.from_date, this.filtercol1Val).subscribe(
      res => {
        this.headers_res = res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');


        res = res.json();
        if(res.leads && res.leads.length > 0){
          this.usersList = res.leads;
          
          this.usersList = this.sortFunc(this.usersList,{property: 'id', direction: '-1'});
          //Object.keys(res.leads).map((key)=>{ this.usersList= res[key];});
          this.sortBasedOnDesignerStatus(this.usersList);
        }else{
          this.usersList = [];
        }
        this.loaderService.display(false);
        this.getDesignerList();
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  getDesignerList(){
    this.cmService.getDesignerList(this.CMId).subscribe(
      res => {
        
        this.designersList = res.designer_list;
      }
    );

  }

  deletUser(userId){
    if(confirm('Are you sure you want to delete this lead?')== true) {
      this.loaderService.display(true);
      this.cmService.deleteUser(userId).subscribe(
        res => {
          this.getUserList(1);
          this.successalert = true;
          this.successMessage = "Deleted Successfully !!";
          setTimeout(function() {
                this.successalert = false;
             }.bind(this), 20000);
        },
        err => {
          this.erroralert = true;
          this.errorMessage=JSON.parse(err['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 20000);
        }
      );
    }
  }

  onDropdownChange(value,rowid) {
    this.assignedDesignerId[rowid] = value;
      if(this.assignedDesignerId[rowid] != undefined && this.assignedDesignerId[rowid] !='Assign To Designer') {
          document.getElementById("assigndropdown"+rowid).classList.remove('inputBorder');
      }
  }
 

  private assignLeadToDesigners(client_id,id:number,index:number){
    if(this.assignedDesignerId[index] != undefined && this.assignedDesignerId[index] !='Assign To Designer') {
       document.getElementById("assigndropdown"+index).classList.remove('inputBorder');
        this.loaderService.display(true);
        this.cmService.assignLeadToDesigners(client_id,id,this.assignedDesignerId[index],this.CMId)
          .subscribe(
            res => {
              Object.keys(res).map((key)=>{ res= res[key];});
                  this.getUserList();
                  this.assignedDesignerId[index] = undefined;
                  this.loaderService.display(false);
                  this.successalert = true;
                  this.successMessage = "Assigned Successfully !!";
                  $(window).scrollTop(0);
                  setTimeout(function() {
                    this.successalert = false;
                  }.bind(this), 5000);
              //$.notify('Assigned Successfully!');
            },
            error => {
                  this.erroralert = true;
                  this.errorMessage=JSON.parse(error['_body']).message;
                  this.loaderService.display(false);
                  $(window).scrollTop(0);
                  setTimeout(function() {
                      this.erroralert = false;
                  }.bind(this), 5000);
            }
          );
      } else {
        document.getElementById("assigndropdown"+index).classList.add('inputBorder');
      }
  }
  
 private designerLeadsCount(client_id,id:number,index){
     
      if(this.assignedDesignerId[index] != undefined && this.assignedDesignerId[index] !='Assign To Designer') {
         document.getElementById("assigndropdown"+index).classList.remove('inputBorder');
        this.loaderService.display(true);
        this.cmService.designerLeadsCount(this.assignedDesignerId[index])
          .subscribe(
            res => {
                
                if(res["leads_count"] >20){
                  if(confirm('The Designer already has more than 20 active leads. Are you sure you want to go ahead?')){
                   this.assignLeadToDesigners(client_id,id ,index);
                  }else{
                    this.loaderService.display(false);
                  }
                 }
                 else{
                  this.assignLeadToDesigners(client_id,id ,index);
                 }
                },
            error => {
                  this.erroralert = true;
                  this.errorMessage=JSON.parse(error['_body']).message;
                  this.loaderService.display(false);
                  $(window).scrollTop(0);
                  setTimeout(function() {
                      this.erroralert = false;
                  }.bind(this), 5000);
            }
          );
      } else {
        document.getElementById("assigndropdown"+index).classList.add('inputBorder');
      }
  }


  sortBasedOnDesignerStatus(arr) {
    for(var index = 0;index <arr.length; index++) {
      if(!arr[index].assigned_to){
        this.usersList[index]['designerStatus'] = 'Not Assigned';
      } else {
        this.usersList[index]['designerStatus'] = 'Assigned';
      }
    }
    // this.sort('designerStatus');
  }



  update(i,projectId){
    var data = {
      'id':this.projecttask_id[i],
      'name':this.projecttask_name[i],
      'duration':this.projecttask_duration[i],
      'remarks':this.projecttask_remarks[i],
      'start_date':this.projecttask_start_date[i],
      'end_date':this.projecttask_end_date[i],
      'process_owner':this.projecttask_process_owner[i],
      'action_point':this.projecttask_action_point[i],
      'percent_completion':this.projecttask_percent_completion[i],
      'upstream_dependencies':this.projecttask_previous_dependency[i]
    }
    this.loaderService.display(true);
    this.schedulerService.editTask(projectId,this.projecttask_id[i],data).subscribe(
      res => {
        this.projecttask_duration[i] = res.project_task.duration;
        this.projecttask_remarks[i]= res.project_task.remarks;
        this.projecttask_action_point[i]=res.project_task.action_point;
        this.projecttask_percent_completion[i]= res.project_task.percent_completion;
        this.projecttask_process_owner[i]= res.project_task.process_owner;
        this.projecttask_end_date[i]=res.project_task.end_date;
        this.projecttask_start_date[i]= res.project_task.start_date;
        this.projecttask_previous_dependency[i]= res.project_task.upstream_dependencies;
        this.loaderService.display(false);
        this.successalertmodal = true;
             this.successMessagemodal = 'Task updated successfully! ';
            setTimeout(function() {
                  this.successalertmodal = false;
              }.bind(this), 15000);
      },
      err => {
        this.loaderService.display(false);
        
        this.erroralertmodal = true;
             this.errorMessagemodal = JSON.parse(err['_body']).message;
            setTimeout(function() {
                  this.erroralertmodal = false;
              }.bind(this), 15000);
      }
    );
  };

  deletTask(i,userId,projectId){
    if(confirm('Are you sure you want to delete this task?')== true) {
      this.loaderService.display(true);
      this.schedulerService.deleteTask(projectId,this.projecttask_id[i]).subscribe(
        res => {
          this.getUserDetails(userId,projectId);
          // this.loaderService.display(false);
          this.successalertmodal = true;
          this.successMessagemodal = 'Deleted successfully! ';
          setTimeout(function() {
                this.successalertmodal = false;
            }.bind(this), 15000);
        },
        err => {
          this.loaderService.display(false);
          this.erroralertmodal = true;
          this.errorMessagemodal = JSON.parse(err['_body']).message;
          setTimeout(function() {
            this.erroralertmodal = false;
          }.bind(this), 15000);
        }
      );
    }
  }

  addTask(userId,projectId,data) {
    this.loaderService.display(true);
    this.schedulerService.addTask(projectId,data).subscribe(
      res => {
        document.getElementById("addtakformtable").style.display="none";
        this.getUserDetails(userId,projectId);
        //this.loaderService.display(false);
        this.addTaskForm.reset();
        this.successalertmodal = true;
             this.successMessagemodal = 'Task added successfully! ';
            setTimeout(function() {
                  this.successalertmodal = false;
              }.bind(this), 15000);
        //$.notify('Added Successfully');
      },
      err => {
        this.loaderService.display(false);
        this.erroralertmodal = true;
             this.errorMessagemodal = JSON.parse(err['_body']).message;
            setTimeout(function() {
                  this.erroralertmodal = false;
              }.bind(this), 15000);
        
      }
    );
  }

  showAddtaskForm(){
    document.getElementById("addtakformtable").style.display="table";
  }
    cancelAddtaskForm(){
      document.getElementById("addtakformtable").style.display="none";
      this.addTaskForm.reset();
    }

  taskDetails(){
    if($(".addClass").hasClass("hideClass")) {
          $(".addClass").removeClass("hideClass");
    }
      $(".upload0").addClass("actBtn");
      $(".upload1").removeClass("actBtn");
      $(".upload2").removeClass("actBtn");
      $(".addClass1").addClass("hideClass");
      $(".addClass2").addClass("hideClass");
  }

  ganttchartDetails(){
    if($(".addClass1").hasClass("hideClass")) {
        $(".addClass1").removeClass("hideClass");
    }
    $(".upload1").addClass("actBtn");
      $(".addClass").addClass("hideClass");
      $(".addClass2").addClass("hideClass");
      $(".upload0").removeClass("actBtn");
      $(".upload2").removeClass("actBtn");
  }

    questionnaire(){
      if($(".addClass2").hasClass("hideClass")) {
          $(".addClass2").removeClass("hideClass");
      }
      $(".upload2").addClass("actBtn");
        $(".addClass").addClass("hideClass");
        $(".addClass1").addClass("hideClass");
        $(".upload0").removeClass("actBtn");
        $(".upload1").removeClass("actBtn");
    }

    getUserDetails(userId,projectId){
      this.loaderService.display(true);
      //this.cmService.getUserDetails(userId).subscribe(
      this.schedulerService.getProjectTasksForExcel(projectId).subscribe(
          res => {
            this.projecttask_name.length = 0;
            this.projecttask_id.length = 0;
            this.projecttask_duration.length = 0;
            this.projecttask_percent_completion.length = 0;
            this.projecttask_previous_dependency.length = 0;
            this.projecttask_remarks.length = 0;
            this.projecttask_start_date.length =0;
            this.projecttask_end_date.length =0;
            this.projecttask_process_owner.length = 0;
            this.projecttask_action_point.length = 0;
            Object.keys(res).map((key)=>{ this.userData= res[key];});
            if(this.userData != null && this.userData.length != 0){
              for(var j =0; j<this.userData.length; j++) {
                this.projecttask_duration.push(this.userData[j].duration);
                this.projecttask_name.push(this.userData[j].name);
                this.projecttask_id.push(this.userData[j].id);
                this.projecttask_percent_completion.push(this.userData[j].percent_completion);
                this.projecttask_previous_dependency.push(this.userData[j].upstream_dependencies);
                this.projecttask_remarks.push(this.userData[j].remarks);
                this.projecttask_action_point.push(this.userData[j].action_point);
                this.projecttask_process_owner.push(this.userData[j].process_owner);
                this.projecttask_start_date.push(this.userData[j].start_date);
                this.projecttask_end_date.push(this.userData[j].end_date);
              }
            }
            //data-toggle="modal" data-target="#userModal"

            this.loaderService.display(false);
          },
          err => {
            
            this.loaderService.display(false);
            // this.erroralert = true;
            // this.errorMessage = JSON.parse(err['_body']).message;
            // setTimeout(function() {
            //         this.erroralertmodal = false;
            //     }.bind(this), 15000);

          }
       );
    }

    project_tasks : any;
    getTaskList(projectId) {
     this.project_tasks = [];
     this.loaderService.display(true);
     this.schedulerService.getProjectTasksForExcel(projectId).subscribe(
        res => {
          Object.keys(res).map((key)=>{ this.project_tasks = res[key]; })
            this.project = {
              'id': <string>this.project_tasks[0]['project'].id,
              'name': <string>this.project_tasks[0]['project'].name,
              'startDate': this.project_tasks[0]['project'].created_at,
              'tasks' : []
            }
           this.startDateForGanttChart = new Date(this.project_tasks[0].actual_start);
           this.endDateForGanttChart = new Date(this.project_tasks[0].actual_end);
            for(var index = 0; index < this.project_tasks.length; index++){
              if(this.startDateForGanttChart >= new Date(this.project_tasks[index].actual_start)) {
                this.startDateForGanttChart = new Date(this.project_tasks[index].actual_start);              }
              if(this.endDateForGanttChart < new Date(this.project_tasks[index].actual_end)) {
                this.endDateForGanttChart = new Date(this.project_tasks[index].actual_end);
              }
              var obj = {
                'id' : <string>this.project_tasks[index].id,
                'treePath' : <string>this.project_tasks[index].name,
                'parentId' : this.project_tasks[index].parentId,
                'name' : <string>this.project_tasks[index].name,
                'resource' : <string>this.project_tasks[index].resource,
                'percentComplete' : this.project_tasks[index].percent_completion,
                'start' : new Date(this.project_tasks[index].actual_start),
                'end' : new Date(this.project_tasks[index].actual_end),
                'status' : this.project_tasks[index].status
              }
              this.project.tasks.push(obj);
            }
          this.options = {
                scale: {
                  start: new Date(this.startDateForGanttChart.getFullYear(),this.startDateForGanttChart.getMonth(),this.startDateForGanttChart.getDate()),
                  end: new Date(this.endDateForGanttChart.getFullYear(), this.endDateForGanttChart.getMonth(), this.endDateForGanttChart.getDate())
              },
              zooming: Zooming[Zooming.days]
          };

          //project: Project = this.formattedProjectTasksObj;
          //this.ganttChart();
          this.loaderService.display(false);
        },
        err =>{
          
          this.loaderService.display(false);
        }
      );
    }

    clearModalData() {
      this.project_tasks = undefined;
      this.userData = undefined;
    }

    groupData(array: any[], f: any): any[] {
        var groups = {};
        array.forEach((o: any) => {
            var group = JSON.stringify(f(o));

            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map((group: any) => {
            return groups[group];
        });
    }

    createTask(element: any) {
        var selectedStatus = element.options[element.selectedIndex].value;

        var parentTask = {
            'id': 'parent_task_' + Math.random(),
            'parentId': 'parent_task',
            'treePath': 'parent_task',
            'name': 'parent_task',
            'percentComplete': 0,
            'start': new Date('2017-01-01T03:30:00.0Z'),
            'end': new Date('2017-01-01T12:45:00.0Z'),
            'status': selectedStatus
        }
        this.project.tasks.push(parentTask);

        var childTask = {
            'id': 'child_task_' + Math.random(),
            'parentId': 'ea2a8d86-1d4b-4807-844d-d5417fcf618d',
            'treePath': 'parent 1/child3',
            'name': 'child3',
            'percentComplete': 0,
            'start': new Date('2017-01-01T03:30:00.0Z'),
            'end': new Date('2017-01-01T12:45:00.0Z'),
            'status': selectedStatus
        }
        this.project.tasks.push(childTask);

    }

    updateTasks() {
        for (var i = 0; i < this.project.tasks.length; i++) {
            let task = this.project.tasks[i];

            let progress = setInterval(function () {
                if (task.percentComplete === 100) {
                    task.status = "Completed";
                    clearInterval(progress);
                } else {
                    if (task.percentComplete === 25) {
                        task.status = "Warning";
                    } else if (task.percentComplete === 50) {
                        task.status = "Error";
                    } else if (task.percentComplete === 75) {
                        task.status = "Information";
                    }

                    task.percentComplete += 1;
                }
            }, 200);
        }
    }

    loadBigDataSet() {
        var tasks = [];

        for (var i = 11; i < 1000; i++) {
            var task = {
                id: `parent${i}`,
                name: 'task testing',
                percentComplete: 0,
                start: new Date(),
                end: new Date(),
                status: ''
            }

            tasks.push(task);
        }

        this.project.tasks.push(...tasks);
    }

    gridRowClicked(event) {
        
    }

    userQuestionnaireDetails;
    getUserQuestionnaireDetails(customerId){
      this.loaderService.display(true);
      this.leadService.getRecordNotesQuestionnaire(customerId).subscribe(
        res=>{
          Object.keys(res).map((key)=>{ res= res[key];});
          this.userQuestionnaireDetails = res;
          if(this.userQuestionnaireDetails!= null && this.userQuestionnaireDetails.length != 0){
            this.setQuestionnaireDetails(this.userQuestionnaireDetails[0]);
          } else {
            this.updateLeadquestionnaireForm.reset();
            this.updateLeadquestionnaireForm.controls['customer_name'].setValue(this.customerNameModal);
            document.getElementById('possesiondateupdate').style.display='none';
            document.getElementById('floorplanQuestionnaire').style.display = 'none';
          }
          this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
          
        }
       );
    }

    setQuestionnaireDetails(note_records){
      if(note_records!=null){
        if(note_records.customer_name!= null){
          this.updateLeadquestionnaireForm.controls['customer_name'].setValue(note_records.customer_name);
        } else {
          this.updateLeadquestionnaireForm.controls['customer_name'].setValue(this.customerNameModal);
        }
          this.updateLeadquestionnaireForm.controls['phone'].setValue(note_records.phone);
          this.updateLeadquestionnaireForm.controls['project_name'].setValue(note_records.project_name);
          this.updateLeadquestionnaireForm.controls['city'].setValue(note_records.city);
          this.updateLeadquestionnaireForm.controls['location'].setValue(note_records.location);
          this.updateLeadquestionnaireForm.controls['project_type'].setValue(note_records.project_type);
          this.updateLeadquestionnaireForm.controls['accomodation_type'].setValue(note_records.accomodation_type);
          this.updateLeadquestionnaireForm.controls['remarks_of_sow'].setValue(note_records.remarks_of_sow);
          this.updateLeadquestionnaireForm.controls['possession_status'].setValue(note_records.possession_status);
          this.updateLeadquestionnaireForm.controls['possession_status_date'].setValue(note_records.possession_status_date);
          this.updateLeadquestionnaireForm.controls['home_value'].setValue(note_records.home_value);
          this.updateLeadquestionnaireForm.controls['budget_value'].setValue(note_records.budget_value);
          this.updateLeadquestionnaireForm.controls['have_homeloan'].setValue(note_records.have_homeloan);
          this.updateLeadquestionnaireForm.controls['call_back_day'].setValue(note_records.call_back_day);
          this.updateLeadquestionnaireForm.controls['call_back_time'].setValue(note_records.call_back_time);
          this.updateLeadquestionnaireForm.controls['have_floorplan'].setValue(note_records.have_floorplan);
          //this.updateLeadquestionnaireForm.controls['lead_generator'].setValue(note_records.lead_generator);
          this.updateLeadquestionnaireForm.controls['additional_comments'].setValue(note_records.additional_comments);
          if(note_records.scope_of_work != null) {
              this.updateLeadquestionnaireForm.controls['scope_of_work']['controls']=[];
            for(var k=0;k<note_records.scope_of_work.length;k++){
              this.updateLeadquestionnaireForm.controls['scope_of_work']['controls'].push(new FormControl(note_records.scope_of_work[k]));
            }
        }

        if(note_records.have_floorplan == 'Yes'){
          document.getElementById('floorplanQuestionnaire').style.display = 'block';
        } if(note_records.have_floorplan == 'No'){
          document.getElementById('floorplanQuestionnaire').style.display = 'none';
        }
        if(note_records.possession_status=='Awaiting Possession'){
          document.getElementById('possesiondateupdate').style.display = 'block';
        }
        if(note_records.possession_status=='Possession Taken'){
          document.getElementById('possesiondateupdate').style.display = 'none';
        }
    }
    }

    fpQuestionnaireSelected(val){
      if(val == 'yes'){
        document.getElementById('floorplanQuestionnaire').style.display = 'block';
      } else {
        document.getElementById('floorplanQuestionnaire').style.display = 'none';
        this.floorplan_attachment_file = undefined;
        this.questionnaire_floorplan_basefile = undefined;
      }
  }

  scopeOfWorkSelected(val){
    if(val!='Remarks'){
      this.updateLeadquestionnaireForm.controls['remarks_of_sow'].setValue(undefined);
    }
  }

  onCheckChange(event,htmlElemName) {
      var updateFormArray : FormArray;
      if(htmlElemName== 'scope_of_work') {
        updateFormArray = this.updateLeadquestionnaireForm.get('scope_of_work') as FormArray;
      }
      /* Selected */
      if(event.target.checked){
        updateFormArray.push(new FormControl(event.target.value));
      }
      /* unselected */
      else{
        var j:number = 0;
        updateFormArray.controls.forEach((ctr: FormControl) => {
          if(ctr.value == event.target.value) {
            // Remove the unselected element from the arrayForm
            updateFormArray.removeAt(j);
            return;
          }

          j++;
        });
        if(event.target.value =='Remarks'){
          this.updateLeadquestionnaireForm.controls['remarks_of_sow'].setValue("");
        }
      }
    }

    questionnaire_floorplan_basefile: any;
    floorplan_attachment_file:any;

    onQuestionnaireFloorplanChange(event){
      this.questionnaire_floorplan_basefile = undefined;
      this.floorplan_attachment_file = event.srcElement.files[0];
      var re = /(?:\.([^.]+))?$/;
      var ext = re.exec(this.floorplan_attachment_file.name)[1];
      var fileReader = new FileReader();
      var base64;
      if(ext == 'jpg' || ext == 'jpeg' || ext=='png' || ext=='gif' || ext=='svg') {
        fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.questionnaire_floorplan_basefile = base64.result;
        };
      } else {
        document.getElementById('extErrorMsg').classList.remove('d-none');
      }
      fileReader.readAsDataURL(this.floorplan_attachment_file);
    }

    updateRecordNotesQuestionnaire(leadId,data){
      this.loaderService.display(true);
      this.updateLeadquestionnaireForm.controls['ownerable_id'].setValue(leadId);
      if(this.userQuestionnaireDetails !=null && this.userQuestionnaireDetails.length!=0){
        var noteRecordId = this.userQuestionnaireDetails.id || this.userQuestionnaireDetails[0].id;
        data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
        this.leadService.updateRecordNotesQuestionnaire(leadId,data,noteRecordId).subscribe(
            res => {
              this.successalertmodal = true;
              this.successMessagemodal = "Updated successfully !!";
              this.questionnaire_floorplan_basefile = undefined;
              this.floorplan_attachment_file = undefined;
               setTimeout(function() {
                     this.successalertmodal = false;
                }.bind(this), 10000);
              this.getUserQuestionnaireDetails(this.leadIDForModal);
              //Object.keys(res).map((key)=>{ this.leadRecordNotes= res[key];});
              this.loaderService.display(false);
            },
            err => {
              
              this.erroralertmodal = true;
              this.errorMessagemodal = JSON.parse(err['_body']).message;
              setTimeout(function() {
                     this.erroralertmodal = false;
                }.bind(this), 10000);
              this.loaderService.display(false);
            }
          );
      }


      if(this.userQuestionnaireDetails == null || (this.userQuestionnaireDetails !=null && this.userQuestionnaireDetails.length==0)){
        data['lead_floorplan'] = this.questionnaire_floorplan_basefile;

        this.leadService.postRecordNotesQuestionnaire(this.leadIDForModal,data).subscribe(
            res => {
                Object.keys(res).map((key)=>{ this.userQuestionnaireDetails= res[key];});
                this.floorplan_attachment_file = undefined;
                this.updateLeadquestionnaireForm.reset();
                //this.getUserQuestionnaireDetails(this.leadIDForModal);
                this.setQuestionnaireDetails(this.userQuestionnaireDetails);
                this.loaderService.display(false);
                this.successalertmodal = true;
                this.successMessagemodal = "Form submitted successfully!";
                setTimeout(function() {
                  this.successalertmodal = false;
                }.bind(this), 10000);
            },
            err => {
              
               this.erroralertmodal = true;
              this.errorMessagemodal = JSON.parse(err['_body']).message;
              this.loaderService.display(false);
              setTimeout(function() {
                  this.erroralertmodal = false;
                }.bind(this), 10000);
            }
          );
      }
  }

  bookingFormDetails;
  showBookingForm1Flag = false;
  showBookingForm2Flag = false;
    getDesignerBookingFormForLead(projectId){
      this.loaderService.display(true);
      this.designerService.getDesignerBookingForm(projectId).subscribe(
        res => {
          this.bookingFormDetails = res;
          this.setBookingFormControlsValue(this.bookingFormDetails.designer_booking_form);
          this.loaderService.display(false);
        },
        err => {
          
          this.loaderService.display(false);
        }
      );
    }

    setBookingFormControlsValue(obj){
      if(obj.general.customer_name==null){
        this.designerBookingForm1.controls['customer_name'].setValue(this.customerNameModal);
      }
      else {
        this.designerBookingForm1.controls['customer_name'].setValue(obj.general.customer_name);
      }
      this.designerBookingForm1.controls['customer_age'].setValue(obj.general.customer_age);
      this.designerBookingForm1.controls['age_house'].setValue(obj.general.age_house);
      this.designerBookingForm1.controls['all_at_once'].setValue(obj.general.all_at_once);
      this.designerBookingForm1.controls['budget_range'].setValue(obj.general.budget_range);
      this.designerBookingForm1.controls['color_tones'].setValue(obj.general.color_tones);
      this.designerBookingForm1.controls['design_style_tastes'].setValue(obj.general.design_style_tastes);
      this.designerBookingForm1.controls['discuss_in_person'].setValue(obj.general.discuss_in_person);
      this.designerBookingForm1.controls['electrical_points'].setValue(obj.general.electrical_points);
      this.designerBookingForm1.controls['enhancements'].setValue(obj.general.enhancements);
      this.designerBookingForm1.controls['false_ceiling'].setValue(obj.general.false_ceiling);
      this.designerBookingForm1.controls['family_profession'].setValue(obj.general.family_profession);
      this.designerBookingForm1.controls['functionality'].setValue(obj.general.functionality);
      this.designerBookingForm1.controls['house_negative_features'].setValue(obj.general.house_negative_features);
      this.designerBookingForm1.controls['house_positive_features'].setValue(obj.general.house_positive_features);
      this.designerBookingForm1.controls['inspiration'].setValue(obj.general.inspiration);
      this.designerBookingForm1.controls['lifestyle'].setValue(obj.general.lifestyle);
      this.designerBookingForm1.controls['mood'].setValue(obj.general.mood);
      this.designerBookingForm1.controls['profession'].setValue(obj.general.profession);
      this.designerBookingForm1.controls['special_needs'].setValue(obj.general.special_needs);
      this.designerBookingForm1.controls['storage_space'].setValue(obj.general.storage_space);
      this.designerBookingForm1.controls['theme'].setValue(obj.general.theme);
      this.designerBookingForm1.controls['vastu_shastra'].setValue(obj.general.vastu_shastra);
      this.designerBookingForm1.controls['mk_age'].setValue(obj.modular_kitchen.mk_age);
      this.designerBookingForm1.controls['mk_appliances'].setValue(obj.modular_kitchen.mk_appliances);
      this.designerBookingForm1.controls['mk_cabinet_finishing'].setValue(obj.modular_kitchen.mk_cabinet_finishing);
      this.designerBookingForm1.controls['mk_cooking_details'].setValue(obj.modular_kitchen.mk_cooking_details);
      this.designerBookingForm1.controls['mk_countertop_materials'].setValue(obj.modular_kitchen.mk_countertop_materials);
      this.designerBookingForm1.controls['mk_family_eating_area'].setValue(obj.modular_kitchen.mk_family_eating_area);
      this.designerBookingForm1.controls['mk_guest_frequence'].setValue(obj.modular_kitchen.mk_guest_frequence);
      this.designerBookingForm1.controls['mk_gut_kitchen'].setValue(obj.modular_kitchen.mk_gut_kitchen);
      this.designerBookingForm1.controls['mk_improvements'].setValue(obj.modular_kitchen.mk_improvements);
      this.designerBookingForm1.controls['mk_lifestyle'].setValue(obj.modular_kitchen.mk_lifestyle);
      this.designerBookingForm1.controls['mk_mood'].setValue(obj.modular_kitchen.mk_mood);
      this.designerBookingForm1.controls['mk_same_layout'].setValue(obj.modular_kitchen.mk_same_layout);
        this.designerBookingForm1.controls['mk_special_requirements'].setValue(obj.modular_kitchen.mk_special_requirements);
      this.designerBookingForm1.controls['mk_storage_patterns'].setValue(obj.modular_kitchen.mk_storage_patterns);

      if(obj.general.customer_age==null && obj.general.age_house == null && obj.general.all_at_once==null &&
        obj.general.budget_range == null && obj.general.color_tones == null && obj.general.design_style_tastes==null &&
        obj.general.discuss_in_person == null && obj.general.electrical_points== null && obj.general.enhancements == null &&
        obj.general.false_ceiling == null && obj.general.family_profession == null && obj.general.functionality==null &&
        obj.general.house_negative_features == null && obj.general.house_positive_features == null && obj.general.inspiration ==null &&
        obj.general.lifestyle == null && obj.general.mood==null && obj.general.profession == null && obj.general.special_needs==null &&
        obj.general.storage_space==null && obj.general.theme==null && obj.general.vastu_shastra ==null) {
          document.getElementById('designerBookingForm1Button').innerHTML = 'SUBMIT';
      } else {
          document.getElementById('designerBookingForm1Button').innerHTML = 'UPDATE';
      }

      if(obj.modular_kitchen.mk_age==null && obj.modular_kitchen.mk_appliances==null && obj.modular_kitchen.mk_cabinet_finishing == null &&
        obj.modular_kitchen.mk_cooking_details==null && obj.modular_kitchen.mk_countertop_materials==null &&
        obj.modular_kitchen.mk_family_eating_area==null && obj.modular_kitchen.mk_guest_frequence==null &&
        obj.modular_kitchen.mk_gut_kitchen==null && obj.modular_kitchen.mk_improvements==null &&
        obj.modular_kitchen.mk_lifestyle==null && obj.modular_kitchen.mk_mood==null &&
        obj.modular_kitchen.mk_same_layout==null && obj.modular_kitchen.mk_special_requirements==null &&
        obj.modular_kitchen.mk_storage_patterns==null && obj.general.customer_age==null && obj.general.profession==null &&
        obj.general.family_profession == null) {
          document.getElementById('designerBookingForm2Button').innerHTML = 'SUBMIT';
      } else {
          document.getElementById('designerBookingForm2Button').innerHTML = 'UPDATE';
      }

    }
    abcd;
    dropLead(leadId,formval,rowId?){
      // var retVal = prompt("Are you sure you want to drop this lead? ", "Enter Remarks");
      // if(retVal != null){
      //   this.loaderService.display(true);
      //   if(retVal == 'Enter Remarks') {
      //     retVal = '';
      //   }
      //
      // }
      this.abcd=formval;
      this.loaderService.display(true);
      this.cmService.droppedLead(leadId,formval).subscribe(
          res => {
            $('#dropLeadModal').modal('hide');
            this.successalert = true;
            this.successMessage = 'Lead dropped successfully!';
            this.dropLeadForm.reset();
            this.dropLeadForm.controls['drop_reason'].setValue("");
            this.getUserList();
            this.dropdownDropType='Select Reason';
            this.dropleadId = undefined;
            $(window).scrollTop(0);
            setTimeout(function() {
              this.successalert = false;
            }.bind(this), 5000);
          },
          err => {
            this.erroralert = true;
            this.loaderService.display(false);
            this.errorMessage = JSON.parse(err['_body']).message;
            $(window).scrollTop(0);
            setTimeout(function() {
              this.erroralert = false;
            }.bind(this), 5000);
          }
        );
    }

  filtercol1Val : any = 'all';
  filtercol2Val:any = '';
    from_date:any;
    to_date:any;
    filteredleads:any[];

    filterColumDropdownChange(colVal) {
      // this.from_date = undefined;
      // this.to_date = undefined;
      if(colVal == 'all'){
        this.designer_id = ""
        this.from_date = "";
        this.to_date = "";
        document.getElementById('fromDateFilter').classList.add('d-none');
        document.getElementById('toDateFilter').classList.add('d-none');
        document.getElementById('designer_list').setAttribute('style','display:none');
      } else if(colVal == 'assigned_at') {
          this.filtercol2Val = '';
          this.designer_id = ""
          document.getElementById('fromDateFilter').classList.remove('d-none');
          document.getElementById('toDateFilter').classList.remove('d-none');
          document.getElementById('designer_list').setAttribute('style','display:none');
      } else if(colVal == 'customer_meeting_time') {
          this.filtercol2Val = '';
          this.designer_id = ""
          document.getElementById('fromDateFilter').classList.remove('d-none');
          document.getElementById('toDateFilter').classList.remove('d-none');
          document.getElementById('designer_list').setAttribute('style','display:none');
      }else if(colVal == 'list_designer') {
          this.myDesigners();
          this.from_date = "";
          this.to_date = "";
          document.getElementById('fromDateFilter').classList.add('d-none');
          document.getElementById('toDateFilter').classList.add('d-none');
          document.getElementById('designer_list').setAttribute('style','display:inline-block');
      }
      else if(colVal == 'list_city') {
         document.getElementById('fromDateFilter').classList.add('d-none');
          document.getElementById('toDateFilter').classList.add('d-none');
          document.getElementById('designer_list').setAttribute('style','display:none');
          document.getElementById('city_list').setAttribute('style','display:inline-block');
        
        this.getCityList();
      }
      else{
        this.from_date = "";
        this.to_date = "";
        this.designer_id = "" ;
        document.getElementById('fromDateFilter').classList.add('d-none');
        document.getElementById('toDateFilter').classList.add('d-none');
        document.getElementById('designer_list').setAttribute('style','display:none');
      }
    }

    myDesigners(){
      this.loaderService.display(true);
      this.cmService.getDesignerList(this.CMId).subscribe(
        res => {
          this.my_designers = res.designer_list;
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

    downloadExcel(){
      this.cmService.exportLeadsWithFilters(this.from_date, this.to_date, this.filtercol1Val, this.lead_status, this.designer_id, this.CMId).subscribe(
        res =>{
        
        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        var b64Data =  res._body;

        var blob = this.b64toBlob(b64Data, contentType,512);
        var blobUrl = URL.createObjectURL(blob);
        // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let dwldLink = document.createElement("a");
        // let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", blobUrl);
        dwldLink.setAttribute("download", "lead.xlsx");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
        },
        err => {
          
        // this.erroralert = true;
        //   this.errorMessage = <any>JSON.parse(err['_body']).message;
        //   setTimeout(function() {
        //     this.erroralert = false;
        //    }.bind(this), 2000);
        }
      );
    }

    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

    filterSubmit(){
      this.loaderService.display(true);
      if(this.filtercol1Val == 'all'){
        this.getUserList(1);
      } else if(this.filtercol1Val == 'assigned_at' || this.filtercol1Val == 'customer_meeting_time'){
        this.cmService.filteredData(this.filtercol1Val,this.from_date,this.to_date,this.lead_status,this.CMId, 1)
        .subscribe(
          res => {
            
            this.headers_res= res.headers._headers;
            this.per_page = this.headers_res.get('x-per-page');
            this.total_page = this.headers_res.get('x-total');
            this.current_page = this.headers_res.get('x-page');

            res= res.json();
            
            this.loaderService.display(false);
            this.usersList = res.leads;
              this.sortBasedOnDesignerStatus(this.usersList);
          },
          err => {
            this.loaderService.display(false);
            
          }
        );
      }
      else if (this.filtercol1Val == 'follow_up' || this.filtercol1Val == 'not_contactable' || this.filtercol1Val == 'todays_lead' || this.filtercol1Val == 'old_lead' || this.filtercol1Val == 'list_designer' || this.filtercol1Val == 'lost' || this.filtercol1Val == 'wip') {       
        this.cmService.filterDataForNC(this.filtercol1Val,this.from_date,this.to_date, this.lead_status,this.CMId, this.designer_id, 1)
        .subscribe(
          res => {
            
            this.headers_res= res.headers._headers;
            this.per_page = this.headers_res.get('x-per-page');
            this.total_page = this.headers_res.get('x-total');
            this.current_page = this.headers_res.get('x-page');

            res= res.json();

            this.loaderService.display(false);
            this.usersList = res.leads;
            
            this.sortBasedOnDesignerStatus(this.usersList);
          },
          err => {
            this.loaderService.display(false);
            
          }
        );

      }
    }

    closeModal(){
      if($(".addClass").hasClass("hideClass"))
    {
        $(".addClass").removeClass("hideClass");
    }
    $(".addClass1").addClass("hideClass");
    $(".addClass2").addClass("hideClass");
    $(".upload1").removeClass("actBtn");
    $(".upload2").removeClass("actBtn");
    $(".upload0").addClass("actBtn");
    this.leadIDForModal = undefined;
       this.projectIdForModal = undefined;
       this.customerIDModal = undefined;
       this.customerNameModal = undefined;
      this.userQuestionnaireDetails =undefined;
      this.bookingFormDetails = undefined;
    }
    CSQuestionnaire() {
      if($(".addClass").hasClass("hideClass"))
    {
        $(".addClass").removeClass("hideClass");
    }
    $(".addClass1").addClass("hideClass");
    $(".addClass2").addClass("hideClass");
    $(".upload1").removeClass("actBtn");
    $(".upload2").removeClass("actBtn");
    $(".upload0").addClass("actBtn");
    this.getUserQuestionnaireDetails(this.leadIDForModal);
    }
    bookingForm1Details() {
      if($(".addClass1").hasClass("hideClass"))
    {
        $(".addClass1").removeClass("hideClass");
    }
    $(".addClass").addClass("hideClass");
    $(".addClass2").addClass("hideClass");
    $(".upload0").removeClass("actBtn");
    $(".upload2").removeClass("actBtn");
    $(".upload1").addClass("actBtn");
    this.getDesignerBookingFormForLead(this.projectIdForModal);
    }
    bookingForm2Details(){
      if($(".addClass2").hasClass("hideClass"))
    {
        $(".addClass2").removeClass("hideClass");
    }
    $(".addClass1").addClass("hideClass");
    $(".addClass").addClass("hideClass");
    $(".upload0").removeClass("actBtn");
    $(".upload1").removeClass("actBtn");
    $(".upload2").addClass("actBtn");
    this.getDesignerBookingFormForLead(this.projectIdForModal);
    }

    attachment_file: any;
    basefile: any;
    onChange(event) {
      this.basefile = undefined;
     this.attachment_file = event.srcElement.files[0];

      var fileReader = new FileReader();
      var base64;
        fileReader.onload = (fileLoadedEvent) => {
         base64 = fileLoadedEvent.target;
         this.basefile = base64.result;
        };
      fileReader.readAsDataURL(this.attachment_file);
  }

  designerBookingForm1Submit(data,formName){
      this.loaderService.display(true);
      data['customer_name'] = (this.bookingFormDetails.designer_booking_form.general.name!=null)? this.bookingFormDetails.designer_booking_form.general.name : this.customerNameModal;
      data['project_id'] = this.projectIdForModal;
      data['inspiration_image'] = this.basefile;
      this.designerService.SubmitDesignerBookingForm(data,data['project_id']).subscribe(
        res => {
          this.designerBookingForm1.reset();
          this.bookingFormDetails = res;
          this.basefile = undefined;
          this.attachment_file = undefined;
          // this.getDesignerBookingFormForLead(this.projectIdForModal);
          this.setBookingFormControlsValue(this.bookingFormDetails.designer_booking_form);
          this.loaderService.display(false);
          this.successalertmodal = true;
          this.successMessagemodal = 'Form submitted successfully!';
              $('#questionnaireModal').scrollTop(0);
          setTimeout(function() {
                   this.successalertmodal = false;
              }.bind(this), 10000);
        },
        err => {
          this.loaderService.display(false);
          this.erroralertmodal = true;
          this.errorMessagemodal = JSON.parse(err['_body']).message;
          setTimeout(function() {
                  this.erroralertmodal = false;
              }.bind(this), 10000);
        }
      );
    }

    leadIDForModal; projectIdForModal; customerIDModal; customerNameModal;
    passDataToModal(LeadIDForModal,ProjectIdForModal,customerID, customerName){
      this.leadIDForModal = LeadIDForModal;
      this.projectIdForModal = ProjectIdForModal;
      this.customerIDModal = customerID;
      this.customerNameModal = customerName;
    }
    numberCheck(e) {
      if(!((e.keyCode > 95 && e.keyCode < 106)
          || (e.keyCode > 47 && e.keyCode < 58)
          || e.keyCode == 8 || e.keyCode == 39 ||
          e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9
          || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
        return false;
      }
    }

    possesionStatusSelected(val,formName) {
      if(val == 'Awaiting Possession' && formName=='updateQuestionnaire') {
        if(document.getElementById('possesiondateupdate')!=null){
          document.getElementById('possesiondateupdate').style.display = 'block';
        }
      }

      if(val =='Possession Taken' && formName=='updateQuestionnaire') {
        if(document.getElementById('possesiondateupdate')!=null){
          document.getElementById('possesiondateupdate').style.display='none';
        }
        this.updateLeadquestionnaireForm.controls['possession_status_date'].setValue(undefined);
      }
  }

  leadLogs;
    Object;

  getLeadHistory(leadId){
    this.Object = Object;
    this.leadService.getLeadLog(leadId).subscribe(
      res => {
        
        this.leadLogs = res;
      },
      err => {
        
      }
    );
  }

    isDate(str){
      // format D(D)/M(M)/(YY)YY
      var dateFormat = /^\d{1,4}[\.|\/|-]\d{1,2}[\.|\/|-]\d{1,4}$/;

      if (dateFormat.test(str)) {
          // remove any leading zeros from date values
          str = str.replace(/0*(\d*)/gi,"$1");
          var dateArray = str.split(/[\.|\/|-]/);

                // correct month value
          dateArray[1] = dateArray[1]-1;

          // correct year value
          if (dateArray[2].length<4) {
              // correct year value
              dateArray[2] = (parseInt(dateArray[2]) < 50) ? 2000 + parseInt(dateArray[2]) : 1900 + parseInt(dateArray[2]);
          }

          var testDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
          if (testDate.getDate()!=dateArray[0] || testDate.getMonth()!=dateArray[1] || testDate.getFullYear()!=dateArray[2]) {
              return false;
          } else {
              return true;
          }
      } else {
            return false;
      }
      // return (new Date(str).toString() !== "Invalid Date" ) ? true : false;
    }
  newVar;
  newVarDelay;
  onStatusChange(projectId,customerId, status){
    
    
    

      this.statusDetails["customer_status"] = status;
      this.statusDetails["customer_id"] = customerId;
      this.statusDetails["project_id"] = projectId;
 
 
 


      this.loaderService.display(true);

      if(this.statusDetails["customer_status"] == "follow_up"){
        $("#followup-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
        this.loaderService.display(false);
        $("#statusModal").modal("show");
      }else if(this.statusDetails["customer_status"] == "lost"){
        this.loaderService.display(false);
        $("#loststatusModal").modal("show");
        this.statusChangeForm.reset();
      }
      else if(this.statusDetails["customer_status"] == 'delayed_possession'){
        for( var i =0;i<this.usersList.length;i++){
          if(this.usersList[i].project_details){
            if(this.usersList[i].project_details.id == projectId ){
              if(this.usersList[i].delayed_date && this.usersList[i].project_details.status == 'delayed_possession'){
                 $("#startDate").val(this.usersList[i].delayed_date);
                 this.newVar = this.usersList[i].delayed_date;
                 
                 
                
              }
             


            }

          }

        }
        
        $("#delayedModal").modal("show");
        this.loaderService.display(false);



      }
      else if(this.statusDetails["customer_status"] == 'delayed_project'){
        for( var i =0;i<this.usersList.length;i++){
          if(this.usersList[i].project_details){
            if(this.usersList[i].project_details.id == projectId ){
              if(this.usersList[i].delayed_date && this.usersList[i].project_details.status == 'delayed_project'){
                 $("#delayProjectDate").val(this.usersList[i].delayed_date);
                 this.newVarDelay = this.usersList[i].delayed_date;
                 
              }
             


            }
          }
        }

        $("#delayedProjectModal").modal("show");
        this.loaderService.display(false);



      }

      
      else{
        this.updateNewStatus();
      }
    }
 
  reasonForLostDropdownChange(val){
      this.statusChangeForm.controls['lost_remarks'].setValidators([Validators.required]);
      this.statusChangeForm.controls['lost_remarks'].updateValueAndValidity();
    }
    dropdownType;
    submitLeadType(value){
      this.dropdownType=value;
      this.statusChangeForm.controls['lost_remarks'].setValidators([Validators.required]);
      this.statusChangeForm.controls['lost_remarks'].updateValueAndValidity();
    }
    dropdownDropType;
    submitDropLeadType(type){
      this.dropdownDropType=type;
      this.dropLeadForm.controls['drop_reason'].setValue(this.dropdownDropType);
    }

  onLostSubmit(){
    this.loaderService.display(true);
    $("#loststatusModal").modal("hide");
    this.statusDetails["reason_for_lost"] = $("#lost_reason").val();
    this.statusDetails['remarks']= $("#lost_remarks").val();
    //this.statusDetails['reason']=$("#reasonable_lost").val();
    this.dropdownType='Select Reason';
    this.updateNewStatus();
  }

  onCallbackChange(){ 
    
    if($("#followup-details").val() != ''){
     this.loaderService.display(true);
     $("#statusModal").modal("hide");

    this.statusDetails["customer_meeting_time"] = $("#followup-details").val();
    this.statusDetails['remarks']= $("#followup_remarks").val();
    this.updateNewStatus();

    }
    else{
      this.erroralert = true;
        this.errorMessage = 'CallBack Date is required';
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
          
    }

    
  }
  onCallbackChange1(status){
    this.loaderService.display(true);
    $("#notContactableModal").modal("hide");
    this.statusDetails['customer_meeting_time'] =$('#notcontactable-details').val();
    this.updateNewStatus();

    

  }  

  updateNewStatus(){
    
    this.designerService.statusUpdate(this.statusDetails,this.CMId).subscribe(
        res => {

          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'Status updated successfully!';
          this.getUserList();
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
  getCityList(){
    this.loaderService.display(true);
    this.cmService.getCmCityList().subscribe(
      res=>{
        
        this.loaderService.display(false);

      },
      err=>{
        
          this.loaderService.display(false);

      });
  }


  /*Send Smart Report Through Email function*/ 
  smartShareEmail(){
    this.designerService.smartShareEmail().subscribe(
    res => {
      this.successalert = true;
      this.successMessage = 'Email Send successfully!';
      setTimeout(function() {
        this.successalert = false;
      }.bind(this), 10000);
    },
    err => {

      this.erroralert = true;
      this.errorMessage = JSON.parse(err['_body']).message;
    }
    )
  }

  /*Smart Report History*/ 
  smartShareHistory(lead_id){
    this.designerService.smartShareHistory(lead_id).subscribe(
    res => {
      this.smartshareHistoryList = res.smart_histories;
      
      this.successalert = true;
    },
    err => {
      this.erroralert = true;
    }
    );
  }
  // Method after submit the date for delay possession
  onCallbackChangeForDelay(){
    if($("#startDate").val() != ''){
     this.loaderService.display(true);
     this.statusDetails["customer_meeting_time"] = $("#startDate").val();
     $('#delayedModal').modal('hide');
     this.updateNewStatus();

    }
    else{
      this.erroralert = true;
        this.errorMessage = 'Delayed Date is required';
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
          
    }

  }
  // Method after submit the date for delay project
  onCallbackChangeForDelayProject(){
    if($("#delayProjectDate").val() != ''){
     this.loaderService.display(true);
     this.statusDetails["customer_meeting_time"] = $("#delayProjectDate").val();
     $('#delayedProjectModal').modal('hide');
     this.updateNewStatus();

    }
    else{
      this.erroralert = true;
        this.errorMessage = 'Delayed Project Date is required';
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
          
    }
  } 
  // clear  the value of input type date field for delayed possession modal
  removeValueFromDelayedProject(){
    this.newVarDelay = '';
  } 
  // clear  the value of input type date field for delayed project modal
  removeValueFromDelayedDate(){
    this.newVar = '';
  }

  // Method which is called whenever input type date is focused to open calander
  callChangeNew(){
    $('.date-picker').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'mm/yy',
        minDate: '+3M',
        onClose: function(dateText, inst) { 
            
            
            
            function isDonePressed(){
                            return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
                        }

                        if (isDonePressed()){

                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                            $(this).datepicker('setDate', new Date(year, month, 1));
                             

                        }
            
            
          
        }
    }).focus(function() {
        $('#startDate','#delayProjectDate').datepicker("show");
    }).focus();
  }
  
  addAlternateNumberForm(){
    this.showAlternateForm = !this.showAlternateForm;
    this.fields=[];
    this.staticFields.forEach(elem =>{
        this.fields.push(elem);
    });
    this.alternateNumberForm = this.dynamicFormService.toFormGroup(this.fields);
  }
} 
