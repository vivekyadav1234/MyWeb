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
export class GeneralManagerService {
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

 getDAYAndWEEKData(filterType,qualification,filterArea,filterTime,fromDate,toDate,designers,cms,gms){
  var obj={
        'from_date':fromDate,
        'to_date':toDate,
        'data_scope':filterArea,
        'time_duration':filterTime,
        'digital_physical':filterType,
        'date_filter_type':qualification,
        'cm':cms,
        'gm':gms,
        'designers':designers,
      }
 
      var obj1 = JSON.stringify(obj);
     let url = environment.apiBaseUrl+'/v1/leads/gm_dashboard?filter_params='+obj1;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

   getCMsAndDesForCityForOther(gms,cms ){
      // var val = (cityid)?cityid:'';
      var url = environment.apiBaseUrl+'/v1/leads/city_gm_cm_and_designer?gm=' +gms+'&cm='+cms;
      let params: URLSearchParams = new URLSearchParams();
        // params.set('data_scope', dataScope);
        this.options.search = params;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }    
  seeCountDetails( row_name,column,page,filterType,qualification,filterArea,filterTime,fromDate,toDate,designers,cms,gms,search?){
    var obj={
        'from_date':fromDate,
        'to_date':toDate,
        'data_scope':filterArea,
        'time_duration':filterTime,
        'digital_physical':filterType,
        'date_filter_type':qualification,
        'cm':cms,
        'gm':gms,
        'designers':designers,
        'column_name':column,
        'row_name':row_name,
         
      }
      var obj2 = JSON.stringify(obj);
    var url = environment.apiBaseUrl+'/v1/leads/gm_dashboard_data?filter_params='+obj2+'&page='+page+'&search='+search;
    let params: URLSearchParams = new URLSearchParams();
    return this.http.get(url,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);


  }
   downloadExcelGmData(row_name,column,page,filterType,qualification,filterArea,filterTime,fromDate,toDate,designers,cms,gms,search?) {
    var obj={
      'from_date':fromDate,
      'to_date':toDate,
      'data_scope':filterArea,
      'time_duration':filterTime,
      'digital_physical':filterType,
      'date_filter_type':qualification,
      'cm':cms,
      'gm':gms,
      'designers':designers,
      'column_name':column,
      'row_name':row_name,
    }
    var obj2 = JSON.stringify(obj);
    let url = environment.apiBaseUrl + '/v1/leads/gm_dashboard_excel_report?filter_params='+obj2+'&page='+page+'&search='+search;
    return this.http.get(url, this.options)
      .map(response => {
        if (response.status == 400) {
           this.handleErrorObservable;
        } else if (response.status == 200) {
           return response;
        }
      })
      .catch(this.handleErrorObservable);
  }
   
}
