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
  selector: 'app-cm-designer-list',
  templateUrl: './cm-designer-list.component.html',
  styleUrls: ['./cm-designer-list.component.css'],
  providers: [CommunitymanagerService,SchedulerService,DesignerService,LeadService]
})
export class CmDesignerListComponent implements OnInit {
  CMId;
  cmDesignerList;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;
  addquestionnaireForm:FormGroup;
  designer_id;

  constructor(
    private loaderService : LoaderService,
    private cmService : CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder:FormBuilder,
    private schedulerService : SchedulerService,
    private designerService:DesignerService,
    private route:ActivatedRoute


  	) { 
    this.CMId = localStorage.getItem('userId');
  }

  ngOnInit() {
   this.getDesignerList();
   this.addquestionnaireForm = this.formBuilder.group({
      sections: this.formBuilder.array([]),
    });
  }
  getDesignerList(){
   this.cmService.getCmDesignerList(this.CMId).subscribe(
     res=>{
       this.cmDesignerList  = res.designers;
     },
     err=>{
      
     });
  }
  onStatusChange(event,designerId){

    this.loaderService.display(true);
    var value = event.target.value;
    this.cmService.designerStatusChange(designerId,value).subscribe(
      res=>{
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Status updated successfully!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
        this.getDesignerList();

    },err=>{
      
      this.erroralert = true;
      this.loaderService.display(false);
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 2000);

    });
  }
   count =  -1;
  selectDiv(value){
    this.count = value;

  }
  selectedDiv = 'view';
  selectViewDiv(value){
    //
   this.selectedDiv= value;
  }
  skipDivId;
  skipDiv(value){
    //
    this.count = value;
  }
  slectedSet;
  skipQuestion(data){
    this.slectedSet = data;
    $('#skipModal').modal('hide');

  }
  closeDiv(){
    var val = this.count;
    this.count = val -1;
  }

  getProjets(form){
    return form.get('projects').controls;
  }
  questionnaireData;
  getDpQuestionnaire(desid){
    this.count = -1;
    this.viewProfile(desid);
    this.designer_id = desid;
    //
    this.loaderService.display(true);
    this.designerService.getAnswerIndex(desid).subscribe(
      res=>{
        if(res!=null){
          this.questionnaireData= res.dp_questionnaire;
        } else {
          this.questionnaireData= res;
        }
        this.getQuestionDetails(desid);
        this.loaderService.display(false);
    },err=>{
      
      this.loaderService.display(false);
    });
  }

  questionList = [];
  getQuestionDetails(desid){   
    this.loaderService.display(true); 
    this.designerService.getSectionQuestionList(desid).subscribe(
      res=>{
        var sec_arr=this.addquestionnaireForm.get('sections') as FormArray;
        for(var i=0;i<res.dp_questionnaire.length;i++){
          sec_arr.push(
            new FormGroup({
              section_name:new FormControl(res.dp_questionnaire[i].section_name),
              section_id:new FormControl(res.dp_questionnaire[i].dpq_section_id),
              projects: new FormArray([]),
              questions:new FormArray([]),
              is_project_present:new FormControl()
            })
          );
          this.buildDbsections(res.dp_questionnaire[i]);
        }
        if(this.questionnaireData){
          for(var i2=0;i2<sec_arr.length;i2++){
            var proj_arr = sec_arr.controls[i2].get('projects') as FormArray;
            for(var i3=0;i3<this.questionnaireData.projects.length;i3++){
              if(this.questionnaireData.projects[i3].dpq_section_id==sec_arr.controls[i2].get('section_id').value){
                proj_arr.push(new FormGroup({
                  customer_name : new FormControl(this.questionnaireData.projects[i3].customer_name),
                  type : new FormControl(this.questionnaireData.projects[i3].project_type),
                  budget : new FormControl(this.questionnaireData.projects[i3].budget),
                  area : new FormControl(this.questionnaireData.projects[i3].area),
                  client_approval : new FormControl(this.questionnaireData.projects[i3].client_pitches_and_design_approval),
                  project_id:new FormControl(this.questionnaireData.projects[i3].id),

                }));
              }
            }
          }
        }
        this.loaderService.display(false); 
      },
      err=>{
       
       this.loaderService.display(false); 
    });
  }

  buildDbsections(data){
    var sec_arr=this.addquestionnaireForm.get('sections') as FormArray;
    var index= sec_arr.length-1;
    if(data.dpq_questions){
      for(var i=0;i<data.dpq_questions.length;i++){
        var ques_arr = sec_arr.controls[index].get('questions') as FormArray;
        ques_arr.push(new FormGroup({
            dpq_question_id:new FormControl(data.dpq_questions[i].dpq_question_id),
            question:new FormControl(data.dpq_questions[i].question),
            answer:new FormControl(),
            answer_id:new FormControl()
          }));
        var index_quesarr=ques_arr.length-1;
        if(this.questionnaireData){
          for(var i1=0;i1<this.questionnaireData.answers.length;i1++){
            if(this.questionnaireData.answers[i1].dpq_question_id==ques_arr.controls[index_quesarr].get('dpq_question_id').value){
              ques_arr.controls[index_quesarr].get('answer').setValue(this.questionnaireData.answers[i1].answer);
              ques_arr.controls[index_quesarr].get('answer_id').setValue(this.questionnaireData.answers[i1].id);
            }
          }
        }
      }
      
    }

    if(data.dpq_projects || data.dpq_projects==""){
      (<FormGroup>sec_arr.controls[index]).controls['is_project_present'].setValue(true);
    } else {
      (<FormGroup>sec_arr.controls[index]).controls['is_project_present'].setValue(false);
    }
  }
  getformArray(form,controls) {
    return <FormArray>form.controls[controls];
  }
  user_det;
  designer_status;
  viewProfile(value){
    this.designerService.viewProfile(value).subscribe(
      res=>{
        this.user_det = res.user;
        this.designer_status = res.user.status;

    },
    err=>{
        
    });
  }

  closeDpModal(){
    this.addquestionnaireForm.reset();
    (<FormArray>this.addquestionnaireForm.controls['sections']).controls=[];
  }
}
