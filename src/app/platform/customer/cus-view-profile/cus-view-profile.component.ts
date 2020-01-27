import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Profile } from '../../../platform/profile/profile/profile';
import { ProfileService } from '../../../platform/profile/profile/profile.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-cus-view-profile',
  templateUrl: './cus-view-profile.component.html',
  styleUrls: ['./cus-view-profile.component.css'],
  providers: [ProfileService]
})
export class CusViewProfileComponent implements OnInit {
	customer_Id;

	profile: any;

  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
    private profileService :ProfileService,
  	private route: ActivatedRoute,
  	private router: Router,
  	private loaderService :LoaderService

  	) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
	            this.customer_Id = params['custId'];
	  	});
  	this.viewProfile();
  }

  viewProfile(){
  	this.loaderService.display(true);
    this.profileService.viewProfile(this.customer_Id)
      .subscribe(
          result => {
          	this.loaderService.display(false);
          	this.profile = result['user'];          },
          error => {

          }
      );
  }
}
