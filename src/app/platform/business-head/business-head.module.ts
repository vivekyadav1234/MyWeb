import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { BusinessHeadRoutingModule } from './business-head-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoqViewComponent } from './boq-view/boq-view.component';
import { BoqListComponent } from './boq-list/boq-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BoqMarginComponent } from './boq-margin/boq-margin.component';
import { InviteChampionsComponent } from '../../shared/invite-champions/invite-champions.component';
import { TrainingMaterialComponent } from './training-material/training-material.component';

// import { CmVariableMarginsComponent } from './cm-variable-margins/cm-variable-margins.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgPipesModule,
    BusinessHeadRoutingModule,
    NgxPaginationModule,
    ChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule

  ],

  declarations: [DashboardComponent, BoqViewComponent, BoqListComponent],


})
export class BusinessHeadModule { }
