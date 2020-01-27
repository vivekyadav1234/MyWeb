import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../../lead/lead.service';
import {CsagentService} from '../csagentdashboard/csagent.service';
import { Observable } from 'rxjs';
import {Lead} from '../../lead/lead';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';
import { LoaderService } from '../../../services/loader.service';
import { SortPipe } from '../../../shared/sort.pipe';
declare var $:any;

@Component({
  selector: 'app-sales-manager-mapping',
  templateUrl: './sales-manager-mapping.component.html',
  styleUrls: ['./sales-manager-mapping.component.css'],
  providers: [CsagentService,CsagentService,LeadService]
})
export class SalesManagerMappingComponent implements OnInit {
	referreresList: any[];
	leadActionAccess = ['admin','lead_head'];
	role : string;
	errorMessage : string;
	erroralert = false;
	erroralertmodal = false;
	errorMessagemodal : string;
	successMessagemodal : string;
	successalertmodal = false;
	successalert = false;
	successMessage : string;
	salesManagerList : any[];
	headers_res;
    per_page;
    total_page;
    current_page;

  constructor(
  	private router: Router,
  	private route:ActivatedRoute,
  	private leadService:LeadService,
  	private csagentService:CsagentService,
  	private loaderService:LoaderService,
  	private formBuilder: FormBuilder
  	) { }

  ngOnInit() {
  	this.getReferrerList(1);
  	this.getSalesManagerList();
  }
  getReferrerList(page?,search?){

  	this.loaderService.display(true);
	    this.leadService.getReferrerList(page,search).subscribe(
	        res => {
	            
	            this.headers_res= res.headers._headers;
		        this.per_page = this.headers_res.get('x-per-page');
		        this.total_page = this.headers_res.get('x-total');
		        this.current_page = this.headers_res.get('x-page');

		        res= res.json();
	          this.referreresList = res['users'];
	          
	          
	          // Object.keys(leads).map((key)=>{ this.leads= leads[key];});
	          this.loaderService.display(false);
	        },
	        error =>  {
	          this.erroralert = true;
	          this.errorMessage = <any>JSON.parse(error['_body']).message;
	          this.loaderService.display(false);
	          //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
	        }
	    );

  }
  search_value;
  onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    var  i=0;
    if(true){
      this.getReferrerList('',this.search_value);
      i++;
    }
  } 


  getSalesManagerList(){

  	this.leadService.getSalesManagerList()
	    .subscribe(
	      res => {
	        
	        this.salesManagerList = res['sales_managers'];
	      },
	      error => {
	        this.erroralert = true;
	        this.errorMessage=JSON.parse(error['_body']).message;
	      }
	    );

  }

  assignToSlaesManager(referralId){
  	this.loaderService.display(true);

  		this.leadService.assignToSlaesManager(referralId,this.smId)
	    .subscribe(
	      res => {
	      	this.successalert = true;
	      	this.successMessage="Assigned To Sales manager Successfully";
	      	this.getReferrerList(1);
	      	this.loaderService.display(false);
	        // Object.keys(res).map((key)=>{ this.cmList= res[key];});
	      },
	      error => {
	        this.erroralert = true;
	        this.errorMessage=JSON.parse(error['_body']).message;
	        this.loaderService.display(false);
	      }
	    );


  	
  	
  }

  smId:any
  		

  selectSM(id){
  	
  	this.smId = id;
   
  }

}
