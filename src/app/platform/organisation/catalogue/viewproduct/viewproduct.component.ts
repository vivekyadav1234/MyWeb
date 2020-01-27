import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Catalogue } from '../catalogue';
import { CatalogueService } from '../catalogue.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { Routes, RouterModule , ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
declare var Layout:any;

@Component({
  selector: 'app-viewproduct',
  templateUrl: './viewproduct.component.html',
  styleUrls: ['./viewproduct.component.css'],
  providers: [CatalogueService, ProductService]

})
export class ViewproductComponent implements OnInit {

  observableProduct: Observable<Product[]>
  id: Number;
  secid: Number;
  subsecid: Number;
  catalogue: Catalogue[];
  product: Product[];
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
    private catalogueService :CatalogueService,
    private productService :ProductService,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.secid = +params['secid'];
            this.subsecid = +params['subsectionid'];
      });
      this.observableProduct = this.catalogueService.viewProduct(this.id,this.subsecid);
      this.observableProduct.subscribe(
        product => {
          this.product = product;
          
          Object.keys(product).map((key)=>{ this.product= product[key];});
          this.loaderService.display(false);
        },
        error => {
          
          this.erroralert = true;
          this.errorMessage = JSON.parse(error['_body']).message;
        //  Layout.notify('danger',JSON.parse(this.errorMessage['_body']).message);
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 10000);
        }
      );
  }

  ngAfterViewInit() {
    this.loaderService.display(true);
  }

}
