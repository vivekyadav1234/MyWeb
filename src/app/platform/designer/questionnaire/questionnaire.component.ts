import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
import { DesignerService } from '../designer.service';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
declare var Layout:any;
declare var $:any;

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
  providers: [ProjectService,DesignerService, LeadService]
})
export class QuestionnaireComponent implements OnInit {
  slectedSet = 'view';
  addquestionnaireForm: FormGroup;
  designer_id;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private projectService:ProjectService,
    private loaderService : LoaderService,
    private designerService : DesignerService,
    private formBuilder: FormBuilder,
    private leadService:LeadService,

    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
              this.designer_id = params['userId'];
      });
    this.addquestionnaireForm = this.formBuilder.group({
      sections: this.formBuilder.array([]),
    });
    // this.getQuestionDetails();
    this.getAnswerIndex();
    this.viewProfile();

  }
  initProjects(){
    return new FormGroup({
      customer_name : new FormControl(''),
      type : new FormControl(''),
      budget : new FormControl(''),
      area : new FormControl(''),
      client_pitches_and_design_approval : new FormControl(''),
      project_id:new FormControl('')
    });
  }
   count =  -1;
  selectDiv(value){
    this.count = value;
  }
  selectedDiv = 'view';
  selectViewDiv(value){
   this.selectedDiv= value;
  }
  skipDivId;
  skipDiv(value){
    this.count = value;
  }
  closeDiv(){
    var val = this.count;
    this.count = val -1;
  }
  skipQuestion(data){
    this.slectedSet = data;
    $('#skipModal').modal('hide');

  }
  selectedChild;
  skipChildModal(childValue){
   this.selectedChild = childValue;
  }
  skipChildQuestion(childId){
    $('#skipChildModal').modal('hide');
    document.getElementById(childId).setAttribute('style','display: none');
  }
  addProjectData(value){
  }
  getProjets(form){
    return form.get('projects').controls;
  }

  selectedProject = [];
  saveProject(){
    $('#addProjectModal').modal('hide');
    this.selectedProject.push(<FormArray> this.addquestionnaireForm.controls['projects'].value);
  }
  addMoreProject(){
    const control = <FormArray>this.addquestionnaireForm.controls['projects'];
    control.push(this.initProjects());
  }
  questionList = [];
  getQuestionDetails(){   
    this.loaderService.display(true); 
    this.designerService.getSectionQuestionList(this.designer_id).subscribe(
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
                  client_pitches_and_design_approval : new FormControl(this.questionnaireData.projects[i3].client_pitches_and_design_approval),
                  project_id:new FormControl(this.questionnaireData.projects[i3].id)
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
  user_det;
  viewProfile(){
    this.designerService.viewProfile(this.designer_id).subscribe(
      res=>{
      this.user_det = res.user;
    },
    err=>{
      
    });
  }


  buildDbQuestionnaires(data){
    var getFun=this.addquestionnaireForm.get('sections') as FormArray;
    getFun.push(new FormGroup({
      dpq_question_id:new FormControl(data.dpq_question_id),
      question:new FormControl(data.question),
      answer:new FormControl(),
      dpq_section_id:new FormControl(data.dpq_section_id),
      section_name:new FormControl(data.section_name)
    }));
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
  pushProjectAttributes(addquestionnaireForm,index){
    return addquestionnaireForm.get('sections').controls[index]['controls'].projects.push(this.initProjects());
  }
  questionnaire_id;
  questionnaireData;
  getAnswerIndex(){
    this.loaderService.display(true);
    this.designerService.getAnswerIndex(this.designer_id).subscribe(
      res=>{
        if(res!=null){
          this.questionnaireData= res.dp_questionnaire;
          this.questionnaire_id = res.dp_questionnaire.id;
        } else {
          this.questionnaireData= res;
        }
        this.getQuestionDetails();
        this.loaderService.display(false);
    },err=>{
      
      this.loaderService.display(false);
    });
  }
  submitDpQuestionnaireForm(){
    this.loaderService.display(true);
    var dpqprojects=[];
    var project_to_be_keep = [];
    var dpqanswers = [];
    var section_control=this.getformArray(this.addquestionnaireForm,'sections')
    for(var j=0;j<section_control.length;j++){
      for(var k=0;k<section_control.controls[j]['controls'].projects.length;k++){
        var obj = {
          id:section_control.controls[j]['controls'].projects.controls[k].value.project_id,
          project_type:section_control.controls[j]['controls'].projects.controls[k].value.type,
          area:section_control.controls[j]['controls'].projects.controls[k].value.area,
          customer_name:section_control.controls[j]['controls'].projects.controls[k].value.customer_name,
          client_pitches_and_design_approval:
          section_control.controls[j]['controls'].projects.controls[k].value.client_pitches_and_design_approval,
          budget:section_control.controls[j]['controls'].projects.controls[k].value.budget,
          dpq_section_id:section_control.controls[j]['controls'].section_id.value
        }
        dpqprojects.push(obj);
        project_to_be_keep.push(obj.id);
      }
    }
    for(var j1=0;j1<section_control.length;j1++){
      for(var k1=0;k1<section_control.controls[j1]['controls'].questions.length;k1++){
        var obj1 = {
          id:(section_control.controls[j1]['controls'].questions.controls[k1].value.answer_id)?section_control.controls[j1]['controls'].questions.controls[k1].value.answer_id:"",
          dpq_question_id:section_control.controls[j1]['controls'].questions.controls[k1].value.dpq_question_id,
          answer:section_control.controls[j1]['controls'].questions.controls[k1].value.answer,
          skipped:(section_control.controls[j1]['controls'].questions.controls[k1].value.answer=="")?true:false
        }
        dpqanswers.push(obj1);
      }
    }
    
    var data={
      'dp_questionnaire': {
        id: this.questionnaire_id,
        dpq_projects_attributes:dpqprojects,
        dpq_answers_attributes:dpqanswers,
        project_to_be_keep:project_to_be_keep
      }
    }
    this.designerService.submitDpQuestionnaire(this.designer_id,data).subscribe(
    res=>{
      this.getAnswerIndex();
      this.loaderService.display(false);
      this.successMessage = 'Updated successfully!';
      this.addquestionnaireForm.reset();
      (<FormArray>this.addquestionnaireForm.controls['sections']).controls=[];
      this.count=0;
      this.successalert = true;
      setTimeout(function() {
                this.successalert = false;
             }.bind(this), 23000);
    },
    err=>{
      
      this.loaderService.display(false);
      this.errorMessage = <any>JSON.parse(err['_body']).message;
      this.erroralert = true;
      setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 23000);
    });
  }
}
