import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import {MetricService} from '../metric.service';
declare var $:any;

@Component({
  selector: 'app-cm-des-metric',
  templateUrl: './cm-des-metric.component.html',
  styleUrls: ['./cm-des-metric.component.css'],
  providers:[MetricService]
})
export class CmDesMetricComponent implements OnInit {

  constructor(
  	private metricService:MetricService,
  	private loaderService:LoaderService
  ) { }

  ngOnInit() {
  	this.populateCmDesMetricFilters();
  	this.filterData();
  }

  designer_dropdownList=[];
  datetype_dropdownList=[{id:'today',itemName:'Today'},
  {id:'yesterday',itemName:'Yesterday'},{id:'this_week',itemName:'This Week'}, 
  {id:'last_week',itemName:'Last Week'},{id:'all_time',itemName:'All Time'}];

  selectedDesignerItems = [];
  selectedDatetypeItems=[{id:'last_week',itemName:'Last Week'}];

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
			if(textVal=='designer' && index==0){
	    	for(var k=0;k<this.selectedDesignerItems.length;k++){
	    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedDesignerItems[k].itemName+',';
	    	}
	    } 
	  }
	}

	OnItemDeSelect(items,textVal?,index?){
    if(document.getElementsByClassName('c-btn')[index] && (document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0]){
		  (document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML='';
		}
    if(textVal=='designer' && index==0){
    	for(var k=0;k<this.selectedDesignerItems.length;k++){
    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedDesignerItems[k].itemName+',';
    	}
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
  
  populateCmDesMetricFilters(){
  	this.loaderService.display(true);
  	this.metricService.populateLeadMetricFilters().subscribe(
      res => {
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
  	var designers=[];
  	var dateType;
  	
  	for(var k=0;k<this.selectedDatetypeItems.length;k++){
  		dateType =this.selectedDatetypeItems[k].id;
  	}
  	for(var k=0;k<this.selectedDesignerItems.length;k++){
  		designers.push(this.selectedDesignerItems[k].id);
  	}
  	var obj={
  			'designers':designers,
  			'date_filter_type':dateType,
  			'from_date':this.from_date,
  			'to_date':this.to_date,
  			'week_from_date':this.week_from_date
  	}
  	this.metricService.cm_designer_metrics_Data(obj).subscribe(
      res => {
        this.metricdata = res;
        // 
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      });
  }
}
