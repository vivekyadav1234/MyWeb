import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/observable/of';

@Injectable()
export class CmstatuslistService {

	options: RequestOptions;
	private csAgentUrl = environment.apiBaseUrl+'/v1/users/';

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

  	getCmList(){
        let url = this.csAgentUrl+'get_all_community_managers';
        
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    // v1/users/get_all_community_managers
   

		}
		
		changeLeadIntakeStatus(userId){
			let url = this.csAgentUrl+'check_cm_available';
			var body = {
				"cm_id": userId
			}
			return this.http.patch(url,body,this.options)
											.map(this.extractData)
											.catch(this.handleErrorObservable)
		}
}
   

