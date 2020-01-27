import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { environment } from 'environments/environment';
import { ProfileService } from '../../profile/profile/profile.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { SharedService } from '../../../services/shared.service';
declare var $:any;

@Component({
  selector: 'app-user-onboard',
  templateUrl: './user-onboard.component.html',
  styleUrls: ['./user-onboard.component.css'],
  providers: [ ProfileService,SharedService]

})
export class UserOnboardComponent implements OnInit {
  onboard: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor( private profileService:ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService  ) {

  }

  ngOnInit() {
  }

onSubmit(details){
  this.sharedService.updateOnboard(details)
  .subscribe(
      onboard => {
        this.onboard = onboard;
        this.successalert = true;
        this.successMessage = "UserOnboard Updated !!";
        //$.notify('UserOnboard Updated');
         Object.keys(onboard).map((key)=>{ this.onboard= onboard[key];});
        setTimeout(function() {
              this.router.navigateByUrl('viewuseronboard/'+this.onboard.id);
          }.bind(this), 2000);


        return onboard;
      },
      error => {
        this.erroralert = true;
        this.errorMessage = JSON.parse(error['_body']).message;
        setTimeout(function() {
             this.erroralert = false;
          }.bind(this), 10000);
        // $.notify('danger',JSON.parse(this.errorMessage['_body']).message);
        //  this.router.navigateByUrl('profile/edit/'+this.id);
      }
  );
}

}
