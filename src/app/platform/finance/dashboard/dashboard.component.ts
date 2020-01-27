import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import {FinanceService} from '../finance.service';
import {LeadService} from '../../lead/lead.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
import { Observable } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[FinanceService,LeadService]
})
export class DashboardComponent implements OnInit {
  
	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
  projectList;
  paymentList;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  inviteChampionForm: FormGroup;
  lead_types: any;
  lead_campaigns: any;
  lead_sources: any;
  csagentsArr: any;
  dropdownList = [];
  dropdownList2= [];
  dropdownList3= [];
  dropdownList4= [];
  dropdownList5= [];
  basefile: any;
  addLeadForm: FormGroup;
  paymentFinanceForm:FormGroup;
  approvalEditForm:FormGroup;
  selectedState = 'pending';
  leadList;
  is_champion;
  arrow:boolean = true;
  ageing =[{'id':1,'name':'1 day ago'},{'id':2,'name':'2 day ago'},{'id':3,'name':'3 day ago'},{'id':5,'name':'5 day ago'},{'id':10,'name':'10 day ago'},{'id':30,'name':'1 month ago'},{'id':60,'name':'2 month ago'}];
  ReceiptForm = new FormGroup({  
    customer_name: new FormControl(''),
    amount: new FormControl(''),
    bank: new FormControl(''),
    branch: new FormControl(''),
    date: new FormControl(''),
    rtgs_trx_no: new FormControl(''),
  });
  constructor(
  	private loaderService : LoaderService,
  	private financeService:FinanceService,
    private leadService:LeadService,
    private formBuilder:FormBuilder,
    private ref:ChangeDetectorRef
  ) { }

  ngOnInit() {
  	this.loaderService.display(false);
    this.getPaymentList();
    // this['ReceiptForm'].reset();
    this.is_champion = localStorage.getItem('isChampion');
    this.approvalEditForm =this.formBuilder.group({
      'amount': ['',Validators.required]
    })
    this.inviteChampionForm = this.formBuilder.group({
      name : new FormControl("",[Validators.required]),
      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
              Validators.required]),
      contact : new FormControl("",[Validators.required]),
      parent_id : new FormControl(""),
      champion_level: new FormControl("",[Validators.required]),
      user_type:new FormControl("arrivae_champion")
    });
    this.addLeadForm = this.formBuilder.group({
			name : new FormControl(""),
			email : new FormControl("",[Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]),
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			lead_type_id : new FormControl("",Validators.required),
		  lead_source_id : new FormControl("",Validators.required),
		  lead_campaign_id:new FormControl(""),
		  instagram_handle: new FormControl(""),
		  lead_type_name:new FormControl()
    });
    this.paymentFinanceForm = this.formBuilder.group({
      'mode_of_payment': ['', Validators.required],
      'transaction_number':['']
    });
    this.getFiltersData();
  }
  completed_request;
  pending_request;
  page_number;
  headers_res;
  per_page;
  total_page;
  current_page;
  res_lead
  getPaymentList(page?,client?,FromDate?,ToDate?,Ageing?){
    this.page_number = page;
  	this.loaderService.display(true);
  	this.financeService.getPaymentList(this.selectedState,page,client,FromDate,ToDate,Ageing ).subscribe(
  		res=>{
       
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        // this.res_lead=JSON.parse(res._body );
        res= res.json();
        this.leadList = res.leads;
        this.completed_request = res.completed_request;
        this.pending_request = res.pending_request;
        this.paymentList=res.payment_serializer.data;
  			this.loaderService.display(false);
  		},
  		err=>{
  			
  			this.loaderService.display(false);
  		}
  	);
  }

  paymentView:any;
  //to get payment details for transaction modal
  getPaymentDetails(obj){
    this.paymentView = '';
    this.paymentView = obj;
  }

  downloadPaymentReport(){
    this.leadService.exportPaymentEvent().subscribe(
      res =>{
      
      this.successalert = true;
        this.successMessage = 'The Payment report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);

     
      },
      err => {
        
        
      }
    );

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

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
      return false;
    }
  }

  addLeadFormSubmit(data) {
		this.loaderService.display(true);
		data['created_by'] = localStorage.getItem('userId');
		data['lead_status']='not_attempted';
		if(this.addLeadForm.controls['lead_type_name'].value=='designer'){
			data['lead_cv']=this.basefile;
		}
		var obj = {
			lead:data
		}
		this.leadService.addLead(obj)
			.subscribe(
			  res => {
				this.addLeadForm.reset();
				$('#addNewLeadModal').modal('hide');
				this.addLeadForm.controls['lead_type_id'].setValue("");
				this.addLeadForm.controls['lead_source_id'].setValue("");
				this.addLeadForm.controls['lead_campaign_id'].setValue("");
				this.basefile = undefined;
				// this.getFiletredLeads();
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
  
  onChangeOfLeadType(val){
		for(var i=0;i<this.lead_types.length;i++){
			if(val==this.lead_types[i].id){
				this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
			}
		}
  }
  
  getFiltersData(){
		this.leadService.getFiltersData().subscribe(
			res =>{
				res = res.json();
				// 
				this.lead_campaigns = res.lead_campaign_id_array
				this.lead_sources= res.lead_source_id_array;
				//this.lead_status=res.lead_status_array
				this.lead_types=	res.lead_type_id_array
				this.csagentsArr = res.cs_agent_list;

				for(var i=0;i<res.lead_type_id_array.length;i++){
					var obj = {
						"id":res.lead_type_id_array[i].id,"itemName":res.lead_type_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList.push(obj);
				}
				for(var i=0;i<res.lead_status_array.length;i++){
					var obj = {
						"id":<any>i,"itemName":res.lead_status_array[i].replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList2.push(obj);

				}
				for(var i=0;i<res.lead_source_id_array.length;i++){
					var obj = {
						"id":res.lead_source_id_array[i].id,"itemName":res.lead_source_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList3.push(obj);
				}
				for(var i=0;i<res.lead_campaign_id_array.length;i++){
					var obj = {
						"id":res.lead_campaign_id_array[i].id,"itemName":res.lead_campaign_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
					}
					this.dropdownList4.push(obj);
				}
				for(var i=0;i<res.cs_agent_list.length;i++){
					var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
					var obj = {
						"id":res.cs_agent_list[i].id,"itemName":<any>str
					}
					this.dropdownList5.push(obj);
				}
			}
		);
  }
  selectedArrow;
  toggleRow(row,i) {
    row.expanded = ! row.expanded;
    $(".expanded-col").css("display", "none");
    $(".expanded-col-"+row.id).css("display", "table-row");
    this.selectedArrow = i;
    if(this.arrow){
      this.arrow = false;


    }
    else{
      this.arrow = true;

    }
    
  }
  
  selectSet(selectedSet){
    
    this.selectedState =  selectedSet;
    this.ToDate = '';
    this.FromDate = '';
    this.clientId ='';
    this.ageingVal = '';
    this.selectedlead = '';
    this.selectedAge = '';
    this.clearValue();
    this.getPaymentList();

  }
  changePaymentMode(event){ 
    if(event == "NEFT/RTGS"){
      $(".cheque-mode").css("display", "none");
      $(".neft-mode").css("display", "block");

      this.paymentFinanceForm.get('transaction_number').setValidators([Validators.required]);
      this.paymentFinanceForm.get('transaction_number').updateValueAndValidity();
    }
    else if(event == "cheque"){
      $(".cheque-mode").css("display", "block");
      $(".neft-mode").css("display", "none");
      this.paymentFinanceForm.get('transaction_number').clearValidators();
      this.paymentFinanceForm.get('transaction_number').updateValueAndValidity();
    }
  }
   paymentData:any;
  //Method For Save Payment For Approve
  savePayment(){
    this.loaderService.display(true);
    if(this.paymentFinanceForm.controls['mode_of_payment'].value == 'cheque'){
      var obj ={
      'is_cheque': true,
      'approve':this.isApprove,
      'quotation_id':this.quotation_ID

      }
      this.paymentData = obj;

    }
    else{
      var data ={
        
        'transaction_number': this.paymentFinanceForm.controls['transaction_number'].value,
        'approve':  this.isApprove,
        'quotation_id':this.quotation_ID

      }
      this.paymentData = data;
      

    }
    this.financeService.savePaymentDetailForApprove(this.project_id,this.payment_id,this.paymentData,this.isApprove).subscribe(
      res=>{
        
        if(res.message != 'Status Updated'){
           alert(res.message);

        }
        else{
          this.successMessageShow("Payment Approved Successfully !!");

        }
       
        $('#approveModal').modal('hide');
        this.getPaymentList();
        this.loaderService.display(false);

      },
      err=>{
        
        this.loaderService.display(false);

      })

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
  project_id;
  payment_id;
  isApprove;
  payment_val;
  quotation_Id;
  quotation_ID
  takePaymentDetail(quotation_id,data,stat){
    this.project_id = data.project_id;
    this.payment_id = data.id;
    this.isApprove = stat;
    this.quotation_ID=quotation_id;
    
    // this.quotation_Id=data.attributes.quotation_details.quotation_id;
    // 
    // 

    $(".neft-mode").css("display", "none");
    this.paymentFinanceForm.reset();
    $('#remarks').val('');
    if(this.isApprove == true){
      if (confirm("Are You Sure You Want To Approve?") == true) {
        this.savePayment();

       }

    }
    
  }
  //Method for reject Payment
  rejectPayment(){
    this.loaderService.display(true);
    this.payment_val = $('#remarks').val();
    this.financeService.savePaymentDetailForReject(this.quotation_ID,this.project_id,this.payment_id,this.payment_val,this.isApprove).subscribe(
      res=>{
        
        this.successMessageShow("Payment Rejected Successfully !!");
        $('#rejectPaymentModal').modal('hide');
        this.getPaymentList();
        this.loaderService.display(false);

      },
      err=>{
        
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);

      })

  }
  downloadBoq(boqId,ProjectId){
    this.loaderService.display(true);
    this.financeService.downloadBoqCheatSheet(ProjectId,boqId).subscribe(
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
  clientId;
  FromDate;
  ToDate;
  ageingVal;
  selectedlead;
  selectedAge;
  filterColumDropdownChange1(clientId){
    
      this.clientId = clientId;
      this.selectedlead = clientId;

  }
  filterData(){
      this.getPaymentList( '',this.clientId,this.FromDate,this.ToDate,this.ageingVal);

  }
  takeFromDate(event){

      this.FromDate = event.value;

  }
  takeToDate(event){
      this.ToDate = event.value;
  }
  filterColumDropdownChange2(event){
    this.ageingVal = event;
    this.selectedAge = event;


  }
  closeDiv(){
    $('#rejectPaymentModal').modal('hide');
    $('#approveModal').modal('hide');
  }
  payment_edit_id;
  old_amt;
  filterDataForEdit(Id,amt,projectId,balanceAmt){
    this.payment_edit_id = Id;
    this.old_amt = amt;
    this.project_id = projectId;
    this.pending_am = balanceAmt;
     
  }
  paymentEditApprove(){
    this.loaderService.display(true);
    this.financeService.editPaymentApprove(this.project_id,this.payment_edit_id,this.approvalEditForm.value).subscribe(
          res=>{
            
            $('#editamountModal').modal('hide');
            this.getPaymentList();
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
    this.approvalEditForm.controls['amount'].reset();
  }
  bookingForm_list;
  getBookingFormList(data){
    this.bookingForm_list = data;

  }
  clr_val;
  clearValue(){
    this.clr_val = 'Clear';
    

  }
  pending_chk;
  pending_am;
  checkPendingAmt(elemid){
    this.pending_chk = (<HTMLInputElement> document.getElementById(elemid)).value;
    
    if(this.pending_chk > this.pending_am){
      alert("Paid Amount is greater than pending amount");
      $('#pending_amt').val(0);
       

    }
  }
  downloadDp(){
    this.financeService.downloadDp().subscribe(
      res=>{
        
        this.successalert = true;
        this.successMessage = 'The  Download DP payout report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
            this.successalert = false;
          }.bind(this), 5000);
      },
      err=>{
        
      });
    }

    downloadExcelBoqLineItems(){
      this.loaderService.display(true);
      this.leadService.downloadExcelBoqLineItems().subscribe(
        res=>{
          
          
           this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'The BOQ Line Items report you requested is being created. It will be emailed to you once complete.!';
          setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 5000);
  
  
        },
        err=>{
          
          this.loaderService.display(false);
  
        });
  
    }
    
    paymentDetails={
      parent_boq:"",
      parent_payments:0,
      prev_payments:0,
    };
    getPreviousPaymentDetails(paymentDetails){
      this.paymentDetails=paymentDetails;
      this.ref.detectChanges();
    }
    downloadMarginReport(){
    this.successalert = true;
    this.successMessage = 'The  Download Margin  report you requested is being created. It will be emailed to you once complete.!';
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 5000);
        this.financeService.downMarginReport().subscribe(
      res=>{
        
      },
      err=>{
        this.erroralert =true
        if (err.status == 401) {
          this.errorMessage = 'you are not authorised for downloading margin report '
        } else {
          this.errorMessage = 'we are unable to processed your request at this moments, kindly try after some time'
        }

        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);
        
      });
  }
  projectId;
  paymentId;
  details;
  PaymentReceiptData(quotation_id,data,stat){
    this.getPaymentList();
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
    this.loaderService.display(true);
    var tomorrow = new Date(this.ReceiptForm.get('date').value);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let  receipt_pdf;
      receipt_pdf = {
        "customer_name":this.ReceiptForm.get('customer_name').value ? this.ReceiptForm.get('customer_name').value : '',
        "amount":this.ReceiptForm.get('amount').value ? this.ReceiptForm.get('amount').value : '',
        "bank":this.ReceiptForm.get('bank').value ? this.ReceiptForm.get('bank').value : '',
        "date":tomorrow,  
        "branch":this.ReceiptForm.get('branch').value ? this.ReceiptForm.get('branch').value : '',       
        "rtgs_trx_no":this.ReceiptForm.get('rtgs_trx_no').value ? this.ReceiptForm.get('rtgs_trx_no').value : '',   

      } 
     
    this.financeService.getReceipt(this.projectId,this.paymentId,receipt_pdf,type).subscribe(
      res=>{ 
        this.loaderService.display(false);
        $('#PaymentReceipt').modal('hide');
        this.getPaymentList();
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
    share(type){
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
        this.getPaymentList();
        this.successalert = true;
        this.successalert = true;
        this.successMessage = (JSON.parse(res['_body']).message);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
}
