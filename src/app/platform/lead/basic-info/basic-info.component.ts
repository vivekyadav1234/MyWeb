import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { DesignerService } from '../../designer/designer.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css'],
  providers: [LeadService, DesignerService]
})
export class BasicInfoComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  lead_status;
  query_params:any = {};
  pid;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  flag_change = false;
  successMessage : string;
  basicDetailsForm: FormGroup;
  customerDetails: any;
  contact_visibel:any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private route:ActivatedRoute,
    private designerService: DesignerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    
    this.route.queryParams.subscribe(params => {
      if(params['lead_status']){
        this.lead_status = params['lead_status'];
        this.query_params['lead_status'] = this.lead_status;
      }

      if(params['lead_category']){
        this.query_params['lead_category'] = params['lead_category'];
      }
      this.getCustomerDetails();

    });

    this.role = localStorage.getItem('user');
    
    this.basicDetailsForm = this.formBuilder.group({
      'name': new FormControl("",Validators.required),
      'email': new FormControl("",[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'contact': new FormControl("", [Validators.required, Validators.pattern(/^[6789]\d{9}$/), Validators.minLength(10), Validators.maxLength(10) ])
    });

    this.fetchBasicDetails();
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.pid = res['lead'].project_details.id;
        this.basicDetailsForm.controls['name'].setValue(this.lead_details.name);
        this.basicDetailsForm.controls['email'].setValue(this.lead_details.email);
        this.basicDetailsForm.controls['contact'].setValue(this.lead_details.contact);
        this.contact_visibel = this.lead_details.is_contact_visible;
      },
      err => {
        
      }
    );
  }

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
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

  updateBasicInfo(){
    this.loaderService.display(true);
    this.leadService.updateBasicInfo(this.lead_id, this.basicDetailsForm.controls["name"].value,
        this.basicDetailsForm.controls["email"].value,
        this.basicDetailsForm.controls["contact"].value,).subscribe(
      res => {
        if(res['lead']){
          this.lead_details = res['lead'];
          $("#basicDetailsModal").modal("hide");
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'Updated successfully!';
          setTimeout(function() {
            this.successalert = false;
         }.bind(this), 2000);
        }else{
          $("#basicDetailsModal").modal("hide");
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = res['message'];
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
        }
      },
      err => {
        
      }
    );
  }

  getCustomerDetails(){
    this.leadService.getCustomerCallDetails(this.lead_id).subscribe(
      res => {
        this.customerDetails = res['lead'].contacts;
      },
      err => {
        
      }
    );
  }

  //to change contact status
  changeContactStatus(){
    this.loaderService.display(true);
    this.leadService.changeConStatus(this.lead_id).subscribe(
      res=>{
        this.loaderService.display(false); 
        this.fetchBasicDetails();
        this.successalert = true;
        this.successMessage = "saved successfully";
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
        this.fetchBasicDetails()
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = "Unauthorized user";
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 5000);    
    });
  }
}
