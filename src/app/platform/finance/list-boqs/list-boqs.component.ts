import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FinanceService} from '../finance.service';
declare var $:any;

@Component({
  selector: 'app-list-boqs',
  templateUrl: './list-boqs.component.html',
  styleUrls: ['./list-boqs.component.css'],
  providers:[FinanceService, LoaderService]
})
export class ListBoqsComponent implements OnInit {

  role;
  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  proposaldocList;
  paymentList;
  project_id;
  projectName;
  proposalId;
  proposalName;
  approvalForm: FormGroup;
  approvalEditForm:FormGroup;

  constructor(
    private loaderService : LoaderService,
    private financeService:FinanceService,
    private route:ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.role =localStorage.getItem('user');
    this.route.params.subscribe(params => {
      this.project_id = params['id'];
      this.proposalId = params['proposal_id'];
    });
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project_name'];
      this.proposalName = params['proposal_name'];
    });
    this.approvalForm = this.fb.group({
      'id': [this.project_id, Validators.required],
      'approve' : ['', Validators.required],
      'remarks': ['']
    });
    this.approvalEditForm =this.fb.group({
      'amount': ['',Validators.required]
    })
    this.getBoqList();
  }

  getBoqList(){
    this.loaderService.display(true);
    this.financeService.getBoqList(this.project_id).subscribe(
      res=>{
        
        this.proposaldocList=res.quotations;
   
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  paymentId;


  setPaymentDocId(value){
    this.isChecked = true;

    this.paymentId = value;
    
  }
  isChecked = true;
  paymentApprove(value){
    if(this.isChecked){
      this.approvePay(this.paymentId,value);
      this.isChecked = false;

    }
    
  }
  approvePay(payId,status){
    this.approvalForm.patchValue({approve: status});
    if (status == true) {
      var str = 'Approved';
    }
    else{
      var str = 'Rejected';
    }
    
    this.financeService.approvePayments(this.project_id,payId,this.approvalForm.value).subscribe(
      res=>{
        
        $("#approvePayment").modal("hide");
          // if(this.state == 'initial_design'){

          // }
          // else if(this.state == 'final_design'){
          //   this.getPercentBoqs(this.state);
          // }
        this.getPercentBoqs(this.state);
        this.getBoqList();
        this.getPaymentDetails();
        this.successalert = true;
        this.successMessage = 'Payment ' +str+ ' successfully!';
        this.loaderService.display(false);
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
      },
      err=>{
       
      }
      );
  }

  payment_details_Arr;
  getPaymentDetails(){
    this.loaderService.display(true);
    this.financeService.getPaymentDetails(this.project_id).subscribe(
      res=>{
        
        this.payment_details_Arr=res.payments;
        
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }
  // for payment boq list
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

  verifyPayment(paymentId){
    this.loaderService.display(true);
    this.financeService.verifyPayment(paymentId).subscribe(
      res=>{
        
        this.payment_details_Arr=res.payments;
        this.successMessageShow('Verified successfully');
        this.loaderService.display(false);
      },
      err=>{
        
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 2000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 2000);
  }
  state = 'boq';
  selectSet(set){
    this.state = set;
    if(this.state  == 'payment'){
      this.getPaymentDetails();
    }
    else if(this.state == 'initial_design'){
      this.getPercentBoqs(this.state);
    }
    else if(this.state == 'final_design'){
      this.getPercentBoqs(this.state);
    }
    else{
      this.getBoqList();
    }


  }

  percentDocs:any = [];
  getPercentBoqs(state){
    this.loaderService.display(true);
    this.financeService.getPercentBoqs(this.project_id,state).subscribe(
      res=>{
        
        this.percentDocs=res.quotations;
        // this.successMessageShow('Verified successfully');
        this.loaderService.display(false);
      },
      err=>{
        
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
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

  calculatePendingAmt(state, total_amt, paid_amt){
    var total_amount = parseFloat(total_amt);
    var paid_amount = parseFloat(paid_amt);
    if(isNaN(total_amount)){
      total_amount = 0;
    }

    if(isNaN(paid_amount)){
      paid_amount = 0;
    }
    if(state == 'initial_design'){
      var final_amount = (10*total_amount)/100 - paid_amount
    }
    else if(state == 'final_design'){
      var final_amount = (50*total_amount)/100 - paid_amount
    }

    if(final_amount < 0){
      final_amount = 0
    }
    return final_amount
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

  history:any= [];
  amountEditArr:any = [];
  getPaymentHistory(boq_id){
    this.loaderService.display(true);
    this.financeService.getPaymentHistory(this.project_id,boq_id).subscribe(
      res=>{
        
        this.history=res.payments;
        // this.successMessageShow('Verified successfully');
        this.loaderService.display(false);
      },
      err=>{
        
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
  onInputAmount(event,paymentId){
    alert(event);
    var obj ={
      'amount': event,
      'id':paymentId

    }
    alert(this.amountEditArr.length);
    

  }
  payment_id;
  old_amt;
  filterData(Id,amt){
    this.payment_id = Id;
    this.old_amt = amt;
    

  }
  paymentEditApprove(){
    this.loaderService.display(true);
    this.financeService.editPaymentApprove(this.project_id,this.payment_id,this.approvalEditForm.value).subscribe(
          res=>{
            
            $('#editamountModal').modal('hide');
            this.getPaymentDetails();
            this.removeFormItem();
            this.successalert = true;
            this.successMessage = res['message'];
            setTimeout(function() {
              this.successalert = false;
            }.bind(this), 2000);
            
            this.loaderService.display(false);
          },
          err=>{
            
            $('#editamountModal').modal('hide');
            this.errorMessageShow(JSON.parse(err['_body']).message);
            this.loaderService.display(false);
          }
        );

  }
  removeFormItem(){
    // this.approvalEditForm.reset();
    this.approvalEditForm.controls['amount'].reset()
  }
  downloadBoqCheatSheet(boqId)
  {
    this.loaderService.display(true);
    this.financeService.downloadBoqCheatSheet(this.project_id,boqId).subscribe(
      res =>{
        this.loaderService.display(false);
        var contentType = 'application/pdf';
        
        var b64Data =  JSON.parse(res._body)['quotation_base_64'];
        var name=  JSON.parse(res._body)['boq_name'];
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


}
