import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy, OnChanges, DoCheck } from '@angular/core';
import { GanttService } from '../../gantt.service';
import { GanttConfigService } from '../../gantt-config.service';
import { IGanttOptions, Zooming } from '../../interfaces';

@Component({
  selector: 'gantt-activity',
  templateUrl: './gantt-activity.component.html',
  styleUrls: ['./gantt-activity.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GanttActivityComponent implements OnInit, DoCheck {

	@Input() project: any;
    @Input() options: any;
    @Output() onGridRowClick: EventEmitter<any> = new EventEmitter<any>();

    public upTriangle: string = '&#x25b2;' // BLACK UP-POINTING TRIANGLE
    public downTriangle: string = '&#x25bc;'; // BLACK DOWN-POINTING TRIANGLE
    public zoom: EventEmitter<string> = new EventEmitter<string>();
    public activityActions = {
        expanded: false,
        expandedIcon: this.downTriangle
    }

    public timeScale: any;

    public start: Date;
    public end: Date;
    public containerHeight: any;
    public containerWidth: any;

    public activityContainerSizes: any;
    public ganttActivityHeight: any;
    public ganttActivityWidth: any;
    public zoomLevel: string = Zooming[Zooming.hours];

    public treeExpanded = false;

    public scale: any = {
        start: null,
        end: null
    };

    public dimensions = {
        height: 0,
        width: 0
    };

    public data: any[] = [];

    public gridColumns: any[] = [
        { name: '', left: 0, width: 16 },
        { name: 'Task', left: 20, width: 330 },
        { name: '%', left: 8, width: 40 },
        { name: 'Duration', left: 14, width: 140 }
    ];

 	constructor(
 		public elem: ElementRef,
        public ganttService: GanttService
 	) { }

  	ngOnInit() {
  		this.ganttService.TASK_CACHE = this.project.tasks.slice(0).filter((item: any) => {
            return item.treePath.split('/').length === 1;
        });
        this.ganttService.TIME_SCALE = this.ganttService.calculateScale(this.options.scale.start, this.options.scale.end);

        this.zoomLevel = this.options.zooming;
        this.start = this.options.scale.start;
        this.end = this.options.scale.end;
        this.containerWidth = this.calculateContainerWidth();
        this.containerHeight = this.calculateContainerHeight();
        this.activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();

        // important that these are called last as it relies on values calculated above.
        this.setScale();
        this.setDimensions();
        this.setSizes();

        this.expand();
  	}

  	ngDoCheck() {
        // do a check to see whether any new tasks have been added. If the task is a child then push into array if tree expanded?
        var tasksAdded = this.ganttService.doTaskCheck(this.project.tasks, this.treeExpanded);

        // only force expand if tasks are added and tree is already expanded
        if (tasksAdded && this.activityActions.expanded) {
            this.expand(true);
        }
    }

    /** On vertical scroll set the scroll top of grid and activity  */
    onVerticalScroll(verticalScroll: any, ganttGrid: any, ganttActivityArea: any): void {
        this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
    }
     toggleChildren(rowElem: any, task: any) {
        try {
            let isParent: boolean = "true" === rowElem.getAttribute('data-isparent');
            let parentId: string = rowElem.getAttribute('data-parentid').replace("_", ""); // remove id prefix
            let children: any = document.querySelectorAll('[data-parentid=' + rowElem.getAttribute('data-parentid') + '][data-isparent=false]');

            // use the task cache to allow deleting of items without polluting the project.tasks array
            if (isParent) {
                // remove children from the DOM as we don't want them if we are collapsing the parent
                if (children.length > 0) {
                    let childrenIds: any[] = this.ganttService.TASK_CACHE.filter((task: any) => {
                        return task.parentId == parentId && task.treePath.split('/').length > 1;
                    }).map((item: any) => { return item.id });

                    childrenIds.forEach((item: any) => {
                        var removedIndex = this.ganttService.TASK_CACHE.map((item: any) => { return item.id }).indexOf(item);

                        this.ganttService.TASK_CACHE.splice(removedIndex, 1);
                    });

                    if (this.activityActions.expanded) {
                        this.expand(true);
                    }

                } else {
                    // CHECK the project cache to see if this parent id has any children
                    // and if so push them back into array so DOM is updated
                    let childrenTasks: any[] = this.project.tasks.filter((task: any) => {
                        return task.parentId === parentId && task.treePath.split('/').length > 1;
                    });

                    childrenTasks.forEach((task: any) => {
                        this.ganttService.TASK_CACHE.push(task);
                    });

                    if (this.activityActions.expanded) {
                        this.expand(true);
                    }
                }
            }

            this.onGridRowClick.emit(task);

        } catch (err) { }
    }

    /** Removes or adds children tasks back into DOM by updating TASK_CACHE */
    toggleAllChildren() {
        try {
            var children: any = document.querySelectorAll('[data-isparent=false]');
            var childrenIds: string[] = Array.prototype.slice.call(children).map((item: any) => {
                return item.getAttribute('data-id').replace("_", ""); // remove id prefix
            });

            // push all the children array items into cache
            if (this.treeExpanded) {
                if (children.length > 0) {
                    let childrenIds: string[] = this.ganttService.TASK_CACHE.filter((task: any) => {
                        return task.treePath.split('/').length > 1;
                    }).map((item: any) => { return item.id });

                    childrenIds.forEach((item: any) => {
                        var removedIndex = this.ganttService.TASK_CACHE.map((item: any) => { return item.id }).indexOf(item);
                        this.ganttService.TASK_CACHE.splice(removedIndex, 1);
                    });
                }

                this.treeExpanded = false;

                if (this.activityActions.expanded) {
                    this.expand(true);
                }
            } else {
                // get all children tasks in project input
                let childrenTasks: any[] = this.project.tasks.filter((task: any) => {
                    return task.treePath.split('/').length > 1;
                });

                if (children.length > 0) {
                    // filter out these children as they already exist in task cache
                    childrenTasks = childrenTasks.filter((task: any) => {
                        return childrenIds.indexOf(task.id) === -1;
                    });
                }

                childrenTasks.forEach((task: any) => {
                    this.ganttService.TASK_CACHE.push(task);
                });

                this.treeExpanded = true;

                if (this.activityActions.expanded) {
                    this.expand(true);
                }
            }
        } catch (err) { }
    }

    onResize(event: any): void {
        let activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
        if (this.activityActions.expanded) {
            this.ganttActivityHeight = this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3 + 'px';
        } else {
            this.ganttActivityHeight = activityContainerSizes.height + 'px';;
        }

        this.ganttActivityWidth = activityContainerSizes.width;
    }

    setScale() {
        this.scale.start = this.start;
        this.scale.end = this.end;
    }

    setDimensions() {
        this.dimensions.height = this.containerHeight;
        this.dimensions.width = this.containerWidth;
    }

    setGridRowStyle(isParent: boolean): any {
        if (isParent) {
            return {
                'height': this.ganttService.rowHeight + 'px',
                'line-height': this.ganttService.rowHeight + 'px',
                'font-weight': 'bold',
                'cursor': 'pointer'
            };
        }

        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px'
        };
    }

    /** Set the zoom level e.g hours, days */
    zoomTasks(level: string) {
        this.zoomLevel = level;
        this.zoom.emit(this.zoomLevel);
        this.containerWidth = this.calculateContainerWidth();
        this.setDimensions();
        document.querySelector('.gantt_activity').scrollLeft = 0 // reset scroll left, replace with @ViewChild?
    }
        expand(force?: boolean): void {
        var verticalScroll = document.querySelector('.gantt_vertical_scroll');
        var ganttActivityHeight: string = `${this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3}px`;

        if (force && this.activityActions.expanded) {
            this.ganttActivityHeight = ganttActivityHeight;
        } else if (this.activityActions.expanded) {
            this.activityActions.expanded = false;
            this.activityActions.expandedIcon = this.downTriangle;
            this.ganttActivityHeight = '300px';
        } else {
            verticalScroll.scrollTop = 0;

            this.activityActions.expanded = true;
            this.activityActions.expandedIcon = this.upTriangle;
            this.ganttActivityHeight = ganttActivityHeight;
        }
    }

    /** Get the status icon unicode string */
    getStatusIcon(status: string, percentComplete: number): string {
        var checkMarkIcon: string = '&#x2714;';
        var upBlackPointer: string = '&#x25b2;';
        var crossMarkIcon: string = '&#x2718;';

        if (status === "Completed" || percentComplete === 100 && status !== "Error") {
            return checkMarkIcon;
        } else if (status === "Warning") {
            return upBlackPointer;
        } else if (status === "Error") {
            return crossMarkIcon;
        }
        return '';
    }
        getStatusIconColor(status: string, percentComplete: number): string {
        if (status === "Completed" || percentComplete === 100 && status !== "Error") {
            return 'green';
        } else if (status === "Warning") {
            return 'orange';
        } else if (status === "Error") {
            return 'red';
        }
        return '';
    }

    public setGridScaleStyle() {
        var height = this.ganttService.rowHeight;

        if (this.zoomLevel === Zooming[Zooming.hours]) {
            height *= 2;
        }

        return {
            'height': height + 'px',
            'line-height': height + 'px',
            'width': this.ganttService.gridWidth + 'px'
        };
    }

    public calculateContainerHeight(): number {
        return this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight;
    }

    public calculateContainerWidth(): number {
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            return this.ganttService.TIME_SCALE.length * this.ganttService.hourCellWidth * 24 + this.ganttService.hourCellWidth
        } else {
            return this.ganttService.TIME_SCALE.length * this.ganttService.cellWidth + this.ganttService.cellWidth;
        }
    }
    public setSizes(): void {
        this.ganttActivityHeight = this.activityContainerSizes.height + 'px';
        this.ganttActivityWidth = this.activityContainerSizes.width;
    }

}
