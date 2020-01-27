import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from '../../../../services/loader.service';
import { Floorplan } from '../floorplan';
import { FloorplanService } from '../floorplan.service';
import { Routes, Router, RouterModule , ActivatedRoute} from '@angular/router';
import { Http } from '@angular/http';

declare var $:any;

@Component({
  selector: 'app-createfloorplan',
  templateUrl: './createfloorplan.component.html',
  styleUrls: ['./createfloorplan.component.css'],
     providers: [FloorplanService]

})



export class CreatefloorplanComponent implements OnInit {


  id: Number;
  floorplan : Floorplan[];
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  constructor(
    private _tokenService: Angular2TokenService,
     private formBuilder: FormBuilder,
    private floorplanService :FloorplanService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private http: Http,
    private loaderService : LoaderService
   ) {

  }
   submitted = false;

      file_name:any = ""

      onChange(event) {
       this.attachment_file =event.target.files[0] || event.srcElement.files[0];
       this.file_name = this.attachment_file.name;
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.basefile = base64.result;
             //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
           };
        fileReader.readAsDataURL(this.attachment_file);
      }
      onSubmit(data) {

          this.submitted = true;
          let postData = {name: data.name, details: data.details};
          this.loaderService.display(true);
          this.floorplanService.postWithFile(this.id,postData,this.basefile,this.file_name)
          .subscribe(
              floorplan => {
                floorplan = floorplan;
                Object.keys(floorplan).map((key)=>{ floorplan= floorplan[key];});
                this.loaderService.display(false);
                this.successalert = true;
                this.successMessage = "Floorplan plan created successfully !!";
                setTimeout(function() {
                  this.router.navigate(['/projects/view/'+this.id],{queryParams: { customer_status: this.customer_status }} );
                  this.successalert = false;
                 }.bind(this), 800);
                return floorplan;
              },
              error => {
                this.erroralert = true;
                this.errorMessage = JSON.parse(error['_body']).message;
                setTimeout(function() {
                   this.erroralert = false;
                 }.bind(this), 10000);

                this.loaderService.display(false);
                return Observable.throw(error);
              }
          );
       }
  ngOnInit() {

    this.route.params.subscribe(params => {
                this.id = +params['id'];
        });
    this.route.queryParams.subscribe(params => {
        this.customer_status = params['customer_status'];
      });

  }


}
