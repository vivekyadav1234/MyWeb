import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { QuotationService } from '../quotation.service';
import { LoaderService } from '../../../services/loader.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-viewquotation',
  templateUrl: './viewquotation.component.html',
  styleUrls: ['./viewquotation.component.css'],
  providers: [QuotationService]
})
export class ViewquotationComponent implements OnInit {

	qid:number;
  projectId;
  totalAmt =0;
  role:string;
	quotation: any;
  Object=Object;
  pname;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  //complete_productArray =  new Array();
   selectedsectionName;
  selectedsectionId;
  modalQuantityandProductSelectionForm;
  editBtnFlag = false;
  lead_status;
  constructor(
  	private quotationService :QuotationService,
  	private loaderService : LoaderService,
  	private route: ActivatedRoute,
    private router:Router,
    private formBuilder:FormBuilder,
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
  	this.viewQuotationDetails();
    this.modalQuantityandProductSelectionForm = this.formBuilder.group({
      productQty : new FormControl(1)
    });

  }
  ngAfterViewInit(){
    this.getSections();
  }
  viewQuotationDetails(){
    this.loaderService.display(true);
    this.quotationService.viewQuotationDetails(this.projectId,this.qid).subscribe(
      res => {
        this.loaderService.display(false);
        this.quotation = res.quotation;
        this.pname = res.quotation.project_name;
        this.totalAmt = res.quotation.total_amount;
        this.boqProducts= new Array();
        this.boqProducts_all = new Array();
        //this.boqProductsBackupArr = new Array();
        this.tabsArr= new Array()
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
              //this.boqProductsBackupArr.push(this.quotation.boqjobs[Object.keys(this.quotation.boqjobs)[k]][l]);
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
        //this.createProductsArray();
        
        //this.getProductBasedOnSection('all');
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  // createProductsArray(){
  //   this.complete_productArray;
  //   var keys=Object.keys(this.quotation.boqjobs);
  //   for(var index=0;index<keys.length;index++){
  //     for(var i=0;i<this.quotation.boqjobs[keys[index]].length;i++){
  //       this.complete_productArray.push(this.quotation.boqjobs[keys[index]][i]);
  //     }
  //   }
  // }
   
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

  deleteBoq(id){
    if (confirm("Are You Sure you want to delete this boq") == true) {
      this.loaderService.display(true);
      this.quotationService.deleteQuotation(this.projectId,id).subscribe(
        res => {
          // this.router.navigateByUrl('/project/'+this.projectId+'/list_of_boqs');
          this.loaderService.display(false);
          this.backClicked();
        },
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 10000);
        }
      );
    }
  }

  downloadboq(boqId){
    this.quotationService.downloadboq(boqId,this.projectId).subscribe(
      res =>{
        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        var b64Data =  JSON.parse(res._body)['excel'];
        var name= JSON.parse(res._body)['name']+'.xlsx';
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

  editButtonClick(){
    this.editBtnFlag = true;
    // document.getElementById('addProductBtn').classList.remove('d-none');
    document.getElementById('addProductBtn1').classList.remove('d-none');
    document.getElementById('cancelBtn').classList.remove('d-none');
    document.getElementById('saveChangeBtn').classList.remove('d-none');
  }

  updateBoq(){
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
      "status": this.quotation.status,
      "products": products
      }
    }
    this.quotationService.updateBOQData(this.qid,this.projectId,data).subscribe(
      res => {
        this.viewQuotationDetails();
        this.editBtnFlag = false;
        // document.getElementById('addProductBtn').classList.add('d-none');
        document.getElementById('addProductBtn1').classList.add('d-none');
        document.getElementById('cancelBtn').classList.add('d-none');
        document.getElementById('saveChangeBtn').classList.add('d-none');
        this.product_notify_message = 'BOQ updated Successfully';
        this.notificationAlert = true;
        this.loaderService.display(false);
        setTimeout(function() {
              this.notificationAlert = false;    
            }.bind(this), 10000);
      },
      err => {
        this.errorMessage = JSON.parse(err['_body']).message;
        this.erroralert = true;
        setTimeout(function() {
              this.erroralertmodal = false;    
            }.bind(this), 10000);
        this.loaderService.display(false);
      }
    );
  }

  products_catalogue;
  products_arr;
  product_configurations;
  product_source = 'catalogue';
  product_details;
  subsections;
  product_variations;
  sectionsList;
  totalProductCountForAll =0;
  notificationAlert = false;
  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sectionsList = res.sections;
        for(var p=0;p<this.sectionsList.length; p++){
          this.totalProductCountForAll = this.totalProductCountForAll+this.sectionsList[p].count;
        }
      },
      err=>{
        
      }
    );
  }
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

  boqProducts;
  boqProducts_all;
  tabsArr;
  //boqProductsBackupArr;
  product_notify_message;
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

    //document.getElementById('notificationMessageText').innerHTML = product.name + ' has been added.';
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
  }

  discardChanges(){
    this.editBtnFlag = false;
    // document.getElementById('addProductBtn').classList.add('d-none');
    document.getElementById('addProductBtn1').classList.add('d-none');
    document.getElementById('cancelBtn').classList.add('d-none');
    document.getElementById('saveChangeBtn').classList.add('d-none');
    this.viewQuotationDetails();
    this.updateValuesArr = [];
  }
   
  updateValuesArr=  new Array();
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
    var flag = false;
    for(var p=0;p<this.updateValuesArr.length;p++){
      if(this.updateValuesArr[p].key == obj.key){
        this.updateValuesArr[p].quantVal = obj.quantVal;
        flag = true;
        break;
      }
    }
    if(flag == false){
      this.updateValuesArr.push(obj);
    }
  }
}

