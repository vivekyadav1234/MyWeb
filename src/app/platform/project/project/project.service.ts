import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../../authentication/auth.service'; 
import { Project } from './project';
import { Comments } from './comments';
import { environment } from 'environments/environment';

@Injectable()
export class ProjectService {

  options: RequestOptions;
  
  private projectUrl = environment.apiBaseUrl+'/v1/projects';
  

  constructor(
    private http: Http,
    private tokenService: Angular2TokenService,
    private authService: AuthService
    ) {
      this.options = this.authService.getHeaders();
   }

    getProjectList(): Observable<Project[]>{
      return this.http.get(this.projectUrl,this.options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
   }

   private extractData(res: Response) {
      let body = res.json();
      return body;
    }

    private handleErrorObservable (error: Response | any) {
      return Observable.throw(error.message || error);
    }

    createProject(project: Project) :Observable<Project> {
      let url = this.projectUrl;
      return this.http.post(url, project, 
            this.options).map((res: Response) => res.json());
    }


    viewProjectDetails(id:Number): Observable<Project[]>{
      let url = this.projectUrl+'/'+id;
      return this.http.get(url,this.options)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    deleteProject(id:Number):Observable<Project[]> {
      let headers= this.authService.getHeaders();     
      let url = this.projectUrl+'/'+id;
      return this.http.delete(url, headers)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }

    editProject(id:Number,param:any) : Observable<Project[]>{
      let headers= this.authService.getHeaders();     
      let url = this.projectUrl+'/'+id;
      return this.http.patch(url,param,headers)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    postCommentWithId(id:Number, comment: Comments) : Observable<Comments[]>{   
      let url = this.projectUrl+'/'+id+'/comments';
      comment["commentable_id"] = id;
      comment["commentable_type"] = "Project";
      return this.http.post(url,comment,this.options)
            .map((res: Response) => res.json())
            .catch(this.handleErrorObservable);
    }

    listComments(id:Number) : Observable<Comments[]>{
      let url = this.projectUrl+'/'+id+'/comments';
      let params: URLSearchParams = new URLSearchParams();
      params.set('commentable_id', id+'');
      params.set('commentable_type', 'Project');
       this.options.search = params;     
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);
    }

    assignProjectToDesigner(projectId:Number, designerId:Number) {
      let url = this.projectUrl+'/'+projectId+'/assign_project';
      let obj = {
        project : {
          designer_id : designerId
        }
      }
      return this.http.post(url,obj,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
    }

    requestRole(role:string) {
      let url = environment.apiBaseUrl+ '/v1/users/request_role';
      let params: URLSearchParams = new URLSearchParams();
      params.set('role', role);
      this.options.search = params;
      return this.http.get(url,this.options)
              .map(this.extractData)
              .catch(this.handleErrorObservable);

    }

    questionareApi()
    {
      let url = this.projectUrl+'/global-project-details';
      return this.http.get(url, this.options)
            .map((res: Response) => res.json());
    }

    answerApi(projectId:Number)
    {
      let url = this.projectUrl+'/'+projectId+'/show-project-details';
      return this.http.get(url, this.options)
            .map((res: Response) => res.json());
    }

    bookOrderDetails(boq_id){
      let url = environment.apiBaseUrl+'/v1/proposals/get_book_order_detail?quotation_id='+boq_id;
      // let obj = {
      //   quotation_id : boq_id
      // }
      return this.http.get(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
    }

    getFinalizeDesignDetails(boq_id){
      let url = environment.apiBaseUrl+'/v1/proposals/get_finalize_design_details?quotation_id='+boq_id;
      return this.http.get(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
    }

    getQuotation(project_id,boq_id,display_boq_label){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/quotations/'+boq_id+'/client_quotation_display';
      let params: URLSearchParams = new URLSearchParams();
      params.set('display_boq_label',display_boq_label);
      this.options.search = params;
      return this.http.get(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
    }

    getPpt(project_id,ppt_id){
      let url = environment.apiBaseUrl+'/v1/projects/'+project_id+'/presentations/'+ppt_id;
      return this.http.get(url,this.options)
                    .map(this.extractData)
                    .catch(this.handleErrorObservable)
    }

}