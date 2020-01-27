import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'gantt-header',
  templateUrl: './gantt-header.component.html',
  styleUrls: ['./gantt-header.component.css']
})
export class GanttHeaderComponent implements OnInit {

	@Input() name:any;
    @Input() startDate: string;
  constructor() { }

  ngOnInit() {
  }

}
