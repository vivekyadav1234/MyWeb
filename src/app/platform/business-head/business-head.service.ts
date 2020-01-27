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
export class BusinessHeadService {
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
   private extractDataPage(res:Response){
    return res;
  }

 	private handleErrorObservable (error: Response | any) {
  	console.error(error.message || error);
  	return Observable.throw(error.message || error);
	}

	getProjectList(page?){
      var url = environment.apiBaseUrl+'/v1/projects/business_head_projects?page='+page;
      return this.http.get(url,this.options)
             .map(this.extractDataPage)
             .catch(this.handleErrorObservable);

  } 

  getQuotationList(projectId){
    var url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/quotation_list_for_business_head';
      return this.http.get(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }

  getQuotationDetails(projectId, quoteId){
    var url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quoteId+'/quotation_for_business_head';
      return this.http.get(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }

  getLeadInfo(leadId){
  	var url = environment.apiBaseUrl+'/v1/leads/'+leadId+'/get_lead_info';
      return this.http.get(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }

  getLeadLogs(leadId){
  	var url = environment.apiBaseUrl+'/v1/leads/'+leadId+'/show-logs';
      return this.http.get(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }

  getLeadEventCounts(leadId){
  	var url = environment.apiBaseUrl+'/v1/leads/'+leadId+'/lead_event_counts';
      return this.http.get(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }

  getVariablePriceForCM(cm_id){
    var url = environment.apiBaseUrl+'/v1/cm_mkw_variable_pricings?cm_id='+cm_id;
    return this.http.get(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }
  importVariablePriceForCm(cm_id,type,file){
    var url = environment.apiBaseUrl+'/v1/cm_mkw_variable_pricings/import?cm_id='+cm_id+'&type='+type;
    var obj={
      attachment_file:file
    }
    return this.http.post(url,obj,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }
  deleteVariablePriceInstance(id,tag){
    var url=environment.apiBaseUrl+'/v1/cm_mkw_variable_pricings/'+id+'?tag_name='+tag;
    return this.http.delete(url,this.options)
             .map(this.extractData)
             .catch(this.handleErrorObservable);
  }
  getCommunityManagersList(){
      let url = environment.apiBaseUrl+'/v1/users/designer_cm_index';
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    getBOQByReference(reference_value){
      let url = environment.apiBaseUrl + '/v1/show_by_reference';
      let params: URLSearchParams = new URLSearchParams();
        params.set('reference_number', reference_value);
        this.options.search = params;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    updateReferenceValue(reference_value,boq_amount){
      let url = environment.apiBaseUrl + '/v1/change_amount';
      let obj = {
        'reference_number':reference_value,
        'boq_amount':boq_amount
      }
      return this.http.patch(url,obj,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    getDetailsForChart(filterData,filterType,designers,cms,city,fromDate,toDate,qualification,number_of_weeks){
      var obj={
        'city':city,
        'cm':cms,
        'designers':designers,
        'data_scope':filterData,
        'digital_physical':filterType,
        'from_date':fromDate,
        'to_date':toDate,
        'number_of_weeks':number_of_weeks,
        'date_filter_type':qualification

        
      }
      var obj1 = JSON.stringify(obj);
      let url = environment.apiBaseUrl+'/v1/leads/aws_dashboard?filter_params='+obj1;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }
    getFilterValues(){
      let url = environment.apiBaseUrl+'/v1/leads/lead_metrics_filter_data';
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }
    getCMsAndDesForCity(dataScope,cityid){
      var val = (cityid)?cityid:''
      var url = environment.apiBaseUrl+'/v1/users/city_cm_designer_data?city='+val;
      let params: URLSearchParams = new URLSearchParams();
        params.set('data_scope', dataScope);
        this.options.search = params;

      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    getFHIAndMKWData(dataScope,filterType,fromDate,toDate,qualification,cms,designers,city){
      var obj={
        'from_date':fromDate,
        'to_date':toDate,
        'digital_physical':filterType,
        'date_filter_type':qualification,
        'cm':cms,
        'designers':designers,
        'data_scope':dataScope,
        'city':city,
        
      }
       
      var obj1 = JSON.stringify(obj);
      let url = environment.apiBaseUrl+'/v1/leads/aws_weekly_data?filter_params='+obj1;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }
    getOrderData(dataScope,fromDate,toDate,qualification,cms,designers,page){
      var obj={
        'from_date':fromDate,
        'to_date':toDate,
        'date_filter_type':qualification,
        'cm':cms,
        'designers':designers,
        'data_scope':dataScope
        
      }
       
      var obj1 = JSON.stringify(obj);
      let url = environment.apiBaseUrl+'/v1/leads/aws_order_book?filter_params='+obj1;
      let params: URLSearchParams = new URLSearchParams();
      params.set('page', page);
      this.options.search = params;
      return this.http.get(url,this.options)
            .map(this.extractDataPage)
            .catch(this.handleErrorObservable);

    }
    getCMsAndDesForCityForOther(dataScope,cityid){
      var val = (cityid)?cityid:'';
      var url = environment.apiBaseUrl+'/v1/leads/aws_city_cm_designer_data?city='+val;
      let params: URLSearchParams = new URLSearchParams();
        params.set('data_scope', dataScope);
        this.options.search = params;

      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }    

    //to get categoty list
    getCategory() {
      let url = environment.apiBaseUrl+'/v1/training_materials';
       
      if(this.options.params){
       this.options.params.delete('category_id');
     }
      return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    //to edit category
    editCategory(data,categoryId) {
      let url = environment.apiBaseUrl+'/v1/training_materials/'+categoryId;
      var obj={
          'category_name':data['upload_name']
        }
      return this.http.patch(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    //to edit subcategory
    editsubCategory(data,categoryId) {
      let url = environment.apiBaseUrl+'/v1/training_materials/'+categoryId;
      var obj={
          'category_name':data['subcategory_name']
        }
      return this.http.patch(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    //to get categoty list
    getSubCategory(categoryId) {
      var url = environment.apiBaseUrl+'/v1/training_materials';
      let params: URLSearchParams = new URLSearchParams();
    params.set("category_id", categoryId);
    this.options.search = params;
        return this.http.get(url, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    createCategory(data) {
      let url = environment.apiBaseUrl+'/v1/training_materials';
        var obj={
          'category_name':data['upload_name']
        }
         
        return this.http.post(url,obj,this.options)
         .map(this.extractData)
         .catch(this.handleErrorObservable);
    }
    createsubCategory(data){
      let url = environment.apiBaseUrl+'/v1/training_materials';
      var obj={
        'category_name':data['subcategory_name'] ,
        'training_material_id' : data['selectCategory_name']
      }
       
      return this.http.post(url,obj,this.options)
               .map(this.extractData)
               .catch(this.handleErrorObservable);
    }
    uploadMaterial(uploadItem, selectSubcategory){
      let url = environment.apiBaseUrl+'/v1/training_materials/'+selectSubcategory+'/upload_content';
      var obj={ 
        'files':uploadItem
      }
       
    return this.http.post(url,obj,this.options)
               .map(this.extractData)
               .catch(this.handleErrorObservable);
    }
    getMaterial() {
      var url = environment.apiBaseUrl+'/v1/training_materials/fetch_traning_material';
            return this.http.get(url, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    deleteCategory(id){
      var url=environment.apiBaseUrl+'/v1/training_materials/'+id;
      return this.http.delete(url,this.options)
               .map(this.extractData)
               .catch(this.handleErrorObservable);


    }
    deleteContent(id){
      var url=environment.apiBaseUrl+'/v1/training_materials/delete_content';
      let params: URLSearchParams = new URLSearchParams();
      params.set("content_id", id);
      this.options.search = params;
       
      return this.http.get(url, this.options)
               .map(this.extractData)
               .catch(this.handleErrorObservable);



    }
  DisablePmFee(reference_value,value){
  var obj ={
          'reference_number': reference_value,
          'pm_fee_disabled':value
      }
  let url = environment.apiBaseUrl+'/v1/toggle_pm_fee';
  return this.http.post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);


  }
}
