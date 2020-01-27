import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router,RouterModule,ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { ReferralService } from '../referral.service';
import { LeadService } from '../../lead/lead.service';
declare var $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[ReferralService,LeadService]
})
export class DashboardComponent implements OnInit {

	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
	basefile: any;
	attachment_file: any;
	attachment_name: string;
	inviteChampionForm: FormGroup;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  parent_id: any;
  showChildDropdown: boolean;
  child_champion_user: any;
  showReferralType:boolean;
  showLevel2User:boolean;
  level2_champion_user:any;
  is_champion;
	addLeadForm : FormGroup= new FormBuilder().group({
    name : new FormControl("",Validators.required),
    email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    contact : new FormControl("",[Validators.required,Validators.pattern(/^[6789]\d{9}$/)]),
    pincode : new FormControl("")
  });
	user_level: string;
  constructor(
  	private loaderService : LoaderService,
  	private referralService:ReferralService,
		private leadService: LeadService,
		private formBuilder:FormBuilder 
  ) {
		this.role = localStorage.getItem('user');
		this.user_level = localStorage.getItem('user_level');
  }

  ngOnInit() {
		this.loaderService.display(false);
    this.is_champion = localStorage.getItem('isChampion');
		this.inviteChampionForm = this.formBuilder.group({
      name : new FormControl("",[Validators.required]),
      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
              Validators.required]),
      contact : new FormControl("",[Validators.required]),
      parent_id : new FormControl(""),
      champion_level: new FormControl("",[Validators.required]),
      user_type:new FormControl("",[Validators.required]),
    });
  }

  addLeadFormSubmit(data) {
    this.loaderService.display(true);
    data['created_by'] = localStorage.getItem('userId');
    var obj = {
			lead:data
		}
    this.referralService.addLead(data)
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

	closeAddLeadModal(){
		this.addLeadForm.reset();
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
		this.leadService.uploadLeadExcel(this.basefile,"","","")
		.subscribe(
			res => {
			  $('#uploadExcelModal').modal('hide');
			  this.loaderService.display(false);
			  this.successalert = true;
			  this.basefile = undefined;
			  this.successMessage = res['new_leads'].length+" new leads uploaded successfully !!";
			  setTimeout(function() {
					  this.successalert = false;
				 }.bind(this), 5000);
			},
			error => {
			  this.loaderService.display(false);
			  this.erroralert = true;
			  this.errorMessage = JSON.parse(error['_body']).message;
			  setTimeout(function() {
					  this.erroralert = false;
				 }.bind(this), 25000);
			}
		);
	}
	// checkEmail(email){
	// 	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 //  	return re.test(email);
	// }

	inviteChampionFormSubmit(data){
    this.loaderService.display(true);
    if(data.champion_level === "3"){
      data.parent_id = $('#level2Dropdown').val();
    }
    
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
        this.showChildDropdown = false;
        this.child_champion_user = [];
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
    this.showChildDropdown = false;
    this.child_champion_user = [];
    this.champion_user = [];
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

getChampionUserListByLevel(){
this.leadService.getChampionListByChampionLevel(1).subscribe(
  res=>{
    this.champion_user = res.champions;
    this.loaderService.display(false);
  },
  err =>{
    
    this.loaderService.display(false);
  }
);

}

getChildChampionDetailsByLevel(){
this.leadService.getChildChampionListByChampionLevel(+this.inviteChampionForm.controls['parent_id'].value).subscribe(
  res=>{
    this.child_champion_user = res.champions;
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
      this.showChildDropdown = false;
      this.champion_user = [];
        break;
 case "2":
      this.showChildDropdown = false;
      this.champion_user = this.champion_list_first_level;
      this.showReferralType = true;
      this.showLevel2User = false;
       break;
 case "3":
 this.getChampionUserListByLevel();
 this.showChildDropdown = true;
 this.showReferralType = true;
 this.showLevel2User = true;
 this.inviteChampionForm.controls['parent_id'].patchValue(+this.parent_id);
 break;
}     
}

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
      return false;
    }
  }

  onChangeLevel2ReferalType(event){
    this.leadService.getlevel2champion(+this.inviteChampionForm.controls['parent_id'].value,event).subscribe(
      res=>{
        this.level2_champion_user = res.champions;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }
}
