import { Component, OnInit } from '@angular/core';
import {Angular2TokenService} from 'angular2-token';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthService } from '../auth.service';
import {environment} from '../../../environments/environment';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  submitted: boolean;
  signupForm: FormGroup;
  
  constructor(
    private tokenService: Angular2TokenService,
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.submitted = false;
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['',Validators.required],
      contact: ['', Validators.required],
      password: ['', Validators.required]
    });

    this
      .tokenService
      .init({
        apiBase: environment.apiBaseUrl,
        registerAccountPath: 'auth',
        registerAccountCallback: '/',
        validateTokenPath: 'auth/validate_token'
      });
  }

  submit(value: any) {
    this.submitted = true;
    if (!this.signupForm.valid) { return; }

    this.authService.signUp(value.name, value.email, value.contact, value.password).subscribe(
      this.authService.redirectAfterLogin.bind(this.authService),
      this.afterFailedLogin.bind(this));
  }

  afterFailedLogin(errors: any) {
    let parsed_errors = JSON.parse(errors._body).errors;
    for (let attribute in this.signupForm.controls) {
      if (parsed_errors[attribute]) {
        this.signupForm.controls[attribute].setErrors(parsed_errors[attribute]);
      }
    }
    this.signupForm.setErrors(parsed_errors);
  }
}
