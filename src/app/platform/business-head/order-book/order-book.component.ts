import { Component, OnInit } from '@angular/core';
import { BusinessHeadService } from '../business-head.service';
import { LoaderService } from '../../../services/loader.service';
import { Chart } from 'chart.js';
declare var $:any;
@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.css'],
  providers:[BusinessHeadService]
})
export class OrderBookComponent implements OnInit {

  
  arrow = false;
	arrowOne = false;
  from_date;
  to_date;
  order_data;

  constructor(
    public businessHeadService : BusinessHeadService,
    private loaderService : LoaderService
    ) { }

  ngOnInit() {
    this.getOrderData();
    this.getCMsAndDesForCity(null)
  }
  headers_res;
  per_page;
  total_page;
  current_page;
  page_number;
  getOrderData(page?){
    this.loaderService.display(true);
    this.businessHeadService.getOrderData(this.filter_by_type,this.from_date,this.to_date,this.date_filter_type,this.cm_list,this.designer_list,page).subscribe(
      res => {
      	this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        
        this.order_data = res.leads;

        
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      });
  }
  sHowArrow(){
  	if(this.arrow){
  		this.arrow = false;


  	}
  	else{
  		this.arrow = true;

  	}


  }
  sHowSecondArrow(){
  	if(this.arrowOne){
  		this.arrowOne = false;


  	}
  	else{
  		this.arrowOne = true;

  	}
  }
  nav_select;
  selectNavBar(navData){
  	this.nav_select = navData;

  }
  filter_by_type='fhi_data';
  FilterByType(value){
    this.filter_by_type = value;
    this.getOrderData();
    this.getCMsAndDesForCity();

  }
  date_filter_type;
  submitByDate(){
    if( this.from_date != undefined  &&  this.to_date != undefined){
      this.date_filter_type = 'closure'
      
      this.getOrderData();

    }
    else{
      alert('Select From Date And To date First');
    }
    
  }
  cm_dropdownList=[];
  designer_dropdownList=[];
  getCMsAndDesForCity(cityId?){
    this.loaderService.display(true);
    this.businessHeadService.getCMsAndDesForCityForOther(this.filter_by_type,cityId).subscribe(
      res => {
        this.cm_dropdownList = res.cms;
        this.designer_dropdownList=res.designers;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      });
  }
  cm_list = [];
  designer_list = [];
  cm_id;
  selected_cm_name;
  SelectCm(cmID){
    this.cm_id = cmID.id;
    this.cm_list = [];
    this.selected_cm_name = cmID.itemName;
    this.cm_list.push(cmID.id);
    
    this.getOrderData();

  }
  designer_id;
  SelectDesigner(designerId){
    this.designer_id = designerId
    this.designer_list = [];
    this.designer_list.push(designerId);
    
    this.getOrderData();

  }
  clearFilter(val){
    if(val == 'designer'){
      this.designer_list = [];
      this.designer_id = -1;


    }
    else{
      this.cm_list = [];
      this.cm_id = -1;
    }
    this.getOrderData();

  }
  clearAllFilter(){
    this.to_date = '';
    this.from_date = '';
    this.cm_list = [];
    this.designer_list = [];
    this.date_filter_type = [];
    this.filter_by_type = '';
    this.designer_id = -1;
    this.cm_id = -1;
    this.getOrderData();

  }
  ClearDateFilter(){
    this.from_date = '';
    this.to_date = '';
    this.getOrderData();

  }
  SplitString(string){
    return string.split("-")[1]
    

  }
  city;
  SelectCity(cityId){
    this.city = cityId;
    this.getOrderData();
    this.getCMsAndDesForCity(cityId);


  }



}
