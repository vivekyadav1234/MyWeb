import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service'; 
import { environment } from 'environments/environment';
import { ActivityLogs } from './activity-logs';

@Injectable()
export class ActivityLogsService {
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

  getLeadLogs(lead_id): Observable<ActivityLogs[]>{
    let url = environment.apiBaseUrl+'/v1/leads/'+lead_id+'/show-logs';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getMOMevents(ownerable_id){
    let url = environment.apiBaseUrl+'/v1/events/get_manual_events_of_project';
    let params: URLSearchParams = new URLSearchParams();
    params.set('ownerable_id', ownerable_id);
    this.options.search = params;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  //To share MOM
  momShare(event,eventid){
    let url = environment.apiBaseUrl+'/v1/events/'+eventid+'/share_mom';
    let params: URLSearchParams = new URLSearchParams();
    params.set('share_with',event["emails"]);
    this.options.search = params;
     
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  //To Delete Share
  deleteMOM(eventId){
    let url = environment.apiBaseUrl+'/v1/events/'+eventId+'/delete_mom';
    return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

  //To view MOM
  momView(eventId){
    let url = environment.apiBaseUrl+'/v1/events/'+eventId+'/view_mom';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }
}
