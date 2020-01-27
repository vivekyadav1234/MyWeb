import { Component, OnInit } from '@angular/core';
import { SalesManagerService } from '../sales-manager.service';
import {LeadService} from '../../lead/lead.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import {Location} from '@angular/common';
import { FormControl,
	FormArray,
	FormBuilder,
	FormGroup,
	Validators } from '@angular/forms';
// import {LeadquestionnaireComponent} from '../../../../shared/leadquestionnaire/leadquestionnaire.component';
declare var $:any;

@Component({
  selector: 'app-sales-lead-mgmt',
  templateUrl: './sales-lead-mgmt.component.html',
  styleUrls: ['./sales-lead-mgmt.component.css'],
  providers: [SalesManagerService,LeadService]
})
export class SalesLeadMgmtComponent implements OnInit {
	lead_campaigns;
	lead_sources;
	lead_types;
	search;
	headers_res;
	per_page;
	total_page;
	current_page;
	page_number;
	source=[];
	lead_statusArr=[];
	lead_type_idArr=[];
	lead_source_idArr=[];
	lead_referrer_list=[];
	lead_campaign_idArr=[];
	csagents_idArr=[];
	filteredLeads=[];
	from_date;
	to_date;
	column_name='created_at';
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
	role;
	addLeadForm:FormGroup;
	updateLeadForm:FormGroup;
	sales_id;
	sourceOfBulkLeads="";
	typeOfBulkLeads="";
	campignOfBulkLeads="";
	referrer_type="";
	lead_status;
	lead_type;
	lead_type_id;
	breadcrumval:any;
	referrer_type_id;
	referreresList:any = [];

  constructor(
  	private route:ActivatedRoute,
	private leadService:LeadService,
	private salesService: SalesManagerService,
	private loaderService:LoaderService,
	private formBuilder:FormBuilder,
	public router:Router, 
	public location:Location


  	) { }

  ngOnInit() {
  	this.sales_id =localStorage.getItem('userId');
  	this.route.queryParams.subscribe(params => {
			this.lead_status = params['lead_status'];
			this.lead_type = params['lead_type'];
			this.lead_type_id = params['id'];
			this.referrer_type_id = params['referrer_type'];
			this.to_date = params['to_date'];
			this.from_date = params['from_date'];
			

		});
  	if(this.lead_status !=undefined){
			this.breadcrumval = this.lead_status;
			this.lead_statusArr.push(this.lead_status);
			this.dropdownSettings2["text"] = this.lead_status.replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
			this.dropdownSettings2["disabled"]=true;
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

  	
  	this.addLeadForm = this.formBuilder.group({
			name : new FormControl(""),
			email : new FormControl("",[Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]),
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			lead_type_id : new FormControl("",Validators.required),
		  lead_source_id : new FormControl("",Validators.required),
		  lead_campaign_id:new FormControl(""),
		  referrer_id: new FormControl("",Validators.required),
		  instagram_handle: new FormControl(""),
		  lead_type_name:new FormControl(),
		  lead_source_type:new FormControl(),
		  referrer_type:new FormControl("",Validators.required),

		});
  	this.updateLeadForm = this.formBuilder.group({
			id:new FormControl(""),
			name : new FormControl("",Validators.required),
			email : new FormControl("",[Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]),
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			lead_type_id : new FormControl("",Validators.required),
	        lead_source_id : new FormControl("",Validators.required),
	        referrer_id: new FormControl("",Validators.required),
	       lead_campaign_id:new FormControl(""),
	       lead_status : new FormControl(""),
		    follow_up_time : new FormControl(""),
		    remark: new FormControl(""),
		    lost_remark : new FormControl(""),
		    lost_reason: new FormControl(""),
		    instagram_handle: new FormControl(""),
		  lead_type_name:new FormControl(),
		  lead_cv:new FormControl(),
		  lead_source_type:new FormControl(),
		   referrer_type:new FormControl("",Validators.required)
		});


  	this.getFiltersData();
  	this.getReferListForSelect();
  	this.getReferrersList();
  	this.getFiletredLeadsForSales(1);
  }
  dropdownList = [];
    dropdownList2=[];
    dropdownList3=[];
    dropdownList4=[];
    dropdownList5=[];
    dropdownList6=[{"id":"created_at","itemName":"Acquisition Date"},{"id":"status_updated_at","itemName":"Status Updated Date"}];

    selectedItems = [];
    selectedItems2=[];
    selectedItems3 = [];
    selectedItems4=[];
    selectedItems5=[];
	selectedItems6=[{"id":"created_at","itemName":"Acquisition Date"}];

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
    search_value;
    onKey(event: any) { // without type info
      this.search_value = event.target.value ;
      var  i=0;
      if(true){
        this.getFiletredLeadsForSales('',this.search_value);
        i++;
      }
    }
    getReferListForSelect(){
    	this.salesService.getReferListForSelect(this.sales_id).subscribe(
    		res=>{
    			
    			this.lead_referrer_list = res['referral_roles'];


    		},
    		err=>{

    		})
    }
    getFiltersData(){
		this.leadService.getFiltersData().subscribe(
			res =>{
				res = res.json();
				
				this.lead_campaigns = res.lead_campaign_id_array
				this.lead_sources= res.lead_source_id_array;
				
				//this.lead_status=res.lead_status_array
				this.lead_types=	res.lead_type_id_array
				// this.csagentsArr = res.cs_agent_list;

				for(var i=0;i<res.lead_type_id_array.length;i++){
					var obj = {
						"id":res.lead_type_id_array[i].id,"itemName":res.lead_type_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList.push(obj);
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
				// for(var i=0;i<res.cs_agent_list.length;i++){
				// 	var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
				// 	var obj = {
				// 		"id":res.cs_agent_list[i].id,"itemName":<any>str
				// 	}
				// 	this.dropdownList5.push(obj);
				// }
				
			}
		);
	}
	fromDate(){
  		$(".fromDateSpan").hide();
  		$(".fromDate").show();
  	}
  	toDate(){
  		$(".toDateSpan").hide();
  		$(".toDate").show();
  	}
	getFiletredLeadsForSales(pageno?,search?){
		
		this.page_number = pageno;
		this.loaderService.display(true);
		this.salesService.getFileterLeadsForSales('',this.lead_statusArr,this.lead_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,
			this.column_name,this.from_date,this.to_date,this.csagents_idArr,this.referrer_type_id,search,pageno).subscribe(
			res =>{
				
				this.headers_res= res.headers._headers;
				this.per_page = this.headers_res.get('x-per-page');
				this.total_page = this.headers_res.get('x-total');
				this.current_page = this.headers_res.get('x-page');

				res= res.json();
				this.filteredLeads = res.leads;
				// this.filteredLeads = this.sortFunc(this.filteredLeads,{property: 'id', direction: '-1'});
				
				// this.queryParamSelectedArr();
				

				this.loaderService.display(false);
			},
			err => {
				
				this.loaderService.display(false);
			}
		);
	}


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
        	
        }
    }
	downloadExcel(){
		this.salesService.exportLeads1(this.role,'',this.lead_statusArr,this.lead_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,
			this.column_name,this.from_date,this.to_date,this.csagents_idArr,this.search).subscribe(
		  res =>{
		  	this.successalert = true;
			  this.successMessage = "An email has been sent to your mail id with leads download attachment"
			  setTimeout(function() {
					this.successalert = false;
				 }.bind(this), 9000);
			

		  },
		  err => {
			 
			 this.loaderService.display(false);
	         this.erroralert = true;
	         this.errorMessage = <any>JSON.parse(err['_body']).message;
	         setTimeout(function() {
	            this.erroralert = false;
	         }.bind(this), 2000);
		  }
		);
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
				this.addLeadForm.controls['referrer_id'].setValue("");
				this.basefile = undefined;
				this.getFiletredLeadsForSales(1);
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
	numberCheck(e) {
	    if(!((e.keyCode > 95 && e.keyCode < 106)
	        || (e.keyCode > 47 && e.keyCode < 58)
	        || e.keyCode == 8 || e.keyCode == 39 ||
	        e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9 || e.keyCode == 17
	        || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67 )) {
	      return false;
	    }
  	}
	attachment_file: any;
	attachment_name: string;
	basefile: any;
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

    filterData(){
    	this.csagents_idArr.length = 0;
    	this.lead_type_idArr.length=0;
    	this.lead_source_idArr.length=0;
    	this.lead_statusArr.length=0;
    	this.lead_campaign_idArr.length=0;

    	this.loaderService.display(true);
    	for(var k=0;k<this.selectedItems6.length;k++){
    		this.column_name =this.selectedItems6[k].id;
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

    	this.salesService.getFileterLeadsForSales(this.source,this.lead_statusArr,this.lead_type_idArr
			,this.lead_source_idArr,this.lead_campaign_idArr,
			this.column_name,this.from_date,this.to_date,this.csagents_idArr,this.search,1).subscribe(
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
		// this.updateLeadForm.controls['follow_up_time'].setValue(new Date(value.follow_up_time._i).toJSON().slice(0,19));
		this.updateLeadForm.controls['remark'].setValue(value.remark);
		this.updateLeadForm.controls['lost_remark'].setValue(value.lost_remark);
		this.updateLeadForm.controls['lost_reason'].setValue(value.lost_reason);
		this.updateLeadForm.controls['lead_type_name'].setValue(value.referrer.name);
		this.updateLeadForm.controls['lead_source_type'].setValue(value.lead_source);
		this.updateLeadForm.controls['instagram_handle'].setValue(value.instagram_handle);
		this.updateLeadForm.controls['referrer_type'].setValue(value.referrer_type);
		this.getReferUserList(value.lead_source_id,value.referrer_type);
		this.updateLeadForm.controls['referrer_id'].setValue(value.referrer.id);



		
		this.updateLeadForm.controls['lead_cv'].setValue(value.lead_cv);
		if(value.lost_reason == 'others'){
          document.getElementById('lostremark').setAttribute('style','display: block');
		}
		else{
			document.getElementById('lostremark').setAttribute('style','display: none');
		}
		if(value.follow_up_time){
			var date=value.follow_up_time.split('T')[0];
    	var time=value.follow_up_time.split('T')[1].split('.')[0];
    	value.follow_up_time = date +"T"+time;
		}
    this.updateLeadForm.controls['follow_up_time'].setValue(value.follow_up_time);
		
	}

	updateLeadFormSubmit(data){
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
						this.getFiletredLeadsForSales(1);
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
	            	this.getFiletredLeadsForSales(this.page_number);
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

  	onChangeOfLeadType(val){
		for(var i=0;i<this.lead_types.length;i++){
			if(val==this.lead_types[i].id){
				this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
			}
		}
	}
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
				|| this.addLeadForm.controls['lead_source_type'].value == 'others'){
					this.getReferUserList(val,this.addLeadForm.controls['lead_source_type'].value);

				}
				

			}

		}


	}
	onChangeOfLeadSourceEdit(val){
		for( var i=0;i<this.lead_referrer_list.length;i++){
			if(val == this.lead_referrer_list[i].name){
               
				this.updateLeadForm.controls['lead_source_type'].setValue(this.lead_referrer_list[i].name);
				if(this.updateLeadForm.controls['lead_source_type'].value == 'design_partner_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'client_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'broker' || this.updateLeadForm.controls['lead_source_type'].value == 'display_dealer_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'non_display_dealer_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'employee_referral' || this.updateLeadForm.controls['lead_source_type'].value == 'dealer' || this.updateLeadForm.controls['lead_source_type'].value == 'arrivae_champion' || this.updateLeadForm.controls['lead_source_type'].value == 'others'|| this.updateLeadForm.controls['lead_source_type'].value == 'associate_partner'){
					this.getReferUserList(val,this.updateLeadForm.controls['lead_source_type'].value);

				}
				

			}

		}


	}
	userList:any;
	getReferUserList(referId,referName){
		this.salesService.getReferUserList(this.sales_id,referName).subscribe(
			res=>{
				
				this.userList = res['users'];

			},
			err=>{
				

			});


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
	referrer_id = "";
	submitExcelUpload(){
		this.loaderService.display(true);
		this.salesService.uploadLeadExcel(this.basefile,this.sourceOfBulkLeads,this.typeOfBulkLeads,this.campignOfBulkLeads,this.referrer_id,this.referrer_type)
		.subscribe(
			res => {
			  $('#exampleModal').modal('hide');
			  this.getFiletredLeadsForSales(1);
			  this.loaderService.display(false);
			  this.sourceOfBulkLeads = "";
			  this.typeOfBulkLeads = "";
			  this.campignOfBulkLeads="";
			  this.referrer_id="";
			  this.referrer_type="";
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

	getReferrersList(page?,search?){
	    this.salesService.getReferrersList(this.sales_id,page,search).subscribe(
	      res=>{
	        
	       

	        res= res.json();
	        this.referreresList = res['users'];
	        
	        

	      },
	      err=>{
	        

	      })
	  }  

}
