import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {Angular2TokenService } from 'angular2-token';
import { Project } from '../project';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
import {FloorplanService} from '../../../floorplans/floorplan/floorplan.service';
declare var $:any;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [ProjectService,FloorplanService]
})


export class CreateComponent implements OnInit {

  customerlist : any[];
  role : string;
  constructor(
    private formBuilder: FormBuilder,
    private projectService :ProjectService,
    private router: Router,
    private loaderService: LoaderService,
    private floorplanService :FloorplanService,
  ) {
     this.createFloorplanForm.disable();
  }

   submitted = false;
   errorMessage: string;
   attachment_file: any;
    attachment_name: string;
    basefile: any;
    project: any[];
    erroralert = false;
    successalert = false;
    successMessage : string;

   createProjectForm = this.formBuilder.group({
     name: new FormControl('',[Validators.required]),
     details : new FormControl(''),
     customer_id : new FormControl()
   });

   createFloorplanForm = this.formBuilder.group({
     name: new FormControl('',[Validators.required]),
     details : new FormControl(''),
     fileData: new FormControl()
   });

  onSubmit(data) {
    this.submitted = true;
    this.loaderService.display(true);
    if(!isNaN(data.customer_id) && !(data.customer_id == '') && !(data.customer_id == null)) {
      var obj =this.customerlist.find(x => x.id == data.customer_id);
      data['customer_name']= obj.name;
    }
    this.projectService.createProject(data)
    .subscribe(
        project => {
          project = project;
          Object.keys(project).map((key)=>{ this.project= project[key];});
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "Project Created Successfully !!";
         setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
          this.createFloorplanForm.enable();
          this.createProjectForm.disable();
          document.getElementById('projectform').style.opacity = '0.2';
          document.getElementById('floorplanform').style.opacity = '1';
          //this.router.navigateByUrl('/projects/'+project.id+'/floorplan/create');
          return project;
        },
        error => {
          this.errorMessage = error;
          this.loaderService.display(false);
          $.notify('error',JSON.parse(this.errorMessage['_body']).message);
          setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
          return Observable.throw(error);
        }
    );
  }


  file_name:any = "";
  onChange(event) {
     this.attachment_file = event.target.files[0] || event.srcElement.files[0];
     this.file_name = this.attachment_file.name
     document.getElementById('uploadedfilename').innerHTML = this.attachment_file['name'];
      var fileReader = new FileReader();
         var base64;
          fileReader.onload = (fileLoadedEvent) => {
           base64 = fileLoadedEvent.target;
           this.basefile = base64.result;
         };
      fileReader.readAsDataURL(this.attachment_file);
  }

   onFloorplanSubmit(data) {
      let postData = {name: data.name, details: data.details};
      this.loaderService.display(true);
      this.floorplanService.postWithFile(this.project['id'],postData,this.basefile, this.file_name)
      .subscribe(
          floorplan => {
            floorplan = floorplan;
            this.createFloorplanForm.reset();
            this.createProjectForm.reset();
            Object.keys(floorplan).map((key)=>{ floorplan= floorplan[key];});
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Floorplan Created Successfully";
            setTimeout(function() {
               this.successalert = false;
               this.router.navigateByUrl('projects/view/'+this.project['id']);
            }.bind(this), 2000);
            return floorplan;
          },
          error => {
            this.loaderService.display(false);
             this.erroralert = true;
            this.errorMessage = JSON.parse(error['_body']).message;
            setTimeout(function() {
               this.erroralert = false;
            }.bind(this), 2000);
            return Observable.throw(error);
          }
      );
  }

  redirectPage() {
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.projectService.requestRole('customer').subscribe(
      res => {
        Object.keys(res).map((key)=>{ this.customerlist= res[key];})
      },
      err => {
        
      }
    );
  }
  upload(){
    $(".fileUpload").click();
  }

}
