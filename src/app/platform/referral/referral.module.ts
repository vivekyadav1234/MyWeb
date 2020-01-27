import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralRoutingModule } from './referral-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgPipesModule } from 'ngx-pipes';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeadDetailsComponent } from './lead-details/lead-details.component';

@NgModule({
  imports: [
    CommonModule,
    ReferralRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    NgPipesModule
  ],
  declarations: [DashboardComponent, LeadDetailsComponent]
})
export class ReferralModule { }
