import { Headers } from '@angular/http';
import { Quotation } from './../quotation';
import { Component, OnInit, ElementRef,ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { QuotationService } from '../quotation.service';
import { ProjectService } from '../../project/project/project.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import {ShareDataService} from '../share-data.service';
import { Subscription } from 'rxjs/Subscription';
declare var $:any;
import {Location} from '@angular/common';
import { LeadService } from '../../lead/lead.service';
import {IonRangeSliderComponent} from "ng2-ion-range-slider";
import { CatalogueService } from '../../organisation/catalogue/catalogue.service';
 
@Component({
  selector: 'app-create-modular-quote',
  templateUrl: './create-modular-quote.component.html',
  styleUrls: ['./create-modular-quote.component.css'],
  providers: [QuotationService,ProjectService,ShareDataService,LeadService,CatalogueService]
})
export class CreateModularQuoteComponent implements OnInit,AfterViewInit {

  @ViewChild('advancedSliderElement') advancedSliderElement: IonRangeSliderComponent;

  selectedSections = new Array();
  items: Array<any> = [];
  itemsList: Array<any> = [];
  modalQuantityandProductSelectionForm : FormGroup;
  pname;
  boqtypeCreation;
  selectedsectionName;
  selectedsectionId;
  role;
  userId;
  ////////
  class_ids:any = [];
  subcategory_ids:any = [];
  minimum_price:any = "";
  maximum_price:any = "";
  minimum_lead_time:any = "";
  maximum_lead_time:any = "";
  minimum_width:any = "";
  maximum_width:any = "";
  minimum_length:any = "";
  maximum_length:any = "";
  minimum_height:any = "";
  maximum_height:any = "";
  sort_key:any = "";
  liked:any = false;
  //////
  initLoader:any = false;
  globalVarArr;
  projectId;
  lead_id;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  core_material_globalVar_MW ="";
  shutter_material_globalVar_MW="";
  shutter_finish_globalVar_MW="";
  shutter_shade_code_globalVar_MW="";
  edgebanding_shade_code_globalVar_MW="";
  door_handle_code_globalVar_MW="";
  hinge_type_globalVar_MW="";
  channel_type_globalVar_MW="";
  hardware_brand_globalVar_MW="";
  shutter_handle_code_globalVar_MW="";

  typeofkitchen_globalVar_MK="";
  depthofcivilKit_globalVar_MK="";
  drawerheight1ofcivilKit_globalVar_MK="";
  drawerheight2ofcivilKit_globalVar_MK="";
  drawerheight3ofcivilKit_globalVar_MK="";
  core_material_globalVar_MK ="";
  shutter_material_globalVar_MK="";
  shutter_finish_globalVar_MK="";
  shutter_shade_code_globalVar_MK="";
  edgebanding_shade_code_globalVar_MK="";
  door_handle_code_globalVar_MK="";
  hinge_type_globalVar_MK="";
  channel_type_globalVar_MK="";
  hardware_brand_globalVar_MK="";
  skirting_con_height_globalVar_MK="";
  skirting_con_type_globalVar_MK="";
  countertop_globalVar_MK="";
  countertop_width_globalVar_MK="";
  Object= Object;
  customizationModule_MW_details;
  customizationModule_MK_details;
  errorAlertQty:boolean;
  errorAlertModuleTypeId:boolean;
  customizationModule_MW_Form:FormGroup = new FormGroup({
    core_material:new FormControl("",Validators.required),
    shutter_material:new FormControl("",Validators.required),
    shutter_finish:new FormControl("",Validators.required),
    shutter_shade_code:new FormControl("",Validators.required),
    edge_banding_shade_code:new FormControl(""),
    door_handle_code: new FormControl("",Validators.required),
    shutter_handle_code:new FormControl("",Validators.required),
    hinge_type: new FormControl("",Validators.required),
    channel_type:new FormControl(""),
    hardware_brand:new FormControl(""),
    addons:this.formBuilder.array([],Validators.required),
    number_exposed_sites: new FormControl("",Validators.required),
    cust_edge_banding_shade_code:new FormControl(""),
    cust_shutter_shade_code:new FormControl("")
  })
  customizationModule_MK_Form:FormGroup = new FormGroup({
    core_material:new FormControl("",Validators.required),
    shutter_material:new FormControl("",Validators.required),
    shutter_finish:new FormControl("",Validators.required),
    shutter_shade_code:new FormControl("",Validators.required),
    edge_banding_shade_code:new FormControl(""),
    door_handle_code: new FormControl("",Validators.required),
    hinge_type: new FormControl("",Validators.required),
    channel_type:new FormControl(""),
    hardware_brand:new FormControl(""),
    skirting_config_type:new FormControl("",Validators.required),
    skirting_config_height:new FormControl("",Validators.required),
    addons:this.formBuilder.array([]),
    compulsory_addons:this.formBuilder.array([]),
    optional_addons:this.formBuilder.array([]),
    number_exposed_sites: new FormControl("",Validators.required),
    cust_edge_banding_shade_code:new FormControl(""),
    cust_shutter_shade_code:new FormControl("")
  })

  addSpaceMWForm:FormGroup = new FormGroup({
    space:new FormControl("",Validators.required)
  })
  addModuleForm:FormGroup = new FormGroup({
    space:new FormControl(""),
    category:new FormControl(""),
    module_type: new FormControl("",Validators.required),
    module:new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required),
    module_code:new FormControl(""),
    width:new FormControl(""),
    depth:new FormControl(""),
    height:new FormControl(""),
    breadth:new FormControl(),
    length:new FormControl(),
    thickness:new FormControl("")
  })
  addModuleFormMk:FormGroup = new FormGroup({
    space:new FormControl(""),
    category:new FormControl(""),
    kitchen_category:new FormControl(""),
    module_type: new FormControl("",Validators.required),
    module:new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required),
    custom_shelf_unit_width:new FormControl(""),
    module_code:new FormControl(""),
    width:new FormControl(""),
    depth:new FormControl(""),
    height:new FormControl(""),
    breadth:new FormControl(),
    length:new FormControl(),
    thickness:new FormControl("")
  })

  addApplianceFormMk:FormGroup = new FormGroup({
    id:new FormControl("",Validators.required),
    module_type_id: new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required),
  })

  addExtraFormMk:FormGroup = new FormGroup({
    // id:new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required)
  })
  addAddon_for_addon_FormMk:FormGroup = new FormGroup({
    id:new FormControl(""),
    qty:new FormControl("",Validators.required)
  })
  addServiceFormSERV:FormGroup = new FormGroup({
    category: new FormControl("",Validators.required),
    sub_category:new FormControl("",Validators.required),
    activity:new FormControl("",Validators.required),
    quantity:new FormControl("",Validators.required),
    base_rate:new FormControl(0,Validators.required),
    description:new FormControl(""),
  })
  addCustomElemForm:FormGroup = new FormGroup({
    space:new FormControl(""),
    id:new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required),
    image:new FormControl("")
  })

  combinedModulesForm:FormGroup=new FormGroup({
    description:new FormControl("",Validators.required),
    space:new FormControl("",Validators.required),
    combined_door_id:new FormControl("",Validators.required),
    modular_job_ids:new FormArray([])
  })
  saveMkwLayoutForm:FormGroup=new FormGroup({
    category:new FormControl(""),
    name:new FormControl("",Validators.required),
    remark:new FormControl(""),
    space:new FormControl()
  });
  savePresetForm:FormGroup=new FormGroup({
    category:new FormControl("",Validators.required),
    name:new FormControl("",Validators.required),
    remark:new FormControl("")
  });
  addSectionToBoqForm : FormGroup;
  deleteSectionToBoqForm:FormGroup;
  addGlobalVariableForm:FormGroup = new FormGroup({
    core_material:new FormControl("",Validators.required),
    shutter_material:new FormControl("",Validators.required),
    shutter_finish:new FormControl("",Validators.required),
    shutter_shade_code:new FormControl("",Validators.required),
    edge_banding_shade_code:new FormControl(""),
    door_handle_code:new FormControl("",Validators.required),
    shutter_handle_code:new FormControl(""),
    hinge_type: new FormControl("",Validators.required),
    channel_type:new FormControl(""),
    brand_id:new FormControl(""),
    skirting_config_height:new FormControl(""),
    skirting_config_type:new FormControl(""),
    countertop:new FormControl(""),
    civil_kitchen:new FormControl(""),
    depth: new FormControl(""),
    drawer_height_1:new FormControl(""),
    drawer_height_2:new FormControl(""),
    drawer_height_3:new FormControl(""),
    shutter_shade_code_img: new FormControl(""),
    edge_banding_shade_code_img: new FormControl(""),
    door_handle_code_img: new FormControl(""),
    shutter_handle_code_img: new FormControl(""),
  });

  smart_boq_Form:FormGroup = new FormGroup({
    space:new FormControl(""),
    category_data:new FormArray([]),
    target_price:new FormControl("",Validators.required)
  });

  addOnIndex=new Array(10000).fill(0);
  shadeStartingIndex=0;
  shadeEndingIndex=3;
  optionalRadio='optradiocombination';
  addonOptionalRadio='addonoptradiocombination';
  showNext=true;
  showPrev=false;
  addNestedElem_SmartBOQ(){
    const getFun = this.smart_boq_Form.get('category_data') as FormArray;
    getFun.push(new FormGroup({
      section_id: new FormControl("", Validators.required),
      quantity: new FormControl(1,Validators.required)
    }))
  }

  constructor(
    private formBuilder: FormBuilder,
    private quotationService : QuotationService,
    private route: ActivatedRoute,
    private router : Router,
    private project : ProjectService,
    private shareDataService:ShareDataService,
    private loaderService : LoaderService,
    private location:Location,
    private leadService:LeadService,
    private catalogueService:CatalogueService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.userId=localStorage.getItem('userId');
    this.route.params.subscribe(params => {
      this.projectId = params['project_id'];
      this.lead_id = params['lead_id'];
    });
    this.quotation_id = localStorage.getItem('quotation_id');
    if(!this.quotation_id){
      this.createEmptyQuotation();
    } else {
      this.listOfSpacesBoqConfig();
      this.getSelectedSections();
      this.viewQuotationDetails();
    }
    this.modalQuantityandProductSelectionForm = this.formBuilder.group({
      productQty : new FormControl(1),
      product_variant_id : new FormControl()
    });
    this.fetchBasicDetails();

    this.addSectionToBoqForm = this.formBuilder.group({
      sections : new FormArray([],Validators.required)
    });

    this.deleteSectionToBoqForm = this.formBuilder.group({
      sections : new FormArray([],Validators.required)
    });

    
  }

  lead_details;
  fetchBasicDetails(){
    this.loaderService.display(true);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.pname = res['lead'].project_details.name;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

    buildAddons(val?) {
     
    if(val.combination){
      return new FormGroup({
        id: new FormControl((val)?val['id']:"", Validators.required),
        quantity: new FormControl((val)?val['quantity']:"",Validators.required),
        name:new FormControl((val)?val['name']:""),
        combination:new FormControl(true),
        addons: new FormControl((val)?val['addons']:""),
        compulsory: new FormControl((val)?val['compulsory']:""),
        included_mrp:new FormControl((val)?val['included_mrp']:"")
      })
    }
    else{
      return new FormGroup({
        id: new FormControl((val)?val['id']:"", Validators.required),
        quantity: new FormControl((val)?val['quantity']:"",Validators.required),
        image:new FormControl((val)?val['addon_image']:""),
        name:new FormControl((val)?val['name']:""),
        combination:new FormControl(false),
      })
    }
  }
  //check here for initalizing form control values
  buildCompAddons(val) {
    
    return new FormGroup({
      slot: new FormControl(val['slot'],Validators.required),
      id: new FormControl(val['id'], Validators.required),
      name:new FormControl(val['name']),
      quantity: new FormControl("1",Validators.required),
      combination:new FormControl(false),
      combination_name:new FormControl(''),
      included_mrp:new FormControl(val['included_mrp']),
      addons: new FormControl(),
      // brand_id:new FormControl(val['brand_id']),
      image:new FormControl(val['addon_image']),
      addons_for_addons: this.formBuilder.array([])
    })
  }
  buildAddonsForAddons(val?,val2?){
   
    var addonFormGroup;
    if(val.combination || val.combo_name){
      if(val.included_addons && val.included_addons.length>0){
      addonFormGroup =new FormGroup({
        id: new FormControl((val)?val['id']:"", Validators.required),
        name:new FormControl((val)?val['combo_name']:""),
        combination:new FormControl(true),
        quantity: new FormControl((val)?val['quantity']:"",Validators.required),
        addons:new FormControl((val)?val['included_addons']:""),
        included_mrp:new FormControl((val)?val['included_mrp']:"")
    })}else{
      addonFormGroup =new FormGroup({
        id: new FormControl((val)?val['id']:"", Validators.required),
        name:new FormControl((val)?val['name']:""),
        combination:new FormControl(true),
        quantity: new FormControl((val)?val['quantity']:"",Validators.required),
        addons:new FormControl((val)?val['addons']:""),
        included_mrp:new FormControl((val)?val['included_mrp']:"")
    })
    }
    }
    else{
      addonFormGroup =new FormGroup({
      id: new FormControl((val)?val['id']:"", Validators.required),
      name:new FormControl((val)?val['name']:""),
      quantity: new FormControl((val)?val['quantity']:"",Validators.required),
      addon_image:new FormControl((val)?val['addon_image']:""),
      combination:new FormControl(false)
    });

    this.ref.detectChanges();

  }
    if(!val2) {
      addonFormGroup.controls['compulsory_addon_id']= new FormControl((val)?val['compulsory_addon_id']:"");
      addonFormGroup.controls['slot']= new FormControl((val)?val['slot']:"");
    } else {
      
      addonFormGroup.controls['compulsory_addon_id']= new FormControl(val2.id.value);
      addonFormGroup.controls['slot']= new FormControl(val2.slot.value);
    }

    if(val2 && val2.combination.value){
      addonFormGroup.controls['compulsory_addon_type']= new FormControl('combination');
    }else{
      addonFormGroup.controls['compulsory_addon_type']= new FormControl('single');
    }


  
    this.ref.detectChanges();
    return addonFormGroup;
  }
  addNestedAddons(val){
    const getFun = this.customizationModule_MW_Form.get('addons') as FormArray;
    getFun.push(this.buildAddons(val))
  }
  addNestedAddonsMk(val){
    const getFun = this.customizationModule_MK_Form.get('addons') as FormArray;
    getFun.push(this.buildAddons(val))
  }
  
  addNestedCompAddonsMk(val){
    const getFun = this.customizationModule_MK_Form.get('compulsory_addons') as FormArray;
    getFun.push(this.buildCompAddons(val))
  }
  addNestedCustomElems(){
    const getFun = this.customizationModule_MW_Form.get('custom_elements') as FormArray;
    getFun.push(this.buildCustomElements())
  }
  addAddonForAddons(val,val2?,index?){
    const getFun = (<FormArray>(<FormArray>this.customizationModule_MK_Form.get('compulsory_addons')).controls[index]).controls['addons_for_addons'];
    getFun.push(this.buildAddonsForAddons(val,val2))
  }

  buildCustomElements() {
    return new FormGroup({
      id: new FormControl("", Validators.required),
      quantity: new FormControl("",Validators.required)
    })
  }

  backClicked() {
    if(confirm("If you go back, all filled details will be gone") == true){
      this.deleteQuotationOnBackClick('boqBack');
    }
  }
  backToDashboard(){
    if(confirm("If you go back, all filled details will be gone") == true){
      this.deleteQuotationOnBackClick('dashboardBack');
    }
  }
  getSelectedSections(arg?){
    this.boqtypeCreation =localStorage.getItem('boqTypeCreation');
    if(this.boqtypeCreation=='create_boq') {
      var res = JSON.parse(localStorage.getItem('selected_sections'));
      if(res !=undefined){
        this.selectedSections = res;
        this.selectedsectionName = this.selectedSections[0];
        if(this.selectedsectionName=='modular_wardrobe'){
          this.getModuleTypes('wardrobe');
          if(arg && arg=='emptyQuote'){
            this.changeSectionTab('modular_wardrobe');
          }
          else{
            this.changeSectionTab('modular_wardrobe');
          }
        } else if(this.selectedsectionName=='modular_kitchen'){
          this.getModuleTypes('kitchen');
          this.getKitchenCategories();
          this.getApplianceTypes();
          if(arg && arg=='emptyQuote'){
            this.changeSectionTab('modular_kitchen');
          } else{
            this.changeSectionTab('modular_kitchen');
          }
        } else if(this.selectedsectionName=='loose_furniture'){
            this.changeSectionTab('loose_furniture');
        } else if(this.selectedsectionName=='custom_furniture'){
            this.changeSectionTab('custom_furniture');
        } else if(this.selectedsectionName=='services'){
            this.changeSectionTab('services');
        } else if(this.selectedsectionName=='custom_elements'){
          this.changeSectionTab('custom_elements');
        }
      }
    }
  }

  changeSectionTab(val){
    $(".container-set .rowContainer").addClass("d-none");
    this.selectedsectionName = val;
    if(this.selectedsectionName=='modular_wardrobe'){
      this.getGlobalVariable('wardrobe');
      this.getModuleTypes('wardrobe');
      document.getElementById('globalVarRowForMW').classList.remove('d-none');
    } else if(this.selectedsectionName=='modular_kitchen'){
      this.getGlobalVariable('kitchen');
      this.getKitchenCategories();
      this.getApplianceTypes();
      document.getElementById('globalVarRowForMK').classList.remove('d-none');
    } else if(this.selectedsectionName=='loose_furniture'){
      document.getElementById('globalVarRowForLF').classList.remove('d-none');
    } else if(this.selectedsectionName=='services'){
      document.getElementById('globalVarRowForSERV').classList.remove('d-none');
    } else if(this.selectedsectionName=='custom_elements'){
      document.getElementById('globalVarRowForCustomElem').classList.remove('d-none');
      this.getPricedCustom_elements();
    } else if(this.selectedsectionName=='custom_furniture'){
      document.getElementById('globalVarRowForCF').classList.remove('d-none');

    }
  }

  selectedSectionsId;
  getGlobalVariable(category){
    this.selectedSectionsId = new Array();
    this.loaderService.display(true);
    this.quotationService.getGlobalVariable(category).subscribe(
      res=>{
        this.globalVarArr = res;
        
        
        for(var j=0;j<this.selectedSections.length;j++){
          if(this.selectedSections[j]=='modular_wardrobe'){
            this.selectedSectionsId.push(res.modular_wardrobe_id.id)
          } else if(this.selectedSections[j]=='modular_kitchen'){
            this.selectedSectionsId.push(res.modular_kitchen_id.id)
          }
        }
        this.getBoqConfig(category);
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  boqConfigMKVal;
  boqConfigMWVal;
  getBoqConfig(category){
    // this.showArrivaeValueToggle=false;
    this.loaderService.display(true);
    this.quotationService.getBoqGlobalConfig(category,this.quotation_id).subscribe(
      res =>{
        if(res!=null){
          if(res.boq_global_config.category=='wardrobe'){
            this.boqConfigMWVal = res;
            Object.keys(res).map((key)=>{ this.boqConfigMWVal= res[key];})
            this.setGlobalConfigNgModel(this.boqConfigMWVal.category);
          } else if(res.boq_global_config.category=='kitchen'){
            this.boqConfigMKVal = res;
            
            Object.keys(res).map((key)=>{ this.boqConfigMKVal= res[key];})
            this.setGlobalConfigNgModel(this.boqConfigMKVal.category);
          }
        } 
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }
  edgebanding_custshade_code_globalVar_MW;
  shutter_custshade_code_globalVar_MW;
  shutter_custshade_code_globalVar_MK;
  edgebanding_custshade_code_globalVar_MK;

  setGlobalConfigNgModel(category){
    if(category=='wardrobe'){
      if(!this.arrivaeSelectValues){
        this.core_material_globalVar_MW = this.boqConfigMWVal.core_material.name;
        this.shutter_material_globalVar_MW = this.boqConfigMWVal.shutter_material.name;
        this.shutter_finish_globalVar_MW = this.boqConfigMWVal.shutter_finish.name;
        if(!this.boqConfigMWVal.custom_shutter_shade_code){
          this.shutter_shade_code_globalVar_MW = this.boqConfigMWVal.shutter_shade_code.code;
        } else {
          this.shutter_shade_code_globalVar_MW = 'customshadecode';
          this.shutter_custshade_code_globalVar_MW =this.boqConfigMWVal.shutter_shade_code;
        }
        if(this.boqConfigMWVal.custom_edge_banding_shade_code){
          this.edgebanding_custshade_code_globalVar_MW=this.boqConfigMWVal.edge_banding_shade_code;
          this.edgebanding_shade_code_globalVar_MW = 'customedgebanshadecode';
        } else {
          this.edgebanding_shade_code_globalVar_MW=this.boqConfigMWVal.edge_banding_shade_code.code;
        }
        this.door_handle_code_globalVar_MW = this.boqConfigMWVal.door_handle_code;
        this.hinge_type_globalVar_MW = this.boqConfigMWVal.hinge_type;
        this.channel_type_globalVar_MW = this.boqConfigMWVal.channel_type;
        // this.hardware_brand_globalVar_MW = this.boqConfigMWVal.brand.id;
        this.shutter_handle_code_globalVar_MW =this.boqConfigMWVal.shutter_handle_code;
      }
      if(this.arrivaeSelectValues){
        
          this.core_material_globalVar_MW = ""; 
          this.shutter_material_globalVar_MW = "";
          this.shutter_finish_globalVar_MW = "";
          this.shutter_shade_code_globalVar_MW = "";

        // this.addGlobalVariableForm.controls['shutter_finish'].setValue('');
        // this.addGlobalVariableForm.controls['shutter_material'].setValue('');
        // this.skirting_con_type_globalVar_MW = "";
      
      }
       ;
    }
    else if(category=='kitchen'){
      if(!this.arrivaeSelectValues){
        this.typeofkitchen_globalVar_MK = this.boqConfigMKVal.civil_kitchen;
        if(this.boqConfigMKVal.civil_kitchen_parameters){
          this.depthofcivilKit_globalVar_MK = this.boqConfigMKVal.civil_kitchen_parameters.depth;
          this.drawerheight1ofcivilKit_globalVar_MK = this.boqConfigMKVal.civil_kitchen_parameters.drawer_height_1;
          this.drawerheight2ofcivilKit_globalVar_MK = this.boqConfigMKVal.civil_kitchen_parameters.drawer_height_2;
          this.drawerheight3ofcivilKit_globalVar_MK = this.boqConfigMKVal.civil_kitchen_parameters.drawer_height_3;
        }
        this.core_material_globalVar_MK = this.boqConfigMKVal.core_material.name;
        this.shutter_material_globalVar_MK = this.boqConfigMKVal.shutter_material.name;
        this.shutter_finish_globalVar_MK = this.boqConfigMKVal.shutter_finish.name;
        if(!this.boqConfigMKVal.custom_shutter_shade_code){
          this.shutter_shade_code_globalVar_MK = this.boqConfigMKVal.shutter_shade_code.code;
        } else {
          this.shutter_shade_code_globalVar_MK = 'customshadecode';
          this.shutter_custshade_code_globalVar_MK =this.boqConfigMKVal.shutter_shade_code;
        }
        if(this.boqConfigMKVal.custom_edge_banding_shade_code){
          this.edgebanding_custshade_code_globalVar_MK=this.boqConfigMKVal.edge_banding_shade_code;
          this.edgebanding_shade_code_globalVar_MK = 'customedgebanshadecode';
        } else {
          this.edgebanding_shade_code_globalVar_MK=this.boqConfigMKVal.edge_banding_shade_code.code;
        }
        this.door_handle_code_globalVar_MK = this.boqConfigMKVal.door_handle_code;
        this.hinge_type_globalVar_MK = this.boqConfigMKVal.hinge_type;
        this.channel_type_globalVar_MK = this.boqConfigMKVal.channel_type;
        if(this.boqConfigMKVal.brand){
        this.hardware_brand_globalVar_MK = this.boqConfigMKVal.brand.id;}
        this.skirting_con_height_globalVar_MK = this.boqConfigMKVal.skirting_config_height;
        this.skirting_con_type_globalVar_MK = this.boqConfigMKVal.skirting_config_type;
        this.countertop_globalVar_MK = this.boqConfigMKVal.countertop;
      }
      if(this.arrivaeSelectValues){
  
        
          this.core_material_globalVar_MK = "";
          this.shutter_material_globalVar_MK = "";
          this.shutter_finish_globalVar_MK = "";
          this.shutter_shade_code_globalVar_MK = "";
        
      
      }
      this.ref.detectChanges();
    }
  }
  quotation_id;
  quotationDetails;
  createEmptyQuotation(){
    this.loaderService.display(true);
    var data = {
      "quotation": {
      "status": 'draft',
      "products": [],
      "services": [],
      "product_modules":[]
      }
    }
    this.quotationService.postBOQData(data,this.projectId).subscribe(
      res => {
        this.quotationDetails=res.quotation;
        this.selectedSpacesArr = res.quotation.spaces;
        this.selectedSpacesArrMK = res.quotation.spaces_kitchen;
        this.selectedSpacesArrLf = res.quotation.spaces_loose;
        this.selectedSpacesArrSERV = res.quotation.spaces_services;
        this.selectedSpacesArrCustomEle= res.quotation.spaces_custom;
        this.selectedSpacesArrCf = (res.quotation.spaces_custom_furniture)?res.quotation.spaces_custom_furniture:[];
        this.loaderService.display(false);
        this.quotation_id = res.quotation.id;
        localStorage.setItem('quotation_id',this.quotation_id);
        this.listOfSpacesBoqConfig();
        this.getSelectedSections('emptyQuote');
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  postBoqGlobalConfig(formval,category){
    
    this.loaderService.display(true);
    var obj = {
      'boq_global_config' : {
        'quotation_id':this.quotation_id,
        'core_material':formval.core_material,
        'shutter_material':formval.shutter_material,
        'shutter_finish':formval.shutter_finish,
        'shutter_shade_code':formval.shutter_shade_code,
        'edge_banding_shade_code':formval.edge_banding_shade_code,
        'door_handle_code': formval.door_handle_code,
        'shutter_handle_code':(category=='wardrobe')?formval.shutter_handle_code:null,
        'hinge_type':(this.globalVarArr.modspace == true)? 'normal': formval.hinge_type,
        'channel_type':formval.channel_type,
        'brand_id':formval.brand_id,
        'skirting_config_height':(category=='kitchen')?formval.skirting_config_height:null,
        'skirting_config_type':(category=='kitchen')?formval.skirting_config_type:null,
        'civil_kitchen':(category=='kitchen')?formval.civil_kitchen:null,
        'category':category
      }
    }
    if(obj.boq_global_config.category=='kitchen'){
      obj['boq_global_config']['countertop']=formval.countertop;
    }
    if(obj.boq_global_config.civil_kitchen=='true'){
      obj['boq_global_config']['civil_kitchen_parameter_attributes'] =  {
          'depth': formval.depth,
          'drawer_height_1':formval.drawer_height_1,
          'drawer_height_2':formval.drawer_height_2,
          'drawer_height_3':formval.drawer_height_3
        }
    }
    this.quotationService.postBoqGlobalConfig(obj).subscribe(
      res=>{
        this.clearGlobalVar(res.boq_global_config.category);
        this.getBoqConfig(res.boq_global_config.category);
        this.closeGlobalVarFormModal();
        $('#setGlobalConfigModal').modal('hide');
        this.successMessageShow('Global variables successfully set!');
        this.arrivaeSelectValues=false;
       
        this.fetchArrivaeSelectValues()
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  clearGlobalVar(category){
    if(category=='kitchen'){
      this.typeofkitchen_globalVar_MK="";
      this.depthofcivilKit_globalVar_MK="";
      this.drawerheight1ofcivilKit_globalVar_MK="";
      this.drawerheight2ofcivilKit_globalVar_MK="";
      this.drawerheight3ofcivilKit_globalVar_MK="";
      this.core_material_globalVar_MK ="";
      this.shutter_material_globalVar_MK="";
      this.shutter_finish_globalVar_MK="";
      this.shutter_shade_code_globalVar_MK="";
      this.edgebanding_shade_code_globalVar_MK="";
      this.door_handle_code_globalVar_MK="";
      this.hinge_type_globalVar_MK="";
      this.channel_type_globalVar_MK="";
      this.hardware_brand_globalVar_MK="";
      this.skirting_con_height_globalVar_MK="";
      this.skirting_con_type_globalVar_MK="";
      this.countertop_globalVar_MK="";

    } else if(category=='wardrobe'){
      this.core_material_globalVar_MW ="";
      this.shutter_material_globalVar_MW="";
      this.shutter_finish_globalVar_MW="";
      this.shutter_shade_code_globalVar_MW="";
      this.edgebanding_shade_code_globalVar_MW="";
      this.door_handle_code_globalVar_MW="";
      this.hinge_type_globalVar_MW="";
      this.channel_type_globalVar_MW="";
      this.hardware_brand_globalVar_MW="";
      this.shutter_handle_code_globalVar_MW="";
    }
  }

  availableSpaces;
  listOfSpacesBoqConfig(){
    this.loaderService.display(true);
    this.quotationService.listOfSpacesBoqConfig().subscribe(
      res=>{
        this.availableSpaces=res.spaces;
        this.loaderService.display(false);
        
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  } 
  ////for  Core Material///
  listofCoreMaterial(val,formarg?){
    
    if(formarg){
      formarg.controls['shutter_material'].setValue("");
      formarg.controls['shutter_material'].setValue("");
    }
    this.globalVarArr['shutter_shade_code']=[];
    this.loaderService.display(true);
    this.quotationService.listofCoreMaterial(val,this.arrivaeSelectValues).subscribe(
      res=>{
        this.globalVarArr.shutter_materials=res;
        
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  listofShutterFinishes(val,formarg?){
    
    if(formarg){
      formarg.controls['shutter_shade_code'].setValue("");
      formarg.controls['shutter_finish'].setValue("");
    }
    this.globalVarArr['shutter_shade_code']=[];
    this.loaderService.display(true);
    this.quotationService.listofShutterFinishes(val,this.arrivaeSelectValues).subscribe(
      res=>{
        this.globalVarArr.shutter_finish=res.shutter_finishes;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  listofShutterFinishShades(val,formarg?){
    if(formarg){
      formarg.controls['shutter_shade_code'].setValue("");
    }
    this.loaderService.display(true);
    this.quotationService.listofShutterFinishShades(val,this.arrivaeSelectValues).subscribe(
      res=>{
        this.globalVarArr.shutter_shade_code=res.shades;
        if(this.globalVarArr.category=='kitchen'){
          this.shadeImg = undefined;
        } else if(this.globalVarArr.category=='wardrobe'){
          this.shadeImgMW =undefined;
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
    if(formarg && this.globalVarArr.category=='kitchen'){
      // this.getHandleList(val);
    }
  }

  listofSkirtingHeights(val,formarg?){
    if(formarg){
      formarg.controls['skirting_config_height'].setValue("");
    }
    this.loaderService.display(true);
    this.quotationService.listofSkirtingConfigs(val,this.arrivaeSelectValues).subscribe(
      res=>{
        this.globalVarArr.skirting_config_height=res.skirting_configs;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  clearLocalStorage(){
    localStorage.removeItem('quotation_id');
    localStorage.removeItem('selected_sections');
    // localStorage.removeItem('boqAddedProducts');
    localStorage.removeItem('boqAddedServices');
  }

  selectedSpacesArr=[];
  selectedSpacesArrMK=[];
  selectedSpacesArrLf=[];
  selectedSpacesArrSERV=[];
  selectedSpacesArrCustomEle=[];
  selectedSpacesArrCf=[];
  createSpace(formVal,category){
    if(formVal.space!=""){
      if(category=='wardrobe' && !this.selectedSpacesArr.includes(formVal.space)){
        this.selectedSpacesArr.push(formVal.space);
        this.loaderService.display(true);
        this.quotationService.setSpaces(formVal.space,this.projectId,this.quotation_id,'wardrobe').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotationDetails = res.quotation;
            this.selectedSpacesArr = res.quotation.spaces;
            this.successMessageShow('Space added successfully!');
          },
          err=>{
            this.loaderService.display(false);
          }
        );
      } else if(category=='kitchen' && !this.selectedSpacesArrMK.includes(formVal.space)){
        this.selectedSpacesArrMK.push(formVal.space);
        this.loaderService.display(true);
        this.quotationService.setSpaces(formVal.space,this.projectId,this.quotation_id,'kitchen').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotationDetails = res.quotation;
            this.selectedSpacesArrMK = res.quotation.spaces_kitchen;
            this.successMessageShow('Space added successfully!');
          },
          err=>{
            this.loaderService.display(false);
          }
        );
      } else if(category=='loose_furniture' && !this.selectedSpacesArrLf.includes(formVal.space)){
        this.selectedSpacesArrLf.push(formVal.space);
        this.loaderService.display(true);
        this.quotationService.setSpaces(formVal.space,this.projectId,this.quotation_id,'loose_furniture').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotationDetails = res.quotation;
            this.selectedSpacesArrLf = res.quotation.spaces_loose;
            this.successMessageShow('Space added successfully!');
          },
          err=>{
            this.loaderService.display(false);
          }
        );
      } else if(category=='custom_furniture' && !this.selectedSpacesArrCf.includes(formVal.space)){
        
        this.selectedSpacesArrCf.push(formVal.space);
        this.ref.detectChanges();
        
        this.loaderService.display(true);
        
        this.quotationService.setSpaces(formVal.space,this.projectId,this.quotation_id,'custom_furniture').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotationDetails = res.quotation;
           
            this.selectedSpacesArrCf = (res.quotation.spaces_custom_furniture)?res.quotation.spaces_custom_furniture:[];
         
            this.successMessageShow('Space added successfully!');
          },
          err=>{
            this.loaderService.display(false);
          }
        );
      } else if(category=='services' && !this.selectedSpacesArrSERV.includes(formVal.space)){
        this.selectedSpacesArrSERV.push(formVal.space);
        this.loaderService.display(true);
        this.quotationService.setSpaces(formVal.space,this.projectId,this.quotation_id,'services').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotationDetails = res.quotation;
            this.selectedSpacesArrSERV = res.quotation.spaces_services;
            this.successMessageShow('Space added successfully!');
          },
          err=>{
            this.loaderService.display(false);
          }
        );
      } else if(category=='custom_elements' && !this.selectedSpacesArrCustomEle.includes(formVal.space)){
        this.selectedSpacesArrCustomEle.push(formVal.space);
        this.loaderService.display(true);
        this.quotationService.setSpaces(formVal.space,this.projectId,this.quotation_id,'custom_elements').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotationDetails = res.quotation;
            this.selectedSpacesArrCustomEle = res.quotation.spaces_custom;
            this.successMessageShow('Space added successfully!');
          },
          err=>{
            this.loaderService.display(false);
          }
        );
      } else {
        this.errorMessageShow('This space is already there.');
      }
      this.addSpaceMWForm.reset();
      this.addSpaceMWForm.controls['space'].setValue("");
    } else {
      this.errorMessageShow("Space can't be blank");
    }
  }

  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 10000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 10000);
  }

  displayAddModuleForm(rowindex,category){
    if(category=='wardrobe')
    {
      var str= '#collapseSpaceCard'+rowindex
      if($(str).collapse()){
         str= 'addModuleFormRow'+rowindex
        document.getElementById(str).classList.remove('d-none');
      } else {
           str= 'addModuleFormRow'+rowindex
          document.getElementById(str).classList.remove('d-none');
      }
    } else if(category=='kitchen'){
      var str1= '#collapseSpaceCardMk'+rowindex
      if($(str1).collapse()){
         str1= 'addModuleFormRowMk'+rowindex
        document.getElementById(str1).classList.remove('d-none');
      } else {
           str1= 'addModuleFormRowMk'+rowindex
          document.getElementById(str1).classList.remove('d-none');
      }
    }

  }
  displayAddApplianceForm(rowindex,category){
    if(category=='kitchen'){
      var str1= '#collapseSpaceCardMk'+rowindex
      if($(str1).collapse()){
         str1= 'addApplianceFormRowMk'+rowindex
        document.getElementById(str1).classList.remove('d-none');
      } else {
           str1= 'addApplianceFormRowMk'+rowindex
          document.getElementById(str1).classList.remove('d-none');
      }
    }
  }

  displayAddExtraForm(rowindex,category){
    if(category=='kitchen'){
      var str1= '#collapseSpaceCardMk'+rowindex
      if($(str1).collapse()){
         str1= 'addExtraFormRowMk'+rowindex
        document.getElementById(str1).classList.remove('d-none');
      } else {
           str1= 'addExtraFormRowMk'+rowindex
          document.getElementById(str1).classList.remove('d-none');
      }
    }
  }

  displayAddCustomElemForm(rowindex,category){
    var str1= '#collapseSpaceCardCE'+rowindex
      if($(str1).collapse()){
         str1= 'addModuleFormRowCE'+rowindex
        document.getElementById(str1).classList.remove('d-none');
      } else {
           str1= 'addModuleFormRowCE'+rowindex
          document.getElementById(str1).classList.remove('d-none');
      }
  }

  kitchenCatArr;
  getKitchenCategories(){
    this.loaderService.display(true);
    this.quotationService.getKitchenCategories().subscribe(
      res=>{
        this.kitchenCatArr=res.kitchen_categories;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  addontagsArr;
  getAddonTags(){
    this.loaderService.display(true);
    this.quotationService.getlistaddontags("addons").subscribe(
      res=>{
        this.addontagsArr=res.tags;
       
        this.getMakeForExtras();
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  makeforextras_filter;
  getMakeForExtras(){
    this.loaderService.display(true);
    this.quotationService.getMakeforFilter('addon').subscribe(
      res=>{
        this.makeforextras_filter=res.brands;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  kitchenApplianceTypesArr;
  getApplianceTypes(){
    this.loaderService.display(true);
    this.quotationService.getModuletypeForKitchen_appliances().subscribe(
      res=>{
        this.kitchenApplianceTypesArr=res.module_types;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  kitchenExtras;
  kitchenExtrasCombination;
  type_extra_filter='';
  type_arrivae_select
  tags_extras_filter=[];
  brand_name_extra_filter=[];
  min_price_extra_filter=0;
  max_price_extra_filter=500000;
  search_string_extra_filter="";
  pageno_extra=1;

  search_string_addon_filter="";
  pageno_addon=1;
  tags_addon_filter=[];
  brand_name_addon_filter=[];
  min_price_addon_filter=0;
  max_price_addon_filter=500000;

  getKitchenExtras(category){
    this.showNext=true;
    this.min_price_extra_filter = this.fromval_slider;
    this.max_price_extra_filter = this.toval_slider;
    var filterObj= {
      tags:this.tags_extras_filter,
      brand_name:this.brand_name_extra_filter,
      minimum_price:this.min_price_extra_filter,
      maximum_price:this.max_price_extra_filter,
      addon_type:this.type_extra_filter,
      arrivae_select:this.type_arrivae_select
    }
    this.loaderService.display(true);
    this.quotationService.getKitchenExtras(filterObj,category,this.search_string_extra_filter,this.pageno_extra).subscribe(
      res=>{
        this.kitchenExtras = res.addons;
        this.getAddonTags();
        this.loaderService.display(false);
        this.addExtraFormMk.reset();
        if(this.kitchenExtras.length==0 && this.pageno_extra!=0){
          this.pageno_extra=0
          this.quotationService.getKitchenExtras(filterObj,category,this.search_string_extra_filter,this.pageno_extra).subscribe(
            res=>{
              this.kitchenExtras = res.addons;
              this.loaderService.display(false);
            },
            err=>{
              this.loaderService.display(false);
            });
        } else if(this.kitchenExtras.length==15){
          this.quotationService.getKitchenExtras(filterObj,category,this.search_string_extra_filter,this.pageno_extra+1).subscribe(
            res=>{
              if(res.addons.length==0){
                this.showNext=false;
              }
              this.loaderService.display(false);
            },
            err=>{
              this.loaderService.display(false);
            }
          );
          }else{
            this.showNext=false;
          }
          
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  prevPage(pageFor,addontype?,category?){
    if(pageFor=='extra'){
      this.pageno_extra = this.pageno_extra-1;
      this.getKitchenExtras(this.extraCategory);
    } else if(pageFor=='addon'){
      this.pageno_addon = this.pageno_addon-1;
      if(addontype =='compaddon'){
         this.getCompulsoryAddons(this.customizationModule_MK_details.product_module_id,this.slotnameForAddon,this.slotindex);
      } else if(addontype =='addonforaddon'){
        this.getListofAddonsForAddons(this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].id.value,
        this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].combination.value,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].slot.value,this.slotindex);
      } else if(addontype =='optionaladdon'){
        this.getOptionalAddons(category)
      }
    } 
  }

  nextPage(pageFor,addontype?,category?){
   
    if(pageFor=='extra'){
      this.pageno_extra = this.pageno_extra+1;
      this.getKitchenExtras(this.extraCategory);
    } else if(pageFor=='addon'){
      this.pageno_addon = this.pageno_addon+1;
      if(addontype =='compaddon'){
         this.getCompulsoryAddons(this.customizationModule_MK_details.product_module_id,this.slotnameForAddon,this.slotindex);
      } else if(addontype =='addonforaddon'){
        this.getListofAddonsForAddons(this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].id.value,
        this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].combination.value,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].slot.value,this.slotindex);
      }else if(addontype =='optionaladdon'){
        this.getOptionalAddons(category)
      }
    } 
  }

  pricedCustomElemArr;
  getPricedCustom_elements(){
    this.loaderService.display(true);
    this.quotationService.getPricedCustom_elements(this.projectId).subscribe(
      res=>{
        this.pricedCustomElemArr=res.custom_elements;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }
  moduletypesArr;
  getModuleTypes(category){
    this.loaderService.display(true);
    this.quotationService.getModuleTypes(category).subscribe(
      res=>{
        this.moduletypesArr=res.module_types;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }
  getModuletypeOfKitchenCat(val){
    val = JSON.parse(val);
    this.loaderService.display(true);
    this.quotationService.getModuleTypeListOfKitchenCat(val.id,'kitchen',this.boqConfigMKVal.civil_kitchen).subscribe(
      res=>{
        this.moduletypesArr = res.module_types;
        this.modulesArr = [];
        this.addModuleFormMk.controls['module_type'].setValue("");
        this.addModuleFormMk.controls['module'].setValue("");
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  appliancesArr;
  getApplianceOfModuleType(val){
    this.loaderService.display(true);
    this.selected_kitchen_appliance = undefined;
    this.quotationService.getKitchen_appliances(val).subscribe(
      res=>{
        this.appliancesArr = res.kitchen_appliances;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  modulesArr;
  // modulesArr_MK;
  getModuleOfModuleType(val){
    val = JSON.parse(val);
    this.loaderService.display(true);
    this.quotationService.getModulesListOfType(val.name,val.category).subscribe(
      res=>{
        this.modulesArr = res.product_modules;
        this.customizable_dim_data_for_module_mk = undefined;
        this.customizable_dim_data_for_module_mw = undefined;
        this.getCustomizableDimensions(val.id);
        this.addModuleFormMk.controls['module'].setValue("");
        this.addModuleForm.controls['module'].setValue("");
        this.addModuleForm.controls['module_code'].setValue("");
        this.addModuleFormMk.controls['module_code'].setValue("");
        this.addModuleFormMk.controls['thickness'].setValue("");
        this.addModuleForm.controls['thickness'].setValue("");
        this.addModuleFormMk.controls['depth'].setValue("");
        this.addModuleForm.controls['depth'].setValue("");
        this.addModuleFormMk.controls['width'].setValue("");
        this.addModuleForm.controls['width'].setValue("");
        this.addModuleFormMk.controls['height'].setValue("");
        this.addModuleForm.controls['height'].setValue("");
        this.addModuleFormMk.controls['breadth'].setValue("");
        this.addModuleForm.controls['breadth'].setValue("");
        this.addModuleFormMk.controls['length'].setValue("");
        this.addModuleForm.controls['length'].setValue("");
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  addedModulesArr;
  addModule(formval,space,secname,index){
    if(formval.qty>0){
      var obj;
      if(this.checkValidationForDimensions(secname,(secname=='wardrobe')?this.addModuleForm:this.addModuleFormMk)){ 
        if(secname=='wardrobe'){
          if(this.boqConfigMWVal.brand){
          obj ={
            "product_module":{
              "id": formval.module,
              "quantity": formval.qty,
              "space": space,
              "section_name":secname,
              "category":'wardrobe',
              "options": {
                "core_material": this.boqConfigMWVal.core_material.name,
                "shutter_material": this.boqConfigMWVal.shutter_material.name,
                "shutter_finish": this.boqConfigMWVal.shutter_finish.name,
                "shutter_shade_code": (!this.boqConfigMWVal.custom_shutter_shade_code)?this.boqConfigMWVal.shutter_shade_code.code:this.boqConfigMWVal.shutter_shade_code,
                "edge_banding_shade_code":(!this.boqConfigMWVal.custom_edge_banding_shade_code)?this.boqConfigMWVal.edge_banding_shade_code.code:this.boqConfigMWVal.edge_banding_shade_code,
                "door_handle_code":this.boqConfigMWVal.door_handle_code,
                "shutter_handle_code":this.boqConfigMWVal.shutter_handle_code,
                "hinge_type": this.boqConfigMWVal.hinge_type,
                "channel_type": this.boqConfigMWVal.channel_type,
                "number_exposed_sites": 0,
                "hardware_brand_id": (this.boqConfigMWVal.brand)?this.boqConfigMWVal.brand.id:'' ,
                "addons": [],
                "custom_elements": []
              }
            }
          }}else{
            obj ={
              "product_module":{
                "id": formval.module,
                "quantity": formval.qty,
                "space": space,
                "section_name":secname,
                "category":'wardrobe',
                "options": {
                  "core_material": this.boqConfigMWVal.core_material.name,
                  "shutter_material": this.boqConfigMWVal.shutter_material.name,
                  "shutter_finish": this.boqConfigMWVal.shutter_finish.name,
                  "shutter_shade_code": (!this.boqConfigMWVal.custom_shutter_shade_code)?this.boqConfigMWVal.shutter_shade_code.code:this.boqConfigMWVal.shutter_shade_code,
                  "edge_banding_shade_code":(!this.boqConfigMWVal.custom_edge_banding_shade_code)?this.boqConfigMWVal.edge_banding_shade_code.code:this.boqConfigMWVal.edge_banding_shade_code,
                  "door_handle_code":this.boqConfigMWVal.door_handle_code,
                  "shutter_handle_code":this.boqConfigMWVal.shutter_handle_code,
                  "hinge_type": this.boqConfigMWVal.hinge_type,
                  "channel_type": this.boqConfigMWVal.channel_type,
                  "number_exposed_sites": 0,
                  "hardware_brand_id": '' ,
                  "addons": [],
                  "custom_elements": []
                }
              }
            }
          }
        } else if(secname=='kitchen'){
          if(this.boqConfigMKVal.brand){
          obj ={
            "product_module":{
              "id": formval.module,
              "quantity": formval.qty,
              "space": space,
              "section_name":secname,
              "category":'kitchen',
              "options": {
                "core_material": this.boqConfigMKVal.core_material.name,
                "shutter_material": this.boqConfigMKVal.shutter_material.name,
                "shutter_finish": this.boqConfigMKVal.shutter_finish.name,
                "shutter_shade_code": (!this.boqConfigMKVal.custom_shutter_shade_code)?this.boqConfigMKVal.shutter_shade_code.code:this.boqConfigMKVal.shutter_shade_code,
                "edge_banding_shade_code":(!this.boqConfigMKVal.custom_edge_banding_shade_code)?this.boqConfigMKVal.edge_banding_shade_code.code:this.boqConfigMKVal.edge_banding_shade_code,
                "door_handle_code":this.boqConfigMKVal.door_handle_code,
                "hinge_type": this.boqConfigMKVal.hinge_type,
                "channel_type": this.boqConfigMKVal.channel_type,
                "skirting_config_type":this.boqConfigMKVal.skirting_config_type,
                "skirting_config_height":this.boqConfigMKVal.skirting_config_height,
                "number_exposed_sites": 0,
                "hardware_brand_id": (this.boqConfigMKVal.brand)?this.boqConfigMKVal.brand.id:'',
                "addons": [],
                "custom_elements": [],
                "kitchen_category":JSON.parse(formval.kitchen_category).name,
                "custom_shelf_unit_width":formval.custom_shelf_unit_width
              }
            }
          }}else{
            obj ={
              "product_module":{
                "id": formval.module,
                "quantity": formval.qty,
                "space": space,
                "section_name":secname,
                "category":'kitchen',
                "options": {
                  "core_material": this.boqConfigMKVal.core_material.name,
                  "shutter_material": this.boqConfigMKVal.shutter_material.name,
                  "shutter_finish": this.boqConfigMKVal.shutter_finish.name,
                  "shutter_shade_code": (!this.boqConfigMKVal.custom_shutter_shade_code)?this.boqConfigMKVal.shutter_shade_code.code:this.boqConfigMKVal.shutter_shade_code,
                  "edge_banding_shade_code":(!this.boqConfigMKVal.custom_edge_banding_shade_code)?this.boqConfigMKVal.edge_banding_shade_code.code:this.boqConfigMKVal.edge_banding_shade_code,
                  "door_handle_code":this.boqConfigMKVal.door_handle_code,
                  "hinge_type": this.boqConfigMKVal.hinge_type,
                  "channel_type": this.boqConfigMKVal.channel_type,
                  "skirting_config_type":this.boqConfigMKVal.skirting_config_type,
                  "skirting_config_height":this.boqConfigMKVal.skirting_config_height,
                  "number_exposed_sites": 0,
                  "hardware_brand_id": '',
                  "addons": [],
                  "custom_elements": [],
                  "kitchen_category":JSON.parse(formval.kitchen_category).name,
                  "custom_shelf_unit_width":formval.custom_shelf_unit_width
                }
          }}}
        }
        obj['product_module']['options']['breadth']=formval.breadth;
        obj['product_module']['options']['width']=formval.width;
        obj['product_module']['options']['length']=formval.length;
        obj['product_module']['options']['thickness']=formval.thickness;
        obj['product_module']['options']['depth']=formval.depth;
        obj['product_module']['options']['height']=formval.height;
        this.loaderService.display(true);
        this.quotationService.addModuleToSpace(this.projectId,this.quotation_id,obj).subscribe(
          res=>{
            this.quotationDetails = res.quotation;
            this.loaderService.display(false);
            var str= 'addModuleFormRow'+index;
            var str1= 'addModuleFormRowMk'+index;
            if(document.getElementById(str)){
              document.getElementById(str).classList.add('d-none');
              this.addModuleForm.reset();
              this.addModuleForm.controls['module_type'].setValue("");
              this.addModuleForm.controls['module'].setValue("");
              this.addModuleForm.controls['thickness'].setValue("");
              this.customizable_dim_data_for_module_mw = undefined;
            }
            if(document.getElementById(str1)){
              document.getElementById(str1).classList.add('d-none');
              this.addModuleFormMk.reset();
              this.addModuleFormMk.controls['kitchen_category'].setValue("");
              this.addModuleFormMk.controls['module_type'].setValue("");
              this.addModuleFormMk.controls['module'].setValue("");
              this.addModuleFormMk.controls['thickness'].setValue("");
              this.customizable_dim_data_for_module_mk = undefined
            }
            this.successMessageShow('Module added successfully!');
            
          },
          err =>{
            this.loaderService.display(false);
            this.errorMessageShow(JSON.parse(err['_body']).message);
            
          }
        );
      }
    }
    else{
      this.errorMessageShow('Quantity should be greater than 0');
    }
  }
  
  addAppliance(formval,space,secname,index){
    if(formval.qty>0){
    if(this.addApplianceFormMk.valid){
    var obj;
    if(secname=='kitchen'){
      obj ={
        "kitchen_appliance":{
          "id": formval.id,
          "quantity": formval.qty,
          "space": space,
          "category":'kitchen',
        }
      }
    }

    this.loaderService.display(true);
    this.quotationService.addApplianceToKitchenSpace(this.projectId,this.quotation_id,obj).subscribe(
      res=>{
        this.quotationDetails = res.quotation;
        this.loaderService.display(false);
        var str1= 'addApplianceFormRowMk'+index;
        if(document.getElementById(str1)){
          document.getElementById(str1).classList.add('d-none');
          this.addApplianceFormMk.reset();
          this.addApplianceFormMk.controls['module_type_id'].setValue("");
          this.addApplianceFormMk.controls['id'].setValue("");
          }
        this.successMessageShow('Appliance added successfully!');
        this.clearAddApplianceForm();
      },
      err =>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );} else {
      if(this.addApplianceFormMk.controls['module_type_id'].value===""){
        this.errorAlertModuleTypeId=true;
      }
      if(this.addApplianceFormMk.controls['qty'].value===null){
        this.errorAlertQty=true;
      }
    }
  }
  else{
    this.errorMessageShow('Quantity must be greater than 0');
  }
}

  addExtra(formval,space,index){
    if(formval.qty>0){
    var obj ={
        "addon":{
          "id": formval.id,
          "quantity": formval.qty,
          "space":space,
          "category": this.extraCategory
        }
      }

    this.loaderService.display(true);
    this.quotationService.addExtraToKitchenSpace(this.projectId,this.quotation_id,obj).subscribe(
      res=>{
        this.quotationDetails = res.quotation;
        
        this.loaderService.display(false);
        var str1= 'addExtraFormRowMk'+index;
        if(document.getElementById(str1)){
          document.getElementById(str1).classList.add('d-none');
          this.addExtraFormMk.reset();
          this.addExtraFormMk.controls['id'].setValue("");
        }
        this.successMessageShow('Extra added successfully!');
      },
      err =>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
    }
    else{
      this.errorMessageShow("Quantity should be greater than 0");
    }
  }

  addExtraModal_space;
  extraCategory;
  setSpaceForExtra(space,category){
    this.addExtraModal_space = space;
    this.extraCategory=category;
  }
  addExtra_new(id,formval,index,combination){
    var elem= (<HTMLInputElement>document.getElementById('extraqtyinput_'+index)).value;
    if(this.addExtraFormMk.controls['qty'].value !='' &&  elem !=''){
      if(formval.qty>0){
        var obj ={
            "addon":{
              "id": id,
              "quantity": formval.qty,
              "space":this.addExtraModal_space,
              "category":this.extraCategory,
              "combination": combination
            }
          }

        this.loaderService.display(true);
        this.quotationService.addExtraToKitchenSpace(this.projectId,this.quotation_id,obj).subscribe(
          res=>{
            this.quotationDetails = res.quotation;
            
            this.loaderService.display(false);
            this.addExtraFormMk.reset();
            this.successMessageShow('Extra added successfully!');
          },
          err =>{
            this.loaderService.display(false);
            this.errorMessageShow(JSON.parse(err['_body']).message);
          }
        );
      }
      else{
        this.errorMessageShow('Quantity should be greater than 0');
      }
    } else {
        this.errorMessageShow('Quantity is required');
      }
  }

  closeAddExtraModal(){
    this.addExtraModal_space = undefined;
    this.tags_extras_filter=[];
    this.brand_name_extra_filter=[];
    this.min_price_extra_filter=0;
    this.max_price_extra_filter=500000;
    this.search_string_extra_filter="";
    this.pageno_extra=1;
    this.toval_slider = 300000;
    this.fromval_slider = 0;
    this.type_arrivae_select=false;
    this.type_extra_filter='';
    $('[name="single"]').prop('checked',false);
    $('[name="combo"]').prop('checked',false);
    $('[name="both"]').prop('checked',false);
  }

  closeAddAddonModal(){
    $("#addAddonModal").modal('hide')
    $("#customizationModalMk").css({"overflow-y": "auto"});
    this.slotnameForAddon=undefined;
    this.slotindex = undefined;
    this.tags_addon_filter=[];
    this.brand_name_addon_filter=[];
    this.min_price_addon_filter=0;
    this.max_price_addon_filter=500000;
    this.search_string_addon_filter="";
    this.pageno_addon=1;
    this.toval_slider = 300000;
    this.fromval_slider = 0;
    this.type_arrivae_select=false;
    $('[name="single"]').prop('checked',false);
    $('[name="combo"]').prop('checked',false);
    $('[name="both"]').prop('checked',false);
    this.type_extra_filter='';
    this.addAddon_for_addon_FormMk.controls['qty'].setValue("");
    this.ref.detectChanges();
  }
  
  addCustomElem(formval,space,secname,index){
    if(formval.qty>0){
      formval.id = JSON.parse(formval.id).id;
      var obj = {
        "quotation":{
          "custom_elements":[{
            "id": formval.id,
            "quantity": formval.qty,
            "space": space
          }]
        }
      }
      this.loaderService.display(true);
      this.quotationService.addCustomElementToSpace(this.projectId,this.quotation_id,obj).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.loaderService.display(false);
          var str1= 'addModuleFormRowCE'+index;

          if(document.getElementById(str1)){
            document.getElementById(str1).classList.add('d-none');
            this.addCustomElemForm.reset();
            this.addCustomElemForm.controls['id'].setValue("");
          }
          this.successMessageShow('Custom element added successfully!');
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
    else{
      this.errorMessageShow('Quantity should be greater than 0');
    }
}

  editModuleLineQty;
  editModuleLineWidth;
  editModuleLineDepth;
  editModuleLineHeight;
  editModuleLineBreadth;
  editModuleLineThickness;
  editModuleLineLength;
  editmoduleLineItem(rowno,mod){
    this.editModuleLineQty = mod.quantity;
    if(mod.customizable_dimensions.dimensions=='WDH'){
      this.editModuleLineWidth = mod.width;
      this.editModuleLineDepth = mod.depth;
      this.editModuleLineHeight = mod.height;
    } else if(mod.customizable_dimensions.dimensions=='LBT'){
      this.editModuleLineBreadth = mod.breadth;
      this.editModuleLineThickness = mod.thickness;
      this.editModuleLineLength = mod.length;
    }
    var arr = document.getElementsByClassName('moduleLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('moduleLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }
  cancelModuleLineItem(rowno,mod){
    var arr = document.getElementsByClassName('moduleLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('moduleLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }

  editApplianceLineQty;
  editApplianceLineItem(rowno,mod){
    this.editApplianceLineQty = mod.quantity;
    var arr = document.getElementsByClassName('applianceLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('applianceLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }

  editExtraLineQty;
  editExtraLineItem(rowno,mod){
    this.editExtraLineQty = mod.quantity;
    var arr = document.getElementsByClassName('extraLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('extraLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }

  editCustomElemLineQty;
  editcustomelementLineItem(rowno,mod){
    this.editCustomElemLineQty = mod.quantity;
    var arr = document.getElementsByClassName('customelemLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('customelemLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }

  editProductLineItemQty;
  editProductLineItemVariation = null;
  editProductLineItem(rowno,mod){
    this.editProductLineItemQty = mod.quantity;
    var arr = document.getElementsByClassName('loosefurLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('loosefurLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }
  cancelProductLineItem(rowno,mod){
    var arr = document.getElementsByClassName('loosefurLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('loosefurLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }
  cancelApplianceLineItem(rowno,mod){
    var arr = document.getElementsByClassName('applianceLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('applianceLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }
  cancelExtraLineItem(rowno,mod){
    var arr = document.getElementsByClassName('extraLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('extraLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }
  cancelCustomElemLineItem(rowno,mod){
    var arr = document.getElementsByClassName('customelemLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('customelemLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }

  editCombinemoduleLineItem(rowno1,mod,rowno2){
    this.editModuleLineQty = mod.quantity;
    if(mod.customizable_dimensions.dimensions=='WDH'){
      this.editModuleLineWidth = mod.width;
      this.editModuleLineDepth = mod.depth;
      this.editModuleLineHeight = mod.height;
    } else if(mod.customizable_dimensions.dimensions=='LBT'){
      this.editModuleLineBreadth = mod.breadth;
      this.editModuleLineThickness = mod.thickness;
      this.editModuleLineLength = mod.length;
    }
    var arr = document.getElementsByClassName('moduleLineItemSpan'+rowno1+rowno2);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('moduleLineItemInput'+rowno1+rowno2);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }
  cancelCombineModuleLineItem(rowno1,mod,rowno2){
    var arr = document.getElementsByClassName('moduleLineItemSpan'+rowno1+rowno2);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('moduleLineItemInput'+rowno1+rowno2);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }

  updateModule(rowno,mod,secname){
    
    this.addModuleForm.controls['thickness'].setValue(this.editModuleLineThickness);
    this.addModuleForm.controls['length'].setValue(this.editModuleLineLength);
    this.addModuleForm.controls['breadth'].setValue(this.editModuleLineBreadth);
    this.addModuleForm.controls['depth'].setValue(this.editModuleLineDepth);
    this.addModuleForm.controls['height'].setValue(this.editModuleLineHeight);
    this.addModuleForm.controls['width'].setValue(this.editModuleLineWidth);
    if(secname=='wardrobe'){
      this.customizable_dim_data_for_module_mw = mod.customizable_dimensions;
    } else if (secname=='kitchen') {
      this.customizable_dim_data_for_module_mk = mod.customizable_dimensions;
    } 
    if(this.checkValidationForDimensions(secname,this.addModuleForm)){
      mod.quantity= this.editModuleLineQty;
      this.loaderService.display(true);
      
      var obj2 ={
        "modular_job_id": mod.id,
        "product_module":{
          "id": mod.id,
          "quantity": this.editModuleLineQty,
          "space": mod.space,
          "section_name":secname,
          "options": {
            "core_material": mod.core_material,
            "shutter_material": mod.shutter_material,
            "shutter_finish": mod.shutter_finish,
            "shutter_shade_code": mod.shutter_shade_code,
            "edge_banding_shade_code":mod.edge_banding_shade_code,
            "door_handle_code":mod.door_handle_code,
            "shutter_handle_code":mod.shutter_handle_code,
            "hinge_type": mod.hinge_type,
            "channel_type": mod.channel_type,
            "number_exposed_sites": 0,
            "hardware_brand_id": mod.brand_id,
            "addons": mod.addons,
            "custom_elements": mod.custom_elements,
            "addon_combinations": mod.addon_combinations,
            "addons_for_addons":mod.addons_for_addons
          }
        }
      }
      
      if(secname=='kitchen'){
        obj2['product_module']['options']['kitchen_category']=mod.kitchen_category_name;
        //obj2['product_module']['options']['custom_shelf_unit_width']=this.editModuleLineWidth;
      }
      if(mod.customizable_dimensions.dimensions=='WDH'){
        obj2['product_module']['options']['height']=this.editModuleLineHeight;
        obj2['product_module']['options']['width']=this.editModuleLineWidth;
        obj2['product_module']['options']['depth']=this.editModuleLineDepth;
      } else if(mod.customizable_dimensions.dimensions=='LBT'){
        obj2['product_module']['options']['length']=this.editModuleLineLength;
        obj2['product_module']['options']['thickness']=this.editModuleLineThickness;
        obj2['product_module']['options']['breadth']=this.editModuleLineBreadth;
      }
      this.quotationService.updateModuleOfSpace(this.projectId,this.quotation_id,obj2,secname).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.editModuleLineQty = undefined;
          this.editModuleLineWidth = undefined;
          this.editModuleLineHeight = undefined;
          this.editModuleLineDepth = undefined;
          this.editModuleLineLength = undefined;
          this.editModuleLineThickness = undefined;
          this.editModuleLineBreadth = undefined;
          this.loaderService.display(false);
          this.addModuleForm.reset();
          this.addModuleForm.controls['module_type'].setValue("");
          this.addModuleForm.controls['module'].setValue("");
          this.addModuleForm.controls['thickness'].setValue("");
          this.customizable_dim_data_for_module_mw = undefined;
          this.customizable_dim_data_for_module_mk = undefined;
          this.successMessageShow('Module updated successfully!');
          this.editProductLineItemVariation = null;
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
  }

  updateQuantity(rowno,mod,secname){
      
    if(this.editModuleLineQty>0){
    
      mod.quantity= this.editModuleLineQty;
      this.loaderService.display(true);
      
      var obj2 ={
        "modular_job_id": mod.id,
        "product_module":{
          "id": mod.id,
          "quantity": this.editModuleLineQty
        }
      }
      this.quotationService.updateQuantity(this.projectId,this.quotation_id,obj2,secname).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.ref.detectChanges();
          // this.editModuleLineQty = undefined;
          this.editModuleLineWidth = undefined;
          this.editModuleLineHeight = undefined;
          this.editModuleLineDepth = undefined;
          this.editModuleLineLength = undefined;
          this.editModuleLineThickness = undefined;
          this.editModuleLineBreadth = undefined;
          this.addModuleForm.reset();
          this.addModuleForm.controls['module_type'].setValue("");
          this.addModuleForm.controls['module'].setValue("");
          this.addModuleForm.controls['thickness'].setValue("");
          this.loaderService.display(false);
          this.successMessageShow('Module updated and saved to Boq successfully!');
          
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
      }
      else{
        this.errorMessageShow('Quantity should be greater than 0');
      }
  }


  updateAppliance(rowno,mod,secname){
    if(this.editApplianceLineQty>0){
      mod.quantity= this.editApplianceLineQty;
      this.loaderService.display(true);
      var obj2 ={
        "appliance_job_id":mod.id,
        "kitchen_appliance":{
          "id": mod.id,
          "quantity": this.editApplianceLineQty,
          "space": mod.space,
          "category":'kitchen'
        }
      }

      this.quotationService.updateApplianceOfSpace(this.projectId,this.quotation_id,obj2,secname).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.editApplianceLineQty = undefined;
          this.loaderService.display(false);
          this.successMessageShow('Appliance updated successfully!');
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
    else{
      this.errorMessageShow('Quantity should be greater than 0');
    }
  }
  updateExtra(rowno,mod,secname,combination){
    if(this.editExtraLineQty>0){
      mod.quantity= this.editExtraLineQty;
      this.loaderService.display(true);
      var obj2 ={
        "extra_job_id":mod.id,
        "addon":{
          "id": mod.id,
          "quantity": this.editExtraLineQty,
          "space": mod.space,
          "category": this.extraCategory,
          "combination":combination
        }
      }

      this.quotationService.updateExtraOfSpace(this.projectId,this.quotation_id,obj2).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.editExtraLineQty = undefined;
          this.loaderService.display(false);
          this.successMessageShow('Extra updated successfully!');
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
    else{
      this.errorMessageShow("Quantity should be greater than 0");
    }
  }
  updateCustomElem(rowno,mod,secname){
    if(this.editCustomElemLineQty>0){
      mod.quantity= this.editCustomElemLineQty;
      this.loaderService.display(true);
      var obj2 ={
        "custom_job_id": mod.id,
        "quantity": this.editCustomElemLineQty
      }

      this.quotationService.updateCustomElemOfSpace(this.projectId,this.quotation_id,obj2,secname).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.editCustomElemLineQty = undefined;
          this.loaderService.display(false);
          this.successMessageShow('Custom element updated successfully!');
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
    else{
      this.errorMessageShow("Quantity should be greater than 0");
    }
  }
  updateProduct(rowno,mod){
    if(this.editProductLineItemQty>0){
    mod.quantity= this.editProductLineItemQty;
    this.loaderService.display(true);
    var obj2 ={
      "boqjob_id":mod.id,
      "product":{
        "id": mod.id,
        "quantity": this.editProductLineItemQty,
        "space": mod.space,
        "product_variant_id": this.editProductLineItemVariation
      }
    }

    this.quotationService.updateboqJobOfSpace(this.projectId,this.quotation_id,obj2).subscribe(
      res=>{
        this.quotationDetails = res.quotation;
        this.editProductLineItemQty = undefined;
        this.editProductLineItemVariation = null;
        this.modalQuantityandProductSelectionForm.patchValue({product_variant_id: null});
        this.loaderService.display(false);
        this.successMessageShow('Product updated successfully!');
      },
      err =>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
    }
    else{
      this.errorMessageShow("Quantity should be greater than 0");
    }
  }
  moduleDelete(id,space,category,combined?){
    if(confirm('Are you sure you want to delete this module?')==true){
      this.loaderService.display(true);
      var obj;
      if(combined==true){
        obj={
          ids: [id],
          modular_job_id:id
        }
      } else {
        obj={
          ids: [id]
        }
      }
      this.quotationService.deleteModuleToSpace(this.projectId,this.quotation_id,obj,category).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.successMessageShow('Module deleted!');
          this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
  }

  boqServices_all:any = [];
  boqServices:any=[];
  applianceDelete(id,space){
    if(confirm('Are you sure you want to delete this appliance?')==true){
      this.loaderService.display(true);
      var obj ={
        ids: [id]
      };
      this.quotationService.deleteApplianceToSpace(this.projectId,this.quotation_id,obj).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.successMessageShow('Appliance deleted!');
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }
  extraDelete(id,space){
    if(confirm('Are you sure you want to delete this extra?')==true){
      this.loaderService.display(true);
      var obj ={
        ids: [id]
      };
      this.quotationService.deleteExtraToSpace(this.projectId,this.quotation_id,obj).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.successMessageShow('Extra deleted!');
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }
  customelementDelete(id,space){
    if(confirm('Are you sure you want to delete this custom element?')==true){
      this.loaderService.display(true);
      var obj;
        obj={
          ids: [id]
        }
      this.quotationService.deleteCustomElemToSpace(this.projectId,this.quotation_id,obj).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.successMessageShow('Custom element deleted!');
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  spaceDelete(space,category){
    if(confirm('Are you sure you want to delete this space?')==true){
      this.loaderService.display(true);
      if(category=='loose_furniture'){
        for(var i=0; i<this.boqProducts.length;i++){
          if(this.boqProducts[i].space==space){
            this.totalAmt=this.totalAmt- (this.boqProducts_all[i].sale_price * this.boqProducts_all[i].quantity);
             this.boqProducts.splice(i, 1);
          }
        }
        for(var i=0; i<this.boqProducts_all.length;i++){
          if(this.boqProducts_all[i].space==space){
             this.boqProducts_all.splice(i, 1);
          }
        }
        // localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
      }
      else if(category=='services'){
        for(var i=0; i<this.boqServices.length;i++){
          if(this.boqServices[i].space==space){
            this.totalAmt=this.totalAmt- (this.boqServices_all[i].sale_price * this.boqServices_all[i].quantity);
             this.boqServices.splice(i, 1);
          }
        }
        for(var i=0; i<this.boqServices_all.length;i++){
          if(this.boqServices_all[i].space==space){
             this.boqServices_all.splice(i, 1);
          }
        }
        localStorage.setItem('boqAddedServices',JSON.stringify(this.boqServices_all));

      }

      this.quotationService.deleteSpaceFromBoq(this.projectId,this.quotation_id,space,category).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.selectedSpacesArr = res.quotation.spaces;
          this.selectedSpacesArrMK=res.quotation.spaces_kitchen;
          this.selectedSpacesArrLf = res.quotation.spaces_loose;
          this.selectedSpacesArrSERV = res.quotation.spaces_services;
          this.selectedSpacesArrCustomEle = res.quotation.spaces_custom;
          this.selectedSpacesArrCf = (res.quotation.spaces_custom_furniture)?res.quotation.spaces_custom_furniture:[];
          this.successMessageShow('Space deleted!');
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  deleteQuotationOnBackClick(arg){
    if(this.quotation_id){
      this.loaderService.display(true);
      this.quotationService.deleteQuotation(this.projectId,this.quotation_id).subscribe(
        res=>{
          if(arg=='boqBack'){
            this.location.back();
            this.clearLocalStorage();
          } else if(arg==''){
              this.router.navigateByUrl('/');
              this.clearLocalStorage();
          }
          this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
        }
      );
    }
  }

  viewQuotationDetails(){
    this.loaderService.display(true);
    this.quotationService.viewQuotationDetails(this.projectId,this.quotation_id).subscribe(
      res =>{
        this.quotationDetails = res.quotation;
        
        this.selectedSpacesArr = res.quotation.spaces;
        this.selectedSpacesArrMK = res.quotation.spaces_kitchen;
        this.selectedSpacesArrLf = res.quotation.spaces_loose;
        this.selectedSpacesArrSERV = res.quotation.spaces_services;
        this.selectedSpacesArrCustomEle= res.quotation.spaces_custom;
        this.selectedSpacesArrCf = (res.quotation.spaces_custom_furniture)?res.quotation.spaces_custom_furniture:[];
        // this.generateBoqProductArr();
        this.boqServices_all =[];
        this.boqServices.length = 0;
        for(var l=0;l<Object.keys(this.quotationDetails.service_jobs).length;l++){
          for(var m=0;m<this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]].length;m++){
            this.boqServices_all.push(this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]][m]);
            // this.boqServices.push(this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]][m]);
          }
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  updateGlobalVar(ind?,Id?,category?){
    this.loaderService.display(true);
    var obj;
    var i1=ind;
    if(category=='wardrobe'){
      obj = {
        'boq_global_config' : {
          'quotation_id':this.quotation_id,
          'core_material':this.core_material_globalVar_MW,
          'shutter_material':this.shutter_material_globalVar_MW,
          'shutter_finish':this.shutter_finish_globalVar_MW,
          'shutter_shade_code':(this.shutter_shade_code_globalVar_MW!='customshadecode')?this.shutter_shade_code_globalVar_MW:this.shutter_custshade_code_globalVar_MW,
          'edge_banding_shade_code':(this.edgebanding_shade_code_globalVar_MW!='customedgebanshadecode')?this.edgebanding_shade_code_globalVar_MW:this.edgebanding_custshade_code_globalVar_MW,
          'door_handle_code': this.door_handle_code_globalVar_MW,
          'shutter_handle_code':this.shutter_handle_code_globalVar_MW,
          'hinge_type':(this.globalVarArr.modspace == true)?'normal': this.hinge_type_globalVar_MW,
          'channel_type':this.channel_type_globalVar_MW,
          'brand_id':this.hardware_brand_globalVar_MW,
          'category':'wardrobe'
        }
      }
    } else if(category=='kitchen'){
      obj = {
        'boq_global_config' : {
          'quotation_id':this.quotation_id,
          'core_material':this.core_material_globalVar_MK,
          'shutter_material':this.shutter_material_globalVar_MK,
          'shutter_finish':this.shutter_finish_globalVar_MK,
          'shutter_shade_code':(this.shutter_shade_code_globalVar_MK!='customshadecode')?this.shutter_shade_code_globalVar_MK:this.shutter_custshade_code_globalVar_MK,
          'edge_banding_shade_code':(this.edgebanding_shade_code_globalVar_MK!='customedgebanshadecode')?this.edgebanding_shade_code_globalVar_MK:this.edgebanding_custshade_code_globalVar_MK,
          'door_handle_code': this.door_handle_code_globalVar_MK,
          'skirting_config_height':this.skirting_con_height_globalVar_MK,
          'skirting_config_type':this.skirting_con_type_globalVar_MK,
          // 'shutter_handle_code':this.shutter_handle_code_globalVar_MW,
          'hinge_type': (this.globalVarArr.modspace == true)?'normal':this.hinge_type_globalVar_MK,
          'channel_type':this.channel_type_globalVar_MK,
          'brand_id':this.hardware_brand_globalVar_MK,
          'countertop':this.countertop_globalVar_MK,
          'civil_kitchen':this.typeofkitchen_globalVar_MK,
          'category':'kitchen'
        }
      }
      if(obj.boq_global_config.civil_kitchen){
        obj['boq_global_config']['civil_kitchen_parameter_attributes'] =  {
            'depth': this.depthofcivilKit_globalVar_MK,
            'drawer_height_1':this.drawerheight1ofcivilKit_globalVar_MK,
            'drawer_height_2':this.drawerheight2ofcivilKit_globalVar_MK,
            'drawer_height_3':this.drawerheight3ofcivilKit_globalVar_MK
          }
      }
    }
    this.quotationService.updateBoqGlobalConfig(obj,Id).subscribe(
      res => {
        if(res.boq_global_config.category=='wardrobe'){
          this.shadeImgMW = undefined;
        } else if(res.boq_global_config.category=='kitchen'){
          this.shadeImg = undefined;
        }
        var arr = document.getElementsByClassName('editRowSpan');
        for(var i=0;i<arr.length;i++){
          arr[i].classList.remove('d-none');
        }
        arr =document.getElementsByClassName('editRowInput');
        for(var i=0;i<arr.length;i++){
          arr[i].classList.add('d-none');
        }
        this.getBoqConfig(category);
        this.successMessageShow('Updated successfully!');
        this.loaderService.display(false);
      },
      err => {
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  cancelEditGlobalVarRow(rowno?,category?){
    var arr = document.getElementsByClassName('editRowSpan');
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('editRowInput');
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    this.setGlobalConfigNgModel(category);
  }

  editGlobalVarRow(rowno?,data?){
    this.showArrivaeValueToggle=true;
    this.listofCoreMaterial(data.core_material.name);
    this.listofShutterFinishes(data.shutter_material.name);
    this.listofShutterFinishShades(data.shutter_finish.name);
    if(data.category=='kitchen')
      this.listofSkirtingHeights(data.skirting_config_type);
      //this.getHandleList(this.shutter_finish_globalVar_MK);
    var arr = document.getElementsByClassName('editRowSpan');
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('editRowInput');
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }

  transitModId;
  getCustomizationOfModule(modId){
    this.transitModId = modId;
    this.loaderService.display(true);
    this.quotationService.getCustomizationOfModule(modId,this.projectId,this.quotation_id).subscribe(
      res=>{
        if(res.modular_job.category=='wardrobe'){
          this.customizationModule_MW_details=res.modular_job;
         
          this.setCustomizationFormValues(this.customizationModule_MW_details);
        } else if(res.modular_job.category=='kitchen'){
          //service call
          this.customizationModule_MK_details=res.modular_job;
        
          if(this.customizationModule_MK_details.shutter_finish!=null){
            // this.getHandleList(this.customizationModule_MK_details.shutter_finish,this.customizationModule_MK_details.product_module_id);
          }
          this.setCustomizationFormValues(this.customizationModule_MK_details);
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }
  customization_addon_dropdownChange(val,index,category){
    if(category=='MW'){
      for(var i=0;i<this.customizationModule_MW_details.allowed_addons.length;i++){
        if(this.customizationModule_MW_details.allowed_addons[i].id==val){
          (<FormArray>this.customizationModule_MW_Form.get('addons')).controls[index]["controls"].image.setValue(this.customizationModule_MW_details.allowed_addons[i].addon_image);
        }
      }
    } else if(category=='MK'){
      for(var i=0;i<this.customizationModule_MK_details.allowed_addons.length;i++){
        if(this.customizationModule_MK_details.allowed_addons[i].id==val){
          (<FormArray>this.customizationModule_MK_Form.get('addons')).controls[index]["controls"].image.setValue(this.customizationModule_MK_details.allowed_addons[i].addon_image);
        }
      }
    }

  }
  compulsoryAddonsList;

  onchangeOfCustomizationShade(val,type,category){
    if(category=='wardrobe' && type=='shade' && val=='customshadecode'){
      this.customizationModule_MW_Form.controls['cust_shutter_shade_code'].enable();
    } else if(category=='wardrobe' && type=='shade' && val!='customshadecode'){
      this.customizationModule_MW_Form.controls['cust_shutter_shade_code'].disable();
      this.customizationModule_MW_Form.controls['cust_shutter_shade_code'].setValue("");
    } else if(category=='wardrobe' && type=='edgeband' && val=='customedgebanshadecode'){
      this.customizationModule_MW_Form.controls['cust_edge_banding_shade_code'].enable();
    } else if(category=='wardrobe' && type=='edgeband' && val!='customedgebanshadecode'){
      this.customizationModule_MW_Form.controls['cust_edge_banding_shade_code'].disable();
      this.customizationModule_MW_Form.controls['cust_edge_banding_shade_code'].setValue("");
    } else if(category=='kitchen' && type=='shade' && val=='customshadecode'){
      this.customizationModule_MK_Form.controls['cust_shutter_shade_code'].enable();
    } else if(category=='kitchen' && type=='shade' && val!='customshadecode'){
      this.customizationModule_MK_Form.controls['cust_shutter_shade_code'].disable();
      this.customizationModule_MK_Form.controls['cust_shutter_shade_code'].setValue("");
    } else if(category=='kitchen' && type=='edgeband' && val=='customedgebanshadecode'){
      this.customizationModule_MK_Form.controls['cust_edge_banding_shade_code'].enable();
    } else if(category=='kitchen' && type=='edgeband' && val!='customedgebanshadecode'){
      this.customizationModule_MK_Form.controls['cust_edge_banding_shade_code'].disable();
      this.customizationModule_MK_Form.controls['cust_edge_banding_shade_code'].setValue("");
    }
  }

  setCustomizationFormValues(formval){
    
  
    this.compulsoryAddonsList =[];
    (<FormArray>this.customizationModule_MK_Form.controls['addons']).controls=[];
    (<FormArray>this.customizationModule_MW_Form.controls['addons']).controls=[];
    (<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls=[];
    (<FormArray>this.customizationModule_MK_Form.controls['optional_addons']).controls=[];
    if(formval.category=="wardrobe"){
      this.customizationModule_MW_Form.controls['core_material'].setValue(formval.core_material);
      if(formval.core_material!=null){
        this.listofCoreMaterial(formval.core_material);
      }
      this.customizationModule_MW_Form.controls['shutter_material'].setValue(formval.shutter_material);
      if(formval.shutter_material!=null){
        this.listofShutterFinishes(formval.shutter_material);
      }
      this.customizationModule_MW_Form.controls['shutter_finish'].setValue(formval.shutter_finish);
      if(formval.shutter_finish!=null){
        this.listofShutterFinishShades(formval.shutter_finish);
      }
      if(formval.custom_shade_flag){
        this.customizationModule_MW_Form.controls['shutter_shade_code'].setValue('customshadecode');
        this.customizationModule_MW_Form.controls['cust_shutter_shade_code'].setValue(formval.shutter_shade_code);
        this.customizationModule_MW_Form.controls['cust_shutter_shade_code'].enable();
      } else {
        this.customizationModule_MW_Form.controls['shutter_shade_code'].setValue(formval.shutter_shade_code);
        this.customizationModule_MW_Form.controls['cust_shutter_shade_code'].setValue("");
        this.customizationModule_MW_Form.controls['cust_shutter_shade_code'].disable();
      }
      if(formval.custom_edge_banding_flag){
        this.customizationModule_MW_Form.controls['edge_banding_shade_code'].setValue('customedgebanshadecode');
        this.customizationModule_MW_Form.controls['cust_edge_banding_shade_code'].setValue(formval.edge_banding_shade_code);
        this.customizationModule_MW_Form.controls['cust_edge_banding_shade_code'].enable();
      } else {
        this.customizationModule_MW_Form.controls['edge_banding_shade_code'].setValue(formval.edge_banding_shade_code);
        this.customizationModule_MW_Form.controls['cust_edge_banding_shade_code'].setValue("");
        this.customizationModule_MW_Form.controls['cust_edge_banding_shade_code'].disable();
      }
      this.customizationModule_MW_Form.controls['shutter_handle_code'].setValue(formval.shutter_handle_code);
      this.customizationModule_MW_Form.controls['door_handle_code'].setValue(formval.door_handle_code);
      this.customizationModule_MW_Form.controls['hinge_type'].setValue(formval.hinge_type);
      this.customizationModule_MW_Form.controls['channel_type'].setValue(formval.channel_type);
      if(!this.editBtnFlag){
        this.customizationModule_MW_Form.controls['hardware_brand'].setValue(formval.brand_name);
      } else {
        this.customizationModule_MW_Form.controls['hardware_brand'].setValue(formval.brand_id);
      }
      this.customizationModule_MW_Form.controls['number_exposed_sites'].setValue(formval.number_exposed_sites);
      for(var l=0;l<formval.addons.length;l++){
        if(!this.editBtnFlag){
          this.addNestedAddons(formval.addons[l]);
        } else {
          this.addNestedAddons(formval.addons[l]);
        }

      }
    } else if(formval.category=="kitchen"){

      this.customizationModule_MK_Form.controls['core_material'].setValue(formval.core_material);
      if(formval.core_material!=null){
        this.listofCoreMaterial(formval.core_material);
      }
      this.customizationModule_MK_Form.controls['shutter_material'].setValue(formval.shutter_material);
      if(formval.shutter_material!=null){
        this.listofShutterFinishes(formval.shutter_material);
      }
      this.customizationModule_MK_Form.controls['shutter_finish'].setValue(formval.shutter_finish);
      if(formval.shutter_finish!=null){
        this.listofShutterFinishShades(formval.shutter_finish);
      }
      if(formval.custom_shade_flag){
        this.customizationModule_MK_Form.controls['shutter_shade_code'].setValue('customshadecode');
        this.customizationModule_MK_Form.controls['cust_shutter_shade_code'].setValue(formval.shutter_shade_code);
        this.customizationModule_MK_Form.controls['cust_shutter_shade_code'].enable();
      } else {
        this.customizationModule_MK_Form.controls['shutter_shade_code'].setValue(formval.shutter_shade_code);
        this.customizationModule_MK_Form.controls['cust_shutter_shade_code'].setValue("");
        this.customizationModule_MK_Form.controls['cust_shutter_shade_code'].disable();
      }
      if(formval.custom_edge_banding_flag){
        this.customizationModule_MK_Form.controls['edge_banding_shade_code'].setValue('customedgebanshadecode');
        this.customizationModule_MK_Form.controls['cust_edge_banding_shade_code'].setValue(formval.edge_banding_shade_code);
        this.customizationModule_MK_Form.controls['cust_edge_banding_shade_code'].enable();
      } else {
        this.customizationModule_MK_Form.controls['edge_banding_shade_code'].setValue(formval.edge_banding_shade_code);
        this.customizationModule_MK_Form.controls['cust_edge_banding_shade_code'].setValue("");
        this.customizationModule_MK_Form.controls['cust_edge_banding_shade_code'].disable();
      }
      this.customizationModule_MK_Form.controls['door_handle_code'].setValue(formval.door_handle_code);
      this.customizationModule_MK_Form.controls['hinge_type'].setValue(formval.hinge_type);
      this.customizationModule_MK_Form.controls['channel_type'].setValue(formval.channel_type);
      this.customizationModule_MK_Form.controls['number_exposed_sites'].setValue(formval.number_exposed_sites);
      //this.customizationModule_MK_Form.controls['gola_profile'].setValue(formval.gola_profile);
      // customizationModule_MK_Form
      this.customizationModule_MK_Form.controls['skirting_config_type'].setValue(formval.skirting_config_type);
      this.customizationModule_MK_Form.controls['skirting_config_height'].setValue(formval.skirting_config_height);
      if(formval.skirting_config_type!=null){
        this.listofSkirtingHeights(formval.skirting_config_type);
      }
      if(!this.editBtnFlag){
        this.customizationModule_MK_Form.controls['hardware_brand'].setValue(formval.brand_name);
      } else {
        this.customizationModule_MK_Form.controls['hardware_brand'].setValue(formval.brand_id);
      }
      //done
      for(var l=0;l<formval.compulsory_addons.length;l++){
        for(var k=0;k<formval.compulsory_addons[l].allowed_addons.length;k++){
          this.compulsoryAddonsList.push(formval.compulsory_addons[l].allowed_addons[k]); //list of all allowed addons for the compulsory section
        }
      }

      // formval.addons can be both compulsory addons and optional addons but not addons_for_addons
      for(var l=0;l<formval.addons.length;l++){
        var flag= true;
        for(var t=0;t<this.compulsoryAddonsList.length;t++){
          if(formval.addons[l].compulsory){
            this.compulsoryAddonsList[t]['quantity']= formval.addons[l].quantity;
            flag=false;
             break;
          }
        }
        if(flag){
          this.addNestedAddonsMk(formval.addons[l]); 
        }
      }

      for(var k2=0;k2<formval.compulsory_addons.length;k2++){
        
         this.addNestedCompAddonsMk(formval.compulsory_addons[k2]);
      }

     
      if(formval.addons.length>0){
       
        var formelem=(<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls;
        for(var k1=0;k1<formelem.length;k1++){
          for(var l1=0;l1<formval.addons.length;l1++){
            // ;
            if((<FormGroup>formelem[k1]).controls['slot'].value==formval.addons[l1].slot){
              (<FormGroup>formelem[k1]).controls['id'].setValue(formval.addons[l1].id);
              (<FormGroup>formelem[k1]).controls['name'].setValue(formval.addons[l1].name);
              (<FormGroup>formelem[k1]).controls['quantity'].setValue(1);
              (<FormGroup>formelem[k1]).controls['image'].setValue(formval.addons[l1].addon_image);
              
            }
          }
          
        }
      }
    
      if(formval.addon_combinations.length>0){
       
        var formelem=(<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls;
        for(var k1=0;k1<formelem.length;k1++){
        for(var l1=0;l1<formval.addon_combinations.length;l1++){

          let data=formval.addon_combinations[l1];
        
          if((<FormGroup>formelem[k1]).controls['slot'].value==data.slot){
            
              (<FormGroup>formelem[k1]).controls['id'].setValue(data.id);
              (<FormGroup>formelem[k1]).controls['name'].setValue(data.combo_name);
              (<FormGroup>formelem[k1]).controls['addons'].setValue(data.addons);
              (<FormGroup>formelem[k1]).controls['quantity'].setValue(data.quantity);
              // (<FormGroup>formelem[k1]).controls['image'].setValue(combo_image);
              (<FormGroup>formelem[k1]).controls['combination'].setValue(true);
              (<FormGroup>formelem[k1]).controls['included_mrp'].setValue(data.included_mrp);    
          }
        }
      }
      
    }

    if(formval.addon_combinations.length>0){
      var formelem=(<FormArray>this.customizationModule_MK_Form.controls['addons']).controls;
     
      for(var l1=0;l1<formval.addon_combinations.length;l1++){

        let data=formval.addon_combinations[l1];
        data['combination']=true;
        if(!data.slot){
            const getFun = this.customizationModule_MK_Form.get('addons') as FormArray;
            getFun.push(this.buildAddons(data));
        }
    }
  }
     
      for(var l1=0;l1<formval.addons_for_addons.length;l1++){
      
        var formName=<FormArray>this.customizationModule_MK_Form.get('compulsory_addons');
       
        for(var l2=0;l2<formName.length;l2++){
          if((<FormGroup>formName.controls[l2]).controls['slot'].value==formval.addons_for_addons[l1].slot){
            
            this.addAddonForAddons(formval.addons_for_addons[l1],this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[l2]['controls'],l2);
            // this.getListofAddonsForAddons(formval.addons_for_addons[l1].compulsory_addon_id,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].combination.value,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[l2]['controls'].slot.value,l2);
          }
        }
      }
    }
  }

  quotations;
  updateCustomization(formval,secname){
   
    if(secname=='wardrobe'){
      this.loaderService.display(true);
      var obj2 ={
        "modular_job_id": this.customizationModule_MW_details.id,
        "product_module":{
          "id": this.customizationModule_MW_details.id,
          "quantity": this.customizationModule_MW_details.quantity,
          "space": this.customizationModule_MW_details.space,
          "section_name":secname,
          "category":'wardrobe',
          "options": {
            "core_material": formval.core_material,
            "shutter_material": formval.shutter_material,
            "shutter_finish": formval.shutter_finish,
            "shutter_shade_code": (formval.shutter_shade_code!='customshadecode')?formval.shutter_shade_code:formval.cust_shutter_shade_code,
            "edge_banding_shade_code":(formval.edge_banding_shade_code!='customedgebanshadecode')?formval.edge_banding_shade_code:formval.cust_edge_banding_shade_code,
            "door_handle_code":formval.door_handle_code,
            "shutter_handle_code":formval.shutter_handle_code,
            "hinge_type": formval.hinge_type,
            "channel_type": formval.channel_type,
            "number_exposed_sites": formval.number_exposed_sites,
            // "hardware_brand_id": formval.hardware_brand,
            "addons": formval.addons
          }
        }
      }
      this.quotationService.updateModuleOfSpace(this.projectId,this.quotation_id,obj2,secname).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.quotationDetails=res.quotation; //check this
          this.ref.detectChanges();
          this.customizationModule_MW_details = undefined;
          this.customizationModule_MW_Form.reset();
          (<FormArray>this.customizationModule_MW_Form.controls['addons']).controls=[];
          $('#customizationModal').modal('hide');
          this.ref.detectChanges();
          this.loaderService.display(false);
          this.successMessageShow('Customization updated successfully!');
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.customizationModule_MW_details = undefined;
          this.customizationModule_MW_Form.reset();
          (<FormArray>this.customizationModule_MW_Form.controls['addons']).controls=[];
          this.ref.detectChanges();
          setTimeout(()=>{this.getCustomizationOfModule(this.transitModId)},1500);
        }
      );
    } else {
      
      for(var k4=0;k4<this.customizationModule_MK_Form.controls['compulsory_addons'].value.length;k4++){
        for(var k5=0;k5<formval.addons.length;k5++){
          if(formval.addons[k5].slot==this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].slot
            ){
            formval.addons.splice(k5,1)
          }
        }
        formval.addons.push({
          'id':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].id,
          'quantity':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].quantity,
          'slot':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].slot,
          'brand_id':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].brand_id,
          'compulsory':true,
          'combination':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].combination
        })
        for(var k6=0;k6<this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons.length;k6++){
         
          formval.addons.push({
          'id':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].id,
          'quantity':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].quantity,
          'slot':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].slot,
          'compulsory_addon_id':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].id,
          'compulsory_addon_type':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].compulsory_addon_type,
          'combination':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].combination,
          })
        }
      }


      this.loaderService.display(true);
      var obj3 ={
        "modular_job_id": this.customizationModule_MK_details.id,
        "product_module":{
          "id": this.customizationModule_MK_details.id,
          "quantity": this.customizationModule_MK_details.quantity,
          "space": this.customizationModule_MK_details.space,
          "section_name":secname,
          "category":'kitchen',
          "options": {
            "core_material": formval.core_material,
            "shutter_material": formval.shutter_material,
            "shutter_finish": formval.shutter_finish,
            "shutter_shade_code": (formval.shutter_shade_code!='customshadecode')?formval.shutter_shade_code:formval.cust_shutter_shade_code,
            "edge_banding_shade_code":(formval.edge_banding_shade_code!='customedgebanshadecode')?formval.edge_banding_shade_code:formval.cust_edge_banding_shade_code,
            "door_handle_code":formval.door_handle_code,
            "hinge_type": formval.hinge_type,
            "channel_type": formval.channel_type,
            "number_exposed_sites": formval.number_exposed_sites,
            // "hardware_brand_id": formval.hardware_brand,
            "addons": formval.addons,
            'skirting_config_type':formval.skirting_config_type,
            'skirting_config_height':formval.skirting_config_height,
            'kitchen_category':this.customizationModule_MK_details.kitchen_category_name
          }
        }
      }
      this.quotationService.updateModuleOfSpace(this.projectId,this.quotation_id,obj3,secname).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.ref.detectChanges();
          this.customizationModule_MK_details = undefined;
          this.customizationModule_MK_Form.reset();
          this.addon_brandlist=[];
          (<FormArray>this.customizationModule_MK_Form.controls['addons']).controls=[];
          (<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls=[];
          $('#customizationModalMk').modal('hide');
          this.addon_brandlist_for_addons = [];
          this.loaderService.display(false);
          this.successMessageShow('Customization updated successfully!');
        },
        err =>{
          this.loaderService.display(false);
          this.customizationModule_MK_details = undefined;
          this.customizationModule_MK_Form.reset();
          (<FormArray>this.customizationModule_MK_Form.controls['addons']).controls=[];
          (<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls=[];
          this.addon_brandlist_for_addons = [];
          this.addon_brandlist=[];
          this.errorMessageShow(JSON.parse(err['_body']).message);
          setTimeout(()=>{this.getCustomizationOfModule(this.transitModId)},1500);
        }
      );
    }
  }

  saveQuotation(status){
    this.loaderService.display(true);

    var data = {
      "quotation": {
      "status": status
      }
    }
    this.quotationService.updateBOQData(this.quotation_id,this.projectId,data).subscribe(
      res=>{
        this.successMessageShow('Quotation saved successfully!');
        this.clearLocalStorage();
        this.location.back();
        this.loaderService.display(false);
      },
      err=> {
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  shutterhandleImg;
  doorhandleImg;
  doorhandleImgMw;
  shadeImg;
  shadeImgMW;
  edgebandingImg;
  edgebandingImgMW;
  setImage(val,arg,category?){
    if(arg=='shutterhandle' || arg=='shutter'){
      this.shutterhandleImg=val.handle_image;
      if(this.add_globalVarModal_bool){
        this.addGlobalVariableForm.controls['shutter_handle_code_img'].setValue(this.shutterhandleImg);
      }
      this.shutter_handle_code_globalVar_MW = val.code;
      // $('#shutterhandleCodeModal').modal('hide');
      $('#addhandleModal').modal('hide');
      this.successMessageShow('handle code selected');
      if(this.add_globalVarModal_bool){
        this.addGlobalVariableForm.controls['shutter_handle_code'].setValue(val.code);
        $('#setGlobalConfigModal').modal('show');
        $('#setGlobalConfigModal').css({"overflow-y": "auto"});
        // this.add_globalVarModal_bool = false;
      }
      if(this.customizationmodal_bool){
        if(category=='wardrobe') {
          this.customizationModule_MW_Form.controls['shutter_handle_code'].setValue(val.code);
          $('#customizationModal').modal('show');
          $('#customizationModal').css({"overflow-y": "auto"});
        }
      }
      
      // this.customizationmodal_bool=false;
    } else if(arg=='doorhandle' || arg=='drawer') {
        if(category=='kitchen'){
          this.doorhandleImg=val.handle_image;
        } else if(category=='wardrobe'){
          this.doorhandleImgMw=val.handle_image;
        }
        if(this.add_globalVarModal_bool){
          this.addGlobalVariableForm.controls['door_handle_code_img'].setValue(val.handle_image);
        }
        if(category=='kitchen'){
          this.door_handle_code_globalVar_MK = val.code;
        } else if(category=='wardrobe'){
          this.door_handle_code_globalVar_MW = val.code;
        }
        if(this.customizationmodal_bool){
          if(category=='kitchen') {
            this.customizationModule_MK_Form.controls['door_handle_code'].setValue(val.code);
            $('#customizationModalMk').modal('show');
            $('#customizationModalMk').css({"overflow-y": "auto"});
            //this.customizationmodal_bool =false;
          } else if(category=='wardrobe') {
            this.customizationModule_MW_Form.controls['door_handle_code'].setValue(val.code);
            $('#customizationModal').modal('show');
            $('#customizationModal').css({"overflow-y": "auto"});
            //this.customizationmodal_bool =false
          }
        }
        $('#addhandleModal').modal('hide');
        this.successMessageShow('handle code selected');
        if(this.add_globalVarModal_bool){
          this.addGlobalVariableForm.controls['door_handle_code'].setValue(val.code);
          $('#setGlobalConfigModal').modal('show');
          $('#setGlobalConfigModal').css({"overflow-y": "auto"});
        // this.add_globalVarModal_bool = false;
        }
    } else if(arg=='shadeCode') {
      for(var k=0;k<this.globalVarArr.shutter_shade_code.length;k++){
        if(val==this.globalVarArr.shutter_shade_code[k].code){
          if(category=='kitchen'){
            this.shadeImg=this.globalVarArr.shutter_shade_code[k].shade_image;
          } else if(category=='wardrobe'){
            this.shadeImgMW=this.globalVarArr.shutter_shade_code[k].shade_image;
          }
          if(this.add_globalVarModal_bool){
            this.addGlobalVariableForm.controls['shutter_shade_code_img'].setValue(this.globalVarArr.shutter_shade_code[k].shade_image);
            this.getMatchingEdgebandOfShade(this.globalVarArr.shutter_shade_code[k].id,category,true);
          } else {
            this.getMatchingEdgebandOfShade(this.globalVarArr.shutter_shade_code[k].id,category,false);
          }
        }
      }
      if(category=='kitchen'){
        this.shutter_shade_code_globalVar_MK = val;
      } else if(category=='wardrobe'){
        this.shutter_shade_code_globalVar_MW = val;
      }
      
      $('#shadeCodeModal').modal('hide');
      this.successMessageShow('shade code selected');
      if(this.add_globalVarModal_bool){
        this.addGlobalVariableForm.controls['shutter_shade_code'].setValue(val);
        $('#setGlobalConfigModal').modal('show');
        $('#setGlobalConfigModal').css({"overflow-y": "auto"});
        this.add_globalVarModal_bool = false;
      }
    } else if(arg=='edgebandingShadeCode') {
      for(var k=0;k<this.globalVarArr.edge_banding_shade_code.length;k++){
        if(val==this.globalVarArr.edge_banding_shade_code[k].code){
          if(category=='kitchen'){
            this.edgebandingImg=this.globalVarArr.edge_banding_shade_code[k].shade_image;
          } else if(category=='wardrobe'){
            this.edgebandingImgMW=this.globalVarArr.edge_banding_shade_code[k].shade_image
          }
          if(this.add_globalVarModal_bool){
            this.addGlobalVariableForm.controls['edge_banding_shade_code_img'].setValue(this.globalVarArr.edge_banding_shade_code[k].shade_image);
          }
        }
      }
      if(category=='kitchen'){
        this.edgebanding_shade_code_globalVar_MK = val;
      } else if(category=='wardrobe'){
        this.edgebanding_shade_code_globalVar_MW = val;
      }
      $('#edgebandingShadeModal').modal('hide');
      this.successMessageShow('edge banding shade selected');
      if(this.add_globalVarModal_bool){
        this.addGlobalVariableForm.controls['edge_banding_shade_code'].setValue(val);
        $('#setGlobalConfigModal').modal('show');
        $('#setGlobalConfigModal').css({"overflow-y": "auto"});
        this.add_globalVarModal_bool = false;
      }
    }
  }

  setImageModal(val,arg,category?){
    if(arg=='shadeCode') {
      for(var k=0;k<this.globalVarArr.shutter_shade_code.length;k++){
        if(val==this.globalVarArr.shutter_shade_code[k].code){
          if(category=='kitchen'){
            this.shadeImg=this.globalVarArr.shutter_shade_code[k].shade_image;
          } else if(category=='wardrobe'){
            this.shadeImgMW=this.globalVarArr.shutter_shade_code[k].shade_image
          }
        }
      }
      if(val!='customshadecode'){
        this.shutter_custshade_code_globalVar_MW = undefined;
      }
    }
    if(arg=='edgebandingShadeCode'){
      for(var k=0;k<this.globalVarArr.edge_banding_shade_code.length;k++){
        if(val==this.globalVarArr.edge_banding_shade_code[k].code){
          if(category=='kitchen'){
            this.edgebandingImg=this.globalVarArr.edge_banding_shade_code[k].shade_image;
          } else if(category=='wardrobe'){
            this.edgebandingImgMW=this.globalVarArr.edge_banding_shade_code[k].shade_image
          }
        }
      }
      if(val!='customedgebanshadecode'){
        this.edgebanding_custshade_code_globalVar_MW = undefined;
      }
    }
  }

  customshadecode;
  customedgebanshadecode;
  addCustomShadeCode(category){
    if(category=='kitchen'){
      this.shutter_shade_code_globalVar_MK = this.customshadecode;
      this.shadeImg = undefined;
    } else if(category=='wardrobe'){
      this.shutter_shade_code_globalVar_MW=this.customshadecode;
      this.shadeImgMW = undefined;
    }
    $('#shadeCodeModal').modal('hide');
    this.successMessageShow('custom shade code selected');
    if(this.add_globalVarModal_bool){
      this.addGlobalVariableForm.controls['shutter_shade_code'].setValue(this.customshadecode);
      $('#setGlobalConfigModal').modal('show');
      $('#setGlobalConfigModal').css({"overflow-y": "auto"});
      this.add_globalVarModal_bool = false;
    }
    this.customshadecode = undefined;
  }

  addCustomEdgeBanShadeCode(category){
    if(category=='kitchen'){
      this.edgebanding_shade_code_globalVar_MK = this.customedgebanshadecode;
      this.edgebandingImg = undefined;
    } else if(category=='wardrobe'){
      this.edgebanding_shade_code_globalVar_MW=this.customedgebanshadecode;
      this.edgebandingImgMW = undefined;
    }
    $('#edgebandingShadeModal').modal('hide');
    this.successMessageShow('custom edge banding shade selected');
    if(this.add_globalVarModal_bool){
      this.addGlobalVariableForm.controls['edge_banding_shade_code'].setValue(this.customedgebanshadecode);
      $('#setGlobalConfigModal').modal('show');
      $('#setGlobalConfigModal').css({"overflow-y": "auto"});
      this.add_globalVarModal_bool = false;
    }
    this.customedgebanshadecode = undefined;
  }

  uploadKdMaxExcel(space,category,lineno){
    this.closeKdmax_errorblock(lineno);
    var data={
      "category":category ,
      "space": space,
      "attachment":this.basefile
    }
    this.loaderService.display(true);
    this.quotationService.uploadKDMaxExcel(this.projectId,this.quotation_id,data).subscribe(
      res=>{
        this.quotationDetails=res.quotation;
        if(res.quotation.errors.length>0){
          var str = 'kdmax_errorblock'+lineno;
          document.getElementById(str).classList.remove('d-none');
        }
        if(res.quotation.errors.length==0){
          this.successMessageShow('Uploaded successfully!');
        }
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
  closeKdmax_errorblock(k){
    var str = 'kdmax_errorblock'+k;
    document.getElementById(str).classList.add('d-none');
  }

  attachment_file;
  basefile;
  onChange(event) {
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

  file_name:any;
  selectedSpace:any;
  uploadCustomFurnitureExl(event,index,space){
    this.selectedSpace=space;
    if (event.target.files) {
      // let file_name = event.target.files[0].name;
      // if (file_name == '1DoorQuoteForm.xlsx' || file_name == '1WardrobeSetQuoteForm.xlsx' || file_name == '1DetailedQuoteForm.xlsx' || file_name == '1QuoteForm.xlsx' || file_name == '1DetailedQuoteForm-1.xlsx') {
        this.attachment_file =event.target.files[0] || event.srcElement.files[0];
        // var result = file_name.split('.')[0];
        // this.file_name = result;
        // 
        var fileReader = new FileReader();
        var base64;
        fileReader.onload = (fileLoadedEvent) => {
         base64 = fileLoadedEvent.target;
         this.basefile = base64.result;
       };
       fileReader.readAsDataURL(this.attachment_file);
      }
      else{
        alert('kindly select relevent file');
        $('#uploadInput'+index).val('');
      }
    
  }

  combineModules(formval){
    this.loaderService.display(true);
    this.quotationService.combineModules(this.projectId,this.quotation_id,formval).subscribe(
      res=>{
        this.quotationDetails = res.quotation;
        this.combinedModulesForm.reset();
        (<FormArray>this.combinedModulesForm.controls['modular_job_ids']).controls=[];
        this.combinedModulesForm.controls['combined_door_id'].setValue("");
        this.successMessageShow('Combined successfully');
        $('#combinedmodulesModal').modal('hide');
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
  editCombineModuleId;
  editcombineModules(formval,modjobid){
    this.loaderService.display(true);
    this.quotationService.editCombinedModule(this.projectId,this.quotation_id,formval,modjobid).subscribe(
      res=>{
        this.quotationDetails = res.quotation;
        this.combinedModulesForm.reset();
        (<FormArray>this.combinedModulesForm.controls['modular_job_ids']).controls=[];
        this.combinedModulesForm.controls['combined_door_id'].setValue("");
        this.successMessageShow('Combined successfully');
        $('#editCombineModuleModal').modal('hide');
        this.editCombineModuleId = undefined;
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  show_EditCombModModal(index,data){
    this.combinedModulesForm.controls['space'].setValue(data.space);
    this.combinedModulesForm.controls['description'].setValue(data.name);
    this.combinedModulesForm.controls['combined_door_id'].setValue(data.combined_door.id);
    this.editCombineModuleId = data.id;
    for(var p=0;p<data.included_modules.length;p++){
      (<FormArray> this.combinedModulesForm.get('modular_job_ids')).push(new FormControl(data.included_modules[p].id));
    }
  }
  combinemodalData;
  setCombineModuleData(data){
    this.combinemodalData = data;
    this.combinedModulesForm.controls['space'].setValue(data[0].space);
    this.getCombinedDoors();
  }
  onCheckChange(event) {
    var updateFormArray : FormArray;
      updateFormArray = this.combinedModulesForm.get('modular_job_ids') as FormArray;
    /* Selected */
    if(event.target.checked){
      updateFormArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      var j:number = 0;
      updateFormArray.controls.forEach((ctr: FormControl) => {
        if(ctr.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          updateFormArray.removeAt(j);
          return;
        }

        j++;
      });

    }
  }

  onCheckChangeFilter(event,fileterField,fileterFor){
    
    if(fileterFor=='extra' && fileterField=='addontag'){
      if(event.target.checked){
        this.tags_extras_filter.push(event.target.value);
      } else {
        this.tags_extras_filter.splice( this.tags_extras_filter.indexOf(event.target.value), 1 );
      }
    } else if(fileterFor=='extra' && fileterField=='make') {
      if(event.target.checked){
        this.brand_name_extra_filter.push(event.target.value);
      } else {
        this.brand_name_extra_filter.splice( this.brand_name_extra_filter.indexOf(event.target.value), 1 );
      }
    } else if(fileterFor=='compaddon' && fileterField=='addontag'){
      if(event.target.checked){
        this.tags_addon_filter.push(event.target.value);
      } else {
        this.tags_addon_filter.splice( this.tags_addon_filter.indexOf(event.target.value), 1 );
      }
    } else if(fileterFor=='compaddon' && fileterField=='make') {
      if(event.target.checked){
        this.brand_name_addon_filter.push(event.target.value);
      } else {
        this.brand_name_addon_filter.splice( this.brand_name_addon_filter.indexOf(event.target.value), 1 );
      }
    }else if(fileterFor=='appliance' && fileterField=='make') {
      if(event.target.checked){
        this.make_appliance_filter.push(event.target.value);
      } else {
        this.make_appliance_filter.splice( this.make_appliance_filter.indexOf(event.target.value), 1 );
    }
   }
   else if(fileterFor=='appliance' && fileterField=='types') {
    if(event.target.checked){
      this.make_appliance_filter_types.push(+event.target.value);
    } else {
      this.make_appliance_filter_types.splice( this.make_appliance_filter_types.indexOf(+event.target.value), 1 );
  }
 }else if(fileterFor=='handle' && fileterField=='make') {
      if(event.target.checked){
        this.make_handle_filter.push(event.target.value);
      } else {
        this.make_handle_filter.splice( this.make_handle_filter.indexOf(event.target.value), 1 );
      }
    
  }else if(fileterFor=='handle' && fileterField=='type') {
    if(event.target.checked){
      this.type_handle_filter.push(event.target.value);
    } else {
      this.type_handle_filter.splice( this.type_handle_filter.indexOf(event.target.value), 1 );
    }

    //
  
}else if(fileterFor=='single' && fileterField=='grouping') {
   
      if(event.target.checked){

       
        $('[name="single"]').prop('checked',true);
        $('[name="combo"]').prop('checked',false);
        $('[name="both"]').prop('checked',false);
        $('#both').prop('checked',false);
        
        
        this.type_extra_filter='single';
      } else {
        $('[name="single"]').prop('checked',false);
        $('[name="combo"]').prop('checked',false);
        $('[name="both"]').prop('checked',false);
        this.type_extra_filter='';
    }
    }else if(fileterFor=='combination' && fileterField=='grouping') {
      
      if(event.target.checked){
        this.type_extra_filter='combination';
        $('[name="single"]').prop('checked',false);
        $('[name="both"]').prop('checked',false);
        $('[name="combo"]').prop('checked',true);
      }else{
        $('[name="single"]').prop('checked',false);
        $('[name="combo"]').prop('checked',false);
        $('[name="both"]').prop('checked',false);
        this.type_extra_filter='';
      
    }
    }
    else if(fileterFor=='both' && fileterField=='grouping') {
      
      
      if(event.target.checked){
        $('[name="both"]').prop('checked',true);
        $('[name="single"]').prop('checked',false);
        $('[name="combo"]').prop('checked',false);
    
        this.type_extra_filter='both'
      } else {
        $('[name="single"]').prop('checked',false);
        $('[name="combo"]').prop('checked',false);
        $('[name="both"]').prop('checked',false);
       this.type_extra_filter=''
    }
  }
  else if(fileterField=='arrivaeSelect') {
    if(event.target.checked){
      this.type_arrivae_select=true
    } else {
     this.type_arrivae_select=false
  }
  }
}

  showAccordion(index){
    var str='#accordion_'+index;
    var str2='#package'+index+' i.fa';
    var str3=".combmoduleAccordionRow"+index;
    $(str).on('shown.bs.collapse', function () {
      $(str3).removeClass('d-none');
      $(str2).removeClass("fa-angle-up").addClass("fa-angle-down");
    });
    $(str).on('hidden.bs.collapse', function () {
      $(str3).addClass('d-none');
      $(str2).removeClass("fa-angle-down").addClass("fa-angle-up");
    });
    // var str='combmoduleAccordionRow'+index;
    // document.getElementById(str).classList.remove('d-none')
  }

  combined_doors;
  getCombinedDoors(){
    this.loaderService.display(true);
    this.quotationService.listCombined_doors().subscribe(
      res=>{
        this.combined_doors = res['combined_doors'];
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  getformArray(form,controls) {
    // //
    return <FormArray>form.controls[controls];
  }
  checkValInFormArray(val,form,controls){
    return (<FormArray>form.controls[controls]).value.includes(val);
  }

  openShadeModal(){}

  getMatchingEdgebandOfShade(shadeid,category,arg?){
    this.loaderService.display(true);
    this.quotationService.getMatchingEdgebandOfShade(shadeid).subscribe(
      res=>{
        if(category=='kitchen' && res){
          this.edgebanding_shade_code_globalVar_MK = res.edge_banding_shade.code;
          this.edgebandingImg = res.edge_banding_shade.shade_image;
        } else if(category=='wardrobe' && res){
          this.edgebanding_shade_code_globalVar_MW = res.edge_banding_shade.code;
          this.edgebandingImgMW = res.edge_banding_shade.shade_image;
        }
        if(arg && res){
          this.addGlobalVariableForm.controls['edge_banding_shade_code'].setValue(res.edge_banding_shade.code);
          this.addGlobalVariableForm.controls['edge_banding_shade_code_img'].setValue(res.edge_banding_shade.shade_image);
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }
  product_notify_message;
  notificationAlert= false;
  product_source = 'catalogue';
  products_catalogue;
  products_arr;
  subsections;
  product_configurations;
  product_details;
  product_variations;
  selectedSpaceForModal;
  boqProducts=[];
  totalAmt=0;
  boqProducts_all=[];
  totalProductCountForAll =0;
  sections;
  selectedSectionsLf = new Array();
  selectedsectionNameLf='all';
  selectedsectionIdLf= 'all';

  setProductSource(val){
    this.product_source = val;
    if(val=='catalogue'){
      this.getCatalogueProducts('all','all',this.selectedSpaceForModal);
    }
    if(val=='project'){
      this.loaderService.display(true);
      this.quotationService.getProductForThisProject(this.projectId).subscribe(
        res=>{
          this.products_catalogue = res;
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        }
       );
    }
  }

  all_activity_service:any = [];
  idToActivityName(id, getval){
    var name;
    var code;
    var default_base_price;
    var installation_price;
    var unit;

    for(let s of this.all_activity_service){
      if(s.id == id){
        name = s.name
        code = s.code
        default_base_price = s.default_base_price
        installation_price = s.installation_price
        unit = s.unit
      }
    }

    if(getval == "name"){
      return name
    }
    else if(getval == "code"){
      return code
    }
    else if(getval == "default_base_price"){
      return default_base_price
    }
    else if(getval == "installation_price"){
      return installation_price
    }
    else if(getval == "unit"){
      return unit
    }

  }

  calculatePrice(base_rate, installation_price, qty){

    return (parseInt(base_rate) + parseInt(installation_price))*parseInt(qty);
  }

  addService(form,space,k3){
    (<HTMLInputElement>document.getElementById('addserviceBtn')).disabled=true;
    
    var service_obj = {
      "id": form.activity,
      "quantity": form.quantity,
      "base_rate": form.base_rate,
      "space": space,
      "service_activity_id":form.activity
    }

    if(service_obj.quantity>0){
    
    this.loaderService.display(true);

    this.boqServices_all.push(service_obj);
    this.boqServices = this.boqServices_all;

    var data = {
      'quotation': {
        'services': this.boqServices_all
      }
    }

    this.quotationService.updateServiceData(this.quotation_id,this.projectId,data).subscribe(
      res=>{
        this.quotationDetails = res.quotation;
        this.boqServices_all =[];
        this.boqServices.length = 0;
        for(var l=0;l<Object.keys(this.quotationDetails.service_jobs).length;l++){
          for(var m=0;m<this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]].length;m++){
            this.boqServices_all.push(this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]][m]);
          }
        }
        this.successMessageShow('Service saved successfully!');
        this.addServiceFormSERV.reset();
        this.addServiceFormSERV.controls['category'].setValue("");
        this.addServiceFormSERV.controls['sub_category'].setValue("");
        this.addServiceFormSERV.controls['activity'].setValue("");
        (<HTMLInputElement>document.getElementById('addserviceBtn')).disabled=false;
        var inputelem ='addServiceFormRowSERV'+k3;
         document.getElementById(inputelem).classList.add('d-none');
        this.loaderService.display(false);
      },
      err=> {
        this.errorMessageShow(JSON.parse(err['_body']).message);
        (<HTMLInputElement>document.getElementById('addserviceBtn')).disabled=false;
        this.loaderService.display(false);
      }
    );
    }
    else{
      this.errorMessageShow("Service jobs quantity must be greater than 0");
    }
  }

  saveService(){
    var data = {
      'quotation': {
        'services': this.boqServices_all
      }
    }
    this.quotationService.updateServiceData(this.quotation_id,this.projectId,data).subscribe(
      res=>{
        this.successMessageShow('Service saved successfully!');
        this.loaderService.display(false);
      },
      err=> {
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  cancelEditService(rowno,mod){
    // $(".service-edit-mode-off-"+i).css("display","block");
    // $(".service-edit-mode-on-"+i).css("display","none");
    var arr = document.getElementsByClassName('serviceLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('serviceLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }

  onQtyChange(i, event)
  {
    var obj;
    for(let j=0; j<this.boqServices_all.length; j++)
    {
      if(j == i)
      {
        obj = this.boqServices_all[j];
        this.boqServices_all.splice(j, 1);
        obj['quantity'] = event.target.value;
        // obj = act;

      }
    }
    this.boqServices_all.push(obj);
  }

  removeServiceToBoqs(i){
    var obj;
    for(let j=0; j<this.boqServices_all.length; j++)
    {
      if(j == i)
      {
        this.boqServices_all.splice(j, 1);

      }
    }
  }

  onBasePriceChange(i, event)
  {
    var obj;
    for(let j=0; j<this.boqServices_all.length; j++)
    {
      if(j == i)
      {
        obj = this.boqServices_all[j];
        this.boqServices_all.splice(j, 1);
        obj['base_rate'] = event.target.value;
        // obj = act;

      }
    }
    this.boqServices_all.push(obj);
  }

  updateService(i){
    
    var obj;
    for(let j=0; j<this.boqServices_all.length; j++)
    {
      if(j == i)
      {
        if(this.editServciceLineQty>0){
          obj = this.boqServices_all[j];
          this.boqServices_all.splice(j, 1);
          obj['base_rate'] = this.editServciceLineBaseRate;
          obj['quantity'] = this.editServciceLineQty;
          
          this.boqServices_all.push(obj);
          var data = {
            'quotation': {
              'services': this.boqServices_all
            }
          }
          this.loaderService.display(true);
          this.quotationService.updateServiceJob(this.quotation_id,this.projectId, data).subscribe(
            res=>{
              this.quotationDetails = res.quotation;
              this.boqServices_all =[];
              this.editServciceLineQty = undefined;
              this.editServciceLineBaseRate = undefined;
              for(var l=0;l<Object.keys(this.quotationDetails.service_jobs).length;l++){
                for(var m=0;m<this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]].length;m++){
                  this.boqServices_all.push(this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]][m]);
                }
              }
              this.successMessageShow('Service updated successfully!');
              $(".service-edit-mode-off-"+i).css("display","block");
              $(".service-edit-mode-on-"+i).css("display","none");
              this.loaderService.display(false);
            },
            err=> {
              this.errorMessageShow(JSON.parse(err['_body']).message);
              this.loaderService.display(false);
            }
          );
        }else{
          this.errorMessageShow("Service jobs quantity must be greater than 0");
        }

      }
    }
    
  }

  editServciceLineQty;
  editServciceLineBaseRate;
  editService(rowno,mod){
    // $(".service-edit-mode-off-"+i).css("display","none");
    // $(".service-edit-mode-on-"+i).css("display","block");
   
    this.editServciceLineQty = mod.quantity;
    this.editServciceLineBaseRate = mod.base_rate;
    var arr = document.getElementsByClassName('serviceLineItemSpan'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('serviceLineItemInput'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  
  }

  service_category:any = [];
  getServiceCategories(k3){
    this.loaderService.display(true);
    this.quotationService.getServiceCategoryList().subscribe(
      res => {
        this.loaderService.display(false);
        this.service_category = res['service_categories'];
        $("#addServiceFormRowSERV"+k3).removeClass("d-none");
        $("#spaceCardSERV"+k3+" h5 button").click();
        this.addServiceFormSERV.controls['base_rate'].enable();
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  service_subcategory:any = [];
  getServiceSubCategory(id){
    this.loaderService.display(true);
    this.quotationService.getServiceSubCategory(id).subscribe(
      res => {
        this.loaderService.display(false);
        this.service_subcategory = res['service_subcategories'];
        this.addServiceFormSERV.controls['sub_category'].setValue("");
        this.addServiceFormSERV.controls['activity'].setValue("");
        this.addServiceFormSERV.controls['base_rate'].setValue(0);
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  chooseActivity(id){
    for(let s_a of this.service_activity){
      if(s_a['id'] == id){
        this.service_activity_unit = s_a['unit'];
        if(s_a['default_base_price']){
          this.addServiceFormSERV.patchValue({base_rate: s_a['default_base_price']});
        } else {
          this.addServiceFormSERV.patchValue({base_rate: 0});
        }
        if(s_a['default_base_price'] !== null){
          this.addServiceFormSERV.controls['base_rate'].enable();
        }else {
          this.addServiceFormSERV.controls['base_rate'].disable();
        }
        this.addServiceFormSERV.patchValue({description: s_a['description']});
      }
    }
  };

  service_activity:any = [];
  getServiceActivity(id = ""){
    this.loaderService.display(true);
    this.quotationService.getServiceActivity(id).subscribe(
      res => {
        this.loaderService.display(false);
        this.service_activity = res['service_activities'];
        this.addServiceFormSERV.controls['activity'].setValue("");
        this.addServiceFormSERV.controls['base_rate'].setValue(0);
      },
      err => {
        this.loaderService.display(false);
      }
    );
    // this.all_activity_service = this.getServiceActivity()
    this.quotationService.getServiceActivity("").subscribe(
      res => {
        this.loaderService.display(false);
        this.all_activity_service = res['service_activities'];
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }


  getCatalogueProducts(sectionName,sectionID,selectedSpace?){
    this.loaderService.display(true);
    this.quotationService.getProductList(sectionID,sectionName).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr = res['section']['products'];
        this.subsections=this.products_catalogue.section.sub_sections;
        this.selectedSpaceForModal = selectedSpace;
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  getCatalogueSubsectionProducts(subsecId,subsecName){
    this.loaderService.display(true);
    this.quotationService.getProductList(subsecId,subsecName).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr = res['section']['products'];
        this.product_configurations = res['section']['product_configurations'];
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  getCatalogueConfigurationProducts(configId,configName,sectionId){
    this.loaderService.display(true);
    this.quotationService.getProductForConfiguration(sectionId,configId).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr= res['product_configuration']['products'];
        //this.product_configurations = res['section']['product_configurations'];
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  master_options:any = [];
  autoselect:any = false;
  smallerImage;
  biggerImage1;
  biggerImage;
  arroWShow:boolean = true;
  dotsShow:boolean = true;
  itemMedium:any = [];
  viewmoreProductDetails(productId,secId){
    this.autoselect = true;
    this.resetVariations();
    this.selectedIndex = 0;
    this.selectedIndexChange = 0;
    document.getElementById('viewproductRow').style.display = 'block';
    document.getElementById('allproductsRow').style.display = 'none';
    this.quotationService.viewProduct(productId,secId).subscribe(
      res =>{
        this.product_details = res.product;
        this.product_variations = this.product_details.variations;
         this.itemsList = res.product.all_image_urls;
        this.biggerImage = this.itemsList[0].medium;
        this.biggerImage1 = this.itemsList[0].medium;
        this.smallerImage = this.itemsList[0].thumbnail;
        for(var i = this.itemsList.length - 1; i >= 0;i--){
          this.itemMedium.push(this.itemsList[i]);

        }
     
        this.loaderService.display(false);
       
        if(this.itemsList.length == 1){
          this.arroWShow = false;
          this.dotsShow = false
          
          

        }
        else{
          this.arroWShow = true;
          this.dotsShow = true;
         

        }
        
      },
      err => {
      }
    );
    this.quotationService.listMasterOptions(productId).subscribe(
      res => {
        this.master_options = res;
        if(this.master_options.length > 0){
          this.quotationService.listSubOptions(this.master_options[0].id).subscribe(
            res => {
              this.sub_options = res;
              if(this.sub_options.length>0){
                this.quotationService.listCatalogueOptions(this.sub_options[0].id).subscribe(
                  res => {
                    this.catalogue_options = res;
                    if(this.catalogue_options.length>0){
                      this.quotationService.listVariations(this.catalogue_options[0].id).subscribe(
                        res => {
                          this.variations = res;
                          if(this.variations.length > 0){
                            this.modalQuantityandProductSelectionForm.patchValue({product_variant_id: this.variations[0].attributes.id});
                          }
                        },
                        err => {
                          
                        });
                    }
                  },
                  err => {
                    
                  });
              }
            },
            err => {
              
            });
        }
        

      },
      err => {
        
      });
  }

  selectVariation(variation_id){
    $('.variation-img-container').removeClass("active");
    $('.variation-img-container-'+variation_id).addClass("active");
    $("#fabricModal").modal("hide")
    this.editProductLineItemVariation = variation_id
    this.modalQuantityandProductSelectionForm.patchValue({product_variant_id: variation_id});
  }

  showVariationDetails(val){
    this.product_details = val;
  }

  backToProducts(){
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    this.product_details = undefined;
    this.product_variations = undefined
    this.count = 0;
  }

  closeModal(){
   // this.getproductsOfSection('all','all');
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    this.subsections = undefined;
    this.product_configurations = undefined;
    this.product_details = undefined;
    this.product_variations = undefined;
    this.selectedSpaceForModal = undefined;
    this.product_source = 'catalogue';
    this.search_string="";
    this.checked_minimum_price = "";
    this.checked_maximum_price = "";
    this.checked_minimum_height = "";
    this.checked_maximum_height = "";
    this.checked_minimum_lead_time = "";
    this.checked_maximum_lead_time= "";
    this.checked_minimum_length = "";
    this.checked_maximum_length = "";
    this.checked_minimum_width = "";
    this.checked_maximum_width = "";
    this.checked_materials = [];
    this.checked_colors = [];
    this.checked_finishes = [];
    this.checked_subcategories = [];
    this.subcategories_list = [];
    this.checked_categories = [];
    this.categories_list = [];
    this.checked_spaces = [];
    this.checked_ranges = [];
    this.all_minimum_lead_time=undefined;
    this.all_maximum_lead_time=undefined;
    this.selectedSpacesLooseFurArr = new Array();
    this.selectedCategoriesLooseFurArr = new Array();
    this.selectedSubCategoriesLooseFurArr = new Array();
    this.selectedRangesArr=new Array();
    // $('#addProductModal').modal('hide');
  }

  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sections = res.sections;
        for(var p=0;p<this.sections.length; p++){
          this.totalProductCountForAll = this.totalProductCountForAll+this.sections[p].count;
        }
        for(var k=0; k<res.projects.length;k++){
          if(res.projects[k].id==this.projectId){
            this.pname = res.projects[k].name;
            break;
          }
        }
      },
      err=>{
      }
    );
  }

  getproductsOfSection(status,id){
    this.selectedsectionNameLf = status;
    this.selectedsectionIdLf = id;
    if(this.selectedsectionNameLf=='all'){
      this.boqProducts = this.boqProducts_all;
    } else {
      var arr = new Array();
      for(var k=0; k<this.boqProducts_all.length; k++){
        if(this.boqProducts_all[k].section_id == id){
          arr.push(this.boqProducts_all[k]);
        }
      }
      this.boqProducts = arr;
    }
  }

  fetchMasterOption(productId){
    this.quotationService.listMasterOptions(productId).subscribe(
      res => {
       
        this.master_options = res;
        $("#fabricModal").modal("show");
      },
      err => {
        
      });
  }

  sub_options:any= [];
  fetchSubOption(event){
    
    this.sub_options=[];
    this.quotationService.listSubOptions(event.target.value).subscribe(
      res => {
        
        this.sub_options = res;
        this.catalogue_options= [];
        this.variations = [];
      },
      err => {
        
      });
  }

  catalogue_options:any= [];
  fetchModalCatalogueOption(event){
   
    this.autoselect = false;
    this.catalogue_options= [];
    this.quotationService.listCatalogueOptions(event.target.value).subscribe(
      res => {
       
        this.catalogue_options = res;
        this.variations = [];
      },
      err => {
        
      });
  }

  variations:any= [];
  fetchModalVariation(event){
  
    this.variations = [];
    this.quotationService.listVariations(event.target.value).subscribe(
      res => {
        
        this.variations = res;
      },
      err => {
        
      });
  }

  addProductToBoqs(product,quantity){
    if(quantity.productQty>0){
      product['quantity'] = quantity.productQty;
      product['space']=this.selectedSpaceForModal;
      if(quantity.product_variant_id){
        product['product_variant_id']=quantity.product_variant_id;
      }
      else{
        product['product_variant_id'] = null
      }
      this.product_notify_message = product.name + ' has been added';
      $("#addProductModal").modal("hide");
      this.loaderService.display(true);
      var obj = {
        'product':{
          id:product.id,
          quantity:product.quantity,
          space:this.selectedSpaceForModal,
          product_variant_id: product.product_variant_id
        }
      };
      this.quotationService.addboqJobToSpace(this.projectId,this.quotation_id,obj).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          // this.generateBoqProductArr();
          this.loaderService.display(false);
          this.product_notify_message = product.name + ' has been added';
          this.modalQuantityandProductSelectionForm.reset();
          this.modalQuantityandProductSelectionForm.controls['productQty'].setValue(1);
          this.sub_options=[];
          this.catalogue_options=[];
          this.variations=[];
          this.editProductLineItemVariation = null;
          this.modalQuantityandProductSelectionForm.patchValue({product_variant_id: null});

          this.notificationAlert = true;
          setTimeout(function() {
            this.notificationAlert = false;
          }.bind(this), 10000);
          this.backToProducts();
        },
        err=>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
    else{
      this.errorMessageShow("Quantity should be greater than 0");
    }
    
  }

  removeProductToBoqs(productid,productname,space){
    if(confirm('Are you sure you want to delete this product?')==true){
      this.loaderService.display(true);
      var obj ={
        ids: [productid]
      };
      this.quotationService.deleteboqJobToSpace(this.projectId,this.quotation_id,obj).subscribe(
        res=>{
            this.quotationDetails = res.quotation;
            // this.generateBoqProductArr();
            this.product_notify_message = productname + ' has been removed';
            this.notificationAlert = true;
            setTimeout(function() {
              this.notificationAlert = false;
            }.bind(this), 10000);
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  ngAfterViewInit() {
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
 })
 $('[name="${idRef}"]')[0].checked=true;
 
    this.boqProducts_all = JSON.parse(localStorage.getItem('boqAddedProducts'));
    if(this.boqProducts_all == null){
      this.boqProducts= new Array();
      this.boqProducts_all = new Array();
    } else {
      this.boqProducts = this.boqProducts_all;
      this.boqProducts_all = this.boqProducts_all;
    }
  }

  getTotalOfLfSpaces(space,index){
    var str ='spacesLfTotal'+index;
    document.getElementById(str).innerText = '0';
    if(this.boqProducts){
      for(var v=0;v<this.boqProducts.length;v++){
        if(this.boqProducts[v].space==space){
          document.getElementById(str).innerText = (parseFloat(document.getElementById(str).innerText) + (this.boqProducts[v]['quantity']*this.boqProducts[v]['sale_price']))+'';
        }
      }
    }
  }

  getTotalOfSERVSpaces(space,index){
    var str ='spacesSERVTotal'+index;
    document.getElementById(str).innerText = '0';
    if(this.boqServices_all){
      for(var v=0;v<this.boqServices_all.length;v++){
        if(this.boqServices_all[v].space==space){
          document.getElementById(str).innerText = (parseFloat(document.getElementById(str).innerText) + (this.boqServices_all[v]['quantity']*this.boqServices_all[v]['sale_price']))+'';
        }
      }
    }
  }

  getBoqTotalAmt(){
    var totalAmt = this.quotationDetails.total_amount;
    // if(this.boqProducts){
    //   for(var v=0;v<this.boqProducts.length;v++){
    //     totalAmt = totalAmt+(this.boqProducts[v]['quantity']*this.boqProducts[v]['sale_price']);
    //   }
    // } else {
    // }
    return totalAmt;
  }

  addon_brandlist=[];
  addon_brandlist_for_addons=[];
  [key:string]:any;

  getBrandForAddon(addonid,category,i,type){
    this.loaderService.display(true);
    //'addon_brandlist'+i;
    if(type=='addonforaddon'){
      this.addon_brandlist_for_addons[i]=[];
    }else if(type=='compaddon') {
      this.addon_brandlist[i]=[];
    }

    this.quotationService.getBrandForAddon(addonid,category).subscribe(
      res=>{;
        if(type=='addonforaddon'){
          this.addon_brandlist_for_addons[i]=res.brands;
        } else if(type=='compaddon'){
          this.addon_brandlist[i]=res.brands;
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  getVarName(varname,index,index2){
    var str1='addon_brandlist_for_addons'+index+'_'+index2;
    return this[str1];
  }

  setAddonImage(val,i){
    for(var k6=0;k6<this.compulsoryAddonsList.length;k6++){
      if(val==this.compulsoryAddonsList[k6].id){
       this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[i]['controls'].image.setValue(this.compulsoryAddonsList[k6].addon_image);
        break;
      }
    }

  }

  updateAndApplyBoqGlobalConfig(ind?,Id?,category?){
    this.loaderService.display(true);
    var obj;
    var i1=ind;
    if(category=='wardrobe'){
      obj = {
        'boq_global_config' : {
          'quotation_id':this.quotation_id,
          'core_material':this.core_material_globalVar_MW,
          'shutter_material':this.shutter_material_globalVar_MW,
          'shutter_finish':this.shutter_finish_globalVar_MW,
          'shutter_shade_code':(this.shutter_shade_code_globalVar_MW!='customshadecode')?this.shutter_shade_code_globalVar_MW:this.shutter_custshade_code_globalVar_MW,
          'edge_banding_shade_code':(this.edgebanding_shade_code_globalVar_MW!='customedgebanshadecode')?this.edgebanding_shade_code_globalVar_MW:this.edgebanding_custshade_code_globalVar_MW,
          'door_handle_code': this.door_handle_code_globalVar_MW,
          'shutter_handle_code':this.shutter_handle_code_globalVar_MW,
          'hinge_type': this.hinge_type_globalVar_MW,
          'channel_type':this.channel_type_globalVar_MW,
          'brand_id':this.hardware_brand_globalVar_MW,
          'category':'wardrobe'
        }
      }
    } else if(category=='kitchen'){
      obj = {
        'boq_global_config' : {
          'quotation_id':this.quotation_id,
          'core_material':this.core_material_globalVar_MK,
          'shutter_material':this.shutter_material_globalVar_MK,
          'shutter_finish':this.shutter_finish_globalVar_MK,
          'shutter_shade_code':(this.shutter_shade_code_globalVar_MK!='customshadecode')?this.shutter_shade_code_globalVar_MK:this.shutter_custshade_code_globalVar_MK,
          'edge_banding_shade_code':(this.edgebanding_shade_code_globalVar_MK!='customedgebanshadecode')?this.edgebanding_shade_code_globalVar_MK:this.edgebanding_custshade_code_globalVar_MK,
          'door_handle_code': this.door_handle_code_globalVar_MK,
          'skirting_config_height':this.skirting_con_height_globalVar_MK,
          'skirting_config_type':this.skirting_con_type_globalVar_MK,
          // 'shutter_handle_code':this.shutter_handle_code_globalVar_MW,
          'hinge_type': this.hinge_type_globalVar_MK,
          'channel_type':this.channel_type_globalVar_MK,
          'brand_id':this.hardware_brand_globalVar_MK,
          'countertop':this.countertop_globalVar_MK,
          'civil_kitchen':this.typeofkitchen_globalVar_MK,
          'category':'kitchen'
        }
      }
      if(obj.boq_global_config.civil_kitchen){
        obj['boq_global_config']['civil_kitchen_parameter_attributes'] =  {
            'depth': this.depthofcivilKit_globalVar_MK,
            'drawer_height_1':this.drawerheight1ofcivilKit_globalVar_MK,
            'drawer_height_2':this.drawerheight2ofcivilKit_globalVar_MK,
            'drawer_height_3':this.drawerheight3ofcivilKit_globalVar_MK
          }
      }
    }
    this.quotationService.updateAndApplyBoqGlobalConfig(obj,Id).subscribe(
      res => {
        if(res.boq_global_config.category=='wardrobe'){
          this.shadeImgMW = undefined;
        } else if(res.boq_global_config.category=='kitchen'){
          this.shadeImg = undefined;
        }
        var arr = document.getElementsByClassName('editRowSpan');
        for(var i=0;i<arr.length;i++){
          arr[i].classList.remove('d-none');
        }
        arr =document.getElementsByClassName('editRowInput');
        for(var i=0;i<arr.length;i++){
          arr[i].classList.add('d-none');
        }
        this.getBoqConfig(category);
        this.viewQuotationDetails();
        this.successMessageShow('Updated and applied successfully!') ;
        this.arrivaeSelectValues=false;
        this.loaderService.display(false);
      },
      err => {
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  changeCustomElemImage(val){
    this.addCustomElemForm.controls['image'].setValue(JSON.parse(val).photo);
  }


  handlelistForKitchen;
  getHandleList(shutterfin_id,product_module_id?){
    this.loaderService.display(true);
    this.quotationService.getHandleList(shutterfin_id,product_module_id).subscribe(
      res=>{
        this.handlelistForKitchen= res['handles'];
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  getJson(val){
    if(val){
      return JSON.parse(val);
    }
    return val;
  }

  showCountertopLengthForm(){
    document.getElementById('countertopLengthForm').classList.remove('d-none');
    document.getElementById('countertopLenChangeBtn').classList.add('d-none');
  }
  hideCountertopLengthForm(){
     document.getElementById('countertopLengthForm').classList.add('d-none');
     document.getElementById('countertopLenChangeBtn').classList.remove('d-none');
  }

  changeCountertopLenSubmit(val){
    this.loaderService.display(true);
    var obj= {
      'boq_global_config' : {
        'countertop_width':val
      }
    }
    this.quotationService.updateBoqGlobalConfig(obj,this.boqConfigMKVal.id).subscribe(
      res => {
        this.hideCountertopLengthForm();
        this.viewQuotationDetails();
        this.successMessageShow('Length changed successfully!');
        this.countertop_width_globalVar_MK="";
        this.loaderService.display(false);
      },
      err => {
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }


  listofAddonsForAddons=[];
  getListofAddonsForAddons(addonid,addonType,slotname,index){
    this.showNext=true;
    this.slotindex = index;
    this.slotnameForAddon = slotname;
    this.listofAddonsForAddons[index]=[];
    this.min_price_addon_filter = this.fromval_slider;
    this.max_price_addon_filter = this.toval_slider;
    var filterObj= {
      tags:this.tags_addon_filter,
      brand_name:this.brand_name_addon_filter,
      minimum_price:this.min_price_addon_filter,
      maximum_price:this.max_price_addon_filter,
      addon_type:this.type_extra_filter,
      arrivae_select: this.type_arrivae_select
    }
    this.loaderService.display(true);
    this.quotationService.getListofAddonsForAddons(addonid,addonType,this.customizationModule_MK_details.product_module_id,
      slotname,filterObj,this.search_string_addon_filter,this.pageno_addon)
    .subscribe(
      res =>{
        this.listofAddonsForAddons[index] = res.addons;
        this.compulsoryaddonsArr = res.addons;
        this.loaderService.display(false);
        // this.search_string_addon_filter="";
        if(this.compulsoryaddonsArr.length==0 && this.pageno_addon!=0){
          this.pageno_addon=0;
          this.quotationService.getListofAddonsForAddons(addonid,addonType,this.customizationModule_MK_details.product_module_id,
            slotname,filterObj,this.search_string_addon_filter,this.pageno_addon)
          .subscribe(
            res =>{
              this.listofAddonsForAddons[index] = res.addons;
              this.compulsoryaddonsArr = res.addons;
              this.loaderService.display(false);
              
            },
            err =>{
              this.errorMessageShow(JSON.parse(err['_body']).message);
              this.loaderService.display(false);
            }
          );
        }
        else if(this.compulsoryaddonsArr.length==15){
         
          this.quotationService.getListofAddonsForAddons(addonid,addonType,this.customizationModule_MK_details.product_module_id,
            slotname,filterObj,this.search_string_addon_filter,this.pageno_addon+1)
          .subscribe(
            res =>{
              if(res.addons.length==0){
                this.showNext=false;
              }
              this.loaderService.display(false);
            },
            err =>{
              this.errorMessageShow(JSON.parse(err['_body']).message);
              this.loaderService.display(false);
            }
          );
        }
        else{
          this.showNext=false;
        }
      },
      err =>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  onCheckChange2(event,formtype) {
    var formArray: FormArray
      if(formtype=='deletesection'){
        formArray = this.deleteSectionToBoqForm.get('sections') as FormArray;
      } else if(formtype=='addsection'){
        formArray = this.addSectionToBoqForm.get('sections') as FormArray;
      }

    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  submitAddSectionForm(formval){
    for(var i=0;i<this.selectedSections.length;i++){
      formval.sections.push(this.selectedSections[i]);
    }
    localStorage.setItem('selected_sections',JSON.stringify(formval.sections));
    $('#addsectionmodal').modal('hide');
    this.addSectionToBoqForm.reset();
    (<FormArray>this.addSectionToBoqForm.controls['sections']).controls = [];
    this.getSelectedSections();
  }

  submitdeleteSectionForm(formval){
    this.loaderService.display(true);
    var deleteCategoryArr = [];
    if(formval.sections.includes('modular_kitchen')){
      deleteCategoryArr.push('kitchen');
      this.selectedSections.splice( this.selectedSections.indexOf('modular_kitchen'), 1 );
      this.boqConfigMKVal = undefined;
    }
    if(formval.sections.includes('modular_wardrobe')){
      deleteCategoryArr.push('wardrobe');
      this.selectedSections.splice( this.selectedSections.indexOf('modular_wardrobe'), 1 );
      this.boqConfigMWVal = undefined;
    }
    if(formval.sections.includes('loose_furniture')){
      deleteCategoryArr.push('loose_furniture');
      this.selectedSections.splice( this.selectedSections.indexOf('loose_furniture'), 1 );
    }
    if(formval.sections.includes('services')){
      deleteCategoryArr.push('services');
      this.selectedSections.splice( this.selectedSections.indexOf('services'), 1 );
    }
    if(formval.sections.includes('custom_elements')){
      deleteCategoryArr.push('custom_jobs');
      this.selectedSections.splice( this.selectedSections.indexOf('custom_elements'), 1 );
    }
    if(formval.sections.includes('custom_furniture')){
      deleteCategoryArr.push('custom_furniture');
      this.selectedSections.splice( this.selectedSections.indexOf('custom_furniture'), 1 );
      this.selectedSpacesArrCf = [];
    }
    localStorage.setItem('selected_sections',JSON.stringify(this.selectedSections));
    this.quotationService.deleteSectionFromBoq(this.projectId,this.quotation_id,deleteCategoryArr).subscribe(
      res=>{
        this.viewQuotationDetails();
        this.successMessageShow('Section successfully deleted!');
        $('#deletesectionmodal').modal('hide');
        this.deleteSectionToBoqForm.reset();
        this.getSelectedSections();
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
  object = Object;

  removeoptionalAddonsForAddon(index){
    var addonsarr = this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[index]['controls'].addons_for_addons;
    for(var m=0;m<addonsarr.controls.length;m++){
      addonsarr.removeAt(m);
    }
    addonsarr.controls=[];
  }

  fromval_slider = 0;
  toval_slider = 300000;

  update(slider, event) {
    slider.onUpdate = event;
    this.fromval_slider = slider.onUpdate.from;
    this.toval_slider = slider.onUpdate.to;
  }

  finish(slider, event) {
    slider.onFinish = event;
  }

  setAdvancedSliderTo(from, to) {
    this.advancedSliderElement.update({from: from, to:to});
  }

  changeSliderValue(ifor, value){
    if(ifor == "from"){
      this.fromval_slider = value;
      
      this.advancedSlider.onUpdate.from = this.fromval_slider;
    }
    else if(ifor == "to"){
      this.toval_slider = value;
      
      this.advancedSlider.onUpdate.to = this.toval_slider;
    }
  }

  servicejobDelete(id){
    if(confirm('Are you sure you want to delete this service?')==true){
      this.loaderService.display(true);
      var obj={
        ids: [id]
      }
      this.quotationService.deleteServicejobToSpace(this.projectId,this.quotation_id,obj).subscribe(
        res=>{
          this.quotationDetails = res.quotation;
          this.boqServices_all =[];
          // this.boqServices.length = 0;
          for(var l=0;l<Object.keys(this.quotationDetails.service_jobs).length;l++){
            for(var m=0;m<this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]].length;m++){
              this.boqServices_all.push(this.quotationDetails.service_jobs[Object.keys(this.quotationDetails.service_jobs)[l]][m]);
            }
          }
          this.successMessageShow('Service deleted and Boq updated successfully!');
          this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
  }

  closeoptionalAddonModal(category){
    $("#addoptionalAddonModal").modal('hide')
    if(category=='kitchen'){
      $("#customizationModalMk").css({"overflow-y": "auto"});
    } else if(category=='wardrobe'){
      $("#customizationModal").css({"overflow-y": "auto"});
    }
    this.optaddoncategory = undefined;
    this.slotnameForAddon=undefined;
    this.slotindex = undefined;
    this.tags_addon_filter=[];
    this.brand_name_addon_filter=[];
    this.min_price_addon_filter=0;
    this.max_price_addon_filter=500000;
    this.search_string_addon_filter="";
    this.pageno_addon=1;
    this.toval_slider = 300000;
    this.fromval_slider = 0;
    this.type_arrivae_select = false;
    this.addAddon_for_addon_FormMk.controls['qty'].setValue("");
    this.ref.detectChanges();
  }

  addonModalType;
  openAddAddonModal(modalFor){
    $("#addAddonModal").modal('show');
    this.addonModalType = modalFor;
    
  }

  addAddonforaddon_new(addon,formval,index,i){
   

    var obj;
    var elem= (<HTMLInputElement>document.getElementById('addonforaddonqtyinput_'+i)).value;
    if(this.addAddon_for_addon_FormMk.controls['qty'].value !='' &&  elem !=''){
      if(addon.combo_name){
        obj={
          'id': addon.id,
          'name': addon.combo_name,
          'quantity': formval.qty,
          'addons': addon.included_addons,
          'combination': true,
          'included_mrp':addon.included_mrp
        }
      }
      else{
        obj = {
          'id':addon.id,
          'name':addon.name,
          'quantity':formval.qty,
          'addon_image':addon.addon_image,
        }
      }
      this.addAddonForAddons(obj,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[index]['controls'],index)
      this.closeAddAddonModal();
      this.addAddon_for_addon_FormMk.reset();
    } else {
      this.errorMessageShow('Quantity is required');
    }
  }
  
  optaddoncategory;
  getOptionalAddons(category){
   
    this.showNext=true;
    this.optaddoncategory = category;
    var productmod_id;
    if(category=='wardrobe'){
      productmod_id = this.customizationModule_MW_details.product_module_id;
    } else if(category=='kitchen'){
      productmod_id = this.customizationModule_MK_details.product_module_id;
    }
   
    this.min_price_addon_filter = this.fromval_slider;
    this.max_price_addon_filter = this.toval_slider;
    var filterObj= {
      tags:this.tags_addon_filter,
      brand_name:this.brand_name_addon_filter,
      minimum_price:this.min_price_addon_filter,
      maximum_price:this.max_price_addon_filter,
      addon_type:this.type_extra_filter,
      arrivae_select: this.type_arrivae_select
    }
    this.loaderService.display(true);
    this.quotationService.getOptionalAddons(category,productmod_id,filterObj,this.search_string_addon_filter,this.pageno_addon)
    .subscribe(
      res=>{
        this.compulsoryaddonsArr=res.addons;
        this.loaderService.display(false);
        // this.search_string_addon_filter="";
        
        if(this.compulsoryaddonsArr.length==15){
          this.quotationService.getOptionalAddons(category,productmod_id,filterObj,this.search_string_addon_filter,this.pageno_addon+1)
            .subscribe(
              res=>{
                if(res.addons.length==0){
                  this.showNext=false
                }
                this.loaderService.display(false);
              },
              err=>{
               this.loaderService.display(false);
              }
            );
        }
        else if(this.compulsoryaddonsArr.length==0 && this.pageno_addon!=0){
          this.pageno_addon=0
          this.quotationService.getOptionalAddons(category,productmod_id,filterObj,this.search_string_addon_filter,this.pageno_addon)
            .subscribe(
              res=>{
                this.compulsoryaddonsArr=res.addons;
                this.loaderService.display(false);
                
              },
              err=>{
                this.loaderService.display(false);
              }
            );
        }else{
          this.showNext=false;
        }
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }


  addoptionaladdon_new(addon,formval,i,category){
    
    var obj;
    var elem= (<HTMLInputElement>document.getElementById('optionaladdonqtyinput_'+i)).value;
    if(this.addAddon_for_addon_FormMk.controls['qty'].value !='' &&  elem !=''){
      if(addon.combo_name){
        
        obj={
          'id': addon.id,
          'name': addon.combo_name,
          'quantity': formval.qty,
          'addons': addon.included_addons,
          'combination': true,
          'included_mrp':addon.included_mrp
        }
      }
      else{
        obj = {
          'id':addon.id,
          'name':addon.name,
          'quantity':formval.qty,
          'addon_image':addon.addon_image,
          'combination':false
        }
      }
      if(category=='wardrobe'){
        this.addNestedAddons(obj);
        this.closeoptionalAddonModal('wardrobe');
      } else if(category=='kitchen'){
        this.addNestedAddonsMk(obj);
        this.closeoptionalAddonModal('kitchen');
      }
      // 
      this.addAddon_for_addon_FormMk.reset();
    } else {
      this.errorMessageShow('Quantity is required');
    }
  }

  
  isCombination=false;

  addCompAddon(val,index,slotindex){
    
    if(val.combo_name){
     
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].id.setValue(val.id);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].name.setValue(val.combo_name);
      // this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].image.setValue(val.included_addons[0].addon_image);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].addons.setValue(val.included_addons);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].combination.setValue(true);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].included_mrp.setValue(val.included_mrp);
      
      this.ref.detectChanges()

      
    }else{
      
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].id.setValue(val.id);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].name.setValue(val.name);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].image.setValue(val.addon_image);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].combination.setValue(false);
      this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].addons.setValue(null);
     
      this.ref.detectChanges();

    }
    $('#addAddonModal').modal('hide');
    $("#customizationModalMk").css({"overflow-y": "auto"});
    this.search_string_addon_filter="";
 
  }

  compulsoryaddonsArr;
  slotnameForAddon;
  slotindex;
  getCompulsoryAddons(productmodid,slotname,slotindex){
    this.showNext=true;
    this.loaderService.display(true);
    this.slotnameForAddon = slotname;
    this.slotindex = slotindex;
    this.min_price_addon_filter = this.fromval_slider;
    this.max_price_addon_filter = this.toval_slider;
    var filterObj= {
      tags:this.tags_addon_filter,
      brand_name:this.brand_name_addon_filter,
      minimum_price:this.min_price_addon_filter,
      maximum_price:this.max_price_addon_filter,
      addon_type:this.type_extra_filter,
      arrivae_select: this.type_arrivae_select
    }
   
    
    this.quotationService.getCompulsoryAddons(filterObj,this.search_string_addon_filter,this.pageno_addon,productmodid,slotname).subscribe(
      res=>{
        this.compulsoryaddonsArr=res.addons;
        this.loaderService.display(false);
        // this.search_string_addon_filter="";
        if(this.compulsoryaddonsArr.length==0 && this.pageno_addon!=0){
          this.pageno_addon=0;
          this.quotationService.getCompulsoryAddons(filterObj,this.search_string_addon_filter,this.pageno_addon,productmodid,slotname).subscribe(
            res=>{
              this.compulsoryaddonsArr=res.addons;
              this.loaderService.display(false);
              
            },
            err=>{
              this.loaderService.display(false);
            }
          );
        }else if(this.compulsoryaddonsArr.length==15){
          this.quotationService.getCompulsoryAddons(filterObj,this.search_string_addon_filter,this.pageno_addon+1,productmodid,slotname).subscribe(
            res=>{
              
              if(res.addons.length==0){
                this.showNext=false;
              }
              this.loaderService.display(false);
            },
            err=>{
              this.loaderService.display(false);
            }
          );
        }else{
          this.showNext=false;
        }
      },
      err=>{
        this.loaderService.display(false);
      }
    );

    
  }

  selectedSpacesLooseFurArr = new Array();
  selectedCategoriesLooseFurArr = new Array();
  selectedSubCategoriesLooseFurArr = new Array();
  selectedRangesArr=new Array();
  spaces_list:any = [];
  @ViewChild('priceSliderElement') priceSliderElement: IonRangeSliderComponent;
  @ViewChild('widthSliderElement') widthSliderElement: IonRangeSliderComponent;
  @ViewChild('depthSliderElement') depthSliderElement: IonRangeSliderComponent;
  @ViewChild('heightSliderElement') heightSliderElement: IonRangeSliderComponent;
  @ViewChild('leadtimeSliderElement') leadtimeSliderElement: IonRangeSliderComponent;

  ranges_list:any = [];
  fetchAllRanges(){
    this.loaderService.display(true);
    this.catalogueService.fetchAllRanges().subscribe(
      res => {
        this.ranges_list = res.tags;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_ranges:any = [];
  checkRanges(event){
    if(event.target.checked == true){
      this.checked_ranges.push(JSON.parse(event.target.value).id);
      this.selectedRangesArr.push(JSON.parse(event.target.value))
    }
    else{
      var index = this.checked_ranges.indexOf(JSON.parse(event.target.value).id);
      if (index > -1) {
        this.checked_ranges.splice(index, 1);
      }
      var j:number = 0;
      this.selectedRangesArr.forEach((ctr) => {
        if(ctr.id == JSON.parse(event.target.value).id) {
          this.selectedRangesArr.splice(j, 1);
          return;
        }
        j++;
      });
    }

    // this.fetchCategories();
  }

  fetchAllSpaces(){
    this.loaderService.display(true);
    this.catalogueService.fetchAllSpaces().subscribe(
      res => {
        this.spaces_list = res.tags;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_spaces:any = [];
  checkSpaces(event){
    if(event.target.checked == true){
      this.checked_spaces.push(JSON.parse(event.target.value).id);
      this.selectedSpacesLooseFurArr.push(JSON.parse(event.target.value));
      this.uncheckCategories();
    }
    else{
      var index = this.checked_spaces.indexOf(JSON.parse(event.target.value).id);
      if (index > -1) {
        this.checked_spaces.splice(index, 1);
      }
      var j:number = 0;
      this.selectedSpacesLooseFurArr.forEach((ctr) => {
        if(ctr.id == JSON.parse(event.target.value).id) {
          this.selectedSpacesLooseFurArr.splice(j, 1);
          return;
        }
        j++;
      });
      this.uncheckCategories();
    }

    this.fetchCategories();
  }

  categories_list:any = [];
  fetchCategories(){
    this.subcategories_list=[];
    this.loaderService.display(true);
    this.catalogueService.fetchCategories(JSON.stringify(this.checked_spaces)).subscribe(
      res => {
        this.categories_list = res.sections;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_categories:any = [];
  checkCategory(event){
    if(event.target.checked == true){
      this.checked_categories.push(JSON.parse(event.target.value).id);
      this.selectedCategoriesLooseFurArr.push(JSON.parse(event.target.value));
      this.unchecksubCategories();
    }
    else{
      var index = this.checked_categories.indexOf(JSON.parse(event.target.value).id);
      if (index > -1) {
        this.checked_categories.splice(index, 1);
      }
      var j:number = 0;
      this.selectedCategoriesLooseFurArr.forEach((ctr) => {
        if(ctr.id == JSON.parse(event.target.value).id) {
          this.selectedCategoriesLooseFurArr.splice(j, 1);
          return;
        }
        j++;
      });
      this.unchecksubCategories();
    }

    this.fetchSubCategories();
  }

  uncheckCategories(){
    var j:number = 0;
    this.selectedCategoriesLooseFurArr.forEach((ctr) => {
      if(this.containsAny_Array(this.checked_spaces,ctr.space_ids)){
      } else {
        this.selectedCategoriesLooseFurArr.splice(j, 1);
        var index = this.checked_categories.indexOf(ctr.id);
        if (index > -1) {
          this.checked_categories.splice(index, 1);
        }
      }
      j++;
      this.unchecksubCategories();
    });
  }

  unchecksubCategories(){
    var updatedSelectedSubCategoriesArr = [];
    for(var k=0;k<this.selectedSubCategoriesLooseFurArr.length;k++){
      if(this.containsAny_Array(this.checked_categories,this.selectedSubCategoriesLooseFurArr[k].category_ids)){
        updatedSelectedSubCategoriesArr.push(this.selectedSubCategoriesLooseFurArr[k]);
      } 
      else{
        var config=this.selectedSubCategoriesLooseFurArr[k].configuration;
        var index = this.checked_subcategories.indexOf(this.selectedSubCategoriesLooseFurArr[k].configuration);
        if (index > -1) {
          this.checked_subcategories.splice(index, 1);
        }
      }
    }
    this.selectedSubCategoriesLooseFurArr = updatedSelectedSubCategoriesArr;
  }

  containsAny_Array(source,target)
  {
    var result = source.filter(function(item){ return target.indexOf(item) > -1});   
    return (result.length > 0);  
  }

  subcategories_list:any = [];
  fetchSubCategories(){
    this.loaderService.display(true);
    this.catalogueService.fetchSubCategories(JSON.stringify(this.checked_categories),
      JSON.stringify(this.checked_spaces)).subscribe(
      res => {
        this.subcategories_list = res.configurations;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_subcategories:any = [];
  checkSubCategory(event){
    if(event.target.checked == true){
      this.checked_subcategories.push(JSON.parse(event.target.value).configuration);
      this.selectedSubCategoriesLooseFurArr.push(JSON.parse(event.target.value));
    }
    else{
      var index = this.checked_subcategories.indexOf(JSON.parse(event.target.value).configuration);
      if (index > -1) {
        this.checked_subcategories.splice(index, 1);
      }

      var j:number = 0;
      this.selectedSubCategoriesLooseFurArr.forEach((ctr) => {
        if(ctr.configuration == JSON.parse(event.target.value).configuration) {
          this.selectedSubCategoriesLooseFurArr.splice(j, 1);
          return;
        }
        j++;
      });
    }

    // this.fetchSubCategories();
  }


  products_list:any = [];
  headers_res;
  per_page;
  total_page;
  current_page;
  fetchAllProducts(page?){
    this.loaderService.display(true);
    this.catalogueService.fetchAllProducts(page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.products_list = res.products;
       
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  all_minimum_price:any;
  all_maximum_price:any;
  all_minimum_height:any;
  all_maximum_height:any;
  all_minimum_lead_time:any;
  all_maximum_lead_time:any;
  all_minimum_length:any;
  all_maximum_length:any;
  all_minimum_width:any;
  all_maximum_width:any;

  fetchSliderValues(){
    this.loaderService.display(true);
    this.all_maximum_lead_time = undefined;
    this.all_minimum_lead_time = undefined;
    this.catalogueService.fetchSliderValues(this.search_string,this.checked_ranges,this.checked_spaces,this.checked_categories,this.checked_subcategories).subscribe(
      res => {
        this.slider_value = res;
        this.all_materials = res.materials
        this.all_colors = res.colors
        this.all_finishes = res.finishes
        this.all_minimum_price = res.minimum_price
        this.all_maximum_price = res.maximum_price
        this.all_minimum_height = res.minimum_height
        this.all_maximum_height = res.maximum_height
        this.all_minimum_lead_time = res.minimum_lead_time
        this.all_maximum_lead_time = res.maximum_lead_time
        this.all_minimum_length = res.minimum_length
        this.all_maximum_length = res.maximum_length
        this.all_minimum_width = res.minimum_width
        this.all_maximum_width = res.maximum_width
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  checked_materials:any = [];
  checked_colors:any = [];
  checked_finishes:any = [];
  checkElement(type, event){
    if(type == "materials"){
      if(event.target.checked){
        this.checked_materials.push(event.target.value)
      }
      else{
        var index = this.checked_materials.indexOf(event.target.value);
        if (index > -1) {
          this.checked_materials.splice(index, 1);
        }
      }
    }
    else if(type == "colors"){
      if(event.target.checked){
        this.checked_colors.push(event.target.value)
      }
      else{
        var index = this.checked_colors.indexOf(event.target.value);
        if (index > -1) {
          this.checked_colors.splice(index, 1);
        }
      }
    }
    else if(type == "finishes"){
      if(event.target.checked){
        this.checked_finishes.push(event.target.value)
      }
      else{
        var index = this.checked_finishes.indexOf(event.target.value);
        if (index > -1) {
          this.checked_finishes.splice(index, 1);
        }
      }
    }
  }
  checked_minimum_price:any = "";
  checked_maximum_price:any = "";
  checked_minimum_height:any = "";
  checked_maximum_height:any = "";
  checked_minimum_lead_time:any = "";
  checked_maximum_lead_time:any = "";
  checked_minimum_length:any = "";
  checked_maximum_length:any = "";
  checked_minimum_width:any = "";
  checked_maximum_width:any = "";

  updateSlider(type, slider, event) {
    slider.onUpdate = event;
    if(type == "price"){
      this.checked_minimum_price = slider.onUpdate.from;
      this.checked_maximum_price = slider.onUpdate.to;
    }
    else if(type == "height"){
      this.checked_minimum_height = slider.onUpdate.from;
      this.checked_maximum_height = slider.onUpdate.to;
    }
    else if(type == "lead_time"){
      this.checked_minimum_lead_time = slider.onUpdate.from;
      this.checked_maximum_lead_time = slider.onUpdate.to;
    }
    else if(type == "length"){
      this.checked_minimum_length = slider.onUpdate.from;
      this.checked_maximum_length = slider.onUpdate.to;
    }
    else if(type == "width"){
      this.checked_minimum_width = slider.onUpdate.from;
      this.checked_maximum_width = slider.onUpdate.to;
    }
    
  }


  search_string:any = ""
  filterProducts(page?){
    $(".dd-dropdown").addClass("d-none");
    this.loaderService.display(true);
    this.catalogueService.filterProducts(this.search_string,this.checked_ranges,this.checked_spaces,this.checked_categories, this.checked_materials, this.checked_colors, this.checked_finishes, this.checked_subcategories, this.checked_minimum_price,this.checked_maximum_price,this.checked_minimum_lead_time, this.checked_maximum_lead_time, this.checked_minimum_length, this.checked_maximum_length, this.checked_minimum_width, this.checked_maximum_width,this.checked_minimum_height,this.checked_maximum_height,this.new,page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.products_list = res.products;
       
        this.loaderService.display(false);
        // this.slider_value = res;
      },
      err => {
        this.loaderService.display(false);
      });
  }

  opensideOverlay() {
    this.fetchSliderValues();
    $(".dd-dropdown").addClass("d-none");
    document.getElementById("sidenavoverlay").classList.remove('d-none');
    document.getElementById("sidenavoverlay").style.width = "100%";
  }

  closesideOverlay() {
    document.getElementById("sidenavoverlay").style.width = "0";
    document.getElementById("sidenavoverlay").classList.add('d-none');
  }

  displayDropDown(el) {
    var elem = '#'+el + '-dropdown';
    if((<HTMLElement>document.querySelector(elem)).classList.contains('d-none')){
      $(".dd-dropdown").addClass("d-none");
      (<HTMLElement>document.querySelector(elem)).classList.remove('d-none');
    } else {
      (<HTMLElement>document.querySelector(elem)).classList.add('d-none');
    }
    
  }

  removeElement(elem,arr,checked_arr,type){
    if(type=='space' || type=='category' || type=='range'){
      var j:number = 0;
      arr.forEach((ctr) => {
        if(ctr.id == elem.id) {
          arr.splice(j, 1);
          return;
        }
        j++;
      });
      var index = checked_arr.indexOf(elem.id);
      if (index > -1) {
        checked_arr.splice(index, 1);
      }
      if(type=='space'){
        this.uncheckCategories();
      }
      if(type=='category'){
        this.unchecksubCategories();
      }
    }
    if(type=='subcategory'){
      var index = checked_arr.indexOf(elem.configuration);
      if (index > -1) {
        checked_arr.splice(index, 1);
      }
      var j:number = 0;
      arr.forEach((ctr) => {
        if(ctr.configuration == elem.configuration) {
          arr.splice(j, 1);
          return;
        }
        j++;
      });
    }
    
    if(type=='space'){
      this.fetchCategories();
      this.subcategories_list=[];
    } else if (type=='category') {
      this.fetchSubCategories();
    }
    if(this.selectedSpacesLooseFurArr.length==0){
      this.selectedCategoriesLooseFurArr = new Array();
      this.selectedSubCategoriesLooseFurArr = new Array();
      this.checked_categories =[];
      this.checked_subcategories=[];
    }
    if( this.selectedCategoriesLooseFurArr.length==0){
      this.selectedSubCategoriesLooseFurArr = new Array();
      this.checked_subcategories=[];
    }
  }

  isElementPresent(elem,arr,type?){
    var flag;
    if(type=='subcategory'){
      flag=false;
      var j:number = 0;
      arr.forEach((ctr) => {
        if(ctr.configuration == elem.configuration) {
          flag=true;
        }
        j++;
      });
    } else {
      var j:number = 0;
      flag=false;
      arr.forEach((ctr) => {
        if(ctr.id == elem.id) {
          flag=true;
        }
        j++;
      });
    }
    if(flag){
      return true;
    } else {
      return false;
    }
  }
  ishandlemodal_open = false;
  handleModal_param_obj;
  customizationmodal_bool=false;
  openHandleModal(category,handletype,product_mod_id,shutter_fin_id,custmodalflag){
    this.ishandlemodal_open = true;
    this.customizationmodal_bool=custmodalflag;
    this.handleModal_param_obj = {
      'handletype':handletype,
      'category':category,
      'product_mod_id':product_mod_id,
      'shutter_fin_id':shutter_fin_id
    }
    if(category=='kitchen' && !this.customizationmodal_bool){
      $('#selectedGlobalVarModalMK').modal('hide');
    } else if(category=='wardrobe' && !this.customizationmodal_bool){
      $('#selectedGlobalVarModal').modal('hide');
    } else if(category=='kitchen' && this.customizationmodal_bool){
      $('#customizationModalMk').modal('hide');
    } else if(category=='wardrobe' && this.customizationmodal_bool){
      $('#customizationModal').modal('hide');
    }
    this.getDataForHandleFilters(category);
  }

  closeHandleModal(category){
    
    if(this.ishandlemodal_open){
      if(category=='kitchen' && !this.customizationmodal_bool && !this.add_globalVarModal_bool){
        $('#selectedGlobalVarModalMK').css({"overflow-y": "auto"});
        $('#selectedGlobalVarModalMK').modal('show');
      } else if(category=='wardrobe' && !this.customizationmodal_bool && !this.add_globalVarModal_bool){
        $('#selectedGlobalVarModal').css({"overflow-y": "auto"});
        $('#selectedGlobalVarModal').modal('show');
      } else if(category=='kitchen' && this.customizationmodal_bool && !this.add_globalVarModal_bool){
        $('#customizationModalMk').css({"overflow-y": "auto"});
        $('#customizationModalMk').modal('show');
      } else if(category=='wardrobe' && this.customizationmodal_bool && !this.add_globalVarModal_bool){
        $('#customizationModal').css({"overflow-y": "auto"});
        $('#customizationModal').modal('show');
      }
      this.customizationmodal_bool = false;
      this.ishandlemodal_open = false;
    }
    if(this.add_globalVarModal_bool) {
      $('#setGlobalConfigModal').modal('show');
      $('#setGlobalConfigModal').css({"overflow-y": "auto"});
      this.add_globalVarModal_bool = false;
    }
    
    this.handleModal_param_obj = undefined;
    this.all_minimum_price=undefined;
    this.all_maximum_price=undefined;
    this.checked_maximum_price ="";
    this.checked_minimum_price="";
    this.searchstr_handle= "";
    this.make_handle_filter=[];
    var handle_make_checkboxes = $('input[name="make_handle_filter"]');
    handle_make_checkboxes.filter(":checked").map(function () {
     
      this.checked=false;
    })
    this.type_arrivae_select=false;
    this.type_handle_filter=[];
    $('#type_handle_filter_normal').prop('checked',false);
    $('#type_handle_filter_profile').prop('checked',false);
    $('#type_handle_filter_insert').prop('checked',false);
    $('#type_handle_filter_concealed').prop('checked',false);
    this.ref.detectChanges();
  }
  closeCodeModals(){
    if(this.add_globalVarModal_bool) {
      $('#setGlobalConfigModal').modal('show');
      $('#setGlobalConfigModal').css({"overflow-y": "auto"});
      this.add_globalVarModal_bool = false;
    }
  }

  arr_list_modal;
  formctrl_modal;
  category_modal;

  openModuleModal(arr_list,category){
    if(category=='kitchen' && (this.addModuleFormMk.controls['kitchen_category'].value=='' ||
        this.addModuleFormMk.controls['kitchen_category'].value==undefined ||
        this.addModuleFormMk.controls['module_type'].value=='' ||
        this.addModuleFormMk.controls['module_type'].value==undefined)){
        this.errorMessageShow('Kitchen category and Module type are required before selecting module.');
    } else if(category=='wardrobe' && (this.addModuleForm.controls['module_type'].value=='' ||
        this.addModuleForm.controls['module_type'].value==undefined)){
        this.errorMessageShow('Module type is required before selecting module.')
    } else {
      $('#moduleCodeModal').modal('show');
    }
    this.arr_list_modal = arr_list;
    this.category_modal=category;
  }
  setModulecode(mod){
    if(this.category_modal=='wardrobe'){
      this.addModuleForm.controls['module'].setValue(mod.id);
      this.addModuleForm.controls['module_code'].setValue(mod.code);
      this.addModuleForm.controls['width'].setValue(mod.width);
      this.addModuleForm.controls['depth'].setValue(mod.depth);
      this.addModuleForm.controls['height'].setValue(mod.height);
    } else if(this.category_modal=='kitchen'){
      this.addModuleFormMk.controls['module'].setValue(mod.id);
      this.addModuleFormMk.controls['module_code'].setValue(mod.code);
      this.addModuleFormMk.controls['width'].setValue(mod.width);
      this.addModuleFormMk.controls['depth'].setValue(mod.depth);
      this.addModuleFormMk.controls['height'].setValue(mod.height);
    }
    this.closeModuleModal();
  }
  closeModuleModal(){
    this.arr_list_modal = [];
    this.category_modal=undefined;
    $('#moduleCodeModal').modal('hide');
  }

  preset_list;
  preset_list_category;
  getGlobalPresets(category,page?){
    this.preset_list_category = category;
    this.loaderService.display(true);
    this.quotationService.getGlobalPresets(category,page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.preset_list = res.boq_global_configs;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  savePresetAsGlobal(category,presetId){
    this.loaderService.display(true);
    this.quotationService.savePresetAsGlobal(category,presetId,this.quotation_id).subscribe(
      res=>{
        this.getBoqConfig(category);
        $('#listPresetModal').modal('hide');
        this.successMessageShow('Global varibles saved successfully!')
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  openMkwlayout(space,category){
    this.saveMkwLayoutForm.controls['category'].setValue(category);
    this.saveMkwLayoutForm.controls['space'].setValue(space);
  }
  saveAsMkwLayout(formval){
    this.loaderService.display(true);
    var mod_job_ids=[];
    var appliance_job_ids=[];
    var extra_job_ids=[];
    var keys_arr;
    if(formval.category=='kitchen'){
      keys_arr=Object.keys(this.quotationDetails.modular_jobs_kitchen);
      var keys_arr1=Object.keys(this.quotationDetails.appliance_jobs);
      var keys_arr2=Object.keys(this.quotationDetails.extra_jobs_kitchen);
      for(var i=0;i<keys_arr.length;i++){
        if(keys_arr[i]==formval.space){
          for(var j=0;j<this.quotationDetails.modular_jobs_kitchen[keys_arr[i]].length;j++){
            mod_job_ids.push(this.quotationDetails.modular_jobs_kitchen[keys_arr[i]][j].id);
          }
        }
      }
      for(var i=0;i<keys_arr1.length;i++){
        if(keys_arr1[i]==formval.space){
          for(var j=0;j<this.quotationDetails.appliance_jobs[keys_arr1[i]].length;j++){
            appliance_job_ids.push(this.quotationDetails.appliance_jobs[keys_arr1[i]][j].id);
          }
        }
      }
      for(var i=0;i<keys_arr2.length;i++){
        if(keys_arr2[i]==formval.space){
          for(var j=0;j<this.quotationDetails.extra_jobs_kitchen[keys_arr2[i]].length;j++){
            extra_job_ids.push(this.quotationDetails.extra_jobs_kitchen[keys_arr2[i]][j].id);
          }
        }
      }
    } else if(formval.category=='wardrobe'){
      keys_arr=Object.keys(this.quotationDetails.modular_jobs_wardrobe);
      var keys_arr2=Object.keys(this.quotationDetails.extra_jobs_wardrobe);
      for(var i=0;i<keys_arr.length;i++){
        if(keys_arr[i]==formval.space){
          for(var j=0;j<this.quotationDetails.modular_jobs_wardrobe[keys_arr[i]].length;j++){
            mod_job_ids.push(this.quotationDetails.modular_jobs_wardrobe[keys_arr[i]][j].id);
          }
        }
      }
      for(var i=0;i<keys_arr2.length;i++){
        if(keys_arr2[i]==formval.space){
          for(var j=0;j<this.quotationDetails.extra_jobs_wardrobe[keys_arr2[i]].length;j++){
            extra_job_ids.push(this.quotationDetails.extra_jobs_wardrobe[keys_arr2[i]][j].id);
          }
        }
      }
    }
    var data= {
      'mkw_layout':{
        'category':formval.category,
        'name': formval.name,
        'remark': formval.remark
      },
      'modular_job_ids':mod_job_ids,
      'appliance_job_ids':appliance_job_ids,
      'extra_job_ids':extra_job_ids
    }
    this.quotationService.postMkwLayout(formval.category,data).subscribe(
      res=>{
        this.successMessageShow('Layout saved successfully!');
        this.saveMkwLayoutForm.reset();
        $('#saveMkwLayoutModal').modal('hide');
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  onChangeOfCategory(category,form){
    if(category=='kitchen'){
      this.setFormCtrlRequiredValidation(form,'countertop');
      this.setFormCtrlRequiredValidation(form,'skirting_config_height');
      this.setFormCtrlRequiredValidation(form,'skirting_config_type');
      this.setFormCtrlRequiredValidation(form,'civil_kitchen');
      this.removeFormCtrlRequiredValidation(form,'shutter_handle_code');
    } else {
      this.setFormCtrlRequiredValidation(form,'shutter_handle_code');
      this.removeFormCtrlRequiredValidation(form,'countertop');
      this.removeFormCtrlRequiredValidation(form,'skirting_config_height');
      this.removeFormCtrlRequiredValidation(form,'skirting_config_type');
      this.removeFormCtrlRequiredValidation(form,'civil_kitchen');
      this.removeFormCtrlRequiredValidation(form,'depth');
      this.removeFormCtrlRequiredValidation(form,'drawer_height_1');
      this.removeFormCtrlRequiredValidation(form,'drawer_height_2');
      this.removeFormCtrlRequiredValidation(form,'drawer_height_3');
    }
    this.setFormvalue(null,form);
  }
  setFormvalue(val,form){
    form.controls['core_material'].setValue("");
    form.controls['shutter_material'].setValue("");
    form.controls['shutter_finish'].setValue("");
    form.controls['door_handle_code'].setValue("");
    form.controls['shutter_handle_code'].setValue("");
    form.controls['hinge_type'].setValue("");
    form.controls['channel_type'].setValue("");
    form.controls['brand_id'].setValue("");
    form.controls['skirting_config_height'].setValue("");
    form.controls['skirting_config_type'].setValue("");
    form.controls['countertop'].setValue("");
    form.controls['civil_kitchen'].setValue("");
    form.controls['depth'].setValue("");
    form.controls['drawer_height_1'].setValue("");
    form.controls['drawer_height_2'].setValue("");
    form.controls['drawer_height_3'].setValue("");
    form.controls['door_handle_code_img'].setValue("");
    form.controls['shutter_handle_code_img'].setValue("");
    form.controls['shutter_shade_code_img'].setValue("");
    form.controls['edge_banding_shade_code_img'].setValue("");
    form.controls['shutter_shade_code'].setValue("");
    form.controls['edge_banding_shade_code'].setValue("");
  }

  onChangeOfTOK(val,form){
    if(val=='true'){
      this.setFormCtrlRequiredValidation(form,'depth');
      this.setFormCtrlRequiredValidation(form,'drawer_height_1');
      this.setFormCtrlRequiredValidation(form,'drawer_height_2');
      this.setFormCtrlRequiredValidation(form,'drawer_height_3');
    } else{
      this.removeFormCtrlRequiredValidation(form,'depth');
      this.removeFormCtrlRequiredValidation(form,'drawer_height_1');
      this.removeFormCtrlRequiredValidation(form,'drawer_height_2');
      this.removeFormCtrlRequiredValidation(form,'drawer_height_3');
    }
  }

  setFormCtrlRequiredValidation(form,formCtrl){
    form.controls[formCtrl].setValidators([Validators.required]);
    form.controls[formCtrl].updateValueAndValidity();
  }
  removeFormCtrlRequiredValidation(form,formCtrl){
    form.controls[formCtrl].clearValidators();
    form.controls[formCtrl].updateValueAndValidity();
  }

  closeGlobalVarFormModal(){
    this.addGlobalVariableForm.reset();
    this.add_globalVarModal_bool=false;
    this.setFormvalue("",this.addGlobalVariableForm);
    this.arrivaeSelectValues=false;
    
    this.fetchArrivaeSelectValues();
  }

  add_globalVarModal_bool=false;

  openglobalvarSubModal(targetModal,parentModal){
    this.add_globalVarModal_bool =true;
    $(parentModal).modal('hide');
    $(targetModal).modal('show');
  }

  preset_parent_form_data;
  preset_parent_form_modal;
  preset_parent_form_type;
  openPresetModal(formval,category,formtype,parentModal){
    $(parentModal).modal('hide');
    $('#savePresetModal').modal('show');
    this.preset_parent_form_modal=parentModal;
    this.preset_parent_form_type=formtype;
    this.savePresetForm.controls['category'].setValue(category);
    this.preset_parent_form_data=formval;
    this.arrivaeSelectValues=false;
    
    // this.fetchArrivaeSelectValues()
  }

  saveAsPreset(formval){
    this.loaderService.display(true);
    var obj = {
      'boq_global_config' : {
        'is_preset':true,
        'preset_remark':formval.remark,
        'preset_name':formval.name,
        'core_material':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.core_material:((formval.category=='kitchen')?this.core_material_globalVar_MK:this.core_material_globalVar_MW),
        'shutter_material':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.shutter_material:((formval.category=='kitchen')?this.shutter_material_globalVar_MK:this.shutter_material_globalVar_MW),
        'shutter_finish':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.shutter_finish:((formval.category=='kitchen')?this.shutter_finish_globalVar_MK:this.shutter_finish_globalVar_MW),
        'shutter_shade_code':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.shutter_shade_code:
        ((formval.category=='kitchen')?((this.shutter_shade_code_globalVar_MK!='customshadecode')?
        this.shutter_shade_code_globalVar_MK:this.shutter_custshade_code_globalVar_MK):
        ((this.shutter_shade_code_globalVar_MW!='customshadecode')?
        this.shutter_shade_code_globalVar_MW:this.shutter_custshade_code_globalVar_MW)),
        'edge_banding_shade_code':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.edge_banding_shade_code:
        ((formval.category=='kitchen')?((this.shutter_shade_code_globalVar_MK!='customshadecode')?
        this.edgebanding_shade_code_globalVar_MK:this.edgebanding_custshade_code_globalVar_MK):
        ((this.edgebanding_shade_code_globalVar_MW!='customshadecode')?
        this.edgebanding_shade_code_globalVar_MW:this.edgebanding_custshade_code_globalVar_MW)),
        'door_handle_code': (this.preset_parent_form_type=='add')?this.preset_parent_form_data.door_handle_code:
        ((formval.category=='kitchen')?this.door_handle_code_globalVar_MK:
          this.door_handle_code_globalVar_MW),
        'shutter_handle_code':(this.preset_parent_form_type=='add')?((formval.category=='kitchen')?null:this.preset_parent_form_data.shutter_handle_code):
        ((formval.category=='kitchen')?null:this.shutter_handle_code_globalVar_MW),
        'hinge_type': (this.preset_parent_form_type=='add')?(this.globalVarArr.modspace == true)? 'normal':this.preset_parent_form_data.hinge_type:
        ((formval.category=='kitchen')?this.hinge_type_globalVar_MK:
          this.hinge_type_globalVar_MW),
        'channel_type':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.channel_type:
        ((formval.category=='kitchen')?this.channel_type_globalVar_MK:
          this.channel_type_globalVar_MW),
        'brand_id':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.brand_id:
        ((formval.category=='kitchen')?this.hardware_brand_globalVar_MK:
          this.hardware_brand_globalVar_MW),
        'skirting_config_height':(this.preset_parent_form_type=='add')?((formval.category=='kitchen')?this.preset_parent_form_data.skirting_config_height:null):
        ((formval.category=='kitchen')?this.skirting_con_height_globalVar_MK:null),
        'skirting_config_type':(this.preset_parent_form_type=='add')?((formval.category=='kitchen')?this.preset_parent_form_data.skirting_config_type:null):
        ((formval.category=='kitchen')?this.skirting_con_type_globalVar_MK:null),
        'civil_kitchen':(this.preset_parent_form_type=='add')?((formval.category=='kitchen')?this.preset_parent_form_data.civil_kitchen:null):
        ((formval.category=='kitchen')?this.typeofkitchen_globalVar_MK:null),
        'category':formval.category
      }
    }
    if(obj.boq_global_config.category=='kitchen'){
      obj['boq_global_config']['countertop']=(this.preset_parent_form_type=='add')?
      this.preset_parent_form_data.countertop:this.countertop_globalVar_MK;
    }
    if(obj.boq_global_config.civil_kitchen=='true'){
      obj['boq_global_config']['civil_kitchen_parameter_attributes'] =  {
          'depth': (this.preset_parent_form_type=='add')?this.preset_parent_form_data.depth:this.depthofcivilKit_globalVar_MK,
          'drawer_height_1':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.drawer_height_1:this.drawerheight1ofcivilKit_globalVar_MK,
          'drawer_height_2':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.drawer_height_2:this.drawerheight2ofcivilKit_globalVar_MK,
          'drawer_height_3':(this.preset_parent_form_type=='add')?this.preset_parent_form_data.drawer_height_3:this.drawerheight3ofcivilKit_globalVar_MK
        }
    }
    this.quotationService.postBoqGlobalConfig(obj).subscribe(
      res=>{
        this.successMessageShow('Preset saved successfully!');
        this.closePresetModal();
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
  }

  closePresetModal(){
    $('#savePresetModal').modal('hide');
    $(this.preset_parent_form_modal).modal('show');
    $(this.preset_parent_form_modal).css({"overflow-y": "auto"});
    this.preset_parent_form_data =undefined;
    this.preset_parent_form_modal=undefined;
    this.preset_parent_form_type=undefined;
    this.savePresetForm.reset();
  }
  layouts_list;
  getLayoutsList(category,page?){
    this.loaderService.display(true);
    this.quotationService.getMkwLayouts(category,page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.layouts_list = res.mkw_layouts;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }
  layoutDetail;
  getMkwLayoutDetail(id){
    this.loaderService.display(true);
    this.quotationService.getDetailsOfMkwLayouts(id).subscribe(
      res => {
        this.layoutDetail=res.json().mkw_layout;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  customizationDetails;
  getCustomizationOfMKWlayout(id,layout_id){
    this.loaderService.display(true);
    this.quotationService.getCustomizationOfMKWlayout(id,layout_id).subscribe(
      res => {
        
        this.customizationDetails=res.modular_job;
        this.loaderService.display(false);
        $('#layoutCustomizationModal').modal('show');
        $('#layoutlistmodal').modal('hide');
      },
      err => {
        this.loaderService.display(false);
      });
  }
  closeLayoutCustomizationModal(){
    $('#layoutCustomizationModal').modal('hide');
    $('#layoutlistmodal').modal('show');
    $('#layoutlistmodal').css({"overflow-y":"auto"});
  }

  importlayout_category;
  importlayout_space;
  openImportLayoutModal(category,space){
    this.importlayout_category = category;
    this.importlayout_space = space;
    this.getLayoutsList(category,1);
    $('#layoutlistmodal').modal('show');
  }
  closeImportLayoutModal(){
    this.importlayout_category =undefined;
    this.importlayout_space=undefined;
    this.custom_furniture_space = undefined;
  }
  importLayoutToSpace(layoutid){
    this.loaderService.display(true);
    this.quotationService.importMkwLayout(this.projectId,this.quotation_id,
      this.importlayout_space,this.importlayout_category,layoutid)
    .subscribe(
      res=>{
        this.quotationDetails=res.quotation;
        $('#layoutlistmodal').modal('hide');
        this.successMessageShow('Layout imported successfully');
        this.closeImportLayoutModal();
        this.loaderService.display(false);
      },
      err =>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
     );
  }

  openSmartBoqModal(space){
    this.getCategoriesForLoosefurniture();
    $('#smartBoqModal').modal('show');
    this.smart_boq_Form.controls['space'].setValue(space);
    this.addNestedElem_SmartBOQ();
  }
  categories_list_loosefur;
  getCategoriesForLoosefurniture(){
    this.loaderService.display(true);
    this.quotationService.getCategoriesForLoosefurniture().subscribe(
      res=>{
        this.categories_list_loosefur = res.sections;
        this.loaderService.display(false);
      },
      err =>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
     );
  }

  generateSmartQuotation(data){
    this.loaderService.display(true);
    this.quotationService.generateSmartQuotation(this.projectId,this.quotation_id,data).subscribe(
      res=>{
        this.quotationDetails=res.quotation;
        this.smart_boq_Form.reset();
        (<FormArray>this.smart_boq_Form.controls['category_data']).controls=[];
        this.closeSmartBoqModal();
        this.successMessageShow('Boq generated successfully!');
        this.loaderService.display(false);
      },
      err =>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }
  closeSmartBoqModal(){
    $('#smartBoqModal').modal('hide');
  }
  customizable_dim_data_for_module_mk;
  customizable_dim_data_for_module_mw;
  getCustomizableDimensions(modtypeid){
    this.loaderService.display(true);
    this.quotationService.getCustomizableDimensions(modtypeid).subscribe(
      res=>{
        if(this.selectedsectionName=='modular_kitchen'){
          this.customizable_dim_data_for_module_mk = res;
        } else if(this.selectedsectionName=='modular_wardrobe'){
          this.customizable_dim_data_for_module_mw = res;
        }
        
        this.loaderService.display(false);
      },
      err =>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  checkValidationForDimensions(category,form){
    var input1;
    var data;
    var msg;
    if(category=='wardrobe'){
      data=this.customizable_dim_data_for_module_mw;
    } else {
      data=this.customizable_dim_data_for_module_mk;
    }
   
    if(data.dimensions=='LBT'){
      input1= form.controls['thickness'].value==""|| form.controls['thickness'].value==undefined ||
          form.controls['length'].value<data.allowed_L[0] ||
          form.controls['length'].value>data.allowed_L[1] || 
          form.controls['breadth'].value<data.allowed_B[0] ||
          form.controls['breadth'].value>data.allowed_B[1] || 
          form.controls['length'].value==null|| form.controls['length'].value==undefined ||
          form.controls['breadth'].value==null|| form.controls['breadth'].value==undefined ||
          form.controls['length'].value==''||form.controls['breadth'].value=='';
         
      msg ='Thickness, length, breadth are required fields.'+
            'Length should be in the [ '+data.allowed_L+' ] range.'+
            'Breadth should be in the [ '+data.allowed_B+' ] range.';
    } else if(data.dimensions=='WDH'){
        input1 = form.controls['width'].value<data.allowed_W[0] ||
        form.controls['width'].value>data.allowed_W[1] ||
        form.controls['height'].value<data.allowed_H[0] ||
        form.controls['height'].value>data.allowed_H[1] || 
        form.controls['depth'].value<data.allowed_D[0] ||
        form.controls['depth'].value>data.allowed_D[1];

        msg='Height should be in the [ '+data.allowed_H+' ] range.'+
            'Width should be in the [ '+data.allowed_W+' ] range.'+
            'Depth should be in the [ '+data.allowed_D+' ] range.'
    }
    if(input1){
      this.errorMessageShow(msg);
      return false;
    } else {
      return true;
    }
  }
  checkForRepetedCategory(sectionId){
    var arr = this.smart_boq_Form.value.category_data;
    var flag=false;
    for(var i=0;i<arr.length;i++){
      if(arr[i].section_id==sectionId){
        flag = true;
        break;
      }
    }
    return flag;
  }

  searchstr_appliance="";
  makeforappliance_filter;
  makeforappliance_filter_types;
  make_appliance_filter=[];
  make_appliance_filter_types=[];
  type_handle_filter=[];
  searchstr_handle="";
  makeforhandles_filter;
  make_handle_filter=[];
  handlelist_arr=[];
  selected_kitchen_appliance;
  getFilteredHandles(page){
    this.loaderService.display(true);
    var filterobj = {
      minimum_mrp:this.checked_minimum_price,
      maximum_mrp:this.checked_maximum_price,
      makes:this.make_handle_filter,
      handle_class:this.type_handle_filter,
      arrivae_select:this.type_arrivae_select
    }
    this.quotationService.getFilteredHandles(page,this.handleModal_param_obj.category,this.handleModal_param_obj.product_mod_id,
      this.handleModal_param_obj.shutter_fin_id,filterobj,this.searchstr_handle,this.handleModal_param_obj.handletype)
    .subscribe(
      res=>{
        //
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.handlelist_arr = res.handles;
        // 
        if(this.handlelist_arr.length==0){
          this.loaderService.display(true);
          this.quotationService.getFilteredHandles(1,this.handleModal_param_obj.category,this.handleModal_param_obj.product_mod_id,
            this.handleModal_param_obj.shutter_fin_id,filterobj,this.searchstr_handle,this.handleModal_param_obj.handletype)
          .subscribe(
            res=>{
              this.headers_res= res.headers._headers;
              this.per_page = this.headers_res.get('x-per-page');
              this.total_page = this.headers_res.get('x-total');
              this.current_page = this.headers_res.get('x-page');
              res= res.json();
              this.handlelist_arr = res.handles;
              this.loaderService.display(false);
            },
            err=>{
              
              this.loaderService.display(false);
            }
          );
        }
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }
  getDataForHandleFilters(category){
    this.loaderService.display(true);
    this.quotationService.getDataForHandleFilters(category).subscribe(
      res=>{
        this.makeforhandles_filter=res.makes;
        this.all_minimum_price = res.min_mrp
        this.all_maximum_price = res.max_mrp
        this.getFilteredHandles(1);
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  openKitchenApplianceModal(){
    this.getDataForApplianceFilters();
  }

  getDataForApplianceFilters(){
  this.closeApplianceModal();
    this.loaderService.display(true);
    this.quotationService.getDataForApplianceFilters(this.addApplianceFormMk.controls["module_type_id"].value).subscribe(
      res=>{
       
        this.makeforappliance_filter=res.makes;
        this.makeforappliance_filter_types=res.types;
        this.all_minimum_price = res.min_mrp;
        this.all_maximum_price = res.max_mrp;
        this.type_arrivae_select = false
        this.getFilteredAppliances(1);
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }
  appliancelist_arr;
  getFilteredAppliances(page){
    this.loaderService.display(true);
    var filterobj = {
      minimum_mrp:this.checked_minimum_price,
      maximum_mrp:this.checked_maximum_price,
      makes:this.make_appliance_filter,
      types:[],
      arrivae_select:this.type_arrivae_select,
    }
    this.quotationService.getFilteredAppliances(this.addApplianceFormMk.controls["module_type_id"].value,
    filterobj,this.searchstr_appliance,page)
    .subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.appliancelist_arr = res.kitchen_appliances;
        
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  closeApplianceModal(){
    this.checked_maximum_price ="";
    this.checked_minimum_price="";
    this.all_minimum_price=null;
    this.all_maximum_price =null;
    this.searchstr_appliance= "";
    $('#addApplianceModal').modal('hide');
    this.make_appliance_filter=[];
    this.make_appliance_filter_types=[];
    this.type_arrivae_select=false;
  }

  setAppliance(appliance){
    this.selected_kitchen_appliance=appliance;
    this.addApplianceFormMk.controls["module_type_id"].setValue(appliance.module_type_id);
    this.addApplianceFormMk.controls["id"].setValue(appliance.id);
  }

  clearAddApplianceForm(){
    this.selected_kitchen_appliance=undefined;
    this.errorAlertQty = false;
    this.errorAlertModuleTypeId = false;
  }

  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
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

  resetVariations(){
    this.editProductLineItemVariation = null
    this.modalQuantityandProductSelectionForm.patchValue({product_variant_id: null});

    this.master_options = []
    this.sub_options = []
    this.catalogue_options = []
    this.variations = []
  }

  preview_Img(elemid,index,modalname?){
    if(modalname){
      this.parent_modal = modalname;
      $(this.parent_modal).modal('hide');
    }
    $('.zoom-img-modal-lg').modal('show');
    var child = <HTMLInputElement>document.getElementById("img-lg-zoom");
    var str=elemid+index;
    var inputelem= <HTMLImageElement>document.getElementById(str);
    child.src = inputelem.src;
  }

  // activatedZoomerImg:any = "";
  // activateZoomer(img, event){
  //   var f = document.querySelector('.zoomer-container');
  //   //
  //   this.activatedZoomerImg = img;
  //   $('.zoomer-container').css("top", event.pageY + f.scrollTop -150 + 'px');
  //   $('.zoomer-container').css("display", 'block');
  //   // $('.zoomer-container img').attr('src', this.activatedZoomerImg);
  // }

  // deActivateZoomer(){
  //   $('.zoomer-container').css("display", 'none');
  // }

  activatedZoomerImg:any = "";
  activateZoomer(img, event){
    var f = document.querySelector('.zoomer-container');
   
    this.activatedZoomerImg = img;
    $('.zoomer-container').css("top", event.pageY + f.scrollTop -150 + 'px');
    $('.zoomer-container').css("display", 'block');
    // $('.zoomer-container img').attr('src', this.activatedZoomerImg);
  }

  deActivateZoomer(){
    $('.zoomer-container').css("display", 'none');
  }
  count=0;
  currentIndex;
  selectedIndex = 0;
  selectedIndexChange = 0;
  sendMidImge(event,index){
      this.biggerImage = event;
      this.selectedIndexChange = index;
      this.medium_image = event;
      $('#img-lg-zoom'+this.currentIndex).attr('src',event);
     
      

  }
  addIndex(value){
    this.currentIndex = value;
    

  }

    callCarousel(){

      $('#carouselExample').on('slide.bs.carousel', function (e) {



      var $e = $(e.relatedTarget);
      var idx = $e.index();
      var itemsPerSlide = 4;
      var totalItems = $('.carousel-item').length;
      
      if (idx >= totalItems-(itemsPerSlide-1)) {
          var it = itemsPerSlide - (totalItems - idx);
          for (var i=0; i<it; i++) {
              // append slides to end
              if (e.direction=="left") {
                  $('.carousel-item').eq(i).appendTo('.carousel-inner');
              }
              else {
                  $('.carousel-item').eq(0).appendTo('.carousel-inner');
              }
          }
      }
  });

  }

  all_product_activated:boolean = false;
  all_segment_activated:boolean = false;
  product_detail_activated:boolean = false;
  activateProduct(tab){
    this.all_product_activated = false;
    this.all_segment_activated = false;
    this.product_detail_activated = false;
    if(tab == 'product'){
      this.all_product_activated = true;
    }
    else if(tab == 'segment'){
      this.all_segment_activated = true;
    }

    else if(tab == 'product_details'){
      this.product_detail_activated = true;
    }
  }

  catalogue_type:any;
  catalogue_id:any;

  activateSegment(catalogue_type, catalogue_id){
   
    this.catalogue_type = catalogue_type;
    this.catalogue_id = catalogue_id;
    this.activateProduct('segment');
    this.filterNewSegments();
  }

  activateSubCategory(catalogue_type, catalogue_id, event){
   
    event.stopPropagation();
    this.catalogue_type = catalogue_type;
    this.catalogue_id = catalogue_id;
    this.activateProduct('product');
    this.filterSubCategoryProducts(catalogue_type,catalogue_id);
  }

  filterSubCategoryProducts(catalogue_type,catalogue_id){
    this.subcategory_ids = [];
    this.subcategory_ids.push(catalogue_id); 
    this.initialiseState();
  }

  segments_array = [];
  segment_headers_res;
  segment_per_page;
  segment_total_page;
  segment_current_page;
  segment_page_number;
  breadcrumb:any;
  filterNewSegments(page?){
    this.loaderService.display(true);
    this.catalogueService.segmentShow(this.catalogue_type,this.catalogue_id,page).subscribe(
      res => {
        this.segment_headers_res= res.headers._headers;
        this.segment_per_page = this.segment_headers_res.get('x-per-page');
        this.segment_total_page = this.segment_headers_res.get('x-total');
        this.segment_current_page = this.segment_headers_res.get('x-page');

        res= res.json();
       
        this.breadcrumb = res.breadcrumb;
        if(this.catalogue_type == 'segment'){
          this.segments_array = res.catalog_categories
        }
        else if(this.catalogue_type == 'category'){
         
          this.segments_array = res.catalog_subcategories
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
product_id;
  activateProduct_details(product_id,event){
    this.activateProduct('product_details');
    this.product_id = product_id;
    this.fetchProductDetails();
    this.listMasterOptions();
  }

  openProductModal(space){
    this.loaderService.display(true);
    // this.fetchAllRanges();
    // this.fetchAllSpaces();
    // this.fetchSliderValues();
    this.selectedSpaceForModal = space;
    this.resetAll();
    this.activateProduct('product');
    this.getMegamenu();
    this.fetchSliderValuesNew();
    this.initialiseState();

    // this.route.queryParams.subscribe(params => {
    //     if(params['subcategory_ids'] != null){
    //        this.subcategory_ids.push(params['subcategory_ids']); 
    //        this.initialiseState();
    //     }
    //     else{
    //       this.subcategory_ids = [];
    //       this.initialiseState();
    //     }
    // });
    // this.fetchAllProducts(1);
    // this.filterProducts(1);
  }

  // New code copied from catalog

  initialiseState(){
    this.filterNewProducts();
  }

  catalog_segments:any = [];
  marketplace:any = [];
  marketplace_submenu_categories:any = {};
  getMegamenu(){
    this.loaderService.display(true);
    this.catalogueService.getMegamenu().subscribe(
      res => {
        //
        this.catalog_segments = res.catalog_segments
        this.marketplace = res.marketplace
        // trial
        this.marketplace_submenu_categories = this.marketplace[0].categories
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }

  getMarketplacecategories(item){
    this.marketplace_submenu_categories = item.categories
  }

  products_array = [];
  page_number;
  value;
  filterNewProducts(page?){
    this.page_number = page;
    this.loaderService.display(true);
    this.catalogueService.filterNewProducts(JSON.stringify(this.subcategory_ids),this.search_string,this.class_ids,this.minimum_price,this.maximum_price,this.minimum_lead_time,this.maximum_lead_time,this.minimum_width,this.maximum_width,this.minimum_length,this.maximum_length,this.minimum_height,this.maximum_height,this.
    sort_key,this.liked,page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        //
        
        
        this.value=res.catalog_type;
        if(this.value=='polka'){
          $('#togBtn').prop('checked',false);
        }else{
          $('#togBtn').prop('checked',true);
        }
        this.products_array = res.products
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }
  selected_space;
   updatePolka(event){
    this.selected_space = event.target.checked;
    
    if(event.target.checked==true){
      this.value='arrivae'
    }if (event.target.checked==false) {
      this.value='polka'
    }
   
    this.loaderService.display(true);
    this.catalogueService.catalogType(this.userId,this.value).subscribe(
    res=>{
      
      this.successalert = true;
      this.successMessage = res.message;
      this.filterNewProducts();
      this.getMegamenu();
      this.fetchSliderValues();
      this.clearAll();
      this.loaderService.display(false);
    },
    err=>{
      this.loaderService.display(false);
      
      this.errorMessage = err.message;
    });
  } 
  slider_value:any;
  all_materials:any;
  all_colors:any;
  all_finishes:any;
  filter_classes:any = [];
  master_minimum_price:any;
  master_maximum_price:any;
  master_minimum_lead_time:any;
  master_maximum_lead_time:any;
  master_minimum_width:any;
  master_maximum_width:any;
  master_minimum_length:any;
  master_maximum_length:any;
  master_minimum_height:any;
  master_maximum_height:any;
  fetchSliderValuesNew(){
    this.loaderService.display(true);
    this.catalogueService.fetchSliderValuesNew().subscribe(
      res => {
        //
        // this.products_array = res.products
        // this.minimum_price = res.minimum_price
        // this.maximum_price = res.maximum_price
        // this.minimum_lead_time = res.minimum_lead_time
        // this.maximum_lead_time = res.maximum_lead_time
        // this.minimum_width = res.minimum_width
        // this.maximum_width = res.maximum_width
        // this.minimum_length = res.minimum_length
        // this.maximum_length = res.maximum_length
        // this.minimum_height = res.minimum_height
        // this.maximum_height = res.maximum_height

        this.master_minimum_price = res.minimum_price
        this.master_maximum_price = res.maximum_price
        this.master_minimum_lead_time = res.minimum_lead_time
        this.master_maximum_lead_time = res.maximum_lead_time
        this.master_minimum_width = res.minimum_width
        this.master_maximum_width = res.maximum_width
        this.master_minimum_length = res.minimum_length
        this.master_maximum_length = res.maximum_length
        this.master_minimum_height = res.minimum_height
        this.master_maximum_height = res.maximum_height

        this.filter_classes = res.classes
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  simpleSlider = {name: "Simple Slider", onUpdate: undefined, onFinish: undefined};
  advancedSlider = {name: "Advanced Slider", onUpdate: undefined, onFinish: undefined};

  updateNewSlider(type, slider, event){
 
    // slider.onUpdate = event;
    if(type == 'price'){
      this.minimum_price = event.from
      this.maximum_price = event.to
    }
    else if(type == 'lead_time'){
      this.minimum_lead_time = event.from
      this.maximum_lead_time = event.to
    }
    else if(type == 'width'){
      this.minimum_width = event.from
      this.maximum_width = event.to
    }
    else if(type == 'length'){
      this.minimum_length = event.from
      this.maximum_length = event.to
    }
    else if(type == 'height'){
      this.minimum_height = event.from
      this.maximum_height = event.to
    }
    this.filterNewProducts();
  }

  updateFilterClass(class_id,event){
    //
    if(event.target.checked){
      this.class_ids.push(class_id);
    }
    else{
      var index = this.class_ids.indexOf(class_id);
      if (index > -1) {
        this.class_ids.splice(index, 1);
      }
    }
    this.filterNewProducts();
  }

  sortFilter(sort_value){
    this.sort_key = sort_value;
    let text;
    if(sort_value == 'price_low_to_high'){
      text = 'Price: Low to High'
    }
    else if(sort_value == 'price_high_to_low'){
      text = 'Price: High to Low'
    }
    else if(sort_value == 'newest_first'){
      text = 'Newest First'
    }
    else if(sort_value == 'none'){
      text = 'None'
      this.sort_key = '';
    }
    $(".sort-toggle").text(text);
    this.filterNewProducts();
  }

  likeProduct(product_id){
    this.loaderService.display(true);
    this.catalogueService.likeProduct(product_id).subscribe(
      res => {
       
        this.fetchProductDetails();
        this.filterNewProducts(this.page_number);
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  myNum() {
    var x = document.getElementById("mainDiv");
    var y= document.getElementById("Div2");
    var z=document.getElementById("Div3");
    var a=document.getElementById("Div4");
    if (x.style.display === "none") {
      x.style.display = "block";
      y.style.display="block";
      z.style.display="block";
      a.style.display="none";

    } else {
      x.style.display = "none";
   
    }
  }

  Submenu() {
    document.getElementById("Div2").style.display = "none";
    document.getElementById("Div3").style.display="none";
    document.getElementById("Div4").style.display="block";

  }

  //For view Image in modal
  parent_modal;
  zoomImg(elemid,index){
    $('.zoom-img-modal-lg').modal('show');
    var child = <HTMLInputElement>document.getElementById("img-lg-zoom1");
    var str=elemid+index;
    var inputelem= <HTMLImageElement>document.getElementById(str);
    child.src =inputelem.src;
  }
  normalImg(){
    var child = <HTMLInputElement>document.getElementById("img-lg-zoom1");
    child.src="";
    $('.zoom-img-modal-lg').modal('hide');
    $('#addProductModal').modal('show')
    if(this.parent_modal){
      $(this.parent_modal).modal('show');
      this.parent_modal = undefined;
    }
  }

  resetAll(){
    this.subcategory_ids = [];
    this.search_string = "";
    this.class_ids = [];
    this.minimum_price = "";
    this.maximum_price = "";
    this.minimum_lead_time = "";
    this.maximum_lead_time = "";
    this.minimum_width = "";
    this.maximum_width = "";
    this.minimum_length = "";
    this.maximum_length = "";
    this.minimum_height = "";
    this.maximum_height = "";
    this.sort_key = "";
    this.liked = false;
    $(".sort-toggle").text('None');
  }

  clearAll(){
    this.resetAll();
    this.filterNewProducts();
  }

  fetchSavedProducts(){
    this.liked = true;
    this.filterNewProducts();


  }

  searchTextFilter(event){
    this.activateProduct('product');
    this.search_string = event.target.value;
    this.filterNewProducts();
  }


  product_detail:any = {};
  medium_image;
  fetchProductDetails(){
    this.loaderService.display(true);
    this.catalogueService.fetchProductDetails(this.product_id).subscribe(
      res => {
     
        this.product_detail = res.product;
        this.medium_image =  this.product_detail.all_image_urls;
        if(this.medium_image.length > 0){
          this.sendMidImge(this.medium_image[0].medium,0);
        }
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }

  master_option:any = [];
  listMasterOptions(){
    this.loaderService.display(true);
    this.catalogueService.listMasterOptions(this.product_id).subscribe(
      res => {
    
        this.master_option = res;
        if(this.master_option.length > 0){
          this.listSubOptions();
        }
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  sub_option:any = [];
  listSubOptions(){
    this.loaderService.display(true);
    this.catalogueService.listSubOptions(this.master_option[0].id).subscribe(
      res => {
        //
        this.sub_option = res;
        if(this.sub_option.length > 0){
          this.listCatalogueOptions();
        }
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }

  cat_option:any = [];
  listCatalogueOptions(){
    this.loaderService.display(true);
    this.catalogueService.listCatalogueOptions(this.sub_option[0].id).subscribe(
      res => {
        //
        this.cat_option = res;
        if(this.cat_option.length > 0){
          this.listVariations();
        }
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }

  fetchCatalogueOptions(option_id){
    this.loaderService.display(true);
    this.catalogueService.listCatalogueOptions(option_id).subscribe(
      res => {
        //
        this.cat_option = res;
        if(this.cat_option.length > 0){
          this.fetchVariation(this.cat_option[0].id);
        }
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }

  fetchVariation(option_id){
    this.loaderService.display(true);
    this.catalogueService.listVariations(option_id).subscribe(
      res => {
        //
        this.variation = res;
        this.modalQuantityandProductSelectionForm.patchValue({product_variant_id: this.variation[0].id});
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }

  variation:any = [];
  listVariations(){
    this.loaderService.display(true);
    this.catalogueService.listVariations(this.cat_option[0].id).subscribe(
      res => {
        //
        this.variation = res;
        this.modalQuantityandProductSelectionForm.patchValue({product_variant_id: this.variation[0].id});
        this.loaderService.display(false);
      },
      err => {
        //
        this.loaderService.display(false);
      }
    );
  }
  imageZoom(imgID, resultID) {
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    result.setAttribute("style","display: block;");

    if(this.count == 0){


      this.count =1;
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute('id', 'myLens');


    lens.setAttribute("style", "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);");


    }
    else{

    var element = document.getElementById('myLens');

    document.getElementById("myLens").remove();

    lens = document.createElement("DIV");
    lens.setAttribute('id', 'myLens');
    lens.setAttribute("style", "position: absolute;border: 1px solid #d4d4d4;width: 150px;height: 150px;background: rgba(255, 255, 255, 0.3);");

    }
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (lens.offsetWidth / 2);
      y = pos.y - (lens.offsetHeight / 2);
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
      if (x < 0) { x = 0; }
      if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
      if (y < 0) { y = 0; }
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }
  removeHover(resultID,index){
    var result1;
    result1 = document.getElementById(resultID);
    result1.setAttribute("style","display: none;");
    document.getElementById("myLens").remove();
    this.count= 0;
    //
  }

  goBack(){
    this.resetAll();
    this.activateProduct('product');
    this.initialiseState();
  }

  new;  
  selctedNew(event){
    if(event.target.checked){
      this.new = true;
      this.filterProducts();

    }
    else{
      this.new = '';
      this.filterProducts();
    } 
  }     



  viewMoreVariation(event){
    $(".form-possi").toggleClass("expand");
    if(event.target.textContent == "View More"){
      event.target.textContent = "View Less";
    }
    else if(event.target.textContent == "View Less"){
      event.target.textContent = "View More";

    }
  }
  setCombinationElement(event,idName,elementIndex,addOnsLength,addonIndex){
    
    if(elementIndex<0){
      elementIndex=addOnsLength-1;
    }else if (elementIndex>=addOnsLength){
      elementIndex=0;
    }
    for (let i=0; i<addOnsLength; i++){
      if($(`#${idName}-${addonIndex}-${i}`)){
        $(`#${idName}-${addonIndex}-${i}`).checked=false;;
        $(`#${idName}-${addonIndex}-${i}`).prop("checked", false).change();
      }
    }
    
    if($(`#${idName}-${addonIndex}-${elementIndex}`)){ 
      $(`#${idName}-${addonIndex}-${elementIndex}`).checked=true;
      $(`#${idName}-${addonIndex}-${elementIndex}`).prop("checked", true).change();
      this.ref.detectChanges;
    }
    this.addOnIndex[addonIndex]=elementIndex;
    
  
  }

  showLeft=true;
  showRight=true;

  checkConsistencyOfValues(){

    this.showLeft=true;
    this.showRight=true;

    this.shadeStartingIndex=0;
    this.shadeEndingIndex=3;
      
    if(this.globalVarArr.shutter_shade_code.length<=3)
    {
    
      this.showRight=false;
      this.showLeft=false;
    }

    if(this.shadeStartingIndex==0){
  
      this.showLeft=false;
    }
    if(this.shadeEndingIndex==this.globalVarArr.shutter_shade_code.length){
      this.showRight=false;
     
    }
    
  }

  nextThree(){
   
  
    this.showLeft=true;
    
    this.shadeStartingIndex=this.shadeStartingIndex+1;
    this.shadeEndingIndex=this.shadeEndingIndex + 1;

    if(this.shadeStartingIndex+2 >= this.globalVarArr.shutter_shade_code.length-1){
      this.showRight=false;
      
    }

    this.ref.detectChanges();
    // this.checkConsistencyOfValues();
  }
  prevThree(){
    this.showRight=true;
   
    this.shadeStartingIndex=this.shadeStartingIndex-1;
    this.shadeEndingIndex=this.shadeEndingIndex-1
    
    if(this.shadeEndingIndex-2<=1){
      this.showLeft=false;
    
    }



    this.ref.detectChanges();
  
  }


commaSeperatedValuesOfArray(accumulator, a) {
    return accumulator + ',' + a;
}

_isCombination(value){


  if(!value.value){
    return false;
  }

  if(value.value.split(';').length>1)
  {
    return true;
  }
  else
  {
    return false;
  }
}
arrivaeSelectValues=false;
showArrivaeValueToggle=false;
  
  
  arrivaeSelectValuesOnly(type,rowno?,data?)
  {
    // 
  
    this.showArrivaeValueToggle=true;
    
    this.selectedSectionsId = new Array();
    this.loaderService.display(true);
    this.quotationService.getGlobalVariable(type,this.arrivaeSelectValues).subscribe(
      res=>{
        this.globalVarArr = res;
        
        for(var j=0;j<this.selectedSections.length;j++){
          if(this.selectedSections[j]=='modular_wardrobe'){
            this.selectedSectionsId.push(res.modular_wardrobe_id.id)
          } else if(this.selectedSections[j]=='modular_kitchen'){
            this.selectedSectionsId.push(res.modular_kitchen_id.id)
          }
        }
        this.getBoqConfig(type);
  
        if(this.globalVarArr){
          this.globalVarArr['shutter_shade_code']=[];
        }
        this.loaderService.display(true);
        this.quotationService.listofShutterFinishes(data?data.shutter_material.name:this.addGlobalVariableForm.controls['shutter_material'].value,this.arrivaeSelectValues).subscribe(
          res=>{
            this.globalVarArr.shutter_finish=res.shutter_finishes;
            this.ref.detectChanges();
            this.loaderService.display(false);
            
            this.quotationService.listofShutterFinishShades(data?data.shutter_finish.name:this.addGlobalVariableForm.controls['shutter_finish'].value,this.arrivaeSelectValues).subscribe(
              res=>{
                this.globalVarArr.shutter_shade_code=res.shades;
                if(this.globalVarArr.category=='kitchen'){
                  this.shadeImg = undefined;
                } else if(this.globalVarArr.category=='wardrobe'){
                  this.shadeImgMW =undefined;
                }
                
                this.loaderService.display(false);

                if(data && data.category=='kitchen'){
                 
                  this.listofSkirtingHeights(data.skirting_config_type);
                }else{
                  this.listofSkirtingHeights(this.addGlobalVariableForm.controls['skirting_config_height'].value);
                }
              },
              err=>{
                this.loaderService.display(false);
              }
            );
          },
          err=>{
            this.loaderService.display(false);
          }
        );
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
    
    // this.arrivaeSelectValues=false;

  }
  fetchArrivaeSelectValues(){
    if(this.globalVarArr.category=='kitchen'){
      this.arrivaeSelectValuesOnly(this.globalVarArr.category,'',this.boqConfigMKVal)
    }
    if(this.globalVarArr.category=='wardrobe'){
      this.arrivaeSelectValuesOnly(this.globalVarArr.category,'',this.boqConfigMWVal)
    }
  }



  //To get Coustom Furniture Layout List
  custom_furniture_list;
  custom_furniture_space;
  getCFlayoutList(space){
    this.custom_furniture_space = space;
    this.loaderService.display(true);
    this.quotationService.getCFlayoutList().subscribe(
      res => {
        this.custom_furniture_list = res.shangpin_layouts;
        $('#CFlayoutlistmodal').modal('show');
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
    });
  }
  
  //to upload custom furniture excel
  formatData;
  uploadCfExcel(selSpaceCF,index){
    selSpaceCF=this.selectedSpace;
    this.loaderService.display(true);
    this.file_name= $('input[name=file_type]:checked').val();
  
    this.quotationService.uploadCfExcel(this.projectId,this.quotation_id,this.basefile,selSpaceCF,this.file_name).subscribe(
      res=>{
        this.quotationDetails=res.quotation;
        
  
        $('#selectExcelType').modal('hide');
        $('input[name=file_type]:checked').prop('checked',false);
        // if(res.quotation.errors.length>0){
        //   var str = 'kdmax_errorblock'+lineno;
        //   document.getElementById(str).classList.remove('d-none');
        // }
        if(res.quotation.errors.length==0){
          this.successMessageShow('Uploaded successfully!');
        }
        this.loaderService.display(false);
        this.successMessageShow('Uploaded successfully!');
        $('#uploadInput'+index).val('');
        $('input[name=attachment_file]').val('');
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      });
  }

  //To get custome furniture space name
  CfSpacename;
  passSpaceName(sapcename){
    this.CfSpacename = sapcename;
    // 
  }

  //To save custom furniture layout
  saveCustomFurniture(formval){
    this.loaderService.display(true);
    var custom_furniture_ids=[];
    var appliance_job_ids=[];
    var extra_job_ids=[];
    var keys_arr;
    keys_arr=Object.keys(this.quotationDetails.shangpin_jobs_cabinet);
    var keys_arr1=Object.keys(this.quotationDetails.shangpin_jobs_door);
    var keys_arr2=Object.keys(this.quotationDetails.shangpin_jobs_accessory);
    var keys_arr3=Object.keys(this.quotationDetails.shangpin_jobs_sliding_door);
    var keys_arr4=Object.keys(this.quotationDetails.shangpin_jobs_wardrobe);

    for(var i=0;i<keys_arr.length;i++){
      if(keys_arr[i]==this.CfSpacename){
        for(var j=0;j<this.quotationDetails.shangpin_jobs_cabinet[keys_arr[i]].length;j++){
          // 
          custom_furniture_ids.push(this.quotationDetails.shangpin_jobs_cabinet[keys_arr[i]][j].id);
        }
      }
    }

    for(var i=0;i<keys_arr1.length;i++){
      if(keys_arr1[i]==this.CfSpacename){
        for(var j=0;j<this.quotationDetails.shangpin_jobs_door[keys_arr[i]].length;j++){
          // 
          custom_furniture_ids.push(this.quotationDetails.shangpin_jobs_door[keys_arr1[i]][j].id);
        }
      }
    }

    for(var i=0;i<keys_arr2.length;i++){
      if(keys_arr2[i]==this.CfSpacename){
        for(var j=0;j<this.quotationDetails.shangpin_jobs_accessory[keys_arr2[i]].length;j++){
          // 
          custom_furniture_ids.push(this.quotationDetails.shangpin_jobs_accessory[keys_arr2[i]][j].id);
        }
      }
    }

    for(var i=0;i<keys_arr3.length;i++){
      if(keys_arr3[i]==this.CfSpacename){
        for(var j=0;j<this.quotationDetails.shangpin_jobs_sliding_door[keys_arr3[i]].length;j++){
          // 
          custom_furniture_ids.push(this.quotationDetails.shangpin_jobs_sliding_door[keys_arr3[i]][j].id);
        }
      }
    }

    for(var i=0;i<keys_arr4.length;i++){
      if(keys_arr3[i]==this.CfSpacename){
        for(var j=0;j<this.quotationDetails.shangpin_jobs_wardrobe[keys_arr4[i]].length;j++){
          // 
          custom_furniture_ids.push(this.quotationDetails.shangpin_jobs_wardrobe[keys_arr4[i]][j].id);
        }
      }
    }

    for(var i=0;i<custom_furniture_ids.length;i++){
      
    }
    var data= {
      'shangpin_layout':{
        'name': formval.name,
        'remark': formval.remark
      },
      'shangpin_job_ids': custom_furniture_ids
    }
    this.quotationService.saveCustomFurnitureLayout(data).subscribe(
      res=>{
        this.successalert = true;
        this.successMessageShow('Layout saved successfully!');
        this.saveMkwLayoutForm.reset();
        this.loaderService.display(false);
        $('#saveCfLayoutModal').modal('hide');
        this.saveMkwLayoutForm.reset();
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  //To import custom furniture in BOQ
  importCFLayoutToSpace(id){
    this.loaderService.display(true);
    
    this.quotationService.importCFLayoutToSpace(this.projectId,this.quotation_id,this.custom_furniture_space,id).subscribe(
      res=>{
        this.quotationDetails=res.quotation;
        $('#CFlayoutlistmodal').modal('hide');
        this.successMessageShow('Layout imported successfully');
        this.closeImportLayoutModal();
        this.loaderService.display(false);
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
    });
  }

  //to get the details of a custom furniture layout
  cflayoutDetail;
  getCFLayoutDetail(id){
    this.loaderService.display(true);
    this.quotationService.getDetailsOfCFLayouts(id).subscribe(
      res => {
        this.cflayoutDetail=res.json().shangpin_layout;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
    });
  }

  //to delete a custom furniture layout
  cfIds;
  removeCfProductToBoqs(id){
    this.cfIds = id;
    this.loaderService.display(true);
    this.quotationService.deleteCustomFurnitureLayout(this.projectId,this.quotation_id,this.cfIds).subscribe(
      res => {
        this.quotationDetails=res.quotation;
        this.successalert = true;
        this.successMessageShow('Layout delete successfully!');
        this.loaderService.display(false);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 10000);
      },
      err => {
        this.loaderService.display(false);
    });
  }
  labelList:any;
  indexofType;
  labelKey;
  ownerableId;
  ownerableType;
  isCombined;
  combinedIndex;
  shangpinType;
  transferLabelList(labelKey,labelList,index,ownerableId,ownerableType,isCombined=false,combinedIndex=0,shangpinType=""){
    
    this.indexofType = index;
    this.labelList = labelList;
    this.labelKey = labelKey;
    this.ownerableId = ownerableId;
    this.ownerableType= ownerableType;
    this.isCombined=isCombined;
    this.combinedIndex=combinedIndex;
    this.shangpinType=shangpinType;
    
  }

  deleteLabel(labelIndex,id){
    this.loaderService.display(true);
    this.quotationService.deleteLabelOfLineItem(this.projectId,this.quotation_id,id).subscribe(
      res=>{
            this.successMessageShow('Label deleted successfully!');
            if(this.selectedsectionName == 'modular_kitchen' ){
              
              if(this.ownerableType=="ModularJob"){
                this.quotationDetails.modular_jobs_kitchen[this.labelKey][this.indexofType]=JSON.parse(res._body).modular_job;
                this.labelList=this.quotationDetails.modular_jobs_kitchen[this.labelKey][this.indexofType].labels
              }
              if(this.ownerableType=="ApplianceJob"){
                this.quotationDetails.appliance_jobs[this.labelKey][this.indexofType]=JSON.parse(res._body).appliance_job;
                this.labelList=this.quotationDetails.appliance_jobs[this.labelKey][this.indexofType].labels  
              }
              if(this.ownerableType=="ExtraJob"){
              this.quotationDetails.extra_jobs_kitchen[this.labelKey][this.indexofType]=JSON.parse(res._body).extra_job;
              this.labelList=this.quotationDetails.extra_jobs_kitchen[this.labelKey][this.indexofType].labels  
              }    
            }
            if(this.selectedsectionName == 'modular_wardrobe' ){
              if(this.isCombined){
                if(this.ownerableType=="ModularJob"){
                  this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].included_modules[this.combinedIndex]=JSON.parse(res._body).modular_job;
                  this.labelList=this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].included_modules[this.combinedIndex].labels;
                }
              }
              else{
                if(this.ownerableType=="ModularJob"){
                  this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).modular_job;
                  this.labelList=this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].labels
                } else if(this.ownerableType=="ExtraJob"){
                  this.quotationDetails.extra_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).extra_job;
                  this.labelList=this.quotationDetails.extra_jobs_wardrobe[this.labelKey][this.indexofType].labels  
                }
              }
              this.ref.detectChanges();
            }
            if(this.selectedsectionName == 'loose_furniture' ){
              if(this.ownerableType=="Boqjob"){
                this.quotationDetails.boqjobs[this.labelKey][this.indexofType]=JSON.parse(res._body).boqjob;
                this.labelList=this.quotationDetails.boqjobs[this.labelKey][this.indexofType].labels 
              } 
            }
            if(this.selectedsectionName == 'custom_elements' ){
              if(this.ownerableType=="CustomJob"){
                this.quotationDetails.custom_jobs[this.labelKey][this.indexofType]=JSON.parse(res._body).custom_job;
                this.labelList=this.quotationDetails.custom_jobs[this.labelKey][this.indexofType].labels 
              } 
            }
            if(this.selectedsectionName == 'custom_furniture' ){
              if(this.ownerableType=="ShangpinJob"){
                if(this.shangpinType=='door'){
                  this.quotationDetails.shangpin_jobs_door[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
                  this.labelList=this.quotationDetails.shangpin_jobs_door[this.labelKey][this.indexofType].labels  
                }
                if(this.shangpinType=='cabinet'){
                  this.quotationDetails.shangpin_jobs_cabinet[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
                  this.labelList=this.quotationDetails.shangpin_jobs_cabinet[this.labelKey][this.indexofType].labels  
                }
                if(this.shangpinType=='accessory'){
                  this.quotationDetails.shangpin_jobs_accessory[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
                  this.labelList=this.quotationDetails.shangpin_jobs_accessory[this.labelKey][this.indexofType].labels  
                }
                if(this.shangpinType=='slidingDoor'){
                  this.quotationDetails.shangpin_jobs_sliding_door[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
                  this.labelList=this.quotationDetails.shangpin_jobs_sliding_door[this.labelKey][this.indexofType].labels  
                }
                if(this.shangpinType=='wardrobe'){
                  this.quotationDetails.shangpin_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
                  this.labelList=this.quotationDetails.shangpin_jobs_wardrobe[this.labelKey][this.indexofType].labels  
                }
              }     
            }

        this.editLabelShow[labelIndex]=false;
        this.loaderService.display(false);
        this.ref.detectChanges();
      },
      err=>{
        this.errorMessageShow(JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    )
  this.loaderService.display(false);
}
editLabelShow=new Array(100).fill(false);
editLabelValue;
editLabelSignal(labelIndex,labelName){
  this.editLabelShow[labelIndex]=!this.editLabelShow[labelIndex];
  this.editLabelValue=labelName;
}
editLabel(labelIndex,labelName,id){
  this.loaderService.display(true);
  this.quotationService.editLabelOfLineItem(this.projectId,this.quotation_id,id,labelName).subscribe(
    res=>{
      this.successMessageShow('Label Edited successfully!');
      if(this.selectedsectionName == 'modular_kitchen' ){
              
        if(this.ownerableType=="ModularJob"){
          this.quotationDetails.modular_jobs_kitchen[this.labelKey][this.indexofType]=JSON.parse(res._body).modular_job;
          this.labelList=this.quotationDetails.modular_jobs_kitchen[this.labelKey][this.indexofType].labels
        }
        if(this.ownerableType=="ApplianceJob"){
          this.quotationDetails.appliance_jobs[this.labelKey][this.indexofType]=JSON.parse(res._body).appliance_job;
          this.labelList=this.quotationDetails.appliance_jobs[this.labelKey][this.indexofType].labels  
        }
        if(this.ownerableType=="ExtraJob"){
        this.quotationDetails.extra_jobs_kitchen[this.labelKey][this.indexofType]=JSON.parse(res._body).extra_job;
        this.labelList=this.quotationDetails.extra_jobs_kitchen[this.labelKey][this.indexofType].labels  
        }    
      }
      if(this.selectedsectionName == 'modular_wardrobe' ){
        if(this.isCombined){
          if(this.ownerableType=="ModularJob"){
            this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].included_modules[this.combinedIndex]=JSON.parse(res._body).modular_job;
            this.labelList=this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].included_modules[this.combinedIndex].labels;
          }
        }
        else{
          if(this.ownerableType=="ModularJob"){
            this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).modular_job;
            this.labelList=this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].labels
          }
          else if(this.ownerableType=="ExtraJob"){
            this.quotationDetails.extra_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).extra_job;
            this.labelList=this.quotationDetails.extra_jobs_wardrobe[this.labelKey][this.indexofType].labels  
          }
        }
        this.ref.detectChanges();
      }
      if(this.selectedsectionName == 'loose_furniture' ){
        if(this.ownerableType=="Boqjob"){
          this.quotationDetails.boqjobs[this.labelKey][this.indexofType]=JSON.parse(res._body).boqjob;
          this.labelList=this.quotationDetails.boqjobs[this.labelKey][this.indexofType].labels 
        } 
      }
      if(this.selectedsectionName == 'custom_elements' ){
        if(this.ownerableType=="CustomJob"){
          this.quotationDetails.custom_jobs[this.labelKey][this.indexofType]=JSON.parse(res._body).custom_job;
          this.labelList=this.quotationDetails.custom_jobs[this.labelKey][this.indexofType].labels 
        } 
      }
      if(this.selectedsectionName == 'custom_furniture' ){
        if(this.ownerableType=="ShangpinJob"){
          if(this.shangpinType=='door'){
            this.quotationDetails.shangpin_jobs_door[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
            this.labelList=this.quotationDetails.shangpin_jobs_door[this.labelKey][this.indexofType].labels  
          }
          if(this.shangpinType=='cabinet'){
            this.quotationDetails.shangpin_jobs_cabinet[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
            this.labelList=this.quotationDetails.shangpin_jobs_cabinet[this.labelKey][this.indexofType].labels  
          }
          if(this.shangpinType=='accessory'){
            this.quotationDetails.shangpin_jobs_accessory[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
            this.labelList=this.quotationDetails.shangpin_jobs_accessory[this.labelKey][this.indexofType].labels  
          }
          if(this.shangpinType=='slidingDoor'){
            this.quotationDetails.shangpin_jobs_sliding_door[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
            this.labelList=this.quotationDetails.shangpin_jobs_sliding_door[this.labelKey][this.indexofType].labels  
          }
          if(this.shangpinType=='wardrobe'){
            this.quotationDetails.shangpin_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
            this.labelList=this.quotationDetails.shangpin_jobs_wardrobe[this.labelKey][this.indexofType].labels  
          }
        }     
      }
     
      this.editLabelShow[labelIndex]=false;
      this.loaderService.display(false);
      this.ref.detectChanges();
    },
    err=>{
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.loaderService.display(false);
    }
  )
  this.loaderService.display(false);

}
openAddLabel= false;
addLabelValue=''
openAddLabelForm(){
  this.openAddLabel = !this.openAddLabel;
}
addLabel(value){
  this.loaderService.display(true);
  this.quotationService.addLabelToLineItem(this.projectId,this.quotation_id,this.ownerableType,this.ownerableId,value).subscribe(
    res=>{
      this.successMessageShow('Label Added successfully!');

        this.ref.detectChanges();
        
        if(this.selectedsectionName == 'modular_kitchen' ){
              
          if(this.ownerableType=="ModularJob"){
            this.quotationDetails.modular_jobs_kitchen[this.labelKey][this.indexofType]=JSON.parse(res._body).modular_job;
            this.labelList=this.quotationDetails.modular_jobs_kitchen[this.labelKey][this.indexofType].labels
          }
          if(this.ownerableType=="ApplianceJob"){
            this.quotationDetails.appliance_jobs[this.labelKey][this.indexofType]=JSON.parse(res._body).appliance_job;
            this.labelList=this.quotationDetails.appliance_jobs[this.labelKey][this.indexofType].labels  
          }
          if(this.ownerableType=="ExtraJob"){
          this.quotationDetails.extra_jobs_kitchen[this.labelKey][this.indexofType]=JSON.parse(res._body).extra_job;
          this.labelList=this.quotationDetails.extra_jobs_kitchen[this.labelKey][this.indexofType].labels  
          }    
        }
        if(this.selectedsectionName == 'modular_wardrobe' ){
          if(this.isCombined){
            if(this.ownerableType=="ModularJob"){
              this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].included_modules[this.combinedIndex]=JSON.parse(res._body).modular_job;
              this.labelList=this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].included_modules[this.combinedIndex].labels;
            }
          }
          else{
            if(this.ownerableType=="ModularJob"){
              this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).modular_job;
              this.labelList=this.quotationDetails.modular_jobs_wardrobe[this.labelKey][this.indexofType].labels
            }else if(this.ownerableType=="ExtraJob"){
              this.quotationDetails.extra_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).extra_job;
              this.labelList=this.quotationDetails.extra_jobs_wardrobe[this.labelKey][this.indexofType].labels  
            }
          }
          this.ref.detectChanges();
        }
        if(this.selectedsectionName == 'loose_furniture' ){
          if(this.ownerableType=="Boqjob"){
            this.quotationDetails.boqjobs[this.labelKey][this.indexofType]=JSON.parse(res._body).boqjob;
            this.labelList=this.quotationDetails.boqjobs[this.labelKey][this.indexofType].labels 
          } 
        }
        if(this.selectedsectionName == 'custom_elements' ){
          if(this.ownerableType=="CustomJob"){
            this.quotationDetails.custom_jobs[this.labelKey][this.indexofType]=JSON.parse(res._body).custom_job;
            this.labelList=this.quotationDetails.custom_jobs[this.labelKey][this.indexofType].labels 
          } 
        }
        if(this.selectedsectionName == 'custom_furniture' ){
          if(this.ownerableType=="ShangpinJob"){
            if(this.shangpinType=='door'){
              this.quotationDetails.shangpin_jobs_door[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
              this.labelList=this.quotationDetails.shangpin_jobs_door[this.labelKey][this.indexofType].labels  
            }
            if(this.shangpinType=='cabinet'){
              this.quotationDetails.shangpin_jobs_cabinet[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
              this.labelList=this.quotationDetails.shangpin_jobs_cabinet[this.labelKey][this.indexofType].labels  
            }
            if(this.shangpinType=='accessory'){
              this.quotationDetails.shangpin_jobs_accessory[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
              this.labelList=this.quotationDetails.shangpin_jobs_accessory[this.labelKey][this.indexofType].labels  
            }
            if(this.shangpinType=='slidingDoor'){
              this.quotationDetails.shangpin_jobs_sliding_door[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
              this.labelList=this.quotationDetails.shangpin_jobs_sliding_door[this.labelKey][this.indexofType].labels  
            }
            if(this.shangpinType=='wardrobe'){
              this.quotationDetails.shangpin_jobs_wardrobe[this.labelKey][this.indexofType]=JSON.parse(res._body).shangpin_job;
              this.labelList=this.quotationDetails.shangpin_jobs_wardrobe[this.labelKey][this.indexofType].labels  
            }
          }     
        }
       
      this.addLabelValue='';
      this.loaderService.display(false);
      this.openAddLabel=false; 
      this.ref.detectChanges();   
    },
    err=>{
      this.errorMessageShow(JSON.parse(err['_body']).message);
      this.loaderService.display(false);
    }
  )
  this.loaderService.display(false);
}
}