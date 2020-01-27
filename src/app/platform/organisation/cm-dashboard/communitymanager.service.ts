import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CommunitymanagerService {

	options: RequestOptions;
	private communitymanagerUrl = environment.apiBaseUrl+'/v1/users/';

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
    	console.error(error.message || error);
    	return Observable.throw(error.message || error);
  	}


  getQualifiedUserList(userId,lead_category,page?,search?,designer_id?, to_date?, from_date?, colName?){

    var params: URLSearchParams = new URLSearchParams();
    params.set('lead_category', lead_category);
    params.set('page', page);
    params.set('sort_by',colName);
    params.set('search', search);
    params.set('to_date', to_date);
    params.set('from_date', from_date);
    params.set('designer_id', designer_id);
    var opt = this.options;
    opt.search = params;
  	let url = this.communitymanagerUrl+userId+'/cm_dashboard';
    return this.http.get(url,opt)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);

  }

  getDesignerList(userId){
    let url = this.communitymanagerUrl+userId+'/cm_designers';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getListOfDesigner(userId){
    let url = environment.apiBaseUrl+'/v1/users/'+userId+'/designer_for_cm';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getFilterbyDesigner(userId,designer_id,status,page){
     
    let urls = environment.apiBaseUrl+'/v1/users/'+userId+'/cm_wip_leads';
    let params: URLSearchParams = new URLSearchParams();
    params.set('status', status);
    params.set('designer_id', designer_id);
    params.set('page',page);
    this.options.search = params
    return this.http.get(urls,this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }

  getCmDashboardCount(CMID,date_from,date_to, filter_designer){
    let url = this.communitymanagerUrl+CMID+'/cm_dashboard_count';
    if(date_from || date_to || filter_designer){
      let params: URLSearchParams = new URLSearchParams();
      if(date_from){
        params.set('from_date', date_from);
      }
      if(date_to){
        params.set('to_date', date_to);
      }
      if(filter_designer){
        params.set('designer_id', filter_designer);
      }

      this.options.search = params;
    }

    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }
  getUserCountsByStatusInWip(userId,designer_id){

    let url = this.communitymanagerUrl+userId+'/cm_wip_dashboard_counts';
    let params: URLSearchParams = new URLSearchParams();
    params.set('designer_id', designer_id);
    this.options.search = params;
     
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }

  getCmDashboardDesignerActionables(CMID, date_from, date_to){
    let url = this.communitymanagerUrl+CMID+'/cm_dashboard_designer_actionables';
    if(date_from || date_to){
      let params: URLSearchParams = new URLSearchParams();
      if(date_from){
        params.set('from_date', date_from);
      }
      if(date_to){
        params.set('to_date', date_to);
      }

      this.options.search = params;
    }

    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getUserCountsByActionable(CMID){
    let url = this.communitymanagerUrl+CMID+'/community_manager_actionable_counts';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  getActionableList(CMId, calls_for, agenda, lead_category, meetings_for, customer_status, page?,search?){
      var url
      if((calls_for == undefined) && (agenda == undefined) && (lead_category == undefined) && (meetings_for == undefined) && (customer_status == undefined) ){

        url = this.communitymanagerUrl+CMId+'/cm_designer_no_action_taken';
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        params.set('search', search);
        this.options.search = params;
      }

      else if(lead_category == "leads_not_assigned"){
        url = this.communitymanagerUrl+CMId+'/cm_dashboard';
        let params: URLSearchParams = new URLSearchParams();
        params.set('lead_category', lead_category);
        params.set('page', page);
        this.options.search = params;
      }

      else if((calls_for == "follow_up_calls_for_today") && (agenda == "follow_up")){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm';
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }
      else if((calls_for == "not_contactable_calls_for_today") && (agenda == "follow_up_for_not_contactable")){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm';
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }

      else if(calls_for == "escalated_calls"){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm';
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if((calls_for == "designer_follow_up_calls_for_today") && (agenda == "follow_up")){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm';
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }

      else if((calls_for == "designer_not_contactable_calls_for_today") && (agenda == "follow_up_for_not_contactable")){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm';
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }

      else if(calls_for == "designer_escalated_calls"){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm';
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if(["community_manager","designer"].includes(meetings_for)){
        url = this.communitymanagerUrl+CMId+'/cm_meeting_scheduled_for_today';
        let params: URLSearchParams = new URLSearchParams();
        params.set('meetings_for', meetings_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if(["escalated_meetings_for_community_manager","escalated_meetings_for_designer"].includes(meetings_for)){
        url = this.communitymanagerUrl+CMId+'/escalated_meetings_for_cm_dashboard';
        let params: URLSearchParams = new URLSearchParams();
        params.set('meetings_for', meetings_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if(["qualified","not_contactable","follow_up"].includes(customer_status)){
        url = this.communitymanagerUrl+CMId+'/cm_deadlines';
        let params: URLSearchParams = new URLSearchParams();
        params.set('customer_status', customer_status);
        params.set('page', page);
        this.options.search = params;
      }
      return this.http.get(url,this.options).map(this.extractDataPage).catch(this.handleErrorObservable);
    }

   getActionableList1(CMId, calls_for, agenda, lead_category, meetings_for, customer_status,designerId, page?){
      var url

      if((calls_for == undefined) && (agenda == undefined) && (lead_category == undefined) && (meetings_for == undefined) && (customer_status == undefined) ){
        url = this.communitymanagerUrl+CMId+'/cm_designer_no_action_taken?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;

      }
      else if(lead_category == "leads_not_assigned"){
        url = this.communitymanagerUrl+CMId+'/cm_dashboard?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('lead_category', lead_category);
        params.set('page', page);
        this.options.search = params;
      }

      else if((calls_for == "follow_up_calls_for_today") && (agenda == "follow_up")){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }
      else if((calls_for == "not_contactable_calls_for_today") && (agenda == "follow_up_for_not_contactable")){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }

      else if(calls_for == "escalated_calls"){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if((calls_for == "designer_follow_up_calls_for_today") && (agenda == "follow_up")){

        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }

      else if((calls_for == "designer_not_contactable_calls_for_today") && (agenda == "follow_up_for_not_contactable")){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('agenda', agenda);
        params.set('page', page);
        this.options.search = params;
      }

      else if(calls_for == "designer_escalated_calls"){
        url = this.communitymanagerUrl+CMId+'/call_needs_to_be_done_today_by_cm?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('calls_for', calls_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if(["community_manager","designer"].includes(meetings_for)){
        url = this.communitymanagerUrl+CMId+'/cm_meeting_scheduled_for_today?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('meetings_for', meetings_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if(["escalated_meetings_for_community_manager","escalated_meetings_for_designer"].includes(meetings_for)){
        url = this.communitymanagerUrl+CMId+'/escalated_meetings_for_cm_dashboard?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('meetings_for', meetings_for);
        params.set('page', page);
        this.options.search = params;
      }

      else if(["qualified","not_contactable","follow_up"].includes(customer_status)){
        url = this.communitymanagerUrl+CMId+'/cm_deadlines?designer_id='+designerId;
        let params: URLSearchParams = new URLSearchParams();
        params.set('customer_status', customer_status);
        params.set('page', page);
        this.options.search = params;
      }

      return this.http.get(url,this.options).map(this.extractDataPage).catch(this.handleErrorObservable);
    }

  getDesignerCm(userId){
    let url = this.communitymanagerUrl+userId+'/designer_for_cm';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }


  getWipList(CMId,status,designerID,page?,search?){

    let url = this.communitymanagerUrl+CMId+'/cm_wip_leads';
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', page);
    params.set('status',status);
    params.set('search',search);
    params.set('designer_id', designerID);
     
    this.options.search = params;
    return this.http.get(url,this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }

  getUserDetails(userId){
    let url = this.communitymanagerUrl+userId;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  deleteUser(userId){
    let url = this.communitymanagerUrl+userId;
    return this.http.delete(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  assignLeadToDesigners(client_id,projectId, designerId, CmID) {
      let url = this.communitymanagerUrl+CmID+'/assign_project';
      if(!projectId) {
        projectId = '';
      }
      let obj = {
        user : {
          designer_id : designerId,
          project_id : projectId,
          client_id : client_id
        }
      }
      return this.http.post(url,obj,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
  }
  designerLeadsCount(designerId) {
      let url = environment.apiBaseUrl+'/v1/users/designer_active_leads';
      var params: URLSearchParams = new URLSearchParams();
       
      params.set('designer_id', designerId);
      var opt = this.options;
      opt.search = params;
      return this.http.get(url,opt)
       .map(this.extractData)
       .catch(this.handleErrorObservable)
  }
  

  droppedLead(leadId,remarks) {
    var url = environment.apiBaseUrl+'/v1/leads/'+leadId+'/update_status';
    var obj = {
        'lead_status' : 'dropped',
        'lost_remark' : remarks.lost_remark,
        'drop_reason': remarks.drop_reason
    }
    this.options.params.delete('lead_category');
    return this.http.post(url,obj,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
  }

  filteredData(colName,from_date,to_date,lead_category,userId, page?){
    var params: URLSearchParams = new URLSearchParams();
    params.set('lead_category', lead_category);
    params.set('column_name',colName);
    params.set('from_date',from_date);
    params.set('to_date',to_date);
    params.set('page',page);
    var opt = this.options;
    opt.search = params;
    var url = this.communitymanagerUrl+userId+'/cm_dashboard';
    return this.http.get(url,opt)
          .map(this.extractDataPage)
        .catch(this.handleErrorObservable);
  }
  
  filterDataForNC(colName, from_date, to_date, lead_category,userId,designerId, page?){
    var params: URLSearchParams = new URLSearchParams();
    params.set('lead_category', lead_category);
    params.set('sort_by',colName);
    params.set('from_date',from_date);
    params.set('to_date',to_date);
    params.set('designer_id', designerId);
    params.set('page',page);
    var opt = this.options;
    opt.search = params;
    var url = this.communitymanagerUrl+userId+'/cm_dashboard';
    return this.http.get(url,opt)
          .map(this.extractDataPage)
        .catch(this.handleErrorObservable);

  }
// http://localhost:3000/v1/users/5/cm_designer_no_action_taken?sort_by=todays_lead&designer_id=12
  filterDataForNA(colName,userId){
    var params: URLSearchParams = new URLSearchParams();
    params.set('sort_by',colName);
    var opt = this.options;
    opt.search = params;
    var url = this.communitymanagerUrl+userId+'/cm_designer_no_action_taken';
    return this.http.get(url,opt)
          .map(this.extractData)
        .catch(this.handleErrorObservable);

  }


  getUserListForDesigner(designerId){
      let url = this.communitymanagerUrl+designerId+'/desginer_all_projects';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
  }

  getProjectDetails(projectID){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectID+'/floorplans';
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
  }

  getDesignsOfFloorplan(projectid,fpid){
      let url = environment.apiBaseUrl+'/v1/projects/'+projectid+'/floorplans/'+fpid+'/designs';
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
  }
  getUserCountsByStatus(designerId,cmId){
    let url = this.communitymanagerUrl+cmId+'/community_manager_actionable_counts?designer_id='+designerId;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  fetchRequests(){
    let url = environment.apiBaseUrl+'/v1/requests';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  fetchSiteSupervisors(){
    let url = environment.apiBaseUrl+'/v1/users/get_all_site_supervisors';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  assignSiteSupervisor(req_id, ss_id){
    let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/assign_site_suppervisor_for_request';
    var obj = {
        'sitesupervisor_id' : ss_id
    }
    return this.http.post(url,obj,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
  }

  rescheduleEvent(req_id, time){
    let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/reschedule_the_site_measurment_request';
    var obj = {
        'scheduled_at' : time
    }
    return this.http.post(url,obj,this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
  }

  discardRequest(req_id){
    let url = environment.apiBaseUrl+'/v1/requests/'+req_id+'/discard_the_request';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  fetchProjectList(user_id,page_no){
    let url = environment.apiBaseUrl+'/v1/users/'+user_id+'/wip_project_details?page='+page_no;
    return this.http.get(url,this.options)
    .map(this.extractDataPage)
    .catch(this.handleErrorObservable);
  }
  exportLeads(from_date, to_date, role,cm_id){
      let url = this.communitymanagerUrl+cm_id+'/cm_lead_download';
      let params: URLSearchParams = new URLSearchParams();
      params.set('role',role);
      params.set('from_date',from_date);
      params.set('to_date',to_date);
      this.options.search = params;
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
  exportLeadsWithFilters(from_date, to_date, colName,lead_category,designerId,cm_id){
      let url = this.communitymanagerUrl+cm_id+'/cm_lead_download';
      let params: URLSearchParams = new URLSearchParams();
      params.set('from_date',from_date);
      params.set('to_date',to_date);
      params.set('lead_category', lead_category);
      params.set('sort_by',colName);
      params.set('designer_id', designerId);
      this.options.search = params;
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

  getCmDesignerList(cmId){
    let url = this.communitymanagerUrl+cmId+'/assigned_designers_to_cm';
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }  
  designerStatusChange(desginerId,value){
    let url = environment.apiBaseUrl+'/v1/users/change_status_of_designer?designer_id='+desginerId+'&active='+value;
    return this.http.get(url,this.options)
    .map(this.extractData)
    .catch(this.handleErrorObservable);

  }
  getAnswerIndex(value){
    let url = this.communitymanagerUrl+value+'/dp_questionnaires';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);


  } 
  getCmTags(){
    let url = this.communitymanagerUrl+'/cm_tag_mapping';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  getAllCmList(){
    let url = this.communitymanagerUrl+'/designer_cm_index';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }

  getAllTags(type){
    let url = environment.apiBaseUrl+'/v1/tags?type='+type;
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }

  downloadFile(){
    let url = environment.apiBaseUrl+'/v1/users/user_pincode_mapping_xlxs';
      return this.http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  downloadFileAPICall(fileName) {
    let url = environment.apiBaseUrl+ "/" +fileName;
    window.location.href=url;
  }

  submitTags(data){
    let url = this.communitymanagerUrl+'/cm_tag_mapping';
    let obj={
      "cm_ids": data
    }
    
     
      return this.http.post(url,obj,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)


  }
  getCmCityList(){
    let url = environment.apiBaseUrl+'/v1/users/cm_cities';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);


  }
  exportReportsEvent(){
    let url = environment.apiBaseUrl+'/v1/events/download_event';
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

  /*Send Smart Report Through Email function*/ 
  smartShareEmail(){
   let url = environment.apiBaseUrl+"/v1/leads/smart_share_report";
    
    return this.http.get(url,this.options)
    .map(this.extractData)
   .catch(this.handleErrorObservable);  
  }
  /*Smart Report History*/ 
  smartShareHistory(lead_id){
    let url =environment.apiBaseUrl+"/v1/leads/smart_share_history_for_lead/?lead_id="+lead_id;
    if(this.options.params){
      this.options.params.delete('customer_status');
      this.options.params.delete('page');
      this.options.params.delete('search');
      this.options.params.delete('column_name');
    }
    return this.http.get(url,this.options)
    .map(this.extractData)
   .catch(this.handleErrorObservable);
  }
 

  changeLeadIntakeStatus(userId){
    let url = this.communitymanagerUrl+'check_cm_available';
    // let body = JSON.stringify({cm_id:parseInt(userId)});
    var body = {
      "cm_id": userId
    }

    return this.http.patch(url,body,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
  }
//get the Intake status of the community manager
  getLeadIntakeStatus(userId){
    let url = this.communitymanagerUrl+userId;
    return this.http.get(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
  }
  downloadExcelBoqLineItems(){
    let url = environment.apiBaseUrl + '/v1/quotations/boq_line_item_report';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);

  }

}
