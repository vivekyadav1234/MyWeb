import { Component, EventEmitter, Input, OnInit, Output, NgZone } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {Angular2TokenService } from 'angular2-token';
import { Router, Routes, RouterModule , ActivatedRoute} from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../authentication/auth.service';
import { LoaderService } from '../../../../services/loader.service';
import { DesignerPortfolioService } from '../designer-portfolio.service';
declare var $:any;

@Component({
  selector: 'app-create-designerportfolio',
  templateUrl: './create-designerportfolio.component.html',
  styleUrls: ['./create-designerportfolio.component.css'],
  providers: [DesignerPortfolioService]
})
export class CreateDesignerportfolioComponent implements OnInit {

	createPortfolioForm: FormGroup;
	id: any;
  	attachment_file: any;
  	attachment_name: string;
  	errorMessage: string;
  	successMessage: string;
  	erroralert:boolean;
  	successalert:boolean;
  	basefile = {};
  	role : string;

  	constructor(
  		private formBuilder: FormBuilder,
    	private authService : AuthService,
    	private router: Router,
    	private route: ActivatedRoute,
    	private loaderService : LoaderService,
    	private designerPortfolioService: DesignerPortfolioService
  	) { 
  		this.role = localStorage.getItem('user');
  		this.id = localStorage.getItem('userId');
  	}

  	ngOnInit() {
  		this.createPortfolioForm = this.formBuilder.group({
     		portfolio_work: this.formBuilder.array( [this.buildItem('')])
    	})
  	}

  	buildItem(val: string) {
	    return new FormGroup({
	      name: new FormControl(val, Validators.required),
	      description: new FormControl(""),
	      url: new FormControl(""),
	      attachment_file: new FormControl(""),
	    })
  	}

  	getJobAttributes(createPortfolioForm){
    	return createPortfolioForm.get('portfolio_work').controls
  	}

  	pushJobAttributes(createPortfolioForm){
    	return createPortfolioForm.get('portfolio_work').push(this.buildItem(''))
  	}

  	onChange(event,i) {
	    this.attachment_file = event.srcElement.files[0];
	    
	    var fileReader = new FileReader();

	    var base64;
	    fileReader.onload = (fileLoadedEvent) => {
	       base64 = fileLoadedEvent.target;
	      this.basefile[i] = base64.result
	    };
	    fileReader.readAsDataURL(this.attachment_file);
    }

    onSubmit(data) {
    	this.loaderService.display(true);
	    let arr = this.basefile;
	    // this.loaderService.display(true);
	    data.portfolio_work.forEach(function (value, i) {
	      value.attachment_file = arr[i];
	    });
	    this.designerPortfolioService.uploadPortfolioData(data,this.id)
	    	.subscribe(
	    		res => {
	    			this.successMessage = 'Uploaded successfully';
	    			this.successalert = true;
	    			this.loaderService.display(false);
	    			setTimeout(function() {
                     this.successalert = false;
                	}.bind(this), 10000);
	    		},
	    		err => {
	    			this.erroralert = true;
	    			this.errorMessage = <any>JSON.parse(err['_body']).message;
	    			this.loaderService.display(false);
	    			setTimeout(function() {
                     this.erroralert = false;
                	}.bind(this), 10000);
	    		}
	    	);
    }

}
