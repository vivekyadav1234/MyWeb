import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { FormGroup, Validators, FormBuilder } from '../../../../../../node_modules/@angular/forms';

declare var $:any;

@Component({
  selector: 'custom-element-approvals',
  templateUrl: './custom-element-approvals.component.html',
  styleUrls: ['./custom-element-approvals.component.css','../tasks/tasks.component.css'],
  providers:[CategoryService]
})
export class CustomElementApprovalsComponent implements OnInit {
  project_list;
  role:any;
  boq_list;
  headers_res;
  per_page;
  total_page;
  current_page;
  selectedProjectIndex;
  selectedProject;
  customList;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  priceForm: FormGroup;
  rejectForm:FormGroup;
  project_id;
  project_status: any;
  doc_Id:any;
  formType: string;
  priceErroralert: boolean;
  constructor(private loaderService : LoaderService,
    private categoryService:CategoryService,
    private formBuilder: FormBuilder,private ref: ChangeDetectorRef) { 
      this.priceForm = formBuilder.group({
        'price' : ['', Validators.required],
        'category_remark': ['',Validators.required],
        'status': [''],
        'timeline': [''],
        'user_type': ['',Validators.required],
      });
      this.rejectForm = formBuilder.group({
        'price' : [''],
        'category_remark': ['',Validators.required],
        'status': [''],
        'timeline': [''],
         'user_type': ['',Validators.required],
      });
    }

  ngOnInit() {
    this.role=localStorage.getItem('user');
    this.getProjectList(1);
  }

  approveProject(index){
    this.boq_list = this.project_list[index].boq_list;
  }

  getProjectList(page?){
    this.loaderService.display(true);
    this.categoryService.getCustomElementProjectList(page).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        
        this.project_list = res.projects;
        this.project_list.forEach(project => project['expanded'] = false);
        this.loaderService.display(false);
      },
      err=>{
        
         this.loaderService.display(false);
      });
  }

  getProjectDetails(id,row?){
    this.toggleRow(row);
    this.project_id=id;
    this.project_status = row.custom_element_approval_required;
    if(row.expanded){
    this.categoryService.getCustomElements(id).subscribe(
      res=>{
        this.customList = res['custom_elements'];
        // this.selectSpace(this.project_id,event);
       },
      err=>{
        
      });
    }
  }

  onSubmit(){
    var form:any;
    if(this.formType==="approved"){
      form = this.priceForm;
    }else {
      form = this.rejectForm;
    }
    if((form.controls['price'].value != null && form.controls['price'].value != '')
     || this.formType === 'rejected'){
      this.loaderService.display(true);
      form.controls['status'].patchValue(this.formType);
      this.categoryService.addCustomPrice(form.value,this.doc_Id,this.project_id).subscribe(
        res=>{
          form.reset();
          this.categoryService.getCustomElements(this.project_id).subscribe(
            res=>{
              this.customList = res['custom_elements'];
             },
            err=>{
              
            });
          
          this.successalert = true;
          this.closeModals();
          if(this.formType==="approved"){
            this.successMessage = "Approved successfully";
          }else {
            this.successMessage = "Rejected successfully";
          }
          setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
          this.loaderService.display(false);
        },
        err=>{
         
        });
      }else {
        this.priceErroralert = true;
      }
  }

  toggleRow(row){
    this.project_list.forEach(project => {
      if(row.id !== project.id){
        project['expanded'] = false;
      }else {
        row.expanded = !row.expanded;
      }
    });
  }

  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
  
  ngAfterViewInit(){

    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })
  }

  openpopup(event,id){
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });
   
    
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    }) 
  }

  searchCategoryProjects(searchparam){
    this.loaderService.display(true);
    if(searchparam != ""){
      this.categoryService.searchCategoryProjects('custom_element',searchparam).subscribe(
        res=>{
          res= res.json();
          this.project_list = res.projects;
           this.loaderService.display(false);
        },
        err=>{
          
           this.loaderService.display(false);
        });
    }else {
      this.getProjectList(1);
    }
  }

  setDocId(doc_Id,formType){
    this.doc_Id = doc_Id;
    this.formType=formType;
  }

  closeModals(){
    $('#rejectModal').modal('hide');
    $('#approveModal').modal('hide');
    this.priceErroralert= false;
    this.priceForm.reset();
    this.rejectForm.reset();
  }

  updateCESeen(project_id){
    $(".new-"+project_id).html("");
    this.categoryService.updateCESeen(project_id).subscribe(
      res=>{
        
      },
      err=>{
        
      });
  }

  convertToAbs(number){
    return Math.abs(number);
  }
 
  selected_space;
  selectSpace(project_id,event){
    this.selected_space = event.target.value;
    this.loaderService.display(true);
    this.categoryService.selectService(project_id,this.project_id,event.target.value).subscribe(
    res=>{
      
      this.successalert = true;
      this.successMessage = "Type Status updated successfully";
      this.loaderService.display(false);
      // this.customList = res['custom_elements'];
      setTimeout(function() {
      this.successalert = false;
      this.categoryService.getCustomElements(this.project_id,event.target.value).subscribe(
      res=>{
        this.customList = res['custom_elements'];
       },
      err=>{
        
      });
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      
      
    });
  }   

  
}

  