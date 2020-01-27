import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {Angular2TokenService } from 'angular2-token';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';
import {Lead} from '../../platform/lead/lead';

declare var Layout:any;

@Component({
  selector: 'app-lead-sign-up',
  templateUrl: './lead-sign-up.component.html',
  styleUrls: ['./lead-sign-up.component.css']
})
export class LeadSignUpComponent implements OnInit {

	options: RequestOptions;
  	headers: Headers;
     name:string;
    email:string;
    contact:string;
    pincode:string;
   private leadRegUrl = environment.apiBaseUrl+'/v1/leads';

  constructor(
  	private formBuilder: FormBuilder,
    private router: Router,
     private http: Http,
     private authService: AuthService
  ) { 
  	
  }

  submitted = false;
   errorMessage: string;
  
  ngOnInit() {
  }
  onSubmit(data) { 
    this.submitted = true;
    
    this.headers = new Headers({'enctype': 'multipart/form-data'});
    this.headers.append('Accept', 'application/json');
    this.options = new RequestOptions({headers: this.headers});

    data.user_type = 'customer';

    	this.http.post(this.leadRegUrl, data, 
        	this.options).map((res: Response) => res.json())
	    	.subscribe(
				lead => {
		          lead = lead;
		          Object.keys(lead).map((key)=>{ lead= lead[key];});
		          // Layout.initSWAL('Congrats!','success', 'You have registered successfully!');
		          //$.notify('You have registered successfully!');
		          this.router.navigateByUrl('/');
		          return lead;
		        }, 
		        error => {
		          this.errorMessage = error;
               // Layout.initSWAL('Oops!','error', 'Email already taken! ');
              //$.notify('error',"this.errorMessage['_body']")
		          return Observable.throw(error);
		        }
	    	);
  }
  
  

}
