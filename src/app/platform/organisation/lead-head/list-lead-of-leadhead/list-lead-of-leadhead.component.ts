import { Component, OnInit ,Input,ChangeDetectorRef} from '@angular/core';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
import {LeadService} from '../../../lead/lead.service';
import { ActivityLogsService } from '../../../activity-logs/activity-logs.service';
import {Location} from '@angular/common';
import { SalesManagerService } from '../../../salesmanager/sales-manager.service';
import { FormControl,
	FormArray,
	FormBuilder,
	FormGroup,
	Validators } from '@angular/forms';
// import {LeadquestionnaireComponent} from '../../../../shared/leadquestionnaire/leadquestionnaire.component';
declare var $:any;

@Component({
  selector: 'app-list-lead-of-leadhead',
  templateUrl: './list-lead-of-leadhead.component.html',
  styleUrls: ['./list-lead-of-leadhead.component.css'],
  providers:[LeadService,ActivityLogsService,SalesManagerService]
})
export class ListLeadOfLeadheadComponent implements OnInit {

	// @Input() leadDetails;
	lead_status;
	lead_type;
	lead_type_id;
	cm_type;
	cm_type_id;
	breadcrumval;
	source=[];
	lead_statusArr=[];
	lead_type_idArr=[];
	cm_type_idArr=[];
	mkw_fhi_Arr=[];
	lead_source_idArr=[];
	lead_campaign_idArr=[];
	csagents_idArr=[];
	filteredLeads=[];
	from_date;
	to_date;
	column_name='created_at';
	digital_physical='';
	internal_external='';
	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
	role;
	addLeadForm:FormGroup;
	updateLeadForm:FormGroup;
	attachment_file: any;
	attachment_name: string;
	basefile: any;
	updateLeadquestionnaireForm:FormGroup;
	sourceOfBulkLeads="";
	typeOfBulkLeads="";
	campignOfBulkLeads="";
	accommodation_type = ['Studio Apartment','1RK','1BHK','1.5BHK','2BHK','2.5BHK','3BHK',
    '3.5BHK','4BHK','4.5BHK','5BHK','Villa','Bungalow','Office Space'];
  	scopeOfwork = ['Modular Kitchen','Loose Furniture','Full Home Interiors (Design)','Full Home Interiors (Design & Fullfilment)','Partial Home Interiors (e.g. MKW + Living Room)'];
    callbacktime = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM',
                '1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
                '5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM',
                '10:00 PM','10:30 PM','11:00 PM'];
    estimatedPossessionTime = ['Jan-18','Feb-18','Mar-18','Apr-18','May-18',
    'Jun-18','Jul-18','Aug-18','Sep-18','Oct-18','Nov-18','Dec-18'];
    queryParamsLeadSource;
    queryParamsLeadCamp;
		queryParamsLeadType;
		queryParamsCMType;
		queryParamsMKWFHI;
    queryParamsFromDate;
    queryParamsToDate;
    current_user_id;
    referrer_type="";
 	referrer_type_id;
  	lead_referrer_list=[];
		user_id;
		userList=[];
    lostReasonsArr=['low_budget','non_serviceable_area','out_of_scope','general_inquiry/not_interested',
    'language_barrier','already_done_with_other_vendor','others'];
     
	constructor(
		private route:ActivatedRoute,
		private leadService:LeadService,
		private loaderService:LoaderService,
		private formBuilder:FormBuilder,
		public activityLogsService : ActivityLogsService,
		public router:Router, public location:Location,
		private salesService: SalesManagerService,
		private ref: ChangeDetectorRef
	) {
		// this.routeChanged();
	 }


	private routeChanged():void {
   	 //var path:string = this.location.path();
   	 	// this.router.navigate([path]);
    	//
  	}
  	ngAfterViewInit(){
  		
  	}
	ngOnInit() {
		this.user_id =localStorage.getItem('userId');
		this.role =localStorage.getItem('user');
		this.current_user_id  = localStorage.getItem('userId');
		this.route.queryParams.subscribe(params => {
			this.lead_status = params['lead_status'];
			this.lead_type = params['lead_type'];
			this.cm_type = params['cm_type'];
			this.lead_type_id = params['id'];
			if(params['lead_sources']!=undefined){
				this.queryParamsLeadSource = JSON.parse(params['lead_sources']);
			}
			if(params['lead_campaigns']!=undefined){
				this.queryParamsLeadCamp = JSON.parse(params['lead_campaigns']);
			}
			if(params['lead_types']!=undefined){
				this.queryParamsLeadType = JSON.parse(params['lead_types']);
			}
			if(params['mkw_fhi']!=undefined){
				this.queryParamsMKWFHI = JSON.parse(params['mkw_fhi']);
			}

			this.queryParamsFromDate = params['from_date'];
			this.queryParamsToDate = params['to_date'];

		});
		if(this.queryParamsLeadSource!=undefined && this.queryParamsLeadSource.length>0){
			this.lead_source_idArr=this.queryParamsLeadSource;
		}
		if(this.queryParamsLeadCamp!=undefined && this.queryParamsLeadCamp.length>0){
			this.lead_campaign_idArr=this.queryParamsLeadCamp;
		}
		if(this.queryParamsLeadType!=undefined && this.queryParamsLeadType.length>0){
			this.lead_type_idArr=this.queryParamsLeadType;
		}
		if(this.queryParamsCMType!=undefined && this.queryParamsCMType.length>0){
			this.cm_type_idArr=this.queryParamsCMType;
		}
		if(this.queryParamsMKWFHI!=undefined && this.queryParamsMKWFHI.length>0){
			this.mkw_fhi_Arr=this.queryParamsMKWFHI;
		}
		if(this.queryParamsFromDate!=undefined && this.queryParamsFromDate!=''){
			this.from_date=this.queryParamsFromDate;
		}
		if(this.queryParamsToDate!=undefined && this.queryParamsToDate!=''){
			this.to_date=this.queryParamsToDate;
		}
		if(this.lead_type !=undefined){
			this.breadcrumval = this.lead_type;
			if(this.lead_type_id !=undefined){
				this.lead_type_idArr.push(this.lead_type_id);
			}
			this.dropdownSettings["text"] = this.lead_type;
			this.dropdownSettings["disabled"]=true;
			//this.selectedItems.push({id:this.lead_type_id,itemName:this.lead_type});
		}
		if(this.cm_type !=undefined){
			this.breadcrumval = this.cm_type;
			if(this.cm_type_id !=undefined){
				this.cm_type_idArr.push(this.cm_type_id);
			}
			this.dropdownSettings["text"] = this.cm_type;
			this.dropdownSettings["disabled"]=true;
			//this.selectedItems.push({id:this.cm_type_id,itemName:this.cm_type});
		}
		if(this.lead_status !=undefined){
			this.breadcrumval = this.lead_status;
			this.lead_statusArr.push(this.lead_status);
			this.dropdownSettings2["text"] = this.lead_status.replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
			this.dropdownSettings2["disabled"]=true;
		}
		if(this.lead_status ==undefined && this.lead_type ==undefined){
			this.breadcrumval ='all';
		}
		this.addLeadForm = this.formBuilder.group({
			name : new FormControl(""),
			email : new FormControl("",[Validators.pattern("^[A-z0-9]+(\.[_A-z0-9]+)*@[A-z0-9-]+(\.[A-z0-9-]+)*(\.[A-z]{2,15})$")]),
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			lead_type_id : new FormControl("",Validators.required),
		  lead_source_id : new FormControl("",Validators.required),
		  lead_campaign_id:new FormControl(""),
		  instagram_handle: new FormControl(""),
		  lead_type_name:new FormControl(),
		  referrer_type:new FormControl(""), //referrer_type
      lead_source_type:new FormControl(),
			referrer_id:new FormControl(),
			user_id : new FormControl(localStorage.getItem('userId')),
		});
		this.updateLeadForm = this.formBuilder.group({
			id:new FormControl(""),
			name : new FormControl("",Validators.required),
			email : new FormControl("",[Validators.pattern("^[A-z0-9]+(\.[_A-z0-9]+)*@[A-z0-9-]+(\.[A-z0-9-]+)*(\.[A-z]{2,15})$")]),
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			lead_type_id : new FormControl("",Validators.required),
      lead_source_id : new FormControl("",Validators.required),
      lead_campaign_id:new FormControl(""),
      lead_status : new FormControl(""),
			follow_up_time : new FormControl(""),
			referrer_type: new FormControl(""), //referrer_type
			referrer_id: new FormControl(""),
	    remark: new FormControl(""),
	    lost_remark : new FormControl(""),
	    lost_reason: new FormControl(""),
	    instagram_handle: new FormControl(""),
		  lead_type_name:new FormControl(),
		  lead_cv:new FormControl()
		});

		this.getFiletredLeads(1);
		this.getFiltersData();
		this.getReferListForSelect();

	}

	/*Call end points*/
  	getReferListForSelect(){
	    this.salesService.getReferListForSelect(this.user_id).subscribe(
	    res=>{
	      
	      this.lead_referrer_list = res['referral_roles'];


	    },
	    err=>{

	    })
	}

	ngOnChanges(){
		window.location.reload();
	}
	csagentsArr;
	lead_campaigns;
	lead_sources;
	lead_types;
	search;
	headers_res;
	per_page;
	total_page;
	current_page;
	page_number;
	getFiletredLeads(pageno?){
		this.page_number = pageno;
		this.loaderService.display(true);
		this.leadService.getFileterLeadsForLeadMgmt(this.source,this.lead_statusArr,this.lead_type_idArr, this.cm_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,this.mkw_fhi_Arr,
			this.column_name,this.digital_physical, this.internal_external, this.from_date,this.to_date,this.csagents_idArr,this.search,pageno).subscribe(
			res =>{
				// 
				this.headers_res= res.headers._headers;
				this.per_page = this.headers_res.get('x-per-page');
				this.total_page = this.headers_res.get('x-total');
				this.current_page = this.headers_res.get('x-page');

				res= res.json();
				
				this.filteredLeads = res.leads;
				this.filteredLeads = this.sortFunc(this.filteredLeads,{property: 'id', direction: '-1'});
				
				this.queryParamSelectedArr();
				this.getCmList();

				this.loaderService.display(false);
			},
			err => {
				
				this.loaderService.display(false);
			}
		);
	}

	onChangeOfLeadType(val){
		for(var i=0;i<this.lead_types.length;i++){
			if(val==this.lead_types[i].id){
				this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
			}
		}
	}

	reasonForLostDropdownChange(val){
      if(val=='low_budget'||val=='non_serviceable_area'||val=='out_of_scope'||val=='general_inquiry/not_interested'||val=='language_barrier'||val=='already_done_with_other_vendor'||val=='others')
      {
        document.getElementById('lostremark').setAttribute('style','display:block');
        this.updateLeadForm.controls['lost_remark'].setValidators([Validators.required]);
      } else {
        if(document.getElementById('lostremark'))
          document.getElementById('lostremark').setAttribute('style','display:none');
					this.updateLeadForm.controls['lost_remark'].setValue("");
					this.updateLeadForm.get('lost_remark').setValidators([]); // or clearValidators()
					this.updateLeadForm.get('lost_remark').updateValueAndValidity();
          // this.updateLeadForm.controls['lost_remark'].validator=null;
      }
      this.updateLeadForm.controls['lost_remark'].updateValueAndValidity();
    }

	getFiltersData(){
		this.leadService.getFiltersData().subscribe(
			res =>{
				res = res.json();
				// 
				this.lead_campaigns = res.lead_campaign_id_array
				this.lead_sources= res.lead_source_id_array;
				//this.lead_status=res.lead_status_array
				this.lead_types=	res.lead_type_id_array
				this.csagentsArr = res.cs_agent_list;

				for(var i=0;i<res.lead_type_id_array.length;i++){
					var obj = {
						"id":res.lead_type_id_array[i].id,"itemName":res.lead_type_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList.push(obj);
				}
				for(var i=0;i<res.cm_list.length;i++){
					// var str=(res.cm_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cm_list[i].email)
					var str=(res.cm_list[i].name+' - '+(res.cm_list[i].email))
					var obj = {
						"id":res.cm_list[i].id,"itemName":<any>str
					}
					this.dropdownList7.push(obj);
				}
				for(var i=0;i<res.lead_status_array.length;i++){
					var obj = {
						"id":<any>i,"itemName":res.lead_status_array[i].replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList2.push(obj);

				}
				for(var i=0;i<res.lead_source_id_array.length;i++){
					var obj = {
						"id":res.lead_source_id_array[i].id,"itemName":res.lead_source_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList3.push(obj);
				}
				for(var i=0;i<res.lead_campaign_id_array.length;i++){
					var obj = {
						"id":res.lead_campaign_id_array[i].id,"itemName":res.lead_campaign_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList4.push(obj);
				}
				for(var i=0;i<res.cs_agent_list.length;i++){
					var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
					var obj = {
						"id":res.cs_agent_list[i].id,"itemName":<any>str
					}
					this.dropdownList5.push(obj);
				}
			}
		);
	}

	direction: number;
    isDesc: boolean = true;
    column: string;
    // Change sort function to this:
    sort(property){
        this.isDesc = !this.isDesc; //change the direction
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }

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
    dropdownList = [];
    dropdownList2=[];
    dropdownList3=[];
    dropdownList4=[];
    dropdownList5=[];
    dropdownList6=[{"id":"created_at","itemName":"Acquisition Date"},{"id":"status_updated_at","itemName":"Status Updated Date"}];
		dropdownList7=[];

    selectedItems = [];
    selectedItems2=[];
    selectedItems3 = [];
    selectedItems4=[];
    selectedItems5=[];
	selectedItems6=[{"id":"created_at","itemName":"Acquisition Date"}];
		selectedItems7=[];
		dropdownList8=[{"id":"digital","itemName":"Digital"},{"id":"physical","itemName":"Physical"}];
		selectedItems8=[];
		dropdownList9=[{"id":"internal","itemName":"Internal"},{"id":"external","itemName":"External"}];
		selectedItems9=[];
		dropdownList10=[{"id":"mkw","itemName":"MKW"},{"id":"fhi","itemName":"FHI"}];
		selectedItems10=[];

    dropdownSettings6 ={
    	singleSelection: true,
	  	// text:" Acquisition Date",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings = {
	  singleSelection: false,
	  text: "Lead Type",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
    };
    dropdownSettings5 ={
    	singleSelection: false,
	  	text:"CS Agent",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings4 ={
    	singleSelection: false,
	  	text:"Campaign",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings3 ={
    	singleSelection: false,
	  	text:"Lead Source ",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }
    dropdownSettings2 ={
    	singleSelection: false,
	  	text:  "Status" ,
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown",
		}
		dropdownSettings7 = {
    	singleSelection: false,
	  	text:"CM",
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
		}
		dropdownSettings8 = {
    	singleSelection: true,
	  	text:"Source",  // Digital Physical
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
		}
		dropdownSettings9 = {
    	singleSelection: true,
	  	text:"Internal/External",  // Internal/External
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
		}
		dropdownSettings10 = {
    	singleSelection: true,
	  	text:"MKW-FHI",  // MKW/FHI
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown"
    }

    queryParamSelectedArr(){
    	if(this.queryParamsLeadSource!=undefined && this.queryParamsLeadSource.length>0){
			for(var i=0;i<this.queryParamsLeadSource.length;i++){
				for(var j=0;j<this.dropdownList3.length;j++){
					if(this.dropdownList3[j].id==this.queryParamsLeadSource[i]){
						this.selectedItems3.push(this.dropdownList3[j]);
					}
				}
			}
		}
		if(this.queryParamsLeadCamp!=undefined && this.queryParamsLeadCamp.length>0){
			for(var i=0;i<this.queryParamsLeadCamp.length;i++){
				for(var j=0;j<this.dropdownList4.length;j++){
					if(this.dropdownList4[j].id==this.queryParamsLeadCamp[i]){
						this.selectedItems4.push(this.dropdownList4[j]);
					}
				}
			}
		}
		}
		
		temp;
		temp2;
    onItemSelect(item:any,textVal,index){
    	(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='Status' && index==1){
        	for(var k=0;k<this.selectedItems2.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
        	}
        } else if(textVal=='LeadType' && index==0){
        	for(var k=0;k<this.selectedItems.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems[k].itemName+',';
        	}

        } else if(textVal=='LeadSource' && index==2){
        	for(var k=0;k<this.selectedItems3.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
        	}
        } else if(textVal=='Campaign' && index==3){
        	for(var k=0;k<this.selectedItems4.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
        	}
        }else if(textVal=='Agent' && index==4){
        	for(var k=0;k<this.selectedItems5.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems5[k].itemName+',';
        	}
        } else if(textVal=='DateColumn' && index==5){
        	for(var k=0;k<this.selectedItems6.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems6[k].itemName+',';
        	} 
				} else if(textVal=='DigitalPhysical' && index==7){
					this.ref.detectChanges();
        	for(var k=0;k<this.selectedItems8.length;k++){
							if((document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].getElementsByTagName('span')[0]){
								// this is a hack, For the very first time when an item is selected two nested spans are generated.
								// Just to avoid this case this very condition was used.
							}
							else{
								this.temp=this.selectedItems8[k].itemName;
							
								(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems8[k].itemName;
							}
						
					}
				} else if(textVal=='InternalExternal' && index==8){
					this.ref.detectChanges();
        	for(var k=0;k<this.selectedItems9.length;k++){
							if((document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].getElementsByTagName('span')[0]){
								// this is a hack, For the very first time when an item is selected two nested spans are generated.
								// Just to avoid this case this very condition was used.
							}
							else{
								this.temp2=this.selectedItems9[k].itemName;
							
								(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems9[k].itemName;
							}
						
					}
				}
				else if(textVal=='mkw_fhi' && index==9){
					this.ref.detectChanges();
        	for(var k=0;k<this.selectedItems10.length;k++){
							if((document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].getElementsByTagName('span')[0]){
								// this is a hack, For the very first time when an item is selected two nested spans are generated.
								// Just to avoid this case this very condition was used.
							}
							else{
								this.temp2=this.selectedItems10[k].itemName;
							
								(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems10[k].itemName;
							}
						
					}
				}
				 else if(textVal=='CMType' && index==6){
        	for(var k=0;k<this.selectedItems7.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems7[k].itemName+',';
        	}
        }
    }
    OnItemDeSelect(item:any,textVal,index){
    	(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='Status' && index==1){
        	for(var k=0;k<this.selectedItems2.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
        	}
        } else if(textVal=='LeadType' && index==0){
        	for(var k=0;k<this.selectedItems.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems[k].itemName+',';
        	}

        } else if(textVal=='LeadSource' && index==2){
        	for(var k=0;k<this.selectedItems3.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
        	}
        } else if(textVal=='Campaign' && index==3){
        	for(var k=0;k<this.selectedItems4.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
        	}
        }else if(textVal=='Agent' && index==4){
        	for(var k=0;k<this.selectedItems5.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems5[k].itemName+',';
        	}
        }  else if(textVal=='DateColumn' && index==5){
        	for(var k=0;k<this.selectedItems6.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems6[k].itemName+',';
        	}
				} else if(textVal==='DigitalPhysical' && index==7){
					for(var k=0;k<this.selectedItems8.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems8[k].itemName+',';
        	}
					this.digital_physical = '';
					this.selectedItems8 = [];
				} else if(textVal==='InternalExternal' && index==8){
					for(var k=0;k<this.selectedItems9.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems9[k].itemName+',';
        	}
					this.internal_external = '';
					this.selectedItems9 = [];
        }else if(textVal==='mkw_fhi' && index==9){
					for(var k=0;k<this.selectedItems10.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems10[k].itemName+',';
        	}
					this.internal_external = '';
					this.selectedItems9 = [];
        } else if(textVal=='CMType' && index==6){
        	for(var k=0;k<this.selectedItems7.length;k++){
        		(document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems7[k].itemName+',';
        	}
        }
    }
    onSelectAll(items: any,textVal,index){
        // document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='Status'){
        	
        } else if(textVal=='LeadType'){
        	
        } else if(textVal=='LeadSource'){
        	
        } else if(textVal=='Campaign'){
        	
        } else if(textVal=='Agent'){
        	
        } else if(textVal=='DateColumn'){
        	
        } else if(textVal=='DigitalPhysical'){
        	
				} else if(textVal=='InternalExternal'){
        	
        } else if(textVal=='CMType'){
        	
        }else if(textVal=='mkw_fhi'){
        	
        }
    }
    onDeSelectAll(items: any,textVal,index){
        //document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='Status'){
        	
        } else if(textVal=='LeadType'){
        	
        } else if(textVal=='LeadSource'){
        	
        } else if(textVal=='Campaign'){
        	
        } else if(textVal=='Agent'){
        	
        } else if(textVal=='DateColumn'){
        	
        } else if(textVal=='CMType'){
        	
        } else if(textVal=='DigitalPhysical'){
        	
        } else if(textVal=='InternalExternal'){
        	
        }else if(textVal=='mkw_fhi'){
        	
        }
    }
    filterData(){
    	this.csagents_idArr.length = 0;
    	this.lead_type_idArr.length=0;
    	this.lead_source_idArr.length=0;
			this.lead_campaign_idArr.length=0;
			this.cm_type_idArr.length=0;
			this.mkw_fhi_Arr.length=0;

    	this.loaderService.display(true);
    	for(var k=0;k<this.selectedItems6.length;k++){
    		this.column_name =this.selectedItems6[k].id;
			}
			for(var k=0;k<this.selectedItems8.length;k++){
    		this.digital_physical =this.selectedItems8[k].id;
			}
			for(var k=0;k<this.selectedItems9.length;k++){
    		this.internal_external =this.selectedItems9[k].id;
    	}
    	for(var k=0;k<this.selectedItems.length;k++){
    		this.lead_type_idArr.push(this.selectedItems[k].id);
    	}
    	for(var k=0;k<this.selectedItems2.length;k++){
    		this.lead_statusArr.push(this.selectedItems2[k].itemName.toLowerCase().replace(/ /g,"_"));
    	}
    	for(var k=0;k<this.selectedItems3.length;k++){
    		this.lead_source_idArr.push(this.selectedItems3[k].id);
    	}
    	for(var k=0;k<this.selectedItems4.length;k++){
    		this.lead_campaign_idArr.push(this.selectedItems4[k].id);
    	}
    	for(var k=0;k<this.selectedItems5.length;k++){
    		this.csagents_idArr.push(this.selectedItems5[k].id);
			}
			for(var k=0;k<this.selectedItems7.length;k++){
    		this.cm_type_idArr.push(this.selectedItems7[k].id);
			}
			for(var k=0;k<this.selectedItems10.length;k++){
    		this.mkw_fhi_Arr.push(this.selectedItems10[k].id);
    	}

    	this.leadService.getFileterLeadsForLeadMgmt(this.source,this.lead_statusArr,this.lead_type_idArr, this.cm_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,this.mkw_fhi_Arr,
			this.column_name,this.digital_physical, this.internal_external, this.from_date,this.to_date,this.csagents_idArr,this.search,1).subscribe(
			res =>{
				this.headers_res= res.headers._headers;
				this.per_page = this.headers_res.get('x-per-page');
				this.total_page = this.headers_res.get('x-total');
				this.current_page = this.headers_res.get('x-page');
				res= res.json();
				this.filteredLeads = res.leads;
				this.loaderService.display(false);

			},
			err=> {
				
				this.loaderService.display(false);

			}
		);
    }

	downloadExcel(){
		this.leadService.exportLeads1(this.role,this.source,this.lead_statusArr,this.lead_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,
			this.column_name, this.from_date,this.to_date,this.csagents_idArr,this.search).subscribe(
		  res =>{
		  	this.successalert = true;
			  this.successMessage = "Your Lead Report will be Downloaded in a while";
			  setTimeout(function() {
					this.successalert = false;
				 }.bind(this), 9000);
			// var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			// var b64Data =  JSON.parse(res._body)["lead_report"];
			// debugger
			// var blob = this.b64toBlob(b64Data, contentType,512);
			// var blobUrl = URL.createObjectURL(blob);
			// // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			// let dwldLink = document.createElement("a");
			// // let url = URL.createObjectURL(blob);
			// let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
			// if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
			// dwldLink.setAttribute("target", "_blank");
			// }
			// dwldLink.setAttribute("href", blobUrl);
			// dwldLink.setAttribute("download", "lead.xlsx");
			// dwldLink.style.visibility = "hidden";
			// document.body.appendChild(dwldLink);
			// dwldLink.click();
			// document.body.removeChild(dwldLink);
			var url = JSON.parse(res._body)["lead_report"];
	        var a = document.createElement('a');
	        document.body.appendChild(a);
	        a.setAttribute('style', 'display: none');
	        a.href = url;
	        a.download = res.filename;
	        a.click();
	        window.URL.revokeObjectURL(url);
	        a.remove();

		  },
		  err => {
			  
			// this.erroralert = true;
			//   this.errorMessage = <any>JSON.parse(err['_body']).message;
			//   setTimeout(function() {
			// 		this.erroralert = false;
			// 	 }.bind(this), 2000);
		  }
		);
	}
	b64toBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		  var slice = byteCharacters.slice(offset, offset + sliceSize);

		  var byteNumbers = new Array(slice.length);
		  for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		  }

		  var byteArray = new Uint8Array(byteNumbers);

		  byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}
	addLeadFormSubmit(data) {
		this.loaderService.display(true);
		data['created_by'] = localStorage.getItem('userId');
		data['lead_status']='not_attempted';
		if(this.addLeadForm.controls['lead_type_name'].value=='designer'){
			data['lead_cv']=this.basefile;
		}
		var obj = {
			lead:data
		}
		this.leadService.addLead(obj)
			.subscribe(
			  res => {
				this.addLeadForm.reset();
				$('#addNewLeadModal').modal('hide');
				this.addLeadForm.controls['lead_type_id'].setValue("");
				this.addLeadForm.controls['lead_source_id'].setValue("");
				this.addLeadForm.controls['lead_campaign_id'].setValue("");
				this.basefile = undefined;
				this.getFiletredLeads();
				this.loaderService.display(false);
				this.successalert = true;
				this.successMessage = "Lead created successfully !!";
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 2000);
			  },
			  err => {
				this.loaderService.display(false);
				this.erroralert = true;
				this.errorMessage = JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 2000);
			  }
			);
	}
	updateLeadFormSubmit(data){
		if(data['lead_status'] == 'delayed_possession'){
			data['follow_up_time'] = $("#startDateNew").datepicker().val();

			

		}
		else if(data['lead_status'] == 'delayed_project'){
			data['follow_up_time'] = $('#startDateNewpro').datepicker().val();
			


		}
		if(data.lead_type_name=='designer'){
			data['lead_cv']=this.basefile
		} else {
			data['lead_cv'] ='';
		}
		var obj = {
			lead:data
		}
		
		if( data['lead_status'] == 'qualified' && data['lead_type_name'] == 'customer' && (data['pincode']=='' || data['pincode'] == null || data['pincode'] ==  undefined)){
      this.errorMessage='Pincode is mandatory';
      this.erroralert = true;
      setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 10000);
    } else {
			this.loaderService.display(true);
			
			this.leadService.editLead(data.id,obj).subscribe(
				res => {
					this.updateLeadForm.reset();
					$('#editLeadModal').modal('hide');
					this.getFiletredLeads();
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


	}


	setUpdatedLead(value){
		this.updateLeadForm.controls['id'].setValue(value.id);
		this.updateLeadForm.controls['name'].setValue(value.name);
		this.updateLeadForm.controls['email'].setValue(value.email);
		this.updateLeadForm.controls['contact'].setValue(value.contact);
		this.updateLeadForm.controls['pincode'].setValue(value.pincode);
		this.updateLeadForm.controls['lead_type_id'].setValue(value.lead_type_id);
		this.updateLeadForm.controls['lead_source_id'].setValue(value.lead_source_id);
		this.updateLeadForm.controls['referrer_type'].setValue(value.referrer_type || '');
		this.updateLeadForm.controls['lead_campaign_id'].setValue(value.lead_campaign_id);
		this.updateLeadForm.controls['referrer_id'].setValue(value.referrer_id || '');
		this.userList = [value.referrer];
		this.updateLeadForm.controls['lead_status'].setValue(value.lead_status);
		// this.updateLeadForm.controls['follow_up_time'].setValue(new Date(value.follow_up_time._i).toJSON().slice(0,19));
		this.updateLeadForm.controls['remark'].setValue(value.remark);
		this.updateLeadForm.controls['lost_remark'].setValue(value.lost_remark);
		this.updateLeadForm.controls['lost_reason'].setValue(value.lost_reason);
		this.updateLeadForm.controls['lead_type_name'].setValue(value.lead_type);
		this.updateLeadForm.controls['instagram_handle'].setValue(value.instagram_handle);
		
		this.updateLeadForm.controls['lead_cv'].setValue(value.lead_cv);
		this.updateLeadForm.updateValueAndValidity();
		if(value.lost_reason == 'low_budget'||value.lost_reason == 'non_serviceable_area'||value.lost_reason == 'out_of_scope'||value.lost_reason == 'general_inquiry/not_interested'||value.lost_reason == 'language_barrier'||value.lost_reason == 'already_done_with_other_vendor'||value.lost_reason == 'others'){
          document.getElementById('lostremark').setAttribute('style','display: block');
		}
		else{
			if(document.getElementById('lostremark')){
				document.getElementById('lostremark').setAttribute('style','display: none');
			}
		}
		if(value.follow_up_time){
			var date=value.follow_up_time.split('T')[0];
    	var time=value.follow_up_time.split('T')[1].split('.')[0];
    	value.follow_up_time = date +"T"+time;
    	
		}
    this.updateLeadForm.controls['follow_up_time'].setValue(value.follow_up_time);
		this.setLeadStatus(value.lead_status);
	}
	setLeadStatus(value) {
	    if(value=='follow_up') {
	    	if(document.getElementById('datetime')){
					document.getElementById('datetime').setAttribute('style','display: block');
	    	}
	    	if(document.getElementById('remarkId')){
					document.getElementById('remarkId').setAttribute('style','display: block');
				}
				this.updateLeadForm.get('follow_up_time').setValidators([Validators.required]); // or clearValidators()
				this.updateLeadForm.get('remark').setValidators([Validators.required]); // or clearValidators()
				this.updateLeadForm.get('follow_up_time').updateValueAndValidity();
				this.updateLeadForm.get('remark').updateValueAndValidity();

	    } else {
	    	if(document.getElementById('datetime')){
					document.getElementById('datetime').setAttribute('style','display: none');
	    	}
	    	if(document.getElementById('remarkId')){
					document.getElementById('remarkId').setAttribute('style','display: none');
				}
				
					this.updateLeadForm.get('follow_up_time').setValidators([]); // or clearValidators()
					this.updateLeadForm.controls['follow_up_time'].setValue('');
					this.updateLeadForm.get('follow_up_time').updateValueAndValidity();

					this.updateLeadForm.get('remark').setValidators([]); // or clearValidators()
					this.updateLeadForm.controls['remark'].setValue('');
					this.updateLeadForm.get('remark').updateValueAndValidity();
	    }
	    if(value == 'lost') {
				document.getElementById('addleadFormlostReason').setAttribute('style','display: block');
				this.updateLeadForm.get('lost_reason').setValidators([Validators.required]); // or clearValidators()
				this.updateLeadForm.get('lost_remark').setValidators([Validators.required]);
				this.updateLeadForm.get('lost_reason').updateValueAndValidity();
				this.updateLeadForm.get('lost_remark').updateValueAndValidity();
	    } else {
				document.getElementById('addleadFormlostReason').setAttribute('style','display: none');
				this.updateLeadForm.get('lost_reason').setValidators([]); // or clearValidators()
				this.updateLeadForm.get('lost_remark').setValidators([]); // or clearValidators()
				this.updateLeadForm.controls['lost_reason'].setValue('');
				this.updateLeadForm.controls['lost_remark'].setValue('');
				this.updateLeadForm.get('lost_reason').updateValueAndValidity();
				this.updateLeadForm.get('lost_remark').updateValueAndValidity();
	    }
  	}
	onChange(event) {
		document.getElementById('extErrorMsg').classList.add('d-none');
		this.basefile = undefined;
	   this.attachment_file = event.srcElement.files[0];
	   var re = /(?:\.([^.]+))?$/;
	   var ext = re.exec(this.attachment_file.name)[1];
		var fileReader = new FileReader();
		   var base64;
	   if(ext == 'xlsx' || ext == 'xls') {
			fileReader.onload = (fileLoadedEvent) => {
			 base64 = fileLoadedEvent.target;
			 this.basefile = base64.result;
		   };
		}
		else {
		  document.getElementById('extErrorMsg').classList.remove('d-none');
		}

		fileReader.readAsDataURL(this.attachment_file);
	}
	submitExcelUpload(){
		this.loaderService.display(true);
		this.leadService.uploadLeadExcel(this.basefile,this.sourceOfBulkLeads,this.typeOfBulkLeads,this.campignOfBulkLeads)
		.subscribe(
			res => {
			  $('#exampleModal').modal('hide');
			  this.getFiletredLeads();
			  this.loaderService.display(false);
			  this.sourceOfBulkLeads = "";
			  this.typeOfBulkLeads = "";
			  this.campignOfBulkLeads="";
			  this.successalert = true;
			  this.basefile = undefined;
			  this.successMessage = res['new_leads'].length+" new leads uploaded successfully !!";
			  setTimeout(function() {
					  this.successalert = false;
				 }.bind(this), 5000);
			},
			error => {
			  this.loaderService.display(false);
			  this.erroralert = true;
			  
			  this.errorMessage = JSON.parse(error['_body']).message;
			  setTimeout(function() {
					  this.erroralert = false;
				 }.bind(this), 5000);
			}
		);
	  }

	onDropdownChange(id,value,rowid) {
    	this.assignedAgentId[rowid] = value;
    	if(this.assignedAgentId[rowid] != undefined && this.assignedAgentId[rowid] !='Assign To CS Agent') {
    		document.getElementById("assigndropdown"+id).classList.remove('inputBorder');
    	}
  	}
  	assignedAgentId =[];

	assignLeadToAgent(id:number,index:number){
		if(this.assignedAgentId[index] != undefined && this.assignedAgentId[index] !='Assign To CS Agent') {
		  this.loaderService.display(true);
		  this.leadService.assignLeadToAgent(this.assignedAgentId[index],id)
		            .subscribe(
		        res => {
		          Object.keys(res).map((key)=>{ res= res[key];});
		          //this.getEscalatedLeads();
		          this.assignedAgentId[index] = undefined;
		          this.getFiletredLeads(this.page_number);
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
	            	this.getFiletredLeads(this.page_number);
	              this.loaderService.display(false);
	            },
	            error =>  {
	              this.erroralert = true;
	              this.errorMessage = <any>JSON.parse(error['_body']).message;
	              setTimeout(function() {
	                this.erroralert = false;
	             }.bind(this), 2000);
	               this.loaderService.display(false);
	            }
	        );
	    }
  	}

  	callToLead(contact){
	    this.leadService.callToLead(localStorage.getItem('userId'), contact).subscribe(
	        res => {

	        },
	        err => {
	          
	        }
	     );
	 }

   getSalesLifecycleData(leadId){
     this.loaderService.display(true);
     
    this.leadService.downloadLifeCycleReport(leadId).subscribe(
    res => {
   if(res.file_name != null){
   var contentType = 'application/pdf';
   var b64Data = res.report;
   var name= res.file_name;
   var blob = this.b64toBlob(b64Data, contentType,512);
   var blobUrl = URL.createObjectURL(blob);
   // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   let dwldLink = document.createElement("a");
   // let url = URL.createObjectURL(blob);
   let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
   if (isSafariBrowser) { //if Safari open in new window to save file with random filename.
   dwldLink.setAttribute("target", "_blank");
   }
  dwldLink.setAttribute("href", blobUrl);
  dwldLink.setAttribute("download", name);
  dwldLink.style.visibility = "hidden";
  document.body.appendChild(dwldLink);
  dwldLink.click();
  document.body.removeChild(dwldLink);
  var contentType = 'application/pdf';
  var b64Data = res.report;
  var name= res.file_name;
  var blob = this.b64toBlob(b64Data, contentType,512);
  var blobUrl = URL.createObjectURL(blob);
  // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  let dwldLink1 = document.createElement("a");
  // let url = URL.createObjectURL(blob);
  let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
  if (isSafariBrowser1) { //if Safari open in new window to save file with random filename.
  dwldLink.setAttribute("target", "_blank");
  this.loaderService.display(false);
  }
  }
  this.loaderService.display(false);
  },
  err => {
  this.erroralert = true;
  this.errorMessage = <any>JSON.parse(err['_body']).message;
  setTimeout(function() {
  this.erroralert = false;
  this.loaderService.display(false);
   }.bind(this), 2000);
		  }
		);
	}


	numberCheck(e) {
	    if(!((e.keyCode > 95 && e.keyCode < 106)
	        || (e.keyCode > 47 && e.keyCode < 58)
	        || e.keyCode == 8 || e.keyCode == 39 ||
	        e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9 || e.keyCode == 17
	        || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67 )) {
	      return false;
	    }
  	}

  	userQuestionnaireDetails;
  	leadIDForModal; customerphoneForModal; customerIDModal; customerNameModal;
  	leaddetailsForModal;
  	passDataToModal(LeadIDForModal,customerName,phone,data){
    	this.leadIDForModal = LeadIDForModal;
    	this.customerNameModal = customerName;
    	this.customerphoneForModal = phone;
    	this.leaddetailsForModal = data;
    }
    closeModal(msg?){
			this.leadIDForModal = undefined;
			this.customerNameModal=undefined;
			this.customerphoneForModal = undefined;
	    this.userQuestionnaireDetails =undefined;
	    // this.city_others = undefined;
	    this.leaddetailsForModal = undefined;
	    $('#questionnaireModal').modal('hide');
	    if(msg){
	    	this.getFiletredLeads(1);
	    	this.successalert = true;
	    	this.successMessage = msg;
	    	setTimeout(function() {
             this.successalert = false;
        }.bind(this), 10000);
	    }
  	}
  	setQues_Form(event){
  		
  		event.reset();
  		event.clearValidators();
  	}
  	

	public lead_logs:any
  	public filtered_logs:any = []
  	public log_owners:any = []
  	clearLogs(){
  		this.lead_logs = undefined;
  		this.filtered_logs = [];
  		this.log_owners = [];
  		$(".dropdownButton1").html('<img src="../../assets/img/images/original/missing.png" class="img-fluid myFluit mr-2" style = "border-radius: 50px;width: 1.5rem;box-shadow: 0 0 0px 2px #ccc;"><span>All (logs)</span>');

  	}
	viewLeadLog(leadId,rowID){
		this.loaderService.display(true);
		this.activityLogsService.getLeadLogs(leadId).subscribe(
	      res => {
	        Object.keys(res).map((key)=>{ this.lead_logs= res[key];})
	       
	        this.filtered_logs = this.lead_logs.change_log;
	        var temp_email = []
	        for (let log of this.lead_logs.change_log){
	          if(log.whodunnit !== "" && log.whodunnit !== null){
	            if(!temp_email.includes(log.whodunnit)){
	              var json = {
	                "name": log.name,
	                "email": log.whodunnit,
	                "image": log.user_image,
	              }
	              this.log_owners.push(json);
	              temp_email.push(log.whodunnit)
	            }

	          }
	        }
	        this.loaderService.display(false);
	      },
	      err => {
	        
	        this.loaderService.display(false);
	      }
    	);
	}
	filterLogs(e,filter = "all"){
	    var arr = [];
	    $(".dropdownButton1").html('<img src="'+e.srcElement.childNodes[1].currentSrc+'" class="img-fluid myFluit mr-2" style = "border-radius: 50px;width: 1.5rem;box-shadow: 0 0 0px 2px #ccc;"><span>'+e.srcElement.childNodes[2].nodeValue+'</span>');
	    if(filter == "all"){
	      this.filtered_logs = this.lead_logs.change_log;
	    }
	    else{
	      for (let log of this.lead_logs.change_log){
	        if(log.whodunnit == filter){
	          arr.push(log)
	        }
	      }
	      this.filtered_logs = arr;

	    }
  	}

  	directionlog: number;
  	isDesclog: boolean = true;
  	columnlog: string = 'CategoryName';
  // Change sort function to this:
  	sortlog(property, sort){
	    if(sort == "oldest"){
	      $(".dropdownButton2").html('Oldest First');
	      this.isDesclog = true; //change the direction
	    }
	    else if(sort == "newest"){
	      $(".dropdownButton2").html('Newest First');
	      this.isDesclog = false; //change the direction
	    }
	    this.columnlog = property;
	    this.directionlog = this.isDesclog ? 1 : -1;
  	}

  	
  	fromDate(){
  		$(".fromDateSpan").hide();
  		$(".fromDate").show();
  	}
  	toDate(){
  		$(".toDateSpan").hide();
  		$(".toDate").show();
  	}

  uploadCV(event) {
    this.attachment_file = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
    };
    fileReader.readAsDataURL(this.attachment_file);
  }

  cmlistArr;
  getCmList(){
  	this.loaderService.display(true);
  	this.leadService.getCmList().subscribe(
  		res=>{
  			this.cmlistArr=res.community_managers;
  			this.loaderService.display(false);
  		},
  		err=>{
  			
        this.loaderService.display(false);
  		}
  	);
  }
  assigneLeadId;
  assigneIndex;
  cmlistArray;

  assignCmToLead(leadid,index,cmId?,designerId?){
  	this.assigneLeadId = leadid;
  	this.assigneIndex = index;
  	if(this.assignedCMIds[index] != undefined && this.assignedCMIds[index] !='Assign To CM') {
		  this.loaderService.display(true);
		  this.leadService.assignCmToLead(this.assignedCMIds[index],leadid,cmId,designerId).subscribe(
		        res => {
		          

		          if(res.community_managers){
		          	this.cmlistArr = res.community_managers;
		          	this.loaderService.display(false);
			        
		          	
		          	$('#AssignModal').modal('show');
		          }
		          else{
			          Object.keys(res).map((key)=>{ res= res[key];});
			          this.assignedCMIds[index] = undefined;
			          this.getFiletredLeads(this.page_number);
			          this.loaderService.display(false);
			          this.successalert = true;
			          this.designerId = '';
			          $('#AssignModal').modal('hide');
			          this.successMessage = "Assigned Successfully !!";
			          this.resetDropDown();
			          $(window).scrollTop(0);
			          setTimeout(function() {
			                this.successalert = false;
			             }.bind(this), 5000);
			        }  
		        },
		        error => {
		        	
		        	
		          this.erroralert = true;
		          this.errorMessage=JSON.parse(error['_body']).message;
		          this.loaderService.display(false);
		          $(window).scrollTop(0);
		          setTimeout(function() {
		                this.erroralert = false;
		             }.bind(this), 5000);
		        }
		      );
		} else {
		  document.getElementById("assigncmdropdown"+leadid).classList.add('inputBorder');
		}
  }
  assignedCMIds =[];
  onCMDropdownChange(leadid,cmid,rowid){
  	this.assignedCMIds[rowid] = cmid;
  	if(this.assignedCMIds[rowid] != undefined && this.assignedCMIds[rowid] !='Assign To CM') {
  		document.getElementById("assigncmdropdown"+leadid).classList.remove('inputBorder');
  	}
  }
  cmIdValue;
  onCMDropdownChangeModal(cmId){
  	this.cmIdValue = cmId;
  	this.designerArr = [];
  	this.assignDesignerId = '';
  	this.getDesignerList(this.cmIdValue);

  }
  designerArr = [];
  getDesignerList(cmIdValue){
  	this.leadService.getDesignerList(cmIdValue,this.current_user_id).subscribe(
  		res=>{
  			
  			this.designerArr = res.designers;

  			



  	},err=>{

  	});

  }
  assignDesignerId;
  onDesignerDropdownChangeModal(value){
  	this.assignDesignerId = value;
  	
  }
  designerId;
  assignCmToLeadTwo(cmId,designerId){
  	this.designerId = '';
  	

  	if(designerId != -1 && cmId != -1 && designerId != undefined && cmId != undefined && cmId != '' && designerId != ''){
  	  this.assignCmToLead(this.assigneLeadId,this.assigneIndex,cmId,designerId);
  	}
  	
  	else{
  		alert("Select Designer And CM And Then Submit");
  	}  

  }
  selectedElement;
  selectedElement1;
  resetDropDown(){
  	this.assignDesignerId = '';
  	// this.cmIdValue = -1;
  	// this.assignDesignerId ='';


  }

  /*Dropdown Onchange function*/
  onChangeOfLeadSource(val){
    for( var i=0;i<this.lead_referrer_list.length;i++){
      if(val == this.lead_referrer_list[i].name){       
        this.addLeadForm.controls['lead_source_type'].setValue(this.lead_referrer_list[i].name);
        if(this.addLeadForm.controls['lead_source_type'].value == 'design_partner_referral' || this.addLeadForm.controls['lead_source_type'].value == 'client_referral' || this.addLeadForm.controls['lead_source_type'].value == 'broker' 
        || this.addLeadForm.controls['lead_source_type'].value == 'display_dealer_referral' 
        || this.addLeadForm.controls['lead_source_type'].value == 'non_display_dealer_referral' 
        || this.addLeadForm.controls['lead_source_type'].value == 'employee_referral' 
        || this.addLeadForm.controls['lead_source_type'].value == 'dealer' 
        || this.addLeadForm.controls['lead_source_type'].value == 'arrivae_champion'
        || this.addLeadForm.controls['lead_source_type'].value == 'associate_partner'
        || this.addLeadForm.controls['lead_source_type'].value == 'non_display_dealer'
        || this.addLeadForm.controls['lead_source_type'].value == 'others'){
          this.getReferUserList(val,this.addLeadForm.controls['lead_source_type'].value);

        }
        
      }
		}
  }

  /*OnChange User List*/
  getReferUserList(referId,referName){
    this.salesService.getReferUserList(this.user_id,referName).subscribe(
    res=>{
      
      this.userList = res['users'];

    },
    err=>{
      

		});
  }
  // Method which is called whenever input type date is focused to open calander
  callChangeNew1(){
  	
    $('.date-picker').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'mm/yy',
        minDate: '+3M',
        onClose: function(dateText, inst) { 
            
            
            
            function isDonePressed(){
                            return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
                        }

                        if (isDonePressed()){


                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                            $(this).datepicker('setDate', new Date(year, month, 1));
                            
                           
                            
            
                   

                        }
            
            
          
        }
    }).focus(function() {
        $("#startDateNew","#startDateNewpro").datepicker("show");
    }).focus();

  }


  /*Send Smart Report Through Email function*/ 
  smartShareEmail(){
    this.leadService.smartShareReport().subscribe(
    res => {
      this.successalert = true;
      this.successMessage = 'The Smart-Share report you requested is being created. It will be emailed to you once complete.!';
      setTimeout(function() {
        this.successalert = false;
      }.bind(this), 10000);
    },
    err => {

      this.erroralert = true;
      this.errorMessage = 'Something went wrong';
    }
    )
  }
  downloadQuestionnaire(){
    this.leadService.exportQuestionnaireEvent().subscribe(
      res =>{
      
      this.successalert = true;
        this.successMessage = 'The  Questionnaire  report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);

     
      },
      err => {
        
        
      }
    );

  }
}