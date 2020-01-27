import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../lead/lead.service';
import { LoaderService } from '../../../services/loader.service';
// import { SortPipe } from '../../../shared/sort.pipe';
import {SortDatewisePipe} from '../../../shared/sort-datewise.pipe';
declare var $:any;

@Component({
  selector: 'app-getacallback-contact-details',
  templateUrl: './getacallback-contact-details.component.html',
  styleUrls: ['./getacallback-contact-details.component.css'],
  providers: [LeadService]
})
export class GetacallbackContactDetailsComponent implements OnInit {

	contactLeads : any[];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  	constructor(
  		private leadService:LeadService,
    	private loaderService:LoaderService
  	) { }

  	ngOnInit() {
  	    this.getAcallbackLeadList();
  	}

  	getAcallbackLeadList(){
      this.loaderService.display(true);
  		this.leadService.getacallbackLeadsDetails()
  			.subscribe(
  				res => {
            this.loaderService.display(false);
  					Object.keys(res).map((key)=>{ this.contactLeads= res[key];});
            for(var j = 0; j<this.contactLeads.length; j++){
              var str = this.contactLeads[j].created_at.split('/');
              this.contactLeads[j].created_at = str[1]+'/'+str[0]+'/'+str[2];
            } 
            this.sort('created_at');
  				},
  				err => {
  					
            this.loaderService.display(false);
  				}
  			);
  	}

    deleteContact(id:number) {
      if (confirm("Are you sure you want to permanently delete this item?") == true) {
        this.loaderService.display(true);
        this.leadService.deleteGetACallbackLead(id)
        .subscribe(
            res => {
              this.getAcallbackLeadList();
              this.loaderService.display(false);
              this.successalert = true;
              this.successMessage = "Lead Deleted Successfully !";
              $(window).scrollTop(0);
              setTimeout(function() {
                    this.successalert = false;
              }.bind(this), 2000);
            },
            err => {
              
              this.loaderService.display(false);
              this.erroralert = true;
              this.errorMessage=JSON.parse(err['_body']).message;
              $(window).scrollTop(0);
              setTimeout(function() {
                  this.erroralert = false;
                }.bind(this), 5000);
            }
        );
      }
    }

    direction: number;
    isDesc: boolean = true;
    column: string = 'CategoryName';
    // Change sort function to this: 
    sort(property){
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? 1 : -1; 
    }

}
