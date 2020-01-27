import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { GanttService } from '../../gantt.service';
import { Zooming } from '../../interfaces';
@Component({
  selector: 'activity-background',
  templateUrl: './activity-background.component.html',
  styleUrls: ['./activity-background.component.css']
})
export class ActivityBackgroundComponent implements OnInit {

	@Input() tasks: any;
    @Input() timeScale:any;
    @Input() zoom: any;
    @Input() zoomLevel: string;

    @ViewChild('bg') bg: ElementRef;

    public rows: any[] = [];
    public cells: any[] = [];

    constructor(public ganttService: GanttService) { }

    ngOnInit() {
        this.drawGrid();

        this.zoom.subscribe((zoomLevel: string) => {
            this.zoomLevel = zoomLevel;
            this.drawGrid();
        });
    }

    isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    public setRowStyle() {
        return {
            'height': this.ganttService.rowHeight + 'px'
        };
    }

    public setCellStyle() {
        var width = this.ganttService.cellWidth;

        if (this.zoomLevel === Zooming[Zooming.hours]) {
            width = this.ganttService.hourCellWidth;
        }

        return {
            'width': width + 'px'
        };
    }

    public drawGrid(): void {
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            this.cells = [];

            this.timeScale.forEach((date: any) => {
                for (var i = 0; i <= 23; i++) {
                    this.cells.push(date);
                }
            });
        } else {
            this.cells = this.timeScale;
        }
    }

}
