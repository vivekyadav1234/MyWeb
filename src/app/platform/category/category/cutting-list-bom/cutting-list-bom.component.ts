import { Component, OnInit,Input,ViewChild,ElementRef,ChangeDetectorRef  } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import { QuotationService} from '../../../quotation/quotation.service';
import { LeadService } from '../../../lead/lead.service';
import { Observable } from 'rxjs';
import { AssignFilesCategoryComponent } from '../assign-files-category/assign-files-category.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {FinanceService} from '../../../finance/finance.service';
declare var $:any;

@Component({
  selector: 'app-cutting-list-bom',
  templateUrl: './cutting-list-bom.component.html',
  styleUrls: ['./cutting-list-bom.component.css'],
  providers: [LeadService,CategoryService,QuotationService]
})
export class CuttingListBomComponent implements OnInit {
  @Input() project_id:any;
  @ViewChild('fileInput') fileInput: ElementRef;
  project_list;
  boq_list;
  headers_res;
  per_page;
  total_page;
  current_page;
  erroralert:boolean=false;
  errorMessage:string;
  request: FormGroup;
  successalert = false;
  toggle = false;
  successMessage : string;
  project_id_split;
  split_type;
  public rowSelected:any;
  file_list=['file-1','file-2','file-3','file-4','file-5','file-6','file-7'];
  uploaded_list = [ "bom_sli_manual_sheet", "imos_manual_sheet", "imos"];
  bom: any = [];
  cuttingList: any = [];
  hardwareList: any = [];
  imos: any = [];

  constructor(
    private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService,
    public leadService : LeadService,
    private financeService:FinanceService,
    private ref: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.project_id_split = this.project_id;
    
    this.getProjectBoqList();
  }
  getProjectBoqList(){
    this.loaderService.display(true);
    this.categoryService.getProjectBoqListForCuttingBOM(this.project_id_split).subscribe(
      res=>{
        this.boq_list = res.quotations;
        
        // this.getLineItems(this.project_id_split,this.boq_list[0].id);
        this.loaderService.display(false);
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }
  //for collapsable row table
  toggleRow(row) {
    if (this.rowSelected === -1) {
      this.rowSelected = row
    }
    else {
      if (this.rowSelected == row) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = row
      }

    }
    
  }

  
  selected_boq;
  final_file_assign_for_split=[];
  module_value;
  selectLineItemArr = [];
  final_file_assign =[];
  selectBoq(event){
    this.selected_boq = event.target.value;
    if(this.selected_boq == ''){
      this.line_item_Arr = [];

    }
    this.final_file_assign =[];
    this.selectLineItemArr = [];
    this.rowSelected = '';
    this.getLineItems(this.project_id_split,event.target.value);

  }
  split_line_item_list;
  split_line_item_lists;
  line_item_Arr = [];
  lines_item_Arr=[];
  getLineItems(projectId,boqId){
    this.loaderService.display(true);
    this.categoryService.getLineItemsForCutting(projectId,boqId).subscribe(
    res=>{
        this.split_line_item_list = res.data.attributes.line_items;
        var jsonObj = this.split_line_item_list;
        this.line_item_Arr = Object.keys(jsonObj);
        this.loaderService.display(false); 
        for(let obj of this.line_item_Arr){
          $('#parent-'+obj).prop('checked',false);
        }
    },
      err=>{
        
        this.loaderService.display(false);
    });
  }
  selectType;
  slectFileType(type){
    this.selectType = type;
    if(this.selected_boq){
      $('#UploadModal').modal('show');

    }
    else{
      alert('Please Select A BOQ');
    }
  }


   

  attachment_file;
  basefile: any;
  file_arr:any = [];
  file_name:any;
  file_t;
  onChange(event,file_type) {
    
    $('.parent-'+file_type).addClass('divActive');  
    var fileReader = new FileReader();
    var i = 0;
    this.file_name = event.target.files[i].name;
    this.attachment_file =event.target.files[0] || event.srcElement.files[0];

    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      
    };
    fileReader.readAsDataURL(this.attachment_file);
  } 

   
  assignFileList;
  manualImportErrorList=[];

  submitFile(){
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.imos = [];
    // for(let i=0;i<this.file_arr.length;i++){
         var obj={
          'document':this.basefile,
          'scope':this.selectType,
          'document_file_name':this.file_name
        }
        
      
    // }
     
    this.selectLineItemArr = [];
    this.loaderService.display(true);
    this.categoryService.sendAssignedFileForCutting(obj,this.selected_boq).subscribe(
    res=>{
      this.manualImportErrorList=res;
      this.ref.detectChanges();
      
      if(res.length>0){
        $('#manualImportModal').modal('show');
      }
      else{
        this.successalert = true;
        this.successMessage = "Sheet Imported Successfully";
      }
      this.final_file_assign =[];
      this.selectLineItemArr = [];
      this.file_arr = [];
      this.basefile='';
      for(let obj of this.file_list){
        $('.parent-'+obj).removeClass('divActive');

      }
      
      
      $('#UploadModal').modal('hide');
      this.selectLineItemArr = [];
      this.loaderService.display(false);
      this.selectLineItemArr = [];
      this.getLineItems(this.project_id_split,this.selected_boq);
      this.removeItems();
      setTimeout(function() {
      this.successalert = false;
       
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });
  
 }
  
  


   // assignToLineItem(item)
    
  assignToLineItem(value,type){
    if(this.selectLineItemArr.length > 0){
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.selectType = type;

    for(let j=0;j<this.selectLineItemArr.length;j++){
      var obj={
        'scope':this.selectType,
        'ownerable_id':this.selectLineItemArr[j].id,
        'ownerable_type':this.selectLineItemArr[j].type,
         
        }
        this.final_file_assign.push(obj);
      }
   
    this.selectLineItemArr = [];
    this.loaderService.display(true);
    this.categoryService.sendAssignedFileForNotCutting(this.final_file_assign,value).subscribe(
    res=>{
      
      this.successalert = true;
      this.successMessage = "Status updated successfully";
      this.final_file_assign =[];
      this.selectLineItemArr = [];
      // this.file_arr = [];
      for(let obj of this.file_list){
        $('.parent-'+obj).removeClass('divActive');

      }
      this.selectLineItemArr = [];
      this.loaderService.display(false);
      this.selectLineItemArr = [];
      this.getLineItems(this.project_id_split,this.selected_boq);
      this.removeItems();
      setTimeout(function() {
      this.successalert = false;
       
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      this.getLineItems(this.project_id_split,this.selected_boq);
      
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });
  }else{
      alert('Please Select Atleast One Subline Item');
    }

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



  toggleAll(value,event) {
    this.module_value = value;
    this.toggle = event.target.checked;
    
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.imos = [];
    $('#parent-'+value).prop('checked',this.toggle); 
    if($('#parent-'+value). prop("checked") == true){
      this.toggle = true;
      this.split_line_item_list[value].forEach(items => {
        // this.getclearList(items.bom,items.cutting_list,items.hardware_list,items.imos);
        items.checked = this.toggle;
        // 
        var obj = {
           'id':items.id,
           'type':items.type
         }
        this.selectLineItemArr.push(obj)
      })
    }
    else{
      this.toggle = false;
      this.split_line_item_list[value].forEach(item => {
        item.checked = this.toggle
        this.selectLineItemArr.forEach((element,index) => {
        
          if(item.id == element.id){
            this.selectLineItemArr.splice(index,1)
          }
          
        });

      });
    // 

    }
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
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
  removeItems(){
    this.file_arr = [];
    this.attachment_file = '';
    this.file_name = '';
    for(let obj of this.file_list){
      $('.parent-'+obj).removeClass('divActive');

    }
  }  
 removeErrorList(){
    this.manualImportErrorList=[];
    this.file_arr = [];
    this.attachment_file = '';
    this.file_name = '';
    for(let obj of this.file_list){
      $('.parent-'+obj).removeClass('divActive');

    }
  }
  //to remove lineitem
  removelineItem(id){
    this.categoryService.removeCuttingItem(id,this.selected_boq).subscribe(
      res=>{
        
        this.successalert = true;
        this.successMessage = "File removed successfully";

        this.getLineItems(this.project_id_split,this.selected_boq);
         
        setTimeout(function() {
      this.successalert = false;
      }.bind(this), 5000);
      },
      err=>{
        
        this.errorMessageShow(JSON.parse(err['_body']).message);
         
    });
  }

  //to get all selected item
  toggleItem(item,event,val) {
    this.module_value = val;
    item.checked = !item.checked
    this.toggle = this.split_line_item_list[this.module_value].every(item => item.checked)
    if(event.target.checked){
      if(!this.selectLineItemArr.includes(item.id)){
         var obj = {
           'id':item.id,
           'type':item.type
         }
         this.selectLineItemArr.push(obj);
      }
      // this.getList(item);
    }
    else{
      this.selectLineItemArr.forEach((element,index) => {
        
        if(item.id == element.id){
          this.selectLineItemArr.splice(index,1);
          // 
           
          for(var i = 0; i<item.bom.length;i++){
            for(var j = 0;j<this.bom.length;j++){
              if (this.bom[j] === item.bom[i].attributes.id) {
                this.bom.splice(j,1);
              }
            }
          }

          for(var i = 0; i<item.cutting_list.length;i++){
            for(var j = 0;j<this.cuttingList.length;j++){
              if (this.cuttingList[j] === item.cutting_list[i].attributes.id) {
                this.cuttingList.splice(j,1);
              }
            }
          }

          for(var i = 0; i<item.hardware_list.length;i++){
            for(var j = 0;j<this.hardwareList.length;j++){
              if (this.hardwareList[j] === item.hardware_list[i].attributes.id) {
                this.hardwareList.splice(j,1);
              }
            }
          }
        }  
      });
    }
  }

  // //get all list
  // getList(item){
  //   //to get bom list id's
  //    
  //   for (var i = 0;i<item.bom.length;i++) {
  //     this.bom.push(item.bom[i].attributes.id);
  //   }

  //   //to get cutting_list id's
  //   for (var i = 0;i<item.cutting_list.length;i++) {
  //     this.cuttingList.push(item.cutting_list[i].attributes.id);
  //   }

  //   //to get hardware_list id's
  //   for (var i = 0;i<item.hardware_list.length;i++) {
  //     this.hardwareList.push(item.hardware_list[i].attributes.id);
  //   }

  //   //to get imos id's
  //   for (var i = 0;i<item.imos.length;i++) {
  //     this.imos.push(item.imos[i].attributes.id);
  //   }
  //   
  // }

  // getclearList(bomlist,cuttinglist,hardwarelist,imoslist){
  //   //to get bom list id's
  //   for (var i = 0;i<bomlist.length;i++) {
  //     this.bom.push(bomlist[i].attributes.id);
  //   }

  //   //to get cutting_list id's
  //   for (var i = 0;i<cuttinglist.length;i++) {
  //     this.cuttingList.push(cuttinglist[i].attributes.id);
  //   }

  //   //to get hardware_list id's
  //   for (var i = 0;i<hardwarelist.length;i++) {
  //     this.hardwareList.push(hardwarelist[i].attributes.id);
  //   }

  //   //to get imos id's
  //   for (var i = 0;i<imoslist.length;i++) {
  //     this.imos.push(imoslist[i].attributes.id);
  //   }
  //      
  //     for (var i = 0;i<imoslist.length;i++) {
  //     this.imos.push(imoslist[i].attributes.id);
  //   }

  //     
  // }
  
  // clearBom(){
  
  //   if (this.selectLineItemArr.length> 0 && this.bom.length > 0) {
  //     this.loaderService.display(true);
  //     this.categoryService.clearSli(this.bom).subscribe(
  //     res=>{
  //       
  //       this.successalert = true;
  //       this.successMessage = "Files deleted successfully";
  //       this.loaderService.display(false);
  //       this.bom = [];
  //       this.selectLineItemArr = [];
  //       this.getLineItems(this.project_id_split,this.selected_boq);
  //       setTimeout(function() {
  //       this.successalert = false;
  //       }.bind(this), 5000);
         
         
  //     },
  //     err=>{
  //       this.loaderService.display(false);
  //       
  //       this.errorMessageShow(JSON.parse(err['_body']).message);
  //     });
  //   } 
  //   else if(this.bom.length == 0){
  //     this.clearBomForNoContent('bom')

  //   } 
  //   else{
  //     alert('Please Select Atleast One Subline Item');
  //   }

  // }
 
   
  
// send to factory
sendToFactory(){
    this.categoryService.sendFactory(this.project_id_split).subscribe(
      res=>{
        
        
        this.successalert = true;
        this.successMessage = 'The Send To Factory you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        

      });

  }
  clearBomForNoContent(type){
    this.bom = [];
    this.cuttingList = [];
    this.hardwareList = [];
    this.imos = [];
     this.selectType=type;
      for(let j=0;j<this.selectLineItemArr.length;j++){
        var obj={
           
          'ownerable_id':this.selectLineItemArr[j].id,
          'ownerable_type':this.selectLineItemArr[j].type,
           
        }
        this.final_file_assign.push(obj);
      } 
    this.selectLineItemArr = [];
    this.loaderService.display(true);
    this.categoryService.clearList(this.final_file_assign,this.selectType).subscribe(
    res=>{ 
      
      this.successalert = true;
      this.successMessage = "Files deleted successfully";
      this.final_file_assign =[];
      this.selectLineItemArr = [];
       
      for(let obj of this.file_list){
        $('.parent-'+obj).removeClass('divActive');

      }
      this.selectLineItemArr = [];
      this.loaderService.display(false);
      this.selectLineItemArr = [];
      this.getLineItems(this.project_id_split,this.selected_boq);
      this.removeItems();
      setTimeout(function() {
      this.successalert = false;
       
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      
      this.errorMessageShow(JSON.parse(err['_body']).message);
    });
  }
  changeFileFormat(event){
    
    if(event == 'bom_sli_manual_sheet'){
      return 'Manual Sheet'

    }
    else if(event == 'imos_manual_sheet'){
      return 'IMOS Manual Sheet'

    }
    else if(event == 'imos'){
      return 'IMOS Parts List'

    } 
  }
  ConvertToUpper(){
    if(this.selectType == 'bom_sli_manual_sheet')  {
      return 'Manual Sheet'
    }
     else if(this.selectType == 'imos_manual_sheet'){
      return 'IMOS Manual Sheet'
   }
    else if(this.selectType == 'imos'){
      return 'IMOS Parts List'
    } 
  }
}
