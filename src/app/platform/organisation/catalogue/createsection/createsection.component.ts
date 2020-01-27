import { Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Rx';
import { LoaderService } from '../../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
import { Catalogue } from '../catalogue';
import { CatalogueService } from '../catalogue.service';
import { Router, Routes, RouterModule , ActivatedRoute} from '@angular/router';
declare var Layout: any;
declare var $:any;

@Component({
  selector: 'app-createsection',
  templateUrl: './createsection.component.html',
  styleUrls: ['./createsection.component.css'],
  providers: [CatalogueService],
})
export class CreatesectionComponent implements OnInit {

  createCatalogueForm: FormGroup;
  editCatalogueForm: FormGroup;
  id: Number;
  attachment_file: any;
  attachment_name: string;
  basefile = {};
  role : string;
  section : any;
  erroralert = false;
  successalert = false;
  successMessage : string;
  editSectionData:any;
  editAndDeleteSectionAccess = ['admin','catalogue_head'];

  constructor(
      private formBuilder: FormBuilder,
      private catalogueService :CatalogueService,
      private router: Router,
      private route: ActivatedRoute,
      private loaderService: LoaderService
    ) { }

  submitted = false;
  errorMessage: string;

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.route.params.subscribe(params => {
            this.id = +params['id'];
    });
    this.getSectionDetails();
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

  ngAfterViewInit(){
     $('[data-toggle="tooltip"]').tooltip();
     this.loaderService.display(true);
  }

  openModal(){
    $('#createSubSectionModal').modal('show');
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
    $('#createSubSectionModal').modal('hide');
    this.loaderService.display(true);
    let arr = this.basefile
    data.section.forEach(function (value, i) {
      value.attachment_file = arr[i];
    });
    this.catalogueService.createCatalogueSection(this.id, data)
    .subscribe(
        res => {
          this.getSectionDetails();
          this.successalert = true;
          this.successMessage = 'Subsection created successfully!';
          this.loaderService.display(false);
           setTimeout(function() {
              this.successalert = false;
          }.bind(this), 10000);
          return res;
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

  getSectionDetails() {
    this.catalogueService.viewCatalogue(this.id)
    .subscribe(
      res => {
        Object.keys(res).map((key)=>{ this.section= res[key];});
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  editSectionDetails(params){
    $('#editSubSectionModal').modal('hide');
    params['attachment_file'] = this.basefile;
    this.loaderService.display(true);
    this.catalogueService.editCatalogue(params)
      .subscribe(
        res => {
          this.getSectionDetails();
          this.basefile = undefined;
          this.successalert = true;
          this.successMessage = 'Subsection updated successfully!';
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

  viewCatalogueSectionDetails() {
    this.catalogueService.viewCatalogue(this.id)
      .subscribe(
        res => {
          Object.keys(res).map((key)=>{ res= res[key];});
          this.editSectionData = res['product_list'];
        },
        err => {
          
        }
      );
  }

  confirmAndDeleteSection(id:Number){
    if (confirm("Are you sure you want to delete this subsection?") == true) {
      this.loaderService.display(true);
      this.catalogueService.deleteCatalogue(id)
      .subscribe(
        res=>{
          this.getSectionDetails();
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
  loose_furniture;
  file_name;
  file_size;
  uploadFile(event) {
     
    $(".wait-load").css("display", "none");
    $(".fa-cloud-upload").css("display", "block");
    $(".fa-check-circle").css("display", "none");
    this.loose_furniture = event.target.files[0] || event.srcElement.files[0];
    this.file_name = this.loose_furniture.name;
    this.file_size = (this.loose_furniture.size)/1024;
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
    };
    fileReader.readAsDataURL(this.loose_furniture);
    $(".file-col").css("display", "flex")
    document.getElementById("fileName").innerHTML = this.file_name;
    document.getElementById("fileSize").innerHTML = this.file_size.toFixed(2)+ " KB";
  }
  error_list;
  submit(){
    $(".fa-cloud-upload").css("display", "none");
    $(".wait-load").css("display", "block");
    this.catalogueService.uploadExcel(this.basefile).subscribe(
      res => {
        
        $(".wait-load").css("display", "none");
        $(".fa-check-circle").css("display", "block");
        $(".card-view").css("display", "block");
        this.error_list = res;
        
      },
      err => {
        
        $(".wait-load").css("display", "none");
        $(".fa-cloud-upload").css("display", "block");
        this.errorMessage = JSON.parse(err._body).status+" : "+JSON.parse(err._body).error;
        this.erroralert = true;
        // alert(JSON.parse(err._body).status+" : "+JSON.parse(err._body).error)
      });
  }
  hideForm(){
    $(".card-view").css("display", "none");

  }
  // mouseoverFunc(){
  //   $('[data-toggle="popover"]').popover();
  // }
}
