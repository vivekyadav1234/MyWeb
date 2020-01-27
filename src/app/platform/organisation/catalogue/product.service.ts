import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service'; 
import { environment } from 'environments/environment';
import { Product } from './product';

@Injectable()
export class ProductService {

  private productUrl = environment.apiBaseUrl+'/v1/products';
  options: RequestOptions;

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) { 
      this.options = this.authService.getHeaders();
    }

  getProductList(): Observable<Product[]>{
      return this.http.get(this.productUrl,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

   }

  getProductServiceList(id:Number): Observable<Product[]>{
      return this.http.get(this.productUrl+'?parent_id='+id,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

   }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  createProduct(id:Number, product: Product) :Observable<Product> {
    let url = this.productUrl;
    product["section_id"] = id;
    return this.http.post(url, product, 
          this.options).map((res: Response) => res.json());
  }

  createProductSection(id:Number, product: Product) :Observable<Product> {
    let url = this.productUrl;
    product["parent_id"] = id;
    return this.http.post(url, product, 
          this.options).map((res: Response) => res.json());
  }

  viewProduct(id:Number): Observable<Product[]>{
    let url = this.productUrl+'/'+id;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteProject(id:Number):Observable<Product[]> {
      let headers= this.authService.getHeaders();     
      let url = this.productUrl+'/'+id;
      return this.http.delete(url, headers)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

  editProject(id:Number,param:any) : Observable<Product[]>{
      let headers= this.authService.getHeaders();     
      let url = this.productUrl+'/'+id;
      return this.http.patch(url,param,headers)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

}
