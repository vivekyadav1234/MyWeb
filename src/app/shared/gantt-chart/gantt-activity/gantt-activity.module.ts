import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttActivityComponent } from './gantt-activity/gantt-activity.component';
import { GanttTimeScaleComponent } from './gantt-time-scale/gantt-time-scale.component';
import { ActivityBackgroundComponent } from './activity-background/activity-background.component';
import { ActivityBarsComponent } from './activity-bars/activity-bars.component';

@NgModule({
  imports: [
    CommonModule
  ],
  	exports: [
        GanttActivityComponent,
        GanttTimeScaleComponent,
        ActivityBackgroundComponent,
        ActivityBarsComponent
    ],
  	declarations: [
  		GanttActivityComponent,
        GanttTimeScaleComponent,
        ActivityBackgroundComponent,
        ActivityBarsComponent,
  	],
    providers: [],
})
export class GanttActivityModule { }
