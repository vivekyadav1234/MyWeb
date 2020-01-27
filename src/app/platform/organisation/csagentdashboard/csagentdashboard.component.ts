import { ChangeDetectorRef} from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable,Subscription } from 'rxjs';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import { CsagentService } from './csagent.service';
import { SalesManagerService } from '../../salesmanager/sales-manager.service';
import { DynamicFormService } from '../../../shared/dynamic-form/dynamic-form.service';
import { FormBase } from '../../../shared/dynamic-form/form-base';
import {
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-csagentdashboard',
  templateUrl: './csagentdashboard.component.html',
  styleUrls: ['./csagentdashboard.component.css'],
  providers: [LeadService,CsagentService,SalesManagerService,DynamicFormService]
})
export class CsagentdashboardComponent implements OnInit {

  addLeadForm: FormGroup;
  errorMessage : string;
   erroralert = false;
  successalert = false;
  successMessage : string;
  errorMessagemodal : string;
  erroralertmodal = false;
  successalertmodal = false;
  successMessagemodal : string;
  showStatus:boolean;
  agentID : string;
  getquestionairedata:any;
  userAgentDetails : any;
  activeLeadDataForAgent : any;
  leadDetails:any;
  note_records : any;
  city_others;
  leadStatusUpdateForm : FormGroup;
  leadquestionnaire : FormGroup;
  addleadquestionnaire : FormGroup;
  callCustomerForm:FormGroup;
  callingCustomer:boolean;
  inviteChampionForm: FormGroup;
  lead_referrer_list=[];
  user_id;
  role:string;
  referrer_type="";
  referrer_type_id;
  masterselected:boolean;
  masterSelected:boolean;
  checklist:any;
  checkedList:any= [];
  finaldata:any = [];
  leadItemscheckedListNames:any = [];
leaditesmnewlyadded:any=[];

selectedMoment = new Date();
orderForm: FormGroup;
items: FormArray;
budgetcaluclatorform:FormGroup;
  masterLeadItemsCopy:any;
  totalBudget= 0;
  selectstatusforec:any;
selectstatusforsitemeasurement:any;
searchstatus : any;
notfound = "notfound";
demolist:any = [];
getcaluclatordata: any;
searchname:any;
hideAlternateNumberButton: boolean;
  accommodation_type = ['Studio Apartment','1RK','1BHK','1.5BHK','2BHK','2.5BHK','3BHK',
    '3.5BHK','4BHK','4.5BHK','5BHK','Villa','Bungalow'];
  scopeOfwork_home = ['Modular Kitchen','Full Home Interiors','Interiors without Services','Partial Home Interiors (e.g. MKW + Living Room)'];
  callbacktime = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM',
                '1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
                '5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM',
                '10:00 PM','10:30 PM','11:00 PM'];
 estimatedPossessionTime = ['01/2018','02/2018','03/2018','04/2018','05/2018',
    '06/2018','07/2018','08/2018','09/2018','10/2018','11/2018','12/2018','01/2019','02/2019','03/2019','04/2019','05/2019',
    '06/2019','07/2019','08/2019','09/2019','10/2019','11/2019','12/2019'];
  lostReasonsArr=['low_budget','non_serviceable_area','out_of_scope','general_inquiry/not_interested',
    'language_barrier','already_done_with_other_vendor','others'];
  type_of_space_office = ['Corporate - IT Offices / Industrial Offices','Institutional - Colleges / Academies / Training Centres',
  'Hospitality - Hotels / Restaurants / Hospitals / Resorts','Retail - Showroom / Shops'];
  status_of_property_offices = ['New Property - Warm Shell','New Property - Bare Shell','New Property - Refurbished',
  'Old Property - Bare Shell','Old Property - Warm Shell','Old Property - Refurbished'];
  scopeOfwork_office=['Turnkey Solution','Part Wise (Design & Fulfillment)','Furniture Requirement',
  'Turnkey Solution (Design Only - **2500 Sq Ft and Above)','Part Wise (Design Only - **2500 Sq Ft and Above)'];
  budget_value_home =['Less than 1.5 Lac','1.5 - 3 Lacs','3 - 5 Lacs','5 - 8 Lacs','8 - 12 Lacs','Above 12 Lacs','Not Disclosed'];
  budget_value_office=['Less than 15 Lacs','15 - 25 Lacs','25 - 35 Lacs','35 - 45 Lacs','Above 45 Lacs'];
  home_value_arr=['Less than 30 Lacs','30 - 50 Lacs','50 - 70 Lacs','70 - 99 Lacs','1 - 1.25 Cr',
  '1.26 - 1.75 Cr','1.76 - 2.50 Cr','Above 2.50 Cr','Not Available'];
  lead_generator_arr =['Akshay Pawar','Azhar Khan','Rohit Dalvi','Roshni Malik',
  'Roshan','Himanshu Ram','Rajeev Salve','Imran Ansari','Edwin Fernandes','Pranav Trivedi',
  'Salman Qureshi','Hussain Champawala','Adriana Desouza'];
  lead_source_questionnaire_arr=['Facebook Campaign','Inbound Call','Housing Finance','Facebook Direct',
  'Get a callback from us','Broker','Referral','Dealer','Add Call Attempt','Missed Call','Shriram Developers'];
  have_homeloan_arr=['Yes','No','Doesn\'t want to disclose'];
  home_type_arr =['New (No one has ever stayed in that home)','Old (Currently staying in the house)'];
  Buildings = ['shree-pg','kaartik-residency','Hotel abhinav','vivek furnitures','shankar-paints','boat-house','benny villa',
'deepak furnitures','otherbuilding','Others'];
  purpose_of_property=['Own Stay','Rental','Not Disclosed'];
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  alternateNumberForm:FormGroup;
  dynamic_fields: any;
  @Input() fields: FormBase<any>[] = [];
  staticFields;
  showAlternateForm: boolean;
  alternateNumberMasterForm: any;
  is_champion;
  constructor(
    private router: Router,
    private loaderService : LoaderService,
    private leadService : LeadService,
    private formBuilder:FormBuilder,
    private csagentService:CsagentService,
    private salesService: SalesManagerService,
    private dynamicFormService: DynamicFormService,
    public ref: ChangeDetectorRef
  ) {
    this.showStatus = true;
    this.callCustomerForm = formBuilder.group({
      'contact_number': ['',[Validators.required,Validators.pattern(/^[6789]\d{9}$/)]]
    });
    this.alternateNumberMasterForm = this.formBuilder.group({
      alternate_contacts: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.user_id =localStorage.getItem('userId');
    this.loaderService.display(false);
    this.agentID = localStorage.getItem('userId');
    this.is_champion = localStorage.getItem('isChampion');
    this.addLeadForm = this.formBuilder.group({
      name : new FormControl(""),
      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      contact : new FormControl("",[Validators.required]),
      pincode : new FormControl(""),
      lead_type_id : new FormControl("",Validators.required),
      lead_source_id : new FormControl("",Validators.required),
      lead_campaign_id:new FormControl(""),
      lead_status:new FormControl(""),
      follow_up_time: new FormControl(""),
      remark: new FormControl(""),
      lost_reason: new FormControl(""),
      lost_remark : new FormControl(""),
      instagram_handle: new FormControl(""),
      lead_type_name:new FormControl(),
      referrer_type:new FormControl(""),
      lead_source_type:new FormControl(),
      referrer_id:new FormControl(),
    });
    this.leadStatusUpdateForm = this.formBuilder.group({
      lead_status : new FormControl("",Validators.required),
      follow_up_time : new FormControl(""),
      remark: new FormControl(""),
      lost_reason: new FormControl(""),
      lost_remark : new FormControl("")
    });
    this.leadquestionnaire = this.formBuilder.group({
      customer_name : new FormControl(""),
      phone : new FormControl(""),
      society:new FormControl(""),
      project_name: new FormControl(""),
      city : new FormControl(""),
      location: new FormControl(""),
      project_type :new FormControl(""),
      accomodation_type: new FormControl(""),
      home_type: new FormControl(""),
      scope_of_work : new FormControl(""),
      // scope_of_work : new FormArray([]),
      // remarks_of_sow: new FormControl(),
      visit_ec_date:new FormControl(""),
      site_measurement_date:new FormControl(""),
      site_measurement_required:new FormControl(""),
      visit_ec:new FormControl(""),
      budget_value: new FormControl(),
      home_value : new FormControl(),
      possession_status :new FormControl(""),
      possession_status_date:new FormControl(""),
      have_homeloan: new FormControl(""),
      purpose_of_property:new FormControl(""),
      call_back_day: new FormControl(""),
      call_back_time: new FormControl(""),
      intended_date: new FormControl(""),
      have_floorplan: new FormControl(""),
      lead_generator: new FormControl(""),
      lead_source:new FormControl(""),
      lead_floorplan:new FormControl(""),
      additional_comments :new FormControl(""),
      ownerable_type : new FormControl('Lead'),
      user_id : new FormControl(localStorage.getItem('userId')),
      ownerable_id : new FormControl(),
      type_of_space:new FormControl(),
      status_of_property:new FormControl(),
      project_commencement_date:new FormControl(),
      address_of_site:new FormControl(),
      layout_and_photographs_of_site:new FormControl(),
      area_of_site:new FormControl(),
      new_society_value:new FormControl(),
      new_locality_value:new FormControl(),
      new_city_value: new FormControl(),
      good_time_to_call:new FormControl(),
      building_crawler_id: new FormControl()
    });

    this.inviteChampionForm = this.formBuilder.group({
      name : new FormControl("",[Validators.required]),
      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
              Validators.required]),
      contact : new FormControl("",[Validators.required]),
      parent_id : new FormControl(""),
      champion_level: new FormControl("",[Validators.required]),
      user_type:new FormControl("arrivae_champion")
    });
    
    this.getLeadCountForAgent();
    this.getLeadPoolList();
    this.changeShowStatus('offline');
    this.getCitiesForQuestionnaire();
    // this.simpleTimer.newTimer('59sec',59);
    // this.subscribeTimer0();
    this.getReferListForSelect();
    // document.getElementById("socitybuilding2").style.display = 'none';
  }

  /*Call end points*/
  getReferListForSelect(){
    this.salesService.getReferListForSelect(this.user_id).subscribe(
    res=>{
      
      this.lead_referrer_list = res['referral_roles'];


    },
    err=>{

    })
    this.staticFields = [{
      "attr_name": "name",
      "attr_type": "text_field",
      "attr_data_type": "string",
      "attr_value":"string",
      "required":true
      },{
          "attr_name": "relation",
          "attr_type": "text_field",
          "attr_data_type": "string",
          "attr_value":"string",
          "required":true
      },{
        "attr_name": "contact",
        "attr_type": "text_field",
        "attr_data_type": "string",
        "attr_value":"string",
        "required":true
      }];
  }

  getLeadCountForAgent() {
    this.loaderService.display(true);
    this.csagentService.getLeadCountForAgent(this.agentID).subscribe(
      res => {
        Object.keys(res).map((key)=>{ res= res[key];});
        this.userAgentDetails = res;
         this.loaderService.display(false);
      },
      err => {
        
         this.loaderService.display(false);
      }
    );
  }
  lead_types;
  lead_sources;
  lead_campaigns;
  leadTypeCustomerId;
  getLeadPoolList(){
     this.loaderService.display(true);
    this.csagentService.getLeadPoolList().subscribe(
      res => {
        this.lead_types = res['lead_types'];
        for(var i=0;i<this.lead_types.length;i++){
          if(this.lead_types[i].name=='customer'){
            this.leadTypeCustomerId =this.lead_types[i].id;
            break;
          }
        }
        this.lead_campaigns=res['lead_campaigns'];
        this.lead_sources = res['lead_sources'];
         this.loaderService.display(false);
      },
      err => {
        
         this.loaderService.display(false);
      }
     );

  }

  showLeadStatusDropdown(val){
    if(val==this.leadTypeCustomerId){
      document.getElementById('addLeadStatusDropdown').classList.add('d-none');
    } else {
      document.getElementById('addLeadStatusDropdown').classList.remove('d-none');
    }
  }
  sitemeasurement(valuforsite){
    
    if(valuforsite){
      this.selectstatusforsitemeasurement = valuforsite;
      this.leadquestionnaire.controls['site_measurement_date'].setValidators([Validators.required]);
    } else {
      this.selectstatusforsitemeasurement = false;
      this.leadquestionnaire.controls['site_measurement_date'].clearValidators();
      this.leadquestionnaire.controls['site_measurement_date'].setValue("");

    }
  }

  ec(valuae){
    
    if(valuae){
      this.selectstatusforec = valuae;
      this.leadquestionnaire.controls['visit_ec_date'].setValidators([Validators.required]);
    } else {
      this.selectstatusforec = false;
      this.leadquestionnaire.controls['visit_ec_date'].clearValidators();
      this.leadquestionnaire.controls['visit_ec_date'].setValue("");
    }
  }
  vaale:any;
  changebuilding(value) {
    if (typeof value == "string"){
      this.vaale=value;
    }
    else{
      this.vaale= value.building_name;
    }

    if(this.vaale == "Others")
    {
      // document.getElementById("societybuildingCs").style.display = 'block';
      this.leadquestionnaire.controls['new_society_value'].setValue(this.retainAddress);
    }
    else
    {
      
      const societyId = value.id;
      this.leadquestionnaire.controls['society'].setValue(value.building_name);
      this.leadquestionnaire.controls['building_crawler_id'].setValue(societyId);
      this.leadquestionnaire.controls['new_society_value'].setValue("");
      this.leadquestionnaire.controls['location'].setValue(value.locality);
      this.leadquestionnaire.controls['new_locality_value'].setValue("");
      this.localityChangeValue='';
      this.getSocietyWebData(societyId);
    }
    this.ref.detectChanges()
 }

  addLeadDetails;
  addLeadFormSubmit(data) {
    this.loaderService.display(true);
    //$('#addNewLeadModal').modal('hide');
    data['created_by'] = localStorage.getItem('userId');
    if(data.lead_type_id==this.leadTypeCustomerId){
      data['lead_status'] = 'claimed';
    }
    data['by_csagent'] = true;
    if(this.addLeadForm.controls['lead_type_name'].value=='designer'){
      data['lead_cv']=this.basefile;
    }
    var obj = {
      lead:data
    }
    this.leadService.addLead(obj)
        .subscribe(
          res => {
            
            Object.keys(res).map((key)=>{ res= res[key];});
            this.addLeadDetails =  res;
            this.addLeadDetails['questionnaire_type']='add_lead';
            this.addLeadForm.reset();
            this.basefile = undefined;
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Lead created successfully !!";
            if(res['lead_type']=='customer'){
              document.getElementById('addLeadForm').style.display = 'none';
              document.getElementById('addleadquestionnaireForm').style.display= 'block';
            } else {
              document.getElementById('addLeadStatusDropdown').classList.add('d-none');
              document.getElementById('addleadFormdatetime').setAttribute('style','display: none');
              document.getElementById('addleadFormlostremark').setAttribute('style','display: none');
              document.getElementById('addleadFormlostReason').setAttribute('style','display: none');
              if(document.getElementById('addleadFormRemark')){
                document.getElementById('addleadFormRemark').setAttribute('style','display: none');
              }
              $('#addNewLeadModal').modal('hide');
            }
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 15000);
          },
          err => {
            this.loaderService.display(false);
            this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 15000);
          }
        );
  }
  closeModalQues(msg?){
    this.changeShowStatus('offline');
    this.getLeadCountForAgent();
    this.addLeadDetails = undefined;
    this.city_others = undefined;
    document.getElementById('addLeadForm').style.display = 'block';
    document.getElementById('addleadquestionnaireForm').style.display= 'none';
    $('#addNewLeadModal').modal('hide');
    if(msg){
      this.successalert = true;
      this.successMessage = msg;
      setTimeout(function() {
        this.successalert = false;
      }.bind(this), 10000);
    }
  }


  callbackTimer(status,leadID) {
   this.leadService.refreshLeads(this.agentID,leadID,this.leadDetails).subscribe(
        res => {
          if(res!=null){
            Object.keys(res).map((key)=>{ res= res[key];});
            this.activeLeadDataForAgent = res;
            
          } else {
            this.agentStatusChange('',true);
          }
        },
        err => {
        }
    );
  }

  intervalId = null;
  ticks =0;
  ticktimer;
  hello;

  changeShowStatus(status){
    this.loaderService.display(true);
    clearTimeout(this.x);
    clearTimeout(this.y);

    if(status == 'online') {
      this.showStatus = true;
      this.agentStatus=2;
    }
    if(status == 'offline') {
      this.agentStatus=1;
      this.showStatus = false;
      document.getElementById('onlineText').classList.add('notactivestatusText');
      document.getElementById('offlineText').classList.remove('notactivestatusText');
      document.getElementById('statusSwitch').style.background = 'red';
      this.getLeadCountForAgent();
      if(this.ticks !=0){
        this.hello.unsubscribe();
      }
      if(this.hello != undefined){
        this.hello.unsubscribe();
      }
    }
    this.csagentService.changeStatusToOnline(this.agentID,status).subscribe(
        res => {
          this.loaderService.display(false);
          if(res != null){
            Object.keys(res).map((key)=>{ res= res[key];});
            this.activeLeadDataForAgent = res;
            this.leadDetails = res;
          }
          else {
            this.activeLeadDataForAgent = undefined;
          }
          if(status=='online'){
            this.startTimer2();
          }

        },
        err => {
          this.loaderService.display(false);
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

  viewLeadDetails(id) {
    this.leadService.viewLeadDetails(id)
      .subscribe(
          lead => {
            this.leadDetails = lead;
            Object.keys(lead).map((key)=>{ this.leadDetails= lead[key];});
            this.leadEmail = this.leadDetails.email;
            this.leadContact =this.leadDetails.contact;
            this.leadName = this.leadDetails.name;
            this.leadPincode = this.leadDetails.pincode
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
      document.getElementById('remarkChange').setAttribute('style','display: block');
      this.leadStatusUpdateForm.controls['follow_up_time'].setValidators([Validators.required]);
      this.leadStatusUpdateForm.controls['follow_up_time'].updateValueAndValidity();
      

    } else {
      document.getElementById('datetime').setAttribute('style','display: none');
      document.getElementById('remarkChange').setAttribute('style','display: none');
      this.leadStatusUpdateForm.controls['follow_up_time'].clearValidators();
      this.leadStatusUpdateForm.controls['follow_up_time'].updateValueAndValidity();
        }
    if(value == 'lost') {
      
      document.getElementById('lostreason').setAttribute('style','display: block');
      this.leadStatusUpdateForm.controls['lost_reason'].setValidators([Validators.required]);
      this.leadStatusUpdateForm.controls['lost_reason'].updateValueAndValidity();
     
    } else {
      document.getElementById('lostreason').setAttribute('style','display: none');
      this.leadStatusUpdateForm.controls['lost_reason'].clearValidators();
      this.leadStatusUpdateForm.controls['lost_reason'].updateValueAndValidity();
    }
    if(value=='qualified' && this.activeLeadDataForAgent.lead_type =='customer'){
      this.setFormFieldRequired(this.leadquestionnaire);
    } else {
      this.removeFormFieldRequired(this.leadquestionnaire);
    }
    
  }

  userQuestionnaireDetails;
  getUserQuestionnaireDetails(leadId,status){
      this.loaderService.display(true);
      this.leadService.getRecordNotesQuestionnaire(leadId).subscribe(
        res=>{
          Object.keys(res).map((key)=>{ res= res[key];});
          this.userQuestionnaireDetails = res;

          if(this.userQuestionnaireDetails[0]){
            this.checkedList = this.userQuestionnaireDetails[0].lead_questionaire_items;
          }else{
            this.checkedList=[];
          }
          this.cityChangeValue='';
          this.localityChangeValue='';
          this.vaale='';
          this.localityWebData=null;
          this.leadItemscheckedListNames = this.checkedList.map(element => element.name.toLowerCase());
          if(this.userQuestionnaireDetails!= null && this.userQuestionnaireDetails.length != 0){
            this.setQuestionnaireDetails(this.userQuestionnaireDetails[0]);
          } else {
            this.societyList = [];
            this.selectstatusforec=false;
            this.selectstatusforsitemeasurement=false;
            this.alternateNumberMasterForm.setControl('alternate_contacts', this.formBuilder.array([]));
            this.searchname="";
            this.leadquestionnaire.reset();
            this.leadquestionnaire.controls['customer_name'].setValue("");
            this.leadquestionnaire.controls['phone'].setValue("");
            this.leadquestionnaire.controls['society'].setValue("");
            this.leadquestionnaire.controls['project_name'].setValue("");
            this.leadquestionnaire.controls['home_type'].setValue("");
            this.leadquestionnaire.controls['city'].setValue("");
            this.leadquestionnaire.controls['location'].setValue("");
            this.leadquestionnaire.controls['project_type'].setValue(""),
            this.leadquestionnaire.controls['accomodation_type'].setValue("");
            this.leadquestionnaire.controls['visit_ec_date'].setValue("");
            this.leadquestionnaire.controls['site_measurement_date'].setValue("");
            this.leadquestionnaire.controls['site_measurement_required'].setValue("");
            this.leadquestionnaire.controls['visit_ec'].setValue("");
            this.leadquestionnaire.controls['budget_value'].setValue("");
            this.leadquestionnaire.controls['home_value'].setValue("");
            this.leadquestionnaire.controls['possession_status'].setValue("");
            this.leadquestionnaire.controls['possession_status_date'].setValue("");
            this.leadquestionnaire.controls['have_homeloan'].setValue("");
            this.leadquestionnaire.controls['purpose_of_property'].setValue("");
            this.leadquestionnaire.controls['call_back_day'].setValue("");
            this.leadquestionnaire.controls['call_back_time'].setValue("");
            this.leadquestionnaire.controls['intended_date'].setValue("");
            this.leadquestionnaire.controls['have_floorplan'].setValue("");
            this.leadquestionnaire.controls['lead_generator'].setValue("");
            this.leadquestionnaire.controls['lead_source'].setValue("");
            this.leadquestionnaire.controls['have_floorplan'].setValue("");
            this.leadquestionnaire.controls['lead_floorplan'].setValue("");
            this.leadquestionnaire.controls['additional_comments'].setValue("");
            this.leadquestionnaire.controls['ownerable_type'].setValue('Lead');
            this.leadquestionnaire.controls['user_id'].setValue(localStorage.getItem('userId'));
            this.leadquestionnaire.controls['ownerable_id'].setValue("");
            this.leadquestionnaire.controls['type_of_space'].setValue("");
            this.leadquestionnaire.controls['status_of_property'].setValue("");
            this.leadquestionnaire.controls['project_commencement_date'].setValue("");
            this.leadquestionnaire.controls['address_of_site'].setValue("");
            this.leadquestionnaire.controls['layout_and_photographs_of_site'].setValue("");
            this.leadquestionnaire.controls['area_of_site'].setValue("");
            this.leadquestionnaire.controls['new_society_value'].setValue("");
            this.leadquestionnaire.controls['new_city_value'].setValue("");
            this.leadquestionnaire.controls['good_time_to_call'].setValue("");  
            this.leadquestionnaire.controls['building_crawler_id'].setValue("");
        
            this.hideAlternateNumberButton = false;;
            
            if(document.getElementById('Vpossesiondate')){
              document.getElementById('Vpossesiondate').style.display='none';
            }
            if(document.getElementById('floorplanQuestionnaire1')){
              document.getElementById('floorplanQuestionnaire1').style.display = 'none';
            }
          }
          this.budget();
          this.budgetcaluclatototal();
          this.selectedMoment.setDate(this.selectedMoment.getDate() );
          this.searchstatus=true;
          
          this.ref.detectChanges();
          this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
        }
       );
    }
    retainAddress;
    retainLocality;
    retainCity;
    setQuestionnaireDetails(note_records){
    
      this.searchname="";
      this.leadquestionnaire.controls['new_locality_value'].setValue('');
      this.leadquestionnaire.controls['new_society_value'].setValue('');
      this.alternateNumberMasterForm.setControl('alternate_contacts', this.formBuilder.array([]));
      if(note_records!=null){
        if(note_records.customer_name!= null){
          this.leadquestionnaire.controls['customer_name'].setValue(note_records.customer_name);
        } else {
          this.leadquestionnaire.controls['customer_name'].setValue("");
          this.leadquestionnaire.controls['intended_date'].setValue(note_records.intended_date);
 
        }
        if(note_records.phone!= null){
          this.leadquestionnaire.controls['phone'].setValue(note_records.phone);
        } else {
          this.leadquestionnaire.controls['phone'].setValue("");
        }
          this.leadquestionnaire.controls['project_name'].setValue(note_records.project_name);

          if(note_records.city !=null){
            this.leadquestionnaire.controls['city'].setValue(note_records.city);
            
          } 
    
          // **getting loclity and building details based on city**
          
          if( this.leadquestionnaire.controls['city'].value){
            
            
            if(this.citiesForQuestionnaire.filter(city=>{return city.name.toLowerCase() == this.leadquestionnaire.controls['city'].value.toLowerCase()}).length==0){
              this.leadquestionnaire.controls['city'].setValue('Others');
              if(!note_records.new_city_value){
                this.leadquestionnaire.controls['new_city_value'].setValue(note_records.city);
              }else{
                this.leadquestionnaire.controls['new_city_value'].setValue(note_records.new_city_value);
              }
              this.getSocietyList( this.leadquestionnaire.controls['new_city_value'].value,note_records);
              document.getElementById("citybuilding").style.display = 'block';
              if(!note_records.new_city_value){
                this.retainCity = note_records.city;
              }
              else{
                this.retainCity = note_records.new_city_value;
              }
              this.cityChangeValue='Others';
            }
            else{
              this.getSocietyList(this.leadquestionnaire.controls['city'].value,note_records);
            }
          }else{
              if(note_records.location){
                this.leadquestionnaire.controls['location'].setValue(note_records.location);
                if(!this.leadquestionnaire.controls['location'].value){
                  
                  this.leadquestionnaire.controls['location'].setValue('');
                  document.getElementById("localitybuildingCs").style.display = 'none';
                }
                else if(this.societyList.filter(locality=>{return locality.locality == this.leadquestionnaire.controls['location'].value}).length==0){
                // if(this.leadquestionnaireForm.controls['location'].value == 'Others'){
                  this.leadquestionnaire.controls['location'].setValue('Others');
                  if(note_records.new_locality_value){
                    this.leadquestionnaire.controls['new_locality_value'].setValue(note_records.new_locality_value);
                  }else{
                    this.leadquestionnaire.controls['new_locality_value'].setValue(note_records.location);
                  }
                  document.getElementById("localitybuildingCs").style.display = 'block';
                  if(note_records.new_locality_value){
                    this.retainLocality = note_records.new_locality_value;
                  }else{
                    this.retainLocality = note_records.location
                  }
                  this.localityChangeValue = 'Others'
                }
               }else{
                
                if( document.getElementById("localitybuildingCs")){
                  document.getElementById("localitybuildingCs").style.display = 'block';
                }
                this.leadquestionnaire.controls['location'].setValue('');
               }
              
              if(note_records.society){
                this.leadquestionnaire.controls['society'].setValue(note_records.society);
                if(!this.leadquestionnaire.controls['society'].value){
                  
                  this.leadquestionnaire.controls['society'].setValue('');
                  // document.getElementById("societybuildingCs").style.display = 'none';
                }
                else if(this.societyList.filter(society=>{return society.buiding_name == this.leadquestionnaire.controls['society'].value}).length==0){
                // if(this.leadquestionnaireForm.controls['society'].value == 'Others'){
                  this.leadquestionnaire.controls['society'].setValue('Others');
                  if(note_records.new_society_value){
                    this.leadquestionnaire.controls['new_society_value'].setValue(note_records.new_society_value);
                  }else{
                    this.leadquestionnaire.controls['new_society_value'].setValue(note_records.society);
                  }
                  if(document.getElementById("societybuildingCs")){
                  document.getElementById("societybuildingCs").style.display = 'block';
                  }
                  if(note_records.new_society_value){
                    this.retainAddress = note_records.new_society_value;
                  }else{
                    this.retainAddress = note_records.society;
                  }
                  this.vaale= 'Others';
                  
                }
                else{
                  this.leadquestionnaire.controls['building_crawler_id'].setValue(note_records.building_crawler_id);
                  this.getSocietyWebData(this.leadquestionnaire.controls['building_crawler_id'].value);
                }
              }else{
                if(document.getElementById("societybuildingCs")){
                  document.getElementById("societybuildingCs").style.display = 'none';
                }
                this.leadquestionnaire.controls['society'].setValue('');
              }
          }
          
          
          this.leadquestionnaire.controls['project_type'].setValue(note_records.project_type);
          this.leadquestionnaire.controls['accomodation_type'].setValue(note_records.accomodation_type);
          this.leadquestionnaire.controls['home_type'].setValue(note_records.home_type);
          
          this.leadquestionnaire.controls['visit_ec_date'].setValue(note_records.visit_ec_date);
          this.leadquestionnaire.controls['site_measurement_date'].setValue(note_records.site_measurement_date);
          
          if(note_records.visit_ec_date){
            this.leadquestionnaire.controls['visit_ec_date'].setValue(note_records.visit_ec_date);
            this.leadquestionnaire.controls['visit_ec'].setValue(true);
            this.selectstatusforec=true;
            this.ref.detectChanges();
          }else{
            this.selectstatusforec=false;
            if(note_records.visit_ec===null || note_records.visit_ec===''){
              this.leadquestionnaire.controls['visit_ec'].setValue(null);
            }else{
              this.leadquestionnaire.controls['visit_ec'].setValue(false);
            }
          }
          if(note_records.site_measurement_date){
            this.leadquestionnaire.controls['site_measurement_date'].setValue(note_records.site_measurement_date);
            this.leadquestionnaire.controls['site_measurement_required'].setValue(true);
            this.selectstatusforsitemeasurement = true;
          }else {
            this.selectstatusforsitemeasurement = false;
            if(note_records.site_measurement_required===null || note_records.site_measurement_required===''){
              this.leadquestionnaire.controls['site_measurement_required'].setValue(null);
            }else{
              this.leadquestionnaire.controls['site_measurement_required'].setValue(false);
            }
            
          }
          
          this.leadquestionnaire.controls['lead_source'].setValue(note_records.lead_source);
          // this.leadquestionnaire.controls['site_measurement_required'].setValue(note_records.site_measurement_required);
          // this.leadquestionnaire.controls['visit_ec'].setValue(note_records.visit_ec);
          // this.leadquestionnaire.controls['remarks_of_sow'].setValue(note_records.remarks_of_sow);
          this.leadquestionnaire.controls['possession_status'].setValue(note_records.possession_status);
          this.leadquestionnaire.controls['possession_status_date'].setValue(note_records.possession_status_date);
          this.leadquestionnaire.controls['home_value'].setValue(note_records.home_value);
          this.leadquestionnaire.controls['budget_value'].setValue(note_records.budget_value);
          this.leadquestionnaire.controls['have_homeloan'].setValue(note_records.have_homeloan);
          this.leadquestionnaire.controls['purpose_of_property'].setValue(note_records.purpose_of_property);
          this.leadquestionnaire.controls['call_back_day'].setValue(note_records.call_back_day);
          this.leadquestionnaire.controls['call_back_time'].setValue(note_records.call_back_time);
          this.leadquestionnaire.controls['intended_date'].setValue(note_records.intended_date);
          this.leadquestionnaire.controls['have_floorplan'].setValue(note_records.have_floorplan);
          this.leadquestionnaire.controls['lead_generator'].setValue(note_records.lead_generator);
          this.leadquestionnaire.controls['additional_comments'].setValue(note_records.additional_comments);
          this.leadquestionnaire.controls['have_floorplan'].setValue(note_records.have_floorplan);
          this.leadquestionnaire.controls['lead_floorplan'].setValue(note_records.lead_floorplan);
          this.leadquestionnaire.controls['type_of_space'].setValue(note_records.type_of_space);
          this.leadquestionnaire.controls['status_of_property'].setValue(note_records.status_of_property);
          this.leadquestionnaire.controls['project_commencement_date'].setValue(note_records.project_commencement_date);
          this.leadquestionnaire.controls['address_of_site'].setValue(note_records.address_of_site);
          this.leadquestionnaire.controls['layout_and_photographs_of_site'].setValue(note_records.layout_and_photographs_of_site);
          this.leadquestionnaire.controls['area_of_site'].setValue(note_records.area_of_site);
          this.leadquestionnaire.controls['new_society_value'].setValue(note_records.new_society_value);
          this.leadquestionnaire.controls['good_time_to_call'].setValue(note_records.good_time_to_call);
          if(note_records.lead.contacts.length > 1){
            let i=0;
              note_records.lead.contacts.forEach(elem =>{
            if(elem.relation != 'Customer'){
      
              this.addAlternateNumberForm();
              this.alternateNumberMasterForm.controls['alternate_contacts'].controls[i].controls['contact'].setValue(elem.contact);
              this.alternateNumberMasterForm.controls['alternate_contacts'].controls[i].controls['name'].setValue(elem.name);
              this.alternateNumberMasterForm.controls['alternate_contacts'].controls[i].controls['relation'].setValue(elem.relation);
              i++;     
            }
              });
            }else {
              this.showAlternateForm = false;
              this.hideAlternateNumberButton = false;
            }

          if(note_records.scope_of_work != null) {
            if(note_records.scope_of_work.length>0){
              this.leadquestionnaire.controls['scope_of_work'].setValue(note_records.scope_of_work[0]);
            }
          }

        if(note_records.have_floorplan == 'Yes'){
          document.getElementById('floorplanQuestionnaire1').style.display = 'block';
        } if(note_records.have_floorplan == 'No'){
          document.getElementById('floorplanQuestionnaire1').style.display = 'none';
        }
        // if(note_records.possession_status=='Awaiting Possession'){
        //   document.getElementById('Vpossesiondate').style.display = 'block';
        // }
        // else if(note_records.possession_status=='Possession Taken'){
        //   document.getElementById('Vpossesiondate').style.display = 'none';
        // }else if(!note_records.possession_status){
        //   document.getElementById('Vpossesiondate').style.display = 'none';
        // }
    }else
    {
        this.selectstatusforec=false;
        this.selectstatusforsitemeasurement=false;
        this.vaale='';
        this.localityChangeValue='';
        document.getElementById('Vpossesiondate').style.display = 'none';
    }
    }
selectedstatus;
  setLeadStatus1(value) {
    this.selectedstatus=value
    if(value=='follow_up') { 
      document.getElementById('addleadFormlostReason').setAttribute('style','display: none');
      document.getElementById('addleadFormdatetime').setAttribute('style','display: block');
      document.getElementById('addleadFormRemark').setAttribute('style','display: block');
    } else {
      document.getElementById('addleadFormdatetime').setAttribute('style','display: none');
      document.getElementById('addleadFormRemark').setAttribute('style','display: none');
    }
    if(value == 'lost') {
      document.getElementById('addleadFormlostReason').setAttribute('style','display: block');
    } else {
      document.getElementById('addleadFormlostReason').setAttribute('style','display: none');
    }
  }

  setFormFieldRequired(formgrp){
    formgrp.controls['society'].setValidators([Validators.required]);
    formgrp.controls['location'].setValidators([Validators.required]);
    formgrp.controls['city'].setValidators([Validators.required]);
    formgrp.controls['project_type'].setValidators([Validators.required]);
    formgrp.controls['call_back_day'].setValidators([Validators.required]);
    formgrp.controls['intended_date'].setValidators([Validators.required]);
    // formgrp.controls['pincode'].setValidators([Validators.required]);
    // formgrp.controls['call_back_time'].setValidators([Validators.required]);
    formgrp.controls['scope_of_work'].setValidators([Validators.required]);
    formgrp.controls['possession_status'].setValidators([Validators.required]);
    formgrp.controls['budget_value'].setValidators([Validators.required]);
    if(formgrp.controls['possession_status'].value=='Awaiting Possession'){
      formgrp.controls['possession_status_date'].setValidators([Validators.required]);
      formgrp.controls['possession_status_date'].updateValueAndValidity();
    } else {
      formgrp.controls['possession_status_date'].clearValidators();
      formgrp.controls['possession_status_date'].updateValueAndValidity();
    }
    if(formgrp.controls['project_type'].value=='Residential'){
      formgrp.controls['accomodation_type'].setValidators([Validators.required]);
      formgrp.controls['have_homeloan'].setValidators([Validators.required]);
      formgrp.controls['home_type'].setValidators([Validators.required]);
      formgrp.controls['home_value'].setValidators([Validators.required]);
      formgrp.controls['area_of_site'].setValidators([Validators.required]);
      formgrp.controls['type_of_space'].clearValidators();
      formgrp.controls['status_of_property'].clearValidators();
      formgrp.controls['project_commencement_date'].clearValidators();
      formgrp.controls['address_of_site'].clearValidators();
      formgrp.controls['layout_and_photographs_of_site'].clearValidators();
      formgrp.controls['area_of_site'].clearValidators();
    } else if(formgrp.controls['project_type'].value=='Offices'){
      formgrp.controls['type_of_space'].setValidators([Validators.required]);
      formgrp.controls['status_of_property'].setValidators([Validators.required]);
      formgrp.controls['project_commencement_date'].setValidators([Validators.required]);
      formgrp.controls['address_of_site'].setValidators([Validators.required]);
      formgrp.controls['layout_and_photographs_of_site'].setValidators([Validators.required]);
      formgrp.controls['area_of_site'].setValidators([Validators.required]);
      formgrp.controls['accomodation_type'].clearValidators();
      formgrp.controls['have_homeloan'].clearValidators();
      formgrp.controls['home_type'].clearValidators();
      formgrp.controls['home_value'].clearValidators();
    }

    formgrp.controls['society'].updateValueAndValidity();
    // formgrp.controls['pincode'].updateValueAndValidity();
    formgrp.controls['location'].updateValueAndValidity();
    formgrp.controls['city'].updateValueAndValidity();
    formgrp.controls['project_type'].updateValueAndValidity();
    formgrp.controls['call_back_day'].updateValueAndValidity();
    formgrp.controls['intended_date'].updateValueAndValidity();
    formgrp.controls['accomodation_type'].updateValueAndValidity();
    formgrp.controls['home_type'].updateValueAndValidity();
    formgrp.controls['scope_of_work'].updateValueAndValidity();
    formgrp.controls['have_homeloan'].updateValueAndValidity();
    formgrp.controls['possession_status'].updateValueAndValidity();
    formgrp.controls['home_value'].updateValueAndValidity();
    formgrp.controls['budget_value'].updateValueAndValidity();
    formgrp.controls['type_of_space'].updateValueAndValidity();
    formgrp.controls['status_of_property'].updateValueAndValidity();
    formgrp.controls['project_commencement_date'].updateValueAndValidity();
    formgrp.controls['address_of_site'].updateValueAndValidity();
    formgrp.controls['layout_and_photographs_of_site'].updateValueAndValidity();
    formgrp.controls['area_of_site'].updateValueAndValidity();
    formgrp.controls['new_society_value'].updateValueAndValidity();
    formgrp.controls['new_city_value'].updateValueAndValidity();
    formgrp.controls['good_time_to_call'].updateValueAndValidity();
    var elems=document.getElementsByClassName('hideAsteriskIcon');
    for(var i=0;i<elems.length;i++){
      elems[i].setAttribute('style','display:inline');
    }
  }
  removeFormFieldRequired(formgrp){
    formgrp.controls['society'].clearValidators();
    formgrp.controls['location'].clearValidators();
    formgrp.controls['city'].clearValidators();
    formgrp.controls['project_type'].clearValidators();
    // formgrp.controls['pincode'].clearValidators();
    formgrp.controls['call_back_day'].clearValidators();
    formgrp.controls['intended_date'].clearValidators();
    formgrp.controls['accomodation_type'].clearValidators();
    formgrp.controls['home_type'].clearValidators();
    formgrp.controls['scope_of_work'].clearValidators();
    formgrp.controls['have_homeloan'].clearValidators();
    formgrp.controls['possession_status'].clearValidators();
    formgrp.controls['possession_status_date'].clearValidators();
    formgrp.controls['home_value'].clearValidators();
    formgrp.controls['budget_value'].clearValidators();
    formgrp.controls['type_of_space'].clearValidators();
    formgrp.controls['status_of_property'].clearValidators();
    formgrp.controls['project_commencement_date'].clearValidators();
    formgrp.controls['address_of_site'].clearValidators();
    formgrp.controls['layout_and_photographs_of_site'].clearValidators();
    formgrp.controls['area_of_site'].clearValidators();
    formgrp.controls['new_society_value'].clearValidators();
    formgrp.controls['new_city_value'].clearValidators();
    formgrp.controls['good_time_to_call'].updateValueAndValidity();
    formgrp.controls['possession_status_date'].updateValueAndValidity();
    formgrp.controls['society'].updateValueAndValidity();
    formgrp.controls['location'].updateValueAndValidity();
    formgrp.controls['city'].updateValueAndValidity();
    formgrp.controls['project_type'].updateValueAndValidity();
    // formgrp.controls['pincode'].updateValueAndValidity();
    formgrp.controls['call_back_day'].updateValueAndValidity();
    formgrp.controls['intended_date'].updateValueAndValidity();
    formgrp.controls['accomodation_type'].updateValueAndValidity();
    formgrp.controls['home_type'].updateValueAndValidity();
    formgrp.controls['scope_of_work'].updateValueAndValidity();
    formgrp.controls['have_homeloan'].updateValueAndValidity();
    formgrp.controls['possession_status'].updateValueAndValidity();
    formgrp.controls['budget_value'].updateValueAndValidity();
    formgrp.controls['home_value'].updateValueAndValidity();
    formgrp.controls['type_of_space'].updateValueAndValidity();
    formgrp.controls['status_of_property'].updateValueAndValidity();
    formgrp.controls['project_commencement_date'].updateValueAndValidity();
    formgrp.controls['address_of_site'].updateValueAndValidity();
    formgrp.controls['layout_and_photographs_of_site'].updateValueAndValidity();
    formgrp.controls['area_of_site'].updateValueAndValidity();
    formgrp.controls['new_society_value'].updateValueAndValidity();
    formgrp.controls['new_city_value'].updateValueAndValidity();
    var elems=document.getElementsByClassName('hideAsteriskIcon')
    for(var i=0;i<elems.length;i++){
      elems[i].setAttribute('style','display:none');
    }
  }

  leadContact;
  leadEmail;
  leadName;
  leadPincode;
  leadInstagramhandle;
  lead_designerCV;

  attached_files:any = []
  attachFile(event){
    // 
    var fileReader;
    var base64;
    for (let file of event.target.files) {

        fileReader = new FileReader();
        fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          // this.basefile = base64.result;
          var file_obj = {
            "image": base64.result,
            "file_name": file.name
          }
          this.attached_files.push(file_obj);
          // this.paymentForm.patchValue({image: this.basefile})
        };

      fileReader.readAsDataURL(file);
    }
  }
  response_status;
  // city_others;
  updateStatus(leadStatusData,questionnaireFormData,id) {
    questionnaireFormData['lead_questionaire_items_attributes']= this.checkedList ;
    if(this.leadEmail=='' || this.leadEmail==undefined || 
      (this.leadEmail!='' && this.leadEmail!=undefined && this.checkEmail(this.leadEmail))){
    

      if( leadStatusData.lead_status == 'qualified'  && this.leadDetails.lead_type == 'customer' && (this.leadPincode=='' || this.leadPincode==null)){
        this.errorMessage='Pincode is mandatory';
        this.erroralert = true;
        setTimeout(function() {
              this.erroralert = false;
            }.bind(this), 10000);
      } else {
        if(this.leadStatusUpdateForm.valid){
          
          if(leadStatusData.lead_status!='qualified' || (leadStatusData.lead_status=='qualified' ))
          {
            if(!this.showAlternateForm || (this.showAlternateForm )){
            document.getElementById('chnagestatusDropDown').classList.remove('inputBorder');
            leadStatusData['email'] = this.leadEmail;
            leadStatusData['contact']= this.leadContact;
            leadStatusData['name']=this.leadName;
            leadStatusData['pincode']=this.leadPincode;
            leadStatusData['instagram_handle']=this.leadInstagramhandle;
            leadStatusData['lead_cv']=this.basefile;
            if(!this.showAlternateForm || (this.showAlternateForm)){ 
              leadStatusData['alternate_contacts']=this.alternateNumberMasterForm.value.alternate_contacts;
              leadStatusData['intended_date']=this.leadquestionnaire.value.intended_date;
              leadStatusData['possession_status_date']=this.leadquestionnaire.value.possession_status_date;
 
            }
            this.loaderService.display(true);
            this.leadStatusUpdateForm.controls['lead_status'].setValue("");
            this.leadService.updateLeadStatus(leadStatusData,id).subscribe(
                res => {
                    this.response_status = res;
                    document.getElementById('lostremark').setAttribute('style','display: none');
                    document.getElementById('lostreason').setAttribute('style','display: none');
                    document.getElementById('datetime').setAttribute('style','display: none');
                    document.getElementById('remarkChange').setAttribute('style','display: none');
                    if(document.getElementById('cv_file_input')){
                      (<HTMLInputElement>document.getElementById('cv_file_input')).value="";
                    }
                    this.leadquestionnaire.controls['ownerable_id'].setValue(id);
                    this.leadquestionnaire.controls['customer_name'].setValue(this.leadName);
                    this.leadquestionnaire.controls['phone'].setValue(this.leadDetails.contact);
                    questionnaireFormData['ownerable_id'] = id;
                    questionnaireFormData['customer_name'] = this.leadName;
                    questionnaireFormData['phone'] = this.leadDetails.contact;
                    questionnaireFormData['scope_of_work']=[questionnaireFormData['scope_of_work']];
                    
      
                    if(questionnaireFormData['project_type']=='Offices'){
                      questionnaireFormData.have_homeloan=null;
                      questionnaireFormData.home_type = null;
                      questionnaireFormData.accomodation_type=null;
                      questionnaireFormData.home_value=null;
                      questionnaireFormData.have_floorplan = null;
                      questionnaireFormData['lead_floorplan']=null;
                    } else if (questionnaireFormData['project_type']=='Residential') {
                      questionnaireFormData.type_of_space=null;
                      questionnaireFormData.status_of_property=null;
                      questionnaireFormData.project_commencement_date=null;
                      questionnaireFormData.address_of_site=null;
                      questionnaireFormData.layout_and_photographs_of_site=null;
                      // questionnaireFormData.area_of_site=null;
                      questionnaireFormData['lead_floorplan'] = this.questionnaire_floorplan_basefile;


                    }
                    if(questionnaireFormData['project_type']=='Offices' && questionnaireFormData['layout_and_photographs_of_site']=='Yes'){
                      questionnaireFormData['site_layouts']=this.attached_files;
                    }
                    if(this.leadquestionnaire.controls['city'].value == 'Other'){
                      this.leadquestionnaire.controls['city'].setValue(this.city_others);
                      questionnaireFormData['city']=this.city_others;
                    }
                    $('#leadDetailsModal').modal('hide');
                    if(questionnaireFormData['lead_floorplan'] == '/images/original/missing.png'){
                      questionnaireFormData['lead_floorplan'] = "";
                    }
                    questionnaireFormData['possession_status_date'] = $('#startDateCs').val();
                    this.leadService.postRecordNotesQuestionnaire(id,questionnaireFormData).subscribe(
                        res => {
                           
                          this.leadquestionnaire.reset();
                          this.leadStatusUpdateForm.reset();
                          this.leadStatusUpdateForm.controls['lead_status'].setValue("");
                          this.loaderService.display(false);

                          this.leadEmail = undefined;
                          this.leadContact = undefined;
                          this.leadName = undefined;
                          this.leadPincode = undefined;
                          this.city_others = undefined;
                          this.questionnaire_floorplan_basefile = undefined;
                          this.floorplan_attachment_file = undefined;
                          this.attached_files = [];
                          document.getElementById('addLeadForm').style.display = 'block';
                          document.getElementById('addleadquestionnaireForm').style.display= 'none';
                            this.successalert = true;
                            this.successMessage = "Details Updated successfully !!";
                             setTimeout(function() {
                                   this.successalert = false;
                              }.bind(this), 20000);
                          
                          clearTimeout(this.y);
                          document.getElementById('timer1').innerHTML = 1 + ":" + '00';
                          var presentTime = document.getElementById('timer').innerHTML;
                          clearTimeout(this.x);
                          document.getElementById('timer').innerHTML = 20 + ":" + '00';
                          this.agentStatusChange('',false);
                          if(document.getElementById('floorplan_file_input')){
                            (<HTMLInputElement>document.getElementById('floorplan_file_input')).value="";
                          }
                          this.alternateNumberMasterForm.setControl('alternate_contacts', this.formBuilder.array([]));
                        },
                        err => {
                           this.erroralert = true;
                           this.loaderService.display(false);
                          this.errorMessage = JSON.parse(err['_body']).message;
                          setTimeout(function() {
                              this.erroralert = false;
                            }.bind(this), 10000);
                        }
                      );
                },
                err => {
                   
                  this.loaderService.display(false);                  
                  document.getElementById('lostremark').setAttribute('style','display: none');
                  document.getElementById('datetime').setAttribute('style','display: none');
                  document.getElementById('remarkChange').setAttribute('style','display: none');
                   if(JSON.parse(err['_body']).message == 'Your form was rejected because this lead was qualified by someone before you submitted the form.'){
                     // $('#leadDetailsModal').modal('hide');
                     this.closeModalForUnprocessable();
                     this.unassignedLead(this.leadDetails.id);
                         this.erroralert = true;
                           
                          this.errorMessage = JSON.parse(err['_body']).message;
                          setTimeout(function() {
                              this.erroralert = false;
                            }.bind(this), 10000);

                      
                   }
                   else{
                     this.loaderService.display(false);
                     this.successalert = true;
                      this.successMessage = "Status updated successfully !!";
                      setTimeout(function() {
                           this.successalert = false;
                      }.bind(this), 2000);
                   }
                  //this.viewLeadDetails(id);
                }
            )
          }
          }
        }
        if(!this.leadStatusUpdateForm.valid){
          document.getElementById('chnagestatusDropDown').classList.add('inputBorder');
        }
      }
    } else {
      this.erroralert =true;
      this.errorMessage = 'Email should be in proper format.';
      setTimeout(function() {
           this.erroralert = false;
      }.bind(this), 10000);
    }
    this.localityWebData=null;
  }
   abd;
  reasonForLostDropdownChange(val){
      this.abd=val;
      if(val=='low_budget'||val=='non_serviceable_area'||val=='out_of_scope'||val=='general_inquiry/not_interested'||val=='language_barrier'||val=='already_done_with_other_vendor'||val=='others')
      {
        document.getElementById('addleadFormlostremark').setAttribute('style','display:block');
        this.addLeadForm.controls['lost_remark'].setValidators([Validators.required]);
      } else {
        if(document.getElementById('addleadFormlostremark'))
          document.getElementById('addleadFormlostremark').setAttribute('style','display:none');
          this.addLeadForm.controls['lost_remark'].setValue("");
          this.addLeadForm.controls['lost_remark'].validator=null;
      }
      this.addLeadForm.controls['lost_remark'].updateValueAndValidity();
    }
    abc;
  reasonForLostDropdownChange2(val){
      this.abc=val;
      if(val=='low_budget'||val=='non_serviceable_area'||val=='out_of_scope'||val=='general_inquiry/not_interested'||val=='language_barrier'||val=='already_done_with_other_vendor'||val=='others')
      {
        document.getElementById('lostremark').setAttribute('style','display:block');
        this.addLeadForm.controls['lost_remark'].setValidators([Validators.required]);
      } else {
        if(document.getElementById('lostremark'))
          document.getElementById('lostremark').setAttribute('style','display:none');
          this.addLeadForm.controls['lost_remark'].setValue("");
          this.addLeadForm.controls['lost_remark'].validator=null;
      }
      this.addLeadForm.controls['lost_remark'].updateValueAndValidity();
    }

  
  possesionStatusSelected(val,formName) {
    if(val == 'Awaiting Possession' && formName=='leadQuestionnaire') {
      document.getElementById('Vpossesiondate').style.display = 'block';
      if(this.leadStatusUpdateForm.controls['lead_status'].value=='qualified'){
        this.leadquestionnaire.controls['possession_status_date'].setValidators([Validators.required]);
        this.leadquestionnaire.controls['possession_status_date'].updateValueAndValidity();
      } else {
        this.leadquestionnaire.controls['possession_status_date'].clearValidators();
        this.leadquestionnaire.controls['possession_status_date'].updateValueAndValidity();
      }
    }
    if(val =='Possession Taken' && formName=='leadQuestionnaire') {
      document.getElementById('Vpossesiondate').style.display = 'none';
      this.leadquestionnaire.controls['possession_status_date'].setValue(undefined);
      this.leadquestionnaire.controls['possession_status_date'].clearValidators();
      this.leadquestionnaire.controls['possession_status_date'].updateValueAndValidity();
    }
  }

  Details(){
      if($(".addClass").hasClass("hideClass"))
      {
        $(".addClass").removeClass("hideClass");
        $(".addClass1").addClass("hideClass");
        $(".upload1").removeClass("actBtn");
        $(".upload0").addClass("actBtn");
      }
     else
      {
        $(".addClass1").addClass("hideClass");
        $(".upload1").removeClass("actBtn");
        $(".upload0").addClass("actBtn");
      }
   }
  closeModalForUnprocessable(){
    if($(".addClass").hasClass("hideClass"))
     {
       $(".addClass").removeClass("hideClass");
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
     }
    else
     {
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
     }
       clearTimeout(this.x);
       this.markLeadEscalated(this.leadDetails.id,'modal close before timer completion');
       this.unassignedLead(this.leadDetails.id);
       $('#leadDetailsModal').modal('hide');
      document.getElementById('timer').innerHTML = 20 + ":" + '00';
      clearTimeout(this.y);
      document.getElementById('timer1').innerHTML = 1 + ":" + '00';
      this.leadquestionnaire.reset();
      this.leadStatusUpdateForm.reset();
      this.city_others ="";
      this.agentStatusChange('You are offline.',false);
      if(document.getElementById('floorplan_file_input')){
        (<HTMLInputElement>document.getElementById('floorplan_file_input')).value="";
      }
      if(document.getElementById('cv_file_input')){
        (<HTMLInputElement>document.getElementById('cv_file_input')).value="";
      }
      if(document.getElementById('datetime')){
        document.getElementById('datetime').setAttribute('style','display: none');
      }
      if(document.getElementById('remarkChange')){
        document.getElementById('remarkChange').setAttribute('style','display: none');
      }
      if(document.getElementById('lostremark')){
        document.getElementById('lostremark').setAttribute('style','display: none');
      }


  }

  closeModal(){
    if($(".addClass").hasClass("hideClass"))
     {
       $(".addClass").removeClass("hideClass");
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
     }
    else
     {
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
     }
    if(confirm('Are you sure you want to close the modal? If you close the modal the lead will be unassigned.')== true) {
       clearTimeout(this.x);
       this.markLeadEscalated(this.leadDetails.id,'modal close before timer completion');
       this.unassignedLead(this.leadDetails.id);
       $('#leadDetailsModal').modal('hide');
      document.getElementById('timer').innerHTML = 20 + ":" + '00';
      clearTimeout(this.y);
      document.getElementById('timer1').innerHTML = 1 + ":" + '00';
      this.leadquestionnaire.reset();
      this.leadStatusUpdateForm.reset();
      this.city_others ="";
      this.agentStatusChange('You are offline.',false);
      if(document.getElementById('floorplan_file_input')){
        (<HTMLInputElement>document.getElementById('floorplan_file_input')).value="";
      }
      if(document.getElementById('cv_file_input')){
        (<HTMLInputElement>document.getElementById('cv_file_input')).value="";
      }
      if(document.getElementById('datetime')){
        document.getElementById('datetime').setAttribute('style','display: none');
      }
      if(document.getElementById('remarkChange')){
        document.getElementById('remarkChange').setAttribute('style','display: none');
      }
      if(document.getElementById('lostremark')){
        document.getElementById('lostremark').setAttribute('style','display: none');
      }
    }
  }

  fpQuestionnaireSelected(val,elemId){
    if(val == 'yes' && elemId=='floorplanQuestionnaire'){
      document.getElementById('floorplanQuestionnaire').style.display = 'block';
    } else {
      document.getElementById('floorplanQuestionnaire').style.display = 'none';
      this.floorplan_attachment_file = undefined;
      this.questionnaire_floorplan_basefile = undefined;
    }
    if(val == 'yes' && elemId=='floorplanQuestionnaire1'){
      document.getElementById('floorplanQuestionnaire1').style.display = 'block';
    } else if(elemId=='floorplanQuestionnaire1'){
      document.getElementById('floorplanQuestionnaire1').style.display = 'none';
      this.floorplan_attachment_file = undefined;
      this.questionnaire_floorplan_basefile = undefined;
    }
  }

  questionnaire_floorplan_basefile: any;
  floorplan_attachment_file:any;

  onQuestionnaireFloorplanChange(event){

    this.questionnaire_floorplan_basefile = undefined;
    this.floorplan_attachment_file = event.srcElement.files[0];
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(this.floorplan_attachment_file.name)[1];
    var fileReader = new FileReader();
    var base64;
      fileReader.onload = (fileLoadedEvent) => {
        base64 = fileLoadedEvent.target;
        this.questionnaire_floorplan_basefile = base64.result;
      };
    
    fileReader.readAsDataURL(this.floorplan_attachment_file);

  }

  agentStatus=1;
  onchange(event){
    if(event.value==1){
      this.agentStatus =1;
      document.getElementById('onlineText').classList.add('notactivestatusText');
      document.getElementById('offlineText').classList.remove('notactivestatusText');
      document.getElementById('statusSwitch').style.background = 'red';
      this.changeShowStatus('offline');
    }
    if(event.value==2){
      this.agentStatus=2;
      document.getElementById('onlineText').classList.remove('notactivestatusText');
      document.getElementById('offlineText').classList.add('notactivestatusText');
      document.getElementById('statusSwitch').style.background = '#2ed2bb';
      this.changeShowStatus('online');
    }
  }

  // /document.getElementById('timer').innerHTML = 20 + ":" + 00;
  x;
  myVar;
  y;
  timervar;
  startTimer1(parentThis?) {
    var presentTime = document.getElementById('timer').innerHTML;

    var timeArray = presentTime.split(/[:]+/);
    var m = <any>timeArray[0];
    var k=<any>timeArray[1] - 1;
    var s;
      s = this.checkSecond(k);

    if(s==59){m=m-1}
    //if(m<0){alert('timer completed')}
     this.myVar = m + ":" + s;
    document.getElementById('timer').innerHTML = this.myVar;
    if(m<=0 && (s==0|| s=='00')){
      $('#leadDetailsModal').modal('hide');
      this.unassignedLead(this.leadDetails.id);
        this.leadService.refreshLeads(this.agentID,'','').subscribe(
          res => {
            if(res!=null){
              this.activeLeadDataForAgent = res.lead;
              document.getElementById('timer').innerHTML = 20 + ":" + '00';
              clearTimeout(this.y);
              document.getElementById('timer1').innerHTML = 1 + ":" + '00';
              this.startTimer2();
            } else {
              this.activeLeadDataForAgent = undefined;
              this.agentStatusChange('',true);
            }
            this.loaderService.display(false);
          },
          err => {
            this.loaderService.display(false);
          }
        );
      // this.myStopFunction();

    }
    else{
      this.x=setTimeout(()=>this.startTimer1(this), 1000);
    }

  }


  checkSecond(sec:any) {
    if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
    if (sec < 0) {sec = "59"};
    return sec;
  }


  myStopFunction() {
      var presentTime = document.getElementById('timer').innerHTML;
      clearTimeout(this.x);
      if(<any>presentTime.split(/[:]+/)[0] > 0){
        this.markLeadEscalated(this.leadDetails.id,'modal close before timer completion');
        this.unassignedLead(this.leadDetails.id);
        this.leadService.refreshLeads(this.agentID,'','').subscribe(
          res => {
            if(res!=null){
              this.activeLeadDataForAgent = res.lead;
              document.getElementById('timer').innerHTML = 20 + ":" + '00';
              clearTimeout(this.y);
              document.getElementById('timer1').innerHTML = 1 + ":" + '00';
              this.startTimer2();
              this.leadquestionnaire.reset();
              this.leadStatusUpdateForm.reset();
              // this.leadDetails.reset();
            } else {
            this.agentStatusChange('',true);
          }
            this.loaderService.display(false);
          },
          err => {
            this.loaderService.display(false);
          }
        );

      }
      document.getElementById('timer').innerHTML = 20 + ":" + '00';
  }

  resetTimer(){
    this.myStopFunction();
    document.getElementById('timer').innerHTML = 20 + ":" + '00';
    this.startTimer1();
  }


  startTimer2(parentThis?) {
    var presentTime1 = document.getElementById('timer1').innerHTML;
    var timeArray1 = presentTime1.split(/[:]+/);
    var m1 = <any>timeArray1[0];
    if(m1==1){
      m1= m1-1;
    }
    var k1=<any>timeArray1[1] - 1;
    var s1;
      s1 = this.checkSecond1(k1);

    if(s1==0 || s1=='00')
    {
        m1=m1-1
    }
    this.timervar = m1 + ":" + s1;
    document.getElementById('timer1').innerHTML = this.timervar;
    if(m1<0){
      clearTimeout(this.y);
      this.myStopFunction1("");
    } else {
      this.y=setTimeout(()=>this.startTimer2(this), 1000);
    }

  }


  checkSecond1(sec:any) {
    if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
    if (sec < 0) {sec = "59"};
    return sec;
  }

  myStopFunction1(val) {
      this.loaderService.display(true);
      clearTimeout(this.y);
      this.y =undefined;
      if(val!='afterClaim'){
        document.getElementById('timer1').innerHTML = 1 + ":" + '00';
        if(this.activeLeadDataForAgent){
          this.csagentService.unassignedLead(this.activeLeadDataForAgent.id,this.agentID).subscribe(
            res=> {
              this.leadService.refreshLeads(this.agentID,'','').subscribe(
                res => {
                  if(res!=null){
                    this.activeLeadDataForAgent = res.lead;
                  } else {
                    this.agentStatusChange('',true);
                  }
                   document.getElementById('timer1').innerHTML = 1 + ":" + '00';
                  this.startTimer2();
                  this.loaderService.display(false);
                },
                err => {
                  this.loaderService.display(false);
                }
               );
            },
            err => {
            }
            );
        }
        else {
          this.loaderService.display(true);
          this.leadService.refreshLeads(this.agentID,'','').subscribe(
            res => {
              if(res!=null){
                this.activeLeadDataForAgent = res.lead;
              } else {
                this.agentStatusChange('',true);
              }

              this.startTimer2();
              this.loaderService.display(false);
            },
            err => {
              
              this.loaderService.display(false);
            }
           );
        }
      }

  }

  stopTimerAfterClaimLead(leadID) {

    this.loaderService.display(true);
    this.myStopFunction1('afterClaim');
    this.csagentService.claimLeads(leadID,this.agentID,this.activeLeadDataForAgent).subscribe(
      res => {
        this.activeLeadDataForAgent = res.lead;
        this.leadDetails = res.lead;
        this.leadContact = res.lead.contact;
        this.leadEmail = res.lead.email;
        this.leadName = res.lead.name;
        this.leadPincode = res.lead.pincode;
        this.leadInstagramhandle = res.lead.instagram_handle;
        this.lead_designerCV=res.lead.lead_cv;
        $('#leadDetailsModal').modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true
                });
        this.loaderService.display(false);
        // $('#leadDetailsModal').modal('show');
        // $('#leadDetailsModal').modal({'backdrop': 'static', 'keyboard': false})
        this.selectedMoment.setDate(this.selectedMoment.getDate());
        // document.getElementById("notfound").style.display = "none";
        // document.getElementById("societybuildingCs").style.display = 'none';
      },
      err => {
        
        this.loaderService.display(false);
      }
    );

  }


  markLeadEscalated(leadId,reason){
    this.loaderService.display(true);
    this.csagentService.markLeadEscalaetd(leadId,reason).subscribe(
        res=>{
          this.loaderService.display(false);
        },
        err => {
          
          this.loaderService.display(false);
        }
     );
  }
  unassignedLead(leadId){
    this.loaderService.display(true);
    this.csagentService.unassignedLead(leadId,localStorage.getItem('userId')).subscribe(
        res=>{
          this.loaderService.display(false);
        },
        err => {
          
          this.loaderService.display(false);
        }
     );
  }

  callResponse;
  callLead(contact){
    this.csagentService.callLead(localStorage.getItem('userId'),contact).subscribe(
      res=>{
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
             // this.successMessage = 'Calling from - '+this.callResponse.Call.From;
             this.successMessage = 'Calling to '+res.inhouse_call.call_to
              setTimeout(function() {
                   this.successalert = false;
              }.bind(this), 10000);
            }
      },
      err =>  {
        
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
  checkEmail(email) {
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!filter.test(email)) {
        return false;
      }
    return true;
  }

  onChangeOfLeadType(val){
    for(var i=0;i<this.lead_types.length;i++){
      if(val==this.lead_types[i].id){
        this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
      }
    }
  }

  attachment_file: any;
  basefile: any;
  uploadCV(event) {
    this.attachment_file = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
    };
    fileReader.readAsDataURL(this.attachment_file);
  }

  citiesForQuestionnaire;
  getCitiesForQuestionnaire(){
    this.loaderService.display(true);
    this.leadService.getCitiesForQuestionnaire().subscribe(
      res=>{
        this.citiesForQuestionnaire = res.cities;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  agentStatusChange(msg?,arg?){

    if(!arg){
      this.erroralert = false;
      this.errorMessage =msg;
    } else {
      this.erroralert = true;
      this.errorMessage = 'No lead available';
    }
    this.changeShowStatus('offline');
    this.agentStatus =1;
    document.getElementById('onlineText').classList.add('notactivestatusText');
    document.getElementById('offlineText').classList.remove('notactivestatusText');
    document.getElementById('statusSwitch').style.background = 'red';
    setTimeout(function() {
         this.erroralert = false;
    }.bind(this), 10000);
  }

  callToCustomer(){
    if(this.callCustomerForm.controls['contact_number'].value != ""){
    this.loaderService.display(true);
    this.leadService.callToCustomer(localStorage.getItem('userId'),
    this.callCustomerForm.controls['contact_number'].value).subscribe(
        res => {
           this.loaderService.display(false);
            if(res.message.code === "200"){
            this.successalert = true;
            this.callingCustomer = true;
            this.successMessage = 'Calling to - '+this.callCustomerForm.controls['contact_number'].value;
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 10000);
        }
        },
        err => {
          this.loaderService.display(false);
          
        }
     );} else{
      this.erroralert = true;
      this.errorMessage = "Mobile Number is required!";
     }
  }

  clearCallCustomerForm(){
    this.callCustomerForm.reset();
    this.callingCustomer = false;
  }

  inviteChampionFormSubmit(data){
    this.loaderService.display(true);
    this.leadService.inviteChampion(data).subscribe(
      res=>{
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
         this.inviteChampionForm.reset();
        // this.champion_user = "";
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
       
      },
      err =>{
        if(err.status == '403' || err.status == '422'){
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 10000);
          this.inviteChampionForm.reset();
        }else {
          this.erroralert = true;
          this.errorMessage = err.message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 10000);
        }
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
      }
    );
  }

  getChampionList(){
    this.loaderService.display(true);
    this.leadService.getChampionList().subscribe(
      res=>{
        this.champion_types = res.allowed_champion_levels;
        this.champion_list_first_level = res["1"];
        this.champion_list_second_level = res["2"];
        this.champion_list_third_level = res["2"];
        this.inviteChampionForm.controls['champion_level'].patchValue("");
        this.inviteChampionForm.controls['parent_id'].patchValue("");
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  getChampionListByLevel(){
    switch(this.inviteChampionForm.controls['champion_level'].value)
    {
     case "1":
          this.champion_user = [];
            break;
     case "2":
          this.champion_user = this.champion_list_first_level;
           break;
     case "3":
          this.champion_user = this.champion_list_second_level;
          break;
    }     
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
        || this.addLeadForm.controls['lead_source_type'].value == 'others'
        || this.addLeadForm.controls['lead_source_type'].value == 'non_display_dealer'
        || this.addLeadForm.controls['lead_source_type'].value == 'associate_partner'){
          this.getReferUserList(val,this.addLeadForm.controls['lead_source_type'].value);

        }
        
      }
    }
  }

  /*OnChange User List*/
  userList:any;
  getReferUserList(referId,referName){
    this.salesService.getReferUserList(this.user_id,referName).subscribe(
    res=>{
      
      this.userList = res['users'];

    },
    err=>{
      

    });
  }

  addAlternateNumberForm() : void{
    this.showAlternateForm = true;
        (<FormArray>this.alternateNumberMasterForm.controls['alternate_contacts']).push(this.createAlternateNumberElement());
  }
  // Method which is called whenever input type date is focused to open calander
  // Method which is called whenever input type date is focused to open calander
  newDate;
  callChangeNew(){
    $('.date-picker').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'mm/yy',
        minDate: '+0M',
        onClose: function(dateText, inst) { 
          function isDonePressed(){
              return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
          }
 

          if (isDonePressed()){
              var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
              var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
              $(this).datepicker('setDate', new Date(year, month, 1));
              var FullChange = new Date(year, month, 1);
              var date = new Date(); //taking current date and time
              var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
              firstDay.setMonth(firstDay.getMonth()+2);
              var curMonth =  new Date(firstDay.toDateString());

              if(((+FullChange) - (+curMonth)) > 0){
                $('#delyedV').removeClass('d-none');
                $('#normalStat1').addClass('d-none');
 
              }
              else{
                  $('#delyedV').addClass('d-none');
                  $('#normalStat1').removeClass('d-none');
                
              }
          }
         
        }
    }).focus(function() {
        $('#startDateCs').datepicker("show");

    }).focus();
 
  }
  delayedVal:boolean = false;
  // To set  the value of possession date in leadQuestionnaire form
  taskChange(){
    this.leadquestionnaire.controls['possession_status_date'].setValue($('#startDateCs').val());
    var startdate =$('#startDateCs').val();
    var endDate = new Date("01/" + startdate);
    
    var date = new Date(); //taking current date and time
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setMonth(firstDay.getMonth()+2);
    var curMonth =  new Date(firstDay.toDateString());
    if((((+endDate) - (+curMonth)) > 0) || this.delayedVal == true){
      $('#delyed1').removeClass('d-none');
      $('#normalStatV').addClass('d-none');
      

    }
    else{
        $('#delyed1').addClass('d-none');
        $('#normalStatV').removeClass('d-none');

    }
       
  }
  onChange(event){
    
    var date = new Date(); //taking current date and time
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setMonth(firstDay.getMonth()+2);
    var curMonth =  new Date(firstDay.toDateString());
    var FullChange = new Date(event.value);
    if((((+FullChange) - (+curMonth)) > 0)){
      this.delayedVal =true;

    }
    else{
        this.delayedVal = false

    }
    
    // start------
    var startdate =$('#startDateCs').val();
    var endDate = new Date("01/" + startdate);
    
    if((((+endDate) - (+curMonth)) > 0) || this.delayedVal == true){
      $('#delyedV').removeClass('d-none');
      $('#normalStatV').addClass('d-none');
      

    }
    else{
        $('#delyedV').addClass('d-none');
        $('#normalStatV').removeClass('d-none');

    }
    
  }


  removeAlternateNumber(i){
    <FormArray>this.alternateNumberMasterForm.get('alternate_contacts')['controls'].splice(i,1);
    this.alternateNumberMasterForm.controls['alternate_contacts'].value.splice(i,1);
    }

    createAlternateNumberElement(): FormGroup {
      return this.formBuilder.group({
        contact: '',
        name: '',
        relation: '',
      });
    }
 
    budget()
    {
      this.csagentService.getquestionairemasterdata().subscribe(res =>
      {
        this.getcaluclatordata = res.questionaire_master_items;
        this.searchList = res.questionaire_master_items;
        this.masterLeadItemsCopy = this.getcaluclatordata;
      })
    }

    // isAllSelected(e) {
    //   var touchedItem = this.getquestionairedata.find(function(element){
    //     return element.name == e.target.attributes.value.value;
    //   })

    //   if(e.target.checked){
    //     this.checkedList.push({"name": touchedItem.name , "price": touchedItem.price, "quantity": 1});
    //     this.budgetcaluclatototal();
    //   }else{
    //     this.checkedList = this.checkedList.filter(element => element.name != e.target.attributes.name.value);
    //     this.budgetcaluclatototal();
    //   }
    //   // this.checkedList = JSON.parse(this.checkedList); 
    // }

    isAllSelected(e) {

      var touchedItem = this.getcaluclatordata.find(function(element){
        return element.name == e.target.attributes.value.value;
      })
      
      if(e.target.checked){
        this.checkedList.push({"name": touchedItem.name , "price": touchedItem.price, "quantity": 1});
        this.budgetcaluclatototal();
      }else{
        this.checkedList = this.checkedList.filter(element => element.name.toLowerCase() != e.target.attributes.value.value.toLowerCase());
        this.budgetcaluclatototal();
      }
      this.leadItemscheckedListNames = this.checkedList.map(element => element.name.toLowerCase());
      this.ref.detectChanges();
     // this.checkedList = JSON.parse(this.checkedList); 
    }


  valuechange(changedItem) {
    this.checkedList.forEach(function(item){
      if(item.name === changedItem.name){
        item.quantity = changedItem.quantity;
      }
    });
    this.budgetcaluclatototal();
  }

  showAddOtherItem(){
    $("#otherLeadItemCsAgent").removeClass("hide");
    $("#submitOtherLeadBtnCsAgent").removeClass("hide");
    $("#addMoreLeadItemBtnCsAgent").addClass("hide");
    this.ref.detectChanges();
  }
  
  SaveOtherLeadItem(event)
  {
    var name = $("#otherLeadItemCsAgent").val();
    if(name.length > 0){
      this.checkedList.push({"name": name, "price": 0, "quantity": Math.abs(1)})
      $("#otherLeadItemCsAgent").val("").addClass("hide");
      $("#submitOtherLeadBtnCsAgent").addClass("hide");
      $("#addMoreLeadItemBtnCsAgent").removeClass("hide");
      this.budgetcaluclatototal();
    }else{
      alert("cannot be empty");
      $("#otherLeadItemCsAgent").removeClass("hide")
      $("#submitOtherLeadBtnCsAgent").removeClass("hide");
    }     
  }

  reducedbudget:any;
  removequestionaireitesm(e)
  {
    this.checkedList = this.checkedList.filter(element => element.name.toLowerCase() != e.name.toLowerCase());
    this.budgetcaluclatototal();
    $("#"+e.name.split(' ')[0].toLowerCase()+"-"+e.price).prop('checked', false); 
    this.ref.detectChanges();
  }


  budgetcaluclatototal()
  {
    var total = 0;
    this.checkedList.forEach(function(item){
      total = total + (item.price * item.quantity);
    })
    this.totalBudget = Math.abs(total);
  }

  societySearchWord='';
  searchSociety($event){
    let searchWord = $event.target.value;
    this.societySearch(this.leadquestionnaire.controls['city'].value,searchWord);
  }
  
  societySearch(city_name,search){
    this.leadService.getLocalityBuildingDetails(city_name,search).subscribe(
      res=>{
        this.societyList = res.building_crawlers;
      },
      err =>{
      }
    );
  }
  societyList;
  getSocietyList(city_name,note_records){
    this.societyList =[];
    let society_search_word="";
    if(note_records && (note_records.society && note_records.society!='Others')){
      society_search_word = note_records.society
    }
    this.loaderService.display(true);
    this.leadService.getLocalityBuildingDetails(city_name,society_search_word).subscribe(
      res=>{

        this.societyList = res.building_crawlers;

        if(note_records){
          this.leadquestionnaire.controls['location'].setValue(note_records.location);

          
          if(!this.leadquestionnaire.controls['location'].value){
            
            this.leadquestionnaire.controls['location'].setValue('');
            // document.getElementById("localitybuildingCs").style.display = 'none';
          }
          else if(this.leadquestionnaire.controls['location'].value == 'Others' || this.societyList.filter(locality=>{return locality.locality == this.leadquestionnaire.controls['location'].value}).length==0){
            
            this.leadquestionnaire.controls['location'].setValue('Others');
            if(note_records.new_locality_value){
              this.leadquestionnaire.controls['new_locality_value'].setValue(note_records.new_locality_value);
            }else{
              this.leadquestionnaire.controls['new_locality_value'].setValue(note_records.location);
            }
            if(document.getElementById("localitybuildingCs")){
              document.getElementById("localitybuildingCs").style.display = 'block';
            }
            if(note_records.new_locality_value){
              this.retainLocality = note_records.new_locality_value;
            }else{
              this.retainLocality = note_records.location;
            }
            this.localityChangeValue= 'Others';
            this.ref.detectChanges();
          }
          
          
          this.leadquestionnaire.controls['society'].setValue(note_records.society);
          
          if(!this.leadquestionnaire.controls['society'].value){
            this.leadquestionnaire.controls['society'].setValue('');
           
          }
          else if(this.leadquestionnaire.controls['society'].value == 'Others' || this.societyList.filter(society=>{return society.building_name == this.leadquestionnaire.controls['society'].value}).length==0){
            this.leadquestionnaire.controls['society'].setValue('Others');
            if(note_records.new_society_value){
              this.leadquestionnaire.controls['new_society_value'].setValue(note_records.new_society_value);
            }else{
              this.leadquestionnaire.controls['new_society_value'].setValue(note_records.society);
            }
            // document.getElementById("societybuildingCs").style.display = 'block';
            if(note_records.new_society_value){
              this.retainAddress = note_records.new_society_value;
            }else{
              this.retainAddress = note_records.society;
            }
            this.vaale= 'Others';
            
            this.ref.detectChanges();
          }
          else{
            this.getSocietyWebData(note_records.building_crawler_id);
          }
        }
        this.loaderService.display(false);
      },
      err =>{
        if(note_records){
          this.leadquestionnaire.controls['location'].setValue(note_records.location);

          
          if(!this.leadquestionnaire.controls['location'].value){
            
            this.leadquestionnaire.controls['location'].setValue('');
            // document.getElementById("localitybuildingCs").style.display = 'none';
          }
          else if(this.leadquestionnaire.controls['location'].value == 'Others' || this.societyList.filter(locality=>{return locality.locality == this.leadquestionnaire.controls['location'].value}).length==0){
            
            this.leadquestionnaire.controls['location'].setValue('Others');
            if(note_records.new_locality_value){
              this.leadquestionnaire.controls['new_locality_value'].setValue(note_records.new_locality_value);
            }else{
              this.leadquestionnaire.controls['new_locality_value'].setValue(note_records.location);
            }
            if(document.getElementById("localitybuildingCs")){
              document.getElementById("localitybuildingCs").style.display = 'block';
            }
            if(note_records.new_locality_value){
              this.retainLocality = note_records.new_locality_value;
            }else{
              this.retainLocality = note_records.location;
            }
            this.localityChangeValue= 'Others';
            this.ref.detectChanges();
          }
          
          
          this.leadquestionnaire.controls['society'].setValue(note_records.society);
          
          if(!this.leadquestionnaire.controls['society'].value){
            this.leadquestionnaire.controls['society'].setValue('');
           
          }
          else if(this.leadquestionnaire.controls['society'].value == 'Others' || this.societyList.filter(society=>{return society.building_name == this.leadquestionnaire.controls['society'].value}).length==0){
            this.leadquestionnaire.controls['society'].setValue('Others');
            if(note_records.new_society_value){
              this.leadquestionnaire.controls['new_society_value'].setValue(note_records.new_society_value);
            }else{
              this.leadquestionnaire.controls['new_society_value'].setValue(note_records.society);
            }
            // document.getElementById("societybuildingCs").style.display = 'block';
            if(note_records.new_society_value){
              this.retainAddress = note_records.new_society_value;
            }else{
              this.retainAddress = note_records.society;
            }
            this.vaale= 'Others';
            
            this.ref.detectChanges();
          }
          else{
            this.getSocietyWebData(note_records.building_crawler_id);
          }
        }
        this.loaderService.display(false);
      }
    );
  }
  
  localityWebData;
  getSocietyWebData(society){
    this.loaderService.display(true);
    this.localityWebData = null;
    this.leadService.getSocietyWebData(society).subscribe(
      res=>{
       
        this.localityWebData=res;
       
        this.loaderService.display(false);
      },
      err =>{
        this.loaderService.display(false);
      }
    );
  }
  cityChangeValue:any;
  onchangeCity(event){
    this.cityChangeValue = event;

    if(this.cityChangeValue=='Others'){
      
      document.getElementById('citybuilding').style.display = 'block';
      this.leadquestionnaire.controls['new_city_value'].setValue(this.retainCity);
    } else if(this.cityChangeValue){
      this.getSocietyList(this.cityChangeValue,null);
      document.getElementById('citybuilding').style.display = 'none';
      this.leadquestionnaire.controls['new_city_value'].setValue("");
    }
  }
  searchList
  searchquestionarrieItem(event){
    this.searchList=this.getcaluclatordata;
    var searchedItem = [];
    if(event.target.value){
      this.searchList.forEach(function(element){
        if(element.name.toLowerCase().match(new RegExp(event.target.value.toLowerCase(), 'g'))){

          searchedItem.push(element);
        }
      })
    }



    if(searchedItem.length >= 1){
      this.searchstatus = true;
      this.searchList = searchedItem;
    }
    else
    {
      this.searchstatus = false;
      //  this.getcaluclatordata = this.masterLeadItemsCopy;
      this.searchList = searchedItem;
   
    }
    if(this.searchname == "")
    {
      this.searchList=this.getcaluclatordata;
      this.searchstatus = true;
    }
    this.ref.detectChanges();
  }
  hide()
  {
    document.getElementById("notfound").style.display = "none";
    this.searchstatus=false;
    this.searchname = '';
  }

  localityChangeValue:any;
 changeLocality(event) {
 
  this.localityChangeValue = event
  if(this.localityChangeValue == "Others")
  {
    if(document.getElementById("localitybuildingCs")){
      document.getElementById("localitybuildingCs").style.display = 'block';
    }
    
    this.leadquestionnaire.controls['new_locality_value'].setValue(this.retainLocality);
  }
  else
  {
    if(document.getElementById("localitybuildingCs")){
      document.getElementById("localitybuildingCs").style.display = 'none';
    }
    this.leadquestionnaire.controls['new_locality_value'].setValue("");
  }
}

closeFloorplanModal(){
  $('#floorplanModalCs').modal('hide');
}
 // Method which is called whenever input type date is focused to open calander
  DateForWorkStart(){
     $('.work-date-picker').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'mm/yy',
        minDate: '+0M',
        onClose: function(dateText, inst) { 
          function isDonePressed(){
              return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
          }

          if (isDonePressed()){



              var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
              var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
              $(this).datepicker('setDate', new Date(year, month, 1));
              var FullChange = new Date(year, month, 1);
              var date = new Date(); //taking current date and time
              var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
              firstDay.setMonth(firstDay.getMonth()+2);
              var curMonth =  new Date(firstDay.toDateString());

              if(((+FullChange) - (+curMonth)) > 0){
                $('#Vdelyed').removeClass('d-none');
                $('#VnormalStat').addClass('d-none');
                

              }
              else{
                  $('#Vdelyed').addClass('d-none');
                  $('#VnormalStat').removeClass('d-none');
                
              }

          }
         
        }
    }).focus(function() {
        $('#startDateCswork').datepicker("show");

    }).focus();
  }
  // To set  the value of Intended date in leadQuestionnaire form
  workChange(){
    this.leadquestionnaire.controls['intended_date'].setValue($('#startDateCswork').val());
    var startdate =$('#startDateCswork').val();
    var endDate = new Date("01/" + startdate);
    var date = new Date(); //taking current date and time
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setMonth(firstDay.getMonth()+2);
    var curMonth =  new Date(firstDay.toDateString());
    if((((+endDate) - (+curMonth)) > 0) || this.delayedVal == true){
      $('#Vdelyed').removeClass('d-none');
      $('#VnormalStat').addClass('d-none');
      

    }
    else{
        $('#Vdelyed').addClass('d-none');
        $('#VnormalStat').removeClass('d-none');

    }
    
  }
}