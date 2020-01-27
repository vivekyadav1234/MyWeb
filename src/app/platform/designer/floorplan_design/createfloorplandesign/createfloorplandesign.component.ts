import { Component, OnInit , ElementRef, Input} from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from '../../../../services/loader.service';
import {Design} from '../design';
import { ProjectService } from '../../../project/project/project.service';
import {FloorplanDesignService} from '../floorplan-design.service';
import { Routes,Router, RouterModule , ActivatedRoute} from '@angular/router';
import { Http } from '@angular/http';

declare var Layout:any;

@Component({
  selector: 'app-createfloorplandesign',
  templateUrl: './createfloorplandesign.component.html',
  styleUrls: ['./createfloorplandesign.component.css'],
  providers: [ProjectService, FloorplanDesignService]
})
export class CreatefloorplandesignComponent implements OnInit {
	id: Number;
	fpid:Number;
  design : Design[];
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  design_type : string;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  
  constructor(
  	private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private designService :FloorplanDesignService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private http: Http,
    private loaderService : LoaderService
  ) {
      this.design_type = 'initial';
   }

  submitted = false;

    onChange(event) {
       this.attachment_file = event.target.files[0] || event.srcElement.files[0];
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.basefile = base64.result;
           };
        fileReader.readAsDataURL(this.attachment_file);
    }
    onSubmit(data) {
          this.submitted = true;
          this.loaderService.display(true);
          let postData = {name: data.name, details: data.details, design_type: data.design_type}; // Put your form data variable.
          this.designService.createDesign(this.id,this.fpid,postData,this.basefile)
          .subscribe(
              design => {
                design = design;
                Object.keys(design).map((key)=>{ design= design[key];});
                // this.router.navigateByUrl('projects/'+this.id+'/floorplan/view/'+this.fpid);
                this.loaderService.display(false);
                this.router.navigateByUrl('projects/'+this.id+'/floorplandesign/'+this.fpid+'/view');
                return design;
              },
              error => {
                this.erroralert = true;
                this.errorMessage = JSON.parse(error['_body']).message;
                this.loaderService.display(false);
              //  Layout.notify('danger',JSON.parse(this.errorMessage['_body']).message);
                return Observable.throw(error);
              }
          );
    }

  ngOnInit() {
  	this.route.params.subscribe(params => {
                this.id = +params['id'];
                this.fpid = +params['fpid'];
    });
    this.route.queryParams.subscribe(params => {
        this.customer_status = params['customer_status'];
    });

  }

}
