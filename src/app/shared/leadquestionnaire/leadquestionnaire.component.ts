import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl,FormArray,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import { LeadService } from '../../platform/lead/lead.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { FormBase } from '../dynamic-form/form-base';
declare var $:any;


@Component({
  selector: 'app-leadquestionnaire',
  templateUrl: './leadquestionnaire.component.html',
  styleUrls: ['./leadquestionnaire.component.css'],
  providers:[LeadService,DynamicFormService]
})
export class LeadquestionnaireComponent implements OnInit,AfterViewInit {
  showAlternateForm: boolean;
  staticFields: any;
  alternateNumberForm: FormGroup;
  @Input() fields: FormBase<any>[] = [];
  hideAlternateNumberButton: boolean;
  path=window.location.pathname;
  leadId: any;
  getcaluclatordata: any;
  alternateNumberMasterForm: any;
  public selectedMoment = new Date();
  // public selectedMoment2 = new Date();
selectstatus:any;
selectstatusforsite:any;
selctbuilding:any;
  masterselected:boolean;
  masterSelected:boolean;
  checklist:any;
  checkedList:any= [];
  finaldata:any = [];
  leadItemscheckedListNames:any = [];
leaditesmnewlyadded:any=[];
vaale:any;
  orderForm: FormGroup;
  items: FormArray;
  budgetcaluclatorform:FormGroup;
  masterLeadItemsCopy:any;
  totalBudget= 0;
  searchstatus : any;
  notfound = "notfound";
  demolist:any = [];
  searchname:any;
  constructor(
  	private leadService:LeadService,
  	private loaderService:LoaderService,
    private formBuilder:FormBuilder,
    private dynamicFormService: DynamicFormService,
    private ref: ChangeDetectorRef
  ) { 
    this.alternateNumberMasterForm = this.formBuilder.group({
      alternate_contacts: this.formBuilder.array([])
    });
  }

  public _leadDetails: any;
  private _formtype:any;
  public role:string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() ques_form:EventEmitter<any>=new EventEmitter();
  closeModal(success?){
    (<HTMLInputElement>document.getElementById('floorplanupload_input')).value="";
    (<HTMLInputElement>document.getElementById('fileupload')).value="";
    this.leadquestionnaireForm.reset();
    this.leadquestionnaireForm.clearValidators();
    this.removeFormFieldRequired(this.leadquestionnaireForm);
    if(this.role=='community_manager'|| this.role=='designer' || this.role=='business_head' ||this.role=='city_gm' || this.role=='design_manager'){
      if(success){
        if(this._formtype=='addlead'){
          this.close.emit(success);
        } else{
          this.getCitiesForQuestionnaire();
          this.successalert = true;
          this.successMessage = success;
          setTimeout(function() {
                   this.successalert = false;
              }.bind(this), 10000);
        }
      }

    } else {
      if(success){
        this.close.emit(success);
      } else {
        this.close.emit(null);
      }
    }
  }

  // }
  // @Input() leadDetails: any;

  leadquestionnaireForm:FormGroup;
  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  accommodation_type = ['Studio Apartment','1RK','1BHK','1.5BHK','2BHK','2.5BHK','3BHK',
    '3.5BHK','4BHK','4.5BHK','5BHK','Villa','Bungalow'];
  scopeOfwork_home = ['Modular Kitchen','Full Home Interiors','Interiors without Services','Partial Home Interiors (e.g. MKW + Living Room)'];
  callbacktime = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM',
                '1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
                '5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM',
                '10:00 PM','10:30 PM','11:00 PM'];
  estimatedPossessionTime = ['Jan-18','Feb-18','Mar-18','Apr-18','May-18',
    'Jun-18','Jul-18','Aug-18','Sep-18','Oct-18','Nov-18','Dec-18','Jan-19','Feb-19','Mar-19','Apr-19','May-19',
    'Jun-19','Jul-19','Aug-19','Sep-19','Oct-19','Nov-19','Dec-19'];
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
  lostReasonsArr=['low_budget','non_serviceable_area','out_of_scope','general_inquiry',
    'language_barrier','already_done_with_other_vendor','others'];
  Buildings = ['shree-pg','kaartik-residency','Hotel abhinav','vivek furnitures','shankar-paints','boat-house','benny villa',
  'deepak furnitures','otherbuilding'];
  purpose_of_property=['Own Stay','Rental','Not Disclosed'];
 
  ngOnInit() {

    this.leadquestionnaireForm = this.formBuilder.group({
      customer_name : new FormControl("",Validators.required),
      phone : new FormControl("",),
      society:new FormControl(""),
      project_name: new FormControl(""),
      pincode: new FormControl(""),
      home_type: new FormControl(""),
      city : new FormControl(""),
      location: new FormControl(""),
      project_type :new FormControl(""),
      accomodation_type: new FormControl(""),
      scope_of_work : new FormControl(""),
      budget_value:new FormControl(""),
      home_value: new FormControl(""),
      possession_status :new FormControl(""),
      possession_status_date:new FormControl(""),
      have_homeloan: new FormControl(""),
      purpose_of_property:new FormControl(""),
      call_back_day: new FormControl(""),
      visit_ec_date:new FormControl(""),
      site_measurement_date:new FormControl(""),
      call_back_time: new FormControl(""),
      have_floorplan: new FormControl(""),
      site_measurement_required:new FormControl(""),
      visit_ec:new FormControl(""),
      lead_generator: new FormControl(""),
      lead_source:new FormControl(""),
      lead_floorplan:new FormControl(""),
      additional_comments :new FormControl(""),
      ownerable_type : new FormControl('Lead'),
      user_id : new FormControl(localStorage.getItem('userId')),
      ownerable_id : new FormControl(),
      cm_comments: new FormControl(),
      designer_comments:new FormControl(),
      type_of_space:new FormControl(),
      status_of_property:new FormControl(),
      project_commencement_date:new FormControl(),
      address_of_site:new FormControl(),
      layout_and_photographs_of_site:new FormControl(),
      area_of_site:new FormControl(),
      site_layouts:new FormArray([]),
      lead_status: new FormControl("",Validators.required),
      follow_up_time : new FormControl(""),
      remark: new FormControl(""),
      lost_remark : new FormControl(""),
      lost_reason: new FormControl(""),
      intended_date: new FormControl(""),
      lead_questionaire_items_attributes:new FormControl(""),
      lead_questionaire_items:new FormControl(""),
      new_society_value:new FormControl(""),
      good_time_to_call:new FormControl(""),
      new_locality_value: new FormControl(""),
      new_city_value: new FormControl(""),
      building_crawler_id: new FormControl("")
    });
    this.role = localStorage.getItem('user');
    document.getElementById("societybuilding").style.display = 'none';
    document.getElementById("localitybuilding").style.display = 'none';
    document.getElementById("citybuilding").style.display = 'none';
    if(this.searchname == "")
    {
      document.getElementById("notfound").style.display = "none";
    }
    // this.ques_form.emit(this.leadquestionnaireForm);
  
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
  get leadDetails(): any {
    // transform value for display
    return this._leadDetails;
  }
  @Input()
  set leadDetails(leadDetails: any) {
    this._leadDetails = leadDetails;
    
    this.getCitiesForQuestionnaire();
  }
  get formtype(): any {
    // transform value for display
    return this._formtype;
  }
  @Input()
  set formtype(formtype: any) {
    this._formtype = formtype;
  }
  cityChangeValue:any;
  onchangeCity(event){
    let city = event;
    this.cityChangeValue = city;
    
    if(city=='Others'){
      document.getElementById('citybuilding').style.display = 'block';
      this.leadquestionnaireForm.controls['new_city_value'].setValue(this.retainCity);
    } else{
      this.getSocietyList(city,null);
      document.getElementById('citybuilding').style.display = 'none';
      this.leadquestionnaireForm.controls['new_city_value'].setValue("");
    }
  }
  citiesForQuestionnaire;
  userQuestionnaireDetails;
  getCitiesForQuestionnaire(){
    this.loaderService.display(true);
    this.leadService.getCitiesForQuestionnaire().subscribe(
      res=>{
        this.citiesForQuestionnaire = res.cities;
        if(this._leadDetails){
          this.getUserQuestionnaireDetails(this._leadDetails.id,this._leadDetails.lead_status);
        }
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  questionnaire_floorplan_basefile: any;
  floorplan_attachment_file:any;
  fpQuestionnaireSelected(val){
    if(val == 'yes'){
      document.getElementById('floorplanQuestionnaire').style.display = 'block';
    } else {
      document.getElementById('floorplanQuestionnaire').style.display = 'none';
      this.floorplan_attachment_file = undefined;
      this.questionnaire_floorplan_basefile = undefined;
    }
  }
  sitemeasurement(val){
    
    if(val){
      this.selectstatusforsite = val;
      
      this.leadquestionnaireForm.controls['site_measurement_date'].setValidators([Validators.required]);
    } else {
      this.selectstatusforsite = val;
      
      this.leadquestionnaireForm.controls['site_measurement_date'].clearValidators();
      this.leadquestionnaireForm.controls['site_measurement_date'].setValue("");

    }
  }

  ec(valu){
    
    if(valu){
      this.selectstatus = valu;
      this.leadquestionnaireForm.controls['visit_ec_date'].setValidators([Validators.required]);    
     
        $("#ecdatedisplay").attr({
           "min" : this.selectedMoment       // values (or variables) here
        });

      
    } else {
      this.selectstatus = valu;

      this.leadquestionnaireForm.controls['visit_ec_date'].clearValidators();
      this.leadquestionnaireForm.controls['visit_ec_date'].setValue("");
      
    }
  }

  changebuilding(value) {
    if (typeof value == "string"){
      this.vaale=value;
    }
    else{
      this.vaale= value.building_name;
    }
    
    if(this.vaale == "Others")
    {
      document.getElementById("societybuilding").style.display = 'block';
      this.leadquestionnaireForm.controls['new_society_value'].setValue(this.retainAddress);
    }
    else
    {
      const societyId = value.id;
      document.getElementById("societybuilding").style.display = 'none';
      this.leadquestionnaireForm.controls['building_crawler_id'].setValue(societyId);
      this.leadquestionnaireForm.controls['society'].setValue(value.building_name);
      this.leadquestionnaireForm.controls['new_society_value'].setValue("");
      this.leadquestionnaireForm.controls['location'].setValue(value.locality);
      this.leadquestionnaireForm.controls['new_locality_value'].setValue("");
      document.getElementById("localitybuilding").style.display = 'none';
      this.getSocietyWebData(societyId);
    }
 }
 localityChangeValue:any;
 changeLocality(event) {

  this.localityChangeValue = event
  if(this.localityChangeValue == "Others")
  {
    document.getElementById("localitybuilding").style.display = 'block';
    this.leadquestionnaireForm.controls['new_locality_value'].setValue(this.retainLocality);
  }
  else
  {
    document.getElementById("localitybuilding").style.display = 'none';
    this.leadquestionnaireForm.controls['new_locality_value'].setValue("");
  }
}
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

  getUserQuestionnaireDetails(leadId,status){
     
    this.leadId = leadId;
    this.loaderService.display(true);
    // if(status=='qualified'){
    //   this.setFormFieldRequired(this.leadquestionnaireForm);
    // } else {
    //   this.removeFormFieldRequired(this.leadquestionnaireForm);
    // }
    this.leadService.getRecordNotesQuestionnaire(leadId).subscribe(
      res=>{
        Object.keys(res).map((key)=>{ res= res[key];});
        this.userQuestionnaireDetails = res;

        if(this.userQuestionnaireDetails[0]){
          this.checkedList = this.userQuestionnaireDetails[0].lead_questionaire_items;
        }else{
          this.checkedList=[];
        }

        for(let key of this.userQuestionnaireDetails)
        {
          if(key.society == 'Others')
          {
            document.getElementById("societybuilding").style.display = "block";
          }
          else
          {
            document.getElementById("societybuilding").style.display = "none";
          }

          if(key.location == 'Others')
          {
            document.getElementById("localitybuilding").style.display = "block";
          }
          else
          {
            document.getElementById("localitybuilding").style.display = "none";
          }

          if(key.city == 'Others')
          {
            document.getElementById("citybuilding").style.display = "block";
          }
          else
          {
            document.getElementById("citybuilding").style.display = "none";
          }
        }

        this.leadItemscheckedListNames = this.checkedList.map(element => element.name.toLowerCase());

        if(this.userQuestionnaireDetails!= null && this.userQuestionnaireDetails.length != 0){
          this.setQuestionnaireDetails(this.userQuestionnaireDetails[0]);
        } else {
          this.societyList=[];
          this.leadquestionnaireForm.reset();
          document.getElementById("localitybuilding").style.display = 'none';
          document.getElementById("citybuilding").style.display = "none";
          document.getElementById("societybuilding").style.display = "none";
          this.selectstatus=false;
          this.selectstatusforsite=false;
          this.alternateNumberMasterForm.setControl('alternate_contacts', this.formBuilder.array([]));
          this.searchname="";
          this.leadquestionnaireForm.controls['customer_name'].setValue(this._leadDetails.name);
          this.leadquestionnaireForm.controls['phone'].setValue(this._leadDetails.contact);
          this.leadquestionnaireForm.controls['lead_status'].setValue(this._leadDetails.lead_status);
          this.leadquestionnaireForm.controls['pincode'].setValue(this._leadDetails.pincode);
          this.leadquestionnaireForm.controls['society'].setValue("");
          this.leadquestionnaireForm.controls['project_name'].setValue("");
          this.leadquestionnaireForm.controls['home_type'].setValue("");
          this.leadquestionnaireForm.controls['city'].setValue("");
          this.leadquestionnaireForm.controls['location'].setValue("");
          this.leadquestionnaireForm.controls['project_type'].setValue("");
          this.leadquestionnaireForm.controls['accomodation_type'].setValue("");
          this.leadquestionnaireForm.controls['scope_of_work'].setValue("");
          this.leadquestionnaireForm.controls['budget_value'].setValue("");
          this.leadquestionnaireForm.controls['home_value'].setValue("");
          this.leadquestionnaireForm.controls['possession_status'].setValue("");
          this.leadquestionnaireForm.controls['possession_status_date'].setValue("");
          this.leadquestionnaireForm.controls['visit_ec_date'].setValue("");
          this.leadquestionnaireForm.controls['site_measurement_date'].setValue("");
          this.leadquestionnaireForm.controls['site_measurement_required'].setValue("");
          this.leadquestionnaireForm.controls['visit_ec'].setValue("");
          this.leadquestionnaireForm.controls['have_homeloan'].setValue("");
          this.leadquestionnaireForm.controls['purpose_of_property'].setValue("");
          this.leadquestionnaireForm.controls['call_back_day'].setValue("");
          this.leadquestionnaireForm.controls['call_back_time'].setValue("");
          this.leadquestionnaireForm.controls['have_floorplan'].setValue("");
          this.leadquestionnaireForm.controls['lead_generator'].setValue("");
          this.leadquestionnaireForm.controls['lead_source'].setValue("");
          this.leadquestionnaireForm.controls['lead_floorplan'].setValue("");
          this.leadquestionnaireForm.controls['additional_comments'].setValue("");
          this.leadquestionnaireForm.controls['ownerable_type'].setValue('Lead');
          this.leadquestionnaireForm.controls['user_id'].setValue(localStorage.getItem('userId'));
          this.leadquestionnaireForm.controls['ownerable_id'].setValue("");
          this.leadquestionnaireForm.controls['cm_comments'].setValue("");
          this.leadquestionnaireForm.controls['designer_comments'].setValue("");
          this.leadquestionnaireForm.controls['type_of_space'].setValue("");
          this.leadquestionnaireForm.controls['status_of_property'].setValue("");
          this.leadquestionnaireForm.controls['project_commencement_date'].setValue("");
          this.leadquestionnaireForm.controls['address_of_site'].setValue("");
          this.leadquestionnaireForm.controls['layout_and_photographs_of_site'].setValue("");
          this.leadquestionnaireForm.controls['area_of_site'].setValue("");
          this.leadquestionnaireForm.controls['intended_date'].setValue("");
          this.leadquestionnaireForm.controls['good_time_to_call'].setValue("");  
          this.leadquestionnaireForm.controls['new_society_value'].setValue("");
          this.leadquestionnaireForm.controls['new_locality_value'].setValue("");
          this.leadquestionnaireForm.controls['new_city_value'].setValue("");
          this.leadquestionnaireForm.controls['building_crawler_id'].setValue("");
          this.hideAlternateNumberButton = false;
          this.showAlternateForm = false;
          if(document.getElementById('possesiondateupdate')){
            document.getElementById('possesiondateupdate').style.display='none';
          }
          if(document.getElementById('floorplanQuestionnaire')){
            document.getElementById('floorplanQuestionnaire').style.display = 'none';
          }
        }
        if(status=='qualified'){
          this.setFormFieldRequired(this.leadquestionnaireForm);
        } else {
          this.removeFormFieldRequired(this.leadquestionnaireForm);
        }
        this.budget();
        this.budgetcaluclatototal();
        this.selectedMoment.setDate(this.selectedMoment.getDate() );
        // this.selectedMoment2.setDate(this.selectedMoment2.getDate() );
        document.getElementById("notfound").style.display = "none";
        if(this.searchname == "")
        {
          document.getElementById("notfound").style.display = "none";
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
        
      }
    );
  }

  city_others;
  finalValStatus;
  finalValDate;
  retainAddress;
  retainLocality;
  retainCity;
  setQuestionnaireDetails(note_records){
    
    this.alternateNumberMasterForm.setControl('alternate_contacts', this.formBuilder.array([]));
    this.leadquestionnaireForm.controls['lead_status'].setValue(this._leadDetails.lead_status);
    this.leadquestionnaireForm.controls['new_locality_value'].setValue('');
    this.leadquestionnaireForm.controls['new_society_value'].setValue('');
    this.searchname="";
    
    if(note_records!=null){
      if(note_records.customer_name!= null){
        this.leadquestionnaireForm.controls['customer_name'].setValue(note_records.customer_name);
      } else {
        this.leadquestionnaireForm.controls['customer_name'].setValue(this._leadDetails.name);
      }
      if(note_records.pincode!= null){
          this.leadquestionnaireForm.controls['pincode'].setValue(note_records.pincode);
      } else {
        this.leadquestionnaireForm.controls['pincode'].setValue(this._leadDetails.pincode);
      }
      if(note_records.phone!= null){
        this.leadquestionnaireForm.controls['phone'].setValue(note_records.phone);
      } else {
        this.leadquestionnaireForm.controls['phone'].setValue(this._leadDetails.contact);
      }
      this.leadquestionnaireForm.controls['project_name'].setValue(note_records.project_name);
      // var elem = this.citiesForQuestionnaire.find(function(e) {
      //     return e.name == (note_records.city.toLowerCase());
      // });
      if(note_records.city !=null){
        this.leadquestionnaireForm.controls['city'].setValue(note_records.city);
        
      } 

      // **getting locality and building details based on city**
      
      if( this.leadquestionnaireForm.controls['city'].value){
        
       
        if(this.citiesForQuestionnaire.filter(city=>{return city.name.toLowerCase() == this.leadquestionnaireForm.controls['city'].value.toLowerCase()}).length==0){
          this.leadquestionnaireForm.controls['city'].setValue('Others');
          if(note_records.new_city_value){
          this.leadquestionnaireForm.controls['new_city_value'].setValue(note_records.new_city_value);
          }else{
            this.leadquestionnaireForm.controls['new_city_value'].setValue(note_records.city);
          }
          this.getSocietyList( this.leadquestionnaireForm.controls['new_city_value'].value,note_records);
          document.getElementById("citybuilding").style.display = 'block';
          this.retainCity = note_records.new_city_value;
        }
        else{
          this.getSocietyList(this.leadquestionnaireForm.controls['city'].value,note_records);
        }
      }else{
          if(note_records.location){
            this.leadquestionnaireForm.controls['location'].setValue(note_records.location);
            if(!this.leadquestionnaireForm.controls['location'].value){
              this.leadquestionnaireForm.controls['location'].setValue('')
            }
            else if(this.societyList.filter(locality=>{return locality.locality == this.leadquestionnaireForm.controls['location'].value}).length==0){
              
            // if(this.leadquestionnaireForm.controls['location'].value == 'Others'){
              this.leadquestionnaireForm.controls['location'].setValue('Others');
              if(note_records.new_locality_value){
                this.leadquestionnaireForm.controls['new_locality_value'].setValue(note_records.new_locality_value);
              }else{
                this.leadquestionnaireForm.controls['new_locality_value'].setValue(note_records.location);
              }
              document.getElementById("localitybuilding").style.display = 'block';
              this.retainLocality = note_records.new_locality_value;
            }
           }
          
          if(note_records.society){
            this.leadquestionnaireForm.controls['society'].setValue(note_records.society);
            if(!this.leadquestionnaireForm.controls['society'].value){
              this.leadquestionnaireForm.controls['society'].setValue('');
            }
            else if(this.societyList.filter(society=>{return society.buiding_name == this.leadquestionnaireForm.controls['society'].value}).length==0){
            // if(this.leadquestionnaireForm.controls['society'].value == 'Others'){
              this.leadquestionnaireForm.controls['society'].setValue('Others');
              if(note_records.new_society_value){
                this.leadquestionnaireForm.controls['new_society_value'].setValue(note_records.new_society_value);
              }else{
                this.leadquestionnaireForm.controls['new_society_value'].setValue(note_records.society);
              }
              document.getElementById("societybuilding").style.display = 'block';
              this.retainAddress = note_records.new_society_value;
            }
            else{
              this.leadquestionnaireForm.controls['building_crawler_id'].setValue(note_records.building_crawler_id);
              this.getSocietyWebData(this.leadquestionnaireForm.controls['building_crawler_id'].value);
            }
          }
      }
      
      if(note_records.project_type){
        this.leadquestionnaireForm.controls['project_type'].setValue(note_records.project_type);
      }else{
        this.leadquestionnaireForm.controls['project_type'].setValue("");
      }
      this.leadquestionnaireForm.controls['accomodation_type'].setValue(note_records.accomodation_type);
      this.leadquestionnaireForm.controls['home_type'].setValue(note_records.home_type);
      // this.leadquestionnaireForm.controls['society'].setValue(note_records.society);
      
      
      if(note_records.visit_ec_date){
        this.leadquestionnaireForm.controls['visit_ec_date'].setValue(note_records.visit_ec_date);
        this.leadquestionnaireForm.controls['visit_ec'].setValue(true);
        this.selectstatus=true;
        this.ref.detectChanges();
      }else{
        this.selectstatus=false;
        if(note_records.visit_ec===null || note_records.visit_ec===''){
          this.leadquestionnaireForm.controls['visit_ec'].setValue(null);
        }
        else{
          this.leadquestionnaireForm.controls['visit_ec'].setValue(false);
        }
      }
      if(note_records.site_measurement_date){
        this.leadquestionnaireForm.controls['site_measurement_date'].setValue(note_records.site_measurement_date);
        this.leadquestionnaireForm.controls['site_measurement_required'].setValue(true);
        this.selectstatusforsite = true;
      }else {
        this.selectstatusforsite = false;
        if(note_records.site_measurement_required===null || note_records.site_measurement_required===''){
          this.leadquestionnaireForm.controls['site_measurement_required'].setValue(null);
        }
        else{
          this.leadquestionnaireForm.controls['site_measurement_required'].setValue(false);
        }
        
      }
      this.leadquestionnaireForm.controls['lead_source'].setValue(note_records.lead_source);
      this.leadquestionnaireForm.controls['possession_status'].setValue(note_records.possession_status);
      this.leadquestionnaireForm.controls['possession_status_date'].setValue(note_records.possession_status_date);
      this.leadquestionnaireForm.controls['home_value'].setValue(note_records.home_value);
      this.leadquestionnaireForm.controls['budget_value'].setValue(note_records.budget_value);
      this.leadquestionnaireForm.controls['have_homeloan'].setValue(note_records.have_homeloan);
      this.leadquestionnaireForm.controls['purpose_of_property'].setValue(note_records.purpose_of_property);
      this.leadquestionnaireForm.controls['call_back_day'].setValue(note_records.call_back_day);
      this.leadquestionnaireForm.controls['call_back_time'].setValue(note_records.call_back_time);
      this.leadquestionnaireForm.controls['have_floorplan'].setValue(note_records.have_floorplan);
      // this.leadquestionnaireForm.controls['site_measurement_required'].setValue(note_records.site_measurement_required);
      // this.leadquestionnaireForm.controls['visit_ec'].setValue(note_records.visit_ec);
      this.leadquestionnaireForm.controls['lead_generator'].setValue(note_records.lead_generator);
      this.leadquestionnaireForm.controls['additional_comments'].setValue(note_records.additional_comments);
      this.leadquestionnaireForm.controls['lead_floorplan'].setValue(note_records.lead_floorplan);
      this.leadquestionnaireForm.controls['cm_comments'].setValue(note_records.cm_comments);
      this.leadquestionnaireForm.controls['designer_comments'].setValue(note_records.designer_comments);
      this.leadquestionnaireForm.controls['type_of_space'].setValue(note_records.type_of_space);
      this.leadquestionnaireForm.controls['status_of_property'].setValue(note_records.status_of_property);
      this.leadquestionnaireForm.controls['project_commencement_date'].setValue(note_records.project_commencement_date);
      this.leadquestionnaireForm.controls['intended_date'].setValue(note_records.intended_date);
      this.leadquestionnaireForm.controls['good_time_to_call'].setValue(note_records.good_time_to_call);
      this.leadquestionnaireForm.controls['address_of_site'].setValue(note_records.address_of_site);
      this.leadquestionnaireForm.controls['layout_and_photographs_of_site'].setValue(note_records.layout_and_photographs_of_site);
      this.leadquestionnaireForm.controls['area_of_site'].setValue(note_records.area_of_site);
      
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
          this.leadquestionnaireForm.controls['scope_of_work'].setValue(note_records.scope_of_work[0]);
        }
      }

      


      // if(note_records.site_layouts!=null){
      //   if(note_records.site_layouts.length>0){
      //     this.leadquestionnaireForm.controls['site_layouts'].setValue(note_records.site_layouts);
      //   }
      // }


      if(note_records.have_floorplan == 'Yes'){
        if(document.getElementById('floorplanQuestionnaire')){
          document.getElementById('floorplanQuestionnaire').style.display = 'block';
        }
      }
      if(note_records.have_floorplan == 'No'){
        if(document.getElementById('floorplanQuestionnaire')){
          document.getElementById('floorplanQuestionnaire').style.display = 'none';
        }
      }
      if(note_records.possession_status=='Awaiting Possession'){
        if(document.getElementById('possesiondateupdate')){
          document.getElementById('possesiondateupdate').style.display = 'block';
        }
      }
      if(note_records.possession_status=='Possession Taken'){
        if(document.getElementById('possesiondateupdate')){
          document.getElementById('possesiondateupdate').style.display = 'none';
        }
      }
    }else
    {
        this.selectstatus=false;
        this.selectstatusforsite=false
        this.vaale='';
        this.localityChangeValue='';
    }

        if( this._leadDetails.lead_status == 'delayed_possession')
        {
            this.finalValStatus = this._leadDetails.lead_status; 


            

        }
        else{
            this.finalValStatus = '';

        } 
        $("#startDate").val(note_records.possession_status_date) ;

  }
  setFormFieldRequired(formgrp){
    formgrp.controls['society'].setValidators([Validators.required]);
    formgrp.controls['location'].setValidators([Validators.required]);
    formgrp.controls['city'].setValidators([Validators.required]);
    formgrp.controls['pincode'].setValidators([Validators.required]);
    formgrp.controls['project_type'].setValidators([Validators.required]);
    formgrp.controls['call_back_day'].setValidators([Validators.required]);
    formgrp.controls['intended_date'].setValidators([Validators.required]);
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
      this.ref.detectChanges();
      formgrp.controls['type_of_space'].clearValidators();
      formgrp.controls['status_of_property'].clearValidators();
      formgrp.controls['project_commencement_date'].clearValidators();
      formgrp.controls['address_of_site'].clearValidators();
      formgrp.controls['layout_and_photographs_of_site'].clearValidators();
      //formgrp.controls['area_of_site'].clearValidators();
    } else if(formgrp.controls['project_type'].value=='Offices'){
      formgrp.controls['type_of_space'].setValidators([Validators.required]);
      formgrp.controls['status_of_property'].setValidators([Validators.required]);
      formgrp.controls['project_commencement_date'].setValidators([Validators.required]);
      formgrp.controls['address_of_site'].setValidators([Validators.required]);
      formgrp.controls['layout_and_photographs_of_site'].setValidators([Validators.required]);
      formgrp.controls['area_of_site'].setValidators([Validators.required]);
      this.ref.detectChanges();
      formgrp.controls['accomodation_type'].clearValidators();
      formgrp.controls['have_homeloan'].clearValidators();
      formgrp.controls['home_type'].clearValidators();
      formgrp.controls['home_value'].clearValidators();
    }
    formgrp.controls['society'].updateValueAndValidity();
    formgrp.controls['location'].updateValueAndValidity();
    formgrp.controls['city'].updateValueAndValidity();
    formgrp.controls['pincode'].updateValueAndValidity();
    formgrp.controls['project_type'].updateValueAndValidity();
    formgrp.controls['call_back_day'].updateValueAndValidity();
    formgrp.controls['intended_date'].updateValueAndValidity();
    formgrp.controls['good_time_to_call'].updateValueAndValidity();
    formgrp.controls['site_measurement_required'].updateValueAndValidity();
    formgrp.controls['accomodation_type'].updateValueAndValidity();
    formgrp.controls['home_type'].updateValueAndValidity();
    formgrp.controls['scope_of_work'].updateValueAndValidity();
    formgrp.controls['have_homeloan'].updateValueAndValidity();
    formgrp.controls['possession_status'].updateValueAndValidity();
    formgrp.controls['type_of_space'].updateValueAndValidity();
    formgrp.controls['status_of_property'].updateValueAndValidity();
    formgrp.controls['project_commencement_date'].updateValueAndValidity();
    formgrp.controls['address_of_site'].updateValueAndValidity();
    formgrp.controls['layout_and_photographs_of_site'].updateValueAndValidity();

    formgrp.controls['area_of_site'].updateValueAndValidity();

    this.ref.detectChanges();
    formgrp.controls['budget_value'].updateValueAndValidity();
    formgrp.controls['home_value'].updateValueAndValidity();
    formgrp.controls['lead_questionaire_items_attributes'].updateValueAndValidity();
    formgrp.controls['new_society_value'].updateValueAndValidity();
    formgrp.controls['new_locality_value'].updateValueAndValidity();
    formgrp.controls['new_city_value'].updateValueAndValidity();

    var elems=document.getElementsByClassName('hideAsteriskIcon');
    for(var i=0;i<elems.length;i++){
      elems[i].setAttribute('style','display:inline');
    }
  }
  removeFormFieldRequired(formgrp){
    formgrp.controls['society'].clearValidators();
    formgrp.controls['location'].clearValidators();
    formgrp.controls['city'].clearValidators();
    formgrp.controls['pincode'].clearValidators();
    formgrp.controls['project_type'].clearValidators();
    formgrp.controls['call_back_day'].clearValidators();
    formgrp.controls['intended_date'].clearValidators();
    formgrp.controls['accomodation_type'].clearValidators();
    formgrp.controls['home_type'].clearValidators();
    formgrp.controls['scope_of_work'].clearValidators();
    formgrp.controls['have_homeloan'].clearValidators();
    formgrp.controls['possession_status'].clearValidators();
    formgrp.controls['possession_status_date'].clearValidators();
    formgrp.controls['type_of_space'].clearValidators();
    formgrp.controls['status_of_property'].clearValidators();
    formgrp.controls['project_commencement_date'].clearValidators();
    formgrp.controls['address_of_site'].clearValidators();
    formgrp.controls['layout_and_photographs_of_site'].clearValidators();
    formgrp.controls['area_of_site'].clearValidators();
    formgrp.controls['budget_value'].clearValidators();
    formgrp.controls['home_value'].clearValidators();
    formgrp.controls['new_society_value'].clearValidators();
    formgrp.controls['new_locality_value'].clearValidators();
    formgrp.controls['new_city_value'].clearValidators();

    formgrp.controls['possession_status_date'].updateValueAndValidity();
    formgrp.controls['society'].updateValueAndValidity();
    formgrp.controls['location'].updateValueAndValidity();
    formgrp.controls['city'].updateValueAndValidity();
    formgrp.controls['pincode'].updateValueAndValidity();
    formgrp.controls['project_type'].updateValueAndValidity();
    formgrp.controls['call_back_day'].updateValueAndValidity();
    formgrp.controls['call_back_time'].updateValueAndValidity();
    formgrp.controls['intended_date'].updateValueAndValidity();
    formgrp.controls['good_time_to_call'].updateValueAndValidity();
    formgrp.controls['site_measurement_required'].updateValueAndValidity();
    formgrp.controls['accomodation_type'].updateValueAndValidity();
    formgrp.controls['lead_questionaire_items_attributes'].updateValueAndValidity();
    formgrp.controls['home_type'].updateValueAndValidity();
    formgrp.controls['scope_of_work'].updateValueAndValidity();
    formgrp.controls['have_homeloan'].updateValueAndValidity();
    formgrp.controls['possession_status'].updateValueAndValidity();
    formgrp.controls['type_of_space'].updateValueAndValidity();
    formgrp.controls['status_of_property'].updateValueAndValidity();
    formgrp.controls['project_commencement_date'].updateValueAndValidity();
    formgrp.controls['address_of_site'].updateValueAndValidity();
    formgrp.controls['layout_and_photographs_of_site'].updateValueAndValidity();
    formgrp.controls['area_of_site'].updateValueAndValidity();
    formgrp.controls['budget_value'].updateValueAndValidity();
    formgrp.controls['home_value'].updateValueAndValidity();
    formgrp.controls['new_society_value'].updateValueAndValidity();
    formgrp.controls['new_locality_value'].updateValueAndValidity();
    formgrp.controls['new_city_value'].updateValueAndValidity();
  
    var elems=document.getElementsByClassName('hideAsteriskIcon')
    for(var i=0;i<elems.length;i++){
      elems[i].setAttribute('style','display:none');
    }
  }

  updateRecordNotesQuestionnaire(leadId,data){
      
      data['lead_questionaire_items_attributes']= this.checkedList ;
      
      if(data['project_type']=='Offices'){
        data.have_homeloan=null;
        data.home_type = null;
        data.accomodation_type=null;
        data.home_value=null;
        data.have_floorplan = null;
        data['lead_floorplan']=null;
      } else if (data['project_type']=='Residential') {
        data.type_of_space=null;
        data.status_of_property=null;
        data.project_commencement_date=null;
        data.address_of_site=null;
        data.layout_and_photographs_of_site=null;
        //data.area_of_site=null;
        data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
      }
      else if(!data['project_type'] || data['project_type']=='null'){
        data.type_of_space=null;
        data.status_of_property=null;
        data.project_commencement_date=null;
        data.address_of_site=null;
        data.layout_and_photographs_of_site=null;
        data.area_of_site=null;
        data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
    }
        if(this.leadquestionnaireForm.controls['city'].value == 'Other'){
            this.leadquestionnaireForm.controls['city'].setValue(this.city_others);
            data['city']=this.city_others;
        }
        this.loaderService.display(true);
        this.leadquestionnaireForm.controls['ownerable_id'].setValue(leadId);
        if(this.userQuestionnaireDetails !=null && this.userQuestionnaireDetails.length!=0){
          var noteRecordId = this.userQuestionnaireDetails.id || this.userQuestionnaireDetails[0].id;
          data['scope_of_work']=[data['scope_of_work']];
          if(data['project_type']=='Offices' && data['layout_and_photographs_of_site']=='Yes'){
            data['site_layouts']=this.attached_files;
          }
          if(data['lead_floorplan'] == '/images/original/missing.png'){
            data['lead_floorplan'] = "";
          }
          if(!this.showAlternateForm || (this.showAlternateForm)){ 
            data['alternate_contacts']=this.alternateNumberMasterForm.value.alternate_contacts;
          }
          data['possession_status_date'] = $('#startDate').datepicker().val();
 
          data['intended_date']=$('#startDateNewpro').datepicker().val();
 
  	    	this.leadService.updateRecordNotesQuestionnaire(leadId,data,noteRecordId).subscribe(
  		        res => {
  		          this.leadquestionnaireForm.reset();
  		          this.questionnaire_floorplan_basefile = undefined;
  		          this.floorplan_attachment_file = undefined;
  		          this.city_others=undefined;
                this.attached_files = [];
                (<HTMLInputElement>document.getElementById('floorplanupload_input')).value="";
                (<HTMLInputElement>document.getElementById('fileupload')).value="";
                this.closeModal('Updated successfully!');
                this.loaderService.display(false);
              },
              err => {
                
                this.erroralert = true;
                this.errorMessage = JSON.parse(err['_body']).message;
                setTimeout(function() {
                       this.erroralert = false;
                  }.bind(this), 10000);
                this.loaderService.display(false);
              }
            );

        }


        if(this.userQuestionnaireDetails == null || (this.userQuestionnaireDetails !=null && this.userQuestionnaireDetails.length==0)){
          // data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
          data['scope_of_work']=[data['scope_of_work']];
          if(data['project_type']=='Offices' && data['layout_and_photographs_of_site']=='Yes'){
            data['site_layouts']=this.attached_files;
          }
          if(!this.showAlternateForm || (this.showAlternateForm)){ 
            data['alternate_contacts']=this.alternateNumberMasterForm.value.alternate_contacts;
          }

          this.leadService.postRecordNotesQuestionnaire(this._leadDetails.id,data).subscribe(
              res => {
                  this.floorplan_attachment_file = undefined;
                  this.loaderService.display(false);
                  this.leadquestionnaireForm.reset();
                  (<HTMLInputElement>document.getElementById('floorplanupload_input')).value="";
                  (<HTMLInputElement>document.getElementById('fileupload')).value="";
                  this.attached_files = [];
                  this.checkedList = [];
                  this.closeModal('Form submitted successfully!');
                  this.successalert = true;
                  this.successMessage = "Form submitted successfully!";
                  setTimeout(function() {
                    this.successalert = false;
                  }.bind(this), 10000);
              },
              err => {
                
                 this.erroralert = true;
                this.errorMessage = JSON.parse(err['_body']).message;
                this.loaderService.display(false);
                setTimeout(function() {
                    this.erroralert = false;
                  }.bind(this), 10000);
              }
            );
        }
      this.localityWebData=null;
  }
  possesionStatusSelected(val,formName) {
    
      if(val == 'Awaiting Possession' && formName=='updateQuestionnaire') {
        
        if($("#possesiondateupdate")){
          $("#possesiondateupdate").css("display", "block");
        }
        if(this._leadDetails.lead_status=='qualified'){
          this.leadquestionnaireForm.controls['possession_status_date'].setValidators([Validators.required]);
          this.leadquestionnaireForm.controls['possession_status_date'].updateValueAndValidity();
        } else {
          this.leadquestionnaireForm.controls['possession_status_date'].clearValidators();
          this.leadquestionnaireForm.controls['possession_status_date'].updateValueAndValidity();
        }
      }
      if(val =='Possession Taken' && formName=='updateQuestionnaire') {
        
        if($("#possesiondateupdate")){
          $("#possesiondateupdate").css("display", "none");
        }
        
        this.leadquestionnaireForm.controls['possession_status_date'].setValue(undefined);
        this.leadquestionnaireForm.controls['possession_status_date'].clearValidators();
        this.leadquestionnaireForm.controls['possession_status_date'].updateValueAndValidity();
      }
  }

  ngAfterViewInit(){
    // 
  }
  setLeadStatus2(value) {
    

    if(value=='follow_up') {
      this.leadquestionnaireForm.controls['follow_up_time'].setValidators([Validators.required]);
      this.leadquestionnaireForm.controls['follow_up_time'].updateValueAndValidity();
      this.leadquestionnaireForm.controls['remark'].setValidators([Validators.required]);
      this.leadquestionnaireForm.controls['remark'].updateValueAndValidity();
    } else {
      this.leadquestionnaireForm.controls['follow_up_time'].clearValidators();
      this.leadquestionnaireForm.controls['follow_up_time'].updateValueAndValidity();
      this.leadquestionnaireForm.controls['remark'].clearValidators();
      this.leadquestionnaireForm.controls['remark'].updateValueAndValidity();
    }
    if(value=='qualified'){
      this.setFormFieldRequired(this.leadquestionnaireForm);
    } else {
      this.removeFormFieldRequired(this.leadquestionnaireForm);
 
    }
  }
  reasonForLostDropdownChange1(val){
    if(val=='others'){
      this.leadquestionnaireForm.controls['lost_remark'].setValidators([Validators.required]);
    } else {
      this.leadquestionnaireForm.controls['lost_remark'].setValue("");
      this.leadquestionnaireForm.controls['lost_remark'].validator=null;
    }
    this.leadquestionnaireForm.controls['lost_remark'].updateValueAndValidity();
  }

  addLeadQuestionnaire(data){
    this.leadquestionnaireForm.controls['ownerable_id'].setValue(this._leadDetails.id);
    this.leadquestionnaireForm.controls['customer_name'].setValue(this._leadDetails.name);
    this.leadquestionnaireForm.controls['phone'].setValue(this._leadDetails.contact);
    if(this.leadquestionnaireForm.controls['city'].value == 'Other'){
      this.leadquestionnaireForm.controls['city'].setValue(this.city_others);
      data['city']=this.city_others;
    }
    if(!this.showAlternateForm || (this.showAlternateForm)){ 
      data['alternate_contacts']=this.alternateNumberMasterForm.value.alternate_contacts;
    }
    data['customer_name'] = this._leadDetails.name;
    data['phone'] = this._leadDetails.contact;
    data['ownerable_id'] = this._leadDetails.id;
    data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
    data['scope_of_work']=[data['scope_of_work']];
    data['lead_questionaire_items_attributes']= this.checkedList ;
    var obj= {
      lead_status: data.lead_status,
      follow_up_time : data.follow_up_time,
      remark: data.remark,
      lost_reason: data.lost_reason,
      lost_remark : data.lost_remark,
      pincode: this.leadquestionnaireForm.controls['pincode'].value,
      alternate_contacts:data['alternate_contacts']
    }
    if(data['project_type']=='Offices' && data['layout_and_photographs_of_site']=='Yes'){
      data['site_layouts']=this.attached_files;
    }
    
    if( this.leadquestionnaireForm.controls['lead_status'].value == 'qualified' && (this.leadquestionnaireForm.controls['pincode'].value=='' || this.leadquestionnaireForm.controls['pincode'].value==null || this.leadquestionnaireForm.controls['pincode'].value== undefined)){
      this.errorMessage='Pincode is mandatory';
      this.erroralert = true;
      setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 10000);
    } else {
      this.loaderService.display(true);
      this.leadService.updateLeadStatus(obj,this._leadDetails.id).subscribe(
        res => {
          this.leadService.postRecordNotesQuestionnaire(this._leadDetails.id,data).subscribe(
            res => {
              this.leadquestionnaireForm.reset();
              this.questionnaire_floorplan_basefile = undefined;
              this.floorplan_attachment_file = undefined;
              this.city_others  = undefined;
              this.attached_files = [];
              this.selectedMoment.setDate(this.selectedMoment.getDate() );
              // this.selectedMoment2.setDate(this.selectedMoment2.getDate() );
              this.closeModal('Form submitted successfully!');
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
        },
        err => {
          
          this.loaderService.display(false);
        }
      );
    }
  }

  onChangeOfProjType(event){
    if(this.leadquestionnaireForm.controls['lead_status'].value=='qualified'){
      this.setFormFieldRequired(this.leadquestionnaireForm);
    }
  }
  Newstatus;
  checkdate;
  checkMonth;
  checkYear;
  finalVal:string;


  // Method which is called whenever input type date is focused to open calander
  newDate;
  delayedVal:boolean = false;
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
                              $('#delyed').removeClass('d-none');
                              $('#normalStat').addClass('d-none');
         
                            }
                            else{
                                $('#delyed').addClass('d-none');
                                $('#normalStat').removeClass('d-none');

                            }
        
                   

                        }
            
            
          
        }
    }).focus(function() {
        $("#datepick").datepicker("show");
    }).focus();





  }
  // To set  the value of possession date in leadQuestionnaire form
  taskChange(){
    this.leadquestionnaireForm.controls['possession_status_date'].setValue($('#startDate').val());
    var startdate =$('#startDate').val();
    var endDate = new Date("01/" + startdate);
    
    var date = new Date(); //taking current date and time
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setMonth(firstDay.getMonth()+2);
    var curMonth =  new Date(firstDay.toDateString());
    if((((+endDate) - (+curMonth)) > 0) || this.delayedVal == true){
      $('#delyed').removeClass('d-none');
      $('#normalStat').addClass('d-none');
      
      

    }
    else{
        $('#delyed').addClass('d-none');
        $('#normalStat').removeClass('d-none');

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
    var startdate =$('#startDate').val();
    var endDate = new Date("01/" + startdate);
    
    if((((+endDate) - (+curMonth)) > 0) || this.delayedVal == true){
      $('#delyed').removeClass('d-none');
      $('#normalStat').addClass('d-none');
      

    }
    else{
        $('#delyed').addClass('d-none');
        $('#normalStat').removeClass('d-none');

    }
    


  }



  addAlternateNumberForm() : void{
    this.showAlternateForm = true;
        (<FormArray>this.alternateNumberMasterForm.controls['alternate_contacts']).push(this.createAlternateNumberElement());
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
      this.leadService.getcaluclatordatas().subscribe(res =>
        {
          this.getcaluclatordata = res.questionaire_master_items;
          this.searchList = res.questionaire_master_items;
          this.masterLeadItemsCopy = this.getcaluclatordata;
        })
    }
    
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
    $("#otherLeadItem").removeClass("hide");
    $("#submitOtherLeadBtn").removeClass("hide");
    $("#addMoreLeadItemBtn").addClass("hide");
  }
  
  SaveOtherLeadItem(event)
  {
    var name = $("#otherLeadItem").val();
    if(name.length > 0){
      this.checkedList.push({"name": name, "price": 0, "quantity": Math.abs(1)})
      $("#otherLeadItem").val("").addClass("hide");
      $("#submitOtherLeadBtn").addClass("hide");
      $("#addMoreLeadItemBtn").removeClass("hide");
      this.budgetcaluclatototal();
    }else{
      alert("cannot be empty");
      $("#otherLeadItem").removeClass("hide")
      $("#submitOtherLeadBtn").removeClass("hide");
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

  searchList
  searchquestionarrieItem(event){
    var searchedItem = [];
    this.searchList=this.getcaluclatordata;
    if(event.target.value){
      this.searchList.forEach(function(element){
        if(element.name.toLowerCase().match(new RegExp(event.target.value.toLowerCase(), 'g'))){

          searchedItem.push(element);
        }
      })
    }

    if(searchedItem.length >= 1){
      this.searchstatus = true;
      document.getElementById("notfound").style.display = "none";
      this.searchList = searchedItem;
    }
    else
    {
    this.searchstatus = false;
     document.getElementById("notfound").style.display = "block";
     document.getElementById("notfound").style.color = "crimson";
     this.searchList = searchedItem;
   
    }
    if(this.searchname == "")
    {
      document.getElementById("notfound").style.display = "none";
      this.searchList=this.getcaluclatordata;
      this.searchstatus = true;
    }
  }
  hide()
  {
    document.getElementById("notfound").style.display = "none";
    this.searchname = '';
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
    this.societySearch(this.leadquestionnaireForm.controls['city'].value,searchWord);
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

  // locality_building;
  // buildingList=[];
  // localityList=[];
  // combinedList=[];
  societyList=[];
  getSocietyList(city_name,note_records){
    this.loaderService.display(true);
    this.societyList =[];
    let society_search_word="";
    if(note_records && (note_records.society && note_records.society!='Others')){
      society_search_word = note_records.society
    }
    this.leadService.getLocalityBuildingDetails(city_name,society_search_word).subscribe(
      res=>{

        this.societyList = res.building_crawlers;
        if(note_records){
          this.leadquestionnaireForm.controls['location'].setValue(note_records.location);

          
          
          if(!this.leadquestionnaireForm.controls['location'].value){
            this.leadquestionnaireForm.controls['location'].setValue('');
          }
          else if(this.leadquestionnaireForm.controls['location'].value == 'Others' || this.societyList.filter(locality=>{return locality.locality == this.leadquestionnaireForm.controls['location'].value}).length==0){
            
            this.leadquestionnaireForm.controls['location'].setValue('Others');
            if(note_records.new_locality_value){
              this.leadquestionnaireForm.controls['new_locality_value'].setValue(note_records.new_locality_value);
            }else{
              this.leadquestionnaireForm.controls['new_locality_value'].setValue(note_records.location);
            }
            document.getElementById("localitybuilding").style.display = 'block';
            this.retainLocality = note_records.new_locality_value;
          }
          
          
          this.leadquestionnaireForm.controls['society'].setValue(note_records.society);
          
          if(!this.leadquestionnaireForm.controls['society'].value){
            this.leadquestionnaireForm.controls['society'].setValue('');
          }
          else if(this.leadquestionnaireForm.controls['society'].value == 'Others' || this.societyList.filter(society=>{return society.building_name == this.leadquestionnaireForm.controls['society'].value}).length==0){
            this.leadquestionnaireForm.controls['society'].setValue('Others');
            if(note_records.new_society_value){
              this.leadquestionnaireForm.controls['new_society_value'].setValue(note_records.new_society_value);
            }else{
              this.leadquestionnaireForm.controls['new_society_value'].setValue(note_records.society);
            }
            document.getElementById("societybuilding").style.display = 'block';
            this.retainAddress = note_records.new_society_value;
          }
          else{
            this.getSocietyWebData(note_records.building_crawler_id);
          }
        }
        this.loaderService.display(false);
      },
      err =>{
        if(note_records){
          this.leadquestionnaireForm.controls['location'].setValue(note_records.location);

          
          
          if(!this.leadquestionnaireForm.controls['location'].value){
            
          }
          else if(this.leadquestionnaireForm.controls['location'].value == 'Others' || this.societyList.filter(locality=>{return locality.locality == this.leadquestionnaireForm.controls['location'].value}).length==0){
            
            this.leadquestionnaireForm.controls['location'].setValue('Others');
            if(note_records.new_locality_value){
              this.leadquestionnaireForm.controls['new_locality_value'].setValue(note_records.new_locality_value);
            }else{
              this.leadquestionnaireForm.controls['new_locality_value'].setValue(note_records.location);
            }
            document.getElementById("localitybuilding").style.display = 'block';
            this.retainLocality = note_records.new_locality_value;
          }
          
          
          this.leadquestionnaireForm.controls['society'].setValue(note_records.society);
          
          if(!this.leadquestionnaireForm.controls['society'].value){

          }
          else if(this.leadquestionnaireForm.controls['society'].value == 'Others' || this.societyList.filter(society=>{return society.building_name == this.leadquestionnaireForm.controls['society'].value}).length==0){
            this.leadquestionnaireForm.controls['society'].setValue('Others');
            if(note_records.new_society_value){
              this.leadquestionnaireForm.controls['new_society_value'].setValue(note_records.new_society_value);
            }else{
              this.leadquestionnaireForm.controls['new_society_value'].setValue(note_records.society);
            }
            document.getElementById("societybuilding").style.display = 'block';
            this.retainAddress = note_records.new_society_value;
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

  closeFloorplanModal(){
    $('#floorplanModal').modal('hide');
  }
 
  // Method which is called whenever input type date is focused to open calander
  DateForWorkStart(){
    $('#startDateNewpro').datepicker( {
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
              $('#delyed1').removeClass('d-none');
              $('#normalStat1').addClass('d-none');
            }
            else{
                $('#delyed1').addClass('d-none');
                $('#normalStat1').removeClass('d-none');
            }
          }
        }
    }).focus(function() {
        $("#startDateNewpro").datepicker("show");
    }).focus();

   }
  // To set  the value of Intended date in leadQuestionnaire form
  workChange(){
    this.leadquestionnaireForm.controls['intended_date'].setValue($('#startDateNewpro').val());
    var startdate =$('#startDateNewpro').val();
    var endDate = new Date("01/" + startdate);
    
    var date = new Date(); //taking current date and time
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setMonth(firstDay.getMonth()+2);
    var curMonth =  new Date(firstDay.toDateString());
    if((((+endDate) - (+curMonth)) > 0) || this.delayedVal == true){
      $('#delyed1').removeClass('d-none');
      $('#normalStat1').addClass('d-none');
    }
    else{
        $('#delyed1').addClass('d-none');
        $('#normalStat1').removeClass('d-none');
    }
  }
 
}