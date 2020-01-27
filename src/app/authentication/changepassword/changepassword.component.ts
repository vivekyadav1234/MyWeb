import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {Angular2TokenService } from 'angular2-token';
import { Router , ActivatedRoute} from '@angular/router';
import { ProfileService } from '../../platform/profile/profile/profile.service';
declare var $:any;

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers:[ProfileService]
})
export class ChangepasswordComponent implements OnInit {

  email:string;
  constructor(
  	private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

   submitted = false;
   errorMessage : string;
 erroralert = false;
 successalert = false;
 successMessage : string;
   passwordmatchFlag =false;
   changePasswordForm = this.formBuilder.group({
     password: new FormControl('',[Validators.required,Validators.minLength(8)]),
     password_confirmation : new FormControl('',Validators.required)
   });

   onSubmit(data) {
    this.submitted = true;
    if(data.password_confirmation == data.password) {
      this.passwordmatchFlag = false;
      data['email']=this.email;
      this.profileService.changePassword(data)
      .subscribe(
          result => {
            this.successalert = true;
            this.successMessage = "Password changed successfully. Logout and Login Again !!";
            setTimeout(function() {
                    this.successalert = false;
              }.bind(this), 5000);
          //    $.notify('Password changed successfully. Logout and Login Again!')
          },
          error => {
            this.erroralert = true;
            this.errorMessage=JSON.parse(error['_body']).message;
            setTimeout(function() {
                     this.erroralert = false;
                }.bind(this), 5000);
            return Observable.throw(error);
          }
      );
    }
    else {
      this.passwordmatchFlag = true;
    }
  }
  matchpasswords(val){
    if(val== this.changePasswordForm.value.password) {
      this.passwordmatchFlag = false;
    } else{
      this.passwordmatchFlag = true;
    }
  }
  onFocusFunction(){
    this.passwordmatchFlag = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
              this.email = params['email'];
      });

  }

}
