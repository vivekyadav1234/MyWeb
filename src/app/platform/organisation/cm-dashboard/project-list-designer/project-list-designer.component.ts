import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CommunitymanagerService } from '../communitymanager.service';
import { LoaderService } from '../../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-project-list-designer',
  templateUrl: './project-list-designer.component.html',
  styleUrls: ['./project-list-designer.component.css'],
  providers: [CommunitymanagerService]
})
export class ProjectListDesignerComponent implements OnInit {

	CMID;
	listDesignersProjects;
	designerId;
	errorMessage : string;
	erroralert = false;
	successalert = false;
	successMessage : string;
	errorMessagemodal : string;
	erroralertmodal = false;
	successalertmodal = false;
	successMessagemodal : string;
	designer_name:string;
  
	constructor(
		private loaderService : LoaderService,
  		private CmService : CommunitymanagerService,
  		private route: ActivatedRoute,
	) { 
		this.CMID = localStorage.getItem('userId');
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
	        this.designerId = +params['designerid'];
	    });
	    this.route.queryParams.subscribe(params=>{
	    	this.designer_name = params['designer_name'];
	    });
	    this.getDesignerProjectsList();
	}

	getDesignerProjectsList() {
    	this.loaderService.display(true);
		this.CmService.getUserListForDesigner(this.designerId).subscribe(
			res => {
				this.listDesignersProjects = res;
        		this.loaderService.display(false);
			},
			err => {
				
        		this.loaderService.display(false);
			}
		);
	}

	projectDetails;
	designDetails;
	getProjectDetails(projectID){
		this.loaderService.display(true);
		this.CmService.getProjectDetails(projectID).subscribe(
			res => {
				this.loaderService.display(false);
				this.projectDetails = res;
			},
			err => {
				
				this.loaderService.display(false);
				this.errorMessagemodal = JSON.parse(err['_body']).message;
				this.erroralertmodal = true;
				setTimeout(function(){
					this.erroralertmodal = false
				}.bind(this),10000)
			}
		);
	}

	getFloorplanDesigns(projectId,floorplanID){
		this.loaderService.display(true);
		this.CmService.getDesignsOfFloorplan(projectId,floorplanID).subscribe(
			res => {
				this.loaderService.display(false);
				this.designDetails = res;
			},
			err => {
				
				this.loaderService.display(false);
				this.errorMessagemodal = JSON.parse(err['_body']).message;
				this.erroralertmodal = true;
				setTimeout(function(){
					this.erroralertmodal = false
				}.bind(this),10000)
			}
		);
	}
	closeModal(){
		this.projectDetails = {};
		this.designDetails = {};
		this.projectIdForModal = undefined;
	}

	projectIdForModal;
	setModalData(projectID){
		this.projectIdForModal = projectID;
	}

}
