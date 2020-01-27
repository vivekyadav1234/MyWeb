import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintainance-po',
  templateUrl: './maintainance-po.component.html',
  styleUrls: ['./maintainance-po.component.css']
})
export class MaintainancePoComponent implements OnInit {
    selectedTab = 'wip_orders';
	activeTab = "wip_orders";
	tab_search:any;
	data:any;

  constructor() { }

  ngOnInit() {
  	this.data = 'maintenance'
  }
  //to get active card or tab
  activateTab(tab){
    this.selectedTab = tab;
    switch(tab){
      case "wip_orders":
      this.activeTab = "wip_orders";
      break;
      case "released_orders":
      this.activeTab = "released_orders";
      this.tab_search="released_orders";
      break;
      case "inventory":
      this.activeTab = "inventory";
      this.tab_search="inventory";
      break;
    }
  }

}
