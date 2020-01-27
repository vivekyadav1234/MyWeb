import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';

import { ActivityLogsRoutingModule } from './activity-logs-routing.module';
import { ViewlogsComponent } from './viewlogs/viewlogs.component';

@NgModule({
  imports: [
    CommonModule,
    ActivityLogsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [ViewlogsComponent]
})
export class ActivityLogsModule { }
