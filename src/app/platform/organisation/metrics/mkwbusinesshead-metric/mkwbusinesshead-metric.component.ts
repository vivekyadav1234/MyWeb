import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import {MetricService} from '../metric.service';
declare var $:any;

@Component({
  selector: 'app-mkwbusinesshead-metric',
  templateUrl: './mkwbusinesshead-metric.component.html',
  styleUrls: ['./mkwbusinesshead-metric.component.css'],
  providers:[MetricService]
})
export class MkwbusinessheadMetricComponent implements OnInit {

  constructor(
  	private metricService:MetricService,
  	private loaderService:LoaderService
  ) { }

  ngOnInit() {
  	this.populateMkwMetricFilters();
  	this.filterData();
  }

  city_dropdownList = [];
  cm_dropdownList=[];
  designer_dropdownList=[];
  datetype_dropdownList=[{id:'today',itemName:'Today'},
  {id:'yesterday',itemName:'Yesterday'},{id:'this_week',itemName:'This Week'}, 
  {id:'last_week',itemName:'Last Week'},{id:'all_time',itemName:'All Time'}];

  selectedCityItems = [];
  selectedCmItems=[];
  selectedDesignerItems = [];
  selectedDatetypeItems=[{id:'last_week',itemName:'Last Week'}];

  city_dropdownSettings = {
	  singleSelection: true,
	  text: "City",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
  };
  cm_dropdownSettings = {
	  singleSelection: false,
	  text: "Community Managers",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
  };
  designer_dropdownSettings = {
	  singleSelection: false,
	  text: "Designers",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
  };
  datetype_dropdownSettings = {
	  singleSelection: true,
	  text: "Date",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
  };

  onItemSelect(items,textVal?,index?){
		if((document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0]){
			(<HTMLElement>(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0]).innerText='';
			if(textVal=='cm' && index==1){
	    	for(var k=0;k<this.selectedCmItems.length;k++){
	    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML += this.selectedCmItems[k].itemName+',';
	    	}
	    } else if(textVal=='designer' && index==2){
	    	for(var k=0;k<this.selectedDesignerItems.length;k++){
	    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedDesignerItems[k].itemName+',';
	    	}
	    } 
	  }
	  if(textVal=='city'){
	  	this.getCMsAndDesForCity(items.id);
	  }
	}

	OnItemDeSelect(items,textVal?,index?){
		if(document.getElementsByClassName('c-btn')[index] && (document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0]){
      (document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML='';
		}
    if(textVal=='cm' && index==1){
    	for(var k=0;k<this.selectedCmItems.length;k++){
    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML += this.selectedCmItems[k].itemName+',';
    	}
    } else if(textVal=='designer' && index==2){
    	for(var k=0;k<this.selectedDesignerItems.length;k++){
    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedDesignerItems[k].itemName+',';
    	}

    }
    if(textVal=='city'){
	  	this.getCMsAndDesForCity(null);
	  }
	}
  onSelectAll(items){}
	onDeSelectAll(items){}

  // filters_data:Object;
  is_lastweektrend_flag = true;
  toggleWeekFlag(val){
  	this.is_lastweektrend_flag =val;
  	if(val){
  		this.week_from_date = null;
  	}
  }

  populateMkwMetricFilters(){
  	this.loaderService.display(true);
  	this.metricService.populateLeadMetricFilters().subscribe(
      res => {
      	this.city_dropdownList = res.cities;
        this.cm_dropdownList = res.cms;
        this.designer_dropdownList=res.designers;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      });
  }

  from_date;
  to_date;
  metricdata;
  week_from_date=null;
  filterData(){
    this.loaderService.display(true);
  	var cms=[],designers=[];
  	var dateType, city;
  	for(var k=0;k<this.selectedCityItems.length;k++){
  		city =this.selectedCityItems[k].id;
  	}
  	for(var k=0;k<this.selectedCmItems.length;k++){
  		cms.push(this.selectedCmItems[k].id);
  	}
  	for(var k=0;k<this.selectedDatetypeItems.length;k++){
  		dateType =this.selectedDatetypeItems[k].id;
  	}
  	for(var k=0;k<this.selectedDesignerItems.length;k++){
  		designers.push(this.selectedDesignerItems[k].id);
  	}
  	var obj={
  			'city':city,
  			'cm':cms,
  			'designers':designers,
  			'date_filter_type':dateType,
  			'from_date':this.from_date,
  			'to_date':this.to_date,
  			'week_from_date':this.week_from_date
  	}
  	
  	this.metricService.mkw_business_head_Metrics_Data(obj).subscribe(
      res => {
        this.metricdata = res;
        // 
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      });
  }

  getCMsAndDesForCity(cityid){
  	this.loaderService.display(true);
  	this.metricService.getCMsAndDesForCity(cityid).subscribe(
      res => {
        this.cm_dropdownList = res.cms;
        this.designer_dropdownList=res.designers;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      });
  }

}
