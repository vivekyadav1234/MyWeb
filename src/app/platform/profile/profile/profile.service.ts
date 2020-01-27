import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { environment } from '../../../../environments/environment';
import { Profile } from './profile';

@Injectable()
export class ProfileService {

  options: RequestOptions;

  private profileUrl = environment.apiBaseUrl+'/v1/users';
 
  private changepasswordUrl = environment.apiBaseUrl+'/auth/password';

  constructor(
  	private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) {
  		this.options = this.authService.getHeaders();
  }

   private extractData(res: Response) {
      let body = res.json();
      return body;
    }

    private handleErrorObservable (error: Response | any) {
      return Observable.throw(error.message || error);
    }
    viewProfile(id:Number): Observable<Profile[]>{

      let url = this.profileUrl+'/'+id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateProfile(id:Number, param:any, files: File[]) : Observable<Profile[]>{
      let obj = {
       'user' : {
           'name' :param.name,
           'avatar':files,
           'contact': param.contact,
           'nickname' : param.nickname,
           'gst_number' : param.gst_number,
           'pan' : param.pan,
           'pincode' : param.pincode,
           'address_proof' : param.address_proof,
           'instagram_handle': param.instagram_handle,
           'designer_cv': param.designer_cv
       }
      }
    	let url = this.profileUrl+'/'+id;
    	return this.http.patch(url,obj,this.options)
    				.map(this.extractData)
    				.catch(this.handleErrorObservable);
    }

    
    changePassword(data:any){
      return this.http.patch(this.changepasswordUrl,data,this.options)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
    }

}
