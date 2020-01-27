import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Floorplan } from '../floorplan';
import { FloorplanService } from '../floorplan.service';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';

declare var $:any;

@Component({
  selector: 'app-editfloorplan',
  templateUrl: './editfloorplan.component.html',
  styleUrls: ['./editfloorplan.component.css'],
  providers: [FloorplanService]
})
export class EditfloorplanComponent implements OnInit {

	id : Number;
	fpid : Number;
	name:string;
	details : string;
	attachment_file_fp : any;
	attachment_file : any;
	attachment_file_name : string;
	basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  	constructor(
  		private floorplanService :FloorplanService,
  		private route: ActivatedRoute,
  		private formBuilder: FormBuilder,
  		private router : Router,
      private loaderService : LoaderService
  	) { }

	ngOnInit() {
	  	this.route.params.subscribe(params => {
			            this.id = +params['id'];
			            this.fpid = +params['fpid'];
		});
      this.route.queryParams.subscribe(params => {
        this.customer_status = params['customer_status'];
    });
		this.floorplanService.viewFloorplanDetails(this.id,this.fpid)
			.subscribe(
				floorplan => {
		          floorplan = floorplan;
		          Object.keys(floorplan).map((key)=>{ floorplan= floorplan[key];});
		          this.name = floorplan['name'];
		          this.details = floorplan['details'];
		          this.attachment_file_fp = floorplan['attachment_file'];
		          return floorplan;
		        },
		        error => {
                this.erroralert = true;
	            	this.errorMessage= JSON.parse(error['_body']).message;
                //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
                this.router.navigateByUrl('/');
			        return Observable.throw(error);
		        }
		  );

	}

	onChange(event) {
     this.attachment_file = event.srcElement.files[0];
      var fileReader = new FileReader();
         var base64;
          fileReader.onload = (fileLoadedEvent) => {
           base64 = fileLoadedEvent.target;
           this.basefile = base64.result;
         };
      fileReader.readAsDataURL(this.attachment_file);
  }

	submitted = false;
    onSubmit(data) {
      this.loaderService.display(true);
    	this.submitted = true;
    	let postData = {name: data.name, details: data.details}; // Put your form data variable.
          this.floorplanService.updateFloorPlan(this.id,this.fpid,postData,this.basefile)
          .subscribe(
              floorplan => {
                floorplan = floorplan;
                this.loaderService.display(false);
                this.successalert = true;
                this.successMessage = "Floorplan updated !!";
              //  $.notify('Floorplan updated');
              setTimeout(function() {
                  this.router.navigateByUrl('projects/'+this.id+'/floorplan/view/'+this.fpid);
                }.bind(this), 5000);

                return floorplan;
              },
              error => {
                this.erroralert = true;
                this.errorMessage=JSON.parse(error['_body']).message;

                this.loaderService.display(false);
//$.notify('error',JSON.parse(this.errorMessage['_body']).message);
                return Observable.throw(error);
              }
          );

    }


}
