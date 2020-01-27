import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import { GanttService } from '../../gantt.service';
import { Zooming } from '../../interfaces';

@Component({
  selector: 'time-scale',
  templateUrl: './gantt-time-scale.component.html',
  styleUrls: ['./gantt-time-scale.component.css'],
    providers: [
        GanttService
    ]
})
export class GanttTimeScaleComponent implements OnInit {

 	@Input() timeScale: any;
    @Input() dimensions: any;
    @Input() zoom: any;
    @Input() zoomLevel: any;

    constructor(public ganttService: GanttService) { }

    ngOnInit() {
        this.zoom.subscribe((zoomLevel: string) => {
            this.zoomLevel = zoomLevel;                        
        });;
    }

    public setTimescaleStyle() {
        return {
            'width': this.dimensions.width + 'px'
        };
    }

    public setTimescaleLineStyle(borderTop: string) {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px',
            'position': 'relative',
            'border-top': borderTop
        };
    }

    public setTimescaleCellStyle() {
        var width = this.ganttService.cellWidth;
        var hoursInDay = 24;
        var hourSeperatorPixels = 23; // we don't include the first 

        if(this.zoomLevel ===  Zooming[Zooming.hours]) {
            width = this.ganttService.hourCellWidth * hoursInDay + hourSeperatorPixels; 
        }

        return {            
            'width': width + 'px'
        };
    }

    public isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    public getHours(): string[] {
        return this.ganttService.getHours(this.timeScale.length);
    }

}
