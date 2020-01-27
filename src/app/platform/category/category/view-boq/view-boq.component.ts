import { Component, OnInit } from '@angular/core';
import {QuotationService} from '../../../quotation/quotation.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { environment } from 'environments/environment';
import { LoaderService } from '../../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import {CategoryService} from '../category.service';
declare var $:any;

@Component({
  selector: 'app-view-boq',
  templateUrl: './view-boq.component.html',
  styleUrls: ['./view-boq.component.css'],
  providers: [ QuotationService,CategoryService ]
})
export class ViewBoqComponent implements OnInit {

  qid:number;
  lead_id;
  projectId;
  Object=Object;
  quotations;
  role;
  editBtnFlag = false;
  globalVarArr;
  selectedSections = new Array('other_costs');
  selectedsectionName;
  payment_history_list:any = [];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

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
    number_exposed_sites: new FormControl(""),
    cust_edge_banding_shade_code:new FormControl(""),
    cust_shutter_shade_code:new FormControl("")
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
  })
  combinedModulesForm:FormGroup=new FormGroup({
    description:new FormControl("",Validators.required),
    space:new FormControl("",Validators.required),
    combined_door_id:new FormControl("",Validators.required),
    modular_job_ids:new FormArray([])
  })

  addsubitemform:FormGroup = new FormGroup({
    element_name:new FormControl("",Validators.required)
  })

  addVendorForm:FormGroup=new FormGroup({
    vendor_id: new FormControl("",Validators.required),
    description:new FormControl(""),
    cost:new FormControl(1,Validators.required),
    tax_percent:new FormControl(0,Validators.required),
    deliver_by_date:new FormControl(""),
    recommended:new FormControl(""),
    name:new FormControl(""),
    contact_person:new FormControl(""),
    contact_number:new FormControl(""),
    total_amt:new FormControl(""),
    vendor_form_type:new FormControl(""),
    tax_type:new FormControl("cgst_sgst", Validators.required),
    unit_of_measurement: new FormControl(""),
    quantity:new FormControl(1),
  });

  constructor(
    private quotationService :QuotationService,
    private loaderService : LoaderService,
    private route: ActivatedRoute,
    private router:Router,
    private formBuilder:FormBuilder,
    private _location: Location,
    private categoryServ:CategoryService
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.route.params.subscribe(params => {
      this.qid = params['boqId'];
      this.projectId = params['projectId'];
    });

    this.listOfSpacesBoqConfig();
    this.viewQuotationDetails();
    this.all_activity_service = this.getServiceActivity();
  }

  backClicked() {
    this._location.back();
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
    this.selectedsectionName =  this.selectedSections[0];
    if(this.selectedsectionName=='modular_wardrobe'){
      //this.getModuleTypes('wardrobe');
      this.changeSectionTab('modular_wardrobe');
    } else if(this.selectedsectionName=='modular_kitchen'){
      // this.getModuleTypes('kitchen');
      // this.getKitchenCategories();
      // this.getApplianceTypes();
      this.changeSectionTab('modular_kitchen');
    } else if(this.selectedsectionName=='loose_furniture'){
        this.changeSectionTab('loose_furniture');
    } else if(this.selectedsectionName=='services'){
        this.changeSectionTab('services');
    } else if(this.selectedsectionName=='custom_elements'){
      this.changeSectionTab('custom_elements');
    } else if(this.selectedsectionName=='other_costs'){
      this.changeSectionTab('other_costs');
    }
  }

  changeSectionTab(val){
    $(".container-set .rowContainer").addClass("d-none");
    this.selectedsectionName = val;
    if(this.selectedsectionName=='modular_wardrobe'){
      this.getGlobalVariable('wardrobe');
      //this.getModuleTypes('wardrobe');
      document.getElementById('globalVarRowForMW').classList.remove('d-none');
    } else if(this.selectedsectionName=='modular_kitchen'){
      this.getGlobalVariable('kitchen');
      //this.getKitchenCategories();
      //this.getApplianceTypes();
      document.getElementById('globalVarRowForMK').classList.remove('d-none');
    } else if(this.selectedsectionName=='loose_furniture'){
      document.getElementById('globalVarRowForLF').classList.remove('d-none');
    } else if(this.selectedsectionName=='services'){
        document.getElementById('globalVarRowForSERV').classList.remove('d-none');
    } else if(this.selectedsectionName=='custom_elements'){
      document.getElementById('globalVarRowForCustomElem').classList.remove('d-none');
      //this.getPricedCustom_elements();
    } else if(this.selectedsectionName=='other_costs'){
      document.getElementById('globalVarRowForOtherCosts').classList.remove('d-none');
      this.openVendorModal(null,'Quotation');
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

  globalVarMk;
  globalVarMW;
  viewQuotationDetails(){
    this.loaderService.display(true);
    this.quotationService.viewQuotationDetails(this.projectId,this.qid).subscribe(
      res => {
        this.loaderService.display(false);
        this.quotations = res.quotation;
        this.pname = res.quotation.project_name;
        this.totalAmt = res.quotation.total_amount;
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

  setCustomizationFormValues(formval){
    this.compulsoryAddonsList =[];
    (<FormArray>this.customizationModule_MK_Form.controls['addons']).controls=[];
    (<FormArray>this.customizationModule_MW_Form.controls['addons']).controls=[];
    (<FormArray>this.customizationModule_MK_Form.controls['compulsory_addons']).controls=[];
    if(formval.category=="wardrobe"){
      this.customizationModule_MW_Form.controls['core_material'].setValue(formval.core_material);
      this.customizationModule_MW_Form.controls['shutter_material'].setValue(formval.shutter_material);
      //this.listofShutterFinishes(formval.shutter_material);
      this.customizationModule_MW_Form.controls['shutter_finish'].setValue(formval.shutter_finish);
      //this.listofShutterFinishShades(formval.shutter_finish);
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
      this.customizationModule_MK_Form.controls['shutter_material'].setValue(formval.shutter_material);
     // this.listofShutterFinishes(formval.shutter_material);
      this.customizationModule_MK_Form.controls['shutter_finish'].setValue(formval.shutter_finish);
      //this.listofShutterFinishShades(formval.shutter_finish);
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
      this.customizationModule_MK_Form.controls['skirting_config_type'].setValue(formval.skirting_config_type);
      this.customizationModule_MK_Form.controls['skirting_config_height'].setValue(formval.skirting_config_height);
      //this.listofSkirtingHeights(formval.skirting_config_type);
      if(!this.editBtnFlag){
        this.customizationModule_MK_Form.controls['hardware_brand'].setValue(formval.brand_name);
      } else {
        this.customizationModule_MK_Form.controls['hardware_brand'].setValue(formval.brand_id);
      }
      for(var l=0;l<formval.compulsory_addons.length;l++){
        for(var k=0;k<formval.compulsory_addons[l].allowed_addons.length;k++){
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
          }
        }
      }
    }
  }

  selectedSpacesArr=[];
  selectedSpacesArrMK=[];
  selectedSpacesArrLf=[];
  selectedSpacesArrSERV=[];
  selectedSpacesArrCustomEle=[];

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


  boqServices:any = [];

  editButtonClick(){
    this.editBtnFlag = true;
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

  boqProducts=new Array();
  totalAmt=0;
  boqProducts_all= new Array();
  boqServices_all= new Array();
  sections;
  selectedSectionsLf = new Array();
  selectedsectionNameLf='all';
  selectedsectionIdLf= 'all';
  pname;
  modalQuantityandProductSelectionForm : FormGroup;

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

  service_category:any = [];
  getServiceCategories(k3){
    this.loaderService.display(true);
    this.quotationService.getServiceCategoryList().subscribe(
      res => {
        this.loaderService.display(false);
        this.service_category = res['service_categories'];
        // this.subsections=this.products_catalogue.section.sub_sections;
        // this.selectedSpaceForModal = selectedSpace;
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

  service_activity:any = [];
  all_activity_service:any = [];
  getServiceActivity(id = ""){
    this.loaderService.display(true);
    if(id){
      this.quotationService.getServiceActivity(id).subscribe(
        res => {
          this.loaderService.display(false);
          this.service_activity = res['service_activities'];
        },
        err => {
          
          this.loaderService.display(false);
        }
      );
    }
    this.quotationService.getServiceActivity().subscribe(
      res => {
        this.loaderService.display(false);
        this.all_activity_service = res['service_activities'];
      },
      err => {
        
        this.loaderService.display(false);
      }
    );

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

  getPaymentDetails(){
  	this.quotationService.paymentHistory(this.qid).subscribe(
  		res => {
  			this.payment_history_list = res.payments;
  		},
  		err => {

  		});
  }  

  vendor_cities_arr;
  getVendorCities(){
    this.loaderService.display(true);
    this.categoryServ.getCities().subscribe(
      res=>{
        this.vendor_cities_arr = res.cities;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  vendor_categories_arr;
  getVendorCategories(){
    this.loaderService.display(true);
    this.categoryServ.getVendorCategories().subscribe(
      res=>{
        this.vendor_categories_arr = res.vendor_categories;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  vendor_subcategories_arr;
  getVendorSubCategories(categoryID){
    this.loaderService.display(true);
    this.categoryServ.getSubcategoryList(categoryID).subscribe(
      res=>{
        this.sub_category_id_vendorFilter="";
        this.vendor_subcategories_arr = res.vendor_categories;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  searchstring_vendorFilter="";
  category_id_vendorFilter="";
  sub_category_id_vendorFilter="";
  serviceable_city_id_vendorFilter="";
  moduledetils_vendormodal;
  modalFlag=1;
  openVendorModal(lineitem,ownerable_type){
    this.closeVendorModal();
    if(lineitem){
      this.moduledetils_vendormodal=lineitem;
      this.module_ownerable_type=ownerable_type;
      this.module_ownerable_id= lineitem.id;
    } else{
      this.module_ownerable_type=ownerable_type;
      this.module_ownerable_id = "";
    }
    this.getVendorCategories();
    this.getVendorCities();
    this.getjob_elements_of_BOQlineitem();
    this.listVendors();
  }
  closeVendorModal(){
    this.searchstring_vendorFilter="";
    this.category_id_vendorFilter="";
    this.sub_category_id_vendorFilter="";
    this.serviceable_city_id_vendorFilter="";
    this.moduledetils_vendormodal=undefined;
    this.module_ownerable_type=undefined;
    this.module_ownerable_id=undefined;
    this.job_elements_arr=undefined;
    this.vendorlist=undefined;
    this.selectedSubitem_modal=undefined;
    this.editsubitem_name=undefined;
    this.jobelem_details=undefined;
    this.modalFlag=1;
    if(document.getElementById('addVendorFormRow')){
      document.getElementById('addVendorFormRow').classList.add('d-none');
    }
    if(document.getElementById('addVendorFormRow_othercost')){
      document.getElementById('addVendorFormRow_othercost').classList.add('d-none');
    }
    this.addsubitemform.reset();
    if(document.getElementById('addformrow')){
      document.getElementById('addformrow').classList.add('d-none');
    }
  }

  module_ownerable_type;
  module_ownerable_id;
  job_elements_arr;
  getjob_elements_of_BOQlineitem(){
    this.loaderService.display(true);
    this.categoryServ.getjob_elements_of_BOQlineitem(this.projectId,this.qid,
      this.module_ownerable_type,this.module_ownerable_id).subscribe(
      res=>{
        this.job_elements_arr = res.job_elements;
        if(res.job_elements.length>0 && this.modalFlag==1){
          this.getDetailsOfJobelement(res.job_elements[0].id);
          this.selectedSubitem_modal = res.job_elements[0].id;
        }
        this.modalFlag++;
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }

  vendorlist;
  listVendors(){
    this.loaderService.display(true);
    this.categoryServ.filteredVendors(this.searchstring_vendorFilter,this.category_id_vendorFilter,
      this.sub_category_id_vendorFilter,this.serviceable_city_id_vendorFilter).subscribe(
      res =>{
        this.vendorlist=res.vendors;
        this.loaderService.display(false);
      },
      err =>{
        
        this.loaderService.display(false);
      }
    );
  }

  postjob_elements_of_BOQlineitem(formval,formtype?){
    this.loaderService.display(true);
    if(formtype=='othercost'){
      this.module_ownerable_type="" ;
      this.module_ownerable_id="";
    }
    this.categoryServ.postjob_elements_of_BOQlineitem(this.projectId,this.qid,
      this.module_ownerable_type,this.module_ownerable_id,formval).subscribe(
      res=>{
        this.getjob_elements_of_BOQlineitem();
        this.addsubitemform.reset();
        if(formtype=='othercost'){
          document.getElementById('addformrow_othercost').classList.add('d-none');
        } else {
          document.getElementById('addformrow').classList.add('d-none');
        }
        this.successMessageShow('Sub item successfully added!');
        this.loaderService.display(false);
      },
      err=>{
        
        this.errorMessageShow( <any>JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  addSubitem(formtype?){
    if(formtype=='othercost'){
      document.getElementById('addformrow_othercost').classList.remove('d-none');
    } else {
      document.getElementById('addformrow').classList.remove('d-none');
      this.addsubitemform.controls['element_name'].setValue(this.moduledetils_vendormodal.name);
    }
  }
  
  deleteSubitem(jobelemid){
    if(confirm("Are you sure you want to delete this subitem?")){
      this.loaderService.display(true);
      if(jobelemid==this.jobelem_details.id){
        this.selectedSubitem_modal=undefined;
        this.jobelem_details = undefined;
      }
      this.categoryServ.deletejob_elements_of_BOQlineitem(this.projectId,this.qid,jobelemid).subscribe(
        res=>{
          this.getjob_elements_of_BOQlineitem();
          this.successMessageShow('Sub item successfully deleted!');
          this.loaderService.display(false);
        },
        err=>{
          
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  cancelsubitemrow(formtype?){
    if(formtype=='othercost'){
      document.getElementById('addformrow_othercost').classList.add('d-none');
    } else {
      document.getElementById('addformrow').classList.add('d-none');
    }
  }

  selectedSubitem_modal;
  editsubitem_name;
  editsubitem(rowno,jobelem){
    this.editsubitem_name = jobelem.element_name;
    var arr = document.getElementsByClassName('jobelemrowspan_'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
    arr =document.getElementsByClassName('jobelemrowinput_'+rowno);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
  }
  cancelsubItem(rowno1,jobelem){
    var arr = document.getElementsByClassName('jobelemrowspan_'+rowno1);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.remove('d-none');
    }
    arr =document.getElementsByClassName('jobelemrowinput_'+rowno1);
    for(var i=0;i<arr.length;i++){
      arr[i].classList.add('d-none');
    }
  }

  updatejobelement(jobelemid){
    this.loaderService.display(true);
    this.categoryServ.updatejob_elements_of_BOQlineitem(this.projectId,this.qid,jobelemid,
      this.module_ownerable_type,this.module_ownerable_id,this.editsubitem_name).subscribe(
      res=>{
        this.getjob_elements_of_BOQlineitem();
        this.successMessageShow('Sub item successfully updated!');
        this.loaderService.display(false);
      },
      err=>{
        
        this.errorMessageShow( <any>JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  jobelem_details;
  getDetailsOfJobelement(jobelemid){
    this.loaderService.display(true);
    this.categoryServ.getDeatils_of_job_elements_of_BOQlineitem(this.projectId,this.qid,jobelemid).subscribe(
      res=>{
        this.jobelem_details=res.job_element;
        this.loaderService.display(false);
      },
      err=>{
        
        this.errorMessageShow( <any>JSON.parse(err['_body']).message);
        this.loaderService.display(false);
      }
    );
  }

  openVendorForm(formtype,data,arg?){
    if(formtype=='addvendorform'){
      this.addVendorForm.controls['vendor_id'].setValue(data.id);
      this.addVendorForm.controls['name'].setValue(data.name);
      this.addVendorForm.controls['contact_person'].setValue(data.contact_person);
      this.addVendorForm.controls['contact_number'].setValue(data.contact_number);
      this.addVendorForm.controls['description'].setValue("");
      this.addVendorForm.controls['vendor_form_type'].setValue('addvendorform');
      this.addVendorForm.controls['cost'].setValue(1);
      this.addVendorForm.controls['tax_percent'].setValue(0);
      this.addVendorForm.controls['recommended'].setValue(null);
      this.addVendorForm.controls['deliver_by_date'].setValue(null);
      this.addVendorForm.controls['quantity'].setValue(1);
      this.addVendorForm.controls['tax_type'].setValue("cgst_sgst");
      this.addVendorForm.controls['unit_of_measurement'].setValue("");
    }
    if(formtype=='updatevendorform'){
      this.addVendorForm.controls['vendor_id'].setValue(data.vendor_id);
      this.addVendorForm.controls['description'].setValue(data.description);
      this.addVendorForm.controls['cost'].setValue(data.cost);
      this.addVendorForm.controls['tax_percent'].setValue(data.tax_percent);
      if(data.deliver_by_date){
        var mm = data.deliver_by_date.split("-")[1];
        var dd=((new Date(data.deliver_by_date).getDate())<10)?('0'+(new Date(data.deliver_by_date).getDate())):((new Date(data.deliver_by_date).getDate())+'');
        var yy=new Date(data.deliver_by_date).getFullYear();
        var datestr= yy+'-'+mm+'-'+dd;
        this.addVendorForm.controls['deliver_by_date'].setValue(datestr);
      }
      this.addVendorForm.controls['tax_type'].setValue(data.tax_type);
      this.addVendorForm.controls['quantity'].setValue(data.quantity);
      this.addVendorForm.controls['unit_of_measurement'].setValue(data.unit_of_measurement);
      this.addVendorForm.controls['recommended'].setValue(data.recommended);
      this.addVendorForm.controls['name'].setValue(data.vendor_name);
      this.addVendorForm.controls['contact_person'].setValue(data.vendor_contact_person);
      this.addVendorForm.controls['contact_number'].setValue(data.vendor_contact_number);
      this.addVendorForm.controls['vendor_form_type'].setValue('updatevendorform');
    }
    if(arg=='othercost'){
      document.getElementById('addVendorFormRow_othercost').classList.remove('d-none');
    } else {
      document.getElementById('addVendorFormRow').classList.remove('d-none');
    }
    
  }

  addVendor(formval,arg?){
    this.loaderService.display(true);
    var obj={
      'vendor_detail':formval
    }
    if(this.addVendorForm.controls['vendor_form_type'].value=='addvendorform'){
      this.categoryServ.addvendorToLineitem(this.projectId,this.qid,this.jobelem_details.id,obj)
      .subscribe(
        res=>{
          this.successMessageShow('vendor added successfully!');
          this.addVendorForm.reset();
          if(arg=='othercost'){
            document.getElementById('addVendorFormRow_othercost').classList.add('d-none');
          } else{
            document.getElementById('addVendorFormRow').classList.add('d-none');
          }
          this.getDetailsOfJobelement(this.jobelem_details.id);
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    } else if(this.addVendorForm.controls['vendor_form_type'].value=='updatevendorform'){
      this.categoryServ.updatevendorToLineitem(this.projectId,this.qid,this.jobelem_details.id,obj,formval.vendor_id)
      .subscribe(
        res=>{
          this.successMessageShow('vendor added successfully!');
          this.addVendorForm.reset();
          if(arg=='othercost'){
            document.getElementById('addVendorFormRow_othercost').classList.add('d-none');
          } else{
            document.getElementById('addVendorFormRow').classList.add('d-none');
          }
          this.getDetailsOfJobelement(this.jobelem_details.id);
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }
  deleteVendor(vendor_id){
    if(confirm("Are you sure you want to delete this vendor?")){
      this.loaderService.display(true);
      this.categoryServ.deletevendorToLineitem(this.projectId,this.qid,this.jobelem_details.id,vendor_id)
      .subscribe(
        res=>{
          this.successMessageShow('vendor deleted successfully!');
          this.getDetailsOfJobelement(this.jobelem_details.id);
          this.loaderService.display(false);
        },
        err=>{
          this.errorMessageShow( <any>JSON.parse(err['_body']).message);
          this.loaderService.display(false);
        }
      );
    }
  }

  calculateTotalAmt(){
    var val=(this.addVendorForm.controls['cost'].value*this.addVendorForm.controls['tax_percent'].value)/100;
    val = (val+this.addVendorForm.controls['cost'].value) * (this.addVendorForm.controls['quantity'].value || 1);
    val = Math.round( val * 10 ) / 10;
    this.addVendorForm.controls['total_amt'].setValue(val);
  }

  setTaxTypes(){
    var tax_value = this.addVendorForm.controls['tax_percent'].value
    tax_value = tax_value/2
    tax_value = Math.round( tax_value * 10 ) / 10;
    $(".cgst, .sgst").val(tax_value)
  }

  toggleTaxFields(value){
    if(value == "igst"){
      $(".tax-types").addClass("d-none");
    }else{
      $(".tax-types").removeClass("d-none");
    }
  }
}
