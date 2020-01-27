import { Component, OnInit } from '@angular/core';
import { BusinessHeadService } from '../business-head.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-fhi-data',
  templateUrl: './fhi-data.component.html',
  styleUrls: ['./fhi-data.component.css'],
  providers:[BusinessHeadService]
})
export class FhiDataComponent implements OnInit {
	arrow = false;
	arrowOne = false;
  from_date;
  to_date;
  weekly_data;

  constructor(
    public businessHeadService : BusinessHeadService,
    private loaderService : LoaderService
    ) { }

  ngOnInit() {
    this.getFHIData();
    
  }
  getFHIData(){
    this.loaderService.display(true);
    this.businessHeadService.getFHIAndMKWData('fhi_data',this.filter_by_type,this.from_date,this.to_date,this.date_filter_type,this.cm_list,this.designer_list,this.city).subscribe(
      res => {
        
        this.getCMsAndDesForCity();
        this.weekly_data = res.weekly_data;

        
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
  filter_by_type = 'all';
  FilterByType(value){
    this.filter_by_type = value;
    this.getFHIData();

  }
  date_filter_type;
  submitByDate(){
    if( this.from_date != undefined  &&  this.to_date != undefined){
      this.date_filter_type = 'qualification'
      
      this.getFHIData();

    }
    else{
      alert('Select From Date And To date First');
    }
    
  }
  cm_dropdownList=[];
  designer_dropdownList=[];
  getCMsAndDesForCity(cityId?){
    this.loaderService.display(true);
    this.businessHeadService.getCMsAndDesForCityForOther('fhi_data',cityId).subscribe(
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
    
    this.getFHIData();

  }
  designer_id;
  SelectDesigner(designerId){
    this.designer_id = designerId
    this.designer_list = [];
    this.designer_list.push(designerId);
    
    this.getFHIData();

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
    this.getFHIData();

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
    this.getFHIData();

  }
  ClearDateFilter(){
    this.from_date = '';
    this.to_date = '';
    this.getFHIData();

  }
  SplitString(string){
    return string.split("-")[1]
    

  }
  city;
  SelectCity(cityId){
    this.city = cityId;
    this.getFHIData();
    this.getCMsAndDesForCity(cityId);


  }

ClearCityFilter(){
  this.city = '';
    this.getFHIData();
    this.getCMsAndDesForCity(this.city);
}
}
