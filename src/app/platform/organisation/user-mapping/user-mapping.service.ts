import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UserMappingService {
	options: RequestOptions;

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
		console.error(error.message || error);
		return Observable.throw(error.message || error);
	}

	uploadMapping(user_id, basefile){

		let url = environment.apiBaseUrl+'/v1/users/'+user_id+'/import_user_pincode_mapping';

		let  data = {
								  attachment : basefile
								}
		return this.http.post(url,data,this.options)
			.map(this.extractData)
    		.catch(this.handleErrorObservable);
	}


}
