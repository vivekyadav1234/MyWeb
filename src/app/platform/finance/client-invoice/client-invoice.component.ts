import { CreateInvoiceComponent } from './../create-invoice/create-invoice.component';
 import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FinanceService } from '../finance.service';
import { LoaderService } from '../../../services/loader.service';
import { FormControl,FormArray,FormBuilder,FormGroup,Validators} from '../../../../../node_modules/@angular/forms';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-client-invoice',
  templateUrl: './client-invoice.component.html',
  styleUrls: ['./client-invoice.component.scss']
})
export class ClientInvoiceComponent implements OnInit {

  constructor(
    private financeService:FinanceService,
    private loaderService:LoaderService,
    private sanitizer:DomSanitizer
    ) { }

    
  // @Input() projectId: number;
  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  projectLineItems=[];
  pendingStatus='pending';
  releasedStatus='released';
  currentProjectStatus = this.pendingStatus;
  changeProjectStatusParameter;
  currentProjectId;
  currentProjectDetails;
  fromDate;
  toDate;
  currentInvoice;
  updateInvoiceId;
  search = new FormGroup({
    invoiceSearchValue : new FormControl("")
  })
  
  get searchValue(): any { return this.search.get('invoiceSearchValue'); }

  ngOnInit() {
    this.getProjectCounts();
    this.getProjectLineItemsDetails(1);
  }

  stopPropagation(event,type,projectId,projectInfo){
    this.currentInvoice=null;
    this.currentProjectId = projectId;
    this.currentProjectDetails = projectInfo;

    if(type=='create-invoices'){
      this.InvoiceLabel();
      $('#create-invoices').modal('show');
    }

    if(type=='payment'){
      $('#payment-details').modal('toggle');
      this.getPaymentHistory(projectId);
    }
    if(type=='invoice'){
      this.InvoiceLabel();
      $('#view-invoices').modal('toggle');
      
      this.search.controls["invoiceSearchValue"].setValue("");
      this.getAllInvoices(projectId,this.searchValue.value);
      
      this.searchValue.valueChanges.subscribe(
        value => {
          this.getAllInvoices(this.currentProjectId,value);
        }
      )
    }
    event.stopPropagation();
  }

  headers_res;
	per_page;
	total_page;
	current_page;
  page_number;
  leadList
  getProjectLineItemsDetails(page,startDate='',endDate='',clientId=''){
  
    this.loaderService.display(true);

    this.financeService.getProjectLineItemsDetails(this.currentProjectStatus,page,startDate,endDate,clientId).subscribe(
      res =>{
				
				this.headers_res= res.headers._headers;
				this.per_page = this.headers_res.get('x-per-page');
				this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        
        res= res.json();

        this.projectLineItems = res.projects;
        this.leadList = res.leads;
				this.loaderService.display(false);
			},
			err => {
				this.loaderService.display(false);
			}
    )
  }

  changeProjectStatus(status){
    this.currentProjectStatus=status;
    this.toDate=this.fromDate=null;
    this.clientId=null;
    this.getProjectLineItemsDetails(1);
  }

  pendingProjectCount=0;
  releasedProjectCount=0
  getProjectCounts(page=1){
    this.financeService.getProjectLineItemsDetails(this.pendingStatus,page).subscribe(
      res =>{
				this.headers_res= res.headers._headers;
				this.pendingProjectCount = this.headers_res.get('x-total');
			},
			err => {
      }
    )

    this.financeService.getProjectLineItemsDetails(this.releasedStatus,page).subscribe(
      res =>{
				this.headers_res= res.headers._headers;
				this.releasedProjectCount = this.headers_res.get('x-total');
			},
			err => {
      }
    )
  }

  isAccordionActive=Array(1000).fill(false);
  checkAccordionStatus(accordionIndex,numberOfAccordions){

    //Toggle accordions
    for(let i=0;i<numberOfAccordions;i++){
      if(i!=accordionIndex){
        this.isAccordionActive[i] = false;
        $("#collapse"+i).removeClass("show");
        $("#collapse"+i).addClass("collapse");
      }
      else{
        this.isAccordionActive[i]=!this.isAccordionActive[i];
        if(!this.isAccordionActive[i]){
          $("#collapse"+i).removeClass("show");
          $("#collapse"+i).addClass("collapse");
        }else{
          $("#collapse"+i).addClass("show");
          $("#collapse"+i).removeClass("collapse");
        }
      }
    }
  }
  paymentHistoryByProject=[];
  getPaymentHistory(projectId){
    this.loaderService.display(true);
    this.financeService.getPaymentHistoryByProject(projectId).subscribe(
      res =>{			
				this.paymentHistoryByProject = res.payments;
				this.loaderService.display(false);
			},
			err => {
				this.loaderService.display(false);
      }
    )
  }

  allInvoices=[];
  getAllInvoices(projectId,searchValue){
    this.loaderService.display(true);
    this.financeService.getAllInvoices(projectId,searchValue).subscribe(
      res=>{
        this.allInvoices = res.invoice_info;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      }
    )
  }

  callCreateInvoice(invoiceId){
    this.currentInvoice=invoiceId;
    $('#create-invoices').modal('show');
    $("#PickedItems").modal("hide");
    $('#view-invoices').modal('hide');
    this.InvoiceLabel();
  }

  shareInvoice(invoiceId){
    this.loaderService.display(true);
    this.financeService.shareInvoice(this.currentProjectId,invoiceId).subscribe(
      res=>{
        this.getAllInvoices(this.currentProjectId,this.searchValue.value);
        this.getProjectCounts();
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(function() {
              this.successalert = false;
        }.bind(this), 2000);
      },
      err => {
        this.loaderService.display(false);
      }
    )
  }
  currentInvoiceBase64="";
  downloadInvoice(invoiceId,type){
    this.loaderService.display(true);
    if(type=='preview'){
      $('#preview-invoice').modal('show');
      $('#view-invoices').modal('hide');
    }
    this.currentInvoiceBase64="";
    // this.currentInvoiceBase64 = "data:application/pdf;base64,JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg==";
     
    this.financeService.downloadInvoice(invoiceId).subscribe(
      res=>{
        this.loaderService.display(false);
        let contentType = 'application/pdf';
        
        let b64Data =  JSON.parse(res._body)['invoice_base_64'] ;
        let name=  JSON.parse(res._body)['name'];
        
        if(type=='preview'){
          if(b64Data.split('data:application/pdf;base64,').length==1){
            b64Data = "data:application/pdf;base64," + b64Data
          }
          this.currentInvoiceBase64 = b64Data;
        }
        else if (type=='download'){
          let blob = this.b64toBlob(b64Data, contentType,512);
          let blobUrl = URL.createObjectURL(blob);
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
        }
      },
      err => {
        this.loaderService.display(false);
        this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
      }
    )
    
  }

  currentDownloadLink ;
  previewInvoice(url){

      this.currentDownloadLink='';

      $('#preview-invoice').modal('show');
      $('#view-invoices').modal('hide');

      url=url+'#toolbar=0&scrollbar=1&navpanes=0';
      this.currentDownloadLink=url;
    
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

  
  closeCreateInvoice(){
    $('#create-invoices').modal('hide');
    $("#PickedItems").modal("hide");
    this.updateInvoiceId=[];
    this.updateInvoiceId.length=0;
  }

  childInvoiceDetails;
  InvoiceLabel(){
     this.financeService.InvoiceLabel(this.currentProjectId).subscribe(
       res=>{
         res=res.json();
         this.childInvoiceDetails= res.payment_invoices;
         this.loaderService.display(false);
       },
       err=>{
         this.loaderService.display(false);
       });
   }

  sanitize(data:string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(data);
  }

  closePreviewInvoice(){
    $('#view-invoices').modal('show');
    $('#preview-invoice').modal('hide');
  }
  
  takeFromDate(event){
    this.fromDate = event.value;
  }
  
  takeToDate(event){
    this.toDate = event.value;
  }

  filterData(){
    this.getProjectLineItemsDetails(1,this.fromDate,this.toDate,this.clientId);
  }

  clientId;
  filterColumDropdownChange1(clientId){ 
    this.clientId = clientId;
  }

}
