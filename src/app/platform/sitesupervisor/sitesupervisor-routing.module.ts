import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import {SitesupervisorService} from './sitesupervisor.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListRequestComponent } from './list-request/list-request.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { ListProjectrequestComponent } from './list-projectrequest/list-projectrequest.component';

const routes: Routes = [
  {
      path: 'dashboard',
      canActivate: [LoggedInGuard],
      component: DashboardComponent
  },
  {
  	path: 'list-request',
	  canActivate: [LoggedInGuard],
	  component: ListRequestComponent
  },
  {
  	path: ':project_type/list-projects',
	  canActivate: [LoggedInGuard],
	  component: ListProjectsComponent
  }
  ,
  {
  	path: 'projects/:id/requests',
	  canActivate: [LoggedInGuard],
	  component: ListProjectrequestComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SitesupervisorService]
})
export class SitesupervisorRoutingModule { }
