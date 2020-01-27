import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgStyle } from '@angular/common';
import { GanttService } from '../gantt.service';
import { IGanttOptions, Project } from '../interfaces';

@Component({
  selector: 'gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css'],
  providers: []
})
export class GanttComponent implements OnInit {

	public _project: Project;
    public _options: IGanttOptions;

    @Input()
    set project(project: any) {
        if (project) {
            this._project = project;
        } else {
            this.setDefaultProject();
        }
    }
    get project() { return this._project };

    @Input() 
    set options(options: any) {
        if (options.scale) {
            this._options = options;
        } else {
            this.setDefaultOptions();
        }
    }
    get options() { return this._options };

    @Output() onGridRowClick: EventEmitter<any> = new EventEmitter<any>();
    
    public ganttContainerWidth: number;

  	constructor(public ganttService: GanttService) { }

  	ngOnInit() {
  	}

  	setSizes(): void {
        this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
    }

    setDefaultOptions() {
        var scale = this.ganttService.calculateGridScale(this._project.tasks);

        this._options = {
            scale: scale
        }
    }

    setDefaultProject() {
        this._project = {
            id: '',
            name: '',
            startDate: null,
            tasks: []
        }
    }

    gridRowClicked(task:any) {
        this.onGridRowClick.emit(task);
    }

    onResize($event: any): void {
        this.setSizes();
    }

}
