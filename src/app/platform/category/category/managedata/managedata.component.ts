import { Component, OnInit } from '@angular/core';
import { CategoryService} from '../category.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { LeadService } from '../../../lead/lead.service';
declare var $:any;
@Component({
  selector: 'app-managedata',
  templateUrl: './managedata.component.html',
  styleUrls: ['./managedata.component.css'],
  providers:[CategoryService,LeadService]
})
export class ManagedataComponent implements OnInit {

	errorMessage : string;
	erroralert = false;
	successalert = false;
	successMessage : string;
	initLoader:any = true;
	activeDropDownVal = 'core_materials';
	core_materials;
	addCoreMaterialForm:FormGroup;
	addShutterFinishForm:FormGroup;
	addShadeForm:FormGroup;
	addBrandForm:FormGroup;
	addSkirting_configForm:FormGroup;
	addCategoryForm:FormGroup;
	addCmpForm:FormGroup;
	addEdgeBandingShadeForm:FormGroup;
	addKitchenApplianceForm:FormGroup;
	inviteChampionForm: FormGroup;
	champion_user: any;
	champion_list_first_level: any[];
	champion_list_second_level: any[];
	champion_list_third_level: any;
	champion_types: any;
	lead_types: any;
	addLeadForm:FormGroup;
	lead_campaigns: any;
	lead_sources: any;
	csagentsArr: any;
	dropdownList: any;
	dropdownList2: any;
	dropdownList3: any;
	dropdownList4: any;
	dropdownList5: any;
	basefile: any;
	is_champion;

	constructor(
		private router: Router,
		private loaderService : LoaderService,
		private categoryService:CategoryService,
		private formBuilder:FormBuilder,
		private leadService : LeadService
	) { 

	}

	ngOnInit() {
		this.loaderService.display(false);
		this.getCoreMaterials();
		 this.is_champion = localStorage.getItem('isChampion');
		this.addCoreMaterialForm = this.formBuilder.group({
			name:new FormControl("",Validators.required)
		});
		this.addShutterFinishForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			price:new FormControl("",Validators.required)
		});
		this.addShadeForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			code:new FormControl("",Validators.required),
			shade_image:new FormControl(""),
			edge_banding_shade_id:new FormControl("")
		});
		this.addBrandForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			hardware:new FormControl(""),
			addon:new FormControl("")
		});
		this.addSkirting_configForm = this.formBuilder.group({
			skirting_type:new FormControl("",Validators.required),
			skirting_height:new FormControl("",Validators.required),
			price: new FormControl("",Validators.required)
		});
		this.addCategoryForm = this.formBuilder.group({
			name:new FormControl("",Validators.required)
		});
		this.addCmpForm = this.formBuilder.group({
			thickness:new FormControl("",Validators.required),
			price:new FormControl("",Validators.required),
			core_material_id:new FormControl("",Validators.required),
		});
		this.addEdgeBandingShadeForm = this.formBuilder.group({
			name:new FormControl(""),
			code:new FormControl("",Validators.required),
			shade_image:new FormControl("")
		});
		this.addKitchenApplianceForm = this.formBuilder.group({
			name:new FormControl("",Validators.required),
			code:new FormControl("",Validators.required),
			make:new FormControl(""),
			price:new FormControl(""),
			module_type_id:new FormControl("",Validators.required),
			appliance_image:new FormControl(""),
			vendor_sku:new FormControl("")
		});

		this.inviteChampionForm = this.formBuilder.group({
			name : new FormControl("",[Validators.required]),
			email : new FormControl("",[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
					Validators.required]),
			contact : new FormControl("",[Validators.required]),
			parent_id : new FormControl(""),
			champion_level: new FormControl("",[Validators.required]),
			user_type:new FormControl("arrivae_champion")
		  });

		  this.addLeadForm = this.formBuilder.group({
			name : new FormControl(""),
			email : new FormControl("",[Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]),
			contact : new FormControl("",[Validators.required]),
			pincode : new FormControl(""),
			lead_type_id : new FormControl("",Validators.required),
		  lead_source_id : new FormControl("",Validators.required),
		  lead_campaign_id:new FormControl(""),
		  instagram_handle: new FormControl(""),
		  lead_type_name:new FormControl()
    });
    this.getFiltersData();
	}
	setActiveForm(val){
		this.activeDropDownVal = val;
		$(".container-set").addClass("d-none");
		if(val=='core_materials'){
			this.getCoreMaterials();
			document.getElementById('corematerialrow').classList.remove('d-none');
		} else if(val=='brands') {
			this.getBrands();
			document.getElementById('brandrow').classList.remove('d-none');
		} else if(val=='shades') {
			this.getShades();
			this.getEdgeBandingShades();
			document.getElementById('shaderow').classList.remove('d-none');
		} else if(val=='shutter_finishes') {
			this.getShutter_finishes();
			document.getElementById('shutter_finisherow').classList.remove('d-none');
		} else if(val=='skirting_config') {
			this.getSkirting_config();
			document.getElementById('skirtingconfigrow').classList.remove('d-none');
		} else if(val=='category') {
			this.getCategory();
			document.getElementById('categoryrow').classList.remove('d-none');
		}else if(val=='core_material_price') {
			this.getCmp();
			this.getCoreMaterials();
			document.getElementById('corematerialpricerow').classList.remove('d-none');
		} else if(val=='edgebanding_shades') {
			this.getEdgeBandingShades();
			document.getElementById('edgebandingshaderow').classList.remove('d-none');
		} else if(val=='kitchenappliances') {
			this.getKitchen_appliances();
			this.getModuletypeForKitchen_appliances();
			document.getElementById('kitchen_appliancerow').classList.remove('d-none');
		}
	}
	getCoreMaterials(){
		this.initLoader = true;
		this.categoryService.listCoreMateial().subscribe(
			res=>{
				this.core_materials = res['core_materials'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}
	brands;
	getBrands(){
		this.initLoader = true;
		this.categoryService.listbrands().subscribe(
			res=>{
				this.brands = res['brands'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	shutter_finishes;
	getShutter_finishes(){
		this.initLoader = true;
		this.categoryService.listShutter_finishes().subscribe(
			res=>{
				this.shutter_finishes = res['shutter_finishes'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	shades;
	getShades(){
		this.initLoader = true;
		this.categoryService.listShades().subscribe(
			res=>{
				this.shades = res['shades'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	edgebinding_shades;
	getEdgeBandingShades(){
		this.initLoader = true;
		this.categoryService.listEdgebandingShades().subscribe(
			res=>{
				this.edgebinding_shades = res['edge_banding_shades'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	skirting_config;
	getSkirting_config(){
		this.initLoader = true;
		this.categoryService.listSkirting_configs().subscribe(
			res=>{
				this.skirting_config = res['skirting_configs'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}
	categories;
	getCategory(){
		this.initLoader = true;
		this.categoryService.listCategories().subscribe(
			res=>{
				this.categories = res['kitchen_categories'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	core_material_prices;
	getCmp(){
		this.initLoader = true;
		this.categoryService.listCoreMaterialPrices().subscribe(
			res=>{
				this.core_material_prices = res['core_material_prices'];
				this.initLoader = false;
			},
			err => {
				
				this.initLoader = false;
			}
		);
	}

	kitchen_appliances;
  getKitchen_appliances(){
      this.initLoader = true;
      this.categoryService.listKitchen_appliances().subscribe(
          res=>{
              this.kitchen_appliances = res['kitchen_appliances'];
              this.initLoader = false;
          },
          err => {
              
              this.initLoader = false;
          }
      );
  }

  moduletypes_kitchen_appliances;
  getModuletypeForKitchen_appliances(){
  	this.initLoader = true;
  	this.categoryService.getModuletypeForKitchen_appliances().subscribe(
          res=>{
              this.moduletypes_kitchen_appliances = res['module_types'];
              this.initLoader = false;
          },
          err => {
              
              this.initLoader = false;
          }
      );
  }

	showaddCorematForm(){
		document.getElementById('addcorematerialFormRow').classList.remove('d-none');
		document.querySelector('#corematerialrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddCorematForm(){
		document.getElementById('addcorematerialFormRow').classList.add('d-none');
		document.querySelector('#corematerialrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddShutterFinishesForm(){
		document.getElementById('addshutter_finisheFormRow').classList.remove('d-none');
		document.querySelector('#shutter_finisherow .row .col-md-1').classList.add('borderleft');
	}
	hideaddShutterFinishesForm(){
		document.getElementById('addshutter_finisheFormRow').classList.add('d-none');
		document.querySelector('#shutter_finisherow .row .col-md-1').classList.remove('borderleft');
	}
	showaddShadesForm(){
		document.getElementById('addshadeFormRow').classList.remove('d-none');
		document.querySelector('#shaderow .row .col-md-1').classList.add('borderleft');
	}
	hideaddShadesForm(){
		document.getElementById('addshadeFormRow').classList.add('d-none');
		document.querySelector('#shaderow .row .col-md-1').classList.remove('borderleft');
	}
	showaddSkirtingConfigForm(){
		document.getElementById('addskirtingconfigFormRow').classList.remove('d-none');
		document.querySelector('#skirtingconfigrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddSkirtingConfigForm(){
		document.getElementById('addskirtingconfigFormRow').classList.add('d-none');
		document.querySelector('#skirtingconfigrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddBrandsForm(){
		document.getElementById('addbrandFormRow').classList.remove('d-none');
		document.querySelector('#brandrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddBrandsForm(){
		document.getElementById('addbrandFormRow').classList.add('d-none');
		document.querySelector('#brandrow .row .col-md-1').classList.remove('borderleft');
	}
	showaddCategoryForm(){
		document.getElementById('addcategoryFormRow').classList.remove('d-none');
		document.querySelector('#categoryrow .row .col-md-1').classList.add('borderleft');
	}
	hideaddCategoryForm(){
		document.getElementById('addcategoryFormRow').classList.add('d-none');
		document.querySelector('#categoryrow .row .col-md-1').classList.remove('borderleft');
	}

	showaddCmpForm(){
		document.getElementById('addcmpFormRow').classList.remove('d-none');
		document.querySelector('#corematerialpricerow .row .col-md-1').classList.add('borderleft');
	}

	hideaddCmpForm(){
		document.getElementById('addcmpFormRow').classList.add('d-none');
		document.querySelector('#corematerialpricerow .row .col-md-1').classList.remove('borderleft');
	}
	showaddEdgebandingShadesForm(){
		document.getElementById('addedgebandingshadeFormRow').classList.remove('d-none');
		document.querySelector('#edgebandingshaderow .row .col-md-1').classList.add('borderleft');
	}
	hideaddEdgebandingShadesForm(){
		document.getElementById('addedgebandingshadeFormRow').classList.add('d-none');
		document.querySelector('#edgebandingshaderow .row .col-md-1').classList.remove('borderleft');
	}
	showaddKitchen_applianceForm(){
    document.getElementById('addkitchen_applianceFormRow').classList.remove('d-none');
    document.querySelector('#kitchen_appliancerow .row .col-md-1').classList.add('borderleft');
  }
  hideaddKitchen_applianceForm(){
    document.getElementById('addkitchen_applianceFormRow').classList.add('d-none');
    document.querySelector('#kitchen_appliancerow .row .col-md-1').classList.remove('borderleft');
  }

	addCoremat(formval){
		var obj = {
			'core_material' : {
				'name':formval.name
			}
		};
		this.loaderService.display(true);
		this.categoryService.addCoreMateial(obj).subscribe(
			res=>{
				this.getCoreMaterials();
				this.successalert = true;
				this.successMessage = 'Core material Added successfully!';
				this.hideaddCorematForm();
				this.addCoreMaterialForm.reset();
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

	addShutterFinish(formval){
		var obj = {
			'shutter_finish' : {
				'name':formval.name,
				'price':formval.price
			}
		};
		this.loaderService.display(true);
		this.categoryService.addShutter_finishes(obj).subscribe(
			res=>{
				this.getShutter_finishes();
				this.successalert = true;
				this.successMessage = 'Shutter finish added successfully!';
				this.hideaddShutterFinishesForm();
				this.addShutterFinishForm.reset();
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

	addSkirtingConfig(formval){
		var obj = {
			'skirting_config' : {
				'skirting_type':formval.skirting_type,
				'skirting_height':formval.skirting_height,
				'price':formval.price
			}
		};
		this.loaderService.display(true);
		this.categoryService.addSkirting_configs(obj).subscribe(
			res=>{
				this.getSkirting_config();
				this.successalert = true;
				this.successMessage = 'Skirting config added successfully!';
				this.hideaddSkirtingConfigForm();
				this.addSkirting_configForm.reset();
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

	addEdgeBandingShade(formval){
		var obj = {}
		if(this.attachmentFile_basefile){
			obj = {
				'edge_banding_shade' : {
					'name':formval.name,
					'code':formval.code,
					'shade_image': this.attachmentFile_basefile
				}
			};
		}
		else{
			obj = {
				'edge_banding_shade' : {
					'name':formval.name,
					'code':formval.code
				}
			};
		}
		
		this.loaderService.display(true);
		this.categoryService.addEdgebandingShades(obj).subscribe(
			res=>{
				this.getEdgeBandingShades();
				this.successalert = true;
				this.successMessage = 'Edge banding shade added successfully!';
				this.hideaddEdgebandingShadesForm();
				this.addEdgeBandingShadeForm.reset();
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

	addShade(formval){
		var obj = {}
		if(this.attachmentFile_basefile){
			obj = {
				'shade' : {
					'name':formval.name,
					'code':formval.code,
					'shade_image': this.attachmentFile_basefile,
					'edge_banding_shade_id':formval.edge_banding_shade_id
				}
			};
		}
		else{
			obj = {
				'shade' : {
					'name':formval.name,
					'code':formval.code,
					'edge_banding_shade_id':formval.edge_banding_shade_id
				}
			};
		}
		
		this.loaderService.display(true);
		this.categoryService.addShades(obj).subscribe(
			res=>{
				this.getShades();
				this.successalert = true;
				this.successMessage = 'Shade added successfully!';
				this.hideaddShadesForm();
				this.addShadeForm.reset();
				this.addShadeForm.controls['edge_banding_shade_id'].setValue("");
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

	addBrand(formval){
		var obj = {
			'brand' : {
				'name':formval.name,
				'hardware':formval.hardware,
				'addon':formval.addon
			}
		};
		this.loaderService.display(true);
		this.categoryService.addbrand(obj).subscribe(
			res=>{
				this.getBrands();
				this.successalert = true;
				this.successMessage = 'Brand added successfully!';
				this.hideaddBrandsForm();
				this.addBrandForm.reset();
				this.addBrandForm.controls['hardware'].setValue("");
				this.addBrandForm.controls['addon'].setValue("");
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

	addCategory(formval){
		var obj = {
			'kitchen_category' : {
				'name':formval.name
			}
		};
		this.loaderService.display(true);
		this.categoryService.addCategories(obj).subscribe(
			res=>{
				this.getCategory();
				this.successalert = true;
				this.successMessage = 'Category Added successfully!';
				this.hideaddCategoryForm();
				this.addCategoryForm.reset();
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

	addCmp(formval){
		var obj = {
			'core_material_price' : {
				'core_material_id':formval.core_material_id,
				'thickness':formval.thickness,
				'price':formval.price,
			}
		};
		this.loaderService.display(true);
		this.categoryService.addCoreMaterialPrices(obj).subscribe(
			res=>{
				this.getCmp();
				this.successalert = true;
				this.successMessage = 'Cmp Added successfully!';
				this.hideaddCmpForm();
				this.addCmpForm.reset();
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

	addKitchen_appliance(formval){
    var obj = {}
    if(this.attachmentFile_basefile){
        obj = {
            'kitchen_appliance' : {
                'name':formval.name,
                'code':formval.code,
                'make':formval.make,
                'price':formval.price,
                'module_type_id':formval.module_type_id,
                'vendor_sku':formval.vendor_sku,
                'appliance_image': this.attachmentFile_basefile
            }
        };
    }
    else{
        obj = {
            'kitchen_appliance' : {
                'name':formval.name,
                'code':formval.code,
                'make':formval.make,
                'price':formval.price,
                'vendor_sku':formval.vendor_sku,
                'module_type_id':formval.module_type_id
            }
        };
    }
        
    this.loaderService.display(true);
    this.categoryService.addKitchen_appliances(obj).subscribe(
        res=>{
            this.getKitchen_appliances();
            this.successalert = true;
            this.successMessage = 'Kitchen appliance added successfully!';
            this.hideaddKitchen_applianceForm();
            this.addKitchenApplianceForm.reset();
            this.addKitchenApplianceForm.controls['module_type_id'].setValue("");
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

	deleteCoremat(id){
		if (confirm("Are You Sure you want to delete this core material") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteCoreMaterials(id).subscribe(
				res=>{
					this.getCoreMaterials();
					this.successalert = true;
					this.successMessage = 'Core material deleted successfully!';
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
	deleteShutterFinishes(id){
		if (confirm("Are You Sure you want to delete this shutter finish") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteShutter_finishes(id).subscribe(
				res=>{
					this.getShutter_finishes();
					this.successalert = true;
					this.successMessage = 'Shutter finish deleted successfully!';
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
	deleteSkirtingConfig(id){
		if (confirm("Are You Sure you want to delete this skirting config") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteSkirting_configs(id).subscribe(
				res=>{
					this.getSkirting_config();
					this.successalert = true;
					this.successMessage = 'Skirting config deleted successfully!';
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

	deleteShade(id){
		if (confirm("Are You Sure you want to delete this shade") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteShades(id).subscribe(
				res=>{
					this.getShades();
					this.successalert = true;
					this.successMessage = 'Shade deleted successfully!';
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

	deleteEdgebandingShade(id){
		if (confirm("Are You Sure you want to delete this edge banding shade") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteEdgebandingShades(id).subscribe(
				res=>{
					this.getEdgeBandingShades();
					this.successalert = true;
					this.successMessage = 'Edge banding shade deleted successfully!';
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

	deleteBrand(id){
		if (confirm("Are You Sure you want to delete this brand") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteBrand(id).subscribe(
				res=>{
					this.getBrands();
					this.successalert = true;
					this.successMessage = 'Brand deleted successfully!';
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
	deleteCategory(id){
		if (confirm("Are You Sure you want to delete this category") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteCategories(id).subscribe(
				res=>{
					this.getCategory();
					this.successalert = true;
					this.successMessage = 'Category deleted successfully!';
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

	deleteCmp(id){
		if (confirm("Are You Sure you want to delete this category") == true) {
			this.loaderService.display(true);
			this.categoryService.deleteCoreMaterialPrices(id).subscribe(
				res=>{
					this.getCmp();
					this.successalert = true;
					this.successMessage = 'Cmp deleted successfully!';
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

	deleteKitchen_appliance(id){
    if (confirm("Are You Sure you want to delete this kitchen appliance") == true) {
        this.loaderService.display(true);
        this.categoryService.deleteKitchen_appliances(id).subscribe(
            res=>{
                this.getKitchen_appliances();
                this.successalert = true;
                this.successMessage = 'Kitchen appliance deleted successfully!';
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
	

	editCoreMatName;
	editCorematRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editCoreMatName = data.name;
		document.querySelector('#corematerialrow .table-responsive').classList.remove('col-7');
		document.querySelector('#corematerialrow .table-responsive').classList.add('col-9');
	}

	editSFName;
	editSFRate;
	editShutterFinishesRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editSFName = data.name;
		this.editSFRate = data.price;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
	}

	editSCType;
	editSCPrice;
	editSCHeight;
	editSkirtingConfigRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editSCType = data.skirting_type;
		this.editSCPrice = data.price;
		this.editSCHeight = data.skirting_height;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
	}

	editShadeName;
	editShadeCode;
	editShadeImg;
	editShade_EdgebandingCode;
	editShadeRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editShadeName = data.name;
		this.editShadeCode = data.code;		
		this.editShade_EdgebandingCode = data.edge_banding_shade_id;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
	}

	editEdgebandingShadeName;
	editEdgebandingShadeCode;
	editEdgebandingShadeImg;
	editEdgebandingShadeRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editEdgebandingShadeName = data.name;
		this.editEdgebandingShadeCode = data.code;		
	}

	editBrandName;
	editBrandHardware;
	editBrandAddon;
	editBrandRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editBrandName = data.name;
		this.editBrandHardware = data.hardware;
		this.editBrandAddon = data.addon;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
	}
	editCategoryName;
	editCategoryRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editCategoryName = data.name;
		document.querySelector('#categoryrow .table-responsive').classList.remove('col-7');
		document.querySelector('#categoryrow .table-responsive').classList.add('col-9');
	}

	editCoreMaterialName;
	editCmpThickness;
	editCmpPrice;
	editCmpRow(rowno,data){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		this.editCoreMaterialName = data.core_material_id;
		this.editCmpThickness = data.thickness;
		this.editCmpPrice = data.price;
		document.querySelector('#corematerialpricerow .table-responsive').classList.remove('col-7');
		document.querySelector('#corematerialpricerow .table-responsive').classList.add('col-9');
	}

	editKitchen_appliance_Name;
  editKitchen_appliance_Code;
  editKitchen_appliance_Img;
  editKitchen_appliance_make;
  editKitchen_appliance_price;
  editKitchen_appliance_module_type_id;
  editKitchen_appliance_vendor_sku;
  editKitchen_applianceRow(rowno,data){
      var arr = document.getElementsByClassName('editRowSpan'+rowno);
      for(var i=0;i<arr.length;i++){
          arr[i].classList.add('d-none');
      }
      arr =document.getElementsByClassName('editRowInput'+rowno);
      for(var i=0;i<arr.length;i++){
          arr[i].classList.remove('d-none');
      }
      this.editKitchen_appliance_Name = data.name;
      this.editKitchen_appliance_Code = data.code;     
      this.editKitchen_appliance_make = data.make;
      this.editKitchen_appliance_price =data.price;
      this.editKitchen_appliance_module_type_id= data.module_type_id;
      this.editKitchen_appliance_vendor_sku = data.vendor_sku;
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
		this.editCoreMatName = undefined;
		document.querySelector('#corematerialrow .table-responsive').classList.add('col-7');
		document.querySelector('#corematerialrow .table-responsive').classList.remove('col-9');
	}

	cancelEditShutterFinishesRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editSFName = undefined;
		this.editSFRate = undefined;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
	}

	cancelEditSkirtingConfigRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editSCPrice = undefined;
		this.editSCHeight = undefined;
		this.editSCType = undefined;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
	}

	cancelEditShadeRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editShadeCode = undefined;
		this.editShadeName = undefined;
		this.editShadeImg = undefined;
		this.editShade_EdgebandingCode = undefined;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
	}

	cancelEditEdgebandingShadeRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editEdgebandingShadeCode = undefined;
		this.editEdgebandingShadeImg = undefined;
		this.editEdgebandingShadeName = undefined;
	}

	cancelEditBrandRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editBrandName = undefined;
		this.editBrandHardware = undefined;
		this.editBrandAddon = undefined;
		//document.querySelector('#shutter_finisherow .table-responsive').classList.add('col-9');
		//document.querySelector('#shutter_finisherow .table-responsive').classList.remove('col-9');
	}
	cancelEditCategoryRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editCategoryName = undefined;
		document.querySelector('#categoryrow .table-responsive').classList.add('col-7');
		document.querySelector('#categoryrow .table-responsive').classList.remove('col-9');
	}

	cancelEditCmpRow(rowno){
		var arr = document.getElementsByClassName('editRowSpan'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.remove('d-none');
		}
		arr =document.getElementsByClassName('editRowInput'+rowno);
		for(var i=0;i<arr.length;i++){
			arr[i].classList.add('d-none');
		}
		this.editCoreMaterialName = undefined;
		this.editCmpThickness = undefined;
		this.editCmpPrice = undefined;
		document.querySelector('#corematerialpricerow .table-responsive').classList.add('col-7');
		document.querySelector('#corematerialpricerow .table-responsive').classList.remove('col-9');
	}

	cancelEditKitchen_applianceRow(rowno){
    var arr = document.getElementsByClassName('editRowSpan'+rowno);
    for(var i=0;i<arr.length;i++){
        arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('editRowInput'+rowno);
    for(var i=0;i<arr.length;i++){
        arr[i].classList.add('d-none');
    }
    this.editKitchen_appliance_Name = undefined;
    this.editKitchen_appliance_Code = undefined;     
    this.editKitchen_appliance_make = undefined;
    this.editKitchen_appliance_price = undefined;
    this.editKitchen_appliance_module_type_id = undefined;
    this.editKitchen_appliance_Img = undefined;
    this.editKitchen_appliance_vendor_sku = undefined;
  }

	updateCoreMaterial(i,materialId){
		if(this.editCoreMatName!='' && this.editCoreMatName!=undefined){
			this.loaderService.display(true);
			var obj = {
			    "core_material": {
			    	'name':this.editCoreMatName
			    }
			}
			this.categoryService.updateCoreMaterials(obj,materialId).subscribe(
				res => {
					this.getCoreMaterials();
					this.cancelEditCorematerialRow(i);
					this.editCoreMatName = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorMessage = <any>JSON.parse(err['_body']).message;
					this.erroralert = true;
					setTimeout(function() {
	                	this.erroralert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Core material Name is required';
			this.erroralert = true;
			setTimeout(function() {
        	this.erroralert = false;
     	}.bind(this), 13000);
		}
		
	}

	updateShutterFinishes(i,Id){
		if(this.editSFName!='' && this.editSFName!=undefined && this.editSFRate!='' && this.editSFRate!=undefined){
			this.loaderService.display(true);
			var obj = {
			    "shutter_finish": {
			    	'name':this.editSFName,
			    	'price':this.editSFRate
			    }
			}
			this.categoryService.updateShutter_finishes(obj,Id).subscribe(
				res => {
					this.getShutter_finishes();
					this.cancelEditShutterFinishesRow(i);
					this.editSFName = undefined;
					this.editSFRate = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorMessage = <any>JSON.parse(err['_body']).message;
					this.erroralert = true;
					setTimeout(function() {
	                	this.erroralert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Shutter finish Name and price are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateSkirtingConfig(i,Id){
		if(this.editSCType!='' && this.editSCType!=undefined &&
			this.editSCHeight!='' && this.editSCHeight!=undefined &&
			this.editSCPrice!='' && this.editSCPrice!=undefined){
				this.loaderService.display(true);
				var obj = {
				    "skirting_config": {
				    	'skirting_type':this.editSCType,
				    	'skirting_height':this.editSCHeight,
				    	'price':this.editSCPrice
				    }
				}
				this.categoryService.updateSkirting_configs(obj,Id).subscribe(
					res => {
						this.getSkirting_config();
						this.cancelEditSkirtingConfigRow(i);
						this.editSCHeight = undefined;
						this.editSCPrice = undefined;
						this.editSCType = undefined;
						this.successMessage = 'Updated successfully!';
						this.successalert = true;
						setTimeout(function() {
		                	this.successalert = false;
		             	}.bind(this), 13000);
						this.loaderService.display(false);
					},
					err => {
						this.errorMessage = <any>JSON.parse(err['_body']).message;
						this.erroralert = true;
						setTimeout(function() {
		                	this.erroralert = false;
		             	}.bind(this), 13000);
						this.loaderService.display(false);
					}
				);
		} else {
			this.errorMessage = 'Skirting config type, height and price are required';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateShade(i,Id){
		var obj;
		if(this.editShadeName!='' && this.editShadeName!=undefined &&
			this.editShadeCode!='' && this.editShadeCode!=undefined) {
				this.loaderService.display(true);
				if(this.attachmentFile_basefile){
					obj = {
					    "shade": {
					    	'name':this.editShadeName,
					    	'code':this.editShadeCode,
					    	'shade_image':this.attachmentFile_basefile,
					    	'edge_banding_shade_id':this.editShade_EdgebandingCode
					    }
					}
				}
				else{
					obj = {
					    "shade": {
					    	'name':this.editShadeName,
					    	'code':this.editShadeCode,
					    	'edge_banding_shade_id':this.editShade_EdgebandingCode
					    }
					}
				}
		
				this.categoryService.updateShades(obj,Id).subscribe(
					res => {
						this.getShades();
						this.cancelEditShadeRow(i);
						this.editShadeName = undefined;
						this.editShadeCode = undefined;
						this.editShadeImg = undefined;
						this.editShade_EdgebandingCode = undefined;
						this.successMessage = 'Updated successfully!';
						this.successalert = true;
						setTimeout(function() {
		                	this.successalert = false;
		             	}.bind(this), 13000);
						this.loaderService.display(false);
					},
					err => {
						this.errorMessage = <any>JSON.parse(err['_body']).message;
						this.erroralert = true;
						setTimeout(function() {
		                	this.erroralert = false;
		             	}.bind(this), 13000);
						this.loaderService.display(false);
					}
				);
		} else {
			this.errorMessage = 'Shade name and code are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateEdgebandingShade(i,Id){
		var obj
		if(this.editEdgebandingShadeCode!='' && this.editEdgebandingShadeCode!=undefined ){
			this.loaderService.display(true);
			if(this.attachmentFile_basefile){
				obj = {
				    "edge_banding_shade": {
				    	'name':this.editEdgebandingShadeName,
				    	'code':this.editEdgebandingShadeCode,
				    	'shade_image':this.attachmentFile_basefile,
				    }
				}
			}
			else{
				obj = {
				    "edge_banding_shade": {
				    	'name':this.editEdgebandingShadeName,
				    	'code':this.editEdgebandingShadeCode
				    }
				}
			}
			this.categoryService.updateEdgebandingShades(obj,Id).subscribe(
				res => {
					this.getEdgeBandingShades();
					this.cancelEditEdgebandingShadeRow(i);
					this.editEdgebandingShadeName = undefined;
					this.editEdgebandingShadeCode = undefined;
					this.editEdgebandingShadeImg = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorMessage = <any>JSON.parse(err['_body']).message;
					this.erroralert = true;
					setTimeout(function() {
	                	this.erroralert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Edge banding code is required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateBrand(i,Id){
		if(this.editBrandName!='' && this.editBrandName!=undefined ){
			this.loaderService.display(true);
			var obj = {
			    "brand": {
			    	'name':this.editBrandName,
			    	'hardware':this.editBrandHardware,
			    	'addon':this.editBrandAddon
			    }
			}
			this.categoryService.updateBrand(obj,Id).subscribe(
				res => {
					this.getBrands();
					this.cancelEditBrandRow(i);
					this.editBrandName = undefined;
					this.editBrandHardware = undefined;
					this.editBrandAddon = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorMessage = <any>JSON.parse(err['_body']).message;
					this.erroralert = true;
					setTimeout(function() {
	                	this.erroralert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Brand name is required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateCategory(i,materialId){
		if(this.editCategoryName!='' && this.editCategoryName!=undefined ){
			this.loaderService.display(true);
			var obj = {
			    "kitchen_category": {
			    	'name':this.editCategoryName
			    }
			}
			this.categoryService.updateCategories(obj,materialId).subscribe(
				res => {
					this.getCategory();
					this.cancelEditCategoryRow(i);
					this.editCategoryName = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {
					this.errorMessage = <any>JSON.parse(err['_body']).message;
					this.erroralert = true;
					setTimeout(function() {
	                	this.erroralert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				}
			); 
		} else {
			this.errorMessage = 'Category Name is required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateCmp(i,materialId){
		if(this.editCmpPrice!='' && this.editCmpPrice!=undefined &&
			this.editCmpThickness!='' && this.editCmpThickness!=undefined &&
			this.editCoreMaterialName!='' && this.editCoreMaterialName!=undefined ){
			this.loaderService.display(true);
			var obj = {
			    "core_material_price": {
			    	'price':this.editCmpPrice,
			    	'thickness':this.editCmpThickness,
			    	'core_material_id':this.editCoreMaterialName
			    }
			}
			this.categoryService.updateCoreMaterialPrices(obj,materialId).subscribe(
				res => {
					this.getCmp();
					this.cancelEditCmpRow(i);
					this.editCmpThickness = undefined;
					this.successMessage = 'Updated successfully!';
					this.successalert = true;
					setTimeout(function() {
	                	this.successalert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				},
				err => {

					
					//this.errorMessage = "Thickness "+<any>JSON.parse(err['_body']).thickness;
					this.errorMessage = <any>JSON.parse(err['_body']);
					this.erroralert = true;
					setTimeout(function() {
	                	this.erroralert = false;
	             	}.bind(this), 13000);
					this.loaderService.display(false);
				}
			);
		} else {
			this.errorMessage = 'Core Material price, thickness and core material name  are required.';
			this.erroralert = true;
			setTimeout(function() {
              	this.erroralert = false;
           	}.bind(this), 13000);
		}
	}

	updateKitchen_appliance(i,Id){
    var obj;
    if(this.editKitchen_appliance_Name!='' && this.editKitchen_appliance_Name!=undefined &&
        this.editKitchen_appliance_Code!='' && this.editKitchen_appliance_Code!=undefined &&
        this.editKitchen_appliance_module_type_id!='' && this.editKitchen_appliance_module_type_id!=undefined) {
          this.loaderService.display(true);
          if(this.attachmentFile_basefile){
              obj = {
                  'kitchen_appliance' : {
                      'name':this.editKitchen_appliance_Name,
                      'code':this.editKitchen_appliance_Code,
                      'make':this.editKitchen_appliance_make,
                      'price':this.editKitchen_appliance_price,
                      'module_type_id':this.editKitchen_appliance_module_type_id,
                      'appliance_image': this.attachmentFile_basefile,
                      'vendor_sku':this.editKitchen_appliance_vendor_sku
                  }
              }
          }
          else{
              obj = {
                  'kitchen_appliance' : {
                      'name':this.editKitchen_appliance_Name,
                      'code':this.editKitchen_appliance_Code,
                      'make':this.editKitchen_appliance_make,
                      'price':this.editKitchen_appliance_price,
                      'module_type_id':this.editKitchen_appliance_module_type_id,
                      'vendor_sku':this.editKitchen_appliance_vendor_sku
                  }
              }
          }
          this.categoryService.updateKitchen_appliances(obj,Id).subscribe(
              res => {
                  this.getKitchen_appliances();
                  this.cancelEditKitchen_applianceRow(i);
                  this.editKitchen_appliance_Name = undefined;
                  this.editKitchen_appliance_Code = undefined;
                  this.editKitchen_appliance_make = undefined;
                  this.editKitchen_appliance_price = undefined;
                  this.editKitchen_appliance_module_type_id =undefined;
                  this.editKitchen_appliance_Img = undefined;
                  this.editKitchen_appliance_vendor_sku = undefined;
                  this.successMessage = 'Updated successfully!';
                  this.resetAttachement();
                  this.successalert = true;
                  setTimeout(function() {
                      this.successalert = false;
                  }.bind(this), 13000);
                  this.loaderService.display(false);
              },
              err => {
                  this.errorMessage = <any>JSON.parse(err['_body']).message;
                  this.erroralert = true;
                  setTimeout(function() {
                      this.erroralert = false;
                  }.bind(this), 13000);
                  this.loaderService.display(false);
              }
          );
    } else {
        this.errorMessage = 'Kitchen appliance name, code and module type are required.';
        this.erroralert = true;
        setTimeout(function() {
            this.erroralert = false;
        }.bind(this), 13000);
    }
  }
  downloadExcelReport(){
  	this.categoryService.exportLeads().subscribe(
      res =>{
      
      var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      var b64Data =  res._body;
      this.successMessage = 'The Custom Element report you requested is being created. It will be emailed to you once complete.!';
      
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
      dwldLink.setAttribute("download", "custom-element.xlsx");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      },
      err => {
        
      // this.erroralert = true;
      //   this.errorMessage = <any>JSON.parse(err['_body']).message;
      //   setTimeout(function() {
      //     this.erroralert = false;
      //    }.bind(this), 2000);
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
  downloadCustomReport(){
    
    this.categoryService.exportLeads().subscribe(
      res=>{
        
        
        this.successalert = true;
        this.successMessage = 'The Custom Element report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        

      });

  } 


  inviteChampionFormSubmit(data){
    this.loaderService.display(true);
    this.leadService.inviteChampion(data).subscribe(
      res=>{
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
         this.inviteChampionForm.reset();
        // this.champion_user = "";
        this.successalert = true;
        this.successMessage = res.message;
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
       
      },
      err =>{
        if(err.status == '403' || err.status == '422'){
          this.erroralert = true;
          this.errorMessage = JSON.parse(err._body).message;
          setTimeout(function() {
               this.erroralert = false;
          }.bind(this), 10000);
          this.inviteChampionForm.reset();
        }else {
          this.erroralert = true;
          this.errorMessage = err.message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 10000);
        }
        $('#inviteChampionModal').modal('hide');
        this.loaderService.display(false);
      }
    );
  }

 downloadSliReport(){
    
    this.leadService.exportSli().subscribe(
      res=>{
        
        
        this.successalert = true;
        this.successMessage = 'The SLI report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        

      });

  } 

   downloadpoReport(){
    
    this.leadService.exportPo().subscribe(
      res=>{
        
        
        this.successalert = true;
        this.successMessage = 'The purchase-order report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
          }.bind(this), 5000);


      },
      err=>{
        

      });

  }  
   downloadOltReport(){
    this.leadService.exportOlt().subscribe(
      res=>{
        
        this.successalert = true;
        this.successMessage = 'The Download Panel OLT Report you requested is being created. It will be emailed to you once complete.!';
        setTimeout(function() {
               this.successalert = false;
        }.bind(this), 5000);
       },
      err=>{
        
       });
	} 
	
	downloadExcelBoqLineItems(){
		this.loaderService.display(true);
		this.leadService.downloadExcelBoqLineItems().subscribe(
		  res=>{
			
			
			 this.loaderService.display(false);
			this.successalert = true;
			this.successMessage = 'The BOQ Line Items report you requested is being created. It will be emailed to you once complete.!';
			setTimeout(function() {
				   this.successalert = false;
			  }.bind(this), 5000);
	
	
		  },
		  err=>{
			
			this.loaderService.display(false);
	
		  });
	
	  }

  getChampionList(){
    this.loaderService.display(true);
    this.leadService.getChampionList().subscribe(
      res=>{
        this.champion_types = res.allowed_champion_levels;
        this.champion_list_first_level = res["1"];
        this.champion_list_second_level = res["2"];
        this.champion_list_third_level = res["2"];
        this.inviteChampionForm.controls['champion_level'].patchValue("");
        this.inviteChampionForm.controls['parent_id'].patchValue("");
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  getChampionListByLevel(){
    switch(this.inviteChampionForm.controls['champion_level'].value)
    {
     case "1":
          this.champion_user = [];
            break;
     case "2":
          this.champion_user = this.champion_list_first_level;
           break;
     case "3":
          this.champion_user = this.champion_list_second_level;
          break;
    }     
  }

  numberCheck(e) {
	if(!((e.keyCode > 95 && e.keyCode < 106)
		|| (e.keyCode > 47 && e.keyCode < 58)
		|| e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
		|| e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
	  return false;
	}
  }

  onChangeOfLeadType(val){
	for(var i=0;i<this.lead_types.length;i++){
		if(val==this.lead_types[i].id){
			this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
		}
	}
}

getFiltersData(){
	this.leadService.getFiltersData().subscribe(
		res =>{
			res = res.json();
			// 
			this.lead_campaigns = res.lead_campaign_id_array
			this.lead_sources= res.lead_source_id_array;
			//this.lead_status=res.lead_status_array
			this.lead_types=	res.lead_type_id_array
			this.csagentsArr = res.cs_agent_list;

			for(var i=0;i<res.lead_type_id_array.length;i++){
				var obj = {
					"id":res.lead_type_id_array[i].id,"itemName":res.lead_type_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
				}
				this.dropdownList.push(obj);
			}
			for(var i=0;i<res.lead_status_array.length;i++){
				var obj = {
					"id":<any>i,"itemName":res.lead_status_array[i].replace(/_/g, " ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
				}
				this.dropdownList2.push(obj);

			}
			for(var i=0;i<res.lead_source_id_array.length;i++){
				var obj = {
					"id":res.lead_source_id_array[i].id,"itemName":res.lead_source_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
				}
				this.dropdownList3.push(obj);
			}
			for(var i=0;i<res.lead_campaign_id_array.length;i++){
				var obj = {
					"id":res.lead_campaign_id_array[i].id,"itemName":res.lead_campaign_id_array[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
				}
				this.dropdownList4.push(obj);
			}
			for(var i=0;i<res.cs_agent_list.length;i++){
				var str=(res.cs_agent_list[i].name.replace("_"," ").toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '))+' - '+(res.cs_agent_list[i].email)
				var obj = {
					"id":res.cs_agent_list[i].id,"itemName":<any>str
				}
				this.dropdownList5.push(obj);
			}
		}
	);
}

addLeadFormSubmit(data) {
	this.loaderService.display(true);
	data['created_by'] = localStorage.getItem('userId');
	data['lead_status']='not_attempted';
	if(this.addLeadForm.controls['lead_type_name'].value=='designer'){
		data['lead_cv']=this.basefile;
	}
	var obj = {
		lead:data
	}
	this.leadService.addLead(obj)
		.subscribe(
		  res => {
			this.addLeadForm.reset();
			$('#addNewLeadModal').modal('hide');
			this.addLeadForm.controls['lead_type_id'].setValue("");
			this.addLeadForm.controls['lead_source_id'].setValue("");
			this.addLeadForm.controls['lead_campaign_id'].setValue("");
			this.basefile = undefined;
			// this.getFiletredLeads();
			this.loaderService.display(false);
			this.successalert = true;
			this.successMessage = "Lead created successfully !!";
			setTimeout(function() {
				 this.successalert = false;
			}.bind(this), 2000);
		  },
		  err => {
			this.loaderService.display(false);
			this.erroralert = true;
			this.errorMessage = JSON.parse(err['_body']).message;
			setTimeout(function() {
				 this.erroralert = false;
			}.bind(this), 2000);
		  }
		);
}
 

}
