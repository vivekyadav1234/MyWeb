import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../../project/project/project.service';
import { Project } from '../../project/project/project';
import { DesignerService } from '../designer.service';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import {Location} from '@angular/common';
import { DynamicFormService } from '../../../shared/dynamic-form/dynamic-form.service';
import { FormBase } from '../../../shared/dynamic-form/form-base';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-lead-details-for-designer',
  templateUrl: './lead-details-for-designer.component.html',
  styleUrls: ['./lead-details-for-designer.component.css'],
  providers: [ProjectService, DesignerService,LeadService,DynamicFormService]
})
export class LeadDetailsForDesignerComponent implements OnInit {

	  errorMessage : string;
    erroralert = false;
    successalert = false;
    successMessage : string;
    role:string;
    designerId:string;
    customerId : any;
    customerStatusUpdateForm : FormGroup;
    leadquestionnaire: FormGroup;
    designerBookingForm1 : FormGroup;
    designerBookingForm2:FormGroup;
    sendSmsForm: FormGroup;
    customerDetails:any;
    customer_status:string;
    usersList;
    statusDetails: any = {};
    filtercol1Val:any = 'all';
    smartshareHistoryList;

    headers_res;
    per_page;
    total_page;
    current_page;
    lead_type;
    queryParamsLeadType;
    queryParamsFromDate;
    queryParamsToDate;

  	constructor(
  		private router: Router,
    	private loaderService : LoaderService,
    	private projectService:ProjectService,
    	private designerService : DesignerService,
    	private route : ActivatedRoute,
    	private formBuilder: FormBuilder,
      private leadService:LeadService,
      private _location:Location
  	) {

  	 }

    ngOnInit() {
  		this.role = localStorage.getItem('user');
    	this.designerId = localStorage.getItem('userId');
    	this.route.queryParams.subscribe(params => {
  			this.customer_status = params['customer_status'];
  		});
      this.route.queryParams.subscribe(params => {
      this.fromDateFilter = params['from_date'];
      this.toDateFilter = params['to_date'];
      this.SelectedValue = params['column_name'];
      });

		  this.customerStatusUpdateForm = this.formBuilder.group({
	      customer_status : new FormControl("",Validators.required),
	      // follow_up_time : new FormControl(""),
	      customer_remarks : new FormControl(""),
	      customer_meeting_time : new FormControl("")
	    });
	    this.sendSmsForm = this.formBuilder.group({
	      sms_body : new FormControl("",Validators.required)
	    });
      if(this.fromDateFilter == 'false'){
       this.getUserListForDesigner(1);
      }
      else{
        this.getUserListForDesigner(1,'',this.SelectedValue,this.fromDateFilter,this.toDateFilter);
      }
	    
	    this.leadquestionnaire = this.formBuilder.group({
	      customer_name : new FormControl(""),
	      phone : new FormControl("",Validators.required),
	      project_name: new FormControl(""),
	      city : new FormControl("",Validators.required),
	      location: new FormControl("",Validators.required),
	      project_type :new FormControl("",Validators.required),
	      accomodation_type: new FormControl("",Validators.required),
	      scope_of_work : new FormControl("",Validators.required),
	      possession_status :new FormControl("",Validators.required),
	      have_homeloan: new FormControl("",Validators.required),
	      call_back_day: new FormControl("",Validators.required),
	      call_back_time: new FormControl("",Validators.required),
	      have_floorplan: new FormControl("",Validators.required),
	      remarks_of_sow: new FormControl(),
        possession_status_date:new FormControl(),
        budget_value:new FormControl(),
        home_value: new FormControl(),
	      lead_generator: new FormControl("",Validators.required),
	      additional_comments :new FormControl(""),
	      ownerable_type : new FormControl('Lead'),
	      user_id : new FormControl(localStorage.getItem('userId')),
	      ownerable_id : new FormControl()
	    });

	    this.designerBookingForm1 = this.formBuilder.group({
	    	customer_name : new FormControl(),
	    	customer_age : new FormControl(),
	    	profession : new FormControl(),
	    	family_profession : new FormControl(),
	    	age_house : new FormControl(),
	    	lifestyle : new FormControl(),
	    	house_positive_features : new FormControl(),
	    	house_negative_features : new FormControl(),
	    	inspiration : new FormControl(),
	    	color_tones : new FormControl(),
	    	theme : new FormControl(),
	    	functionality : new FormControl(),
	    	false_ceiling : new FormControl(),
	    	electrical_points : new FormControl(),
	    	special_needs : new FormControl(),
	    	vastu_shastra : new FormControl(),
	    	all_at_once : new FormControl(),
	    	budget_range : new FormControl(),
	    	design_style_tastes : new FormControl(),
	    	storage_space : new FormControl(),
	    	mood : new FormControl(),
	    	enhancements : new FormControl(),
	    	discuss_in_person : new FormControl(),
	    	mk_age:new FormControl(),
	    	mk_gut_kitchen :new FormControl(),
	    	mk_same_layout :new FormControl(),
	    	mk_improvements :new FormControl(),
	    	mk_special_requirements :new FormControl(),
	    	mk_cooking_details :new FormControl(),
	    	mk_appliances :new FormControl(),
	    	mk_family_eating_area :new FormControl(),
	    	mk_guest_frequence :new FormControl(),
	    	mk_storage_patterns :new FormControl(),
	    	mk_cabinet_finishing :new FormControl(),
	    	mk_countertop_materials:new FormControl(),
	    	mk_mood:new FormControl(),
	    	mk_lifestyle : new FormControl()
	    });
      this.statusChangeForm = this.formBuilder.group({
        reson_for_lost: new FormControl("",Validators.required),
        lost_remarks:new FormControl("")
      })
  	}

    sms_client : string;
    bookingFormDetails ;
    attachment_file: any;
  	basefile: any;
    statusChangeForm:FormGroup;

    storeSmsClient(clientId){
      this.sms_client = clientId;
    }
    

    onChange(event) {
	    this.basefile = undefined;
	   this.attachment_file = event.srcElement.files[0];
	   
	    var fileReader = new FileReader();
	    var base64;
        fileReader.onload = (fileLoadedEvent) => {
         base64 = fileLoadedEvent.target;
         this.basefile = base64.result;
       	};
	    fileReader.readAsDataURL(this.attachment_file);
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
    search_value;
    onKey(event: any) { // without type info
      this.search_value = event.target.value ;
      var  i=0;
      if(true){
        this.getUserListForDesigner('',this.search_value);
        i++;
      }
    } 

    designerBookingForm1Submit(data,formName){
    	this.loaderService.display(true);
    	data['customer_name'] = this.customerDetails.name;
    	data['project_id'] = this.projectDetailsForModal.id;
    	data['inspiration_image'] = this.basefile;
    	this.designerService.SubmitDesignerBookingForm(data,data['project_id']).subscribe(
    		res => {
    			this.designerBookingForm1.reset();
    			this.bookingFormDetails = res;
    			this.basefile = undefined;
    			this.attachment_file = undefined;
    			this.setBookingFormControlsValue(this.bookingFormDetails.designer_booking_form);
    			this.loaderService.display(false);
    			this.successalert = true;
    			this.successMessage = 'Form submitted successfully!';
          $('#leadDetailsModal').scrollTop(0);
    			setTimeout(function() {
            this.successalert = false;
          }.bind(this), 5000);
    		},
    		err => {
    			
    			this.loaderService.display(false);
    			this.erroralert = true;
    			this.errorMessage = JSON.parse(err['_body']).message;
          $('#leadDetailsModal').scrollTop(0);
    			setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 5000);
    		}
    	);
    }

    setBookingFormControlsValue(obj){
    	this.designerBookingForm1.controls['customer_name'].setValue(obj.general.customer_name);
    	this.designerBookingForm1.controls['customer_age'].setValue(obj.general.customer_age);
    	this.designerBookingForm1.controls['age_house'].setValue(obj.general.age_house);
    	this.designerBookingForm1.controls['all_at_once'].setValue(obj.general.all_at_once);
    	this.designerBookingForm1.controls['budget_range'].setValue(obj.general.budget_range);
    	this.designerBookingForm1.controls['color_tones'].setValue(obj.general.color_tones);
    	this.designerBookingForm1.controls['design_style_tastes'].setValue(obj.general.design_style_tastes);
    	this.designerBookingForm1.controls['discuss_in_person'].setValue(obj.general.discuss_in_person);
    	this.designerBookingForm1.controls['electrical_points'].setValue(obj.general.electrical_points);
    	this.designerBookingForm1.controls['enhancements'].setValue(obj.general.enhancements);
    	this.designerBookingForm1.controls['false_ceiling'].setValue(obj.general.false_ceiling);
    	this.designerBookingForm1.controls['family_profession'].setValue(obj.general.family_profession);
    	this.designerBookingForm1.controls['functionality'].setValue(obj.general.functionality);
    	this.designerBookingForm1.controls['house_negative_features'].setValue(obj.general.house_negative_features);
    	this.designerBookingForm1.controls['house_positive_features'].setValue(obj.general.house_positive_features);
    	this.designerBookingForm1.controls['inspiration'].setValue(obj.general.inspiration);
    	this.designerBookingForm1.controls['lifestyle'].setValue(obj.general.lifestyle);
    	this.designerBookingForm1.controls['mood'].setValue(obj.general.mood);
    	this.designerBookingForm1.controls['profession'].setValue(obj.general.profession);
    	this.designerBookingForm1.controls['special_needs'].setValue(obj.general.special_needs);
    	this.designerBookingForm1.controls['storage_space'].setValue(obj.general.storage_space);
    	this.designerBookingForm1.controls['theme'].setValue(obj.general.theme);
    	this.designerBookingForm1.controls['vastu_shastra'].setValue(obj.general.vastu_shastra);
    	this.designerBookingForm1.controls['mk_age'].setValue(obj.modular_kitchen.mk_age);
    	this.designerBookingForm1.controls['mk_appliances'].setValue(obj.modular_kitchen.mk_appliances);
    	this.designerBookingForm1.controls['mk_cabinet_finishing'].setValue(obj.modular_kitchen.mk_cabinet_finishing);
    	this.designerBookingForm1.controls['mk_cooking_details'].setValue(obj.modular_kitchen.mk_cooking_details);
    	this.designerBookingForm1.controls['mk_countertop_materials'].setValue(obj.modular_kitchen.mk_countertop_materials);
    	this.designerBookingForm1.controls['mk_family_eating_area'].setValue(obj.modular_kitchen.mk_family_eating_area);
    	this.designerBookingForm1.controls['mk_guest_frequence'].setValue(obj.modular_kitchen.mk_guest_frequence);
    	this.designerBookingForm1.controls['mk_gut_kitchen'].setValue(obj.modular_kitchen.mk_gut_kitchen);
    	this.designerBookingForm1.controls['mk_improvements'].setValue(obj.modular_kitchen.mk_improvements);
    	this.designerBookingForm1.controls['mk_lifestyle'].setValue(obj.modular_kitchen.mk_lifestyle);
    	this.designerBookingForm1.controls['mk_mood'].setValue(obj.modular_kitchen.mk_mood);
    	this.designerBookingForm1.controls['mk_same_layout'].setValue(obj.modular_kitchen.mk_same_layout);
   	  this.designerBookingForm1.controls['mk_special_requirements'].setValue(obj.modular_kitchen.mk_special_requirements);
    	this.designerBookingForm1.controls['mk_storage_patterns'].setValue(obj.modular_kitchen.mk_storage_patterns);	
      
      if(obj.general.customer_age==null && obj.general.age_house == null && obj.general.all_at_once==null &&
        obj.general.budget_range == null && obj.general.color_tones == null && obj.general.design_style_tastes==null &&
        obj.general.discuss_in_person == null && obj.general.electrical_points== null && obj.general.enhancements == null &&
        obj.general.false_ceiling == null && obj.general.family_profession == null && obj.general.functionality==null &&
        obj.general.house_negative_features == null && obj.general.house_positive_features == null && obj.general.inspiration ==null &&
        obj.general.lifestyle == null && obj.general.mood==null && obj.general.profession == null && obj.general.special_needs==null &&
        obj.general.storage_space==null && obj.general.theme==null && obj.general.vastu_shastra ==null) {
          document.getElementById('designerBookingForm1Button').innerHTML = 'SUBMIT';
      } else {
          document.getElementById('designerBookingForm1Button').innerHTML = 'UPDATE';
      }
      
      if(obj.modular_kitchen.mk_age==null && obj.modular_kitchen.mk_appliances==null && obj.modular_kitchen.mk_cabinet_finishing == null &&
        obj.modular_kitchen.mk_cooking_details==null && obj.modular_kitchen.mk_countertop_materials==null &&
        obj.modular_kitchen.mk_family_eating_area==null && obj.modular_kitchen.mk_guest_frequence==null &&
        obj.modular_kitchen.mk_gut_kitchen==null && obj.modular_kitchen.mk_improvements==null &&
        obj.modular_kitchen.mk_lifestyle==null && obj.modular_kitchen.mk_mood==null &&
        obj.modular_kitchen.mk_same_layout==null && obj.modular_kitchen.mk_special_requirements==null && 
        obj.modular_kitchen.mk_storage_patterns==null && obj.general.customer_age==null && obj.general.profession==null &&
        obj.general.family_profession == null) {
          document.getElementById('designerBookingForm2Button').innerHTML = 'SUBMIT';
      } else {
          document.getElementById('designerBookingForm2Button').innerHTML = 'UPDATE';
      }

    }

    getDesignerBookingForm(projectId){
    	this.designerService.getDesignerBookingForm(projectId).subscribe(
    		res => {
    			this.bookingFormDetails = res;
    			this.setBookingFormControlsValue(this.bookingFormDetails.designer_booking_form);
    		},
    		err => {
    			
    		}
    	);
    }

    sendSmsSubmitForm(data){
    	this.loaderService.display(true);
      this.designerService.sendSms(localStorage.getItem('userId'), this.sms_client, data.sms_body).subscribe(
        res => {
           this.loaderService.display(false);
           $('#SmsModal').modal('hide');
          this.successalert = true;
          this.successMessage = 'SMS sent successfully!';
        },
        err => {
          
          $('#SmsModal').modal('hide');
           this.loaderService.display(false);
        }
     );
    }

  	setUserStatus(value) {
	    if(value=='follow_up') {
	      document.getElementById('followupdatetime').setAttribute('style','display: block');
	    } else {
	      document.getElementById('followupdatetime').setAttribute('style','display: none');
	    }
	    if(value == 'lost') {
	      document.getElementById('lostremark').setAttribute('style','display: block');
	    } else {
	      document.getElementById('lostremark').setAttribute('style','display: none');
	    }
	    if(value == 'meeting_fixed') {
	      document.getElementById('meetingdatetime').setAttribute('style','display: block');
	    } else {
	      document.getElementById('meetingdatetime').setAttribute('style','display: none');
	    }

	}

	basicDetails(){
		if($(".addClass").hasClass("hideClass")) {
        	$(".addClass").removeClass("hideClass");
        }
      	$(".upload0").addClass("actBtn");
      	$(".upload1").removeClass("actBtn");
        $(".upload2").removeClass("actBtn");
        $(".upload3").removeClass("actBtn");
      	$(".addClass1").addClass("hideClass");
        $(".addClass2").addClass("hideClass");
        $(".addClass3").addClass("hideClass");
        $(".addClass4").addClass("hideClass");
        $(".upload4").removeClass("actBtn");
        $(".addClass5").addClass("hideClass");
        $(".upload5").removeClass("actBtn");
	}

	projectDetails(){
		if($(".addClass1").hasClass("hideClass")) {
		    $(".addClass1").removeClass("hideClass"); 
		}
		$(".upload1").addClass("actBtn");
       	$(".addClass").addClass("hideClass");
        $(".addClass2").addClass("hideClass");
        $(".addClass3").addClass("hideClass");
        $(".upload0").removeClass("actBtn");
        $(".upload2").removeClass("actBtn");
        $(".upload3").removeClass("actBtn");
        $(".addClass4").addClass("hideClass");
        $(".upload4").removeClass("actBtn");
        $(".addClass5").addClass("hideClass");
        $(".upload5").removeClass("actBtn");
	}

	userStatus(){
		if($(".addClass3").hasClass("hideClass")) {
		    $(".addClass3").removeClass("hideClass");
		}
		$(".upload3").addClass("actBtn");
       	$(".addClass").addClass("hideClass");
        $(".addClass2").addClass("hideClass");
        $(".addClass1").addClass("hideClass");
        $(".upload0").removeClass("actBtn");
        $(".upload2").removeClass("actBtn");
        $(".upload1").removeClass("actBtn");
        $(".addClass4").addClass("hideClass");
        $(".upload4").removeClass("actBtn");
        $(".addClass5").addClass("hideClass");
        $(".upload5").removeClass("actBtn");
	}

	questionnaire(){
		if($(".addClass2").hasClass("hideClass")) {
		    $(".addClass2").removeClass("hideClass");
		}
		$(".upload2").addClass("actBtn");
       	$(".addClass").addClass("hideClass");
        $(".addClass3").addClass("hideClass");
        $(".addClass1").addClass("hideClass");
        $(".upload0").removeClass("actBtn");
        $(".addClass4").addClass("hideClass");
        $(".upload4").removeClass("actBtn");
        $(".upload3").removeClass("actBtn");
        $(".upload1").removeClass("actBtn");
        $(".addClass5").addClass("hideClass");
        $(".upload5").removeClass("actBtn");
	}
	designerquestionnaire1(){
		if($(".addClass4").hasClass("hideClass")) {
		    $(".addClass4").removeClass("hideClass");
		}
		$(".upload4").addClass("actBtn");
       	$(".addClass").addClass("hideClass");
        $(".addClass3").addClass("hideClass");
        $(".addClass2").addClass("hideClass");
        $(".addClass1").addClass("hideClass");
        $(".addClass5").addClass("hideClass");
        $(".upload5").removeClass("actBtn");
        $(".upload0").removeClass("actBtn");
        $(".upload3").removeClass("actBtn");
        $(".upload2").removeClass("actBtn");
        $(".upload1").removeClass("actBtn");
	}
	designerquestionnaire2(){
		if($(".addClass5").hasClass("hideClass")) {
		   $(".addClass5").removeClass("hideClass");
		}
		$(".upload5").addClass("actBtn");
       	$(".addClass").addClass("hideClass");
        $(".addClass3").addClass("hideClass");
        $(".addClass2").addClass("hideClass");
        $(".addClass1").addClass("hideClass");
        $(".addClass4").addClass("hideClass");
        $(".upload0").removeClass("actBtn");
        $(".upload3").removeClass("actBtn");
        $(".upload2").removeClass("actBtn");
        $(".upload1").removeClass("actBtn");
        $(".upload4").removeClass("actBtn");
	}
	closeModal(){
		this.getUserListForDesigner(1);
	    if($(".addClass").hasClass("hideClass")) {
	       $(".addClass").removeClass("hideClass");
	    }
	    $(".upload0").addClass("actBtn");
      	$(".upload1").removeClass("actBtn");
        $(".upload2").removeClass("actBtn");
        $(".upload3").removeClass("actBtn");
      	$(".addClass1").addClass("hideClass");
        $(".addClass2").addClass("hideClass");
        $(".addClass3").addClass("hideClass");
         $(".addClass4").addClass("hideClass");
        $(".upload4").removeClass("actBtn");
        $(".addClass5").addClass("hideClass");
        $(".upload5").removeClass("actBtn");
	    this.basefile = undefined;
    	this.attachment_file = undefined;
      this.customerDetails = undefined;
      this.projectDetailsForModal = undefined;
      this.leadIdForModal = undefined;
	}

	getCustomerDetails(customer_id){
		this.designerService.getCustomerDetails(customer_id,this.designerId).subscribe(
			res => {
				Object.keys(res).map((key)=>{ res= res[key];});
				this.customerDetails = res;
			},
			err => {
				
			}
		);
	}

    getUserQuestionnaireDetails(customerId){
      this.loaderService.display(true);
      this.leadService.getRecordNotesQuestionnaire(customerId).subscribe(
        res=>{
          Object.keys(res).map((key)=>{ res= res[key];});
          if(res!=null && res.length>0){
            this.customerDetails.lead_questionnaire = res[0];
          }
          this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
          
        }
       );
    }

	updateStatus(userStatusData) {
	    this.customerStatusUpdateForm.controls['customer_status'].setValue("");
	    this.designerService.changeUserStatus(userStatusData,this.designerId,this.customerId).subscribe(
	        res => {
	        	Object.keys(res).map((key)=>{ res= res[key];});
				    this.customerDetails = res;
	        	this.successalert = true;
	        	this.successMessage = 'Status updated successfully!';
	        	setTimeout(function() {
	                 this.successalert = false;
	            }.bind(this), 2000);

	            this.customerStatusUpdateForm.controls['customer_remarks'].setValue("");
	            this.customerStatusUpdateForm.controls['customer_meeting_time'].setValue("");
	            document.getElementById('lostremark').setAttribute('style','display: none');
	            document.getElementById('meetingdatetime').setAttribute('style','display: none');
	            document.getElementById('followupdatetime').setAttribute('style','display: none');
	        },
	        err => {
	          this.erroralert = true;
	          document.getElementById('lostremark').setAttribute('style','display: none');
	          document.getElementById('meetingdatetime').setAttribute('style','display: none');
	          document.getElementById('followupdatetime').setAttribute('style','display: none');
	            this.errorMessage = JSON.parse(err['_body']).message;
	            setTimeout(function() {
	                 this.erroralert = false;
	            }.bind(this), 2000);
	        }
	    )
  	}

  	getUserListForDesigner(page?,search?,columnName?,formDate?,toDate?){
  		this.loaderService.display(true);
	    this.designerService.getUserListForDesigner(this.designerId,this.customer_status, page,search,columnName,formDate,toDate).subscribe(
	      res => {
          this.headers_res= res.headers._headers;
          this.per_page = this.headers_res.get('x-per-page');
          this.total_page = this.headers_res.get('x-total');
          this.current_page = this.headers_res.get('x-page');

          res= res.json();
          this.usersList = res.leads;
          
	        // Object.keys(res).map((key)=>{ this.usersList= res[key];});
	        this.loaderService.display(false);
	      },
	      err => {
	        
	        this.loaderService.display(false);
	      }
	    );
	  }
    callResponse: any;
    callToLead(contact){
    	this.loaderService.display(true);
	    this.designerService.callToLead(localStorage.getItem('userId'), contact).subscribe(
	        res => {
	           this.loaderService.display(false);
	          if(res.inhouse_call.call_response.code == '403'){
	            this.erroralert = true;
	            this.errorMessage = JSON.parse(res.message.body).RestException.Message;
	            setTimeout(function() {
	                 this.erroralert = false;
	            }.bind(this), 10000);
	            //JSON.parse(temp1.body).RestException.Message
	          } else {
	            this.callResponse =  JSON.parse(res.inhouse_call.call_response.body);
	            this.successalert = true;
	            this.successMessage = 'Calling from - '+this.callResponse.Call.From;
	            setTimeout(function() {
	                 this.successalert = false;
	            }.bind(this), 10000);
	          }
	        },
	        err => {
	        	this.loaderService.display(false);
	          
	        }
	     );
	  }

    projectDetailsForModal; leadIdForModal;
    setModalData(project,leadId){
      this.projectDetailsForModal = project;
      this.leadIdForModal = leadId;
    }

    onStatusChange(customerId,ProjectId,status){
      this.statusDetails["customer_status"] = status;
      this.statusDetails["customer_id"] = customerId;
      this.statusDetails['project_id'] = ProjectId;

      this.loaderService.display(true);

      if(this.statusDetails["customer_status"] == "follow_up"){
        $("#followup-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
        // $("#followup_remarks").val();
        this.loaderService.display(false);
        $("#statusModal").modal("show");
      }else if(this.statusDetails["customer_status"] == "lost"){
        this.loaderService.display(false);
        $("#loststatusModal").modal("show");
        this.statusChangeForm.reset();
      }
      else if(this.statusDetails["customer_status"] == 'delayed_possession'){
        $("#delayedModal").modal("show");
        this.loaderService.display(false);



      }
      else if(this.statusDetails["customer_status"] == 'delayed_project'){
        $("#delayedProjectModal").modal("show");
        this.loaderService.display(false);



      }
      else{
        this.updateNewStatus();
      }
    }

    onCallbackChange(status){
      this.loaderService.display(true);
      if(status=='lost'){
        $("#loststatusModal").modal("hide");
        this.statusDetails["reason_for_lost"] = $("#lost_reason").val();
        this.statusDetails['remarks']= $("#lost_remarks").val();
        this.updateNewStatus();

      }
      if(status == 'not_contactable'){
        $("#notContactableModal").modal("hide");
        this.statusDetails['customer_meeting_time'] =$('#notcontactable-details').val();
        this.updateNewStatus();

      }
      if(status=='follow_up'){
        if($("#followup-details").val() != ''){
         $("#statusModal").modal("hide");
        this.statusDetails["customer_meeting_time"] = $("#followup-details").val();
        this.statusDetails['remarks']= $("#followup_remarks").val();
        this.updateNewStatus();
        }
        else{
          this.loaderService.display(false);
          this.erroralert = true;
            this.errorMessage = 'CallBack Date is required';
            setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 2000);
              
        }
      }
    }
    reasonForLostDropdownChange(val){
      // if(val=='others'){
      //   document.getElementById('lostRemarkRow').classList.remove('d-none');
      this.statusChangeForm.controls['lost_remarks'].setValidators([Validators.required]);
      // } else {
      //   if(document.getElementById('lostRemarkRow'))
      //     document.getElementById('lostRemarkRow').classList.add('d-none');
      //     this.statusChangeForm.controls['lost_remarks'].setValue("");
      //     this.statusChangeForm.controls['lost_remarks'].validator=null;
      // }
      this.statusChangeForm.controls['lost_remarks'].updateValueAndValidity();
    }
    updateNewStatus(){
      this.designerService.statusUpdate(this.statusDetails,this.designerId).subscribe(
          res => {

            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = 'Status updated successfully!';
            this.getUserListForDesigner(1);
            this.statusChangeForm.reset();
            this.statusChangeForm.controls['reson_for_lost'].setValue("");
            if(document.getElementById('lostRemarkRow')){
              document.getElementById('lostRemarkRow').classList.add('d-none');
            }
            setTimeout(function() {
                   this.successalert = false;
              }.bind(this), 2000);
              
          },
          err => {

            this.erroralert = true;
            this.loaderService.display(false);
              this.errorMessage = JSON.parse(err['_body']).message;
              setTimeout(function() {
                   this.erroralert = false;
              }.bind(this), 2000);

          }
      )
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
  month:any;
  day:any;
  year:any
  // Disable calender date
  disableDate(){
    var datep = $('#followup-details').val();
    datep = datep.substring(0,10);
    var dtToday = new Date();
      
     this.month = dtToday.getMonth() + 1;
     this.day = dtToday.getDate();
     this.year = dtToday.getFullYear();
    if(this.month < 10)
        this.month = '0' + this.month.toString();
    if(this.day < 10)
        this.day = '0' + this.day.toString();
    
    var maxDate = this.year + '-' + this.month + '-' + this.day;
    $('#followup-details').attr('min', maxDate);
    if (datep < maxDate) {
      alert("selected date is in past");
      $('#followup-details').val(maxDate);
    }
    

  }
  


    openpopup(event,id){
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });
   
    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    }) 
  }
  toDateFilter:any;
  SelectedValue:any;
  fromDateFilter:any;
  filterColumDropdownChange(Value){
    this.SelectedValue = Value;
    if(this.SelectedValue == 'all'){
      
      document.getElementById('fromDateFilter').setAttribute('style','display: none');
      document.getElementById('toDateFilter').setAttribute('style','display: none');
      
    }

    else if(this.SelectedValue == 'lead_created_at'|| this.SelectedValue == 'assigned_to_designer' || this.SelectedValue == 'assigned_to_cm'){
      document.getElementById('fromDateFilter').setAttribute('style','display: inline-block');
      document.getElementById('toDateFilter').setAttribute('style','display: inline-block');

    }
    

  }
  filterSubmit(){
    if( this.SelectedValue == 'all'){
      this.getUserListForDesigner(1);

    }
    else if(this.SelectedValue == 'lead_created_at' || this.SelectedValue == 'assigned_to_designer' || this.SelectedValue == 'assigned_to_cm'){
      this.getUserListForDesigner(1,'',this.SelectedValue,this.fromDateFilter,this.toDateFilter);


    }


  }
  
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
   
  ngAfterViewInit(){

    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })
  }

  backClicked() {
    this._location.back();
  }
  downloadExcel(){
    this.designerService.exportLeads(this.role,this.designerId,this.customer_status,this.SelectedValue,this.fromDateFilter,this.toDateFilter).subscribe(
      res =>{
      var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      var b64Data =  res._body;

      var blob = this.b64toBlob(b64Data, contentType,512);
      var blobUrl = URL.createObjectURL(blob);
      // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let dwldLink = document.createElement("a");
      // let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", blobUrl);
      dwldLink.setAttribute("download", "lead.xlsx");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      },
      err => {
        
      // this.erroralert = true;
      //   this.errorMessage = <any>JSON.parse(err['_body']).message;
      //   setTimeout(function() {
      //     this.erroralert = false;
      //    }.bind(this), 2000);
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
    // Method after submit the date for delay possession
  onCallbackChangeForDelay(){
    if($("#startDate").val() != ''){
     this.loaderService.display(true);
     this.statusDetails["customer_meeting_time"] = $("#startDate").val();
     $('#delayedModal').modal('hide');
     this.updateNewStatus();

    }
    else{
      this.erroralert = true;
        this.errorMessage = 'Delayed Date is required';
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
          
    }

  }
  // Method after submit the date for delay project
  onCallbackChangeForDelayProject(){
    if($("#delayProjectDate").val() != ''){
     this.loaderService.display(true);
     this.statusDetails["customer_meeting_time"] = $("#delayProjectDate").val();
     $('#delayedProjectModal').modal('hide');
     this.updateNewStatus();

    }
    else{
      this.erroralert = true;
        this.errorMessage = 'Delayed Project Date is required';
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
          
    }


  }
  callChangeNew(){
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
        $('#startDate','#delayProjectDate').datepicker("show");
    }).focus();
  }

  /*Send Smart Report Through Email function*/ 
  smartShareEmail(){
    this.designerService.smartShareEmail().subscribe(
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

  /*Smart Report History*/ 
  smartShareHistory(lead_id){
    this.designerService.smartShareHistory(lead_id).subscribe(
    res => {
      this.smartshareHistoryList = res.smart_histories;
      
    },
    err => {
      this.erroralert = true;
    }
    );
  }

} 
