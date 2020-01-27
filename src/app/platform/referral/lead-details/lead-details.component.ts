import { Component, OnInit } from '@angular/core';
import {NgPipesModule} from 'ngx-pipes';
import { LoaderService } from '../../../services/loader.service';
import { SortPipe } from '../../../shared/sort.pipe';
import { ReferralService } from '../referral.service';

@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.css'],
  providers:[ReferralService]
})
export class LeadDetailsComponent implements OnInit {

	role : string;
	headers_res;
	per_page;
	total_page;
	current_page;
	filteredLeads=[];
  from_date="";
  to_date="";
  search_string="";
  constructor(
  	private referralService:ReferralService,
  	private loaderService:LoaderService
  ) { }

  ngOnInit() {
  	this.getLeads(1);
    this.populateFilters();
  }

  getLeads(pageno?){
    $(".dd-dropdown").addClass("d-none");
		this.loaderService.display(true);
		this.referralService.getBrokerAddedLeads(pageno,this.from_date,this.to_date,this.checked_statuses,this.search_string)
    .subscribe(
        res => {
        	this.headers_res= res.headers._headers;
					this.per_page = this.headers_res.get('x-per-page');
					this.total_page = this.headers_res.get('x-total');
					this.current_page = this.headers_res.get('x-page');
					res= res.json();
					this.filteredLeads = res.leads;
					this.filteredLeads = this.sortFunc(this.filteredLeads,{property: 'id', direction: '-1'});
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
    this.referralService.getFiltersData().subscribe(
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
