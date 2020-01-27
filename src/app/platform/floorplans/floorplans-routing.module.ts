import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';

import { CreatefloorplanComponent } from './floorplan/createfloorplan/createfloorplan.component';
import { ViewfloorplanComponent } from './floorplan/viewfloorplan/viewfloorplan.component';
import { EditfloorplanComponent } from './floorplan/editfloorplan/editfloorplan.component';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorplanRoutingModule { }