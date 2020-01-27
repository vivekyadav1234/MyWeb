import { Component, OnInit } from '@angular/core';
import {QuotationService} from '../../quotation/quotation.service';
import { PresentationService } from '../../presentation/presentation.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { environment } from 'environments/environment';
import  { CustomerService} from '../customer.service';
import { LoaderService } from '../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { CatalogueService } from '../../organisation/catalogue/catalogue.service';
import { LeadService } from '../../lead/lead.service';
declare var $:any;

@Component({
  selector: 'app-view-boq',
  templateUrl: './view-boq.component.html',
  styleUrls: ['./view-boq.component.css'],
  providers: [PresentationService,QuotationService,CustomerService,LeadService,CatalogueService]
})
export class ViewBoqComponent implements OnInit {


  

  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  qid:number;
  lead_id;
  projectId;
  editBtnFlag = false;
  Object=Object;
  quotations;
  role;
  globalVarArr;
  selectedSections = new Array();
  selectedsectionName;
  proposalDocId;
  proposal_status;
  approvalForm:  FormGroup;

  customizationModule_MW_details;
  customizationModule_MK_details;
  customizationModule_MW_Form:FormGroup = new FormGroup({
    core_material:new FormControl(""),
    shutter_material:new FormControl(""),
    shutter_finish:new FormControl(""),
    shutter_shade_code:new FormControl(""),
    edge_banding_shade_code:new FormControl(""),
    door_handle_code: new FormControl(""),
    shutter_handle_code:new FormControl(""),
    hinge_type: new FormControl(""),
    channel_type:new FormControl(""),
    hardware_brand:new FormControl(""),
    addons:this.formBuilder.array([]),
    // custom_elements:this.formBuilder.array([]),
    // number_door_handles:new FormControl(""),
    number_exposed_sites: new FormControl(""),
    cust_edge_banding_shade_code:new FormControl(""),
    cust_shutter_shade_code:new FormControl("")
    // number_shutter_handles:new FormControl("")
  })


  customizationModule_MK_Form:FormGroup = new FormGroup({
    core_material:new FormControl("",Validators.required),
    shutter_material:new FormControl("",Validators.required),
    shutter_finish:new FormControl("",Validators.required),
    shutter_shade_code:new FormControl("",Validators.required),
    edge_banding_shade_code:new FormControl("",Validators.required),
    door_handle_code: new FormControl("",Validators.required),
    hinge_type: new FormControl("",Validators.required),
    channel_type:new FormControl("",Validators.required),
    hardware_brand:new FormControl("",Validators.required),
    skirting_config_type:new FormControl("",Validators.required),
    skirting_config_height:new FormControl("",Validators.required),
    addons:this.formBuilder.array([]),
    compulsory_addons:this.formBuilder.array([]),
    number_exposed_sites: new FormControl("",Validators.required),
    cust_edge_banding_shade_code:new FormControl(""),
    cust_shutter_shade_code:new FormControl("")
    //gola_profile: new FormControl("")
  })
  combinedModulesForm:FormGroup=new FormGroup({
    description:new FormControl("",Validators.required),
    space:new FormControl("",Validators.required),
    combined_door_id:new FormControl("",Validators.required),
    modular_job_ids:new FormArray([])
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
  })
  addModuleFormMk:FormGroup = new FormGroup({
    space:new FormControl(""),
    category:new FormControl(""),
    kitchen_category:new FormControl(""),
    module_type: new FormControl("",Validators.required),
    module:new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required),
    custom_shelf_unit_width:new FormControl("")
  })

  addApplianceFormMk:FormGroup = new FormGroup({
    id:new FormControl("",Validators.required),
    module_type_id: new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required),
  })

  addServiceFormSERV:FormGroup = new FormGroup({
    // space:new FormControl(""),
    // category:new FormControl(""),
    // kitchen_category:new FormControl(""),
    category: new FormControl("",Validators.required),
    sub_category:new FormControl("",Validators.required),
    activity:new FormControl("",Validators.required),
    quantity:new FormControl("",Validators.required),
    base_rate:new FormControl("",Validators.required),
  })

  addCustomElemForm:FormGroup = new FormGroup({
    space:new FormControl(""),
    id:new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required),
    image:new FormControl("")
  })


  addSectionToBoqForm : FormGroup;
  deleteSectionToBoqForm:FormGroup;

  addExtraFormMk:FormGroup = new FormGroup({
    id:new FormControl("",Validators.required),
    qty:new FormControl("",Validators.required)
  })

  addAddon_for_addon_FormMk:FormGroup = new FormGroup({
    id:new FormControl(""),
    qty:new FormControl("",Validators.required)
  })

  constructor(
    private quotationService :QuotationService,
    private loaderService : LoaderService,
    private route: ActivatedRoute,
    private router:Router,
    private formBuilder:FormBuilder,
    private _location: Location,
    private leadService:LeadService,
    private catalogueService:CatalogueService,
    private customerService : CustomerService,
    private fb: FormBuilder, 
  ) {
     this.approvalForm = fb.group({
      'proposal_doc_id': ['', Validators.required],
      'is_approved' : ['', Validators.required],
      'remark': ['']
    }); 



   }

  ngOnInit() {
    this.role = localStorage.getItem('user');
 
    this.modalQuantityandProductSelectionForm = this.formBuilder.group({
      productQty : new FormControl(1)
    });

    this.route.params.subscribe(params => {
      this.qid = params['boqId'];
      this.projectId = params['projectId'];
      this.proposalDocId = params['docId'];
    });
     this.route.queryParams.subscribe(params => {
      this.proposal_status = params['status'];

    });
    this.listOfSpacesBoqConfig();
    // this.getSelectedSections();
    this.viewQuotationDetails();
     this.getPaymentDetails();
    this.fetchBasicDetails();
    this.all_activity_service = this.getServiceActivity();

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
  backClicked() {
    this._location.back();
  }
  boqApproval(doc_id, status){
    this.loaderService.display(true);
    this.approvalForm.patchValue({proposal_doc_id: doc_id});
    this.approvalForm.patchValue({is_approved: status});

    this.customerService.boqApproval(this.approvalForm.value).subscribe(
      res => {

        $('#myProposal').modal('hide'); 
        $('#approvalModal').modal('hide'); 
        
        this.loaderService.display(false);
        this.viewQuotationDetails();
        this.proposal_status = 'yes';
      },
      err => {
      });
  }
  activated_doc_id;
   approveBoq(){
    this.boqApproval(this.activated_doc_id, true);
  }
  buildCompAddons(val) {
    return new FormGroup({
      slot: new FormControl(val['slot'],Validators.required),
      id: new FormControl(val['id'],Validators.required),
      name:new FormControl(val['name']),
      quantity: new FormControl("1",Validators.required),
      image:new FormControl(val['addon_image']),
      brand_id:new FormControl(val['brand_id']),
      addons_for_addons: this.formBuilder.array([])
    })
  }
  buildAddons(val?) {
    return new FormGroup({
      id: new FormControl((val)?val['id']:"", Validators.required),
      quantity: new FormControl((val)?val['quantity']:"",Validators.required),
      image:new FormControl((val)?val['addon_image']:""),
      name:new FormControl((val)?val['name']:"")
    })
  }
  buildAddonsForAddons(val?,val2?){
    var addonFormGroup =new FormGroup({
      id: new FormControl((val)?val['id']:"", Validators.required),
      name:new FormControl((val)?val['name']:""),
      quantity: new FormControl((val)?val['quantity']:"",Validators.required),
      addon_image:new FormControl((val)?val['addon_image']:""),
    });
    if(!val2) {
      addonFormGroup.controls['compulsory_addon_id']= new FormControl((val)?val['compulsory_addon_id']:"");
      addonFormGroup.controls['slot']= new FormControl((val)?val['slot']:"");
    } else {
      addonFormGroup.controls['compulsory_addon_id']= new FormControl(val2.id.value);
      addonFormGroup.controls['slot']= new FormControl(val2.slot.value);
    }
    return addonFormGroup;
  }
  addNestedAddons(val){
    const getFun = this.customizationModule_MW_Form.get('addons') as FormArray;
    getFun.push(this.buildAddons(val))
  }
  addNestedCompAddonsMk(val){
    const getFun = this.customizationModule_MK_Form.get('compulsory_addons') as FormArray;
    getFun.push(this.buildCompAddons(val))
  }
  addNestedAddonsMk(val){
    const getFun = this.customizationModule_MK_Form.get('addons') as FormArray;
    getFun.push(this.buildAddons(val))
  }

  addAddonForAddons(val,val2?,index?){
    const getFun = (<FormArray>(<FormArray>this.customizationModule_MK_Form.get('compulsory_addons')).controls[index]).controls['addons_for_addons'];
    getFun.push(this.buildAddonsForAddons(val,val2))
  }

  getSelectedSections(arg?){
    // this.selectedSections = ['modular_wardrobe'];
    this.selectedsectionName =  this.selectedSections[0];
    if(this.selectedsectionName=='modular_wardrobe'){
      // this.getGlobalVariable('wardrobe');
      this.getModuleTypes('wardrobe');
      this.changeSectionTab('modular_wardrobe');
    } else if(this.selectedsectionName=='modular_kitchen'){
      // this.getGlobalVariable('kitchen');
      this.getModuleTypes('kitchen');
      this.getKitchenCategories();
      this.getApplianceTypes();
      this.changeSectionTab('modular_kitchen');
    } else if(this.selectedsectionName=='loose_furniture'){
        this.changeSectionTab('loose_furniture');
    } else if(this.selectedsectionName=='services'){
        this.changeSectionTab('services');
    } else if(this.selectedsectionName=='custom_elements'){
      this.changeSectionTab('custom_elements');
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

  kitchenCatArr;
  getKitchenCategories(){
    this.loaderService.display(true);
    this.quotationService.getKitchenCategories().subscribe(
      res=>{
        this.kitchenCatArr=res.kitchen_categories;
        // this.getKitchenExtras();
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  kitchenExtras;
  listofShutterFinishes(val,arg?){
    this.loaderService.display(true);
    this.quotationService.listofShutterFinishes(val).subscribe(
      res=>{
        this.globalVarArr.shutter_finish=res.shutter_finishes;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  listofShutterFinishShades(val,arg?){
    this.loaderService.display(true);
    this.quotationService.listofShutterFinishShades(val).subscribe(
      res=>{
        this.globalVarArr.shutter_shade_code=res.shades;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  listofSkirtingHeights(val,arg?){
    this.loaderService.display(true);
    this.quotationService.listofSkirtingConfigs(val).subscribe(
      res=>{
        this.globalVarArr.skirting_config_height=res.skirting_configs;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  globalVarMk;
  globalVarMW;
  viewQuotationDetails(){
    this.loaderService.display(true);
    this.quotationService.viewQuotationDetails(this.projectId,this.qid).subscribe(
      res => {
        this.loaderService.display(false);
        this.quotations = res.quotation;
        this.selectedSpacesArr = res.quotation.spaces;
        this.selectedSpacesArrMK = res.quotation.spaces_kitchen;
        this.selectedSpacesArrLf = res.quotation.spaces_loose;
        this.selectedSpacesArrSERV = res.quotation.spaces_services;
        this.selectedSpacesArrCustomEle= res.quotation.spaces_custom;
        for(var l=0;l<this.quotations.boq_global_configs.length;l++){
          if(this.quotations.boq_global_configs[l].category=='wardrobe'){
            this.globalVarMW = this.quotations.boq_global_configs[l];
          } else if (this.quotations.boq_global_configs[l].category=='kitchen') {
            this.globalVarMk = this.quotations.boq_global_configs[l];
          }
        }
        if(Object.keys(this.quotations.modular_jobs_kitchen).length>0 ||
          Object.keys(this.quotations.appliance_jobs).length>0 ||
          Object.keys(this.quotations.extra_jobs).length>0){
          if(!this.selectedSections.includes('modular_kitchen')){
            this.selectedSections.push('modular_kitchen');
          }
        }
        if(Object.keys(this.quotations.modular_jobs_wardrobe).length>0){
          if(!this.selectedSections.includes('modular_wardrobe')){
            this.selectedSections.push('modular_wardrobe');
          }
        }
        if(Object.keys(this.quotations.boqjobs).length>0){
          if(!this.selectedSections.includes('loose_furniture')){
            this.selectedSections.push('loose_furniture');
          }
        }
        if(Object.keys(this.quotations.service_jobs).length>0){
          if(!this.selectedSections.includes('services')){
            this.selectedSections.push('services');
          }
        }
        if(Object.keys(this.quotations.custom_jobs).length>0){
          if(!this.selectedSections.includes('custom_elements')){
            this.selectedSections.push('custom_elements');
          }
        }
        for(var l=0;l<Object.keys(this.quotations.boqjobs).length;l++){
          for(var m=0;m<this.quotations.boqjobs[Object.keys(this.quotations.boqjobs)[l]].length;m++){
            this.boqProducts_all.push(this.quotations.boqjobs[Object.keys(this.quotations.boqjobs)[l]][m]);
            this.boqProducts.push(this.quotations.boqjobs[Object.keys(this.quotations.boqjobs)[l]][m]);
          }
        }

        for(var l=0;l<Object.keys(this.quotations.service_jobs).length;l++){
          for(var m=0;m<this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]].length;m++){
            this.boqServices_all.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
            this.boqServices.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
          }
        }
        this.getSelectedSections();
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  getCustomizationOfModule(modId){
    this.loaderService.display(true);
    this.quotationService.getCustomizationOfModule(modId,this.projectId,this.qid).subscribe(
      res=>{
        if(res.modular_job.category=='wardrobe'){
          this.customizationModule_MW_details=res.modular_job;
          this.setCustomizationFormValues(this.customizationModule_MW_details);
        } else if(res.modular_job.category=='kitchen'){
          this.customizationModule_MK_details=res.modular_job;
          this.getHandleList(this.customizationModule_MK_details.shutter_finish,this.customizationModule_MK_details.product_module_id);
          this.setCustomizationFormValues(this.customizationModule_MK_details);
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
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
    if(formval.category=="wardrobe"){
      this.customizationModule_MW_Form.controls['core_material'].setValue(formval.core_material);
      this.customizationModule_MW_Form.controls['shutter_material'].setValue(formval.shutter_material);
      this.listofShutterFinishes(formval.shutter_material);
      this.customizationModule_MW_Form.controls['shutter_finish'].setValue(formval.shutter_finish);
      this.listofShutterFinishShades(formval.shutter_finish);
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
          // this.customizationModule_MW_Form.controls['addons']['controls'].push(new FormGroup({
          //   id: new FormControl(formval.addons[l].name),
          //   quantity: new FormControl(formval.addons[l].quantity),
          //   image:new FormControl(formval.addons[l].addon_image)
          // }));
          this.addNestedAddons(formval.addons[l]);
        } else {
          // this.customizationModule_MW_Form.controls['addons']['controls'].push(new FormGroup({
          //   id: new FormControl(formval.addons[l].id),
          //   quantity: new FormControl(formval.addons[l].quantity),
          //   image:new FormControl(formval.addons[l].addon_image)
          // }));
          this.addNestedAddons(formval.addons[l]);
        }

      }
    } else if(formval.category=="kitchen"){
      this.customizationModule_MK_Form.controls['core_material'].setValue(formval.core_material);
      this.customizationModule_MK_Form.controls['shutter_material'].setValue(formval.shutter_material);
      this.listofShutterFinishes(formval.shutter_material);
      this.customizationModule_MK_Form.controls['shutter_finish'].setValue(formval.shutter_finish);
      this.listofShutterFinishShades(formval.shutter_finish);
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
      this.listofSkirtingHeights(formval.skirting_config_type);
      if(!this.editBtnFlag){
        this.customizationModule_MK_Form.controls['hardware_brand'].setValue(formval.brand_name);
      } else {
        this.customizationModule_MK_Form.controls['hardware_brand'].setValue(formval.brand_id);
      }
      for(var l=0;l<formval.compulsory_addons.length;l++){
        for(var k=0;k<formval.compulsory_addons[l].allowed_addons.length;k++){
          //formval.compulsory_addons[l].allowed_addons[k]['slot']=formval.compulsory_addons[l].slot;
          this.compulsoryAddonsList.push(formval.compulsory_addons[l].allowed_addons[k]);
        }
      }
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
        var str2 = 'compulsory_addons'+k2;
         this.addNestedCompAddonsMk(formval.compulsory_addons[k2]);
      }

      if(formval.addons.length>0){
        var formelem=(<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls;
        for(var k1=0;k1<formelem.length;k1++){
          for(var l1=0;l1<formval.addons.length;l1++){
            if((<FormGroup>formelem[k1]).controls['slot'].value==formval.addons[l1].slot){
              (<FormGroup>formelem[k1]).controls['id'].setValue(formval.addons[l1].id);
              (<FormGroup>formelem[k1]).controls['name'].setValue(formval.addons[l1].name);
              (<FormGroup>formelem[k1]).controls['quantity'].setValue(1);
              (<FormGroup>formelem[k1]).controls['image'].setValue(formval.addons[l1].addon_image);
            }
          }
          
        }
      }
        

      for(var l1=0;l1<formval.addons_for_addons.length;l1++){
        var formName=<FormArray>this.customizationModule_MK_Form.get('compulsory_addons');
        for(var l2=0;l2<formName.length;l2++){
          if((<FormGroup>formName.controls[l2]).controls['id'].value==formval.addons_for_addons[l1].compulsory_addon_id){
            this.addAddonForAddons(formval.addons_for_addons[l1],this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[l2]['controls'],l2);
            this.getListofAddonsForAddons(formval.addons_for_addons[l1].compulsory_addon_id,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[l2]['controls'].id.value,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[l2]['controls'].slot.value,l2);
          }
        }
      }
    }
  }

  addon_brandlist=[];
  addon_brandlist_for_addons=[];
  getBrandForAddon(addonid,category,i,type){
    this.loaderService.display(true);
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

  listofAddonsForAddons=[];
  getListofAddonsForAddons(addonid,addonType,slotname,index){
    this.slotindex = index;
    this.slotnameForAddon = slotname;
    this.listofAddonsForAddons[index]=[];
    this.min_price_addon_filter = this.fromval_slider;
    this.max_price_addon_filter = this.toval_slider;
    var filterObj= {
      tags:this.tags_addon_filter,
      brand_name:this.brand_name_addon_filter,
      minimum_price:this.min_price_addon_filter,
      maximum_price:this.max_price_addon_filter
    }
    this.loaderService.display(true);
    this.quotationService.getListofAddonsForAddons(addonid,addonType,this.customizationModule_MK_details.product_module_id,
      slotname,filterObj,this.search_string_addon_filter,this.pageno_addon)
    .subscribe(
      res =>{
        this.listofAddonsForAddons[index] = res.addons;
        this.compulsoryaddonsArr = res.addons;
        this.loaderService.display(false);
      },
      err =>{
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        this.erroralert = true;
        setTimeout(function() {
                  this.erroralert = false;
               }.bind(this), 13000);
        this.loaderService.display(false);
      }
    );
  }

  setAddonImage(val,i){
    for(var k6=0;k6<this.compulsoryAddonsList.length;k6++){
      if(val==this.compulsoryAddonsList[k6].id){
       this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[i]['controls'].image.setValue(this.compulsoryAddonsList[k6].addon_image);
        break;
      }
    }
  }

  displayGlobalConfig(val){
  }

  deleteBoq(id){
    if (confirm("Are You Sure you want to delete this boq") == true) {
      this.loaderService.display(true);
      this.quotationService.deleteQuotation(this.projectId,id).subscribe(
        res => {
          this.backClicked();
          // this.router.navigateByUrl('/project/'+this.projectId+'/list_of_boqs');
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 10000);
        }
      );
    }
  }

  selectedSpacesArr=[];
  selectedSpacesArrMK=[];
  selectedSpacesArrLf=[];
  selectedSpacesArrSERV=[];
  selectedSpacesArrCustomEle=[];
  createSpace(formVal,category){
    if(formVal.space!=""){
      if(category=='wardrobe' && !this.selectedSpacesArr.includes(formVal.space)){
        this.selectedSpacesArr.push(formVal.space);
        this.loaderService.display(true);
        this.quotationService.setSpaces(formVal.space,this.projectId,this.qid,'wardrobe').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotations = res.quotation;
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
        this.quotationService.setSpaces(formVal.space,this.projectId,this.qid,'kitchen').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotations = res.quotation;
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
        this.quotationService.setSpaces(formVal.space,this.projectId,this.qid,'loose_furniture').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotations = res.quotation;
            this.selectedSpacesArrLf = res.quotation.spaces_loose;
            this.successMessageShow('Space added successfully!');
          },
          err=>{
            this.loaderService.display(false);
          }
        );
      } else if(category=='services' && !this.selectedSpacesArrSERV.includes(formVal.space)){
        this.selectedSpacesArrSERV.push(formVal.space);
        this.loaderService.display(true);
        this.quotationService.setSpaces(formVal.space,this.projectId,this.qid,'services').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotations = res.quotation;
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
        this.quotationService.setSpaces(formVal.space,this.projectId,this.qid,'custom_elements').subscribe(
          res =>{
            this.loaderService.display(false);
            this.quotations = res.quotation;
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
      this.errorMessageShow("Space can't be balnk");
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

  modulesArr;
  // modulesArr_MK;
  getModuleOfModuleType(val){
    val = JSON.parse(val);
    this.loaderService.display(true);
    this.quotationService.getModulesListOfType(val.name,val.category).subscribe(
      res=>{
        this.modulesArr = res.product_modules;
        this.addModuleFormMk.controls['module'].setValue("");
        this.addModuleForm.controls['module'].setValue("");
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  addedModulesArr;
  addModule(formval,space,secname,index){
    var obj;
    if(secname=='wardrobe'){
      obj ={
        "product_module":{
          "id": formval.module,
          "quantity": formval.qty,
          "space": space,
          "section_name":secname,
          "category":'wardrobe',
          "options": {
            "core_material": this.quotations.boq_global_configs[0].core_material.name,
            "shutter_material": this.quotations.boq_global_configs[0].shutter_material.name,
            "shutter_finish": this.quotations.boq_global_configs[0].shutter_finish.name,
            "shutter_shade_code":(!this.quotations.boq_global_configs[0].custom_shutter_shade_code)?this.quotations.boq_global_configs[0].shutter_shade_code.code:this.quotations.boq_global_configs[0].shutter_shade_code,
            "edge_banding_shade_code":(!this.quotations.boq_global_configs[0].custom_edge_banding_shade_code)?this.quotations.boq_global_configs[0].edge_banding_shade_code.code:this.quotations.boq_global_configs[0].edge_banding_shade_code,
            "door_handle_code":this.quotations.boq_global_configs[0].door_handle_code,
            "shutter_handle_code":this.quotations.boq_global_configs[0].shutter_handle_code,
            "hinge_type": this.quotations.boq_global_configs[0].hinge_type,
            "channel_type": this.quotations.boq_global_configs[0].channel_type,
            "number_exposed_sites": 0,
            "hardware_brand_id": this.quotations.boq_global_configs[0].brand.id,
            "addons": [],
            "custom_elements": []
          }
        }
      }
    } else if(secname=='kitchen'){
      obj ={
        "product_module":{
          "id": formval.module,
          "quantity": formval.qty,
          "space": space,
          "section_name":secname,
          "category":'kitchen',
          "options": {
            "core_material": this.quotations.boq_global_configs[0].core_material.name,
            "shutter_material": this.quotations.boq_global_configs[0].shutter_material.name,
            "shutter_finish": this.quotations.boq_global_configs[0].shutter_finish.name,
            "shutter_shade_code":(!this.quotations.boq_global_configs[0].custom_shutter_shade_code)?this.quotations.boq_global_configs[0].shutter_shade_code.code:this.quotations.boq_global_configs[0].shutter_shade_code,
            "edge_banding_shade_code":(!this.quotations.boq_global_configs[0].custom_edge_banding_shade_code)?this.quotations.boq_global_configs[0].edge_banding_shade_code.code:this.quotations.boq_global_configs[0].edge_banding_shade_code,
            "door_handle_code":this.quotations.boq_global_configs[0].door_handle_code,
            "hinge_type": this.quotations.boq_global_configs[0].hinge_type,
            "channel_type": this.quotations.boq_global_configs[0].channel_type,
            "skirting_config_type":this.quotations.boq_global_configs[0].skirting_config_type,
            "skirting_config_height":this.quotations.boq_global_configs[0].skirting_config_height,
            "number_exposed_sites": 0,
            "hardware_brand_id": this.quotations.boq_global_configs[0].brand.id,
            "addons": [],
            "custom_elements": [],
            "kitchen_category":JSON.parse(formval.kitchen_category).name,
            "custom_shelf_unit_width":formval.custom_shelf_unit_width
          }
        }
      }
    }
    this.loaderService.display(true);
    this.quotationService.addModuleToSpace(this.projectId,this.qid,obj).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.loaderService.display(false);
        this.successMessageShow('Module added. Boq updated successfully!');
        var str= 'addModuleFormRow'+index;
        var str1= 'addModuleFormRowMk'+index;
        if(document.getElementById(str)){
          document.getElementById(str).classList.add('d-none');
          this.addModuleForm.reset();
          this.addModuleForm.controls['module_type'].setValue("");
          this.addModuleForm.controls['module'].setValue("");
        }
        if(document.getElementById(str1)){
          document.getElementById(str1).classList.add('d-none');
          this.addModuleFormMk.reset();
          this.addModuleFormMk.controls['kitchen_category'].setValue("");
          this.addModuleFormMk.controls['module_type'].setValue("");
          this.addModuleFormMk.controls['module'].setValue("");
        }
      },
      err =>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
  }

  editModuleLineQty;
  editModuleLineWidth;
  editmoduleLineItem(rowno,mod){
    this.editModuleLineQty = mod.quantity;
    this.editModuleLineWidth = mod.custom_shelf_unit_width;
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
  editCombinemoduleLineItem(rowno1,mod,rowno2){
    this.editModuleLineQty = mod.quantity;
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
          "custom_elements": mod.custom_elements
        }
      }
    }
    if(secname=='kitchen'){
      obj2['product_module']['options']['kitchen_category']=mod.kitchen_category_name;
      obj2['product_module']['options']['custom_shelf_unit_width']=this.editModuleLineWidth;
    }
    this.quotationService.updateModuleOfSpace(this.projectId,this.qid,obj2,secname).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.editModuleLineQty = undefined;
        this.editModuleLineWidth = undefined;
        this.loaderService.display(false);
        this.successMessageShow('Module updated and saved to Boq successfully!');
      },
      err =>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
  }

  moduleDelete(id,space,category){
    if(confirm('Are you sure you want to delete this module?')==true){
      this.loaderService.display(true);
      var obj={
        ids: [id]
      }
      this.quotationService.deleteModuleToSpace(this.projectId,this.qid,obj,category).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.successMessageShow('Module deleted and Boq updated successfully!');
          this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
  }

  boqServices:any = [];
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
        localStorage.setItem('boqAddedProducts',JSON.stringify(this.boqProducts_all));
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

      this.quotationService.deleteSpaceFromBoq(this.projectId,this.qid,space,category).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.selectedSpacesArr = res.quotation.spaces;
          this.selectedSpacesArrMK=res.quotation.spaces_kitchen;
          this.selectedSpacesArrLf = res.quotation.spaces_loose;
          this.selectedSpacesArrSERV = res.quotation.spaces_services;
          this.selectedSpacesArrCustomEle = res.quotation.spaces_custom;
          this.successMessageShow('Space deleted and Boq updated successfully!');
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow(JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  editButtonClick(){
    this.editBtnFlag = true;
  }

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
            // "number_door_handles":formval.number_door_handles,
            // "number_shutter_handles":formval.number_shutter_handles,
            "hardware_brand_id": formval.hardware_brand,
            "addons": formval.addons,
            // "custom_elements": formval.custom_elements
          }
        }
      }
      this.quotationService.updateModuleOfSpace(this.projectId,this.qid,obj2,secname).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.customizationModule_MW_details = undefined;
          this.customizationModule_MW_Form.reset();
          (<FormArray>this.customizationModule_MW_Form.controls['addons']).controls=[];
          $('#customizationModal').modal('hide');
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'Customization updated successfully!';
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
        },
        err =>{
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
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
          'compulsory':true
        })
        for(var k6=0;k6<this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons.length;k6++){
          formval.addons.push({
          'id':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].id,
          'quantity':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].quantity,
          'slot':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].slot,
          // 'brand_id':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].brand_id,
          'compulsory_addon_id':this.customizationModule_MK_Form.controls['compulsory_addons'].value[k4].addons_for_addons[k6].compulsory_addon_id
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
            "hardware_brand_id": formval.hardware_brand,
            "addons": formval.addons,
            //"gola_profile":formval.gola_profile,
            'skirting_config_type':formval.skirting_config_type,
            'skirting_config_height':formval.skirting_config_height,
            'kitchen_category':this.customizationModule_MK_details.kitchen_category_name
          }
        }
      }
      this.quotationService.updateModuleOfSpace(this.projectId,this.qid,obj3,secname).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.customizationModule_MK_details = undefined;
          this.customizationModule_MK_Form.reset();
          this.addon_brandlist=[];
          (<FormArray>this.customizationModule_MK_Form.controls['addons']).controls=[];
          (<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls=[];
          $('#customizationModalMk').modal('hide');
          this.loaderService.display(false);
          this.successMessageShow('Customization updated successfully!');
        },
        err =>{
          this.loaderService.display(false);
          this.errorMessageShow(JSON.parse(err['_body']).message);
        }
      );
    }
  }

  recalculateBoqAmt(){
    this.loaderService.display(true);
    this.quotationService.recalculateBoqAmt(this.projectId,this.qid,this.quotations).subscribe(
      res=>{
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Amount calculated successfully!';
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }

  shutterhandleImg;
  doorhandleImg;
  shadeImg;
  edgebandingImg;
  doorhandleImgMw;
  shadeImgMW;
  edgebandingImgMW;

  setImage(val,arg,category?){
    if(arg=='shutterhandle'){
      for(var k=0;k<this.globalVarArr.shutter_handle_code.length;k++){
        if(val==this.globalVarArr.shutter_handle_code[k].code){
          this.shutterhandleImg=this.globalVarArr.shutter_handle_code[k].handle_image;
        }
      }
    } else if(arg=='doorhandle') {
      for(var k=0;k<this.globalVarArr.door_handle_code.length;k++){
        if(val==this.globalVarArr.door_handle_code[k].code){
          if(category=='kitchen'){
            this.doorhandleImg=this.globalVarArr.door_handle_code[k].handle_image;
          } else if(category=='wardrobe'){
            this.doorhandleImgMw=this.globalVarArr.door_handle_code[k].handle_image;
          }
        }
      }
    } else if(arg=='shadeCode') {
      for(var k=0;k<this.globalVarArr.shutter_shade_code.length;k++){
        if(val==this.globalVarArr.shutter_shade_code[k].code){
          if(category=='kitchen'){
            this.shadeImg=this.globalVarArr.shutter_shade_code[k].shade_image;
          } else if(category=='wardrobe'){
            this.shadeImgMW=this.globalVarArr.shutter_shade_code[k].shade_image;
          }
          this.getMatchingEdgebandOfShade(this.globalVarArr.shutter_shade_code[k].id,category);
        }
      }
      if(category=='kitchen'){
        this.shutter_shade_code_globalVar_MK = val;
      } else if(category=='wardrobe'){
        this.shutter_shade_code_globalVar_MW = val;
      }
      $('#shadeCodeModal').modal('hide');
      this.successMessageShow('shade code selected');
    } else if(arg=='edgebandingShadeCode') {
      for(var k=0;k<this.globalVarArr.edge_banding_shade_code.length;k++){
        if(val==this.globalVarArr.edge_banding_shade_code[k].code){
          if(category=='kitchen'){
            this.edgebandingImg=this.globalVarArr.edge_banding_shade_code[k].shade_image;
          } else if(category=='wardrobe'){
            this.edgebandingImgMW=this.globalVarArr.edge_banding_shade_code[k].shade_image
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
    }
  }

  getMatchingEdgebandOfShade(shadeid,category){
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
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  uploadKdMaxExcel(space,category,lineno){
    this.closeKdmax_errorblock(lineno);
    var data={
      "category":category ,
      "space": space,
      "attachment":this.basefile
    }
    this.loaderService.display(true);
    this.quotationService.uploadKDMaxExcel(this.projectId,this.qid,data).subscribe(
      res=>{
        this.quotations=res.quotation;
        if(res.quotation.errors.length>0){
          var str = 'kdmax_errorblock'+lineno;
          document.getElementById(str).classList.remove('d-none');
        }
        if(res.quotation.errors.length==0){
          this.successalert = true;
          this.successMessage = 'Uploaded successfully!';
          setTimeout(function() {
            this.successalert = false;
           }.bind(this), 5000);
        }
        this.loaderService.display(false);
      },
      err=>{
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
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

  getformArray(form,controls) {
    return <FormArray>form.controls[controls];
  }
  checkValInFormArray(val,form,controls){
    return (<FormArray>form.controls[controls]).value.includes(val);
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
  combineModules(formval){
    this.loaderService.display(true);
    this.quotationService.combineModules(this.projectId,this.qid,formval).subscribe(
      res=>{
        this.quotations = res.quotation;
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
    this.quotationService.editCombinedModule(this.projectId,this.qid,formval,modjobid).subscribe(
      res=>{
        this.quotations = res.quotation;
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

  getTotalOfLfSpaces(space,index){
    var str ='spacesLfTotal'+index;
    document.getElementById(str).innerText = '0';
    if(this.boqProducts){
      for(var v=0;v<this.boqProducts.length;v++){
        if(this.boqProducts[v].space==space){
         document.getElementById(str).innerText = (parseFloat(document.getElementById(str).innerText) + (this.boqProducts[v]['quantity']*this.boqProducts[v]['rate']))+'';
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
  boqProducts=new Array();
  totalAmt=0;
  boqProducts_all= new Array();
  boqServices_all= new Array();
  totalProductCountForAll =0;
  sections;
  selectedSectionsLf = new Array();
  selectedsectionNameLf='all';
  selectedsectionIdLf= 'all';
  pname;
  modalQuantityandProductSelectionForm : FormGroup;

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

  calculatePrice(base_rate, installation_price,qty){
    // return parseInt(base_rate) + parseInt(installation_price);
    return (parseInt(base_rate) + parseInt(installation_price))*parseInt(qty);
  }


  addService(form,space,k3){
    var service_obj = {
      "id": form.activity,
      "quantity": form.quantity,
      "base_rate": form.base_rate,
      "space": space,
      "service_activity_id":form.activity
    }

    this.boqServices_all.push(service_obj);

    var data = {
      'quotation': {
        'services': this.boqServices_all
      }
    }

    this.quotationService.updateServiceData(this.qid,this.projectId,data).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.boqServices_all.length =0;
        this.boqServices.length = 0;
        for(var l=0;l<Object.keys(this.quotations.service_jobs).length;l++){
          for(var m=0;m<this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]].length;m++){
            this.boqServices_all.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
            this.boqServices.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
          }
        }
        this.successalert = true;
        this.successMessage = 'Service saved successfully!';
        this.addServiceFormSERV.reset();
        this.addServiceFormSERV.controls['category'].setValue("");
        this.addServiceFormSERV.controls['sub_category'].setValue("");
        this.addServiceFormSERV.controls['activity'].setValue("");
        var inputelem ='addServiceFormRowSERV'+k3;
         document.getElementById(inputelem).classList.add('d-none');
        // this.clearLocalStorage();
        // this.location.back();
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
      },
      err=> {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
      }
    );
  }
  saveService(){
    var data = {
      'quotation': {
        'services': this.boqServices_all
      }
    }
    this.quotationService.updateServiceData(this.qid,this.projectId,data).subscribe(
      res=>{
        this.successalert = true;
        this.successMessage = 'Service saved successfully!';
        // this.clearLocalStorage();
        // this.location.back();
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
      },
      err=> {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
      }
    );
  }

  cancelEditService(i){
    $(".service-edit-mode-off-"+i).css("display","block");
    $(".service-edit-mode-on-"+i).css("display","none");
  }

  onQtyChange(i, event)
  {
    var obj;
    // for(let act in this.boqServices_all let j = index)
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
    var data = {
      'quotation': {
        'services': this.boqServices_all
      }
    }
    this.quotationService.updateServiceJob(this.qid,this.projectId, data).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.boqServices_all.length =0;
        this.boqServices.length = 0;
        for(var l=0;l<Object.keys(this.quotations.service_jobs).length;l++){
          for(var m=0;m<this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]].length;m++){
            this.boqServices_all.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
            this.boqServices.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
          }
        }
        this.successalert = true;
        this.successMessage = 'Service updated successfully!';
        // this.clearLocalStorage();
        // this.location.back();
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
        $(".service-edit-mode-off-"+i).css("display","block");
        $(".service-edit-mode-on-"+i).css("display","none");
      },
      err=> {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
      }
    );
  }

  editService(i,event){
    // this.loaderService.display(true);
    $(".service-edit-mode-off-"+i).css("display","none");
    $(".service-edit-mode-on-"+i).css("display","block");

  }

  service_category:any = [];
  getServiceCategories(k3){
    this.loaderService.display(true);
    this.quotationService.getServiceCategoryList().subscribe(
      res => {
        this.loaderService.display(false);
        this.service_category = res['service_categories'];
        $("#addServiceFormRowSERV"+k3).removeClass("d-none");
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
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  chooseActivity(id){
    for(let s_a of this.service_activity){
      if(s_a['id'] == id){
        // $(".base_amt").val(s_a['default_base_price'])
        this.addServiceFormSERV.patchValue({base_rate: s_a['default_base_price']});
        // alert(s_a['default_base_price'])
      }
    }
  };

  service_activity:any = [];
  all_activity_service:any = [];
  getServiceActivity(id = ""){
    this.loaderService.display(true);
    if(id){
      this.quotationService.getServiceActivity(id).subscribe(
        res => {
          // 
          this.loaderService.display(false);
          // 
          this.service_activity = res['service_activities'];
          // this.all_activity_service = res['service_activities'];
        },
        err => {
          this.loaderService.display(false);
        }
      );
    }

    // this.all_activity_service = this.getServiceActivity();
    this.quotationService.getServiceActivity().subscribe(
      res => {
        // 
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
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  viewmoreProductDetails(productId,secId){
    document.getElementById('viewproductRow').style.display = 'block';
    document.getElementById('allproductsRow').style.display = 'none';
    this.quotationService.viewProduct(productId,secId).subscribe(
      res =>{
        this.product_details = res.product;
        this.product_variations = this.product_details.variations;
      },
      err => {
      }
    );
  }

  showVariationDetails(val){
    this.product_details = val;
  }

  backToProducts(){
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    this.product_details = undefined;
    this.product_variations = undefined
  }

  closeModal(){
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
    this.selectedSpacesLooseFurArr = new Array();
    this.selectedCategoriesLooseFurArr = new Array();
    this.selectedSubCategoriesLooseFurArr = new Array();
    this.selectedRangesArr=new Array();
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

  addProductToBoqs(product,quantity){
    product['quantity'] = quantity.productQty;
    product['space']=this.selectedSpaceForModal;
    product['rate']=product['sale_price'];
    product['product_id']=product['id'];
    this.product_notify_message = product.name + ' has been added';

    this.totalAmt = this.totalAmt+ (product.quantity*product.sale_price);
    this.boqProducts_all.push(product);
    this.boqProducts = this.boqProducts_all;
    this.selectedSectionsLf.push({'id':product.section_id,'name':product.section_name});
    var uniqueNames = [];
    var uniqueHash = [];

    for(var s=0, u = this.selectedSectionsLf.length; s <= u; s++){
      if(this.selectedSectionsLf[s] != undefined){
        if(!uniqueNames.includes(this.selectedSectionsLf[s]['id'])){

          uniqueNames.push(this.selectedSectionsLf[s]['id']);
          uniqueHash.push(this.selectedSectionsLf[s]);
        }
      }
    }
    this.selectedSectionsLf = uniqueHash;
    this.modalQuantityandProductSelectionForm.controls['productQty'].setValue(1);
    this.notificationAlert = true;
    setTimeout(function() {
      this.notificationAlert = false;
    }.bind(this), 10000);
    this.backToProducts();
  }
  removeProductToBoqs(productid,productname){
    this.product_notify_message = productname + ' has been removed';
     this.notificationAlert = true;
     setTimeout(function() {
        this.notificationAlert = false;
      }.bind(this), 10000);
    for(var i=0; i<this.boqProducts_all.length;i++){
      if(this.boqProducts_all[i].product_id==productid){
        this.totalAmt=this.totalAmt- (this.boqProducts_all[i].sale_price * this.boqProducts_all[i].quantity);
         this.boqProducts_all.splice(i, 1);
         break;
      }
    }
    for(var i=0; i<this.boqProducts.length;i++){
      if(this.boqProducts[i].product_id==productid){
         this.boqProducts.splice(i, 1);
         break;
      }
    }
  }

  onInputQuantity(elemid,product){
    var inputval=(<HTMLInputElement> document.getElementById(elemid)).value;
    var obj = {
      'key':elemid,
      'quantVal':inputval
    }
    for(var p=0;p<this.boqProducts.length;p++){
      if(this.boqProducts[p].product_id == product.product_id){
        this.boqProducts[p].amount = product.sale_price * <any>obj.quantVal;
        this.boqProducts[p].quantity = <any>obj.quantVal;
        break;
      }
    }

    for(var i=0; i<this.boqProducts_all.length;i++){
      if(this.boqProducts_all[i].product_id==product.product_id){
         this.boqProducts_all[p].amount = product.sale_price * <any>obj.quantVal;
          this.boqProducts_all[p].quantity = <any>obj.quantVal;
         break;
      }
    }
  }

  updateQuotation(){
    alert('Every added section needs to have a module in it. If a '+
      'section will not have any module, it will be removed from boq.');
    this.loaderService.display(true);
    var products = new Array();
    for(var l=0; l <this.boqProducts_all.length; l++){
      var obj = {
        "id": this.boqProducts_all[l].product_id,
        "quantity": this.boqProducts_all[l].quantity,
        "space":this.boqProducts_all[l].space
      }
      products.push(obj);
    }
    var data = {
      "quotation": {
      "status": this.quotations.status,
      "products": products
      }
    }
    this.quotationService.updateBOQData(this.qid,this.projectId,data).subscribe(
      res=>{
        this.boqProducts_all = [];
        this.boqProducts = [];
        this.boqServices_all=[];
        this.boqServices = [];
        this.selectedSections.length=0;
        this.viewQuotationDetails();
        var elements = document.getElementsByClassName('hideFormRow')
        for (var i = 0; i < elements.length; i++){
          elements[i].classList.add('d-none');
        }
        //this.quotations = res.quotation;
        this.successalert = true;
        this.successMessage = 'BOQ updated successfully';
        this.editBtnFlag = false;
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 5000);
        this.loaderService.display(false);
      },
      err=> {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
         }.bind(this), 5000);
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
  typeofkitchen_globalVar_MK="";
  depthofcivilKit_globalVar_MK="";
  drawerheight1ofcivilKit_globalVar_MK="";
  drawerheight2ofcivilKit_globalVar_MK="";
  drawerheight3ofcivilKit_globalVar_MK="";

  updateGlobalVar(ind?,Id?,category?){
    this.loaderService.display(true);
    var obj;
    var i1=ind;
    if(category=='wardrobe'){
      obj = {
        'boq_global_config' : {
          'quotation_id':this.qid,
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
          'quotation_id':this.qid,
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
          'category':'kitchen',
          'civil_kitchen':this.typeofkitchen_globalVar_MK
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
  }

  updateAndApplyBoqGlobalConfig(ind?,Id?,category?){
    this.loaderService.display(true);
    var obj;
    var i1=ind;
    if(category=='wardrobe'){
      obj = {
        'boq_global_config' : {
          'quotation_id':this.qid,
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
          'quotation_id':this.qid,
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
          'category':'kitchen',
          'civil_kitchen':this.typeofkitchen_globalVar_MK
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
        this.loaderService.display(true);
        this.quotationService.viewQuotationDetails(this.projectId,this.qid).subscribe(
          res =>{
            this.quotations = res.quotation;
            this.selectedSpacesArr = res.quotation.spaces;
            this.selectedSpacesArrMK = res.quotation.spaces_kitchen;
            this.selectedSpacesArrLf = res.quotation.spaces_loose;
            this.selectedSpacesArrSERV = res.quotation.spaces_services;
            this.selectedSpacesArrCustomEle = res.quotation.spaces_custom;
            this.loaderService.display(false);
          },
          err=>{
            this.loaderService.display(false);
          }
        );
        //this.viewQuotationDetails();
        this.successMessage = 'Updated and applied successfully!';
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
    this.listofShutterFinishes(data.shutter_material.name);
    this.listofShutterFinishShades(data.shutter_finish.name);
    if(data.category=='kitchen')
      this.listofSkirtingHeights(data.skirting_config_type);
      this.getHandleList(this.shutter_finish_globalVar_MK);
    var arr = document.getElementsByClassName('editRowSpan');
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('editRowInput');
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }

  boqConfigMKVal;
  boqConfigMWVal;
  getBoqConfig(category){
    this.loaderService.display(true);
    this.quotationService.getBoqGlobalConfig(category,this.qid).subscribe(
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
        } else {
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
      this.hardware_brand_globalVar_MW = this.boqConfigMWVal.brand.id;
      this.shutter_handle_code_globalVar_MW =this.boqConfigMWVal.shutter_handle_code;
    } else if(category=='kitchen'){
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
      this.hardware_brand_globalVar_MK = this.boqConfigMKVal.brand.id;
      this.skirting_con_height_globalVar_MK = this.boqConfigMKVal.skirting_config_height;
      this.skirting_con_type_globalVar_MK = this.boqConfigMKVal.skirting_config_type;
      this.countertop_globalVar_MK = this.boqConfigMKVal.countertop;
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
    this.customshadecode = undefined;
    this.successMessageShow('custom shade code selected');
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
    this.customedgebanshadecode = undefined;
    this.successMessageShow('custom edge banding shade selected');
  }

  addAppliance(formval,space,secname,index){
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
    this.quotationService.addApplianceToKitchenSpace(this.projectId,this.qid,obj).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Appliance added successfully!';
        var str1= 'addApplianceFormRowMk'+index;
        if(document.getElementById(str1)){
          document.getElementById(str1).classList.add('d-none');
          this.addApplianceFormMk.reset();
          this.addApplianceFormMk.controls['module_type_id'].setValue("");
          this.addApplianceFormMk.controls['id'].setValue("");
        }
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err =>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }

  addExtra(formval,space,index){
    var obj ={
        "addon":{
          "id": formval.id,
          "quantity": formval.qty,
          "space":space
        }
      }

    this.loaderService.display(true);
    this.quotationService.addExtraToKitchenSpace(this.projectId,this.qid,obj).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Extra added successfully!';
        var str1= 'addExtraFormRowMk'+index;
        if(document.getElementById(str1)){
          document.getElementById(str1).classList.add('d-none');
          this.addExtraFormMk.reset();
          this.addExtraFormMk.controls['id'].setValue("");
          }
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err =>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }

  changeCustomElemImage(val){
    this.addCustomElemForm.controls['image'].setValue(JSON.parse(val).photo);
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

  updateAppliance(rowno,mod,secname){
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

    this.quotationService.updateApplianceOfSpace(this.projectId,this.qid,obj2,secname).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.editApplianceLineQty = undefined;
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Appliance updated successfully!';
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err =>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }
  updateCustomElem(rowno,mod,secname){
    if(this.editCustomElemLineQty >0){
      mod.quantity= this.editCustomElemLineQty;
      this.loaderService.display(true);
      var obj2 ={
        "custom_job_id": mod.id,
        "quantity": this.editCustomElemLineQty
      }

      this.quotationService.updateCustomElemOfSpace(this.projectId,this.qid,obj2,secname).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.editCustomElemLineQty = undefined;
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'Custom element updated successfully!';
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
        },
        err =>{
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
        }
      );
    } else {
      this.erroralert = true;
      this.errorMessage = 'Quantity should be greater than 0.';
      setTimeout(function() {
        this.erroralert = false;
      }.bind(this), 2000);
    }

  }

  updateExtra(rowno,mod,secname){
    mod.quantity= this.editExtraLineQty;
    this.loaderService.display(true);
    var obj2 ={
      "extra_job_id":mod.id,
      "addon":{
        "id": mod.id,
        "quantity": this.editExtraLineQty,
        "space": mod.space
      }
    }

    this.quotationService.updateExtraOfSpace(this.projectId,this.qid,obj2).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.editExtraLineQty = undefined;
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Extra updated successfully!';
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err =>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }

  applianceDelete(id,space){
    if(confirm('Are you sure you want to delete this appliance?')==true){
      this.loaderService.display(true);
      var obj ={
        ids: [id]
      };
      this.quotationService.deleteApplianceToSpace(this.projectId,this.qid,obj).subscribe(
        res=>{
          this.successalert = true;
          this.quotations = res.quotation;
          this.successMessage = 'Appliance deleted!';
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
          this.loaderService.display(false);
        },
        err=>{
          this.erroralert = true;
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
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
      this.quotationService.deleteExtraToSpace(this.projectId,this.qid,obj).subscribe(
        res=>{
          this.successalert = true;
          this.quotations = res.quotation;
          this.successMessage = 'Extra deleted!';
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
          this.loaderService.display(false);
        },
        err=>{
          this.erroralert = true;
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
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
      this.quotationService.deleteCustomElemToSpace(this.projectId,this.qid,obj).subscribe(
        res=>{
          this.successalert = true;
          this.quotations = res.quotation;
          this.successMessage = 'Custom element deleted!';
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
          this.loaderService.display(false);
        },
        err=>{
          this.erroralert = true;
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
        }
      );
    }
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

  appliancesArr;
  getApplianceOfModuleType(val){
    this.loaderService.display(true);
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

  addCustomElem(formval,space,secname,index){
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
    this.quotationService.addCustomElementToSpace(this.projectId,this.qid,obj).subscribe(
      res=>{
        this.quotations = res.quotation;
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = 'Custom element added successfully!';
        var str1= 'addModuleFormRowCE'+index;

        if(document.getElementById(str1)){
          document.getElementById(str1).classList.add('d-none');
          this.addCustomElemForm.reset();
          this.addCustomElemForm.controls['id'].setValue("");
        }
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err =>{
        this.loaderService.display(false);
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
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
        this.successMessage = 'Length changed successfully!';
        this.countertop_width_globalVar_MK="";
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
  }

  onCheckChange2(event,formtype) {
    var formArray: FormArray;
    if(formtype=='deletesection'){
      formArray = this.deleteSectionToBoqForm.get('sections') as FormArray;
    } else if(formtype=='addsection'){
      formArray = this.addSectionToBoqForm.get('sections') as FormArray;
    }
    if(event.target.checked){
      formArray.push(new FormControl(event.target.value));
    }
    else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }

        i++;
      });

    }
  }
  submitAddSectionForm(formval){
    for(var i=0;i<formval.sections.length;i++){
      this.selectedSections.push(formval.sections[i]);
    }
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
    this.boqProducts_all = new Array();
    this.boqProducts = new Array();
    this.quotationService.deleteSectionFromBoq(this.projectId,this.qid,deleteCategoryArr).subscribe(
      res=>{
        this.viewQuotationDetails();
        $('#deletesectionmodal').modal('hide');
        this.deleteSectionToBoqForm.reset();
        this.successMessage = 'Section successfully deleted!';
        this.successalert = true;
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 13000);
        this.loaderService.display(false);
        // this.getSelectedSections();
      },
      err=>{
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        this.erroralert = true;
        setTimeout(function() {
            this.erroralert = false;
         }.bind(this), 13000);
        this.loaderService.display(false);
      }
    );
  }

  postBoqGlobalConfig(category){
    // formval['quotation_id'] = this.quotation_id;
    this.loaderService.display(true);
    var obj;
    if(category=='wardrobe'){
      obj = {
        'boq_global_config' : {
          'quotation_id':this.qid,
          'core_material':this.core_material_globalVar_MW,
          'shutter_material':this.shutter_material_globalVar_MW,
          'shutter_finish':this.shutter_finish_globalVar_MW,
          'shutter_shade_code':this.shutter_shade_code_globalVar_MW,
          'edge_banding_shade_code':this.edgebanding_shade_code_globalVar_MW,
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
          'quotation_id':this.qid,
          'core_material':this.core_material_globalVar_MK,
          'shutter_material':this.shutter_material_globalVar_MK,
          'shutter_finish':this.shutter_finish_globalVar_MK,
          'shutter_shade_code':this.shutter_shade_code_globalVar_MK,
          'edge_banding_shade_code':this.edgebanding_shade_code_globalVar_MK,
          'door_handle_code': this.door_handle_code_globalVar_MK,
          // 'shutter_handle_code':this.shutter_handle_code_globalVar_MW,
          'hinge_type': this.hinge_type_globalVar_MK,
          'channel_type':this.channel_type_globalVar_MK,
          'brand_id':this.hardware_brand_globalVar_MK,
          'skirting_config_height':this.skirting_con_height_globalVar_MK,
          'skirting_config_type':this.skirting_con_type_globalVar_MK,
          'countertop':this.countertop_globalVar_MK,
          'category':'kitchen',
          'civil_kitchen':this.typeofkitchen_globalVar_MK
        }
      }
      if(obj.boq_global_config.civil_kitchen=='true'){
        obj['boq_global_config']['civil_kitchen_parameter_attributes'] =  {
            'depth': this.depthofcivilKit_globalVar_MK,
            'drawer_height_1':this.drawerheight1ofcivilKit_globalVar_MK,
            'drawer_height_2':this.drawerheight2ofcivilKit_globalVar_MK,
            'drawer_height_3':this.drawerheight3ofcivilKit_globalVar_MK
          }
      }
    }
    this.quotationService.postBoqGlobalConfig(obj).subscribe(
      res=>{
        this.clearGlobalVar(res.boq_global_config.category);
        this.getBoqConfig(res.boq_global_config.category);
        this.successalert = true;
        this.successMessage = 'Global variables successfully set!';
        var inupts;
        if(res.boq_global_config.category=='wardrobe'){
          this.shadeImgMW = undefined;
          this.edgebandingImgMW = undefined;
          inupts=document.getElementsByClassName('globalvarform');
          for(var i=0;i<inupts.length;i++){
            inupts[i].classList.add('d-none');
          }
        } else if(res.boq_global_config.category=='kitchen'){
          this.shadeImg = undefined;
          this.edgebandingImg = undefined;
          inupts=document.getElementsByClassName('globalvarform_mk');
          for(var i=0;i<inupts.length;i++){
            inupts[i].classList.add('d-none');
          }
        }
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

  disableGlobalVarSaveBtn(category){
    if(category=='wardrobe'){
      if((this.core_material_globalVar_MW =='' || this.core_material_globalVar_MW==undefined)||
         (this.shutter_material_globalVar_MW ==''||  this.shutter_material_globalVar_MW==undefined) ||
         (this.shutter_finish_globalVar_MW =='' || this.shutter_finish_globalVar_MW==undefined) ||
         (this.shutter_shade_code_globalVar_MW =='' || this.shutter_shade_code_globalVar_MW==undefined)||
         (this.door_handle_code_globalVar_MW =='' || this.door_handle_code_globalVar_MW==undefined) ||
         (this.hinge_type_globalVar_MW =='' || this.hinge_type_globalVar_MW==undefined) ||
         (this.channel_type_globalVar_MW =='' || this.channel_type_globalVar_MW==undefined) ||
         (this.hardware_brand_globalVar_MW =='' || this.hardware_brand_globalVar_MW==undefined) ||
         (this.shutter_handle_code_globalVar_MW =='' || this.shutter_handle_code_globalVar_MW==undefined) ||
         (this.edgebanding_shade_code_globalVar_MW =='' || this.edgebanding_shade_code_globalVar_MW==undefined)){
         return true;
      }
      else {
        return false;
      }
    } else if(category=='kitchen'){
      if((this.core_material_globalVar_MK =='' || this.core_material_globalVar_MK==undefined)||
         (this.shutter_material_globalVar_MK ==''||  this.shutter_material_globalVar_MK==undefined) ||
         (this.shutter_finish_globalVar_MK =='' || this.shutter_finish_globalVar_MK==undefined) ||
         (this.shutter_shade_code_globalVar_MK =='' || this.shutter_shade_code_globalVar_MK==undefined)||
         (this.door_handle_code_globalVar_MK =='' || this.door_handle_code_globalVar_MK==undefined) ||
         (this.hinge_type_globalVar_MK =='' || this.hinge_type_globalVar_MK==undefined) ||
         (this.channel_type_globalVar_MK =='' || this.channel_type_globalVar_MK==undefined) ||
         (this.hardware_brand_globalVar_MK =='' || this.hardware_brand_globalVar_MK==undefined) ||
         (this.skirting_con_type_globalVar_MK =='' || this.skirting_con_type_globalVar_MK==undefined) ||
         (this.skirting_con_height_globalVar_MK =='' || this.skirting_con_height_globalVar_MK==undefined) ||
         (this.edgebanding_shade_code_globalVar_MK =='' || this.edgebanding_shade_code_globalVar_MK==undefined) ||
         (this.countertop_globalVar_MK =='' || this.countertop_globalVar_MK==undefined) ||
         (this.typeofkitchen_globalVar_MK =='' || this.typeofkitchen_globalVar_MK==undefined)){
         return true;
      }
      else {
        return false;
      }
    }
  }

  showNextRow(rowID,category?){
    var str;
    if(category && category=='kitchen'){
      $(".nextBtnMk").addClass("d-none");
      str = '#'+rowID +' .nextBtnMk';
    } else {
      $(".nextBtn").addClass("d-none");
      str = '#'+rowID +' .nextBtn';
    }
    document.getElementById(rowID).classList.remove('d-none');
    document.querySelector(str).classList.remove('d-none');
  }

  showNextRowBasedOnTOK(val){
    if(val=='true'){
      this.showNextRow('gvar_depthofkitchen_mk','kitchen');
      document.getElementById('gvar_coreMat_mk').classList.add('d-none');
    } else {
      this.showNextRow('gvar_coreMat_mk','kitchen');
      document.getElementById('gvar_depthofkitchen_mk').classList.add('d-none');
    }
  }

  openShadeModal(){}

  removeoptionalAddonsForAddon(index){
    // (<FormGroup>(<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons'])
    //   .controls[index]).controls["addons_for_addons"]
    var addonsarr = this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[index]['controls'].addons_for_addons;
    for(var m=0;m<addonsarr.controls.length;m++){
      addonsarr.removeAt(m);
    }
    addonsarr.controls=[];
  }

  servicejobDelete(id){
    if(confirm('Are you sure you want to delete this service?')==true){
      this.loaderService.display(true);
      var obj={
        ids: [id]
      }
      this.quotationService.deleteServicejobToSpace(this.projectId,this.qid,obj).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.boqServices_all.length =0;
          this.boqServices.length = 0;
          for(var l=0;l<Object.keys(this.quotations.service_jobs).length;l++){
            for(var m=0;m<this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]].length;m++){
              this.boqServices_all.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
              this.boqServices.push(this.quotations.service_jobs[Object.keys(this.quotations.service_jobs)[l]][m]);
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

  tags_extras_filter=[];
  brand_name_extra_filter=[];
  min_price_extra_filter=0;
  max_price_extra_filter=100000;
  search_string_extra_filter="";
  pageno_extra=1;

  search_string_addon_filter="";
  pageno_addon=1;
  tags_addon_filter=[];
  brand_name_addon_filter=[];
  min_price_addon_filter=0;
  max_price_addon_filter=100000;

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
    }
  }

  getKitchenExtras(){
    this.min_price_extra_filter = this.fromval_slider;
    this.max_price_extra_filter = this.toval_slider;
    var filterObj= {
      tags:this.tags_extras_filter,
      brand_name:this.brand_name_extra_filter,
      minimum_price:this.min_price_extra_filter,
      maximum_price:this.max_price_extra_filter
    }
    this.loaderService.display(true);
    this.quotationService.getKitchenExtras(filterObj,this.search_string_extra_filter,this.pageno_extra).subscribe(
      res=>{
        this.kitchenExtras=res.addons;
        this.getAddonTags();
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  prevPage(pageFor,addontype?,category?){
    if(pageFor=='extra'){
      this.pageno_extra = this.pageno_extra-1;
      this.getKitchenExtras();
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
      this.getKitchenExtras();
    } else if(pageFor=='addon'){
      this.pageno_addon = this.pageno_addon+1;
      if(addontype =='compaddon'){
         this.getCompulsoryAddons(this.customizationModule_MK_details.product_module_id,this.slotnameForAddon,this.slotindex);
      } else if(addontype =='addonforaddon'){
        this.getListofAddonsForAddons(this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].id.value,
        this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].combination.value,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[this.slotindex]['controls'].slot.value,this.slotindex);
      }
    } 
  }

  addontagsArr;
  getAddonTags(){
    this.loaderService.display(true);
    this.quotationService.listaddontags().subscribe(
      res=>{
        this.addontagsArr=res.addon_tags;
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

  compulsoryaddonsArr;
  slotnameForAddon;
  slotindex;
  getCompulsoryAddons(productmodid,slotname,slotindex){
    this.slotnameForAddon = slotname;
    this.slotindex = slotindex;
    this.min_price_addon_filter = this.fromval_slider;
    this.max_price_addon_filter = this.toval_slider;
    var filterObj= {
      tags:this.tags_addon_filter,
      brand_name:this.brand_name_addon_filter,
      minimum_price:this.min_price_addon_filter,
      maximum_price:this.max_price_addon_filter
    }
    this.loaderService.display(true);
    this.quotationService.getCompulsoryAddons(filterObj,this.search_string_addon_filter,this.pageno_addon,productmodid,slotname).subscribe(
      res=>{
        this.compulsoryaddonsArr=res.addons;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  closeAddExtraModal(){
    this.addExtraModal_space = undefined;
    this.tags_extras_filter=[];
    this.brand_name_extra_filter=[];
    this.min_price_extra_filter=0;
    this.max_price_extra_filter=100000;
    this.search_string_extra_filter="";
    this.pageno_extra=1;
    this.toval_slider = 50000;
    this.fromval_slider = 0;
  }

  addExtraModal_space;
  setSpaceForExtra(space){
    this.addExtraModal_space = space;
  }

  addExtra_new(id,formval,index){
    var elem= (<HTMLInputElement>document.getElementById('extraqtyinput_'+index)).value;
    if(this.addExtraFormMk.controls['qty'].value !='' &&  elem !=''){
      var obj ={
          "addon":{
            "id": id,
            "quantity": formval.qty,
            "space":this.addExtraModal_space
          }
        }

      this.loaderService.display(true);
      this.quotationService.addExtraToKitchenSpace(this.projectId,this.qid,obj).subscribe(
        res=>{
          this.quotations = res.quotation;
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = 'Extra added successfully!';
          this.addExtraFormMk.reset();
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
        },
        err =>{
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = JSON.parse(err['_body']).message;
          setTimeout(function() {
            this.erroralert = false;
          }.bind(this), 2000);
        }
      );
    } else {
        this.erroralert = true;
        this.errorMessage = 'Quantity is required';
        setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
      }
  }

  simpleSlider = {name: "Simple Slider", onUpdate: undefined, onFinish: undefined};
  advancedSlider = {name: "Advanced Slider", onUpdate: undefined, onFinish: undefined};
  fromval_slider = 0;
  toval_slider = 50000;

  update(slider, event) {
    slider.onUpdate = event;
    this.fromval_slider = slider.onUpdate.from;
    this.toval_slider = slider.onUpdate.to;
  }

  finish(slider, event) {
    slider.onFinish = event;
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

  addCompAddon(val,index,slotindex){
    // this.customizationModule_MK_Form.controls['']
    this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].id.setValue(val.id);
    this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].name.setValue(val.name);
    this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[slotindex]['controls'].image.setValue(val.addon_image);
    $('#addAddonModal').modal('hide');
    $("#customizationModalMk").css({"overflow-y": "auto"});
  }
  closeAddAddonModal(){
    $("#addAddonModal").modal('hide')
    $("#customizationModalMk").css({"overflow-y": "auto"});
    this.slotnameForAddon=undefined;
    this.slotindex = undefined;
    this.tags_addon_filter=[];
    this.brand_name_addon_filter=[];
    this.min_price_addon_filter=0;
    this.max_price_addon_filter=100000;
    this.search_string_addon_filter="";
    this.pageno_addon=1;
    this.toval_slider = 50000;
    this.fromval_slider = 0;
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
    this.max_price_addon_filter=100000;
    this.search_string_addon_filter="";
    this.pageno_addon=1;
    this.toval_slider = 50000;
    this.fromval_slider = 0;
  }

  addonModalType;
  openAddAddonModal(modalFor){
    $("#addAddonModal").modal('show');
    this.addonModalType = modalFor;
  }

  addAddonforaddon_new(addon,formval,index,i){
    var elem= (<HTMLInputElement>document.getElementById('addonforaddonqtyinput_'+i)).value;
    if(this.addAddon_for_addon_FormMk.controls['qty'].value !='' &&  elem !=''){
      var obj = {
        'id':addon.id,
        'name':addon.name,
        'quantity':formval.qty,
        'addon_image':addon.addon_image,
      }
      this.addAddonForAddons(obj,this.getformArray(this.customizationModule_MK_Form,'compulsory_addons').controls[index]['controls'],index)
      this.closeAddAddonModal();
      this.addAddon_for_addon_FormMk.reset();
    } else {
      this.erroralert = true;
      this.errorMessage = 'Quantity is required';
      setTimeout(function() {
            this.erroralert = false;
         }.bind(this), 2000);
    }
  }

  optaddoncategory;
  getOptionalAddons(category){
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
      maximum_price:this.max_price_addon_filter
    }
    this.loaderService.display(true);
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
  }

  addoptionaladdon_new(addon,formval,i,category){
    var elem= (<HTMLInputElement>document.getElementById('optionaladdonqtyinput_'+i)).value;
    if(this.addAddon_for_addon_FormMk.controls['qty'].value !='' &&  elem !=''){
      var obj = {
        'id':addon.id,
        'name':addon.name,
        'quantity':formval.qty,
        'addon_image':addon.addon_image,
      }
      if(category=='wardrobe'){
        this.addNestedAddons(obj);
        this.closeoptionalAddonModal('wardrobe');
      } else if(category=='kitchen'){
        this.addNestedAddonsMk(obj);
        this.closeoptionalAddonModal('kitchen');
      }
      this.addAddon_for_addon_FormMk.reset();
    } else {
      this.erroralert = true;
      this.errorMessage = 'Quantity is required';
      setTimeout(function() {
            this.erroralert = false;
         }.bind(this), 2000);
    }
  }

  dropdownArr_LF=[{id:1,name:'Kitchen'},{id:2,name:'Bedroom'},{id:3,name:'Foyer'}];
  dropdownArr1_LF=[{id:1,name:'Flower pot'},{id:2,name:'Shoerack'},{id:3,name:'Table'},{id:4,name:'Sofa'}];
  dropdownArr2_LF=[{id:1,name:'2-seater sofa'},{id:2,name:'3-seater sofa'},{id:3,name:'4-seater sofa'}];
  
  selectedSpacesLooseFurArr = new Array();
  selectedCategoriesLooseFurArr = new Array();
  selectedSubCategoriesLooseFurArr = new Array();
  selectedRangesArr=new Array();
  spaces_list:any = [];
 
  openProductModal(space){
    this.loaderService.display(true);
    this.fetchAllRanges();
    this.fetchAllSpaces();
    this.fetchSliderValues();
    this.selectedSpaceForModal = space;
    // this.fetchAllProducts(1);
    this.filterProducts(1);
  }

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

  slider_value:any;
  all_materials:any;
  all_colors:any;
  all_finishes:any;
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
    this.catalogueService.filterProducts(this.search_string,this.checked_ranges,this.checked_spaces,
      this.checked_categories, this.checked_materials, this.checked_colors, 
      this.checked_finishes, this.checked_subcategories, this.checked_minimum_price,
       this.checked_maximum_price,this.checked_minimum_lead_time, this.checked_maximum_lead_time, 
       this.checked_minimum_length,this.checked_maximum_length, this.checked_minimum_width, this.checked_maximum_width,
       this.checked_minimum_height,this.checked_maximum_height,page).subscribe(
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

  payment_history_list:any = [];
    getPaymentDetails(){
      this.quotationService.paymentHistory(this.qid).subscribe(
        res => {
          this.payment_history_list = res.payments;
        },
        err => {

        });
    }
    calculatePrice1(base_rate, installation_price){
     return parseInt(base_rate) + parseInt(installation_price);
    }  

   setProposedDocId(doc_id){
    this.activated_doc_id = doc_id;
  }

}