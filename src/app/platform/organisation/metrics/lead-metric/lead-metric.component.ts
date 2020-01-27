import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { FormControl,
	FormArray,
	FormBuilder,
	FormGroup,
	Validators } from '@angular/forms';
import {MetricService} from '../metric.service';
declare var $:any;

@Component({
  selector: 'app-lead-metric',
  templateUrl: './lead-metric.component.html',
  styleUrls: ['./lead-metric.component.css'],
  providers:[MetricService]
})
export class LeadMetricComponent implements OnInit {

  constructor(
  	private metricService:MetricService,
  	private loaderService:LoaderService
  ) { }

  ngOnInit() {
  	this.populateLeadMetricFilters();
  	this.filterData();
  }

  city_dropdownList = [];
  cm_dropdownList=[];
  designer_dropdownList=[];
  source_dropdownList=[];
  campaign_dropdownList=[];
  leadtype_dropdownList=[];
  leadrole_dropdownlist=[];
  datetype_dropdownList=[{id:'acquisition',itemName:'Lead Acquisition Date'},
  {id:'qualification',itemName:'Lead Qualification Date'}];

  selectedCityItems = [];
  selectedCmItems=[];
  selectedDesignerItems = [];
  selectedSourceItems=[];
  selectedCampaignItems=[];
  selectedLeadroleItems=[];
  selectedLeadtypeItems=[];
  selectedDatetypeItems=[{id:'acquisition',itemName:'Lead Acquisition Date'}];

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
  source_dropdownSettings = {
	  singleSelection: false,
	  text: "Sources",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
  };
  campaign_dropdownSettings = {
	  singleSelection: false,
	  text: "Campaigns",
	  selectAllText:'Select All',
	  unSelectAllText:'UnSelect All',
	  enableSearchFilter: true,
	  classes:"myclass custom-class-dropdown",
  };
  leadrole_dropdownlistSettings = {
    singleSelection: false,
    text: "Lead Type",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class-dropdown",
  }
  leadtype_dropdownSettings = {
	  singleSelection: true,
	  text: "Leads",
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
	    } else if(textVal=='source' && index==3){
	    	for(var k=0;k<this.selectedSourceItems.length;k++){
	    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedSourceItems[k].itemName+',';
	    	}
	    } else if(textVal=='leadrole' && index==4){
        for(var k=0;k<this.selectedLeadroleItems.length;k++){
          (document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedLeadroleItems[k].itemName+',';
        }
      } else if(textVal=='campaign' && index==5){
	    	for(var k=0;k<this.selectedCampaignItems.length;k++){
	    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedCampaignItems[k].itemName+',';
	    	}
	    }else if(textVal=='leadtag' && index==6){
	    	for(var k=0;k<this.selectedLeadtypeItems.length;k++){
	    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedLeadtypeItems[k].itemName+',';
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

    } else if(textVal=='source' && index==3){
    	for(var k=0;k<this.selectedSourceItems.length;k++){
    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedSourceItems[k].itemName+',';
    	}
    } else if(textVal=='leadrole' && index==4){
      for(var k=0;k<this.selectedLeadroleItems.length;k++){
        (document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedLeadroleItems[k].itemName+',';
      }
    } else if(textVal=='campaign' && index==5){
    	for(var k=0;k<this.selectedCampaignItems.length;k++){
    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedCampaignItems[k].itemName+',';
    	}
    }else if(textVal=='leadtag' && index==6){
    	for(var k=0;k<this.selectedLeadtypeItems.length;k++){
    		(document.getElementsByClassName('c-btn')[index]).getElementsByClassName('c-list')[0].innerHTML  += this.selectedLeadtypeItems[k].itemName+',';
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
  
  populateLeadMetricFilters(){
  	this.loaderService.display(true);
  	this.metricService.populateLeadMetricFilters().subscribe(
      res => {
        // this.filters_data = res;
        this.city_dropdownList = res.cities;
        this.cm_dropdownList = res.cms;
        this.designer_dropdownList=res.designers;
        this.source_dropdownList = res.lead_sources;
        this.leadrole_dropdownlist = res.lead_types;
        this.campaign_dropdownList =res.lead_campaigns;
        //this.datetype_dropdownList =res;
        this.leadtype_dropdownList=res.lead_tags;
        for (var i=0;i<this.leadtype_dropdownList.length;i++) {
          if(this.leadtype_dropdownList[i].itemName=='both'){
            this.selectedLeadtypeItems.push(this.leadtype_dropdownList[i]);
          }
        }
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
  	var  cms=[],designers=[], lead_sources=[], lead_campaigns=[],lead_types=[],lead_tags=[];
  	var dateType, city;
  	for(var k=0;k<this.selectedCityItems.length;k++){
  		city =this.selectedCityItems[k].id;
  	}
  	for(var k=0;k<this.selectedDatetypeItems.length;k++){
  		dateType =this.selectedDatetypeItems[k].id;
  	}
  	for(var k=0;k<this.selectedCampaignItems.length;k++){
  		lead_campaigns.push(this.selectedCampaignItems[k].id);
  	}
  	for(var k=0;k<this.selectedSourceItems.length;k++){
  		lead_sources.push(this.selectedSourceItems[k].id);
  	}
    for(var k=0;k<this.selectedLeadroleItems.length;k++){
      lead_types.push(this.selectedLeadroleItems[k].id);
    }
  	for(var k=0;k<this.selectedDesignerItems.length;k++){
  		designers.push(this.selectedDesignerItems[k].id);
  	}
  	for(var k=0;k<this.selectedCmItems.length;k++){
  		cms.push(this.selectedCmItems[k].id);
  	}
  	for(var k=0;k<this.selectedLeadtypeItems.length;k++){
  		lead_tags.push(this.selectedLeadtypeItems[k].id);
  	}
  	var obj={
  			'city':city,
  			'cm':cms,
  			'designers':designers,
  			'lead_sources':lead_sources,
  			'lead_campaigns':lead_campaigns,
        'lead_types':lead_types,
  			'lead_tags':lead_tags,
  			'date_filter_type':dateType,
  			'from_date':this.from_date,
  			'to_date':this.to_date,
  			'week_from_date':this.week_from_date
  	}
  	
  	this.metricService.leadMetricData(obj).subscribe(
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
  toggleTable(targetid){
    var elem=document.getElementById(targetid);
    if(elem.classList.contains('d-none')){
      elem.classList.remove('d-none')
    } else{
      elem.classList.add('d-none');
    }
  }
}
