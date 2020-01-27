import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { LoaderService } from '../../../services/loader.service';
import { OrderManagerService } from '../order-manager.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ OrderManagerService ]
})
export class DashboardComponent implements OnInit {
  
  quotations_list: any = [];
  is_champion;

  constructor(private router: Router,
	          private loaderService : LoaderService,
	          private OrderManagerService:OrderManagerService,
	        ) { }

  ngOnInit() {
  	this.loaderService.display(false);
  	this.getQuotationsListForOrderManager();
    this.is_champion = localStorage.getItem('isChampion');
  }

  getQuotationsListForOrderManager(){
    this.loaderService.display(true);
  	this.OrderManagerService.getQuotationsListForOrderManager().subscribe(
  		res=>{
        	this.loaderService.display(false);
  			this.quotations_list = res.leads;
  		},
  		err=>{
         	this.loaderService.display(false);
  		}
  	);
  }

}
