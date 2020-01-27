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
export class SitesupervisorService {
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
    	console.error(error.message || error);
    	return Observable.throw(error.message || error);
  	}

  getDashboardCount(){
  	let url = environment.apiBaseUrl+'/v1/requests/site_supervisor_dashboard_count';
  	return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getRequestList(){
    let url = environment.apiBaseUrl+'/v1/requests';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getProjectList(type){
    let url = environment.apiBaseUrl+'/v1/requests/live_and_finished_projects?status='+type+'_projects';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getProjectRequestList(project_id){
    let url = environment.apiBaseUrl+'/v1/requests/requests_for_project?project_id='+project_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  completeRequest(req_id,formobj,files){
    let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/complete_site_measurment_request';
    

    var forms = {
      'status': formobj.status,
      'remark': formobj.remark,
      'images':files
    };

    return this.http.post(url,forms,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  addImageSubmit(req_id,forms,files){
    // forms['images'] = files;
    forms = {
      'image_details':files
    };
   let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/add_images_to_request';
    return this.http.post(url,forms,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getGallery(req_id){
    let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/get_images_for_request';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

}
