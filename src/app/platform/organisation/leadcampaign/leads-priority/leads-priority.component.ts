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
  selector: 'app-leads-priority',
  templateUrl: './leads-priority.component.html',
  styleUrls: ['./leads-priority.component.css'],
  providers: [LeadcampaignService]
})
export class LeadsPriorityComponent implements OnInit {

	errorMessage : string;
 	erroralert = false;
	successalert = false;
	successMessage : string;
	createPriorityForm : FormGroup;
	prioritiesList;
	selectOptions;
	editPriorityLeadSource;
	editPriorityLeadType ;
	editPriorityLeadCampaign ;
	maxPriorityNumber ;
	changedPriorityNumber;
	constructor(
		private loaderService : LoaderService,
		private campaignService : LeadcampaignService,
		private formBuilder: FormBuilder
	) { }

	ngOnInit() {
		this.createPriorityForm = this.formBuilder.group({
			lead_source_id : new FormControl(''),
			lead_type_id: new FormControl(''),
			lead_campaign_id:new FormControl('')
		});
		// this.getOptionsForSelect();
		this.getPrioritiesList();
	}

	

	getPrioritiesList(){
		this.loaderService.display(true);
		this.campaignService.getPrioritiesList().subscribe(
			res => {
				this.loaderService.display(false);
				this.prioritiesList = res.lead_priorities;
				this.maxPriorityNumber = this.prioritiesList.length;
				this.selectOptions = res.select_options;
			},
			err => {
				this.loaderService.display(false);
				
			}
		);
	}

	openPriorityForm(){
		// document.getElementById('priorityFormRow').classList.remove('d-none');
	}

	closeForm(){
		// document.getElementById('priorityFormRow').classList.add('d-none');
	}

	createNewPriority(data){
		this.loaderService.display(true);
		var obj = {
		    "lead_priority": data
		}
		this.campaignService.createPriority(data).subscribe(
			res => {
				this.getPrioritiesList();
				$('#createpriorityModal').modal('hide');
				this.createPriorityForm.reset();
				this.createPriorityForm.controls['lead_source_id'].setValue('');
				this.createPriorityForm.controls['lead_type_id'].setValue('');
				this.createPriorityForm.controls['lead_campaign_id'].setValue('');
				// document.getElementById('priorityFormRow').classList.add('d-none');
				this.successMessage = 'Created successfully!';
				this.successalert = true;
				setTimeout(function() {
                	this.successalert = false;
             	}.bind(this), 20000);
				this.loaderService.display(false);
			},
			err => {
				
				if(JSON.parse(err['_body']).message){
					this.errorMessage =<any>JSON.parse(err['_body']).message;
				}
				if(JSON.parse(err['_body']).lead_type){
					this.errorMessage =<any>JSON.parse(err['_body']).lead_type;
				}
				if(JSON.parse(err['_body']).lead_source){
					this.errorMessage ='Lead source ' + <any>JSON.parse(err['_body']).lead_source;
				}
				this.erroralert = true;
				setTimeout(function() {
                	this.erroralert = false;
             	}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	deletePriority(rowno,data){
		if(confirm('Are you sure you want to delete this priority?')== true){
			this.loaderService.display(true);
			this.campaignService.deletePriority(data.id).subscribe(
				res => {
					this.getPrioritiesList();
					this.successMessage = 'Deleted successfully!';
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
	}

	editPriority(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		//document.getElementById('lastTdEditForm').setAttribute('style','min-width:25rem');
		this.editPriorityLeadSource = data.lead_source_id;
		this.editPriorityLeadType = data.lead_type_id;
		this.editPriorityLeadCampaign = data.lead_campaign_id;
	}

	cancelEditPriorityRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		//document.getElementById('lastTdEditForm').setAttribute('style','min-width:15rem');
		this.editPriorityLeadSource = undefined;
		this.editPriorityLeadType =undefined;
		this.editPriorityLeadCampaign= undefined;
	}

	updatePriorityData(i,priorityId){
		this.loaderService.display(true);
		var obj = {
		    "lead_priority": {
		    	'lead_campaign_id':this.editPriorityLeadCampaign,
		    	'lead_source_id':this.editPriorityLeadSource,
		    	'lead_type_id':this.editPriorityLeadType
		    }
		}
		this.campaignService.editPriority(obj,priorityId).subscribe(
			res => {
				this.getPrioritiesList();
				this.cancelEditPriorityRow(i);
				this.editPriorityLeadType = undefined;
				this.editPriorityLeadSource =undefined;
				this.editPriorityLeadCampaign= undefined;
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

	newPriorityNumber='0';
	newPriorityValues = new Array();
	setNewPriorityVal(value){
		var arr = value.split('-');
		if(arr[2]=='na'){
			this.newPriorityNumber='';
			if(document.getElementById('newPriorityNumberInput')){
				document.getElementById('newPriorityNumberInput').classList.add('d-none');
			}
		}
		if(arr[2]=='pos'){
			this.newPriorityNumber= this.newPriorityNumber;
			document.getElementById('newPriorityNumberInput').classList.remove('d-none');
		}
		this.newPriorityValues[0]=arr[0];
		this.newPriorityValues[1]=arr[1];
		
	}

	changePriority(data,direction,steps,priorityNumber){
		this.loaderService.display(true);
		this.campaignService.changePriority(data,priorityNumber,direction,steps)
		.subscribe(
			res => {
				this.changedPriorityNumber = undefined;
				this.getPrioritiesList();
				this.successMessage = 'Changed successfully!';
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

	setDataInDropDownDiv(data,val,classname,i,direction,steps){
		var id = 'dropdownMenuButton'+i
		$("#"+id).html("<i class="+classname+" ml-2'></i>"+val);
		if(direction != '' && steps !='' && classname!=''){
			this.changePriority(data.id,direction,steps,'');
		} else{
			this.changePriority(data.id,direction,steps,val);
		}
		
	}

}
