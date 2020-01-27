import { Component, OnInit, Input } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-shared-top-menu',
  templateUrl: './shared-top-menu.component.html',
  styleUrls: ['./shared-top-menu.component.css'],
  providers: [LeadService]
})
export class SharedTopMenuComponent implements OnInit {

  project_id;
  role;

	@Input() lead_id:any;
	@Input() lead_status:any;
	@Input() overview_tab:any;
	@Input() activity_log_tab:any;
	@Input() basic_info_tab:any;
	@Input() detailed_info_tab:any;
	@Input() boq_tab:any;
	@Input() ppt_tab:any;
	@Input() files_tab:any;
	@Input() calender_tab:any;
	@Input() proposal_tab:any;
	@Input() custom_tab:any;
  @Input() payment_tab:any;
  @Input() payment_approval_tab:any;
	@Input() lead_details:any = {};
  @Input() handover_for_production:any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private route:ActivatedRoute,
    ) { }

  ngOnInit() {
    // this.project_id = this.lead_details.project_details.id;
    this.fetchBasicDetails();
    this.role =localStorage.getItem('user');


  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {

        this.lead_details = res['lead'];
        this.lead_status = this.lead_details.lead_status;
        this.project_id = res['lead'].project_details.id;
   
      },
      err => {
        
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
