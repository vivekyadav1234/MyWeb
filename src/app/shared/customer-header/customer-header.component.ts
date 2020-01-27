import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../authentication/auth.service';
import { UserDetailsService } from '../../services/user-details.service';
import { LeadService } from '../../platform/lead/lead.service';
import {
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

declare var $: any;

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.css'],
   providers: [UserDetailsService,LeadService]
})
export class CustomerHeaderComponent implements OnInit {
  champion_user: any;
    champion_list_first_level: any[];
    champion_list_second_level: any[];
    champion_list_third_level: any;
    champion_types: any;
    inviteChampionForm: FormGroup;
  errorMessage: any;
  erroralert: boolean;
  successMessage: any;
  successalert: boolean;
  is_champion;
  role:string;
  url;
  constructor(private authService: AuthService,public userDetailService: UserDetailsService,
    private leadService : LeadService,
    private formBuilder:FormBuilder,
    private loaderService : LoaderService) {
  }

  ngOnInit() {
     this.url=location.origin;
     
     
      this.inviteChampionForm = this.formBuilder.group({
      name : new FormControl("",[Validators.required]),
      email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
              Validators.required]),
      contact : new FormControl("",[Validators.required]),
      parent_id : new FormControl(""),
      champion_level: new FormControl("",[Validators.required]),
      user_type:new FormControl("arrivae_champion")
    });

      this.is_champion = localStorage.getItem('isChampion');
      this.role=localStorage.getItem('user');
  }

  ngAfterViewChecked() {
    this.addClassActive();
  }

  logOut(): void {
  
    this.authService.logOut();
  }
  isLoggedIn(): boolean {
     return this.authService.isLoggedIn();
  }


  addClassActive() {
    if ($('.checkActive').hasClass('active')) {
      $('#Designs').removeClass('active');
    }
    else {
      $('#Designs').addClass('active');
    }
  }

  addClass() {
    $('#Designs').addClass('active');
  }

  removeClass() {
    $('#Designs').removeClass('active');
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
