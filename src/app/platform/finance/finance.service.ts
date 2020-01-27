import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class FinanceService {

	options: RequestOptions;

  constructor(
  	private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) { 
  	this.options = this.authService.getHeaders();
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  private extractDataPage(res:Response){
    return res;
  }
  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  getProjectList(){
  	let url = environment.apiBaseUrl+'/v1/proposals/boq_approved_project_list';
  	return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProposalList(projectId){
    let url = environment.apiBaseUrl+'/v1/proposals/proposal_list_for_finance?project_id='+projectId;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getBoqList(projectId){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/approved_quotations';
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getPaymentDetails(projectId){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments/payment_history';
    this.options = this.authService.getHeaders();
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  verifyPayment(paymentid){
    let url = environment.apiBaseUrl+'/v1/proposals/payment_approval_by_financiar';
    var obj={
      'payment_id':paymentid,
      'is_approved':'yes'
    }
    return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  approvePayments(projectId,paymentid,data){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments/'+paymentid+'/payment_approval';
    return this.http.post(url,data,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getPaymentQuotation(projectId,paymentid){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments/'+paymentid;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  approveBoq(projectId,boqid){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqid+'/change_wip_status';
    var obj={
      'approve':true
    }
    if(this.options.params){
        this.options.params.delete('quotation');
      }
    return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPercentBoqs(project_id,state){
    let url = environment.apiBaseUrl+'/v1/proposals/quotation_types?project_id='+project_id+'&proposal_type='+state;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPaymentHistory(project_id,boq_id){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payments/boq_payment_history?boq_id='+boq_id;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  editPaymentApprove(projectId,paymentId,Amount){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments/'+paymentId+'/update_paid_amount';
    return this.http.put(url,Amount,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  downloadBoqCheatSheet(projectId,BoqId){    
      var url = environment.apiBaseUrl +
      '/v1/projects/'+projectId+'/quotations/'+BoqId+'/download_cheat_sheet';
       
      return this.http.get(url,this.options)
         .map(response => {
        if (response.status == 400) {
            this.handleErrorObservable;
        } else if (response.status == 200) {
            // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            // //var blob = response['_body'];
            // var blob = new Blob([(<any>response)._body], { type: contentType });
            //var url = environment.apiBaseUrl+'/'+response['_body'];
            return response;
        }
      })
              .catch(this.handleErrorObservable);  


  }

  // method for get payment list
  getPaymentList(status,page?,client?,fromdate?,toDate?,Ageing?){
    let url = environment.apiBaseUrl+'/v1/payments/lead_payment_history?finance_status='+status+'&page='+page;
    let params: URLSearchParams = new URLSearchParams();
    params.set('from_date', fromdate);
    params.set('to_date',toDate);
    params.set('lead_id',client);
    params.set('ageing',Ageing);
    this.options.search = params;
    return this.http.get(url,this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);

  }
  //method to save payment detail
  savePaymentDetailForApprove(projectId,paymentId,paymentValue,status){    
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments/'+paymentId+'/payment_approval';
    return this.http.post(url,paymentValue,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  savePaymentDetailForReject(quotation_id,projectId,paymentId,paymentValue,status){
    var obj ={
      'remark': paymentValue,
      'approve':status,
      'quotation_id':quotation_id 

    }
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments/'+paymentId+'/payment_approval';
    return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  //method to vendor payment list
  getVendorPaymentList(status,page?,client?,fromdate?,toDate?,Ageing?){
    let url = environment.apiBaseUrl+'/v1/pi_payments/vendor_payment_history?finance_status='+status+'&page='+page;
    let params: URLSearchParams = new URLSearchParams();
    params.set('from_date', fromdate);
    params.set('to_date',toDate);
    params.set('vendor_id',client);
    params.set('ageing',Ageing);
    this.options.search = params;
    return this.http.get(url,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);


  }
  savePaymentDetailForApprovePi(paymentId,paymentValue,status){
    
    var data ={
      'transaction_number': paymentValue,
      'payment_status':status

    }
    let url = environment.apiBaseUrl+'/v1/pi_payments/'+paymentId+'/payment_approval';
    return this.http.patch(url,data,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  RejectPi(paymentId,paymentValue,status){
    var data ={
      'remarks': paymentValue,
      'payment_status':status

    }
    let url = environment.apiBaseUrl+'/v1/pi_payments/'+paymentId+'/payment_approval';
    return this.http.patch(url,data,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getPODetail(POID){
    let url = environment.apiBaseUrl+'/v1/purchase_orders/'+POID+'/purchase_order_view_for_finance';
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  getVendorDetails(vendorId){
    let url = environment.apiBaseUrl+'/v1/vendors/'+vendorId;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getHistoryAll(pi_Id){
    let url = environment.apiBaseUrl+'/v1/pi_payments?performa_invoice_id='+pi_Id;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  getClientLedger(client?,fromdate?,toDate?,Ageing?){
    let url = environment.apiBaseUrl+'/v1/payments/lead_payment_ledger';
    let params: URLSearchParams = new URLSearchParams();
    params.set('from_date', fromdate);
    params.set('to_date',toDate);
    params.set('lead_id',client);
    params.set('ageing',Ageing);
    this.options.search = params;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getVendorLedger(client?,fromdate?,toDate?,Ageing?){
    let url = environment.apiBaseUrl+'/v1/pi_payments/vendor_payment_ledger';
    let params: URLSearchParams = new URLSearchParams();
    params.set('from_date', fromdate);
    params.set('to_date',toDate);
    params.set('lead_id',client);
    params.set('ageing',Ageing);
    this.options.search = params;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }

downloadDp() {
    let url = environment.apiBaseUrl + '/v1/payments/dp_payout_payment_report';
    return this.http.get(url, this.options)
      .map(response => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          // //var blob = response['_body'];
          // var blob = new Blob([(<any>response)._body], { type: contentType });
          // var url = environment.apiBaseUrl+'/'+response['_body'];
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }
  downMarginReport() {
    let url = environment.apiBaseUrl + '/v1/quotations/download_margin_report';
    return this.http.get(url, this.options)
      .map(response => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }
  downloadboqexcel(projectId,BoqId){
    let url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/quotations/'+BoqId+'/download_category_excel';
    return this.http.get(url,this.options)
    .map(response => {
      if (response.status == 400) {
         this.handleErrorObservable;
      } else if (response.status == 200) {
        //  var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        //  //var blob = response['_body'];
        //  var blob = new Blob([(<any>response)._body], { type: contentType });
        // var url = environment.apiBaseUrl+'/'+response['_body'];
         return response;
         //return new Blob([response.blob()], { type: 'application/pdf' })
      }
    })
    .catch(this.handleErrorObservable);
  }
 // getproductList(page?){
 //   var url = environment.apiBaseUrl+'/v1/payments/final_stage_projects';
 //   var params: URLSearchParams = new URLSearchParams();
 //   params.set('status', 'pending');
 //   params.set('page',page);
 //   var opt = this.options;
 //   opt.search = params;
 //   return this.http.get(url,opt)
 //     .map(this.extractDataPage)
 //     .catch(this.handleErrorObservable);
 // }

 getProjectLineItemsDetails(status,page,startDate='',endDate='',clientId=''){
  if(!startDate){
    startDate='';
  }
  if(!endDate){
    endDate='';
  }
  if(!clientId){
    clientId='';
  }
  let url = environment.apiBaseUrl+'/v1/payments/final_stage_projects?status='+status+'&page='+page+'&start_date='+startDate+'&end_date='+endDate+'&lead_id='+clientId;
  let params: URLSearchParams = new URLSearchParams();
  this.options.search = null;
  
  return this.http.get(url,this.options)
  .map(this.extractDataPage)
  .catch(this.handleErrorObservable);
 }
 getReceipt(projectId,paymentsId,receipt_pdf,type){
    let url= environment.apiBaseUrl + '/v1/projects/'+projectId+'/payments/'+paymentsId+'/lead_payment_receipt';
    var query = {
            "receipt_pdf":receipt_pdf,
            "payment_id": paymentsId,
             "type":type
        }
    return this.http.post(url,query,this.options)
       .map(response => {
        if (response.status == 400) {
            this.handleErrorObservable;
        } else if (response.status == 200) {
            return response;
        }
      })
      .catch(this.handleErrorObservable);
    }

 getPaymentHistoryByProject(project_id){
  let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payments/payment_history';
  this.options.search = null;

  return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}

getAllInvoices(project_id,searchValue){
  this.options.search = null;
  let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payment_invoices/parent_invoices_for_project?project_id='+project_id+"&search="+searchValue;
  return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}

shareInvoice(projectId,invoiceId){
  let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payment_invoices/share_parent_invoice?id='+invoiceId;
  return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
}


SubmitInvoices(project_id,label,lineItem){
  var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payment_invoices';
  var obj = {
    'payment_invoice':{
      "project_id": project_id,
      "label":  label
    },
    'line_items':lineItem
  }
  this.options.search = null;
  return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
InvoiceLabel(project_id){
  var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payment_invoices/child_invoices';
  var params: URLSearchParams = new URLSearchParams();
  params.set('project_id',project_id);
  var opt = this.options;
  opt.search = params;
  return this.http.get(url,opt)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);

}
FinalInvoiceCreatedSubmition(project_id,Finalselected,invoice_form_info){
  var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payment_invoices/create_parent_invoice';
  var obj = {
    'child_invoice_ids':Finalselected,
    'invoice_info':invoice_form_info,
    'payment_invoice': {
    'project_id':  project_id,
    // 'invoice_info':invoice_form_info,
    },
  }
  this.options.search = null;
  return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  downloadInvoice(invoiceId){
    var url = environment.apiBaseUrl+'/v1/projects/'+invoiceId+'/download';
    this.options.search = null;
    return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
  
    }

UpadetAddedProductsList(project_id,lineItem,label,type,invoice_id,hsn_code){
  var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payment_invoices/'+invoice_id;
  var obj;

  if (type=='updateLabel') {
    obj = {
      'payment_invoice':{
        "project_id": project_id,
        // "label":  label
      },
      'line_items':lineItem
    }
  }
  if (type=='EditLabel'){
    obj = {
      'payment_invoice':{
        "label":  label
      },
      'id':invoice_id
    }
  }
  if (type=='hsn') {
    obj = {
      'payment_invoice':{
        "hsn_code": hsn_code, 
      },
      'id':invoice_id
    }
  }
  this.options.search = null;
  return this.http.patch(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
 
  }
  UpadateInvoiceSubmition(project_id,invoice_form_info,createInvoiceId,currentInvoiceId){
  var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payment_invoices/update_parent_invoice';
  var obj = {
     'invoice_info':invoice_form_info,
     'child_invoice_ids':createInvoiceId ,
     'parent_invoice_id':currentInvoiceId,
    }
  this.options.search = null;
  return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
}
