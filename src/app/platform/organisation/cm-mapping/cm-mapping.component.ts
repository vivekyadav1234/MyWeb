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
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $:any;

@Component({
  selector: 'app-cm-mapping',
  templateUrl: './cm-mapping.component.html',
  styleUrls: ['./cm-mapping.component.css'],
  providers: [CommunitymanagerService,SchedulerService,DesignerService,LeadService]
})
export class CmMappingComponent implements OnInit {

  cmTagList:any;
  tagList:any;
  cmList:any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;
  rowList:any;
  colList:any;
  hashTag:any ={};
  hashTag1:any ={};
  tag_list=[];
  fileName : string;
  downloadFileUrl: string;

  constructor(
  	private loaderService : LoaderService,
    private cmService : CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder:FormBuilder,
    private schedulerService : SchedulerService,
    private designerService:DesignerService,
    private route:ActivatedRoute,
    private router: Router
  	) { }

  ngOnInit() {
  	this.getCmTags();
    this.getAllCmList();
    this.getAllTags();
    this.getRepopulate();
  }
  
  getCmTags(){
  	this.cmService.getCmTags().subscribe(res=>{
      this.rowList = res.cm_tag_mapping;
      for(let obj of this.rowList){
        this.hashTag1[obj.cm_id] = obj.tags
      }
      

  	},
  	err=>{
      
  	});
  }
  getAllCmList(){
    this.cmService.getAllCmList().subscribe(res=>{
      
    },
    err=>{
      
    });

  }
  getRepopulate(){
    for(let obj of this.rowList){

    }
  }
  
  getAllTags(){
    this.cmService.getAllTags('lead').subscribe(res=>{

      this.colList = res.tags.filter(tag => tag.humanized_name !== "Both");

    },
    err=>{
      
    });

  }

  downloadFile(){
    this.cmService.downloadFile().subscribe(res=>{
      this.fileName = res.file_name;
      this.cmService.downloadFileAPICall(this.fileName);
    },
    err=>{
      
    });
  }
  
  restructureHash(event,cmId,tagId){
    var hash_key=Object.keys(this.hashTag1);
    if(event.target.checked == true){
      if(hash_key.includes(cmId.toString())){
        
        // this.tag_arr.push(tagId);
        // 
        (this.hashTag1[cmId]).push(tagId);
        // 
        // this.hashTag1[cmId]= x;
      }
      else{
        var tag_arr=[];
        tag_arr.push(tagId)
        this.hashTag1[cmId]= tag_arr;

      }

    }
    else{
      let index = this.hashTag1[cmId].indexOf(tagId);
       
       this.hashTag1[cmId].splice(index,1);
    }

    


   


  }
  submitMapping(){
    this.loaderService.display(true);
    this.cmService.submitTags(this.hashTag1).subscribe(
      res=>{
      this.loaderService.display(false);
       this.successalert = true;
      this.successMessage = 'Mapping Submitted successfully';
      setTimeout(function() {
           this.successalert = false;
      }.bind(this), 10000);
      

    },
    err=>{
      
    });


  }


}
