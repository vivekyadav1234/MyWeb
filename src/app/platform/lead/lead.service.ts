
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';
import { environment } from '../../../environments/environment';
import { Lead } from './lead';

@Injectable()
export class LeadService {
  // shareWithCustomerFile(id: any): any {
  //   throw new Error("Method not implemented.");
  // }

  options: RequestOptions;

  private leadUrl = environment.apiBaseUrl + '/v1/leads';
  headers: Headers;

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService,
    private ref:ChangeDetectorRef
  ) {
    if (window.location.pathname != '/lead/app-sms-floorplan') {
      this.options = this.authService.getHeaders();
    }
  }

  changeStatus(id: Number): Observable<Lead> {
    let url = this.leadUrl + '/' + id + '/approve_user';
    return this.http.patch(url, id, this.options
    ).map((res: Response) => res.json());
  }
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private extractDataPage(res: Response) {
    return res;
  }
  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  getLeadList(lead_source): Observable<Lead[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('source', lead_source);
    this.options.search = params;
    return this.http.get(this.leadUrl, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  filteredLeads(lead_source, colName, from_date, to_date) {
    var params: URLSearchParams = new URLSearchParams();
    params.set('source', lead_source);
    params.set('column_name', colName);
    params.set('from_date', from_date);
    params.set('to_date', to_date);
    var opt = this.options;
    opt.search = params;

    return this.http.get(this.leadUrl, opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  addLead(data) {
    if (this.options.params) {
      this.options.params.delete('source');
      this.options.params.delete('lead_status');
      this.options.params.delete('lead_type_id');
      this.options.params.delete('lead_campaign_id');
      this.options.params.delete('column_name');
      this.options.params.delete('from_date');
      this.options.params.delete('lead_source_id');
      this.options.params.delete('to_date');
      this.options.params.delete('cs_agent');
      this.options.params.delete('search');
    }
    return this.http.post(this.leadUrl, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  designerAddLead(data) {
    var url = environment.apiBaseUrl + '/v1/leads/designer_lead_add';
    if (this.options.params) {
      this.options.params.delete('source');
      this.options.params.delete('lead_status');
      this.options.params.delete('lead_type_id');
      this.options.params.delete('lead_campaign_id');
      this.options.params.delete('column_name');
      this.options.params.delete('from_date');
      this.options.params.delete('lead_source_id');
      this.options.params.delete('to_date');
      this.options.params.delete('cs_agent');
      this.options.params.delete('search');
    }
    return this.http.post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteLead(id: Number): Observable<Lead[]> {
    let headers = this.authService.getHeaders();
    let url = this.leadUrl + '/' + id;
    return this.http.delete(url, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  viewLeadDetails(id: Number): Observable<Lead[]> {
    let url = this.leadUrl + '/' + id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  editLead(id: Number, params: any) {
    let url = this.leadUrl + '/' + id;
    return this.http.patch(url, params, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  postRecordNotesQuestionnaire(lead_id, data) {
    let url = environment.apiBaseUrl + '/v1/note_records';
    let params: URLSearchParams = new URLSearchParams();
    params.set('ownerable_id', lead_id + '');
    params.set('ownerable_type', 'Lead');
    this.options.search = params;

    return this.http.post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  updateRecordNotesQuestionnaire(lead_id, data, noteRecordId) {
    let url = environment.apiBaseUrl + '/v1/note_records/' + noteRecordId;
    let params: URLSearchParams = new URLSearchParams();
    params.set('ownerable_id', lead_id + '');
    params.set('ownerable_type', 'Lead');
    this.options.search = params;

    return this.http.patch(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getRecordNotesQuestionnaire(lead_id) {
    let url = environment.apiBaseUrl + '/v1/note_records';
    let params: URLSearchParams = new URLSearchParams();
    params.set('ownerable_id', lead_id + '');
    params.set('ownerable_type', 'Lead');
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadLeadExcel(files: File[], leadSource, type, camp) {
    let leads = {
      'attachment_file': files,
      'lead_source_id': leadSource,
      'lead_type_id': type,
      'lead_campaign_id': camp
    }
    let headers = this.authService.getHeaders();
    let url = this.leadUrl + '/import_leads';
    return this.http.post(url, leads, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getacallbackLeadsDetails() {
    let url = environment.apiBaseUrl + '/v1/contacts';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteGetACallbackLead(id: number) {
    let url = environment.apiBaseUrl + '/v1/contacts/' + id;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  exportLeads(role) {
    let url = this.leadUrl + '/download_leads';
    let params: URLSearchParams = new URLSearchParams();
    params.set('role', role);
    this.options.search = params;
    return this.http.get(url, this.options)
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

  exportLeads1(role, source, lead_status, lead_type_id, lead_source_id,
    lead_campaign_id, column_name, from_date, to_date, cs_agent_list, search) {
    let url = this.leadUrl + '/download_leads';
    let params: URLSearchParams = new URLSearchParams();
    params.set('role', role);
    params.set('source', source);
    params.set('lead_status', lead_status);
    params.set('lead_type_id', lead_type_id);
    params.set('lead_source_id', lead_source_id);
    params.set('lead_campaign_id', lead_campaign_id);
    params.set('column_name', column_name);
    params.set('from_date', from_date);
    params.set('to_date', to_date);
    params.set('cs_agent', cs_agent_list);
    params.set('search', search);
    this.options.search = params;
    return this.http.get(url, this.options)
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

  updateLeadStatus(data, id) {
    let url = this.leadUrl + '/' + id + '/update_status';
    if (this.options.params) {
      this.options.params.delete('role');
    }
    return this.http.post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  escalatedleads() {
    let url = this.leadUrl + "/escalated_leads";
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  requestRole(role: string) {
    let url = environment.apiBaseUrl + '/v1/users/request_role';
    let params: URLSearchParams = new URLSearchParams();
    params.set('role', role);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  assignLeadToAgent(agentId, leadId) {
    let url = environment.apiBaseUrl + '/v1/leads/' + leadId + '/assign_lead';
    let params: URLSearchParams = new URLSearchParams();
    params.set('agent_id', agentId);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  assigndesignerToCM(agentId, leadId) {
    let url = environment.apiBaseUrl + '/v1/users/assign_designer_to_cm';
    var obj = {
      'cm_id': agentId,
      'designer_id': leadId
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  refreshLeads(agentId, lead_id, lead) {
    let url = environment.apiBaseUrl + '/v1/leads/refresh_leads';
    let params: URLSearchParams = new URLSearchParams();
    params.set('agent_id', agentId);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  callToLead(userId, contact) {
    let url = environment.apiBaseUrl + '/v1/inhouse_calls';
    let obj = {
      'inhouse_call': {
        'user_id': userId
      },
      'contact_no': contact
    };
    return this.http.post(url, obj, this.options).map(this.extractData).catch(this.handleErrorObservable);
    // let url = environment.apiBaseUrl+'/v1/users/'+userId+'/call_user';
    // let obj ={
    //   'user':userId,
    //   'lead_id': leadId
    // };
    // return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
  }

  downloadLifeCycleReport(leadId) {
    let url = environment.apiBaseUrl + '/v1/leads/' + leadId + '/sales_life_cycle_report';

    return this.http.get(url, this.options).map(this.extractData).catch(this.handleErrorObservable);
  }

  getCommunityManagersList() {
    let url = environment.apiBaseUrl + '/v1/users/designer_cm_index';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  getDesignerLeads(page_no) {
    let url = this.leadUrl + '/designer_leads?page=' +  page_no;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getSearchedDesignerLeads(searchItem) {
    let url = this.leadUrl + '/designer_leads?search=' +  searchItem;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getLeadLog(leadId) {
    let url = environment.apiBaseUrl + '/v1/leads/' + leadId + '/show-logs';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getSiteSupervisorList() {
    let url = environment.apiBaseUrl + '/v1/users/sitesupervisor_users';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getFileterLeads(source, lead_status, lead_type_id, lead_source_id,
    lead_campaign_id, column_name, from_date, to_date, cs_agent_list, search, page?) {
    let url = environment.apiBaseUrl + '/v1/leads/filtered_index?page=' + page;
    var params: URLSearchParams = new URLSearchParams();
    params.set('source', source);
    params.set('lead_status', lead_status);
    params.set('lead_type_id', lead_type_id);
    params.set('lead_source_id', lead_source_id);
    params.set('lead_campaign_id', lead_campaign_id);
    params.set('column_name', column_name);
    params.set('from_date', from_date);
    params.set('to_date', to_date);
    params.set('cs_agent', cs_agent_list);
    params.set('search', search);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getFileterLeadsForLeadMgmt(source, lead_status, lead_type_id, cm_type_id, lead_source_id,
    lead_campaign_id,mkw_fhi, column_name, digital_physical, internal_external, from_date, to_date, cs_agent_list, search, page?) {
    let url = environment.apiBaseUrl + '/v1/leads/filtered_index?page=' + page;
    var params: URLSearchParams = new URLSearchParams();
    params.set('source', source);
    params.set('lead_status', lead_status);
    params.set('lead_type_id', lead_type_id);
    params.set('cm_ids', cm_type_id);
    params.set('lead_source_id', lead_source_id);
    params.set('lead_campaign_id', lead_campaign_id);
    params.set('column_name', column_name);
    params.set('digital_physical', digital_physical);
    params.set('internal_external', internal_external);
    params.set('from_date', from_date);
    params.set('to_date', to_date);
    params.set('cs_agent', cs_agent_list);
    params.set('search', search);
    params.set('search', search);
    params.set('mkw_fhi',mkw_fhi)
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);
  }

  getFiltersData() {
    let url = environment.apiBaseUrl + '/v1/leads/filter_details';
    var params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    return this.http.get(url, this.options).map(this.extractDataPage).catch(this.handleErrorObservable);
  }

  getLeadHeadCount(lead_type_id, lead_source_id, lead_campaign_id, from_date, to_date) {
    let url = environment.apiBaseUrl + '/v1/leads/lead_head_dashboard_count';
    var params: URLSearchParams = new URLSearchParams();
    params.set('lead_type_id', lead_type_id);
    params.set('lead_source_id', lead_source_id);
    params.set('lead_campaign_id', lead_campaign_id);
    params.set('from_date', from_date);
    params.set('to_date', to_date);
    var opt = this.options;
    opt.search = params;
    return this.http.get(url, opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getLeadLogs(leadId) {
    let url = environment.apiBaseUrl + '/v1/leads/' + leadId + '/get_lead_info';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getFloorplans(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/floorplans';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getProposalList() {
    let url = environment.apiBaseUrl + '/v1/proposals';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  assignSiteSupervisorToCm(sitesupervisor_id, cm_id) {
    let obj = {
      'cm_id': cm_id,
      'sitesupervisor_id': sitesupervisor_id
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/users/assign_sitesupervisor_to_cm';
    return this.http.post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  createSiteRequest(formdata) {
    let obj = {
      'site_measurement_request': formdata,
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/requests';
    return this.http.post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchRequirementForm(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/get_project_requirement';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchThreeDImageList(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/fetch_three_d_images';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  requirementFormSubmit(formdata) {
    let obj = {
      'project_requirement': formdata,
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/project_requirements';
    return this.http.post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  requirementFormUpdate(formdata, req_id) {
    let obj = {
      'project_requirement': formdata,
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/project_requirements/' + req_id;
    return this.http.patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchScopeForm(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/scope_of_work_for_ten_percent';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  scopeFormSubmit(formdata) {
    let obj = {
      'scope_of_work': formdata,
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/scope_of_works';
    return this.http.post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  scopeFormUpdate(formdata, req_id) {
    let obj = {
      'scope_of_work': formdata,
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/scope_of_works/' + req_id;
    return this.http.patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchBookingForm(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/booking_form_for_project';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


    bookingFormSubmit(formdata){
      let obj = {
        'project_booking_form' : formdata,
      }
      let headers= this.authService.getHeaders();
      let url = environment.apiBaseUrl+'/v1/project_booking_forms';
      return this.http.post(url,obj,headers)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
  }

  bookingFormUpdate(id, formdata) {
    let obj = {
      'project_booking_form': formdata,
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/project_booking_forms/' + id;
    return this.http.patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  fetchSiteRequest(project_id) {
    let url = environment.apiBaseUrl + '/v1/requests?project_id=' + project_id;

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getGallery(req_id) {
    let url = environment.apiBaseUrl + '/v1/requests/' + req_id + '/get_images_for_request';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getApprovedBoqList(projectId, stage) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/approved_quotations?stage=' + stage;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  fetchElevationList(project_id) {
     
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/fetch_elevations';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  fetcReferenceList(project_id) {
     
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/fetch_reference_images';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  getFinalPaymentQuotationLead(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/quotation_for_final_payment';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  fetchCadElevation(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/cad_drawings';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchPptlist(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/boq_and_ppt_uploads/get_ppts';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  // defalt ppt
  defaultPptList(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/boq_and_ppt_uploads/sample_ppt_file';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  fetchBoqList(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/boq_and_ppt_uploads/get_boqs';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadCad(project_id, postData) {

    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/cad_drawings';
    return this.http.post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadPpt(project_id, postData) {

    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/boq_and_ppt_uploads';
    return this.http.post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  uploadBoq(project_id, postData) {

    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/boq_and_ppt_uploads';
    return this.http.post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
 ///upload line marking///
  uploadLineMarking(project_id, postData) {

    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/upload_line_marking';
    return this.http.post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
 //end here///
  deleteCad(id: Number, fpid: Number) {

    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/cad_drawings/' + fpid;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteSiteMeasurement(imgid: Number) {

    let url = environment.apiBaseUrl + '/v1/requests/remove_images_from_request?image_id=' + imgid;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteBoq(id: Number, fpid: Number) {

    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/boq_and_ppt_uploads/' + fpid;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  ///for line marking///
  deleteLineMarking(id: Number, fpid: Number) {
    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/delete_line_marking?line_marking_id=' + fpid;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  ///end here///
  deletePpt(id: Number, fpid: Number) {

    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/boq_and_ppt_uploads/' + fpid;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  shareWithCustomer(projectId, docId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/boq_and_ppt_uploads/' + docId + '/share_with_customer';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCitiesForQuestionnaire() {
    let url = environment.apiBaseUrl + '/v1/cities';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCmList() {
    let url = environment.apiBaseUrl + '/v1/users/list_of_cm';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  assignCmToLead(cmid, leadid, assignCmId?, designerId?) {
    let url = environment.apiBaseUrl + '/v1/leads/' + leadid + '/assign_cm_to_lead';
    var obj = {
      cm_id: cmid,
      designer_id: designerId
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  migrateCMData(from_id, to_id) {
    let url = environment.apiBaseUrl + '/v1/users/migrate_cm_data';
    var obj = {
      from_id: from_id,
      to_id: to_id
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  cmAssignedData(cm_id) {
    let url = environment.apiBaseUrl + '/v1/users/cm_assigned_data?cm_id=' + cm_id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getLeadPriorityQueueData() {
    let url = environment.apiBaseUrl + '/v1/leads/lead_queue';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //  for ending sms
  sendSmsToLead(sms, projectId, contact_no) {
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_sms/';
    let obj = {
      'contact_no': contact_no,
      'message': sms.message
    }
    return this.http.post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSmsHistory(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_sms';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  /////end sfor sneding sms

  exportBoq() {

    let url = environment.apiBaseUrl + '/v1/quotations/download_boq_report';
    if (this.options.params) {
      this.options.params.delete('lead_type_id');
      this.options.params.delete('lead_source_id');
      this.options.params.delete('lead_campaign_id');

    }
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }

  exportReportsEvent() {
    let url = environment.apiBaseUrl + '/v1/events/download_event';
    return this.http.get(url, this.options)
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
  exportReportCall() {
    let url = environment.apiBaseUrl + '/v1/inhouse_calls/call_excel_report';
    return this.http.get(url, this.options)
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
  exportSli() {
    let url = environment.apiBaseUrl + '/v1/purchase_orders/download_sli_report';
    return this.http.get(url, this.options)
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
  exportPo() {
    let url = environment.apiBaseUrl + '/v1/purchase_orders/purchase_order_report';
    return this.http.get(url, this.options)
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
  
  exportOlt() {
    let url = environment.apiBaseUrl + '/v1/purchase_orders/panel_olt_payment_report';
    return this.http.get(url, this.options)
      .map(response => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }

  exportQuestionnaireEvent() {
    let url = environment.apiBaseUrl + '/v1/projects/21/customer_profiles/generate_xl';
    return this.http.get(url, this.options)
      .map(response => {
        if (response.status == 400) {
          this.handleErrorObservable;
        } else if (response.status == 200) {
          return response;
        }
      })
      .catch(this.handleErrorObservable);
  }

  callToCustomer(userId, contact_number) {
    let url = environment.apiBaseUrl + '/v1/inhouse_calls';
    let obj = {
      'inhouse_call': {
        'user_id': userId
      },
      'contact_no': contact_number
    };
    return this.http.post(url, obj, this.options).map(this.extractData).catch(this.handleErrorObservable);

    // let url = environment.apiBaseUrl+'/v1/users/'+userId+'/call_user';
    // let obj ={
    //   'contact_no':contact_number
    // };
    // return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
  }


  updateBasicInfo(lead_id, name, email, contact) {
    let obj = {
      'name': name,
      'contact': contact,
      'email': email
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/leads/' + lead_id + '/update_basic_info';
    return this.http.patch(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getInitialQuotationListForCm(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/quotations/shared_initial_boqs';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  getFinalQuotationListForCm(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/quotations/shared_final_boqs';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }

  getDesignerList(cmId, userId) {
    let url = environment.apiBaseUrl + '/v1/users/' + userId + '/designer_for_cm';
    if (this.options.params) {
      this.options.params.delete('lead_type_id');
      this.options.params.delete('lead_source_id');
      this.options.params.delete('lead_campaign_id');
      this.options.params.delete('column_name');
      this.options.params.delete('cs_agent');
      this.options.params.delete('search');
      this.options.params.delete('source');
      this.options.params.delete('lead_status');
      this.options.params.delete('search');
      this.options.params.delete('id');

    }
    var params: URLSearchParams = new URLSearchParams();
    params.set('cm_id', cmId);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }

  ApproveBoqByCm(obj) {
    let url = environment.apiBaseUrl + '/v1/proposals/approve_or_reject_the_boq';
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  getReferrerList(page?, search?) {
    let url = environment.apiBaseUrl + '/v1/users/referrers';
    var params: URLSearchParams = new URLSearchParams();
    params.set('page', page);
    params.set('search', search);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractDataPage)
      .catch(this.handleErrorObservable);


  }
  getSalesManagerList() {
    let url = environment.apiBaseUrl + '/v1/users/sales_managers';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  assignToSlaesManager(referralId, salesmanagerId) {
    let obj = {
      'referrer_id': referralId,
      'sales_manager_id': salesmanagerId
    }
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/users/assign_sales_manager_to_referrer';
    return this.http.post(url, obj, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }

  exportPaymentEvent() {
    let url = environment.apiBaseUrl + '/v1/payments/download_payment_report';
    if (this.options.params) {
      this.options.params.delete('lead_type_id');
      this.options.params.delete('lead_source_id');
      this.options.params.delete('lead_campaign_id');

    }
    return this.http.get(url, this.options)
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



  getUploadedFiles(id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/booking_form_for_project';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadBookingForm(project_booking_form_id) {
    let url = environment.apiBaseUrl + '/v1/project_booking_forms/' + project_booking_form_id + '/download_pdf';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  deleteFile(project_booking_form_id, file_id) {
    let url = environment.apiBaseUrl + '/v1/project_booking_forms/' + project_booking_form_id + '/project_booking_form_files/' + file_id;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  uploadFiles(project_booking_form_id, attachment_file, file_name) {
    let url = environment.apiBaseUrl + '/v1/project_booking_forms/' + project_booking_form_id + '/project_booking_form_files';
    var obj = {
      'project_booking_form_id': project_booking_form_id,
      'attachment_file': attachment_file,
      'file_name': file_name
    };
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  shareWithCustomerFile(id) { 
    var value = id;
    // let url = environment.apiBaseUrl + '/v1/projects/' + value + '/share_pdf_with_customer';

    return this.http.get(environment.apiBaseUrl + '/v1/projects/' + value + '/share_pdf_with_customer', this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }


  getPdf(projectId){
    let url = environment.apiBaseUrl + '/v1/projects/' +projectId+ '/arrivae_pdf';
    
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  shareWithCustomerFilePdf(value,filename) { 
    debugger
    var value = value;
    let url = environment.apiBaseUrl + '/v1/projects/' + value + '/share_pdf_with_customer';

    let params: URLSearchParams = new URLSearchParams();
    params.set('file_name', filename);
    this.options.search = params;
    
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  fetchPdfList(id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/share_pdf_with_customer';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getPOPdfForPreview(id) {
    // let url = environment.apiBaseUrl+'/v1/projects/'+id+'/share_pdf_with_customer';
    //   return this.http.get(url,this.options)
    //           .map(this.extractData)
    //           .catch(this.handleErrorObservable);
  }

  shareWarrantyWithCustomerFile(id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/share_warrenty_doc';
    let obj = {
      'project_id': id
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getSmsLink(id, name, contact_no) {
    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/floorplans/send_upload_sms';
    var obj = {
      'project_id': id,
      'contact_no': contact_no
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

  uploadSmsFormFiles(id, attachment_file, file_name) {
    this.headers = new Headers({ 'enctype': 'multipart/form-data' });
    this.headers.append('Accept', 'application/json');
    this.headers.append('uid', '');
    this.headers.append('client', '');
    this.headers.append('access-token', '');
    let options: any;
    options = new RequestOptions({ headers: this.headers });
    let url = environment.apiBaseUrl + '/v1/projects/' + id + '/floorplans/upload_sms_floorplan';
    var obj = {
      'floorplan': {
        'file_name': file_name,
        'attachment_file': attachment_file
      }
    }
    return this.http.post(url, obj, options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  };

  getChampionList() {
    let url = environment.apiBaseUrl + '/v1/users/invite_champion_info';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  inviteChampion(data) {
    let url = environment.apiBaseUrl + '/v1/users/invite_champion';
    var obj = {
      'champion_level': data.champion_level,
      'user_type': data.user_type,
      'email': data.email,
      'contact': data.contact,
      'name': data.name,
      'parent_id': data.parent_id
    };
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getChampionListByChampionLevel(champion_level) {
    let url = environment.apiBaseUrl + '/v1/users/champions';
    let params: URLSearchParams = new URLSearchParams();
    params.set('champion_level', champion_level);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getChildChampionListByChampionLevel(champion_id) {
    let url = environment.apiBaseUrl + '/v1/users/child_champions';
    let params: URLSearchParams = new URLSearchParams();
    params.set('champion_id', champion_id);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  getCustomerCallDetails(leadId) {
    let url = environment.apiBaseUrl + '/v1/leads/' + leadId + '/alternate_contacts';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  /*Send Smart Report Through Email function*/
  smartShareReport() {
    let url = environment.apiBaseUrl + "/v1/leads/smart_share_report";

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  // Method For Post elevation file
  uploadElevation(projectId, postData) {
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/upload_elevation';
    return this.http.post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  uploadReference(projectId, postData) {
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/upload_reference_image';
    return this.http.post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  uploadThreeD(projectId, postData) {
    let headers = this.authService.getHeaders();
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/upload_three_d_image';
    return this.http.post(url, postData, headers)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getFileList(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/list_for_handover';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  ///for lineMarking////
  fetchLineMarkingList(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/fetch_line_markings';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  submitSelectedFiles(projectId, obj) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/add_project_handover_list';

    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getFileDetails(projectId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_handovers/grouped_index?parent_handover_id=0';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  gethandoverList(projectId, status) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_handovers/grouped_index?status=' + status;

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  submitHandoverFiles(projectId, remark) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_handovers/share_with_category';
    let obj = {
      'remarks': remark
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  getRevisedFile(projectId, status, val) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/list_for_handover?category=' + status + '&revision=' + val;

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  submitFormForRevise(projectId, ownerableId, handoverid) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_handovers/' + handoverid + '/add_revision';
    let obj = {
      'owner_id': ownerableId
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  DeleteHandOverFile(projectId, Id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_handovers/' + Id;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);


  }
  getViewChild(projectId, childId) {
    let url = environment.apiBaseUrl + '/v1/projects/' + projectId + '/project_handovers/' + childId + '/child_revisions';

    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }



  //to get additional files
  getAdditionalFiles(project_id){
     
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/requested_files';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }


  //to reslove additional files 
  resloveAdditionalFiles(project_id,raised_by_id){
    let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/requested_files/'+raised_by_id+'/resolve_request';
    return this.http.post(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable)
  }


  getlevel2champion(user_id,role){
    let url = environment.apiBaseUrl+'/v1/users/user_children_with_role';
    let params: URLSearchParams = new URLSearchParams();
    params.set('user_id', user_id);
    params.set('role', role);
    this.options.search = params;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  //client questionnaireForm time submit
  clientquestionnaireForm(project_id, data) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/customer_profiles';
     
    let obj = {
      "name": data['name'],
      "email": data['email'],
      "contact_no": data['phone'],
      "address_line_1": data['address_line1'],
      "address_line_2": data['address_line1'],
      "city": data['city'],
      "state": data['state'],
      "pincode": data['pincode'],
      "gender": data['gender'],
      "educational_background": data['education_background'],
      "professional_background": data['professional_background'],
      "sector_employed": data['sector_employed'],
      "income_per_annum": data['income_per'],
      "family_status": data['family_status'],
      "marital_status": data['matrial_status'],
      "joint_family_status": data['joint_family_status'],
      "no_of_family_members": data['family_member'],
      "co_decision_maker": data['decision_maker'],
      "co_decision_maker_name": data['decision_name'],
      "co_decision_maker_email": data['decision_email'],
      "co_decision_maker_phone": data['decision_phone'],
      "relation_with_decision_maker": data['relationship_decision_maker'],
      "co_decision_maker_educational_background": data['decision_education_background'],
      "co_decision_maker_professional_background": data['decision_professional_background'],
      "co_decision_maker_sector_employed": data['decision_sector_employed'],
      "co_decision_maker_income_per_annum": data['decision_income_per'],
      "purpose_of_house": data['house_purpose'],
      "movein_date": data['moving_date'],
      "dob": data['dob'],
      "co_decision_maker_dob": data['decision_dob']
    }
    return this.http.post(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //edit client questionnaireForm time submit
  editclientquestionnaireForm(project_id, customer_profile_id, data) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/customer_profiles/' + customer_profile_id + '';
     
    let obj = {
      "name": data['name'],
      "email": data['email'],
      "contact_no": data['phone'],
      "address_line_1": data['address_line1'],
      "address_line_2": data['address_line1'],
      "city": data['city'],
      "state": data['state'],
      "pincode": data['pincode'],
      "gender": data['gender'],
      "educational_background": data['education_background'],
      "professional_background": data['professional_background'],
      "sector_employed": data['sector_employed'],
      "income_per_annum": data['income_per'],
      "family_status": data['family_status'],
      "marital_status": data['matrial_status'],
      "joint_family_status": data['joint_family_status'],
      "no_of_family_members": data['family_member'],
      "co_decision_maker": data['decision_maker'],
      "co_decision_maker_name": data['decision_name'],
      "co_decision_maker_email": data['decision_email'],
      "co_decision_maker_phone": data['decision_phone'],
      "relation_with_decision_maker": data['relationship_decision_maker'],
      "co_decision_maker_educational_background": data['decision_education_background'],
      "co_decision_maker_professional_background": data['decision_professional_background'],
      "co_decision_maker_sector_employed": data['decision_sector_employed'],
      "co_decision_maker_income_per_annum": data['decision_income_per'],
      "purpose_of_house": data['house_purpose'],
      "movein_date": data['moving_date'],
      "dob": data['dob'],
      "co_decision_maker_dob": data['decision_dob']
    }
    return this.http.patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }


  //to fetch questionnaire Form
  getfetchquestionnaireFormDetails(project_id) {
    let url = environment.apiBaseUrl + '/v1/projects/' + project_id + '/customer_profiles';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  //to set contact visibel status
  changeConStatus(lead_id) {
    let url = environment.apiBaseUrl + '/v1/leads/' + lead_id + '/make_contact_visible';
    var obj = {
      'id': lead_id
    }
     
    return this.http.patch(url, obj, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  changeLeadIntakeStatus() {
    let url = environment.apiBaseUrl + '/v1/leads/filter_details';
    var params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    return this.http.get(url, this.options).map(this.extractDataPage).catch(this.handleErrorObservable);
  }

  selectAddressOf(project_id,address){
    let url = environment.apiBaseUrl+'/v1/note_records/get_billing_address';
    var params: URLSearchParams = new URLSearchParams();
    params.set('project_id', project_id);
    params.set('look_address',address);
    var opt = this.options;
    opt.search = params;

    return this.http.get(url,opt)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
  downloadExcelBoqLineItems(){
    let url = environment.apiBaseUrl + '/v1/quotations/boq_line_item_report';
    if (this.options.params) {
      this.options.params.delete('lead_type_id');
      this.options.params.delete('lead_source_id');
      this.options.params.delete('lead_campaign_id');

    }
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  updateDuration(quotId,projectId,duration){
    let url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/quotations/'+quotId+'/add_duration';
    let body = {
      "duration":duration
    }
    return this.http.patch(url,body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }
  /////////
  viewQCHistory(projectId,qcType){
    var url = environment.apiBaseUrl + '/v1/projects/'+projectId+'/project_quality_checks/qc_history?qc_type='+qcType;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  updateInternalExternalStatus(related_user_id, leadInternalStatus) {
    let url = environment.apiBaseUrl + '/v1/leads/change_user_type';
    if (leadInternalStatus === null || leadInternalStatus === false ) {
      leadInternalStatus = true;
    } else {
      leadInternalStatus = false
    }
    let body = {
      related_user_id: related_user_id,
      type: leadInternalStatus
    }
    return this.http.post(url,body, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
    downloadBoqCheatSheet(projectId,BoqId){    
      var url = environment.apiBaseUrl +
      '/v1/projects/'+projectId+'/quotations/'+BoqId+'/download_cheat_sheet';
       
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
  getcaluclatordatas()
  {
    let url = environment.apiBaseUrl + '/v1/questionaire_master_items';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
// completeRequest(req_id,files){
//     let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/complete_site_measurment_request';
    

//     var forms = {
//       // 'status': formobj.status,
//       // 'remark': formobj.remark,
//       'images':files
//     };

//     return this.http.post(url,forms,this.options)
//     .map(this.extractData)
//     .catch(this.handleErrorObservable);
//   }
   getReferUserList(referId,referName){
    let url =environment.apiBaseUrl +'/v1/users/'+referId+'/load_referrer_users?role='+referName;
     
        return this.http.get(url,this.options)
        .map(this.extractData)
       .catch(this.handleErrorObservable);


  }
  getReferListForSelect(salesId){
    let url =environment.apiBaseUrl +'/v1/users/'+salesId+'/referrer_user_types';
   
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);


  }
  getLeadPoolList(){
      let url = environment.apiBaseUrl+'/v1/leads/lead_pool_list';
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

  getLocalityBuildingDetails(city_name,search=""){
    let params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    var url;
    if(city_name){
      url = environment.apiBaseUrl + '/v1/note_records/get_city_details?city_name='+city_name.toLowerCase()+'&search='+search;
      this.ref.detectChanges();
      
    }else{
      city_name="";
      url = environment.apiBaseUrl + '/v1/note_records/get_city_details?city_name='+city_name+'&search='+search;
    }
    return this.http.get(url, this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  getSocietyWebData(locality_id){
    let params: URLSearchParams = new URLSearchParams();
    this.options.search = params;
    let url = environment.apiBaseUrl + '/v1/note_records/get_society_details?id='+locality_id;
    this.ref.detectChanges();
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }
 
}




