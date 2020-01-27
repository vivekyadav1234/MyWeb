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
export class MediaEngagementService {

	options: RequestOptions;
	private mediaUrl = environment.apiBaseUrl+'/v1/media_pages';

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
    return Observable.throw(error.message || error);
  }

  getMediaElementsList(page){
    let url = this.mediaUrl+'?page='+page;
    return this.http.get(url,this.options)
			             .map(this.extractDataPage)
			             .catch(this.handleErrorObservable);
  }
  saveMediaElement(obj){
    let url = this.mediaUrl;
    return this.http.post(url,obj,this.options)
			             .map(this.extractDataPage)
			             .catch(this.handleErrorObservable);
  }

  updateMediaElement(elemid,data){
    let url = this.mediaUrl+'/'+elemid;
    return this.http.patch(url,data,this.options)
			             .map(this.extractDataPage)
			             .catch(this.handleErrorObservable);
  }
  deleteMediaElement(elemid){
    let url = this.mediaUrl+'/'+elemid;
    return this.http.delete(url,this.options)
			             .map(this.extractDataPage)
			             .catch(this.handleErrorObservable);
  }
}
 