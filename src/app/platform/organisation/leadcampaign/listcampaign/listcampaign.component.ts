import { Component, OnInit } from '@angular/core';
import {LeadcampaignService} from '../leadcampaign.service';
import {Observable} from 'rxjs/Observable';
import {
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';

declare var $:any;

@Component({
  selector: 'app-listcampaign',
  templateUrl: './listcampaign.component.html',
  styleUrls: ['./listcampaign.component.css'],
  providers: [LeadcampaignService]
})
export class ListcampaignComponent implements OnInit {

	errorMessage : string;
 	erroralert = false;
	successalert = false;
	successMessage : string;
	createCampaignForm : FormGroup;
	campaigns;
	editCampaignName;
	editCampaignLocation;
	editCampaignStatus;
	editCampaignStartDate;
	editCampaignEndDate

	constructor(
		private loaderService : LoaderService,
		private campaignService : LeadcampaignService,
		private formBuilder: FormBuilder
	) { }
	
	ngOnInit() {
		this.createCampaignForm = this.formBuilder.group({
			name : new FormControl(),
			status: new FormControl(""),
			location:new FormControl(),
			start_date: new FormControl(),
			end_date: new FormControl()
		});
	}

	ngAfterViewInit(){
		this.getCampaignsList();
	}

	getCampaignsList(){
		this.loaderService.display(true);
		this.campaignService.getCampaigns().subscribe(
			res => {
				this.campaigns = res.lead_campaigns;
				this.loaderService.display(false);
			},
			err => {
				
				this.errorMessage =<any>JSON.parse(err['_body']).message;
				this.erroralert = true;
				this.loaderService.display(false);
				setTimeout(function() {
                	this.erroralert = false;
             	}.bind(this), 2000);
			}
		);
	}

	// openCampaignForm(){
	// 	document.getElementById('campaignFormRow').classList.remove('d-none');
	// }

	closeForm(){
		this.createCampaignForm.reset();
		this.createCampaignForm.controls['status'].setValue("");
	}

	createNewCampaign(data){
		$('#createcampaignModal').modal('hide');
		this.loaderService.display(true);
		var obj = {
		    "lead_campaign": data
		}
		this.campaignService.createCampaign(data).subscribe(
			res => {
				this.getCampaignsList();
				
				this.createCampaignForm.reset();
				//document.getElementById('campaignFormRow').classList.add('d-none');
				this.successMessage = 'Created successfully!';
				this.successalert = true;
				setTimeout(function() {
                	this.successalert = false;
             	}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err => {
				
				this.errorMessage =<any>JSON.parse(err['_body']).message;
				this.erroralert = true;
				setTimeout(function() {
                	this.erroralert = false;
             	}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	editCampaign(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		document.getElementById('lastTdEditForm').setAttribute('style','min-width:25rem');
		this.editCampaignName = data.name;
		this.editCampaignLocation = data.location;
		this.editCampaignStatus = data.status;
		this.editCampaignStartDate = data.start_date;
		this.editCampaignEndDate =data.end_date
	}

	replaceAll(str, a, b) {
	    return str.split(a).join(b);
	}


	cancelEditCampaignRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		document.getElementById('lastTdEditForm').setAttribute('style','min-width:15rem');
		this.editCampaignName = undefined;
		this.editCampaignLocation =undefined;
		this.editCampaignStartDate= undefined;
		this.editCampaignStatus = undefined;
		this.editCampaignEndDate = undefined;
	}

	updateCampaignData(i,campaignID){
		this.loaderService.display(true);
		var obj = {
		    "lead_campaign": {
		    	'name':this.editCampaignName,
		    	'location':this.editCampaignLocation,
		    	'start_date':this.editCampaignStartDate,
		    	'end_date':this.editCampaignEndDate,
		    	'status':this.editCampaignStatus
		    }
		}
		this.campaignService.updateCampaign(obj,campaignID).subscribe(
			res => {
				this.getCampaignsList();
				this.cancelEditCampaignRow(i);
				this.editCampaignName = undefined;
				this.editCampaignLocation =undefined;
				this.editCampaignStartDate= undefined;
				this.editCampaignStatus = undefined;
				this.editCampaignEndDate = undefined;
				this.successMessage = 'Updated successfully!';
				this.successalert = true;
				setTimeout(function() {
                	this.successalert = false;
             	}.bind(this), 13000);
				this.loaderService.display(false);
			},
			err => {
				this.errorMessage = <any>JSON.parse(err['_body']).message;
				this.erroralert = true;
				setTimeout(function() {
                	this.erroralert = false;
             	}.bind(this), 13000);
				this.loaderService.display(false);
			}
		);
	}

	direction: number;
  	isDesc: boolean = true;
  	column: string = 'name';
	sort(property){
		this.isDesc = !this.isDesc; //change the direction    
		this.column = property;
		this.direction = this.isDesc ? 1 : -1;
	}
}
