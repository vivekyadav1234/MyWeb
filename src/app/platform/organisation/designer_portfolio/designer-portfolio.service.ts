import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service'; 
import { environment } from 'environments/environment';

@Injectable()
export class DesignerPortfolioService {

	options: RequestOptions;
  
  private portfolioUrl = environment.apiBaseUrl+'/v1/users/';

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

    getPortfolioList(userId) {
      let url = this.portfolioUrl+userId+'/portfolio_works';
    	return this.http.get(url,this.options)
    		.map(this.extractData)
    		.catch(this.handleErrorObservable);
    }

    getPortfolioDetailsWithId(portfolioId,userId){
      let url = this.portfolioUrl+userId+'/portfolio_works/'+portfolioId;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    uploadPortfolioData(data,userId) {
      let url = this.portfolioUrl+userId+'/portfolio_works';
      return this.http.post(url,data,this.options)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
    }

    deletePortfolio(userId,portfolioId) {
      let url = this.portfolioUrl+userId+'/portfolio_works/'+portfolioId;
      return this.http.delete(url,this.options)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
    }

    updatePortfolioDetails(params) {
      var userId = params['userId'];
      var portfolioId = params['portfolioId'];
      var obj = {
       portfolio_work : params
      };
      let url = this.portfolioUrl+userId+'/portfolio_works/'+portfolioId;
      return this.http.patch(url,obj,this.options)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
    }


}
