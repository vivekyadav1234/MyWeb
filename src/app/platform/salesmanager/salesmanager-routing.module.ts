import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { SalesManagerService } from './sales-manager.service';
import { SalesLeadMgmtComponent } from './sales-lead-mgmt/sales-lead-mgmt.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesReferrersComponent } from './sales-referrers/sales-referrers.component';



const routes: Routes = [
 {
 	path:'dashboard',
 	canActivate: [LoggedInGuard],
    component: DashboardComponent
 },
 {
 	path:'sales/sales-leads',
 	canActivate: [LoggedInGuard],
    component: SalesLeadMgmtComponent
 },
 {
 	path:'lead-list',
 	canActivate: [LoggedInGuard],
    component: SalesLeadMgmtComponent
 },
 {
 	path:'referrer-list',
 	canActivate: [LoggedInGuard],
    component: SalesReferrersComponent
 },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SalesManagerService]
})
export class SalesmanagerRoutingModule { }
