import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { QuotationService } from '../../quotation/quotation.service';
import { DesignerService } from '../../designer/designer.service';
declare var $:any;

@Component({
  selector: 'app-custom-view',
  templateUrl: './custom-view.component.html',
  styleUrls: ['./custom-view.component.css'],
  providers: [LoaderService, QuotationService, LeadService,DesignerService]
})
export class CustomViewComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  pid : number;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  lead_status;
  editCustomForm: FormGroup;
 

  constructor(
  	private activatedRoute: ActivatedRoute,
    private router:Router,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private quotationService : QuotationService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    public designerService : DesignerService


  	) { }

  ngOnInit() {

  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.editCustomForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
       dimension: new FormControl("",Validators.required),
       designer_remark: new FormControl("",Validators.required),
        core_material: new FormControl("",Validators.required),
        shutter_finish: new FormControl("", Validators.required),
        ask_price: new FormControl("",Validators.required),
        photo: new FormControl(""),
        category_split:new FormControl(""),
        //asked_timeline: new FormControl("")
    });
    this.fetchBasicDetails();
    
  }
  project_id;
  fetchBasicDetails(){
  	this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {

        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.fetchCustomElements();
      },
      err => {
        
      }
    );
 
  }
  customList;
  fetchCustomElements(){
  	this.quotationService.getCustomElements(this.project_id).subscribe(
  		res=>{
          this.customList = res['custom_elements'];
  		},

  		err=>{
          
  		}
  		);

  }
  confirmAndDelete(id:number){
  	if(confirm("Are You sure you want to delete this Element?")== true){
  		
  		this.DeleteElement(id);

  	}
  }
  DeleteElement(value){
  this.loaderService.display(true);
   this.quotationService.deleteElement(this.project_id,value).subscribe(
   	res=>{
   		this.fetchCustomElements();
   	   this.loaderService.display(false);
          this.successalert = true;
            this.successMessage = " Custom Element Deleted successfully";
            setTimeout(function() {
                this.successalert = false;
             }.bind(this), 2000);

   	},
   	err=>{
      
   	}
   	);
  }
  customElementId;
  getCustomDetails(customId){
    this.customElementId = customId;
    this.quotationService.getCustomDetail(customId,this.project_id).subscribe(
      res=>{
        this.editCustomForm.controls['name'].setValue(res['custom_element'].name);
        this.editCustomForm.controls['dimension'].setValue(res['custom_element'].dimension);
        this.editCustomForm.controls['designer_remark'].setValue(res['custom_element'].designer_remark);
        this.editCustomForm.controls['core_material'].setValue(res['custom_element'].core_material);
        this.editCustomForm.controls['shutter_finish'].setValue(res['custom_element'].shutter_finish);
        this.editCustomForm.controls['ask_price'].setValue(res['custom_element'].ask_price);
        this.editCustomForm.controls['category_split'].setValue(res['custom_element'].category_split);
        //this.editCustomForm.controls['asked_timeline'].setValue(res['custom_element'].asked_timeline);
        if(res['custom_element'].photo != '/images/original/missing.png'){
           document.getElementById("output").setAttribute('src',res['custom_element'].photo);
        }
        else{
          document.getElementById("output").setAttribute('src','');
        }
       
 
      },
      err=>{
       
      }
      );

  }
  basefile;
  photo: any;
  onEditCustomFormChange(event){
    var output = document.getElementById('output');
    this.photo = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile = base64.result
    };
    fileReader.readAsDataURL(this.photo);
    document.getElementById('output').setAttribute('src',URL.createObjectURL(event.target.files[0]));
  }
  updateCustomElementDetails(data){
    $('#customEdit').modal('hide');
    data['photo'] = this.basefile;
    var obj = {
      "custom_element" : data
    }
    this.loaderService.display(true);

   this.quotationService.updateCustomElement(obj,this.project_id,this.customElementId).subscribe(
     res=>{

      this.fetchCustomElements();
      this.successalert = true;
      this.successMessage = 'Custom Element updated successfully!';
      this.loaderService.display(false);
       setTimeout(function() {
          this.successalert = false;
      }.bind(this), 10000);
     },
     err=>{
      
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

}
