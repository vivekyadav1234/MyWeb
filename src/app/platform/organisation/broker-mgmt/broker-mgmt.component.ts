import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrokerService } from '../broker-dashboard/broker.service';
import { LeadService } from '../../lead/lead.service';
import {CsagentService} from '../csagentdashboard/csagent.service';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-broker-mgmt',
  templateUrl: './broker-mgmt.component.html',
  styleUrls: ['./broker-mgmt.component.css'],
  providers : [BrokerService,LeadService,CsagentService]
})
export class BrokerMgmtComponent implements OnInit {

  role : string;
  leads: any[];
  filteredleads:any[];
  leadDetails:any;
  brokerDetails:any;
  errorMessage : string;
  errorMessageModal : string;
  erroralert = false;
  erroralertmodal = false;
  successalert = false;
  successalertmodal = false;
  successMessageModal:string;
  successMessage : string;
  notAttemptedLeadCount = 0;
  lostLeadCount = 0;
  qualifiedLeadCount = 0;
  leadStatusUpdateForm : FormGroup;
  approveBrokerKYC : FormGroup;
  constructor(
    private router: Router,
      private route:ActivatedRoute,
      private brokerService:BrokerService,
      private loaderService:LoaderService,
      private formBuilder: FormBuilder,
      private leadService:LeadService,
      private csagentService:CsagentService
  ) { 
    this.role = localStorage.getItem('user');
  }

  ngOnInit() {
    // this.getLeadListFromService();
    this.leadStatusUpdateForm = this.formBuilder.group({
        lead_status : new FormControl("",Validators.required),
        lost_remark : new FormControl("")
      });
    this.getLeadPoolList();
    this.getFiltersData();
      // this.approveBrokerKYC = this.formBuilder.group({
      //   kyc_approved : new FormControl()
      // });
  }
  getLeadPoolList(){
      this.loaderService.display(true);
      this.csagentService.getLeadPoolList().subscribe(
        res=>{
          // this.lead_campaigns = res.lead_campaigns;
          // this.lead_sources =res.lead_sources;
          // this.lead_types=res.lead_types;
          for(var i=0;i<res.lead_types.length;i++){
            if(res.lead_types[i].name=='broker'){
              this.lead_type_idArr.push(res.lead_types[i].id);
              
              this.getLeadListFromService();
            }
          }
        
        },
        err => {
          
        }
      );
  }

  getLeadListFromService(){
    this.getFiletredLeads(1);
  }

  viewLeadDetails(id,user_reference) {
    this.loaderService.display(true);
    this.brokerService.viewLeadDetails(id)
    .subscribe(
      lead => {
        this.leadDetails = lead;
        Object.keys(lead).map((key)=>{ this.leadDetails= lead[key];});
        this.loaderService.display(false);
        if(this.leadDetails.lead_status == 'qualified' && user_reference!=null){
          this.viewQualifiedBrokerDetails(user_reference.id);
        }
      },
      error => {
        this.erroralert = true;
        this.loaderService.display(false);
        this.errorMessage=JSON.parse(error['_body']).message;
      }
    );
  }

  setLeadStatus(value) {
    if(value == 'lost') {
      document.getElementById('lostremark').setAttribute('style','display: block');
    } else {
      document.getElementById('lostremark').setAttribute('style','display: none');
    }
  }
   
  updateStatus(data,id,user_reference) {
    
    var obj = {
      'lead':data
    }
    this.loaderService.display(true);
    
    this.leadService.updateLeadStatus(obj,id).subscribe(
        res => {
           this.successalert = true;
           this.leadStatusUpdateForm.controls['lead_status'].setValue("");
            this.successMessage = "Status updated successfully !!";
            document.getElementById('lostremark').setAttribute('style','display: none');
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 3000);
            this.brokerDetails = undefined;
            this.getLeadListFromService();
            // this.viewLeadDetails(id,user_reference);
            $('#leadDetailsModal').modal('hide');
            this.loaderService.display(false);
        },
        err => {
          this.erroralert = true;
          document.getElementById('lostremark').setAttribute('style','display: none');
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
                this.erroralert = false;
            }.bind(this), 3000);
            // this.viewLeadDetails(id,user_reference);
            this.loaderService.display(false);
        }
    )
  }

  closeModal(){
    this.getLeadListFromService();
  }

  viewQualifiedBrokerDetails(id) {
    this.loaderService.display(true);
    this.brokerService.viewBrokerDetails(id)
      .subscribe(
          res => {
            this.brokerDetails = res;
            Object.keys(res).map((key)=>{ this.brokerDetails= res[key];});
            this.loaderService.display(false);
          },
          error => {
            this.erroralert = true;
            this.loaderService.display(false);
            this.errorMessage=JSON.parse(error['_body']).message;
            setTimeout(function() {
               this.erroralert = false;
            }.bind(this), 3000);
          }
     );
  }

    approveBrokerKYCData(id,status) {
      this.brokerService.approveBrokerKYC(id,status)
        .subscribe(
            res => {
              this.brokerDetails = res;
              Object.keys(res).map((key)=>{ this.brokerDetails= res[key];});
              this.successMessageModal = 'KYC status update successfully!';
              this.successalertmodal = true;
               setTimeout(function() {
           this.successalertmodal = false;
         }.bind(this), 3000);
            },
            error => {
              this.erroralertmodal = true;
              this.errorMessageModal=JSON.parse(error['_body']).message;
               setTimeout(function() {
           this.erroralertmodal = false;
         }.bind(this), 3000);
            }
      );
    }
    
    direction: number;
    isDesc: boolean = true;
    column: string;
    // Change sort function to this: 
    sort(property){
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? 1 : -1; 
    }

  source=[];
  lead_statusArr=[];
  lead_type_idArr=[];
  lead_source_idArr=[];
  lead_campaign_idArr=[];
  csagents_idArr=[];
  filteredLeads=[];
  from_date;
  to_date;
  column_name='created_at';
  csagentsArr;
  lead_campaigns;
  lead_sources;
  lead_types;
  search;
  headers_res;
  per_page;
  total_page;
  current_page;
  getFiletredLeads(pageno?){
    this.loaderService.display(true);
    this.leadService.getFileterLeads(this.source,this.lead_statusArr,this.lead_type_idArr
      ,this.lead_source_idArr,this.lead_campaign_idArr,
      this.column_name,this.from_date,this.to_date,this.csagents_idArr,this.search,pageno).subscribe(
      res =>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.filteredLeads = res.leads;
        this.leads = res.leads;
        //this.queryParamSelectedArr();

        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  getFiltersData(){
    this.leadService.getFiltersData().subscribe(
      res =>{
        res = res.json();
        
        this.lead_campaigns = res.lead_campaign_id_array
        this.lead_sources= res.lead_source_id_array;
        //this.lead_status=res.lead_status_array
        this.lead_types=  res.lead_type_id_array
        this.csagentsArr = res.cs_agent_list;

        for(var i=0;i<res.lead_type_id_array.length;i++){
          var obj = {
            "id":res.lead_type_id_array[i].id,"itemName":res.lead_type_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
          }
          this.dropdownList.push(obj);
        }
        for(var i=0;i<res.lead_status_array.length;i++){
          var obj = {
            "id":<any>i,"itemName":res.lead_status_array[i].replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
          }
          this.dropdownList2.push(obj);
          

        }
        for(var i=0;i<res.lead_source_id_array.length;i++){
          var obj = {
            "id":res.lead_source_id_array[i].id,"itemName":res.lead_source_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
          }
          this.dropdownList3.push(obj);
        }
        for(var i=0;i<res.lead_campaign_id_array.length;i++){
          var obj = {
            "id":res.lead_campaign_id_array[i].id,"itemName":res.lead_campaign_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
          }
          this.dropdownList4.push(obj);
        }
        for(var i=0;i<res.cs_agent_list.length;i++){
          var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
          var obj = {
            "id":res.cs_agent_list[i].id,"itemName":<any>str
          }
          this.dropdownList5.push(obj);
        }
      }
    );
  }

  dropdownList = [];
    dropdownList2=[];
    dropdownList3=[];
    dropdownList4=[];
    dropdownList5=[];
    dropdownList6=[{"id":"created_at","itemName":"Acquisition Date"},{"id":"status_updated_at","itemName":"Status Updated Date"}];

    selectedItems = [];
    selectedItems2=[];
    selectedItems3 = [];
    selectedItems4=[];
    selectedItems5=[];
  selectedItems6=[{"id":"created_at","itemName":"Acquisition Date"}];    

    dropdownSettings6 ={
      singleSelection: true, 
      // text:" Acquisition Date",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class-dropdown"
    }
    dropdownSettings = { 
      singleSelection: false, 
      text: "Broker",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class-dropdown",
      disabled:true
    }; 
    dropdownSettings5 ={
      singleSelection: false, 
      text:"CS Agent",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class-dropdown"
    }
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
    dropdownSettings2 ={
      singleSelection: false, 
      text:  "Status" ,
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class-dropdown",
      
    }

    onItemSelect(item:any,textVal,index){
      (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='Status' && index==1){
          for(var k=0;k<this.selectedItems2.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
          }
        } else if(textVal=='LeadType' && index==0){
          for(var k=0;k<this.selectedItems.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems[k].itemName+',';
          }
          
        } else if(textVal=='LeadSource' && index==2){
          for(var k=0;k<this.selectedItems3.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
          }
        } else if(textVal=='Campaign' && index==3){
          
          for(var k=0;k<this.selectedItems4.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
          }
        }else if(textVal=='Agent' && index==4){
          
          for(var k=0;k<this.selectedItems5.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems5[k].itemName+',';
          }
        } else if(textVal=='DateColumn' && index==5){
          for(var k=0;k<this.selectedItems6.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems6[k].itemName+',';
          }
        }
    }
    OnItemDeSelect(item:any,textVal,index){
      (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML='';
        if(textVal=='Status' && index==1){
          for(var k=0;k<this.selectedItems2.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
          }
        } else if(textVal=='LeadType' && index==0){
          for(var k=0;k<this.selectedItems.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems[k].itemName+',';
          }
          
        } else if(textVal=='LeadSource' && index==2){
          for(var k=0;k<this.selectedItems3.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems3[k].itemName+',';
          }
        } else if(textVal=='Campaign' && index==3){
          for(var k=0;k<this.selectedItems4.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems4[k].itemName+',';
          }
        }else if(textVal=='Agent' && index==4){
          
          for(var k=0;k<this.selectedItems5.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems5[k].itemName+',';
          }
        }  else if(textVal=='DateColumn' && index==5){
          for(var k=0;k<this.selectedItems6.length;k++){
            (document.getElementsByClassName('c-btn')[index]).getElementsByTagName('span')[0].innerHTML  += this.selectedItems6[k].itemName+',';
          }
        }
    }
    onSelectAll(items: any,textVal,index){
        
        // document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='Status'){
          
        } else if(textVal=='LeadType'){
          
        } else if(textVal=='LeadSource'){
          
        } else if(textVal=='Campaign'){
          
        } else if(textVal=='Agent'){
          
        } else if(textVal=='DateColumn'){
          
        }
    }
    onDeSelectAll(items: any,textVal,index){
        
        //document.getElementsByClassName('c-btn')[index].innerHTML += item.itemName+',';
        if(textVal=='Status'){
          
        } else if(textVal=='LeadType'){
          
        } else if(textVal=='LeadSource'){
          
        } else if(textVal=='Campaign'){
          
        } else if(textVal=='Agent'){
          
        } else if(textVal=='DateColumn'){
          
        }
    }

    filterData(){
      this.csagents_idArr.length = 0;
      // this.lead_type_idArr.length=0;
      this.lead_source_idArr.length=0;
      this.lead_statusArr.length=0;
      this.lead_campaign_idArr.length=0;
      this.loaderService.display(true);
      for(var k=0;k<this.selectedItems6.length;k++){
        this.column_name =this.selectedItems6[k].id;
      }
      // for(var k=0;k<this.selectedItems.length;k++){
      //   this.lead_type_idArr.push(this.selectedItems[k].id);
      // }
      for(var k=0;k<this.selectedItems2.length;k++){
        this.lead_statusArr.push(this.selectedItems2[k].itemName.toLowerCase().replace(/ /g,"_"));
      }
      for(var k=0;k<this.selectedItems3.length;k++){
        this.lead_source_idArr.push(this.selectedItems3[k].id);
      } 
      for(var k=0;k<this.selectedItems4.length;k++){
        this.lead_campaign_idArr.push(this.selectedItems4[k].id);
      }
      for(var k=0;k<this.selectedItems5.length;k++){
        this.csagents_idArr.push(this.selectedItems5[k].id);
      }
      this.leadService.getFileterLeads(this.source,this.lead_statusArr,this.lead_type_idArr
      ,this.lead_source_idArr,this.lead_campaign_idArr,
      this.column_name,this.from_date,this.to_date,this.csagents_idArr,this.search,this.current_page).subscribe(
      res =>{
        
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.filteredLeads = res.leads;
        this.loaderService.display(false);
      },
      err=> {
        
        this.loaderService.display(false);
      }
    );
  }
    fromDate(){
      $(".fromDateSpan").hide();
      $(".fromDate").show();
    }
    toDate(){
      $(".toDateSpan").hide();
      $(".toDate").show();
    }
}