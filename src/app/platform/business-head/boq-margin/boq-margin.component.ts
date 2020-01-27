import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { BusinessHeadService } from '../business-head.service';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;
@Component({
  selector: 'boq-margin',
  templateUrl: './boq-margin.component.html',
  styleUrls: ['./boq-margin.component.css'],
  providers:[BusinessHeadService]
})
export class BoqMarginComponent implements OnInit {
  reference_value: any;
  boq_amount: any;
  boq_details: {}[];
   errorMessage : string;
  errorMessageModal : string;
  erroralert = false;
  erroralertmodal = false;
  successalert = false;
  successalertmodal = false;
  successMessageModal:string;
  successMessage : string;
  showBOQDiv: boolean;

  constructor(
  public businessHeadService : BusinessHeadService,
  private loaderService : LoaderService,
  private tokenService: Angular2TokenService,
  ) { }

  ngOnInit() {
   
  }
  pm_fee_disabled;
  getBOQByReference(){
    this.boq_details = undefined;
    this.showBOQDiv = true;
    if((this.reference_value != null) || (this.reference_value != undefined) || (this.reference_value != '')){
      this.loaderService.display(true);
      this.businessHeadService.getBOQByReference(this.reference_value).subscribe(
        response =>{
          this.loaderService.display(false);
          this.boq_details = response.quotation;
        },
        error =>{
          
          this.errorMessageShow(JSON.parse(error._body).message);
          this.loaderService.display(false);
        }
      );
    } else {
      this.errorMessageShow('Please input the reference number!');
    }
    
  }
  updateBOQDetails(){
    if((this.reference_value != null) || (this.boq_amount != undefined)){
      this.loaderService.display(true);
      this.businessHeadService.updateReferenceValue(this.reference_value, this.boq_amount).
      subscribe(
        res =>{
          this.closeUpdateBOQModal();
          this.loaderService.display(false);
          this.boq_details = res.quotation;
          this.successMessageShow('Value updated successfully!');
        },
        error =>{
          this.closeUpdateBOQModal();
          
          this.errorMessageShow(JSON.parse(error._body).message);
          this.loaderService.display(false);
        }
      );
    } else {
      this.errorMessageShow('Please enter amount!');
    }
    
  }
  closeUpdateBOQModal(){
    $('#updateBOQMargin').modal('hide');
  }

  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 2000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 2000);
  }
//V:fuctionality for disable pm fee
  selected_space;
  DisablePmFee(event){
    this.selected_space = event.target.checked;
    this.loaderService.display(true);
    this.businessHeadService.DisablePmFee(this.reference_value,this.selected_space).subscribe(
    res=>{
      this. getBOQByReference();
      this.successalert = true;
      // this.successMessage = res.message;
      this.successMessageShow('Disable Pm Fee Updated Successfully!');
      this.loaderService.display(false);
    },
    err=>{
        this.loaderService.display(false);
          this.errorMessageShow(this.errorMessage['_body']);  
        });
  } 

}


