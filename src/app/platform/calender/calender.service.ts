import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service'; 
import { environment } from 'environments/environment';
import { Calender } from './calender';

@Injectable()
export class CalenderService {

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

  fetchLead(){
    let eventUrl = environment.apiBaseUrl+'/v1/events/get_ownerable';
    return this.http.get(eventUrl, 
            this.options).map((res: Response) => res.json());
  }

  fetchEvent(from_date, to_date,actionables_of?){
    let eventUrl = environment.apiBaseUrl+'/v1/events?actionables_of='+actionables_of+'&from_date='+from_date+'&to_date='+to_date;
    return this.http.get(eventUrl, 
            this.options).map((res: Response) => res.json());
  }

  fetchSSEvent(){
    let eventUrl = environment.apiBaseUrl+'/v1/events';
    return this.http.get(eventUrl, 
            this.options).map((res: Response) => res.json());
  }

  fetchDesignerEvent(designerId,from_date,to_date){
    var eventUrl
    if(designerId == "all"){
      eventUrl = environment.apiBaseUrl+'/v1/events?from_date='+from_date+'&to_date='+to_date;
    }
    else{
      eventUrl = environment.apiBaseUrl+'/v1/events?designer_id='+designerId+'&from_date='+from_date+'&to_date='+to_date;
    }
    return this.http.get(eventUrl, 
            this.options).map((res: Response) => res.json());
  }

  fetchLeadEvent(ownType,ownId, from_date, to_date){
    let eventUrl = environment.apiBaseUrl+'/v1/events/events_for_ownerable?from_date='+from_date+'&to_date='+to_date;
    let params: URLSearchParams = new URLSearchParams();
    params.set('ownerable_type', ownType);
    params.set('ownerable_id', ownId);
    this.options.search = params;

    return this.http.get(eventUrl, 
            this.options).map((res: Response) => res.json());
  }

  // http://localhost:3000/v1/users/5/cm_designers

  fetchDesigner(cm_id){
    let designerUrl = environment.apiBaseUrl+'/v1/users/'+cm_id+'/cm_designers';
    return this.http.get(designerUrl, 
            this.options).map((res: Response) => res.json()).catch(this.handleErrorObservable);;

  }

  createEvent(event: Calender){
    let eventUrl = environment.apiBaseUrl+'/v1/events/';
    var obj= {
      "event":{
        "ownerable_id": event["project"],
        "ownerable_type": event["ownerable_type"],
        "contact_type": event["contact_type"],
        "scheduled_at" : event["scheduled_at"],
        "agenda" : event["agenda"],
        "description" : event["description"],
        "status" : "scheduled",
        "location" : event["location"],
        "emails" : event["email"],
        "type" : event["type"]
      }
    }
    return this.http.post(eventUrl, obj, 
            this.options).map((res: Response) => res.json());

  }

  updateEvent(event: Calender, eventId){
    let eventUrl = environment.apiBaseUrl+'/v1/events/'+eventId+'/reschedule_event';
    var obj= {
      "event":{
        "ownerable_id": event["project"],
        "ownerable_type": event["ownerable_type"],
        "contact_type": event["contact_type"],
        "scheduled_at" : event["scheduled_at"],
        "agenda" : event["agenda"],
        "description" : event["description"],
        "remark": event["remark"],
        "status" : "rescheduled",
        "location" : event["location"],
        "emails" : event["email"],
        "type" : event["type"]
      }
    }
    return this.http.post(eventUrl, obj, 
            this.options).map((res: Response) => res.json());
  }

  updateStatus(event: Calender,eventId){
    let eventUrl = environment.apiBaseUrl+'/v1/events/'+eventId+"/change_event_status";
    var obj= {
        "status" :  event["status"],
        "remark" :  event["remark"]
      }

    return this.http.post(eventUrl, obj, 
            this.options).map((res: Response) => res.json());
  }

  fetchUsers(val){
    let eventUrl = environment.apiBaseUrl+'/v1/events/email_details_for_event?ownerable_id='+val;
    return this.http.get(eventUrl, 
            this.options).map((res: Response) => res.json());
  }

  //MOM creating from calender
  createMOM(event: Calender,eventId){
    let eventUrl = environment.apiBaseUrl+ '/v1/events/'+eventId+'/create_mom';
    var obj= {
      "mom_description": event["mom_description"],
      "share_with": event["emails"]
    }
    return this.http.post(eventUrl, obj, 
      this.options).map((res: Response) => res.json());
  }

  //MOM creating from MOM Icon(email is not requored)
  createMOMFromIcon(event: Calender,eventId){
    let eventUrl = environment.apiBaseUrl+ '/v1/events/'+eventId+'/create_mom';
    var obj= {
      "mom_description": event["mom_description"],
    }
    return this.http.post(eventUrl, obj, 
      this.options).map((res: Response) => {
        if (res.status == 200){
            return res;
        }
      })
  }

  //Update MOM or Edit MOM
  updateMOMFromIcon(event: Calender,eventId){
    let eventUrl = environment.apiBaseUrl+ '/v1/events/'+eventId+'/update_mom';
    var obj= {
      "mom_description": event["mom_description"],
    }
    return this.http.patch(eventUrl, obj, 
      this.options).map((res: Response) => res.json());
  }

  //To view MOM
  momView(eventId){
    let url = environment.apiBaseUrl+'/v1/events/'+eventId+'/view_mom';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }

}
