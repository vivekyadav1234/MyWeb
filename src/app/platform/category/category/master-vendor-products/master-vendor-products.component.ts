import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService} from '../category.service';
import { FormBase } from '../../../../shared/dynamic-form/form-base';
import { DynamicFormService } from '../../../../shared/dynamic-form/dynamic-form.service';
declare var $:any;

@Component({
  selector: 'app-master-vendor-products',
  templateUrl: './master-vendor-products.component.html',
  styleUrls: ['./master-vendor-products.component.css'],
  providers: [CategoryService,DynamicFormService]
})
export class MasterVendorProductsComponent implements OnInit {
	headers_res;
  per_page;
  total_page;
  current_page;
  staticFields;
  addVendorProductForm:FormGroup;
  payLoad = '';
  formType: any;
  mli_list: any;
  master_line_item:any;
  unit_of_measurement: string[];
  statobj: { "sli_code": string; "sli_name": string; "vendor_code": string; "unit": string; "rate": number; "vendor_id": number; "master_line_item_id": number; };
  dynamic_fields: any;
  selected_vendor_product: any;
  mli_id;
  mli_type: any;
  selected_vendor: any;
  @Input() fields: FormBase<any>[] = [];
	@Input() vendor_id:any = [];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  showvalidationMsg : boolean;
  showvalidEmaliMsg : boolean;
  showvalidMobileNo : boolean;
  sub: any;
  id: number;
  vendor_products_list: any;
  mli_type_list: any;

  constructor(
  	private router: Router,
    private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder,
    private location: Location,private route: ActivatedRoute,
    private dynamicFormService: DynamicFormService,private _location: Location,
  ) { }

  ngOnInit() {
  	this.getVendorProducts(1);
  	this.getProcurementList();
     this.unit_of_measurement = ["s_ft", "r_ft", "r_mt", "nos", "set"];
     this.staticFields = [{
        "attr_name": "sli_code",
        "attr_type": "text_field",
        "attr_data_type": "string",
        "attr_value":"string",
        "required":true
    },{
        "attr_name": "sli_name",
        "attr_type": "text_field",
        "attr_data_type": "string",
        "attr_value":"string",
        "required":true
    },
    {
        "attr_name": "vendor_code",
        "attr_type": "text_field",
        "attr_data_type": "string",
        "attr_value":"string"
    },
    {
        "attr_name": "rate",
        "attr_type": "text_field",
        "attr_data_type": "integer",
        "attr_value":"string",
        "required":true
    },
    {
        "attr_name": "vendor_id",
        "attr_type": "",
        "attr_data_type": "string",
        "attr_value":"string"
    },
    {
        "attr_name": "master_line_item_id",
        "attr_type": "",
        "attr_data_type": "string",
        "attr_value":"string"
    },{
        "attr_name": "unit",
        "attr_type": "dropdown",
        "attr_data_type": "reference",
        "dropdown_options": [{"name": "s_ft", "value": "s_ft"},
                            {"name": "r_ft", "value": "r_ft"},
                            {"name": "r_mt", "value": "r_mt"},
                            {"name": "nos", "value": "nos"},
                            {"name": "set", "value": "set"}],
        "required":true

    },{
        "attr_name": "sli_group_code",
        "attr_type": "text_field",
        "attr_data_type": "string",
        "attr_value":"string",
        "required":true
    }];
  }

  master_line_item_id:any = "";
  vendor_search_id:any = "";
  search:any = "";
  selectMliTypeId(event){
    this.master_line_item_id = event;
  }
  selectVendorTypeId(event){
    this.vendor_search_id = event;
  }
  getVendorProducts(page?){
    this.loaderService.display(true);
    this.categoryService.getMasterVendorProducts(page, this.master_line_item_id, this.vendor_search_id, this.search).subscribe(
    	res=>{
	      this.headers_res= res.headers._headers;
	      this.per_page = this.headers_res.get('x-per-page');
	      this.total_page = this.headers_res.get('x-total');
	      this.current_page = this.headers_res.get('x-page');
	      res= res.json();
	      this.vendor_products_list = res.vendor_products;
	      
	      this.loaderService.display(false);
	    },
      error=>{
        
        this.loaderService.display(false);}
  	);
  }

  getAddVendorProductFormDetails(obj?){
    this.master_line_item = [];
    this.dynamic_fields = [];
    this.fields = [];
    this.loaderService.display(true);
    if(obj){
        this.mli_id = this.selected_vendor_product.master_line_item_id;
    }
    this.categoryService.getMasterLineItemDetails(this.mli_id).subscribe(
        res=>{
            
            this.master_line_item = res.master_line_item;
            this.dynamic_fields=this.master_line_item.dynamic_attributes;
            this.fields=[];
            this.staticFields.forEach(elem =>{
                this.fields.push(elem);
            });
            res.master_line_item.dynamic_attributes.forEach(elem =>{
                this.fields.push(elem);
            });
            this.addVendorProductForm = this.dynamicFormService.toFormGroup(this.fields);
            if(obj){
                Object.keys( this.addVendorProductForm.controls).forEach(key => {
                  this.staticFields.forEach(elem=>{
                      if(key === elem.attr_name){
                        this.addVendorProductForm.controls[key].patchValue(this.selected_vendor_product[key]);
                      }
                  });
               });
               Object.keys( this.addVendorProductForm.controls).forEach(key => {
                  this.dynamic_fields.forEach(elem=>{
                      if((key === elem.attr_name)){
                          this.selected_vendor_product.dynamic_attributes.forEach(product =>{
                              if(product.mli_attribute_name ===key){
                                  this.addVendorProductForm.controls[key].patchValue(product.attr_value);
                              }
                            });}
                  });
               });
            }
            
            this.loaderService.display(false);
        },
        error=>{
            
            this.loaderService.display(false);}
    );
    
  }
  openVendorProductForm(formType,product?){
    this.loaderService.display(true);
    this.formType = formType;
    if(formType==='addVendorProductForm'){
        // this.getAddVendorProductFormDetails();
        this.loaderService.display(false);
    }
    if(formType ==='updateVendorProductForm'){
        this.getDetailsOfVendorProduct(product.id,product);
    }
  }

  getProcurementList(){
      this.mli_type_list =  [
    	{
        	"name": "Indoline",
        	"value": "indoline"
    	},
    	{
        	"name": "Lakhs modular",
        	"value": "lakhs_modular"
    	},
      {
          "name": "Loose Furniture",
          "value": "loose_furniture"
      }
    ];
    this.mli_type = this.mli_type_list[0].value;
    this.getMasterLineItems();
    this.getAllVendors();
    this.getAddVendorProductFormDetails();
        // this.loaderService.display(true);
        // this.categoryService.getProcurementList().subscribe(
        //     res=>{
        //         
        //         this.mli_type_list = res.procurement_types;
        //         this.mli_type = this.mli_type_list[1].value;
        //         this.loaderService.display(false);
        //     },
        //     error=>{
        //       this.loaderService.display(true);
        //     }
        // );
    }

  vendors_list = [];
  selected_vendor_name;
  getAllVendors(){
  	this.loaderService.display(true);
  	this.categoryService.getAllVendors().subscribe(
  	    res=>{
  	        
  	        this.vendors_list = res.vendors
  	        this.selected_vendor = this.vendors_list[0].id
            this.selected_vendor_name = this.vendors_list[0].name
  	        
  	        this.loaderService.display(false);
  	    },
  	    error=>{
  	      this.loaderService.display(true);
  	    }
  	);
  }
  setVendorId(event){
    this.selected_vendor = event;

  }


  search_mli_list = [];
  mli_type_id;
  getMasterLineItems(event?){
      this.mli_type_id = event;
      this.loaderService.display(true);
      this.categoryService.getAllMasterLineItems(this.mli_type_id).subscribe(
          res=>{
              
              this.mli_list = res;
              this.search_mli_list = res;
              // this.mli_id = this.mli_list[0].id;
              this.loaderService.display(false);
          },
          error=>{
            this.loaderService.display(true);
          }
      );
  }

  getDetailsOfVendorProduct(product_id,product?){
    this.loaderService.display(true);
    this.categoryService.getDetailsOfVendorProduct(product_id).subscribe(
        res=>{
            
            this.selected_vendor_product = res.vendor_product;
            if(product){
                this.getAddVendorProductFormDetails(product);
            }
            this.loaderService.display(false);
        },
        error=>{
            
            this.loaderService.display(false);}
    );
  }

  closeVendorProductModal(){
      this.formType = '';
      this.fields = undefined;
      this.mli_list = undefined;
      this.addVendorProductForm.reset();
    $('#addVendorProductModal').modal('hide');
    this.mli_type="";
    this.mli_id = undefined;
  }

  static_attributes={};
  dynamic_attributes=[];
  save() {
      this.loaderService.display(true);
      this.addVendorProductForm.controls["master_line_item_id"].patchValue(this.mli_id);
      this.addVendorProductForm.controls["vendor_id"].patchValue(this.selected_vendor);
      Object.keys( this.addVendorProductForm.controls).forEach(key => {
          
          let alpha = key;
          if(this.formType === 'updateVendorProductForm'){
            this.staticFields.forEach(elem=>{
                if(alpha === elem.attr_name && alpha != 'vendor_id' && alpha != 'master_line_item_id'){
                    this.static_attributes[alpha] = this.addVendorProductForm.controls[alpha].value;
                }
            });
          }else {
            this.staticFields.forEach(elem=>{
            if(alpha === elem.attr_name){
                this.static_attributes[alpha] = this.addVendorProductForm.controls[alpha].value;
            }
            if(alpha === elem.attr_name && elem.attr_data_type ==='integer'){
                this.static_attributes[alpha] = +this.addVendorProductForm.controls[alpha].value;
            }
        });
          }
        
     });
     Object.keys( this.addVendorProductForm.controls).forEach(key => {
        this.dynamic_fields.forEach(elem=>{
            if((key === elem.attr_name)){
                var obj = {}
                obj['mli_attribute_id'] = elem.id,
                obj['attr_value'] = this.addVendorProductForm.controls[key].value
                this.dynamic_attributes.push(obj);
            }
        });
     });
     if(this.formType === 'updateVendorProductForm'){
      this.categoryService.updateVendorProduct(this.static_attributes,this.dynamic_attributes,this.selected_vendor_product.id).subscribe(
          res=>{
            
            this.successMessageShow("Vendor Product updated successfully!");
            this.getVendorProducts(this.current_page);
            this.static_attributes = {};
            this.dynamic_attributes = [];
            this.loaderService.display(false);
          },
          error =>{
              
              this.errorMessageShow(JSON.parse(error._body).message[0]);
        this.loaderService.display(false);
          }
      );}else {
        this.categoryService.createVendorProduct(this.static_attributes,this.dynamic_attributes).subscribe(
            res=>{
              
              this.successMessageShow("Vendor Product created successfully!");
              this.getVendorProducts(this.current_page);
              this.static_attributes = {};
              this.dynamic_attributes = [];
              this.loaderService.display(false);
            },
            error =>{
                
                this.errorMessageShow(JSON.parse(error._body).message[0]);
          this.loaderService.display(false);
            }
        );
      }

    
    this.closeVendorProductModal();
  }

  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 2000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 2000);
  }

  deleteVendorProduct(product_id){
    if(confirm("Are you sure you want to delete this product?")){
      this.loaderService.display(true);
      this.categoryService.deleteVendorProduct(product_id)
      .subscribe(
        res=>{
          this.successMessageShow('Vendor product deleted successfully!');
          this.getVendorProducts(this.current_page);
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  validateForm(){
    Object.keys( this.addVendorProductForm.controls).forEach(key => {
        this.staticFields.forEach(elem=>{
            if(key === elem.attr_name){
              if(this.addVendorProductForm.controls[key].value === '' && elem.required){
                  this.errorMessageShow(key +' is required');
              }
            }
        });
     });
  }

  backClicked() {
    this._location.back();
  }

}
