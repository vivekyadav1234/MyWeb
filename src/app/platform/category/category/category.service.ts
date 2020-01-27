import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Options } from 'selenium-webdriver/firefox';

@Injectable()
export class CategoryService {

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

    private extractDataOne(res: Response) {
      let body = res;
      return body;
    }

    private handleErrorObservable (error: Response | any) {
      return Observable.throw(error.message || error);
    }

    addbrand(data){
    	var url = environment.apiBaseUrl+'/v1/brands';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listbrands(){
    	var url = environment.apiBaseUrl+'/v1/brands';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateBrand(data, brandId){
    	var url = environment.apiBaseUrl+'/v1/brands/'+brandId;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deleteBrand(brandId){
    	var url = environment.apiBaseUrl+'/v1/brands/'+brandId;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfBrand(brandId){
    	var url = environment.apiBaseUrl+'/v1/brands/'+brandId;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    addCoreMateial(data){
    	var url = environment.apiBaseUrl+'/v1/core_materials';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listCoreMateial(){
    	var url = environment.apiBaseUrl+'/v1/core_materials';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateCoreMaterials(data, materialId){
    	var url = environment.apiBaseUrl+'/v1/core_materials/'+materialId;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deleteCoreMaterials(materialId){
    	var url = environment.apiBaseUrl+'/v1/core_materials/'+materialId;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfCoreMaterials(materialId){
    	var url = environment.apiBaseUrl+'/v1/core_materials/'+materialId;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    addShutter_finishes(data){
    	var url = environment.apiBaseUrl+'/v1/shutter_finishes';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listShutter_finishes(){
    	var url = environment.apiBaseUrl+'/v1/shutter_finishes';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateShutter_finishes(data, id){
    	var url = environment.apiBaseUrl+'/v1/shutter_finishes/'+id;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deleteShutter_finishes(id){
    	var url = environment.apiBaseUrl+'/v1/shutter_finishes/'+id;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfShutter_finishes(id){
    	var url = environment.apiBaseUrl+'/v1/shutter_finishes/'+id;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    addShades(data){
    	var url = environment.apiBaseUrl+'/v1/shades';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listShades(){
    	var url = environment.apiBaseUrl+'/v1/shades';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateShades(data, id){
    	var url = environment.apiBaseUrl+'/v1/shades/'+id;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deleteShades(id){
    	var url = environment.apiBaseUrl+'/v1/shades/'+id;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfShades(id){
    	var url = environment.apiBaseUrl+'/v1/shades/'+id;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    addSkirting_configs(data){
    	var url = environment.apiBaseUrl+'/v1/skirting_configs';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listSkirting_configs(){
    	var url = environment.apiBaseUrl+'/v1/skirting_configs';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateSkirting_configs(data, id){
    	var url = environment.apiBaseUrl+'/v1/skirting_configs/'+id;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deleteSkirting_configs(id){
    	var url = environment.apiBaseUrl+'/v1/skirting_configs/'+id;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfSkirting_configs(id){
    	var url = environment.apiBaseUrl+'/v1/skirting_configs/'+id;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    addModule_types(data){
    	var url = environment.apiBaseUrl+'/v1/module_types';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listModule_types(){
    	var url = environment.apiBaseUrl+'/v1/module_types';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateModule_types(data, id){
    	var url = environment.apiBaseUrl+'/v1/module_types/'+id;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deleteModule_types(id){
    	var url = environment.apiBaseUrl+'/v1/module_types/'+id;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfModule_types(id){
    	var url = environment.apiBaseUrl+'/v1/module_types/'+id;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }
    addhandles(data){
    	var url = environment.apiBaseUrl+'/v1/handles';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listhandles(){
    	var url = environment.apiBaseUrl+'/v1/handles';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updatehandles(data, id){
    	var url = environment.apiBaseUrl+'/v1/handles/'+id;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deletehandles(id){
    	var url = environment.apiBaseUrl+'/v1/handles/'+id;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfhandles(id){
    	var url = environment.apiBaseUrl+'/v1/handles/'+id;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    addhardware_types(data){
    	var url = environment.apiBaseUrl+'/v1/hardware_types';
    	 return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listhardware_types(){
    	var url = environment.apiBaseUrl+'/v1/hardware_types';
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    listCategoryFilteredhardware_types(category){
        var url = environment.apiBaseUrl+'/v1/hardware_types?category='+category;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updatehardware_types(data, id){
    	var url = environment.apiBaseUrl+'/v1/hardware_types/'+id;
    	 return this.http.patch(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

   	deletehardware_types(id){
    	var url = environment.apiBaseUrl+'/v1/hardware_types/'+id;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getDetailsOfhardware_types(id){
    	var url = environment.apiBaseUrl+'/v1/hardware_types/'+id;
    	return this.http.get(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    // Hardware Elements

    addhardware_elements(data){
        var url = environment.apiBaseUrl+'/v1/hardware_elements';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listhardware_elements(){
        var url = environment.apiBaseUrl+'/v1/hardware_elements';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updatehardware_elements(data, id){
        var url = environment.apiBaseUrl+'/v1/hardware_elements/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

       deletehardware_elements(id){
        var url = environment.apiBaseUrl+'/v1/hardware_elements/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfhardware_elements(id){
        var url = environment.apiBaseUrl+'/v1/hardware_elements/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    // Carcass Elements

    addcarcass_elements(data){
        var url = environment.apiBaseUrl+'/v1/carcass_elements';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listcarcass_elements(){
        var url = environment.apiBaseUrl+'/v1/carcass_elements';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updatecarcass_elements(data, id){
        var url = environment.apiBaseUrl+'/v1/carcass_elements/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

       deletecarcass_elements(id){
        var url = environment.apiBaseUrl+'/v1/carcass_elements/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfcarcass_elements(id){
        var url = environment.apiBaseUrl+'/v1/carcass_elements/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addaddon(data){
        var url = environment.apiBaseUrl+'/v1/addons';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listaddons(){
        var url = environment.apiBaseUrl+'/v1/addons';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateaddon(data, id){
        var url = environment.apiBaseUrl+'/v1/addons/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteaddon(id){
        var url = environment.apiBaseUrl+'/v1/addons/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfaddon(id){
        var url = environment.apiBaseUrl+'/v1/addons/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addcombinedDoor(data){
        var url = environment.apiBaseUrl+'/v1/combined_doors';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listCombined_doors(){
        var url = environment.apiBaseUrl+'/v1/combined_doors';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateCombined_door(data, id){
        var url = environment.apiBaseUrl+'/v1/combined_doors/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteCombined_door(id){
        var url = environment.apiBaseUrl+'/v1/combined_doors/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfCombined_door(id){
        var url = environment.apiBaseUrl+'/v1/combined_doors/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addHardware_element_types(data){
        var url = environment.apiBaseUrl+'/v1/hardware_element_types';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listHardware_element_types(){
        var url = environment.apiBaseUrl+'/v1/hardware_element_types';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listCategoryFilteredHardware_element_types(category){
        var url = environment.apiBaseUrl+'/v1/hardware_element_types?category='+category;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateHardware_element_types(data, id){
        var url = environment.apiBaseUrl+'/v1/hardware_element_types/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteHardware_element_types(id){
        var url = environment.apiBaseUrl+'/v1/hardware_element_types/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfHardware_elemtype(id){
        var url = environment.apiBaseUrl+'/v1/hardware_element_types/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addCarcass_element_types(data){
        var url = environment.apiBaseUrl+'/v1/carcass_element_types';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listCarcass_element_types(){
        var url = environment.apiBaseUrl+'/v1/carcass_element_types';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateCarcass_element_types(data, id){
        var url = environment.apiBaseUrl+'/v1/carcass_element_types/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteCarcass_element_types(id){
        var url = environment.apiBaseUrl+'/v1/carcass_element_types/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listCarcass_elements(category){
        var url = environment.apiBaseUrl+'/v1/carcass_elements?category='+category;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listHardware_elements(category){
        var url = environment.apiBaseUrl+'/v1/hardware_elements?category='+category;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfCarcass_elemtype(id){
        var url = environment.apiBaseUrl+'/v1/carcass_element_types/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addCategories(data){
        var url = environment.apiBaseUrl+'/v1/kitchen_categories';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listCategories(){
        var url = environment.apiBaseUrl+'/v1/kitchen_categories';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateCategories(data, id){
        var url = environment.apiBaseUrl+'/v1/kitchen_categories/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteCategories(id){
        var url = environment.apiBaseUrl+'/v1/kitchen_categories/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addCoreMaterialPrices(data){
        var url = environment.apiBaseUrl+'/v1/core_material_prices';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listCoreMaterialPrices(){
        var url = environment.apiBaseUrl+'/v1/core_material_prices';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateCoreMaterialPrices(data, id){
        var url = environment.apiBaseUrl+'/v1/core_material_prices/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteCoreMaterialPrices(id){
        var url = environment.apiBaseUrl+'/v1/core_material_prices/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfCategories(id){
        var url = environment.apiBaseUrl+'/v1/kitchen_categories/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addCustomElement(data){
        var url = environment.apiBaseUrl+'/v1/custom_elements';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listCustomElement(){
        var url = environment.apiBaseUrl+'/v1/custom_elements';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateCustomElement(data, id){
        var url = environment.apiBaseUrl+'/v1/custom_elements/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteCustomElement(id){
        var url = environment.apiBaseUrl+'/v1/custom_elements/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfCustomElement(id){
        var url = environment.apiBaseUrl+'/v1/custom_elements/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    shadesShutterFinishMapping(){
      var mappingUrl = environment.apiBaseUrl+'/v1/shutter_finishes/shades_mapping';
      return this.http.get(mappingUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    coreMaterialShutterFinishMapping(){
      var mappingUrl = environment.apiBaseUrl+'/v1/shutter_finishes/core_material_mapping';
      return this.http.get(mappingUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    moduleAddonsMapping(){
      var mappingUrl = environment.apiBaseUrl+'/v1/product_modules/addons_mapping';
      return this.http.get(mappingUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    kitchenAddonsMapping(product_module_id){
      var mappingUrl = environment.apiBaseUrl+'/v1/product_modules/'+product_module_id+'/kitchen_module_addon';
      return this.http.get(mappingUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    kitchenModuleMapping(){
      var mappingUrl = environment.apiBaseUrl+'/v1/kitchen_categories/kitchen_module_mapping';
      return this.http.get(mappingUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    fetchShades(){
      var shadesUrl = environment.apiBaseUrl+'/v1/shades';
      return this.http.get(shadesUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    fetchShutter(){
      var shutterUrl = environment.apiBaseUrl+'/v1/shutter_finishes';
      return this.http.get(shutterUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    fetchAddon(category = null){
      if(category == null){
        var addonUrl = environment.apiBaseUrl+'/v1/addons';
      }
      else{
        var addonUrl = environment.apiBaseUrl+'/v1/addons?category='+category;
      }
      return this.http.get(addonUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    fetchModuleType(category = "kitchen"){
      var moduleTypeUrl = environment.apiBaseUrl+'/v1/module_types?category='+category;
      return this.http.get(moduleTypeUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    fetchProductModule(category){
      var moduleTypeUrl = environment.apiBaseUrl+'/v1/product_modules?category='+category;
      return this.http.get(moduleTypeUrl,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    submitMapping(obj, active_selection){
      if(active_selection=="shades_shutter_finish"){
        var url = environment.apiBaseUrl+'/v1/shutter_finishes/shades_mapping';
      }
      else if(active_selection=="core_material_shutter"){
        var url = environment.apiBaseUrl+'/v1/shutter_finishes/core_material_mapping';
      }

      else if(active_selection=="module_addons"){
        var url = environment.apiBaseUrl+'/v1/product_modules/addons_mapping';
      }
      else if(active_selection=="kitchen_category_module_type"){
        var url = environment.apiBaseUrl+'/v1/kitchen_categories/kitchen_module_mapping';
      }

      else if(active_selection == "kitchen_module_addons"){
        var url = environment.apiBaseUrl+'/v1/product_modules/kitchen_module_addon';
      }
      return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    createModule(data){
        var url = environment.apiBaseUrl+'/v1/product_modules';
        var obj = {
            "product_module": data
        }
        return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }

    listModules(){
        var url = environment.apiBaseUrl+'/v1/product_modules';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateModules(data, id){
        var url = environment.apiBaseUrl+'/v1/product_modules/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteModules(id){
        var url = environment.apiBaseUrl+'/v1/product_modules/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }


    //  method to get wip projects for category role
    getWipProjectList(){

        var url = environment.apiBaseUrl+'/v1/users/wip_leads_for_category';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }


    getApprovedBoqList(projectId,proposal_type){
        var url = environment.apiBaseUrl+'/v1/proposals/category_boqs_of_project?project_id='+projectId+'&proposal_type='+proposal_type;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


    }

    listEdgebandingShades(){
        var url = environment.apiBaseUrl+'/v1/edge_banding_shades';
        return this.http.get(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    addEdgebandingShades(data){
        var url = environment.apiBaseUrl+'/v1/edge_banding_shades';
         return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    updateEdgebandingShades(data, id){
        var url = environment.apiBaseUrl+'/v1/edge_banding_shades/'+id;
         return this.http.patch(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    deleteEdgebandingShades(id){
        var url = environment.apiBaseUrl+'/v1/edge_banding_shades/'+id;
         return this.http.delete(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    getDetailsOfEdgebandingShades(id){
        var url = environment.apiBaseUrl+'/v1/edge_banding_shades/'+id;
        return this.http.get(url,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
    }
    getCustomElements(projectId){
        var url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements';
        return this.http.get(url,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);

    }
    addCustomPrice(data,customId,projectId){
         var url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements/'+customId+'/add_custom_element_price';

        return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }

    addServiceCategory(data){
        var url = environment.apiBaseUrl+'/v1/service_categories';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listService_categories(){
        var url = environment.apiBaseUrl+'/v1/service_categories';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateService_categories(data, id){
        var url = environment.apiBaseUrl+'/v1/service_categories/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteService_categories(id){
        var url = environment.apiBaseUrl+'/v1/service_categories/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfService_categories(id){
        var url = environment.apiBaseUrl+'/v1/service_categories/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addService_subcategories(data){
        var url = environment.apiBaseUrl+'/v1/service_subcategories';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listService_subcategories(service_category_id?){
        var url = environment.apiBaseUrl+'/v1/service_subcategories?service_category_id='+service_category_id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateService_subcategories(data, id){
        var url = environment.apiBaseUrl+'/v1/service_subcategories/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteService_subcategories(id){
        var url = environment.apiBaseUrl+'/v1/service_subcategories/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfService_subcategories(id){
        var url = environment.apiBaseUrl+'/v1/service_subcategories/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addService_activities(data){
        var url = environment.apiBaseUrl+'/v1/service_activities';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listService_activities(){
        var url = environment.apiBaseUrl+'/v1/service_activities';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateService_activities(data, id){
        var url = environment.apiBaseUrl+'/v1/service_activities/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteService_activities(id){
        var url = environment.apiBaseUrl+'/v1/service_activities/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfService_activities(id){
        var url = environment.apiBaseUrl+'/v1/service_activities/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addKitchen_appliances(data){
        var url = environment.apiBaseUrl+'/v1/kitchen_appliances';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listKitchen_appliances(){
        var url = environment.apiBaseUrl+'/v1/kitchen_appliances';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateKitchen_appliances(data, id){
        var url = environment.apiBaseUrl+'/v1/kitchen_appliances/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteKitchen_appliances(id){
        var url = environment.apiBaseUrl+'/v1/kitchen_appliances/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfKitchen_appliances(id){
        var url = environment.apiBaseUrl+'/v1/kitchen_appliances/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getModuletypeForKitchen_appliances(){
        var url = environment.apiBaseUrl+'/v1/module_types/appliance_types';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    fetchFloorplan(project_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/floorplans';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    fetchCad(project_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/cad_drawings';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    listaddontags(){
        var url = environment.apiBaseUrl+'/v1/tags';
         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addAddontags(data){
        var url = environment.apiBaseUrl+'/v1/tags';
         return this.http.post(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    updateAddontags(data, id){
        var url = environment.apiBaseUrl+'/v1/tags/'+id;
         return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteAddontags(id){
        var url = environment.apiBaseUrl+'/v1/tags/'+id;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfAddontags(id){
        var url = environment.apiBaseUrl+'/v1/tags/'+id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateAddontagOfAddon(data,addonid){
        var url = environment.apiBaseUrl+'/v1/addons/'+addonid+'/update_tags';
        return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    getVendorCategories(){
        var url = environment.apiBaseUrl+'/v1/vendors/get_vendor_categories';
         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    getSubcategoryList(value){
      var url = environment.apiBaseUrl+'/v1/vendors/get_vendor_sub_categories?parent_category_id='+value;
         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    getCities(){
       var url = environment.apiBaseUrl+'/v1/cities';
         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    postVendorForm(data,basefile_gst,basefile_pan,basefile_cheque,dd_upload_attachments){
        data['pan_copy'] = basefile_pan;
        data['gst_attachments'] = basefile_gst;
        data['cancelled_cheque'] = basefile_cheque;
        data['dd_upload_attachments'] = dd_upload_attachments;
         
        var obj ={
            "vendor": data,
            "sub_category_ids": data['sub_category_ids'],
            "serviceable_city_ids": data['serviceable_city_ids']
        }
        var url = environment.apiBaseUrl+'/v1/vendors';
         return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }
    deleteVendor(vendorId){
        var url = environment.apiBaseUrl+'/v1/vendors/'+vendorId;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }

    getVendorList(page?,search?,status?,filterValue?){
        var url = environment.apiBaseUrl+'/v1/vendors';
         var params: URLSearchParams = new URLSearchParams();
         params.set('search', search);
         params.set('page',page);
         params.set('filter_by_type', status);
         params.set('filter_by_id',filterValue);
         var opt = this.options;
         opt.search = params;
         return this.http.get(url,opt)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);

    }
    getVendorDetails(value){
        var url = environment.apiBaseUrl+'/v1/vendors/'+value;

         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }
    postUpdateVendorForm(vendorId,data,basefile_pan,basefile_gst,basefile_cheque,UploadDDlist_Item,contents_to_delete_ddlist){
        data['pan_copy'] = basefile_pan;
        data['gst_attachments'] = basefile_gst;
        data['cancelled_cheque'] = basefile_cheque;
        data['dd_upload_attachments'] = UploadDDlist_Item;
        data['contents_to_delete'] = contents_to_delete_ddlist;
        var obj ={
            "vendor": data,
            "sub_category_ids": data['sub_category_ids'],
            "serviceable_city_ids": data['serviceable_city_ids']
        }
         
        var url = environment.apiBaseUrl+'/v1/vendors/'+vendorId;
         return this.http.patch(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }
    getVendorPage(size){
        var url = environment.apiBaseUrl+'/v1/vendors?page_size='+size;

         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }
    fetchBoqList(project_id){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/boq_and_ppt_uploads/get_boqs';

      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }
    fetchPptList(project_id){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/boq_and_ppt_uploads/get_ppts';

      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    filteredVendors(search_string,category_id,sub_category_id,serviceable_city_id){
        var filterobj = {
            category_id:category_id,
            sub_category_id:sub_category_id,
            serviceable_city_id:serviceable_city_id
        }
        var filterstr ='&filter_params='+JSON.stringify(filterobj);
        var url = environment.apiBaseUrl+'/v1/vendors/index_new?search_string='+search_string+filterstr;
         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    projectVendors(project_id,quotation_id){
        var url = environment.apiBaseUrl+'/v1/vendors/get_vendor_list';
         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    /* GET all the job_elements of a BOQ line item*/
    getjob_elements_of_BOQlineitem(project_id,quotation_id,ownerable_type,ownerable_id){
       var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+
       '/job_elements/index_by_job?ownerable_type='+ownerable_type+'&ownerable_id='+ownerable_id;
         return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }
    postjob_elements_of_BOQlineitem(project_id,quotation_id,ownerable_type,ownerable_id,formval){
       var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+
       '/job_elements';
       var obj = {
            'job_element': {
                'element_name':formval.element_name,
                'ownerable_type': ownerable_type,
                'ownerable_id': ownerable_id
            }
        }
        return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    deletejob_elements_of_BOQlineitem(project_id,quotation_id,jobelemid){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+jobelemid;
        return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updatejob_elements_of_BOQlineitem(project_id,quotation_id,jobelemid,ownerable_type,ownerable_id,updatedval){
        var obj = {
            'job_element': {
                'element_name':updatedval,
                'ownerable_type': ownerable_type,
                'ownerable_id': ownerable_id
            }
        }
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+jobelemid;
        return this.http.patch(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getDeatils_of_job_elements_of_BOQlineitem(project_id,quotation_id,jobelemid){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+jobelemid;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    addvendorToLineitem(project_id,quotation_id,jobelemid,obj){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+jobelemid+'/add_vendor';
        return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deletevendorToLineitem(project_id,quotation_id,jobelemid,vendor_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+
        jobelemid+'/remove_vendor?vendor_id='+vendor_id;
        return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    updatevendorToLineitem(project_id,quotation_id,jobelemid,obj,vendor_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id
        +'/job_elements/'+jobelemid+'/update_vendor_details?vendor_id='+vendor_id;
        return this.http.patch(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    updateVendorSelection(project_id,quotation_id,jobelemid,obj){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+jobelemid+'/update_vendor_details';
        return this.http.patch(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    getVendorListForVendorSelection(id){
        var url = environment.apiBaseUrl + '/v1/vendors/index_new?job_element_id='+id;
        let params: URLSearchParams = new URLSearchParams();
        params.set('job_element_id', id);
        this.options.search = params;
        return this.http.get(url, this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    // get quotations for po
    getQuotationsList(){
        var url = environment.apiBaseUrl+'/v1/projects/quotations_for_po';
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

    createPurchaseOrder(milestone_elements, shipping_address,contact_person,contact_number,billing_address,billing_contact_person,billing_contact_number, vendor_gst,purchase_elements, quotation_id, project_id,vendor_id, status){
        var obj = {
            'purchase_order': {
                'quotation_id': quotation_id,
                'project_id': project_id,
                'vendor_id': vendor_id,
                'shipping_address': shipping_address,
                'status': status,
                'contact_person': contact_person,
                'contact_number': contact_number,
                'billing_address': billing_address,
                'billing_contact_person':billing_contact_person,
                'billing_contact_number': billing_contact_number,
                'vendor_gst':vendor_gst
            },
            milestone_elements,
            'purchase_elements': purchase_elements
        }
        var url = environment.apiBaseUrl+'/v1/purchase_orders/';
        return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    
    updatePurchaseOrder(milestone_elements, shipping_address,contact_person,contact_number,billing_address,billing_contact_person,billing_contact_number, vendor_gst,purchase_elements, quotation_id, project_id,vendor_id, status, purchase_order_id){
        var obj = {
            'purchase_order': {
                'id': purchase_order_id,
                'quotation_id': quotation_id,
                'project_id': project_id,
                'vendor_id': vendor_id,
                'shipping_address': shipping_address,
                'status': status,
                'contact_person': contact_person,
                'contact_number': contact_number,
                'billing_address': billing_address,
                'billing_contact_person':billing_contact_person,
                'billing_contact_number': billing_contact_number,
                'vendor_gst':vendor_gst
            },
            milestone_elements,
            'purchase_elements': purchase_elements
        }
        var url = environment.apiBaseUrl+'/v1/purchase_orders/'+purchase_order_id;
        return this.http.put(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    exportLeads(){
       let url = environment.apiBaseUrl+'/v1/projects/download_custom_elements';
      return this.http.get(url,this.options)
      .map(response => {
                if (response.status == 400) {
                    this.handleErrorObservable;
                } else if (response.status == 200) {
                    // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    // //var blob = response['_body'];
                    // var blob = new Blob([(<any>response)._body], { type: contentType });
                   // var url = environment.apiBaseUrl+'/'+response['_body'];
                    return response;
                }
            })
        .catch(this.handleErrorObservable);
    }

    getQuotationCountForCategory(){
        var url = environment.apiBaseUrl+'/v1/projects/quotations_count_for_category';
        return this.http.get(url, this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    getCustomElementProjectList(page){
        var url = environment.apiBaseUrl + '/v1/projects/projects_by_custom_elements'+'?page='+page;
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }
    getPreProductionProjectList(sub_status, page){
        var url = environment.apiBaseUrl + '/v1/projects/pre_production_projects'+'?sub_tab='+sub_status+'&page='+page;
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getPIUploadProjectList(page, searchQuery){
        var url = ""
        if(searchQuery){
            url = environment.apiBaseUrl + '/v1/pre_production_quotations_pi_upload'+'?search='+searchQuery;
        }
        else{
            url = environment.apiBaseUrl + '/v1/pre_production_quotations_pi_upload'+'?page='+page;
        }

        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getCadApprovalProjectList(page?){
        var url = environment.apiBaseUrl + '/v1/projects/projects_for_cad';
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getQuotation(project_id,boq_id){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+boq_id+'/client_quotation_display';
      return this.http.get(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
    }

    getProjectListForTasksTab(proposal_type,page){
        let url = environment.apiBaseUrl+'/v1/projects/projects_by_quotations_wip_status?proposal_type='+proposal_type+'&page='+page;
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }
    getBoqListForTasksTab(proposal_type,projectid){
        let url = environment.apiBaseUrl+'/v1/proposals/category_boqs_of_project?project_id='+projectid+'&proposal_type='+proposal_type;
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getBoqListForPaymentReleaseTab(page,searchQuery){
        var url = ""
        if(searchQuery){
            url = environment.apiBaseUrl + '/v1/pre_production_quotations_payment_release'+'?search='+searchQuery;
        }
        else{
            url = environment.apiBaseUrl + '/v1/pre_production_quotations_payment_release'+'?page='+page;
        }
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getBoqListForPreProductionTab(page,searchParam){
        var url = "";
        if(searchParam){
            url = environment.apiBaseUrl + '/v1/pre_production_quotations'+'?search='+searchParam;
        }
        else{
            url = environment.apiBaseUrl + '/v1/pre_production_quotations'+'?page='+page;
        }
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }
    getLineItemsForPreProductionTab(projectid, quotationid){
        let url = environment.apiBaseUrl + '/v1/projects/'+projectid+'/quotations/'+quotationid+'/job_elements';
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }
    boqApproval(projectId,boqId,quoteStatus){
        let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqId+'/cm_category_approval';
        var data = {
            approve: quoteStatus
        }

        return this.http.post(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getCADBOQS(projectid){
        let url = environment.apiBaseUrl+'/v1/projects/'+projectid+'/quotations/cad';
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getCADFiles(projectid, quotationId){
        let url = environment.apiBaseUrl+'/v1/projects/'+projectid+'/quotations/'+quotationId+'/cad_uploads';
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }
    getBoqDetailsForPreProductionVendorMapping(projectid,boq_id){
        let url = environment.apiBaseUrl+'/v1/projects/'+projectid+'/quotations/'+boq_id+'/pre_production_quotations_line_items';
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }
    addSublineItem(data,project_id,quotation_id,ownerable_id,ownerable_type){
    	var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements';
        var obj = {
            'job_element': data,
            'project_id':project_id,
            'quotation_id':quotation_id
        }
        return this.http.post(url,obj,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateSublineItem(data,project_id,quotation_id,ownerable_id,ownerable_type,lineitem_id){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+ lineitem_id;
        var obj = {
            'job_element': data,
            'project_id':project_id,
            'quotation_id':quotation_id,
            'id':lineitem_id
        }
        return this.http.patch(url,obj,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getBoqListForSli(page, searchQuery){
        var url = ""
        if(searchQuery){
          url = environment.apiBaseUrl + '/v1/pre_production_quotation_for_sli'+'?search='+searchQuery;
        }
        else{
          url = environment.apiBaseUrl + '/v1/pre_production_quotation_for_sli'+'?page='+page;
        }
        return this.http.get(url,this.options)
          .map(this.extractDataPage)
          .catch(this.handleErrorObservable);
    }

    getBOQListForPORelease(page, searchQuery){
        var url = ""
        if(searchQuery){
            url = environment.apiBaseUrl + '/v1/pre_production_quotations_po_release'+'?search='+searchQuery;
        }
        else{
            url = environment.apiBaseUrl + '/v1/pre_production_quotations_po_release'+'?page='+page;
        }
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }
    getLineItemsListForSli(boq_id,project_id){
        let url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+boq_id+'/pre_production_quotation_for_sli_line_items';
        return this.http.get(url,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
    }
    addOtherItem(data,project_id,quotation_id){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/';
        var obj = {
            'job_element': data,
            'project_id':project_id,
            'quotation_id':quotation_id
        }
        return this.http.post(url,obj,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    deleteSublineItem(project_id,boq_id,subline_item_id){
    	var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+boq_id+'/job_elements/'+subline_item_id;
    	 return this.http.delete(url,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    updateOtherItem(data,project_id,quotation_id,ownerable_id,ownerable_type,lineitem_id){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/job_elements/'+ lineitem_id;
        var obj = {
            'job_element': data,
            'project_id':project_id,
            'quotation_id':quotation_id,
            'id':lineitem_id
        }
        return this.http.patch(url,obj,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    // pi upload starts here
    createPerformaInvoice(project_id,quotation_id,vendor_id,amount,description,tax_value, file){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/performa_invoices';
        var obj = {
            'performa_invoice': {
                'quotation_id':quotation_id,
                'vendor_id': vendor_id,
                'base_amount': amount,
                'description':description,
                'tax_percent':tax_value,
                'pi_upload':file,
            },
            'project_id':project_id,
            'quotation_id':quotation_id
        }
        return this.http.post(url,obj,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getPerformaInvoicesByQuotation(project_id,quotation_id) {
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/performa_invoices';
        return this.http.get(url,this.options)
                .catch(this.handleErrorObservable);
    }

    getPOByQuotation(project_id,quotation_id){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/quotations_po';
        return this.http.get(url,this.options)
                .catch(this.handleErrorObservable);
    }

    getPoPiMappingByQuotation(project_id,quotation_id) {
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/purchase_order_performa_invoices';
        return this.http.get(url,this.options)
                .catch(this.handleErrorObservable);
    }

    createPoPiMapping(project_id,quotation_id,purchase_order_id,performa_invoice_id){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+'/purchase_order_performa_invoices';
        var obj = {
            'purchase_order_performa_invoice': {
                'purchase_order_id':purchase_order_id,
                'performa_invoice_id': performa_invoice_id
            },
            'project_id':project_id,
            'quotation_id':quotation_id
        }
        return this.http.post(url,obj,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }

    getPOListForBOQ(project_id){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/quotations_po';
        return this.http.get(url,this.options)
            .catch(this.handleErrorObservable);
    }
   // Pi upload ends here
    getPo_Pi_MappingOfBoq(projectid,quotid){
        let url = environment.apiBaseUrl +'/v1/projects/'+projectid+'/quotations/'+quotid+'/purchase_order_performa_invoices';
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getPo_Pi_MappingOfPR(projectid,quotid){
        let url = environment.apiBaseUrl +'/v1/projects/'+projectid+'/quotations/'+quotid+'/quotations_payment_release_line_items';
        return this.http.get(url,this.options)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getHistoryOfPR(performa_invoice_id){
        let url = environment.apiBaseUrl +'/v1/pi_payments?performa_invoice_id='+performa_invoice_id;
        return this.http.get(url,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
    }

    raiseRequest(payload){
        let url = environment.apiBaseUrl+'/v1/pi_payments';

        var obj = {}
        obj['pi_payment'] = payload
        return this.http.post(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    savePayment(projectId,obj, attachment){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments';
      if(attachment){
        obj['image'] = attachment;
      }
      var data = {
        'payment': obj,
        'project_id':obj.project_id
      }
      return this.http.post(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    searchCategoryProjects(tab,searchParam){
        var url = environment.apiBaseUrl + '/v1/projects/search_project_for_category?tab='+tab+'&search='+searchParam;
        return this.http.get(url,this.options)
        .map(this.extractDataPage)
        .catch(this.handleErrorObservable);
    }

    updateCASeen(project_id, q_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+q_id+'/cad_uploads/change_category_seen_status';
        var data = {}
        return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateCESeen(project_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/custom_elements/change_category_seen_status';
        var data = {}
        return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateFBASeen(project_id, quote_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quote_id+'/change_category_seen_status';
        var data = {}
        return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
                    }

    cancelPurchaseOrder(purchase_order_id){
        var obj ={
                  "id": purchase_order_id,

                }
        var url = environment.apiBaseUrl + '/v1/purchase_orders/'+purchase_order_id+'/cancel_purchase_order';
              return this.http.patch(url, obj, this.options)
                           .map(this.extractData)
                           .catch(this.handleErrorObservable);
    }

    flagSLIItems(project_id,quotation_id,flag){
        var obj ={
            "project_id": project_id,
            "quotation_id":quotation_id,
            "flag":flag
          }
        var url=environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+quotation_id+
        '/change_sli_flag?status='+flag;
        return this.http.patch(url, obj, this.options)
                           .map(this.extractData)
                           .catch(this.handleErrorObservable);
    }

    getVendorProducts(master_line_item_id?,vendor_id?,page?){
        var url = environment.apiBaseUrl+'/v1/vendor_products';
         var params: URLSearchParams = new URLSearchParams();
         params.set('master_line_item_id', master_line_item_id);
         params.set('page', page);
         params.set('vendor_id',vendor_id);
         var opt = this.options;
         opt.search = params;
         return this.http.get(url,opt)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }

		getVendorProductsList(master_line_item_id?,vendor_id?,page?){
        var url = environment.apiBaseUrl+'/v1/vendor_products/list';
         var params: URLSearchParams = new URLSearchParams();
         params.set('master_line_item_id', master_line_item_id);
         params.set('page', page);
         params.set('vendor_id',vendor_id);
         var opt = this.options;
         opt.search = params;
         return this.http.get(url,opt)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }

    getVendorProductsList2(searchedItem?, vendor_id?, page?){
        var url = environment.apiBaseUrl+'/v1/vendor_products/list';
            var params: URLSearchParams = new URLSearchParams();
            params.set('search', searchedItem);
            params.set('page', page);
            params.set('vendor_id',vendor_id);
            var opt = this.options;
            opt.search = params;
            return this.http.get(url,opt)
                .map(this.extractDataPage)
                .catch(this.handleErrorObservable);
    }

    getMasterVendorProducts(page, master_line_item_id?, vendor_id?, search?){
        var url = environment.apiBaseUrl+'/v1/vendor_products';
        
        
        
        var params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        if(master_line_item_id){
            params.set('master_line_item_id', master_line_item_id);
        }

        if(vendor_id){
            params.set('vendor_id', vendor_id);
        }

        if(search){
            params.set('search',search);
        }

        var opt = this.options;
         opt.search = params;

         return this.http.get(url,opt)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }

    getDetailsOfVendorProduct(id){
        var url = environment.apiBaseUrl + '/v1/vendor_products/'+id;
        if(this.options.params){
            this.options.params.delete('master_line_item_id');
            this.options.params.delete('vendor_id');
            this.options.params.delete('mli_type');
            this.options.params.delete('page');
        }
        return this.http.get(url,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
    }



    getMasterLineItems(mli_type,page?){

        var url = environment.apiBaseUrl +'/v1/master_line_items';
        if(this.options.params){
            this.options.params.delete('master_line_item_id');
            this.options.params.delete('vendor_id');
        }
        if(this.options.params && !page){
            this.options.params.delete('page');
        }
        var opt = this.options;
        var params: URLSearchParams = new URLSearchParams();
        if(page){
            params.set('page', page);
            params.set('no_pagination', 'false');
        } else {
            params.set('no_pagination', 'true');
        }
        params.set('mli_type', mli_type);
          opt.search = params;
          if(page){
            return this.http.get(url,opt)
            .map(this.extractDataPage)
            .catch(this.handleErrorObservable);
          }else{
            return this.http.get(url,opt)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
          }

    }

    getAllMasterLineItems(mli_type_id?){
        var url = environment.apiBaseUrl +'/v1/master_line_items/index_new?mli_type='+mli_type_id;
        return this.http.get(url,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
    }

    getAllVendors(){
        var url = environment.apiBaseUrl +'/v1/vendors/get_vendor_list';
        return this.http.get(url,this.options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
    }    
    getMasterLineItemDetails(id){
        var url = environment.apiBaseUrl +'/v1/master_line_items/'+id;
        if(this.options.params){
            this.options.params.delete('master_line_item_id');
            this.options.params.delete('vendor_id');
            this.options.params.delete('mli_type');
            this.options.params.delete('page');
        }
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    createVendorProduct(vendor_product,dynamic_attributes){
        var url = environment.apiBaseUrl+'/v1/vendor_products';
        var obj = {
            "vendor_product": vendor_product,
            "dynamic_attributes": dynamic_attributes
        };
        return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    deleteVendorProduct(id){
    	var url = environment.apiBaseUrl+'/v1/vendor_products/'+id;
    	 return this.http.delete(url,this.options)
    }
    getPOPdfForPreview(purchase_order_id){
        var url = environment.apiBaseUrl + '/v1/purchase_orders/'+purchase_order_id+'/purchase_order_view';
        if(this.options.params){
            this.options.params.delete('page');
        }
        return this.http.get(url,this.options)
            .catch(this.handleErrorObservable);
    }
    getPOPdfForPreviewForBulk(purchase_order_id){
        var url = environment.apiBaseUrl + '/v1/po_wip_orders/'+purchase_order_id+'/po_wip_order_view';
        if(this.options.params){
            this.options.params.delete('page');
        }
        return this.http.get(url,this.options)
            .catch(this.handleErrorObservable);

    }

    deletePOPdf(filepath){
    	var url = environment.apiBaseUrl+'/v1/purchase_orders/delete_purchase_order_view?filepath='+filepath;
        var data = {}
        return this.http.post(url,data,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }


    updateVendorProduct(vendor_product,dynamic_attributes,product_id){
        var url = environment.apiBaseUrl+'/v1/vendor_products/'+product_id;
        var obj = {
            "vendor_product": vendor_product,
            "dynamic_attributes": dynamic_attributes
        };
        return this.http.patch(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getProcurementList(){
        var url = environment.apiBaseUrl + '/v1/master_line_items/procurement_types';
        if(this.options.params){
            this.options.params.delete('master_line_item_id');
            this.options.params.delete('vendor_id');
            this.options.params.delete('mli_type');
            this.options.params.delete('page');
        }
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    getUOMList(){
        var url = environment.apiBaseUrl + '/v1/vendor_products/list_units_array';
        if(this.options.params){
            this.options.params.delete('master_line_item_id');
            this.options.params.delete('vendor_id');
            this.options.params.delete('mli_type');
            this.options.params.delete('page');
        }
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getViewOptionsForMasterSLI(project_id,boq_id,subline_item_id)
    {
        var url = environment.apiBaseUrl +
                  '/v1/projects/'+project_id+'/quotations/'+boq_id+'/job_elements/'+subline_item_id+'/view_options';
                  if(this.options.params){
                      this.options.params.delete('page');
                  }
                  return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    getViewOptionsForMasterSLIForBulkPO(subline_item_id){
      var url = environment.apiBaseUrl +
                  '/v1/wip_slis/'+subline_item_id+'/view_options';
                  if(this.options.params){
                      this.options.params.delete('page');
                  }
                  return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }

    changeMasterSLI(project_id,boq_id,subline_item_id,vendor_product_id){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+
                  boq_id+'/job_elements/'+subline_item_id+'/change_master_sli';
        var obj = {
            "vendor_product_id": vendor_product_id
        };
        return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    changeMasterSLIForClubbedInBulkPO(subline_item_id,vendor_product_id,type?){
      var url = environment.apiBaseUrl+'/v1/wip_slis/'+subline_item_id+'/change_wip_sli';
      var params: URLSearchParams = new URLSearchParams();
        params.set('sli_type', type);
        this.options.search = params;
        var obj = {
            "vendor_product_id": vendor_product_id
        };
        return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);



    }

    releaseOrder(id){
        var url = environment.apiBaseUrl+'/v1/purchase_orders/'+id+'/release_po';
        var obj ={
            "id": id,
          }
        return this.http.patch(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);


    }

    modifyOrder(id){
        var url = environment.apiBaseUrl+'/v1/purchase_orders/'+id+'/modify_po';
        var obj ={
            "id": id,
          }
        return this.http.patch(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);


    }

    releaseModifiedOrder(id){
        var url = environment.apiBaseUrl+'/v1/purchase_orders/'+id+'/release_modified_po';
        var obj ={
            "id": id,
          }
        return this.http.patch(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);


    }
    downloadPoRelease(id){
        var url = environment.apiBaseUrl +
                  '/v1/purchase_orders/'+id+'/generate_po_pdf';
                  return this.http.get(url,this.options)
                     .map(response => {
              if (response.status == 400) {
                  this.handleErrorObservable;
              } else if (response.status == 200) {
                  // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                  // //var blob = response['_body'];
                  // var blob = new Blob([(<any>response)._body], { type: contentType });
                  //var url = environment.apiBaseUrl+'/'+response['_body'];
                  return response;
              }
          })
                     .catch(this.handleErrorObservable);

    }

    getClubViewDetails(boqId,projectId){
        var url = environment.apiBaseUrl +
                  '/v1/projects/'+projectId+'/quotations/'+boqId+'/pre_production_quotations_vendor_wise_line_items';
                  return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


    }
    getClubViewDetailsForPO(boqId){
        var url = environment.apiBaseUrl +
                  '/v1/purchase_orders/vendor_wise_line_items_for_po?quotation_id='+boqId;
                  return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


    }
    editSliQty(Qty,Job_elem_ids){
        var url = environment.apiBaseUrl+'/v1/job_elements/edit_po_qty?qty='+Qty+'&job_elements='+Job_elem_ids;
          var obj ={
              'qty':Qty,
              'job_elements':Job_elem_ids

          }
         return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


    }
    getClubViewDetailsForPoReleased(projectId){
        var url = environment.apiBaseUrl +
                  '/v1/projects/'+projectId+'/purchase_orders';
                  return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


    }

		getQuotationPo(projectId, boq_id){
        var url = environment.apiBaseUrl +
                  '/v1/projects/'+projectId+'/quotations/'+boq_id+'/purchase_orders';
                  return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


    }

    getSLIByJobElement(project_id, boq_id,obj){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+boq_id+'/job_elements/auto_populate_slis';
        var data = {
            'procurement_method':obj.procurement_method,
            'line_items':obj.line_items
        }
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    deleteSelectedSLI(project_id, boq_id,ids){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+boq_id+'/job_elements/destroy_selected';
        var data = {'ids': ids};
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);
    }

    importPOAutomationFiles(project_id,boq_id,attachment){
        var url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+boq_id+'/job_elements/imos_import_global';
        var obj = {
            "attachment": attachment
        }
    	 return this.http.post(url,obj,this.options)
    	 			.map(this.extractData)
    	 			.catch(this.handleErrorObservable);
    }
    updateSublineItemInClubbed(projectId,QuotationId,data){

        var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/quotations/'+QuotationId+'/job_elements/update_clubbed';
        if(this.options.params){

            this.options.params.delete('mli_type');
            this.options.params.delete('page');
        }
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);

    }
    changeMasterSLIForClubbed(project_id,boq_id,sublineId,vendorProductId){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+boq_id+'/job_elements/'+sublineId+'/set_alternate_sli';
        
        var obj = {
            'vendor_product_id':vendorProductId
        }
        if(this.options.params){

            this.options.params.delete('job_element');
            
        }
        return this.http.post(url,obj,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);

    }

    changeMasterSLIForClubbedView(project_id,boq_id,jobElements,vendorProductId){
        var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/'+boq_id+'/job_elements/set_alternate_sli_clubbed';
        
        var obj = {
            'vendor_product_id':vendorProductId,
            'job_elements':jobElements
        }
        if(this.options.params){

            this.options.params.delete('job_element');
            
        }
        return this.http.post(url,obj,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);

    }


  //Function to genrate Client address
  clientAddressValue(lead_id){
    var url = environment.apiBaseUrl + '/v1/projects/'+lead_id+'/client_address';
        return this.http.get(url,this.options)
        .map(this.extractDataOne)
        .catch(this.handleErrorObservable);
    }



  deleteOneSli(projectID,boqId,sliId){
     
    var url = environment.apiBaseUrl+'/v1/projects/'+projectID+'/quotations/'+boqId+'/job_elements/'+sliId;
       return this.http.delete(url,this.options)
                   .map(this.extractData)
                   .catch(this.handleErrorObservable);


  }
    UpdateSlis(projectID,boqId,sliId,data){
        var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/quotations/'+boqId+'/job_elements/'+sliId+'/update_sli_details';
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);


    }
    UpdateClubbedSlis(projectID,boqId,data){
        var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/quotations/'+boqId+'/job_elements/update_clubbed';
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);


    }
    UpdateUom(projectID,boqId,data){
        var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/quotations/'+boqId+'/job_elements/uom_conversion';
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);


    }
    getSliDetails(projectID,boqId,jobElementID){
        var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/quotations/'+boqId+'/job_elements/'+jobElementID+'/line_item_details'
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    ADDSlis(projectID,boqId,data){
         

        var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/quotations/'+boqId+'/create_multi_slis';
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);


    }
    ADDClubbedSlis(projectID,boqId,data){
       
        var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/quotations/'+boqId+'/create_clubbed_jobs';
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);

    }	
    deleteSelectedSli(projectID,boqId,data, subLineItemArrForClubbedItem){
        var requestData=[...data, ...subLineItemArrForClubbedItem];
        var obj = {
            'ids': JSON.stringify(requestData)
        }
        var url = environment.apiBaseUrl+'/v1/projects/'+projectID+'/quotations/'+boqId+'/job_elements/destroy_selected';
         return this.http.post(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }
    getVendorsInPo(boqID){
      var url = environment.apiBaseUrl + '/v1/purchase_orders/line_items_for_po?quotation_id='+boqID;
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

    }

    //   getAddressForPO(projectID){
    //     var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/client_address';
    //         return this.http.get(url,this.options)
    //         .map(this.extractData)
    //         .catch(this.handleErrorObservable);


    //   } 
  finalsubmissionOfPO(data){
       
       var url = environment.apiBaseUrl + '/v1/purchase_orders';
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);

  } 
  getPOPaymentList(boqID){
      var url = environment.apiBaseUrl + '/v1/purchase_orders/po_payment_list?quotation_id='+boqID;
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

  }
  raiseRequestForPO(value,poId){
      var obj ={
          'amount': value
      }
      var url = environment.apiBaseUrl + '/v1/purchase_orders/'+poId+'/raise_po_payment';
        return this.http.post(url,obj,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);


  }
  uploadFileInPI(data){
      var url = environment.apiBaseUrl + '/v1/performa_invoice_files';
        return this.http.post(url,data,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);

  }
    deletePiPayment(piId){
    var url = environment.apiBaseUrl+'/v1/pi_payments/'+piId;
       return this.http.delete(url,this.options)
                   .map(this.extractData)
                   .catch(this.handleErrorObservable);

   }


  ////To get table data
  getWipTable(page,type?){
   var url = environment.apiBaseUrl + '/v1/wip_slis';
   var params: URLSearchParams = new URLSearchParams();
   params.set('page', page);
   params.set('type', type);
   this.options.search = params;
    return this.http.get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }	


  //to add item
  addSublineItems(data){
    var url = environment.apiBaseUrl + '/v1/wip_slis';
     
    var wip_sli = {
      'wip_sli':{
      'quantity': data.quantity,
      'tax_type': data.tax_type,
      'tax': data.tax_percent,
      'vendor_product_id': data.vendor_product_id,
      'sli_type': data.sli_type

     }   
      
    }
     
    return this.http.post(url,wip_sli,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


    //to remove item
    removeSliItems(id){
        var url = environment.apiBaseUrl+'/v1/wip_slis/'+id;
        return this.http.delete(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    //to download dd list file
    dowloadDDlist(file_type){
       var url = environment.apiBaseUrl + '/v1/vendors/sample_dd_files';
       var params: URLSearchParams = new URLSearchParams();
        params.set('file_type', file_type);
        this.options.search = params;
       return this.http.get(url,this.options)
        .map(response => {
              if (response.status == 400) {
                  this.handleErrorObservable;
              } else if (response.status == 200) {
                  // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                  // //var blob = response['_body'];
                  // var blob = new Blob([(<any>response)._body], { type: contentType });
                  //var url = environment.apiBaseUrl+'/'+response['_body'];
                  return response;
              }
          })
        .catch(this.handleErrorObservable); 
    }

  //to get projects_for_handover
  getProjectList(page?,search?){
    var url = environment.apiBaseUrl + '/v1/projects/projects_for_handover';
    var params: URLSearchParams = new URLSearchParams();
    params.set('page',page);
    params.set('search',search);
    if(this.options.params){
      this.options.params.delete('page');
    }
    var opt = this.options;
    opt.search = params;
    return this.http.get(url,opt)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }

  //to generate request
  sendRequest(data,lead_id){
    let eventUrl = environment.apiBaseUrl+ '/v1/projects/'+lead_id+'/requested_files';
    var obj= {
      "remarks": data["remark_description"],
    }
    return this.http.post(eventUrl,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
  }


  //to edit sli
  updateSliItems(id,data){
    var url = environment.apiBaseUrl + '/v1/wip_slis/'+id;
    var wip_sli = {
      'quantity': data.quantity,
      'tax_type': data.tax_type,
      'tax': data.tax,
    }
    return this.http.patch(url,wip_sli,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  //to get address
  getAddressForPO(projectID){
    var url = environment.apiBaseUrl + '/v1/projects/'+projectID+'/client_address';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  //to relase po
  poSubmit(data,idsArr){
       
    var url = environment.apiBaseUrl + '/v1/po_wip_orders';
    var po_wip_order = {
      'billing_address': data.billing_address,
      'billing_contact_person': data.billing_contact_person,
      'billing_contact_number': data.billing_contact_number,
      'shipping_address': data.shipping_address,
      'shipping_contact_person': data.contact_person,
      'shipping_contact_number': data.contact_number,
      'lead_id': data.lead_id,
      'po_type': data.type,
      'vendor_gst': data.vendor_gst,
      'tag_snag': data.tag_snag,  
      //slis ids
      "wip_sli_ids":idsArr,
    }
     
    return this.http.post(url,po_wip_order,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  //to get po data-table list
  getWipPoTable(page,type?){
    var url = environment.apiBaseUrl + '/v1/po_wip_orders';
    var params: URLSearchParams = new URLSearchParams();
    params.set('page', page);
    params.set('type', type);
    this.options.search = params;
    return this.http.get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }

  //to cancle or modify po
  modifyPos(id,option){
    var url = environment.apiBaseUrl + '/v1/po_wip_orders/'+id+'/take_action_on_po';
    var po_wip_order = {
      'status': option,
    }
     
    return this.http.patch(url,po_wip_order,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to release Po
  updateRecivedpos(id,poData){
    var url = environment.apiBaseUrl + '/v1/po_wip_orders/'+id+'/receive_po';
    var obj = {
      'received_slis' : poData,
    }
     
    return this.http.patch(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }


  ////to get full line item
  getFullLineItems(id){
    var url = environment.apiBaseUrl + '/v1/po_wip_orders/'+id+'/get_full_line_items';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  //inventory table
  getInventoryTable(page,location){
    var url = environment.apiBaseUrl + '/v1/po_inventories';
    var params: URLSearchParams = new URLSearchParams();
    params.set('page', page);
    params.set('location',location);
    this.options.search = params;
    return this.http.get(url, this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  } 
  modifyQtyForInventory(inventoryId,data){
    var url = environment.apiBaseUrl + '/v1/po_inventories/'+inventoryId+'/update_min_stock_and_tat';
    return this.http.post(url,data,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  getCityListForInventory(){
    var url = environment.apiBaseUrl + '/v1/po_inventories/inventory_locations';
    if(this.options.params){
        this.options.params.delete('page');

    }
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }
  ADDSlisForProjectMaintainancePo(data){
      var url = environment.apiBaseUrl + '/v1/wip_slis/add_custom_sli';
       return this.http.post(url,data,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getLeadListForPoRelease(value){
    var url = environment.apiBaseUrl + '/v1/leads/search_leads?lead_id='+value;
    if(this.options.params){
        this.options.params.delete('id');
        this.options.params.delete('page');
        this.options.params.delete('typegetWipPoTable');

    }
     
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }
  fetchReleasePoList(quotation_id){
      let url = environment.apiBaseUrl+'/v1/quotaions/'+quotation_id+'/quotaion_po?status=released';

      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }
    fetchAllPoList(quotation_id,po_id){
        let url = environment.apiBaseUrl+'/v1/quotations/'+quotation_id+'/purchase_orders/'+po_id+'/po_details';
        // let url = environment.apiBaseUrl+'/v1/quotations/2894/purchase_orders/282/po_details';

        return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }   
    /* authored by : Kaartik@Gloify.com */
    scheduleQC(status,scheduledDate,itemList,remarks,files,clubbed_job_elements_ids){
        let url = environment.apiBaseUrl+'/v1/quality_checks/update_job_element_qc_date';
        let body;    

        body={
                status: status,
                qc_date: scheduledDate || new Date(),
                job_element_ids: itemList,
                remarks: remarks,
                files: files,
                clubbed_job_elements_ids:clubbed_job_elements_ids
            }

        return this.http.post(url,body,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }   
    
    /* authored by : Kaartik@Gloify.com */
    saveDispatchReadinessDate(itemList,date,remarks,clubbed_job_elements_ids){
        let url = environment.apiBaseUrl+'/v1/job_element/dispatch_readiness';
        let body={
            readiness_date: date,
            job_element_ids: itemList,
            remarks: remarks,
            clubbed_job_elements_ids:clubbed_job_elements_ids
        }
        return this.http.post(url,body,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }
    /* authored by : Kaartik@Gloify.com */
    saveDispatchScheduleDate(itemList,status,dispatchedBy,scheduleDate,site,billingAddress,shippingAddress,remarks,dispatchedItems,pendingItems,files,clubbed_job_elements_ids){
        let url = environment.apiBaseUrl+'/v1/job_element/dispatch_schedule';
        let body={
            job_element_ids: itemList,
            status: status,   // scheduled/dispatched/partial/completed
            dispatched_by: dispatchedBy,
            schedule_date: new Date (scheduleDate),
            site: site,
            billing_address: billingAddress,
            shipping_address: shippingAddress,
            remarks: remarks,
            dispatched_items: dispatchedItems,
            pending_items: pendingItems,
            files:files,
            clubbed_job_elements_ids:clubbed_job_elements_ids
        }
        return this.http.post(url,body,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }       
    /* authored by : Kaartik@Gloify.com */
    deliverItems(itemList,status,dispatchedItems,pendingItems,clubbed_job_elements_ids){
        let url = environment.apiBaseUrl+'/v1/job_element/delivery_states';
        let body={
            job_element_ids: itemList,
            status: status,   // scheduled/dispatched/partial/complete
            dispatched_items: dispatchedItems,
            pending_items: pendingItems,
            clubbed_job_elements_ids:clubbed_job_elements_ids
        }
        return this.http.post(url,body,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }
    
    /* authored by : Kaartik@Gloify.com */
    viewHistory(itemId,historyOf){
        let url = environment.apiBaseUrl+'/v1/job_element/mt-history?job_element_id='+itemId+'&tab_name='+historyOf;
        let params = new HttpParams();
        params = params.append('job_element_id', itemId);
        params = params.append('tab_name', historyOf);
        
        let option=this.authService.getHeaders();
        
        return this.http.get(url,option)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

  //to get categorised list of handover files
  getCategorisedList(project_id){
    var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/project_handovers/grouped_index?parent_handover_id=0';
    var params: URLSearchParams = new URLSearchParams();
    var status=['pending_acceptance','accepted','rejected'];
    params.set('status',JSON.stringify(status));
    this.options.search = params;
    return this.http.get(url,this.options)
    .map(this.extractDataOne)
    .catch(this.handleErrorObservable);
  }

  //Accept & Rejected Function
  rejectFun(handover_id,project_id,status,role,data?){
    let eventUrl = environment.apiBaseUrl+ '/v1/projects/'+project_id+'/project_handovers/'+handover_id+'/category_action_on_handover';
    var obj= {
      "status":status,
      "segment":role,
      "remarks": data["remark_description"],
    }
     
    if(this.options.params){
            this.options.params.delete('status');
    }
    return this.http.post(eventUrl,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
  }
  getProjectBoqListForHandover(project_id){
      var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/final_approved_quotations';
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

  }
  getProjectBoqListForCuttingBOM(project_id){
      var url = environment.apiBaseUrl + '/v1/projects/'+project_id+'/quotations/splitted_quotations';
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

  }
  getLineItems(projectId,boqId){
      var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/quotations/'+boqId+'/line_items_for_splitting';
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
  }
  getLineItemsForCutting(projectId,boqId){
      var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/quotations/'+boqId+'/line_items_for_cutting_list';
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

  }
  getFilesToAssign(projectId,category,status){
      let obj ={
          'category':category
      }
       
      var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/project_handovers/grouped_index';
      var params: URLSearchParams = new URLSearchParams();
         params.set('category',JSON.stringify(category));
         params.set('status',status);
         this.options.search = params;
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);


  }
  sendAssignedFiles(data){
    let eventUrl = environment.apiBaseUrl+ '/v1/production_drawings';
  
    let obj ={
          'production_drawings':data
    }
    return this.http.post(eventUrl,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
       

  }
  getSplitTag(){
    var url = environment.apiBaseUrl + '/v1/production_drawings/get_spit_tags';
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

  }
  uploadFile(project_id,postData){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/project_handovers/upload_files_from_category';
      return this.http.post(url,postData,this.options)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
  }

  removeDrawings(fileId){
    var url = environment.apiBaseUrl+'/v1/production_drawings/'+fileId;
         return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


  }
  submitSplitData(postData){
    let obj ={
      'splits_for_line_item':postData
    } 
     let url = environment.apiBaseUrl+'/v1/production_drawings/add_or_remove_splits';
      return this.http.patch(url,obj,this.options)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);


  }

  //to make new to old or to remove 
  newFalse(project_id){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/seen_by_category_for_handover';
    return this.http.post(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  //to update panel and non-panel
  PanelNonChange(ownerable_id,project_id,panel){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/cad_drawings/'+ownerable_id+'/update_panel';
    var obj = {
      "panel": panel,
    }
    return this.http.post(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  //to update panel and non-panel 3d
  PanelNonChangeForThreeD(i_id,project_id,panel){
      var id=project_id;

    let url = environment.apiBaseUrl+'/v1/projects/'+id+'/update_panel_for_three_d_image';
    var obj = {
        "t_id" : i_id,
      "panel": panel,
    }
    return this.http.post(url,obj,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  sendAssignedFileForCutting(data,boqId){
      
     
    let eventUrl = environment.apiBaseUrl+ '/v1/contents/upload_cutting_list_and_boms';
  
    let obj ={
          'content':data,
          'quotation_id':boqId
           
    }
    return this.http.post(eventUrl,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
    sendAssignedFileForNotCutting(data,value){
     
    let eventUrl = environment.apiBaseUrl+ '/v1/contents/set_no_bom_and_cutting_list';
  
    let obj ={  
         'jobs':data,
         'not_needed':value
    }
    
    return this.http.post(eventUrl,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);

  }

  //to remove lineitem
  removeCuttingItem(id,quotationId){
   var url = environment.apiBaseUrl+'/v1/contents/'+id+'/destroy_bom';
   let obj ={
         'quotation_id':quotationId,
    }
    return this.http.patch(url,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
  }

  //to remove selected lineitem
  clearSli(data){
    var url = environment.apiBaseUrl+'/v1/contents/clear_contents_by_ids';
    var params: URLSearchParams = new URLSearchParams();
    params.set('content_ids',JSON.stringify(data));
     
    this.options.search = params;
    return this.http.delete(url,this.options)
   .map(this.extractData)
   .catch(this.handleErrorObservable);
  }
  downloadBoqCheatSheet(projectId,BoqId){    
      var url = environment.apiBaseUrl +
      '/v1/projects/'+projectId+'/quotations/'+BoqId+'/download_boq_pdf';
       
      let params: URLSearchParams = new URLSearchParams();
        params.set('quoatation_id', BoqId);
        this.options.search = params;
      return this.http.get(url,this.options)
         .map(response => {
        if (response.status == 400) {
            this.handleErrorObservable;
        } else if (response.status == 200) {
            // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            // //var blob = response['_body'];
            // var blob = new Blob([(<any>response)._body], { type: contentType });
            //var url = environment.apiBaseUrl+'/'+response['_body'];
            return response;
        }
      })
              .catch(this.handleErrorObservable);  


  }
  // send to factory
    sendFactory(projectId){
    var id=projectId;
    let url = environment.apiBaseUrl+'/v1/projects/'+id+'/send_to_factory_mail';
      return this.http.get(url,this.options)
      .map(response => {
                if (response.status == 400) {
                    this.handleErrorObservable;
                } else if (response.status == 200) {
                    
                    return response;
                }
            })
        .catch(this.handleErrorObservable);
    }
   getViewChild(project_id,handover_id)
 
   {
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/project_handovers/'+handover_id+'/child_revisions';
 
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
  }

  clearList(data,value){
    let eventUrl = environment.apiBaseUrl+ '/v1/contents/change_no_bom_status'; 
    let obj ={
          'jobs':data,
          'remove':value
    }
    return this.http.post(eventUrl,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  selectService(customId,projectId,value){
      var obj ={
          'category_split': value
      }
      var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/custom_elements/'+customId+'/add_custom_element_space';
        return this.http.post(url,obj,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable);


  }
 
  manualSheetImport(projectId,quotationId,attachment){
    let eventUrl = environment.apiBaseUrl+ '/v1/projects/'+projectId+'/quotations/'+quotationId+'/job_elements/bom_sli_manual_sheet_import';
    let obj ={
          'content': attachment,
          'quotation_id':quotationId
    }
    return this.http.post(eventUrl,obj,this.options)
     .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  getClubbedViewList(project_id,quotationId){
   let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotationId+'/job_elements/clubbed_view';

     return this.http.get(url,this.options)
     .map(this.extractData)
    .catch(this.handleErrorObservable);

 }

  updateQC(projectId,qcType,status,file,remark){
      var params; 
     
        params = {
            
            "project_quality_check" : {
                "qc_type": qcType,
                "status": status,
                "remark": remark
            },
            "qc_file" : file
        }

      var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/project_quality_checks';
      return this.http.post(url,params,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  viewQCHistory(projectId,qcType){
    var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/project_quality_checks/qc_history?qc_type='+qcType;
    return this.http.get(url,this.options)
    .map(this.extractData)
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

 