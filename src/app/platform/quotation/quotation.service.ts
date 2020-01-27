import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from 'environments/environment';
import { Product } from '../organisation/catalogue/product';
import { filter } from 'rxjs/operators';


@Injectable()
export class QuotationService {

  options: RequestOptions;
  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
  ) {
     this.options = this.authService.getHeaders();
  }

  //var for save success message when boq is update
  updateBoqSuccessMessage = 'The Updated BOQ has been added in the Handover / Feasibility Screen. Please click on Handover Button to Handover the BOQ for Design QC and Approval'


  
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

    // getCustomerList() {
    //   this.http.get()
    // }
    requestRole(role:string) {
      let url = environment.apiBaseUrl+ '/v1/users/request_role';
      let params: URLSearchParams = new URLSearchParams();
      params.set('role', role);
      this.options.search = params;
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);


    }

    getProductList(sectionid,sectiontype): Observable<Product[]>{
      let url = environment.apiBaseUrl+'/v1/sections/products-for-catalog';
      var params: URLSearchParams = new URLSearchParams();
      params.set('section_id',sectionid );
      var opt = this.options;
      opt.search = params;
      return this.http.get(url,opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }
    getProductListForPPt(sectionid, sectiontype, page?){
      let url = environment.apiBaseUrl+'/v1/sections/products-for-catalog';
      var params: URLSearchParams = new URLSearchParams();
      params.set('section_id', sectionid );
      params.set('page', page);
      var opt = this.options;
      opt.search = params;
      
      return this.http.get(url, opt)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
    }

    getProductForConfiguration(secid,configId){
      let url = environment.apiBaseUrl+'/v1/sections/'+secid+'/products-for-configuration';
      var params: URLSearchParams = new URLSearchParams();
      params.set('configuration_id',configId );
      var opt = this.options;
      opt.search = params;
      return this.http.get(url,opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }
    getProductForThisProject(projectId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/product-catalog';
      return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }
    postBOQData(param:any, projectId) {
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations';
      return this.http.post(url,param,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    getQuotationList(projectId,status) {
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations';
      var params: URLSearchParams = new URLSearchParams();
      params.set('status',status );
      var opt = this.options;
      opt.search = params;
      return this.http.get(url,opt)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    deleteQuotation(projectId,id:number) {
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+id;
      return this.http.delete(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    viewQuotationDetails(projectId,id:number) {
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+id;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }



    // for import quotation 
    viewImportQuotationDetails(projectId,id:number){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+id+'/import_qoutation';
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }
    quotationApproval(id:Number,params:string){
      let url = environment.apiBaseUrl+'/v1/quotations/'+id+'/approve_quotation';
      let obj = {
       'quotation' : {
           'id':id,
           'status' :params+''
        }
      }
      return this.http.patch(url,obj,this.options)
          .map(this.extractData)
          .catch(this.handleErrorObservable);
    }

    getSections(){
      let url = environment.apiBaseUrl+'/v1/projects/select_sections';
      return this.http.get(url,this.options).map(this.extractData)
                  .catch(this.handleErrorObservable);
    }

    viewProduct(id:Number,secid:Number) {
      let url = environment.apiBaseUrl+'/v1/products/'+id;
      if(this.options.params){
        this.options.params.delete('section_id');
      }
      return this.http.get(url, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateHandoverBOQData(boqid,projectId,data,handover=null){
      let url;
      if(handover){
        url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqid+'?handover='+true;
      }
      else{
        url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqid+'?handover='+false;
      }
      if(this.options.params){
        this.options.params.delete('section_id');
      }
      return this.http.patch(url,data, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateBOQData(boqid,projectId,data){
      let url;
      url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqid;
      if(this.options.params){
        this.options.params.delete('section_id');
      }
      return this.http.patch(url,data, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateServiceData(boqid,projectId,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqid+"/update_service_jobs";
      if(this.options.params){
        this.options.params.delete('section_id');
      }
      return this.http.patch(url,data, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }


  downloadPdf(data,boqId,projectId){
    

    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqId+'/download_pdf';
    var params: URLSearchParams = new URLSearchParams();
    params.set('download_type', JSON.stringify(data));
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



    downloadboq(boqId,projectId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqId+'/download_boq';
      if(this.options.params){
        this.options.params.delete('status');
      }
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






    getDraftProposalList(proposal,projectId,Option){
      let url = environment.apiBaseUrl+'/v1/proposals/drafted_or_saved_proposals?proposal_type='+proposal+'&project_id='+projectId+'&is_draft='+Option;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }
    getsubmittedProposalList(proposal,projectId){
      let url = environment.apiBaseUrl+'/v1/proposals/submitted_proposals?proposal_type='+proposal+'&project_id='+projectId;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }



    getproposedProposalList(proposal,projectId){
      let url = environment.apiBaseUrl+'/v1/proposals?proposal_type='+proposal+'&project_id='+projectId;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);




    }

    shareToCustomer(proposalId,data){
      let url = environment.apiBaseUrl+'/v1/proposals/'+proposalId+'/share_with_customer';
      var params: URLSearchParams = new URLSearchParams();
      for(let obj of data){
        
      }
      params.set('customer_viewing_option', JSON.stringify(data));
      this.options.search = params;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }

    getGlobalVariable(category,arrivaeSelectValues=false){
      let url;
      if(arrivaeSelectValues)
        url = environment.apiBaseUrl+'/v1/boq_global_configs?category='+category+'&arrivae_select='+arrivaeSelectValues;
      else
      url = environment.apiBaseUrl+'/v1/boq_global_configs?category='+category;
      return this.http.get(url, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    postBoqGlobalConfig(data){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs';
      return this.http.post(url, data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateBoqGlobalConfig(data,id){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs/'+id;
      return this.http.patch(url, data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    deleteBoqGlobalConfig(id){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs/'+id;
      return this.http.delete(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateAndApplyBoqGlobalConfig(data,id){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs/'+id+'/update_and_apply';
      return this.http.patch(url, data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    listOfSpacesBoqConfig(){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs/list_of_spaces';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    //////Core Material///
    listofCoreMaterial(Core_material_name,arrivaeSelectValues=false){
      let url;
      if(arrivaeSelectValues)
        url = environment.apiBaseUrl+'/v1/core_materials/list_shutter_materials?core_material_name='+Core_material_name+'&arrivae_select='+arrivaeSelectValues;
      else
      url = environment.apiBaseUrl+'/v1/core_materials/list_shutter_materials?core_material_name='+Core_material_name;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    listofShutterFinishes(shutter_material_name,arrivaeSelectValues=false){
      let url;
      if(arrivaeSelectValues)
        url = environment.apiBaseUrl+'/v1/core_materials/list_finishes?shutter_material_name='+shutter_material_name+'&arrivae_select='+arrivaeSelectValues;
      else
      url = environment.apiBaseUrl+'/v1/core_materials/list_finishes?shutter_material_name='+shutter_material_name;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
// code for shuttermaterial
listofcorematerial(core,arrivaeSelectValues=false){
      let url;
      if(arrivaeSelectValues)
        url = environment.apiBaseUrl+'/v1/core_materials/:id/list_shutter_material='+core+'&arrivae_select='+arrivaeSelectValues;
      else
      url = environment.apiBaseUrl+'/v1/core_materials/:id/list_shutter_material='+core;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    listofShutterFinishShades(shutter_finish_id,arrivaeSelectValues=false){
      let url;
      if(arrivaeSelectValues)
        url = environment.apiBaseUrl+'/v1/shutter_finishes/list_shades?shutter_finish_name='+shutter_finish_id+'&arrivae_select='+arrivaeSelectValues;
      else
      url = environment.apiBaseUrl+'/v1/shutter_finishes/list_shades?shutter_finish_name='+shutter_finish_id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    listofSkirtingConfigs(skirting_type,arrivaeSelectValues=false){
      let url;
      if(arrivaeSelectValues)
        url = environment.apiBaseUrl+'/v1/skirting_configs/list_configs?skirting_type='+skirting_type+'&arrivae_select='+arrivaeSelectValues;
      else
        url=environment.apiBaseUrl+'/v1/skirting_configs/list_configs?skirting_type='+skirting_type;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getBoqGlobalConfig(category,quotationId){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs/get_config?category='+category+'&quotation_id='+quotationId;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    getKitchenCategories(){
      let url = environment.apiBaseUrl+'/v1/kitchen_categories';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    getModuleTypes(category){
      let url = environment.apiBaseUrl+'/v1/module_types?category='+category;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    getModulesListOfType(moduletypename,category){
      let url = environment.apiBaseUrl+'/v1/module_types/list_modules?category='+category+'&module_type_name='+moduletypename;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    setSpaces(space,projectId,quotationId,category){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotationId+'/set_spaces?category='+category;
      var obj = {
        'space': space
      }
      return this.http.patch(url,obj,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    addModuleToSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/add_modular_job';
       
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    addApplianceToKitchenSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/add_appliance_job';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    addExtraToKitchenSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/add_extra_job';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    addCustomElementToSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/update_custom_element_jobs';

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    updateModuleOfSpace(projectId,quotID,data,category){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/edit_modular_job?category='+category;

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    updateQuantity(projectId,quotID,data,category){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/edit_modular_job_quantity?category='+category;

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    updateApplianceOfSpace(projectId,quotID,data,category){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/edit_appliance_job';

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    updateExtraOfSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/edit_extra_job';

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    updateCustomElemOfSpace(projectId,quotID,data,category){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/update_custom_element_job';

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    deleteModuleToSpace(projectId,quotID,data,category){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/delete_modular_jobs?category='+category;
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    deleteApplianceToSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/delete_appliance_jobs';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    deleteExtraToSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/delete_extra_jobs';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    deleteCustomElemToSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/delete_custom_jobs';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    deleteServicejobToSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/delete_service_jobs';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    deleteSpaceFromBoq(projectId,quotID,space,category){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/delete_space?space='+space+'&category='+category;
      return this.http.patch(url,'',this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getCustomizationOfModule(modId,projectId,quotID){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/customization?modular_job_id='+modId;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    changeStatus(boqid,status1,projid){
      let url = environment.apiBaseUrl+'/v1/projects/'+projid+'/quotations/'+boqid+'/change-status';
      if(this.options.params){
        this.options.params.delete('status');
      }
      var data ={
        status:status1
      }
      return this.http.post(url,data, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

    }
    recalculateBoqAmt(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/recalculate_amount';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    uploadKDMaxExcel(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/import_kdmax_excel';
      return this.http.post(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    getModuleTypeListOfKitchenCat(kitchenCatID,category,civilkitchen?){
      let url = environment.apiBaseUrl+'/v1/kitchen_categories/'+kitchenCatID+'/kitchen_categories_module_type?civil_kitchen='+civilkitchen;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getBoqList(proposal,project){
      let url = environment.apiBaseUrl+'/v1/proposals/get_ownerables_for_proposals?project_id='+project+'&proposal_type='+proposal;
      return this.http.get(url,this.options).map(this.extractData)
                  .catch(this.handleErrorObservable);

    }
    postProposal(value){
      let url = environment.apiBaseUrl+'/v1/proposals';
      return this.http.post(url,value,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }
    getProposalList(proposal,projectId){
      let url = environment.apiBaseUrl+'/v1/proposals?proposal_type='+proposal+'&project_id='+projectId;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);



    }

    deleteProposal(value){
     let url = environment.apiBaseUrl+'/v1/proposals/'+value;
     return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

    }

    getViewlList(value,proposal){
      let url = environment.apiBaseUrl+'/v1/proposals/'+value;
      return this.http.get(url,this.options).map(this.extractData)
                  .catch(this.handleErrorObservable);

    }
    editpostProposal(value,propId){

       let url = environment.apiBaseUrl+'/v1/proposals/'+propId+'/add_ownerables_to_proposal';
      return this.http.post(url,value,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);


    }
    getDiscountBoqList(projectId){
      let url = environment.apiBaseUrl+'/v1/proposals/discount_proposed_boq?project_id='+projectId;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);


    }
    approveDiscountProposal(data,status,propDocId){
      let url = environment.apiBaseUrl+'/v1/proposals/aprove_or_reject_or_change_discount?proposal_doc_id='+propDocId+'&discount_status='+status;
      return this.http.post(url,data,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);


    }
    getProposedQuotationListByStatus(status,projectId){
      let url = environment.apiBaseUrl+'/v1/proposals/discount_proposed_boq?project_id='+projectId;
      return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }


    combineModules(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/combine_modules';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    editCombinedModule(projectId,quotID,data,modjobid){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/edit_combined_module?modular_job_id='+modjobid;
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    listCombined_doors(){
        var url = environment.apiBaseUrl+'/v1/combined_doors';
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    // Get the details of the matching edge band shade for a shade
    getMatchingEdgebandOfShade(shadeid){
      let url = environment.apiBaseUrl+'/v1/shades/'+shadeid+'/matching_edge_banding_shade';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
  

    getBrandForAddon(addonId,category){
      let url = environment.apiBaseUrl+'/v1/addons/'+addonId+'/brand_list?category='+category;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getAllBoqList(status,proposalId){
      let url = environment.apiBaseUrl+'/v1/proposals/approved_or_rejected_boqs?ownerable_type='+status+'&proposal_id='+proposalId;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

    }

    getBoqListByStatus(status,proposalId,Type){
      let url = environment.apiBaseUrl+'/v1/proposals/approved_or_rejected_boqs?is_approved='+status+'&proposal_id='+proposalId+'&ownerable_type='+Type;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);


    }
    getDiscountProposedProposalList(projectId){
       let url = environment.apiBaseUrl+'/v1/proposals/discount_proposed_boq?project_id='+projectId;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    savePayment(projectId,obj, attachment){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/payments';
      if(attachment){
        obj['image'] = attachment;
      }
      var data = {
        'payment': obj
      }
      return this.http.post(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getPaymentHistory(project_id){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/payments/payment_history';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    postEditProposal(value,propId){
      let url = environment.apiBaseUrl+'/v1/proposals/'+propId+'/add_ownerables_to_proposal';
      return this.http.post(url,value,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);

    }

    paymentHistory(id){
      let url = environment.apiBaseUrl+'/v1/proposals/payment_details_for_boq?quotation_id='+id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    deleteEditBoq(value){
      let url = environment.apiBaseUrl+'/v1/proposals/destroy_proposal_docs?proposal_doc_id='+value;
      return this.http.delete(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    getServiceCategoryList(){
      let url = environment.apiBaseUrl+'/v1/service_categories';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getServiceSubCategory(id){
      let url = environment.apiBaseUrl+'/v1/service_subcategories?service_category_id='+id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getServiceActivity(id = ""){
      var url
      if(id){
        url = environment.apiBaseUrl+'/v1/service_activities?service_subcategory_id='+id;
      }
      else{
        url = environment.apiBaseUrl+'/v1/service_activities';
      }

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

    getKitchen_appliances(module_type_id){
        var url = environment.apiBaseUrl+'/v1/kitchen_appliances?module_type_id='+module_type_id;
        return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    updateServiceJob(quotation_id,projectId,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotation_id+'/update_service_jobs';
      return this.http.patch(url,data,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    addCustom(data,projectId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements';

      return this.http.post(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);


    }
    getCustomElements(projectId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);


    }

    deleteElement(projectId,elementId){
     let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements/'+elementId;
      return this.http.delete(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    getCustomDetail(customId,projectId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements/'+customId;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    updateCustomElement(data,projectId,customId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements/'+customId;

      return this.http.patch(url,data,this.options)
          .map(this.extractData)
          .catch(this.handleErrorObservable);
    }

    getPricedCustom_elements(projectId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/custom_elements/priced_custom_elements';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    getHandleList(shutter_finish,product_module_id?){
       let url = environment.apiBaseUrl+'/v1/handles/handle_list?shutter_finish='+shutter_finish+'&product_module_id='+product_module_id;
        return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    /* get list of addons allowed for a module, a slot and a compulsory addon.*/

    getListofAddonsForAddons(addonid,addonType,product_module_id,slotname,filterobj,search_string,page){
      if(addonType){
        addonType='combination';
      }else{
        addonType='single';
      }
      // filterobj.addon_type=addonType;
      var filterstr ='&filter_params='+JSON.stringify(filterobj);
      let url = environment.apiBaseUrl+'/v1/addons/optional_addons_for_addons?product_module_id='+product_module_id+'&slot_name='+slotname+'&search_string='+search_string+'&page='+page+filterstr+'&addon_id='+addonid+'&addon_type='+addonType;
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
    getlistaddontags(type){
      
      var url = environment.apiBaseUrl+'/v1/tags?type='+type;
       return this.http.get(url,this.options)
                   .map(this.extractData)
                   .catch(this.handleErrorObservable);
  }
    getMakeforFilter(type){
      var url = environment.apiBaseUrl+'/v1/brands';
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

  fetchCadFiles(project_id,quotation_id){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/cad_uploads';
      return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  onCadUploadFormSubmit(project_id, quotation_id, basefile,filename, data){

    data['upload'] = basefile;
    data['file_name'] = filename;
    data['quotation_id'] = quotation_id;
    let obj = {
      "cad_upload": data
    }
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/cad_uploads';
    return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getKitchenExtras(filterobj?,category?,search_string?,page?){
    var filterstr ='&filter_params='+JSON.stringify(filterobj);
    // 
     let url = environment.apiBaseUrl+'/v1/addons/extras?search_string='+search_string+'&category='+category+'&page='+page+filterstr;
      return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  tagItem(project_id,quotation_id, tagging_file_id, data){
    data['quotation_id'] = quotation_id;
    let obj = {
      "tag_array": data
    }
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/cad_uploads/'+tagging_file_id+'/update_tags';
    return this.http.patch(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  approvalSubmit(project_id,quotation_id, tagging_file_id, obj){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/cad_uploads/'+tagging_file_id+'/change_status';
    return this.http.patch(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  deleteSectionFromBoq(projectId,quotation_id,data){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotation_id+'/delete_section';
    var obj = {
      'category':data
    }
    return this.http.patch(url,obj,this.options)
          .map(this.extractData)
          .catch(this.handleErrorObservable);
  }
  getCompulsoryAddons(filterobj,search_string,page,product_module_id,slot_name){
      var filterstr ='&filter_params='+JSON.stringify(filterobj);
      let url = environment.apiBaseUrl+'/v1/addons/compulsory_addons?product_module_id='+product_module_id+'&slot_name='+slot_name+'&search_string='+search_string+'&page='+page+filterstr;
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getOptionalAddons(category,product_module_id,filterobj,search_string,page){
      // if(addonType){
      //   addonType='combination';
      // }else{
      //   addonType='single';
      // }
      var filterstr ='&filter_params='+JSON.stringify(filterobj);
      let url = environment.apiBaseUrl+'/v1/addons/optional_addons?category='+category+'&product_module_id='+product_module_id+'&search_string='+search_string+'&page='+page+filterstr;
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    confirmAndApproveQuote(projectId, boqId,quoteStatus){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqId+'/cm_category_approval';
      var data = {
              approve: quoteStatus
          }

      return this.http.post(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
 

    subitBoqRemark(projectId,quotationId,remark){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotationId+'/update_remarks';
      var data ={
        "quotation": remark
      }
      if(this.options.params){
        this.options.params.delete('status');
      }
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

    }

    getGlobalPresets(category,page){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs/list_presets?page='+page+'&category='+category;
      return this.http.get(url,this.options)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }

    savePresetAsGlobal(category,presetid,quot_id){
      let url = environment.apiBaseUrl+'/v1/boq_global_configs/load_preset';
      var data={
        quotation_id:quot_id,
        category:category,
        preset_id:presetid
      };
      return this.http.post(url,data,this.options)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }

    getMkwLayouts(category,page){
      let url = environment.apiBaseUrl+'/v1/mkw_layouts?category='+category+'&page='+page;
      return this.http.get(url,this.options)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }
    getDetailsOfMkwLayouts(id){
      let url = environment.apiBaseUrl+'/v1/mkw_layouts/'+id;
      return this.http.get(url,this.options)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }
    postMkwLayout(category,data){
      let url = environment.apiBaseUrl+'/v1/mkw_layouts?category='+category;
      return this.http.post(url,data,this.options)
                     .map(this.extractDataPage)
                     .catch(this.handleErrorObservable);
    }
    deleteMkwLayout(id){
      let url = environment.apiBaseUrl+'/v1/mkw_layouts/'+id;
      return this.http.delete(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    getCustomizationOfMKWlayout(modid,layoutid){
      let url = environment.apiBaseUrl+'/v1/mkw_layouts/'+layoutid+'/customization?modular_job_id='+modid;
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    importMkwLayout(projectid,quotid,space,category,mkw_layout_id){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectid+'/quotations/'+quotid+'/import-layout';
      var obj= {
       category:category,
       space:space,
       mkw_layout_id:mkw_layout_id
      }
      return this.http.patch(url,obj,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }


    getCategoriesForLoosefurniture(){
      let url = environment.apiBaseUrl+'/v1/sections/categories_for_spaces?all_categories=true';
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
    generateSmartQuotation(project_id,quotation_id,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+quotation_id+'/generate-smart-quotation';
      return this.http.patch(url,data,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }
   

    addboqJobToSpace(projectId,quotID,data){
      
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/add_boqjob';

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    deleteboqJobToSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/delete_boqjobs';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    updateboqJobOfSpace(projectId,quotID,data){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/update_boqjob';

      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    getCustomizableDimensions(module_type_id){
      let url = environment.apiBaseUrl+'/v1/module_types/'+module_type_id+'/customizable_dimensions';
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);
    }

    getImportProjectList(){
      var url = environment.apiBaseUrl+'/v1/projects/projects_for_import_boq';
      if(this.options.params){
        this.options.params.delete('status');
      }
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);

    }
    getImportQuotationList(projectId){
      var url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/quotation_for_import';
      if(this.options.params){
        this.options.params.delete('status');
      }
      return this.http.get(url,this.options)
                     .map(this.extractData)
                     .catch(this.handleErrorObservable);


    }

  getApprovedBoqList(projectId, stage){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/approved_quotations?stage='+stage;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  getFilteredAppliances(module_type_id,filterobj,search_string,page){
    var filterstr ='module_type_id='+module_type_id+'&search_string='+search_string+'&page='+page+'&filter_params='+JSON.stringify(filterobj);
    let url = environment.apiBaseUrl+'/v1/kitchen_appliances/filter_appliances?'+filterstr;
    return this.http.get(url,this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }

  getDataForApplianceFilters(id){
    let url = environment.apiBaseUrl+'/v1/kitchen_appliances/filter_data/?module_type_id='+id;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  deleteKitchenAppliance(id){
    let url = environment.apiBaseUrl+'/v1/kitchen_appliances/'+id;
    return this.http.delete(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
  } 

  updateKitchenAppliance(data,id){
    let url = environment.apiBaseUrl+'/v1/kitchen_appliances/'+id;
    return this.http.patch(url,data,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
  }

  getKitchenApplianceDetails(id){
    var url = environment.apiBaseUrl + '/v1/kitchen_appliances/'+id;
    return this.http.get(url,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
  }

  getAllKitchenAppliances(module_type_id){
    var url = environment.apiBaseUrl + '/v1/kitchen_appliances?module_type_id='+ module_type_id;
    return this.http.get(url,this.options)
            .map(this.extractDataPage)
            .catch(this.handleErrorObservable); 
  }

  addKitchenAppliance(data){
    let url = environment.apiBaseUrl+'/v1/kitchen_appliances';
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

    getFilteredHandles(page,category,product_module_id,shutter_finish,filterobj,search_string,handle_type){
      var filterstr ='&search_string='+search_string+'&page='+page+'&filter_params='+JSON.stringify(filterobj);
      let url = environment.apiBaseUrl+'/v1/handles/filter_handles?category='+category+'&shutter_finish_name='+
      shutter_finish+'&handle_type='+handle_type+'&product_module_id='+product_module_id+filterstr;
      return this.http.get(url,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
    }

    getDataForHandleFilters(category){
      let url = environment.apiBaseUrl+'/v1/handles/filter_data?category='+category;
      return this.http.get(url,this.options)
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

    //To get Coustom Furniture Layout List
    getCFlayoutList(){
      let url = environment.apiBaseUrl+'/v1/shangpin_layouts';
      return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    //To upload Excel file for custom furniture
    uploadCfExcel(projectId,quotID,attachments,space,file_name){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotID+'/import_shangpin_excel';
      var obj = {
        'attachment' : attachments,
        'space' : space,
        'filename': file_name
      }
      return this.http.post(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    //To save custom furniture layout
    saveCustomFurnitureLayout(data){
      let url = environment.apiBaseUrl+'/v1/shangpin_layouts';
      return this.http.post(url,data,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    //To import custom furniture in BOQ
    importCFLayoutToSpace(projectId,quotation_id,space,id){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotation_id+'/import_shangpin_layout';
       
      var obj= {
       space: space,
       shangpin_layout_id: id
      }
      return this.http.patch(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    //to get the details of a custom furniture layout
    getDetailsOfCFLayouts(id){
      let url = environment.apiBaseUrl+'/v1/shangpin_layouts/'+id;
      return this.http.get(url,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
    }

    //to delete a custom furniture layout
    deleteCustomFurnitureLayout(projectId,quotation_id,id){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotation_id+'/delete_shangpin_jobs';
      var obj = {
        ids:id,
      }
      return this.http.patch(url,obj,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

    //to delete custom layout
    deleteCFLayout(id){
      let url = environment.apiBaseUrl+'/v1/shangpin_layouts/'+id;
      return this.http.delete(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
    }

     //to add a label to a line item
     addLabelToLineItem(projectId,quotationId,ownerable_type,ownerable_id,label_name){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotationId+'/add_label';
      var reqParams={
        "ownerable_type":ownerable_type,
        "ownerable_id":ownerable_id,
        "label_name": label_name
      }
      return this.http.patch(url,reqParams,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
    }

    //to edit a label of a line item
    editLabelOfLineItem(projectId,quotationId,boqLabelId,labelName){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotationId+'/edit_label';
      var reqParams={
        "boq_label_id":boqLabelId,
        "label_name": labelName
      }
      return this.http.patch(url,reqParams,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
    }

    //to delete a label of a line item
    deleteLabelOfLineItem(projectId,quotationId,boqLabelId){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+quotationId+'/delete_label';
      var reqParams={
        "boq_label_id":boqLabelId,
      }
      return this.http.patch(url,reqParams,this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
    }
    downloadCustomerBoqPdf(data,boqId,projectId){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/quotations/'+boqId+'/download_v2_pdf';
    var params: URLSearchParams = new URLSearchParams();
    params.set('download_type', JSON.stringify(data));
    this.options.search = params;
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
}