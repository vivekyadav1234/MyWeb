import { Component, OnInit } from '@angular/core';
import { CategoryService} from '../category.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-manage-mapping',
  templateUrl: './manage-mapping.component.html',
  styleUrls: ['./manage-mapping.component.css'],
  providers:[CategoryService]
})
export class ManageMappingComponent implements OnInit {
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  initLoader:any = true;
  activeDropDownVal ='module_types';
  rowList : any = [];
  colList : any = [];
  hashMap:any = {};
  activeSelection:any;
  kitchenAddonForm:FormGroup;

  constructor(
  	private router: Router,
		private loaderService : LoaderService,
		private categoryService:CategoryService,
		private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
  	this.loaderService.display(false);
    this.activeSelection = "shades_shutter_finish";
    this.fetchShutter();
  }


  resetVariables(){
    this.rowList  = [];
    this.colList  = [];
    this.hashMap = {};
    this.activeSelection = "";
    this.kitchenAddonsMapping_hashMap ={};
    this.product_module_list = [];
    this.product_module_hash = {}
  }

  fetchMapping(val){
    this.resetVariables();
    this.activeSelection = val;
    this.loaderService.display(true);
    $(".kitchen-module-type").addClass("d-none");
    $("#produt_addon_mapping_category").addClass("d-none");
    if(val=="shades_shutter_finish" || val=="core_material_shutter"){
      this.fetchShutter();
      // this.shadesShutterFinishMapping();
    }
    else if(val=="module_addons"){
      this.fetchAddon();
       $("#produt_addon_mapping_category").removeClass("d-none")
    }

    else if(val=="kitchen_category_module_type"){
      this.fetchModuleType();
    }

    else if(val == "kitchen_module_addons"){
      $(".kitchen-module-type").removeClass("d-none");
      this.fetchKitchenAddon();

    }
  }

  fetchShutter(){
    this.categoryService.fetchShutter().subscribe(
    res => {
      this.colList = res.shutter_finishes;
      if(this.activeSelection=="shades_shutter_finish"){
        this.shadesShutterFinishMapping();
        this.loaderService.display(false);
      }
      else if(this.activeSelection == "core_material_shutter"){
        this.coreMaterialShutterFinishMapping();
        this.loaderService.display(false);
      }
    },
    err => {
      
    });
  }

  produt_addon_mapping_category = 'Wardrobe';
  fetchAddon(){
    this.loaderService.display(true);
    this.colList = [];
    this.categoryService.fetchAddon().subscribe(
    res => {
      if(this.produt_addon_mapping_category=='Wardrobe'){
        for(var i=0;i< res.addons.length; i++){
          if(res.addons[i].category=='wardrobe')
            this.colList.push(res.addons[i]);
        }
      } else if(this.produt_addon_mapping_category=='Kitchen'){
        for(var i=0;i< res.addons.length; i++){
          if(res.addons[i].category=='kitchen')
            this.colList.push(res.addons[i]);
        }
      }
      //this.colList = res.addons;
      this.moduleAddonsMapping();
      this.loaderService.display(false);
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  kitchenAddonsArray:any = [];
  selectedKitchenAddons = [];
  dropdownSettings = {singleSelection: false, text:"Select Addons",selectAllText:'Select All', unSelectAllText:'UnSelect All',enableSearchFilter: true,classes:"myclass custom-class"};
  fetchKitchenAddon(){
    this.categoryService.fetchAddon("kitchen").subscribe(
    res => {
      // this.kitchenAddonsArray = res.addons;

      var multiselect_array = []

      for(let item of res.addons){
        var hash = {}
        // {"id":1,"itemName":"India"}
        hash["id"] = item.id;
        hash["itemName"] = item.name+" - "+item.code;

        multiselect_array.push(hash);
      }

      this.kitchenAddonsArray = multiselect_array

      this.fetchProductModule("kitchen");
      this.loaderService.display(false);
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  onItemSelect(item:any){
      
      
  }
  OnItemDeSelect(item:any){
      
      
  }
  onSelectAll(items: any){
      
  }
  onDeSelectAll(items: any){
      
  }

  selectProductModule(val){
    this.colList = Array(this.product_module_hash[val]).fill(4);
    this.kitchenAddonsMapping(val);
  }

  kitchenAddonsMapping_hashMap:any ={};
  number_kitchen_addons:any;
  kitchenAddonsMapping(id){
    this.categoryService.kitchenAddonsMapping(id).subscribe(
    res => {
      this.rowList = res.product_module;

      this.kitchenAddonsMapping_hashMap['id']= id
      this.number_kitchen_addons = this.rowList.number_kitchen_addons;
      this.buildKitchenAddonForm(id, this.number_kitchen_addons);
      this.loaderService.display(false);
      
    },
    err => {
      
      this.loaderService.display(false);
      // setInterval(this.bodyClick(), 1000);
      
    });
  }

  // bodyClick(){
  //   $('body').click();
  //   alert("hello");
  // }

  buildKitchenAddonForm(product_id, number_kitchen_addons){
    this.kitchenAddonForm = this.formBuilder.group({
      id:new FormControl(product_id,Validators.required),
      slots: this.formBuilder.array([this.buildSlots()],Validators.required)
    });
  }

  buildSlots() {
    // setInterval(this.bodyClick(), 50000);
    return new FormGroup({
      name: new FormControl("", Validators.required),
      addon_ids: new FormArray([], Validators.required)
    });
  }

  kmaName(name){
    this.kitchenAddonsMapping_hashMap['name']= name;
  }

  product_module_list:any = [];
  product_module_hash:any = {}
  fetchProductModule(category){
    this.categoryService.fetchProductModule(category).subscribe(
    res => {
      this.product_module_list = res.product_modules;
      for (let module of this.product_module_list) {
          this.product_module_hash[module.id] = module.number_kitchen_addons;
      }
      this.loaderService.display(false);


    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  fetchModuleType(){
    this.categoryService.fetchModuleType().subscribe(
    res => {
      this.colList = res.module_types;
      this.kitchenModuleMapping();
      this.loaderService.display(false);
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  shadesShutterFinishMapping(){
    this.categoryService.shadesShutterFinishMapping().subscribe(
    res => {
      this.rowList = res.shades;
      for(let row of this.rowList ){
        this.hashMap[row.id]= row.mappings
      }
      this.loaderService.display(false);
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  coreMaterialShutterFinishMapping(){
    this.categoryService.coreMaterialShutterFinishMapping().subscribe(
    res => {
      this.rowList = res.core_materials;
      for(let row of this.rowList ){
        this.hashMap[row.id]= row.mappings
      }
      this.loaderService.display(false);
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  moduleAddonsMapping(){
    this.categoryService.moduleAddonsMapping().subscribe(
    res => {
      this.rowList=[];
      if(this.produt_addon_mapping_category=='Wardrobe'){
        for(var i=0;i< res.product_modules.length; i++){
          if(res.product_modules[i].category=='wardrobe')
            this.rowList.push(res.product_modules[i]);
        }
      } else if(this.produt_addon_mapping_category=='Kitchen'){
        for(var i=0;i< res.product_modules.length; i++){
          if(res.product_modules[i].category=='kitchen')
            this.rowList.push(res.product_modules[i]);
        }
      }
      //this.rowList = res.product_modules;
      for(let row of this.rowList ){
       // 
        this.hashMap[row.id]= row.mappings
      }
      this.loaderService.display(false);
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  kitchenModuleMapping(){
    this.categoryService.kitchenModuleMapping().subscribe(
    res => {
      this.rowList = res.categories;
      for(let row of this.rowList ){
        this.hashMap[row.id]= row.mappings
      }
      this.loaderService.display(false);
    },
    err => {
      
      this.loaderService.display(false);
    });
  }

  restructureHash(row_id,col_id){
    if(this.hashMap[row_id].includes(col_id)){
      let index = this.hashMap[row_id].indexOf(col_id);
      if (index !== -1) {
        this.hashMap[row_id].splice(index, 1);
      }
    }
    else{
      this.hashMap[row_id].push(col_id);
    }
  }

  submitMapping(){
    this.loaderService.display(true);
    var obj;
    if(this.activeSelection=="shades_shutter_finish"){
      obj = {
        "shades" : this.hashMap
      }
    }
    else if(this.activeSelection=="core_material_shutter"){
      obj = {
        "core_materials" : this.hashMap
      }
    }
    else if(this.activeSelection=="module_addons"){
      obj = {
        "product_modules" : this.hashMap
      }
    }
    else if(this.activeSelection=="kitchen_category_module_type"){
      obj = {
        "categories" : this.hashMap
      }
    }
    else if(this.activeSelection=="kitchen_module_addons"){
      obj = {
        "kitchen_modules" : this.kitchenAddonForm.value
      }

    }

    if(obj){
      this.categoryService.submitMapping(obj, this.activeSelection).subscribe(
        res => {
          alert("created");
          this.kitchenAddonsMapping(this.kitchenAddonsMapping_hashMap['id']);
          this.loaderService.display(false);
        },
        err => {
          alert("error while submitting");
          
          this.loaderService.display(false);
        });
    }
    else{
      alert("no data");
    }
  }

  changeTableColumn(val){
    this.produt_addon_mapping_category = val;
    this.fetchAddon();
  }

}
