import { Component, EventEmitter, Input, OnInit, Output, NgZone, AfterViewInit} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { QuotationService } from '../quotation.service';
import { ProjectService } from '../../project/project/project.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import {ShareDataService} from '../share-data.service';
import { Subscription } from 'rxjs/Subscription';
declare var $:any;
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-loose-quote',
  templateUrl: './create-loose-quote.component.html',
  styleUrls: ['./create-loose-quote.component.css'],
  providers: [QuotationService,ProjectService,ShareDataService]
})
export class CreateLooseQuoteComponent implements OnInit {

	createQuotationForm: FormGroup;
  selectedSections = new Array();
  selectedBoqs;
  sections;
  pname;
  importedBoqval;
  boqtypeCreation;
  selectedsectionName='all';
  selectedsectionId = 'all';
  projectId;
  modalQuantityandProductSelectionForm : FormGroup;
  lead_status;

  constructor(
  	private formBuilder: FormBuilder,
    private authService : AuthService,
    private quotationService : QuotationService,
    private route: ActivatedRoute,
    private router : Router,
    private project : ProjectService,
    private shareDataService:ShareDataService,
    private loaderService : LoaderService,
    private _location: Location,
  ) { 
  	this.getProducts();
  }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
  	this.modalQuantityandProductSelectionForm = this.formBuilder.group({
      productQty : new FormControl(1)
    });
    this.route.params.subscribe(params => {
      this.projectId = params['project_id'];
    });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
  }

  getProducts(){
    this.boqtypeCreation =localStorage.getItem('boqTypeCreation');
    if(this.boqtypeCreation=='create_boq_lf') {
      var res = JSON.parse(localStorage.getItem('selected_sections'));
      if(res !=undefined){
        this.selectedSections = res;
      }
      this.getSections();
    }
    // Object.keys(res).map((key)=>{ this.selectedSections = res[key]; });
  }
  totalProductCountForAll =0;
  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sections = res.sections;
        for(var p=0;p<this.sections.length; p++){
          this.totalProductCountForAll = this.totalProductCountForAll+this.sections[p].count;
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
  getproductsOfSection(status,id){ 
    this.selectedsectionName = status;
    this.selectedsectionId = id;
    if(this.selectedsectionName=='all'){
      this.boqProducts = this.boqProducts_all;
    } else {
      var arr = new Array();
      for(var k=0; k<this.boqProducts_all.length; k++){
        if(this.boqProducts_all[k].section_id == id){
          arr.push(this.boqProducts_all[k]);
        }
      }
      this.boqProducts = arr;
    }
  }

  showproductOptionsDropdown(index){
    var htmlElem = 'productOptionsDropdown-'+index;
    document.getElementById(htmlElem).classList.toggle("rk-dropdown-show");
  }

  products_catalogue;
  products_arr;
  subsections;
  product_configurations;
  product_source = 'catalogue';
  product_details;
  product_variations;
  getCatalogueProducts(sectionName,sectionID){
    this.loaderService.display(true);
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

  getCatalogueSubsectionProducts(subsecId,subsecName){
    this.loaderService.display(true);
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
    this.getproductsOfSection('all','all');
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    this.subsections = undefined;
    this.product_configurations = undefined;
    this.product_details = undefined;
    this.product_variations = undefined;
    this.product_source = 'catalogue';
    // $('#addProductModal').modal('hide');
  }

  boqProducts;
  product_notify_message;
  notificationAlert= false;
  totalAmt=0;
  addProductToBoqs(product,quantity){
    product['quantity'] = quantity.productQty;
    this.product_notify_message = product.name + ' has been added';
    
    this.totalAmt = this.totalAmt+ (product.quantity*product.sale_price);
    this.boqProducts_all.push(product);
    this.boqProducts = this.boqProducts_all;
    localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
    this.selectedSections.push({'id':product.section_id,'name':product.section_name});
    var uniqueNames = [];
    var uniqueHash = [];

    for(var s=0, u = this.selectedSections.length; s <= u; s++){
      if(this.selectedSections[s] != undefined){
        if(!uniqueNames.includes(this.selectedSections[s]['id'])){
          
          uniqueNames.push(this.selectedSections[s]['id']);
          uniqueHash.push(this.selectedSections[s]);
        }
      }
    }
    this.selectedSections = uniqueHash;
    localStorage.setItem('selected_sections',JSON.stringify(this.selectedSections));
    this.modalQuantityandProductSelectionForm.controls['productQty'].setValue(1);
    this.notificationAlert = true;
    setTimeout(function() {
      this.notificationAlert = false;    
    }.bind(this), 10000);
    this.backToProducts();
  }
  removeProductToBoqs(productid,productname){
    this.product_notify_message = productname + ' has been removed';
     this.notificationAlert = true;
     setTimeout(function() {
        this.notificationAlert = false;    
      }.bind(this), 10000);
    for(var i=0; i<this.boqProducts_all.length;i++){
      if(this.boqProducts_all[i].id==productid){
        this.totalAmt=this.totalAmt- (this.boqProducts_all[i].sale_price * this.boqProducts_all[i].quantity);
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
    // var index = new Array();
    // for(var k=0;k<this.selectedSections.length;k++){
    //   var sectionFlag = false;
    //   for(var  i=0; i<this.boqProducts.length;i++){
    //     if(this.boqProducts[i].section_name==this.selectedSections[k].section_name){
    //       sectionFlag = true;
    //       break;
    //     }
    //   }
    //   if(!sectionFlag) {
    //     index.push(k);
    //   }
    // }
    // 
    // for(var i=0;i<index.length;i++){
    //   this.selectedSections.splice(index[i],1);
    // }
    // localStorage.setItem('selected_sections',JSON.stringify(this.selectedSections));
    localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
  }

  boqProducts_all;
  ngAfterViewInit() {
    this.boqProducts_all = JSON.parse(localStorage.getItem('boqAddedProducts'));
    if(this.boqProducts_all == null){
      this.boqProducts= new Array();
      this.boqProducts_all = new Array();
    } else {
      this.boqProducts = this.boqProducts_all;
      this.boqProducts_all = this.boqProducts_all;
      for(var index=0;index<this.boqProducts_all.length;index++){
        
        //this.totalAmt = this.totalAmt+this.boqProducts_all[index].amount;
      }
    }
  }  

  cartTotal=0;
  myCartProducts(){
    for(var l=0; l <this.boqProducts_all.length; l++){
     this.cartTotal= this.cartTotal+(this.boqProducts_all[l].quantity * this.boqProducts_all[l].sale_price);
    }
  }
  
  createQuotation(boqStatus){
    this.loaderService.display(true);
    var products = new Array();
    for(var l=0; l <this.boqProducts_all.length; l++){
      var obj = {
        "id": this.boqProducts_all[l].id,
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
        this.backClicked();
        // this.router.navigate(["project/"+this.projectId+"/list_of_boqs"]);
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
        //this.totalAmt = (this.totalAmt - this.boqProducts[p].amount) + (product.sale_price * <any>obj.quantVal);
        this.boqProducts[p].amount = product.sale_price * <any>obj.quantVal;
        this.boqProducts[p].quantity = <any>obj.quantVal;

        break;
      }
    }

    for(var i=0; i<this.boqProducts_all.length;i++){
      if(this.boqProducts_all[i].id==product.id){
         this.boqProducts_all[p].amount = product.sale_price * <any>obj.quantVal;
          this.boqProducts_all[p].quantity = <any>obj.quantVal;
         break;
      }
    }
    
    localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
  }

  cancelBoq(){
    localStorage.removeItem('boqAddedProducts');
    localStorage.removeItem('boqTypeCreation');
    localStorage.removeItem('selected_sections');
    localStorage.removeItem('importedBoqValues');
    this.backClicked();
    // this.router.navigate(["project/"+this.projectId+"/list_of_boqs"]);
  }

}
