import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import {QuotationService} from '../../../quotation/quotation.service';
import { LeadService } from '../../../lead/lead.service';
import { Observable } from 'rxjs';
import { AssignFilesCategoryComponent } from '../assign-files-category/assign-files-category.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css'],
  providers:[LeadService,CategoryService,QuotationService]
})
export class SplitComponent implements OnInit {
  @Input() project_id:any;
  @ViewChild(AssignFilesCategoryComponent) child: AssignFilesCategoryComponent;
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
  file_type = ['three_d_image','reference_image','cad_drawing'];
  


  constructor(
  	private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService,
    public leadService : LeadService,

  	) { }

  ngOnInit() {
    this.project_id_split = this.project_id;
    
  	this.getProjectBoqList();
    this.getSplitTag();

  }
  getProjectBoqList(){
    this.loaderService.display(true);
    this.categoryService.getProjectBoqListForHandover(this.project_id_split).subscribe(
      res=>{
        this.boq_list = res.quotations;
        
        // this.getLineItems(this.project_id_split,this.boq_list[0].id);
        this.loaderService.display(false);
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }
  getSplitTag(){
    this.categoryService.getSplitTag().subscribe(
      res=>{
        this.split_type = res.tags;
         
      },
      err=>{
        
         
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
  selectBoq(event){
    this.selected_boq = event.target.value;
    this.final_file_assign =[];
    this.selectLineItemArr = [];
    this.rowSelected = '';
    this.getLineItems(this.project_id_split,event.target.value);//imp
    

  }
  split_line_item_list;
  line_item_Arr = [];
  getLineItems(projectId,boqId){
    this.loaderService.display(true);
    this.categoryService.getLineItems(projectId,boqId).subscribe(
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

  new_list;
  removeDrawings(value,index,fileId,parentIndex){
     
    
    this.categoryService.removeDrawings(fileId).subscribe(
      res=>{
        
        this.successMessageShow(res.message);
        this.split_line_item_list[value].forEach(item => {
          item.production_drawings.forEach(element => {
             
        
        


          }) 
        
        })
        this.getLineItems(this.project_id_split,this.selected_boq);
      
      },
      err=>{
        
        this.errorMessageShow(JSON.parse(err['_body']).message);
         
    });

  }
  tag_id;
  split_name = 'split';
  selectSplitType(tagId,split){
    this.tag_id = tagId;
    if(this.selectLineItemArr.length > 0){
      this.split_name = split;
      for(let j=0;j<this.selectLineItemArr.length;j++){
          var obj={
            'tag_id':this.tag_id,
            'line_item_id':this.selectLineItemArr[j].id,
            'line_item_type':this.selectLineItemArr[j].type
          }
          this.final_file_assign_for_split.push(obj);


      }
      this.categoryService.submitSplitData(this.final_file_assign_for_split).subscribe(
        res=>{
          
          this.successMessageShow('File Splitted Successfully!');
          this.final_file_assign =[];
          this.selectLineItemArr = [];
          this.getLineItems(this.project_id_split,this.selected_boq);

        },
        err=>{
          
          this.errorMessageShow(JSON.parse(err['_body']).message);

        })

  }
  else{
    alert('Please Select Atleast One Line Item');

  }
  
   

  }
  final_file_assign_for_split=[];
  module_value;
  selectLineItemArr = [];
  toggleAll(value,event) {
     
    this.module_value = value;
    this.toggle = event.target.checked;
    
    $('#parent-'+value).prop('checked',this.toggle); 
    if($('#parent-'+value). prop("checked") == true){
      this.toggle = true;
      this.split_line_item_list[value].forEach(item => {
        item.checked = this.toggle
        var obj = {
           'id':item.id,
           'type':item.type
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
    

    }
    
     
  }
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
         this.selectLineItemArr.push(obj)
          

      }


    }
    else{
      this.selectLineItemArr.forEach((element,index) => {
        
        if(item.id == element.id){
          this.selectLineItemArr.splice(index,1)
        }
        
      });

    }
    
     
  }
  assignFileList;
  final_file_assign = [];
  customFunc(data){
     
    this.assignFileList = data.file_ids;


    if(data.btn_type =='assign'){
      if(this.assignFileList.length > 0 && this.selectLineItemArr.length > 0){
        for(let i=0;i<this.assignFileList.length;i++){
          for(let j=0;j<this.selectLineItemArr.length;j++){
            var obj={
              'project_handover_id':this.assignFileList[i],
              'line_item_id':this.selectLineItemArr[j].id,
              'line_item_type':this.selectLineItemArr[j].type
            }
            this.final_file_assign.push(obj);

          }
        }
        this.categoryService.sendAssignedFiles(this.final_file_assign).subscribe(
        res=>{
          
          this.successMessageShow(res.message);
          this.final_file_assign =[];
          this.selectLineItemArr = [];
          this.getLineItems(this.project_id_split,this.selected_boq);
          this.child.getFilesToAssign();

        },
        err=>{
          
          this.errorMessageShow(JSON.parse(err['_body']).message);


        });
      }
      else{
        alert('Please select AtLeast One Line Item And Atleast One File');
      }


    }
    else{
      if( this.selectLineItemArr.length > 0 && this.assignFileList.length == 0){
        for(let j=0;j<this.selectLineItemArr.length;j++){
          var obj1={
            'line_item_id':this.selectLineItemArr[j].id,
            'line_item_type':this.selectLineItemArr[j].type
          }
          this.final_file_assign.push(obj1);

        }
        this.categoryService.sendAssignedFiles(this.final_file_assign).subscribe(
        res=>{
          
          this.successMessageShow(res.message);
          this.final_file_assign =[];
          this.selectLineItemArr = [];
          this.getLineItems(this.project_id_split,this.selected_boq);
          this.child.getFilesToAssign();

        },
        err=>{
          
          this.errorMessageShow(JSON.parse(err['_body']).message);


        });

      }
      else if( this.assignFileList.length > 0){
        alert('Please Remove All Selected File First');

      }
      else{
        alert('Please select AtLeast One Line Item');

      }
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


}
