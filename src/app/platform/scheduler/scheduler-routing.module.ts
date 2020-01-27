import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { CreateschedulerComponent } from './createscheduler/createscheduler.component';


const routes: Routes = [
  	{
	    path: 'create',
	    canActivate: [LoggedInGuard],
	    component: CreateschedulerComponent
 	 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule { }