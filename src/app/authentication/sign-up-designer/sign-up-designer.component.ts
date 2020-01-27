import { Component, OnInit , Input} from '@angular/core';
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
import { CustomvalidationService } from '../customvalidation.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { LoaderService } from '../../services/loader.service';
declare var Layout:any;

@Component({
  selector: 'app-sign-up-designer',
  templateUrl: './sign-up-designer.component.html',
  styleUrls: ['./sign-up-designer.component.css']
})



export class SignUpDesignerComponent implements OnInit {

	submitted:boolean;
	signupdesignerForm : FormGroup;
  options: RequestOptions;
  successalert = false;
  erroralert = false;
  errorMessage: string;
  successMsg : string;
  headers: Headers;
  showvalidNameMsg:boolean;
  showvalidMobileNoMsg:boolean;
  showvalidEmailMsg:boolean;
  form : FormGroup;
  lead_cv: any;
  basefile;
  file_name: any = ""


   private leadRegUrl = environment.apiBaseUrl+'/v1/leads';



  constructor(
  	private tokenService : Angular2TokenService,
  	private authService : AuthService,
  	private formBuilder : FormBuilder,
  	private validationService : CustomvalidationService,
    private router: Router,
    private http: Http,
    private loaderService : LoaderService
  	) { }


  	ngOnInit() {

      this.form = new FormGroup({
        name: new FormControl("",Validators.required),
        contact: new FormControl("",Validators.required),
        email: new FormControl("",Validators.required),
        instagram_handle: new FormControl(""),
        // cv: new FormControl("")
      })

  		this.submitted = false;
  		// this.signupdesignerForm = this.formBuilder.group({
	  	// 	name: [''],
	    // 	email: [''],
	    // 	contact: [''],
	    // 	//password: ['', [Validators.required, Validators.minLength(8)]]
  		// });

  		this
  		.tokenService
  		.init({
  			apiBase : environment.apiBaseUrl,
  			registerAccountPath: 'auth',
        	registerAccountCallback: '/',
        	validateTokenPath: 'auth/validate_token'
  		});
	}

	submit(value:any){

    window.scrollTo(0,0);
    this.showvalidNameMsg = false;
    this.showvalidEmailMsg = false;
    this.showvalidMobileNoMsg = false;
		this.submitted = true;
    this.headers = new Headers({'enctype': 'multipart/form-data'});
    this.headers.append('Accept', 'application/json');
    this.options = new RequestOptions({headers: this.headers});
    value.lead_type = 'designer';
    value.lead_source = 'website';
    value.lead_cv = this.basefile;

    if(value.email != "" && value.email != null && value.name != "" && value.name != null && value.contact != "" && value.contact != null) {
      if(this.checkEmail(value.email)) {
        this.loaderService.display(true);
         var obj={
           lead:value
         }
        this.http.post(this.leadRegUrl, obj,
              this.options).map((res: Response) => res.json())
            .subscribe(
            lead => {
              this.form.reset();
              document.getElementById("fileName").innerHTML = 'Upload CV';
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
    else {
        if(value.email == "" || value.email == null){
          this.showvalidEmailMsg = true;
        }
        if(value.name =="" || value.name == null) {
          this.showvalidNameMsg = true;
        }
        if(value.contact =="" || value.contact == null) {
          this.showvalidMobileNoMsg = true;
        }
    }
	}
  checkEmail(email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email)) {
    return false;
   }
   return true;
  }
	afterFailedLogin(errors: any) {
	    let parsed_errors = JSON.parse(errors._body).errors;
	    for (let attribute in this.signupdesignerForm.controls) {
	      if (parsed_errors[attribute]) {
	        this.signupdesignerForm.controls[attribute].setErrors(parsed_errors[attribute]);
	      }
	    }
    	this.signupdesignerForm.setErrors(parsed_errors);
  }

  onFocusFunction(id) {
    // if(id == 'name') {
    //   this.showvalidNameMsg = false;
    // }
    // if( id == 'email') {
    //   this.showvalidEmailMsg = false;
    // }

  }

  uploadCV(event) {
    this.lead_cv = event.target.files[0] || event.srcElement.files[0];
    this.file_name = this.lead_cv.name;
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
    };
    fileReader.readAsDataURL(this.lead_cv);
    document.getElementById("fileName").innerHTML = this.file_name;
  }

};
