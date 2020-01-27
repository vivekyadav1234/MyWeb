import { Component, OnInit } from '@angular/core';
import { CategoryService} from '../category.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.css'],
  providers:[CategoryService]
})
export class ManageServicesComponent implements OnInit {

	errorMessage : string;
	erroralert = false;
	successalert = false;
	successMessage : string;
	initLoader:any = true;
	activeDropDownVal = 'ser_category';
	addServiceCategoryForm:FormGroup;
	addServiceSubCategoryForm:FormGroup;
	addServiceActivityForm:FormGroup;

  constructor(
  	private router: Router,
		private loaderService : LoaderService,
		private categoryService:CategoryService,
		private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
  	this.loaderService.display(false);
  	this.getServiceCategories();
  	this.addServiceCategoryForm = this.formBuilder.group({
			name:new FormControl("",Validators.required)
		});
		this.addServiceSubCategoryForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			service_category_id:new FormControl("",Validators.required)
		});
		this.addServiceActivityForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			code:new FormControl("",Validators.required),
			unit:new FormControl("",Validators.required),
			default_base_price:new FormControl(""),
			installation_price:new FormControl("",Validators.required),
			service_category_id:new FormControl("",Validators.required),
			service_subcategory_id:new FormControl("",Validators.required)
		});
  }

  setActiveForm(val){
		this.activeDropDownVal = val;
		$(".container-set").addClass("d-none");
		if(val=='ser_category'){
			this.getServiceCategories();
			document.getElementById('servicecategoryrow').classList.remove('d-none');
		} else if(val=='ser_sub_category') {
				this.getServiceCategories();
				this.getServiceSubCategories('');
			document.getElementById('servicesubcategoryrow').classList.remove('d-none');
		} else if(val=='ser_activity') {
			this.getServiceCategories();
			this.getServiceActivities();
			document.getElementById('serviceactivityrow').classList.remove('d-none');
		} 
	}

	ser_categories;
	getServiceCategories(){
		this.initLoader = true;
		this.categoryService.listService_categories().subscribe(
			res=>{
				this.ser_categories = res['service_categories'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	showaddServiceCategoryForm(){
		document.getElementById('addServiceCategoryFormRow').classList.remove('d-none');
		document.querySelector('#servicecategoryrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddServiceCategoryForm(){
		document.getElementById('addServiceCategoryFormRow').classList.add('d-none');
		document.querySelector('#servicecategoryrow .row .col-md-1').classList.remove('borderleft');
	}

	addServiceCategory(formval){
		var obj = {
			'service_category' : {
				'name':formval.name
			}
		};
		this.loaderService.display(true);
		this.categoryService.addServiceCategory(obj).subscribe(
			res=>{
				this.getServiceCategories();
				this.successDisplay('Service category Added successfully!');
				this.hideaddServiceCategoryForm();
				this.addServiceCategoryForm.reset();
				this.loaderService.display(false);
			},
			err=>{
				this.errorDisplay(JSON.parse(err['_body']).message);
				this.loaderService.display(false);
			}
		);
	}

	deleteSerCategory(id){
		if (confirm("Are You Sure you want to delete this service category") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteService_categories(id).subscribe(
				res=>{
					this.getServiceCategories();
					this.successDisplay('Service category deleted successfully!');
					this.loaderService.display(false);
				},
				err=>{
					this.errorDisplay(JSON.parse(err['_body']).message);
					this.loaderService.display(false);
				}
			);
		}
	}

	editSerCategoryName;
	editSerCategoryRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editSerCategoryName = data.name;
	}

	cancelEditCorematerialRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editSerCategoryName = undefined;
	}

	updateSerCategory(i,categoryId){
		if(this.editSerCategoryName!='' && this.editSerCategoryName!=undefined){
			this.loaderService.display(true);
			var obj = {
			    "service_category": {
			    	'name':this.editSerCategoryName
			    }
			}
			this.categoryService.updateService_categories(obj,categoryId).subscribe(
				res => {
					this.getServiceCategories();
					this.cancelEditCorematerialRow(i);
					this.editSerCategoryName = undefined;
					this.successDisplay('Updated successfully!');
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']).message);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorDisplay('Service category Name is required') ;
		}	
	}

	ser_subcategories;
	getServiceSubCategories(service_category_id?){
		this.initLoader = true;
		this.categoryService.listService_subcategories(service_category_id).subscribe(
			res=>{
				this.ser_subcategories = res['service_subcategories'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	showaddServiceSubCategoryForm(){
		document.getElementById('addServiceSubCategoryFormRow').classList.remove('d-none');
		document.querySelector('#servicesubcategoryrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddServiceSubCategoryForm(){
		document.getElementById('addServiceSubCategoryFormRow').classList.add('d-none');
		document.querySelector('#servicesubcategoryrow .row .col-md-1').classList.remove('borderleft');
	}

	addServiceSubCategory(formval){
		var obj = {
			'service_subcategory' : {
				'name':formval.name,
				'service_category_id':formval.service_category_id
			}
		};
		this.loaderService.display(true);
		this.categoryService.addService_subcategories(obj).subscribe(
			res=>{
				this.getServiceSubCategories('');
				this.successDisplay('Service sub category added successfully!');
				this.hideaddServiceSubCategoryForm();
				this.addServiceSubCategoryForm.reset();
				this.addServiceSubCategoryForm.controls['service_category_id'].setValue('');
				this.loaderService.display(false);
			},
			err=>{
				this.errorDisplay(JSON.parse(err['_body']).message);
				this.loaderService.display(false);
			}
		);
	}

	deleteSerSubCategory(id){
		if (confirm("Are You Sure you want to delete this service sub category") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteService_subcategories(id).subscribe(
				res=>{
					this.getServiceSubCategories('');
					this.successDisplay('Service sub category deleted successfully!');
					this.loaderService.display(false);
				},
				err=>{
					this.errorDisplay(JSON.parse(err['_body']).message);
					this.loaderService.display(false);
				}
			);
		}
	}

	editSerSubCategoryName;
	editSerSub_categoryId;
	editSerSubCategoryRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editSerSubCategoryName = data.name;
		this.editSerSub_categoryId =data.service_category_id;
	}

	cancelEditSerSubCategoryRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editSerSubCategoryName = undefined;
		this.editSerSub_categoryId = undefined;
	}

	updateSerSubCategory(i,categoryId){
		if(this.editSerSubCategoryName!='' && this.editSerSubCategoryName!=undefined &&
			this.editSerSub_categoryId != '' && this.editSerSub_categoryId != undefined){
			this.loaderService.display(true);
			var obj = {
			    "service_subcategory": {
			    	'name':this.editSerSubCategoryName,
			    	'service_category_id':this.editSerSub_categoryId
			    }
			}
			this.categoryService.updateService_subcategories(obj,categoryId).subscribe(
				res => {
					this.getServiceSubCategories('');
					this.cancelEditSerSubCategoryRow(i);
					this.editSerSubCategoryName = undefined;
					this.editSerSub_categoryId = undefined;
					this.successDisplay('Updated successfully!');
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']).message);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorDisplay('Service sub category name and category are required') ;
		}	
	}

	ser_activities;
	getServiceActivities(){
		this.initLoader = true;
		this.categoryService.listService_activities().subscribe(
			res=>{
				this.ser_activities = res['service_activities'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	showaddServiceActivityForm(){
		document.getElementById('addServiceActivityFormRow').classList.remove('d-none');
		document.querySelector('#serviceactivityrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddServiceActivityForm(){
		document.getElementById('addServiceActivityFormRow').classList.add('d-none');
		document.querySelector('#serviceactivityrow .row .col-md-1').classList.remove('borderleft');
	}

	addServiceActivity(formval){
		var obj = {
			'service_activity' : {
				'name':formval.name,
				'code':formval.code,
				'unit':formval.unit,
				'default_base_price':formval.default_base_price,
				'installation_price':formval.installation_price,
				'service_subcategory_id':formval.service_subcategory_id,
				'service_category_id':formval.service_category_id
			}
		};
		this.loaderService.display(true);
		this.categoryService.addService_activities(obj).subscribe(
			res=>{
				this.getServiceActivities();
				this.successDisplay('Service activity added successfully!');
				this.hideaddServiceActivityForm();
				this.addServiceActivityForm.reset();
				this.addServiceActivityForm.controls['service_category_id'].setValue('');
				this.addServiceActivityForm.controls['service_subcategory_id'].setValue('');
				this.loaderService.display(false);
			},
			err=>{
				this.errorDisplay(JSON.parse(err['_body']).message);
				this.loaderService.display(false);
			}
		);
	}

	deleteServiceActivity(id){
		if (confirm("Are You Sure you want to delete this service activity") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteService_activities(id).subscribe(
				res=>{
					this.getServiceActivities();
					this.successDisplay('Service activity deleted successfully!');
					this.loaderService.display(false);
				},
				err=>{
					this.errorDisplay(JSON.parse(err['_body']).message);
					this.loaderService.display(false);
				}
			);
		}
	}

	editSerActivityName;
	editSerActivityCode;
	editSerActivityUnit;
	editSerActivityDBS;
	editSerActivityIP;
	editSerActivity_categoryid;
	editSerActivity_subcategoryid;
	editSerActivityRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editSerActivityName = data.name;
		this.editSerActivityCode = data.code;
		this.editSerActivityUnit = data.unit;
		this.editSerActivityDBS = data.default_base_price;
		this.editSerActivityIP = data.installation_price;
		this.editSerActivity_categoryid =data.service_category_id;
		this.getServiceSubCategories(this.editSerActivity_categoryid)
		this.editSerActivity_subcategoryid = data.service_subcategory_id;
	}

	cancelEditSerActivityRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editSerActivityName = undefined;
		this.editSerActivityCode = undefined;
		this.editSerActivityUnit = undefined;
		this.editSerActivityDBS = undefined;
		this.editSerActivityIP = undefined;
		this.editSerActivity_categoryid = undefined;
		this.editSerActivity_subcategoryid = undefined;
	}

	updateSerActivity(i,id){
		if(this.editSerActivityName!='' && this.editSerActivityName!=undefined &&
			this.editSerActivityCode != '' && this.editSerActivityCode != undefined &&
			this.editSerActivityUnit != '' && this.editSerActivityUnit != undefined &&
			this.editSerActivityIP != '' && this.editSerActivityIP != undefined &&
			this.editSerActivity_categoryid != '' && this.editSerActivity_categoryid != undefined &&
			this.editSerActivity_subcategoryid != '' && this.editSerActivity_subcategoryid != undefined){
			this.loaderService.display(true);
			var obj = {
			    "service_activity": {
			    	'name':this.editSerActivityName,
						'code':this.editSerActivityCode,
						'unit':this.editSerActivityUnit,
						'default_base_price':this.editSerActivityDBS,
						'installation_price':this.editSerActivityIP,
						'service_subcategory_id':this.editSerActivity_subcategoryid,
						'service_category_id':this.editSerActivity_categoryid
			    }
			}
			this.categoryService.updateService_activities(obj,id).subscribe(
				res => {
					this.getServiceActivities();
					this.cancelEditSerActivityRow(i);
					this.editSerActivityName = undefined;
					this.editSerActivityCode = undefined;
					this.editSerActivityUnit = undefined;
					this.editSerActivityDBS = undefined;
					this.editSerActivityIP = undefined;
					this.editSerActivity_categoryid = undefined;
					this.editSerActivity_subcategoryid = undefined;
					this.successDisplay('Updated successfully!');
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']).message);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorDisplay('Service activity name, code, unit, installation price, category and sub category are required') ;
		}	
	}

	onChangeofCategory(){
		this.editSerActivity_subcategoryid = '';
	}
	successDisplay(msg){
		this.successMessage = msg;
		this.successalert = true;
		setTimeout(function() {
            	this.successalert = false;
         	}.bind(this), 13000);
	}

	errorDisplay(err){
		this.errorMessage = err;
		this.erroralert = true;
		setTimeout(function() {
            	this.erroralert = false;
         	}.bind(this), 13000);
	}
}
