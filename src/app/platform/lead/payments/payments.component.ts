import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import {FinanceService} from '../../finance/finance.service';
import { QuotationService } from '../../quotation/quotation.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
import {Location} from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  providers: [ LeadService , QuotationService, LoaderService]
})
export class PaymentsComponent implements OnInit {
  lead_id;
  lead_status;
  project_id;
  lead_details:any;
  approveList: any;
  paymentForm: FormGroup;
  basefile = {};
  image: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:any;
  ReceiptForm = new FormGroup({  
    customer_name: new FormControl(''),
    amount: new FormControl(''),
    bank: new FormControl(''),
    branch: new FormControl(''),
    date: new FormControl(''),
    rtgs_trx_no: new FormControl(''),
  });
  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    private financeService:FinanceService,
    public loaderService : LoaderService,
    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute,
    private quotationService : QuotationService,
    private _location: Location,
    private ref: ChangeDetectorRef

    ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
        this.project_id = params['projectId'];
      });
     this.paymentForm = this.formBuilder.group({
      'payment_type': ['initial_design', Validators.required],
      'amount': ['', Validators.required],
      'mode_of_payment': ['', Validators.required],
      'bank': [''],
      'branch': [''],
      'date_of_checque': [''],
      'date': [''],
      'transaction_number':[''],
      'image': [''],
      'project_id':['',Validators.required],
      'quotation_ids' : new FormArray([]),
      'payment_stage' : ['pre_10_percent', Validators.required]
    });
    this.role = localStorage.getItem('user');
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });

    this.fetchBasicDetails();
    
  }


  fetchBasicDetails(){
    this.loaderService.display(true);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.paymentForm.controls['project_id'].setValue(this.project_id);
        this.getApprovedBoqList();
        this.getPaymentHistory();


      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  getApprovedBoqList(){

    this.loaderService.display(true);
    this.leadService.getApprovedBoqList(this.project_id,this.selectedSet).subscribe(
      res=>{
        this.loaderService.display(false);
         this.approveList = res['quotations'];
          

      },
      err=>{
          
          this.loaderService.display(false);
      }
      );

  }

  selectedSet:any = "pre_10_percent";
  getSet(selectedSet){
    // Resetting selection if the tab is changed
    this.paymentForm = this.formBuilder.group({
      'payment_type': ['initial_design', Validators.required],
      'amount': ['', Validators.required],
      'mode_of_payment': ['', Validators.required],
      'bank': [''],
      'branch': [''],
      'date_of_checque': [''],
      'date': [''],
      'transaction_number':[''],
      'image': [''],
      'project_id':['',Validators.required],
      'quotation_ids' : new FormArray([]),
      'payment_stage' : ['selectedSet', Validators.required]
    });
    this.array_length = this.paymentForm.controls['quotation_ids'].value.length;
    
    if(this.array_length > 0){
      $('#bt-disable').prop('disabled', false);
      $('#bt-disable').css('cursor', 'pointer');
    }
    else{
      $('#bt-disable').prop('disabled', true);
      $('#bt-disable').css('cursor', 'not-allowed');
    }
    this.paymentForm.controls['project_id'].setValue(this.project_id);
    //
    this.selectedSet = selectedSet;
    this.paymentForm.patchValue({payment_stage: this.selectedSet});
    if(this.selectedSet == "pre_10_percent"){
      this.getApprovedBoqList();
      this.paymentForm.patchValue({payment_type: "initial_design"});
    }
    else if(this.selectedSet == "10_50_percent"){
      this.getApprovedBoqList();
      this.paymentForm.patchValue({payment_type: "final_design"});
    }
    else if(this.selectedSet == "100_percent"){
      this.paymentForm.patchValue({payment_type: "final_payment"});
      this.paymentForm.patchValue({payment_stage: "final_payment"});
      this.getFinalPaymentQuotation();
        
    }
  }
   pending_amt;
   getFinalPaymentQuotation(){
     this.approveList = [];
     this.leadService.getFinalPaymentQuotationLead(this.project_id).subscribe(
          res=>{
          this.loaderService.display(false);
          this.approveList = res['quotations'];
          
          },
            err=>{
                
                this.loaderService.display(false);
            }
            );
   }
        
          

   isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent","100_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details && this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }

 changePaymentMode(event){
    
    this.paymentForm.controls['image'].setValue('');

    if(event.target.value == "NEFT/RTGS"){
      $(".cheque-mode").css("display", "none");
      $(".neft-mode").css("display", "block");
          
      this.paymentForm.controls['bank'].setValue('');
      this.paymentForm.controls['branch'].setValue('');
      this.paymentForm.controls['date_of_checque'].setValue('');
      this.paymentForm.controls['image'].setValidators(null);
    }
    else if(event.target.value == "cheque"){
      $(".cheque-mode").css("display", "block");
      $(".neft-mode").css("display", "none");
      this.paymentForm.controls['transaction_number'].setValue('');
      this.paymentForm.controls['date'].setValue('');
      this.paymentForm.controls['image'].setValidators([Validators.required]);
    }
    this.paymentForm.controls["image"].updateValueAndValidity();

    this.ref.detectChanges();
    
  }
  array_length;
  msg;
  savePayment(){
    this.loaderService.display(true);
    $('#addPayment').modal('hide');
    let attachment= this.paymentForm.get('mode_of_payment').value=='cheque' || this.paymentForm.get('mode_of_payment').value=='NEFT/RTGS'? this.basefile :''
    this.quotationService.savePayment(this.project_id,this.paymentForm.value,attachment).subscribe(
      res => {
        
         if(this.selectedSet == "100_percent"){
           this.getFinalPaymentQuotation();
         }
         else{
           this.getApprovedBoqList();
           //this.fetchBasicDetails();
         }
        this.successalert = true;
        this.successMessage = 'Payment Added successfully!';
        this.loaderService.display(false);
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
          // this.paymentForm.reset();
          this.paymentForm.controls['mode_of_payment'].setValue('');
          this.paymentForm.controls['bank'].setValue('');
          this.paymentForm.controls['branch'].setValue('');
          this.paymentForm.controls['date_of_checque'].setValue('');
          this.paymentForm.controls['transaction_number'].setValue('');
          this.paymentForm.controls['amount'].setValue('');
          this.paymentForm.controls['quotation_ids'] = new FormArray([]);
          this.paymentForm.controls['image'].setValue('');
          this.paymentForm.controls['date'].setValue('');
          $(".cheque-mode").css("display", "none");
          $(".neft-mode").css("display", "none");
          this.basefile=undefined;
        },
      err => {

        
        this.msg = JSON.parse(err._body)["message"]
        
        alert(this.msg);
        this.loaderService.display(false);
      });

  }
  onCheckChange(event){
    if(event.target.checked){
      (<FormArray>this.paymentForm.controls['quotation_ids']).push(new FormControl(event.target.value));
    } else{
      var j:number = 0;
      (<FormArray>this.paymentForm.controls['quotation_ids']).controls.forEach((ctr: FormControl) => {
        if(ctr.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          (<FormArray>this.paymentForm.controls['quotation_ids']).removeAt(j);
          return;
        }
          
        j++;
      });


    }
    this.array_length = this.paymentForm.controls['quotation_ids'].value.length;
    if(this.array_length > 0){
      $('#bt-disable').prop('disabled', false);
      $('#bt-disable').css('cursor', 'pointer');

    }
    else{
      $('#bt-disable').prop('disabled', true);
      $('#bt-disable').css('cursor', 'not-allowed');
    }
   
  }
  onChange(event) {
    this.image = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile = base64.result

    };

    fileReader.readAsDataURL(this.image);
  }
  payment_details;
  getPaymentQuotation(paymentId){
    this.loaderService.display(true);
    this.financeService.getPaymentQuotation(this.project_id,paymentId).subscribe(
      res=>{
        this.payment_details=res['payment']['quotation_payments'];
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );

  }
  showAccordion(index,paymentId){
    var this1=this;
    var str='#accordion_'+index;
    // var str2='#package'+index+' i.fa';
    var str3=".combmoduleAccordionRow"+index;
    $(str).on('shown.bs.collapse', function () {
      $(str3).removeClass('d-none');
      //this1.getPaymentDetails(boqid);
    });
    $(str).on('hidden.bs.collapse', function () {
      $(str3).addClass('d-none');
      this1.payment_details=undefined;
    });
    // var str='combmoduleAccordionRow'+index;
    // document.getElementById(str).classList.remove('d-none')
  }
  payment_details_Arr;
  getPaymentHistory(){
    this.loaderService.display(true);
    this.financeService.getPaymentDetails(this.project_id).subscribe(
      res=>{
        this.payment_details_Arr=res.payments;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"]
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
      }
    );
  }
   ngAfterViewInit(){

    $(".cheque-mode").css("display", "none");
    $(".neft-mode").css("display", "none");
    $('#bt-disable').prop('disabled', true);
    $('#bt-disable').css('cursor', 'not-allowed');

  }

  approveBoq(boq_id){
    this.loaderService.display(true);
    this.financeService.approveBoq(this.project_id,boq_id).subscribe(
      res=>{
       
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'BOQ approved successfully!';
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
         this.getApprovedBoqList();  
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body)["message"]
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
      }
    );
  }
  quotationidsArr;
  pending_am = 0;
  openAddPaymentModal(){
    var k = 0;
    this.pending_am = 0;
    this.quotationidsArr =this.paymentForm.controls['quotation_ids'].value; 
    for(let j= 0; j < this.quotationidsArr.length;j++){
      var quote_id = this.quotationidsArr[j];
      for(let i= 0; i < this.approveList.length; i++){
        if(this.approveList[i].id == quote_id){
          this.pending_am = this.pending_am +  this.approveList[i].balance_amount;
          

        }

      }

    }
    
  }
  paymentReset(){
    // this.paymentForm.reset();
    $(".cheque-mode").css("display", "none");
    $(".neft-mode").css("display", "none");
    this.paymentForm.controls['mode_of_payment'].setValue('');
    this.paymentForm.controls['bank'].setValue('');
    this.paymentForm.controls['branch'].setValue('');
    this.paymentForm.controls['date_of_checque'].setValue('');
    this.paymentForm.controls['transaction_number'].setValue('');
    this.paymentForm.controls['amount'].setValue('');
    this.paymentForm.controls['image'].setValue('');
    this.paymentForm.controls['date'].setValue('');
    this.paymentForm.patchValue( {'payment_type':'initial_design'} );
    this.paymentForm.patchValue( {'payment_stage':'pre_10_percent'} );
    this.paymentForm.patchValue( {'project_id':this.project_id} );
    this.paymentForm.controls['quotation_ids'].setValue(this.quotationidsArr);
    this.basefile=undefined;
    
    if(this.selectedSet == "100_percent"){
      this.paymentForm.patchValue( {'payment_stage':"final_50_percent"} );

    }
    
    

  }
  pending_chk;
  checkPendingAmt(elemid){
    this.pending_chk = (<HTMLInputElement> document.getElementById(elemid)).value;
    
    if(this.pending_chk > this.pending_am){
      alert("Paid Amount is greater than pending amount");
      $('#pending_amt').val(0);
     

    }

  }
  projectId;
  paymentId;
  details;
  PaymentReceiptData(quotation_id,data,stat){
    // this.getPaymentList();
    $('#PaymentReceipt').modal('show');
    $('#paymentHistoryModal').modal('hide');
    $('.modal').css('overflow-y', 'auto');
    this.details=data;
    this.projectId = data.project_id;
    this.paymentId = data.id;
    this.ReceiptForm.controls['customer_name'].setValue(this.details.lead_name);
    this.ReceiptForm.controls['amount'].setValue(this.details.amount);
    this.ReceiptForm.controls['bank'].setValue(this.details.bank);
    this.ReceiptForm.controls['branch'].setValue(this.details.branch);
    if(this.details.mode_of_payment== "NEFT/RTGS"){
    this.ReceiptForm.controls['date'].setValue(this.details.date);
    }
    if (this.details.mode_of_payment == "cheque") {
      this.ReceiptForm.controls['date'].setValue(this.details.date_of_checque);
    }
    this.ReceiptForm.controls['rtgs_trx_no'].setValue(this.details.transaction_number);
  }  

 typeId;
  getReceipt(type){ //<---update functionality and 
    $('#PaymentReceipt').modal('hide');
    $('#paymentHistoryModal').modal('show');
    $('.modal').css('overflow-y', 'auto');
    this.loaderService.display(true);
    var tomorrow = new Date(this.ReceiptForm.get('date').value);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let  receipt_pdf;
      receipt_pdf = {
        "customer_name":this.ReceiptForm.get('customer_name').value ? this.ReceiptForm.get('customer_name').value : '',
        "amount":this.ReceiptForm.get('amount').value ? this.ReceiptForm.get('amount').value : '',
        "bank":this.ReceiptForm.get('bank').value ? this.ReceiptForm.get('bank').value : '',
        "date": this.ReceiptForm.get('date').value ? this.ReceiptForm.get('date').value : '',
        "branch":this.ReceiptForm.get('branch').value ? this.ReceiptForm.get('branch').value : '',       
        "rtgs_trx_no":this.ReceiptForm.get('rtgs_trx_no').value ? this.ReceiptForm.get('rtgs_trx_no').value : '',   

      } 
     
    this.financeService.getReceipt(this.projectId,this.paymentId,receipt_pdf,type).subscribe(
      res=>{ 
        this.loaderService.display(false);
        $('#PaymentReceipt').modal('hide');
        this.getPaymentHistory();
        var contentType = 'application/pdf';
        var b64Data =  JSON.parse(res._body)['base_64_file'];
        var name=  JSON.parse(res._body)['file_name'];
        var blob = this.b64toBlob(b64Data, contentType,512);
        var blobUrl = URL.createObjectURL(blob);
        let dwldLink = document.createElement("a");
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
        this.successalert = true;
        this.successMessage = "Your File Downloaded Successfully";
        setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
       
      },
      err => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
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
  share(type){
    $('#PaymentReceipt').modal('hide');
    $('#paymentHistoryModal').modal('show');
     $('.modal').css('overflow-y', 'auto');
    let  receipt_pdf;
    receipt_pdf = {
      "customer_name":this.ReceiptForm.get('customer_name').value ? this.ReceiptForm.get('customer_name').value : '',
      "amount":this.ReceiptForm.get('amount').value ? this.ReceiptForm.get('amount').value : '',
      "bank":this.ReceiptForm.get('bank').value ? this.ReceiptForm.get('bank').value : '',
      "date":this.ReceiptForm.get('date').value ? this.ReceiptForm.get('date').value : '',  
      "branch":this.ReceiptForm.get('branch').value ? this.ReceiptForm.get('branch').value : '',      
      "rtgs_trx_no":this.ReceiptForm.get('rtgs_trx_no').value ? this.ReceiptForm.get('rtgs_trx_no').value : '',   
    }
    this.loaderService.display(true);
    this.financeService.getReceipt(this.projectId,this.paymentId,receipt_pdf,type).subscribe(
      res=>{
        $('#PaymentReceipt').modal('hide');
        this.getPaymentHistory();
        this.successalert = true;
        this.successalert = true;
        this.successMessage = (JSON.parse(res['_body']).message);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
        this.loaderService.display(false);
      },
      err=>{
        //this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
  PaymentModalHide(){
    this.getPaymentHistory();
    $('#PaymentReceipt').modal('hide');
    $('#paymentHistoryModal').modal('show');
     $('.modal').css('overflow-y', 'auto');
  }
}


