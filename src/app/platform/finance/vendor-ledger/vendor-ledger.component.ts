import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import {FinanceService} from '../finance.service';
import {LeadService} from '../../lead/lead.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
declare var $:any;


@Component({
  selector: 'app-vendor-ledger',
  templateUrl: './vendor-ledger.component.html',
  styleUrls: ['./vendor-ledger.component.css'],
  providers:[FinanceService,LeadService]
})
export class VendorLedgerComponent implements OnInit {
	vendor_ledger;
	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
	leadList;
	ageing =[{'id':1,'name':'1 day ago'},{'id':2,'name':'2 day ago'},{'id':3,'name':'3 day ago'},{'id':5,'name':'5 day ago'},{'id':10,'name':'10 day ago'},{'id':30,'name':'1 month ago'},{'id':60,'name':'2 month ago'}];

  constructor(
  	private loaderService : LoaderService,
  	private financeService:FinanceService,
    private leadService:LeadService,
    private formBuilder:FormBuilder
  	) { }

  ngOnInit() {
  	this.getVendorLedger();
  }
  getVendorLedger(client?,FromDate?,ToDate?,Ageing?){
  	this.loaderService.display(true);
  	this.financeService.getVendorLedger(client,FromDate,ToDate,Ageing).subscribe(
  		res=>{
  			this.vendor_ledger = res.pi_payments.data;
  			this.leadList = res.vendors;
        
  		    this.loaderService.display(false);
  		},
  		err=>{
  			
  			this.loaderService.display(false);
  		}
  	);

  }
  clientId;
  FromDate;
  ToDate;
  ageingVal;
  filterColumDropdownChange1(clientId){
    
      this.clientId = clientId;

  }
  filterData(){
      this.getVendorLedger(this.clientId,this.FromDate,this.ToDate,this.ageingVal);

  }
  takeFromDate(event){

      this.FromDate = event.value;

  }
  takeToDate(event){
      this.ToDate = event.value;

  }
  filterColumDropdownChange2(event){
    this.ageingVal = event;


  }

}
