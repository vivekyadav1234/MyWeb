import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service'; 
import { environment } from 'environments/environment';
import { Product } from '../organisation/catalogue/product';
// import { Presentation } from '../presentation';
import { Presentation } from './presentation';

@Injectable()
export class PresentationService {

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
    return Observable.throw(error.message || error);
  }

  getProductList(): Observable<Product[]>{
    let url = environment.apiBaseUrl+'/v1/products/all_product_list';

    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getPresentationList(project_id): Observable<Presentation[]>{
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/presentations';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  fetchPresentation(project_id,presentation_id): Observable<Presentation[]>{
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/presentations/'+presentation_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  fetchPptProducts(project_id,presentation_id){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/presentations/'+presentation_id+'/get_products_of_ppt';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }


  savePresentation(presentation: Presentation,products, project_id, present = null, title) :Observable<Presentation> {
    
    var obj;  
    if(present == null){
      let presentationUrl = environment.apiBaseUrl+'/v1/projects/'+project_id+'/presentations';
      let url = presentationUrl;
      obj = {
        'presentation':presentation,
        'products': products,
        'title': title
      }
      return this.http.post(url, obj, 
            this.options).map((res: Response) => res.json());
    }
    else{
      let presentationUrl = environment.apiBaseUrl+'/v1/projects/'+project_id+'/presentations/'+present.id;
      let url = presentationUrl;
      obj = {
        'presentation':presentation,
        'products': products,
        'title': title
      }
      return this.http.patch(url, obj, 
            this.options).map((res: Response) => res.json());
    }
    
  }

  saveBoq(products, project_id, present, boq = null) :Observable<Presentation> {
      
    let presentationUrl = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/ppt-linked-boq';
    let url = presentationUrl;
    var obj = {
      'quotation':{
        "status": "draft",
        "products": products,
        "presentation_id": present.id
      }
    }
    return this.http.post(url, obj, 
          this.options).map((res: Response) => res.json());
    
  }

  loadFromTheme(theme) :Observable<Presentation> {
    return this.http.get("./assets/json/"+theme+".json")
                         .map((res:any) => res.json());
  }

  loadFromTemplate(template) :Observable<Presentation> {
    return this.http.get("./assets/json/slides/"+template+".json")
                         .map((res:any) => res.json());
  }

  deleteProducts(project_id,present_id,product_id){
    let presentationUrl = environment.apiBaseUrl+'/v1/projects/'+project_id+'/presentations/'+present_id+'/update_products_of_ppt';
    let url = presentationUrl;
    var obj = {
      'products_for_delete':[product_id]
    }
    return this.http.post(url, obj, 
          this.options).map((res: Response) => res.json());
  }
}
