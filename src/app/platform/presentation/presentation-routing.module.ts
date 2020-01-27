import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { CreatepresentationComponent } from './createpresentation/createpresentation.component';
import { ViewpresentationComponent } from './viewpresentation/viewpresentation.component';
import { EditpresentationComponent } from './editpresentation/editpresentation.component';

const routes: Routes = [
  {
    path: 'create',
    canActivate: [LoggedInGuard],
    component: CreatepresentationComponent
  }, 
  {
    path: 'view',
    canActivate: [LoggedInGuard],
    component: ViewpresentationComponent
  }, 
  {
    path: 'edit',
    canActivate: [LoggedInGuard],
    component: EditpresentationComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationRoutingModule { }
