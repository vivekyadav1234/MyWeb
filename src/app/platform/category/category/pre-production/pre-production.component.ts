import { Component, OnInit,ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { FormBuilder, FormGroup, Validators } from '../../../../../../node_modules/@angular/forms';
import { VendorSelectionComponent } from '../vendor-selection/vendor-selection.component';
import { PoReleaseComponent } from '../po-release/po-release.component';
import { PiUploadComponent } from '../pi-upload/pi-upload.component';
import {FinanceService} from '../../../finance/finance.service';
import { PaymentsReleaseComponent } from '../payments-release/payments-release.component';


declare var $:any;
@Component({
  selector: 'pre-production',
  templateUrl: './pre-production.component.html',
  styleUrls: ['./pre-production.component.css','../tasks/tasks.component.css'],
  providers: [CategoryService]
})
export class PreProductionComponent implements OnInit {
  otherItemForm:FormGroup;
  sublineItemForm:FormGroup;
  file_type_list;
  import_file_type;
  selectedBOQ={};
  selectedLineItem={};
  headers_res;
  per_page;
  total_page;
  current_page;
  project_id;
  line_items_list;
  boq_list;
  successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;

  constructor(private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder,private financeService:FinanceService,) {
      this.sublineItemForm = formBuilder.group({
        'name' : ['', Validators.required],
        'unit': ['', Validators.required],
        'rate': ['', Validators.required],
        'quantity': ['', Validators.required],
      });
      this.otherItemForm = formBuilder.group({
        'name' : ['', Validators.required],
        'unit': ['', Validators.required],
        'rate': ['', Validators.required],
        'quantity': ['', Validators.required],
      });
    }

  ngOnInit() {
    this.file_type_list = [{name:'IMOS',value:'imos_import_global'},{name:'Optiplanning',value:'optiplanning_import_global'},{name:'CNC Data',value:'cnc_data'},{name:'Assembly GL',value:'assembly_gl'}];
    this.import_file_type = 'imos_import_global';
    this.getBOQList(1);


  }
  arrow:boolean = true;
  selectedArrow;
  clickRow(row,i) {
    
    this.project_id = row.project_id;
    row.expanded = ! row.expanded;
    $(".expanded-col").css("display", "none");
    $(".expanded-col-"+row.id).css("display", "table-row");
    this.selectedArrow = i;
    if(this.arrow){
      this.arrow = false;


    }
    else{
      this.arrow = true;

    }
     
    
  }
  rowSelected;
  //for collapsable row table
  toggleRow(row) {
     
    if (this.rowSelected === -1) {
      this.rowSelected = row.id
    }
    else {
      if (this.rowSelected == row.id) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = row.id
      }

    }
    
  }

  getBOQList(page?, searchparam=""){
    this.loaderService.display(true);
      this.categoryService.getBoqListForSli(page,searchparam).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
          res = res.json();
        this.boq_list = res.quotations;
        this.boq_list.forEach(quotation => quotation['expanded'] = false);
        this.loaderService.display(false);
        
      },
      err => {
        if(err._body.message === "No Quotations Found."){
          
        }
        this.loaderService.display(false);
      }
    );
  }

  downloadBoq(boqId,ProjectId){
    this.loaderService.display(true);
    this.financeService.downloadBoqCheatSheet(ProjectId,boqId).subscribe(
    res =>{
      this.loaderService.display(false);
      var contentType = 'application/pdf';
      
       var b64Data =  JSON.parse(res._body)['quotation_base_64'];
      var name=  JSON.parse(res._body)['boq_name'];
      var blob = this.b64toBlob(b64Data, contentType,512);
      var blobUrl = URL.createObjectURL(blob);
      // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let dwldLink = document.createElement("a");
      // let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", blobUrl);
      dwldLink.setAttribute("download", name);
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      this.successalert = true;
        this.successMessage = "Your File Downloaded Successfully";
        setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
    },
    err => {
      this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
    }
    );

  }
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
      
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  downloadExcelReport(boqId,ProjectId){
    this.loaderService.display(true);
    this.financeService.downloadboqexcel(ProjectId,boqId).subscribe(
    res =>{
      this.loaderService.display(false);
      var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
       var b64Data =  JSON.parse(res._body)['quotation_base_64'];
      var name=  JSON.parse(res._body)['boq_name'];
      var blob = this.b64toBlob(b64Data, contentType,512);
      var blobUrl = URL.createObjectURL(blob);
      // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let dwldLink = document.createElement("a");
      // let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", blobUrl);
      dwldLink.setAttribute("download", name);
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      this.successalert = true;
        this.successMessage = "Your File Downloaded Successfully";
        setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
    },
    err => {
      this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
    }
    );
  }


  searchCategoryProjects(searchparam){
    this.loaderService.display(true);
    if(searchparam != ""){
      this.categoryService.getBoqListForSli('',searchparam).subscribe(
        res=>{
            this.headers_res= res.headers._headers;
            this.per_page = this.headers_res.get('x-per-page');
            this.total_page = this.headers_res.get('x-total');
            this.current_page = this.headers_res.get('x-page');
            res = res.json();
            if(res){
             this.boq_list = res.quotations;
             this.boq_list.forEach(quotation => quotation['expanded'] = false);
            }
            else{
              this.boq_list = res;
               

            }
            this.loaderService.display(false);
          
        },
        err=>{
          
           this.loaderService.display(false);
        });
      }else {
        this.getBOQList(1);
      }
  }

}