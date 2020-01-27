import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
	FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Design } from '../design';
import { FloorplanDesignService } from '../floorplan-design.service';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';

declare var $:any;

@Component({
  selector: 'app-editfloorplandesign',
  templateUrl: './editfloorplandesign.component.html',
  styleUrls: ['./editfloorplandesign.component.css'],
    providers: [FloorplanDesignService]
})
export class EditfloorplandesignComponent implements OnInit {

	id : Number;
	fpid : Number;
	desid : Number;
	name:string;
	details : string;
	design_type: string;
	attachment_file_fp : any;
	attachment_file : any;
	attachment_file_name : string;
    baseFile : any;
    errorMessage : string;
    erroralert = false;
    successalert = false;
    successMessage : string;
  constructor(
  	private route: ActivatedRoute,
  	private formBuilder: FormBuilder,
  	private router : Router,
  	private designService: FloorplanDesignService,
  	private loaderService : LoaderService
  ) { }

  editDesignForm = this.formBuilder.group({
  	name: new FormControl('',Validators.required),
  	details: new FormControl(''),
  	design_type: new FormControl('',Validators.required),
  	attachment_file : new FormControl('')
  });

  	ngOnInit() {
	  	this.route.params.subscribe(params => {
				            this.id = +params['id'];
				            this.fpid = +params['fpid'];
				            this.desid = +params['desid'];
			});
			this.designService.viewDesignDetails(this.id,this.fpid,this.desid)
				.subscribe(
					design => {
			          design = design;
			          Object.keys(design).map((key)=>{ design= design[key];});
			          this.editDesignForm.controls['name'].setValue(design['name']);
			          this.editDesignForm.controls['details'].setValue(design['details']);
			          this.editDesignForm.controls['design_type'].setValue(design['design_type']);
			          //this.editDesignForm.controls['attachment_file'].setValue(design['attachment_file']);
			          //document.getElementById('uploadedfilename').innerHTML = design['attachment_file'];
			          // this.name = design['name'];
			          // this.details = design['details'];
			          // this.design_type = design['design_type'];
			          // this.attachment_file_fp = design['attachment_file'];
			          return design;
			        },
			        error => {
	                this.erroralert = true;
		            	this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
		            	//$.notify(JSON.parse(this.errorMessage['_body']).message);
				        this.router.navigateByUrl('projects/'+this.id+'/floorplandesign/'+this.fpid+'/view');
				        return Observable.throw(error);
			        }
			);
  	}
  	onChange(event) {
  		this.attachment_file = event.target.files[0] || event.srcElement.files[0];
     document.getElementById('uploadedfilename').innerHTML = this.attachment_file['name'];
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.baseFile = base64.result;
           };
        fileReader.readAsDataURL(this.attachment_file);
    }

	submitted = false;
	onSubmit(data) {
    	this.submitted = true;
    	let postData = {name: data.name, details: data.details, design_type:data.design_type};
    	this.loaderService.display(true);

    	this.designService.updateDesign(this.id,this.fpid,this.desid,postData,this.baseFile)
		    .subscribe(
		        design => {
		          design = design;
		          this.loaderService.display(false);
								this.successalert = true;
							 this.successMessage = "Design updated successfully !!";
              	//$.notify("Design updated successfully")
								setTimeout(function() {
                       this.router.navigateByUrl('projects/'+this.id+'/floorplandesign/'+this.fpid+'/view');
                 }.bind(this), 2000);

		          return design;
		        },
		        error => {
	            	this.errorMessage=error;
	            	this.loaderService.display(false);
               		 $.notify(JSON.parse(error['_body']).message);

			        return Observable.throw(error);
		        }
		    );

    }

  	upload(){
   	 $(".fileUpload").click();
   	}

}
