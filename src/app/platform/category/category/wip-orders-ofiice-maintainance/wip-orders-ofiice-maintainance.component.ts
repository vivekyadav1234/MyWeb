import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { FormBuilder, FormGroup, Validators, FormControl ,FormArray} from '../../../../../../node_modules/@angular/forms';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-wip-orders-ofiice-maintainance',
  templateUrl: './wip-orders-ofiice-maintainance.component.html',
  styleUrls: ['./wip-orders-ofiice-maintainance.component.css'],
  providers: [CategoryService]
})
export class WipOrdersOfiiceMaintainanceComponent implements OnInit {

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
  todayDate:any;
  automated_sli: boolean=false;
  add_Sli: FormGroup;
  @Input() data:any;
  project_type;
  currentRoute;
  showTagSnagOption=false;

  constructor(private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    
    this.project_type = this.data;
  	this.getWipTableData(1);
    this.getVendorList();
  	this.line_item_in_po = this.line_item_po;
  	//this.project_id = this.line_item_in_po.project_id;
  	this.update_Sli_Form = this.formBuilder.group({
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      tax: ["", Validators.required],
    });
    this.sublineItemForm = this.formBuilder.group({
      'name' : ['', Validators.required],
      'unit': ['', Validators.required],
      'rate': ['', Validators.required],
      'quantity': ['', Validators.required],
      'tax_type': ["", Validators.required],
      'tax_percent' : ["", Validators.required],
      'vendor_id' : ["", Validators.required],
      'vendor_product_id' : ["", Validators.required],
      'sli_type': [this.project_type,Validators.required]
    });
    this.add_Sli = this.formBuilder.group({
      custom_slis: this.formBuilder.array([this.buildItem()])
    });

    this.milestoneForm = this.formBuilder.group({
      shipping_address: new FormControl("", Validators.required),
      contact_person: new FormControl(""),
      vendor_gst: new FormControl("",Validators.required),
      lead_id: new FormControl("",Validators.required),
      type: new FormControl(this.project_type,Validators.required),
      contact_number: new FormControl("", [
       	Validators.pattern(/^[6789]\d{9}$/)
      ]),
      billing_address: new FormControl("", Validators.required),
      billing_contact_person: new FormControl(""),
      billing_contact_number: new FormControl("", [
       	Validators.pattern(/^[6789]\d{9}$/)
      ]),
      sameAddress: new FormControl(false),
      tag_snag: new FormControl("",Validators.required)
    });

    


    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    this.todayDate = (day<10 ? '0' : '') + day + '/' +
    (month<10 ? '0' : '') + month + '/' +
    d.getFullYear();
    
    
  }

  //for nested form
  buildItem() {
    return new FormGroup({
      name: new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      unit: new FormControl("", Validators.required),
      tax_type: new FormControl("", Validators.required),
      tax: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      vendor_id: new FormControl("", Validators.required),
      sli_type: new FormControl(this.project_type, Validators.required),
    });
  }
  //For nested form
  pushAttributes(add_Sli) {
    return add_Sli.get("custom_slis").push(this.buildItem());
  }
  getAttributes(add_Sli) {
    return add_Sli.get("custom_slis").controls;
  }
  //submit add sli form for custom sli
  addSliForm(data){
    
    this.loaderService.display(true);
    this.categoryService
      .ADDSlisForProjectMaintainancePo(data)
      .subscribe(
        res => {
          
          $("#addSli").modal("hide");
          this.successMessageShow("Sli Added Successfully !!");
          this.getWipTableData(1);
          this.resetAddSli();
          this.loaderService.display(false);
        },
        err => {
          
          $("#addSli").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).error);
          this.loaderService.display(false);
        }
      );

  }
  errorMessageShow(msg) {
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(
      function() {
        this.erroralert = false;
      }.bind(this),
      2000
    );
  }
  successMessageShow(msg) {
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(
      function() {
        this.successalert = false;
      }.bind(this),
      2000
    );
  }
  uom_list = [];

  getUOMList() {
    this.uom_list = [];
    this.categoryService.getUOMList().subscribe(
      res => {
        
        this.uom_list = res;
      },
      error => {
        
      }
    );
  }



  //To get table data
  wipData:any;
  wipData_data:any;
  page_number;
  per_page;
  total_page;
  current_page;
  getWipTableData(page){
  	this.page_number = page;
    this.loaderService.display(true);
    this.categoryService.getWipTable(this.page_number,this.project_type).subscribe(
      res=>{

      	this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.wipData = res.vendor_wise_wip_slis;
        this.wipData_data = res.vendor_wise_wip_slis.wip_slis;
      	
      	
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
        
    });
  }


  mli_type_list: { "name": string; "value": string; }[];
  mli_type: string;
  mli_list: any;
  mli_id: any;
  getProcurementList(){
    this.automated_sli=true;
    this.sublineItemForm.controls['sli_type'].patchValue(this.project_type);
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
	      "name": " Loose Furniture",
	      "value": "loose_furniture"
	    }
    ];
    this.mli_type = '';
    this.getMasterLineItems(this.mli_type);
    this.getUOMList();
  }

  getMasterLineItems(event){
    this.mli_type = event;
    this.loaderService.display(true);
    this.categoryService.getMasterLineItems(this.mli_type).subscribe(
      res=>{
          
          this.mli_list = res.master_line_items;
          this.loaderService.display(false);
          this.mli_id = "";
      },
      error=>{
        this.loaderService.display(true);
      }
    );
  }

  vendor_products_list;
  sli_item_id;
  headers_res;
  getVendorProductsList(event,page?){

    this.mli_id = event;
    for(let obj of this.mli_list){
      // if(this.mli_id == obj.vendor_id){
      //    this.sublineItemForm.controls['rate'].patchValue(obj.vendor_id)

      // }

    }
    this.loaderService.display(true);
    this.categoryService.getVendorProductsList(this.mli_id,'',page).
    subscribe(res=>{
      this.headers_res= res.headers._headers;
      this.per_page = this.headers_res.get('x-per-page');
      this.total_page = this.headers_res.get('x-total');
      this.current_page = this.headers_res.get('x-page');
      res= res.json();
      this.sli_item_id ="";
      this.vendor_products_list = res.vendor_products;
      
      this.loaderService.display(false);
    },
      error=>{
        
        this.loaderService.display(false);
      }
    );
  }
  vendor_list;
  getVendorList() {
    this.categoryService.getAllVendors().subscribe(
      res => {
        
        this.vendor_list = res.vendors;
      },
      err => {
        
        
      }
    );
  }


  selected_vendor_product;
  product_id;
  getDetailsOfVendorProduct(product_id,product?){
  	this.product_id = product_id;
    this.loaderService.display(true);
    this.categoryService.getDetailsOfVendorProduct(this.product_id).subscribe(
      res=>{
        this.selected_vendor_product = res.vendor_product;
        this.sublineItemForm.controls['name'].setValue(this.selected_vendor_product.sli_name);
        this.sublineItemForm.controls['rate'].setValue(this.selected_vendor_product.rate);
        this.sublineItemForm.controls['unit'].setValue(this.selected_vendor_product.unit);
        this.sublineItemForm.controls['vendor_id'].setValue(this.selected_vendor_product.vendor_id);
        this.sublineItemForm.controls['vendor_product_id'].setValue(this.selected_vendor_product.id);
        this.loaderService.display(false);   
      },
      error=>{
        
        this.loaderService.display(false);
      }
    );
  }

	//to add item
  addSublineItem(){
  	this.loaderService.display(true);
    this.categoryService.addSublineItems(this.sublineItemForm.value).subscribe(
      res=>{
        this.loaderService.display(false);
      	this.successalert = true;
        this.successMessage = "Sli added successfully";
        $("#addSli").modal('hide');
        setTimeout(function() {
            this.successalert = false;
        }.bind(this), 2000);
        this.getWipTableData(this.page_number);
        this.resetForm();
        this.resetAddSli();
      },
      error=>{
        this.loaderService.display(false);
        
        this.erroralert = true;
        this.errorMessage = (JSON.parse(error['_body']).message); 
        setTimeout(function() {
          this.erroralert = false;
       	}.bind(this), 2000);
      }
    );
  }

  //to remove item
  removeSliItem(id){
    this.loaderService.display(true);
    this.categoryService.removeSliItems(id).subscribe(
      res=>{
        
        this.successalert = true;
        this.loaderService.display(false);
        this.successMessage = res.message;
        this.getWipTableData(this.page_number);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 3000);
      },
      err=>{
        
        this.loaderService.display(false);
        this.errorMessage = (JSON.parse(err['_body']).message); 
        setTimeout(function() {
          this.erroralert = false;
       	}.bind(this), 2000);
    });
  }


  //to edit sli
  Sli_id;
  editSli(id,quantity,tax_type,tax){
  	this.Sli_id = id;
  	this.update_Sli_Form.controls['quantity'].setValue(quantity);
  	this.update_Sli_Form.controls['tax_type'].setValue(tax_type);
  	this.update_Sli_Form.controls['tax'].setValue(tax);
  }

  updateSlis(){
  	this.loaderService.display(true);
    this.categoryService.updateSliItems(this.Sli_id,this.update_Sli_Form.value).subscribe(
      res=>{
        
        this.successalert = true;
        this.loaderService.display(false);
        this.successMessage = res.message;
        $("#editSliModal").modal('hide');
        this.selectedItem = [];
        this.selectedItemToSubmit = [];
        this.getWipTableData(this.page_number);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 3000);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = (JSON.parse(err['_body']).message); 
        setTimeout(function() {
          this.erroralert = false;
       	}.bind(this), 2000);
    });
  }

  //for parent checkbox
  itemList;
  selectedItem = [];
  selectedItemToSubmit:any = []
  parentCheckbox_id = -1;
  toggleAll(item,event,id) {
    if (event.target.checked) {

      if (this.parentCheckbox_id == -1 || this.parentCheckbox_id == id) {
        this.selectedItem = [];
        item.wip_slis.forEach(item_data => {
          
          if (item_data.attributes.status == 'pending' || item_data.attributes.status == 'modify_po' || item_data.attributes.status == 'cancelled'){
            
            item_data.checked = true;
            if (!this.selectedItem.includes(item_data.id)) {
            this.selectedItem.push(item_data.id);
            this.selectedItemToSubmit.push(item_data.attributes);
            }
          }
        });
        this.parentCheckbox_id = id;
        this.child_parent = id;
      }

      else{
        alert("you already select a vendor");
        $('#checkall'+id).prop('checked', false);
        item.checked = false;
      }
    }
    else {
      item.wip_slis.forEach(item => {
        item.checked = false;
        this.selectedItem = [];
        this.selectedItemToSubmit = [];
      });
      this.parentCheckbox_id = -1;
      this.child_parent = -1;
    }
    
  }


  child_parent = -1;
  //for child checkbox
  toggleItem(event, item_data, item,parent_id,child_id) {
    // item.checked = !item.checked;
    item_data.checked = event.target.checked;
    // this.toggle = this.itemList.every(item => item.checked);
    if (event.target.checked) {
      if (this.child_parent == -1 || this.child_parent == parent_id) {
        if (item_data.attributes.status == 'pending' || item_data.attributes.status == 'modify_po' || item_data.attributes.status == 'cancelled'){
          item.checked = true;
          // 
          if (!this.selectedItem.includes(item_data.id)) {
            this.selectedItem.push(item_data.id);
            this.selectedItemToSubmit.push(item_data.attributes);
          }
        }
        this.child_parent = parent_id;
        this.parentCheckbox_id = parent_id;
      }
      else{
        alert("you already select a vendor sli");
        $('#check'+child_id).prop('checked', false);
        $('#checkall'+parent_id).prop('checked', false);
      }
    } else {
      this.selectedItem.forEach((element, index) => {
        if (item_data.id == element) {
          this.selectedItem.splice(index, 1);
          this.selectedItemToSubmit.splice(index,1)
          if (this.selectedItem.length == 0) {
            item.checked = false;
          }
        }
      });
      if (this.selectedItem.length <= 0) {
        
        item.checked = false;
      }
      this.child_parent = -1;
      this.parentCheckbox_id = -1;
    }
    

    
    
  }

  //to get address
  address_list = [];
  address_list_billing = [];
  getAddress() {
    // this.categoryService.getAddressForPO(this.project_id).subscribe(
    //   res => {
        // 
        // if (res) {
        //   this.address_list = res;
        // } else {
          this.address_list = [
            {
              address_name: "Arrivae Karnataka",
              name: "",
              contact: "",
              address:
                "SINGULARITY FURNITURE PRIVATE LIMITE 5th Floor, Umiya Business Bay, Tower 2, Cessna Business Park, Vartur Hobli, Outer Ring Road, Kadubeesanahalli, Bengaluru(Bangalore) Urban, Karnataka, 560037 GST Number: 29AAECP3450G1ZF"
            },
            {
              address_name: "Arrivae Maharashtra",
              name: "",
              contact: "",
              address:
                "SINGULARITY FURNITURE PRIVATE LIMITED B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 GST Number: 27AAECP3450G1ZJ"
            },
            {
              address_name: "Arrivae Tamil Nadu",
              name: "",
              contact: "",
              address:
                "SINGULARITY FURNITURE PRIVATE LIMITED 26B, Bharati Villas Jawaharlal Nehru Salai, Ekkaduthangal, Guindy Industrial Estate, Chennai, Chennai, Tamil Nadu, 600032 GST Number: 33AAECP3450G1ZQ"
            },
            {
              address_name: "Arrivae Telangana",
              name: "",
              contact: "",
              address:
                "SINGULARITY FURNITURE PRIVATE LIMITED 5th floor, Survey No. 8, Purva Summit, Kondapur Village, WhiteField Road, Opposite Tech Mahindra, Hi-Tech City, Phase-II, Hyderabad, Telangana, 500081 GST Number: 36AAECP3450G1ZK"
            },
            {
              address_name: "Arrivae West Bengal",
              name: "",
              contact: "",
              address:
                "SINGULARITY FURNITURE PRIVATE LIMITED 5, Dharamtolla Street, Kolkata, West Bengal, 700013 GST Number: 19AAECP3450G1ZG"
            },
            {
              address_name: "WFX Technologies",
              name: "Lokesh",
              contact: "9560915790",
              address: "WFX Technologies Private Limited, B-13, Infocity-1, Sector-34, Gurugram - 122001, Haryana,GST No. : 06AAACW7299J1ZQ"
            }
          ];
        //}
        this.address_list_billing = [
          {
            Shipping_address_name: "Arrivae Warehouse",
            name: "Rajeev Jha",
            contact: "9833950750",
            address:
              "Arrivae Warehouse, Boxmyspace, Bldg no. A-6, Gala no 8 to 11,Harihar Compound, Mankoli Naka, Mumbai Nashik Highway, Bhiwandi 421302"
          },
          {
            Shipping_address_name: "Arrivae Store",
            name: "Vinay R",
            contact: "9900234020",
            address: "Arrivae Factory, Lakhs Modular Furniture, Herohalli Cross, Magadi Main Road, Bangalore 560091"
          },
          {
            Shipping_address_name: "Bengaluru Warehouse",
            contact: "9743258596",
            name:"Abhijith",
            address: "88/89, Basement, Muthuraya Swamy Layout, P&T Colony, Telephone Employees Layout, Sunkadakatte, Colony, Telephone Employees Layout,Sunkadakatte,Karnataka 560091"
          },
          {
            Shipping_address_name: "Pune Warehouse",
            contact: "9975304669",
            name:"Jayesh Bhawar",
            address: "Gate no- 467/3, Post Kelevadi, Pune – Bangalore Highway, Near Khed – Shivapur toll plaza, Pune 412213."
          },
          {
            Shipping_address_name: "ANDHERI EC  (For Hardware and LF)",
            contact: "",
            name:"",
            address: "B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 "
          },
          {
            Shipping_address_name: "RAWAT BROTHERS FURNITURE PVT. LTD, (For Raw Material)",
            contact: "9130606486",
            name:"Laxman",
            address: "Shri Shankar Udyog, Gat No. 486/ 487, Village Kelawade, Tal. Bhor,Pune Bangalore NH4, Dist. Pune - 412213 . GSTIN/UIN: 27AACCR8098J1ZQ"
          },
          {
            Shipping_address_name: "Arrivae Bangalore Factory",
            contact: "9900234020",
            name:"Vinay",
            address: "Artiiq Interia, No. 123, Kiadb Industrial Area,1st Phase, Harohalli, Kanakapura, Ramanagara Dist. 562112",
          }
        ];
        

        this.loaderService.display(false);
    //   },
    //   err => {
    //     
    //     this.loaderService.display(false);
    //   }
    // );
  }

  //create WIP PO
  vendorName: any;
  vendorAddress:any;
  vendorContact:any;
  vendorEmail:any;
  vendorGst:any;
  vendorPan:any;
  gst_list = [];
  vendorId;
  CreateModal(name,address,contact,email,gst,pan,vendor_id) {
    
   

    if (this.selectedItem.length > 0) {
      this.currentRoute=this.router.url;
      // 
      if(this.currentRoute=='/category/project-po' || this.currentRoute=='/category/office-po'){
        this.showTagSnagOption=true;
      }
  
      if(!this.showTagSnagOption){
        this.milestoneForm.controls["tag_snag"].patchValue("false");
      }
      this.vendorName = name;
      this.vendorAddress = address;
      this.vendorContact = contact;
      this.vendorEmail = email;
      this.vendorGst = gst;
      this.vendorPan = pan;
      this.getVendorDetails(vendor_id);
      this.milestoneForm.controls['type'].patchValue(this.project_type);
      $("#CreatePOModal").modal("show");
      this.getAddress();
      this.checkFormValidity();
      this.lead_not_found = false;
      this.enter_submit = false;
      this.lead_details = null;
    
    } else {
      alert("Please Select Atleast One Line Item");
    }
  }
  // To check the validity for requird form
  checkFormValidity(){

      if (this.project_type != 'maintenance') {
          this.milestoneForm.controls['lead_id'].setValidators([Validators.required]);
          this.milestoneForm.controls['lead_id'].updateValueAndValidity();
      } else {
          this.milestoneForm.controls['lead_id'].clearValidators();
          this.milestoneForm.controls['lead_id'].updateValueAndValidity();
      }
  }

  //to set billing address
  selectAddressBilling = "Saved Billing Addresses";
  showBillAddress = false;
  setBillingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressBilling = event.target.value;
    
    if (event.target.value === "Saved Billing Addresses") {
      this.showBillAddress = false;

      this.milestoneForm.controls["billing_address"].patchValue("");
      this.milestoneForm.controls["billing_contact_person"].patchValue("");
      this.milestoneForm.controls["billing_contact_number"].patchValue("");
    } else {
      this.showShipAddress = true;
      for (let i = 0; i < this.address_list.length; i++) {
        if (event.target.value == this.address_list[i].address_name) {
          this.milestoneForm.controls["billing_address"].patchValue(
            this.address_list[i].address
          );
          this.milestoneForm.controls["billing_contact_person"].patchValue(
            this.address_list[i].name
          );
          this.milestoneForm.controls["billing_contact_number"].patchValue(
            this.address_list[i].contact
          );
          break;
        }
      }
    }
    this.mergeAddressesAction(); //this will check if the same shipping and billing address checkbox is selected or not and act accordingly
  }

  selectAddressShipping = "Saved Shipping Addresses";
  mergeAddressesAction() {
    if (this.milestoneForm.controls["sameAddress"].value) {
      this.milestoneForm.controls["shipping_address"].patchValue(
        this.milestoneForm.controls["billing_address"].value
      );
      this.milestoneForm.controls["contact_person"].patchValue(
        this.milestoneForm.controls["billing_contact_person"].value
      );
      this.milestoneForm.controls["contact_number"].patchValue(
        this.milestoneForm.controls["billing_contact_number"].value
      );
    } else {
      this.selectAddressShipping = "Saved Shipping Addresses";
      this.milestoneForm.controls["shipping_address"].patchValue("");
      this.milestoneForm.controls["contact_person"].patchValue("");
      this.milestoneForm.controls["contact_number"].patchValue("");
    }
    $("#shippingList").prop("selectedIndex", 0);
    /*when the user selects the same billing address as shipping address the drop down of the billing address
      will be set to default  */
  }

  showBillingAddress() {
    //toggles the billingAddress forms in the dom
    this.showBillAddress = !this.showBillAddress;
  }

  showShipAddress: boolean;
  setShippingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressShipping = event.target.value;

    if (event.target.value === "Saved Shipping Addresses") {
      this.showShipAddress = false;

      this.milestoneForm.controls["shipping_address"].patchValue("");
      this.milestoneForm.controls["contact_person"].patchValue("");
      this.milestoneForm.controls["contact_number"].patchValue("");
    } else {
      for (let i = 0; i < this.address_list_billing.length; i++) {
        if (event.target.value == this.address_list_billing[i].Shipping_address_name) {
          this.milestoneForm.controls["shipping_address"].patchValue(
            this.address_list_billing[i].address
          );
          this.milestoneForm.controls["contact_person"].patchValue(
            this.address_list_billing[i].name
          );
          this.milestoneForm.controls["contact_number"].patchValue(
            this.address_list_billing[i].contact
          );
          break;
        }
      }
    }
    this.showShipAddress = true;
  }

  showShippingAddress() {
    this.showShipAddress = !this.showShipAddress;
  }


  //to relase po
  poSubmission(){
    $('#CreatePOModal').modal('hide');
    $('.InvoiceModal').modal('show');
    this.getTotalAmount();
  }

  //to reset forms
  resetForm(){
  	this.milestoneForm.reset();
  	this.update_Sli_Form.reset();
  	this.sublineItemForm.reset();
  }
  sliVendor;
  submitForRelease(){
    this.loaderService.display(true);
    
    this.categoryService.poSubmit(this.milestoneForm.value,this.selectedItem).subscribe(
      res=>{
        
        this.successalert = true;
        this.selectedItem = [];
        this.selectedItemToSubmit = [];
        $("#CreatePOModal").modal('hide');
        $('.InvoiceModal').modal('hide');
        this.milestoneForm.reset();
        this.loaderService.display(false);
        this.successMessage = "Successfully Created";
        this.getWipTableData(this.page_number);
        this.cancelSubmitPo();
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = (JSON.parse(err['_body']).message);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000); 
    });
  }
  enter_submit:boolean = false;
  lead_not_found:boolean = false;
  lead_present:boolean = false;
  getLeadListForRelease(){
    this.getLeadList();
    this.enter_submit = true;
  }
  lead_details:any;
  leadId;
  lead_not_found_message;
  getLeadList(){
    this.leadId = $('#leadId').val();
    this.categoryService.getLeadListForPoRelease(this.leadId).subscribe(
      res=>{
        
        this.lead_details = res.lead;
        this.lead_not_found = false;
        $('#CreatePOModal').modal('show');
        $('.InvoiceModal').modal('hide');
        
        
      },
      err=>{
        
        this.lead_not_found = true;
        this.lead_not_found_message = JSON.parse(err._body)["message"];
        
    });
    this.milestoneForm.controls['lead_id'].patchValue(this.leadId)

  }

  //to cancel Po
  cancelSubmitPo(){
    $('.InvoiceModal').modal('hide');
    this.getWipTableData(1);
    this.selectedItem = [];
    this.selectedItemToSubmit = [];
    this.child_parent = -1;
    this.parentCheckbox_id = -1;
  }
  sli_options_list: any;
  selectedProduct: any;
  selectedSublineItem;
  sublineId;
  getSLIOptions(subline) {
    this.sublineId = subline.id;
    this.loaderService.display(true);
    this.sli_options_list = [];
    
    this.categoryService
      .getViewOptionsForMasterSLIForBulkPO(this.sublineId)
      .subscribe(
        res => {
          
          let product;
          this.selectedSublineItem = subline;
          res.vendor_products.forEach(element => {
            if (element.id === subline.attributes.vendor_product_id) {
              product = element;
              
            }
          });

          if (product) {
            if (product.id > -1) {
              this.selectedProduct = product;
              this.sli_options_list = res.vendor_products;
              
            }
          }

          this.sli_options_id = "";
          this.loaderService.display(false);
        },
        error => {
          
          this.loaderService.display(false);
        }
      );
  }
  job_elements_arr_alter:any = [];
  sli_options_id
  changeViewOption(id){
    this.sli_options_id = id;
    
    this.loaderService.display(true);
    this.categoryService.changeMasterSLIForClubbedInBulkPO(this.sublineId,this.sli_options_id
      ,this.project_type).subscribe(
     res=>{
        this.successalert = true;
        this.successMessage = "Alternative updated successfully";
        (<any>$('#viewOptionsModal')).modal('hide');
        this.getWipTableData(1);
        // this.showLineItems(this.boq_id,this.selectedBOQIndex);
        setTimeout(function() {
            this.successalert = false;
        }.bind(this), 2000);
        this.loaderService.display(false);
     },
     err=>{
         
         (<any>$('#viewOptionsModal')).modal('hide');
         this.erroralert = true;
         this.errorMessage = JSON.parse(err['_body']).message;
              setTimeout(function() {
                   this.erroralert = false;
              }.bind(this), 2000);
         this.loaderService.display(false);}
   );

  }
  replaceString(input){
    return (input.replace(/_/g, ' ')).toUpperCase();

  }
  vendor_det;
  getVendorDetails(value){
    this.categoryService.getVendorDetails(value).subscribe(
      res=>{
        this.vendor_det =res['vendor'];
        this.gst_list = res.vendor['gst_no'];
        
        
        // this.loaderService.display(false);
      },
      err=>{
           
           // this.loaderService.display(false);
      });
  }
  resetAddSli() {
    this.add_Sli.get("custom_slis").reset();
    this.sublineItemForm.reset();
    (<FormArray>this.add_Sli.controls["custom_slis"]).controls = [];
    this.pushAttributes(this.add_Sli);
    this.getAttributes(this.add_Sli);

  }
  amount_total = 0;
  getTotalAmount(){
    for(let obj of this.selectedItemToSubmit){
      this.amount_total += obj.amount;


    }
    

  }


}
