import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule , Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { LoaderService } from '../../../services/loader.service';
import { OrderManagerService } from '../order-manager.service';

declare var $:any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [OrderManagerService]
})
export class OrdersComponent implements OnInit {

  order_details: any = [];
  quotation_id: any;
  project_id: any;
  vendor_id: any;
  job_element_id: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(private router: Router,
  	          private route: ActivatedRoute,
	          private loaderService: LoaderService,
	          private OrderManagerService: OrderManagerService,
	        ) { }

  ngOnInit() {
  	this.route.params.subscribe(
      params => {
        this.quotation_id = params['quotationId'];
      }
    );
    this.getlineItemDetails();
  }
  
  getlineItemDetails(){
    this.loaderService.display(true);
  	this.OrderManagerService.lineItemDetails(this.quotation_id).subscribe(
  		res=>{
  			this.order_details = res;
        	this.loaderService.display(false);
  		},
  		err=>{
         	this.loaderService.display(false);
  		}
  	);
  }

  releasePo(purchase_order_id){
    this.loaderService.display(true);
    this.OrderManagerService.purchaseOrderRelease(purchase_order_id).subscribe(
      res=>{
        this.getlineItemDetails();
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Created Successfully !!";
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage=JSON.parse(err['_body']).message;
        this.loaderService.display(false);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }
}
