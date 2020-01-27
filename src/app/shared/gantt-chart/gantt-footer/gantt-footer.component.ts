import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'gantt-footer',
  templateUrl: './gantt-footer.component.html',
  styleUrls: ['./gantt-footer.component.css']
})
export class GanttFooterComponent implements OnInit {

  constructor() { }
	@Input() project: any;
  ngOnInit() {
  }

}
