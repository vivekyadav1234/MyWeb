import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService } from 'angular2-token';
import { ProjectService } from '../project/project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;


@Component({
  selector: 'app-show-questionnaire-answers',
  templateUrl: './show-questionnaire-answers.component.html',
  styleUrls: ['./show-questionnaire-answers.component.css'],
  providers: [ProjectService]
})
export class ShowQuestionnaireAnswersComponent implements OnInit {

  result    : any;
  role      : string;
  projectId : Number;
  form      : FormGroup;
  form1     : FormGroup;

  constructor(
  	private route : ActivatedRoute,
  	private loaderService : LoaderService,
  	private projectService : ProjectService,
    private http: Http)
    {
  		this.role = localStorage.getItem('user');
  		this.route.params.subscribe(params => {
  			this.projectId = +params['projectId'];
  		});
  	}

  ngOnInit() {
  	this.projectService.answerApi(this.projectId).subscribe(data => {this.result = Array.of(data)
  })}

  procuct(){
    if($(".addClass").hasClass("hideClass"))
    {
      $(".addClass").removeClass("hideClass");
      $(".addClass1").addClass("hideClass");
      $(".upload1").removeClass("actBtn");
      $(".upload0").addClass("actBtn");
    }
   else
    {
      $(".addClass1").addClass("hideClass");
      $(".upload1").removeClass("actBtn");
      $(".upload0").addClass("actBtn");
    }
 }

 servicesBtn(){
   if($(".addClass1").hasClass("hideClass"))
    {
      $(".addClass1").removeClass("hideClass");
      $(".addClass").addClass("hideClass");
      $(".upload0").removeClass("actBtn");
      $(".upload1").addClass("actBtn");
    }
   else
    {
      $(".addClass").addClass("hideClass");
      $(".upload0").removeClass("actBtn");
      $(".upload1").addClass("actBtn");
    }
 }


}
