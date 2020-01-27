import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-view-user-onboard',
  templateUrl: './view-user-onboard.component.html',
  styleUrls: ['./view-user-onboard.component.css'],
  providers: [SharedService]
})
export class ViewUserOnboardComponent implements OnInit {

  onboardobj:Object;
  id: Number;
    errorMessage : string;
    erroralert = false;
    successalert = false;
    successMessage : string;
  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
              this.id = +params['id'];
      });
    this.sharedService.viewOnBoardUserDetails(this.id)
        .subscribe(
          onboardobj =>{
            this.onboardobj = onboardobj;
             Object.keys(onboardobj).map((key)=>{ this.onboardobj= onboardobj[key];});
          },
          error =>{
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
