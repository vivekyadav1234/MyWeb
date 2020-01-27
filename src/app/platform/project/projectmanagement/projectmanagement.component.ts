import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Project } from '../project/project';
import { ProjectService } from '../project/project.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { UserDetailsService } from '../../../services/user-details.service';
import { LoaderService } from '../../../services/loader.service';
//import { CategoryPipe } from '../../../shared/category.pipe';
declare var $:any;

@Component({
  selector: 'app-projectmanagement',
  templateUrl: './projectmanagement.component.html',
  styleUrls: ['./projectmanagement.component.css'],
  providers: [ProjectService,UserDetailsService],
})
export class ProjectmanagementComponent implements OnInit {
	observableProjects: Observable<Project[]>
	role: string;
	projects: Project[];
	designerList : any[];
	assignedDesignerId : any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
  	private projectService :ProjectService,
  	private route: ActivatedRoute,
    private router:Router,
    private userDetailsService:UserDetailsService,
    private loaderService: LoaderService
  ) {
  	this.role=localStorage.getItem('user');
  }

  ngOnInit() {
  	this.getProjectListFromService();
  	this.getDesignerList();
  }
  ngOnChanges(): void {
    this.getProjectListFromService();
    this.getDesignerList();
  }
  private getProjectListFromService() {
    this.loaderService.display(true);
    this.observableProjects = this.projectService.getProjectList();
    this.observableProjects.subscribe(
        projects => {
          this.projects = projects;
          Object.keys(projects).map((key)=>{ this.projects= projects[key];});
          this.loaderService.display(false);
        },
        error =>  {
          this.erroralert = true;
          this.errorMessage=JSON.parse(error['_body']).message;
          this.loaderService.display(false);
        }
    );
  }

  private getDesignerList() {
  	this.projectService.requestRole('designer')
  			.subscribe(
  				res => {
  					Object.keys(res).map((key)=>{ this.designerList= res[key];});
  				},
  				error => {
            this.erroralert = true;
            this.errorMessage=JSON.parse(error['_body']).message;
  					
  					//$.notify(JSON.parse(error['_body']).message);
  				}
  			);

  }

  private assignProjectToDesigner(id:number,index:number){
      if(this.assignedDesignerId != undefined && this.assignedDesignerId !='Assign To Designer') {
        this.loaderService.display(true);
      	this.projectService.assignProjectToDesigner(id,this.assignedDesignerId)
      						.subscribe(
      				res => {
      					Object.keys(res).map((key)=>{ res= res[key];});
      					this.projects[index] = res;
                this.getProjectListFromService();
                this.assignedDesignerId = undefined;
                this.loaderService.display(false);
                this.successalert = true;
                this.successMessage = "Assigned Successfully !!";
                $(window).scrollTop(0);
                setTimeout(function() {
                      this.successalert = false;
                   }.bind(this), 5000);
      					//$.notify('Assigned Successfully!');
      				},
      				error => {
                this.erroralert = true;
                this.errorMessage=JSON.parse(error['_body']).message;
                this.loaderService.display(false);
                $(window).scrollTop(0);
                setTimeout(function() {
                      this.erroralert = false;
                   }.bind(this), 5000);
      					//$.notify(JSON.parse(this.errorMessage['_body']).message);
      				}
      			);
      } else {
         document.getElementById("assigndropdown"+id).classList.add('inputBorder');
      }
  }

  onDropdownChange(value,rowid) {
  	this.assignedDesignerId = value;
    if(this.assignedDesignerId != undefined && this.assignedDesignerId !='Assign To Designer') {
      document.getElementById("assigndropdown"+rowid).classList.remove('inputBorder');
    }
    // if(this.assignedDesignerId != undefined && this.assignedDesignerId !='Assign To Designer') {
    //   document.getElementById('validationMsgDisplay').innerHTML = "";
    // } else {
    //   document.getElementById('validationMsgDisplay').innerHTML = "Select Designer!";
    // }
  }

}
