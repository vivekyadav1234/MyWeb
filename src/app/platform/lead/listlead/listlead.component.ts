import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import {Lead} from '../lead';
import {
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';
import { LoaderService } from '../../../services/loader.service';
import { SortPipe } from '../../../shared/sort.pipe';
import { SalesManagerService } from '../../salesmanager/sales-manager.service';
import { DynamicFormService } from '../../../shared/dynamic-form/dynamic-form.service';
import { FormBase } from '../../../shared/dynamic-form/form-base';
//import { DateTimePickerModule} from 'ngx-datetime-picker';

declare var $:any;

@Component({
  selector: 'app-listlead',
  templateUrl: './listlead.component.html',
  styleUrls: ['./listlead.component.css'],
  providers: [LeadService, DynamicFormService]
})
export class ListleadComponent implements OnInit {

  observableLeads: Observable<Lead[]>
  leads: any[];
  leadActionAccess = ['admin','lead_head'];
  role : string;
  leadRecordNotes : any[];
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  erroralertmodal = false;
  errorMessagemodal : string;
  successMessagemodal : string;
  successalertmodal = false;
  successalert = false;
  successMessage : string;
  exportFileData : any;
  addLeadForm : FormGroup;
  leadStatusUpdateForm : FormGroup;
  leadquestionnaire : FormGroup;
  updateLeadquestionnaireForm : FormGroup;
  leadDetails:any;
  note_records : any;
  lead_source : string;
  sourceOfBulkLeads : string;
  showAlternateForm: boolean;
  staticFields: any;
  alternateNumberForm: FormGroup;
  @Input() fields: FormBase<any>[] = [];
  
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private leadService:LeadService,
    private loaderService:LoaderService,
    private formBuilder: FormBuilder,
    private dynamicFormService: DynamicFormService
  ) { 
    this.role = localStorage.getItem('user');
  }
  ngOnChanges(): void {
    this.getLeadListFromService();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.lead_source = params['lead_type'];
        this.getLeadListFromService();
        this.getCSAgentList();
    });

    this.addLeadForm = this.formBuilder.group({
      name : new FormControl("",Validators.required),
      email : new FormControl("",[Validators.required,Validators.pattern("[^ @]*@[^ @]*.[^ @]")]),
      contact : new FormControl("",[Validators.required]),
      pincode : new FormControl(""),
      user_type : new FormControl("",Validators.required),
      lead_source : new FormControl(""),
    });
    this.leadStatusUpdateForm = this.formBuilder.group({
      lead_status : new FormControl(""),
      follow_up_time : new FormControl(""),
      lost_remark : new FormControl("")
    });
    this.leadquestionnaire = this.formBuilder.group({
      customer_name : new FormControl(""),
      phone : new FormControl(""),
      project_name: new FormControl(""),
      city : new FormControl("",Validators.required),
      location: new FormControl("",Validators.required),
      project_type :new FormControl("",Validators.required),
      accomodation_type: new FormControl("",Validators.required),
      //scope_of_work : new FormControl("",Validators.required),
      scope_of_work : new FormArray([],Validators.required),
      possession_status :new FormControl("",Validators.required),
      have_homeloan: new FormControl("",Validators.required),
      call_back_day: new FormControl("",Validators.required),
      remarks_of_sow: new FormControl(),
      possession_status_date:new FormControl(),
      home_value:new FormControl(),
      budget_value:new FormControl(),
      call_back_time: new FormControl("",Validators.required),
      have_floorplan: new FormControl("",Validators.required),
      lead_generator: new FormControl(""),
      additional_comments :new FormControl(""),
      ownerable_type : new FormControl('Lead'),
      user_id : new FormControl(localStorage.getItem('userId')),
      ownerable_id : new FormControl()
    });
    this.updateLeadquestionnaireForm = this.formBuilder.group({
      customer_name : new FormControl("",Validators.required),
      phone : new FormControl("",Validators.required),
      project_name: new FormControl(""),
      city : new FormControl("",Validators.required),
      location: new FormControl("",Validators.required),
      project_type :new FormControl("",Validators.required),
      accomodation_type: new FormControl("",Validators.required),
      // scope_of_work : new FormControl("",Validators.required),
      scope_of_work : new FormArray([],Validators.required),
      budget_value:new FormControl(),
      home_value: new FormControl(),
      possession_status :new FormControl("",Validators.required),
      remarks_of_sow: new FormControl(),
      possession_status_date:new FormControl(),
      have_homeloan: new FormControl("",Validators.required),
      call_back_day: new FormControl("",Validators.required),
      call_back_time: new FormControl("",Validators.required),
      have_floorplan: new FormControl("",Validators.required),
      lead_floorplan:new FormControl(""),
      //lead_generator: new FormControl("",Validators.required),
      additional_comments :new FormControl(""),
      ownerable_type : new FormControl('Lead'),
      user_id : new FormControl(localStorage.getItem('userId')),
      ownerable_id : new FormControl()
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

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  recordNotesForm = this.formBuilder.group({
    notes : new FormControl('',Validators.required),
    ownerable_type : new FormControl('Lead'),
    ownerable_id: new FormControl(),
    user_id : new FormControl(localStorage.getItem('userId'))
  });

  approveUser(id, index) {
    this.loaderService.display(true);
    this.leadService.changeStatus(id).subscribe(res=>{
      Object.keys(res).map((key)=>{ res= res[key];});
      this.leads[index] = res;
      this.getLeadListFromService();
      this.loaderService.display(false);
    },error=>{
      this.errorMessage = <any>error;
       this.loaderService.display(false);
    });
  }

  getLeadListFromService(){
    this.loaderService.display(true);
    this.observableLeads = this.leadService.getLeadList(this.lead_source);
    this.observableLeads.subscribe(
        leads => {
          this.leads = leads;
          Object.keys(leads).map((key)=>{ this.leads= leads[key];});
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
             }.bind(this), 3000);

            //$.notify('Deleted Successfully!');
              this.getLeadListFromService();
              //this.loaderService.display(false);
            },
            error =>  {
              this.erroralert = true;
              this.errorMessage = <any>JSON.parse(error['_body']).message;
              setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
            //  $.notify('error',JSON.parse(this.errorMessage['_body']).message);
               this.loaderService.display(false);
            }
        );
    }
  }

  possesionStatusSelected(val,formName) {
    if(val == 'Awaiting Possession' && formName=='updateQuestionnaire') {
      if(this.leadDetails.user_type == 'customer' && this.note_records.length !=0 && document.getElementById('possesiondateupdate')!=null){
        document.getElementById('possesiondateupdate').style.display = 'block';
      }
    }
    if(val == 'Awaiting Possession' && formName=='leadQuestionnaire') {
      document.getElementById('possesiondate').style.display = 'block';
    }
    if(val =='Possession Taken' && formName=='updateQuestionnaire') {
      if(this.leadDetails.user_type == 'customer' && this.note_records.length !=0 && document.getElementById('possesiondateupdate')!=null){
        document.getElementById('possesiondateupdate').style.display='none';
      }
      this.updateLeadquestionnaireForm.controls['possession_status_date'].setValue(undefined);
    }
    if(val =='Possession Taken' && formName=='leadQuestionnaire') {
      document.getElementById('possesiondate').style.display = 'none';
      this.leadquestionnaire.controls['possession_status_date'].setValue(undefined);
    }
  }

  fpQuestionnaireSelected(val){
    if(val == 'yes'){
      document.getElementById('floorplanQuestionnaire').style.display = 'block';
    } else {
      document.getElementById('floorplanQuestionnaire').style.display = 'none';
      this.floorplan_attachment_file = undefined;
      this.questionnaire_floorplan_basefile = undefined;
    }
  }

  scopeOfWorkSelected(val){
    if(val!='Remarks'){
      this.leadquestionnaire.controls['remarks_of_sow'].setValue(undefined);
      this.updateLeadquestionnaireForm.controls['remarks_of_sow'].setValue(undefined);
    } 
  }

  onCheckChange(event,htmlElemName) {
    var formArray: FormArray
    var updateFormArray : FormArray;
    if(htmlElemName== 'scope_of_work') {
      formArray = this.leadquestionnaire.get('scope_of_work') as FormArray;
      updateFormArray = this.updateLeadquestionnaireForm.get('scope_of_work') as FormArray;
    }
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
      updateFormArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
      var j:number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
      updateFormArray.controls.forEach((ctr: FormControl) => {
        if(ctr.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          updateFormArray.removeAt(j);
          return;
        }

        j++;
      });
      if(event.target.value =='Remarks'){
        this.leadquestionnaire.controls['remarks_of_sow'].setValue("");
        this.updateLeadquestionnaireForm.controls['remarks_of_sow'].setValue("");
      }
    }
  }


  postRecordNotesQuestionnaire(leadId,data){
    this.loaderService.display(true);
    this.leadquestionnaire.controls['ownerable_id'].setValue(leadId);
    this.leadquestionnaire.controls['customer_name'].setValue(this.leadDetails.name);
    this.leadquestionnaire.controls['phone'].setValue(this.leadDetails.contact);
    data['customer_name'] = this.leadDetails.name;
    data['phone'] = this.leadDetails.contact;
    data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
    this.leadService.postRecordNotesQuestionnaire(leadId,data).subscribe(
        res => {
          Object.keys(res).map((key)=>{ this.note_records= res[key];});
          this.floorplan_attachment_file = undefined;
          this.leadquestionnaire.reset();
          this.setUpdateLeadquestionnaireFormControls(this.note_records);
          this.loaderService.display(false);
          this.successalertmodal = true;
          this.successMessagemodal = "Form submitted successfully!";
          $('#leadDetailsModal').scrollTop(0);
          setTimeout(function() {
              this.successalertmodal = false;    
            }.bind(this), 5000);
        },
        err => {
           this.erroralertmodal = true;
          this.errorMessagemodal = JSON.parse(err['_body']).message;
          this.loaderService.display(false);
          $('#leadDetailsModal').scrollTop(0);
          setTimeout(function() {
              this.erroralertmodal = false;    
            }.bind(this), 5000);
        }
      );
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
    this.leadService.uploadLeadExcel(this.basefile,this.sourceOfBulkLeads,'',"")
    .subscribe(
        res => {
          $('#exampleModal').modal('hide');
          this.getLeadListFromService();
          this.loaderService.display(false);
          this.sourceOfBulkLeads = undefined;
          this.successalert = true;
          this.basefile = undefined;
          this.successMessage = "Sheet uploaded successfully !!";
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


  exportLeads() {
    this.leadService.exportLeads(this.role).subscribe(
      data => { 
        this.exportFileData  = data;
        this.downloadFile(this.exportFileData);
      },
      err => {
        
      }
    );
  }

  downloadFile(data){
    var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var b64Data =  data._body;

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

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 || 
        e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9
        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
      return false;
    }
  }

  addLeadFormSubmit(data) {
    this.loaderService.display(true);
    data['created_by'] = localStorage.getItem('userId');
    this.leadService.addLead(data)
        .subscribe(
          res => {
            this.addLeadForm.reset();
            $('#addNewLeadModal').modal('hide');
            this.addLeadForm.controls['user_type'].setValue("");
            this.addLeadForm.controls['lead_source'].setValue("");
            this.getLeadListFromService();
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

  viewLeadDetails(id) {
    this.loaderService.display(true);
    this.leadService.viewLeadDetails(id)
      .subscribe(
          lead => {
            this.leadDetails = lead;
            Object.keys(lead).map((key)=>{ this.leadDetails= lead[key];});
            this.leadEmail = this.leadDetails.email;
            this.leadContact =this.leadDetails.contact;
            this.leadStatusUpdateForm.controls['lead_status'].setValue(this.leadDetails.lead_status);
            this.loaderService.display(false);
          },
          error => {
            this.erroralert = true;
            this.errorMessage=JSON.parse(error['_body']).message;
            this.loaderService.display(false);
          }
     );
    this.note_records = undefined;
    // this.getRecordNotesQuestionnaire(id);
  }

  getRecordNotesQuestionnaire(id) {
    this.loaderService.display(true);
    this.note_records = undefined;
    this.leadService.getRecordNotesQuestionnaire(id).subscribe(
      res => {
        Object.keys(res).map((key)=>{ res= res[key];});
        this.note_records = res;
        this.setUpdateLeadquestionnaireFormControls(this.note_records[0]);
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    )
  }
  setUpdateLeadquestionnaireFormControls(note_records) {
    if(note_records!= null){
      this.updateLeadquestionnaireForm.controls['customer_name'].setValue(note_records.customer_name);
      this.updateLeadquestionnaireForm.controls['phone'].setValue(note_records.phone);
      this.updateLeadquestionnaireForm.controls['project_name'].setValue(note_records.project_name);
      this.updateLeadquestionnaireForm.controls['city'].setValue(note_records.city);
      this.updateLeadquestionnaireForm.controls['location'].setValue(note_records.location);
      this.updateLeadquestionnaireForm.controls['project_type'].setValue(note_records.project_type);
      this.updateLeadquestionnaireForm.controls['accomodation_type'].setValue(note_records.accomodation_type);
      //this.updateLeadquestionnaireForm.controls['scope_of_work'].setValue(note_records.scope_of_work);
      this.updateLeadquestionnaireForm.controls['remarks_of_sow'].setValue(note_records.remarks_of_sow);
      this.updateLeadquestionnaireForm.controls['possession_status'].setValue(note_records.possession_status);
      this.updateLeadquestionnaireForm.controls['possession_status_date'].setValue(note_records.possession_status_date);
      this.updateLeadquestionnaireForm.controls['home_value'].setValue(note_records.home_value);
      this.updateLeadquestionnaireForm.controls['budget_value'].setValue(note_records.budget_value);
      this.updateLeadquestionnaireForm.controls['have_homeloan'].setValue(note_records.have_homeloan);
      this.updateLeadquestionnaireForm.controls['call_back_day'].setValue(note_records.call_back_day);
      this.updateLeadquestionnaireForm.controls['call_back_time'].setValue(note_records.call_back_time);
      this.updateLeadquestionnaireForm.controls['have_floorplan'].setValue(note_records.have_floorplan);
      this.updateLeadquestionnaireForm.controls['lead_floorplan'].setValue(note_records.lead_floorplan);
      //this.updateLeadquestionnaireForm.controls['lead_generator'].setValue(note_records.lead_generator);
      this.updateLeadquestionnaireForm.controls['additional_comments'].setValue(note_records.additional_comments);
      if(note_records.scope_of_work != null) {
        this.updateLeadquestionnaireForm.controls['scope_of_work']['controls']=[];
        for(var k=0;k<note_records.scope_of_work.length;k++){
          this.updateLeadquestionnaireForm.controls['scope_of_work']['controls'].push(new FormControl(note_records.scope_of_work[k]));
        }
      }
      this.possesionStatusSelected(note_records.possession_status,'updateQuestionnaire');
    }
    
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
   
  leadContact;
  leadEmail;
  updateStatus(data,id) {
    //this.leadStatusUpdateForm.reset();
    this.loaderService.display(true);
    data['email'] = this.leadEmail;
    data['contact']= this.leadContact;
    data['lead_status']= this.leadStatusUpdateForm.controls['lead_status'].value;
    if(!this.showAlternateForm || (this.showAlternateForm && this.alternateNumberForm.valid )){
    let alternateNumberObj = [];
    alternateNumberObj.push(this.alternateNumberForm.value);
    data['alternate_contacts']=alternateNumberObj;
  
    this.leadService.updateLeadStatus(data,id).subscribe(
      res => {
         this.successalertmodal = true;
         this.loaderService.display(false);
          this.successMessagemodal = "Status updated successfully !!";
          document.getElementById('lostremark').setAttribute('style','display: none');
          document.getElementById('datetime').setAttribute('style','display: none');
          setTimeout(function() {
            this.successalertmodal = false;
          }.bind(this), 5000);
        this.viewLeadDetails(id);
      },
      err => {
        this.erroralertmodal = true;
        document.getElementById('lostremark').setAttribute('style','display: none');
        document.getElementById('datetime').setAttribute('style','display: none');
          this.errorMessagemodal = JSON.parse(err['_body']).message;;
          setTimeout(function() {
            this.erroralertmodal = false;
          }.bind(this), 5000);
        this.viewLeadDetails(id);
        this.loaderService.display(false);
      }
    )
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

  Questionarrie(leadId){
    //this.note_records = undefined;
    this.getRecordNotesQuestionnaire(leadId);
   if($(".addClass1").hasClass("hideClass"))
    {
      $(".addClass1").removeClass("hideClass");
      $(".addClass").addClass("hideClass");
      $(".upload0").removeClass("actBtn");
      $(".upload1").addClass("actBtn");
    }
   else
    {
      $(".addClass").addClass("hideClass");
      $(".upload0").removeClass("actBtn");
      $(".upload1").addClass("actBtn");
    }
  }

  closeModal(){
    if($(".addClass").hasClass("hideClass")) {
       $(".addClass").removeClass("hideClass");
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
    } else {
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
    }
    this.leadEmail = undefined;
    this.leadContact = undefined;
  }
 
  updateRecordNotesQuestionnaire(leadId,data){
    this.loaderService.display(true);
    this.updateLeadquestionnaireForm.controls['ownerable_id'].setValue(leadId);
    var noteRecordId = this.note_records[0].id || this.note_records.id;
    data['lead_floorplan'] = this.questionnaire_floorplan_basefile;
    this.leadService.updateRecordNotesQuestionnaire(leadId,data,noteRecordId).subscribe(
        res => {
          this.successalertmodal = true;
          this.successMessagemodal = "Updated successfully !!";
          this.questionnaire_floorplan_basefile = undefined;
          this.floorplan_attachment_file = undefined;
          $('#leadDetailsModal').scrollTop(0);
           setTimeout(function() {
                 this.successalertmodal = false;
            }.bind(this), 5000);
          this.getRecordNotesQuestionnaire(leadId);
          //Object.keys(res).map((key)=>{ this.leadRecordNotes= res[key];});
          this.loaderService.display(false);
        },
        err => {
          
          this.erroralertmodal = true;
          this.errorMessagemodal = JSON.parse(err['_body']).message;
          $('#leadDetailsModal').scrollTop(0);
          setTimeout(function() {
                 this.erroralertmodal = false;
            }.bind(this), 5000);
          this.loaderService.display(false);
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
  csagentList : any[];

  assignLeadToAgent(id:number,index:number){
    if(this.assignedAgentId[index] != undefined && this.assignedAgentId[index] !='Assign To CS Agent') {
      this.loaderService.display(true);
      this.leadService.assignLeadToAgent(this.assignedAgentId[index],id)
                .subscribe(
            res => {
              Object.keys(res).map((key)=>{ res= res[key];});
              this.getLeadListFromService();
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

  getCSAgentList() {
    this.leadService.requestRole('cs_agent')
        .subscribe(
          res => {
            Object.keys(res).map((key)=>{ this.csagentList= res[key];});
          },
          error => {
            this.erroralert = true;
            this.errorMessage=JSON.parse(error['_body']).message;
          }
        );
  }

  callToLead(contact){
    this.leadService.callToLead(localStorage.getItem('userId'), contact).subscribe(
        res => {
        },
        err => {
          
        }
     );
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
      document.getElementById('downArrow').style.display = 'none';
    } else if(colVal == 'lead_status') {
      this.filtercol2Val = '';
      this.filtercol2Arr = ['qualified','not_attempted','lost','claimed','not_claimed','follow_up','not_contactable','lost_after_5_tries'];
      document.getElementById('filter2dropdown').style.display = 'inline-block';
      document.getElementById('downArrow').style.display = 'inline-block';
    } else if(colVal == 'user_type') {
      this.filtercol2Val = '';
      this.filtercol2Arr = ['customer','designer','manufacturer'];
      document.getElementById('filter2dropdown').style.display = 'inline-block';
      document.getElementById('downArrow').style.display = 'inline-block';
    } else if(colVal == 'source') {
      this.filtercol2Val = '';
      this.filtercol2Arr = ['digital','bulk']
      document.getElementById('filter2dropdown').style.display = 'inline-block';
      document.getElementById('downArrow').style.display = 'inline-block';
    } else if(colVal == 'lead_source') {
      this.filtercol2Val = '';
      this.filtercol2Arr = ['weddingz_team','hfc','broker', 'housing_finance', 'digital_marketing', 'referral', 'website'];
      document.getElementById('filter2dropdown').style.display = 'inline-block';
      document.getElementById('downArrow').style.display = 'inline-block';
    } else if(colVal == 'created_at') {
      this.filteredleads = this.leads;
      document.getElementById('filter2dropdown').style.display = 'none';
      document.getElementById('downArrow').style.display = 'none';
      document.getElementById('fromDateFilter').style.display = 'inline-block';
      document.getElementById('toDateFilter').style.display = 'inline-block';
    }
  }
  filterColum2DropdownChange(colVal){
    this.leadService.getLeadList('all').subscribe(
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
    this.leadService.getLeadList('all').subscribe(
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
    // return (new Date(str).toString() !== "Invalid Date" ) ? true : false;
  }

  addAlternateNumberForm(){
    this.showAlternateForm = !this.showAlternateForm;
    this.fields=[];
    this.staticFields.forEach(elem =>{
        this.fields.push(elem);
    });
    this.alternateNumberForm = this.dynamicFormService.toFormGroup(this.fields);
  }


}