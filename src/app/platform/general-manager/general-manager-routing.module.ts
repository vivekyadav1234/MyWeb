import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { GmDashboardComponent } from './gm-dashboard/gm-dashboard.component';
import { GeneralManagerService } from './general-manager.service';
import { GmWeekFilterComponent } from './gm-week-filter/gm-week-filter.component';

const routes: Routes = [
{
    path: 'gm-dashboard',
    canActivate: [LoggedInGuard],
    component: GmDashboardComponent
  },
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [GeneralManagerService],
})
export class GeneralManagerRoutingModule { }