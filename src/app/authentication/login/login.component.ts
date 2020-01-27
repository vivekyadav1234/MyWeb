import { Component, OnInit, Inject } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { Angular2TokenService, UserData } from 'angular2-token';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { LoaderService } from '../../services/loader.service';
import { LeadService } from '../../platform/lead/lead.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { DOCUMENT } from '@angular/common';
import {Location} from '@angular/common';
declare var $: any;

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LeadService]
})
export class LoginComponent extends Angular2TokenService implements OnInit {
  submitted: boolean;
  loginForm: FormGroup;
  currentUserDetails: any;
  private roleUrl = environment.apiBaseUrl + '/v1/users/current_user_details';
  headers: Headers;
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  form: FormGroup;
  otpLoginForm: FormGroup;
  loginOTP: boolean;
  otpField: boolean;
  customoptions: RequestOptions;
  showvalidEmailMsg: boolean = false;
  showvalidPasswordMsg: boolean = false;
  url;
  constructor(
    private location:Location,
    private tokenService: Angular2TokenService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private httpCustom: Http,
    private loaderService: LoaderService,private routes: ActivatedRoute, private routers: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    super(httpCustom,routes,routers);
  }


  ngOnInit() {
    this.url=location.origin;
    
    
    
    this.form = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    })

    this.otpLoginForm = new FormGroup({
      email: new FormControl("", Validators.required),
      otp: new FormControl("", Validators.required)
    })

    this.submitted = false;
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
    this
      .tokenService
      .init({
        apiBase: environment.apiBaseUrl,
        registerAccountPath: 'auth',
        registerAccountCallback: '/customer',
        signInPath: 'auth/sign_in',
        signInRedirect: '/auth/login',
        signOutPath: 'auth/sign_out',
        signOutFailedValidate: true,
        validateTokenPath: 'auth/validate_token',
        resetPasswordCallback: environment.uiBaseUrl + '/reset-password'
      });
  }

  submit(value: any) {
    window.scrollTo(0, 0);
    if (value.email != "" && value.password != "" && value.email != null && value.password != null) {
      this.loaderService.display(true);
      this.submitted = true;
      if (!this.form.valid) { return; }

      this.authService.logIn(value.email, value.password).subscribe(res => {
        if (res.status == 200) {
          this.headers = new Headers({ 'enctype': 'multipart/form-data' });
          this.headers.append('Accept', 'application/json');
          this.headers.append('uid', this.tokenService.currentAuthData.uid);
          this.headers.append('client', this.tokenService.currentAuthData.client);
          this.headers.append('access-token', this.tokenService.currentAuthData.accessToken);
          this.customoptions = new RequestOptions({ headers: this.headers });
          // this.loaderService.display(false);
          this.httpCustom.get(this.roleUrl, this.customoptions)
            .map(response => {
              this.currentUserDetails = response.json();
              Object.keys(this.currentUserDetails).map((key) => { this.currentUserDetails = this.currentUserDetails[key]; })

              localStorage.setItem('user', this.currentUserDetails.roles);
              localStorage.setItem('user_name', this.currentUserDetails.name);
              localStorage.setItem('userId', this.currentUserDetails.id);
              localStorage.setItem('user_level', this.currentUserDetails.user_level);
              localStorage.setItem('isChampion', this.currentUserDetails.is_champion);
              localStorage.setItem('currentUserName', this.currentUserDetails.name);
              localStorage.setItem('currentUserEmail', this.currentUserDetails.email);
              localStorage.setItem('currentUserId', this.currentUserDetails.id);
              
              this.loaderService.display(false);
            } 
            )
            .subscribe(
              this.authService.redirectAfterLogin.bind(this.authService),
              this.afterFailedLogin.bind(this)

            );

        }
      },
        error => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function () {
            this.erroralert = false;
          }.bind(this), 5000);
          return Observable.throw(error);
        }


        //this.authService.redirectAfterLogin.bind(this.authService),
        //this.afterFailedLogin.bind(this)
      );
    }
    else {

      if (value.email == "" || value.email == null) {
        this.showvalidEmailMsg = true;
      }
      if (value.password == "" || value.password == null) {
        this.showvalidPasswordMsg = true;

      }

    }

  }

  onFocusFunction(attrid) {
    if (attrid == 'email' && this.showvalidEmailMsg) {
      this.showvalidEmailMsg = false;
    }
    if (attrid == 'password' && this.showvalidPasswordMsg) {
      this.showvalidPasswordMsg = false;
    }
  }

  signInWithGithub() {
    this.authService.signInWithGithub().subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedLogin.bind(this)
    );
  }

  afterFailedLogin(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;
    for (let attribute in this.loginForm.controls) {
      if (parsed_errors[attribute]) {
        this.loginForm.controls[attribute].setErrors(parsed_errors[attribute]);
      }
    }
    this.loginForm.setErrors(parsed_errors);
  }

  onForgotPasswdSubmit(data) {
    $('#forgotpasswordModal').modal('hide');
    this.loaderService.display(true);
    this.submitted = true;
    this.authService.resetPassword(data['email'])
      .subscribe(
        result => {
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = JSON.parse(result['_body']).message;
          this.loaderService.display(false);
          setTimeout(function () {
            this.successalert = false;
          }.bind(this), 10000);
        },
        error => {
          this.loaderService.display(false);
          this.erroralert = true;
          if (JSON.parse(error['status']) == 404) {
            this.errorMessage = JSON.parse(error['_body']).errors;
          } else {
            this.errorMessage = JSON.parse(error['_body']).message;
          }
          setTimeout(function () {
            this.erroralert = false;
          }.bind(this), 10000);
        }
      );
  }

  showOTPForm() {
    this.loginOTP = true;
  }

  showOTPField() {
    this.authService.otpLogin(this.otpLoginForm.controls['email'].value).subscribe(
      result => {
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = result.message;
        // 
        // this.successMessage = "An OTP has been sent to your registered mobile number - XXXXXXX727. Please enter the  OTP to login";
        this.loaderService.display(false);
        setTimeout(function () {
          this.successalert = false;
        }.bind(this), 10000);
        this.otpField = true;
      },

      error => {
        this.loaderService.display(false);
        this.erroralert = true;
        // if (JSON.parse(error['status']) == 404) {
        //   this.errorMessage = JSON.parse(error['_body']).errors;
        // } else {
        //   this.errorMessage = error.message;
        // }
        this.errorMessage = "No customer present with this email."
        setTimeout(function () {
          this.erroralert = false;
        }.bind(this), 10000);
      }
    );
  }

  confirmOTP() {
    this.authService.confirmOTP(this.otpLoginForm.controls['email'].value,
      this.otpLoginForm.controls['otp'].value).subscribe(
        result => {
          this.loaderService.display(false);
          

          localStorage.setItem("accessToken", result['headers']['access-token']);
          localStorage.setItem("client", result['headers']['client']);
          localStorage.setItem("expiry", result['headers']['expiry']);
          localStorage.setItem("tokenType", result['headers']['token-type']);
          localStorage.setItem("uid", result['headers']['uid']);
          localStorage.setItem("user", "customer");
          localStorage.setItem("userId", result['user']['id']);
          // this.routers.navigate(['/customer']);
          this.document.location.href = '/';
          // this.routers.navigateByUrl('/customer')
          // this.authService.redirectAfterLogin.bind(this.authService);


        }, error => {
          this.loaderService.display(false);
          this.erroralert = true;
          if (JSON.parse(error['status']) == 404) {
            this.errorMessage = JSON.parse(error['_body']).errors;
          } else {
            this.errorMessage = JSON.parse(error['_body']).message;
          }
          setTimeout(function () {
            this.erroralert = false;
          }.bind(this), 10000);
        }
      );
  }


getToken(result){
  this.headers = new Headers({ 'enctype': 'multipart/form-data' });
              this.headers.append('Accept', 'application/json');
              this.headers.append('uid', result.headers.uid);
              this.headers.append('client', result.headers.client);
              this.headers.append('access-token', result.headers['access-token']);
              this.customoptions = new RequestOptions({ headers: this.headers });
              this.httpCustom.get('http://localhost:3000/auth/validate_token', this.customoptions)
                .map(response => {
                  
                  
                  // this.tokenService.atCurrentUserData = response.json().data;
                //   var /** @type {?} */ authData = {
                //     accessToken: result.headers.accessToken,
                //     client: result.headers.client,
                //     expiry: result.headers['expiry'],
                //     tokenType: 'Bearer',
                //     uid: result.headers.uid
                // };
                // this.tokenService.currentAuthData = authData;
                  this.authService.redirectAfterLogin.bind(this.authService),
                  this.afterFailedLogin.bind(this)
                }
                )
                .subscribe(
                  
                );
            }
}
