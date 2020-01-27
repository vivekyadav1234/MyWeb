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
export class DesignerService {

	options: RequestOptions;
	private designerUrl = environment.apiBaseUrl+'/v1/users/';
	
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

    getUserCountsByAccountable(designerId) {
      let url = this.designerUrl+designerId+'/designer_actionables';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
    }

    getUserCountsByStatus(designerId,date_from?,date_to?,status?) {

      let url = this.designerUrl+designerId+'/designer_dashboard_count';
      let params: URLSearchParams = new URLSearchParams();
      params.set('from_date', date_from);
      params.set('to_date',date_to);
      params.set('column_name',status);
      this.options.search = params;

      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
      
    }
    getUserCountsByStatusInWip(designerId,date_from?,date_to?,status?) {

      let url = this.designerUrl+designerId+'/designer_wip_dashboard_counts';
      let params: URLSearchParams = new URLSearchParams();
      params.set('from_date', date_from);
      params.set('to_date',date_to);
      params.set('column_name',status);
      this.options.search = params;

      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
      
    }

    getUserCountsByDeadlines(designerId){
      let url = this.designerUrl+designerId+'/leads_for_deadlines_count';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
    }

    getActionableList(project_status, designerId, page?){
      var url
      if(project_status == "no_action"){
        url = this.designerUrl+designerId+'/leads_qualified_but_no_actions_taken';
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;
      }
      else if(project_status == "calls_today"){
        url = this.designerUrl+designerId+'/all_calls_to_be_done_today';
        let params: URLSearchParams = new URLSearchParams();
        params.set('agenda', "follow_up");
        params.set('page', page);
        this.options.search = params;
      }

      else if(project_status == "not_contactable"){
        url = this.designerUrl+designerId+'/designer_dashboard';
        let params: URLSearchParams = new URLSearchParams();
        params.set('agenda', "follow_up_for_not_contactable");
        params.set('page', page);
        this.options.search = params;
      }

      else if(project_status == "escalated_calls"){
        url = this.designerUrl+designerId+'/all_calls_to_be_done_today_escalated';
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;
      }

      else if(project_status == "meetings_today"){
        url = this.designerUrl+designerId+'/meeting_scheduled_for_today';
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;
      }

      else if(project_status == "escalated_meetings"){
        url = this.designerUrl+designerId+'/meeting_scheduled_for_today_escalated';
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page);
        this.options.search = params;
      }
      return this.http.get(url,this.options)
      .map(this.extractDataPage)
     .catch(this.handleErrorObservable);
    }

    getDeadlinesList(project_status, designerId){
      var url
      if(project_status == "no_action"){
        url = this.designerUrl+designerId+'/leads_for_deadlines';
        let params: URLSearchParams = new URLSearchParams();
        params.set('customer_status', "qualified");
        this.options.search = params;
      }
      else if(project_status == "follow_up"){
        url = this.designerUrl+designerId+'/leads_for_deadlines';
        let params: URLSearchParams = new URLSearchParams();
        params.set('customer_status', "follow_up");
        this.options.search = params;
      }

      else if(project_status == "not_contactable"){
        url = this.designerUrl+designerId+'/leads_for_deadlines';
        let params: URLSearchParams = new URLSearchParams();
        params.set('customer_status', "not_contactable");
        this.options.search = params;
      }

      else if(project_status == "no_designs"){
        url = this.designerUrl+designerId+'/leads_for_deadlines';
        let params: URLSearchParams = new URLSearchParams();
        params.set('customer_status', "no_designs");
        this.options.search = params;
      }

      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
    }

    getUserListForDesigner(designerId,customer_status, page,search?,columnName?,fromDate?,toDate?){
	  	let url = this.designerUrl+designerId+'/designer_dashboard';
      let params: URLSearchParams = new URLSearchParams();
      params.set('customer_status', customer_status);
      params.set('page', page);
      params.set('search', search);
      params.set('from_date', fromDate);
      params.set('to_date',toDate);
      params.set('column_name',columnName);
      this.options.search = params;
        
	    return this.http.get(url,this.options)
	    .map(this.extractDataPage)
	   .catch(this.handleErrorObservable);
  	}

    getWipLeads(designerId,status, page?,search?,columnName?,fromDate?,toDate?){
      let url = this.designerUrl+designerId+'/wip_leads';
      let params: URLSearchParams = new URLSearchParams();
      params.set('status', status);
      params.set('page', page);
      params.set('search', search);
      params.set('from_date', fromDate);
      params.set('to_date', toDate);
      params.set('column_name', columnName);
      this.options.search = params;
      return this.http.get(url,this.options)
      .map(this.extractDataPage)
     .catch(this.handleErrorObservable);
    }

  	getCustomerDetails(customer_id,designerId){
  		let url = this.designerUrl+designerId+'/customer_details';
  		let params: URLSearchParams = new URLSearchParams();
      	params.set('customer_id', customer_id);
      	this.options.search = params;
      	
	    return this.http.get(url,this.options)
	    .map(this.extractData)
	   .catch(this.handleErrorObservable);
  	}

    changeUserStatus(data,designerId,customer_id) {
      let url = this.designerUrl+designerId+'/change_customer_status';
      data['customer_id'] = customer_id;
      
      return this.http.post(url,data,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
    }

    statusUpdate(data,designerId){
      let url = this.designerUrl+designerId+'/change_customer_status';
      if(this.options.params){
        this.options.params.delete('customer_status');
      }
      return this.http.post(url,data,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
    }


    subStatusUpdate(data,designerId){
      // http://localhost:3000/v1/users/5/change_sub_status?project_id=5&sub_status=initial_proposal_accepted
      let url = this.designerUrl+designerId+'/change_sub_status';
      if(this.options.params){
        this.options.params.delete('customer_status');
      }
      return this.http.post(url,data,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
    }

    callToLead(userId, contact){
      let url = environment.apiBaseUrl+'/v1/inhouse_calls';
      let obj = { 
        'inhouse_call' : {
          'user_id':userId
        },
        'contact_no': contact
      };
      return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
    }

    callToLeadWithAlternateNumber(userId,contact){
      let url = environment.apiBaseUrl+'/v1/inhouse_calls';
      let obj = { 
        'inhouse_call' : {
          'user_id':userId
        },
        'contact_no':contact
      };
      return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
    }

    sendSms(userId, clientId, sms_body){
      let url = environment.apiBaseUrl+'/v1/inhouse_calls/send_sms';
      let obj = { 
        'inhouse_call' : {
          'user_id':userId
        },
        'lead_id': clientId,
        'sms_body': sms_body
      };
      return this.http.post(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
    }

    getDesignerBookingForm(projectId){
      if(this.options.params){
        this.options.params.delete('customer_id');
      }
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/show-designer-booking-form';
      return this.http.get(url,this.options).map(this.extractData).catch(this.handleErrorObservable);
    }

    SubmitDesignerBookingForm(data,projectId){
      var obj = {
        designer_booking_form : {
            'inspiration_image':data.inspiration_image,'customer_name':data.customer_name,'customer_age':data.customer_age,
            'profession':data.profession,'family_profession':data.family_profession,'age_house':data.age_house,
            'lifestyle':data.lifestyle,'house_positive_features':data.house_positive_features,
            'house_negative_features':data.house_negative_features,'inspiration':data.inspiration,
            'color_tones':data.color_tones,'theme':data.theme,'functionality':data.functionality,
            'false_ceiling':data.false_ceiling,'electrical_points':data.electrical_points,
            'special_needs':data.special_needs,'vastu_shastra':data.vastu_shastra,'all_at_once':data.all_at_once,
            'budget_range':data.budget_range,'design_style_tastes':data.design_style_tastes,
            'storage_space':data.storage_space,'mood':data.mood,'enhancements':data.enhancements,
            'discuss_in_person':data.discuss_in_person,'project_id':projectId,
            'mk_age': data.mk_age,'mk_gut_kitchen':data.mk_gut_kitchen,'mk_same_layout':data.mk_same_layout,
            'mk_improvements':data.mk_improvements,'mk_special_requirements':data.mk_special_requirements,
            'mk_cooking_details':data.mk_cooking_details,'mk_appliances':data.mk_appliances,
            'mk_family_eating_area':data.mk_family_eating_area,'mk_guest_frequence':data.mk_guest_frequence,
            'mk_storage_patterns':data.mk_storage_patterns,'mk_cabinet_finishing':data.mk_cabinet_finishing,
            'mk_countertop_materials':data.mk_countertop_materials,'mk_mood':data.mk_mood
        }
      }
      let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/update-designer-booking-form';
      return this.http.patch(url,obj,this.options).map(this.extractData).catch(this.handleErrorObservable);
    }

  exportLeads(role,d_id,custStatus?,selectedStatus?,fromDate?,toDate?){
      let url = this.designerUrl+d_id+'/designer_leads_download';
      let params: URLSearchParams = new URLSearchParams();
      params.set('role',role);
      params.set('customer_status',custStatus);
      params.set('column_name',selectedStatus);
      params.set('from_date',fromDate);
      params.set('to_date',toDate);
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
  getSectionQuestionList(designerId){
    let url = this.designerUrl+designerId+'/dp_questionnaires/get_section_wise_questions';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  } 
  viewProfile(id:number){
    let url = this.designerUrl+id;
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
  }
  getAnswerIndex(value){
    let url = this.designerUrl+value+'/dp_questionnaires';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);


  } 
  submitDpQuestionnaire(designerId,data){
     let url = this.designerUrl+designerId+'/dp_questionnaires';
      
      return this.http.post(url,data,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  updateRemarkStatus(data,projectId){
    let url = environment.apiBaseUrl+'/v1/projects/'+projectId+'/update_remark';
    if(this.options.params){
        this.options.params.delete('customer_status');
      }
      return this.http.patch(url,data,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);

  }


  getAllProjects(statusFilter,stageFilter,wipFilter,LeadId,date,sort,page?,search?){

    let url = environment.apiBaseUrl+'/v1/task_sets/designer_task_sets';
      let params: URLSearchParams = new URLSearchParams();
       var obj ={

         'task_status': statusFilter,
         'stage': stageFilter,
         'wip_status': wipFilter,
         'lead_id': LeadId
       }
       var obj1 ={

         'column_name': date,
         'order_by': sort
         
       }
       var json1 = JSON.stringify(obj1);
       var json = JSON.stringify(obj);
       params.set('page', page);
       params.set('search', search);
       params.set('filter_by',json);
       params.set('sort_by',json1);
        this.options.search = params;
        return this.http.get(url,this.options)
        .map(this.extractDataPage)
       .catch(this.handleErrorObservable);

  }
  getTaskCounts(){
    let url = environment.apiBaseUrl+'/v1/task_sets/task_counts';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  getTaskList(projectId){
    let url = environment.apiBaseUrl+'/v1/task_sets/get_pre_bid_tasks?project_id='+projectId;
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  getBoqTaskLst(quotationId){
    let url = environment.apiBaseUrl+'/v1/task_sets/get_ten_per_task_status?quotation_id='+quotationId;
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);


  }
  getBoqTaskLstForTenToForty(quotationId){
    let url = environment.apiBaseUrl+'/v1/task_sets/get_ten_to_forty_per_tasks?quotation_id='+quotationId;
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  getProjectTaskCount(projectId){
    let url = environment.apiBaseUrl+'/v1/task_sets/project_task_counts?project_id='+projectId;
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);

  }
  getBoqTaskCount(quotationId){
    let url = environment.apiBaseUrl+'/v1/task_sets/quotation_task_counts?quotation_id='+quotationId;
    return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
  }  

  exportBoq(){
    let url = environment.apiBaseUrl +'/v1/quotations/download_boq_report';
      return this.http.get(url,this.options)
      .map(this.extractData)
     .catch(this.handleErrorObservable);
  }
  newStatusChange(taskId){
    let url = environment.apiBaseUrl+'/v1/task_sets/mark_task_as_old';
    let params: URLSearchParams = new URLSearchParams();
      params.set('task_escalation_id', taskId);
      
      this.options.search = params;
    return this.http.get(url,this.options)
      .map(this.extractData)
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
}
