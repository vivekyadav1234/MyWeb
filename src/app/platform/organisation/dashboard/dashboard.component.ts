import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
import { LoaderService } from '../../../services/loader.service';

import {LeadService} from '../../lead/lead.service';
import {CsagentService} from '../csagentdashboard/csagent.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '../../../../../node_modules/@angular/forms';
//declare var swal:any;
declare var $:any;
declare var bootbox:any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ProjectService, UserDetailsService,LeadService,CsagentService]
})
export class DashboardComponent implements OnInit {
  observableProjects: Observable<Project[]>
   projects: Project[];
  dashboardAccess = ['admin','design_head'];
  createProjectAccess = ['admin','customer'];
  editprojectAccess=['admin','customer'];
  notAttemptedLeadCount = 0;
  notClaimedLeadCount = 0;
  claimedLeadCount=0;
  totalLeadCount =0;
  followupLeadCount = 0;
  lostLeadCount = 0;
  qualifiedLeadCount = 0;
  lostAfterTriesLeadCount = 0;
  escalatedLeadCount = 0;
  notContactableLeadCount = 0;
  customerLeadCount = 0;
  convertedCustomerLeadCount = 0;
  brokerLeadCount = 0;
  convertedBrokerLeadCount = 0;
  designerLeadCount = 0;
  convertedDesignerLeadCount = 0;
  droppedLeadCount=0;
  manufacturerLeadCount = 0;
  convertedManufacturerLeadCount = 0;

  role: string;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  manufacturer_typeid;
  broker_typeid;
  designer_typeid;
  customer_typeid;
  countres;
  lead_sources=[];
  lead_campaigns=[];
  lead_types=[];
  JSON = JSON;
  inviteChampionForm: FormGroup;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  showChildDropdown: boolean;
  child_champion_user: any[];
  parent_id: any;
  is_champion;

  constructor(
    private userDetailsService:UserDetailsService,
    private router: Router,
    private projectService:ProjectService,
    private loaderService : LoaderService,
    private leadService:LeadService,
    private csagentService:CsagentService,
    private formBuilder:FormBuilder
  ) {
      this.role=localStorage.getItem('user');
      this.inviteChampionForm = this.formBuilder.group({
        name : new FormControl("",[Validators.required]),
        email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                Validators.required]),
        contact : new FormControl("",[Validators.required]),
        parent_id : new FormControl(""),
        champion_level: new FormControl("",[Validators.required]),
        user_type:new FormControl("arrivae_champion")
      });
   
  }

  ngOnChanges(): void {
    //this.getProjectListFromService();
  }

  ngOnInit(): void{
    this.is_champion = localStorage.getItem('isChampion');

    if(this.role == 'admin'){
      this.getProjectListFromService();
    }
    if(this.role=='lead_head'){
      this.getLeadCount();
      //this.getLeadCountByStatus();
      //this.getEscalatedLeadCountByStatus();
      this.getLeadPoolList();
    }
    this.loaderService.display(false);    
    
  }
  getLeadPoolList(){
    this.csagentService.getLeadPoolList().subscribe(
        res=> {
          //this.lead_sources = res['lead_sources'];
          //this.lead_campaigns = res['lead_campaigns'];
          for(var i=0;i<res['lead_sources'].length;i++){
            var obj = {
              "id":res['lead_sources'][i].id,"itemName":res['lead_sources'][i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
            }

            this.dropdownList3.push(obj);
          }
          for(var i=0;i<res['lead_types'].length;i++){
            if(res['lead_types'][i].name=='customer'){
              this.customer_typeid = res['lead_types'][i].id
            }
            if(res['lead_types'][i].name=='broker'){
              this.broker_typeid = res['lead_types'][i].id
            }
            if(res['lead_types'][i].name=='manufacturer'){
              this.manufacturer_typeid = res['lead_types'][i].id
            }
            if(res['lead_types'][i].name=='designer'){
              this.designer_typeid = res['lead_types'][i].id
            }
            var obj = {
              "id":res['lead_types'][i].id,"itemName":res['lead_types'][i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
            }

            this.dropdownList5.push(obj);
          }
          for(var i=0;i<res['lead_campaigns'].length;i++){
            var obj = {
              "id":res['lead_campaigns'][i].id,"itemName":res['lead_campaigns'][i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
            }
            this.dropdownList4.push(obj);
          }
        },
        err => {
          
        }
      );
  }
  deleteProjectWithId(id:Number){
    this.loaderService.display(true);
     this.observableProjects = this.projectService.deleteProject(id);
      this.observableProjects.subscribe(
        result => {
          this.successalert = true;
          this.successMessage = "Project Deleted Successfully";
          setTimeout(function() {
                  this.successalert = false;
            }.bind(this), 5000);
          this.getProjectListFromService();
          this.loaderService.display(false);
        },
        error => {
          this.erroralert = true;
          this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
          setTimeout(function() {
                  this.erroralert = false;
            }.bind(this), 5000);
          this.loaderService.display(false);
        }
      );
  }

  private getProjectListFromService(){
    this.observableProjects = this.projectService.getProjectList();

    this.observableProjects.subscribe(
        projects => {
          this.projects = projects;
          Object.keys(projects).map((key)=>{ this.projects= projects[key];});
        },
        error =>  {
          this.errorMessage = <any>error;
        }
    );
  }

  confirmAndDelete(id:Number) {
    if (confirm("Are You Sure") == true) {
      this.deleteProjectWithId(id);
    }
  }

  getLeadCount(){
    this.loaderService.display(true);
    this.leadService.getLeadHeadCount(this.lead_types,this.lead_sources,this.lead_campaigns,this.from_date,this.to_date).subscribe(
      res => {
        this.countres=res;
        
      },
      err => {
        
      }
    );
  }
  getLeadCountByStatus() {
    this.loaderService.display(true); 
    this.leadService.getLeadList("")
        .subscribe(
          res => {
            this.totalLeadCount=res['leads'].length;
            for(var index=0;index<res['lead_type_id_array'].length;index++){
               if(res['lead_type_id_array'][index].name=="manufacturer"){
                 this.manufacturer_typeid = res['lead_type_id_array'][index].id;
               } else if(res['lead_type_id_array'][index].name=="customer"){
                 this.customer_typeid = res['lead_type_id_array'][index].id;
               } else if(res['lead_type_id_array'][index].name=="broker"){
                 this.broker_typeid = res['lead_type_id_array'][index].id;
               } else if(res['lead_type_id_array'][index].name=="designer"){
                 this.designer_typeid = res['lead_type_id_array'][index].id;
               }
            }
            res=res['leads'];
            // Object.keys(res).map((key)=>{ res= res[key];});
            for(var index = 0; index < res.length; index++)
            {
              this.increaseCountByStatus(res[index]['lead_status']);
              this.increaseCountByStatusAndRole(res[index]['lead_type'],res[index]['lead_status']);
            };
            
            this.loaderService.display(false); 
          }, 
          err => {
            
              this.loaderService.display(false); 
          }
        );
  }

  getEscalatedLeadCountByStatus() {
    this.loaderService.display(true); 
    this.leadService.escalatedleads().
      subscribe(
          res => {
            Object.keys(res).map((key)=>{ res= res[key];});
            this.escalatedLeadCount = res.length;
              this.loaderService.display(false); 
          }, 
          err => {
            
              this.loaderService.display(false); 
          }
      );
  }

  increaseCountByStatus(status) {
    switch (status) {
      case 'claimed':
        this.claimedLeadCount++;
        break;
      case 'not_claimed':
        this.notClaimedLeadCount++;
        break;
      case 'not_attempted':  
        this.notAttemptedLeadCount++;
        break;
      case 'qualified':  
        this.qualifiedLeadCount++;
        break;
      case 'follow_up': 
        this.followupLeadCount++;
        break;
      case 'not_contactable':
        this.notContactableLeadCount++;
        break;
      case 'lost_after_5_tries' : 
        this.lostAfterTriesLeadCount++;
        break;
      case 'lost' :
        this.lostLeadCount++;
        break;
      case 'dropped':
        this.droppedLeadCount++;
        break;
      default: 
    }
  }

  increaseCountByStatusAndRole(role,status) {
    if(role == 'customer') {
      this.customerLeadCount++;
      if(status == 'qualified')
        this.convertedCustomerLeadCount++;
    }
    if(role == 'designer') {
      this.designerLeadCount++;
      if(status == 'qualified')
        this.convertedDesignerLeadCount++;
    }
    if(role == 'broker') {
      this.brokerLeadCount++;
      if(status == 'qualified')
        this.convertedBrokerLeadCount++;
    }
    if(role == 'manufacturer') {
      this.manufacturerLeadCount++;
      if(status == 'qualified')
        this.convertedManufacturerLeadCount++;
    }
  }


    dropdownList3=[];
    dropdownList4=[];
    dropdownList5=[];
    selectedItems3 = [];
    selectedItems4=[];
    selectedItems5=[];
    
    dropdownSettings4 ={
      singleSelection: false, 
      text:"Campaign",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class-dropdown"
    }
    dropdownSettings3 ={
      singleSelection: false, 
      text:"Lead Source ",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class-dropdown"
    }
    dropdownSettings5 ={
      singleSelection: false, 
      text:"Lead Type",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class-dropdown"
    }
    
    source=[];
    lead_statusArr=[];
    lead_type_idArr=[];
    //lead_source_idArr=[];
    //lead_campaign_idArr=[];
    filteredLeads=[];
    from_date;
    to_date;
    column_name;
    filterData(){
      this.loaderService.display(true);
       this.lead_sources.length = 0;
        this.lead_campaigns.length=0;
        this.lead_types.length=0;
      for(var k=0;k<this.selectedItems3.length;k++){
        this.lead_sources.push(this.selectedItems3[k].id);
      }
      for(var k=0;k<this.selectedItems4.length;k++){
        this.lead_campaigns.push(this.selectedItems4[k].id);
      }
      for(var k=0;k<this.selectedItems5.length;k++){
        this.lead_types.push(this.selectedItems5[k].id);
      }
      this.leadService.getLeadHeadCount(this.lead_types,this.lead_sources,this.lead_campaigns,this.from_date,this.to_date).subscribe(
      res =>{
        this.countres =res;
        
        //this.filteredLeads = res.leads;
        this.loaderService.display(false);

      },
      err=> {
        
        this.loaderService.display(false);

      }
    );
    }

    onItemSelect(item:any,textVal,index){
      (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='LeadSource' && index==0){
          for(var k=0;k<this.selectedItems3.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
          }
        } else if(textVal=='Campaign' && index==1){
          for(var k=0;k<this.selectedItems4.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
          }
        }
    }
    OnItemDeSelect(item:any,textVal,index){
      (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='LeadSource' && index==0){
          for(var k=0;k<this.selectedItems3.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
          }
        } else if(textVal=='Campaign' && index==1){
          for(var k=0;k<this.selectedItems4.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
          }
        }
    }
    onSelectAll(items: any,textVal,index){
        
        // document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='LeadSource'){
          
        } else if(textVal=='Campaign'){
          
        }
    }
    onDeSelectAll(items: any,textVal,index){
        
        //document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='LeadSource'){
          
        } else if(textVal=='Campaign'){
          
        }
    }
    fromDate(){
      $(".fromDateSpan").hide();
      $(".fromDate").show();
    }
    toDate(){
      $(".toDateSpan").hide();
      $(".toDate").show();
    }

  downloadExcelBoq(){
    
    this.leadService.exportBoq().subscribe(
      res=>{
        
        
        this.successalert = true;
        this.successMessage = 'The BOQ report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        

      });

  } 
  downloadExcelBoqLineItems(){
    this.loaderService.display(true);
    this.leadService.downloadExcelBoqLineItems().subscribe(
      res=>{
        
        
         this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'The BOQ Line Items report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        
        this.loaderService.display(false);

      });

  }

  downloadExcelReport(){
    this.leadService.exportReportsEvent().subscribe(
      res =>{
      
      this.successalert = true;
        this.successMessage = 'The Event report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);

     
      },
      err => {
        
        
      }
    );

  } 
   downloadCallReport(){
    
    this.leadService.exportReportCall().subscribe(
      res=>{
        
        
        this.successalert = true;
        this.successMessage = 'The Call report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        

      });

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

  downloadPaymentReport(){
    this.leadService.exportPaymentEvent().subscribe(
      res =>{
      
      this.successalert = true;
        this.successMessage = 'The Payment report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);

     
      },
      err => {
        
        
      }
    );

  }

  inviteChampionFormSubmit(data){
    this.loaderService.display(true);
    if(data.champion_level === "3"){
      data.parent_id = +$('#level2Dropdown').val();
    }
    this.leadService.inviteChampion(data).subscribe(
      res=>{
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
         this.inviteChampionForm.reset();
        // this.champion_user = "";
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
        this.showChildDropdown = false;
        this.child_champion_user = [];
      },
      err =>{
        if(err.status == '403' || err.status == '422'){
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 10000);
          this.inviteChampionForm.reset();
        }else {
          this.erroralert = true;
          this.errorMessage = err.message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 10000);
        }
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
      }
    );
  }

  getChampionList(){
        this.showChildDropdown = false;
        this.child_champion_user = [];
        this.champion_user = [];
    this.loaderService.display(true);
    this.leadService.getChampionList().subscribe(
      res=>{
        this.champion_types = res.allowed_champion_levels;
        this.champion_list_first_level = res["1"];
        this.champion_list_second_level = res["2"];
        this.champion_list_third_level = res["2"];
        this.inviteChampionForm.controls['champion_level'].patchValue("");
        this.inviteChampionForm.controls['parent_id'].patchValue("");
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  getChampionUserListByLevel(){
    this.leadService.getChampionListByChampionLevel(1).subscribe(
      res=>{
        this.champion_user = res.champions;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
    
  }

  getChildChampionDetailsByLevel(){
    this.leadService.getChildChampionListByChampionLevel(+this.inviteChampionForm.controls['parent_id'].value).subscribe(
      res=>{
        this.child_champion_user = res.champions;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  getChampionListByLevel(){
    switch(this.inviteChampionForm.controls['champion_level'].value)
    {
     case "1":
          this.champion_user = [];
          this.showChildDropdown = false;
            break;
     case "2":
     this.showChildDropdown = false;
          this.champion_user = this.champion_list_first_level;
           break;
     case "3":
          this.getChampionUserListByLevel();
          this.showChildDropdown = true;
          this.inviteChampionForm.controls['parent_id'].patchValue(+this.parent_id);
     break;
    }     
  }

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
      return false;
    }
  }

}

