import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
import { DesignerService } from '../designer.service';
import { SalesManagerService } from '../../salesmanager/sales-manager.service';
import { QuotationService } from '../../quotation/quotation.service';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import { CsagentService } from '../../organisation/csagentdashboard/csagent.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import {
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';
declare var Layout:any;
declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ProjectService,DesignerService, LeadService,CsagentService, QuotationService, SalesManagerService]
})
export class DashboardComponent implements OnInit {

	observableProjects: Observable<Project[]>

    lead_referrer_list=[];

   	projects: Project[];
    errorMessage : string;
    erroralert = false;
    successalert = false;
    successMessage : string;
    role:string;
    designerId:string;
    statusCountArr;
    usersList;
    date_from:any;
    date_to:any;
    disable_to:any = true;
    addLeadForm: FormGroup;
    inviteChampionForm: FormGroup;
    addleadquestionnaire: FormGroup;
    approvalForm:FormGroup;
    user_id;
    referrer_type="";
    referrer_type_id;
    showChildDropdown:boolean;
    is_champion;
    userData;
    accommodation_type = ['Studio Apartment','1RK','1BHK','1.5BHK','2BHK','2.5BHK','3BHK',
      '3.5BHK','4BHK','4.5BHK','5BHK','Villa','Bungalow','Office Space'];
    scopeOfwork = ['Modular Kitchen','Loose Furniture','Full Home Interiors (Design)','Full Home Interiors (Design & Fullfilment)','Partial Home Interiors (e.g. MKW + Living Room)'];
    callbacktime = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM',
                  '1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
                  '5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM',
                  '10:00 PM','10:30 PM','11:00 PM'];
    estimatedPossessionTime = ['Jan-18','Feb-18','Mar-18','Apr-18','May-18',
      'Jun-18','Jul-18','Aug-18','Sep-18','Oct-18','Nov-18','Dec-18'];
    lostReasonsArr=['low_budget','less_scope_of_work','city_not_in_operations','general_inquiry/not_interested',
      'language_barrier','reluctant_to_provide_details_wrong_number','others'];


  tagging_file_id:any;
  tagging_proj_id:any;
  tagging_quote_id:any;
  tagging_status:any;
  champion_types: any;
  champion_list_first_level: any;
  champion_list_second_level: any;
  champion_list_third_level: any;
  champion_user: any;
  child_champion_user: any;
  initApproval(quote_id, proj_id,file_id, status){
  this.tagging_file_id = file_id;
  this.tagging_proj_id = proj_id;
  this.tagging_quote_id = quote_id;
  this.approvalForm.controls['status'].setValue(status);
  if(status == "approved"){
  this.tagging_status = "Approved";
    this.approvalSubmit();
  }
  else if(status == "rejected"){
    $("#approvalModal").modal("show");
  this.tagging_status = "Rejected";
  }
  }
  constructor(
    private route:ActivatedRoute,
  	private router: Router,
  	private projectService:ProjectService,
    private loaderService : LoaderService,
    private salesService: SalesManagerService,
    private designerService : DesignerService,
    private leadService : LeadService,
    private formBuilder:FormBuilder,
    private quotationService : QuotationService,
    private csagentService:CsagentService,
    public userDetailService: UserDetailsService,
  ) { 
      this.approvalForm = this.formBuilder.group({
      status : new FormControl("",Validators.required),
      approval_comment : new FormControl("",Validators.required)
      })
    }

  ngOnChanges(): void {
    this.getProjectListFromService();
  }

  resetForm(){
    this.approvalForm.reset();
  }

  approvalSubmit(){
   this.quotationService.approvalSubmit(this.tagging_proj_id,this.tagging_quote_id, this.tagging_file_id, this.approvalForm.value).subscribe(
   res => {
   // this.getCADFiles(this.tagging_quote_id);
    $('.btn-'+this.tagging_file_id).html("");
    $('.status-'+this.tagging_file_id).html(this.tagging_status);
    this.approvalForm.reset();
       $("#approvalModal").modal("hide");
    if(this.tagging_status == "Approved"){
    alert("CAD file is approved successfully");
    }
    else{
    alert("CAD file is rejected successfully");
  }
   
   }, 
   err => {
   
   this.loaderService.display(false);
   alert("Something went wrong");
   });
  }

  ngOnInit(): void{
    this.user_id =localStorage.getItem('userId');
    this.role = localStorage.getItem('user');
    this.designerId = localStorage.getItem('userId');
    this.is_champion = localStorage.getItem('isChampion');


    //this.getProjectListFromService();
    //this.getUserListForDesigner();
    this.getUserCountsByStatus();
    this.loaderService.display(false);

    // this.userData = this.userDetailService.current_user();
    // 

    this.route.queryParams.subscribe(params => {
      this.referrer_type_id = params['referrer_type'];
      
    });


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

    this.inviteChampionForm = this.formBuilder.group({
      name : new FormControl("",[Validators.required]),
      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
              Validators.required]),
      contact : new FormControl("",[Validators.required]),
      parent_id : new FormControl(""),
      champion_level: new FormControl("",[Validators.required]),
      user_type:new FormControl("arrivae_champion")
    });

    this.addleadquestionnaire = this.formBuilder.group({
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
      budget_value: new FormControl(""),
      home_value : new FormControl(""),
      possession_status :new FormControl(""),
      possession_status_date:new FormControl(""),
      have_homeloan: new FormControl(""),
      call_back_day: new FormControl(""),
      call_back_time: new FormControl(""),
      have_floorplan: new FormControl(""),
      lead_generator: new FormControl(""),
      lead_source:new FormControl(""),
      additional_comments :new FormControl(""),
      ownerable_type : new FormControl('Lead'),
      user_id : new FormControl(localStorage.getItem('userId')),
      ownerable_id : new FormControl(),
      lead_status: new FormControl("",Validators.required),
      follow_up_time : new FormControl(""),
      remark: new FormControl(""),
      lost_remark : new FormControl(""),
      lost_reason: new FormControl("")
    });

    this.getLeadPoolList();
    this.getCitiesForQuestionnaire();
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

  private getProjectListFromService(){
    this.observableProjects = this.projectService.getProjectList();
    this.observableProjects.subscribe(
        projects => {
          this.projects = projects;
          Object.keys(projects).map((key)=>{ this.projects= projects[key];});

        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message
          setTimeout(function() {
                         this.erroralert = false;
            }.bind(this), 10000);
            //Layout.notify('danger',JSON.parse(this.errorMessage['_body']).message);
        }
    );
  }

  getUserCountsByStatus(date_from?,date_to?,Custstatus?) {
    this.loaderService.display(true);
    this.designerService.getUserCountsByStatus(this.designerId,date_from,date_to,Custstatus).subscribe(
      res => {
        this.statusCountArr = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  showWip(){
    if(document.getElementById("wip-box").style.display == "none" || document.getElementById("wip-box").style.display == ""){
      document.getElementById("wipbox-activator").style.border = "2px solid #3EC0F3";
      document.getElementById("wip-box").style.display = "block";
    }
    else{
      document.getElementById("wipbox-activator").style.border = "0px";
      document.getElementById("wip-box").style.display = "none";
    }

  }

  changeDateFrom(val){
    this.date_from = val;
    this.disable_to = false;
    // $(".to_date_container").css("display", "block");
  }

  changeDateTo(val){
    this.date_to = val;
  }

  filterDashboard(){
    if(this.SelectedValue == 'all'){
      this.getUserCountsByStatus();
    }
    else{
      this.getUserCountsByStatus(this.date_from,this.date_to,this.SelectedValue);
    }
  }

  filtercol1Val:any = 'all';
  SelectedValue:any = 'all';
  lead_types:any;
  filterColumDropdownChange(Value){
    this.SelectedValue = Value;
    if(Value == "all"){
      $("#to_date_div").addClass("d-none");
      $("#from_date_div").addClass("d-none");
    }else{
      $("#to_date_div").removeClass("d-none");
      $("#from_date_div").removeClass("d-none");
    }
    this.lead_types = Value;
  }

  downloadExcel(){
    if( this.SelectedValue != 'all'){
        this.designerService.exportLeads(this.role,this.designerId,'',this.SelectedValue,this.date_from,this.date_to).subscribe(
      res=>{
        this.loaderService.display(false);
        
        
        this.successalert = true;
        this.successMessage = 'The Lead report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        
        this.loaderService.display(false);

      });
    }

    else{
      this.designerService.exportLeads(this.role,this.designerId).subscribe(
      res=>{
        this.loaderService.display(false);
        
        
        this.successalert = true;
        this.successMessage = 'The Lead report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        
        this.loaderService.display(false);

      });
    }

  }


  downloadExcelBoq(){
    this.loaderService.display(true);
    this.designerService.exportBoq().subscribe(
      res=>{
        this.loaderService.display(false);
        
        this.successalert = true;
        this.successMessage = 'The BOQ report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);


      },
      err=>{
        

      });

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

  addLeadDetails;
  basefile: any;
  addLeadFormSubmit(data) {
    this.loaderService.display(true);
    //$('#addNewLeadModal').modal('hide');
    data['created_by'] = localStorage.getItem('userId');
    if(data.lead_type_id==this.leadTypeCustomerId){
      data['lead_status'] = 'claimed';
    }
    data['by_csagent'] = false;
    data['by_designer'] = true;
    if(this.addLeadForm.controls['lead_type_name'].value=='designer'){
      data['lead_cv']=this.basefile;
    }
    var obj = {
      lead:data
    }
    this.leadService.designerAddLead(obj)
        .subscribe(
          res => {
            Object.keys(res).map((key)=>{ res= res[key];});
            this.addLeadDetails =  res;
            this.addLeadDetails['questionnaire_type']='add_lead';
            this.addLeadForm.reset();
            this.basefile = undefined;
            // this.loaderService.display(false);
            this.successalert = true;
            this.successMessage = "Lead created successfully !!";
            this.getUserCountsByStatus();
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
            $('#addNewLeadModal').modal('hide');
            this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 15000);
          }
        );
  }

  closeModalQues(msg?){
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

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 ||
        e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9 || e.keyCode == 17
        || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67 )) {
      return false;
    }
  }

  add_lead_types = [];
  lead_sources;
  designer_lead_campaigns;
  leadTypeCustomerId;
  getLeadPoolList(){
     this.loaderService.display(true);
    this.csagentService.getLeadPoolList().subscribe(
      res => {
        // this.add_lead_types = res['lead_types'];
        for(var i=0;i<res['lead_types'].length;i++){
          if(res['lead_types'][i].name == "customer"){
            this.add_lead_types.push(res['lead_types'][i]);
          }
        }
        for(var i=0;i<this.add_lead_types.length;i++){
          if(this.add_lead_types[i].name=='customer'){
            this.leadTypeCustomerId =this.add_lead_types[i].id;
            break;
          }
        }
        this.designer_lead_campaigns=res['designer_lead_campaigns'];
        
        this.lead_sources = res['designer_lead_sources'];
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

  city_others;
  addLeadQuestionnaire(data){
    this.loaderService.display(true);
    this.addleadquestionnaire.controls['ownerable_id'].setValue(this.addLeadDetails.id);
    this.addleadquestionnaire.controls['customer_name'].setValue(this.addLeadDetails.name);
    this.addleadquestionnaire.controls['phone'].setValue(this.addLeadDetails.contact);
    if(this.addleadquestionnaire.controls['city'].value == 'Other'){
      this.addleadquestionnaire.controls['city'].setValue(this.city_others);
      data['city']=this.city_others;
    }
    data['customer_name'] = this.addLeadDetails.name;
    data['phone'] = this.addLeadDetails.contact;
    data['ownerable_id'] = this.addLeadDetails.id;
    data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
    data['scope_of_work']=[data['scope_of_work']];
    var obj= {
      lead_status: data.lead_status,
      follow_up_time : data.follow_up_time,
      remark: data.remark,
      lost_reason: data.lost_reason,
      lost_remark : data.lost_remark
    }
    this.leadService.updateLeadStatus(obj,this.addLeadDetails.id).subscribe(
      res => {
        this.leadService.postRecordNotesQuestionnaire(this.addLeadDetails.id,data).subscribe(
          res => {
            $('#addNewLeadModal').modal('hide');
            this.addleadquestionnaire.reset();
            this.questionnaire_floorplan_basefile = undefined;
            this.floorplan_attachment_file = undefined;
            document.getElementById('addLeadForm').style.display = 'block';
            if(document.getElementById('addleadFormquestremark')){
              document.getElementById('addleadFormquestremark').style.display = 'none';
            }
            if(document.getElementById('addleadQuestLostReason')){
              document.getElementById('addleadQuestLostReason').style.display = 'none';
            }
            if(document.getElementById('addleadQuestFollowuptime')){
              document.getElementById('addleadQuestFollowuptime').style.display = 'none';
            }
            if(document.getElementById('addleadQuestRemark')){
              document.getElementById('addleadQuestRemark').style.display = 'none';
            }
            document.getElementById('addleadquestionnaireForm').style.display= 'none';
            this.city_others  = undefined;
            this.addLeadDetails = undefined;
            // this.changeShowStatus('offline');
            // this.getLeadCountForAgent();
            this.successalert = true;
            this.successMessage = "Form submitted successfully!";
            this.loaderService.display(false);
            setTimeout(function() {
                this.successalert = false;
              }.bind(this), 10000);
            //window.location.reload();
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

  setLeadStatus(value) {
    if(value=='follow_up') {
      document.getElementById('datetime').setAttribute('style','display: block');
      document.getElementById('remarkChange').setAttribute('style','display: block');
      // this.leadStatusUpdateForm.controls['follow_up_time'].setValidators([Validators.required]);
      // this.leadStatusUpdateForm.controls['follow_up_time'].updateValueAndValidity();

    } else {
      document.getElementById('datetime').setAttribute('style','display: none');
      document.getElementById('remarkChange').setAttribute('style','display: none');
      // this.leadStatusUpdateForm.controls['follow_up_time'].clearValidators();
      // this.leadStatusUpdateForm.controls['follow_up_time'].updateValueAndValidity();
        }
    if(value == 'lost') {

      document.getElementById('lostreason').setAttribute('style','display: block');
    } else {
      document.getElementById('lostreason').setAttribute('style','display: none');
    }
    // if(value=='qualified' && this.activeLeadDataForAgent.lead_type =='customer'){
    //   this.setFormFieldRequired(this.leadquestionnaire);
    // } else {
    //   this.removeFormFieldRequired(this.leadquestionnaire);
    // }
  }

  setLeadStatus1(value) {
    if(value=='follow_up') {
      document.getElementById('addleadFormdatetime').setAttribute('style','display: block');
      document.getElementById('addleadFormRemark').setAttribute('style','display: block');
    } else {
      document.getElementById('addleadFormdatetime').setAttribute('style','display: none');
      document.getElementById('addleadFormRemark').setAttribute('style','display: none');
    }
    if(value == 'lost') {
      document.getElementById('addleadFormlostReason').setAttribute('style','display: block');
      // document.getElementById('addleadFormlostremark').setAttribute('style','display: block');
    } else {
      // document.getElementById('addleadFormlostremark').setAttribute('style','display: none');
      document.getElementById('addleadFormlostReason').setAttribute('style','display: none');
    }
  }

  setLeadStatus2(value) {
    // if(value=='follow_up') {
    //   document.getElementById('addleadQuestFollowuptime').setAttribute('style','display: block');
    //   document.getElementById('addleadQuestRemark').setAttribute('style','display: block');
    //   this.addleadquestionnaire.controls['follow_up_time'].setValidators([Validators.required]);
    //   this.addleadquestionnaire.controls['follow_up_time'].updateValueAndValidity();
    //   this.addleadquestionnaire.controls['remark'].setValidators([Validators.required]);
    //   this.addleadquestionnaire.controls['remark'].updateValueAndValidity();
    // } else {
    //   document.getElementById('addleadQuestFollowuptime').setAttribute('style','display: none');
    //   this.addleadquestionnaire.controls['follow_up_time'].clearValidators();
    //   this.addleadquestionnaire.controls['follow_up_time'].updateValueAndValidity();
    //   this.addleadquestionnaire.controls['remark'].clearValidators();
    //   this.addleadquestionnaire.controls['remark'].updateValueAndValidity();
    // }
    // if(value == 'lost') {
    //   document.getElementById('addleadQuestLostReason').setAttribute('style','display: block');
    // } else {
    //   document.getElementById('addleadQuestLostReason').setAttribute('style','display: none');
    // }
    if(value=='qualified'){
      this.setFormFieldRequired(this.addleadquestionnaire);
    } else {
      this.removeFormFieldRequired(this.addleadquestionnaire);
    }
  }

  setFormFieldRequired(formgrp){
    // formgrp.controls['society'].setValidators([Validators.required]);
    // formgrp.controls['location'].setValidators([Validators.required]);
    // formgrp.controls['city'].setValidators([Validators.required]);
    // formgrp.controls['project_type'].setValidators([Validators.required]);
    // formgrp.controls['call_back_day'].setValidators([Validators.required]);
    // formgrp.controls['call_back_time'].setValidators([Validators.required]);
    // formgrp.controls['accomodation_type'].setValidators([Validators.required]);
    // formgrp.controls['home_type'].setValidators([Validators.required]);
    // formgrp.controls['scope_of_work'].setValidators([Validators.required]);
    // formgrp.controls['have_homeloan'].setValidators([Validators.required]);
    // formgrp.controls['possession_status'].setValidators([Validators.required]);
    // formgrp.controls['home_value'].setValidators([Validators.required]);
    // formgrp.controls['budget_value'].setValidators([Validators.required]);
    if(formgrp.controls['possession_status'].value=='Awaiting Possession'){
      formgrp.controls['possession_status_date'].setValidators([Validators.required]);
      formgrp.controls['possession_status_date'].updateValueAndValidity();
    } else {
      formgrp.controls['possession_status_date'].clearValidators();
      formgrp.controls['possession_status_date'].updateValueAndValidity();
    }
    // formgrp.controls['society'].updateValueAndValidity();
    // formgrp.controls['location'].updateValueAndValidity();
    // formgrp.controls['city'].updateValueAndValidity();
    // formgrp.controls['project_type'].updateValueAndValidity();
    // formgrp.controls['call_back_day'].updateValueAndValidity();
    // formgrp.controls['call_back_time'].updateValueAndValidity();
    // formgrp.controls['accomodation_type'].updateValueAndValidity();
    // formgrp.controls['home_type'].updateValueAndValidity();
    // formgrp.controls['scope_of_work'].updateValueAndValidity();
    // formgrp.controls['have_homeloan'].updateValueAndValidity();
    // formgrp.controls['possession_status'].updateValueAndValidity();
    // formgrp.controls['home_value'].updateValueAndValidity();
    // formgrp.controls['budget_value'].updateValueAndValidity();
    var elems=document.getElementsByClassName('hideAsteriskIcon');
    for(var i=0;i<elems.length;i++){
      elems[i].setAttribute('style','display:none');
    }
  }
  removeFormFieldRequired(formgrp){
    formgrp.controls['society'].clearValidators();
    formgrp.controls['location'].clearValidators();
    formgrp.controls['city'].clearValidators();
    formgrp.controls['project_type'].clearValidators();
    formgrp.controls['call_back_day'].clearValidators();
    formgrp.controls['call_back_time'].clearValidators();
    formgrp.controls['accomodation_type'].clearValidators();
    formgrp.controls['home_type'].clearValidators();
    formgrp.controls['scope_of_work'].clearValidators();
    formgrp.controls['have_homeloan'].clearValidators();
    formgrp.controls['possession_status'].clearValidators();
    formgrp.controls['possession_status_date'].clearValidators();
    formgrp.controls['home_value'].clearValidators();
    formgrp.controls['budget_value'].clearValidators();

    formgrp.controls['possession_status_date'].updateValueAndValidity();
    formgrp.controls['society'].updateValueAndValidity();
    formgrp.controls['location'].updateValueAndValidity();
    formgrp.controls['city'].updateValueAndValidity();
    formgrp.controls['project_type'].updateValueAndValidity();
    formgrp.controls['call_back_day'].updateValueAndValidity();
    formgrp.controls['call_back_time'].updateValueAndValidity();
    formgrp.controls['accomodation_type'].updateValueAndValidity();
    formgrp.controls['home_type'].updateValueAndValidity();
    formgrp.controls['scope_of_work'].updateValueAndValidity();
    formgrp.controls['have_homeloan'].updateValueAndValidity();
    formgrp.controls['possession_status'].updateValueAndValidity();
    formgrp.controls['budget_value'].updateValueAndValidity();
    formgrp.controls['home_value'].updateValueAndValidity();
    var elems=document.getElementsByClassName('hideAsteriskIcon')
    for(var i=0;i<elems.length;i++){
      elems[i].setAttribute('style','display:none');
    }
  }

  possesionStatusSelected(val,formName) {
    if(val == 'Awaiting Possession' && formName=='addleadQuestionnaire') {
      document.getElementById('possesionadd_date').style.display = 'block';
      if(this.addleadquestionnaire.controls['lead_status'].value=='qualified'){
        this.addleadquestionnaire.controls['possession_status_date'].setValidators([Validators.required]);
        this.addleadquestionnaire.controls['possession_status_date'].updateValueAndValidity();
      } else {
        this.addleadquestionnaire.controls['possession_status_date'].clearValidators();
        this.addleadquestionnaire.controls['possession_status_date'].updateValueAndValidity();
      }
    }
    if(val =='Possession Taken' && formName=='addleadQuestionnaire') {
      document.getElementById('possesionadd_date').style.display = 'none';
      this.addleadquestionnaire.controls['possession_status_date'].setValue(undefined);
      this.addleadquestionnaire.controls['possession_status_date'].clearValidators();
      this.addleadquestionnaire.controls['possession_status_date'].updateValueAndValidity();
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
    if(ext == 'jpg' || ext == 'jpeg' || ext=='png' || ext=='gif' || ext=='svg') {
      fileReader.onload = (fileLoadedEvent) => {
        base64 = fileLoadedEvent.target;
        this.questionnaire_floorplan_basefile = base64.result;
      };
    } else {
      document.getElementById('extErrorMsg').classList.remove('d-none');
    }
    fileReader.readAsDataURL(this.floorplan_attachment_file);
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
    for(var i=0;i<this.add_lead_types.length;i++){
      if(val==this.add_lead_types[i].id){
        this.addLeadForm.controls['lead_type_name'].setValue(this.add_lead_types[i].name);
      }
    }
  }

  attachment_file: any;
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

  reasonForLostDropdownChange(val){
      if(val=='others'){
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
  reasonForLostDropdownChange1(val){
      if(val=='others'){
        document.getElementById('addleadFormquestremark').setAttribute('style','display:block');
        this.addLeadForm.controls['lost_remark'].setValidators([Validators.required]);
      } else {
        if(document.getElementById('addleadFormquestremark'))
          document.getElementById('addleadFormquestremark').setAttribute('style','display:none');
          this.addLeadForm.controls['lost_remark'].setValue("");
          this.addLeadForm.controls['lost_remark'].validator=null;
      }
      this.addLeadForm.controls['lost_remark'].updateValueAndValidity();
    }
  reasonForLostDropdownChange2(val){
      if(val=='others'){
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

    inviteChampionFormSubmit(data){
      this.loaderService.display(true);
      this.leadService.inviteChampion(data).subscribe(
        res=>{
        this.successalert = true;
          this.successMessage = res.message;
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 5000);
          this.inviteChampionForm.reset();
          this.champion_user = "";

          $('#inviteChampionModal').modal('hide');
          this.loaderService.display(false);
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
        || this.addLeadForm.controls['lead_source_type'].value == 'associate_partner'
        || this.addLeadForm.controls['lead_source_type'].value == 'non_display_dealer'
        || this.addLeadForm.controls['lead_source_type'].value == 'others'){ 
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
}
