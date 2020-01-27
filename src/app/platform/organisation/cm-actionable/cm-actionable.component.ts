import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { CalenderService } from '../../calender/calender.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
declare var $:any;

@Component({
  selector: 'app-cm-actionable',
  templateUrl: './cm-actionable.component.html',
  styleUrls: ['./cm-actionable.component.css'],
  providers: [CommunitymanagerService,DesignerService,LeadService,CalenderService]
})
export class CmActionableComponent implements OnInit {

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
  designer_list:any;
  statusCountArr;

  constructor(
    private loaderService : LoaderService,
    private cmService : CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder:FormBuilder,
    private designerService:DesignerService,
    private route:ActivatedRoute,
    private calenderService:CalenderService
  ) {
      this.CMId = localStorage.getItem('userId');
      this.getUserCountsByDeadlines();
    }

  ngOnInit() {
  }
   ngAfterViewInit(){
    this.calenderService.fetchDesigner(localStorage.getItem("userId")).subscribe(
      designers=>{
        this.designer_list = designers.designer_list;

      },
      error => {
        

      }
      );
  }

  filterDesID;
  filterDesigner(event){
    var val = event.target.value;
    this.filterDesID = val;
    if(val == 'all'){

      this.getUserCountsByDeadlines();


    }
    else
    {
      this.loaderService.display(true);
      this.cmService.getUserCountsByStatus(val,this.CMId).subscribe(
      res => {
        this.statusCountArr = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);

      }


      );
    }
    

   
  }

  

  getUserCountsByDeadlines() {
    this.loaderService.display(true);
    this.cmService.getUserCountsByActionable(this.CMId).subscribe(
      res => {
        this.statusCountArr = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

}
