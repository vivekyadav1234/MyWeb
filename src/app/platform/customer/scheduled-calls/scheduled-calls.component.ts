import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scheduled-calls',
  templateUrl: './scheduled-calls.component.html',
  styleUrls: ['./scheduled-calls.component.css']
})
export class ScheduledCallsComponent implements OnInit {
	@Input() scheduledEvents:any = [];

  constructor() { }

  ngOnInit() {
  }

}
