import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
import { DesignerService } from '../designer.service';
import { LoaderService } from '../../../services/loader.service';
declare var Layout:any;

@Component({
  selector: 'app-deadlines',
  templateUrl: './deadlines.component.html',
  styleUrls: ['./deadlines.component.css'],
  providers: [ProjectService,DesignerService]
})
export class DeadlinesComponent implements OnInit {
	observableProjects: Observable<Project[]>
	errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:string;
  designerId:string;
  statusCountArr;
  usersList;

  constructor(
  	private router: Router,
  	private projectService:ProjectService,
    private loaderService : LoaderService,
    private designerService : DesignerService
  ) { }

  ngOnInit() {
  	this.loaderService.display(true);
  	this.role = localStorage.getItem('user');
    this.designerId = localStorage.getItem('userId');
    //this.getProjectListFromService();
    //this.getUserListForDesigner();
    this.getUserCountsByDeadlines();
  }

  getUserCountsByDeadlines() {
    this.loaderService.display(true);
    this.designerService.getUserCountsByDeadlines(this.designerId).subscribe(
      res => {
        this.statusCountArr = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

}
