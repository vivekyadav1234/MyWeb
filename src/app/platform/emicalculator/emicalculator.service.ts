import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class EmicalculatorService {

	options: RequestOptions;
	private emicalculatorUrl = environment.apiBaseUrl+'/v1/price_configurators/emicalculator';
  
	constructor(
		private http: Http,
    	private tokenService: Angular2TokenService,
   		private authService: AuthService
	) { 
		this.options = this.authService.getHeaders();
	}

	calculateEmi(data) {
		let price_configurator = {
      		data
    	}
		return this.http.post(this.emicalculatorUrl,data,this.options)
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
