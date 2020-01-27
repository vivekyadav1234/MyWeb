import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrokerService } from '../broker.service';
import { Observable } from 'rxjs';
import {NgPipesModule} from 'ngx-pipes';
import { LoaderService } from '../../../../services/loader.service';
import { SortPipe } from '../../../../shared/sort.pipe';
import { CategoryPipe } from '../../../../shared/category.pipe';

@Component({
  selector: 'app-broker-leadmgmt',
  templateUrl: './broker-leadmgmt.component.html',
  styleUrls: ['./broker-leadmgmt.component.css'],
  providers: [BrokerService]
})
export class BrokerLeadmgmtComponent implements OnInit {

	errorMessage : string;
	erroralert = false;
	successalert = false;
	successMessage : string;
	role : string;
	brokerId;
	leads: any[];
	headers_res;
	per_page;
	total_page;
	current_page;
	from_date="";
  to_date="";
  search_string="";

	constructor(
		private brokerService:BrokerService,
    	private loaderService:LoaderService
	) { }

	ngOnInit() {
		this.role = localStorage.getItem('user');
		this.brokerId = localStorage.getItem('userId');
		this.getLeadListFromService(1);
		this.populateFilters();
	}

	getLeadListFromService(pageno?){
		$(".dd-dropdown").addClass("d-none");
		this.loaderService.display(true);
		this.brokerService.getBrokerAddedLeads(pageno,this.from_date,this.to_date,this.checked_statuses,this.search_string)
    .subscribe(
        res => {
        	this.headers_res= res.headers._headers;
					this.per_page = this.headers_res.get('x-per-page');
					this.total_page = this.headers_res.get('x-total');
					this.current_page = this.headers_res.get('x-page');
					res= res.json();
					this.leads = res.leads;
					this.leads = this.sortFunc(this.leads,{property: 'id', direction: '-1'});
          this.loaderService.display(false);
        },
        error =>  {
          this.loaderService.display(false);
        }
    );
	}

	statuslist;
  populateFilters(){
    this.loaderService.display(true);
    this.brokerService.getFiltersData().subscribe(
      res=>{
        res=res.json();
        this.statuslist=res.lead_status_array;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  displayDropDown(el) {
    var elem = '#'+el + '-dropdown';
    if((<HTMLElement>document.querySelector(elem)).classList.contains('d-none')){
      $(".dd-dropdown").addClass("d-none");
      (<HTMLElement>document.querySelector(elem)).classList.remove('d-none');
    } else {
      (<HTMLElement>document.querySelector(elem)).classList.add('d-none');
    }
  }

  checked_statuses:any = [];
  checkStatuses(event){
    if(event.target.checked == true){
      this.checked_statuses.push(event.target.value);
    }
    else{
      var index = this.checked_statuses.indexOf(event.target.value);
      if (index > -1) {
        this.checked_statuses.splice(index, 1);
      }
    };
  }

  isElementPresent(elem,arr,type?){
    var flag=false;
    var j:number = 0;
    arr.forEach((ctr) => {
      if(ctr == elem) {
        flag=true;
      }
      j++;
    });
    if(flag){
      return true;
    } else {
      return false;
    }
  }


	// filtercol2Arr : any;
	// filtercol1Val : any = 'all';
	// filtercol2Val:any = '';
	// filteredleads:any[];
	// filterColumDropdownChange(colVal) {
	// 	if(colVal == 'all'){
	// 	  this.filtercol2Val = '';
	// 	  this.filtercol2Arr = [];
	// 	  document.getElementById('filter2dropdown').style.display = 'none';
	// 	} else if(colVal == 'lead_status') {
	// 	  this.filtercol2Val = '';
	// 	  this.filtercol2Arr = ['qualified','not_attempted','lost','claimed','not_claimed','follow_up','not_contactable','lost_after_5_tries'];
	// 	  document.getElementById('filter2dropdown').style.display = 'inline-block';
	// 	} else if(colVal == 'source') {
	// 	  this.filtercol2Val = '';
	// 	  this.filtercol2Arr = ['digital','bulk']
	// 	  document.getElementById('filter2dropdown').style.display = 'inline-block';
	// 	} 
	// }

	// filterColum2DropdownChange(colVal){
	//     this.brokerService.getBrokerAddedLeads(this.current_page).subscribe(
	//       leads => {
	//         this.filteredleads = leads;
	//         Object.keys(leads).map((key)=>{ this.filteredleads= leads[key];});
	//       },
	//       error =>  {
	//         
	//       }
	//     );
	// }

	// filterSubmit() {
	// 	this.loaderService.display(true);
	// 	this.brokerService.getBrokerAddedLeads(this.current_page).subscribe(
	// 	  leads => {
	// 	    this.filteredleads = leads;
	// 	    Object.keys(leads).map((key)=>{ this.filteredleads= leads[key];});
	// 	    this.leads =  this.filteredleads;
	// 	    if(this.filtercol1Val == 'lead_status' ){
	// 	      if(this.filtercol2Val == 'qualified') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status && this.leads[i].lead_status =='qualified'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'not_attempted') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status=='not_attempted'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'lost') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status=='lost'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'claimed') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status=='claimed'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'not_claimed') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status=='not_claimed'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'follow_up') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status=='follow_up'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'not_contactable') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status=='not_contactable'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'lost_after_5_tries') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].lead_status=='lost_after_5_tries'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      }
	// 	    }
	// 	    if(this.filtercol1Val == 'source' ){
	// 	      if(this.filtercol2Val == 'digital') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].source =='digital'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } else if(this.filtercol2Val == 'bulk') {
	// 	        var filteredArr = new Array();
	// 	        for(var i =0;i<this.leads.length;i++){
	// 	          if(this.leads[i].source=='bulk'){
	// 	            filteredArr.push(this.leads[i]);
	// 	          }
	// 	        }
	// 	        this.leads = filteredArr;
	// 	      } 
	// 	    }
	// 	    if(this.filtercol1Val == 'all' ){
	// 	      this.getLeadListFromService(this.current_page);
	// 	    }
		    
	// 	    this.loaderService.display(false);
	// 	  },
	// 	  error =>  {
	// 	    
	// 	    this.loaderService.display(false);
	// 	  }
	// 	);
 //  }

  direction: number;
  isDesc: boolean = true;
  column: string;

	sortFunc(records: Array<any>, args?: any){
  	this.column = args.property;
  	this.direction = args.direction;
  	return records.sort(function(a, b){
      if(a[args.property] !=undefined && b[args.property] != undefined) {
        if(args.property=="id"){
           if(a[args.property] < b[args.property]){
                return -1 * args.direction;
            }
            else if( a[args.property] > b[args.property]){
                return 1 * args.direction;
            }
            else{
                return 0;
            }
        } else {
            if(a[args.property].toLowerCase() < b[args.property].toLowerCase()){
                return -1 * args.direction;
            }
            else if( a[args.property].toLowerCase() > b[args.property].toLowerCase()){
                return 1 * args.direction;
            }
            else{
                return 0;
            }
        }
      }
    });
  }

}
