import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import {VendorService} from '../vendor.service';
declare var $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[VendorService]
})
export class DashboardComponent implements OnInit {

	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;

  constructor(
  	private loaderService : LoaderService,
  	private vendorService:VendorService
  ) { }

  ngOnInit() {
  	this.loaderService.display(false);
  }

}
