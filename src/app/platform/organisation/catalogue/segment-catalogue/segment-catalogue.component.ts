import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CatalogueService } from '../catalogue.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-segment-catalogue',
  templateUrl: './segment-catalogue.component.html',
  styleUrls: ['./segment-catalogue.component.css'],
  providers: [CatalogueService]
})
export class SegmentCatalogueComponent implements OnInit {

	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;

  constructor(
  	private route: ActivatedRoute,
    private router: Router,
  	public catalogueService: CatalogueService,
    private loaderService: LoaderService
  ) { }

  catalogue_type:any;
  catalogue_id:any;
  segment_search_name:any = ""
  segment_search_id:any = ""
  category_search_name:any = ""
  ngOnInit() {
  	this.route.paramMap.subscribe(params => {
	    this.catalogue_type = params.get("catalogue_type");
	    this.catalogue_id = params.get("id");
	    // this.getMegamenu();
    	// this.fetchSliderValues();
	    this.filterNewProducts();
	  })

    this.route.queryParams.subscribe(params => {
      this.segment_search_name = params['segment'];
      this.segment_search_id = params['segment_id'];
      this.category_search_name = params['category'];
    });
  }

  catalog_segments:any = [];
  marketplace:any = [];
  marketplace_submenu_categories:any = {};
  getMegamenu(){
    this.loaderService.display(true);
    this.catalogueService.getMegamenu().subscribe(
      res => {
        
        this.catalog_segments = res.catalog_segments
        this.marketplace = res.marketplace
        // trial
        this.marketplace_submenu_categories = this.marketplace[0].categories
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  getMarketplacecategories(item){
    this.marketplace_submenu_categories = item.categories
  }

  slider_value:any;
  all_materials:any;
  all_colors:any;
  all_finishes:any;
  all_minimum_price:any;
  all_maximum_price:any;
  all_minimum_height:any;
  all_maximum_height:any;
  all_minimum_lead_time:any;
  all_maximum_lead_time:any;
  all_minimum_length:any;
  all_maximum_length:any;
  all_minimum_width:any;
  all_maximum_width:any;
  filter_classes:any = [];
  fetchSliderValues(){
    this.loaderService.display(true);
    this.catalogueService.fetchSliderValuesNew().subscribe(
      res => {
        
        // this.products_array = res.products
        this.all_minimum_price = res.minimum_price
        this.all_maximum_price = res.maximum_price
        this.all_minimum_lead_time = res.minimum_lead_time
        this.all_maximum_lead_time = res.maximum_lead_time
        this.all_minimum_width = res.minimum_width
        this.all_maximum_width = res.maximum_width
        this.all_minimum_length = res.minimum_length
        this.all_maximum_length = res.maximum_length
        this.all_minimum_height = res.minimum_height
        this.all_maximum_height = res.maximum_height
        this.filter_classes = res.classes
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  products_array = [];
  headers_res;
  per_page;
  total_page;
  current_page;
  page_number;
  breadcrumb:any;
  filterNewProducts(page?){
    this.loaderService.display(true);
    this.catalogueService.segmentShow(this.catalogue_type,this.catalogue_id,page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        
        this.breadcrumb = res.breadcrumb;
        if(this.catalogue_type == 'segment'){
        	this.products_array = res.catalog_categories
        }
        else if(this.catalogue_type == 'category'){
        	
        	this.products_array = res.catalog_subcategories
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  newSearchFilter(search_text){
    this.router.navigate(['catalogue'], { queryParams: { product: search_text } });
  }

}
