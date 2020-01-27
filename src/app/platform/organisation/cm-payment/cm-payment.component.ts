import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../cm-dashboard/communitymanager.service';
import { LeadService } from '../../lead/lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
declare var $:any;

@Component({
  selector: 'app-cm-payment',
  templateUrl: './cm-payment.component.html',
  styleUrls: ['./cm-payment.component.css'],
  providers: [CommunitymanagerService,DesignerService,LeadService]
})
export class CmPaymentComponent implements OnInit {

	errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  projectList:any = [];
  user_id:any;
  page_no:any = 1;
  headers_res:any;
  per_page:any;
  total_page:any;
  current_page:any;


  constructor(
  	private loaderService : LoaderService,
    private cmService : CommunitymanagerService,
    private leadService: LeadService,
    private formBuilder:FormBuilder,
    private designerService:DesignerService,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
  	this.loaderService.display(true);
  	this.user_id = localStorage.getItem('userId');
  	this.fetchProjectList(this.page_no);
  }

  fetchProjectList(page_no?){
  	this.cmService.fetchProjectList(this.user_id,page_no).subscribe(
  	  res => {
  	  	this.loaderService.display(false);

        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
  	  	this.projectList = res['payments'];
  	  },
  	  err => {
  	    this.loaderService.display(false);
  	  });
  }

  // nextPage(page){
  //   this.loaderService.display(true);
  //   this.route.queryParams.subscribe((params: Params) => {
  //     this.fetchProjectList(page);
  //   });
  // }

}
