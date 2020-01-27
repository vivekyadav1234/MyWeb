import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-master-line-item',
  templateUrl: './master-line-item.component.html',
  styleUrls: ['./master-line-item.component.css'],
  providers: [CategoryService]
})
export class MasterLineItemComponent implements OnInit {
  master_line_item: any;
  dynamic_fields: any[];
  selected_vendor_product: any;
  mli_type;
  headers_res;
  per_page;
  total_page;
  current_page;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  mli_list: any;
  constructor(private loaderService : LoaderService,
    private categoryService:CategoryService,) { }

  ngOnInit() {
    this.getMasterLineItems(1);
    this.mli_type = "";
  }

  getMasterLineItems(page?){
    this.loaderService.display(true);
    this.categoryService.getMasterLineItems(this.mli_type,page).subscribe(
        res=>{
          this.headers_res= res.headers._headers;
            this.per_page = this.headers_res.get('x-per-page');
            this.total_page = this.headers_res.get('x-total');
            this.current_page = this.headers_res.get('x-page');
            res= res.json();
            this.mli_list = res.master_line_items;
            this.loaderService.display(false);
        },
        error=>{
          this.loaderService.display(true);
        }
    );
}

getMasterLineItemDetails(id){
  this.master_line_item = [];
  this.dynamic_fields = [];
  this.loaderService.display(true);
  this.categoryService.getMasterLineItemDetails(id).subscribe(
      res=>{
          
          this.master_line_item = res.master_line_item;
          
          this.loaderService.display(false);
      },
      error=>{
          
          this.loaderService.display(false);}
  );
  
}
}
