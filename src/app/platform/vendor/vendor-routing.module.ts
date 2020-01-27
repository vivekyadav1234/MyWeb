import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import {VendorService} from './vendor.service';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
      path: '',
      canActivate: [LoggedInGuard],
      component: DashboardComponent
  }
 ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [VendorService]

})
export class VendorRoutingModule { }
