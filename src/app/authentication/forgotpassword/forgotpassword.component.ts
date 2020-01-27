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
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../auth.service';
declare var $:any;

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  resetPasswordToken:string;
  constructor(
  	private formBuilder: FormBuilder,
    private authService: AuthService,
    private _tokenService: Angular2TokenService,
    private route :ActivatedRoute,
    private router: Router,
    private loaderService : LoaderService,
  ) { }
  submitted = false;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
   passwordmatchFlag =false;
   resetPasswordForm = this.formBuilder.group({
     password: new FormControl('',[Validators.required,Validators.minLength(8)]),
     passwordConfirmation : new FormControl('',Validators.required)
   });

  ngOnInit() {
    this.route.queryParams.subscribe(params=> {
      this.resetPasswordToken = params['token']
    });
    this.loaderService.display(false);
  }


   onSubmit(data) {
     this.loaderService.display(true);
    this.submitted = true;
    if(data.passwordConfirmation == data.password) {
      this.passwordmatchFlag = false;
      this._tokenService.updatePassword({
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
          resetPasswordToken:  this.resetPasswordToken,
      }).subscribe(
          res =>   {
           this.successalert = true;
           this.successMessage = "Password Updated Successfully !!";
           setTimeout(function() {
                   this.successalert = false;
                   if(JSON.parse(res['_body']).data.email &&
                      (localStorage.getItem('user')==null ||localStorage.getItem('user')==undefined)) {
                      if(this.authService.isLoggedIn()) {
                        this.authService.logOut();
                        this.router.navigateByUrl('/log-in');
                      }
                   }
             }.bind(this), 2000);
             this.loaderService.display(false);

          },
          error => {
             this.erroralert = true;
             this.errorMessage = "Something Went Wrong. Please try Again !!";
             setTimeout(function() {
               this.erroralert = false;
             }.bind(this), 2000);

             this.loaderService.display(false);
          }
      );
    } else {
      this.passwordmatchFlag = true;
    }
  }
  matchpasswords(val){
    if(val== this.resetPasswordForm.value.password) {
      this.passwordmatchFlag = false;
    } else{
      this.passwordmatchFlag = true;
    }
  }
  onFocusFunction(){
    this.passwordmatchFlag = false;
  }
}
