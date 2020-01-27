import { Component, OnInit } from '@angular/core';
import { SalesManagerService } from '../sales-manager.service';
import {LeadService} from '../../lead/lead.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import {Location} from '@angular/common';
import { FormControl,
	FormArray,
	FormBuilder,
	FormGroup,
	Validators } from '@angular/forms';
// import {LeadquestionnaireComponent} from '../../../../shared/leadquestionnaire/leadquestionnaire.component';
declare var $:any;


@Component({
  selector: 'app-sales-referrers',
  templateUrl: './sales-referrers.component.html',
  styleUrls: ['./sales-referrers.component.css'],
  providers: [ SalesManagerService,LeadService]
})
export class SalesReferrersComponent implements OnInit {
	user_id;
	referreresList:any = [];
  headers_res;
  per_page;
  total_page;
  current_page;
  successalert = false;
  erroralert = false;

  constructor(
  	private route:ActivatedRoute,
	private leadService:LeadService,
	private salesmanagerService: SalesManagerService,
	private loaderService:LoaderService,
	private formBuilder:FormBuilder,
	public router:Router, 
	public location:Location,

  	) { }

  ngOnInit() {
  	this.user_id = localStorage.getItem('userId');

  	this.getReferrersList(1);
  }
  rolesList:any=[];
  getReferrersList(page?,search?){
  	this.salesmanagerService.getReferrersList(this.user_id,page,search).subscribe(
  		res=>{
  			
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
  			this.referreresList = res['users'];
        
        for(var i=0 ;i< this.referreresList.length;i++){
          this.rolesList.push(this.referreresList[i].roles);
          

        }

  		},
  		err=>{
  			

  		})
  }

  search_value;
  onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    var  i=0;
    if(true){
      this.getReferrersList('',this.search_value);
      i++;
    }
  } 

}
