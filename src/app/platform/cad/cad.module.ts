import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { CadRoutingModule } from './cad-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoqListComponent } from './boq-list/boq-list.component';
import { BoqViewComponent } from './boq-view/boq-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgPipesModule,
    CadRoutingModule,
    NgxPaginationModule
  ],
  declarations: [DashboardComponent, BoqListComponent, BoqViewComponent],
})
export class CadModule { }
