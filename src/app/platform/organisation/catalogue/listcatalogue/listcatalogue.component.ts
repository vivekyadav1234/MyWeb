import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogueService } from '../catalogue.service';
import { UserDetailsService } from '../../../../services/user-details.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Catalogue } from '../catalogue';
import { LoaderService } from '../../../../services/loader.service';
declare var Layout:any;
declare var $:any;

@Component({
  selector: 'app-listcatalogue',
  templateUrl: './listcatalogue.component.html',
  styleUrls: ['./listcatalogue.component.css'],
  providers: [CatalogueService, UserDetailsService]
})
export class ListcatalogueComponent implements OnInit {

  observableCatalogues: Observable<Catalogue[]>
  catalogues: Catalogue[];
  errorMessage: string;
  erroralert = false;
  role : string;
  successalert = false;
  successMessage : string;
  createCatalogueForm: FormGroup;
  editCatalogueForm: FormGroup;
  attachment_file: any;
  attachment_name: string;
  basefile = {};
  submitted = false;
  editAndDeleteSectionAccess = ['admin','catalogue_head'];

  constructor(
    private userDetailsService:UserDetailsService,
    private router: Router,
    private catalogueService:CatalogueService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
       this.getCatalogueListFromService();
   }

  ngOnChanges(): void {
    this.getCatalogueListFromService();
  }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.getCatalogueListFromService();
    this.createCatalogueForm = this.formBuilder.group({
      section: this.formBuilder.array( [this.buildItem('')])
    });
    this.editCatalogueForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('',Validators.required),
      description: new FormControl(""),
      attachment_file: new FormControl('')
    });
  }
  ngAfterViewInit() {
    this.loaderService.display(true);
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
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

  private getCatalogueListFromService(){
    this.observableCatalogues = this.catalogueService.getCatalogueList();
    this.observableCatalogues.subscribe(
        catalogues => {
          this.catalogues = catalogues;
          Object.keys(catalogues).map((key)=>{ this.catalogues= catalogues[key];});
          this.loaderService.display(false);
        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 10000);
          //alert(this.errorMessage['_body']);
        }
    );
  }

  confirmAndDeleteSection(id:Number){
    if (confirm("Are you sure you want to delete this section?") == true) {
      this.loaderService.display(true);
      this.catalogueService.deleteCatalogue(id)
      .subscribe(
        res=>{
          this.getCatalogueListFromService();
          this.successalert = true;
          this.loaderService.display(false);
          this.successMessage = 'Deleted successfully!';
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 10000);
        },
        error=>{
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 10000);
        }
      );
    }
  }

  onSubmit(data) {
    this.submitted = true;
    $('#createSectionModal').modal('hide');
    this.loaderService.display(true);
    let arr = this.basefile
    data.section.forEach(function (value, i) {
      value.attachment_file = arr[i];
    });
    this.catalogueService.createCatalogue(data)
    .subscribe(
        catalogue => {
          this.successalert = true;
          this.getCatalogueListFromService();
          this.loaderService.display(false);
          this.successMessage = 'Section created successfully!';
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 10000);
          return catalogue;
        },
        error => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 10000);
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

  editSectionDetails(params){
    $('#editSubSectionModal').modal('hide');
    params['attachment_file'] = this.basefile;
    this.loaderService.display(true);
    this.catalogueService.editCatalogue(params)
      .subscribe(
        res => {
          this.getCatalogueListFromService();
          this.basefile = undefined;
          this.successalert = true;
          this.successMessage = 'Section updated successfully!';
          this.loaderService.display(false);
           setTimeout(function() {
              this.successalert = false;
          }.bind(this), 10000);
        },
        err => {
          this.erroralert = true;
          this.errorMessage = err;
          this.loaderService.display(false);
           setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 10000);
          return Observable.throw(err);
        }
      );
  }

  onEditSectionFormChange(event){
    var output = document.getElementById('output');
    this.attachment_file = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile = base64.result
    };
    fileReader.readAsDataURL(this.attachment_file);
    document.getElementById('output').setAttribute('src',URL.createObjectURL(event.target.files[0]));
  }

  setValueForm(id,name,desc,imgsrc){
    this.editCatalogueForm.controls['id'].setValue(id);
    this.editCatalogueForm.controls['name'].setValue(name);
    this.editCatalogueForm.controls['description'].setValue(desc);
     if(imgsrc != '/images/original/missing.png')
      document.getElementById('output').setAttribute('src',imgsrc);
    else {
      document.getElementById('output').setAttribute('src','');
    }
  }

}
