import { NgModule } from '@angular/core';
import { Routes, Router,RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';

const routes: Routes = [
  {
    path: '' || 'dashboard',
    canActivate: [LoggedInGuard],
    component: DashboardComponent
  },
  {
    path: 'referral/leads',
    canActivate: [LoggedInGuard],
    component:LeadDetailsComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralRoutingModule { }
