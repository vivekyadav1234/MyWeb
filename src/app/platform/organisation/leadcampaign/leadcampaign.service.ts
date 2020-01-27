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
export class LeadcampaignService {

	options: RequestOptions;
	private campaignUrl = environment.apiBaseUrl+'/v1/lead_campaigns';
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

  getCampaigns(){
    return this.http.get(this.campaignUrl,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
	}

	createCampaign(data){
		return this.http.post(this.campaignUrl,data,this.options)
			.map(this.extractData)
    		.catch(this.handleErrorObservable);
	}

	updateCampaign(data,campaignId){
		var  url = this.campaignUrl+'/'+campaignId;
		return this.http.patch(url,data,this.options)
			.map(this.extractData)
    		.catch(this.handleErrorObservable);
	}
  getOptionsForSelect(){
    var url = environment.apiBaseUrl+'/v1/lead_priorities/options_for_select';
    return this.http.get(url,this.options)
      .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  getPrioritiesList(){
    var url = environment.apiBaseUrl+'/v1/lead_priorities';
    return this.http.get(url,this.options)
      .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  createPriority(data){
    var url = environment.apiBaseUrl+'/v1/lead_priorities';
    return this.http.post(url,data,this.options)
      .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  deletePriority(id){
    var url = environment.apiBaseUrl+'/v1/lead_priorities/'+id;
    return this.http.delete(url,this.options)
      .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  editPriority(data,id){
    var url = environment.apiBaseUrl+'/v1/lead_priorities/'+id;
    return this.http.patch(url,data,this.options)
      .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  changePriority(id,new_priority_number,direction,steps){
    var obj = {
      change_params : {
        new_priority_number:new_priority_number,
        direction:direction,
        steps:steps
      }
    }
    var url = environment.apiBaseUrl+'/v1/lead_priorities/'+id+'/change_priority';
    return this.http.patch(url,obj,this.options)
      .map(this.extractData)
        .catch(this.handleErrorObservable);
  }
}
