import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService} from '../category.service';
import { Angular2TokenService } from 'angular2-token';

declare var $:any;

@Component({
  selector: 'app-category-floorplan',
  templateUrl: './category-floorplan.component.html',
  styleUrls: ['./category-floorplan.component.css'],
  providers: [CategoryService]
})
export class CategoryFloorplanComponent implements OnInit {
	@Input() floorplan_list:any = [];
	project_id;
  project_name;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
  	private router: Router,
  	private loaderService : LoaderService,
  	private categoryService:CategoryService,
  	private route:ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  	this.route.params.subscribe(
      params => {
        this.project_id = params['projectId'];
      }
    );
    this.route.queryParams.subscribe(
      params => {
        this.project_name = params['project_name'];
      }
    );
    this.fetchFloorplan();
  }

  fetchFloorplan(){
    this.loaderService.display(true);
    this.categoryService.fetchFloorplan(this.project_id).subscribe(
      res=>{
        this.floorplan_list = res['floorplans'];
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

}
