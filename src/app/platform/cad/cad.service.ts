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
export class CadService {
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

  getProjectList(page?){
      var url = environment.apiBaseUrl+'/v1/projects/projects_for_cad';
      let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;
      return this.http.get(url,this.options)
             .map(this.extractDataPage)
             .catch(this.handleErrorObservable);

  } 
  getQuotationList(projectId){
    var url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/cad';
      return this.http.get(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);


  } 


}
