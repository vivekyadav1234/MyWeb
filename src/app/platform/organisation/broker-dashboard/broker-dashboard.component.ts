import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs/Rx';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { CategoryPipe } from '../../../shared/category.pipe';
import { SortPipe } from '../../../shared/sort.pipe';
import { NgPipesModule } from 'ngx-pipes';
import {BrokerService} from './broker.service';
import { LeadService } from '../../lead/lead.service';
declare var $:any;

@Component({
  selector: 'app-broker-dashboard',
  templateUrl: './broker-dashboard.component.html',
  styleUrls: ['./broker-dashboard.component.css'],
  providers: [BrokerService,LeadService]
})
export class BrokerDashboardComponent implements OnInit {

	brokerId : string;
	role : string;
	erroralertmodal =false;
	errorMessagemodal:string;
	successalertmodal = false;
	successMessagemodal : string;
	errorMessage : string;
	editBrokerInformation : FormGroup;
	addLeadForm : FormGroup;
	erroralert = false;
	successalert = false;
	successMessage : string;
	brokerDetails : any;
	address_proof : any;
  address_proof_fp : any;
  address_proof_name : string;
  ap_basefile : any;
  attachment_file: any;
	attachment_name: string;
	addLeadContactForm : FormGroup;
	basefile: any;
	sourceOfBulkLeads: string;
  inviteChampionForm: FormGroup;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  is_champion;
	constructor(
		private loaderService : LoaderService,
  		private brokerService : BrokerService,
  		private formBuilder: FormBuilder,
  		private leadService: LeadService
	) {
		this.brokerId = localStorage.getItem('userId');
		this.role = localStorage.getItem('user');
	}

	ngOnInit() {
		this.getBrokerDetails();
  		this.loaderService.display(false);
      this.is_champion = localStorage.getItem('isChampion');
  		this.editBrokerInformation = this.formBuilder.group({
	    	name : new FormControl('',Validators.required),
	    	email : new FormControl(''),
	    	contact : new FormControl(''),
	    	pincode : new FormControl(''),
	    	gst_number: new FormControl(''),
	    	pan: new FormControl()
	    });
	    this.addLeadForm = this.formBuilder.group({
	      name : new FormControl("",Validators.required),
	      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
	      contact : new FormControl("",[Validators.required,Validators.pattern(/^[6789]\d{9}$/)]),
	      pincode : new FormControl("")
	    });
	    this.addLeadContactForm = this.formBuilder.group({
	    	phone_number : new FormControl('',Validators.required)
      });
      
      this.inviteChampionForm = this.formBuilder.group({
        name : new FormControl("",[Validators.required]),
        email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                Validators.required]),
        contact : new FormControl("",[Validators.required]),
        parent_id : new FormControl(""),
        champion_level: new FormControl("",[Validators.required]),
        user_type:new FormControl("arrivae_champion")
      });
	}

	getBrokerDetails() {
		this.brokerService.viewBrokerDetails(this.brokerId).subscribe(
			res=>{
				this.brokerDetails = res;
				this.editBrokerInformation.controls['name'].setValue(this.brokerDetails.user.name);
				this.editBrokerInformation.controls['email'].setValue(this.brokerDetails.user.email);
				this.editBrokerInformation.controls['contact'].setValue(this.brokerDetails.user.contact);
				this.editBrokerInformation.controls['pincode'].setValue(this.brokerDetails.user.pincode);
				this.editBrokerInformation.controls['gst_number'].setValue(this.brokerDetails.user.gst_number);
				this.editBrokerInformation.controls['pan'].setValue(this.brokerDetails.user.pan);
			},
			err => {
			}
		);
	}

	addressProofChange(event) {
       this.address_proof = event.srcElement.files[0];
       this.address_proof_name = event.srcElement.files[0].name;
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.ap_basefile = base64.result;
           };
        fileReader.readAsDataURL(this.address_proof);
    }

	updateBrokerInfoFormSubmit(data) {
		this.loaderService.display(true);
    	data["address_proof"] = this.ap_basefile;
    	data["address_proof_name"] = this.address_proof_name;
    	this.brokerService.updateBrokerInformation(data,this.brokerId)
		    .subscribe(
		        res => {
		        	this.brokerDetails = res;
					this.editBrokerInformation.controls['name'].setValue(this.brokerDetails.user.name);
					this.editBrokerInformation.controls['email'].setValue(this.brokerDetails.user.email);
					this.editBrokerInformation.controls['contact'].setValue(this.brokerDetails.user.contact);
					this.editBrokerInformation.controls['pincode'].setValue(this.brokerDetails.user.pincode);
					this.editBrokerInformation.controls['gst_number'].setValue(this.brokerDetails.user.gst_number);
					this.editBrokerInformation.controls['pan'].setValue(this.brokerDetails.user.pan);
					this.ap_basefile = undefined;
					this.address_proof_name = undefined;
					this.loaderService.display(false);
              		this.successalert = true;
              		this.successMessage = "Your Information has been updated successfully!";
              		setTimeout(function() {
              			this.successalert = false;
               		}.bind(this), 3000);
		        },
		        error => {
              		this.erroralert = true;
              		this.loaderService.display(false);
              		this.errorMessage=JSON.parse(error['_body']).message;
              		setTimeout(function() {
                    	this.erroralert = false;
                	}.bind(this), 3000);
		        }
		    );
    }

  addLeadFormSubmit(data) {
    this.loaderService.display(true);
    data['created_by'] = localStorage.getItem('userId');
    var obj = {
			lead:data
		}
    this.brokerService.addLead(data)
      .subscribe(
        res => {
          this.addLeadForm.reset();
          this.loaderService.display(false);
          $('#addNewLeadModal').modal('hide');
          this.successalert = true;
          this.successMessage = "Lead created successfully !!";
          setTimeout(function() {
               this.successalert = false;
          }.bind(this), 3000);
        },
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 3000);
        }
      );
    }

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 || 
        e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9
        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
      return false;
    }
	}

	onChange(event) {
      document.getElementById('extErrorMsg').classList.add('d-none');
      this.basefile = undefined;
     this.attachment_file = event.srcElement.files[0];
     var re = /(?:\.([^.]+))?$/;
     var ext = re.exec(this.attachment_file.name)[1];
      var fileReader = new FileReader();
         var base64;
     if(ext == 'xlsx' || ext == 'xls') {
          fileReader.onload = (fileLoadedEvent) => {
           base64 = fileLoadedEvent.target;
           this.basefile = base64.result;
         };
      }
      else {
        document.getElementById('extErrorMsg').classList.remove('d-none');
      }

      fileReader.readAsDataURL(this.attachment_file);
	}

	submitExcelUpload(){
    this.loaderService.display(true);
    this.leadService.uploadLeadExcel(this.basefile,'','',"")
    .subscribe(
        res => {
          // $('#uploadExcelModal').modal('hide');
          this.loaderService.display(false);
          $('#uploadExcelModal').modal('hide');
          this.successalert = true;
          this.successMessage = "Sheet uploaded successfully !!";
          setTimeout(function() {
                  this.successalert = false;
             }.bind(this), 3000);
        },
        error => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          setTimeout(function() {
                  this.erroralert = false;
             }.bind(this), 3000);
        }
    );
	}

  onLeadContactSubmit(value) {
    this.loaderService.display(true);
    this.brokerService.onLeadContactSubmit(value).
      subscribe(
        res => {
        	// $('#addContactModal').modal('hide');
         this.loaderService.display(false);
         this.addLeadContactForm.reset();
         $('#addContactModal').modal('hide');
         this.successalert = true;
         this.successMessage = 'Lead contact added successfully!';
         setTimeout(function() {
             this.successalert = false;;
         }.bind(this), 3000);
        },
        error => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          setTimeout(function() {
               this.erroralert = false;
           }.bind(this), 3000);
      });         
	}

	closeAddLeadModal(){
		this.addLeadForm.reset();
  }
  
  inviteChampionFormSubmit(data){
    this.loaderService.display(true);
    this.leadService.inviteChampion(data).subscribe(
      res=>{
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
         this.inviteChampionForm.reset();
        // this.champion_user = "";
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
       
      },
      err =>{
        if(err.status == '403' || err.status == '422'){
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 10000);
          this.inviteChampionForm.reset();
        }else {
          this.erroralert = true;
          this.errorMessage = err.message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 10000);
        }
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
      }
    );
  }

  getChampionList(){
    this.loaderService.display(true);
    this.leadService.getChampionList().subscribe(
      res=>{
        this.champion_types = res.allowed_champion_levels;
        this.champion_list_first_level = res["1"];
        this.champion_list_second_level = res["2"];
        this.champion_list_third_level = res["2"];
        this.inviteChampionForm.controls['champion_level'].patchValue("");
        this.inviteChampionForm.controls['parent_id'].patchValue("");
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  getChampionListByLevel(){
    switch(this.inviteChampionForm.controls['champion_level'].value)
    {
     case "1":
          this.champion_user = [];
            break;
     case "2":
          this.champion_user = this.champion_list_first_level;
           break;
     case "3":
          this.champion_user = this.champion_list_second_level;
          break;
    }     
  }
}
