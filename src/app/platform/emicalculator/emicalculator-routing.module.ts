import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { CreateEmicalculatorComponent } from './create-emicalculator/create-emicalculator.component';

const routes: Routes = [
 	 
	{
      path: '',
      component: CreateEmicalculatorComponent,
      canActivate:[LoggedInGuard]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmicalculatorRoutingModule { }