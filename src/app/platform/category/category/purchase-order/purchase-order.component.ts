import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService} from '../category.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
  providers: [ CategoryService ]
})
export class PurchaseOrderComponent implements OnInit {
  
  quotations_list: any = [];

  constructor(private router: Router,
	          private loaderService : LoaderService,
	          private categoryService:CategoryService,
            ) { }

  ngOnInit() {
  	this.getQuotationsList();
  }

  getQuotationsList(){
    this.loaderService.display(true);
  	this.categoryService.getQuotationsList().subscribe(
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
