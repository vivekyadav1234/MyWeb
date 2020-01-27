import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Profile } from '../profile';
import { ProfileService } from '../profile.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css'],
  providers: [ProfileService]
})
export class ViewprofileComponent implements OnInit {
	observableProfile: Observable<Profile[]>
	id: Number;
	profile: Profile[];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role;

  constructor(
  	private profileService :ProfileService,
  	private route: ActivatedRoute,
  	private router: Router,
  	 private loaderService :LoaderService
  ) { }

  ngOnInit() {
    this.role=localStorage.getItem('user');

  	this.route.params.subscribe(params => {
	            this.id = +params['id'];
	  	});
	  this.viewProfile();	
  }
  viewProfile(){
  	this.loaderService.display(true);
      this.observableProfile = this.profileService.viewProfile(this.id);
      this.observableProfile.subscribe(
        profile => {
          this.profile = profile;
          
          Object.keys(profile).map((key)=>{ this.profile= profile[key];});
          if(document.getElementById('profilename1heading')){
            document.getElementById('profilename1heading').innerText = profile['user']['name'];
          } else if(document.getElementById('profilename2heading')){
            document.getElementById('profilename2heading').innerText = profile['user']['name'];
          }
          if(document.getElementById('imgsidenav')){
            var img= document.getElementById('imgsidenav');
            img.setAttribute('src',this.profile['avatar']);
          } else if(document.getElementById('imgsidenav1')){
              var img= document.getElementById('imgsidenav1');
              img.setAttribute('src','assets/v3/img/profile.jpeg');
          }
          this.loaderService.display(false);
        },
        error => {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(error['_body']).message;
        this.loaderService.display(false);
          //Object.keys(this.errorMessage).map((key)=>{ this.errorMessage= this.errorMessage[key];});
        //  $.notify('error',JSON.parse(this.errorMessage['_body']).message);
          this.router.navigateByUrl('/');
          return Observable.throw(error);

        }
      );

    
  	
  }
  goBack(){
      window.history.go(-1);
    }

}
