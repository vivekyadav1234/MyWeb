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
export class OrderManagerService {

  options: RequestOptions;

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

    private handleErrorObservable (error: Response | any) {
      return Observable.throw(error.message || error);
    }
  
    getQuotationsListForOrderManager(){
       var url = environment.apiBaseUrl+'/v1/purchase_orders/quotations_for_order_manager';
        return this.http.get(url, this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    lineItemDetails(quotation_id){
        var url = environment.apiBaseUrl+'/v1/purchase_orders/line_items_for_po?quotation_id='+quotation_id;
        return this.http.get(url, this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    purchaseOrderRelease(purchase_order_id){
      var obj ={
            "id": purchase_order_id,
          }
        var url = environment.apiBaseUrl+'/v1/purchase_orders/'+purchase_order_id+'/release_po';
        return this.http.patch(url, obj, this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
}
