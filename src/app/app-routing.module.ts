import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { CreatepriceconfiguratorComponent } from './platform/priceconfigurator/createpriceconfigurator/createpriceconfigurator.component';
import { LoggedInGuard } from './authentication/logged-in-guard.service';
import { LoggedOutGuard } from './authentication/logged-out-guard.service';
import { CallLogsComponent } from './call-logs/call-logs.component';
import { SmsLogsComponent } from './sms-logs/sms-logs.component';
import { LoginComponent } from './authentication/login/login.component';
import { ForgotpasswordComponent } from './authentication/forgotpassword/forgotpassword.component';

const routes: Routes = [//vivek
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [LoggedOutGuard]
  },
  { path: 'user',
    component: UserComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'profile',
    loadChildren: 'app/account/account.module#AccountModule',
    canLoad: [LoggedInGuard]
  },
  {
    path: 'priceconfigurator',
    component: CreatepriceconfiguratorComponent
    //canLoad: [LoggedInGuard]
  },
  {
    path: 'call_logs',
    component: CallLogsComponent
  },
  {
    path: 'sms_logs',
    component: SmsLogsComponent
  },
  {
    path:'reset-password',
    component:ForgotpasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
