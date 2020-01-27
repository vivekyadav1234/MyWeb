import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { GeneralManagerService } from '../general-manager.service';
import { FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators } from '@angular/forms';

@Component({
  selector: 'app-gm-dashboard',
  templateUrl: './gm-dashboard.component.html',
  styleUrls: ['./gm-dashboard.component.css'],
  providers:[GeneralManagerService]
})
export class GmDashboardComponent implements OnInit {
  selectedDiv;
  arrow = true;
  arrowOne=true;
  arrowTwo=true;
  arrowThree=true;
  from_date;
  to_date;
  data;
 
  // role: string;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
 
  role:string;
 

  constructor(
    public generalManagerService : GeneralManagerService,
    private loaderService : LoaderService,
     
    ) { }
    
  ngOnInit() {
    this.getDAYData();
    this.getCMsAndDesForCity();
    this.role = localStorage.getItem('user');
  }
 
 
  getDAYData(){
    this.loaderService.display(true);
    this.generalManagerService.getDAYAndWEEKData(this.filter_by_type,this.date_filter_type,this.filter_by_area,this.filter_by_time,this.from_date,this.to_date,this.designers,this.cms,this.gms).subscribe(
      res => {
         
        
        // this.getCMsAndDesForCity();
        this.data = res.data;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      });
  }
  
   
  selectedCmItems=[];
  selectedGmItems=[];
  selectedDesignerItems = [];
  label_arr=[];
  cm_dropdownList=[];
  gm_dropdownList=[];
  designer_dropdownList=[];
  gm_dropdownSettings = {
    singleSelection: false,
    text: "General Managers",
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

  onItemSelect(items,textVal?,index?){
    if(textVal=='cm' && index==1){
      this.cms = [];
      for(var k=0;k<this.selectedCmItems.length;k++){
      this.cms.push(this.selectedCmItems[k].id);
    }
     this.getDAYData();
     this.getCMsAndDesForCity();
      
    } 
    else if(textVal=='designer' && index == 2){      
      this.designers = [];
      for(var k=0;k<this.selectedDesignerItems.length;k++){
      this.designers.push(this.selectedDesignerItems[k].id);
    }
      this.getDAYData();
      // this.getData();
    } 
    else if(textVal=='gm' && index == 3){      
      this.gms = [];
      for(var k=0;k<this.selectedGmItems.length;k++){
      this.gms.push(this.selectedGmItems[k].id);
    }
      this.getDAYData();
      this.getCMsAndDesForCity();
   
    } 
 
  }

  OnItemDeSelect(items,textVal?,index?){
    if(textVal=='cm' && index==1){
      for(var k=0;k<this.cms.length;k++){
        if(items.id == this.cms[k]){
          this.cms.splice(k,1);
          
        }
      }
      this.getDAYData();
    
     }
     if(textVal=='gm' && index==3){
      for(var k=0;k<this.gms.length;k++){
        if(items.id == this.gms[k]){
          this.gms.splice(k,1);
          
        }
      }
      this.getDAYData();
      this.getCMsAndDesForCity();
     }
    if(textVal=='designer' && index==2){
      for(var k=0;k<this.designers.length;k++){
        if(items.id == this.designers[k]){
          this.designers.splice(k,1);
          
        }
      }
      this.getDAYData();
   
    }
  }
   
  onSelectAll(items){}
  onDeSelectAll(items){}
  getCMsAndDesForCity(){
    // this.loaderService.display(true);
    this.generalManagerService.getCMsAndDesForCityForOther(this.gms,this.cms).subscribe(
      res => {
        this.cm_dropdownList = res.cms;
        this.designer_dropdownList=res.designers;
        this.gm_dropdownList = res.gms;
        // this.loaderService.display(false);
      },
      err => { 
        
        // this.loaderService.display(false);
      });
  }
  gms=[];
  cms=[];
  designers=[];
  city;
  
  sHowArrow(){
  	if(this.arrow){
  		this.arrow = false;
    }
  	else{
  		this.arrow = true;
    } 
  }
  mHowArrow(){
    if(this.arrowOne){
      this.arrowOne = false;
    }
    else{
      this.arrowOne = true;
    } 
  }
  bHowArrow(){
    if(this.arrowTwo){
      this.arrowTwo = false;
    }
    else{
      this.arrowTwo = true;
    } 
  }
  cHowArrow(){
    if(this.arrowThree){
      this.arrowThree = false;
    }
    else{
      this.arrowThree = true;
    }  
  }
  text(){
     document.getElementById("tableSecond").style.display="block";
     document.getElementById("tableFirst").style.display="none";
  }
  text1(){
     document.getElementById("tableSecond").style.display="none";
     document.getElementById("tableFirst").style.display="block";
  }
  filter_by_time = 'days';
  FilterByTime(value){
    this.filter_by_time = value;
    this.from_date = '';
    this.to_date = '';
    this.text1();
    this.getDAYData();

  }
  date_filter_type;
  submitByDate(){
    
    if( this.from_date  &&  this.to_date ){
      this.date_filter_type = 'qualification'
      this.filter_by_time = '';
      this.getDAYData();
      this.text();

    }
    else{
      alert('Select From Date And To date First');
    }
    
  }
  filter_by_type;
  FilterByType(value){
    this.filter_by_type = value;
    this.getDAYData();

  }
  filter_by_area;
  FilterByArea(value){
    this.filter_by_area = value;
    this.getDAYData();

  }
  ClearCmFilter(){
   this.selectedCmItems=[];
   this.cms=[];
   this.getDAYData();
  }
  ClearGmFilter(){
   this.selectedGmItems=[];
   this.gms=[];
   this.getDAYData();
  }
  CleardesignerFilter(){
   this.selectedDesignerItems = [];
   this.designers = [];
   this.getDAYData();
  }
  ClearDateFilter(){
    this.from_date = '';
    this.to_date = '';
    this.filter_by_time = 'days';
    this.text1();
    this.getDAYData();

  }
  ClearTypeFilter(){
    this.filter_by_type='';
    this.getDAYData();

  }
  ClearAreaFilter(){
    this.filter_by_area='';
    this.getDAYData();
  }
  clearAllFilter(){
    this.filter_by_time = 'days';
    this.filter_by_type = '';
    this.from_date = '';
    this.to_date = '';
    this.filter_by_area='';
    this.date_filter_type = '';
    this.cms=[];
    this.gms=[];
    this.designers = [];
    this.selectedCmItems=[];
    this.selectedDesignerItems = [];
    this.text1();
    this.getDAYData();
  }
  page_number = 1;
  headers_res;
  per_page;
  total_page;
  current_page;
  row_value;
  column_value;
  count_values;
  lead_list:any;
  filterData: any;
  seeCountDetails(page,row_name,column_name,values,search?){
    if(values>=0){
      this.count_values=values;
    } 
    if(values){
      this.count_values=values;
    }
    if(!search){
      search='';
    }
    
    this.row_value = row_name;
    this.column_value =  column_name;
    this.page_number = page;
    this.filterData={
      'row_name':row_name,
      'column_name':column_name,
      'values': values,
      'search':search,
      'page_number':page
    }
    this.loaderService.display(true)
    this.generalManagerService.seeCountDetails(row_name,column_name,this.page_number,this.filter_by_type,this.date_filter_type,this.filter_by_area,this.filter_by_time,this.from_date,this.to_date,this.designers,this.cms,this.gms,search).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.lead_list = res.leads;

        this.loaderService.display(false);
    },
    err=>{
      
      this.loaderService.display(false);
       
    })
  }
  search_value: any;
  onKey(event: any) { // without type info
    this.search_value = event.target.value ;
    if(!this.search_value){
      this.search_value='';
    }
    
    var  i=0;
    if(true){
      this.seeCountDetails(this.page_number,this.row_value,this.column_value,this.count_values,this.search_value);
      i++;
    }

  }
 downloadExcelGmData(){
    this.loaderService.display(true);
    this.generalManagerService.downloadExcelGmData(this.filterData.row_name,this.filterData.column_name,this.page_number,this.filter_by_type,this.date_filter_type,this.filter_by_area,this.filter_by_time,this.from_date,this.to_date,this.designers,this.cms,this.gms,this.filterData.search).subscribe(
      res=>{

        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'The GM Data report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
        }.bind(this), 5000);


      },
      err=>{
        
        this.loaderService.display(false);

      });

  }
  
   
}
