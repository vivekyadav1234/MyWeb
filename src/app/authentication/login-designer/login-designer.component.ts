import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {Angular2TokenService} from 'angular2-token';
import { AuthService }      from '../auth.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login-designer',
  templateUrl: './login-designer.component.html',
  styleUrls: ['./login-designer.component.css']
})
export class LoginDesignerComponent implements OnInit {
	
	submitted: boolean;
	logindesignerForm: FormGroup;

  constructor(
  	private tokenService: Angular2TokenService,
    private authService: AuthService,
    private formBuilder: FormBuilder
    ) { }

  	ngOnInit() {
	  	this.submitted = false;
	    this.logindesignerForm = this.formBuilder.group({
	      email: ['', Validators.required],
	      password: ['', Validators.required]
	    });

	    this
	      .tokenService
	      .init({
	        apiBase: environment.apiBaseUrl,
	        registerAccountPath:  'auth',
        	registerAccountCallback: '/designer',
	        signInPath: 'auth/sign_in',
	        signInRedirect: '/auth/login',
	        signOutPath: 'auth/sign_out',
	        signOutFailedValidate: true,
	        validateTokenPath: 'auth/validate_token',
	        resetPasswordCallback: environment.uiBaseUrl+'/reset-password'
	      });
  	}

  	submit(value: any) {
	    this.submitted = true;
	    if (!this.logindesignerForm.valid) { return; }

	    this.authService.logIn(value.email, value.password).subscribe(
	      this.authService.redirectAfterLogin.bind(this.authService),
	      this.afterFailedLogin.bind(this)
	    );
  	}

  	afterFailedLogin(errors: any) {
	    let parsed_errors = JSON.parse(errors._body).errors;
	    for (let attribute in this.logindesignerForm.controls) {
	      if (parsed_errors[attribute]) {
	        this.logindesignerForm.controls[attribute].setErrors(parsed_errors[attribute]);
	      }
	    }
    	this.logindesignerForm.setErrors(parsed_errors);
  	}

}
