import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../project.service';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
declare var $:any;


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
   providers: [ProjectService]
})
export class EditComponent implements OnInit {

	observableProject: Observable<Project[]>
	id: Number;
  name:string;
  details: string;
	project: Project[];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  	submitted = false;

  constructor(
  	private projectService :ProjectService,
  	private route: ActivatedRoute,
    private router: Router,
  	private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
		            this.id = +params['id'];
		  	});

    this.projectService.viewProjectDetails(this.id)
        .subscribe(
          project => {
              project = project;
              Object.keys(project).map((key)=>{ project= project[key];});
              this.name = project['name'];
              this.details = project['details'];
              return project;
            },
            error => {
              this.erroralert = true;
              this.errorMessage=JSON.parse(error['_body']).message;
              //$.notify('error');
              //$.notify('danger',JSON.parse(this.errorMessage['_body']).message);
              this.router.navigateByUrl('/');
              return Observable.throw(error);
            }
       );
  }

  onSubmit(data) {
    	this.submitted = true;
    	this.projectService.editProject(this.id,data)
		    .subscribe(
		        project => {
		          project = project;
              this.successalert = true;
              this.successMessage = "Project/Floor plan updated Successfully !!";
              setTimeout(function() {
                 this.successalert = false;
                 this.router.navigateByUrl('/')
             }.bind(this), 2000);
		       //  $.notify('Project/Floor plan updated successfully',"success");

		          return project;
		        },
		        error => {
              this.erroralert = true;
              this.errorMessage=JSON.parse(error['_body']).message;
              //$.notify(JSON.parse(this.errorMessage['_body']).message);
		          return Observable.throw(error);
		        }
		    );

    }

}
