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
  selector: 'app-designer-wip-dashboard',
  templateUrl: './designer-wip-dashboard.component.html',
  styleUrls: ['./designer-wip-dashboard.component.css'],
  providers:[ProjectService,DesignerService]
})
export class DesignerWipDashboardComponent implements OnInit {
	errorMessage : string;
    erroralert = false;
    successalert = false;
    successMessage : string;
    role:string;
    designerId:string;
    statusCountArr;

  constructor(
  	private router: Router,
  	private projectService:ProjectService,
    private loaderService : LoaderService,
    private designerService : DesignerService

  	) { }

  ngOnInit() {
  	this.role = localStorage.getItem('user');
    this.designerId = localStorage.getItem('userId');
    this.getUserWipCountsByStatus();
    this.loaderService.display(false);
  }
  getUserWipCountsByStatus(){
  	this.loaderService.display(true);
    this.designerService.getUserCountsByStatusInWip(this.designerId).subscribe(
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
