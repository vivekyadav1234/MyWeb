import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
import {Lead} from '../lead';
import { LeadService } from '../lead.service';

declare var $:any;

@Component({
  selector: 'app-viewlead',
  templateUrl: './viewlead.component.html',
  styleUrls: ['./viewlead.component.css'],
  providers: [LeadService]
})
export class ViewleadComponent implements OnInit {
	id: Number;
	lead: Lead[];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
  	private route: ActivatedRoute,
  	private leadService: LeadService
  ) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
			            this.id = +params['id'];
			  	});

	  	this.leadService.viewLeadDetails(this.id)
	        .subscribe(
	            lead => {
	              this.lead = lead;
	              Object.keys(lead).map((key)=>{ this.lead= lead[key];});
	              return lead;
	            },
	            error => {
                this.erroralert = true;
	              this.errorMessage=JSON.parse(error['_body']).message;
	              //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
	              return Observable.throw(error);
	            }
	       );
  }

}
