import { Component, OnInit } from '@angular/core';
import { Router, Routes, RouterModule , ActivatedRoute} from '@angular/router';
import { CatalogueService } from '../catalogue.service';
import { ProductService } from '../product.service';
import { UserDetailsService } from '../../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Catalogue } from '../catalogue';
import { Product } from '../product';
declare var Layout:any;
declare var $:any;

@Component({
  selector: 'app-listsection',
  templateUrl: './listsection.component.html',
  styleUrls: ['./listsection.component.css'],
  providers: [CatalogueService,ProductService, UserDetailsService]
})
export class ListsectionComponent implements OnInit {

  observableCatalogues: Observable<Catalogue[]>
  catalogues: Catalogue[];
  observableProducts: Observable<Product[]>
  products: Product[];
  errorMessage: string;
  id: Number;

  constructor(
    private userDetailsService:UserDetailsService,
    private router: Router,
    private catalogueService:CatalogueService,
    private productService:ProductService,
    private route: ActivatedRoute,
  ) { }

  ngOnChanges(): void {
    this.getCatalogueListFromService(); 
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
            this.id = +params['id'];
    });
    this.getCatalogueListFromService();
  }
  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  private getCatalogueListFromService(){
    this.observableCatalogues = this.catalogueService.getCatalogueServiceList(this.id);
    this.observableProducts = this.productService.getProductServiceList(this.id);

    this.observableCatalogues.subscribe(
        catalogues => {
          this.catalogues = catalogues;
          Object.keys(catalogues).map((key)=>{ this.catalogues= catalogues[key];});

        },
        error =>  {
          this.errorMessage = <any>error;
          Layout.notify('danger',JSON.parse(this.errorMessage['_body']).message);
          //alert(this.errorMessage['_body']);
        }
    );

    this.observableProducts.subscribe(
        products => {
          this.products = products;
          Object.keys(products).map((key)=>{ this.products= products[key];});

        },
        error =>  {
          this.errorMessage = <any>error;
          Layout.notify('danger',JSON.parse(this.errorMessage['_body']).message);
          //alert(this.errorMessage['_body']);
        }
    );
  }

}
