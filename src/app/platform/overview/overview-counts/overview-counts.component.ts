import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { environment } from 'environments/environment';
import {Location} from '@angular/common';
import {OverviewService} from '../overview.service';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';

@Component({
  selector: 'app-overview-counts',
  templateUrl: './overview-counts.component.html',
  styleUrls: ['./overview-counts.component.css'],
  providers:[OverviewService, LeadService]
})
export class OverviewCountsComponent implements OnInit {

  public lead_id:any;
  lead_details;
  public role:string;
  lead_status;
  initLoader:any = true;
  past_event_count;
  future_event_count;
  constructor(
    public activatedRoute: ActivatedRoute,
    public overviewService : OverviewService,
    private _location: Location,
    private route:ActivatedRoute,
    private loaderService :LoaderService,
    public leadService : LeadService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
        
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.getCounts();
    this.fetchBasicDetails();
  }

  project_id:any;
  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
      },
      err => {
        
      }
    );
  }

  getCounts(){
    //this.loaderService.display(true);
    this.overviewService.getOverviewCount(this.lead_id).subscribe(
      res => {
        this.lead_details = res.lead;
        this.past_event_count = res.lead.past_event_count
         this.future_event_count = res.lead.future_event_count;
        //this.loaderService.display(false);
        this.initLoader = false;
      },
      err => {
        
       // this.loaderService.display(false);
        this.initLoader = false;
      }
    );
  }

  eventlogs;
  eventcalllogs;
  getOverviewLog(event_time,event_type){
    this.loaderService.display(true);
    this.overviewService.getOverviewLog(this.lead_id,event_time,event_type).subscribe(
      res => {
        this.eventlogs = res['lead']['events_log'];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  getOverviewCallLog(event_time,event_type){
    this.loaderService.display(true);
    this.overviewService.getOverviewLog(this.lead_id,event_time,event_type).subscribe(
      res => {
        this.eventcalllogs = res['lead']['events_log'];
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  isProjectInWip():boolean {
    // this.project_id = this.lead_details.project_details.id;
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details && this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }
}
