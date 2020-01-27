import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-po',
  templateUrl: './project-po.component.html',
  styleUrls: ['./project-po.component.css']
})
export class ProjectPoComponent implements OnInit {
  selectedTab = 'wip_orders';
  activeTab = "wip_orders";
  tab_search:any;
  data:any;
  constructor() { }

  ngOnInit() {
    this.data='project';
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
