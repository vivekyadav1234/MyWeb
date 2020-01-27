import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Angular2TokenService } from 'angular2-token';
import { Observable }           from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { Profile } from '../platform/profile/profile/profile';
import { ProfileService } from '../platform/profile/profile/profile.service';

@Injectable()
export class UserDetailsService {

  observableProfile: Observable<Profile[]>
  id: Number;
  options: RequestOptions;
  private currentUserUrl = environment.apiBaseUrl+'/v1/users/current_user_details';
  profile: Profile[];
  errorMessage: string;
  private profileUrl = environment.apiBaseUrl+'/v1/users';
  headers: Headers;
  public currentUserDetails: any;
  constructor(
    private http: Http,
    private tokenService: Angular2TokenService
  ) { }

 

  current_user(): any {
    
   
      //sessionStorage.setItem('User',this.currentUserDetails);
    return this.tokenService.currentUserData;
    // {"id": 9,"provider": "email","uid": "abc@inventblue.com","name": null,"nickname": null,"image": null,"email": "abc@inventblue.com","phone": null,"gender": null,"address": null,"user_agent": null,"type": "user"}
  }
  user_auth_data(): any {
    return this.tokenService.currentAuthData;
    // {"accessToken": "Zm5_n2BeZMFdxodSVsev5Q","client": "mRR5V603vtmmq8YQYbVTJw","expiry": "1497509748","tokenType": "Bearer","uid": "utkarsh@inventblue.com"}
  }

  user_type(): any {
    return this.tokenService.currentUserType;
  }

  user_signed_in(): any {
    return this.tokenService.userSignedIn();
    // true or false
  }

  get_company(): any {
    return this.tokenService.currentUserData;
    // {"id": 9,"provider": "email","uid": "abc@inventblue.com","name": null,"nickname": null,"image": null,"email": "abc@inventblue.com","phone": null,"gender": null,"address": null,"user_agent": null,"type": "user"}
  }

  checkRole(): any {
    
  }



}
