import { Component, OnInit } from '@angular/core';
import {FormControl,FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Router,RouterModule,ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { LeadService } from '../../platform/lead/lead.service';
declare var $ : any;

@Component({
  selector: 'app-invite-champions',
  templateUrl: './invite-champions.component.html',
  styleUrls: ['./invite-champions.component.css']
})
export class InviteChampionsComponent implements OnInit {

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
  currentUserName;
  currentUserEmail;
  currentUserId;
  addLeadForm : FormGroup= new FormBuilder().group({
    name : new FormControl("",Validators.required),
    email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    contact : new FormControl("",[Validators.required,Validators.pattern(/^[6789]\d{9}$/)]),
    pincode : new FormControl("")
  });
  user_level: string;

  constructor(
    private loaderService : LoaderService,
    private leadService: LeadService,
    private formBuilder:FormBuilder
    ) { 
  }

  ngOnInit() {
    this.loaderService.display(false);
    this.currentUserEmail = localStorage.getItem('currentUserEmail');
    this.currentUserName = localStorage.getItem('currentUserName');
    this.currentUserId = localStorage.getItem('currentUserId');

    

    

    this.inviteChampionForm = this.formBuilder.group({
      name : new FormControl("",[Validators.required]),
      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
              Validators.required]),
      contact : new FormControl("",[Validators.required]),
      parent_id : new FormControl(""),
      champion_level: new FormControl("",[Validators.required]),
      user_type:new FormControl("",[Validators.required]),
      selectedLevel2Referal: new FormControl(),
      selectedLevel2Referalpatner: new FormControl(),
    });
  }

  inviteChampionFormSubmit(data){
    this.loaderService.display(true);
    if(data.champion_level === "3"){
      data.parent_id = $('#level2Dropdown').val();
    }
    else{
      data.parent_id = localStorage.getItem('currentUserId');
    }
    
    this.leadService.inviteChampion(data).subscribe(
      res=>{
        // $('#inviteChampionModal').modal('hide');
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
          }.bind(this), 90000);
          this.inviteChampionForm.reset();
        }else {
          this.erroralert = true;
          this.errorMessage = err.message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 10000);
        }
        // $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
      }
    );
    setTimeout(function() {
      $('#inviteChampionModal').modal('hide');
    }.bind(this), 10000);

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

  // getChildChampionDetailsByLevel(){
  //   this.leadService.getChildChampionListByChampionLevel(+this.inviteChampionForm.controls['parent_id'].value).subscribe(
  //     res=>{
  //       this.child_champion_user = res.champions;
  //       this.loaderService.display(false);
  //     },
  //     err =>{
  //       
  //       this.loaderService.display(false);
  //     }
  //   );
  // }

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
     this.showChildDropdown = true;
     this.showReferralType = true;
     this.showLevel2User = true;
     // this.champion_user = this.champion_list_first_level;
     // this.inviteChampionForm.controls['parent_id'].patchValue(+this.parent_id);
     break;
    }     
  }

  onChangeLevel2ReferalType(event){
    this.leadService.getlevel2champion(+this.currentUserId,event).subscribe(
      res=>{
        this.level2_champion_user = res.champions;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

    getChampionList(){
      this.currentUserEmail = localStorage.getItem('currentUserEmail');
    this.currentUserName = localStorage.getItem('currentUserName');
    this.currentUserId = localStorage.getItem('currentUserId');
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
      // this.inviteChampionForm.controls['parent_id'].patchValue("");
      this.loaderService.display(false);
      },
      err =>{
      
      this.loaderService.display(false);
      }
    );
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

