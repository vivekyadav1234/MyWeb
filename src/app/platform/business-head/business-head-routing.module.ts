import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import {BusinessHeadService} from './business-head.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoqViewComponent } from './boq-view/boq-view.component';
import { BoqListComponent } from './boq-list/boq-list.component';
import { CmVariableMarginsComponent } from './cm-variable-margins/cm-variable-margins.component';
import { BoqMarginComponent } from './boq-margin/boq-margin.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FhiDataComponent } from './fhi-data/fhi-data.component';

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
      path: 'aws/fhi-data',
      canActivate: [LoggedInGuard],
      component: FhiDataComponent
  },
  {
      path: 'projects/:projectId/quotation/:quoteId/boq-view',
      canActivate: [LoggedInGuard],
      component: BoqViewComponent
  },
  // {
  //   path:'cm-variable-margins',
  //   canActivate:[LoggedInGuard],
  //   component:CmVariableMarginsComponent
  // }
];

@NgModule({
  imports: [AngularMultiSelectModule,
  RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BusinessHeadService]
})
export class BusinessHeadRoutingModule { }
