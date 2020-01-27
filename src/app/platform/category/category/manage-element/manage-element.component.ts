import { Component, OnInit } from '@angular/core';
import { CategoryService} from '../category.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-manage-element',
  templateUrl: './manage-element.component.html',
  styleUrls: ['./manage-element.component.css'],
  providers:[CategoryService]
})
export class ManageElementComponent implements OnInit {

	errorMessage : string;
	erroralert = false;
	successalert = false;
	successMessage : string;
	initLoader:any = true;
	activeDropDownVal = 'module_types';
	addModuleTypeForm:FormGroup;
	addHardwareTypeForm:FormGroup;
	addHardwareElementForm:FormGroup;
	addCarcassElementForm:FormGroup;
	addHandleForm:FormGroup;
	addAddonsForm:FormGroup;
	addHardwareElemTypeForm:FormGroup;
	addCarcassElemTypeForm:FormGroup;
	addCustomElementForm:FormGroup;
	addModulesForm:FormGroup;
	addCombinedDoorForm:FormGroup;
	addAddonTagForm:FormGroup;
	attachment_file: any;
  basefile: any;

	constructor(
		private router: Router,
		private loaderService : LoaderService,
		private categoryService:CategoryService,
		private formBuilder:FormBuilder
	) { }

	ngOnInit() {
		this.loaderService.display(false);
		this.getModule_types();
		this.addModuleTypeForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			category:new FormControl("",Validators.required)
		});

		this.addHardwareElementForm = this.formBuilder.group({
			code:new FormControl("",Validators.required),
			category:new FormControl("",Validators.required),
			unit:new FormControl("",Validators.required),
			price:new FormControl("",Validators.required),
			brand_id:new FormControl("",Validators.required),
			hardware_type_id:new FormControl("",Validators.required),
			hardware_element_type_id:new FormControl("",Validators.required),
		});

		this.addCarcassElementForm = this.formBuilder.group({
			code:new FormControl("",Validators.required),
			category:new FormControl("",Validators.required),
			width:new FormControl("",Validators.required),
			depth:new FormControl("",Validators.required),
			height:new FormControl("",Validators.required),
			length:new FormControl("",Validators.required),
			breadth:new FormControl("",Validators.required),
			thickness:new FormControl("",Validators.required),
			area_sqft:new FormControl("",Validators.required),
			edge_band_thickness:new FormControl("",Validators.required),
			carcass_element_type_id:new FormControl("",Validators.required),
		});


		this.addHardwareTypeForm = this.formBuilder.group({
			name:new FormControl("",Validators.required)
		});
		this.addHandleForm = this.formBuilder.group({
			category:new FormControl("",Validators.required),
			code:new FormControl("",Validators.required),
			handle_type: new FormControl("",Validators.required),
			price: new FormControl("",Validators.required)
		});
		this.addAddonsForm = this.formBuilder.group({
			category:new FormControl("",Validators.required),
			code:new FormControl("",Validators.required),
			name: new FormControl("",Validators.required),
			specifications:new FormControl(""),
			brand_id:new FormControl(""),
			addon_image:new FormControl(""),
			price:new FormControl("",Validators.required),
			addon_tags_attributes: new FormArray([]),
			extra:new FormControl(""),
			vendor_sku:new FormControl("")
		});
		this.addHardwareElemTypeForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			category:new FormControl("")
		});
		this.addCarcassElemTypeForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			category:new FormControl(""),
			alum_glass_type: new FormControl("",Validators.required)
			//aluminium:new FormControl(false,Validators.required),
			//glass:new FormControl(false,Validators.required),
		});
		this.addCustomElementForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			measurements:new FormControl("",Validators.required),
			price:new FormControl("",Validators.required),
			global:new FormControl(),
			attachment_file:new FormControl(),
			product_module_id:new FormControl(),
		});

		this.addModulesForm = this.formBuilder.group({
			code:new FormControl("",Validators.required),
			description:new FormControl("",Validators.required),
			category:new FormControl("",Validators.required),
			module_type_id:new FormControl(),
			width:new FormControl(),
			height:new FormControl(),
			depth:new FormControl(),
			number_kitchen_addons:new FormControl(),
			module_image:new FormControl(),
			number_shutter_handles:new FormControl(),
			number_door_handles:new FormControl(),
			carcass_elements: this.formBuilder.array([this.buildCarcassElement()],Validators.required),
			hardware_elements: this.formBuilder.array([this.buildHardwareElement()],Validators.required),
			special_handles_only:new FormControl()
		});

		this.addCombinedDoorForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			code:new FormControl(""),
			price:new FormControl("",Validators.required),
			brand_id:new FormControl("")
		});

		this.addAddonTagForm = this.formBuilder.group({
			name:new FormControl("",Validators.required)
		});
	}

	categorySelect(category){
		this.fetchModuleType(category);
		this.fetchHardware(category);
		this.fetchCarcass(category);
	}

	buildCarcassElement() {
    return new FormGroup({
      id: new FormControl("", Validators.required),
      quantity: new FormControl(100)
    })
  }

  addNestedCarcass(){
  	const getFun = this.addModulesForm.get('carcass_elements') as FormArray;
  	getFun.push(this.buildCarcassElement())
  }

  addNestedHardware(){
  	const getFun = this.addModulesForm.get('hardware_elements') as FormArray;
  	getFun.push(this.buildHardwareElement())
  }

  buildHardwareElement() {
    return new FormGroup({
      id: new FormControl("", Validators.required),
      quantity: new FormControl(100)
    })
  }

  attachmentFile;
	attachmentFile_name;
	attachmentFile_basefile;
	addAttachment(event){
	  if (event.srcElement.files && event.srcElement.files[0]) {
	    this.attachmentFile = event.srcElement.files[0];
	    this.attachmentFile_name = event.srcElement.files[0].name;
	    var fileReader = new FileReader();
	    var base64;
	     fileReader.onload = (fileLoadedEvent) => {
	      base64 = fileLoadedEvent.target;
	      this.attachmentFile_basefile = base64.result;
	    };
	    fileReader.readAsDataURL(this.attachmentFile);
	  }
	}

	resetAttachement(){
		this.attachmentFile = null;
		this.attachmentFile_name = null;
		this.attachmentFile_basefile = null;
	}

	onChange(event) {
       this.attachment_file =event.target.files[0] || event.srcElement.files[0];
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.attachmentFile_basefile = base64.result;
             //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
           };
        fileReader.readAsDataURL(this.attachment_file);
    }

  activatedCategory:any;
  onCategoryChangeFromHardwareElement(val){
  	this.activatedCategory = val;
  	this.getCategoryFilteredHardware_element_types(this.activatedCategory);
  	this.getCategoryFilteredHardware_type(this.activatedCategory);
  }

	setActiveForm(val){
		this.activeDropDownVal = val;
		$(".container-set").addClass("d-none");
		if(val=='module_types'){
			this.getModule_types();
			document.getElementById('moduletyperow').classList.remove('d-none');
		} else if(val=='handles') {
			this.getHandles();
			document.getElementById('handlerow').classList.remove('d-none');
		} else if(val=='hardware_element') {
			this.getHardware_element();
			this.getBrandAndHandlesForAddons();
			document.getElementById('hardwareelementrow').classList.remove('d-none');
		} else if(val=='carcass_element') {
			this.getCarcass_element_types();
			this.getCarcass_element();
			document.getElementById('carcasselementrow').classList.remove('d-none');
		} else if(val=='hardware_type') {
			this.getHardware_type();
			document.getElementById('hardwaretyperow').classList.remove('d-none');
		} else if(val=='addons') {
			this.getAddons();
			this.getBrandAndHandlesForAddons();
			this.getAddonTags();
			document.getElementById('addonrow').classList.remove('d-none');
		} else if(val=='hardware_element_types') {
			this.getHardware_element_types();
			document.getElementById('hardware_element_typerow').classList.remove('d-none');
		} else if(val=='carcass_element_types') {
			this.getCarcass_element_types();
			document.getElementById('carcass_element_typesrow').classList.remove('d-none');
		} else if(val=='custom_element') {
			this.getCustomElement();
			document.getElementById('customelementrow').classList.remove('d-none');
		} else if(val=='modules') {
			this.getModules();
			document.getElementById('modulesrow').classList.remove('d-none');
		} else if(val=='combined_door') {
			this.getCombinedDoors();
			this.getBrandAndHandlesForAddons();
			document.getElementById('combined_door_row').classList.remove('d-none');
		} else if(val=='addontags') {
			this.getAddonTags();
			document.getElementById('addontags_row').classList.remove('d-none');
		}
	}

	hardware_element_types;
	getHardware_element_types(){
		this.initLoader = true;
		this.categoryService.listHardware_element_types().subscribe(
			res=>{
				this.hardware_element_types = res['hardware_element_types'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	getCategoryFilteredHardware_element_types(category){
		this.initLoader = true;
		this.categoryService.listCategoryFilteredHardware_element_types(category).subscribe(
			res=>{
				this.hardware_element_types = res['hardware_element_types'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}


	carcass_element_types;
	getCarcass_element_types(){
		this.initLoader = true;
		this.categoryService.listCarcass_element_types().subscribe(
			res=>{
				this.carcass_element_types = res['carcass_element_types'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}
	addons;
	getAddons(){
		this.initLoader = true;
		this.categoryService.listaddons().subscribe(
			res=>{
				this.addons = res['addons'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	addontags=[];
	selectedItems2=[];
	dropdownSettings2 ={
    	singleSelection: false,
	  	text:  "Select Addon Tag" ,
	  	selectAllText:'Select All',
	  	unSelectAllText:'UnSelect All',
	  	enableSearchFilter: true,
	  	classes:"myclass custom-class-dropdown",

    }
	getAddonTags(){
		this.initLoader = true;
		this.categoryService.listaddontags().subscribe(
			res=>{
				this.addontags = res['addon_tags'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	hardware_elements;
	getHardware_element(){
		this.initLoader = true;
		this.categoryService.listhardware_elements().subscribe(
			res=>{
				this.hardware_elements = res['hardware_elements'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	carcass_elements;
	getCarcass_element(){
		this.initLoader = true;
		this.categoryService.listcarcass_elements().subscribe(
			res=>{
				this.carcass_elements = res['carcass_elements'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	hardware_types;
	getHardware_type(){
		this.initLoader = true;
		this.categoryService.listhardware_types().subscribe(
			res=>{
				this.hardware_types = res['hardware_types'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	combined_doors;
	getCombinedDoors(){
		this.initLoader = true;
		this.categoryService.listCombined_doors().subscribe(
			res=>{
				this.combined_doors = res['combined_doors'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}
	getCategoryFilteredHardware_type(category){
		this.initLoader = true;
		this.categoryService.listCategoryFilteredhardware_types(category).subscribe(
			res=>{
				this.hardware_types = res['hardware_types'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	handles;
	getHandles(){
		this.initLoader = true;
		this.categoryService.listhandles().subscribe(
			res=>{
				this.handles = res['handles'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	module_types;
	getModule_types(){
		this.initLoader = true;
		this.categoryService.listModule_types().subscribe(
			res=>{
				this.module_types = res['module_types'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	barnds;
	getBrandAndHandlesForAddons(){
		this.initLoader=true;
		this.categoryService.listbrands().subscribe(
			res=>{
				this.barnds = res['brands'];
				this.initLoader=false;
			},
			err=>{
				
				this.initLoader=false;
			}
		);
		this.getHandles();
	}

	custom_elements;
	getCustomElement(){
		this.initLoader = true;
		this.categoryService.listCustomElement().subscribe(
			res=>{
				this.custom_elements = res['custom_elements'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	modules:any = [];
	getModules(){
		this.initLoader = false;
		this.categoryService.listModules().subscribe(
			res=>{
				this.modules = res.product_modules;
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}
	module_type_list:any = [];
	fetchModuleType(type){
    this.categoryService.fetchModuleType(type).subscribe(
    res => {
      this.module_type_list = res.module_types;
    },
    err => {
      
    });
  }

  carcass_list:any = [];
	fetchCarcass(category){
    this.categoryService.listCarcass_elements(category).subscribe(
    res => {
      this.carcass_list = res.carcass_elements;
    },
    err => {
      
    });
  }

  hardware_list:any = [];
	fetchHardware(category){
    this.categoryService.listHardware_elements(category).subscribe(
    res => {
      this.hardware_list = res.hardware_elements;
    },
    err => {
      
    });
  }

  createModule(obj){
  	this.loaderService.display(true);
  	if(this.attachmentFile_basefile){
  		obj['module_image'] = this.attachmentFile_basefile;
  	}
  	
  	this.categoryService.createModule(obj).subscribe(
    res => {
    	$("#modules").modal("hide");
    	this.getModules();
    	this.loaderService.display(false);
      this.resetAttachement();
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

	showaddModuleTypeForm(){
		document.getElementById('addModuleTypeFormRow').classList.remove('d-none');
		document.querySelector('#moduletyperow .row .col-md-1').classList.add('borderleft');
	}
	hideaddModuleTypeForm(){
		document.getElementById('addModuleTypeFormRow').classList.add('d-none');
		document.querySelector('#moduletyperow .row .col-md-1').classList.remove('borderleft');
	}
	showaddHardwareElementForm(){
		document.getElementById('addHardwareElementFormRow').classList.remove('d-none');
		document.querySelector('#hardwareelementrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddHardwareElementForm(){
		document.getElementById('addHardwareElementFormRow').classList.add('d-none');
		document.querySelector('#hardwareelementrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddCarcassElementForm(){
		document.getElementById('addCarcassElementFormRow').classList.remove('d-none');
		document.querySelector('#carcasselementrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddCarcassElementForm(){
		document.getElementById('addCarcassElementFormRow').classList.add('d-none');
		document.querySelector('#carcasselementrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddHardwareTypeForm(){
		document.getElementById('addHardwareTypeFormRow').classList.remove('d-none');
		document.querySelector('#hardwaretyperow .row .col-md-1').classList.add('borderleft');
	}
	hideaddHardwareTypeForm(){
		document.getElementById('addHardwareTypeFormRow').classList.add('d-none');
		document.querySelector('#hardwaretyperow .row .col-md-1').classList.remove('borderleft');
	}
	showaddHandleForm(){
		document.getElementById('addHandleFormRow').classList.remove('d-none');
		document.querySelector('#handlerow .row .col-md-1').classList.add('borderleft');
	}
	hideaddHandleForm(){
		document.getElementById('addHandleFormRow').classList.add('d-none');
		document.querySelector('#handlerow .row .col-md-1').classList.remove('borderleft');
	}
	showaddAddonForm(){
		document.getElementById('addAddonFormRow').classList.remove('d-none');
		document.querySelector('#addonrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddAddonForm(){
		document.getElementById('addAddonFormRow').classList.add('d-none');
		document.querySelector('#addonrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddHardwareElementTypeForm(){
		document.getElementById('addHardwareElemFormRow').classList.remove('d-none');
		document.querySelector('#hardware_element_typerow .row .col-md-1').classList.add('borderleft');
	}
	hideaddHardwareElementTypeForm(){
		document.getElementById('addHardwareElemFormRow').classList.add('d-none');
		document.querySelector('#hardware_element_typerow .row .col-md-1').classList.remove('borderleft');
	}
	showaddCarcassElementTypeForm(){
		document.getElementById('addCarcassElemFormRow').classList.remove('d-none');
		document.querySelector('#carcass_element_typesrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddCarcassElementTypeForm(){
		document.getElementById('addCarcassElemFormRow').classList.add('d-none');
		document.querySelector('#carcass_element_typesrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddCustomElementForm(){
		document.getElementById('addCustomElementFormRow').classList.remove('d-none');
		document.querySelector('#customelementrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddCustomElementForm(){
		document.getElementById('addCustomElementFormRow').classList.add('d-none');
		document.querySelector('#customelementrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddCombinedDoorForm(){
		document.getElementById('addCombineDoorFormRow').classList.remove('d-none');
		document.querySelector('#combined_door_row .row .col-md-1').classList.add('borderleft');
	}
	hideaddCombinedDoorForm(){
		document.getElementById('addCombineDoorFormRow').classList.add('d-none');
		document.querySelector('#combined_door_row .row .col-md-1').classList.remove('borderleft');
	}
	showaddAddontagsForm(){
		document.getElementById('addAddontagFormRow').classList.remove('d-none');
		document.querySelector('#addontags_row .row .col-md-1').classList.add('borderleft');
	}
	hideaddAddontagsForm(){
		document.getElementById('addAddontagFormRow').classList.add('d-none');
		document.querySelector('#addontags_row .row .col-md-1').classList.remove('borderleft');
	}

	showaddModuleForm(){
		$("#modules").modal({
			backdrop: 'static',
			keyboard:false,
			show:true
		});
	}

	editModuleTypeName;
	editModuleTypeCategory;
	editModuleTypeRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editModuleTypeName = data.name;
		this.editModuleTypeCategory = data.category;
		document.querySelector('#moduletyperow .table-responsive').classList.remove('col-7');
		document.querySelector('#moduletyperow .table-responsive').classList.add('col-9');
	}

	editHardwareElementCode;
	editHardwareElementCategory;
	editHardwareElementUnit;
	editHardwareElementPrice;
	editHardwareElementBrandId;
	editHardwareElementHardwareTypeId;
	editHardwareElementHardwareElementTypeId;
	editHardwareElementRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editHardwareElementCode = data.code;
		this.editHardwareElementCategory = data.category;
		this.editHardwareElementUnit = data.unit;
		this.editHardwareElementPrice = data.price;
		this.editHardwareElementBrandId = data.brand_id;
		this.editHardwareElementHardwareTypeId = data.hardware_type_id;
		this.editHardwareElementHardwareElementTypeId = data.hardware_element_type_id;
		// document.querySelector('#hardwaretyperow .table-responsive').classList.remove('col-9');
		// document.querySelector('#hardwaretyperow .table-responsive').classList.add('col-9');
	}

	editCarcassElementCode;
	editCarcassElementCategory;
	editCarcassElementWidth;
	editCarcassElementDepth;
	editCarcassElementHeight;
	editCarcassElementLength;
	editCarcassElementBreadth;
	editCarcassElementThickness;
	editCarcassElementAreaSqft;
	editCarcassElementEdgeBandThickness;
	editCarcassElementCarcassElementTypeId;
	editCarcassElementRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editCarcassElementCode = data.code;
		this.editCarcassElementCategory = data.category;
		this.editCarcassElementWidth = data.width;
		this.editCarcassElementDepth = data.depth;
		this.editCarcassElementHeight = data.height;
		this.editCarcassElementLength = data.length;
		this.editCarcassElementBreadth = data.breadth;
		this.editCarcassElementThickness = data.thickness;
		this.editCarcassElementAreaSqft = data.area_sqft;
		this.editCarcassElementEdgeBandThickness = data.edge_band_thickness;
		this.editCarcassElementCarcassElementTypeId = data.carcass_element_type_id;
		// document.querySelector('#hardwaretyperow .table-responsive').classList.remove('col-9');
		// document.querySelector('#hardwaretyperow .table-responsive').classList.add('col-9');
	}

	editHardwareTypeName;
	editHardwareTypeRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editHardwareTypeName = data.name;
		// document.querySelector('#hardwaretyperow .table-responsive').classList.remove('col-9');
		// document.querySelector('#hardwaretyperow .table-responsive').classList.add('col-9');
	}


	editHandle_type;
	editHandle_code;
	editHandle_category;
	editHandle_price;
	editHandle_img;
	editHandleRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editHandle_type = data.handle_type;
		this.editHandle_price = data.price;
		this.editHandle_code = data.code;
		this.editHandle_category = data.category;
	}

	editAddon_name;
	editAddon_img;
	editAddon_code;
	editAddon_price;
	editAddon_spec;
	editAddon_brand;
	editAddon_category;
	editAddon_extra;
	editAddon_vendor_sku;
	editAddonRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editAddon_category = data.category;
		this.editAddon_code = data.code;
		this.editAddon_name = data.name;
		// this.editAddon_handletype = data.handle_type;
		this.editAddon_price = data.price;
		this.editAddon_spec = data.specifications;
		this.editAddon_brand = data.brand_id;
		this.editAddon_extra = data.extra;
		this.editAddon_vendor_sku = data.vendor_sku;
	}

	editCombineDoor_code;
	editCombineDoor_name;
	editCombineDoor_price;
	editCombineDoor_brand;
	editCombineDoorRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editCombineDoor_code = data.code;
		this.editCombineDoor_name = data.name;
		this.editCombineDoor_price = data.price;
		this.editCombineDoor_brand = data.brand_id;
	}

	editHardwareElemTypeName;
	editHardwareElemTypeCategory;
	
	editHardwareElemTypeRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editHardwareElemTypeName = data.name;
		this.editHardwareElemTypeCategory = data.category;
		
	}

	editCarcassElemTypeName;
	editCarcassElemTypeCategory;
	// editCarcassElemTypeAluminium;
	// editCarcassElemTypeGlass;
	editCarcassElemTypeAlumGlassType
	editCarcassElemTypeRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editCarcassElemTypeName = data.name;
		this.editCarcassElemTypeCategory = data.category;
		this.editCarcassElemTypeAlumGlassType= (data.aluminium==true)?'aluminium':'glass';
		//this.editCarcassElemTypeAlumGlassType = data.aluminium;
		// this.editCarcassElemTypeGlass = data.glass;
	}

	editCustomElementName;
	editCustomElementRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editCustomElementName = data.name;
		document.querySelector('#customelementrow .table-responsive').classList.remove('col-7');
		document.querySelector('#customelementrow .table-responsive').classList.add('col-9');
	}

	editModuleName;
	editModuleCategory;
	editModuleCode;
	editModuleWidth;
	editModuleDepth;
	editModuleHeight;
	editModuleShutterHandleCount;
	editModuleDoorHandleCount;
	editModuleImg;
	editModuleRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editModuleName = data.name;
		this.editModuleCategory = data.category;
		this.editModuleCode = data.code;
		this.editModuleWidth = data.width;
		this.editModuleDepth = data.depth;
		this.editModuleHeight = data.height;
		this.editModuleShutterHandleCount = data.number_shutter_handles;
		this.editModuleDoorHandleCount = data.number_door_handles;
		document.querySelector('#modulesrow .table-responsive').classList.remove('col-7');
		document.querySelector('#modulesrow .table-responsive').classList.add('col-9');
	}

	editAddontagName;
	editAddontagRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editAddontagName = data.name;
		document.querySelector('#addontags_row .table-responsive').classList.remove('col-7');
		document.querySelector('#addontags_row .table-responsive').classList.add('col-9');
	}

	deleteModuleType(id){
		if (confirm("Are You Sure you want to delete this module type") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteModule_types(id).subscribe(
				res=>{
					this.getModule_types();
					this.successalert = true;
					this.successMessage = 'Module type successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteHardwareElement(id){
		if (confirm("Are You Sure you want to delete this hardware element") == true) {
			this.loaderService.display(true);
			this.categoryService.deletehardware_elements(id).subscribe(
				res=>{
					this.getHardware_element();
					this.successalert = true;
					this.successMessage = 'Hardware element successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteCarcassElement(id){
		if (confirm("Are You Sure you want to delete this carcass element") == true) {
			this.loaderService.display(true);
			this.categoryService.deletecarcass_elements(id).subscribe(
				res=>{
					this.getCarcass_element();
					this.successalert = true;
					this.successMessage = 'Carcass element successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteHardwareType(id){
		if (confirm("Are You Sure you want to delete this hardware type") == true) {
			this.loaderService.display(true);
			this.categoryService.deletehardware_types(id).subscribe(
				res=>{
					this.getHardware_type();
					this.successalert = true;
					this.successMessage = 'Hardware type successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteHandle(id){
		if (confirm("Are You Sure you want to delete this handle?") == true) {
			this.loaderService.display(true);
			this.categoryService.deletehandles(id).subscribe(
				res=>{
					this.getHandles();
					this.successalert = true;
					this.successMessage = 'Handle successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteAddon(id){
		if (confirm("Are You Sure you want to delete this addon?") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteaddon(id).subscribe(
				res=>{
					this.getAddons();
					this.successalert = true;
					this.successMessage = 'Addon successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteCombineDoor(id){
		if (confirm("Are You Sure you want to delete this combined door?") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteCombined_door(id).subscribe(
				res=>{
					this.getCombinedDoors();
					this.successalert = true;
					this.successMessage = 'Combined door successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteHardwareElemType(id){
		if (confirm("Are You Sure you want to delete this hardware element type?") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteHardware_element_types(id).subscribe(
				res=>{
					this.getHardware_element_types();
					this.successalert = true;
					this.successMessage = 'Hardware element type successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteCarcassElemType(id){
		if (confirm("Are You Sure you want to delete this carcass element type?") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteCarcass_element_types(id).subscribe(
				res=>{
					this.getCarcass_element_types();
					this.successalert = true;
					this.successMessage = 'Carcass element type successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteCustomElement(id){
		if (confirm("Are You Sure you want to delete this element") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteCustomElement(id).subscribe(
				res=>{
					this.getCustomElement();
					this.successalert = true;
					this.successMessage = 'Element deleted successfully!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteModule(id){
		if (confirm("Are You Sure you want to delete this module") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteModules(id).subscribe(
				res=>{
					this.getModules();
					this.successalert = true;
					this.successMessage = 'Element deleted successfully!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	deleteAddontag(id){
		if (confirm("Are You Sure you want to delete this addon tag") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteAddontags(id).subscribe(
				res=>{
					this.getAddonTags();
					this.successalert = true;
					this.successMessage = 'Addon tag successfully deleted!';
					setTimeout(function() {
						 this.successalert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				},
				err=>{
					this.erroralert =true;
					this.errorMessage=JSON.parse(err['_body']).message;
					setTimeout(function() {
						 this.erroralert = false;
					}.bind(this), 10000);
					this.loaderService.display(false);
				}
			);
		}
	}

	addModuletype(formval){
		var obj = {
			'module_type' : {
				'name':formval.name,
				'category':formval.category
			}
		};
		this.loaderService.display(true);
		this.categoryService.addModule_types(obj).subscribe(
			res=>{
				this.getModule_types();
				this.successalert = true;
				this.successMessage = 'Module type successfully added!';
				this.hideaddModuleTypeForm();
				this.addModuleTypeForm.reset();
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	addHardwareelement(formval){
		var obj = {
			'hardware_element' : {
				'code':formval.code,
				'category':formval.category,
				'unit':formval.unit,
				'price':formval.price,
				'brand_id':formval.brand_id,
				'hardware_type_id':formval.hardware_type_id,
				'hardware_element_type_id':formval.hardware_element_type_id
			}
		};
		this.loaderService.display(true);
		this.categoryService.addhardware_elements(obj).subscribe(
			res=>{
				this.getHardware_element();
				this.successalert = true;
				this.successMessage = 'Hardware element successfully added!';
				this.hideaddHardwareElementForm();
				this.addHardwareElementForm.reset();
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	addCarcasselement(formval){
		var obj = {
			'carcass_element' : {
				'code':formval.code,
				'category':formval.category,
				'width':formval.width,
				'depth':formval.depth,
				'height':formval.height,
				'length':formval.length,
				'breadth':formval.breadth,
				'thickness':formval.thickness,
				'area_sqft':formval.area_sqft,
				'edge_band_thickness':formval.edge_band_thickness,
				'carcass_element_type_id':formval.carcass_element_type_id
			}
		};
		this.loaderService.display(true);
		this.categoryService.addcarcass_elements(obj).subscribe(
			res=>{
				this.getCarcass_element();
				this.successalert = true;
				this.successMessage = 'Carcass element successfully added!';
				this.hideaddCarcassElementForm();
				this.addCarcassElementForm.reset();
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	addHardwaretype(formval){
		var obj = {
			'hardware_type' : {
				'name':formval.name
			}
		};
		this.loaderService.display(true);
		this.categoryService.addhardware_types(obj).subscribe(
			res=>{
				this.getHardware_type();
				this.successalert = true;
				this.successMessage = 'Hardware type successfully added!';
				this.hideaddHardwareTypeForm();
				this.addHardwareTypeForm.reset();
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}
	addHandle(formval){
		var obj;
		if(this.attachmentFile_basefile){
			obj = {
				'handle' : {
					'category':formval.category,
					'code':formval.code,
					'price':formval.price,
					'handle_type':formval.handle_type,
					'handle_image':this.attachmentFile_basefile
				}
			};
		}
		else{
			obj = {
				'handle' : {
					'category':formval.category,
					'code':formval.code,
					'price':formval.price,
					'handle_type':formval.handle_type
				}
			};
		}
		
		this.loaderService.display(true);
		this.categoryService.addhandles(obj).subscribe(
			res=>{
				this.getHandles();
				this.successalert = true;
				this.successMessage = 'Handle successfully added!';
				this.hideaddHandleForm();
				// attachmentFile_basefile = undefined;
				this.resetAttachement();
				(<HTMLInputElement>document.getElementById('fileimg')).value="";
				this.addHandleForm.reset();
				this.addHandleForm.controls['handle_type'].setValue("");
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	addon_tags_attributes=[];
	addAddon(formval){
		var obj;
		if(this.attachmentFile_basefile){
			obj = {
			'addon' : {
				'category':formval.category,
				'code':formval.code,
				'name':formval.name,
				'price':formval.price,
				'addon_image':this.attachmentFile_basefile,
				'specifications':formval.specifications,
				'brand_id':formval.brand_id,
				'addon_tags_attributes' :this.selectedItems2,
				// 'addon_tags_attributes' : formval.addon_tags_attributes,
				'extra':formval.extra,
				'vendor_sku':formval.vendor_sku
			}
		};
		}
		else{
			obj = {
			'addon' : {
				'category':formval.category,
				'code':formval.code,
				'name':formval.name,
				'price':formval.price,
				// 'handle_type':formval.handle_type,
				'specifications':formval.specifications,
				'brand_id':formval.brand_id,
				'addon_tags_attributes' :this.selectedItems2,
				// 'addon_tags_attributes' : formval.addon_tags_attributes,
				'extra':formval.extra,
				'vendor_sku':formval.vendor_sku
			}
		};
		}
		
		this.loaderService.display(true);
		this.categoryService.addaddon(obj).subscribe(
			res=>{
				this.getAddons();
				this.successalert = true;
				this.successMessage = 'Addon successfully added!';
				this.hideaddAddonForm();
				this.addAddonsForm.reset();
				this.addAddonsForm.controls['brand_id'].setValue("");
				this.selectedItems2 = [];
				// this.addAddonsForm.controls['addon_tags_attributes'] = new FormArray([]);
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
				this.resetAttachement();
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	addHardwareElemType(formval){
		var obj = {
			'hardware_element_type' : {
				'name':formval.name,
				'category':formval.category
			}
		};
		this.loaderService.display(true);
		this.categoryService.addHardware_element_types(obj).subscribe(
			res=>{
				this.getHardware_element_types();
				this.successalert = true;
				this.successMessage = 'Hardware element type successfully added!';
				this.hideaddHardwareElementTypeForm();
				this.addHardwareElemTypeForm.reset();
				this.addHardwareElemTypeForm.controls['category'].setValue("");
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	addCarcassElemType(formval){
		var obj = {
			'carcass_element_type' : {
				'name':formval.name,
				'category':formval.category,
				'aluminium':(formval.alum_glass_type=='aluminium')?true:false,
				'glass':(formval.alum_glass_type=='glass')?true:false,
			}
		};
		this.loaderService.display(true);
		this.categoryService.addCarcass_element_types(obj).subscribe(
			res=>{
				this.getCarcass_element_types();
				this.successalert = true;
				this.successMessage = 'Carcass element type successfully added!';
				this.hideaddCarcassElementTypeForm();
				this.addCarcassElemTypeForm.reset();
				this.addCarcassElemTypeForm.controls['category'].setValue("");
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}
	addCustomElement(formval){
		var obj = {
			'custom_element' : {
				'name':formval.name,
				'measurements':formval.measurements,
				'price':formval.price,
				'global':formval.global,
				'product_module_id':formval.product_module_id,
				'attachment_file':formval.attachment_file
			}
		};
		this.loaderService.display(true);
		this.categoryService.addCustomElement(obj).subscribe(
			res=>{
				this.getCustomElement();
				this.successalert = true;
				this.successMessage = 'Category Added successfully!';
				this.hideaddCustomElementForm();
				this.addCustomElementForm.reset();
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}
	addCombineddoor(formval){
		var obj = {
			'combined_door' : {
				'code':formval.code,
				'price':formval.price,
				'brand_id':formval.brand_id,
				'name':formval.name
			}
		};
		this.loaderService.display(true);
		this.categoryService.addcombinedDoor(obj).subscribe(
			res=>{
				this.getCombinedDoors();
				this.successalert = true;
				this.successMessage = 'Combined door successfully added!';
				this.hideaddCombinedDoorForm();
				this.addCombinedDoorForm.reset();
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	addAddonTag(formval){
		var obj = {
			'addon_tag' : {
				'name':formval.name
			}
		};
		this.loaderService.display(true);
		this.categoryService.addAddontags(obj).subscribe(
			res=>{
				this.getAddonTags();
				this.successalert = true;
				this.successMessage = 'Addon tag successfully added!';
				this.hideaddAddontagsForm();
				this.addAddonTagForm.reset();
				setTimeout(function() {
					 this.successalert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			},
			err=>{
				this.erroralert =true;
				this.errorMessage=JSON.parse(err['_body']).message;
				setTimeout(function() {
					 this.erroralert = false;
				}.bind(this), 10000);
				this.loaderService.display(false);
			}
		);
	}

	cancelEditModuletypeRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editModuleTypeName = undefined;
		this.editModuleTypeCategory = undefined;
		document.querySelector('#moduletyperow .table-responsive').classList.add('col-7');
		document.querySelector('#moduletyperow .table-responsive').classList.remove('col-9');
	}

	cancelEditHardwareelementRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editHardwareElementCode = undefined;
	  this.editHardwareElementCategory = undefined;
		this.editHardwareElementUnit = undefined;
		this.editHardwareElementPrice = undefined;
		this.editHardwareElementBrandId = undefined;
		this.editHardwareElementHardwareTypeId = undefined;
		this.editHardwareElementHardwareElementTypeId = undefined;
		// document.querySelector('#hardwaretyperow .table-responsive').classList.add('col-9');
		// document.querySelector('#hardwaretyperow .table-responsive').classList.remove('col-9');
	}

	cancelEditCarcasselementRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editCarcassElementCode = undefined;
		this.editCarcassElementCategory = undefined;
		this.editCarcassElementWidth = undefined;
		this.editCarcassElementDepth = undefined;
		this.editCarcassElementHeight = undefined;
		this.editCarcassElementLength = undefined;
		this.editCarcassElementBreadth = undefined;
		this.editCarcassElementThickness = undefined;
		this.editCarcassElementAreaSqft = undefined;
		this.editCarcassElementEdgeBandThickness = undefined;
		this.editCarcassElementCarcassElementTypeId = undefined;
		// document.querySelector('#hardwaretyperow .table-responsive').classList.add('col-9');
		// document.querySelector('#hardwaretyperow .table-responsive').classList.remove('col-9');
	}

	cancelEditHardwaretypeRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editHardwareTypeName = undefined;
		// document.querySelector('#hardwaretyperow .table-responsive').classList.add('col-9');
		// document.querySelector('#hardwaretyperow .table-responsive').classList.remove('col-9');
	}
	cancelEditHandleRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editHandle_type = undefined;
		this.editHandle_price = undefined;
		this.editHandle_code = undefined;
		this.editHandle_img = undefined;
	}
	cancelEditAddonRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editAddon_brand = undefined;
		this.editAddon_code = undefined;
		// this.editAddon_handletype = undefined;
		this.editAddon_price = undefined;
		this.editAddon_spec = undefined;
		this.editAddon_name = undefined;
		this.editAddon_extra = undefined;
		this.editAddon_vendor_sku = undefined;
		this.resetAttachement();
	}
	cancelEditCombineDoorRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editCombineDoor_brand=undefined;
		this.editCombineDoor_code =undefined;
		this.editCombineDoor_name =undefined;
		this.editCombineDoor_price=undefined;
	}

	cancelEditHardwareElemTypeRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editHardwareElemTypeName = undefined;
		this.editHardwareElemTypeCategory = undefined;
		
	}

	cancelEditCarcassElemTypeRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editCarcassElemTypeCategory = undefined;
		this.editCarcassElemTypeName = undefined;
		this.editCarcassElemTypeAlumGlassType = undefined;
	}

	cancelEditCustomElementRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editCustomElementName = undefined;
		document.querySelector('#customelementrow .table-responsive').classList.add('col-7');
		document.querySelector('#customelementrow .table-responsive').classList.remove('col-9');
	}


	cancelEditModuleRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editModuleName = undefined;
		this.editModuleCategory = undefined;
		this.editModuleCode = undefined;
		this.editModuleWidth = undefined;
		this.editModuleDepth = undefined;
		this.editModuleHeight = undefined;
		this.editModuleShutterHandleCount = undefined;
		this.editModuleDoorHandleCount = undefined;
		this.editModuleImg = undefined;
		this.resetAttachement();
	}

	cancelEditAddontagRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editAddontagName = undefined;
		document.querySelector('#addontags_row .table-responsive').classList.add('col-7');
		document.querySelector('#addontags_row .table-responsive').classList.remove('col-9');
	}

	updateModuletype(i,Id){
		if(this.editModuleTypeCategory!='' && this.editModuleTypeCategory!=undefined &&
			this.editModuleTypeName!='' && this.editModuleTypeName!=undefined){
			this.loaderService.display(true);
			var obj = {
			    "module_type": {
			    	'name':this.editModuleTypeName,
			    	'category':this.editModuleTypeCategory
			    }
			}
			this.categoryService.updateModule_types(obj,Id).subscribe(
				res => {
					this.getModule_types();
					this.cancelEditModuletypeRow(i);
					this.editModuleTypeName = undefined;
					this.editModuleTypeCategory = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']));
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Name and category are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	errorDisplay(err){
		var keys = Object.keys(err);
		for(let key of keys){
			for(let val of err[key]){
				this.errorMessage = key+" "+val;
				this.erroralert = true;
				setTimeout(function() {
                	this.erroralert = false;
             	}.bind(this), 13000);
			}
		}
	}

	updateHardwareelement(i,Id){
		if(this.editHardwareElementCode!='' && this.editHardwareElementCode!=undefined &&
			this.editHardwareElementCategory!='' && this.editHardwareElementCategory!=undefined &&
			this.editHardwareElementUnit!='' && this.editHardwareElementUnit!=undefined &&
			this.editHardwareElementPrice!='' && this.editHardwareElementPrice!=undefined &&
			this.editHardwareElementHardwareTypeId!='' && this.editHardwareElementHardwareTypeId!=undefined &&
			this.editHardwareElementHardwareElementTypeId!='' && this.editHardwareElementHardwareElementTypeId!=undefined &&
			this.editHardwareElementBrandId!='' && this.editHardwareElementBrandId!=undefined ){
			this.loaderService.display(true);
			var obj = {
			    "hardware_element": {
			    	'code':this.editHardwareElementCode,		    	
			    	'category':this.editHardwareElementCategory,
			    	'unit':this.editHardwareElementUnit,
			    	'price':this.editHardwareElementPrice,
			    	'brand_id':this.editHardwareElementBrandId,
			    	'hardware_type_id':this.editHardwareElementHardwareTypeId,
			    	'hardware_element_type_id':this.editHardwareElementHardwareElementTypeId,
			    }
			}
			this.categoryService.updatehardware_elements(obj,Id).subscribe(
				res => {
					this.getHardware_element();
					this.cancelEditHardwareelementRow(i);
					this.editHardwareElementCode = undefined;
					this.editHardwareElementCategory = undefined;
					this.editHardwareElementUnit = undefined;
					this.editHardwareElementPrice = undefined;
					this.editHardwareElementBrandId = undefined;
					this.editHardwareElementHardwareTypeId = undefined;
					this.editHardwareElementHardwareElementTypeId = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Code, category, unit, price, brand, hardware type and hardware element type are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}



	updateCarcasselement(i,Id){
		if(this.editCarcassElementCode!='' && this.editCarcassElementCode!=undefined &&
			this.editCarcassElementCategory!='' && this.editCarcassElementCategory!=undefined &&
			this.editCarcassElementWidth!='' && this.editCarcassElementWidth!=undefined &&
			this.editCarcassElementDepth!='' && this.editCarcassElementDepth!=undefined &&
			this.editCarcassElementHeight!='' && this.editCarcassElementHeight!=undefined &&
			this.editCarcassElementLength!='' && this.editCarcassElementLength!=undefined &&
			this.editCarcassElementBreadth!='' && this.editCarcassElementBreadth!=undefined &&
			this.editCarcassElementThickness!='' && this.editCarcassElementThickness!=undefined &&
			this.editCarcassElementAreaSqft!='' && this.editCarcassElementAreaSqft!=undefined &&
			this.editCarcassElementEdgeBandThickness!='' && this.editCarcassElementEdgeBandThickness!=undefined &&
			this.editCarcassElementCarcassElementTypeId!='' && this.editCarcassElementCarcassElementTypeId!=undefined){
			
			this.loaderService.display(true);
			var obj = {
			    "carcass_element": {
			    	'code':this.editCarcassElementCode,
			    	'category':this.editCarcassElementCategory,
			    	'width':this.editCarcassElementWidth,
			    	'depth':this.editCarcassElementDepth,
			    	'height':this.editCarcassElementHeight,
			    	'length':this.editCarcassElementLength,
			    	'breadth':this.editCarcassElementBreadth,
			    	'thickness':this.editCarcassElementThickness,
			    	'area_sqft':this.editCarcassElementAreaSqft,
			    	'edge_band_thickness':this.editCarcassElementEdgeBandThickness,
			    	'carcass_element_type_id':this.editCarcassElementCarcassElementTypeId
			    }
			}
			this.categoryService.updatecarcass_elements(obj,Id).subscribe(
				res => {
					this.getCarcass_element();
					this.cancelEditCarcasselementRow(i);
					this.editCarcassElementCode = undefined;
					this.editCarcassElementCategory = undefined;
					this.editCarcassElementWidth = undefined;
					this.editCarcassElementDepth = undefined;
					this.editCarcassElementHeight = undefined;
					this.editCarcassElementLength = undefined;
					this.editCarcassElementBreadth = undefined;
					this.editCarcassElementThickness = undefined;
					this.editCarcassElementAreaSqft = undefined;
					this.editCarcassElementEdgeBandThickness = undefined;
					this.editCarcassElementCarcassElementTypeId = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			); 
		} else {
			this.errorMessage = 'Code, category, width, depth, height, length, breadth, thickness, area sqft, edge band thickness and carcass element type are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateHardwaretype(i,Id){
		if(this.editHardwareTypeName!='' && this.editHardwareTypeName!=undefined){
			this.loaderService.display(true);
			var obj = {
			    "hardware_type": {
			    	'name':this.editHardwareTypeName
			    }
			}
			this.categoryService.updatehardware_types(obj,Id).subscribe(
				res => {
					this.getHardware_type();
					this.cancelEditHardwaretypeRow(i);
					this.editHardwareTypeName = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Name is required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateHandle(i,Id){
		var obj;
		if(this.editHandle_category!='' && this.editHandle_category!=undefined &&
			this.editHandle_code!='' && this.editHandle_code!=undefined &&
			this.editHandle_price!='' && this.editHandle_price!=undefined &&
			this.editHandle_type!='' && this.editHandle_type!=undefined ){
			this.loaderService.display(true);
			if(this.attachmentFile_basefile){
				obj = {
				    "handle": {
				    	'category':this.editHandle_category,
				    	'code':this.editHandle_code,
				    	'price':this.editHandle_price,
				    	'handle_type':this.editHandle_type,
				    	'handle_image':this.attachmentFile_basefile
				    }
				}
			}
			else{
				obj = {
				    "handle": {
				    	'category':this.editHandle_category,
				    	'code':this.editHandle_code,
				    	'price':this.editHandle_price,
				    	'handle_type':this.editHandle_type
				    }
				}
			}
			
			this.categoryService.updatehandles(obj,Id).subscribe(
				res => {
					this.getHandles();
					this.cancelEditHandleRow(i);
					this.editHandle_code = undefined;
					this.editHandle_type = undefined;
					this.editHandle_price = undefined;
					// this.attachmentFile_basefile = undefined;
					this.resetAttachement();
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Category, code, price and handle type are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateAddon(i,Id){
		if(this.editAddon_category!='' && this.editAddon_category!=undefined &&
			this.editAddon_code!='' && this.editAddon_code!=undefined &&
			this.editAddon_price!='' && this.editAddon_price!=undefined &&
			this.editAddon_name!='' && this.editAddon_name!=undefined ){
			this.loaderService.display(true);
			var obj;
			if(this.attachmentFile_basefile){
				obj = {
				    'addon' : {
				    	'category':this.editAddon_category,
						'code':this.editAddon_code,
						'name':this.editAddon_name,
						'addon_image': this.attachmentFile_basefile,
						'price':this.editAddon_price,
						// 'handle_type':this.editAddon_handletype,
						'specifications':this.editAddon_spec,
						'brand_id':this.editAddon_brand,
						'extra':this.editAddon_extra,
						'vendor_sku':this.editAddon_vendor_sku
					}
				}
			}
			else{
				obj = {
				    'addon' : {
				    	'category':this.editAddon_category,
						'code':this.editAddon_code,
						'name':this.editAddon_name,
						'price':this.editAddon_price,
						// 'handle_type':this.editAddon_handletype,
						'specifications':this.editAddon_spec,
						'brand_id':this.editAddon_brand,
						'extra':this.editAddon_extra,
						'vendor_sku':this.editAddon_vendor_sku
					}
				}
			}
			this.categoryService.updateaddon(obj,Id).subscribe(
				res => {
					this.getAddons();
					this.cancelEditAddonRow(i);
					this.editAddon_code = undefined;
					this.editAddon_name = undefined;
					this.editAddon_price = undefined;
					// this.editAddon_handletype = undefined;
					this.editAddon_spec = undefined;
					this.editAddon_brand = undefined;
					this.editAddon_extra = undefined;
					this.editAddon_vendor_sku = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
					this.resetAttachement();
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Category, code, name and price  are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateHardwareElemType(i,Id){
		if(this.editHardwareElemTypeName!='' && this.editHardwareElemTypeName!=undefined ){
			this.loaderService.display(true);
			var obj = {
			    "hardware_element_type": {
			    	'name':this.editHardwareElemTypeName,
			    	'category':this.editHardwareElemTypeCategory
			    }
			}
			this.categoryService.updateHardware_element_types(obj,Id).subscribe(
				res => {
					this.getHardware_element_types();
					this.cancelEditHardwareElemTypeRow(i);
					this.editHardwareElemTypeName = undefined;
					this.editHardwareElemTypeCategory= undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Name is required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateCarcassElemType(i,Id){
		if(this.editCarcassElemTypeName!='' && this.editCarcassElemTypeName!=undefined &&
			this.editCarcassElemTypeAlumGlassType!='' && this.editCarcassElemTypeAlumGlassType!=undefined){
			this.loaderService.display(true);
			var obj = {
			    'carcass_element_type': {
			    	'name':this.editCarcassElemTypeName,
			    	'category':this.editCarcassElemTypeCategory,
			    	'aluminium':(this.editCarcassElemTypeAlumGlassType=='aluminium')?true:false,
			    	'glass':(this.editCarcassElemTypeAlumGlassType=='glass')?true:false
			    }
			}
			this.categoryService.updateCarcass_element_types(obj,Id).subscribe(
				res => {
					this.getCarcass_element_types();
					this.cancelEditCarcassElemTypeRow(i);
					this.editCarcassElemTypeName = undefined;
					this.editCarcassElemTypeCategory= undefined;
					this.editCarcassElemTypeAlumGlassType = undefined;
					//this.editCarcassElemTypeAluminium= false;
					//this.editCarcassElemTypeGlass= false;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Name and type are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateCustomElement(i,materialId){
		this.loaderService.display(true);
		var obj = {
		    "categories": {
		    	'name':this.editCustomElementName
		    }
		}
		this.categoryService.updateCategories(obj,materialId).subscribe(
			res => {
				this.getCustomElement();
				this.cancelEditCustomElementRow(i);
				this.editCustomElementName = undefined;
				this.successMessage = 'Updated successfully!';
				this.successalert = true;
				setTimeout(function() {
                	this.successalert = false;
             	}.bind(this), 13000);
				this.loaderService.display(false);
			},
			err => {
				this.errorDisplay(JSON.parse(err['_body']))
				this.loaderService.display(false);
			}
		);
	}

	updateModule(i,materialId){
		if(this.editModuleCode!='' && this.editModuleCode!=undefined &&
			this.editModuleName!='' && this.editModuleName!=undefined &&
			this.editModuleCategory!='' && this.editModuleCategory!=undefined ){
			this.loaderService.display(true);
			var obj = {
			    "categories": {
			    	'code':this.editModuleCode,
			    	'description':this.editModuleName,
			    	'category':this.editModuleCategory,
			    	// 'module_type_id':this.editCustomElementName,
			    	'width':this.editModuleWidth,
			    	'height':this.editModuleHeight,
			    	'depth':this.editModuleDepth,
			    	// 'number_kitchen_addons':this.editCustomElementName,
			    	'module_image':this.editModuleImg,
			    	'number_shutter_handles':this.editModuleShutterHandleCount,
			    	'number_door_handles':this.editModuleDoorHandleCount,
			    }

			}
			this.categoryService.updateCategories(obj,materialId).subscribe(
				res => {
					this.getModules();
					this.cancelEditModuleRow(i);
					this.editModuleName = undefined;
					this.editModuleCategory = undefined;
					this.editModuleCode = undefined;
					this.editModuleWidth = undefined;
					this.editModuleDepth = undefined;
					this.editModuleHeight = undefined;
					this.editModuleShutterHandleCount = undefined;
					this.editModuleDoorHandleCount = undefined;
					this.editModuleImg = undefined;
					this.resetAttachement();
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(err['_body'])
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Code, category and description are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateCombineDoor(i,Id){
		if(this.editCombineDoor_name!='' && this.editCombineDoor_name!=undefined &&
			this.editCombineDoor_price!='' && this.editCombineDoor_price!=undefined ){
			this.loaderService.display(true);
			var obj= {
				    'combined_door' : {
						'code':this.editCombineDoor_code,
						'name':this.editCombineDoor_name,
						'price':this.editCombineDoor_price,
						'brand_id':this.editCombineDoor_brand
					}
				}
			this.categoryService.updateCombined_door(obj,Id).subscribe(
				res => {
					this.getCombinedDoors();
					this.cancelEditCombineDoorRow(i);
					this.editCombineDoor_code = undefined;
					this.editCombineDoor_name = undefined;
					this.editCombineDoor_price = undefined;
					this.editCombineDoor_brand = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']))
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Name and price are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateAddontag(i,Id){
		if(this.editAddontagName!='' && this.editAddontagName!=undefined ){
			this.loaderService.display(true);
			var obj = {
			    "addon_tag": {
			    	'name':this.editAddontagName
			    }
			}
			this.categoryService.updateAddontags(obj,Id).subscribe(
				res => {
					this.getAddonTags();
					this.cancelEditAddontagRow(i);
					this.editAddontagName = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorDisplay(JSON.parse(err['_body']));
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Name is required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	activateModuleTab(tab){
		if(tab == "carcass-element"){
			$("#carcass-element").click()
		}
		else if(tab == "hardware-element"){
			$("#hardware-element").click()
		}
	}

	radioClick(event, cat){
		if(cat == 'aluminium'){
			this.editCarcassElemTypeAlumGlassType = cat;
	
		}
		else if(cat == 'glass'){
			this.editCarcassElemTypeAlumGlassType = cat;
		}
	}

	updatedAddontagsArr = [];
	updatedAddonId;
	setUpdatedAddontagsArr(val,addonid){
		for(var i=0;i<val.length;i++){
			this.updatedAddontagsArr.push(val[i].id);
		}
		this.updatedAddonId = addonid;
	}

	onCheckboxChange(event){
		var val= JSON.parse(event.target.value);
		if(event.target.checked){
      this.updatedAddontagsArr.push(val['id']);
    }
    else{
      var j:number = 0;
      this.updatedAddontagsArr.forEach((ctr) => {
        if(ctr == val['id']) {
          this.updatedAddontagsArr.splice(j,1);
          return;
        }
        j++;
      });
    }
	}

	updateAddonTagofAddon(){
		this.loaderService.display(true);
		var obj = {
			"addon_tags":this.updatedAddontagsArr
		}
		this.categoryService.updateAddontagOfAddon(obj,this.updatedAddonId).subscribe(
			res=>{
				this.getAddons();
				this.updatedAddonId = undefined;
				this.updatedAddontagsArr=[];
				this.successMessage = 'Updated successfully!';
				$('#addontagModal').modal('hide');
				this.successalert = true;
				setTimeout(function() {
                	this.successalert = false;
             	}.bind(this), 13000);
					this.loaderService.display(false);
				this.loaderService.display(false);
			},
			err=>{
				
				this.loaderService.display(false);
				this.errorMessage = JSON.parse(err['_body']);
				this.erroralert = true;
				setTimeout(function() {
	              	this.erroralert = false;
	           	}.bind(this), 13000);
				}
		);
	}
		onItemSelect(item:any){
    	(document.getElementsByClassName('c-btn')[0]).getElementsByTagName('span')[0].innerHTML='';
    	for(var k=0;k<this.selectedItems2.length;k++){
    		(document.getElementsByClassName('c-btn')[0]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
    	}
    }
    OnItemDeSelect(item:any){
    	(document.getElementsByClassName('c-btn')[0]).getElementsByTagName('span')[0].innerHTML='';
        	for(var k=0;k<this.selectedItems2.length;k++){
        		(document.getElementsByClassName('c-btn')[0]).getElementsByTagName('span')[0].innerHTML += this.selectedItems2[k].itemName+',';
        	}
    }
    onSelectAll(items: any){
    }
    onDeSelectAll(items: any){
    }
}
