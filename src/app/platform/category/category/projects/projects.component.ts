import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService} from '../category.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [CategoryService]
})
export class ProjectsComponent implements OnInit {
	
	wip_project_list: any = [];

  constructor(
  	private router: Router,
	private loaderService : LoaderService,
	private categoryService:CategoryService,

  	) { }

  ngOnInit() {

  	this.getWipProjectList();
  }

  getWipProjectList(){
    this.loaderService.display(true);
  	this.categoryService.getWipProjectList().subscribe(
  		res=>{
        this.loaderService.display(false);
  			this.wip_project_list = res.projects;
  		},
  		err=>{
  			
         this.loaderService.display(false);
  		});
  }

}
