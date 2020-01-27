import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import {Location} from '@angular/common';


@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
	cust_id: string;

  constructor(
  	public activatedRoute: ActivatedRoute,
    private _location: Location,
    private route:ActivatedRoute
  	) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
      this.cust_id = params['custId'];
    });
  }

}
