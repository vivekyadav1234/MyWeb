import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from "@angular/core";
import { CategoryService } from "../category.service";
import { LoaderService } from "../../../../services/loader.service";
import { environment } from "environments/environment";
import {FinanceService} from '../../../finance/finance.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
declare var $: any;

@Component({
  selector: "po-release",
  templateUrl: "./po-release.component.html",
  styleUrls: ["./po-release.component.css", "../tasks/tasks.component.css"],
  providers: [CategoryService]
})
export class PoReleaseComponent implements OnInit {
  poReleaseCount;
  boq_list;
  project_id;
  boq_id;
  arrow: boolean = true;
  toggle_line_rows: boolean;
  selectedProduct: any;
  @Input() line_item_po: any;
  line_item_in_po;
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  vendor_list;
  toggle = false;
  milestoneForm: FormGroup;
  purchase_order_list;

  constructor(
    private loaderService: LoaderService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private financeService:FinanceService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    
    this.line_item_in_po = this.line_item_po;
    this.project_id = this.line_item_in_po.project_id;
    this.boq_id = this.line_item_in_po.id;

    this.getVendors();
    this.milestoneForm = this.formBuilder.group({
      shipping_address: new FormControl("", Validators.required),
      quotation_id: new FormControl("", Validators.required),
      project_id: new FormControl("", Validators.required),
      vendor_id: new FormControl("", Validators.required),
      status: new FormControl("pending", Validators.required),
      contact_person: new FormControl(""),
      contact_number: new FormControl(""),
      vendor_gst: new FormControl("", Validators.required),
      billing_address: new FormControl("", Validators.required),
      billing_contact_person: new FormControl(""),
      billing_contact_number: new FormControl(""),
      sameAddress: new FormControl(false),
      tag_snag:new FormControl("",Validators.required),
      milestone_elements: this.formBuilder.array([],Validators.required)
    });
    ;
  }
  removeMilestoneElement(i){
    <FormArray>this.milestoneForm.get('milestone_elements')['controls'].splice(i,1);
    this.milestoneForm.controls['milestone_elements'].value.splice(i,1);
    }
  createMilestoneElement(): FormGroup {
    return this.formBuilder.group({
      estimate_date:  new FormControl("",Validators.required),
      percentage_amount:  new FormControl("",Validators.required),
      description:  new FormControl("",Validators.required)
    });
  }

  addMilestoneElement(): void {
    if (this.checkValidity()){
      (<FormArray>this.milestoneForm.controls['milestone_elements']).push(this.createMilestoneElement());
    }
  }
  checkValidity(){
    var totalPercentage = 0;

    if(this.milestoneForm.controls['milestone_elements'].value){
      this.milestoneForm.controls['milestone_elements'].value.forEach(function(element){
        totalPercentage += parseInt(element.percentage_amount || 0)
      })
    }

    if(totalPercentage > 100){
      alert("cannot be more than 100%.")
      // $("#milestoneSubmitBtn").attr("disabled", true);
      return false;
    } else{
      var shipping_addr = this.milestoneForm.controls.shipping_address.value;
      var billing_addr = this.milestoneForm.controls.billing_address.value;
      
      
      if(shipping_addr && billing_addr){

        // $("#milestoneSubmitBtn").attr("disabled", false);
      }
      return true;
    }
  }

  vendor_item;
  getVendors() {
    this.loaderService.display(true);
    this.categoryService.getVendorsInPo(this.line_item_in_po.id).subscribe(
      res => {
        
        this.vendor_list = res.vendor_details;
        this.vendor_item = res.vendor_items;
        this.purchase_order_list = res.purchase_orders;
        this.ref.detectChanges()
        this.loaderService.display(false);
      },
      err => {
        
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

  finalsubmission() {
    var obj = {
      purchase_order: this.milestoneForm.value,
      purchase_elements: this.selectedItem
    };
    ;
    if(this.checkValidity() && this.checkMilestonePercentage()){
      this.loaderService.display(true);
      this.categoryService.finalsubmissionOfPO(obj).subscribe(
        res => {
          
          $("#CreatePOModal").modal("hide");
          this.milestoneForm.reset();
          this.successMessageShow("PO Created  Successfully !!");
          this.rowSelected = -1;
          this.selectedItem = [];
          this.loaderService.display(false);
          this.getVendors();
          
        },
        err => {
          
          this.errorMessageShow(JSON.parse(err["_body"]).message);
          this.loaderService.display(false);
        }
      );
    }
  }
  checkMilestonePercentage(){

    var totalPercentage = 0;
    
    
    if(this.milestoneForm.controls['milestone_elements'].value){
      this.milestoneForm.controls['milestone_elements'].value.forEach(function(element){
        totalPercentage += parseInt(element.percentage_amount || 0)
      })
    }
    if((totalPercentage < 100) && (this.milestoneForm.controls['milestone_elements'].value.length > 0)){
      alert("cannot be less than 100%.")
      // $("#milestoneSubmitBtn").attr("disabled", true);
      return false;
    } else {
      return true;
    }
  }

  selectedrow;
  itemList: any;
  // toggleRow(row){
  //    this.selectedrow = row.id;
  //    $(".expanded-col").css("display", "none");
  //    $(".expanded-col-"+ this.selectedrow).css("display", "table-row");
  //    for(let obj of this.vendor_list){
  //      if(obj.id == this.selectedrow){
  //        if(obj.element_count > 0){
  //          this.itemList = obj.job_elements
  //        }
  //        

  //      }
  //    }

  // }
  rowSelected: any;
  toggleRow(row) {
    this.selectedrow = row.id;
    if (this.rowSelected === -1) {
      this.rowSelected = row.id;
    } else {
      if (this.rowSelected == row.id) {
        this.rowSelected = -1;
      } else {
        this.rowSelected = row.id;
      }
    }
    for (let obj of this.vendor_list) {
      if (obj.id == this.selectedrow) {
        if (obj.element_count > 0) {
          this.itemList = obj.job_elements;
        }
        ;
      }
    }

    ;
  }

  toggleRowPO(row) {
    if (this.selectedrow != row.id) {
      this.selectedItem = [];
    }
    this.selectedrow = row.po_details.id;
    if (this.rowSelected === -1) {
      this.rowSelected = row.po_details.id;
    } else {
      if (this.rowSelected == row.po_details.id) {
        this.rowSelected = -1;
      } else {
        this.rowSelected = row.po_details.id;
      }
    }
    for (let obj of this.purchase_order_list) {
      ;
      if (obj.po_details.id == this.selectedrow) {
        if (obj.po_details.job_elements.length > 0) {
          this.itemList = obj.po_details.job_elements;
          ;
        }
      }
    }

    ;
  }
  selectId;
  clickRow(id) {
    ;
    this.selectId = id;
  }
  selectedItem = [];
  parentCheckbox_id = -1;
  child_parent = -1;
  toggleAll(event,obj) {
    if (event.target.checked) {
      if(this.parentCheckbox_id == -1 || this.parentCheckbox_id == obj.id){
        this.itemList.forEach(item => {
          item.checked = true;
          if (!this.selectedItem.includes(item.job_element_id)) {
            this.selectedItem.push(item.job_element_id);
          }
          ;
        });
        
        this.parentCheckbox_id = obj.id;
        this.child_parent = obj.id;

      }
      else{
        obj.checked = false;
        $('#checkAll-'+obj.id).prop('checked', false);
        alert("you already select a PO From another vendor");
        

      }
    } else {
      this.itemList.forEach(item => {
        item.checked = false;
        this.selectedItem = [];
        this.parentCheckbox_id = -1;
        ;
      });
    }
  }

  gst_list;
  address_list = [];
  address_list_billing = [];
  vendor_id;
  CreateModal(value) {
    if (this.selectedItem.length > 0) {
      $("#CreatePOModal").modal("show");
      this.getAddress();
      this.gst_list = value.gst_no;
      this.vendor_id = value.id;
      this.milestoneForm.controls["quotation_id"].patchValue(this.boq_id);
      this.milestoneForm.controls["project_id"].patchValue(this.project_id);
      this.milestoneForm.controls["vendor_id"].patchValue(this.vendor_id);
      this.milestoneForm.controls["status"].patchValue('pending');
    } else {
      alert("Please Select Atleast One Line Item");
    }
  }
  address_list1;
  getAddress() {
    this.categoryService.getAddressForPO(this.project_id).subscribe(
      res => {
        
        this.address_list = [];
          this.address_list = [
            {
              label: "Arrivae Store",
              contact: "9900234020",
              name: "Vinay R",
              address:
                     "Arrivae Factory Lakhs Modular Furniture,Herohalli Cross, Magadi Main Road, Bangalore 560091"            },
            {
              label: "Arrivae Warehouse",
              contact: "9833950750",
              name: "Rajeev Jha",
              address:"Arrivae Warehouse, Boxmyspace, Bldg no. A-6, Gala no 8 to 11,Harihar Compound, Mankoli Naka,Mumbai Nashik Highway, Bhiwandi 421302",
            },
            {
              label: "Bengaluru Warehouse",
              contact: "9743258596",
              name:"Abhijith",
              address: "88/89, Basement, Muthuraya Swamy Layout, P&T Colony, Telephone Employees Layout, Sunkadakatte, Colony, Telephone Employees Layout,Sunkadakatte,Karnataka 560091"
            },
            {
              label: "Pune Warehouse",
              contact: "9975304669",
              name:"Jayesh Bhawar",
              address: "Gate no- 467/3, Post Kelevadi, Pune – Bangalore Highway, Near Khed – Shivapur toll plaza, Pune 412213."
            },
            {
              label: "ANDHERI EC  (For Hardware and LF)",
              contact: "",
              name:"",
              address: "B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 "
            },
            {
              label: "RAWAT BROTHERS FURNITURE PVT. LTD, (For Raw Material)",
              contact: "9130606486",
              name:"Laxman",
              address: "Shri Shankar Udyog, Gat No. 486/ 487, Village Kelawade, Tal. Bhor,Pune Bangalore NH4, Dist. Pune - 412213 . GSTIN/UIN: 27AACCR8098J1ZQ"
            },
            {
              label: "Arrivae Bangalore Factory",
              contact: "9900234020",
              name:"Vinay",
              address: "Artiiq Interia, No. 123, Kiadb Industrial Area,1st Phase, Harohalli, Kanakapura, Ramanagara Dist. 562112"
            }
          ];
        if(res){
          this.address_list1 = res;
          for(let i =0 ;i<this.address_list1.length;i++){

            this.address_list.push({label:this.address_list1[i].name,name:this.address_list1[i].name,contact:this.address_list1[i].name,address:this.address_list1[i].address,})

          }

        }
        
        this.address_list_billing = [
          {
            label: "Arrivae Karnataka",
            contact: "",
            name:"",
            address: `SINGULARITY FURNITURE PRIVATE LIMITED,5th Floor, Umiya Business Bay, Tower 2, Cessna Business Park,Vartur Hobli, Outer Ring Road, Kadubeesanahalli, Bengaluru(Bangalore) Urban, Karnataka, 560037,GST Number: 29AAECP3450G1ZF `,
          },
          {
            label: "Arrivae Maharashtra",
            contact: "",
            name:"",
            address:`SINGULARITY FURNITURE PRIVATE LIMITED B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 GST Number: 27AAECP3450G1ZJ`,
          },
          {
            label: "Arrivae Tamil Nadu",
            contact: "",
            name:"",
            address:`SINGULARITY FURNITURE PRIVATE LIMITED, 26B, Bharati Villas Jawaharlal Nehru Salai, Ekkaduthangal,Guindy Industrial Estate, Chennai, Chennai, Tamil Nadu, 600032,GST Number: 33AAECP3450G1ZQ`,
          },
          {
            label: "Arrivae Telangana",
            contact: "",
            name:"",
            address:` SINGULARITY FURNITURE PRIVATE LIMITED,5th floor, Survey No. 8, Purva Summit, Kondapur Village, WhiteField Road, Opposite Tech Mahindra, Hi-Tech City, Phase-II,Hyderabad, Telangana, 500081,GST Number: 36AAECP3450G1ZK`,
          },
          {
            label: "Arrivae West Bengal",
            contact: "",
            name:"",
            address:`SINGULARITY FURNITURE PRIVATE LIMITED 5, Dharamtolla Street, Kolkata, West Bengal, 700013,GST Number: 19AAECP3450G1ZG`,
          },
          {
            label: "WFX Technologies",
            contact: "9560915790",
            name:"Lokesh",
            address:`WFX Technologies Private Limited, B-13, Infocity-1, Sector-34, Gurugram - 122001, Haryana,GST No. : 06AAACW7299J1ZQ`,
          }
        ];
        ;

        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  toggleItem(event, item, obj) {
    // item.checked = !item.checked;
    item.checked = event.target.checked;
    // this.toggle = this.itemList.every(item => item.checked);
    if (event.target.checked) {
      if(obj.id == this.parentCheckbox_id || this.parentCheckbox_id == -1){
        obj.checked = true;
        this.parentCheckbox_id = obj.id;
        // 
        if(item.job_element_id.length==1){
          if (!this.selectedItem.includes(item.job_element_id[0])) {
            this.selectedItem.push(item.job_element_id[0]);
            ;
          }
        }else{
          item.job_element_id.forEach(job_id => {
            if(!this.selectedItem.includes(job_id)){
              this.selectedItem.push(job_id);
            }
          });
        }
      }
      else{
        item.checked = false;
        $('#checkItem-'+item.job_element_id).prop('checked', false);
        
        alert("you already select a PO From another vendor");
      }
    } else {
      this.selectedItem.forEach((element, index) => {
        // 
        if(item.job_element_id.length==1){
          if (item.job_element_id[0] == element) {
            this.selectedItem.splice(index, 1);
            if (this.selectedItem.length == 0) {
              obj.checked = false;
            }
          }
        }else{
          item.job_element_id.forEach(job_id => {
            if(job_id==element){
              this.selectedItem.splice(index,1);
              if(this.selectedItem.length==0){
                obj.checked =false;
              }
            }
          });
        }
      });
      // 
      if (this.selectedItem.length <= 0) {
        
        obj.checked = false;
      }
    }
    // 
    ;
  }

  selectAddressBilling = "Saved Billing Addresses";
  setShippingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressBilling = event.target.value;
    if (event.target.value === "Saved Shipping Addresses") {
      this.showShipAddress = false;

      this.milestoneForm.controls["shipping_address"].patchValue("");
      this.milestoneForm.controls["contact_number"].patchValue("");
      this.milestoneForm.controls["contact_number"].patchValue("");
    } else {
      for (let i = 0; i < this.address_list.length; i++) {
        if (event.target.value == this.address_list[i].label) {
          this.milestoneForm.controls["shipping_address"].patchValue(
            this.address_list[i].address
          );
          this.milestoneForm.controls["contact_person"].patchValue(
            this.address_list[i].name
          );
          this.milestoneForm.controls["contact_number"].patchValue(
            this.address_list[i].contact
          );
          break;
        }
      }
    }
    
    this.mergeAddressesAction(); //this will check if the same shipping and billing address checkbox is selected or not and act accordingly
  }
  selectAddressShipping = "Saved Shipping Addresses";
  setBillingAddress(event) {
    this.milestoneForm.controls["sameAddress"].patchValue(false);
    this.selectAddressShipping = event.target.value;

    if (event.target.value === "Saved Billing Addresses") {
      this.showBillAddress = false;

      this.milestoneForm.controls["billing_address"].patchValue("");
      this.milestoneForm.controls["billing_contact_person"].patchValue("");
      this.milestoneForm.controls["billing_contact_number"].patchValue("");
    } else {
      for (let i = 0; i < this.address_list_billing.length; i++) {
        if (event.target.value == this.address_list_billing[i].label) {
          this.milestoneForm.controls["billing_address"].patchValue(
            this.address_list_billing[i].address
          );
          this.milestoneForm.controls["billing_contact_person"].patchValue(
            this.address_list_billing[i].name
          );
          this.milestoneForm.controls["billing_contact_number"].patchValue(
            this.address_list_billing[i].contact
          );
          break;
        }
      }
    }

    this.showShipAddress = true;

    // ;
  }
  createPO() {
    
    $("#CreatePOModal").modal("hide");
    $("#previewModal").modal("show");
  }
  isChecked = false;
  mergeAddressesAction() {
    if (this.milestoneForm.controls["sameAddress"].value) {
      this.milestoneForm.controls["billing_address"].patchValue(
        this.milestoneForm.controls["shipping_address"].value
      );
      this.milestoneForm.controls["billing_contact_person"].patchValue(
        this.milestoneForm.controls["contact_person"].value
      );
      this.milestoneForm.controls["billing_contact_number"].patchValue(
        this.milestoneForm.controls["contact_number"].value
      );
    } else {
      this.selectAddressShipping = "Saved Shipping Addresses";
      this.milestoneForm.controls["billing_address"].patchValue("");
      this.milestoneForm.controls["billing_contact_person"].patchValue("");
      this.milestoneForm.controls["billing_contact_number"].patchValue("");
    }
    $("#shippingList").prop("selectedIndex", 0);
    /*when the user selects the same billing address as shipping address the drop down of the billing address
      will be set to default  */
  }
  showBillAddress = false;
  showBillingAddress() {
    //toggles the billingAddress forms in the dom
    this.showBillAddress = !this.showBillAddress;
  }

  showShipAddress = false;
  showShippingAddress() {
    //toggles the shippingAddress forms in the dom
    this.showShipAddress = !this.showShipAddress;
  }
  resetForm() {
    this.milestoneForm.reset();
  }
  cancelPurchaseOrder(purchase_order_id) {
    this.loaderService.display(true);
    this.categoryService.cancelPurchaseOrder(purchase_order_id).subscribe(
      res => {
        this.successMessageShow("Cancelled successfully!");
        this.getVendors();
        this.loaderService.display(false);
      },
      err => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }
  po_preview_pdf_url: any;
  purchase_order_id;
  po_preview_pdf_url_without_base_url: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  getPOPdfForPreview(purchase_order_id?) {
    this.po_preview_pdf_url = undefined;
    if (purchase_order_id) {
      this.purchase_order_id = purchase_order_id;
      // this.downloadPoRelease(this.purchase_order_id);
    }
    this.loaderService.display(true);
    this.categoryService.getPOPdfForPreview(this.purchase_order_id).subscribe(
      res => {
        this.po_preview_pdf_url_without_base_url = JSON.parse(res._body).path;
        this.po_preview_pdf_url =
          environment.apiBaseUrl + JSON.parse(res._body).path;
        if (this.po_preview_pdf_url == "" || this.po_preview_pdf_url == null) {
          this.erroralert = true;
          this.errorMessage = "Pdf not found for preview!!";
          setTimeout(
            function() {
              this.erroralert = false;
            }.bind(this),
            2000
          );
          $("#poPreviewModal").modal("hide");
        }
        this.loaderService.display(false);
      },
      err => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function() {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        $("#poPreviewModal").modal("hide");
        this.loaderService.display(false);
      }
    );
  }
  releasePO(id) {
    this.loaderService.display(true);
    this.categoryService.releaseOrder(id).subscribe(
      res => {
        this.getVendors();
        
        this.successMessageShow("Released Successfully !!");
        this.loaderService.display(false);
      },
      err => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }
  modifyPO(id) {
    
    this.loaderService.display(true);
    this.categoryService.modifyOrder(id).subscribe(
      res => {
        
        this.successMessageShow("You can edit SLI.");
        this.getVendors();
        this.loaderService.display(false);
      },
      err => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }
  releaseModifiedPO(id) {
    this.loaderService.display(true);
    this.categoryService.releaseModifiedOrder(id).subscribe(
      res => {
        this.getVendors();
        
        this.successMessageShow("Released Successfully !!");
        this.loaderService.display(false);
      },
      err => {
        this.errorMessageShow(JSON.parse(err["_body"]).message);
        this.loaderService.display(false);
      }
    );
  }
  deletePOPreviewPdf(id) {
    this.categoryService.deletePOPdf(id).subscribe(
      res => {
        
        $("#poPreviewModal").modal("hide");
        this.po_preview_pdf_url = null;
      },
      err => {
        this.errorMessage = JSON.parse(err["_body"]).message;
        this.erroralert = true;
        setTimeout(
          function() {
            this.erroralert = false;
          }.bind(this),
          13000
        );
        this.loaderService.display(false);
      }
    );
  }
}
