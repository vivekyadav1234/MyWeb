import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import {BusinessHeadService} from '../business-head.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../lead/lead.service';
declare var $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[BusinessHeadService]
})
export class DashboardComponent implements OnInit {

	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;

  constructor(
  	private loaderService : LoaderService,
  	private businessHeadService:BusinessHeadService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private leadService : LeadService,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
  	this.loaderService.display(false);
    this.getProjectList(1);
  }

  headers_res;
  per_page;
  total_page;
  current_page;
  project_list;
  getProjectList(page){
    this.loaderService.display(true);
    this.businessHeadService.getProjectList(page).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.project_list = res['projects'];
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

  nextPage(page){
    this.loaderService.display(true);
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.getProjectList(page);
    });
  }

  // onChangeOfLeadType(val){
  //   for(var i=0;i<this.lead_types.length;i++){
  //     if(val==this.lead_types[i].id){
  //       this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
  //     }
  //   }
  // }
  
  // getFiltersData(){
  //   this.leadService.getFiltersData().subscribe(
  //     res =>{
  //       res = res.json();
  //       // 
  //       this.lead_campaigns = res.lead_campaign_id_array
  //       this.lead_sources= res.lead_source_id_array;
  //       //this.lead_status=res.lead_status_array
  //       this.lead_types=	res.lead_type_id_array
  //       this.csagentsArr = res.cs_agent_list;
  
  //       for(var i=0;i<res.lead_type_id_array.length;i++){
  //         var obj = {
  //           "id":res.lead_type_id_array[i].id,"itemName":res.lead_type_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
  //         }
  //         this.dropdownList.push(obj);
  //       }
  //       for(var i=0;i<res.lead_status_array.length;i++){
  //         var obj = {
  //           "id":<any>i,"itemName":res.lead_status_array[i].replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
  //         }
  //         this.dropdownList2.push(obj);
  
  //       }
  //       for(var i=0;i<res.lead_source_id_array.length;i++){
  //         var obj = {
  //           "id":res.lead_source_id_array[i].id,"itemName":res.lead_source_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
  //         }
  //         this.dropdownList3.push(obj);
  //       }
  //       for(var i=0;i<res.lead_campaign_id_array.length;i++){
  //         var obj = {
  //           "id":res.lead_campaign_id_array[i].id,"itemName":res.lead_campaign_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
  //         }
  //         this.dropdownList4.push(obj);
  //       }
  //       for(var i=0;i<res.cs_agent_list.length;i++){
  //         var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
  //         var obj = {
  //           "id":res.cs_agent_list[i].id,"itemName":<any>str
  //         }
  //         this.dropdownList5.push(obj);
  //       }
  //     }
  //   );
  // }
  
  // addLeadFormSubmit(data) {
  //   this.loaderService.display(true);
  //   data['created_by'] = localStorage.getItem('userId');
  //   data['lead_status']='not_attempted';
  //   if(this.addLeadForm.controls['lead_type_name'].value=='designer'){
  //     data['lead_cv']=this.basefile;
  //   }
  //   var obj = {
  //     lead:data
  //   }
  //   this.leadService.addLead(obj)
  //     .subscribe(
  //       res => {
  //       this.addLeadForm.reset();
  //       $('#addNewLeadModal').modal('hide');
  //       this.addLeadForm.controls['lead_type_id'].setValue("");
  //       this.addLeadForm.controls['lead_source_id'].setValue("");
  //       this.addLeadForm.controls['lead_campaign_id'].setValue("");
  //       this.basefile = undefined;
  //       // this.getFiletredLeads();
  //       this.loaderService.display(false);
  //       this.successalert = true;
  //       this.successMessage = "Lead created successfully !!";
  //       setTimeout(function() {
  //          this.successalert = false;
  //       }.bind(this), 2000);
  //       },
  //       err => {
  //       this.loaderService.display(false);
  //       this.erroralert = true;
  //       this.errorMessage = JSON.parse(err['_body']).message;
  //       setTimeout(function() {
  //          this.erroralert = false;
  //       }.bind(this), 2000);
  //       }
  //     );
  // }

}
