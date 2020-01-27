import { Component, OnInit } from '@angular/core';
import { SalesManagerService } from '../sales-manager.service';
import {LeadService} from '../../lead/lead.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import {Location} from '@angular/common';
import { FormControl,
	FormArray,
	FormBuilder,
	FormGroup,
	Validators } from '@angular/forms';
// import {LeadquestionnaireComponent} from '../../../../shared/leadquestionnaire/leadquestionnaire.component';
declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [SalesManagerService,LeadService]

})
export class DashboardComponent implements OnInit {
	countres;
  referreresList:any = [];
  user_id;
  inviteChampionForm: FormGroup;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  successalert: boolean;
  successMessage: any;
  erroralert: boolean;
  errorMessage: any;
  parent_id: any;
  showChildDropdown: boolean;
  child_champion_user: any;
  is_champion;
  from_date;
  to_date;


  constructor(
  	private route:ActivatedRoute,
	private leadService:LeadService,
  private salesService: SalesManagerService,
	private loaderService:LoaderService,
	private formBuilder:FormBuilder,
	public router:Router, 
	public location:Location


  	) { }

  ngOnInit() {
    this.user_id = localStorage.getItem('userId');
  	this.getCountForSalesLead();
    this.getReferrersList();
    this.is_champion = localStorage.getItem('isChampion');
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
  getCountForSalesLead(referrerTypeId?){
    this.loaderService.display(true);
  	this.salesService.getCountForSalesLead(this.referrer_type_value ,this.from_date , this.to_date).subscribe(
  		res=>{
  			
         this.loaderService.display(false);
  			this.countres=res;

  		},
  		err=>{
  			
         this.loaderService.display(false);

  		});
  }
  getReferrersList(page?,search?){
    this.salesService.getReferrersList(this.user_id,page,search).subscribe(
      res=>{
        
       

        res= res.json();
        this.referreresList = res['users'];
        
        

      },
      err=>{
        

      })
  }
  referrer_type_value;
  onChangeFilterData(value){
    this.referrer_type_value = value;
  }
  onFilterDataSubmit(){
    this.getCountForSalesLead();
  }


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

  downloadExcelBoq(){
    this.loaderService.display(true);
    this.leadService.exportBoq().subscribe(
      res=>{
        this.loaderService.display(false);
        
        this.successalert = true;
        this.successMessage = 'The BOQ report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 2000);
      },
      err=>{
        
      });
  }

  downloadPaymentReport() {
    this.leadService.exportPaymentEvent().subscribe(
      res => {
      this.successalert = true;
        this.successMessage = 'The Payment report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 5000);
      },
      err => {
        
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
       break;
 case "3":
 this.getChampionUserListByLevel();
 this.showChildDropdown = true;
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

  fromDate() {
    $(".fromDateSpan").hide();
    $(".fromDate").show();
    
  }
  
  toDate() {
    $(".toDateSpan").hide();
    $(".toDate").show();
  }

}
