import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../communitymanager.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-list-designer',
  templateUrl: './list-designer.component.html',
  styleUrls: ['./list-designer.component.css'],
  providers: [CommunitymanagerService]
})
export class ListDesignerComponent implements OnInit {

	CMID;
	listDesigners : any;

  constructor(
  	private loaderService : LoaderService,
  	private CmService : CommunitymanagerService
  	) { 
  	this.CMID = localStorage.getItem('userId');
  }

  ngOnInit() {
  	this.getDesignerListCm();
	  this.loaderService.display(true);
  }

  getDesignerListCm() {
    this.loaderService.display(true);
		this.CmService.getDesignerCm(this.CMID).subscribe(
			res => {
				this.listDesigners = res;
        this.loaderService.display(false);
			},
			err => {
				
        this.loaderService.display(false);
			}
		);
	}

}
