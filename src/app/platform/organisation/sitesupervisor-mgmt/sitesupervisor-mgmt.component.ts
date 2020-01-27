import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../../lead/lead.service';
import {CsagentService} from '../csagentdashboard/csagent.service';
import { Observable } from 'rxjs';
import {Lead} from '../../lead/lead';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';
import { LoaderService } from '../../../services/loader.service';
import { SortPipe } from '../../../shared/sort.pipe';
declare var $:any;


@Component({
  selector: 'app-sitesupervisor-mgmt',
  templateUrl: './sitesupervisor-mgmt.component.html',
  styleUrls: ['./sitesupervisor-mgmt.component.css'],
  providers: [LeadService,CsagentService]
})
export class SitesupervisorMgmtComponent implements OnInit {

	siteSupervisors: any[];
	leadActionAccess = ['admin','lead_head'];
	role : string;
	errorMessage : string;
	erroralert = false;
	erroralertmodal = false;
	errorMessagemodal : string;
	successMessagemodal : string;
	successalertmodal = false;
	successalert = false;
	successMessage : string;
	cmList : any[];
	inviteChampionForm: FormGroup;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  is_champion;

  constructor(
  	private router: Router,
  	private route:ActivatedRoute,
  	private leadService:LeadService,
  	private csagentService:CsagentService,
  	private loaderService:LoaderService,
  	private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  	this.getSiteSupervisorList();
		this.getCMList();
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

  getSiteSupervisorList(){

  	this.loaderService.display(true);
	    this.leadService.getSiteSupervisorList().subscribe(
	        res => {
	          this.siteSupervisors = res['users'];
	          // Object.keys(leads).map((key)=>{ this.leads= leads[key];});
	          this.loaderService.display(false);
	        },
	        error =>  {
	          this.erroralert = true;
	          this.errorMessage = <any>JSON.parse(error['_body']).message;
	          this.loaderService.display(false);
	          //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
	        }
	    );

  }

  getCMList(){

  	this.leadService.getCommunityManagersList()
	    .subscribe(
	      res => {
	        Object.keys(res).map((key)=>{ this.cmList= res[key];});
	      },
	      error => {
	        this.erroralert = true;
	        this.errorMessage=JSON.parse(error['_body']).message;
	      }
	    );

  }

  assignSiteSupervisorToCm(sitesupervisor_id){
  	this.loaderService.display(true);
  	this.leadService.assignSiteSupervisorToCm(sitesupervisor_id,this.cmId)
	    .subscribe(
	      res => {
	      	this.loaderService.display(true);
	      	this.successalert = true;
	      	this.successMessage="Assigned community manager";
	      	this.loaderService.display(false);
	        // Object.keys(res).map((key)=>{ this.cmList= res[key];});
	      },
	      error => {
	        this.erroralert = true;
	        this.errorMessage=JSON.parse(error['_body']).message;
	        this.loaderService.display(false);
	      }
	    );
  }

  cmId:any
  selectCm(id){
  	this.cmId = id;
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

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
      return false;
    }
  }

}
