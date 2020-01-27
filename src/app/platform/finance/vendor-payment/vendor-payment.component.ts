import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import {FinanceService} from '../finance.service';
import { CategoryService } from "../../category/category/category.service";
import {LeadService} from '../../lead/lead.service';
import { environment } from "environments/environment";
import { FormControl, Validators, FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
declare var $:any;

@Component({
  selector: 'app-vendor-payment',
  templateUrl: './vendor-payment.component.html',
  styleUrls: ['./vendor-payment.component.css'],
  providers:[FinanceService,LeadService,CategoryService]
})
export class VendorPaymentComponent implements OnInit {
	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
  projectList;
  paymentList;
  lead_types: any;
  paymentFinanceForm:FormGroup;
  selectedState = 'pending';
  leadList;
  ageing =[{'id':1,'name':'1 day ago'},{'id':2,'name':'2 day ago'},{'id':3,'name':'3 day ago'},{'id':5,'name':'5 day ago'},{'id':10,'name':'10 day ago'},{'id':30,'name':'1 month ago'},{'id':60,'name':'2 month ago'}];



  constructor(
  	private loaderService : LoaderService,
  	private financeService:FinanceService,
    private leadService:LeadService,
    private categoryService: CategoryService,
    private formBuilder:FormBuilder) { }

  ngOnInit() {
  	this.getVendorPaymentList();
  }
  completed_request;
  pending_request;
  page_number;
  headers_res;
  per_page;
  total_page;
  current_page;
  getVendorPaymentList(page?,client?,FromDate?,ToDate?,Ageing?){
    this.page_number = page;
  	this.loaderService.display(true);
  	this.financeService.getVendorPaymentList(this.selectedState,page,client,FromDate,ToDate,Ageing).subscribe(
  		res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.completed_request = res.competed_payments;
        this.pending_request = res.pending_payments;
        this.paymentList=res.pi_payments.data;
        
        this.leadList = res.vendors;
  			this.loaderService.display(false);
  		},
  		err=>{
  			
  			this.loaderService.display(false);
  		}
  	);
  }
  selectedArrow;
  toggleRow(row,i) {
    row.expanded = ! row.expanded;
    this.selectedArrow = i;
    $(".expanded-col").css("display", "none");
    $(".expanded-col-"+row.id).css("display", "table-row");
    
  }
  selectedlead;
  selectedAge;
  selectSet(selectedSet){
    
    this.selectedState =  selectedSet;
    this.ToDate = '';
    this.FromDate = '';
    this.clientId ='';
    this.ageingVal = '';
    this.selectedlead = '';
    this.selectedAge = '';
    this.getVendorPaymentList();

  }
  changePaymentMode(event){
    if(event.target.value == "NEFT/RTGS"){
      $(".cheque-mode").css("display", "none");
      $(".neft-mode").css("display", "block");
    }
    else if(event.target.value == "cheque"){
      $(".cheque-mode").css("display", "block");
      $(".neft-mode").css("display", "none");
    }
  }
   paymentData:any;
  //Method For Save Payment For Approve
  savePayment(){
    

    if($('#transaction_number').val() != ''){
      this.loaderService.display(true);
      this.paymentData = $('#transaction_number').val();
      this.financeService.savePaymentDetailForApprovePi(this.payment_id,this.paymentData,this.isApprove).subscribe(
        res=>{
          
          alert(res.message);
          $('#approveModal').modal('hide');
          this.getVendorPaymentList();
          this.loaderService.display(false);

        },
        err=>{
          
          this.loaderService.display(false);

        });

    }
    else{

      alert("Please Enter Transaction Number");

    }

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
  takePaymentDetail(data,stat){
    this.payment_id = data;
    this.isApprove = stat;
    $(".neft-mode").css("display", "none");
    this.paymentFinanceForm.reset();
    $('#remarks').val('');
  }
  //Method for reject Payment
  rejectPayment(){
    if($('#remarks').val() != ''){
      this.loaderService.display(true);
      this.payment_val = $('#remarks').val();
      this.financeService.RejectPi(this.payment_id,this.payment_val,this.isApprove).subscribe(
        res=>{
          
          this.successMessageShow("Payment Rejected Successfully !!");
          $('#rejectPaymentModal').modal('hide');
          this.getVendorPaymentList();
          this.loaderService.display(false);

        },
        err=>{
          
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);

        })

    }
    else{
      alert("Please Enter Remarks");
    }

  }
  po_detail;
  job_elem_list;
  vendor_name;
  getPODetail(poID){
    this.loaderService.display(true);
    this.financeService.getPODetail(poID).subscribe(
      res=>{
        this.po_detail = res.data; 
        this.job_elem_list = res.data.attributes.job_elements;
        

        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }
  vendor_detail;
  getVendorDetails(vendorId){
    this.loaderService.display(true);
    this.financeService.getVendorDetails(vendorId).subscribe(
      res=>{
        
        this.vendor_detail = res.vendor;   
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );

  }
  closeDiv(){
    $('#POModal').modal('hide');
    $('#vendorModal').modal('hide');
    $('#approveModal').modal('hide');
    $('#rejectPaymentModal').modal('hide');
  }
  history_detail;
  getHistory(pi_Id){

    $('#HistoryModal').modal('show');
    this.loaderService.display(true);
    this.financeService.getHistoryAll(pi_Id).subscribe(
      res=>{ 
        this.history_detail = res.pi_payments;   
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );



  }
  clientId;
  FromDate;
  ToDate;
  ageingVal;
  filterColumDropdownChange1(clientId){
    
      this.clientId = clientId;
      this.selectedlead = clientId;

  }
  filterData(){
      this.getVendorPaymentList('',this.clientId,this.FromDate,this.ToDate,this.ageingVal);
 
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
  showAlertmsg(){
    this.errorMessageShow('There is no file uploaded for this PI');

  }
  po_preview_pdf_url: any;
  purchase_order_id;
  po_preview_pdf_url_without_base_url: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  getPOPdfForPreview(purchase_order_id?) {
    this.po_preview_pdf_url = undefined;
    if (purchase_order_id) {
      this.purchase_order_id = purchase_order_id;
      // this.downloadPoRelease(this.purchase_order_id);
    }
    this.loaderService.display(true);
    this.categoryService.getPOPdfForPreview(this.purchase_order_id).subscribe(
      res => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).path;
        if (this.po_preview_pdf_url == "" || this.po_preview_pdf_url == null) {
          this.erroralert = true;
          this.errorMessage = "Pdf not found for preview!!";
          setTimeout(
            function() {
              this.erroralert = false;
            }.bind(this),
            2000
          );
          $("#poPreviewModal").modal("hide");
        }
        this.loaderService.display(false);
      },
      err => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function() {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        $("#poPreviewModal").modal("hide");
        this.loaderService.display(false);
      }
    );
  }
  invoice_files_list:any;
  sendUploadedInvoiceFile(files){
    
    this.invoice_files_list = files;
     

  }
  deletePOPreviewPdf(id) {
    this.categoryService.deletePOPdf(id).subscribe(
      res => {
        
        $("#poPreviewModal").modal("hide");
        this.po_preview_pdf_url = null;
      },
      err => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function() {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        this.loaderService.display(false);
      }
    );
  }

}
