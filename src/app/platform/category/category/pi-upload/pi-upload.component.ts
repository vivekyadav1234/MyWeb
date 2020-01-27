import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import { FormBuilder, Validators, FormGroup } from '../../../../../../node_modules/@angular/forms';
declare var $:any;

@Component({
  selector: 'pi-upload',
  templateUrl: './pi-upload.component.html',
  styleUrls: ['./pi-upload.component.css']
})
export class PiUploadComponent implements OnInit {
  headers_res;
  per_page;
  total_page;
  current_page;
  project_list: any;
  project_id=-1;
  boq_list: any;
  boq_id=-1;
  selected_boq_list=[];
  pi_list: any = [];
  po_pi_list: any = [];
  selected_boq: any;
  piform: FormGroup;
  // selected_lineitem;
  selected_pi_item: any = [];
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
  attachmentFile_basefile : any;
  attachmentFile:any;

  constructor(private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder) { 
      this.piform = formBuilder.group({
        'vendor' : ['', Validators.required],
        'boq': ['', Validators.required],
        'cost': [0, Validators.required],
        'description': [''],
        'tax_value': [0, Validators.required],
        'file': [''],
      });
    }

  ngOnInit() {
    this.getProjectList(1);
    this.listVendors();
  }

  searchCategoryProjects(searchparam){
    this.loaderService.display(true);
    if(searchparam != ""){
      this.getProjectList(1,searchparam);
    }else {
      this.getProjectList(1);
    }
  }

  getProjectList(page?, searchparam = ""){
    this.loaderService.display(true);

  	this.categoryService.getPIUploadProjectList(page, searchparam).subscribe(
  		res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        
        this.project_list = res.quotations;
        this.project_list.forEach(project => project['expanded'] = false);
        this.loaderService.display(false);
  		},
  		err=>{
  			
         this.loaderService.display(false);
  		});
  }

  boq_reference:any = ""
  showBOQList(proj_id,boq_id,index, boq_reference){
    this.project_id = proj_id;
    this.boq_id = boq_id;
    this.boq_reference = boq_reference;

    this.piform.patchValue({boq: this.boq_id});

    this.loaderService.display(true);
    this.showPoList();
    this.showPiList();
    this.showPoPiMappingList();
    this.listProjectVendors();
  }

  vendorlist=[];
  listVendors(){
    this.loaderService.display(true);
    this.categoryService.filteredVendors("","",
      "","").subscribe(
      res =>{
        this.vendorlist=res.vendors;
        this.loaderService.display(false);
        
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }
  showVendorList(){
    this.listVendors();
  }

  listProjectVendors(){
    this.loaderService.display(true);
    this.categoryService.projectVendors(this.project_id,this.boq_id).subscribe(
      res =>{
        this.vendorlist=res;
        this.loaderService.display(false);
        
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  toggleRow(row,i) {
    this.project_list.forEach(project => {
      if(row.id !== project.id){
        project['expanded'] = false;
      }else {
        row.expanded = !row.expanded;
      }
    });
    // this.boq_id = -1;
    this.selected_boq = {};
    this.pi_list=[];
    this.po_pi_list=[];
  }

  showLineItem(row){
    this.boq_list.forEach(boq => boq['active'] = false);
    this.boq_id = row.id;
    this.selected_boq = row;
    this.showPiList();
    this.showPoPiMappingList();
    row.active = true;
  }

  po_list:any = []
  showPoList(){
      this.loaderService.display(true);
        this.categoryService.getPOByQuotation(this.project_id,this.boq_id).subscribe(
        res => {
          this.loaderService.display(false);
          res = res.json();
          this.po_list = res.quotation.purchase_orders;
          
        },
        err => {
          this.loaderService.display(false);
        }
      );
  }

  showPiList(){
      this.loaderService.display(true);
      
        this.categoryService.getPerformaInvoicesByQuotation(this.project_id,this.boq_id).subscribe(
        res => {
          this.loaderService.display(false);
          res = res.json();
          this.pi_list = res.performa_invoices;
          
        },
        err => {
          this.loaderService.display(false);
        }
      );
  }
  showPoPiMappingList(){
      this.loaderService.display(true);
        this.categoryService.getPoPiMappingByQuotation(this.project_id,this.boq_id).subscribe(
        res => {
          this.loaderService.display(false);
          res = res.json();
          this.po_pi_list = res.pairings;
          
        },
        err => {
          this.loaderService.display(false);
        }
      );
  }

  uploadPi(){
    this.loaderService.display(true);
        this.categoryService.createPerformaInvoice(this.project_id,
        this.piform.controls["boq"].value,
        this.piform.controls["vendor"].value,
        this.piform.controls["cost"].value,
        this.piform.controls["description"].value,
        this.piform.controls["tax_value"].value,
        this.piform.controls["file"].value,
      ).subscribe(
        res => {
          this.loaderService.display(false);
          this.piform.reset();
          this.piform.patchValue({boq: this.boq_id});
          $(".pi-file").val("");
          this.piform.controls['cost'].setValue(0);
          this.piform.controls['tax_value'].setValue(0);
          $(".total_cost").val("");
            this.successalert = true;
            $('#closePiModal').click();
            this.successMessage = "Pi uploaded successfully";
            setTimeout(function() {
                this.successalert = false;
             }.bind(this), 2000);
             this.showPiList();
        },
        err => {
          this.loaderService.display(false);
        }
      );
  }

  resetForm(){
    this.piform.reset();
    $(".pi-file").val("");
    this.piform.patchValue({boq: this.boq_id});
    this.piform.controls['cost'].setValue(0);
    this.piform.controls['tax_value'].setValue(0);
    $(".total_cost").val("");
  }

  calculateAmount(){
    var base_cost = parseInt(this.piform.controls["cost"].value,10);
    var tax_value = parseInt(this.piform.controls["tax_value"].value,10);

    var final_amount = base_cost + (tax_value*base_cost)/100
    $(".total_cost").val(final_amount);
  }


  total_po_amt = 0;
  selected_povendor_list = [];
  selectPOArray(event, amt, vendor){
    let value = event.target.value;
    if(this.selected_po_item.includes(value)){
      var index = this.selected_po_item.indexOf(value);
      if (index > -1) {
        this.selected_po_item.splice(index, 1);
      }
      var povendorindex = this.selected_povendor_list.indexOf(vendor);
      if (povendorindex > -1) {
        this.selected_povendor_list.splice(povendorindex, 1);
      }
      this.total_po_amt = this.total_po_amt-parseInt(amt)
    }
    else{
      this.selected_po_item.push(value);
      this.selected_povendor_list.push(vendor);
      this.total_po_amt = this.total_po_amt+parseInt(amt)
    }
    this.selected_povendor_list = this.selected_povendor_list.filter((elem, pos, arr) => arr.indexOf(elem) == pos)
  }

  total_pi_amt = 0;
  selected_pivendor_list = [];
  selectPIArray(event, amt, vendor){
    let value = event.target.value;
    if(this.selected_pi_item.includes(value)){
      var index = this.selected_pi_item.indexOf(value);
      if (index > -1) {
        this.selected_pi_item.splice(index, 1);
      }
      var pivendorindex = this.selected_pivendor_list.indexOf(vendor);
      if (pivendorindex > -1) {
        this.selected_pivendor_list.splice(pivendorindex, 1);
      }
      this.total_po_amt = this.total_po_amt-parseInt(amt)
      this.total_pi_amt = this.total_pi_amt-parseInt(amt)
    }
    else{
      this.selected_pi_item.push(value);
      this.selected_pivendor_list.push(vendor);
      this.total_pi_amt = this.total_pi_amt+parseInt(amt)
    }

    this.selected_pivendor_list = this.selected_pivendor_list.filter((elem, pos, arr) => arr.indexOf(elem) == pos)
  }

  error_flag:any = false;
  checkPoPiMapping(){
    if(this.total_po_amt != this.total_pi_amt){
      
      
      if(this.selected_povendor_list.length == this.selected_pivendor_list.length && this.selected_povendor_list[0] == this.selected_pivendor_list[0]){
        this.error_flag = false;
      }
      else{
        this.error_flag = true;
      }
      $('#alertModal').modal("show");
    }
    else{
      this.createPoPiMapping();
    }
  }
  selected_po_item:any= [];
  createPoPiMapping(){
    this.loaderService.display(true);
    if(this.selected_po_item.length > 0 && this.selected_pi_item.length > 0){
        this.categoryService.createPoPiMapping(this.project_id,
         this.boq_id,
         this.selected_po_item,
         this.selected_pi_item
      ).subscribe(
        res => {
          this.loaderService.display(false);
          this.piform.reset();
          this.showPoPiMappingList();
          this.successalert = true;
          
          this.successMessage = "PO PI mapped successfully.";
          setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
          this.selected_po_item = [];
          this.selected_pi_item = [];
          $('input:checkbox').prop("checked", false);
          $('#alertModal').modal("hide");
        },
        err => {
          
          this.erroralert = true;
            this.errorMessage = "Something went wrong. The PI to PO mapping could not be done.";
            setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
          this.loaderService.display(false);
        }
      );} else {
        this.loaderService.display(false);
        this.erroralert = true;
          this.errorMessage = 'Select PO and PI for mapping.';
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
      }
  }

  updateFile(event){
    if (event.srcElement.files && event.srcElement.files[0]) {
      
      this.attachmentFile = event.srcElement.files[0];
      var fileReader = new FileReader();
      var base64;
       fileReader.onload = (fileLoadedEvent) => {
        base64 = fileLoadedEvent.target;
        this.attachmentFile_basefile = base64.result;
        this.piform.patchValue({file: this.attachmentFile_basefile});
      };

      fileReader.readAsDataURL(this.attachmentFile);

    }
  }
}
