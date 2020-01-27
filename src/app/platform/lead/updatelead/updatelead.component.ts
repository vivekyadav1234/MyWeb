import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
import {Lead} from '../lead';
import { LeadService } from '../lead.service';
declare var $:any;

@Component({
  selector: 'app-updatelead',
  templateUrl: './updatelead.component.html',
  styleUrls: ['./updatelead.component.css'],
  providers: [LeadService]
})
export class UpdateleadComponent implements OnInit {

	id: Number;
  name:string;
  email:string;
  details: string;
  contact: string;
  city:string;
  pincode:string;
	lead: Lead[];
  submitted = false;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
  	private route: ActivatedRoute,
    private router: Router,
  	private formBuilder: FormBuilder,
  	private leadService: LeadService
  ) { }

    ngOnInit() {

	  	this.route.params.subscribe(params => {
			            this.id = +params['id'];
			  	});

	  	this.leadService.viewLeadDetails(this.id)
	        .subscribe(
	          lead => {
	              lead = lead;
	              Object.keys(lead).map((key)=>{ lead= lead[key];});
	              this.name = lead['name'];
	              this.details = lead['details'];
	              this.email= lead['email'];
	              this.contact = lead['contact'];
	              this.city=lead['city'];
	              this.pincode=lead['pincode'];
	              // if(lead['approved']== false)
	              // 	this.status = 'lead';
	              // else if(lead['approved']== true)
	              // 	this.status= 'customer';
	              return lead;
	            },
	            error => {
                this.erroralert = true;
	              this.errorMessage=JSON.parse(error['_body']).message;
	              //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
	        	  this.router.navigateByUrl('/');
	              return Observable.throw(error);
	            }
	       );
    }

    onSubmit(data) {
    	this.submitted = true;
    	this.leadService.editLead(this.id,data)
		    .subscribe(
		        lead => {
		          lead = lead;
              this.successalert = true;
              this.successMessage = "Updated Successfully !!";
		         // $.notify('Updated Successfully!');
             setTimeout(function() {
                  this.router.navigateByUrl('lead/list')
             }.bind(this), 3000);

		          return lead;
		        },
		        error => {
              this.erroralert = true;
              		this.errorMessage=JSON.parse(error['_body']).message;
              	//	$.notify('error',JSON.parse(this.errorMessage['_body']).message);
		          return Observable.throw(error);
		        }
		    );

    }

}
