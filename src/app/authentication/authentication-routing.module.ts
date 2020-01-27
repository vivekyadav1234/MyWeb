import { NgModule }       from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { LoggedInGuard }  from './logged-in-guard.service';
import { LoggedOutGuard } from './logged-out-guard.service';
import { AuthService }    from './auth.service';
import { CustomvalidationService } from './customvalidation.service';

import { LoginComponent }  from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginDesignerComponent } from './login-designer/login-designer.component';
import { SignUpDesignerComponent } from './sign-up-designer/sign-up-designer.component';
import { OauthCallbackComponent }  from './oauth-callback.component';
import {LeadSignUpComponent} from './lead-sign-up/lead-sign-up.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SignupBrokerComponent } from './signup-broker/signup-broker.component';
import { SignupManufacturerComponent } from './signup-manufacturer/signup-manufacturer.component';

const routes: Routes = [
  { path: 'log-in', component: LoginComponent },
  { path: 'login', redirectTo: '/log-in' },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'signup', redirectTo: '/sign-up' },
  { path: 'login-designer', component: LoginDesignerComponent },
  { path: 'logindesigner', redirectTo: '/login-designer'},
  { path: 'sign-up-designer', component: SignUpDesignerComponent },
  { path: 'signupdesigner', redirectTo: '/sign-up-designer' },
  { path:'lead-sign-up',component:LeadSignUpComponent },
  { path: 'leadSignUp', redirectTo:'/lead-sign-up'},
  { path:'reset-password', component:ForgotpasswordComponent},
  { path:'resetpassword',redirectTo:'/reset-password'},
  { path: 'signup-broker', component: SignupBrokerComponent },
  { path: 'signupbroker', redirectTo: '/signup-broker' },
  { path: 'signup-manufacturer', component: SignupManufacturerComponent },
  { path: 'signupmanufacturer', redirectTo: '/signup-manufacturer' }
] 

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivateChild: [LoggedOutGuard],
        children: routes
      },
      { path: 'oauth_callback', component: OauthCallbackComponent }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
    LoggedInGuard,
    AuthService,
    LoggedOutGuard,
    CustomvalidationService
  ]
})
export class AuthenticationRoutingModule {}
