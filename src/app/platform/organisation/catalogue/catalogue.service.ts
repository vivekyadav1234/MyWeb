import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service'; 
import { environment } from 'environments/environment';
import { Catalogue } from './catalogue';

@Injectable()
export class CatalogueService {

	private catalogueUrl = environment.apiBaseUrl+'/v1/sections';
  options: RequestOptions;

  constructor(
  	private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) { 
  		this.options = this.authService.getHeaders();
  }

  getCatalogueList(): Observable<Catalogue[]>{
      return this.http.get(this.catalogueUrl,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

   }

  getCatalogueServiceList(id:Number): Observable<Catalogue[]>{
      return this.http.get(this.catalogueUrl+'?parent_id='+id,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

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

  createCatalogue(catalogue: Catalogue) :Observable<Catalogue> {
    let url = this.catalogueUrl;
    return this.http.post(url, catalogue, 
          this.options).map((res: Response) => res.json());
  }

  createCatalogueSection(id:Number, catalogue: Catalogue) :Observable<Catalogue> {
    let url = this.catalogueUrl;
    catalogue['parent_id'] = id;
    return this.http.post(url, catalogue, 
          this.options).map((res: Response) => res.json());
  }

  viewCatalogue(id:Number): Observable<Catalogue[]>{
    let url = this.catalogueUrl+'/'+id;
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteCatalogue(id:Number):Observable<Catalogue[]> {
    let headers= this.authService.getHeaders();     
    let url = this.catalogueUrl+'/'+id;
    return this.http.delete(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteProduct(id:Number,secid:Number) {   
    let headers= this.authService.getHeaders();     
    let url = this.catalogueUrl+'/'+secid+'/products/'+id;
    return this.http.delete(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteService(id:Number,secid:Number) {   
    let headers= this.authService.getHeaders();     
    let url = this.catalogueUrl+'/'+secid+'/catalogue_services/'+id;
    return this.http.delete(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  editCatalogue(params:any):Observable<Catalogue[]>{
     let headers= this.authService.getHeaders();     
     let url = this.catalogueUrl+'/'+params.id;
     var obj = {
       section : params
     };
    return this.http.patch(url,obj,headers)
          .map(this.extractData)
          .catch(this.handleErrorObservable);
  }

  uploadCatalogueExcel(id:Number,files: File[]):Observable<Catalogue> {
    let products = {
      'attachment_file' : files
    }
    let headers= this.authService.getHeaders();
    let url = this.catalogueUrl+'/'+id+'/import_products';
    return this.http.post(url,products,headers)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
  }

  uploadServiceExcel(id:Number,files: File[]):Observable<Catalogue> {
    let services = {
      'attachment_file' : files
    }
    let headers= this.authService.getHeaders();
    let url = this.catalogueUrl+'/'+id+'/import_services';
    return this.http.post(url,services,headers)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
  }

  getProductList(id:Number){
    let url = this.catalogueUrl+'/'+id+'/products';
    return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  viewProduct(id:Number,secid:Number) {
    let headers= this.authService.getHeaders(); 
    let url = this.catalogueUrl+'/'+secid+'/products/'+id;
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  viewServiceDetails(id:Number,secid:Number){
    let headers= this.authService.getHeaders(); 
    let url = this.catalogueUrl+'/'+secid+'/catalogue_services/'+id;
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getServices(secid) {
    let headers= this.authService.getHeaders(); 
    let url = this.catalogueUrl+'/'+secid+'/catalogue_services/all_service_list';
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  // Catalogue Revamp

  fetchAllProducts(page?){
    let headers= this.authService.getHeaders(); 
    let url = environment.apiBaseUrl+'/v1/products/all_product_list';
    let params: URLSearchParams = new URLSearchParams();
      params.set('page', page);
    this.options.search = params;  
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

   fetchAllRanges(){
    let headers= this.authService.getHeaders(); 
    let url = environment.apiBaseUrl+'/v1/tags/all_ranges';
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchAllSpaces(){
    let headers= this.authService.getHeaders(); 
    let url = environment.apiBaseUrl+'/v1/tags/all_spaces';
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchCategories(space_ids){
    let headers= this.authService.getHeaders(); 
    let url = environment.apiBaseUrl+'/v1/sections/categories_for_spaces?space_ids='+space_ids;
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchSubCategories(category_ids,space_ids){
    let headers= this.authService.getHeaders(); 
    let url = environment.apiBaseUrl+'/v1/sections/configurations?category_ids='+category_ids+'&space_ids='+space_ids;
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  filterProducts(search_string="",range_tags=[],space_tags=[],category_ids=[],
    materials=[],colors=[],finishes=[],configurations=[],minimum_price="",
    maximum_price="",minimum_lead_time="",maximum_lead_time="",minimum_length="",
    maximum_length="",minimum_width="",maximum_width="",minimum_height="",maximum_height="",newpro="",page?){
    let headers= this.authService.getHeaders(); 
    let filter_hash = {};
    filter_hash["range_tags"]=range_tags;
    filter_hash["space_tags"]=space_tags;
    filter_hash["category_ids"]=category_ids;
    filter_hash["materials"]=materials;
    filter_hash["colors"]=colors;
    filter_hash["finishes"]=finishes;
    filter_hash["configurations"]=configurations;
    filter_hash["minimum_price"]=minimum_price;
    filter_hash["maximum_price"]=maximum_price;
    filter_hash["minimum_lead_time"]=minimum_lead_time;
    filter_hash["maximum_lead_time"]=maximum_lead_time;
    filter_hash["minimum_price"]=minimum_price;
    filter_hash["minimum_length"]=minimum_length;
    filter_hash["maximum_length"]=maximum_length;
    filter_hash["minimum_width"]=minimum_width;
    filter_hash["maximum_width"]=maximum_width;
    filter_hash["minimum_height"]=minimum_height;
    filter_hash["maximum_height"]=maximum_height;
    filter_hash["new"]=newpro;
    let filter_params = JSON.stringify(filter_hash);

    let params: URLSearchParams = new URLSearchParams();
    params.set('page', page);
    this.options.search = params; 
    
    let url = environment.apiBaseUrl+'/v1/sections/products/filter?search_string='+search_string+'&filter_params='+filter_params;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  fetchSliderValues(search_string="",range_tags=[],space_tags=[],category_ids=[],configurations=[]
    ){
    let headers= this.authService.getHeaders(); 
    let filter_hash = {};
    filter_hash["range_tags"]=range_tags;
    filter_hash["space_tags"]=space_tags;
    filter_hash["category_ids"]=category_ids;
    filter_hash["configurations"]=configurations;
    let filter_params = JSON.stringify(filter_hash);
 
    let url = environment.apiBaseUrl+'/v1/sections/products/slider_ranges?search_string='+search_string+'&filter_params='+filter_params;
    return this.http.get(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getProductDetails(id:Number,secid:Number){
    let url = environment.apiBaseUrl+'/v1/products/'+id;
    if(this.options.params){
      this.options.params.delete('section_id');
    }
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  filterNewProducts(subcategory_ids,search_string,class_ids,minimum_price,maximum_price,minimum_lead_time,maximum_lead_time,minimum_width,maximum_width,minimum_length,maximum_length,minimum_height,maximum_height,sort_key,liked,page){
 
    let filter_hash = {};
    filter_hash["class_ids"]=class_ids;
    filter_hash["sort_key"]=sort_key;
    filter_hash["minimum_price"]=minimum_price;
    filter_hash["maximum_price"]=maximum_price;
    filter_hash["minimum_lead_time"]=minimum_lead_time;
    filter_hash["maximum_lead_time"]=maximum_lead_time;
    filter_hash["minimum_price"]=minimum_price;
    filter_hash["minimum_length"]=minimum_length;
    filter_hash["maximum_length"]=maximum_length;
    filter_hash["minimum_width"]=minimum_width;
    filter_hash["maximum_width"]=maximum_width;
    filter_hash["minimum_height"]=minimum_height;
    filter_hash["maximum_height"]=maximum_height;
    filter_hash["liked"]=liked;
    let filter_params = JSON.stringify(filter_hash);


    let url = environment.apiBaseUrl+'/v1/sections/products/filter?subcategory_ids='+subcategory_ids+'&search_string='+search_string+'&filter_params='+filter_params;
    let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getMegamenu(){
    let url = environment.apiBaseUrl+'/v1/catalog/megamenu';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchSliderValuesNew(){
    let url = environment.apiBaseUrl+'/v1/sections/products/slider_ranges';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  likeProduct(product_id){
    let url = environment.apiBaseUrl+'/v1/products/'+product_id+'/like';
    return this.http.post(url,{}, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchProductDetails(product_id){
    let url = environment.apiBaseUrl+'/v1/products/'+product_id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  listMasterOptions(product_id){
    let url = environment.apiBaseUrl+'/v1/products/'+product_id+'/get_product_master_fabrics';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  listSubOptions(mo_id){
    let url = environment.apiBaseUrl+'/v1/products/get_product_master_sub_options?master_option_id='+mo_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  listCatalogueOptions(so_id){
    let url = environment.apiBaseUrl+'/v1/products/get_product_catalogue_options?master_sub_option_id='+so_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  listVariations(co_id){
    let url = environment.apiBaseUrl+'/v1/products/get_product_variants?catalogue_option_id='+co_id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  uploadExcel(basefile){
    let url = environment.apiBaseUrl+'/v1/products/import_excel';

    let  data = {
                  attachment : basefile
                }
    return this.http.post(url,data,this.options)
      .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  segmentShow(category_type,category_id,page?){
    let url;
    if(category_type == 'segment'){
      url = environment.apiBaseUrl+'/v1/catalog/segment_show?segment_id='+category_id;
    }
    else if(category_type == 'category'){
      url = environment.apiBaseUrl+'/v1/catalog/category_show?category_id='+category_id;
    }
    let params: URLSearchParams = new URLSearchParams();
      params.set('page', page);
    this.options.search = params; 
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }
 catalogType(userId,value){
  var obj ={
          'catalog_type': value
      }
  let url = environment.apiBaseUrl+'/v1/users/'+userId+'/change_catalog_type';
  return this.http.post(url,obj,this.options)
  .map(this.extractData)
  .catch(this.handleErrorObservable);


  }
   
}
