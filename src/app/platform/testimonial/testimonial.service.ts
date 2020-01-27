import  { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service'; 
import { environment } from 'environments/environment';
import  { Testimonial } from './testimonial';

@Injectable()
export class TestimonialService {
  options: RequestOptions;

	private testUrl = environment.apiBaseUrl+'/v1/testimonials';
	headers = new Headers({'enctype': 'multipart/form-data'});
    
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

  postData(testi):Observable<Testimonial>{
    let url = environment.apiBaseUrl+'/v1/testimonials';
    let obj = {
      "testimonial": testi
    }
    return this.http.post(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  getData(): Observable<Testimonial[]>{
    let url = environment.apiBaseUrl + '/v1/testimonials';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }
  deletetestimonial(id: number){
    let url = this.testUrl + '/' + id
    return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  

  getDataofTestimonial(id){
    let url =this.testUrl + '/' + id 
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }  

  updateTestimonial(id,data){
    let url =this.testUrl + '/' + id ;
    let obj = {
      "testimonial": data
    }
    return this.http.patch(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

}
