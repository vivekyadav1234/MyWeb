import { Component, EventEmitter, Input, OnInit, Output, NgZone, AfterViewInit} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { ProjectService } from '../../project/project/project.service';
import { QuotationService} from '../../quotation/quotation.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { Subscription } from 'rxjs/Subscription';

declare var $:any;
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-proposal',
  templateUrl: './view-proposal.component.html',
  styleUrls: ['./view-proposal.component.css'],
  providers: [QuotationService]
})
export class ViewProposalComponent implements OnInit {
  public proList: any;
  public quotation: any;

  public pptList: any;
  public uploaded_ppt_list: any;
  public ppt_value = [];
  public uploaded_ppt_value =[];
  successalert = false;
  errorMessage : string;
  erroralert = false;
  successMessage : string;
  prop_id;
  boq_id;
  proposal_type;
  proposal:any ;
  boq_list;
  ppt_list;
  project_id;
  lead_id;
  role: string;
  dis_amt = [];
  dis_nw;
  final_amt = [];
  final_edit_amt = [];
  proposal_status;
  boqProducts_all;
  customer_status;
  editFlag = false;
  editPptFlag = false;
  editPptFlag1 = false;
  paymentForm:  FormGroup;
  image: any;
  attachment_name: string;
  basefile = {};
  pptEdit_list: any;
  propose_type;


  constructor(
    private authService : AuthService,
    private route: ActivatedRoute,
    private router : Router,
    private loaderService : LoaderService,
    private quotationService:QuotationService,
    private _location: Location,
    private fb: FormBuilder,
    ) {
      this.role=localStorage.getItem('user');
      this.paymentForm = fb.group({
      'payment_type': ['', Validators.required],
      'quotations' : ['', Validators.required],
      'paid_amount': ['', Validators.required],
      'mode_of_payment': ['', Validators.required],
      'bank': [''],
      'branch': [''],
      'date_of_checque': [''],
      'date': [''],
      'image': ['']
    });

   }



  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.prop_id = params['propId']
        this.lead_id = params['leadId'];
        this.project_id = params['projectId'];

      }
    );
    this.route.queryParams.subscribe(params => {
      this.customer_status = params['status'];
      this.propose_type = params['type'];

    });
    this.proposalList(this.prop_id);


  }
  dis;
  dis_nw_onchange;
  onInputDiscount(event,boq,index,id:number){
    
    var elemid = event.target.id;
      this.dis = event.target.value;
      if(this.dis < 0){
        alert("Discount Value should be greater than equal to zero");
         $('#boq_'+id).val(0);
         this.dis = 0;

      }
    if(this.dis > 100){
      alert("Discount Value Should Be Less Than Equal To 100");
       $('#boq_'+id).val(100);
       this.dis = 100;

    }

      var obj = {
     'quantVal':this.dis
      }


    for(let i =0 ; i< this.boqProducts.length;i++){
          if( this.boqProducts[i].proposed_doc_id == boq.proposed_doc_id ){
            var cal = (boq.quotation.net_amount * <any>obj.quantVal)/100;
            var final = boq.quotation.net_amount - cal;
            this.final_amt[index]= final;
           this.boqProducts[i].discount_value = this.dis;

          }
        }
    // changing the value of discount in  view list
    for(let i =0 ; i< this.boq_list.length;i++){
          if( this.boq_list[i].proposed_doc_id == boq.proposed_doc_id ){
           this.boq_list[i].discount_value = this.dis;

          }
        }
    //end here

      this.dis_amt[index] = this.dis;
      this.dis_nw = this.dis;
      this.dis_nw_onchange = this.dis;
  }
 onChange(event) {
    this.image = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile = base64.result
      // this.paymentForm.patchValue({image: this.basefile})
    };

    fileReader.readAsDataURL(this.image);

  }


  confirmAndApprove(status,propDocId) {
    if (confirm("Are You Sure You Want To Approve?") == true) {
      this.approveDiscountProposal(status,propDocId);
    }
  }
  confirmAndReject(status,propDocId) {
    if (confirm("Are You Sure You Want To Reject?") == true) {
      this.approveDiscountProposal(status,propDocId);
    }
  }
  approveDiscountProposal(status,propDocId){
    this.loaderService.display(true);
      for(let i =0 ; i< this.boq_list.length;i++){
        if( this.boq_list[i].proposed_doc_id == propDocId ){

        this.dis_nw = this.boq_list[i].discount_value;
        }
      }
    // 
    if(this.dis_nw == this.dis_nw_onchange){
      var obj ={
        'discount_value' : this.dis_nw
      }
    }
    else{
      var obj ={
        'discount_value' : this.dis_nw_onchange
      }
    }
    this.quotationService.approveDiscountProposal(obj,status,propDocId).subscribe(
      res=>{
        alert(res.message);
        this.proposalList(this.prop_id);
        this.loaderService.display(false);

      },
      err =>{
        
        this.loaderService.display(false);
      }
      );


  }


  draft_check;
  boqProducts;
  boqProductsList;
  boqEditProducts;
  accepted_check = [];
  total_amount = []
  proposal_state;


  proposalList(val){
    this.loaderService.display(true);
    this.boq_id = val;
    this.proposal_type = "initial_design";
    this.quotationService.getViewlList(this.boq_id,this.proposal_type).subscribe(
      res=>{
         this.proposal = res['proposal'];
         
         

         this.draft_check = this.proposal.is_draft;

         this.project_id = this.proposal.project.id;
         this.boq_list = this.proposal['proposed_quotations'];
         this.boqProducts =this.boq_list;
         this.boqProductsList =this.boq_list;
         this.ppt_list = this.proposal['proposesd_presentations'];
         this.uploaded_ppt_list = this.proposal['proposesd_uploaded_presentations'];

         this.pptEdit_list= this.ppt_list;
         
         
         

         for(let i =0 ; i< this.boqProductsList.length;i++){
           this.total_amount[i] = this.boqProductsList[i].final_amount;
         }
         this.loaderService.display(false);
         for (let i =0 ; i< this.boq_list.length;i++) {
           this.final_amt[i] = this.boq_list[i].final_amount;
         }
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

  confirmAndApproveQuote(boqId,quoteStatus){
    this.loaderService.display(true);
    this.quotationService.confirmAndApproveQuote(this.project_id,boqId,quoteStatus).subscribe(
      res=>{
         alert(res.message);
         this.proposalList(this.prop_id);
         this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      });
  }

  //  delete function for deleting boqs
  deletEditBoq(Value,boqEdit){
    this.boqProductsList.splice(this.boqProductsList.indexOf(boqEdit), 1);
    this.quotationService.deleteEditBoq(Value).subscribe(

      res =>{
        this.successalert = true;
        this.successMessage = 'Delete Created BOQ successfully!';
        this.loaderService.display(false);
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
      },

      err => {
        
        this.loaderService.display(false);

      }

      );

  }
  //end here
    //  delete function for deleting ppts
  deletEditPpt(Value,pptEdit){
    this.pptEdit_list.splice(this.pptEdit_list.indexOf(pptEdit), 1);
    this.quotationService.deleteEditBoq(Value).subscribe(

      res =>{
        this.successalert = true;
        this.successMessage = 'Delete Created PPT successfully!';
        this.loaderService.display(false);
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
      },

      err => {
        
        this.loaderService.display(false);

      }

      );

  }

  deletEditUploadedPpt(Value,pptEdit){
    this.uploaded_ppt_list.splice(this.uploaded_ppt_list.indexOf(pptEdit), 1);
    this.quotationService.deleteEditBoq(Value).subscribe(

      res =>{
        this.successalert = true;
        this.successMessage = 'Delete Uploaded PPT successfully!';
        this.loaderService.display(false);
         setTimeout(function() {
            this.successalert = false;
        }.bind(this), 10000);
      },

      err => {
        
        this.loaderService.display(false);

      }

      );

  }
  //end here
  onInputDiscountCahnge(elemid,product,index,id:number){
    this.dis = (<HTMLInputElement> document.getElementById(elemid)).value;
    if(this.dis  > 10){
      alert("Discount Value should be less than 10");
       $('#product_'+id).val(10);
       this.dis = 10;

    }

   var obj = {
     'quantVal':this.dis
   }
    var cal = (product.net_amount * <any>obj.quantVal)/100;
    var final = product.net_amount - cal;
    this.final_edit_amt[index]= final;
    this.dis_amt[index] = this.dis;





  }
  onInputEditDiscount(elemid,product,index,id:number){
    this.dis = (<HTMLInputElement> document.getElementById(elemid)).value;

    if(this.dis  > 10){
      alert("Discount Value should be less than 10");
       $('#product_'+id).val(10);
       this.dis = 10;

    }



  for(let i =0 ; i< this.boqProductsList.length;i++){

    if( this.boqProductsList[i].proposed_doc_id == product.proposed_doc_id )  {
       var obj = {
         'quantVal':this.dis
       }
      var cal = (product.quotation.net_amount * <any>obj.quantVal)/100;
      var final = product.quotation.net_amount - cal;
      this.total_amount[i]= final;
     this.boqProductsList[i].discount_value = this.dis;
    }

  }


    this.dis_amt[index] = this.dis;
    this.dis_nw = this.dis;

  }
  option_val;
  status;
   saveProposal(status){
    this.status = status;
    if(this.status == 'draft'){
      this.option_val = 'yes';


    }
    else{
      this.option_val = 'no';
    }
    this.loaderService.display(true);
    var products = new Array();
    var products1 =  new Array();
    for(var l=0; l <this.boqEditProducts.length; l++){

      var obj = {

      "ownerable_id": this.boqEditProducts[l].id,
       "ownerable_type": 'Quotation',
       "discount_value": this.dis_amt[l]
    }
      products.push(obj);


    }
    for(var l=0; l <this.boqProductsList.length; l++){

      var obj1 = {

       "proposal_doc_id": this.boqProductsList[l].proposed_doc_id,
       "discount_value": this.boqProductsList[l].discount_value,
    }
      products1.push(obj1);


    }
    for(var j=0; j <this.pptEdit_list.length; j++){

      var obj3 = {

       "proposal_doc_id": this.pptEdit_list[j].proposed_doc_id,
       "discount_value": this.pptEdit_list[j].discount_value,
    }
      products1.push(obj3);



    }
    for(var j=0; j <this.uploaded_ppt_list.length; j++){

      var obj4 = {

       "proposal_doc_id": this.uploaded_ppt_list[j].proposed_doc_id,
       "discount_value": this.uploaded_ppt_list[j].discount_value,
    }
      products1.push(obj4);
      


    }

    for(var l=0; l <this.ppt_value.length; l++){

      var obj2 = {

      "ownerable_id": this.ppt_value[l].id,
      "ownerable_type": 'Presentation'
    }
      products.push(obj2);

    }
    for(var l=0; l <this.uploaded_ppt_value.length; l++){

      var uploadedPpt = {

      "ownerable_id": this.uploaded_ppt_value[l].uploaded_presentation.id,
       "ownerable_type": 'BoqAndPptUpload'
    }
      products.push(uploadedPpt);

    }

    var data ={
      "ownerables": products,
      "ownerables_for_update": products1,
      "proposal":{ },
      "is_draft": this.option_val,
    }
    this.quotationService.postEditProposal(data,this.prop_id).subscribe(

      res =>{
        $('#myProposal').modal('hide');
        this.backClicked();
        this.loaderService.display(false);

        // this.router.navigateByUrl('lead/{{ tis.lead_id }}/proposals');

      },

      err => {
        
        this.loaderService.display(false);

      }

      );

  }
  selectDiv(obj,i){

    $("#obj"+obj.id).prop('checked', !$("#obj"+obj.id).prop("checked"));
    this.selectBoq($("#obj"+obj.id).prop("checked"),obj,i);
    if($("."+obj.id).hasClass("divActive")){
      $("."+obj.id).removeClass("divActive");
    }
    else{
      $("."+obj.id).addClass("divActive");
    }

  }
  selectDiv1(obj,i){
    
    
    $("#obj"+obj.id).prop('checked', !$("#obj"+obj.id).prop("checked"));
    this.selectPpt($("#obj"+obj.id).prop("checked"),obj,i);
    if($("."+obj.id).hasClass("divActive")){
      $("."+obj.id).removeClass("divActive");
    }
    else{
      $("."+obj.id).addClass("divActive");
    }

  }
  selectedBoqIds:any = [];
  selectBoq(checked,boqvalue,index){
    this.editFlag = true;

    if(checked){
      this.boqEditProducts.push(boqvalue)
      this.selectedBoqIds.push(boqvalue.id);
    }
    else{
      this.boqEditProducts.splice(this.boqProducts.indexOf(boqvalue), 1);
      this.selectedBoqIds.splice(this.selectedBoqIds.indexOf(boqvalue.id), 1);
    }

    // for(var i=0;i<this.boqEditProducts.length;i++){
    //   this.final_amt[i]=this.boqEditProducts[i].net_amount;
    // }
    // 

  }
  selectPpt(checked,obj,index){
     this.editPptFlag = true;
     if(checked){
       this.ppt_value.push(obj);

    }
    else{
       const index1: number = this.ppt_value.indexOf(obj);
       this.ppt_value.splice(index1, 1);
    }
  }
  state = 'boq';
  selectSet(set){
    this.state = set;


  }

    // function for getting ppt and boq list for particular projetcs
   setProposal(val){
    this.proposal_status =  val;
    if(this.proposal_status == "boq"){
      this.quotationService.getBoqList(this.proposal_type,this.project_id).subscribe(
        res => {
          this.quotation = res['quotations'];
           for(var k=0;k<this.quotation.length;k++){
            this.final_edit_amt[k]=this.quotation[k].net_amount;
            }
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
  deleteBoq(Value){
    const index1: number = this.boqProducts.indexOf(Value);
      this.boqProducts.splice(index1, 1);

  }




  //end function for getting ppt and boq list

  //start finction for getting boq list based on approve and rejected
  BoqId;
  ownerableType;
  filterBoq(event){
    this.loaderService.display(true);
    this.ownerableType = "Quotation";
    var value = event.target.value;
    if( value == 'all'){
      this.ownerableType = "Quotation"
       this.quotationService.getAllBoqList(this.ownerableType,this.prop_id).subscribe(

        res=>{
          this.boq_list = res['proposal_docs'];

           this.loaderService.display(false);

        },

        err=>{
          
          this.loaderService.display(false);

        }

        );
    }
    else{
      this.quotationService.getBoqListByStatus(value,this.prop_id,this.ownerableType).subscribe(

        res=>{
          this.boq_list = res['proposal_docs'];
            this.loaderService.display(false);

        },

        err=>{
          
           this.loaderService.display(false);

        }

        );
    }




  }
  //end finction for getting boq list based on approve and rejected

  openpopup(event,id){
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });

    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    })
  }


  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }



  ngAfterViewInit(){
    this.boqEditProducts = new Array();
    $(".cheque-mode").css("display", "none");
    $(".neft-mode").css("display", "none");

    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })
  }
  backClicked() {
    this._location.back();
  }

  changePaymentMode(event){
    if(event.target.value == "NEFT/RTGS"){
      $(".cheque-mode").css("display", "none");
      $(".neft-mode").css("display", "block");
    }
    else if(event.target.value == "cheque"){
      $(".cheque-mode").css("display", "block");
      $(".neft-mode").css("display", "none");
    }
  }

  addPayment(boq_id){
    this.paymentForm.patchValue({quotations: boq_id})
  }



  payment_history_list:any = [];
  paymentHistory(boq_id){
    this.quotationService.paymentHistory(boq_id).subscribe(
      res => {
        this.payment_history_list = res.payments;
      },
      err => {
        alert("Something went wrong");
        
      });
  }
  selectDiv2(obj,i){
    
    $("#obj"+obj.uploaded_presentation.id).prop('checked', !$("#obj"+obj.uploaded_presentation.id).prop("checked"));
    this.selectUploadedPpt($("#obj"+obj.uploaded_presentation.id).prop("checked"),obj,i);
    if($("."+obj.uploaded_presentation.id).hasClass("divActive")){
      $("."+obj.uploaded_presentation.id).removeClass("divActive");
    }
    else{
      $("."+obj.uploaded_presentation.id).addClass("divActive");
    }

  }
  selectUploadedPpt(checked,obj,index){
    this.editPptFlag1 = true;

     if(checked){
       this.uploaded_ppt_value.push(obj);
       
       

    }
    else{
       const index1: number = this.uploaded_ppt_value.indexOf(obj);
       this.uploaded_ppt_value.splice(index1, 1);
    }
  }
}

