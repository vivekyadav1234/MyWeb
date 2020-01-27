import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../quotation.service';
import { LoaderService } from '../../../services/loader.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;
import {Location} from '@angular/common';

@Component({
  selector: 'app-editquotation',
  templateUrl: './editquotation.component.html',
  styleUrls: ['./editquotation.component.css'],
  providers: [QuotationService]
})
export class EditquotationComponent implements OnInit {

  qid:number;
  projectId;
  role:string;
  quotation: any;
  Object=Object;
  selectedsectionName;
  selectedsectionId;
  modalQuantityandProductSelectionForm : FormGroup;
  tabsArr = new Array();
  lead_status;

  constructor(
  	private quotationService :QuotationService,
  	private loaderService : LoaderService,
  	private route: ActivatedRoute,
    private router : Router,
  	private formBuilder: FormBuilder,
    private _location: Location
  ) { }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
  	this.role = localStorage.getItem('user');
    this.route.params.subscribe(params => {
      this.qid = params['boqid'];
      this.projectId = params['project_id'];
    });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.modalQuantityandProductSelectionForm = this.formBuilder.group({
      productQty : new FormControl(1)
    });
    this.viewQuotationDetails();
    this.getSections();
  }
  	
  viewQuotationDetails(){
    this.loaderService.display(true);
    this.quotationService.viewQuotationDetails(this.projectId,this.qid).subscribe(
      res => {
        this.quotation = res.quotation;
        this.boqProducts= new Array();
        this.boqProducts_all = new Array();
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
          this.getProductBasedOnSection(this.tabsArr[0]);
        }
        if(Object.keys(this.quotation.boqjobs).length>0){
          this.productKey = Object.keys(this.quotation.boqjobs)[0];
          this.selectedsectionName = Object.keys(this.quotation.boqjobs)[0];
          this.selectedsectionId = this.quotation.boqjobs[this.selectedsectionName][0].section_id;
        }
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
        this.products_arr = res['section']['products'];
        this.subsections=this.products_catalogue.section.sub_sections;
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  sectionsList;
  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sectionsList = res.sections;
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
    this.loaderService.display(true);
    document.getElementById('viewproductRow').style.display = 'block';
    document.getElementById('allproductsRow').style.display = 'none';
    this.quotationService.viewProduct(productId,secId).subscribe(
      res =>{
        this.product_details = res.product;
        this.product_variations = this.product_details.variations;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
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
    this.getProductBasedOnSection(this.tabsArr[0]);
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
    var obj = {
      amount : product.sale_price*product.quantity,
      name: product.name,
      product_id:product.id,
      quantity:product.quantity,
      rate:product.sale_price,
      section_id:product.section_id,
      section_name:product.section_name
    }
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
    //localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
    this.backToProducts();
  }
  removeProductToBoqs(productid){
    for(var i=0; i<this.boqProducts_all.length;i++){
      if(this.boqProducts_all[i].id==productid){
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
  }
  editProduct(product){
    this.loaderService.display(true);
    this.viewmoreProductDetails(product.product_id,product.section_id);
  }
  editProductToBoqs(product,qty){
    // 
    // 
    for(var index=0;index<this.boqProducts_all.length;index++){
      if(this.boqProducts_all[index].id==product.product_id){
         break;
      }
    }
  }
  boqProducts_all;
  // ngAfterViewInit() {
  //   this.boqProducts_all = JSON.parse(localStorage.getItem('boqAddedProducts'));
  //   if(this.boqProducts_all == null){
  //     this.boqProducts= new Array();
  //     this.boqProducts_all = new Array();
  //   } else {
  //     this.boqProducts = this.boqProducts_all;
  //     this.boqProducts_all = this.boqProducts_all;
  //   }
  // }  

  cartTotal=0;
  myCartProducts(){
    for(var l=0; l <this.boqProducts_all.length; l++){
      this.cartTotal= this.cartTotal+(this.boqProducts_all[l].quantity * this.boqProducts_all[l].rate);
    }
  }
  
  editQuotation(){
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
      "status": "draft",
      "products": products
      }
    }
    this.quotationService.updateBOQData(this.qid,this.projectId,data).subscribe(
      res => {
        $('#myCart').modal('hide');
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
}
