import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesmanagerRoutingModule } from './salesmanager-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SalesLeadMgmtComponent } from './sales-lead-mgmt/sales-lead-mgmt.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgPipesModule } from 'ngx-pipes';
import { SalesReferrersComponent } from './sales-referrers/sales-referrers.component';
import { underScorePipe } from './underScore.pipe';
import { InviteChampionsComponent } from '../../shared/invite-champions/invite-champions.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SalesmanagerRoutingModule,
    AngularMultiSelectModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgPipesModule,
    SharedModule
  ],
  declarations: [DashboardComponent, SalesLeadMgmtComponent, SalesReferrersComponent,underScorePipe]
})
export class SalesmanagerModule { }
