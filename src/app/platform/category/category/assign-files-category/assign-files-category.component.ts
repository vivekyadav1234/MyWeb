import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import {QuotationService} from '../../../quotation/quotation.service';
import { LeadService } from '../../../lead/lead.service';
import { Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;
@Component({
  selector: 'app-assign-files-category',
  templateUrl: './assign-files-category.component.html',
  styleUrls: ['./assign-files-category.component.css'],
  providers:[LeadService,CategoryService,QuotationService]
})
export class AssignFilesCategoryComponent implements OnInit {
	@Input() project_id:any;
  @Output() sendAssignedFiles : EventEmitter<any> = new EventEmitter();
	project_id_split;
  erroralert:boolean=false;
  errorMessage:string;
  request: FormGroup;
  successalert = false;
  successMessage : string;
	category = ["ThreeDImage", "ReferenceImage", "CadDrawing"];
  categoryList = ["3-D_Image", "Reference_Image", "CAD_Drawing"];


  constructor(
  	private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService,
    public leadService : LeadService,
  	) { }

  ngOnInit() {
  	this.project_id_split = this.project_id;
    
  	this.getFilesToAssign()
  }
  file_list;
  file_type =[];
  getFilesToAssign(){
  	this.loaderService.display(true);
    this.categoryService.getFilesToAssign(this.project_id_split,this.category,'accepted').subscribe(
      res=>{
        this.selectedFileIds =[];
        this.file_list = res.project_handover;
        this.file_type = res.project_handover.all_files;

         
        this.loaderService.display(false);
      },
      err=>{
      	 this.loaderService.display(false);
        
      });

  }
  selectFiles(obj,i){
    event.preventDefault();
    $("#obj"+obj.id).prop('checked', !$("#obj"+obj.id).prop("checked"));
    this.selectAssignFile($("#obj"+obj.id).prop("checked"),obj,i);

    if($("#obj"+obj.id).prop("checked")){
      $("."+obj.id).addClass("divActive");
      


    }
    else{
      $("."+obj.id).removeClass("divActive");

    }
    

  }
  selectedFileIds:any =[];
  selectAssignFile(checked,fileValue,index){
     
    if(checked){
      
      if(this.selectedFileIds.includes(fileValue.id)){
        alert("Already Added In The List");

      }
      else{
        this.selectedFileIds.push(fileValue.id);

      }
    }
    else{
      
      this.selectedFileIds.splice(index, 1);

    }
    
    

    

  }
  assignToLineItem(type){
    this.sendAssignedFiles.emit({file_ids: this.selectedFileIds, btn_type: type});

  }
  selected_file_type;
  selectReviseList(event){
    this.selected_file_type = event;
    if(this.selected_file_type == '3-D_Image'){
      this.selected_file_type = 'ThreeDImage'

    }
    else if(this.selected_file_type == 'Reference_Image'){
      this.selected_file_type = 'ReferenceImage'


    }
    else{
      this.selected_file_type = 'CadDrawing'
    }
    

  }
  //Method for uploading New File
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
  
  onSubmit(data) {
    var assign_type = this.selected_file_type;
       this.submitted = true;
       let val = 'files_to_upload';
       let postData = {};
       postData[val] = {
               "upload_file": this.basefile,
               "name": data.name,
               "upload_type": this.selected_file_type,
               "file_name": this.file_name
             }
           
       this.loaderService.display(true);
       
        this.categoryService.uploadFile(this.project_id_split,postData)
         .subscribe(
             cad => {
               this.loaderService.display(false);
               this.successalert = true;
               $("#uploadModal").modal("hide");
               this.getFilesToAssign();
               this.successMessage = "file uploaded successfully !!";
               setTimeout(function() {
                 this.successalert = false;
                }.bind(this), 800);
             },
             error => {
               this.erroralert = true;
               this.errorMessage = JSON.parse(error['_body']).message;
               setTimeout(function() {
                  this.erroralert = false;
                }.bind(this), 10000);

               this.loaderService.display(false);
               return Observable.throw(error);
             }
         );
        
  }
  changeFileFormat(event){
 
    if(event == 'ThreeDImage'){
      return '3-D Image'

    }
    else if(event == 'ReferenceImage'){
      return 'Reference Image'

    }
    else if(event == 'CadDrawing'){
      return 'Cad Drawing'

    }


  }


}
