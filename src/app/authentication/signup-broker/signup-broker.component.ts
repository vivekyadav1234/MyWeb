import { Component, OnInit } from '@angular/core';
import {Angular2TokenService} from 'angular2-token';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../auth.service';
import {environment} from '../../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { LoaderService } from '../../services/loader.service';
declare var Layout:any;

@Component({
  selector: 'app-signup-broker',
  templateUrl: './signup-broker.component.html',
  styleUrls: ['./signup-broker.component.css']
})
export class SignupBrokerComponent implements OnInit {


	 formSubmitAttempt: boolean;
	options: RequestOptions;
	headers: Headers;
	successalert = false;
   	erroralert = false;
   	errorMessage: string;
   	successMsg : string;
		showvalidEmailMsg:boolean;
		form: FormGroup;

	private leadRegUrl = environment.apiBaseUrl+'/v1/leads';
	signupbrokerForm = this.formBuilder.group({
		  		name: new FormControl('',Validators.required),
		    	email: new FormControl('',Validators.required),
		    	contact: new FormControl('')
	 });

  constructor(
  	private tokenService : Angular2TokenService,
  	private authService : AuthService,
  	private formBuilder : FormBuilder,
    private router: Router,
    private http: Http,
    private loaderService : LoaderService
  ) { }

	ngOnInit() {
		this.form = new FormGroup({
			name: new FormControl("",Validators.required),
			contact: new FormControl("",Validators.required),
			email: new FormControl("",Validators.required)
		})

	}

  	checkEmail(email) {
	    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

	    if (!filter.test(email)) {
	    	return false;
	   	}
	   return true;
 	}

 	numberCheck(e) {
	    if(!((e.keyCode > 95 && e.keyCode < 106)
	        || (e.keyCode > 47 && e.keyCode < 58)
	        || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
	        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
	      return false;
	    }
  	}

  	submit(data) {
  		 window.scrollTo(0,0); 
        this.formSubmitAttempt = true;
        if (this.form.valid) {
            this.formSubmitAttempt = false;
            this.headers = new Headers({'enctype': 'multipart/form-data'});
    		this.headers.append('Accept', 'application/json');
    		this.options = new RequestOptions({headers: this.headers});
    		data.lead_type = 'broker';
    		data.lead_source = 'website';
    		if(this.checkEmail(data.email)) {
		        this.loaderService.display(true);
		        this.showvalidEmailMsg = false;
		        this.signupbrokerForm.reset();
		        this.http.post(this.leadRegUrl, data, 
		              this.options).map((res: Response) => res.json())
		            .subscribe(
		            lead => {
									this.form.reset();
		                  this.successalert = true;
		                  this.loaderService.display(false);
		                  lead = lead;
		                  Object.keys(lead).map((key)=>{ lead= lead[key];});
		                  this.successMsg = 'You have registered successfully !';
		                    setTimeout(function() {
		                       this.successalert = false;
		                   }.bind(this), 10000);
		                  return lead;
		                }, 
		                error => {
		                  this.erroralert = true;
		                    this.errorMessage = JSON.parse(error['_body']).message;
		                    this.loaderService.display(false);
		                    setTimeout(function() {
		                       this.erroralert = false;
		                   }.bind(this), 10000);
		                }
		            );
	        }
	        else {
	         this.showvalidEmailMsg = true;
	        }
        }
  	}

  	emailVaildMsg() {
  		this.showvalidEmailMsg = false;
  	}

}
