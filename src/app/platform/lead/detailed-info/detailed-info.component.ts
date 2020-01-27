import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormArray,FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { DesignerService } from '../../designer/designer.service';
declare var $:any;

@Component({
  selector: 'app-detailed-info',
  templateUrl: './detailed-info.component.html',
  styleUrls: ['./detailed-info.component.css'],
  providers: [LeadService, DesignerService]
})
export class DetailedInfoComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  selectedSet:any = 'csq';
  customerStatusUpdateForm : FormGroup;
  LeadquestionnaireForm: FormGroup;
  designerBookingForm1 : FormGroup;
  designerBookingForm2:FormGroup;
  leadquestionnaire : FormGroup;
  addleadquestionnaire : FormGroup;
  customerDetails:any;
  projectDetailsForModal;

  leadIdForModal;
  bookingFormDetails:any = {};
  basefile;
  attachment_file;
  successalert;
  successMessage;
  erroralert;
  errorMessage;
  designerId;
  lead_questionnaire;
  project_id;

  accommodation_type = ['Studio Apartment','1RK','1BHK','1.5BHK','2BHK','2.5BHK','3BHK',
    '3.5BHK','4BHK','4.5BHK','5BHK','Villa','Bungalow','Office Space'];
  callbacktime = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM',
                '1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
                '5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM',
                '10:00 PM','10:30 PM','11:00 PM'];
  scopeOfwork = ['Modular Kitchen','Loose Furniture','Full Home Interiors (Design)','Full Home Interiors (Design & Fullfilment)','Partial Home Interiors (e.g. MKW + Living Room)'];

  lead_status;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public designerService : DesignerService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');

    this.fetchBasicDetails();
    this.updateFormGroup();
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        // this.updateFormGroup();
        // this.getCitiesForQuestionnaire();
        // this.getUserQuestionnaireDetails(this.lead_details.id)
        this.getDesignerBookingForm(this.lead_details.project_details.id)
        this.project_id = this.lead_details.project_details.id;
      },
      err => {
        
      }
    );
  }

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details && this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }

  updateFormGroup(){

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
    
  }
  closeModal(){
    this.lead_questionnaire =undefined;
    // this.city_others = undefined;
  }

  getSet(setType){
    this.selectedSet = setType;
    if(setType == "csq"){
      // this.getUserQuestionnaireDetails(this.lead_details.id)
    }
    // else if(setType == "bf_1" || setType == "bf_2"){
    //   
    //   this.getDesignerBookingForm(this.lead_details.project_details.id)
    // }
  }

  designerBookingForm1Submit(data,formName){
    this.loaderService.display(true);
    data['customer_name'] = this.lead_details.user_reference.name;
    data['project_id'] = this.lead_details.project_details.id;
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
        if( document.getElementById('designerBookingForm1Button')){
          document.getElementById('designerBookingForm1Button').innerHTML = 'SUBMIT';
        }
    } else {
        if( document.getElementById('designerBookingForm1Button')){
          document.getElementById('designerBookingForm1Button').innerHTML = 'UPDATE';
        }
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
  onchangeCity1(city){
    if(city=='Other'){
      document.getElementById('cityOthersInput1').classList.remove('d-none');
    } else{
      document.getElementById('cityOthersInput1').classList.add('d-none');
    }
  }
  onchangeCity2(city){
    if(city=='Other'){
      document.getElementById('cityOthersInput2').classList.remove('d-none');
    } else{
      document.getElementById('cityOthersInput2').classList.add('d-none');
    }
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

}
