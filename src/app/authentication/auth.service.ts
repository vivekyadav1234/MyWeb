import { Injectable } from '@angular/core';
import { Router }     from '@angular/router';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';

import { Angular2TokenService } from 'angular2-token';
import { Observable }           from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import { UserDetailsService } from '../services/user-details.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService{
  redirectUrl: string;
  headers: Headers;
  options: RequestOptions;
  currentUserDetails: any;
  accessToken: any;
  client: any;
  uid: any;

  constructor(
    private tokenService: Angular2TokenService,
    public router: Router,
    private userDetailService: UserDetailsService,
    private http: Http,
    ) {
    }

  logIn(email: string, password: string): Observable<Response> {
    
    return this.tokenService.signIn({ email: email,
                                     password: password })
  }

  signUp(name: string, email: string, contact:string, password: string): Observable<Response> {

    return this.tokenService.registerAccount({  name: name,
                                                email: email,
                                                contact: contact,
                                                password: password,
                                                passwordConfirmation: password
                                                 });
  }

  resetPassword(email: string): Observable<Response> {
    return this.tokenService.resetPassword({
            email: email,
        });
  }

  signInWithGithub(): Observable<any> {
    return this.tokenService.signInOAuth('github');
  }

  proccessOauthCallback(): void {
    this.tokenService.processOAuthCallback();
    this.redirectAfterLogin();
  }

  logOut(): void {
    this.redirectUrl = undefined;
    this.tokenService.signOut();
    this.router.navigate(['/log-in']);
  }

  isLoggedIn(): boolean {
    // if(this.tokenService && this.tokenService.atCurrentUserData && 
    //   this.tokenService.atCurrentUserData.otp_secret_key != null){
    //   return true;
    // } else {

      return this.tokenService.userSignedIn();
    // }
  }

  // checkRole() : String {
  //   if(this.userDetailService.user_signed_in()){
  //     return this.userDetailService.current_user().role;
  //   }

  // }

  redirectAfterLogin(): void {
    // this.checkRole();
    
    let redirectTo = this.redirectUrl ? this.redirectUrl : '/';
    this.redirectUrl = undefined;
    this.router.navigate([redirectTo]);
  }

  getHeaders(): RequestOptions {
      this.headers = new Headers({'enctype': 'multipart/form-data'});
      this.headers.append('Accept', 'application/json');
      this.headers.append('uid', this.tokenService.currentAuthData.uid);
      this.headers.append('client', this.tokenService.currentAuthData.client);
      this.headers.append('access-token', this.tokenService.currentAuthData.accessToken);
      this.options = new RequestOptions({headers: this.headers});
      return this.options;
  }

  forgotPassword(data) {
    // let url = environment.apiBaseUrl+'/auth/password';
    // this.headers = new Headers({'enctype': 'multipart/form-data'});
    // this.headers.append('Accept', 'application/json');
    // this.options = new RequestOptions({headers: this.headers});
    // return this.http.post(url,data,this.options)
    //               .map(this.extractData)
    //               .catch(this.handleErrorObservable);
  }
  private extractData(res: Response) {
      let body = res.json();
      return body;
  }

  private handleErrorObservable (error: Response | any) {
    return Observable.throw(error.message || error);
  }


  otpLogin(email){
    let url = environment.apiBaseUrl+'/otp/generate_otp?email='+email;
    this.headers = new Headers({'enctype': 'multipart/form-data'});
      this.headers.append('Accept', 'application/json');
      this.headers.append('uid', '');
      this.headers.append('client', '');
      this.headers.append('access-token', '');
      let options:any;
      options = new RequestOptions({headers: this.headers});
      let params: URLSearchParams = new URLSearchParams();
      params.set('email', email);
      options.search = params;
    return this.http.get(url,options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  confirmOTP(email,otp){
    let url = environment.apiBaseUrl+'/otp/otp_based_login?email='+email+'&otp='+otp;
      let options:any;
      
      options = new RequestOptions({headers: this.headers});
      
      let params: URLSearchParams = new URLSearchParams();
      params.set('email', email);
      params.set('otp', otp);
      options.search = params;
    return this.http.post(url,options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  validateToken(uid,client,accessToken) {
    this.uid = uid;
    this.client = client;
    this.accessToken = accessToken;
    let url = environment.apiBaseUrl+'/auth/validate_token';
    this.headers = new Headers({'enctype': 'multipart/form-data'});
      this.headers.append('Accept', 'application/json');
      this.headers.append('uid', uid);
      this.headers.append('client', client);
      this.headers.append('access-token', accessToken);
      let options:any;
      options = new RequestOptions({headers: this.headers});
      var validateToken = function () {
        var _this = this;
        var /** @type {?} */ observ = this.getReq(this.getUserPath() + this.atOptions.validateTokenPath);
        observ.subscribe(function (res) { 
          return this.atCurrentUserData = res.json().data; }, 
          function (error) {
            if (error.status === 401 && _this.atOptions.signOutFailedValidate) {
                this.signOut();
            }
        });
        var /** @type {?} */ authData = {
          accessToken: this.accessToken,
          client: this.client,
          expiry: this.headers.expiry,
          tokenType: 'Bearer',
          uid: this.uid
      };
      if (_this.checkAuthData(authData))
          _this.atCurrentAuthData = authData;
        return observ;
    };
    return this.http.get(url,options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  

}
