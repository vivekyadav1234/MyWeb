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
  selector: 'app-designer-mgmt',
  templateUrl: './designer-mgmt.component.html',
  styleUrls: ['./designer-mgmt.component.css'],
   providers: [LeadService,CsagentService]
})
export class DesignerMgmtComponent implements OnInit {
	
	observableLeads: Observable<Lead[]>
	leads: any[];
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
	leadStatusUpdateForm : FormGroup;
	leadDetails:any;
	lead_campaigns;
	lead_sources;
	lead_types;
	internalStatus: boolean;
	searchItem=""

	constructor(
		private router: Router,
    	private route:ActivatedRoute,
    	private leadService:LeadService,
    	private csagentService:CsagentService,
    	private loaderService:LoaderService,
    	private formBuilder: FormBuilder
	) {
		this.role = localStorage.getItem('user');
	}

	ngOnChanges(): void {
    	this.getLeadListFromService();
    	// this.getLeadPoolList();
  	}

  	ngOnInit() {
    	this.getLeadListFromService();
    	this.getLeadPoolList();
    	this.getCMList();
	    this.leadStatusUpdateForm = this.formBuilder.group({
	      lead_status : new FormControl("",Validators.required),
	      follow_up_time : new FormControl(""),
	      lost_remark : new FormControl("")
	    });
	    this.updateLeadForm = this.formBuilder.group({
			id:new FormControl(""),
			name : new FormControl("",Validators.required),
			email : new FormControl("",[Validators.required,Validators.pattern("[^ @]*@[^ @]*.[^ @]")]),
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			lead_type_id : new FormControl("",Validators.required),
      		lead_source_id : new FormControl("",Validators.required),
      		lead_campaign_id:new FormControl(""),
      		lead_status : new FormControl(""),
	      	follow_up_time : new FormControl(""),
	      	lost_remark : new FormControl("")
		});
  	}
  	getLeadPoolList(){
  		this.loaderService.display(true);
  		this.csagentService.getLeadPoolList().subscribe(
  			res=>{
  				this.lead_campaigns = res.lead_campaigns;
				this.lead_sources =res.lead_sources;
				this.lead_types=res.lead_types;
				
				
				
  			},
  			err => {
  				
  			}
  		);
  	}

		headers_res;
		per_page;
		total_page;
		current_page;
		page_number;
  	getLeadListFromService(page?){
	    this.loaderService.display(true);
	    // this.observableLeads = this.leadService.getDesignerLeads(page);
	    this.leadService.getDesignerLeads(page).subscribe(
	        res => {
						this.page_number = page;
						this.headers_res= res.headers._headers;
						this.per_page = this.headers_res.get('x-per-page');
						this.total_page = this.headers_res.get('x-total');
						this.current_page = this.headers_res.get('x-page');
						res= res.json();
						this.leads = res.leads;
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
		
		searchDesignerLeads(){
	    this.loaderService.display(true);
	    this.leadService.getSearchedDesignerLeads(this.searchItem).subscribe(
	        res => {
						this.page_number = this.searchItem;
						this.headers_res= res.headers._headers;
						this.per_page = this.headers_res.get('x-per-page');
						this.total_page = this.headers_res.get('x-total');
						this.current_page = this.headers_res.get('x-page');
						res= res.json();
						this.leads = res.leads;
						this.loaderService.display(false);
	        },
	        error =>  {
	          this.erroralert = true;
	          this.errorMessage = <any>JSON.parse(error['_body']).message;
	          this.loaderService.display(false);
	        }
	    );
  	}

  	deleteLead(id) {
	    if(confirm('Are you sure you want to delete this lead?')== true) {
	      this.loaderService.display(true);
	      this.leadService.deleteLead(id)
	        .subscribe(
	          leads => {
	            this.successalert = true;
	            this.successMessage = "Lead deleted successfully";
	            setTimeout(function() {
	                this.successalert = false;
	             }.bind(this), 2000);

	            //$.notify('Deleted Successfully!');
	              this.getLeadListFromService();
	              //this.loaderService.display(false);
	            },
	            error =>  {
	              this.erroralert = true;
	              this.errorMessage = <any>JSON.parse(error['_body']).message;
	            //  $.notify('error',JSON.parse(this.errorMessage['_body']).message);
	               this.loaderService.display(false);
	            }
	        );
	    }
	}

	getCMList() {
	    this.leadService.getCommunityManagersList()
	        .subscribe(
	          res => {
	            Object.keys(res).map((key)=>{ this.cmList= res[key];});
	          },
	          error => {
	            this.erroralert = true;
	            this.errorMessage=JSON.parse(error['_body']).message;
	          }
	        );
	  }

	viewLeadDetails(id) {
	    this.leadService.viewLeadDetails(id)
	      .subscribe(
	          lead => {
	            this.leadDetails = lead;
	            Object.keys(lead).map((key)=>{ this.leadDetails= lead[key];});
	          },
	          error => {
	            this.erroralert = true;
	            this.errorMessage=JSON.parse(error['_body']).message;
	          }
	     );
	}

	setLeadStatus(value) {
	    if(value=='follow_up') {
	      document.getElementById('datetime').setAttribute('style','display: block');
	    } else {
	      document.getElementById('datetime').setAttribute('style','display: none');
	    }
	    if(value == 'lost') {
	      document.getElementById('lostremark').setAttribute('style','display: block');
	    } else {
	      document.getElementById('lostremark').setAttribute('style','display: none');
	    }
	}


	updateStatus(data,id) {
		this.loaderService.display(true);
		this.leadStatusUpdateForm.controls['lead_status'].setValue("");
		this.leadService.updateLeadStatus(data,id).subscribe(
		    res => {
		       this.successalertmodal = true;
		       this.loaderService.display(false);
		        this.successMessagemodal = "Status updated successfully !!";
		        document.getElementById('lostremark').setAttribute('style','display: none');
		        document.getElementById('datetime').setAttribute('style','display: none');
		        setTimeout(function() {
		             this.successalertmodal = false;
		        }.bind(this), 2000);
		      this.viewLeadDetails(id);
		    },
		    err => {
		      this.erroralertmodal = true;
		      document.getElementById('lostremark').setAttribute('style','display: none');
		      document.getElementById('datetime').setAttribute('style','display: none');
		        this.errorMessagemodal = JSON.parse(err['_body']).message;;
		        setTimeout(function() {
		             this.erroralertmodal = false;
		        }.bind(this), 2000);
		      this.viewLeadDetails(id);
		      this.loaderService.display(false);
		    }
		)
	}

	onDropdownChange(id,value,rowid) {
	    this.assignedAgentId[rowid] = value;
	    if(this.assignedAgentId[rowid] != undefined && this.assignedAgentId[rowid] !='Assign To Community Manager') {
	      document.getElementById("assigndropdown"+id).classList.remove('inputBorder');
	    }
	}
  	assignedAgentId =[];
  	cmList : any[];

  	assignLeadToAgent(id:number,index:number){
	    if(this.assignedAgentId[index] != undefined && this.assignedAgentId[index] !='Assign To Community Manager') {
	      this.loaderService.display(true);
	      this.leadService.assigndesignerToCM(this.assignedAgentId[index],id)
	                .subscribe(
	            res => {
	              Object.keys(res).map((key)=>{ res= res[key];});
	              this.getLeadListFromService(this.current_page);
	              this.assignedAgentId[index] = undefined;
	              this.loaderService.display(false);
	              this.successalert = true;
	              this.successMessage = "Assigned Successfully !!";
	              $(window).scrollTop(0);
	              setTimeout(function() {
	                    this.successalert = false;
	                 }.bind(this), 5000);
	              //$.notify('Assigned Successfully!');
	            },
	            error => {
	              this.erroralert = true;
	              this.errorMessage=JSON.parse(error['_body']).message;
	              this.loaderService.display(false);
	              $(window).scrollTop(0);
	              setTimeout(function() {
	                    this.erroralert = false;
	                 }.bind(this), 5000);
	              //$.notify(JSON.parse(this.errorMessage['_body']).message);
	            }
	          );
	    } else {
	       document.getElementById("assigndropdown"+id).classList.add('inputBorder');
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

	filtercol2Arr : any;
	filtercol1Val : any = 'all';
	filtercol2Val:any = '';
	fromDateFilter:any;
	toDateFilter:any;
	filteredleads:any[];
  	filterColumDropdownChange(colVal) {
	    document.getElementById('fromDateFilter').style.display = 'none';
	    document.getElementById('toDateFilter').style.display = 'none';
	    if(colVal == 'all'){
	      this.filtercol2Val = '';
	      this.filtercol2Arr = [];
	      document.getElementById('filter2dropdown').style.display = 'none';
	    } else if(colVal == 'lead_status') {
	      this.filtercol2Val = '';
	      this.filtercol2Arr = ['qualified','not_attempted','lost','claimed','not_claimed','follow_up','not_contactable','lost_after_5_tries'];
	      document.getElementById('filter2dropdown').style.display = 'inline-block';
	    } else if(colVal == 'user_type') {
	      this.filtercol2Val = '';
	      this.filtercol2Arr = ['customer','designer','manufacturer'];
	      document.getElementById('filter2dropdown').style.display = 'inline-block';
	    } else if(colVal == 'source') {
	      this.filtercol2Val = '';
	      this.filtercol2Arr = ['digital','bulk']
	      document.getElementById('filter2dropdown').style.display = 'inline-block';
	    } else if(colVal == 'lead_source') {
	      this.filtercol2Val = '';
	      this.filtercol2Arr = ['weddingz_team','hfc','broker', 'housing_finance', 'digital_marketing', 'referral', 'website'];
	      document.getElementById('filter2dropdown').style.display = 'inline-block';
	    } else if(colVal == 'created_at') {
	      this.filteredleads = this.leads;
	      document.getElementById('filter2dropdown').style.display = 'none';
	      document.getElementById('fromDateFilter').style.display = 'inline-block';
	      document.getElementById('toDateFilter').style.display = 'inline-block';
	    }
  	}
  	filterColum2DropdownChange(colVal){
	    this.leadService.getDesignerLeads(1).subscribe(
	      leads => {
	        this.filteredleads = leads;
	        Object.keys(leads).map((key)=>{ this.filteredleads= leads[key];});
	      },
	      error =>  {
	        
	      }
	    );
  	}

  	filterSubmit() {
	    this.loaderService.display(true);
	    this.leadService.getDesignerLeads(1).subscribe(
	      leads => {
	        this.filteredleads = leads;
	        Object.keys(leads).map((key)=>{ this.filteredleads= leads[key];});
	        this.leads =  this.filteredleads;
	        if(this.filtercol1Val == 'lead_status' ){
	          if(this.filtercol2Val == 'qualified') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status && this.leads[i].lead_status =='qualified'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'not_attempted') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status=='not_attempted'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'lost') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status=='lost'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'claimed') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status=='claimed'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'not_claimed') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status=='not_claimed'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'follow_up') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status=='follow_up'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'not_contactable') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status=='not_contactable'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'lost_after_5_tries') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_status=='lost_after_5_tries'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          }
	        }
	        if(this.filtercol1Val == 'lead_source' ){
	          if(this.filtercol2Val == 'weddingz_team') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_source =='weddingz_team'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'hfc') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_source=='hfc'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'broker') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_source=='broker'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'housing_finance') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_source=='housing_finance'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'digital_marketing') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_source=='digital_marketing'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'referral') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_source=='referral'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'website') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].lead_source=='website'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } 
	        }
	        if(this.filtercol1Val == 'source' ){
	          if(this.filtercol2Val == 'digital') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].source =='digital'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'bulk') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].source=='bulk'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } 
	        }
	        if(this.filtercol1Val == 'all' ){
	          this.getLeadListFromService();
	        }
	        if(this.filtercol1Val == 'user_type' ){
	          if(this.filtercol2Val == 'designer') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].user_type =='designer'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'customer') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].user_type=='customer'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          } else if(this.filtercol2Val == 'manufacturer') {
	            var filteredArr = new Array();
	            for(var i =0;i<this.leads.length;i++){
	              if(this.leads[i].user_type=='manufacturer'){
	                filteredArr.push(this.leads[i]);
	              }
	            }
	            this.leads = filteredArr;
	          }
	        }
	        if(this.filtercol1Val == 'created_at'){
	          this.leadService.filteredLeads('all','created_at',this.fromDateFilter,this.toDateFilter)
	          .subscribe(
	            res => {
	              Object.keys(res).map((key)=>{ filteredArr= res[key];});
	              this.leads = filteredArr;
	            },
	            err => {
	              
	            }
	          );
	        }
	        this.loaderService.display(false);
	      },
	      error =>  {
	        
	        this.loaderService.display(false);
	      }
	    );
  	}


  	leadLogs;
  	Object;

  	getLeadHistory(leadId){
	    this.Object = Object;
	    this.leadService.getLeadLog(leadId).subscribe(
	      res => {
	        
	        this.leadLogs = res;
	      },
	      err => {
	        
	      }
	    );
  	}

  	isDate(str){
  		// format D(D)/M(M)/(YY)YY
	    var dateFormat = /^\d{1,4}[\.|\/|-]\d{1,2}[\.|\/|-]\d{1,4}$/;

	    if (dateFormat.test(str)) {
	        // remove any leading zeros from date values
	        str = str.replace(/0*(\d*)/gi,"$1");
	        var dateArray = str.split(/[\.|\/|-]/);
	      
	              // correct month value
	        dateArray[1] = dateArray[1]-1;

	        // correct year value
	        if (dateArray[2].length<4) {
	            // correct year value
	            dateArray[2] = (parseInt(dateArray[2]) < 50) ? 2000 + parseInt(dateArray[2]) : 1900 + parseInt(dateArray[2]);
	        }

	        var testDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
	        if (testDate.getDate()!=dateArray[0] || testDate.getMonth()!=dateArray[1] || testDate.getFullYear()!=dateArray[2]) {
	            return false;
	        } else {
	            return true;
	        }
	    } else {
	        return false;
	    }
    	//return (new Date(str).toString() !== "Invalid Date" ) ? true : false;
  	}


  	setUpdatedLead(value){
		
		this.updateLeadForm.controls['id'].setValue(value.id);
		this.updateLeadForm.controls['name'].setValue(value.name);
		this.updateLeadForm.controls['email'].setValue(value.email);
		this.updateLeadForm.controls['contact'].setValue(value.contact);
		this.updateLeadForm.controls['pincode'].setValue(value.pincode);
		this.updateLeadForm.controls['lead_type_id'].setValue(value.lead_type_id);
		this.updateLeadForm.controls['lead_source_id'].setValue(value.lead_source_id);
		this.updateLeadForm.controls['lead_campaign_id'].setValue(value.lead_campaign_id);
		this.updateLeadForm.controls['lead_status'].setValue(value.lead_status);
		this.updateLeadForm.controls['follow_up_time'].setValue(value.follow_up_time);
		this.updateLeadForm.controls['lost_remark'].setValue(value.lost_remark);
		// this.setLeadStatus(value.lead_status);
	}
	updateLeadFormSubmit(data){
		this.loaderService.display(true);
		
		// data['lead_status']= changeStatusForm.lead_status;
		// data['lost_remark']=changeStatusForm.lost_remark;
		// data['follow_up_time']=changeStatusForm.follow_up_time;
		this.leadService.editLead(data.id,data).subscribe(
			res => {
				
				this.updateLeadForm.reset();
				$('#editLeadModal').modal('hide');
				this.getLeadListFromService();
				this.loaderService.display(false);
				this.successalert = true;
				this.successMessage = "Details updated successfully !!";
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
			},
			err => {
				
				this.loaderService.display(false);
				this.erroralert = true;
				this.errorMessage = JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
			}
		);

	}
	updateLeadForm:FormGroup;
	numberCheck(e) {
	    if(!((e.keyCode > 95 && e.keyCode < 106)
	        || (e.keyCode > 47 && e.keyCode < 58)
	        || e.keyCode == 8 || e.keyCode == 39 || 
	        e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9 || e.keyCode == 17
	        || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67 )) {
	      return false;
	    }
  	}


internalExternalHandler(lead_related_user_id, leadInternalStatus){
	this.loaderService.display(true);
	this.leadService.updateInternalExternalStatus(lead_related_user_id, leadInternalStatus)
	.subscribe(
		leads => {
			this.successalert = true;
				this.loaderService.display(false);
				setTimeout(function() {
					this.successalert = false;
				}.bind(this), 10000);
				this.getLeadListFromService(this.current_page);
				setTimeout(function() {
					this.successMessage = "Status successfully updated";
				}.bind(this), 1000);
			},
			error =>  {
				this.erroralert = true;
				this.errorMessage = <any>JSON.parse(error['_body']).message;
				 this.loaderService.display(false);
			}
	);
}

designerSearch(){
	
}
}