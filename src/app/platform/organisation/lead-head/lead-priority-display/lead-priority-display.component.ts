import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import {LeadService} from '../../../lead/lead.service';
@Component({
  selector: 'app-lead-priority-display',
  templateUrl: './lead-priority-display.component.html',
  styleUrls: ['./lead-priority-display.component.css'],
  providers:[LeadService]
})
export class LeadPriorityDisplayComponent implements OnInit {

  constructor(
  	private leadService:LeadService,
		private loaderService:LoaderService
  ) { }

  ngOnInit() {
  	this.getLeadPriorityQueueData();
  }

  lead_priority_que_arr;
  getLeadPriorityQueueData(){
  	this.loaderService.display(true);
  	this.leadService.getLeadPriorityQueueData().subscribe(
  		res=>{
  			this.loaderService.display(false);
  			this.lead_priority_que_arr = res.lead_queues;
        // 
  		},
  		err=>{
  			this.loaderService.display(false);
  		}
  	);
  }
}
