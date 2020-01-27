import { Component, OnInit, ViewChild, Input,ChangeDetectorRef } from "@angular/core";
import { CategoryService } from "../category.service";
import { LoaderService } from "../../../../services/loader.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { VendorSelectionComponent } from "../vendor-selection/vendor-selection.component";
import { PoReleaseComponent } from "../po-release/po-release.component";
import { PiUploadComponent } from "../pi-upload/pi-upload.component";
import { PaymentsReleaseComponent } from "../payments-release/payments-release.component";
declare var $: any;

@Component({
  selector: "app-sli-creation",
  templateUrl: "./sli-creation.component.html",
  styleUrls: ["./sli-creation.component.css"],
  providers: [CategoryService]
})
export class SliCreationComponent implements OnInit {
  @Input() line_item: any;
  linet_item_sli: any = [];
  display = false;
  sli_options_id;
  vendorSelectionCount;
  poReleaseCount;
  piUploadCount;
  boq_list;
  boqs_list;
  selectedBOQIndex = 0;
  selectedLineItemIndex = 0;
  selectedSublineItem;
  selectedSublineItemIndex = -1;
  selectedPreProductionTab = "sli_creation";
  selectedBOQ = {};
  selectedLineItem = {};
  headers_res;
  per_page;
  total_page;
  current_page;
  line_items_list;
  boq_labels;
  arrow: boolean = true;
  sublineItemForm: FormGroup;
  otherItemForm: FormGroup;
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  other_item_id: -1;
  other_item_list: any;
  selected_other_item: any;
  procurement_method: any;
  line_items_type_list = [];
  project_id;
  boq_id;
  toggle_line_rows: boolean;
  error_list = [];
  sub_line_li = ["fg", "gh", "ghg", "ghghg"];
  show_line_type: any;
  subline_items_list = [];
  selectedSec = 'sli-create';
  update_Sli_Form: FormGroup;
  update_Club_Sli_Form: FormGroup;
  // addClubbed_Slis:FormGroup;
  add_Sli: FormGroup;
  add_Sli_clubbed: FormGroup;
  clubbedUpdate:FormGroup;
  updateUOM:FormGroup;
  selected_view_option: any;
  automated_sli: boolean=false;
  LineItem;
  LineItemType;
  data_value;

  constructor(
    private loaderService: LoaderService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.linet_item_sli = this.line_item;
    this.showLineItems();
    this.slectBtn('sli-create');

    this.update_Sli_Form = this.formBuilder.group({
      name: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      unit: ["", Validators.required],
      tax_percent: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_name: [""],
      vendor_product_id: [""]
    });

    this.update_Club_Sli_Form = this.formBuilder.group({
      name: ["", Validators.required],
      rate: ["", Validators.required],
      quantity: ["", Validators.required],
      tax_type: ["", Validators.required],
      unit: ["", Validators.required],
      tax_percent: ["", Validators.required],
      vendor_id: ["", Validators.required],
      vendor_name: [""],
      vendor_product_id: [""]
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
    });

    this.updateUOM = this.formBuilder.group({
      currentUnit: ["", Validators.required],
      unit:["",Validators.required],
      original: ["", Validators.required],
      updated: ["", Validators.required],
    });

    this.add_Sli = this.formBuilder.group({
      sub_line_items: this.formBuilder.array([this.buildItem()])
    });
    this.add_Sli_clubbed = this.formBuilder.group({
      label: new FormControl("", Validators.required),
      sub_line_items: this.formBuilder.array([this.buildItem()])
    });

    this.clubbedUpdate = this.formBuilder.group({
      'clubbed':new FormArray([])
    })

    this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
   }
  slectBtn(value) {
    this.selectedSec = value;
    if(this.selectedSec == 'sli-create'){
      this.showLineItems();
    }
      this.loaderService.display(true);

  }
  line_item_Arr = [];
  extra_val:string;
  clubbed_arr;
  sublines;
  showLineItems() {

    this.line_items_type_list = [];
    this.loaderService.display(true);
    this.categoryService.getLineItemsListForSli(
        this.linet_item_sli.id,
        this.linet_item_sli.project_id
      )
      .subscribe(
        res => {
          this.getUOMList();
          this.selectedBOQ = res.quotation;
          this.project_id = res.quotation.project_id;
          this.boq_id = res.quotation.id;
          this.line_items_list = res.quotation.line_items;
           var jsonObj = res.quotation.line_items;
          this.line_item_Arr = Object.keys(jsonObj);
          
          this.other_item_list = res.quotation.extra_items;
          this.extra_val = 'Extra Items';
      
          this.selectedLineItemIndex = 0;
          this.selectedLineItem = {};
          if(this.line_items_list.clubbed_jobs.length > 0){
            this.clubbed_arr = this.line_items_list.clubbed_jobs

          }
          this.loaderService.display(false);
          let flag = 0;
          if (this.line_items_list.length > 0) {
            this.line_items_list.forEach(line => {
              line.selected = false;
              if (line.subline_items.length == 0) {
                flag = 1;
              }
              if (this.line_items_type_list.indexOf(line.type) === -1) {
                this.line_items_type_list.push(line.type);
              }
            });
            if (flag) {
              this.erroralert = true;
              this.errorMessage = "SLI not added for all the line items.";
              setTimeout(
                function() {
                  this.erroralert = false;
                }.bind(this),
                2000
              );
            }
          }
        },
        err => {
          if (err._body.message === "No Line items Found.") {
            this.selectedBOQIndex = -1;
            this.selectedLineItemIndex = -1;
            this.selectedSublineItemIndex = -1;
            this.selectedBOQ = {};
            this.selectedLineItem = {};
            this.selectedSublineItem = {};
            
          }
          this.loaderService.display(false);
        }
      );
  }
  deleteOneSli(sliId) {
  
    this.loaderService.display(true);

    this.categoryService
      .deleteOneSli(this.project_id, this.boq_id, sliId)
      .subscribe(
        res => {
          
          this.showLineItems();
          this.successMessageShow("Sli Deleted Successfully !!");
          this.loaderService.display(false);
        },
        err => {
          
          this.errorMessageShow(JSON.parse(err["_body"]).message);
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

  //To toggle row for displaying boqs

  sublineId;
  sli_options_list: any;
  selectedProduct: any;
  abc
  getSLIOptions(subline,club?) {
    this.abc=subline;
    $("#clubbedView").modal("hide");
    this.sublineId = subline.id;
    this.loaderService.display(true);
    this.sli_options_list = [];
    if(club){
      club.subline_items.forEach(sli => {
        this.listSliInClubbed.push(sli.id);
      });
      this.listSliInClubbedStringify=JSON.stringify(this.listSliInClubbed);
     }
     
    this.categoryService
      .getViewOptionsForMasterSLI(this.project_id, this.boq_id, this.sublineId)
      .subscribe(
        res => {
          
          let product;
          this.selectedSublineItem = subline;
          res.vendor_products.forEach(element => {
            if (element.id === subline.vendor_product_id) {
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
  public rowSelected: any;
  //for collapsable row table
  toggleRow(row) {
    if (this.rowSelected === -1) {
      this.rowSelected = row;
    } else {
      if (this.rowSelected == row) {
        this.rowSelected = -1;
      } else {
        this.rowSelected = row;
      }
    }
  }


  showBlock(obj) {
    $(".expanded-col-" + obj).css("display", "block");
  
  }
  hideblock(obj) {
    $(".expanded-col-" + obj).css("display", "none");
  
  }
  disable_field:boolean = false
  vendor_product_id_present;
  unit_n;
  from_bom
  editSliModal(sub,value,from_bom) {
    this.from_bom=from_bom;
   this.showLineItems();
   this.unit_n=value;
    this.getVendorList();
    this.getUOMList();
    this.disable_field = false;
    this.setEditSliForm(sub);
    if(sub.vendor_product_id){
      this.disable_field = true;
      this.vendor_product_id_present = sub.vendor_product_id;
      this.getProcurementList();
    }
    else{
      this.vendor_product_id_present = '';
    }
  }
  edit_sli_form_data: any;
  sli_id_edit;
  setEditSliForm(value) {
    
    this.edit_sli_form_data = value;
    this.sli_id_edit = value.id;
    this.update_Sli_Form.controls["name"].setValue(value.element_name);
    this.update_Sli_Form.controls["rate"].setValue(value.rate);
    this.update_Sli_Form.controls["quantity"].setValue(value.quantity);
 
    if(value.job_element_vendor_details[0]){
      this.update_Sli_Form.controls["tax_type"].setValue(
        value.job_element_vendor_details[0].tax_type
      );
      this.update_Sli_Form.controls["tax_percent"].setValue(
        value.job_element_vendor_details[0].tax_percent
      );
      this.update_Sli_Form.controls["vendor_name"].setValue(
        value.job_element_vendor_details[0].vendor_name
      );
      this.selectVendor(value.job_element_vendor_details[0].vendor_id);
    }else{
      this.update_Sli_Form.controls["tax_type"].setValue(
        ''
      );
      this.update_Sli_Form.controls["tax_percent"].setValue(
        ''
      );
      this.update_Sli_Form.controls["vendor_name"].setValue(
        ''
      );
      this.selectVendor('');
    }
   
    if(value.unit){
      this.update_Sli_Form.controls["unit"].setValue(value.unit);
    }
    else{
      this.update_Sli_Form.controls["unit"].setValue('');
    }
 


  }
  vendor_list;
  getVendorList() {
    this.categoryService.projectVendors(this.project_id, this.boq_id).subscribe(
      res => {
         
        
        this.vendor_list = res.vendors;
      },
      err => {
        
        this.errorMessageShow(JSON.parse(err["_body"]).message);
      }
    );
  }
  edit_vendor_id;
  selectVendor(vendorID) {
    this.edit_vendor_id = vendorID;
 
    if(vendorID!=''){
      this.update_Sli_Form.controls["vendor_id"].setValue(vendorID);
      this.update_Club_Sli_Form.controls["vendor_id"].setValue(vendorID);
    }else{
      this.update_Sli_Form.controls["vendor_id"].setValue('');
      this.update_Club_Sli_Form.controls["vendor_id"].setValue('');
    }
 
  }
  UpdateSli() {
    var obj = {
      name: this.update_Sli_Form.controls["name"].value,
      rate: this.update_Sli_Form.controls["rate"].value,
      quantity: this.update_Sli_Form.controls["quantity"].value,
      tax_type: this.update_Sli_Form.controls["tax_type"].value,
      tax_percent: this.update_Sli_Form.controls["tax_percent"].value,
      unit: this.update_Sli_Form.controls["unit"].value,
      vendor_id: this.update_Sli_Form.controls["vendor_id"].value,
      vendor_product_id: this.vendor_product_id_present? this.vendor_product_id_present:''
    }; 


    // this.loaderService.display(true);

    this.categoryService
      .UpdateSlis(this.project_id, this.boq_id, this.sli_id_edit, obj)
      .subscribe(

        res => {
          
          $("#editModal").modal("hide");
          this.showLineItems();
          this.successMessageShow("Sli Updated Successfully !!");
          this.loaderService.display(false);
        },
        err => {
          
          $("#editModal").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
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
  toggle = false;
  selectLineItemArr = [];
  subLineItemArr = [];
  selectLineItemArrForClubbedItem = [];
  subLineItemArrForClubbedItem = [];
  toggleForClubbedItem = false;
  modular_jobs_arr = [];
  service_jobs_arr = [];
  boqjobs_arr = [];
  custom_jobs_arr = [];
  appliance_jobs_arr = [];
  extra_jobs_arr = [];
  clubbed_jobs_arr = [];
  shangpin_jobs_arr=[];
  module_value;

  set_array_value(value, item, event) {
    if (event) {
      if (value == "loose_furniture") {
        this.boqjobs_arr.push(item.id);
      } else if (value == "modular_kitchen" || value == "modular_wardrobe") {
        this.modular_jobs_arr.push(item.id);
      } else if (value == "services") {
        this.service_jobs_arr.push(item.id);
      } else if (value == "custom_jobs") {
        this.custom_jobs_arr.push(item.id);
      } else if (value == "appliance") {
        this.appliance_jobs_arr.push(item.id);
      } else if (value == "extra") {
        this.extra_jobs_arr.push(item.id);
      } else if (value == "clubbed_jobs") {
        this.clubbed_jobs_arr.push(item.id);
    
      }else if (value == "custom_furniture") {
        this.shangpin_jobs_arr.push(item.id);
    
      }
    } else {
      if (value == "loose_furniture") {
        this.boqjobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.boqjobs_arr.splice(index, 1);
          }
        });
      } else if (value == "modular_kitchen" || value == "modular_wardrobe") {
        this.modular_jobs_arr.forEach((element, index) => {
          
        

          if (item.id == element) {
          
            this.modular_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "services") {
        this.service_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.service_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "custom_jobs") {
        this.custom_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.custom_jobs_arr.splice(index, 1);
          }
        });
      }else if (value == "custom_furniture") {
        this.shangpin_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.shangpin_jobs_arr.splice(index, 1);
          }
        });
      }
       else if (value == "appliance") {
        this.appliance_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.appliance_jobs_arr.splice(index, 1);
          }
        });

      } else if (value == "extra") {
        this.extra_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.extra_jobs_arr.splice(index, 1);
          }
        });
      } else if (value == "clubbed_jobs") {
        this.clubbed_jobs_arr.forEach((element, index) => {
          if (item.id == element) {
            this.clubbed_jobs_arr.splice(index, 1);
          }
        });
      }
    }

  }

  /* Checkbox toggle for item, line and sub-line items .
  
  Reletionship between the different checkboxes:
    All the checkboxes are dependent on each other and have a parent child relationship(intuitively) as shown below .

    Items(Parent)->Line Items(Child)
    Line Items(Parent) -> Sub Line Items(Child)
    Sub Line Items (Parent) -> No Child

    Rules:

      1) If the Parent is is not checked then all its children will follow the same state i.e unchecked
      2) If any one of the child element is checked then the parent will be checked as well

  */

  removeElementFromArray(collection, id) {
    for (var i = 0; i <= collection.length - 1; i++) {
      if (collection[i] === id) {
        collection.splice(i, 1);
      }
    }
  }

  toggleAll(value, event) {
    this.module_value = value;
    this.toggle = event.target.checked;

    $("#parent-" + value).prop("checked", this.toggle);
    if ($("#parent-" + value).prop("checked") == true) {
      this.toggle = true;
      this.line_items_list[value].forEach(item => {
        //changing the state of the children based on its parent state
        item.checked = this.toggle;
        if (this.selectLineItemArr.indexOf(item.id) === -1) {
          this.selectLineItemArr.push(item.id);
        }
        this.set_array_value(this.module_value, item, this.toggle);
        item.subline_items.forEach(sub => {
          sub.checked = this.toggle;
          // only distinct elements should be pushed in the array thus the condition applied below before pushing the data.
          if (this.subLineItemArr.indexOf(sub.id) === -1) {
            this.subLineItemArr.push(sub.id);
          }
        });
      });

    
    } else {
      this.toggle = false;
      this.line_items_list[value].forEach(item => {
        item.checked = this.toggle;
        for (var i = 0; i <= this.selectLineItemArr.length - 1; i++) {
          if (this.selectLineItemArr[i] === item.id) {
            this.selectLineItemArr.splice(i, 1);
          }
        }

        item.subline_items.forEach((sub, index) => {
          //removal of all elements from the subLineItemArr as its parent is now not checked
          sub.checked = this.toggle;

          for (var i = 0; i <= this.subLineItemArr.length - 1; i++) {
            if (this.subLineItemArr[i] === sub.id) {
              this.subLineItemArr.splice(i, 1);
            }
          }
        
        });
        this.set_array_value(this.module_value, item, this.toggle);
      });

    }
    
    
  }

  toggleItem(item, event, val) {
    this.module_value = val;
    item.checked = !item.checked;

    if (event.target.checked) {
      this.set_array_value(this.module_value, item, event.target.checked);
      if (this.selectLineItemArr.indexOf(item.id) == -1) {
        this.selectLineItemArr.push(item.id);
      }
      item.subline_items.forEach(sub => {
        sub.checked = true;
        this.subLineItemArr.push(sub.id);

      });
    } else {
      for (var i = 0; i <= this.selectLineItemArr.length - 1; i++) {
        this.removeElementFromArray(this.selectLineItemArr, item.id);
      }
      this.set_array_value(this.module_value, item, false);

      item.subline_items.forEach(element => {
        element.checked = false;
        this.removeElementFromArray(this.subLineItemArr, element.id);
      });
    }

    // The state of main parent i.e Line Item is changed only when all the select Line items are not checked.
    $("#parent-" + val).prop(
      "checked",
      !this.line_items_list[val].every(function(item) {
        return item.checked === false || item.checked == null;
      })
    );

    
    
  }

  toggleAllForClubbedItem(value, event,index) {
    this.module_value = value;
    this.toggleForClubbedItem = event.target.checked;
    $("#parent-" + index).prop("checked", this.toggleForClubbedItem);
    
    if ($("#parent-" + index).prop("checked") == true) {
      this.toggleForClubbedItem = true;
      this.line_items_list["clubbed_jobs"][index]["subline_items"].forEach(item => {
          
        //changing the state of the children based on its parent state
        item.checked = this.toggleForClubbedItem;
        if (this.selectLineItemArrForClubbedItem.indexOf(item.id) === -1) {
          this.subLineItemArrForClubbedItem.push(item.id);
        }
        this.set_array_value(this.module_value, item, this.toggleForClubbedItem);
      });
    } else {
      this.toggleForClubbedItem = false;
      
      this.line_items_list["clubbed_jobs"][index]["subline_items"].forEach((item) => {
        item.checked = this.toggleForClubbedItem;
        for (var i = 0; i <= this.selectLineItemArrForClubbedItem.length - 1; i++) {
          if (this.selectLineItemArrForClubbedItem[i] === item.id) {
            this.selectLineItemArrForClubbedItem.splice(i, 1);
          }
        }
        this.set_array_value(this.module_value, item, this.toggleForClubbedItem);
      });
    }
  }

  toggleItemSublineForClubbedItem(sub, event, parentIndex) {
    let parent = this.line_items_list["clubbed_jobs"][parentIndex];

    if (event.target.checked) {
      sub.checked = true;
      if (this.subLineItemArrForClubbedItem.indexOf(sub.id) == -1) {
        this.subLineItemArrForClubbedItem.push(sub.id);
      }
      if (!parent.checked) {
        parent.checked = true;
        if (this.selectLineItemArrForClubbedItem.indexOf(parent.id) == -1) {
          this.selectLineItemArrForClubbedItem.push(parent.id);
        }
      }
    } else {
      sub.checked = false;
      this.removeElementFromArray(this.subLineItemArrForClubbedItem, sub.id);
    }

    parent.checked = !parent.subline_items.every(function(item) {
      return item.checked === false || item.checked == null;
    });

    if (!parent.checked) {
      this.removeElementFromArray(this.selectLineItemArrForClubbedItem, parent.id);
    }

    $("#parent-" + parentIndex).prop(
      "checked",
      !this.line_items_list["clubbed_jobs"].every(function(item) {
        return item.checked === false || item.checked == null; // The state of main parent i.e Line Item is changed only when all the select Line items are not checked.
      })
    );
 
  }

  toggleItemSubline(sub, event, parentIndex, root) {
    let parent = this.line_items_list[root][parentIndex];

    if (event.target.checked) {
      sub.checked = true;
      if (this.subLineItemArr.indexOf(sub.id) == -1) {
        this.subLineItemArr.push(sub.id);
      }
      if (!parent.checked) {
        parent.checked = true;
        if (this.selectLineItemArr.indexOf(parent.id) == -1) {
          this.selectLineItemArr.push(parent.id);
        }
      }
    } else {
      sub.checked = false;
      this.removeElementFromArray(this.subLineItemArr, sub.id);
    }

    parent.checked = !parent.subline_items.every(function(item) {
      return item.checked === false || item.checked == null;
    });

    if (!parent.checked) {
      this.removeElementFromArray(this.selectLineItemArr, parent.id);
    }

    $("#parent-" + root).prop(
      "checked",
      !this.line_items_list[root].every(function(item) {
        return item.checked === false || item.checked == null; // The state of main parent i.e Line Item is changed only when all the select Line items are not checked.
      })
    );
    
    
  }

  getAttributes(add_Sli) {
    return add_Sli.get("sub_line_items").controls;
  }
  // getClubbedAttributes(addClubbed_Slis){
  //   return addClubbed_Slis.get("clubbed_sub_line_items").controls;
   // }
  //for nested form
  buildItem() {
    return new FormGroup({
      name: new FormControl("", Validators.required),
      quantity: new FormControl("", Validators.required),
      unit: new FormControl("", Validators.required),
      tax_type: new FormControl("", Validators.required),
      tax_percent: new FormControl("", Validators.required),
      rate: new FormControl("", Validators.required),
      vendor_id: new FormControl("", Validators.required)
    });
  }
  add_sli_arr = [];
  //For nested form
  pushAttributes(add_Sli) {
    return add_Sli.get("sub_line_items").push(this.buildItem());
  }

  // pushClubbedAttributes(addClubbed_Slis) {
  //   return addClubbed_Slis.get("clubbed_sub_line_items").push(this.buildItem());
  // }
  openAddSliModal(LineItem, type) {
    this.LineItem = LineItem;
    this.LineItemType = type;
    this.emptyArray();
    this.set_array_value(type, LineItem, true);
    this.getVendorList();
    this.getUOMList();
  }
  addSliForm(Data) {
    this.data_value=Data;
    var object;
    if(this.additionalSli){

      this.modular_jobs_arr = [];
      this.service_jobs_arr = [];
      this.boqjobs_arr = [];
      this.custom_jobs_arr = [];
      this.appliance_jobs_arr = [];
      this.extra_jobs_arr = [];
      this.clubbed_jobs_arr = [];
      this.subLineItemArr = [];
      this.shangpin_jobs_arr=[];

    }
    var obj = {
      line_items: {
        boqjobs: this.boqjobs_arr,
        modular_jobs: this.modular_jobs_arr,
        service_jobs: this.service_jobs_arr,
        custom_jobs: this.custom_jobs_arr,
        appliance_jobs: this.appliance_jobs_arr,
        extra_jobs: this.extra_jobs_arr,
        clubbed_jobs: this.clubbed_jobs_arr,
        shangpin_jobs:this.shangpin_jobs_arr
      }
    };

    object = $.extend({}, obj, Data);


    this.categoryService.ADDSlis(this.project_id, this.boq_id, object).subscribe(
        res => {
          
          // $("#addSli").modal("hide");
          $("#addSli").modal({"backdrop": "static"});
          this.showLineItems();
          this.emptyArray();
          this.openAddSliModal(this.LineItem, this.LineItemType);
          this.additionalSli = false;
          this.successMessageShow("Sli Added Successfully !!");
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
  additionalSli:boolean = false;
  openAdditionalSliModal() {
    this.additionalSli = true;    
      $("#addSli").modal("show");
      this.getVendorList();
      this.getUOMList();

  }
  openClubbedViewModal() {   
      $("#clubbedView").modal("show");  
      this.getClubbedViewDetails(); 
  }
  clubbedView:any ;
  masterClubbedView:any;
  customClubbedView:any;
  getClubbedViewDetails(){
    this.loaderService.display(true);
    this.categoryService
      .getClubbedViewList(this.project_id, this.boq_id)
      .subscribe(
        res => {
          this.clubbedView=res.custom_slis;
          this.masterClubbedView=res.master_slis;
          this.clubbedView=[...res.custom_slis, ...res.master_slis]
          this.customClubbedView=res.custom_slis;
          this.ref.detectChanges();
          
          this.loaderService.display(false);
        },
        err => {
          this.errorMessageShow(JSON.parse(err["_body"]).error);
          this.loaderService.display(false);
        }
      );
  }

  getClubbedViewDetailsObservable(){

    return this.categoryService
      .getClubbedViewList(this.project_id, this.boq_id);

  }

  emptyArray() {
    this.modular_jobs_arr = [];
    this.service_jobs_arr = [];
    this.boqjobs_arr = [];
    this.custom_jobs_arr = [];
    this.appliance_jobs_arr = [];
    this.extra_jobs_arr = [];
    this.clubbed_jobs_arr = [];
    this.shangpin_jobs_arr=[];
    this.subLineItemArr = [];
    this.add_Sli.reset();
    this.add_Sli_clubbed.reset();
  }

  resetAddSli() {
    this.add_Sli.get("sub_line_items").reset();
    this.add_Sli_clubbed.reset();
    this.sublineItemForm.reset();
    // this.addClubbed_Slis.reset();
    (<FormArray>this.add_Sli.controls["sub_line_items"]).controls = [];
    (<FormArray>this.add_Sli_clubbed.controls["sub_line_items"]).controls = [];
    // (<FormArray>this.addClubbed_Slis.controls["clubbed_sub_line_items"]).controls = [];
    this.pushAttributes(this.add_Sli);
    this.getAttributes(this.add_Sli);
    // this.pushClubbedAttributes(this.addClubbed_Slis);
    // this.getClubbedAttributes(this.addClubbed_Slis);
    this.pushAttributes(this.add_Sli_clubbed);
    this.getAttributes(this.add_Sli_clubbed);
    this.additionalSli = false
    this.mastersliArr = [];
    this.clubbedView_editable=[];
    this.clubbedUpdate = this.formBuilder.group({
      'clubbed':new FormArray([])
    })
    this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
  }
  openClubbedSliModal() {
    if (
      this.modular_jobs_arr.length > 0 ||
      this.service_jobs_arr.length > 0 ||
      this.boqjobs_arr.length > 0 ||
      this.custom_jobs_arr.length > 0 ||
      this.appliance_jobs_arr.length > 0 ||
      this.extra_jobs_arr.length > 0 ||
      this.clubbed_jobs_arr.length > 0||
      this.shangpin_jobs_arr.length>0
    ) {
      $("#addSliClubbed").modal("show");
      this.getVendorList();
      this.getUOMList();
    } else {
      alert("You have to select Atleast One Line Item");
    }
  }
  addSliClubbedForm(data) {
    var obj = {
      line_items: {
        boqjobs: this.boqjobs_arr,
        modular_jobs: this.modular_jobs_arr,
        service_jobs: this.service_jobs_arr,
        custom_jobs: this.custom_jobs_arr,
        appliance_jobs: this.appliance_jobs_arr,
        extra_jobs: this.extra_jobs_arr,
        clubbed_jobs: this.clubbed_jobs_arr,
        shangpin_jobs:this.shangpin_jobs_arr
      }
    };
    var object = $.extend({}, obj, data);
    this.categoryService.ADDClubbedSlis(this.project_id, this.boq_id, object).subscribe(
        res => {
          
          $("#addSliClubbed").modal("hide");
          this.showLineItems();
          this.emptyArray();
          this.successMessageShow("Clubbed Sli Added Successfully !!");
          this.loaderService.display(false);
        },
        err => {
          
          $("#addSliClubbed").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).error);
          this.loaderService.display(false);
        }
      );

  }

  popUp: string;
  openpopup(event, obj) {

    
    if (obj) {
      this.popUp = "";
      for (let data of obj.custom_jobs) {
        this.popUp += data.name + "\n\n\n\n";
        
      }
      for (let data of obj.modular_kitchen) {
        this.popUp += data.name + "\n\n\n\n";
       
      }
      for (let data of obj.modular_wardrobe) {
        this.popUp += data.name + "\n\n\n\n";
        
      }

      for (let data of obj.loose_furniture) {
        this.popUp += data.name + "\n\n\n\n";
        
      }
      for (let data of obj.services) {
        this.popUp += data.name + "\n\n\n\n";
        
      }
      for (let data of obj.extra) {
        this.popUp += data.name + "\n\n\n\n";
        
      }
      for (let data of obj.appliance) {
        this.popUp += data.name + "\n\n\n\n";
        
      }for (let data of obj.shangpin_job) {
        this.popUp += data.name + "\n\n\n\n";
        
      }
    }
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
      title: ""
    });

    //$(this).popover();
    $(function() {
      $(".pop").popover({
        trigger: "hover",
        title: ""
      });
    });
  }


  ngOnDestroy() {
    $(function() {
      $(".pop").remove();
    });
  }
  ngAfterViewInit() {
    $(function() {
      $(".pop").popover({
        trigger: "hover"
      });
    });
  }
  showLine;
  showClubbedLineItem(obj){
    this.showLine = obj;
    


  }
  confirmAndDelete(id: number) {
    if (confirm("Are You Sure You Want To delete?") == true) {
      this.deleteOneSli(id);
    }
  }
  confirmAndDeleteSli() {
    if (this.subLineItemArr.length > 0 || this.subLineItemArrForClubbedItem.length > 0) {
      if (confirm("Are You Sure You Want To delete?") == true) {
        this.deleteSelectedSli();
      }
    } else {
      alert("First You Have To Select Atleast One Subline Item");
    }
  }
  deleteSelectedSli() {
    this.loaderService.display(true);

    this.categoryService
      .deleteSelectedSli(this.project_id, this.boq_id, this.subLineItemArr, this.subLineItemArrForClubbedItem)
      .subscribe(
        res => {
          
          this.showLineItems();
          this.emptyArray();
          this.subLineItemArr = [];
          this.subLineItemArrForClubbedItem = [];
          this.successMessageShow("Selected Sli Deleted Successfully !!");
          this.loaderService.display(false);
        },
        err => {
          
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  mli_type_list: { "name": string; "value": string; }[];
  mli_type: string;
  mli_list: any;
  mli_id: any;
  getProcurementList(){
    this.automated_sli=true;
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
  selected_vendor_product;
  getDetailsOfVendorProduct(product_id,type="single",product?){
    this.loaderService.display(true);
    this.categoryService.getDetailsOfVendorProduct(product_id).subscribe(
        res=>{
            this.selected_vendor_product = res.vendor_product;
            this.sublineItemForm.controls['name'].setValue(this.selected_vendor_product.sli_name);
            this.sublineItemForm.controls['rate'].setValue(this.selected_vendor_product.rate);
            this.sublineItemForm.controls['unit'].setValue(this.selected_vendor_product.unit);
             
            this.sublineItemForm.controls['vendor_id'].setValue(this.selected_vendor_product.vendor_id);
            this.sublineItemForm.controls['vendor_product_id'].setValue(this.selected_vendor_product.id);
            // For Edit Modal 
            if(type=='single'){
              this.update_Sli_Form.controls['name'].setValue(this.selected_vendor_product.sli_name);
              this.update_Sli_Form.controls['rate'].setValue(this.selected_vendor_product.rate);
              this.update_Sli_Form.controls['unit'].setValue(this.selected_vendor_product.unit);
              this.update_Sli_Form.controls['vendor_id'].setValue(this.selected_vendor_product.vendor_id);
              this.update_Sli_Form.controls['vendor_product_id'].setValue(this.selected_vendor_product.id);
              this.vendor_product_id_present = this.selected_vendor_product.id;
            } else if(type=='clubbed'){
              this.update_Club_Sli_Form.controls['name'].setValue(this.selected_vendor_product.sli_name);
              this.update_Club_Sli_Form.controls['rate'].setValue(this.selected_vendor_product.rate);
              this.update_Club_Sli_Form.controls['unit'].setValue(this.selected_vendor_product.unit);
              this.update_Club_Sli_Form.controls['vendor_id'].setValue(this.selected_vendor_product.vendor_id);
              this.update_Club_Sli_Form.controls['vendor_product_id'].setValue(this.selected_vendor_product.id);
              this.vendor_product_id_present = this.selected_vendor_product.id;
            }
        
            this.loaderService.display(false);
            
        },
        error=>{
            
            this.loaderService.display(false);}
    );
  }
  checkDisplayCondition(po_created, po_modifying){
    if (po_created == false){
      this.display = true;
    } else if ((po_created == true) && (po_modifying == false)){
      this.display = false;
    } else if ((po_created == true) && (po_modifying == true)){
      this.display = true;
    }
    return(this.display)
  }
  vendor_products_list;
  sli_item_id;
  getVendorProductsList(event,page?){

    this.mli_id = event;
    for(let obj of this.mli_list){
      if(this.mli_id == obj.vendor_id){
         this.sublineItemForm.controls['rate'].patchValue(obj.vendor_id)

      }

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
                
                this.loaderService.display(false);}
        );
  }

  getVendorProductsList2(searchedItem, page?){
    this.loaderService.display(true);
    this.categoryService.getVendorProductsList2(searchedItem, '', page).
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
        
        this.loaderService.display(false);}
    );
  }

  mastersliArr = [];
  addSublineItem(){
    this.mastersliArr.push(this.sublineItemForm.value)
 
    if(this.additionalSli){
      var obj = {
        line_items: {
          boqjobs: [],
          modular_jobs: [],
          service_jobs: [],
          custom_jobs: [],
          appliance_jobs: [],
          extra_jobs: [],
          clubbed_jobs: [],
          shangpin_jobs:[]
        }
       }
      var obj1 ={
        'sub_line_items': this.mastersliArr
      }
      this.additionalSli = true;
    }else{
      var obj = {
        line_items: {
          boqjobs: this.boqjobs_arr,
          modular_jobs: this.modular_jobs_arr,
          service_jobs: this.service_jobs_arr,
          custom_jobs: this.custom_jobs_arr,
          appliance_jobs: this.appliance_jobs_arr,
          extra_jobs: this.extra_jobs_arr,
          clubbed_jobs: this.clubbed_jobs_arr,
          shangpin_jobs:this.shangpin_jobs_arr //adding custom furniture
        }
      }
      var obj1 ={
        'sub_line_items': this.mastersliArr
      }
      this.additionalSli = false;
    }

    var object = $.extend({}, obj, obj1);

    this.categoryService
      .ADDSlis(this.project_id, this.boq_id, object)
      .subscribe(
        res => {
          
          // $("#addSli").modal("hide");
          this.mastersliArr = [];
          // this.additionalSli = false;
          this.showLineItems();
          this.emptyArray();
          this.openAddSliModal(this.LineItem, this.LineItemType);
          this.successMessageShow("Sli Added Successfully !!");
          this.resetAddSli();
          this.loaderService.display(false);
        },
        err => {
          
          $("#addSli").modal("hide");
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
    

  }
  job_elements_arr_alter:any = [];
  changeViewOption(id,club?){
    this.sli_options_id = id;
    
    this.loaderService.display(true);
    if(!club){
    this.categoryService.changeMasterSLIForClubbed(this.project_id,this.boq_id,this.sublineId,this.sli_options_id
      ).subscribe(
     res=>{
        this.successalert = true;
        this.successMessage = "Alternative updated successfully";
        (<any>$('#viewOptionsModal')).modal('hide');
        
        this.showLineItems();
        // this.showLineItems(this.boq_id,this.selectedBOQIndex);
        var data ={
          'id': this.boq_id,
          'project_id':this.project_id
        }
        setTimeout(function() {
            this.successalert = false;
        }.bind(this), 2000);
        this.selected_view_option = undefined;
        this.loaderService.display(false);
     },
     error=>{
         
         this.loaderService.display(false);}
   );
     }
     else{
      this.categoryService.changeMasterSLIForClubbedView(this.project_id,this.boq_id,this.listSliInClubbedStringify,this.sli_options_id
        ).subscribe(
       res=>{
          this.successalert = true;
          this.successMessage = "Alternative updated successfully";
          (<any>$('#viewClubbedOptionsModal')).modal('hide');
          $('#clubbedView').modal('show');
          $('.modal').css('overflow-y', 'auto');
          // this.showLineItems();
          // this.showLineItems(this.boq_id,this.selectedBOQIndex);
          var data ={
            'id': this.boq_id,
            'project_id':this.project_id
          }
          this.getClubbedViewDetails();
          this.showLineItems();
          this.listSliInClubbed=[];
          
          
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 2000);
          this.selected_view_option = undefined;
          this.loaderService.display(false);
       },
       error=>{
           
           $('#clubbedView').modal('show');
           (<any>$('#viewClubbedOptionsModal')).modal('hide');
           this.errorMessageShow(JSON.parse(error["_body"]).message);
           this.loaderService.display(false);}
     );
     }

  }
  replaceString(input){
    return (input.replace(/_/g, ' ')).toUpperCase();

  }
  listSliInClubbed=[];
  listSliInClubbedStringify;
  editClubSli(clubSli){
    $("#editclubbedSli").modal("hide");
    $("#clubbedView").modal("hide");
    
    this.listSliInClubbed=[];
    clubSli.subline_items.forEach(sli => {
      this.listSliInClubbed.push(sli.id);
    });
    this.disable_field = false;
    this.listSliInClubbedStringify=JSON.stringify(this.listSliInClubbed);
    this.getUOMList();
    this.getVendorList();
    
    this.setEditClubSliForm(clubSli);
    
    if(clubSli.vendor_product_id){
      this.disable_field = true;
      this.vendor_product_id_present = clubSli.vendor_product_id;
      this.getProcurementList();

    }
    else{
      this.vendor_product_id_present = '';
    }
    
  }

  setEditClubSliForm(value) {
   
    this.update_Club_Sli_Form.controls["name"].setValue(value.element_name);
    this.update_Club_Sli_Form.controls["rate"].setValue(value.rate);
    this.update_Club_Sli_Form.controls["quantity"].setValue(value.quantity);
    if(value.job_element_vendor_details[0]){
      this.update_Club_Sli_Form.controls["tax_type"].setValue(
        value.job_element_vendor_details[0].tax_type
      );
      this.update_Club_Sli_Form.controls["tax_percent"].setValue(
        value.job_element_vendor_details[0].tax_percent
      );
      
      this.update_Club_Sli_Form.controls["vendor_name"].setValue(
        value.job_element_vendor_details[0].vendor_name
      );
      this.selectVendor(value.job_element_vendor_details[0].vendor_id);
      
    }
    else{
      this.update_Club_Sli_Form.controls["tax_type"].setValue(
        ''
      );
      this.update_Club_Sli_Form.controls["tax_percent"].setValue(
        ''
      );
      
      this.update_Club_Sli_Form.controls["vendor_name"].setValue(
        ''
      );
      this.selectVendor('');
    }
    if(value.unit){
      this.update_Club_Sli_Form.controls["unit"].setValue(value.unit);
    }
    else{
      this.update_Club_Sli_Form.controls["unit"].setValue('');
    }
    
  }

  UpdateClubSli() {
    var obj = [{
      name: this.update_Club_Sli_Form.controls["name"].value,
      rate: this.update_Club_Sli_Form.controls["rate"].value,
      quantity: this.update_Club_Sli_Form.controls["quantity"].value,
      tax_type: this.update_Club_Sli_Form.controls["tax_type"].value,
      tax_percent: this.update_Club_Sli_Form.controls["tax_percent"].value,
      unit: this.update_Club_Sli_Form.controls["unit"].value,
      vendor_id: this.update_Club_Sli_Form.controls["vendor_id"].value,
      vendor_product_id: this.vendor_product_id_present? this.vendor_product_id_present:'',
      job_elements: this.listSliInClubbed
    }];
 
 let data= {'clubbed_sub_line_items': obj}   

    this.loaderService.display(true);

    this.categoryService.UpdateClubbedSlis(this.project_id, this.boq_id,data).subscribe(
        res => {
          
          $("#editClubModal").modal("hide");
          $("#clubbedView").modal("show");
          this.getClubbedViewDetails();
          this.showLineItems();
          this.successMessageShow("CLubbed SLI Updated Successfully !!");
          // this.loaderService.display(false);
          this.listSliInClubbed=[];
          this.clubbedUpdate = this.formBuilder.group({
            'clubbed':new FormArray([])
          })
          this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
          this.clubbedView_editable=[];
        },
        err => {
          
          $("#editClubModal").modal("show");
           
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
    
  }

  getMliName(event){
    let searchedItem = event.target.value;
    if(searchedItem.length >= 3) {
      this.getVendorProductsList2(searchedItem)
    }
  }

  retainModalState(modalId,prevModalId){
    $("#"+modalId).modal("hide");
    // $('body').addClass('modal-open');
    $("#"+prevModalId).modal("show");
    $('.modal').css('overflow-y', 'auto');
    this.clubbedUpdate = this.formBuilder.group({
      'clubbed':new FormArray([])
    })
    this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
    this.clubbedView_editable=[];
    this.listSliInClubbed=[];
    this.listSliInClubbedStringify=[];
  }
  sliDetail;
  getSliDetails(jobElementID){
    $("#clubbedView").modal("hide");
    this.loaderService.display(true);
    this.categoryService
      .getSliDetails(this.project_id, this.boq_id,jobElementID)
      .subscribe(
        res => {
          this.sliDetail=res;
          this.loaderService.display(false);
          this.listSliInClubbed=[];
        },
        err => {
         
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
  }
  //open modal box for editing
  
  openEditClubbedSliModal(){
      this.getVendorList();
      $("#clubbedView").modal("hide");  
      this.getClubbedViewDetails(); 
      this.createClubbedForm();
      this.automated_sli=false;
  }
  openUomModal(){
     var popup = document.getElementById("myPopup");
     popup.classList.toggle("show");
      $('#popup.classList').toggle("show");

  }

  getEditClubbedSlisList(){
    this.automated_sli=true;
    $("#editclubbedSli").modal("show");  
      this.getClubbedViewDetails(); 
      this.clubbedUpdate = this.formBuilder.group({
        'clubbed':new FormArray([])
      })
      this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
      this.clubbedView_editable=[];
  }
  
  //create clubbed mass edition form
  clubbedFormGroup;
  clubbedView_editable=[];
  createClubbedForm(){
     
    this.customClubbedView.forEach((item,index) => {
      if(this.checkDisplayCondition(item.po_created, item.modifying_po)){
        this.clubbedView_editable.push(item);
            
      }
    });
 
    this.clubbedView_editable.forEach(item => {
      let listOfIds=[];
      let listOfUomUpdated=[]
      item.subline_items.forEach(subline=>{
        listOfIds.push(subline.id);
        listOfUomUpdated.push(false);
         
      })
 
      this.clubbedFormGroup.push(this.formBuilder.group({
        name: [item.element_name, Validators.required],
        rate: [item.rate, [Validators.required,Validators.min(1)]],
        quantity: [item.quantity, Validators.required],
        tax_type: [item.job_element_vendor_details.length>0 ? item.job_element_vendor_details[0].tax_type :  '', Validators.required],
        unit:[item.job_element_vendor_details.length>0 ? item.job_element_vendor_details[0].unit_of_measurement :  '', Validators.required],
        tax_percent: [item.job_element_vendor_details.length>0 ? item.job_element_vendor_details[0].tax_percent : '', Validators.required],
        vendor_id: [item.job_element_vendor_details.length>0 ? item.job_element_vendor_details[0].vendor_id :'',Validators.required],
        vendor_product_id: [item.vendor_product_id],
        job_elements: [listOfIds],
      }))

    });
   
    this.ref.detectChanges();
  }
  // get vendor data for clubbed update
  clslis;
  getVendorForClubbed(addClubbed_Slis){
    this.clslis=addClubbed_Slis;
    this.getVendorList();
    this.getClubbedViewDetails(); 
    this.automated_sli=false;
  }

  //for custome tab active
  openCustomSli(){
    this.automated_sli=false;
    this.createClubbedForm();
  }

  // update mass clubbed edition functionlity///
  error;
  Error;
  nameForm;
  unitForm;
  rateForm;
  taxTypeForm;
  quantityForm;
  vendorForm;
  taxPercentForm;
  values;
  StatusForm;
  validityCheckArray=[];
  UpdateMassClubbedSlis(value){
    this.values=value;
     let valueArray=[];
     this.validityCheckArray=[];
      value.get('clubbed').controls.forEach(group => {
      valueArray.push(group.value)
      this.validityCheckArray.push( {
      name: this.nameForm=group['controls']['name'].status,
      unit: this.unitForm=group['controls']['unit'].status,
      rate: this.rateForm=group['controls']['rate'].status,
      tax_type: this.taxTypeForm=group['controls']['tax_type'].status,
      quantity: this.quantityForm=group['controls']['quantity'].status,
      vendor_id: this.vendorForm=group['controls']['vendor_id'].status,
      tax_percent: this.taxPercentForm=group['controls']['tax_percent'].status,
     })
    });
  
    var obj ={
        'clubbed_sub_line_items': valueArray,   
      }
   
    this.loaderService.display(true);
    this.categoryService.UpdateClubbedSlis(this.project_id, this.boq_id,obj).subscribe(
        res => {
          this.error=res.has_errors;
           if(this.error==true){
            $("#editclubbedSli").modal("show");
             
          }
          if (this.error==false) {
             $("#editclubbedSli").modal("hide");
             this.successMessageShow("CLubbed SLI Updated Successfully !!");
            this.loaderService.display(false);
            this.clubbedUpdate = this.formBuilder.group({
              'clubbed':new FormArray([])
            })
            this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
             this.getClubbedViewDetails();
            this.showLineItems();
            $("#clubbedView").modal("show");
          }
          this.getClubbedViewDetails();
          this.showLineItems();
           
        },
        err => {
           $("#editclubbedSli").modal("show");
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
          this.clubbedUpdate = this.formBuilder.group({
            'clubbed':new FormArray([])
          })
          this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
         }
      );
      this.clubbedView_editable=[];
 
  }

  get clubbed(): FormArray {
    return this.clubbedUpdate.get('clubbed') as FormArray;
  }

  clubbedControls
  disableUomConversion=false;
  uom_convert_list;
  convertRate(clubbedControls){
    
    $("#uomBackground").addClass("bright-effect");

    this.clubbedControls=clubbedControls;
    
    this.updateUOM.controls["currentUnit"].setValue(this.clubbedControls['unit'].value);

    this.updateUOM.controls["unit"].setValue("");
    
    this.updateUOM.controls["original"].setValue(this.clubbedControls['quantity'].value);

    this.updateUOM.controls["updated"].setValue(this.clubbedControls['quantity'].value);
    
    this.disableUomConversion=false;
    
    if(this.clubbedControls['unit'].value==""){
      this.disableUomConversion=true;
    }

    if(this.clubbedControls['unit'].value == 'r_ft'){
      this.uom_convert_list=[
        'r_mt'
      ]
    }
    else if(this.clubbedControls['unit'].value == 'r_mt'){
      this.uom_convert_list=[
        'r_ft'
      ]
    }
    else if(this.clubbedControls['unit'].value == 'nos'){
      this.uom_convert_list=[
        's_ft',
        'sq_m'
      ]
    }
    else if(this.clubbedControls['unit'].value == 's_ft'){
      this.uom_convert_list=[
        'nos',
        'sq_m'
      ]
    }
    else if(this.clubbedControls['unit'].value == 'sq_m'){
      this.uom_convert_list=[
        'nos',
        's_ft'
      ]
    }
  
    this.ref.detectChanges();
  }

  removeUomModal(){
    $("#uomConversionModal").modal("hide");
    $('.modal').css('overflow-y', 'auto');
    $("#uomBackground").removeClass("bright-effect");
  }
  
  updateUomQuantity(){
    let previousUOM=this.updateUOM.controls["currentUnit"].value;
    let previousQuantity=this.clubbedControls['quantity'].value;

    if(previousUOM=='r_ft'){
      
      if(this.updateUOM.controls["unit"].value=='r_ft') {

      }
      if(this.updateUOM.controls["unit"].value=='r_mt') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 0.3048));
      }
    }
    if(previousUOM=='r_mt'){
      
      if(this.updateUOM.controls["unit"].value=='r_mt') {

      }
      if(this.updateUOM.controls["unit"].value=='r_ft') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 3.28084));
      }
    }
    if(previousUOM=='nos'){
      
      if(this.updateUOM.controls["unit"].value=='nos') {

      }
      if(this.updateUOM.controls["unit"].value=='s_ft') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 32));
      }
      if(this.updateUOM.controls["unit"].value=='sq_m') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 2.9729));
      }
    }
    if(previousUOM=='s_ft'){
     
      if(this.updateUOM.controls["unit"].value=='s_ft') {

      }
      if(this.updateUOM.controls["unit"].value=='nos') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 0.03125));
      }
      if(this.updateUOM.controls["unit"].value=='sq_m') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 0.092903));
      }
    }
    if(previousUOM=='sq_m'){

      if(this.updateUOM.controls["unit"].value=='sq_m') {

      }
      if(this.updateUOM.controls["unit"].value=='nos') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 0.3363718));
      }
      if(this.updateUOM.controls["unit"].value=='s_ft') {
        this.updateUOM.controls["updated"].setValue((previousQuantity * 10.7639));
      }
    }
  }

  changeUOM(event){

    let requestData={
      job_elements: this.clubbedControls['job_elements'].value,
      updated_quantity: this.updateUOM.controls["updated"].value,
      new_uom: this.updateUOM.controls["unit"].value,
    }

    this.loaderService.display(true);
    
    let data ={
      'clubbed_sub_line_items': [requestData]  
    }

    this.categoryService.UpdateUom(this.project_id, this.boq_id,data).subscribe(
      res => {
        
        this.clubbedView_editable=[];
        this.clubbedUpdate = this.formBuilder.group({
          'clubbed':new FormArray([])
        })
        
        this.clubbedFormGroup = this.clubbedUpdate.controls['clubbed']['controls'] ;
        
        this.getClubbedViewDetailsObservable().subscribe(res => {
          this.clubbedView=res.custom_slis;
          this.masterClubbedView=res.master_slis;
          this.clubbedView=[...res.custom_slis, ...res.master_slis]
          this.customClubbedView=res.custom_slis;
          
          this.createClubbedForm();
          this.removeUomModal();
          this.loaderService.display(false);
          
          this.successMessageShow("UoM Conversion Successfull !");
          this.showLineItems();
          this.loaderService.display(false); //removing spinner for above api call 
          this.ref.detectChanges();
        },
        err => {
          this.errorMessageShow(JSON.parse(err["_body"]).error);
          this.loaderService.display(false);
        });    
      },
      err => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }  
}
 