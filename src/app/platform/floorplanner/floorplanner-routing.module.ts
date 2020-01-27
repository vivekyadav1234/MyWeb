import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { FloorplannereditorComponent } from './floorplannereditor/floorplannereditor.component';


const routes: Routes = [
      {
        path: 'editor',
        canActivate: [LoggedInGuard],
        component: FloorplannereditorComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorplannerRoutingModule { }