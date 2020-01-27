import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
import { DesignerService } from '../designer.service';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import { CalenderService } from '../../calender/calender.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FormBase } from '../../../shared/dynamic-form/form-base';
import { DynamicFormService } from '../../../shared/dynamic-form/dynamic-form.service';
declare var Layout:any;
declare var $:any;

@Component({
  selector: 'app-wip',
  templateUrl: './wip.component.html',
  styleUrls: ['./wip.component.css'],
  providers: [ProjectService,DesignerService, LeadService,CalenderService,DynamicFormService]
})
export class WipComponent implements OnInit {

  observableProjects: Observable<Project[]>
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;
  role:string;
  designerId:string;
  customerId : any;
  usersList:any;
  statusDetails: any = {};
  loc:any;
  meetingform: FormGroup;
  updatemeetingform: FormGroup;
  next_scheduled_event:any;
  public leads:any = []
  public events:any = []
  public currentuser:any = localStorage.getItem("userId");
  public calElem:any = $('#calendar')
  public currentEvent:any
  public latestevent:any
  public projectUsers:any
  customerDetails:any;
  customer_status:string;
  custom_status:string;
  customerStatusUpdateForm : FormGroup;
  leadquestionnaire: FormGroup;
  designerBookingForm1 : FormGroup;
  designerBookingForm2:FormGroup;
  filtercol1Val:any = 'all';
  headers_res;
  per_page;
  total_page;
  current_page;
  call_back = 'yes';
  data_flag = false;
  todayDate = new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19);

  // Date
  date = new Date();
  y = this.date.getFullYear();
  m = this.date.getMonth();
  from_date:any = new Date(this.y, this.m, 1);
  to_date:any = new Date(this.y, this.m + 1, 0);
  showAlternateForm: boolean;
  staticFields: any;
  alternateNumberForm: FormGroup;
  @Input() fields: FormBase<any>[] = [];


  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private projectService:ProjectService,
    private loaderService : LoaderService,
    private designerService : DesignerService,
    private formBuilder: FormBuilder,
    private leadService:LeadService,
    public calenderService : CalenderService,
    private dynamicFormService: DynamicFormService
  ) { }

  ngOnInit() {
    this.loaderService.display(true);
    this.role = localStorage.getItem('user');
    this.designerId = localStorage.getItem('userId');
     this.route.queryParams.subscribe(params => {
        this.custom_status = params['customer_status'];
      });
    this.getWipList(1);
    // this.loaderService.display(false);
    // this.getUserListForDesigner(1);
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

    this.meetingform = new FormGroup({
      project: new FormControl(null, Validators.required),
      ownerable_type: new FormControl(null, Validators.required),
      agenda: new FormControl(null, Validators.required),
      contact_type: new FormControl(null, Validators.required),
      description: new FormControl(),
      scheduled_at: new FormControl(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19)),
      location: new FormControl(),
      email: new FormControl(null, Validators.required),
    });

    this.updatemeetingform = new FormGroup({
      project: new FormControl(null, Validators.required),
      ownerable_type: new FormControl(null, Validators.required),
      agenda: new FormControl(null, Validators.required),
      contact_type: new FormControl(null, Validators.required),
      description: new FormControl(),
      scheduled_at: new FormControl(),
      location: new FormControl(),
      remark: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
    });

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

      this.fields=[];
      this.staticFields.forEach(elem =>{
          this.fields.push(elem);
      });
      this.alternateNumberForm = this.dynamicFormService.toFormGroup(this.fields);
  }

  getWipList(page?,search?,columnName?,formDate?,toDate?){
    this.loaderService.display(true);
    this.designerService.getWipLeads(this.designerId,this.custom_status, page,search,columnName,formDate,toDate).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.usersList = res.leads;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
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
    search_value;
    onKey(event: any) { // without type info
      this.search_value = event.target.value ;
      var  i=0;
      if(true){
        this.getWipList('',this.search_value);
        i++;
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


  onStatusChange(customerId,ProjectId,status){
      this.call_back = 'yes';
      this.statusDetails["customer_status"] = status;
      // this.statusDetails["customer_remarks"] = "";
      // this.statusDetails["customer_meeting_time"] = "";
      this.statusDetails["customer_id"] = customerId;
      this.statusDetails['project_id'] = ProjectId;

      this.loaderService.display(true);
      if(this.statusDetails["customer_status"] == "follow_up"){
        $("#followup-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
        this.loaderService.display(false);
        $("#statusModal").modal("show");
      }
      else if(this.statusDetails["customer_status"] == "on_hold"){
        this.call_back = 'yes';
        // $("#onhold-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
        this.loaderService.display(false);
        $("#statusModal1").modal("show");
      }
      else if(this.statusDetails["customer_status"] == "inactive"){
        
        this.loaderService.display(false);
        $("#statusModal2").modal("show");
      }
      else{
        this.updateNewStatus();
      }
    }

  onCallbackChange(){
      this.loaderService.display(true);
      $("#statusModal").modal("hide");
      this.statusDetails["customer_meeting_time"] = $("#onhold-details").val();
      this.statusDetails['remarks']= $("#followup_remarks").val();
      this.statusDetails['reason_for_lost']=$("#inactive_reason").val();
      this.dropdownDropType='Select Reason';
      this.updateNewStatus();
    }
  onCallbackChange1(){
      this.loaderService.display(true);
      $("#statusModal1").modal("hide");
      this.statusDetails["customer_meeting_time"] = this.onhold_date;
      this.statusDetails['remarks']= $("#followup_remarks").val();
      this.statusDetails['reason_for_lost']=$("#inactive_reason").val();
      if(this.call_back == 'no'){
        this.statusDetails["customer_status"] = this.statusChange;
        this.statusDetails["customer_id"] = this.custChange;
        this.statusDetails['project_id'] = this.projectIdChange;

      }
      
      this.updateNewStatus();
    }

  onCallbackChange2(){
      this.loaderService.display(true);
      $("#statusModal2").modal("hide");
      this.statusDetails['remarks']= $("#inactive_remarks").val();
      this.statusDetails['reason_for_lost']=$("#inactive_reason").val();
      if(this.call_back == 'no'){

        this.statusDetails["customer_status"] = this.statusChange;

        this.statusDetails["customer_id"] = this.custChange;
        this.statusDetails['project_id'] = this.projectIdChange;

      }
      this.updateNewStatus();
  } 
  date_val;
  wip_remark;
    onCallbackChange3(){
      this.loaderService.display(true);
      $("#statusModal0").modal("hide");
      this.wip_remark = $("#wip_remarks").val();
      this.statusDetails['remarks']= $("#wip_remarks").val();
      this.date_val =$("#followup-date").val();
      if(this.call_back == 'no'){

        this.statusDetails["customer_status"] = this.statusChange;

        this.statusDetails["customer_id"] = this.custChange;
        this.statusDetails['project_id'] = this.projectIdChange;

      }
      if(this.date_val != '' && this.data_flag == true){
        this.createEvent();
        this.updateRemarkStatus();
        

      }
      else{
        this.updateRemarkStatus();

      }
      
    }  
  getInactiveRemark(remark,projectId,customerId,status){
    this.projectIdChange = projectId;
    this.custChange = customerId;
    this.statusChange = status;
    this.call_back = 'no';
    (<HTMLInputElement>document.getElementById('inactive_remarks')).value = remark;

  }  

    updateNewStatus(){
      this.designerService.statusUpdate(this.statusDetails,this.designerId).subscribe(
          res => {

            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = 'Status updated successfully!';
            setTimeout(function() {
                   this.successalert = false;
              }.bind(this), 2000);
            this.statusDetails={};
            this.getWipList(1);
            // this.getUserListForDesigner(1);
              
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

  bookingFormDetails ;
  attachment_file: any;
  basefile: any;

  getUserListForDesigner(page){
      this.loaderService.display(true);
      this.designerService.getUserListForDesigner(this.designerId,this.customer_status, page).subscribe(
        res => {
          this.headers_res= res.headers._headers;
          this.per_page = this.headers_res.get('x-per-page');
          this.total_page = this.headers_res.get('x-total');
          this.current_page = this.headers_res.get('x-page');

          res= res.json();
          Object.keys(res).map((key)=>{ this.usersList= res.leads;});
          this.loaderService.display(false);
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

  sms_client : string;

  storeSmsClient(clientId){
    this.sms_client = clientId;
  }

  onSubStatusChange(projectId,customerId, substatus){
    this.statusDetails["sub_status"] = substatus;
    // this.statusDetails["customer_remarks"] = "";
    // this.statusDetails["customer_meeting_time"] = "";
    this.statusDetails["customer_id"] = customerId;
    this.statusDetails["project_id"] = projectId;
    this.loaderService.display(true);
    
    this.designerService.subStatusUpdate(this.statusDetails,this.designerId).subscribe(
      res => {

        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Status updated successfully!';
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

  isProjectInWipAndActive(status):boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation"]
    if(wip_array.includes(status)){
      return true
    }
    else{
      return false
    }
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
  projectIdChange;
  custChange;
  statusChange;
  getCallBackTime(remark,Time,projectId,customerId,status){
    this.projectIdChange = projectId;
    this.custChange = customerId;
    this.statusChange = status;
    this.call_back = 'no';
    var datetime= Time;// Default datetime will be like this.

    //By Spliting the input contrl value with space
    var date=datetime.split('T')[0];
    var time=datetime.split('T')[1].split('.')[0];
    Time = date +"T"+time;
    (<HTMLInputElement>document.getElementById('onhold-details')).value = Time;
    (<HTMLInputElement>document.getElementById('followup_remarks')).value = remark;


  }
  cust_email:any;
  getWip(remark,projectId,customerId,status,email,followUpTime){
    this.data_flag = false;
    this.projectIdChange = projectId;
    this.custChange = customerId;
    this.statusChange = status;
    this.call_back = 'no';
    this.cust_email = email;
    // var datep = $('#followup-date').val();
    if(followUpTime != null){
        var datep = followUpTime.substring(0,10);
       var datep1 = followUpTime.substring(11,19);
       var datep2 = datep + 'T'+ datep1;
       $('#followup-date').val(datep2);
    }
    else{
      $('#followup-date').val('');
    }
     
    
    (<HTMLInputElement>document.getElementById('wip_remarks')).value = remark;
    // (<HTMLInputElement>document.getElementById('followup-date')).value = followUpTime;
    


  }

  
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
  
  ngAfterViewInit(){
    this.calElem = $('#calendar');
    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })

    this.calenderService.fetchLead().subscribe(
        leads => {
          // this.leads = leads;
          // this.leads = leads;
          Object.keys(leads).map((key)=>{ this.leads=leads[key];});
          this.usersList.forEach(user =>{
        let ownerable_id;
        let ownerable_type;
        this.leads.forEach(elem => {
        if(elem.lead_id === user.project_details.id)
          {
            ownerable_id = elem.ownerable_id;
            ownerable_type = elem.ownerable_type;
          }
        });
        var eventList = this.fetchLeadEvent(user.ownerable_type, user.ownerable_id, 
        this.from_date, this.to_date);

      user.upcoming_event = eventList != null? eventList[0].datetime : '';
        });
        },
        error => {
          
        }
      );

    //for printing
    // for(let lead of this.leads){
    //   if(lead.next_scheduled_event != null){
    //     
    //      this.next_scheduled_event = lead.next_scheduled_event.scheduled_at;
    //   }
    // }
    //////////////////////


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
      this.fromDateFilter="";
      this.toDateFilter="";
      this.getWipList(1);

    }
    else if(this.SelectedValue == 'lead_created_at' || this.SelectedValue == 'assigned_to_designer' || this.SelectedValue == 'assigned_to_cm'){
      this.getWipList(1,'',this.SelectedValue,this.fromDateFilter,this.toDateFilter);


    }

  }
  downloadExcel(){
    if(this.custom_status == 'active'){
      this.custom_status = 'after_wip';
    }

    this.designerService.exportLeads(this.role,this.designerId,this.custom_status,this.SelectedValue,this.fromDateFilter,this.toDateFilter).subscribe(
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
  month:any;
  day:any;
  year:any
  // Disable calender date
  disableDate(){
    this.data_flag = true;

    var datep = $('#followup-date').val();
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
      $('#followup-date').attr('min', maxDate);
      if (datep < maxDate) {
        alert("selected date is in past");
        $('#followup-date').val(maxDate);
      }
    


  }
  onhold_date
  disableDate1(event){
    var datep = event.target.value;
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
      $('#onhold-details').attr('min', maxDate);
      if (datep < maxDate) {
        alert("selected date is in past");
        $('#onhold-details').val(maxDate);
        this.onhold_date = maxDate;
      }
      else{
        $('#onhold-details').val(datep);
        this.onhold_date = event.target.value;

      }
     

  }
  createEvent(){
    var obj = {
      "project":this.projectIdChange,
      "ownerable_type": "Project",
      "contact_type":"phone_call",
      "scheduled_at": this.date_val, 
      "agenda":'follow_up_call',  
      "email": this.cust_email,
      "description": this.wip_remark,
      "location":""



    }
    this.loaderService.display(true);
      this.calenderService.createEvent(obj).subscribe(
        event => {
         setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
          
          this.successalert = true;
          this.successMessage = "Event successfully created";
          this.loaderService.display(false);
          setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
        },
        error => {
          
          this.erroralert = true;
          this.errorMessage = "Some error occured while creating an event";
          
          
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
        }
      );     
  }
    

  createEventCalender(){
      var parentThis = this
    if (this.meetingform.valid) {
      this.loaderService.display(true);
      this.calenderService.createEvent(this.meetingform.value).subscribe(
        event => {
          event = event;
          Object.keys(event).map((key)=>{ this.latestevent= event[key];});
          this.repopulateCalendar();
          
         setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
          //this.router.navigateByUrl('/projects/'+project.id+'/floorplan/create');
          // return presentation;
          this.successalert = true;
          this.successMessage = "Event successfully created";
          this.loaderService.display(false);
          setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
        },
        error => {
          
          
          // return Observable.throw(error);
          this.erroralert = true;
          this.errorMessage = "Agenda First meeting is already scheduled";
          // this.errorMessage = JSON.parse(error['_body']).message;
          // alert("Error creating event");
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
        }
      );
      this.meetingform.reset();
      $(':input[type="select"]').prop('disabled', true); 
      $("#eventModal").modal("hide");
    }

    // $("#eventModal").modal("hide");
    window.scrollTo(0,0);
    setTimeout(function(){ location.reload(); }, 1000);
    // location.reload();
    this.loaderService.display(false);
  }


  updateRemarkStatus(){
    this.loaderService.display(true);
    var project ={
      remarks: this.wip_remark
    }
    this.designerService.updateRemarkStatus(project,this.projectIdChange).subscribe(
      res=>{
        this.loaderService.display(false);
        this.getWipList(1);
        // this.getUserListForDesigner(1);
        this.statusDetails={};

      },
      err=>{
        
        this.loaderService.display(false);

      }
      );

  }

  populateCalender(){
    this.calElem = $('#calendar');
    var parentThis = this
    this.calElem.fullCalendar({
      customButtons: {
        Prev: {
          text: 'Prev',
          click: function(calEvent) {
            parentThis.calElem.fullCalendar("prev");
            parentThis.calElem.fullCalendar( 'removeEvents' )
            parentThis.getFromTo(parentThis.calElem.fullCalendar('getDate')._d);
            
          }
        },
        Next: {
          text: 'Next',
          click: function(calEvent) {
            parentThis.calElem.fullCalendar("next");
            parentThis.calElem.fullCalendar( 'removeEvents' )
            parentThis.getFromTo(parentThis.calElem.fullCalendar('getDate')._d);
          }
        },
        Today: {
          text: 'Today',
          click: function(calEvent) {
            parentThis.calElem.fullCalendar("today");
            parentThis.calElem.fullCalendar( 'removeEvents', parentThis.events )
            parentThis.getFromTo(parentThis.calElem.fullCalendar('getDate')._d);
          }
        }
      },

      header: {
        left:   'Today Prev,Next',
        center: 'title',
        right:  'month basicWeek basicDay'
      },
      navLinks: true,
      dayClick: function(date, jsEvent, view){
        //alert('Clicked on: ' + date.format());

        // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

        // alert('Current view: ' + view.name);

        // $(this).css('background-color', 'red');
        parentThis.meetingform.controls['scheduled_at'].setValue(new Date(date._i).toJSON().slice(0,19));
        $("#eventModal").modal("show");
      },

      events: this.events,
      // events: [{id: 8, title: "12:12PM / briefing_sales_pitch", start: "2018-02-21"},{id: 9, title: "12:13PM / briefing_sales_pitch", start: "2018-02-21"}],
      eventClick:function( calEvent, jsEvent, view ) {
        $("#viewEventModal").modal("show");
        parentThis.currentEvent = calEvent;
        if(calEvent.location == null){
          calEvent.location = "None"

        }
        if(calEvent.description == null){
          calEvent.description = "None"

        }
        parentThis.current_project_id=calEvent.ownerable_id;
        parentThis.current_user_id = calEvent.customer_id;
        parentThis.cal_lead_id = calEvent.lead_id;
        $(".modal-project").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.ownerable_name+"</p>");
        $(".modal-agenda").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.agenda.split('_').join(' ')+"</p>");
        if(calEvent.agenda == 'follow_up'){
          $('#furemark-hide').show();
        }
        else{
          $('#furemark-hide').hide();
        }
        if(calEvent.agenda == 'follow_up' || calEvent.agenda == 'follow_up_for_not_contactable' ){
          $('#designer-hide').hide();
        }
        else{
          $('#designer-hide').show();
        }
        if(calEvent.agenda == 'follow_up' || calEvent.agenda == 'follow_up_for_not_contactable'  || calEvent.agenda == 'lead_assigned'){

          $('#status-change').show();
        }
        else{

           $('#status-change').hide();
        }
        $(".modal-type").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.contact_type.split('_').join(' ')+"</p>");
        $(".modal-description").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.description+"</p>");
        $(".modal-date").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.datetime+"</p>");
        $(".modal-location").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.location+"</p>");
        $(".modal-members").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.users.join("<br/>")+"</p>");
        $(".modal-status").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.status+"</p>");
        $(".modal-remark").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.remark+"</p>");
        
        $(".modal-furemark").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.ownerable_remark+"</p>");

        $(".modal-lead").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.customer_name+"</p>");
        $(".modal-designer").html("<p style = 'padding-top: .35rem!important;'>"+calEvent.designer.name +"-"+calEvent.designer.email+"</p>");
        
        if(calEvent.status == 'done'){
          $('#btn-hide').css({ 'display' : 'none'});
          $('#btn-hides').css({ 'display' : 'none'});
          $('#remark-hide').show();
          $('#status-change').hide();
        }
        else if(calEvent.status == 'rescheduled'){
          $('#remark-hide').show();
          $('#btn-hide').css({ 'display' : 'block'});
          $('#btn-hides').css({ 'display' : 'block'});

        }

        
        else{
          $('#btn-hide').css({ 'display' : 'block'});
          $('#btn-hides').css({ 'display' : 'block'});
          $('#remark-hide').hide();

        }

        parentThis.updatemeetingform.controls['project'].setValue(calEvent.ownerable_id);
        parentThis.updatemeetingform.controls['ownerable_type'].setValue(calEvent.ownerable_type);
        parentThis.updatemeetingform.controls['agenda'].setValue(calEvent.agenda);
        parentThis.updatemeetingform.controls['contact_type'].setValue(calEvent.contact_type);
        parentThis.updatemeetingform.controls['description'].setValue(calEvent.description);
        parentThis.updatemeetingform.controls['scheduled_at'].setValue(new Date(Date.parse(calEvent.scheduled_at) + 330*60000).toJSON().slice(0,19));
        parentThis.updatemeetingform.controls['location'].setValue(calEvent.location);
        parentThis.updatemeetingform.controls['remark'].setValue(calEvent.remark);
        parentThis.updatemeetingform.controls['email'].setValue(calEvent.users.join(";"));
        // 
        // 
        // 
        // if (calEvent.title) {
        //     alert(calEvent.title);
        //     // return false;
        // }
      },

      selectable: true,
      eventBackgroundColor: '#A73E57',
      eventBorderColor: '#A73E57',
      eventTextColor: '#ffffff'

    });
    this.loaderService.display(false);
  }

  repopulateCalendar(){
    this.calElem.fullCalendar( 'removeEvents' )
    this.calenderService.fetchEvent(this.from_date, this.to_date).subscribe(
      events => {
        events = events;
        Object.keys(events).map((key)=>{ this.events=events[key]; });
        // $(".calendar-container").html("<div id='calendar' #calendar></div>");
        this.calElem.fullCalendar( 'addEventSource', this.events )
        // this.calElem = $("#calendar");
        // this.populateCalender();
        // this.calElem.fullCalendar( 'refetchEvents' );
      },
      error => {
        
      }
    );
  }

  // onStatusChange(customerId,ProjectId,status){
  //     this.call_back = 'yes';
  //     this.statusDetails["customer_status"] = status;
  //     // this.statusDetails["customer_remarks"] = "";
  //     // this.statusDetails["customer_meeting_time"] = "";
  //     this.statusDetails["customer_id"] = customerId;
  //     this.statusDetails['project_id'] = ProjectId;

  //     this.loaderService.display(true);
  //     if(this.statusDetails["customer_status"] == "follow_up"){
  //       $("#followup-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
  //       this.loaderService.display(false);
  //       $("#statusModal").modal("show");
  //     }
  //     else if(this.statusDetails["customer_status"] == "on_hold"){
  //       this.call_back = 'yes';
  //       // $("#onhold-details").val(new Date(new Date().getTime() + 330*60000).toJSON().slice(0,19));
  //       this.loaderService.display(false);
  //       $("#statusModal1").modal("show");
  //     }
  //     else if(this.statusDetails["customer_status"] == "inactive"){
        
  //       this.loaderService.display(false);
  //       $("#statusModal2").modal("show");
  //     }
  //     else{
  //       this.updateNewStatus();
  //     }
  //   }

  onProjectChange(val){
    for(let lead of this.leads){
      if(lead.ownerable_id == val){
        this.meetingform.controls['project'].setValue(lead.ownerable_id);
        this.meetingform.controls['ownerable_type'].setValue(lead.ownerable_type);
        this.updatemeetingform.controls['ownerable_type'].setValue(lead.ownerable_type);
      }
    }




    this.calenderService.fetchUsers(val).subscribe(
      users => {
        Object.keys(users).map((key)=>{ this.projectUsers= users[key];});
      },
      error => {
        this.erroralert = true;
        this.errorMessage = "Error updating event";
        
      }
    );
  }

  onMeetingUserChange(event,target){
    var val = event.target.value
    if(target == "meeting"){
      var exist_value = $(".meeting-control").val();
    }
    else if (target == "update") {
      var exist_value = $(".update-control").val();
    }
    var new_val;
    if(event.srcElement.checked){
      if(exist_value != undefined && exist_value != "" && exist_value != null){
        new_val = exist_value+";"+val;
      }
      else{
        new_val = val;
      }
    }
    else{
      if(exist_value != undefined && exist_value != "" && exist_value != null){
        var arr = exist_value.split(";");
        var index = arr.indexOf(val, 0);
        if (index > -1) {
           arr.splice(index, 1);
        }
        new_val = arr.join(";");
      }
    }
    if(target == "meeting"){
      $(".meeting-control").val(new_val);
      this.meetingform.controls['email'].setValue(new_val);
    }
    else if (target == "update") {
      $(".update-control").val(new_val);
      this.meetingform.controls['email'].setValue(new_val);
    }

  }

  current_project_id;
  current_user_id;
  cal_lead_id;

  getFromTo(date){
    this.y = date.getFullYear();
    this.m = date.getMonth();
    this.from_date = new Date(this.y, this.m, 1);
    this.to_date = new Date(this.y, this.m + 1, 0);

    this.fetchEvent(this.from_date, this.to_date);
    // this.calElem.fullCalendar("refetchEvents");

    // this.calElem.fullCalendar( 'removeEvents' )
    // this.calElem.fullCalendar( 'addEventSource', this.events )
  }

  fetchEvent(from_date, to_date){
    this.calenderService.fetchEvent(from_date, to_date).subscribe(
        events => {
          events = events;
          Object.keys(events).map((key)=>{ this.events=events[key]; });
          this.populateCalender();
          this.calElem.fullCalendar( 'removeEvents' )
          this.calElem.fullCalendar( 'addEventSource', this.events )
        },
        error => {
          
        }
      );
  }
 
  showEventModalFormDetails(project){
    let ownerable_id;
    let ownerable_type;
    this.leads.forEach(elem => {
      if(elem.lead_id === project.id)
        {
          ownerable_id = elem.ownerable_id;
          ownerable_type = elem.ownerable_type;
        }
      });
  this.meetingform.controls["project"].patchValue(ownerable_id);
  this.onProjectChange(ownerable_id);
  }

    fetchLeadEvent(ownerableType, ownerableId, from_date, to_date){
    this.calenderService.fetchLeadEvent(ownerableType, ownerableId, from_date, to_date).subscribe(
        events => {
          events = events;
          
          Object.keys(events).map((key)=>{ this.events=events[key]; });
         this.loaderService.display(false);
        },
        error => {
          
          this.loaderService.display(false);
        }
      );
  }

  firstMeeting(){
    this.loc = $('#agendaType').val();
    
    if(this.loc == 'null'){
      $(':input[type="select"]').prop('disabled', true); 
    }  
    else{
      $(':input[type="select"]').prop('disabled', false); 
    }
  }

  addAlternateNumberForm(){
    this.showAlternateForm = !this.showAlternateForm;
    this.fields=[];
    this.staticFields.forEach(elem =>{
        this.fields.push(elem);
    });
    this.alternateNumberForm = this.dynamicFormService.toFormGroup(this.fields);
  }
   dropdownDropType;
    submitDropLeadType(type){
      this.dropdownDropType=type;
    }

}
