import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Angular2TokenService } from 'angular2-token';
// import { AuthService } from '../../authentication/auth.service';

import { CatalogueService } from '../catalogue.service';
import { LoaderService } from '../../../../services/loader.service';
import {IonRangeSliderComponent} from "ng2-ion-range-slider";
declare var $:any;

@Component({
  selector: 'app-new-view-catalogue',
  templateUrl: './new-view-catalogue.component.html',
  styleUrls: ['./new-view-catalogue.component.css'],
  providers: [CatalogueService]
})
export class NewViewCatalogueComponent implements OnInit {

  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;

  @ViewChild('priceSliderElement') priceSliderElement: IonRangeSliderComponent;
  @ViewChild('widthSliderElement') widthSliderElement: IonRangeSliderComponent;
  @ViewChild('depthSliderElement') depthSliderElement: IonRangeSliderComponent;
  @ViewChild('heightSliderElement') heightSliderElement: IonRangeSliderComponent;
  @ViewChild('leadtimeSliderElement') leadtimeSliderElement: IonRangeSliderComponent;

  constructor( 
    private tokenService: Angular2TokenService,
    public catalogueService: CatalogueService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
  ) { }

  subcategory_ids:any = [];
  search_string:any = "";
  class_ids:any = [];
  minimum_price:any = "";
  maximum_price:any = "";
  minimum_lead_time:any = "";
  maximum_lead_time:any = "";
  minimum_width:any = "";
  maximum_width:any = "";
  minimum_length:any = "";
  maximum_length:any = "";
  minimum_height:any = "";
  maximum_height:any = "";
  sort_key:any = "";
  liked:any = false;
  role:string;
  userId;
  selected_space;
  url;
  value;

  ngOnInit() {
    this.url=location.origin;
    this.getMegamenu();
    this.fetchSliderValues();
    this.route.queryParams.subscribe(params => {
        if(params['subcategory_ids'] != null){
          this.subcategory_ids = [];
           this.subcategory_ids.push(params['subcategory_ids']); 
           this.initialiseState();
        }

        else if(params['product'] != null){
          this.search_string = params['product'];
          this.initialiseState();
        }
        else{
          this.resetAll();
          this.initialiseState();
        }
    });
    
    
    
    this.role=localStorage.getItem('user');
    this.userId=localStorage.getItem('userId');
  }

  initialiseState(){
    this.filterNewProducts();
    //this.updatePolka(event);
  }
 

  catalog_segments:any = [];
  marketplace:any = [];
  marketplace_submenu_categories:any = {};
  getMegamenu(){
    this.loaderService.display(true);
    this.catalogueService.getMegamenu().subscribe(
      res => {
        
        this.catalog_segments = res.catalog_segments
        this.marketplace = res.marketplace;
        
        // trial
        this.marketplace_submenu_categories = (this.marketplace.length>0)?this.marketplace[0].categories:[];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  getMarketplacecategories(item){
    this.marketplace_submenu_categories = item.categories
  }

  products_array = [];
  headers_res;
  per_page;
  total_page;
  current_page;
  page_number;
  calalog_type;
  filterNewProducts(page?){
    this.page_number = page;
    this.loaderService.display(true);
    this.catalogueService.filterNewProducts(JSON.stringify(this.subcategory_ids),this.search_string,this.class_ids,this.minimum_price,this.maximum_price,this.minimum_lead_time,this.maximum_lead_time,this.minimum_width,this.maximum_width,this.minimum_length,this.maximum_length,this.minimum_height,this.maximum_height,this.
    sort_key,this.liked,page).subscribe(
      res => {
         
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        
        
        this.value=res.catalog_type;
        if(this.value=='polka'){
          $('#togBtn').prop('checked',false);
        }else{
          $('#togBtn').prop('checked',true);
        }
        this.calalog_type=res.catalog_type;
        this.products_array = res.products;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  slider_value:any;
  all_materials:any;
  all_colors:any;
  all_finishes:any;
  filter_classes:any = [];
  master_minimum_price:any;
  master_maximum_price:any;
  master_minimum_lead_time:any;
  master_maximum_lead_time:any;
  master_minimum_width:any;
  master_maximum_width:any;
  master_minimum_length:any;
  master_maximum_length:any;
  master_minimum_height:any;
  master_maximum_height:any;
  fetchSliderValues(){
    this.loaderService.display(true);
    this.catalogueService.fetchSliderValuesNew().subscribe(
      res => {
        
        // this.products_array = res.products
        // this.minimum_price = res.minimum_price
        // this.maximum_price = res.maximum_price
        // this.minimum_lead_time = res.minimum_lead_time
        // this.maximum_lead_time = res.maximum_lead_time
        // this.minimum_width = res.minimum_width
        // this.maximum_width = res.maximum_width
        // this.minimum_length = res.minimum_length
        // this.maximum_length = res.maximum_length
        // this.minimum_height = res.minimum_height
        // this.maximum_height = res.maximum_height

        this.master_minimum_price = res.minimum_price
        this.master_maximum_price = res.maximum_price
        this.master_minimum_lead_time = res.minimum_lead_time
        this.master_maximum_lead_time = res.maximum_lead_time
        this.master_minimum_width = res.minimum_width
        this.master_maximum_width = res.maximum_width
        this.master_minimum_length = res.minimum_length
        this.master_maximum_length = res.maximum_length
        this.master_minimum_height = res.minimum_height
        this.master_maximum_height = res.maximum_height

        this.filter_classes = res.classes
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  simpleSlider = {name: "Simple Slider", onUpdate: undefined, onFinish: undefined};
  advancedSlider = {name: "Advanced Slider", onUpdate: undefined, onFinish: undefined};

  updateSlider(type, slider, event){
    
    // slider.onUpdate = event;
    if(type == 'price'){
      this.minimum_price = event.from
      this.maximum_price = event.to
    }
    else if(type == 'lead_time'){
      this.minimum_lead_time = event.from
      this.maximum_lead_time = event.to
    }
    else if(type == 'width'){
      this.minimum_width = event.from
      this.maximum_width = event.to
    }
    else if(type == 'length'){
      this.minimum_length = event.from
      this.maximum_length = event.to
    }
    else if(type == 'height'){
      this.minimum_height = event.from
      this.maximum_height = event.to
    }
    this.filterNewProducts();
  }

  updateFilterClass(class_id,event){
    
    if(event.target.checked){
      this.class_ids.push(class_id);
    }
    else{
      var index = this.class_ids.indexOf(class_id);
      if (index > -1) {
        this.class_ids.splice(index, 1);
      }
    }
    this.filterNewProducts();
  }

  sortFilter(sort_value){
    this.sort_key = sort_value;
    let text;
    if(sort_value == 'price_low_to_high'){
      text = 'Price: Low to High'
    }
    else if(sort_value == 'price_high_to_low'){
      text = 'Price: High to Low'
    }
    else if(sort_value == 'newest_first'){
      text = 'Newest First'
    }
    else if(sort_value == 'none'){
      text = 'None'
      this.sort_key = '';
    }
    $(".sort-toggle").text(text);
    this.filterNewProducts();
  }
product_Id
  likeProduct(product_id){
    this.product_Id=product_id;
    this.loaderService.display(true);
    this.catalogueService.likeProduct(product_id).subscribe(
      res => {
        
        this.filterNewProducts(this.page_number);
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  myNum() {
    var x = document.getElementById("mainDiv");
    var y= document.getElementById("Div2");
    var z=document.getElementById("Div3");
    var a=document.getElementById("Div4");
    if (x.style.display === "none") {
      x.style.display = "block";
      y.style.display="block";
      z.style.display="block";
      a.style.display="none";

    } else {
      x.style.display = "none";
   
    }
  }

  Submenu() {
    document.getElementById("Div2").style.display = "none";
    document.getElementById("Div3").style.display="none";
    document.getElementById("Div4").style.display="block";

  }

  //For view Image in modal
  parent_modal;
  zoomImg(elemid,index){
    $('.zoom-img-modal-lg').modal('show');
    var child = <HTMLInputElement>document.getElementById("img-lg-zoom1");
    var str=elemid+index;
    var inputelem= <HTMLImageElement>document.getElementById(str);
    child.src =inputelem.src;
  }
  normalImg(){
    var child = <HTMLInputElement>document.getElementById("img-lg-zoom1");
    child.src="";
    $('.zoom-img-modal-lg').modal('hide');
    if(this.parent_modal){
      $(this.parent_modal).modal('show');
      this.parent_modal = undefined;
    }
  }

  resetAll(){
    this.subcategory_ids = [];
    this.search_string = "";
    this.class_ids = [];
    this.minimum_price = "";
    this.maximum_price = "";
    this.minimum_lead_time = "";
    this.maximum_lead_time = "";
    this.minimum_width = "";
    this.maximum_width = "";
    this.minimum_length = "";
    this.maximum_length = "";
    this.minimum_height = "";
    this.maximum_height = "";
    this.sort_key = "";
    this.liked = false;
    $(".sort-toggle").text('None');
  }

  clearAll(){
    this.resetAll();
    this.filterNewProducts();
    this.fetchSliderValues();
  }
  fetchSavedProducts(){
    this.liked = true;
    this.filterNewProducts();


  }

  searchTextFilter(event){
    this.search_string = event.target.value;
    this.filterNewProducts();
  }

  activatedZoomerImg:any = "";
  activateZoomer(img, event){
    var f = document.querySelector('.zoomer-container');
    
    this.activatedZoomerImg = img;
    $('.zoomer-container').css("top", event.pageY + f.scrollTop -150 + 'px');
    $('.zoomer-container').css("display", 'block');
    // $('.zoomer-container img').attr('src', this.activatedZoomerImg);
  }
  
    
  updatePolka(event){
    this.selected_space = event.target.checked;
    
    if(event.target.checked==true){
      this.value='arrivae'
    }if (event.target.checked==false) {
      this.value='polka'
    }
   
    this.loaderService.display(true);
    this.catalogueService.catalogType(this.userId,this.value).subscribe(
    res=>{
      
      this.successalert = true;
      this.successMessage = res.message;
      this.filterNewProducts();
      this.getMegamenu();
      this.fetchSliderValues();
      this.clearAll();
      this.loaderService.display(false);
    },
    err=>{
      this.loaderService.display(false);
      
      this.errorMessage = err.message;
    });
  } 
  
  // changeFileFormat(event){
    
  //   if(this.selected_space == 'arrivae'){
  //     return 'Arrivae'

  //   }else if(this.selected_space == 'polka'){
  //     return 'Polka House'

  //   }
  // }
   
}
