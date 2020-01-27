import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrokerService } from '../../broker-dashboard/broker.service';
import { LeadService } from '../../../lead/lead.service';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-listbrokers',
  templateUrl: './listbrokers.component.html',
  styleUrls: ['./listbrokers.component.css'],
  providers : [BrokerService,LeadService]
})
export class ListbrokersComponent implements OnInit {

	role : string;
	leads: any[];
	leadDetails:any;
	brokerDetails:any;
	errorMessage : string;
	errorMessageModal : string;
	erroralert = false;
	erroralertmodal = false;
	successalert = false;
	successalertmodal = false;
	successMessageModal:string;
	successMessage : string;
	notAttemptedLeadCount = 0;
	lostLeadCount = 0;
  	qualifiedLeadCount = 0;
    leadStatusUpdateForm : FormGroup;
    approveBrokerKYC : FormGroup;

  	constructor(
  		private router: Router,
    	private route:ActivatedRoute,
    	private brokerService:BrokerService,
    	private loaderService:LoaderService,
    	private formBuilder: FormBuilder,
    	private leadService:LeadService
  	) {
  		this.role = localStorage.getItem('user');
  	}

 
  	ngOnInit() {
		this.getLeadListFromService();
		this.leadStatusUpdateForm = this.formBuilder.group({
	      lead_status : new FormControl("",Validators.required),
	      lost_remark : new FormControl("")
	    });
	    // this.approveBrokerKYC = this.formBuilder.group({
	    // 	kyc_approved : new FormControl()
	    // });
	}

	getLeadListFromService(){
	    this.brokerService.getLeadList().subscribe(
	        leads => {
	          this.leads = leads;
	          Object.keys(leads).map((key)=>{ this.leads= leads[key];});
	          this.loaderService.display(false);
	        },
	        error =>  {
	          this.erroralert = true;
	          this.errorMessage = <any>JSON.parse(error['_body']).message;
	          this.loaderService.display(false);
	        }
	    );
  	}

  	viewLeadDetails(id,user_reference) {
	    this.brokerService.viewLeadDetails(id)
	      .subscribe(
	          lead => {
	            this.leadDetails = lead;
	            Object.keys(lead).map((key)=>{ this.leadDetails= lead[key];});
	            if(this.leadDetails.lead_status == 'qualified'){
	            	this.viewQualifiedBrokerDetails(user_reference.id);
	            }
	          },
	          error => {
	            this.erroralert = true;
	            this.errorMessage=JSON.parse(error['_body']).message;
	          }
	     );
  	}

  	setLeadStatus(value) {
	    if(value == 'lost') {
	      document.getElementById('lostremark').setAttribute('style','display: block');
	    } else {
	      document.getElementById('lostremark').setAttribute('style','display: none');
	    }
	}
   
  	updateStatus(data,id,user_reference) {
	    this.leadStatusUpdateForm.controls['lead_status'].setValue("");
	    this.leadService.updateLeadStatus(data,id).subscribe(
	        res => {
	           this.successalertmodal = true;
	            this.successMessageModal = "Status updated successfully !!";
	            document.getElementById('lostremark').setAttribute('style','display: none');
	            setTimeout(function() {
	                 this.successalertmodal = false;
	            }.bind(this), 10000);
	          	this.viewLeadDetails(id,user_reference);
	        },
	        err => {
	          this.erroralertmodal = true;
	          document.getElementById('lostremark').setAttribute('style','display: none');
	            this.errorMessageModal = JSON.parse(err['_body']).message;
	            setTimeout(function() {
	                this.erroralertmodal = false;
	            }.bind(this), 10000);
	          	this.viewLeadDetails(id,user_reference);
	        }
	    )
    }

    closeModal(){
    	this.getLeadListFromService();
    }

    viewQualifiedBrokerDetails(id) {
    	this.brokerService.viewBrokerDetails(id)
	      .subscribe(
	          res => {
	            this.brokerDetails = res;
	            Object.keys(res).map((key)=>{ this.brokerDetails= res[key];});
	          },
	          error => {
	            this.erroralert = true;
	            this.errorMessage=JSON.parse(error['_body']).message;
	            setTimeout(function() {
				 	this.erroralert = false;
				}.bind(this), 10000);
	          }
	     );
    }

    approveBrokerKYCData(id,status) {
    	this.brokerService.approveBrokerKYC(id,status)
	      .subscribe(
	          res => {
	            this.brokerDetails = res;
	            Object.keys(res).map((key)=>{ this.brokerDetails= res[key];});
	            this.successMessageModal = 'KYC status update successfully!';
	            this.successalertmodal = true;
	             setTimeout(function() {
				 	this.successalertmodal = false;
				 }.bind(this), 10000);
	          },
	          error => {
	            this.erroralertmodal = true;
	            this.errorMessageModal=JSON.parse(error['_body']).message;
	             setTimeout(function() {
				 	this.erroralertmodal = false;
				 }.bind(this), 10000);
	          }
	    );
    }

}
