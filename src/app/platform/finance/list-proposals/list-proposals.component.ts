import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import {FinanceService} from '../finance.service';
declare var $:any;

@Component({
  selector: 'app-list-proposals',
  templateUrl: './list-proposals.component.html',
  styleUrls: ['./list-proposals.component.css'],
  providers:[FinanceService]
})
export class ListProposalsComponent implements OnInit {

	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
	proposalList;
	project_id;
  projectName;

  constructor(
  	private loaderService : LoaderService,
  	private financeService:FinanceService,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
  	this.role =localStorage.getItem('user');
		this.route.params.subscribe(params => {
			this.project_id = params['id'];
		});
  	this.getProposalList()
  }

  getProposalList(){
  	this.loaderService.display(true);
  	this.financeService.getProposalList(this.project_id).subscribe(
  		res=>{
  			this.proposalList=res.proposals;
        this.projectName=res.project.name;
  			this.loaderService.display(false);
  		},
  		err=>{
  			
  			this.loaderService.display(false);
  		}
  	);
  }

}
