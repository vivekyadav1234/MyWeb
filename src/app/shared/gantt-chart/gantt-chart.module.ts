import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GanttComponent } from './gantt/gantt.component';
import { GanttHeaderComponent } from './gantt-header/gantt-header.component';
import { GanttFooterComponent } from './gantt-footer/gantt-footer.component';
import { GanttService } from './gantt.service';
import { GanttActivityModule } from './gantt-activity/gantt-activity.module';
import { GroupByPipe } from './group-by.pipe';

@NgModule({
  	imports: [
    	CommonModule,
    	FormsModule,
    	GanttActivityModule,
  	],
  	exports: [
        GanttComponent
    ],
  	declarations: [
  		  GanttComponent,
        GanttHeaderComponent,
        GanttFooterComponent,  
        GroupByPipe 
  	],
    providers: [GanttService],
})
export class GanttChartModule { }
