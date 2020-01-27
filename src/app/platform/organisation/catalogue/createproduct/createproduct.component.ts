import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Rx';
import {Angular2TokenService } from 'angular2-token';
import { Catalogue } from '../catalogue';
import { CatalogueService } from '../catalogue.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { LoaderService } from '../../../../services/loader.service';
import { Router, Routes, RouterModule , ActivatedRoute} from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css'],
  providers: [CatalogueService, ProductService]
})
export class CreateproductComponent implements OnInit {

  //createProductForm: FormGroup;
  id: Number;
  secId:Number;
  role : string;
  attachment_file_excel: any;
  attachment_name: string;
  basefileExcel: any;
  products : any[];
  services : any[];
  subsectionDetails : any;
  erroralert = false;
  successalert = false;
  successMessage : string;
  editAndDeleteProductAccess = ['admin','catalogue_head'];

  constructor(
    private formBuilder: FormBuilder,
    private productService :ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private catalogueService: CatalogueService,
    private loaderService: LoaderService
  ) { }

  submitted = false;
  errorMessage: string;

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.secId = +params['secid'];
    });
    this.catalogueService.viewCatalogue(this.id).subscribe(
      res => {
        Object.keys(res).map((key)=>{ res= res[key];});
        this.subsectionDetails = res;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
    this.viewCatalogueProducts();
    this.viewCatalogueServices();
    
    // this.createProductForm = this.formBuilder.group({
    //   product: this.formBuilder.array( [this.buildItem('')])
    // })
  }

  ngAfterViewInit() {
    this.loaderService.display(true);
    this.product();
  }

  onExcelUploadChange(event) {
    document.getElementById('extErrorMsg').classList.add('d-none');
    this.basefileExcel = undefined;
    this.attachment_file_excel = event.srcElement.files[0];
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(this.attachment_file_excel.name)[1];
    var fileReader = new FileReader();
    var base64;
    if(ext == 'xlsx' || ext == 'xls') {
      fileReader.onload = (fileLoadedEvent) => {
       base64 = fileLoadedEvent.target;
       this.basefileExcel = base64.result;
      };
    }
    else {
      document.getElementById('extErrorMsg').classList.remove('d-none');
    }
    fileReader.readAsDataURL(this.attachment_file_excel);
  }

  onExcelUploadSubmit(data) {
    $('#productDetails').modal('hide');
    this.loaderService.display(true);
    this.catalogueService.uploadCatalogueExcel(this.id,this.basefileExcel)
    .subscribe(
        product => {
          this.basefileExcel = undefined;
          this.viewCatalogueProducts();
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'Uploaded successfully! '+product['new_products'].length +' new rows added and '+product['updated_products'].length +' rows updated!';
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 15000);
        },
        error => {
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          this.erroralert = true;
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 15000);
        }
    );
  }

  viewCatalogueProducts() {
    this.catalogueService.getProductList(this.id)
      .subscribe(
        res => {
          Object.keys(res).map((key)=>{ res= res[key];});
          this.products = res;
        },
        err => {
          
        }
      );
  }

  confirmAndDeleteSection(id:Number){
    if (confirm("Are you sure you want to delete this product?") == true) {
      this.loaderService.display(true);
      this.catalogueService.deleteProduct(id,this.id)
      .subscribe(
        res=>{
          this.viewCatalogueProducts();
          this.successalert = true;
          this.loaderService.display(false);
          this.successMessage = 'Deleted successfully!';
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 15000);
        },
        error=>{
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 15000);
        }
      );
    }
  }

  confirmAndDeleteService(id:Number){
    if (confirm("Are you sure you want to delete this service?") == true) {
      this.loaderService.display(true);
      this.catalogueService.deleteService(id,this.id)
      .subscribe(
        res=>{
          this.viewCatalogueProducts();
          this.successalert = true;
          this.loaderService.display(false);
          this.successMessage = 'Deleted successfully!';
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 15000);
        },
        error=>{
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 15000);
        }
      );
    }
  }

  onServiceExcelUploadSubmit(data){
    $('#serviceDetails').modal('hide');
    this.loaderService.display(true);
    this.catalogueService.uploadServiceExcel(this.id,this.basefileExcel)
    .subscribe(
        service => {
          this.basefileExcel = undefined;
          this.viewCatalogueServices();
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'Uploaded successfully! ';
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 15000);
        },
        error => {
          this.errorMessage = JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          this.erroralert = true;
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 15000);
        }
    );
  }

  viewCatalogueServices() {
    this.catalogueService.getServices(this.id)
      .subscribe(
        res => {
          Object.keys(res).map((key)=>{ res= res[key];});
          this.services = res;
        },
        err => {
          
        }
      );
  }

  product(){
    $('#porductMsgCard').show();
    $('#serviceMsgCard').hide();
     if($(".addClass").hasClass("hideClass"))
     {
       $(".addClass").removeClass("hideClass");
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
     }
    else
     {
       $(".addClass1").addClass("hideClass");
       $(".upload1").removeClass("actBtn");
       $(".upload0").addClass("actBtn");
     }
  }

  servicesBtn(){
    $('#porductMsgCard').hide();
    $('#serviceMsgCard').show();
    if($(".addClass1").hasClass("hideClass"))
     {
       $(".addClass1").removeClass("hideClass");
       $(".addClass").addClass("hideClass");
       $(".upload0").removeClass("actBtn");
       $(".upload1").addClass("actBtn");
     }
    else
     {
       $(".addClass").addClass("hideClass");
       $(".upload0").removeClass("actBtn");
       $(".upload1").addClass("actBtn");
     }
  }

}
