import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SharedModule }                from '../shared/shared.module';

import { LoginComponent }  from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OauthCallbackComponent }  from './oauth-callback.component';
import { SignUpDesignerComponent } from './sign-up-designer/sign-up-designer.component';
import { LoginDesignerComponent } from './login-designer/login-designer.component';
import { LeadSignUpComponent } from './lead-sign-up/lead-sign-up.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SignupBrokerComponent } from './signup-broker/signup-broker.component';
import { SignupManufacturerComponent } from './signup-manufacturer/signup-manufacturer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    SignUpComponent,
    OauthCallbackComponent,
    SignUpDesignerComponent,
    LoginDesignerComponent,
    LeadSignUpComponent,
    ChangepasswordComponent,
    ForgotpasswordComponent,
    SignupBrokerComponent,
    SignupManufacturerComponent,
    LoginComponent
  ],
  providers: []
})
export class AuthenticationModule {}
