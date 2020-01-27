import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { NgPipesModule } from 'ngx-pipes';
import { GanttChartModule } from '../../shared/gantt-chart/gantt-chart.module';
//import { BrowserModule } from '@angular/platform-browser';
import { CreateschedulerComponent } from './createscheduler/createscheduler.component';

@NgModule({
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgPipesModule,
    //BrowserModule,
    GanttChartModule
  ],
  declarations: [CreateschedulerComponent]
})
export class SchedulerModule { }
