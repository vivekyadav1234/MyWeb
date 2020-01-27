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
export class CsagentService {

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

  	getLeadCountForAgent(agentId){
    	let url = this.csAgentUrl+agentId+'/csagent_dashboard';
      return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

    }

    changeStatusToOnline(agentId,status){
   		let url = this.csAgentUrl+agentId+'/csagent_online_change';
   		let params: URLSearchParams = new URLSearchParams();
      	params.set('online_status', status);
      	this.options.search = params;
      	return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    claimLeads(leadID,agentID,lead){
      let url = environment.apiBaseUrl+'/v1/leads/'+leadID+'/claim_lead';
        return this.http.post(url,lead,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getCsagentstatuslist(){
      let url = environment.apiBaseUrl+'/v1/users/csagent_list';
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    getLeadPoolList(){
      let url = environment.apiBaseUrl+'/v1/leads/lead_pool_list';
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    assignCSagentToLeadType(lead_type_id,cs_agent_id){
      let url = environment.apiBaseUrl+'/v1/leads/assign_cs_agent_to_type';
      var data ={
        'lead_type_id':lead_type_id,
        'cs_agent_id':cs_agent_id
      };
      return this.http.post(url,data,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }
    assignCSagentToLeadCampaign(lead_campaign_id,cs_agent_id){
      let url = environment.apiBaseUrl+'/v1/leads/assign_cs_agent_to_campaign';
      var data ={
        'lead_campaign_id':lead_campaign_id,
        'cs_agent_id':cs_agent_id
      };
      return this.http.post(url,data,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }
    assignCSagentToLeadSource(lead_source_id,cs_agent_id){
      let url = environment.apiBaseUrl+'/v1/leads/assign_cs_agent_to_source';
      var data ={
        'lead_source_id':lead_source_id,
        'cs_agent_id':cs_agent_id
      };
      return this.http.post(url,data,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    markLeadEscalaetd(leadId,reason){
       let url = environment.apiBaseUrl+'/v1/leads/'+leadId+'/mark_escalated';
       var obj= {
        'reason_for_escalation':reason
      };
      if(this.options.params){
        this.options.params.delete('online_status');
      }
       return this.http.patch(url,obj,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    unassignedLead(leadId,agentId){
      let url = environment.apiBaseUrl+'/v1/leads/'+leadId+'/unassign_leads';
      if(this.options.params){
        this.options.params.delete('online_status');
      }
      var opt = this.options;
      var params: URLSearchParams = new URLSearchParams();
        params.set('agent_id', agentId);
        opt.search = params;
      
       return this.http.get(url,opt)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    callLead(userId, contact){
      let url = environment.apiBaseUrl+'/v1/inhouse_calls';
      let obj = { 
        'inhouse_call' : {
          'user_id':userId
        },
        'contact_no': contact
      };
      return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
    }
    getquestionairemasterdata()
    {
      let url = environment.apiBaseUrl + '/v1/questionaire_master_items';
      return this.http.get(url, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
}
   

