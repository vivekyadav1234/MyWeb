import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { GeneralManagerRoutingModule } from './general-manager-routing.module';
import { GmDashboardComponent } from './gm-dashboard/gm-dashboard.component';
import { GmWeekFilterComponent } from './gm-week-filter/gm-week-filter.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgPipesModule,
    ChartsModule,
    NgxPaginationModule,
    NgSelectModule,
    FormsModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    GeneralManagerRoutingModule,
    OwlDateTimeModule,
    SharedModule,
    OwlNativeDateTimeModule
  ],
  declarations: [GmDashboardComponent, GmWeekFilterComponent]
})
export class GeneralManagerModule { }
