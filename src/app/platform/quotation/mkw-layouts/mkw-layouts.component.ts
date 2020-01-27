import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuotationService } from '../quotation.service';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-mkw-layouts',
  templateUrl: './mkw-layouts.component.html',
  styleUrls: ['./mkw-layouts.component.css'],
  providers:[QuotationService]
})
export class MkwLayoutsComponent implements OnInit {

	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  selectedTab='kitchen';

  constructor(
  	private loaderService:LoaderService,
  	private quotationService:QuotationService
  ) { }

  ngOnInit() {
  	this.getLayoutsList(this.selectedTab,1);
  }

  headers_res;
  per_page;
  total_page;
  current_page;
  layouts_list;

  getLayoutsList(category,page?){
  	this.loaderService.display(true);
  	this.quotationService.getMkwLayouts(category,page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.layouts_list = res.mkw_layouts;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  its_shangpin:boolean;
  changeSelectedTab(category){
  	this.selectedTab = category;
    if (this.selectedTab == 'shangpin') {
      this.getCFlayoutList();
      this.its_shangpin = true;
    }
    else{
      this.getLayoutsList(this.selectedTab,1);
      this.its_shangpin = false;
    }
  }

  layoutDetail;
  cflayoutDetail
  getMkwLayoutDetail(id){
  	this.loaderService.display(true);
    if (this.selectedTab == 'shangpin') {
      this.loaderService.display(true);
      this.quotationService.getDetailsOfCFLayouts(id).subscribe(
        res => {
          this.cflayoutDetail=res.json().shangpin_layout;
          this.loaderService.display(false);
        },
        err => {
        this.loaderService.display(false);
      });
    }
    else{
      this.quotationService.getDetailsOfMkwLayouts(id).subscribe(
        res => {
        this.layoutDetail=res.json().mkw_layout;
        this.loaderService.display(false);
        },
        err => {
        this.loaderService.display(false);
      });
    }
  }

  customizationDetails;
  getCustomizationOfMKWlayout(id,layout_id){
  	this.loaderService.display(true);
  	this.quotationService.getCustomizationOfMKWlayout(id,layout_id).subscribe(
      res => {
        this.customizationDetails=res.modular_job;
        this.loaderService.display(false);
        $('#customizationModal').modal('show');
      },
      err => {
        this.loaderService.display(false);
      });
  }
  deleteMkwLayout(id){
  	if(confirm('Are you sure you want to delete this layout?')==true){
      this.loaderService.display(true);
      if (this.selectedTab == 'shangpin') {
        this.quotationService.deleteCFLayout(id).subscribe(
          res => {
            this.loaderService.display(false);
            this.successalert = true;
            this.successMessage ='Layout deleted successfully!';
            this.getCFlayoutList();
            setTimeout(function() {
             this.successalert = false;
            }.bind(this), 10000);
          },
          err => {
            this.loaderService.display(false);
            this.erroralert = true;
            this.errorMessage =JSON.parse(err['_body']).message;
            setTimeout(function() {
             this.successalert = false;
            }.bind(this), 10000);
        });
      }
      else{
        this.quotationService.deleteMkwLayout(id).subscribe(
        res => {
          this.loaderService.display(false);
          this.getLayoutsList(this.selectedTab,1);
          this.successalert = true;
          this.successMessage ='Layout deleted successfully!';
          setTimeout(function() {
             this.successalert = false;
          }.bind(this), 10000);
        },
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage =JSON.parse(err['_body']).message;
          setTimeout(function() {
             this.successalert = false;
          }.bind(this), 10000);
        });
      }
	  }
  }

  showAccordion(index){
    var str='#accordion_'+index;
    var str3=".combmoduleAccordionRow"+index;
    $(str).on('shown.bs.collapse', function () {
      $(str3).removeClass('d-none');
    });
    $(str).on('hidden.bs.collapse', function () {
      $(str3).addClass('d-none');
    });
  }

  //To get Coustom Furniture Layout List
  getCFlayoutList(){
    this.loaderService.display(true);
    this.quotationService.getCFlayoutList().subscribe(
      res => {
        this.layouts_list = res.shangpin_layouts;
        $('#CFlayoutlistmodal').modal('show');
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
    });
  }

}
