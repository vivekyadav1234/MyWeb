import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class PriceconfiguratorService {
	 options: RequestOptions;
   headers: Headers;
  
   private sectionSpecificationUrl = environment.apiBaseUrl+'/v1/sections';
   private priceConfiguratorUrl = environment.apiBaseUrl+'/v1/price_configurators';
  constructor(private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
   ) { 
      this.headers = new Headers({'enctype': 'multipart/form-data'});
      this.headers.append('Accept', 'application/json');
      this.options = new RequestOptions({headers: this.headers});
  	//this.options = this.authService.getHeaders();
  }

  getSectionSpecification(){
      let url = this.sectionSpecificationUrl;
      return this.http.get(url,this.options)
            .map(this.extractData)
           .catch(this.handleErrorObservable);
  }

  createPriceConfigurator(ob: any,value:any,hob_check:string,platform_check:string,chimney_check:string){
    let price_configurator = {
      value
    }
    price_configurator.value['pc_obj']=ob;
    price_configurator.value['hob_check']=hob_check;
    price_configurator.value['chimney_check'] = chimney_check
    price_configurator.value['platform_check'] = platform_check;
    return this.http.post(this.priceConfiguratorUrl,value)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
  }

  updatePriceConfigurator(id:number,value:any){
    let url = this.priceConfiguratorUrl+'/'+id;
    let price_configurator = {
      value
    }

    return this.http.patch(url,value)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
  }

  createSpecificationForSection(priceConfiguratorId:number,specificationId:number){
    let url = this.priceConfiguratorUrl+'/'+priceConfiguratorId+'/add_specification';
    let price_configurator = {
      price_configurator: {
      'specification_id':specificationId
      }
    }
    return this.http.post(url,price_configurator)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
  }

  fetchDesign(priceConfiguratorId) {
    let url = this.priceConfiguratorUrl+'/'+priceConfiguratorId+'/fetch_designs';
    return this.http.get(url)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleErrorObservable (error: Response | any) {
    return Observable.throw(error.message || error);
  }

}
