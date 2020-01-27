import { Component, OnInit,ChangeDetectorRef,Input,Output,EventEmitter  } from '@angular/core';
import {FinanceService} from '../finance.service';
import { FormControl,FormArray,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import { ClientInvoiceComponent } from '../client-invoice/client-invoice.component';
declare var $:any;
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css']
})
export class CreateInvoiceComponent implements OnInit {
  @Input() projectDetails:any;
  @Input() childInvoice:any;
  @Input() currentPage:any;
  @Input() projectId:any;
  @Input() currentStatus:any;
  @Input() currentInvoice:any;
  @Output() sendAssignedFiles : EventEmitter<any> = new EventEmitter();
  currentProjectId;
  role;
  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  project_id_Invoice;
  addedSliProduct;
  SelectedId=[];
  shippingAddressList=[];
  shippingAddressLists=[];
  masterSelected:boolean;
  checklist:any;
  currentProjectStatus;
  currentInvoiceId;
  checkedList:any;
  CreateInvoiceForm = new FormGroup({    // form for details of project
  customer_lead_id : new FormControl(""),
  customer_billing_name : new FormControl(""),
  customer_shipping_name : new FormControl(""),
  customer_gst : new FormControl(""),
  phone : new FormControl(""),
  email_id : new FormControl(""),
  customer_billing_address : new FormControl(""),
  customer_shipping_address : new FormControl(""),
  arrivae_billing_address : new FormControl(""),
  arrivae_dispatch_address : new FormControl(""),
  arrivae_pan : new FormControl(""),
  arrivae_gst : new FormControl(""),
  });
  AddProductForm = new FormGroup({  // label form while adding product 
    label : new FormControl(""),
  });
  EditProductForm = new FormGroup({  // Edit label form
    label : new FormControl(""),
  });
  constructor(
    private fb: FormBuilder,
    private ClientInvoiceComponent : ClientInvoiceComponent,
    private loaderService : LoaderService,
  	private financeService:FinanceService,
    private formBuilder:FormBuilder,
    private ref:ChangeDetectorRef
  	) { }

  ngOnInit() {
    this.getproductLists();
  	this.role = localStorage.getItem('user');
    this.masterSelected = false;  

     
  }
  currentPageOn;
  ngOnChanges(){
    this.project_id_Invoice = this.projectDetails; 
    this.currentPageOn=this.currentPage;
    this.addedSliProduct=this.childInvoice;
    this.currentProjectId=this.projectId;
    this.currentProjectStatus=this.currentStatus;
    this.currentInvoiceId=this.currentInvoice;
    this.SelectedIdsli=[];
    this.SelectedIdsli.length=0;
    this.edit1=[];
    if(this.currentInvoiceId){
      this.updateInvoiceId=[];
      this.updateInvoiceId.length=0;   
      this.addedSliProduct.forEach((data)=>{
      if(this.currentInvoiceId==data.parent_invoice_id && data.status=='created'){
        this.updateInvoiceId.push(data.id);  
      }
      if(this.currentInvoiceId==data.parent_invoice_id || data.status=='pending'){
        this.edit1.push(data);
         
      } 
      this.addedSliProduct=this.edit1;
       
    })
      
    } 
       // this.addedSliProduct=this.addedSliProduct;
       //console.log(this.addedSliProduct ,'on changes main data');
         this.getproductLists();
  }
 
  assignToLineItem(){
    this.sendAssignedFiles.emit(this.CreateInvoiceForm.value);
  }
 
  lineitems;
  getproductLists(){ // set form values of project details 
    this.SelectedIdsli=[];
    this.SelectedIdsli.length=0;
    this.lineitems=this.project_id_Invoice;
    this.InvoiceLabel();
    if(this.project_id_Invoice){
    this.CreateInvoiceForm.controls['customer_lead_id'].setValue(this.project_id_Invoice.lead_id);
    this.CreateInvoiceForm.controls['customer_billing_name'].setValue(this.project_id_Invoice.lead_name);
    this.CreateInvoiceForm.controls['customer_shipping_name'].setValue(this.project_id_Invoice.lead_name);
    this.CreateInvoiceForm.controls['customer_gst'].setValue(this.project_id_Invoice.gst_number);
    this.CreateInvoiceForm.controls['phone'].setValue(this.project_id_Invoice.lead_phone);
    this.CreateInvoiceForm.controls['email_id'].setValue(this.project_id_Invoice.lead_email);
    this.CreateInvoiceForm.controls['customer_billing_address'].setValue(this.project_id_Invoice.billing_addess);
    this.CreateInvoiceForm.controls['customer_shipping_address'].setValue(this.project_id_Invoice.shipping_address);
    }
    this.CreateInvoiceForm.controls['arrivae_billing_address'].setValue("");
    this.CreateInvoiceForm.controls['arrivae_dispatch_address'].setValue("");
    this.CreateInvoiceForm.controls['arrivae_pan'].setValue("");
    this.CreateInvoiceForm.controls['arrivae_gst'].setValue("");
    
  }
  
  lineItemsList;
  isInvoice;
  removebutton;
  editable=[];
  itemdata;
  getslidetails(id,removebutton,item){
    this.itemdata=item.invoice_line_items;
    this.EditProductForm.reset();
    this.AddProductForm.reset();
    this.editlabel_id=id;
    this.removebutton=removebutton;
    $('body').addClass('modal-open');
    $('.modal').css('overflow-y', 'auto');
    $('body').css("overflow", "hidden");
    $("#create-invoices").modal("hide");
    $('#view-invoices').modal('hide');
    $("#PickedItems").modal("show");
    $("#PickedItems").appendTo("body");
    $("#create-invoices").modal("hide")
    this.lineItemsList=this.project_id_Invoice.line_items;
    this.isInvoice=this.lineItemsList;
    this.projectDataInfo=[];
    this.getProjectLineItemsDetails(this.currentPageOn);
    this.getslisSelectVal();
  }
  getslisSelectVal(){
    this.getCheckedItemListlist();
    // this.InvoiceLabel();
  }
  projectLineItems;
  project_Invoices_data;
  projectDataInfo=[];
  getProjectLineItemsDetails(page){ // fetch project details and line item
    this.loaderService.display(true);
    this.financeService.getProjectLineItemsDetails(this.currentProjectStatus,page).subscribe(
      res =>{
        res= res.json();
        this.SelectedInvoiceSliId=[];
        this.SelectedInvoiceSliId.length=0;
        this.project_Invoices_data = res.projects;
        this.project_Invoices_data.forEach((item,index) => {
           if (this.project_Invoices_data[index].project_info.project_id==this.projectId) {
             this.projectDataInfo.push(item.project_info);
             
            }
         });
        this.project_id_Invoice=this.projectDataInfo[0];
        this.InvoiceLabel();
        this.ref.detectChanges();
        this.edit=[];
        this.edit.length=0;
        if(this.project_id_Invoice) {
        this.lineItemsList.forEach((item,index) => {
          if(!item.invoice_status){
            this.edit.push(item);
          }
          else if(this.itemdata){

            if(item.invoice_status!='released'){
              this.itemdata.forEach((data)=>{
                if(data.job_id==item.job_id){
                  
                  this.edit.push(item);
                }
              })
            }
          }

        this.lineItemsList=this.edit;
         
        });
       }
       
        this.loaderService.display(false);
      },

      err => {
        this.loaderService.display(false);
      }
    )
  }
  updateInvoiceId=[];
 
  restructureHash(event,data){
    if(event.target.checked){
       this.updateInvoiceId.push(data.id);
        
    } else{
      this.updateInvoiceId.splice(this.updateInvoiceId.indexOf(data.id), 1);
       
    }
  }

  HideShow (){
    this.projectDataInfo=[];
    this.SelectedInvoiceSliId=[];
    this.SelectedInvoiceSliId.length=0;
    $('body').removeClass('modal-open');
    $('.modal').css('overflow-y', 'auto');
    $('body').css("overflow", "auto");
 	  $("#PickedItems").modal("hide");
    $("#SubmitProduct").modal("show");
    $("#SubmitProduct").appendTo("body");
     
    this.InvoiceLabel();
    this.getProjectLineItemsDetails(this.currentPageOn);
    this.EditProductForm.reset();
  }
   
  labelval;
  SubmitAddedProduct(value){  //submit added product functionality
    this.projectDataInfo=[];
    $("#SubmitProduct").modal("hide");
    $("#create-invoices").modal("show");
    $("#create-invoices").appendTo("body");
    this.labelval=this.AddProductForm.controls['label'].value;
    this.loaderService.display(true);
    this.financeService.SubmitInvoices(this.project_id_Invoice.project_id,this.labelval,this.checkedList).subscribe(
      res=>{
        res= res;
        this.edit=[];
        this.edit.length=0;
        this.projectDataInfo=[];
        this.InvoiceLabel();
        this.SelectedInvoiceSliId=[];
        this.SelectedInvoiceSliId.length=0;
        this.AddProductForm.reset();
        this.getProjectLineItemsDetails(this.currentPageOn);
        this.loaderService.display(false);
        this.successMessage = res.message;
         
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
      },
      err=>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 10000);
      }
    );
  }
   
  isAllSelectedVal(){
    
    this.masterSelected = this.lineItemsList.every(function(item:any) {
        return item.is_invoice == true;
         
      })
    this.getCheckedItemListlist();
  }
  edit=[];
  getCheckedItemListlist(){  //select unselect functionality of added line item for create invoice 
    this.checkedList = [];
    for (var i = 0; i < this.lineItemsList.length; i++) {
      
      if(this.lineItemsList[i].is_invoice==true){
       
        this.checkedList.push(this.lineItemsList[i]);
         
      }
    }
    
  }
 
 edit1=[];
 InvoiceLabel(){ //get invoice details
  
   if(this.project_id_Invoice){
    this.financeService.InvoiceLabel(this.currentProjectId).subscribe(
      res=>{
        res=res.json();
        this.addedSliProduct= res.payment_invoices;
         this.SelectedInvoiceSliId=[];
         this.SelectedInvoiceSliId.length=0;
         this.edit1=[];
         if(this.currentInvoiceId) {
          this.addedSliProduct.forEach((item,index) => {
            if(this.currentInvoiceId==item.parent_invoice_id || item.status=='pending'){
              this.edit1.push(item);
               
            } 
            this.addedSliProduct=this.edit1;
            
          });
          
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      });
   }
  }
  array_length;
  SelectedIdsli=[];
  SelectedInvoiceSliId=[];
  SelectedInvoiceCreate(data,event){
    if(event.target.checked){
     this.SelectedIdsli.push(event.target.value);
    } else{
      this.SelectedIdsli.splice(this.SelectedIdsli.indexOf(event.target.value), 1);
    }
    
    this.SelectedInvoiceSliId = this.SelectedIdsli.map(Number);
     
  }
  FinalInvoiceCreatedSubmition(CreateInvoiceForm){ //create invoice functionality
    this.projectDataInfo=[];
    this.loaderService.display(true);
    this.financeService.FinalInvoiceCreatedSubmition(this.project_id_Invoice.project_id,this.SelectedInvoiceSliId,CreateInvoiceForm).subscribe(
      res=>{
        res= res;
        this.InvoiceLabel();
        this.EditProductForm.reset();
        this.AddProductForm.reset();
        this.edit=[];
        this.edit.length=0;
        this.SelectedInvoiceSliId=[];
        this.SelectedIdsli=[];
        this.SelectedIdsli.length=0;
        this.SelectedInvoiceSliId.length=0;
        
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = res.message;
       
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
        this.AddProductForm.reset();
      },
      err=>{
        this.loaderService.display(false);
        this.SelectedInvoiceSliId=[];
        this.SelectedInvoiceSliId.length=0;
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 10000);
        this.AddProductForm.reset();
      }
    ); 

  }
  EditlabelProduct(item){ //edit lable functionality
  this.EditProductForm.controls['label'].setValue(item.label);
  $("#EditlabelProduct").appendTo("body");
  $("#create-invoices").modal("hide");
  this.SelectedInvoiceSliId=[];
  this.SelectedInvoiceSliId.length=0;
  this.editlabel_id=item.id;
  this.labelval=item.label
  }
  editlabel_id;
  hsn_code;
  selectedHsnChange(value,item,id,label){
  this.editlabel_id=item.id;
  this.labelval=item.label;
  this.hsn_code=value;
  this.UpadetAddedProductsList('','hsn')
  }
  removeModal(){
    this.checkedList = [];
    this.SelectedInvoiceSliId=[];
    this.SelectedInvoiceSliId.length=0;
    this.masterSelected = false;  
    this.lineItemsList;
    this.edit=[];
    this.edit.length=0;
    this.getProjectLineItemsDetails(this.currentPageOn);
    this.InvoiceLabel();
    $("#EditlabelProduct").modal("hide");
    $('.modal').css('overflow-y', 'auto');  
    $('body').removeClass('modal-open');
    $('.modal').css('overflow-y', 'auto');
    $('body').css("overflow", "auto");
    $("#create-invoices").modal("show");
    this.projectDataInfo=[];
  }
   
  UpadetAddedProductsList(value,type){  // update added line item fuctionality
  
    $("#SubmitProduct").modal("hide");
    
    if (type=='hsn') {
       this.labelval=this.labelval;
       
    }
    if (type=='EditLabel') {
      
      $("#create-invoices").modal("show");
     this.labelval=this.EditProductForm.controls['label'].value;  
    }if (type=='updateLabel') {
      $("#PickedItems").modal("hide");
      $("#create-invoices").modal("show");
     this.labelval=this.AddProductForm.controls['label'].value;  
    }
    this.loaderService.display(true);
    this.financeService.UpadetAddedProductsList(this.project_id_Invoice.project_id,this.checkedList,this.labelval,type,this.editlabel_id,this.hsn_code).subscribe(
      res=>{
        res= res;
        this.edit=[];
        this.edit.length=0;
        this.projectDataInfo=[];
        this.SelectedInvoiceSliId=[];
        this.SelectedInvoiceSliId.length=0;
        this.InvoiceLabel();
        if (type!='hsn') {
         this.getProjectLineItemsDetails(this.currentPageOn);
        }
        $("#EditlabelProduct").modal("hide");
         
        this.EditProductForm.reset();
        this.AddProductForm.reset();
        this.loaderService.display(false);
        if(res.message){
          this.successMessage = res.message;
        }
        
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
      },
      err=>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 10000);
      }
    );
  }
  closeEditmodal(){
    this.EditProductForm.reset();
    $("#PickedItems").modal("hide");
    $("#create-invoices").modal("show");
    $("#create-invoices").appendTo("body");
     
  }
  
  openForSelect(){
    this.EditProductForm.reset();
   $("#create-invoices").modal("show");
   $("#create-invoices").appendTo("body");
  }
  
 UpadateInvoiceSubmition(CreateInvoiceForm){ //updatation for created invoice functionaliy
    this.loaderService.display(true);
    this.financeService.UpadateInvoiceSubmition(this.project_id_Invoice.project_id,CreateInvoiceForm,this.updateInvoiceId,this.currentInvoiceId).subscribe(
      res=>{
        res= res;
        this.InvoiceLabel();
        //this.createInvoiceId=[];
        $("#create-invoices").modal("hide");
        this.EditProductForm.reset();
        this.AddProductForm.reset();
        this.SelectedInvoiceSliId=[];
        this.SelectedIdsli=[];
        this.SelectedIdsli.length=0;
        this.SelectedInvoiceSliId.length=0;
        this.updateInvoiceId=[];
        this.updateInvoiceId.length=0;
        this.edit=[];
        this.edit.length=0;
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = res.message;
       
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
        this.AddProductForm.reset();
      },
      err=>{
        this.loaderService.display(false);
        this.SelectedInvoiceSliId=[];
        this.SelectedInvoiceSliId.length=0;
        this.erroralert = true;
        this.errorMessage = JSON.parse(err._body).message;
        setTimeout(function() {
             this.erroralert = false;
        }.bind(this), 10000);
        this.AddProductForm.reset();
      }
    ); 
  }
  enableEdit = false;
  enableEditIndex = null;
  enableEditMethod(e, i) {
    this.enableEdit = true;
    this.enableEditIndex = i;
    
  }

  cancel() {
     
    this.enableEditIndex = null;
  }

  saveSegment() {
    this.enableEditIndex = null;
  }
}
