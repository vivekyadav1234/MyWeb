import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { QuotationService } from '../../quotation/quotation.service';
import {Location} from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-custom-element',
  templateUrl: './custom-element.component.html',
  styleUrls: ['./custom-element.component.css'],
  providers: [LoaderService, QuotationService, LeadService]
})
export class CustomElementComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  pid : number;
  selectedQuotationStatus='all';
  customForm : FormGroup;
  importBoqForm : FormGroup;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  lead_status;
  projectsList;

  constructor(
  	private activatedRoute: ActivatedRoute,
    private router:Router,
    public leadService : LeadService,
    public loaderService : LoaderService,
    private quotationService : QuotationService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private _location: Location
  	) {





  }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
    this.customForm = this.formBuilder.group({
    	custom_elements: this.formBuilder.array( [this.buildItem('')])
    })
  }

   buildItem(val: string) {
	    return new FormGroup({
        category_split:new FormControl(val, Validators.required),
	      name: new FormControl(val, Validators.required),
	      dimension: new FormControl("",Validators.required),
	      designer_remark: new FormControl("",Validators.required),
	      core_material: new FormControl("",Validators.required),
	      shutter_finish: new FormControl(val, Validators.required),
	      ask_price: new FormControl("",Validators.required),
        photo: new FormControl(""),
        asked_timeline: new FormControl(""),

	  	    })
  	}

  	getAttributes(customForm){
    	return customForm.get('custom_elements').controls
  	}

  	pushAttributes(customForm){
    	return customForm.get('custom_elements').push(this.buildItem(''))
  	}
  project_id;
  fetchBasicDetails(){
  	this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {

        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
      },
      err => {
        
      }
    );
  }
  // Method For Uploading Image of Custom element
   photo: any;
   basefile = {};
   basefilename={};
   file_name:any = "";
   file_ext:any = "";
   onChange(event,i) {
	    this.photo = event.srcElement.files[0];
      this.file_name = event.target.files[0].name;
	    var fileReader = new FileReader();
      this.basefilename[i] = event.target.files[0].name;
	    var base64;
	    fileReader.onload = (fileLoadedEvent) => {
	       base64 = fileLoadedEvent.target;
	      this.basefile[i] = base64.result
	    };
	    fileReader.readAsDataURL(this.photo);
    }
  //method ends here

  //Method for Save Custom Form
   addCustom(data){
   	this.loaderService.display(true);
   	let arr =  this.basefile;
   	data.custom_elements.forEach(function (value, i) {
   		if(arr[i] == undefined){
           value.photo = '';
   		}
   		else{
   		  value.photo = arr[i];
   		}

	    });
     let arr1 =  this.basefilename;
     data.custom_elements.forEach(function (value, i) {
       if(arr1[i] != undefined){
           value.file_name = arr1[i];
       }

      });

   	this.quotationService.addCustom(data,this.project_id).subscribe(
   		res=>{
   		    this.backClicked();
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
  //ed Method for Save Custom Form
  backClicked() {
    this._location.back();


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

}
