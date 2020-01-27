import { Component, OnInit ,Input,AfterViewInit,Output,EventEmitter} from '@angular/core';
import { FormControl,FormArray,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import { LeadService } from '../../platform/lead/lead.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { FormBase } from '../dynamic-form/form-base';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-designerquestionnaire',
  templateUrl: './designerquestionnaire.component.html',
  styleUrls: ['./designerquestionnaire.component.css'],
  providers:[LeadService,DynamicFormService]
})
export class DesignerquestionnaireComponent implements OnInit {

	questionnaireForm: FormGroup;
  lead_details:any;
  project_id:any;
  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  questionnaireFormDetails:any;
  fetchquestionnaireFormDetailsvalue:any;
  lead_name:any;
  lead_email:any;
  lead_city:any;
  lead_state:any;
  lead_pincode:any;
  lead_contact:any;
  customer_profile_id:any;
  role:string;

  gender_value =['male','female','transgender'];
  education_background_value =['non-graduate','graduate','post-graduate','p.h.d','other'];
  professional_background_value = ['own_business', 'social_sector/NGO','private-salaried','gov.-salaried','other'];
  sector_employed_value = ['art_&_culture', 'design','e_commerce','entertainment','fashion',
  'finance','food_&_hospitality','health_care','information_technology','NGOs_&_socila_enterprenurship','sports','other'];
  income_per_value = ['<_5_lacs', '5-12_lacs','12-24_lacs','24-50_lacs','50_lacs_-_1_cr.','1cr._&_above'];
  family_status_value =['nuclear_family','joint_family'];
  matrial_status_value= ['single','relationship','married'];
  joint_family_status_value = ['parents','in-laws','sibling','others'];
  family_member_value = ['0-3','3-5','5-8','8_&_above'];
  relationship_decision_maker_value = ['spouse','sibling','parents','in-laws','friends','other'];
  house_purpose_value = ['self_use','rent_purpose'];

  private lead_id: any

  constructor(
  	private leadService:LeadService,
  	private loaderService:LoaderService,
    private formBuilder:FormBuilder,
    private dynamicFormService: DynamicFormService,
    private router: Router,
    private route : ActivatedRoute,
  ) { }

  ngOnInit() {
  	//questionnaireForm members
  	this.questionnaireForm = this.formBuilder.group({
  		"name": new FormControl("",Validators.required),
  		"email": new FormControl('', Validators.compose([
        Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
  		"phone": new FormControl("",[Validators.required,Validators.pattern(/^[6789]\d{9}$/)]),
  		"dob": new FormControl("",Validators.required),
      "address_line1": new FormControl("",Validators.required),
      "address_line2": new FormControl(""),
      "city": new FormControl("",Validators.required),
      "state": new FormControl("",Validators.required),
      "pincode": new FormControl("",Validators.required),
      "gender": new FormControl("",Validators.required),
      "education_background": new FormControl("",Validators.required),
      "professional_background": new FormControl("",Validators.required),
      "sector_employed": new FormControl("",Validators.required),
      "income_per": new FormControl("",Validators.required),
      "family_status": new FormControl("",Validators.required),
      "matrial_status": new FormControl(""),
      "joint_family_status": new FormControl(""),
      "family_member": new FormControl(""),
      "decision_maker": new FormControl("",Validators.required),
      "decision_name": new FormControl(""),
      "decision_email": new FormControl("",Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      "decision_phone": new FormControl("",[Validators.pattern(/^[6789]\d{9}$/)]),
      "decision_dob": new FormControl(""),
      "relationship_decision_maker": new FormControl(""),
      "decision_education_background": new FormControl(""),
      "decision_professional_background": new FormControl(""),
      "decision_sector_employed": new FormControl(""),
      "decision_income_per": new FormControl(""), 
      "moving_date": new FormControl("",Validators.required),
      "house_purpose": new FormControl("",Validators.required),
  	});

    //to get current role
    this.role = localStorage.getItem('user');
  }

  get leadid(): any {
    // transform value for display
    return this.lead_id;
  }
  @Input()
  set leadid(leadid: any) {
    this.lead_id = leadid;
    
    this.fetchBasicDetails();
  }

  //to get lead details
  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.questionnaireForm.controls['name'].setValue(this.lead_details.name);
        this.questionnaireForm.controls['email'].setValue(this.lead_details.email);
        this.questionnaireForm.controls['phone'].setValue(this.lead_details.contact);
        this.questionnaireForm.controls['city'].setValue(this.lead_details.city);
        this.questionnaireForm.controls['pincode'].setValue(this.lead_details.pincode);
        this.fetchquestionnaireFormDetails();
        
      },
      err => {
        
      }
    );
  }

  //questionnaireForm time submit
  submitQuestionnaire(data){
    this.loaderService.display(true);
     
    this.leadService.clientquestionnaireForm(this.project_id,data).subscribe(
      res => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Form submited successfully";
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

  //questionnaireForm edit time submit
  editQuestionnaire(data){
    this.loaderService.display(true);
     
    this.leadService.editclientquestionnaireForm(this.project_id,this.customer_profile_id,data).subscribe(
      res => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Form submited successfully";
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

  //to fetch questionnaire Form
  fetchquestionnaireFormDetails(){
    this.leadService.getfetchquestionnaireFormDetails(this.project_id).subscribe(
      res => {
        this.questionnaireFormDetails = res['customer_profile'];
        
        this.questionnaireForm.controls['name'].setValue(this.questionnaireFormDetails.name);
        this.questionnaireForm.controls['email'].setValue(this.questionnaireFormDetails.email);
        this.questionnaireForm.controls['phone'].setValue(this.questionnaireFormDetails.contact_no);
        this.questionnaireForm.controls['city'].setValue(this.questionnaireFormDetails.city);
        this.questionnaireForm.controls['pincode'].setValue(this.questionnaireFormDetails.pincode);
        this.questionnaireForm.controls['state'].setValue(this.questionnaireFormDetails.state);
        this.questionnaireForm.controls['dob'].setValue(this.questionnaireFormDetails.dob);
        this.questionnaireForm.controls['address_line1'].setValue(this.questionnaireFormDetails.address_line_1);
        this.questionnaireForm.controls['address_line2'].setValue(this.questionnaireFormDetails.address_line_2);
        this.questionnaireForm.controls['gender'].setValue(this.questionnaireFormDetails.gender);
        this.questionnaireForm.controls['education_background'].setValue(this.questionnaireFormDetails.educational_background);
        this.questionnaireForm.controls['professional_background'].setValue(this.questionnaireFormDetails.professional_background);
        this.questionnaireForm.controls['sector_employed'].setValue(this.questionnaireFormDetails.sector_employed);
        this.questionnaireForm.controls['income_per'].setValue(this.questionnaireFormDetails.income_per_annum);
        this.questionnaireForm.controls['family_status'].setValue(this.questionnaireFormDetails.family_status);
        this.questionnaireForm.controls['matrial_status'].setValue(this.questionnaireFormDetails.marital_status);
        this.questionnaireForm.controls['joint_family_status'].setValue(this.questionnaireFormDetails.joint_family_status);
        this.questionnaireForm.controls['family_member'].setValue(this.questionnaireFormDetails.no_of_family_members);
        this.questionnaireForm.controls['decision_maker'].setValue(this.questionnaireFormDetails.co_decision_maker);
        this.questionnaireForm.controls['decision_name'].setValue(this.questionnaireFormDetails.co_decision_maker_name);
        this.questionnaireForm.controls['decision_email'].setValue(this.questionnaireFormDetails.co_decision_maker_email);
        this.questionnaireForm.controls['decision_phone'].setValue(this.questionnaireFormDetails.co_decision_maker_phone);
        this.questionnaireForm.controls['relationship_decision_maker'].setValue(this.questionnaireFormDetails.relation_with_decision_maker);
        this.questionnaireForm.controls['decision_education_background'].setValue(this.questionnaireFormDetails.co_decision_maker_educational_background);
        this.questionnaireForm.controls['decision_professional_background'].setValue(this.questionnaireFormDetails.co_decision_maker_professional_background);
        this.questionnaireForm.controls['decision_sector_employed'].setValue(this.questionnaireFormDetails.co_decision_maker_sector_employed);
        this.questionnaireForm.controls['decision_income_per'].setValue(this.questionnaireFormDetails.co_decision_maker_income_per_annum);
        this.questionnaireForm.controls['house_purpose'].setValue(this.questionnaireFormDetails.purpose_of_house);
        this.questionnaireForm.controls['moving_date'].setValue(this.questionnaireFormDetails.movein_date);
        this.questionnaireForm.controls['decision_dob'].setValue(this.questionnaireFormDetails.co_decision_maker_dob);

        this.customer_profile_id = this.questionnaireFormDetails.id;

        if (this.questionnaireFormDetails.family_status == "joint_family"){
          $('#joint').show();
          $('#material').hide();
          $('#familyMember').show();
          $('#decisionMaker').show();
        }
        else if (this.questionnaireFormDetails.family_status == "nuclear_family"){
          $('#joint').hide();
          $('#material').show();
          $('#familyMember').show();
          $('#decisionMaker').show();
        }

        if (this.questionnaireFormDetails.co_decision_maker == "Yes") {
          $('#decisionMakerDetails').show();
          $('#movingDate').show();
          $('#housePurpose').show();
        }
        else {
          $('#movingDate').show();
          $('#housePurpose').show();
        }
      },
      err => {
        
      }
    );
  }

  //to display material status or joint family div
  familyStatusSelect(sel){
    if (sel == "nuclear") {
      $('#joint').hide();
      $('#material').show();
    }
    else if (sel == "joint") {
      $('#joint').show();
      $('#material').hide();
    }
  }

  //to show family member div
  familyMemberCount(){
    $('#familyMember').show();
  }

  //to display decision maker
  decisionMaker(){
    $('#decisionMaker').show();
  }

  //to display decision maker details
  showdecisionMaker(sel){
    if (sel == 'yes') {
      $('#decisionMakerDetails').show();
      $('#movingDate').show();
      $('#housePurpose').show();
    }
    else if (sel == 'no') {
      $('#decisionMakerDetails').hide();
      $('#movingDate').show();
      $('#housePurpose').show();
    }
  }
}
