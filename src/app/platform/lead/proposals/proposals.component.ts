import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { QuotationService } from '../../quotation/quotation.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { DesignerService } from '../../designer/designer.service';
import { Angular2TokenService } from 'angular2-token';
import {Location} from '@angular/common';
declare var $:any;


@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
  providers: [LeadService, LoaderService ,QuotationService, DesignerService]
})
export class ProposalsComponent implements OnInit {
  public quotation: any;

  public pptList: any;
  public UploadedpptList:any;
  public ppt_value = [];
  public uploaded_ppt_value = [];
  lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  discountDiv = true;
  customer_status;
  submitted = false;
  lead_status;
  proposalList;
  proposal_status;
  proposal_type:any = "initial_design";
  selectedQuotationStatus;
  propstate = 'all';
  proposalstatus = 'all';
  count = 0;
  proposalId;
  id :number;
  boqProducts_all;
  final_amt = [];
  boqProducts;
  boqCheckProducts;
  isSelected:boolean=true;


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
    private _location: Location,
    public designerService : DesignerService,

    ) {  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];

      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });

    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();

  }

  changeProposalType(event){
    this.proposal_type = event.target.value;
    this.getProposalList('all');
  }
  discountValue(id:number){
    this.successalert = true;
     $("#dot_"+id).hide();
     $("#nil_"+id).hide();
  }
  saveDiscount(id:number){

  }

  isFloorPlanUploaded():boolean {
    var floorplan_array = ["floorplan_uploaded","initial_proposal_submitted","initial_proposal_accepted","initial_proposal_rejected","final_proposal_submitted","final_proposal_accepted","final_proposal_rejected"]
    if(this.lead_details.project_details && this.lead_details.project_details.sub_status && floorplan_array.includes(this.lead_details.project_details.sub_status)){
      return true
    }
    else{
      return false
    }
  }

  fpCondition(){
    alert("Please upload floorplan and update requirement sheet");
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.getProposalList('all');


      },
      err => {
        
      }
    );
  }

  dis_amt = [];
  flag: any;
  files_length = [];
  draft_status;
  getProposalList(status){
    this.loaderService.display(true);
    this.proposalstatus = status;
    // this.proposal_type = 'initial_design';
    if( this.proposalstatus == 'all'){
        this.quotationService.getProposalList(this.proposal_type,this.project_id).subscribe(
       res=>{
         this.proposalList = res['proposals'];
          this.loaderService.display(false);
       }
       ,err=>{
         
          this.loaderService.display(false);
       });
     }
      if( this.proposalstatus == 'submitted'){
       this.quotationService.getsubmittedProposalList(this.proposal_type,this.project_id).subscribe(
       res=>{
         this.proposalList = res['proposals'];
          this.loaderService.display(false);
       }
       ,err=>{
         
          this.loaderService.display(false);
       });
     }
      if( this.proposalstatus == 'discount-proposed'){
       this.quotationService.getDiscountProposedProposalList(this.project_id).subscribe(
       res=>{
         this.proposalList = res['proposals'];
         this.loaderService.display(false);
       }
       ,err=>{
         
         this.loaderService.display(false);
       });
      }
     if( this.proposalstatus == 'draft'){
       this.draft_status = 'yes';
       this.quotationService.getDraftProposalList(this.proposal_type,this.project_id,this.draft_status).subscribe(
       res=>{
         this.proposalList = res['proposals'];
         this.loaderService.display(false);
       }
       ,err=>{
         
         this.loaderService.display(false);
       });
     }
  }


  // proposal share with customer
  shareToCustomer(val){
    this.proposalId = val;
    $('#boqCheckModal').modal('show');

    


  }
  shareToCustomer1(){
    if(this.slectedFormat.length > 0){
      this.loaderService.display(true);
      this.quotationService.shareToCustomer(this.proposalId,this.slectedFormat).subscribe(


      res=>{
        $('#boqCheckModal').modal('hide');
        alert("Proposal Shared With Customer successfully");
        this.loaderService.display(false);
        this.clearCheck();
        this.getProposalList('all');
      },


      err=>{
        
        if(JSON.parse(err._body).message){
          alert(JSON.parse(err._body).message);
        }else{
         alert("Proposal Can't be Shared With Customer");
        }
        
        this.loaderService.display(false);

      });

    }
    else{
      alert("You have to select atleast one Format");

    }
    

  }

  chk: any;
  selectDiv(obj,i){
    $("#obj"+obj.id).prop('checked', !$("#obj"+obj.id).prop("checked"));
    this.selectBoq($("#obj"+obj.id).prop("checked"),obj,i);
    if($("."+obj.id).hasClass("divActive")){

      $("."+obj.id).removeClass("divActive");
    }
    else{
      // alert("helo"+obj.id);

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
  selectDiv2(obj,i){
    $("#obj"+obj.id).prop('checked', !$("#obj"+obj.id).prop("checked"));
    this.selectUploadedPpt($("#obj"+obj.id).prop("checked"),obj,i);
    if($("."+obj.id).hasClass("divActive")){
      $("."+obj.id).removeClass("divActive");
    }
    else{
      $("."+obj.id).addClass("divActive");
    }

  }

  selectedBoqIds:any = [];
  selectBoq(checked,boqvalue,index){
    if(checked){
      if(this.selectedBoqIds.includes(boqvalue.id)){
        alert("Already Added In The List");

      }
      else{
        this.boqProducts.push(boqvalue)
        this.selectedBoqIds.push(boqvalue.id);
      }
    }
    else{
      for(var i=0;i<this.boqProducts.length;i++){
         if(this.boqProducts[i].id == boqvalue.id){
           this.boqProducts.splice(i, 1);
           this.selectedBoqIds.splice(i, 1);

         }

      }
    }

    for(var i=0;i<this.boqProducts.length;i++){
      this.final_amt[i]=this.boqProducts[i].net_amount;
    }

  }

  ppt_value_ids:any = [];
  selectPpt(checked,obj,index){

     if(checked){
       if(this.ppt_value_ids.includes(obj.id)){
        alert("Already Added In The List");

      }
      else{
        this.ppt_value.push(obj);
        this.ppt_value_ids.push(obj.id)
        
      }

       
       

    }
    else{
       // const index1: number = this.ppt_value.indexOf(obj);
       for(var i=0;i<this.ppt_value.length;i++){
         if(this.ppt_value[i].id == obj.id){
           this.ppt_value.splice(i, 1);
           this.ppt_value_ids.splice(i, 1);

         }

       }
       
    }

    
  }
  uploaded_ppt_value_ids:any = [];
  selectUploadedPpt(checked,obj,index){
     
       

     if(checked){
       if(this.uploaded_ppt_value_ids.includes(obj.id)){
        alert("Already Added In The List");

      }
      else{
        this.uploaded_ppt_value.push(obj);
        this.uploaded_ppt_value_ids.push(obj.id)
        
      }
       

    }
    else{
       for(var i=0;i<this.uploaded_ppt_value.length;i++){
         if(this.uploaded_ppt_value[i].id == obj.id){
           this.uploaded_ppt_value.splice(i, 1);
           this.uploaded_ppt_value_ids.splice(i, 1);

         }

       }
    }
  }
  status;
  option_val;
  // Function for save proposal
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
    for(var l=0; l <this.uploaded_ppt_value.length; l++){

      var uploadedPpt = {

      "ownerable_id": this.uploaded_ppt_value[l].id,
       "ownerable_type": 'BoqAndPptUpload'
    }
      products.push(uploadedPpt);

    }


    var data ={
      "ownerables": products,
      "proposal":{
       "proposal_type": this.proposal_type,
       "project_id": this.project_id,
       "is_draft":this.option_val,
      }
    }
    this.quotationService.postProposal(data).subscribe(

      res =>{

        this.loaderService.display(false);
        $('#myProposal').modal('hide');
        this.isSelected=true;
        alert("Proposal Saved Successfully");
        this.dis_amt = [];
        this.ppt_value = [];
        this.uploaded_ppt_value = [];
        this.proposal_status ='';
        // this.getProposalList(this.project_id);

        this.getProposalList('all');

        // this.router.navigateByUrl('lead/{{ this.lead_id }}/proposals');

      },

      err => {
        
        alert(JSON.parse(err._body)["message"]);
        this.loaderService.display(false);

      }

      );

  }
  deleteBoq(Value){
    const index1: number = this.boqProducts_all.indexOf(Value);
      this.boqProducts_all.splice(index1, 1);

  }
  removeItemFromList(){
    
    this.boqProducts =[];
    this.selectedBoqIds = [];
    this.ppt_value_ids = [];
    this.uploaded_ppt_value_ids = [];
    localStorage.removeItem('boqAddedProducts');
    $('.ppt-checkbox').prop('checked', false);
    $('.boq-checkbox').prop('checked', false);
    $('.proposalBox').removeClass("divActive");
    $(".modal-body-change1").hide();
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




  //

  dis;
  onInputDiscount(elemid,product,index,id:number){
    this.dis = (<HTMLInputElement> document.getElementById(elemid)).value;
    var k = Number(this.dis) + Number(product.discount_value);
    if(k < 0){
      alert("Discount Value should be greater than equal to zero");
       $('#product_'+id).val(0);
       this.dis = 0;

    }
    if(k > 100){
      alert("Discount Value Should Be Less Than Equal To 100");
       $('#product_'+id).val(100);
       this.dis = 100;

    }
   this.dis = Number(this.dis) + Number(product.discount_value);
   var obj = {
     'quantVal':this.dis
   }
    var cal = (product.net_amount * <any>obj.quantVal)/100;
    var final = product.net_amount - cal;
    this.final_amt[index]= final;
    this.dis_amt[index] = this.dis;


}

  confirmAndDelete(id:number) {
    if (confirm("Are You Sure You Want To delete?") == true) {
      
      this.DeleteProposal(id);
    }
  }

  private DeleteProposal(id: number){
    this.loaderService.display(true);


    this.quotationService.deleteProposal(id).subscribe(

      res=>{
        alert("deleted successfully");
        this.loaderService.display(false);
        this.getProposalList('all');



      },


      err=>{
        
        this.loaderService.display(false);

      });

  }

  // function for getting ppt and boq list for particular projetcs
   setProposal(val){
    this.proposal_status =  val;

    if(this.proposal_status == "boq"){
      this.quotationService.getBoqList(this.proposal_type,this.project_id).subscribe(
        res => {
          this.quotation = res['quotations'];
           $(".modal-body-change1").show();
           for(let obj of this.boqProducts){
             $("#obj"+obj.id).prop('checked', !$("#obj"+obj.id).prop("checked"));
             // this.selectBoq($("#obj"+obj.id).prop("checked"),obj,1);
             if($("."+obj.id).hasClass("divActive")){
               // alert("hello");
                $("."+obj.id).removeClass("divActive");
              }
              else{
                // alert("ana"+obj.id);
                $("."+obj.id).removeClass("divActive");
              }

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
          this.UploadedpptList = res['uploaded_presentations'];

        },
        err => {
          

        }
      );

    }

    this.isSelected = false;
  }

  choose_type:any = "true"
  //end function for getting ppt and boq list
  getproposedProposalList(status)
  {
    this.propstate = status;
    // this.proposal_type = 'initial_design';
     // this.selectedQuotationStatus = status;
     if( this.propstate == 'all'){
        this.quotationService.getproposedProposalList(this.proposal_type,this.project_id).subscribe(
       res=>{
         this.proposalList = res['proposals'];

       }

       ,err=>{
         

       }

       );


     }
      if( this.propstate == 'submitted'){
        this.quotationService.getsubmittedProposalList(this.proposal_type,this.project_id).subscribe(
       res=>{
         this.proposalList = res['proposals'];

       }

       ,err=>{
         

       }

       );


     }

  }
  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details && this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
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

  callResponse: any;
  callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLead(localStorage.getItem('userId'), contact).subscribe(
        res => {
           this.loaderService.display(false);
          if(res.inhouse_call.call_response.code == '403'){
            this.erroralert = true;
            this.errorMessage = JSON.parse(res.message.body).RestException.Message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 10000);
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse =  JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage = 'Calling from - '+this.callResponse.Call.From;
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 10000);
          }
        },
        err => {
          this.loaderService.display(false);
          
        }
     );
  }
  reMoveContent(){
    this.isSelected=true;
    this.proposal_status ='';
    this.uploaded_ppt_value = [];
    this.ppt_value = [];
     $(".modal-body-change1").hide();
     
  }
  slectedFormat = [];

  selectPdfFormat(event){
    var index = this.slectedFormat.indexOf(event.target.value);
    
    if(event.target.checked){
      this.slectedFormat.push(event.target.value);


    }

    else{
      this.slectedFormat.splice(index,1);


    }
    

  }
  isChecked1;
  isChecked2;
  isChecked3;
  clearCheck(){
    this.isChecked1 = false;
    this.isChecked2 = false;
    this.isChecked3 = false;

  }
  clearCheckBox(){
    this.clearCheck();
  }

  checkDecimalDot(e){
    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode != 46 && charCode > 31 
       && (charCode < 48 || charCode > 57))
    return false;

  }









}
