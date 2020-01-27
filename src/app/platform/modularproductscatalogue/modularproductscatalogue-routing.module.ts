import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { CreatemodularproductComponent } from './createmodularproduct/createmodularproduct.component';

const routes: Routes = [
	{
	    path: 'create',
	    canActivate: [LoggedInGuard],
	    component: CreatemodularproductComponent
 	 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModularProductCatlogueRoutingModule { }