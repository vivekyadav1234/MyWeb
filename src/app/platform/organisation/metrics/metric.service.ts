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
export class MetricService {

  constructor(
  	private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) { 
  	this.options = this.authService.getHeaders();
  }

  options: RequestOptions;
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  private handleErrorObservable (error: Response | any) {
    return Observable.throw(error.message || error);
  }

  populateLeadMetricFilters(){
  	var url = environment.apiBaseUrl+'/v1/leads/lead_metrics_filter_data';
  	return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  leadMetricData(obj){
    var obj1=JSON.stringify(obj)
  	var url = environment.apiBaseUrl+'/v1/leads/lead_metrics?filter_params='+obj1;
  	return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getCMsAndDesForCity(cityid){
    var val = (cityid)?cityid:''
    var url = environment.apiBaseUrl+'/v1/users/city_cm_designer_data?city='+val;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  communityMetrics_Data(obj){
    var obj1=JSON.stringify(obj)
    var url = environment.apiBaseUrl+'/v1/leads/community_metrics?filter_params='+obj1;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  cm_designer_metrics_Data(obj){
    var obj1=JSON.stringify(obj)
    var url = environment.apiBaseUrl+'/v1/leads/cm_designer_metrics?filter_params='+obj1;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  
  mkw_business_head_Metrics_Data(obj){
    var obj1=JSON.stringify(obj);
    var url = environment.apiBaseUrl+'/v1/leads/mkw_business_head?filter_params='+obj1;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  
}
