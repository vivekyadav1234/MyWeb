import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CatalogueService } from '../catalogue.service';
import { LoaderService } from '../../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-new-view-catalogue-details',
  templateUrl: './new-view-catalogue-details.component.html',
  styleUrls: ['./new-view-catalogue-details.component.css'],
  providers: [CatalogueService]
})
export class NewViewCatalogueDetailsComponent implements OnInit {
  selectedIndex = 0;


  constructor(
  	private route: ActivatedRoute,
    private router: Router,
  	public catalogueService: CatalogueService,
    private loaderService: LoaderService
  ) {

  }

  product_id:any;
  ngOnInit() {
  	this.route.paramMap.subscribe(params => {
	    this.product_id = params.get("id");
      this.fetchProductDetails();
      this.listMasterOptions();
	  })
  }

  product_detail:any = {};
  medium_image;
  fetchProductDetails(){
  	this.loaderService.display(true);
  	this.catalogueService.fetchProductDetails(this.product_id).subscribe(
  	  res => {
  	    
  	    this.product_detail = res.product;
        this.medium_image =  this.product_detail.all_image_urls;
        if(this.medium_image.length > 0){
          this.sendMidImge(this.medium_image[0].medium,0);
        }
  	    this.loaderService.display(false);
  	  },
  	  err => {
  	    
  	    this.loaderService.display(false);
  	  }
  	);
  }

  master_option:any = [];
  listMasterOptions(){
    this.loaderService.display(true);
    this.catalogueService.listMasterOptions(this.product_id).subscribe(
      res => {
        
        this.master_option = res;
        if(this.master_option.length > 0){
          this.listSubOptions();
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  likeProduct(product_id){
    this.loaderService.display(true);
    this.catalogueService.likeProduct(product_id).subscribe(
      res => {
        
        this.fetchProductDetails();
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  sub_option:any = [];
  listSubOptions(){
    this.loaderService.display(true);
    this.catalogueService.listSubOptions(this.master_option[0].id).subscribe(
      res => {
        
        this.sub_option = res;
        if(this.sub_option.length > 0){
          this.listCatalogueOptions();
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  cat_option:any = [];
  listCatalogueOptions(){
    this.loaderService.display(true);
    this.catalogueService.listCatalogueOptions(this.sub_option[0].id).subscribe(
      res => {
        
        this.cat_option = res;
        if(this.cat_option.length > 0){
          this.listVariations();
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  fetchCatalogueOptions(option_id){
    this.loaderService.display(true);
    this.catalogueService.listCatalogueOptions(option_id).subscribe(
      res => {
        
        this.cat_option = res;
        if(this.cat_option.length > 0){
          this.fetchVariation(this.cat_option[0].id);
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  fetchVariation(option_id){
    this.loaderService.display(true);
    this.catalogueService.listVariations(option_id).subscribe(
      res => {
        
        this.variation = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  variation:any = [];
  listVariations(){
    this.loaderService.display(true);
    this.catalogueService.listVariations(this.cat_option[0].id).subscribe(
      res => {
        
        this.variation = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  count=0;
  imageZoom(imgID, resultID) {
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
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
  removeHover(resultID){
    var result1;
    result1 = document.getElementById(resultID);
    result1.setAttribute("style","display: none;");
    document.getElementById("myLens").remove();
    this.count= 0;
    


  }

  goBack(){
    window.history.back();
  }
  biggerImage;
  currentIndex;
  selectedIndexChange = 0;
  sendMidImge(event,index){
      this.biggerImage = event;
      this.selectedIndexChange = index;
      this.medium_image = event;    

  }

  newSearchFilter(search_text){
    this.router.navigate(['catalogue'], { queryParams: { product: search_text } });
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

  viewMoreVariation(event){
    $(".form-possi").toggleClass("expand");
    if(event.target.textContent == "View More"){
      event.target.textContent = "View Less";
    }
    else if(event.target.textContent == "View Less"){
      event.target.textContent = "View More";
    }
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

}