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
export class SchedulerService {

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

    uploadCatalogueExcel(id:number,file:File[]){
    	let url = environment.apiBaseUrl+'/v1/projects/'+id+'/project_tasks/import_tasks';
    	let import_task = {
    		'attachment_file':file
    	}
    	return this.http.post(url,import_task,this.options).map(this.extractData)
    			.catch(this.handleErrorObservable);
    }

    getProjectTasksForExcel(id:number) {
    	let url = environment.apiBaseUrl+'/v1/projects/'+id+'/project_tasks';
    	return this.http.get(url,this.options)
    			.map(this.extractData).catch(this.handleErrorObservable);
    }
    deleteTask(id:number,taskid:number) { 
    	let url = environment.apiBaseUrl+'/v1/projects/'+id+'/project_tasks/'+taskid;
    	return this.http.delete(url,this.options)
    			.map(this.extractData).catch(this.handleErrorObservable);
    }

    addTask(id:number,data:any) {
    	let project_task = {
    		project_id : id,
    		internal_name : data.internal_name,
    		name : data.name,
    		percent_completion : data.percent_completion,
    		start_date : data.start_date,
    		end_date : data.end_date,
    		upstream_dependencies : data.upstream_dependencies,
    		duration : data.duration,
    		resource : data.resource,
            process_owner : data.process_owner,
            action_point : data.action_point,
            remarks : data.remarks,
            status : data.status
    	}
    	let url = environment.apiBaseUrl+'/v1/projects/'+id+'/project_tasks';
    	return this.http.post(url,project_task,this.options).
    		map(this.extractData).catch(this.handleErrorObservable);
    }
    editTask(id:number,taskid:number,data:any) {
    	let project_task = {
    		project_id : id,
    		internal_name : data.internal_name,
    		name : data.name,
    		percent_completion : data.percent_completion,
    		start_date : data.start_date,
    		end_date : data.end_date,
    		upstream_dependencies : data.upstream_dependencies,
    		duration : data.duration,
    		resource : data.resource,
            status : data.status,
            process_owner : data.process_owner,
            action_point : data.action_point,
            remarks : data.remarks
    	}
    	let url =  environment.apiBaseUrl+'/v1/projects/'+id+'/project_tasks/'+taskid;
    	return this.http.patch(url,project_task,this.options).
    		map(this.extractData).catch(this.handleErrorObservable);
    }

    getTaskDetail(id:number,taskid:string) {
    	let url =  environment.apiBaseUrl+'/v1/projects/'+id+'/project_tasks/'+taskid;
    	return this.http.get(url,this.options).
    		map(this.extractData).catch(this.handleErrorObservable);
    }
   
}
