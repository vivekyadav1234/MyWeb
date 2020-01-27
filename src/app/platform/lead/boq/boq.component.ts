import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { ProjectService } from '../../project/project/project.service';
import { DesignerService } from '../../designer/designer.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { QuotationService } from '../../quotation/quotation.service';
declare var $:any;

@Component({
  selector: 'app-boq',
  templateUrl: './boq.component.html',
  styleUrls: ['./boq.component.css'],
  providers: [LeadService, QuotationService,DesignerService,ProjectService]
})
export class BoqComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  pid : number;
  pname;
  sectionsList;
  selectedQuotationStatus='all';
  selectBoqTypeForm1 : FormGroup;
  selectSectionTypeForm : FormGroup;
  importBoqForm : FormGroup;
  paginationLimit: number;
  startPage: number;
  quotations: any[];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  importquotations;
  lead_status;
  projectsList;
  project_id;
  importedProjectList;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private quotationService : QuotationService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private designerService: DesignerService,
    private projectService:ProjectService
  ) {
    this.paginationLimit = 5; this.startPage = 0;
  }

  showMore(){
    this.paginationLimit = Number(this.paginationLimit) + 2;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.selectBoqTypeForm1 = this.formBuilder.group({
      boqType : new FormControl("create_boq")
    });
    this.selectSectionTypeForm = this.formBuilder.group({
      sections : new FormArray([],Validators.required)
    });
    this.importBoqForm = this.formBuilder.group({
      project : new FormControl({value:'',disabled:true}),
      boq : new FormControl({value:'',disabled:true})
    })
    this.clearLocalStorage();
    this.fetchBasicDetails();
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.pid = res['lead'].project_details.id;
        this.project_id = res['lead'].project_details.id;
        this.pname = res['lead'].project_details.name;
        //this.getSections();
        this.getQuotationListByStatus('all');
        localStorage.removeItem('boqAddedProducts');
        if(localStorage.getItem('selected_sections')){
           localStorage.removeItem('selected_sections');
        }
      },
      err => {
      }
    );
  }

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }

  isFloorPlanUploaded():boolean {
    var floorplan_array = ["floorplan_uploaded","initial_proposal_submitted","initial_proposal_accepted","initial_proposal_rejected","final_proposal_submitted","final_proposal_accepted","final_proposal_rejected"]
    if(this.lead_details.project_details && this.lead_details.project_details.sub_status && floorplan_array.includes(this.lead_details.project_details.sub_status)){
      return true
    }
    else{
      return false
    }
  }

  fpCondition(){
    alert("Please upload floorplan and update requirement sheet");
  }

  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sectionsList = res.sections;
        this.projectsList = res.projects;
        for(var k=0; k<res.projects.length;k++){
          if(res.projects[k].id==this.pid){
            this.pname = res.projects[k].name;
            break;
          }
        }
      },
      err=>{
      }
    );
  }

  getQuotationListByStatus(status){
    this.loaderService.display(true);
    this.selectedQuotationStatus = status;
    if(this.selectedQuotationStatus == 'pre_10_percent' || this.selectedQuotationStatus == '10_50_percent'){
      this.leadService.getApprovedBoqList(this.lead_details.project_details.id,this.selectedQuotationStatus).subscribe(
      res=>{
        this.loaderService.display(false);
         this.quotations = res['quotations'];

      },
      err=>{
          this.loaderService.display(false);
      }
      );

    }
    else{
      this.quotationService.getQuotationList(this.lead_details.project_details.id,status).subscribe(
      res => {
        this.loaderService.display(false);
        this.quotations = res.quotations;
      },
      err => {
        this.loaderService.display(false);
      }
    );

    }
    
  }

  importQuotationValue(pid){
    this.loaderService.display(true);
    this.quotationService.getImportQuotationList(pid).subscribe(
      res => {
        this.loaderService.display(false);
        this.importquotations = res;
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  deleteBoq(id){
    if (confirm("Are You Sure you want to delete this boq") == true) {
      this.loaderService.display(true);
      this.quotationService.deleteQuotation(this.pid,id).subscribe(
        res => {
          this.getQuotationListByStatus(this.selectedQuotationStatus);
          this.loaderService.display(false);
          this.successalert = true;
            this.successMessage = " Deleted successfully";
            setTimeout(function() {
                this.successalert = false;
             }.bind(this), 2000);
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
  }
  showBoqOptionsDropdown(index){
    var htmlElem = 'boqOptionsDropdown-'+index;
    document.getElementById(htmlElem).classList.toggle("show");
  }

  submitForm(form1Val,form2Val,form3Val){
    if(form1Val.boqType == 'create_boq'){
      $('#createquotationModal').modal('hide');
      localStorage.setItem('boqTypeCreation','create_boq');
      form2Val.sections.push('custom_elements');
      localStorage.setItem('selected_sections',JSON.stringify(form2Val.sections));
      this.router.navigate(['lead/'+this.lead_details.id+'/project/'+this.pid+'/boq_modular/create'],{ queryParams: { lead_status: this.lead_status } });
    } 
    if(form1Val.boqType == 'import_boq'){
      $('#createquotationModal').modal('hide');
      localStorage.setItem('boqTypeCreation','import_boq');
      localStorage.setItem('importedBoqValues',form3Val);
      this.router.navigate(['lead/'+this.lead_details.id+'/project/'+this.pid+'/boq_modular/'+this.importBoqId],{ queryParams: { importBoq_id: form3Val.boq, lead_status: this.lead_status, boq_type: 'import_boq' } });
    }
    if(form1Val.boqType == 'create_boq_lf'){
      $('#createquotationModal').modal('hide');
      localStorage.setItem('boqTypeCreation','create_boq_lf');
      // localStorage.setItem('selected_sections',JSON.stringify(form2Val.sections));
      this.router.navigate(['project/'+this.pid+'/boq/create'],{ queryParams: { lead_status: this.lead_status } });
    } 
  }
  
  checkBoqType(val){
    var inputs;
    if(val=='create_boq') {
      inputs = document.getElementsByClassName('sectionType-class');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = false;
      }
      inputs = document.getElementsByClassName('importType-class');
      var inputs2 = document.getElementsByClassName('importType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = true;
          inputs[i].classList.remove('activeselectColor');
          inputs2[i].classList.remove('activeselectColor');
      }
      this.importBoqForm.reset();
      inputs = document.getElementsByClassName('sectionType-class');
      inputs2 = document.getElementsByClassName('sectionType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = false;
          inputs[i].classList.add('activeselectColor');
          inputs2[0].classList.add('activeselectColor');
      }
    }
    if(val=='import_boq') {
      
      inputs = document.getElementsByClassName('importType-class');
      var inputs2 = document.getElementsByClassName('importType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = false;
          inputs[i].classList.add('activeselectColor');
          inputs2[i].classList.add('activeselectColor');
      }
      
      this.selectSectionTypeForm.reset();
      var formArray: FormArray;
      var j =0;
      formArray = this.selectSectionTypeForm.get('sections') as FormArray;
      formArray.controls.forEach(() => {
        formArray.removeAt(j);
        j++;
      });

      inputs = document.getElementsByClassName('sectionType-class');
      inputs2 = document.getElementsByClassName('sectionType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = true;
          inputs[i].checked = false;
          inputs[i].classList.remove('activeselectColor');
          inputs2[0].classList.remove('activeselectColor');
      }

      this.importProjectList();
    }
    if(val=='create_boq_lf') {
      inputs = document.getElementsByClassName('sectionType-class');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = true;
      }
      inputs = document.getElementsByClassName('importType-class');
      var inputs2 = document.getElementsByClassName('importType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = true;
          inputs[i].classList.remove('activeselectColor');
          inputs2[i].classList.remove('activeselectColor');
      }
      this.importBoqForm.reset();
      inputs = document.getElementsByClassName('sectionType-class');
      inputs2 = document.getElementsByClassName('sectionType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = true;
          inputs[i].classList.remove('activeselectColor');
          inputs2[0].classList.remove('activeselectColor');
      }
    }
  }

  onCheckChange(event) {
    var formArray: FormArray
      formArray = this.selectSectionTypeForm.get('sections') as FormArray;
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
      
    }
  }

  downloadboq(boqId){
    this.quotationService.downloadboq(boqId,this.pid).subscribe(
      res =>{
        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        var b64Data =  JSON.parse(res._body)['excel'];
        var name= JSON.parse(res._body)['name']+'.xlsx';
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
        dwldLink.setAttribute("download", name);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      err => {
        this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
      }
    );
  }

  downloadPdf(){
   
    
    if(this.slectedFormat.length > 0){
        this.loaderService.display(true);
        this.quotationService.downloadPdf(this.slectedFormat,this.quoteCheckId,this.pid).subscribe(
        res =>{
          $('#boqCheckModal').modal('hide');
          this.Designertype='';
          this.Customertype='';
          this.loaderService.display(false);
          this.slectedFormat = [];
          this.successalert = true;
            this.successMessage = " Quotation Downloaded Successfully";
            setTimeout(function() {
                this.successalert = false;
             }.bind(this), 5000);
          this.clearCheck();
          if(JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] !=null ){
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['quotation_base_64'];
            var name= JSON.parse(res._body)['boq_name'];
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
            dwldLink.setAttribute("download", name);
            dwldLink.style.visibility = "hidden";
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['service_base_64'];
            var name= JSON.parse(res._body)['service_name'];
            var blob = this.b64toBlob(b64Data, contentType,512);
            var blobUrl = URL.createObjectURL(blob);
            // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let dwldLink1 = document.createElement("a");
            // let url = URL.createObjectURL(blob);
            let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
            if (isSafariBrowser1) {  //if Safari open in new window to save file with random filename.
              dwldLink.setAttribute("target", "_blank");
            }
            dwldLink1.setAttribute("href", blobUrl);
            dwldLink1.setAttribute("download", name);
            dwldLink1.style.visibility = "hidden";
            document.body.appendChild(dwldLink1);
            dwldLink1.click();
            document.body.removeChild(dwldLink1);

            

          }
          else if(JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] ==null){
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['quotation_base_64'];
            var name= JSON.parse(res._body)['boq_name'];
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
            dwldLink.setAttribute("download", name);
            dwldLink.style.visibility = "hidden";
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);

          }
          else if(JSON.parse(res._body)['boq_name'] == null && JSON.parse(res._body)['service_name'] !=null){
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['service_base_64'];
            var name= JSON.parse(res._body)['service_name'];
            var blob = this.b64toBlob(b64Data, contentType,512);
            var blobUrl = URL.createObjectURL(blob);
            // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let dwldLink1 = document.createElement("a");
            // let url = URL.createObjectURL(blob);
            let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
            if (isSafariBrowser1) {  //if Safari open in new window to save file with random filename.
              dwldLink1.setAttribute("target", "_blank");
            }
            dwldLink1.setAttribute("href", blobUrl);
            dwldLink1.setAttribute("download", name);
            dwldLink1.style.visibility = "hidden";
            document.body.appendChild(dwldLink1);
            dwldLink1.click();
            document.body.removeChild(dwldLink1);

          }

        },
        err => {
          this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err['_body']).message;
            setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 2000);
        }
      );

    }
    else{
      alert("Please select atleast one format");
    }

    
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

  direction: number;
    isDesc: boolean = true;
    column: string = 'CategoryName';
    // Change sort function to this: 
    sort(property){
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? 1 : -1; 
    }

    clearLocalStorage(){
      if(localStorage.getItem('quotation_id')){
        localStorage.removeItem('quotation_id');
      }
      if(localStorage.getItem('selected_sections')){
        localStorage.removeItem('selected_sections')
      }
    }

  changeQuotationStatus(status,qid){
    this.loaderService.display(true);
    this.quotationService.changeStatus(qid,status,this.pid).subscribe(
      res=>{
        this.successalert = true;
        this.successMessage = 'Quotation status updated successfully!';
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
      },
      err=> {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
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
  boq_remark;
  boq_remark_id;
  openBoqRemarkModal(quotationId,boqRemark){
    this.boq_remark_id = quotationId;
    $('#boq_remarks').val(boqRemark);
    

  }
  onBoqRemarkSubmit(){
    this.loaderService.display(true);
    $('#statusModal1').modal('hide');
    this.boq_remark = $('#boq_remarks').val();
    var remark ={
      remark: this.boq_remark,
    }
    this.quotationService.subitBoqRemark(this.pid,this.boq_remark_id,remark).subscribe(
      res=>{
        this.successalert = true;
        this.successMessage = 'Remark updated successfully!';
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 5000);
        this.getQuotationListByStatus('all');
        this.loaderService.display(false);

      },
      err=>{
        this.loaderService.display(false);

      });


  }
  
  importProjectList(){
    this.loaderService.display(true);
    this.quotationService.getImportProjectList().subscribe(
      res=>{
        this.loaderService.display(false);
        this.importedProjectList = res;
        this.loaderService.display(false);

      },
      err=>{
        this.loaderService.display(false);
        
        this.loaderService.display(false);

      });

  }
  imporBoqId;
  importBoqId(boqId){
    this.importBoqId = boqId;
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
  quotationCheetId;
display_boq_label;
  downloadCheatSheet(quoteId){
    this.quotationCheetId = quoteId;
    this.display_boq_label='true';
    this.openBoq();

  }


  selected_boq_details:any;
  openBoq(){
    $(".InvoiceModal").on("contextmenu",function(e){
        return false;
    });
    this.display_boq_label = "true" ? true : false
    this.loaderService.display(true);
    this.projectService.getQuotation(this.project_id, this.quotationCheetId,this.display_boq_label).subscribe(
      res=>{
        this.selected_boq_details = res;
        this.loaderService.display(false);
        
        
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = 'Something went wrong. Please try again!';
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 5000);

      })
  }

  quoteCheckId;
  Designertype;
  downloadPdfCheck(quoteId,type){
    this.quoteCheckId = quoteId;
    this.Designertype=type;
  }
  quoteCustomerCheckId;
  Customertype;
  downloadCustomerPdf(quoteId,type){
    this.Customertype=type;
    this.quoteCustomerCheckId = quoteId;
  }
  slectedFormat = [];

  selectPdfFormat(event){
    var index = this.slectedFormat.indexOf(event.target.value);
    
    if(event.target.checked){
      this.slectedFormat.push(event.target.value);


    }

    else{
      this.slectedFormat.splice(index,1);


    }
    

  }
  isChecked1;
  isChecked2;
  isChecked3;
  clearCheck(){
    this.isChecked1 = false;
    this.isChecked2 = false;
    this.isChecked3 = false;

  }
  clearCheckBox(){
    this.clearCheck();
    this.Customertype='';
    this.Designertype='';
  }
  replceUnderScore(string){
    return string.split("_").join("\n");
     
  }
  downloadCustomerBoqPdf(){
   
    if(this.slectedFormat.length > 0){
        this.loaderService.display(true);
        this.quotationService.downloadCustomerBoqPdf(this.slectedFormat,this.quoteCustomerCheckId ,this.pid).subscribe(
        res =>{
          $('#boqCheckModal').modal('hide');
          this.Customertype='';
          this.Designertype='';
          this.loaderService.display(false);
          this.slectedFormat = [];
          this.successalert = true;
            this.successMessage = " Quotation Downloaded Successfully";
            setTimeout(function() {
                this.successalert = false;
             }.bind(this), 5000);
          this.clearCheck();
          if(JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] !=null ){
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['quotation_base_64'];
            var name= JSON.parse(res._body)['boq_name'];
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
            dwldLink.setAttribute("download", name);
            dwldLink.style.visibility = "hidden";
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['service_base_64'];
            var name= JSON.parse(res._body)['service_name'];
            var blob = this.b64toBlob(b64Data, contentType,512);
            var blobUrl = URL.createObjectURL(blob);
            // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let dwldLink1 = document.createElement("a");
            // let url = URL.createObjectURL(blob);
            let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
            if (isSafariBrowser1) {  //if Safari open in new window to save file with random filename.
              dwldLink.setAttribute("target", "_blank");
            }
            dwldLink1.setAttribute("href", blobUrl);
            dwldLink1.setAttribute("download", name);
            dwldLink1.style.visibility = "hidden";
            document.body.appendChild(dwldLink1);
            dwldLink1.click();
            document.body.removeChild(dwldLink1);

            

          }
          else if(JSON.parse(res._body)['boq_name'] != null && JSON.parse(res._body)['service_name'] ==null){
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['quotation_base_64'];
            var name= JSON.parse(res._body)['boq_name'];
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
            dwldLink.setAttribute("download", name);
            dwldLink.style.visibility = "hidden";
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);

          }
          else if(JSON.parse(res._body)['boq_name'] == null && JSON.parse(res._body)['service_name'] !=null){
            var contentType = 'application/pdf';
            var b64Data =  JSON.parse(res._body)['service_base_64'];
            var name= JSON.parse(res._body)['service_name'];
            var blob = this.b64toBlob(b64Data, contentType,512);
            var blobUrl = URL.createObjectURL(blob);
            // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let dwldLink1 = document.createElement("a");
            // let url = URL.createObjectURL(blob);
            let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
            if (isSafariBrowser1) {  //if Safari open in new window to save file with random filename.
              dwldLink1.setAttribute("target", "_blank");
            }
            dwldLink1.setAttribute("href", blobUrl);
            dwldLink1.setAttribute("download", name);
            dwldLink1.style.visibility = "hidden";
            document.body.appendChild(dwldLink1);
            dwldLink1.click();
            document.body.removeChild(dwldLink1);

          }

        },
        err => {
          this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err['_body']).message;
            setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 2000);
        }
      );

    }
    else{
      alert("Please select atleast one format");
    }

    
  }
}