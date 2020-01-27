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
export class SalesManagerService {
	options: RequestOptions;

 

  constructor(
  	private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  	) { 
  	this.options = this.authService.getHeaders();
  }

  private extractDataPage(res:Response){
	  return res;
	}

	  private extractData(res: Response) {
	  let body = res.json();
	  return body;
	}

	private handleErrorObservable (error: Response | any) {
	  return Observable.throw(error.message || error);
	}


	getReferrersList(userId,page?,search?){
	 let url =environment.apiBaseUrl +'/v1/users/'+userId+'/sales_manager_referrers';
	 var params: URLSearchParams = new URLSearchParams();
      params.set('page', page);
      params.set('search',search); 
      this.options.search = params;
      return this.http.get(url,this.options)
      .map(this.extractDataPage)
     .catch(this.handleErrorObservable);


	}
	getReferUserList(referId,referName){
		let url =environment.apiBaseUrl +'/v1/users/'+referId+'/load_referrer_users?role='+referName;
		 
	      return this.http.get(url,this.options)
	      .map(this.extractData)
	     .catch(this.handleErrorObservable);


	}
	getFileterLeadsForSales(source,lead_status,lead_type_id,lead_source_id,
      lead_campaign_id,column_name,from_date,to_date,cs_agent_list,referrerTypeId,search,page?){
      let url = environment.apiBaseUrl+'/v1/leads/sales_manager_filtered_index?page='+page;
      var params: URLSearchParams = new URLSearchParams();
      params.set('source', source);
      params.set('lead_status',lead_status);
      params.set('lead_type_id',lead_type_id);
      params.set('lead_source_id',lead_source_id);
      params.set('lead_campaign_id',lead_campaign_id);
      params.set('column_name',column_name);
      params.set('from_date',from_date);
      params.set('to_date',to_date);
      params.set('cs_agent',cs_agent_list);
      params.set('search',search);
      if(referrerTypeId != 'all') {
        params.set('referrer_id',referrerTypeId);
      }
      this.options.search = params;
      return this.http.get(url,this.options)
              .map(this.extractDataPage)
              .catch(this.handleErrorObservable);
    }
    uploadLeadExcel(files: File[],leadSource,type,camp,refer,referType) {
    	
      let leads = {
        'attachment_file' : files,
        'lead_source_id':leadSource,
        'lead_type_id':type,
        'lead_campaign_id':camp,
        'referrer_id':refer,
        'referrer_type':referType
      }
      let headers= this.authService.getHeaders();
      let url = environment.apiBaseUrl  + '/v1/leads/import_leads';
      return this.http.post(url,leads,headers)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
    }
    getCountForSalesLead(referrerTypeId, from_date, to_date){
    	let url =environment.apiBaseUrl +'/v1/leads/sales_manager_dashboard_count';
       let params: URLSearchParams = new URLSearchParams();
       if(referrerTypeId != 'all') {
        params.set('referrer_id',referrerTypeId);
       }
       params.set('from_date', from_date);
       params.set('to_date', to_date);
       this.options.search = params;
		 
	      return this.http.get(url,this.options)
	      .map(this.extractData)
	     .catch(this.handleErrorObservable);

    }
    exportLeads1(role,source,lead_status,lead_type_id,lead_source_id,
      lead_campaign_id,column_name,from_date,to_date,cs_agent_list,search){
      let url = environment.apiBaseUrl +'/v1/leads/sales_manager_download_leads';
      let params: URLSearchParams = new URLSearchParams();
      params.set('role',role);
      params.set('source', source);
      params.set('lead_status',lead_status);
      params.set('lead_type_id',lead_type_id);
      params.set('lead_source_id',lead_source_id);
      params.set('lead_campaign_id',lead_campaign_id);
      params.set('column_name',column_name);
      params.set('from_date',from_date);
      params.set('to_date',to_date);
      params.set('cs_agent',cs_agent_list);
      params.set('search',search);
      this.options.search = params;
      return this.http.get(url,this.options)
        .map(response => {
                if (response.status == 400) {
                    this.handleErrorObservable;
                } else if (response.status == 200) {
                    // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    // //var blob = response['_body'];
                    // var blob = new Blob([(<any>response)._body], { type: contentType });
                   // var url = environment.apiBaseUrl+'/'+response['_body'];
                    return response;
                }
            })
        .catch(this.handleErrorObservable);
    }
    getFiltersData(saleId){
      let url = environment.apiBaseUrl+'/v1/users/'+saleId+'/lead_source_for_sales_manager';
      var params: URLSearchParams = new URLSearchParams();
      this.options.search = params;
      return this.http.get(url,this.options).map(this.extractDataPage).catch(this.handleErrorObservable);
    }
    getReferListForSelect(salesId){
      let url =environment.apiBaseUrl +'/v1/users/'+salesId+'/referrer_user_types';
     
        return this.http.get(url,this.options)
        .map(this.extractData)
       .catch(this.handleErrorObservable);


    }

}
