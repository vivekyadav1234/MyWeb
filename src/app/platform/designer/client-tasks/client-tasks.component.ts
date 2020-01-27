import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { DesignerService } from '../designer.service';

import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-client-tasks',
  templateUrl: './client-tasks.component.html',
  styleUrls: ['./client-tasks.component.css'],
  providers: [ DesignerService ]
})
export class ClientTasksComponent implements OnInit {
  selectSection = 'outstanding';
  shapeImage = true;
  exclamImage = false;
  taskList = [];
  PreTen = [];
  projectId;
  projectTaskCount;

  constructor(private router: Router,
    private route : ActivatedRoute, 
    private loaderService : LoaderService,
    private designerService : DesignerService,
    private formBuilder: FormBuilder
    
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      
      

    });
    this.loaderService.display(false);
    this.getTaskList();
    this.getProjectTaskCount();
  }
  //   cards for tasks count
  selectedSection(tasks){
    if( tasks == 'outstanding'){
      this.shapeImage = true;
      this.exclamImage = false;

    }
    else if( tasks == 'overdue-task'){
      this.exclamImage = true;

    }
    else{
      this.shapeImage = false;
      this.exclamImage = false;

    }
    
    this.selectSection = tasks;
    



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
  lead_id;

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



  convertToAbs(number){
    return Math.abs(number);
  }

}
