import { Component, OnInit,ViewChild } from '@angular/core';
import { ProfileService } from '../../../profile/profile/profile.service';
import { CadService } from '../../../cad/cad.service';
import { LoaderService } from '../../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { CategoryService } from '../category.service';
import {InitialBoqsComponent} from '../initial-boqs/initial-boqs.component';
import { FinalBoqApprovalsComponent } from '../final-boq-approvals/final-boq-approvals.component';
import { CadApprovalsComponent } from '../cad-approvals/cad-approvals.component';
import { CustomElementApprovalsComponent } from '../custom-element-approvals/custom-element-approvals.component';
import { PreProductionComponent } from '../pre-production/pre-production.component';
import { HandoverForProductionComponent } from '../handover-for-production/handover-for-production.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [ProfileService, CadService, CategoryService]
})
export class TasksComponent implements OnInit {
  profile;
  boq_list;
  selectedTab='handover_for_production';
  activeTab = "Handover/Feasibility";
  project_list;
  project_count_list;
  finalBOQCount;
  headers_res;
  per_page;
  role;
  total_page;
  current_page;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  tab_search: string;
  @ViewChild(InitialBoqsComponent ) initial_design_child;
  @ViewChild(FinalBoqApprovalsComponent ) final_design_child;
  @ViewChild(CadApprovalsComponent ) cad_approvals_child;
  @ViewChild(CustomElementApprovalsComponent ) custom_element_child;
  @ViewChild(PreProductionComponent ) pre_production_child;
  @ViewChild(HandoverForProductionComponent ) handover_production_child;
  constructor(public profileService:ProfileService,
    public cadService:CadService,
    public loaderService : LoaderService,
    public categoryService : CategoryService,
    private router: Router) { }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    if(localStorage.getItem('userId')!=null){
      this.viewProfile(localStorage.getItem('userId'));
    }
      this.getProjectCount();
      this.getProjectList(1);
  }

  //For listing the profile details
  viewProfile(id){
    this.loaderService.display(true);
     this.profileService.viewProfile(id).subscribe(
        profile => {
          this.profile = profile;
          Object.keys(profile).map((key)=>{ this.profile= profile[key];});
        },
        error => {
        }
      );
  }

  activateTab(tab){
    this.selectedTab = tab;
    switch(tab){
      case "all_boqs":
        this.activeTab = "All";
        break;
      case "initial_boqs":
        this.activeTab = "Initial BOQs";
        this.tab_search="initial_design";
        break;
      case "final_boq_approvals":
        this.activeTab = "Final BOQ Approvals";
        this.tab_search="final_design";
        break;
      case "custom_element_approvals":
        this.activeTab = "Custom ELement Approvals";
        this.tab_search="custom_element";
        break;
      case "pre_production":
        this.activeTab = "Pre Production";
        this.tab_search="pre_production";
        break;
      case "cad_approvals":
        this.activeTab = "CAD Approvals";
        this.tab_search="cad_approvals";
        break;
      case "handover_for_production":
        this.activeTab = "Handover/Feasibility";
        this.tab_search="handover_for_production";
        break;
    }

  }


  showBOQList(index){
    this.boq_list = this.project_list[index].boq_list;
  }

  getProjectList(page?){
    this.loaderService.display(true);
    this.categoryService.getProjectListForTasksTab("all",page).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        
        this.project_list = res.projects;
        // this.project_list = [
        //   {"id":42,"name":"unwavering-oasis-9634","status":"wip","sub_status":null,"details":"Update project details here.","assigned_to":["ranjeet@mailinator.com"],"assigned":true,"created_at":"19-04-2018","updated_at":"09-05-2018","user":{"id":70,"name":"Name","contact":"9099990000","email":"name@mailinator.com"},"designer":{"id":12,"name":"ranjeet","email":"ranjeet@mailinator.com"},"community_manager":{"id":5,"name":"Sunny Sharma","email":"sunny@mailinator.com"},"has_pending_site_measurment_request":false,"floorplan_present":false,"boq_list":[{"id":1,"name":"BOQ_001","lineItems":[{"id":1,"name":"Cabinet 1"},{"id":2,"name":"Cabinet 2"},{"id":3,"name":"Cabinet 3"}]},
        //   {"id":2,"name":"BOQ_002","lineItems":[{"id":1,"name":"Cabinet 1"},{"id":2,"name":"Cabinet 2"},{"id":3,"name":"Cabinet 3"}]},
        //   {"id":3,"name":"BOQ_003","lineItems":[{"id":11,"name":"Cabinet 2"},{"id":2,"name":"Cabinet 2"},{"id":3,"name":"Cabinet 3"}]}], "deadline":4,"file_status":"View BOQ","task":"Final BOQ Approval"}];
        // 
         this.loaderService.display(false);
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }

  getProjectCount() {
    this.loaderService.display(true);
    this.categoryService.getQuotationCountForCategory().subscribe(
      res=>{   
        this.project_count_list = res;
        this.loaderService.display(false);

        
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }
  searchparam="";
  searchCategoryProjects(searchparam){
    switch(this.selectedTab){
      case "initial_boqs":
      this.initial_design_child.searchCategoryProjects(searchparam);
        break;
      case "final_boq_approvals":
      this.final_design_child.searchCategoryProjects(searchparam);
        break;
      case "custom_element_approvals":
      this.custom_element_child.searchCategoryProjects(searchparam);
        break;
      case "pre_production":
      this.pre_production_child.searchCategoryProjects(searchparam);
        break;
      case "cad_approvals":
      this.cad_approvals_child.searchCategoryProjects(searchparam);
        break;
      case "handover_for_production":
      this.handover_production_child.searchCategoryProjects(searchparam);
        break;
    }
    
  }
 //V:fetch category role split user list
  selected_space;
  Vusers;
  getUserCategorySplit(event){
    this.selected_space = event.target.value;
    this.loaderService.display(true);
    this.categoryService.getUserCategorySplit(this.selected_space).subscribe(
    res=>{
      this.Vusers=res.users   
      this.successalert = true;
      this.successMessage = "Type Status updated successfully";
      this.loaderService.display(false);
      setTimeout(function() {
      this.successalert = false;
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      
      
    });
  }   
}