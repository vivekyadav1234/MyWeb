import { Component, OnInit } from '@angular/core';
import { CsagentService } from '../csagentdashboard/csagent.service';
import {Observable} from 'rxjs/Observable';
import {
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;


@Component({
  selector: 'app-csagent-statuslist',
  templateUrl: './csagent-statuslist.component.html',
  styleUrls: ['./csagent-statuslist.component.css'],
  providers: [CsagentService]
})
export class CsagentStatuslistComponent implements OnInit {

	errorMessage : string;
 	erroralert = false;
	successalert = false;
	successMessage : string;
	csagentslist;
	csagentlistSubscription;
	timerSubscription;
	selectedTab = 'csAgentTab';
	lead_tyesArr;
	lead_sourceArr;
	lead_campaignsArr;
	csagentsArr;
	assignedCsagentLeadType =[];
	assignedCSAgentSource =[];
	assignedCsagentLeadCamp =[];
	
	constructor(
		private loaderService : LoaderService,
		private csagentService:CsagentService
	) { }

	ngOnInit() {
		this.getCSAgentList();
		this.getLeadPoolList();
	}

	getCSAgentList(){
		this.loaderService.display(true);
		this.csagentService.getCsagentstatuslist().subscribe(
			res => {
				this.csagentslist = res;
				this.loaderService.display(false);
				//this.refreshData();
			},
			err => {
				
				this.loaderService.display(false);
			}
		);
	}
	private refreshData(): void {
	    this.csagentlistSubscription = this.csagentService.getCsagentstatuslist().
	    subscribe(res => {
	        this.csagentslist = res;
	        this.subscribeToData();
	    });
	}

	private subscribeToData(): void {
	    this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.refreshData());
	}

	public ngOnDestroy(): void {
	    if (this.csagentlistSubscription) {
	        this.csagentlistSubscription.unsubscribe();
	    }
	    if (this.timerSubscription) {
	        this.timerSubscription.unsubscribe();
	    }
	}

	direction: number;
  	isDesc: boolean = true;
  	column: string;
	sort(property){
		this.isDesc = !this.isDesc; //change the direction    
		this.column = property;
		this.direction = this.isDesc ? 1 : -1;
	}

	setSelectedTab(val){
		this.selectedTab = val;
	}

	getLeadPoolList(){
		this.loaderService.display(true);
		this.csagentService.getLeadPoolList().subscribe(
			res => {
				this.lead_tyesArr = res.lead_types;
				this.lead_campaignsArr = res.lead_campaigns;
				this.lead_sourceArr = res.lead_sources;
				this.csagentsArr = res.cs_agents;
				this.loaderService.display(false);
			},
			err => {
				
				this.loaderService.display(false);
			}
		);
	}

	onDropdownChange(id,value,rowid,info){
		if(info=='leadtype') {
			this.assignedCsagentLeadType[rowid] = value;
		    if(this.assignedCsagentLeadType[rowid] != undefined && this.assignedCsagentLeadType[rowid] !='') {
		      document.getElementById("assigncsagent_leadtype_"+id).classList.remove('inputBorder');
		    }
		} else if(info == 'campaign'){
			this.assignedCsagentLeadCamp[rowid] = value;
		    if(this.assignedCsagentLeadCamp[rowid] != undefined && this.assignedCsagentLeadCamp[rowid] !='') {
		      document.getElementById("assigncsagent_leadcamp_"+id).classList.remove('inputBorder');
		    }
		} else if(info == 'source'){
			this.assignedCSAgentSource[rowid]=value;
			if(this.assignedCSAgentSource[rowid] != undefined && this.assignedCSAgentSource[rowid] !='') {
		      document.getElementById("assigncsagent_leadsource_"+id).classList.remove('inputBorder');
		    }
		}
	    
	}

	assignCSAgentType(id,index,leadtypename) {
	    if(this.assignedCsagentLeadType[index] != undefined && this.assignedCsagentLeadType[index] !='') {
	      document.getElementById("assigncsagent_leadtype_"+id).classList.remove('inputBorder');
	      this.loaderService.display(true);
	      this.csagentService.assignCSagentToLeadType(id,this.assignedCsagentLeadType[index].split('-')[0])
	          .subscribe(
	              res => {
	              	this.getLeadPoolList();
	                this.loaderService.display(false);
	                this.successalert = true;
	                this.successMessage = leadtypename+" has been assigned to "+this.assignedCsagentLeadType[index].split('-')[1] +" successfully!";
	                this.assignedCsagentLeadType[index] = undefined;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                     this.successalert = false;
	                     this.successMessage="";
	                }.bind(this), 5000);
	              },
	              error => {
	                
	                this.loaderService.display(false);
	                this.erroralert = true;
	                this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                         this.erroralert = false;
	                         this.errorMessage="";
	                 }.bind(this), 5000);
	              }
	            );
	    } else {
	      document.getElementById("assigncsagent_leadtype_"+id).classList.add('inputBorder');
	    }
	}
	unassignCSAgentType(leadtypeId,rowid,leadtypename,agentId,agentName){
		 this.loaderService.display(true);
		this.csagentService.assignCSagentToLeadType(leadtypeId,agentId)
	          .subscribe(
	              res => {
	              	this.getLeadPoolList();
	                this.loaderService.display(false);
	                this.successalert = true;
	                this.successMessage = agentName+" has been unassigned for the "+leadtypename+" successfully. ";
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                     this.successalert = false;
	                     this.successMessage="";
	                }.bind(this), 5000);
	              },
	              error => {
	                
	                this.loaderService.display(false);
	                this.erroralert = true;
	                this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                         this.erroralert = false;
	                         this.errorMessage="";
	                 }.bind(this), 5000);
	              }
	            );
	}
	assignCSAgentSource(id,index,leadtypename) {
	    if(this.assignedCSAgentSource[index] != undefined && this.assignedCSAgentSource[index] !='') {
	      document.getElementById("assigncsagent_leadsource_"+id).classList.remove('inputBorder');
	      this.loaderService.display(true);
	      this.csagentService.assignCSagentToLeadSource(id,this.assignedCSAgentSource[index].split('-')[0])
	          .subscribe(
	              res => {
	              	this.getLeadPoolList(); 
	                this.loaderService.display(false);
	                this.successalert = true;
	                this.successMessage = leadtypename+" has been assigned to "+this.assignedCSAgentSource[index].split('-')[1] +" successfully!";;
	                this.assignedCSAgentSource[index] = undefined;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                     this.successalert = false;
	                     this.successMessage="";
	                }.bind(this), 5000);
	              },
	              error => {
	                
	                this.loaderService.display(false);
	                this.erroralert = true;
	                this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                         this.erroralert = false;
	                         this.errorMessage="";
	                 }.bind(this), 5000);
	              }
	            );
	    } else {
	      document.getElementById("assigncsagent_leadsource_"+id).classList.add('inputBorder');
	    }
	}
	unassignCSAgentSource(Id,rowid,leadtsourcename,agentId,agentName){
		 this.loaderService.display(true);
		this.csagentService.assignCSagentToLeadSource(Id,agentId)
	          .subscribe(
	              res => {
	              	this.getLeadPoolList();
	                this.loaderService.display(false);
	                this.successalert = true;
	                this.successMessage = agentName+" has been unassigned for the "+leadtsourcename+" successfully. ";
	               
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                     this.successalert = false;
	                      this.successMessage="";
	                }.bind(this), 5000);
	              },
	              error => {
	                
	                this.loaderService.display(false);
	                this.erroralert = true;
	                this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                         this.erroralert = false;
	                         this.errorMessage="";
	                 }.bind(this), 5000);
	              }
	            );
	}
	assignCSAgentCampaign(id,index,leadtypename) {
	    if(this.assignedCsagentLeadCamp[index] != undefined && this.assignedCsagentLeadCamp[index] !='') {
	      document.getElementById("assigncsagent_leadcamp_"+id).classList.remove('inputBorder');
	      this.loaderService.display(true);
	      this.csagentService.assignCSagentToLeadCampaign(id,this.assignedCsagentLeadCamp[index].split('-')[0])
	          .subscribe(
	              res => {
	              	this.getLeadPoolList();                //Object.keys(res).map((key)=>{ res= res[key];});
	                this.loaderService.display(false);
	                this.successalert = true;
	                this.successMessage = leadtypename+" has been assigned to "+ this.assignedCsagentLeadCamp[index].split('-')[1]+" successfully!";
	                this.assignedCsagentLeadCamp[index] = undefined;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                     this.successalert = false;
	                }.bind(this), 5000);
	              },
	              error => {
	                
	                this.loaderService.display(false);
	                this.erroralert = true;
	                this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                         this.erroralert = false;
	                 }.bind(this), 5000);
	              }
	            );
	    } else {
	      document.getElementById("assigncsagent_leadcamp_"+id).classList.add('inputBorder');
	    }
	}
	unassignCSAgentCamp(Id,rowid,leadcampname,agentId,agentName){
		 this.loaderService.display(true);
		this.csagentService.assignCSagentToLeadCampaign(Id,agentId)
	          .subscribe(
	              res => {
	              	this.getLeadPoolList();
	                this.loaderService.display(false);
	                this.successalert = true;
	                this.successMessage = agentName+" has been unassigned for the "+leadcampname+" successfully. ";
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                     this.successalert = false;
	                }.bind(this), 5000);
	              },
	              error => {
	                
	                this.loaderService.display(false);
	                this.erroralert = true;
	                this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
	                $(window).scrollTop(0);
	                setTimeout(function() {
	                         this.erroralert = false;
	                 }.bind(this), 5000);
	              }
	            );
	}	
}
