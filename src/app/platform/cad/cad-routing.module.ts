import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import {CadService} from './cad.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoqListComponent } from './boq-list/boq-list.component';
import { BoqViewComponent } from './boq-view/boq-view.component';


const routes: Routes = [
  {
      path: 'dashboard',
      canActivate: [LoggedInGuard],
      component: DashboardComponent
  },
  {
      path: 'projects/:projectId/boq-list',
      canActivate: [LoggedInGuard],
      component: BoqListComponent
  },
  {
      path: 'projects/:projectId/quotation/:quoteId/boq-view',
      canActivate: [LoggedInGuard],
      component: BoqViewComponent
  },

 ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CadService]

})
export class CadRoutingModule { }
