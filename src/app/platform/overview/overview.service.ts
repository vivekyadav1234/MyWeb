import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service'; 
import { environment } from 'environments/environment';

@Injectable()
export class OverviewService {

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
	    return Observable.throw(error.message || error);
	}

	getOverviewCount(lead_id){
		let url = environment.apiBaseUrl+'/v1/leads/'+lead_id+'/lead_event_counts';
		return this.http.get(url,this.options)
		.map(this.extractData)
		.catch(this.handleErrorObservable);
	}

	getOverviewLog(lead_id,event_time,event_type){
		let url = environment.apiBaseUrl+'/v1/leads/'+lead_id+'/events_log?event_time='+
		event_time+'&event_type='+event_type;
		return this.http.get(url,this.options)
		.map(this.extractData)
		.catch(this.handleErrorObservable);
	}


}


