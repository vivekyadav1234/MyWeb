import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { DesignerService } from '../designer.service';
import { LeadService } from '../../lead/lead.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $:any;


@Component({
  selector: 'app-designer-boq',
  templateUrl: './designer-boq.component.html',
  styleUrls: ['./designer-boq.component.css'],
  providers: [ DesignerService ,LeadService]
})
export class DesignerBoqComponent implements OnInit {

  selectSection = 'outstanding';
  shapeImage = true;
  exclamImage = false;
  quoteId;
  taskList:any;
  stage;
  parentBoq;
  flag = false;
  boqTaskCount;
  boq_reference;
  project_id;
  lead_id;
  lead_details:any;

  constructor(
    private router: Router,
    private route : ActivatedRoute, 
    private loaderService : LoaderService,
    private designerService : DesignerService,
    private formBuilder: FormBuilder,
    public leadService : LeadService,


    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.quoteId = params['quoteId'];
     
    });
  

    this.route.queryParams.subscribe(params => {
      this.stage = params['stage'];
      
    });

    if(this.stage == 'tenPercent'){
      this.flag = true;
      
      this.getBoqTaskLst(this.quoteId);
      $('.rect2').css('cursor','not-allowed');
    }
    else{
      this.getBoqTaskLstForTenToForty();
      this.stage = 'tenForty';
    }


    this.getBoqTaskCount();
    
  }


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
  getBoqTaskCount(){
    this.designerService.getBoqTaskCount(this.quoteId).subscribe(
      res=>{
        
        this.boqTaskCount = res.counts;
        

      },
      err=>{
        

      })

  }
  tenChange(){
    this.getBoqTaskLst(this.parentBoq);
    this.stage = 'tenPercent';
    

  }
  FortyChange(){
    this.getBoqTaskLstForTenToForty();
    this.stage = 'tenForty';
   

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

  convertToAbs(number){
    return Math.abs(number);
  }
  FortyChangeCheck(){
    
    this.stage = 'tenPercent';
    this.getBoqTaskLst(this.parentBoq);
  }

}
