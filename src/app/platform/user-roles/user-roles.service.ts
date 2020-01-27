import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from '../../../environments/environment';
import { User } from './user';
import { HttpParams } from '@angular/common/http';
import { Options } from 'selenium-webdriver/firefox';

@Injectable()
export class UserRolesService {

	options: RequestOptions;

  private userUrl = environment.apiBaseUrl+'/v1/users';
  private inviteUserUrl =  environment.apiBaseUrl+ '/v1/users/invite_user';

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

  private extractDataOne(res: Response) {
    let body = res;
    return body;
  }
  private handleErrorObservable (error: Response | any) {
    return Observable.throw(error.message || error);
  }


  getUserList(page,search?){
    return this.http.get(this.userUrl+"?page="+page+'&search='+search, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
   }

   inviteUser(data:any,champion):Observable<User>{
      let obj = {
         user : {
         name : data.name,
         user_type: data.user_type,
         contact: data.contact,
         email: data.email,
         is_champion:champion
        }
      }
     return this.http.post(this.inviteUserUrl,obj,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }

  updateRole(id:number,role:string):Observable<User> {
    let url = environment.apiBaseUrl+'/v1/users/'+id+'/update_role';
    let obj = {
      user : {
       role : role,
       id: id
      }
    }
   return this.http.patch(url,obj,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }

  exportLeads(){
    let url = this.userUrl+'/download_list';
    return this.http.get(url,this.options)
      .map(response => {
        if (response.status == 400) {
            this.handleErrorObservable;
        } else if (response.status == 200) {
            var contentType = 'text/csv';
             var blob = response['_body'];
            //var blob = new Blob([(<any>response)._body], { type: contentType });
            return blob;
        }
      })
      .catch(this.handleErrorObservable);
  }
  getUserCategorySplit(value){
    var url = environment.apiBaseUrl +'/v1/users/request_role';
    var params: URLSearchParams = new URLSearchParams();
    params.set('role', value);
    var opt = this.options;
    this.options.search = params;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
}
