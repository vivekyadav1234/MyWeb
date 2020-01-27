import { Component, OnInit,Input } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'payments-release',
  templateUrl: './payments-release.component.html',
  styleUrls: ['./payments-release.component.css','../tasks/tasks.component.css'],
  providers: [CategoryService]
})
export class PaymentsReleaseComponent implements OnInit {

	headers_res;
  per_page;
  arrow:boolean = true;
  total_page;
  current_page;
  project_list;
  project_id;
  paymentForm: FormGroup;
  dropdownList2=[];
  boq_id;
  line_item_in_po;
  @Input() line_item_po: any;
  dropdownSettings2 ={
    singleSelection: false,
    text:  "Line Items" ,
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class-dropdown",
    
  }

  constructor(
  	private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  	this.line_item_in_po = this.line_item_po;
    this.project_id = this.line_item_in_po.project_id;
    this.boq_id = this.line_item_in_po.id;
    this.getPOPaymentList();
  	this.paymentForm = this.formBuilder.group({
      'performa_invoice_id': ['', Validators.required],
      'description': ['', Validators.required],
      'percentage': ['', Validators.required],
      'attachment': ['']
    });
  }
  po_pi_list;
  getPOPaymentList(){
    this.loaderService.display(true);
    this.categoryService.getPOPaymentList(this.boq_id).subscribe(
      res=>{
        
        this.po_pi_list = res.purchase_orders;
        this.getPIitemList(this.po_id_selected)
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
    });

  }



  rowSelected:any;
  invoice_list;
  //for collapsable row table
  toggleRow(row) {
    if (this.rowSelected === -1) {
      this.rowSelected = row.po_details.id
    }
    else {
      if (this.rowSelected == row.po_details.id) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = row.po_details.id
      }

    }
    this.invoice_list = row.invoice_details

    
    
  } 
  po_id_selected;
  SHowRaiseRequest(po_id){
    this.po_id_selected = po_id;

  }
   

  boq_list=[];

  select_boq_id;
  select_project_id;




  selected_boq;
  selectBoq(boqobj,elem?,projectid?){
    this.selected_boq = boqobj;
    var elems= document.getElementsByClassName('active-text');
    for(var i=0;i<elems.length;i++){
      elems[i].classList.remove('active-text');
    }
    if(elem){
      elem.classList.add('active-text');
    }

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
    }.bind(this), 5000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 5000);
  }




  file_name:any = "";
  submitted = false;
  attachment_file;
  basefile: any;
  onChange(event) {
    this.file_name = event.target.files[0].name
    this.attachment_file =event.target.files[0] || event.srcElement.files[0];
     var fileReader = new FileReader();
        var base64;
         fileReader.onload = (fileLoadedEvent) => {
          base64 = fileLoadedEvent.target;
          this.basefile = base64.result;
          //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
        };
     fileReader.readAsDataURL(this.attachment_file);
   }
  invoice_id;
  openInvoiceModal(item){
    this.getPOPaymentList();
    this.invoice_id = item.id;
    $('#Invoice').prop('checked', false);
    this.basefile = '';
    this.file_name = '';
    this.invoice_check = false;
    

  }
  invoice_check;
  checkInvoice(event){
    if(event.target.checked){
     this.invoice_check = true

    }
    else{
      this.invoice_check = false
    }

  }
  AddRequest(){
    if( this.file_name != ''){
      var obj = {
        'invoice_id': this.invoice_id,
        'attachment_file': this.basefile,
        'file_name': this.file_name,
        'tax_invoice': this.invoice_check

      }
      this.loaderService.display(false);
      this.categoryService.uploadFileInPI(obj).subscribe(
      res=>{
          $("#uploadModal").modal("hide");
          this.loaderService.display(false);
          this.getPOPaymentList();
          this.successMessageShow("File Uploaded successfully");
          this.invoice_check = false;
        },
        err=>{
          
          this.errorMessageShow(JSON.parse(err['_body'])['message']);
          this.loaderService.display(false);
      });
      

    }
    else{
      alert('First Upload A File');
    }

  }

  confirmAndDelete(id: number) {
    if (confirm("Are You Sure You Want To delete?") == true) {
      this.deletePiPayment(id);
    }
  }
  deletePiPayment(id){
    this.loaderService.display(true);
    this.categoryService.deletePiPayment(id).subscribe(
      res=>{
          this.loaderService.display(false);
          this.successMessageShow("Pi Payment Deleted successfully")
          this.getPOPaymentList();
          
        },
        err=>{
          
          this.errorMessageShow(JSON.parse(err['_body'])['message']);
          this.loaderService.display(false);
      });


  }






  current_pi_amt:any = "";
  openPaymentModal(pi_id, pi_amt){
    this.current_pi_amt = pi_amt
    this.paymentForm.reset();
    this.paymentForm.controls['performa_invoice_id'].setValue(pi_id);
    $("#savePaymentModal").modal("show");
  }



  raiseRequestPO(balance){
    var value_check = $('#po_value').val();
    if(value_check > balance){
      alert('Please Enter Value Less than balance');
      $('#po_value').val('');

    }
    else if( $('#po_value').val() ==  ''){
      alert('Please Enter a value first and then submit');

    }
    else{
      this.loaderService.display(true);
      this.categoryService.raiseRequestForPO(value_check,this.po_id_selected).subscribe(
        res=>{
          
          $("#raiseModal").modal("hide");
          this.getPOPaymentList();
          this.successMessageShow("Payment request raised successfully")
          $('#po_value').val('')
          this.loaderService.display(false);
        },
        err=>{
         
          this.errorMessageShow(JSON.parse(err['_body'])['message']);
          this.loaderService.display(false);
      });

    }
    

  }
  getPIitemList(po_id_selected){
    for(let obj of this.po_pi_list){
      
      if(obj.po_details.id == po_id_selected ){
        this.invoice_list = obj.invoice_details
        

      }

    }
  }
  resetValue(){
    $('#po_value').val('')

  }
  openBrowseModal(){
    $("input[id='getFile']").click();
  }
  checkFile(check,id){
    $('#exampleCheck-'+id).attr('checked',check);
    

  }

   

}
