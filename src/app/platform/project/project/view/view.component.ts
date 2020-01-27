import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Project } from '../project';
import { Comments } from '../comments';
//import { Floorplan } from '../../../customer/floorplan/floorplan';
//import { FloorplanService } from '../../../customer/floorplan/floorplan.service';
import { ProjectService } from '../project.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { Floorplan } from '../../../floorplans/floorplan/floorplan';
import { FloorplanService } from '../../../floorplans/floorplan/floorplan.service';
import { UserDetailsService } from '../../../../services/user-details.service';
import { LoaderService } from '../../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [ProjectService,FloorplanService]
})
export class ViewComponent implements OnInit {

	observableProjects: Observable<Project[]>
  observableComments: Observable<Comments[]>
  observableFloorplans : Observable<Floorplan[]>
	id: Number;
	project: any[];
  comments: Comments[];
  floorplan : Floorplan[];
  submitted = false;
  role:string;
  showCommentBox: boolean = false;
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  view_showForm = ['admin','customer'];
  edit_and_delete_ProjectAccess = ['admin','customer','designer'];
  add_delete_edit_floorplanAccess = ['admin','customer','designer'];

  constructor(
  	private projectService :ProjectService,
  	private route: ActivatedRoute,
    private router:Router,
    private formBuilder: FormBuilder,
    private floorplanService : FloorplanService,
    private userDetailService : UserDetailsService,
    private loaderService:LoaderService
   ) {
      this.editProjectForm.disable()
    }

  editProjectForm = this.formBuilder.group({
    name: new FormControl('',Validators.required),
    details: new FormControl('')
  });

  createFloorplanForm = this.formBuilder.group({
     name: new FormControl('',[Validators.required]),
     details : new FormControl(''),
     fileData: new FormControl()
  });

  ngOnInit() {

    this.role = localStorage.getItem('user');
    this.route.queryParams.subscribe(params => {
      this.customer_status = params['customer_status'];
    });
  	this.route.params.subscribe(params => {
            this.id = +params['id'];

    });
   
   this.getProjectDetails();
   this.getFloorplanDetailsOfProject();
    //for listing comments of a project
    this.observableComments = this.projectService.listComments(this.id);
    this.observableComments.subscribe(
        comments => {
          this.comments = comments;
          Object.keys(comments).map((key)=>{ this.comments= comments[key];});
        },
        error => { this.errorMessage = <any>error;
         // $.notify('danger',JSON.parse(this.errorMessage['_body']).message);
          // this.router.navigateByUrl('/');
        }
    );

    

  }

  getProjectDetails(){
    this.loaderService.display(true);
     //for getting details of a projects
   this.observableProjects = this.projectService.viewProjectDetails(this.id);
    this.observableProjects.subscribe(
      project => {
        this.project = project;
        Object.keys(project).map((key)=>{ this.project= project[key];});
        this.editProjectForm.controls['name'].setValue(this.project['name']);
        this.editProjectForm.controls['details'].setValue(this.project['details']);
        this.loaderService.display(false);
      },
      error => { 
        this.errorMessage = <any>error;
        this.loaderService.display(false);
      }
    );
  }

  getFloorplanDetailsOfProject(){
    this.loaderService.display(true);
    //for listing floorplans of a project
    this.observableFloorplans = this.floorplanService.listFloorplan(this.id);
    this.observableFloorplans.subscribe(
        floorplan => {
          this.floorplan = floorplan;
          Object.keys(floorplan).map((key)=>{ this.floorplan= floorplan[key];});
          this.loaderService.display(false);
        },
        error => {
          this.erroralert = true;
          this.errorMessage=JSON.parse(error['_body']).message;
          this.loaderService.display(false);
        }
    );
  }

    onSubmit(data) {
      this.submitted = true;
      this.loaderService.display(true);
      this.projectService.postCommentWithId(this.id,data)
        .subscribe(
            comments => {
              comments = comments;
              this.successalert = true;
              this.successMessage = "Posted !!";
               //$.notify('posted');
               this.getComments();
               setTimeout(function() {
                    this.successalert = false;
                }.bind(this), 5000);
               this.loaderService.display(false);
              return comments;
            },
            error => {
              this.loaderService.display(false);
              this.erroralert = true;
              this.errorMessage=JSON.parse(error['_body']).message;
              setTimeout(function() {
                   this.erroralert = false;
               }.bind(this), 5000);
            //  $.notify('error',JSON.parse(this.errorMessage['_body']).message);
              return Observable.throw(error);
            }
        );

    }

    private getComments(){
      this.observableComments = this.projectService.listComments(this.id);
      this.observableComments.subscribe(
          comments => {
            this.comments = comments;
            Object.keys(comments).map((key)=>{ this.comments= comments[key];});
          },
          error =>  {
            this.erroralert = true;
            this.errorMessage=JSON.parse(error['_body']).message;
            setTimeout(function() {
                 this.erroralert = false;
             }.bind(this), 5000);
          //  $.notify('error',JSON.parse(this.errorMessage['_body']).message);
          }
      );
    }

    toggleCommentBox(){
      this.showCommentBox = true;
      if ( document.getElementById('commentboxIcon').classList.contains('fa-commenting') ) {
        document.getElementById('commentboxIcon').classList.remove('fa-commenting');
        document.getElementById('commentboxIcon').classList.add('fa-times');
      }
      else if ( document.getElementById('commentboxIcon').classList.contains('fa-times') ) {
        document.getElementById('commentboxIcon').classList.add('fa-commenting');
        document.getElementById('commentboxIcon').classList.remove('fa-times');
      }
      $("#comment_box").toggle();

    }
    goBack(){
      window.history.go(-1);
    }

    editProject(){
      this.editProjectForm.enable();
      document.getElementById('editProjectBtn').classList.remove('d-none');
      document.getElementById('cancelBtn').classList.remove('d-none');
     // document.getElementById('backBtn').classList.add('d-none');
      document.getElementById('editPencil').classList.remove('d-none');
      document.getElementById('editPencil1').classList.remove('d-none');
      // this.editProjectForm.controls['name'].
    }


    cancelFunc(event) {
      event.preventDefault();
       this.setValueForm();
    }

    setValueForm(){
      this.editProjectForm.controls['name'].setValue(this.project['name']);
       this.editProjectForm.controls['details'].setValue(this.project['details']);
         this.editProjectForm.disable();
        document.getElementById('editProjectBtn').classList.add('d-none');
        document.getElementById('cancelBtn').classList.add('d-none');
       // document.getElementById('backBtn').classList.remove('d-none');
         document.getElementById('editPencil').classList.add('d-none');
          document.getElementById('editPencil1').classList.add('d-none');
    }

    onEditProjetcFormSubmit(data) {
      this.loaderService.display(true);
      this.projectService.editProject(this.id,data)
        .subscribe(
            project => {
              project = project;
              Object.keys(project).map((key)=>{ this.project= project[key];});
              this.setValueForm();
              this.loaderService.display(false);
              this.successalert = true;
              this.successMessage = "Project details updated !!";
             //$.notify('Project Details Updated');
             setTimeout(function() {
                  this.successalert = false;
              }.bind(this), 5000);
              return project;
            },
            error => {
              this.loaderService.display(false);
              this.erroralert = true;
              this.errorMessage=JSON.parse(error['_body']).message;
              setTimeout(function() {
                   this.erroralert = false;
               }.bind(this), 5000);
            //  $.notify(JSON.parse(this.errorMessage['_body']).message);
              return Observable.throw(error);
            }
        );
    }

    onFloorplanSubmit(data){
      let postData = {name: data.name, details: data.details};
      this.loaderService.display(true);
      this.floorplanService.postWithFile(this.project['id'],postData,this.basefile,this.file_name)
      .subscribe(
          floorplan => {
            floorplan = floorplan;
            //this.createFloorplanForm.reset();
            //this.createProjectForm.reset();
            Object.keys(floorplan).map((key)=>{ floorplan= floorplan[key];});
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Floorplan created successfully !!";

            //$.notify('Floorplan created successfully!');
            setTimeout(function() {
                  this.successalert = false;
                  this.router.navigateByUrl('projects/view/'+this.project['id']);
              }.bind(this), 5000);

            return floorplan;
          },
          error => {
            this.errorMessage = error;
            this.loaderService.display(false);
            this.erroralert = true;
            this.errorMessage=JSON.parse(error['_body']).message;
            setTimeout(function() {
                this.erroralert = false;
                this.router.navigateByUrl('/');
             }.bind(this), 10000);
          //  $.notify('error',JSON.parse(this.errorMessage['_body']).message);

            return Observable.throw(error);
          }
      );
    }

    file_name:any = "";
    onChange(event) {
     this.attachment_file = event.srcElement.files[0];
     this.file_name = this.attachment_file.name
     document.getElementById('uploadedfilename').innerHTML = this.attachment_file['name'];
      var fileReader = new FileReader();
         var base64;
          fileReader.onload = (fileLoadedEvent) => {
             // $('#blah').attr('src', fileLoadedEvent.target['result']);
           base64 = fileLoadedEvent.target;
           this.basefile = base64.result;
           //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
         };
      fileReader.readAsDataURL(this.attachment_file);
    }
}
