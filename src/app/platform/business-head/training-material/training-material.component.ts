import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BusinessHeadService } from '../business-head.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { LoaderService } from '../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmbedVideoService } from 'ngx-embed-video';
import {DomSanitizer} from '@angular/platform-browser';
declare var $:any;

@Component({
  selector: 'app-training-material',
  templateUrl: './training-material.component.html',
  styleUrls: ['./training-material.component.css'],
  providers: [BusinessHeadService]
})
export class TrainingMaterialComponent implements OnInit {
categoriesList: any;
  dropdownSettings: {};
  category_id: any;
  subcategories: any;
  MaterialUploadForm: any;
  filesToUpload: File[];
  data;
  attachment_file: any;
  attachment_file_name: any;
  basefile: any;
  categoryForm: FormGroup;
  subcategoryForm: FormGroup;
  materialUploadForm: FormGroup;
  erroralert: boolean;
  parent_id: any;
  fileDetails: {};
  selectSubcategory: any;
  materials: any;
  errorMessage : string;
  successalert = false;
  successMessage : string;
  upload_Item = [];
  vimeoUrl = "https://vimeo.com/197933516";
  yt_iframe_html: any;
  per_page;
  total_page;
  current_page;


  constructor(private businessHeadService: BusinessHeadService, private formBuilder: FormBuilder, private sanitizer:DomSanitizer, private loaderService : LoaderService,private http: Http,private embedService: EmbedVideoService,private ref:ChangeDetectorRef) {
  	this.categoryForm = this.formBuilder.group({
      upload_name: new FormControl("", Validators.required)
    })
    this.subcategoryForm = this.formBuilder.group({
      subcategory_name: new FormControl("", Validators.required),
      selectCategory_name: new FormControl("", Validators.required),
    })

    this.materialUploadForm = this.formBuilder.group({
      selectCategory_name: new FormControl("", Validators.required),
      selectSubCategory_name: new FormControl("", Validators.required),
      selectupload_file: new FormControl("", Validators.required)
    })
  }
  role:any;
  ngOnInit() {
    this.yt_iframe_html = this.embedService.embed(this.vimeoUrl);
    this.role=localStorage.getItem('user');
    this.getCategory();
    // this.showtable();

    this.dropdownSettings = {
      singleSelection: "true",
      text: "Select Category",
      classes: "myclass custom-class"
    };
  }
  getCategory(){
    this.loaderService.display(true);
    this.businessHeadService.getCategory().subscribe(
    res=>{
      this.categoriesList = res.training_materials;
      this.loaderService.display(false);
      this.showtable();
      },
     err=>{
        this.loaderService.display(false);
        this.showtable();
        this.erroralert = true;
        this.errorMessage = "Something went wrong";
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }
   onChange(event) {
    this.attachment_file = event.target.files[0] || event.srcElement.files[0];
    this.attachment_file_name = this.attachment_file['name'];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
    };
    var reader = fileReader.readAsDataURL(this.attachment_file);
    this.fileDetails = (document.getElementById('files') as HTMLInputElement).value
    
  }
  UploadDD(event) {
    
    this.upload_Item = [];
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();
        let file_name = event.target.files[i].name;
        reader.onload = (event) => {

          
          let base_encoded_file = event.target.result;
          
          let file_obj = {'attachment': base_encoded_file, 'file_name': file_name };
          this.upload_Item.push(file_obj);
          
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  createCategory() {
    this.loaderService.display(true);
    this.businessHeadService.createCategory(this.categoryForm.value).subscribe(

      res=>{
       this.successalert = true;
       $('#categoryModal').modal('hide');
       this.categoryForm.reset();
       this.loaderService.display(false);
       this.successMessage = "Category Added successfully";
       this.ngOnInit()
       setTimeout(function() {
          this.successalert = false;
       }.bind(this), 2000);
      },
     err=>{
        this.loaderService.display(false);
        
        this.erroralert = true;
        this.errorMessage = "Category name is already exist";
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }
  createSubCategory() {
    this.loaderService.display(true);
    this.businessHeadService.createsubCategory(this.subcategoryForm.value).subscribe(
      res=>{
       this.successalert = true;
       $('#SubCategory').modal('hide');
       this.loaderService.display(false);
       this.getCategory();
       this.subcategoryForm.reset();
       this.successMessage = "Sub-Category Added successfully";
       this.ngOnInit()
       setTimeout(function() {
          this.successalert = false;
       }.bind(this), 2000);

      },
     err=>{
       this.loaderService.display(false);
        
        this.erroralert = true;
        this.errorMessage = "Category name is already exist";
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }
  upload() {
    this.loaderService.display(true);
    this.businessHeadService.uploadMaterial(this.upload_Item,this.selectSubcategory).subscribe(
    res=>{
      this.loaderService.display(false);
       this.successalert = true;
       this.materialUploadForm.reset();
       $('#uploadMaterial').modal('hide');
       this.successMessage = "File Uploaded successfully";
       setTimeout(function() {
          this.successalert = false;
       }.bind(this), 2000);
       location.reload();
      // this.ref.detectChanges();
      },
     err=>{
       this.loaderService.display(false);
        
        this.erroralert = true;
        // this.errorMessage = "File not Uploded";
        this.errorMessage = <any>JSON.parse(err['_body'])["message"];
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }
  resetForm() {
    this.formBuilder = null;
  }
  onCategorySelect(event) {
    this.category_id = event;
    this.loaderService.display(true);
    this.businessHeadService.getSubCategory(this.category_id).subscribe(
    res=>{
      this.loaderService.display(false);
      this.subcategories = res.training_materials;
      },
     err=>{
        
        this.erroralert = true;
        this.errorMessage = "Something went wrong";
        //this.errorMessage = <any>JSON.parse(err['_body'])["message"];
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }
  onsubCategorySelect(e: any) {
    
    this.selectSubcategory = e;
  }
  category_list;
  showtable() {
    this.loaderService.display(true);
    
    this.businessHeadService.getMaterial().subscribe(dataSource => {
      this.loaderService.display(false);
      this.category_list = dataSource.training_materials;
    });
  }
  display_row=-1;
  toggleRow(id){
    this.display_row = id;

  }
  playVideo(id:number){
    if($("#"+id)[0].paused == true){
      $("#"+id)[0].play();
      $("#"+id).attr("controls", true);
      $("#img_"+id).hide();
    }
    else{
      $("#"+id)[0].pause();
      $("#"+id).attr("controls", false);
      $("#img_"+id).show();
    }
  }
  confirmAndDelete(id:number) {
    if (confirm("Are You Sure You Want To delete?") == true) {

      this.DeleteCat(id);
    }
  }
  confirmAndDeleteContent(id: number){
    if (confirm("Are You Sure You Want To delete?") == true) {

      this.DeleteContent(id);
    }
  }
  DeleteCat(value){
    this.businessHeadService.deleteCategory(value).subscribe(
    res=>{
       this.successalert = true;
       this.successMessage = "File Deleted successfully";
       this.showtable();
       setTimeout(function() {
          this.successalert = false;
       }.bind(this), 2000);

      },
     err=>{
        
        this.erroralert = true;
        this.errorMessage = "Something went wrong";
        //this.errorMessage = <any>JSON.parse(err['_body'])["message"];
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }

  DeleteContent(value){
    this.businessHeadService.deleteContent(value).subscribe(
    res=>{
       this.successalert = true;
       this.successMessage = "File Deleted successfully";
       this.showtable();
       setTimeout(function() {
          this.successalert = false;
       }.bind(this), 2000);

      },
     err=>{
        
        this.erroralert = true;
        this.errorMessage = "Something went wrong";
        //this.errorMessage = <any>JSON.parse(err['_body'])["message"];
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });

  }
  pageNo=1;
  updatedUrl;
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url.split('?')[0]+'#toolbar=0&view=Fit');
  }


  ngAfterViewInit(){
    $('#check').bind("contextmenu", function (e) {
       
        e.preventDefault();

    });
     $('#hide').on('contextmenu', function(e) {

      e.preventDefault();
    });

     $('#opencards').on('contextmenu', function(e) {

      e.preventDefault();
    });

     // window.frames["frameID"].document.oncontextmenu = function(){ return false; };
    // this.getSections();
  }



  onRightClick() {
    return false;
  }


  //for pdf
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  afterLoadComplete(pdfData: any) {
    // this.loaderService.display(true);
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
    // this.loaderService.display(false);
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }
  SplitString(string){
    var split = string.split(".")
    return split[split.length - 1]

  }
  file_new_url;

  totalPageCount;
  showModal(FILE_URL,total_page_count){   
    this.totalPageCount=total_page_count;
    this.pageNo=1;
    this.showPdfLeft=true;
    this.showPdfRight=true;
    
    if(this.totalPageCount==1){
      this.showPdfLeft=false;
      this.showPdfRight=false;
    }else if (this.totalPageCount>1){
      this.showPdfLeft=false;
    }
    $('#poPreviewModal').modal('show');
    this.file_new_url = FILE_URL;
    this.updatedUrl=this.sanitizer.bypassSecurityTrustResourceUrl('');
    setTimeout(()=>{
      this.updatedUrl= this.sanitizer.bypassSecurityTrustResourceUrl(this.file_new_url.split('?')[0]+'#toolbar=0&page=1&view=Fit');
    },500)
  }

  close(){
    this.categoryForm.reset();
    this.materialUploadForm.reset();
    this.subcategoryForm.reset();
    this.ngOnInit()
  }

  categoryId: any;
  catname:any;
  setCategoryId(id,category)
  {
    this.categoryId = id;
    this.catname = category;
  }

  subcategoryId: any;
  subList:any;
  subcategoryname:any;
  categoryname:any;
  setsubCategoryId(id,parentid,subcatname,catname)
  {
    this.subcategoryname = subcatname;
    this.categoryname = catname
    this.subcategoryId = id;
    this.businessHeadService.getSubCategory(parentid).subscribe(
    res=>{
      this.subList = res.training_materials;
      this.loaderService.display(false);
      },
     err=>{
        this.loaderService.display(false);
        
        this.erroralert = true;
        this.errorMessage = "Something went wrong"
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }
  //to edit category
  editCreateCategory(){
    this.loaderService.display(true);
    this.businessHeadService.editCategory(this.categoryForm.value,this.categoryId).subscribe(
    res=>{
      this.categoriesList = res.training_materials;
      $('#editCategoryModal').modal('hide')
      this.loaderService.display(false);
      this.successalert = true;
      this.successMessage = "File Edited successfully";
      setTimeout(function() {
        this.successalert = false;
       }.bind(this), 5000);
      this.ngOnInit()
      },
     err=>{
        this.loaderService.display(false);
        
        this.erroralert = true;
        this.errorMessage = "Category name is already exist";
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }

  //to edit sub-category
  editsubCategory(){
    this.loaderService.display(true);
    this.businessHeadService.editsubCategory(this.subcategoryForm.value,this.subcategoryId).subscribe(
    res=>{
      this.categoriesList = res.training_materials;
      $('#editsubCategory').modal('hide')
      this.loaderService.display(false);
      this.successalert = true;
      this.successMessage = "File Edited successfully";
      setTimeout(function() {
        this.successalert = false;
       }.bind(this), 5000);
      this.ngOnInit()
      },
     err=>{
        this.loaderService.display(false);
        
        this.erroralert = true;
        this.errorMessage = "Category name is already exist";
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
    });
  }

  urlWithoutPdfParameters;
  nextPdfPage(){

    this.showPdfLeft=true;
    this.pageNo=this.pageNo+1;

    if(this.pageNo==this.totalPageCount){
      this.showPdfRight=false;
    }

    this.urlWithoutPdfParameters=this.file_new_url.split('?')[0];
    this.updatedUrl=this.sanitizer.bypassSecurityTrustResourceUrl('');
    setTimeout(()=>{
      this.updatedUrl=this.sanitizer.bypassSecurityTrustResourceUrl(this.urlWithoutPdfParameters+'#toolbar=0&view=Fit&page='+this.pageNo);
    },500)
    this.ref.detectChanges();
  }
  showPdfRight=true;
  showPdfLeft=true;
  prevPdfPage(){
    this.urlWithoutPdfParameters=this.file_new_url.split('?')[0];
    
    this.showPdfRight=true;
    this.pageNo=this.pageNo-1;
    if(this.pageNo==1){
      this.showPdfLeft=false;
    }
    this.updatedUrl=this.sanitizer.bypassSecurityTrustResourceUrl('');
    setTimeout(()=>{
      this.updatedUrl= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlWithoutPdfParameters+'#toolbar=0&view=Fit&page='+this.pageNo);
    },500)
      
    this.ref.detectChanges();
  }
}
interface category {
  id: Number;
  category_name: String;
}
interface subcategory {
  id: Number;
  category_name: String;
}
