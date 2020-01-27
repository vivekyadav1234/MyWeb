import { Component, EventEmitter, Input, OnInit, Output, NgZone, AfterViewInit} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { ProjectService } from '../../project/project/project.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import {QuotationService} from '../../quotation/quotation.service';
import { LoaderService } from '../../../services/loader.service';
import { Subscription } from 'rxjs/Subscription';
import {Location} from '@angular/common';
declare let $: any;

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.css'],
  providers: [QuotationService]
})
export class CreateProposalComponent implements OnInit {
	public quotation: any;

  public pptList: any;
	proposal_status;
	proposal_type;
	project_id;
  presentation_id;
  boqProducts;
  lead_id;
  boqProducts_all;
  final_amt = [];
  dis_amt = [];
  dis;
  ppt_value = [];

  constructor(
  	private activatedRoute: ActivatedRoute,
    private router:Router,
    public loaderService : LoaderService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private quotationService:QuotationService,
    private _location: Location

  	) { }

  ngOnInit() {
  	this.route.queryParams.subscribe(params => {
      this.proposal_type = params['proposal_type'];
      this.project_id = params['project_id'];
      this.lead_id = params['lead_id'];
      
    });
  }
  selectBoq(event,boqvalue,index){
     if (boqvalue) {
      // this.boqProducts[i].checked = !this.boqProducts[i].checked;
    }
    if(event.target.checked){
      this.boqProducts_all.push(boqvalue);

    }
    else{
       const index1: number = this.boqProducts_all.indexOf(boqvalue);
       this.boqProducts_all.splice(index1, 1);
    }
    
    this.boqProducts = this.boqProducts_all;

    //this.final_amt = this.boqProducts;
    for(var i=0;i<this.boqProducts.length;i++){
      this.final_amt[i]=this.boqProducts[i].net_amount;
    }

  }
  selectPpt(event,obj,index){
    if (obj) {
      // this.boqProducts[i].checked = !this.boqProducts[i].checked;
    }
     if(event.target.checked){
       this.ppt_value.push(obj);

    }
    else{
       const index1: number = this.ppt_value.indexOf(obj);
       this.ppt_value.splice(index1, 1);
    }

  }

  onInputDiscount(elemid,product,index){
    this.dis = (<HTMLInputElement> document.getElementById(elemid)).value;
   $('.discountInput').on('keyup keydown', function(e){
    
        if ($(this).val() > 100 
            && e.keyCode != 46
            && e.keyCode != 8
           ) {
           e.preventDefault();     
        }
    });
   var obj = {
     'quantVal':this.dis
   }
    var cal = (product.net_amount * <any>obj.quantVal)/100;
    var final = product.net_amount - cal;
    this.final_amt[index]= final;
    this.dis_amt[index] = this.dis;
   // for(var p=0;p<this.boqProducts.length;p++){

   //    if(this.boqProducts[p].id == product.id){
         
        

        

   //      break;
   //    }
   //  }
   
   
}

  // Function for save proposal
  saveProposal(){
    this.loaderService.display(true);
    var products = new Array();
    for(var l=0; l <this.boqProducts.length; l++){
      
      var obj = {
      
      "ownerable_id": this.boqProducts[l].id,
       "ownerable_type": 'Quotation',
       "discount_value": this.dis_amt[l]
    }
      products.push(obj);

    }
    for(var l=0; l <this.ppt_value.length; l++){
      
      var obj1 = {
      
      "ownerable_id": this.ppt_value[l].id,
       "ownerable_type": 'Presentation'
    }
      products.push(obj1);

    }

    var data ={
      "ownerables": products,
      "proposal":{
       "proposal_type": this.proposal_type,
       "project_id": this.project_id
      }
    }
    this.quotationService.postProposal(data).subscribe(

      res =>{
        this.backClicked();
        this.loaderService.display(false);

        // this.router.navigateByUrl('lead/{{ this.lead_id }}/proposals');

      },

      err => {
        
        this.loaderService.display(false);

      }

      );

  }

  modalhide(){
    $('#myProposal').modal('hide');
  }
  //end save proposal
  setProposal(val){
  	this.proposal_status =  val;

  	if(this.proposal_status == "boq"){
  		this.quotationService.getBoqList(this.proposal_type,this.project_id).subscribe(
	      res => {
	      	this.quotation = res['quotations'];
	      },
	      err => {
	        
	        
	      }
	    );
  		

  	}
    else{
      this.quotationService.getBoqList(this.proposal_type,this.project_id).subscribe(
        res => {
          this.pptList = res['presentations'];
        },
        err => {
          
          
        }
      );

    }


  		
  }
  product_notify_message;
  notificationAlert= false;
  removeProductToProposals(boqid){
    this.product_notify_message =  ' BOQ has been removed';
     this.notificationAlert = true;
     setTimeout(function() {
        this.notificationAlert = false;    
      }.bind(this), 10000);

    for(var i=0; i<this.boqProducts.length;i++){
      
        this.boqProducts.splice(i, 1);
         
    } 

   localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
  }
  backClicked() {
    this._location.back();
    // this.quotationService.getProposalList(this.proposal_type).subscribe(
    //     res => {
          
          
    //       
          
    //     },
    //     err => {
    //       
          
    //     }
    //   );

  }


  ngAfterViewInit() {
    this.boqProducts_all = JSON.parse(localStorage.getItem('boqAddedProducts'));
    if(this.boqProducts_all == null){
      this.boqProducts= new Array();
      this.boqProducts_all = new Array();
    } else {
      this.boqProducts = this.boqProducts_all;
      this.boqProducts_all = this.boqProducts_all;
      for(var i=0;i<this.boqProducts.length;i++){
      this.final_amt[i]=this.boqProducts[i].net_amount;
      }
      for(var index=0;index<this.boqProducts_all.length;index++){
        
        //this.totalAmt = this.totalAmt+this.boqProducts_all[index].amount;
      }
    }
  } 

}

