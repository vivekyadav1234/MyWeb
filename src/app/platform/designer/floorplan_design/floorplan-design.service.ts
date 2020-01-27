import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { Design } from './design';
import { environment } from '../../../../environments/environment';

@Injectable()
export class FloorplanDesignService {

	options: RequestOptions;
 private designUrl = environment.apiBaseUrl+'/v1/projects';

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

    createDesign(id:Number,fpid:Number,design: any,files: File[]) :Observable<Design> {
      let url = this.designUrl+'/'+id+'/floorplans/'+fpid+'/designs';
      let obj = {
       'design' : {
           'name' :design.name,
           'details' : design.details,
           'attachment_file':files,
           'design_type' : design.design_type
       }
     }
      return this.http.post(url, obj,
            this.options).map((res: Response) => res.json());
    }

    listDesigns(id:Number,fpid:Number) : Observable<Design[]>{
      let url = this.designUrl+'/'+id+'/floorplans/'+fpid+'/designs';
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    deleteDesign(id:Number, fpid:Number, desid:Number) : Observable<Design[]>{
    	let url = this.designUrl+'/'+id+'/floorplans/'+fpid+'/designs/'+desid;
    	return this.http.delete(url, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    viewDesignDetails(id:Number, fpid:Number, desid:Number) :Observable<Design[]>{
    	let url = this.designUrl+'/'+id+'/floorplans/'+fpid+'/designs/'+desid;
    	return this.http.get(url, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    updateDesign(id:Number, fpid:Number, desid:Number, params:any, files: File[]):Observable<Design[]>{
    	let url = this.designUrl+'/'+id+'/floorplans/'+fpid+'/designs/'+desid;
      let obj = {
       'design' : {
           'name' :params.name,
           'details' : params.details,
           'attachment_file':files,
           'design_type':params.design_type
        }
      }
    		return this.http.patch(url,obj,this.options)
    			.map(this.extractData)
    			.catch(this.handleErrorObservable);
    }

    designApproval(id:Number, fpid:Number, desid:Number,params:string) :Observable<[Design]>{
      let url = this.designUrl+'/'+id+'/floorplans/'+fpid+'/designs/'+desid+'/approve_design';
      let obj = {
       'design' : {
           'status_type' :params+''
        }
      }
      return this.http.patch(url,obj,this.options)
          .map(this.extractData)
          .catch(this.handleErrorObservable);
    }
    listBoqs(desid:number) {
      let url = environment.apiBaseUrl+'/v1/quotations/designquotes';
      let obj = {
        design_id:desid
      }
      return this.http.post(url,obj,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

}
