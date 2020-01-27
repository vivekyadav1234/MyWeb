import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { QuotationService } from '../../quotation/quotation.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
declare var $:any;
;

@Component({
  selector: 'app-proposed-discount',
  templateUrl: './proposed-discount.component.html',
  styleUrls: ['./proposed-discount.component.css'],
  providers: [LeadService, LoaderService ,QuotationService ]
})
export class ProposedDiscountComponent implements OnInit {
	role:any;
  discountBoq_list;
  lead_id:any;
  lead_details:any;
  project_id:any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  submitted = false;
  lead_status;
  proposalList;
  proposal_status;
  proposal_type;
  Boq_list;
  boqProducts;
  boq_list;
  dis;
  dis_amt = [];
  dis_nw;
  final_amt = [];

  constructor(
  	public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute,
    private quotationService : QuotationService,


  	) {
  	 this.role = localStorage.getItem('user');
  	 }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
        
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.fetchBasicDetails();
  }
  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.getDiscountBoqList(this.project_id);
      },
      err => {
        
      }
    );
  }
  approveDiscountProposal(status,propDocId){
    this.loaderService.display(true);
    var obj ={
      'discount_value' : this.dis_nw
    }
    this.quotationService.approveDiscountProposal(obj,status,propDocId).subscribe(
      res=>{
        alert("BOQ approve successfully");
        this.loaderService.display(false);

      },
      err =>{
        
        this.loaderService.display(false);
      }
      );

  
  }
  onInputDiscount(elemid,boq,index){
    this.dis = (<HTMLInputElement> document.getElementById(elemid)).value;
   $('.discountInput').on('keyup keydown', function(e){
        if ($(this).val() > 100 
            && e.keyCode != 46
            && e.keyCode != 8
           ) {
           e.preventDefault();     
        }
    });
    var cal = (boq.proposed_quotations.quotation.net_amount * this.dis) / 100;
    var final = boq.proposed_quotations.quotation.net_amount - cal;
    this.final_amt[index]= final;


   // var obj = {
   //   'quantVal':this.dis
   // }
   // 
   //  var cal = (product.net_amount * <any>obj.quantVal)/100;
   //  var final = product.net_amount - cal;
   //  this.final_amt[index]= final;
    this.dis_amt[index] = this.dis;
    this.dis_nw = this.dis;
   // for(var p=0;p<this.boqProducts.length;p++){

   //    if(this.boqProducts[p].id == product.id){
         
        

        

   //      break;
   //    }
   //  }
   
   
  }
  getDiscountBoqList(val){
    this.quotationService.getDiscountBoqList(val).subscribe(
      res=>{
        this.discountBoq_list = res['proposal_docs'];
        for(let i=0 ;i<this.discountBoq_list.length;i++){
          this.final_amt[i] = this.discountBoq_list[i].proposed_quotations.quotation.net_amount;

        }
      },
      err=>{
        
      }
      );
  }

}
