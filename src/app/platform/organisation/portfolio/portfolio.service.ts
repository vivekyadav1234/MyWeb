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
export class PortfolioService {
	options: RequestOptions;
  
  private portfoliotUrl = environment.apiBaseUrl+'/v1/portfolios';

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

    getPortFolioList(){
      return this.http.get(this.portfoliotUrl,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    deletePortfolio(id:number) {
       let url = this.portfoliotUrl + '/'+id
       return this.http.delete(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    editPortfolio(id:number,param:any) {
       let url = this.portfoliotUrl + '/'+id
       return this.http.patch(url,param,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    viewPortfolioData(id:number) {
       let url = this.portfoliotUrl + '/'+id
       return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

}
