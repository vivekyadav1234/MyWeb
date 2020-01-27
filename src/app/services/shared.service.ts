import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../authentication/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class SharedService {

  
  options: RequestOptions;
   private onBoardUrl = environment.apiBaseUrl+'/v1/user_onboards';

  constructor(private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService){
      this.options = this.authService.getHeaders();
  }

  updateOnboard(param:any){
      let url = this.onBoardUrl;
      return this.http.post(url,param,this.options)
            .map(this.extractData)
           .catch(this.handleErrorObservable);
  }

  viewOnBoardUserDetails(id:Number){
    let url = this.onBoardUrl+'/'+id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleErrorObservable (error: Response | any) {
    return Observable.throw(error.message || error);
  }
}
