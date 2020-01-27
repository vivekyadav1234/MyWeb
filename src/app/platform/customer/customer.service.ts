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
export class CustomerService {
	options: RequestOptions;
	private wipUrl = environment.apiBaseUrl+'/v1/leads/';



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

  getProjectList(){
  	let url =environment.apiBaseUrl+'/v1/leads/get_all_projects_belongs_to_lead';
  	return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }
  getListofProposal(project_id){
    let url =environment.apiBaseUrl+'/v1/proposals?project_id='+project_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getProposalDoc(id){
    let url =environment.apiBaseUrl+'/v1/proposals/'+id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getPaymentDetails(proposal_id){
    let url =environment.apiBaseUrl+'/v1/proposals/payment_details_for_boq?proposal_id='+proposal_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  boqApproval(obj){
    let url =environment.apiBaseUrl+'/v1/proposals/approve_or_reject_the_boq';
    return this.http.post(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getTeam(id){
    let url =environment.apiBaseUrl+'/v1/proposals/designer_cm_details?project_id='+id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  scheduleMeeting(obj){
    let url =environment.apiBaseUrl+'/v1/proposals/schedule_call_with_designer';
    return this.http.post(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  getScheduledEvents(proj_id){
    let url =environment.apiBaseUrl+'/v1/proposals/list_of_scheduled_calls?project_id='+proj_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  getSharedBoqs(proj_id){
    let url =environment.apiBaseUrl+'/v1/projects/'+proj_id+'/boq_and_ppt_uploads/get_shared_ppts_and_boqs';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  getAllProjetcList(){
    let url =environment.apiBaseUrl+'/v1/users/clients_projects';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }
  getAllBoqList(projectId){
    let url =environment.apiBaseUrl+'/v1/proposals/boqs_shared_with_clients?project_id='+projectId;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

}
