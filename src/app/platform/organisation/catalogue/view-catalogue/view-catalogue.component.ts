import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import {IonRangeSliderComponent} from "ng2-ion-range-slider";
import { LoaderService } from '../../../../services/loader.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogueService } from '../catalogue.service';
import { QuotationService } from '../../../quotation/quotation.service';
declare var $:any;

@Component({
  selector: 'app-view-catalogue',
  templateUrl: './view-catalogue.component.html',
  styleUrls: ['./view-catalogue.component.css'],
  providers: [CatalogueService, QuotationService]
})
export class ViewCatalogueComponent implements OnInit {

	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;

  dropdownArr=[{id:1,name:'Kitchen'},{id:2,name:'Bedroom'},{id:3,name:'Foyer'}];
  dropdownArr1=[{id:1,name:'Flower pot'},{id:2,name:'Shoerack'},{id:3,name:'Table'},{id:4,name:'Sofa'}];
  dropdownArr2=[{id:1,name:'2-seater sofa'},{id:2,name:'3-seater sofa'},{id:3,name:'4-seater sofa'}];

  selectedRangesArr = new Array();
  selectedSpacesArr = new Array();
  selectedCategoriesArr = new Array();
  selectedSubCategoriesArr = new Array();
  items: Array<any> = [];
  itemsList: Array<any> = [];
  is_champion;


  @ViewChild('priceSliderElement') priceSliderElement: IonRangeSliderComponent;
  @ViewChild('widthSliderElement') widthSliderElement: IonRangeSliderComponent;
  @ViewChild('depthSliderElement') depthSliderElement: IonRangeSliderComponent;
  @ViewChild('heightSliderElement') heightSliderElement: IonRangeSliderComponent;
  @ViewChild('leadtimeSliderElement') leadtimeSliderElement: IonRangeSliderComponent;

  constructor(
    public catalogueService: CatalogueService,
    public quotationService: QuotationService,
    private loaderService: LoaderService
  ) {
    // this.items = [
    //   { name: 'assets/img/bedroom.jpg' },
    //   { name: 'assets/img/kitchen.png' },
    //   { name: 'assets/img/ofiice1.jpg' },
    //   { name: 'assets/img/living.jpg' },
    //   { name: 'assets/img/ofiice.jpg' },
    //   { name: 'assets/img/bajaj.jpg' },
    //   { name: 'assets/img/folder.png' },
    //   { name: 'assets/img/desktop.png' },
    //   { name: 'assets/img/nothing.png' },

    // ]
  }

  ngOnInit() {
    this.loaderService.display(true);
    this.is_champion = localStorage.getItem('isChampion');
    this.fetchAllRanges();
    this.fetchAllSpaces();
    // this.fetchSliderValues();
    // this.fetchAllProducts(1);
    this.filterProducts(1);
  }

  ranges_list:any = [];
  fetchAllRanges(){
    this.loaderService.display(true);
    this.catalogueService.fetchAllRanges().subscribe(
      res => {
        this.ranges_list = res.tags;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_ranges:any = [];
  checkRanges(event){
    if(event.target.checked == true){
      this.checked_ranges.push(JSON.parse(event.target.value).id);
      this.selectedRangesArr.push(JSON.parse(event.target.value))
    }
    else{
      var index = this.checked_ranges.indexOf(JSON.parse(event.target.value).id);
      if (index > -1) {
        this.checked_ranges.splice(index, 1);
      }

      var j:number = 0;
      this.selectedRangesArr.forEach((ctr) => {
        if(ctr.id == JSON.parse(event.target.value).id) {
          this.selectedRangesArr.splice(j, 1);
          return;
        }
        j++;
      });
    }

    // this.fetchCategories();
  }

  spaces_list:any = [];
  fetchAllSpaces(){
    this.catalogueService.fetchAllSpaces().subscribe(
      res => {
        this.spaces_list = res.tags;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });

  }

  checked_spaces:any = [];
  checkSpaces(event){
    if(event.target.checked == true){
      this.checked_spaces.push(JSON.parse(event.target.value).id);
      this.selectedSpacesArr.push(JSON.parse(event.target.value));
      this.uncheckCategories();
    }
    else{
      var index = this.checked_spaces.indexOf(JSON.parse(event.target.value).id);
      if (index > -1) {
        this.checked_spaces.splice(index, 1);
      }

      var j:number = 0;
      this.selectedSpacesArr.forEach((ctr) => {
        if(ctr.id == JSON.parse(event.target.value).id) {
          this.selectedSpacesArr.splice(j, 1);
          return;
        }
        j++;
      });
      this.uncheckCategories();
    }
    this.fetchCategories();
  }

  uncheckCategories(){
    var j:number = 0;
    this.selectedCategoriesArr.forEach((ctr) => {
      if(this.containsAny_Array(this.checked_spaces,ctr.space_ids)){
      } else {
        this.selectedCategoriesArr.splice(j, 1);
        var index = this.checked_categories.indexOf(ctr.id);
        if (index > -1) {
          this.checked_categories.splice(index, 1);
        }
      }
      j++;
      this.unchecksubCategories();
    });
  }

  unchecksubCategories(){
    var updatedSelectedSubCategoriesArr = [];
    for(var k=0;k<this.selectedSubCategoriesArr.length;k++){
      if(this.containsAny_Array(this.checked_categories,this.selectedSubCategoriesArr[k].category_ids)){
        updatedSelectedSubCategoriesArr.push(this.selectedSubCategoriesArr[k]);
      }
      else{
        var config=this.selectedSubCategoriesArr[k].configuration;
        var index = this.checked_subcategories.indexOf(this.selectedSubCategoriesArr[k].configuration);
        if (index > -1) {
          this.checked_subcategories.splice(index, 1);
        }
      }
    }
    this.selectedSubCategoriesArr = updatedSelectedSubCategoriesArr;
  }

  containsAny_Array(source,target)
  {
    var result = source.filter(function(item){ return target.indexOf(item) > -1});
    return (result.length > 0);
  }

  categories_list:any = [];
  fetchCategories(){
    this.subcategories_list=[];
    this.loaderService.display(true);
    this.catalogueService.fetchCategories(JSON.stringify(this.checked_spaces)).subscribe(
      res => {
        this.categories_list = res.sections;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_categories:any = [];
  checkCategory(event){
    if(event.target.checked == true){
      this.checked_categories.push(JSON.parse(event.target.value).id);
      this.selectedCategoriesArr.push(JSON.parse(event.target.value));
      this.unchecksubCategories();
    }
    else{
      var index = this.checked_categories.indexOf(JSON.parse(event.target.value).id);
      if (index > -1) {
        this.checked_categories.splice(index, 1);
      }

      var j:number = 0;
      this.selectedCategoriesArr.forEach((ctr) => {
        if(ctr.id == JSON.parse(event.target.value).id) {
          this.selectedCategoriesArr.splice(j, 1);
          return;
        }
        j++;
      });
      this.unchecksubCategories();
    }

    this.fetchSubCategories();
  }

  subcategories_list:any = [];
  fetchSubCategories(){
    this.loaderService.display(true);
    this.catalogueService.fetchSubCategories(JSON.stringify(this.checked_categories),
      JSON.stringify(this.checked_spaces)).subscribe(
      res => {
        this.subcategories_list = res.configurations;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_subcategories:any = [];
  checkSubCategory(event){
    if(event.target.checked == true){
      this.checked_subcategories.push(JSON.parse(event.target.value).configuration);
      this.selectedSubCategoriesArr.push(JSON.parse(event.target.value));
    }
    else{
      var index = this.checked_subcategories.indexOf(JSON.parse(event.target.value).configuration);
      if (index > -1) {
        this.checked_subcategories.splice(index, 1);
      }

      var j:number = 0;
      this.selectedSubCategoriesArr.forEach((ctr) => {
        if(ctr.configuration == JSON.parse(event.target.value).configuration) {
          this.selectedSubCategoriesArr.splice(j, 1);
          return;
        }
        j++;
      });
    }

    // this.fetchSubCategories();
  }


  products_list:any = [];
  headers_res;
  per_page;
  total_page;
  current_page;
  fetchAllProducts(page?){
    this.loaderService.display(true);
    this.catalogueService.fetchAllProducts(page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.products_list = res.products;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  slider_value:any;
  all_materials:any;
  all_colors:any;
  all_finishes:any;
  all_minimum_price:any;
  all_maximum_price:any;
  all_minimum_height:any;
  all_maximum_height:any;
  all_minimum_lead_time:any;
  all_maximum_lead_time:any;
  all_minimum_length:any;
  all_maximum_length:any;
  all_minimum_width:any;
  all_maximum_width:any;
  fetchSliderValues(){
    this.loaderService.display(true);
    // this.all_maximum_lead_time = undefined
    // this.all_minimum_lead_time = undefined;
    this.catalogueService.fetchSliderValues(this.search_string,this.checked_ranges,this.checked_spaces,this.checked_categories,this.checked_subcategories).subscribe(
      res => {
        this.slider_value = res;
        this.all_materials = res.materials
        this.all_colors = res.colors
        this.all_finishes = res.finishes
        this.all_minimum_price = res.minimum_price
        this.all_maximum_price = res.maximum_price
        this.all_minimum_height = res.minimum_height
        this.all_maximum_height = res.maximum_height
        this.all_minimum_lead_time = res.minimum_lead_time
        this.all_maximum_lead_time = res.maximum_lead_time
        this.all_minimum_length = res.minimum_length
        this.all_maximum_length = res.maximum_length
        this.all_minimum_width = res.minimum_width
        this.all_maximum_width = res.maximum_width
        this.loaderService.display(false);
        
        
        
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_materials:any = [];
  checked_colors:any = [];
  checked_finishes:any = [];
  checkElement(type, event){
    if(type == "materials"){
      if(event.target.checked){
        this.checked_materials.push(event.target.value)
      }
      else{
        var index = this.checked_materials.indexOf(event.target.value);
        if (index > -1) {
          this.checked_materials.splice(index, 1);
        }
      }
    }
    else if(type == "colors"){
      if(event.target.checked){
        this.checked_colors.push(event.target.value)
      }
      else{
        var index = this.checked_colors.indexOf(event.target.value);
        if (index > -1) {
          this.checked_colors.splice(index, 1);
        }
      }
    }
    else if(type == "finishes"){
      if(event.target.checked){
        this.checked_finishes.push(event.target.value)
      }
      else{
        var index = this.checked_finishes.indexOf(event.target.value);
        if (index > -1) {
          this.checked_finishes.splice(index, 1);
        }
      }
    }
  }

  advancedSlider = {name: "Advanced Slider", onUpdate: undefined};
  checked_minimum_price:any = "";
  checked_maximum_price:any = "";
  checked_minimum_height:any = "";
  checked_maximum_height:any = "";
  checked_minimum_lead_time:any = "";
  checked_maximum_lead_time:any = "";
  checked_minimum_length:any = "";
  checked_maximum_length:any = "";
  checked_minimum_width:any = "";
  checked_maximum_width:any = "";

  updateSlider(type, slider, event) {
    slider.onUpdate = event;
    if(type == "price"){
      this.checked_minimum_price = slider.onUpdate.from;
      this.checked_maximum_price = slider.onUpdate.to;
    }
    else if(type == "height"){
      this.checked_minimum_height = slider.onUpdate.from;
      this.checked_maximum_height = slider.onUpdate.to;
    }
    else if(type == "lead_time"){
      this.checked_minimum_lead_time = slider.onUpdate.from;
      this.checked_maximum_lead_time = slider.onUpdate.to;
    }
    else if(type == "length"){
      this.checked_minimum_length = slider.onUpdate.from;
      this.checked_maximum_length = slider.onUpdate.to;
    }
    else if(type == "width"){
      this.checked_minimum_width = slider.onUpdate.from;
      this.checked_maximum_width = slider.onUpdate.to;
    }

  }

  search_string:any = ""
  filterProducts(page?){
    $(".dd-dropdown").addClass("d-none");
    this.loaderService.display(true);
    this.catalogueService.filterProducts(this.search_string,this.checked_ranges,this.checked_spaces,
      this.checked_categories, this.checked_materials, this.checked_colors, this.checked_finishes,
       this.checked_subcategories, this.checked_minimum_price, this.checked_maximum_price,
       this.checked_minimum_lead_time, this.checked_maximum_lead_time, this.checked_minimum_length,
       this.checked_maximum_length, this.checked_minimum_width, this.checked_maximum_width,
       this.checked_minimum_height,this.checked_maximum_height,page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.products_list = res.products;
        this.loaderService.display(false);
        // this.slider_value = res;
      },
      err => {
        this.loaderService.display(false);
      });
  }

  opensideOverlay() {
    this.fetchSliderValues();
    $(".dd-dropdown").addClass("d-none");
  	document.getElementById("sidenavoverlay").classList.remove('d-none');
    document.getElementById("sidenavoverlay").style.width = "100%";

	}

  closesideOverlay() {
    document.getElementById("sidenavoverlay").style.width = "0";
    document.getElementById("sidenavoverlay").classList.add('d-none');
	}

	displayDropDown(el) {
		var elem = '#'+el + '-dropdown';
		if((<HTMLElement>document.querySelector(elem)).classList.contains('d-none')){
      $(".dd-dropdown").addClass("d-none");
			(<HTMLElement>document.querySelector(elem)).classList.remove('d-none');
		} else {
			(<HTMLElement>document.querySelector(elem)).classList.add('d-none');
		}
	}

 	removeElement(elem,arr,checked_arr,type){
    if(type=='space' || type=='category' || type=='range'){
      var j:number = 0;
      arr.forEach((ctr) => {
        if(ctr.id == elem.id) {
          arr.splice(j, 1);
          return;
        }
        j++;
      });
      var index = checked_arr.indexOf(elem.id);
      if (index > -1) {
        checked_arr.splice(index, 1);
      }
      if(type=='space'){
        this.uncheckCategories();
      }
      if(type=='category'){
        this.unchecksubCategories();
      }

    }
    if(type=='subcategory'){
      var index = checked_arr.indexOf(elem.configuration);
      if (index > -1) {
        checked_arr.splice(index, 1);
      }
      var j:number = 0;
      arr.forEach((ctr) => {
        if(ctr.configuration == elem.configuration) {
          arr.splice(j, 1);
          return;
        }
        j++;
      });
    }

    if(type=='space'){
      this.fetchCategories();
      this.subcategories_list=[];
    } else if (type=='category') {
      this.fetchSubCategories();
    }
    if(this.selectedSpacesArr.length==0){
      this.selectedCategoriesArr = new Array();
      this.selectedSubCategoriesArr = new Array();
      this.checked_categories =[];
      this.checked_subcategories=[];
    }
    if( this.selectedCategoriesArr.length==0){
      this.selectedSubCategoriesArr = new Array();
      this.checked_subcategories=[];
    }
  }

  isElementPresent(elem,arr,type?){
    var flag;
    if(type=='subcategory'){
      flag=false;
      var j:number = 0;
      arr.forEach((ctr) => {
        if(ctr.configuration == elem.configuration) {
          flag=true;
        }
        j++;
      });
    } else {
      var j:number = 0;
      flag=false;
      arr.forEach((ctr) => {
        if(ctr.id == elem.id) {
          flag=true;
        }
        j++;
      });
    }
    if(flag){
      return true;
    } else {
      return false;
    }
  }

  isConfigPresent(elem,arr){
    if(arr.includes(elem)){
      return true;
    }
    else{
      return false;
    }
   }

  product_details:any;
  product_variations:any;
  master_options:any = [];
  sub_options:any = [];
  catalogue_options:any = [];
  variations:any = [];

  //  show proudct information
  autoselect:any = false;
  smallerImage;
  biggerImage1;
  arroWShow:boolean = true;
  dotsShow:boolean = true;
  itemMedium:any = [];
  // items:any = [];
  showProductInfo(productId,sectionId){
    this.autoselect = true;
    this.loaderService.display(true);
    $('#myModal').modal('show');
    this.selectedIndex = 0;
    this.selectedIndexChange = 0;
    this.itemMedium = [];
    this.catalogueService.getProductDetails(productId,sectionId).subscribe(
      res=>{

        this.product_details=res.product;
        this.product_variations = this.product_details.variations;
        this.itemsList = res.product.all_image_urls;
        this.biggerImage = this.itemsList[0].medium;
        this.biggerImage1 = this.itemsList[0].medium;
        this.smallerImage = this.itemsList[0].thumbnail;
        for(var i = this.itemsList.length - 1; i >= 0;i--){
          this.itemMedium.push(this.itemsList[i]);

        }
        
        this.loaderService.display(false);
        
        if(this.itemsList.length == 1){
          this.arroWShow = false;
          this.dotsShow = false



        }
        else{
          this.arroWShow = true;
          this.dotsShow = true;


        }

      },
      err=>{
        this.loaderService.display(false);
      });


    this.quotationService.listMasterOptions(productId).subscribe(
      res => {
        this.master_options = res;
        if(this.master_options.length > 0){
          this.quotationService.listSubOptions(this.master_options[0].id).subscribe(
            res => {
              this.sub_options = res;
              if(this.sub_options.length>0){
                this.quotationService.listCatalogueOptions(this.sub_options[0].id).subscribe(
                  res => {
                    this.catalogue_options = res;
                    if(this.catalogue_options.length>0){
                      this.quotationService.listVariations(this.catalogue_options[0].id).subscribe(
                        res => {
                          this.variations = res;
                          
                        },
                        err => {
                          
                        });
                    }
                  },
                  err => {
                    
                  });
              }
            },
            err => {
              
            });
        }
      },
      err => {
        
      });

  }
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }

  ngAfterViewInit(){

    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })
  }

  openpopup(event,id){
    var thisobj=this;
    
    
    $(event.target).popover({
      trigger:'hover'
    });


    $(function() {
      $('.pop').popover({
        trigger:'hover'
      })
    })
  }

  fetchMasterOption(productId){
    this.quotationService.listMasterOptions(productId).subscribe(
      res => {
        
        this.master_options = res;
        $("#fabricModal").modal("show");
      },
      err => {
        
      });
  }

  fetchSubOption(event){
    
    this.sub_options=[];
    this.quotationService.listSubOptions(event.target.value).subscribe(
      res => {
        
        this.sub_options = res;
        this.catalogue_options= [];
        this.variations = [];
      },
      err => {
        
      });
  }

  fetchCatalogueOption(event){
    
    this.catalogue_options= [];
    this.autoselect = false;
    this.quotationService.listCatalogueOptions(event.target.value).subscribe(
      res => {
        
        this.catalogue_options = res;
        this.variations = [];
      },
      err => {
        
      });
  }

  fetchVariation(event){
    
    this.variations = [];
    this.quotationService.listVariations(event.target.value).subscribe(
      res => {
        
        this.variations = res;
      },
      err => {
        
      });
  }

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

  parent_modal;
  preview_Img(elemid,index,modalname?){
    if(modalname){
      this.parent_modal = modalname;
      $(this.parent_modal).modal('hide');
    }

    var child = <HTMLInputElement>document.getElementById("img-lg-zoom1");
    var str=elemid+index;
    var inputelem= <HTMLImageElement>document.getElementById(str);
    child.src = inputelem.src;
  }
  closeMyModal(modalname){
    $(modalname).modal('hide');
  }

  activatedZoomerImg:any = "";
  activateZoomer(img, event){
    var f = document.querySelector('.zoomer-container');
    
    this.activatedZoomerImg = img;
    $('.zoomer-container').css("top", event.pageY + f.scrollTop -150 + 'px');
    $('.zoomer-container').css("display", 'block');
    // $('.zoomer-container img').attr('src', this.activatedZoomerImg);
  }

  deActivateZoomer(){
    $('.zoomer-container').css("display", 'none');
  }
  count=0;
  currentIndex;

  imageZoom(imgID, resultID,index) {
    this.currentIndex = index;

    var img, lens, result, cx, cy;
    img = document.getElementById(imgID+index);
    result = document.getElementById(resultID);
    result.setAttribute("style","display: block;");

    if(this.count == 0){


      this.count =1;
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute('id', 'myLens');


    lens.setAttribute("style", "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);");


    }
    else{

    var element = document.getElementById('myLens');

    // element.parentNode.removeChild(element);
    document.getElementById("myLens").remove();

    lens = document.createElement("DIV");
    lens.setAttribute('id', 'myLens');
    lens.setAttribute("style", "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);");

    }
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (lens.offsetWidth / 2);
      y = pos.y - (lens.offsetHeight / 2);
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
      if (x < 0) { x = 0; }
      if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
      if (y < 0) { y = 0; }
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }
  removeHover(resultID,index){
    var result1;
    result1 = document.getElementById(resultID);
    result1.setAttribute("style","display: none;");
    document.getElementById("myLens").remove();
    this.count= 0;
    


  }
  biggerImage;
  selectedIndex = 0;
  selectedIndexChange = 0;
  sendMidImge(event,index){
      this.biggerImage = event;
      this.selectedIndexChange = index;
      $('#img-lg-zoom'+this.currentIndex).attr('src',event);
      
      

  }
  addIndex(value){
    this.currentIndex = value;
    


  }

    callCarousel(){

        $('#carouselExample').on('slide.bs.carousel', function (e) {

      var $e = $(e.relatedTarget);
      var idx = $e.index();
      var itemsPerSlide = 4;
      var totalItems = $('.carousel-item').length;

      if (idx >= totalItems-(itemsPerSlide-1)) {
          var it = itemsPerSlide - (totalItems - idx);
          for (var i=0; i<it; i++) {
              // append slides to end
              if (e.direction=="left") {
                  $('.carousel-item').eq(i).appendTo('.carousel-inner');
              }
              else {
                  $('.carousel-item').eq(0).appendTo('.carousel-inner');
              }
          }
      }
  });


    }
}
