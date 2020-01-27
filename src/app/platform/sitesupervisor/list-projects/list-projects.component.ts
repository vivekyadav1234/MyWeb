import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { SitesupervisorService } from '../sitesupervisor.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule , Router,ActivatedRoute, RouterStateSnapshot} from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { SchedulerService } from '../../scheduler/scheduler.service';
declare var $:any;

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css'],
  providers: [SitesupervisorService,SchedulerService,DesignerService]
})
export class ListProjectsComponent implements OnInit {

	errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  errorMessagemodal : string;
  erroralertmodal = false;
  successalertmodal = false;
  successMessagemodal : string;

  projectList:any = []
  activated_route:any;

  constructor(
  	private loaderService : LoaderService,
    private ssService : SitesupervisorService,
    private formBuilder:FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  	this.route.params.subscribe(params => {
  		this.activated_route = params['project_type'];
		}); 

  }

  ngOnInit() {
  	this.loaderService.display(true);
  	this.getProjectList();
  }

  getProjectList(){
  	this.ssService.getProjectList(this.activated_route).subscribe(
  	  res => {
  	    this.projectList = res['projects'];
  	    this.loaderService.display(false);
  	  },
  	  err => {
  	    
  	    this.loaderService.display(false);
  	  }
  	);
  }

}
