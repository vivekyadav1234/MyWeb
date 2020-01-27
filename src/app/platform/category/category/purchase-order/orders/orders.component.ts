import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule , Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../../services/loader.service';
import { CategoryService } from '../../category.service';
declare var $:any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [CategoryService]
})
export class OrdersComponent implements OnInit {

  order_details: any = [];
  quotation_id: any;
  project_id: any;
  job_element_vendor_id: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  milestoneForm: FormGroup;
  billing_address: string;
  consignor_address: string;
  contact_Person: string;

  constructor(private router: Router,
  	          private route: ActivatedRoute,
	          private loaderService: LoaderService,
	          private categoryService: CategoryService,
            private formBuilder:FormBuilder,
	        ) { }

  ngOnInit() {
  	this.route.params.subscribe(
      params => {
        this.quotation_id = params['quotationId'];
      }
    );
    this.getlineItemDetails();
    this.milestoneForm = this.formBuilder.group({
      shippingAddress: new FormControl("",Validators.required),
      milestoneElements: this.formBuilder.array([])
    });
  }
  
  getlineItemDetails(){
    this.loaderService.display(true);
  	this.categoryService.lineItemDetails(this.quotation_id).subscribe(
  		res=>{
  			this.order_details = res;
        	this.loaderService.display(false);
  		},
  		err=>{
         	this.loaderService.display(false);
  		}
  	);
  }

  createMilestoneElement(): FormGroup {
    return this.formBuilder.group({
      interval: '',
      percentage_amount: '',
      description: '',
    });
  }

  addMilestoneElement(): void {
    if (this.checkValidity()){
      (<FormArray>this.milestoneForm.controls['milestoneElements']).push(this.createMilestoneElement());
    }
  }

  setFormValues(job_element_vendor_id, project_id){
    this.milestoneForm.setControl('milestoneElements', this.formBuilder.array([]));
    this.milestoneForm.reset();
    this.job_element_vendor_id = job_element_vendor_id;
    this.project_id = project_id;
    $("#addMilestoneModal").modal('show');
  }

  resetForm(){
    this.milestoneForm.setControl('milestoneElements', this.formBuilder.array([]));
    this.milestoneForm.reset();
  }

  onMilestoneFormSubmit(){
    if(this.checkValidity()){
      this.loaderService.display(true);
      // this.categoryService.createPurchaseOrder(this.milestoneForm.controls['milestoneElements'].value, this.milestoneForm.controls['shippingAddress'].value, this.job_element_vendor_id, this.quotation_id, this.project_id).subscribe(
      //   res=>{
      //     $("#addMilestoneModal").modal('hide');
      //     this.getlineItemDetails();
      //     this.loaderService.display(false);
      //     this.successalert = true;
      //     this.successMessage = "Created Successfully !!";
      //     setTimeout(function() {
      //       this.successalert = false;
      //     }.bind(this), 2000);
      //   },
      //   err=>{
      //       this.loaderService.display(false);
      //       this.erroralert = true;
      //       this.errorMessage=JSON.parse(err['_body']).message;
      //       this.loaderService.display(false);
      //       setTimeout(function() {
      //         this.erroralert = false;
      //       }.bind(this), 2000);
      //   }
      // );
    }
  }

  checkValidity(){
    var totalPercentage = 0;
    
    if(this.milestoneForm.controls['milestoneElements'].value){
      
      this.milestoneForm.controls['milestoneElements'].value.forEach(function(element){
        totalPercentage += parseInt(element.percentage_amount || 0)
      })
    }

    if(totalPercentage > 100){
      
      alert("cannot be more than 100%.")
      $("#milestoneSubmitBtn").attr("disabled", true);
      return false;
    }
    else{
      var shipping_addr = this.milestoneForm.controls.shippingAddress.value
      if(shipping_addr){
        $("#milestoneSubmitBtn").attr("disabled", false);
      }
      return true;
    }
  }
}
