import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewCountsComponent } from './overview-counts/overview-counts.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { OverviewRoutingModule } from './overview-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    OverviewRoutingModule
  ],
  declarations: [OverviewCountsComponent]
})
export class OverviewModule { }
 