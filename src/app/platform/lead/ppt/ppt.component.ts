import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { PresentationService } from '../../presentation/presentation.service';
import { DesignerService } from '../../designer/designer.service';
declare var $:any;

@Component({
  selector: 'app-ppt',
  templateUrl: './ppt.component.html',
  styleUrls: ['./ppt.component.css'],
  providers: [LeadService, LoaderService, PresentationService,DesignerService]
})
export class PptComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  presentationList : any[];
  initLoader:any = true;
  lead_status;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public presentationService : PresentationService,
    private route:ActivatedRoute,
    private designerService: DesignerService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.getPresentations();
      },
      err => {
        
      }
    );
  }

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }

  isFloorPlanUploaded():boolean {
    var floorplan_array = ["floorplan_uploaded","initial_proposal_submitted","initial_proposal_accepted","initial_proposal_rejected","final_proposal_submitted","final_proposal_accepted","final_proposal_rejected"]
    if(this.lead_details.project_details && this.lead_details.project_details.sub_status && floorplan_array.includes(this.lead_details.project_details.sub_status)){
      return true
    }
    else{
      return false
    }
  }

  fpCondition(){
    alert("Please upload floorplan and update requirement sheet");
  }

  getPresentations(){
    this.loaderService.display(true);
    this.presentationService.getPresentationList(this.project_id).subscribe(
      res => {
        Object.keys(res).map((key)=>{ this.presentationList= res[key];})
        this.loaderService.display(false);
        this.initLoader = false;
      },
      err => {
        
        this.loaderService.display(false);
        this.initLoader = false;
      }
    );
  }
  callResponse: any;
  callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLead(localStorage.getItem('userId'), contact).subscribe(
        res => {
           this.loaderService.display(false);
          if(res.inhouse_call.call_response.code == '403'){
            this.erroralert = true;
            this.errorMessage = JSON.parse(res.message.body).RestException.Message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 10000);
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse =  JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage = 'Calling from - '+this.callResponse.Call.From;
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 10000);
          }
        },
        err => {
          this.loaderService.display(false);
          
        }
     );
  }

}
