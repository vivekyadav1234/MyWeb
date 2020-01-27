import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {Angular2TokenService } from 'angular2-token';
import { Catalogue } from '../catalogue';
import { CatalogueService } from '../catalogue.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
declare var Layout:any;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [CatalogueService]
})
export class CreateComponent implements OnInit {

  createCatalogueForm: FormGroup;
  attachment_file: any;
  attachment_name: string;
  basefile = {};

  constructor(
      private formBuilder: FormBuilder,
      private catalogueService :CatalogueService,
      private router: Router,
      private loaderService: LoaderService
    ) { }

  submitted = false;
  errorMessage: string;

  ngOnInit() {
    this.createCatalogueForm = this.formBuilder.group({
      section: this.formBuilder.array( [this.buildItem('')])
    })
  }

  buildItem(val: string) {
    return new FormGroup({
      name: new FormControl(val, Validators.required),
      description: new FormControl(""),
      attachment_file: new FormControl('')
    })
  }

  getJobAttributes(createCatalogueForm){
    return createCatalogueForm.get('section').controls
  }

  pushJobAttributes(createCatalogueForm){
    return createCatalogueForm.get('section').push(this.buildItem(''))
  }

  onSubmit(data) { 
    this.submitted = true;
    this.loaderService.display(true);
    let arr = this.basefile
    data.section.forEach(function (value, i) {
      value.attachment_file = arr[i];
    });
    this.catalogueService.createCatalogue(data)
    .subscribe(
        catalogue => {
          this.loaderService.display(false);
          catalogue = catalogue;
          Object.keys(catalogue).map((key)=>{ catalogue= catalogue[key];});
          //this.router.navigateByUrl('/catalogue/list');
          return catalogue;
        }, 
        error => {
          this.loaderService.display(false);
          this.errorMessage = error;
          Layout.notify(JSON.parse(this.errorMessage['_body']).message);
          //this.router.navigateByUrl('/');
          return Observable.throw(error);
        }
    );
  }

  onChange(event,i) {
    this.attachment_file = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile[i] = base64.result
    };
    fileReader.readAsDataURL(this.attachment_file);
  }
}