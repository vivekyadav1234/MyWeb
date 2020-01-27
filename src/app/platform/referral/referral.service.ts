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
export class ReferralService {
	
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

  private extractDataPage(res:Response){
    return res;
  }
  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  addLead(data){
  	var url = environment.apiBaseUrl+'/v1/leads/create_broker_lead';
    return this.http.post(url,data,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
  }

  getBrokerAddedLeads(pageno,from_date,to_date,status,search){
    var filterstr = '&search='+search+'&from_date='+from_date+'&to_date='+to_date+'&status='+status;
    let url =  environment.apiBaseUrl+'/v1/leads/broker_lead_details?page='+pageno+filterstr;
    return this.http.get(url,this.options)
                  .map(this.extractDataPage)
                  .catch(this.handleErrorObservable);
  }
  
  getFiltersData(){
    let url = environment.apiBaseUrl+'/v1/leads/filter_details';
    return this.http.get(url,this.options).map(this.extractDataPage).catch(this.handleErrorObservable);
  }

}
