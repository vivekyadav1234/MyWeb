import { Component, OnInit } from '@angular/core';
import { CmstatuslistService } from './cmstatuslist.service';
import { LoaderService } from 'app/services/loader.service';

@Component({
  selector: 'app-cmstatuslist',
  templateUrl: './cmstatuslist.component.html',
  styleUrls: ['./cmstatuslist.component.css'],
  providers: [CmstatuslistService]
})
export class CmstatuslistComponent implements OnInit {
   
  cmListSubscription: any;	
  cmList:any;
  direction: number;
  isDesc: boolean = true;
  column: string;
	successalert:boolean;
	changeLeadIntakeStatusSubscription:any;

  constructor(
		private loaderService : LoaderService,
		private csagentService:CmstatuslistService
	) { }

	ngOnInit() {
		this.getCMList(); //when the component is initialised the list of community manager is fetched
  	}
  
  
	sort(property){
		this.isDesc = !this.isDesc; //change the direction    
		this.column = property;
		this.direction = this.isDesc ? 1 : -1;
	}

	getCMList(){ // service call to get the list of community managers and assigning them to an array
		this.loaderService.display(true);
		this.cmListSubscription=this.csagentService.getCmList().subscribe(
			res => {
        		this.cmList = res;
				this.loaderService.display(false);
			},
			err => {
				
				this.loaderService.display(false);
			}
		);
  }

	public ngOnDestroy(): void {  //unsubscribing to all the subscriptions when the component is destroyed.
		if (this.cmListSubscription && !this.cmListSubscription.closed){
			this.cmListSubscription.unsubscribe();
		}
	}

	intakeStoppedHandler(userId){ // changes the lead Intake Status of the community manager based on the toggle switch.
    this.loaderService.display(true);
		this.changeLeadIntakeStatusSubscription=this.csagentService.changeLeadIntakeStatus(userId).subscribe(
			res => {
        this.loaderService.display(false);
        this.getCMList(); //after the switch has been clicked and the response has been acquired, We amke a call to get the latest value of the status.
			},
			err => {
				
				this.loaderService.display(false);
			}
		);
  }
}
