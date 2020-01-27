import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '../../../../../../node_modules/@angular/forms';
declare var $: any;


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [CategoryService]
})
export class InventoryComponent implements OnInit {


	update_Sli_Form: FormGroup;
	sublineItemForm: FormGroup;
	milestoneForm: FormGroup;
	successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  @Input() line_item_po: any;
  project_id: any;
  line_item_in_po: any;

  constructor(
  	private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

  	this.getWipTableData(1);
    this.getCities();
  }
  city_list;
  //To get the city List
  getCities(){
    this.loaderService.display(true);
    this.categoryService.getCityListForInventory().subscribe(
      res=>{
        this.city_list = res.locations;

      },
      err=>{
        

      });
  }


  //To get table data
  wipData:any;
  wipData_data:any;
  page_number;
  per_page;
  total_page;
  current_page;
  headers_res;
  getWipTableData(page){
  	this.page_number = page;
    this.loaderService.display(true);
    this.categoryService.getInventoryTable(this.page_number,this.selected_city).subscribe(
      res=>{

      	this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.wipData = res;
      	
      	
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
        
    });
  }

  //for tooltip popover
  openpopup(event,id){
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });

    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    })
  }
  inventories_id;
  setInventoriesId(id){
    this.inventories_id = id;

  }
  data;
  submitMinimumTATQty(value){
    if(value == 'minimum'){
     var obj ={
       'min_stock':$('#minimum_qty').val()
     }
     this.data = obj;
    }
    else{
      var obj1 ={
       'tat':$('#tat_qty').val()
      }
      this.data = obj1;

    }
    this.loaderService.display(true);
    this.categoryService.modifyQtyForInventory(this.inventories_id,this.data).subscribe(
      res=>{
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Inventory Updated successfully";
        $("#editTatModal").modal('hide');
        $("#editQuantityModal").modal('hide');
        $('#minimum_qty').val('');
        $('#tat_qty').val('');
        this.getWipTableData(1);
        setTimeout(function() {
            this.successalert = false;
        }.bind(this), 2000);
      },
      error=>{
        
        this.erroralert = true;
        this.loaderService.display(false);
        this.errorMessage = (JSON.parse(error['_body']).message); 
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 2000);
      }
    );
  }
  resetForm(){
    $('#minimum_qty').val('');
    $('#tat_qty').val('');

  }
  selected_city;
  selectCity(city){
    this.selected_city = city
    this.getWipTableData(1);

  }
  retuenAddress(str){
    return str.substr(0, str.indexOf(',')); 

  }
}
