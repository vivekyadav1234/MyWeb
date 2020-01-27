import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { environment } from 'environments/environment';

@Injectable()
export class BrokerService {

	options: RequestOptions;
	private leadUrl = environment.apiBaseUrl+'/v1/leads';
	private profileUrl = environment.apiBaseUrl+'/v1/users';
	private brokerleadUrl = environment.apiBaseUrl+'/v1/leads/broker_leads';
	
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

    private extractDataPage(res:Response){
        return res;
    }

	private handleErrorObservable (error: Response | any) {
	    console.error(error.message || error);
	    return Observable.throw(error.message || error);
	}

	getLeadList(){
	    return this.http.get(this.brokerleadUrl,this.options)
	      .map(this.extractData)
	      .catch(this.handleErrorObservable);
	}

	viewLeadDetails(id:Number){
      let url = this.leadUrl+'/'+id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    viewBrokerDetails(id){

      let url = this.profileUrl+'/'+id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateBrokerInformation(data,id){
    	let obj = {
	       'user' : {
	           'name' :data.name,
	           'contact': data.contact,
	           'nickname' : data.nickname,
	           'gst_number' : data.gst_number,
	           'pan' : data.pan,
           		'address_proof' : data.address_proof,
       		}
       	}
    	let url = this.profileUrl+'/'+id;
    	return this.http.patch(url,obj,this.options)
    				.map(this.extractData)
    				.catch(this.handleErrorObservable);
    }

    approveBrokerKYC(id,status) {
    	let url = this.profileUrl+'/'+id+'/kyc_approved';
    	let obj = {
    		'user' : {
    			'kyc_approved' : status
    		}
    	}
    	return this.http.post(url,obj,this.options)
    				.map(this.extractData)
    				.catch(this.handleErrorObservable);
    }

    onLeadContactSubmit(data){
    	let url = environment.apiBaseUrl+'/v1/contacts';
    	return this.http.post(url,data).map(this.extractData).catch(this.handleErrorObservable);
    }

    getBrokerAddedLeads(pageno,from_date,to_date,status,search){
        var filterstr = '&search='+search+'&from_date='+from_date+'&to_date='+to_date+'&status='+status;
        let url =  environment.apiBaseUrl+'/v1/leads/broker_lead_details?page='+pageno+filterstr;
        return this.http.get(url,this.options)
                  .map(this.extractDataPage)
                  .catch(this.handleErrorObservable);
    }

    addLead(data){
      var url = environment.apiBaseUrl+'/v1/leads/create_broker_lead';
        return this.http.post(url,data,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
    }

    getFiltersData(){
      let url = environment.apiBaseUrl+'/v1/leads/filter_details';
      return this.http.get(url,this.options).map(this.extractDataPage).catch(this.handleErrorObservable);
    }

}
