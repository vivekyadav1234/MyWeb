import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-footer',
  templateUrl: './customer-footer.component.html',
  styleUrls: ['./customer-footer.component.css']
})
export class CustomerFooterComponent implements OnInit {
  url;
  constructor() { }

  ngOnInit() {
  	this.url=location.origin;
    
    
  }

}
