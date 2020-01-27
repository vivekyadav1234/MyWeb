import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;
@Component({
  selector: 'vendor-selection',
  templateUrl: './vendor-selection.component.html',
  styleUrls: ['./vendor-selection.component.css','../tasks/tasks.component.css'],
  providers: [CategoryService]
})
export class VendorSelectionComponent implements OnInit {

	headers_res;
  per_page;
  total_page;
  current_page;
  project_list;
  addVendorForm:FormGroup=new FormGroup({
    vendor_id: new FormControl("",Validators.required),
    description:new FormControl(""),
    cost:new FormControl(1,Validators.required),
    tax_percent:new FormControl(0,Validators.required),
    deliver_by_date:new FormControl(""),
    recommended:new FormControl(""),
    name:new FormControl(""),
    contact_person:new FormControl(""),
    contact_number:new FormControl(""),
    total_amt:new FormControl(""),
    vendor_form_type:new FormControl(""),
    tax_type:new FormControl("cgst_sgst", Validators.required),
    unit_of_measurement: new FormControl(""),
    quantity:new FormControl(1,Validators.required)
  });
  line_items_list: any;
  club_view_list: any;
  is_vendor_selected: boolean;
  now: any;
  formtype: any;
  other_items_list: any;
  selected_view_option;

  constructor(
  	private loaderService : LoaderService,
    private categoryService:CategoryService
  ) { }

  ngOnInit() {
    this.getBoqListForPreProductionTab(1);
    this.now = new Date();
  }

  getBoqListForPreProductionTab(page?, searchparam=""){
    this.loaderService.display(true);
  	this.categoryService.getBoqListForPreProductionTab(page,searchparam).subscribe(
  		res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.boq_list = res.quotations;
        this.boq_list.forEach(quotation => quotation['expanded'] = false);
        this.loaderService.display(false);
  		},
  		err=>{
         this.loaderService.display(false);
  		});
  }
  expandRow;
  expandIndex;

  toggleRow(row,index){

    this.expandIndex = index;
    this.expandRow = row;
    this.boq_list.forEach(boq => {
      if(row.id !== boq.id){
        boq['expanded'] = false;
      }else {
        row.expanded = !row.expanded;
      }
    });
  }

  boq_id_for_ven_collapse;
  quot_id_for_ven_collapse;
  openVendorCollapsible(obj){
    this.selectView = 'detailView';
    this.boq_id_for_ven_collapse=obj.id;
    this.getBoqDetailsForPreProductionVendorMapping(obj.id,obj.project_id);
    this.getVendorCities();
    this.getVendorCategories();
    this.listVendors();
  }

  boq_list=[];

  vendor_cities_arr;
  getVendorCities(){
    this.loaderService.display(true);
    this.categoryService.getCities().subscribe(
      res=>{
        this.vendor_cities_arr = res.cities;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  vendor_categories_arr;
  getVendorCategories(){
    
    this.loaderService.display(true);
    this.categoryService.getVendorCategories().subscribe(
      res=>{
        this.vendor_categories_arr = res.vendor_categories;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }


  searchstring_vendorFilter="";
  category_id_vendorFilter="";
  sub_category_id_vendorFilter="";
  serviceable_city_id_vendorFilter="";
  vendor_subcategories_arr;
  getVendorSubCategories(categoryID){
    this.loaderService.display(true);
    this.categoryService.getSubcategoryList(categoryID).subscribe(
      res=>{
        this.sub_category_id_vendorFilter="";
        this.vendor_subcategories_arr = res.vendor_categories;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }
  closeBoqCollapsible(){
    this.searchstring_vendorFilter="";
    this.category_id_vendorFilter="";
    this.sub_category_id_vendorFilter="";
    this.serviceable_city_id_vendorFilter="";
    this.vendor_subcategories_arr="";
    this.jobelem_details=undefined;
    this.selected_boq =undefined;
    this.selected_boq_sublineitem=undefined;
    this.quot_id_for_ven_collapse =undefined
    this.boq_id_for_ven_collapse = undefined;
    this.sublineitems_arr=[];
    this.otheritems_arr=[];
  }
  vendorlist=[];
  listVendors(){
    this.loaderService.display(true);
    this.categoryService.filteredVendors(this.searchstring_vendorFilter,this.category_id_vendorFilter,
      this.sub_category_id_vendorFilter,this.serviceable_city_id_vendorFilter).subscribe(
      res =>{
        this.vendorlist=res.vendors;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }
  listVendorsBySublineItem(id){
    this.categoryService.getVendorListForVendorSelection(id).subscribe(
      res =>{
        this.vendorlist=res.vendors;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }
  jobelem_details;
  getDetailsOfJobelement(jobelemid){
    this.loaderService.display(true);
    this.categoryService.getDeatils_of_job_elements_of_BOQlineitem(this.boq_id_for_ven_collapse
      ,this.quot_id_for_ven_collapse,jobelemid).subscribe(
      res=>{
        this.jobelem_details=res.job_element;
        this.loaderService.display(false);
      },
      err=>{
        
        this.errorMessageShow( <any>JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  selected_boq;
  selected_boq_sublineitem;
  sublineitems_arr=[];
  otheritems_arr=[];
  selectBoq(boqobj,elem?){
    this.selected_boq = boqobj;
    this.selected_boq_sublineitem = undefined;
    this.jobelem_details = undefined;
    var elems= document.getElementsByClassName('active-text');
    for(var i=0;i<elems.length;i++){
      elems[i].classList.remove('active-text');
    }
    if(elem){
      elem.classList.add('active-text');
    }
    this.quot_id_for_ven_collapse = boqobj.id;
    this.sublineitems_arr = boqobj.subline_items;
    this.otheritems_arr = boqobj.other_items;
  }

  selectBoqSublineItem(sublineitem){
    this.selected_boq_sublineitem = sublineitem;
  }

  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
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

  openVendorForm(formtype,data,subline?){
    this.formtype = formtype;
    if(subline){
      this.jobelem_details = subline;
    }
    this.is_vendor_selected = true;
    if(formtype=='addvendorform'){
      this.addVendorForm.controls['vendor_id'].setValue(data.id);
      this.addVendorForm.controls['name'].setValue(data.name);
      this.addVendorForm.controls['contact_person'].setValue(data.contact_person);
      this.addVendorForm.controls['contact_number'].setValue(data.contact_number);
      this.addVendorForm.controls['description'].setValue("");
      this.addVendorForm.controls['vendor_form_type'].setValue('addvendorform');
      // this.addVendorForm.controls['cost'].setValue(1);
      this.addVendorForm.controls['tax_percent'].setValue(0);
      this.addVendorForm.controls['recommended'].setValue(null);
      this.addVendorForm.controls['deliver_by_date'].setValue(null);
      this.addVendorForm.controls['quantity'].setValue((this.jobelem_details && this.jobelem_details.quantity) ? this.jobelem_details.quantity : 1);
      this.addVendorForm.controls['tax_type'].setValue("cgst_sgst");
      // this.addVendorForm.controls['unit_of_measurement'].setValue("");
    }
    if(formtype=='updatevendorform'){
      this.addVendorForm.controls['vendor_id'].setValue(data.vendor_id);
      this.addVendorForm.controls['description'].setValue(data.description);
      this.addVendorForm.controls['cost'].setValue(data.cost);
      this.addVendorForm.controls['tax_percent'].setValue(data.tax_percent);
      if(data.deliver_by_date){
        var mm = data.deliver_by_date.split("-")[1];
        var dd=((new Date(data.deliver_by_date).getDate())<10)?('0'+(new Date(data.deliver_by_date).getDate())):((new Date(data.deliver_by_date).getDate())+'');
        var yy=new Date(data.deliver_by_date).getFullYear();
        var datestr= yy+'-'+mm+'-'+dd;
        this.addVendorForm.controls['deliver_by_date'].setValue(datestr);
      }
      this.addVendorForm.controls['tax_type'].setValue(data.tax_type);
      this.addVendorForm.controls['quantity'].setValue(data.quantity);
      this.addVendorForm.controls['unit_of_measurement'].setValue(data.unit_of_measurement);
      this.addVendorForm.controls['recommended'].setValue(data.recommended);
      this.addVendorForm.controls['name'].setValue(data.vendor_name);
      this.addVendorForm.controls['contact_person'].setValue(data.vendor_contact_person);
      this.addVendorForm.controls['contact_number'].setValue(data.vendor_contact_number);
      this.addVendorForm.controls['vendor_form_type'].setValue('updatevendorform');
    }
    this.listVendors();
    // if(arg=='othercost'){
    //   document.getElementById('addVendorFormRow_othercost').classList.remove('d-none');
    // } else {
    //   document.getElementById('addVendorFormRow').classList.remove('d-none');
    // }

  }

  getAddVendorFormDetails(subline){
    this.is_vendor_selected = false;
    // this.listVendors();
    this.selected_boq_sublineitem = subline.id;
    this.listVendorsBySublineItem(subline.id);
    this.jobelem_details = subline;
    this.addVendorForm.controls['unit_of_measurement'].patchValue(this.jobelem_details.unit?this.jobelem_details.unit : '');
    this.addVendorForm.controls['cost'].patchValue(this.jobelem_details.rate);
    this.addVendorForm.controls['quantity'].patchValue(this.jobelem_details.quantity);
  }

  addVendor(formval,arg?){
    this.loaderService.display(true);
    // delete formval.job_element_id;
    var obj={
      'vendor_detail':formval
    }

    if(this.addVendorForm.controls['vendor_form_type'].value=='addvendorform'){
      this.categoryService.addvendorToLineitem(this.boq_id_for_ven_collapse,
        this.quot_id_for_ven_collapse,this.jobelem_details.id,obj)
      .subscribe(
        res=>{
          this.successMessageShow('vendor added successfully!');
          this.addVendorForm.reset();
          $('#addVendorModal').modal('hide');
          // if(arg=='othercost'){
          //   document.getElementById('addVendorFormRow_othercost').classList.add('d-none');
          // } else{
          //   document.getElementById('addVendorFormRow').classList.add('d-none');
          // }
          // this.getBoqDetailsForPreProductionVendorMapping(this.quot_id_for_ven_collapse,this.boq_id_for_ven_collapse);
          this.loaderService.display(false);
          this.getBoqDetailsForPreProductionVendorMapping(this.quot_id_for_ven_collapse,this.boq_id_for_ven_collapse);
          
        },
        err=>{
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    } else if(this.addVendorForm.controls['vendor_form_type'].value=='updatevendorform'){
      this.categoryService.updateVendorSelection(this.boq_id_for_ven_collapse,
        this.quot_id_for_ven_collapse,this.jobelem_details.id,obj)
      .subscribe(
        res=>{
          this.successMessageShow('vendor updated successfully!');
          this.addVendorForm.reset();
          $('#addVendorModal').modal('hide');
          // if(arg=='othercost'){
          //   document.getElementById('addVendorFormRow_othercost').classList.add('d-none');
          // } else{
          //   document.getElementById('addVendorFormRow').classList.add('d-none');
          // }
          // this.getBoqDetailsForPreProductionVendorMapping(this.quot_id_for_ven_collapse,this.boq_id_for_ven_collapse);
          this.loaderService.display(false);
          this.getBoqListForPreProductionTab(1);
        },
        err=>{
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }
  deleteVendor(vendor_id,subline){
    if(confirm("Are you sure you want to delete this vendor?")){
      this.loaderService.display(true);
      this.categoryService.deletevendorToLineitem(this.boq_id_for_ven_collapse,
        this.quot_id_for_ven_collapse,subline.id,vendor_id)
      .subscribe(
        res=>{
          this.successMessageShow('Vendor deleted successfully!');
          // this.getDetailsOfJobelement(this.jobelem_details.id);
          this.getBoqDetailsForPreProductionVendorMapping(this.quot_id_for_ven_collapse,this.boq_id_for_ven_collapse);
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  calculateTotalAmt(){
    var val=(this.addVendorForm.controls['cost'].value*this.addVendorForm.controls['tax_percent'].value)/100;
    val = (val+this.addVendorForm.controls['cost'].value) * (this.addVendorForm.controls['quantity'].value || 1);
    val = Math.round( val * 10 ) / 10;
    this.addVendorForm.controls['total_amt'].setValue(val);
  }
  setTaxTypes(){
    var tax_value = this.addVendorForm.controls['tax_percent'].value
    tax_value = tax_value/2
    tax_value = Math.round( tax_value * 10 ) / 10;
    $(".cgst, .sgst").val(tax_value)
  }
  toggleTaxFields(value){
    if(value == "igst"){
      $(".tax-types").addClass("d-none");
    }else{
      $(".tax-types").removeClass("d-none");
    }
  }

  closeVendorModal(){
    this.addVendorForm.reset();
    this.is_vendor_selected = false;
    this.category_id_vendorFilter = "";
    this.sub_category_id_vendorFilter = "";
    this.serviceable_city_id_vendorFilter = "";
    this.searchstring_vendorFilter = "";
  }

  searchCategoryProjects(searchparam){
    this.loaderService.display(true);
    if(searchparam != ""){
      this.getBoqListForPreProductionTab(1,searchparam);
    }else {
      this.getBoqListForPreProductionTab(1);
    }
  }

  convertToAbs(number){
    return Math.abs(number);
  }

  update_seen(obj_id,project_id){
    $(".new-"+obj_id).html("");
    this.categoryService.updateFBASeen(project_id,obj_id).subscribe(
      res=>{
        this.boq_list = res.projects;
         this.loaderService.display(false);
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }

  getBoqDetailsForPreProductionVendorMapping(boq_id,project_id){
    this.quot_id_for_ven_collapse = boq_id;
    this.loaderService.display(true);
        this.categoryService.getBoqDetailsForPreProductionVendorMapping(project_id,boq_id).subscribe(
        res => {
          res = res.json();
          // this.selectBoq = res.quotation;
          this.line_items_list = res.quotation.line_items;
          this.other_items_list = res.quotation.extra_items;
          this.loaderService.display(false);
        },
        err => {
          if(err._body.message === "No Line items Found."){
            this.line_items_list = {};
            
          }
          this.loaderService.display(false);
        }
      );
  }
  selectView = 'detailView';
  ClubView(obj){

    this.loaderService.display(true);
    this.selectView = 'clubView';
    this.categoryService.getClubViewDetails(obj.id,obj.project_id).subscribe(
      res=>{
        this.loaderService.display(false);
        
        this.club_view_list = res['quotation']['vendor_line_items'];


      },
      err=>{
        this.loaderService.display(false);
        

      });
  }
  job_elem_list:any;
  item_list:any = [];
  showMlidDIv(value){
    this.item_list = [];
    this.job_elem_list = value.job_elements;
    for( var i=0 ; i< this.job_elem_list.length; i++){
      if(this.job_elem_list[i].line_item.line_item_attributes){
      this.item_list.push(this.job_elem_list[i].line_item);
       }


    }
    
    // $('#club_'+id).removeClass('d-none');
  }
  closeModuleDiv(id:number){
    $('#club_'+id).addClass('d-none');

  }
  editClubQty(id:number){
    $('#qty_'+id).prop('disabled', false);
    $('#img_'+id).removeClass('d-none');

  }
  job_elem_ids_arr:any = [];
  editQty(id:number,value,data){
    this.job_elem_ids_arr = [];
    $('#qty_'+id).prop('disabled', true);
    $('#img_'+id).addClass('d-none');
    var qty = $('#qty_'+id).val();
    for(var i= 0; i< value.job_elements.length; i++ ){

      this.job_elem_ids_arr.push(value.job_elements[i].id);


    }
    
    var obj_data =JSON.stringify(this.job_elem_ids_arr);
    this.loaderService.display(true);
    //call api-----------
    this.categoryService.editSliQty(qty,obj_data).subscribe(
      res=>{
        
        this.loaderService.display(false);
        this.successMessageShow('Quantity Updated Successfully!');
        this.ClubView(data);
      },
      err=>{
        

      })

  }
  sli_item_id: any;
  sli_options_list: any;
  sli_options_id;
  selectedSublineItem;
  project_id;
  boq_id;
  sublineId;
  getSLIOptions(subline){
    if(this.selectView == 'clubView'){
     this.boq_id = subline.quotation_id;
     this.project_id = subline.project_id;

    }
    else{
      this.sublineId = subline.id;

    }
   this.loaderService.display(true);
   this.categoryService.getViewOptionsForMasterSLI(this.project_id,this.boq_id,JSON.stringify(subline.id)).subscribe(
    res=>{
      
      let product;
        this.selectedSublineItem = subline;
        res.vendor_products.forEach(element => {
          if(element.id === subline.vendor_product_id){
            product = element;
          }
        });

        if(product.id > -1){
          const index = res.vendor_products.indexOf(product);
          res.vendor_products.splice(index, 1);
          this.sli_options_list = res.vendor_products;
        }
        this.sli_options_id = "";
        this.loaderService.display(false);
    },
    error=>{
        
        this.loaderService.display(false);}
  );
  }
  
}
