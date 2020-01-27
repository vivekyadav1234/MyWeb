import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../quotation.service';
import { LoaderService } from '../../../services/loader.service';
import {Location} from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../lead/lead.service';
declare var $:any;

@Component({
  selector: 'app-importquotation',
  templateUrl: './importquotation.component.html',
  styleUrls: ['./importquotation.component.css'],
  providers: [QuotationService,LeadService]
})
export class ImportquotationComponent implements OnInit {

  qid:number;
  projectId;
  role:string;
  quotation: any;
  lead_id;
  Object=Object;
  selectedsectionName;
  selectedsectionId;
  modalQuantityandProductSelectionForm : FormGroup;
  tabsArr = new Array();

  constructor(
    private quotationService :QuotationService,
    private loaderService : LoaderService,
    private route: ActivatedRoute,
    private router : Router,
    private formBuilder: FormBuilder,
    private leadService:LeadService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem('user');
      this.route.params.subscribe(params => {
        this.projectId = params['project_id'];
        this.lead_id = params['lead_id'];
      });
      this.route.queryParams.subscribe(params =>{
        this.qid = params['importBoq_id'];
      })
    this.modalQuantityandProductSelectionForm = this.formBuilder.group({
      productQty : new FormControl(1)
    });
      this.viewQuotationDetails();
      this.fetchBasicDetails();
      //this.getSections();
  }

  ngAfterViewInit(){
    this.getSections();
  }

  backClicked() {
    this._location.back();
  }
  lead_details;
  fetchBasicDetails(){
    this.loaderService.display(true);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.pname = res['lead'].project_details.name;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  totalAmt =0;
  viewQuotationDetails(){
    this.loaderService.display(true);
    this.quotationService.viewQuotationDetails(this.projectId,this.qid).subscribe(
      res => {
        this.quotation = res.quotation;
        this.boqProducts= new Array();
        this.boqProducts_all = new Array();
        this.totalAmt = res.quotation.total_amount;
        if(this.quotation){
          for(var k=0;k<Object.keys(this.quotation.boqjobs).length; k++){
            var tabObj = {
              'section_id':this.quotation.boqjobs[Object.keys(this.quotation.boqjobs)[k]][0].section_id,
              'section_name': this.quotation.boqjobs[Object.keys(this.quotation.boqjobs)[k]][0].section_name
            }
            this.tabsArr.push(tabObj);
            for(var l=0;l<this.quotation.boqjobs[Object.keys(this.quotation.boqjobs)[k]].length; l++){
              this.boqProducts_all.push(this.quotation.boqjobs[Object.keys(this.quotation.boqjobs)[k]][l]);
              this.boqProducts.push(this.quotation.boqjobs[Object.keys(this.quotation.boqjobs)[k]][l]);
            }
          }
          if(this.tabsArr.length>0){
            this.getProductBasedOnSection('all');
          }
          if(Object.keys(this.quotation.boqjobs).length>0){
            this.productKey = Object.keys(this.quotation.boqjobs)[0];
            this.selectedsectionName = 'all';
            this.selectedsectionId = 'all';
          }
        }
        this.productKey = 'all';
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  productArr;
  productKey;
  getProductBasedOnSection(key){
    if(key=='all'){
      this.boqProducts = this.boqProducts_all;
      this.productKey = key;
      this.selectedsectionId = 'all';
      this.selectedsectionName='all';
    }
    else {
      this.productKey = key.section_name;
      this.selectedsectionId=key.section_id;
      this.selectedsectionName = key.section_name;
      var arr = new Array();
      for(var k=0; k<this.boqProducts_all.length; k++){
        if(this.boqProducts_all[k].section_id == key.section_id){
          arr.push(this.boqProducts_all[k]);
        }
      }
      this.boqProducts = arr;
    } 
  }

  products_catalogue;
  products_arr;
  product_configurations;
  product_source = 'catalogue';
  product_details;
  subsections;
  product_variations;
  getCatalogueProducts(sectionName,sectionID){
    this.loaderService.display(true);
    this.product_configurations = [];
    this.quotationService.getProductList(sectionID,sectionName).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr = res['section']['products'];
        this.subsections=this.products_catalogue.section.sub_sections;
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  sectionsList;
  totalProductCountForAll =0;
  pname;
  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sectionsList = res.sections;
        for(var p=0;p<this.sectionsList.length; p++){
          this.totalProductCountForAll = this.totalProductCountForAll+this.sectionsList[p].count;
        }
        for(var k=0; k<res.projects.length;k++){
          if(res.projects[k].id==this.projectId){
            this.pname = res.projects[k].name;
            break;
          }
        }
      },
      err=>{
        
      }
    );
  }

  getCatalogueSubsectionProducts(subsecId,subsecName){
    this.loaderService.display(true);
    this.product_configurations=[];
    this.quotationService.getProductList(subsecId,subsecName).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr = res['section']['products'];
        this.product_configurations = res['section']['product_configurations'];
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }


  getCatalogueConfigurationProducts(configId,configName,sectionId){
    this.loaderService.display(true);
    this.quotationService.getProductForConfiguration(sectionId,configId).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr= res['product_configuration']['products'];
        //this.product_configurations = res['section']['product_configurations'];
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  setProductSource(val){
    this.product_source = val;
    if(val=='catalogue'){
      this.getCatalogueProducts('all','all');
    }
    if(val=='project'){
      this.loaderService.display(true);
      this.quotationService.getProductForThisProject(this.projectId).subscribe(
        res=>{
          this.products_catalogue = res;
          
          this.loaderService.display(false);
        },
        err => {
          
          this.loaderService.display(false);
        }
       );
    }
  }

  viewmoreProductDetails(productId,secId){
    document.getElementById('viewproductRow').style.display = 'block';
    document.getElementById('allproductsRow').style.display = 'none';
    this.quotationService.viewProduct(productId,secId).subscribe(
      res =>{
        this.product_details = res.product;
        this.product_variations = this.product_details.variations;
      },
      err => {
        
      }
    );
  }
  showVariationDetails(val){
    this.product_details = val;
  }
  backToProducts(){
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    this.product_details = undefined;
    this.product_variations = undefined
  }

  closeModal(){
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    var obj = {'section_name':this.selectedsectionName,'section_id':this.selectedsectionId};
    if(this.selectedsectionName == 'all')
      this.getProductBasedOnSection('all');
    else
      this.getProductBasedOnSection(obj);
    this.product_configurations = undefined;
    this.product_details = undefined;
    this.product_variations = undefined;
    this.product_source = 'catalogue';
    this.subsections = undefined;
    // $('#addProductModal').modal('hide');
  }

  boqProducts;
  addProductToBoqs(product,quantity){
    product['quantity'] = quantity.productQty;
    this.product_notify_message = product.name + ' has been added';
    var obj = {
      amount : product.sale_price*product.quantity,
      name: product.name,
      product_id:product.id,
      quantity:product.quantity,
      rate:product.sale_price,
      section_id:product.section_id,
      section_name:product.section_name
    }
    this.totalAmt = this.totalAmt+ obj.amount;
    this.tabsArr.push({'section_id': product.section_id,'section_name':product.section_name});
    var uniqueNames = [];
    var uniqueHash = [];

    for(var s=0, u = this.tabsArr.length; s <= u; s++){
      if(this.tabsArr[s] !== undefined){
        if(!uniqueNames.includes(this.tabsArr[s]['section_id'])){
          uniqueNames.push(this.tabsArr[s]['section_id']);
          uniqueHash.push(this.tabsArr[s]);
        }
      }
    }
    this.tabsArr = uniqueHash;
    this.boqProducts_all.push(obj);
    this.boqProducts = this.boqProducts_all;
    this.modalQuantityandProductSelectionForm.controls['productQty'].setValue(1);
    this.notificationAlert = true;
    setTimeout(function() {
      this.notificationAlert = false;    
    }.bind(this), 10000);
    //localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
    this.backToProducts();
  }
  product_notify_message;
  notificationAlert= false;
  removeProductToBoqs(productid,productname){
    this.product_notify_message = productname + ' has been removed';
     this.notificationAlert = true;
     setTimeout(function() {
        this.notificationAlert = false;    
      }.bind(this), 10000);
    for(var i=0; i<this.boqProducts_all.length;i++){
      if(this.boqProducts_all[i].id==productid){
        this.totalAmt=this.totalAmt- (this.boqProducts_all[i].rate * this.boqProducts_all[i].quantity);
        this.boqProducts_all.splice(i, 1);
         break;
      }
    }
    for(var i=0; i<this.boqProducts.length;i++){
      if(this.boqProducts[i].id==productid){
         this.boqProducts.splice(i, 1);
         break;
      }
    }
    // localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
  }

  boqProducts_all; 
  cartTotal=0;
  myCartProducts(){
    for(var l=0; l <this.boqProducts_all.length; l++){
      this.cartTotal= this.cartTotal+(this.boqProducts_all[l].quantity * this.boqProducts_all[l].rate);
    }
  }
  
  editQuotation(boqStatus){
    this.loaderService.display(true);
    var products = new Array();
    for(var l=0; l <this.boqProducts_all.length; l++){
      var obj = {
        "id": this.boqProducts_all[l].product_id,
        "quantity": this.boqProducts_all[l].quantity
      }
      products.push(obj);
    }
    var data = {
      "quotation": {
      "status": boqStatus,
      "products": products
      }
    }
    this.quotationService.postBOQData(data,this.projectId).subscribe(
      res => {
        //$('#myCart').modal('hide');
        localStorage.removeItem('boqAddedProducts');
        localStorage.removeItem('boqTypeCreation');
        localStorage.removeItem('selected_sections');
        localStorage.removeItem('importedBoqValues');
        this.router.navigate(["project/"+this.projectId+"/list_of_boqs"]);
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  onInputQuantity(elemid,product){
    var inputval=(<HTMLInputElement> document.getElementById(elemid)).value;
    var obj = {
      'key':elemid,
      'quantVal':inputval
    }
    for(var p=0;p<this.boqProducts.length;p++){
      if(this.boqProducts[p].id == product.id){
        this.totalAmt = (this.totalAmt - this.boqProducts[p].amount) + (product.rate * <any>obj.quantVal);
        this.boqProducts[p].amount = product.rate * <any>obj.quantVal;
        this.boqProducts[p].quantity = <any>obj.quantVal;

        break;
      }
    }

    for(var i=0; i<this.boqProducts_all.length;i++){
      if(this.boqProducts_all[i].id==product.id){
         this.boqProducts_all[p].amount = product.rate * <any>obj.quantVal;
          this.boqProducts_all[p].quantity = <any>obj.quantVal;
         break;
      }
    }
  }
  cancelBoq(){
    localStorage.removeItem('boqAddedProducts');
    localStorage.removeItem('boqTypeCreation');
    localStorage.removeItem('selected_sections');
    localStorage.removeItem('importedBoqValues');
    this.router.navigate(["project/"+this.projectId+"/list_of_boqs"]);
  }

}