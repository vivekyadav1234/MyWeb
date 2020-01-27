import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-office-po',
  templateUrl: './office-po.component.html',
  styleUrls: ['./office-po.component.css']
})
export class OfficePoComponent implements OnInit {
  selectedTab = 'wip_orders';
  activeTab = "wip_orders";
  tab_search:any;
  data:any;

  constructor() { }

  ngOnInit() {
  	this.data='office';
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
