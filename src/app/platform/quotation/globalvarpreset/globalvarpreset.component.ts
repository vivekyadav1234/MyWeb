import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuotationService } from '../quotation.service';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-globalvarpreset',
  templateUrl: './globalvarpreset.component.html',
  styleUrls: ['./globalvarpreset.component.css'],
  providers:[QuotationService]
})
export class GlobalvarpresetComponent implements OnInit {

	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  selectedTab='kitchen';

  addPresetForm:FormGroup;

  constructor(
  	private loaderService:LoaderService,
  	private quotationService:QuotationService,
  	private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
  	this.getGlobalPresets(this.selectedTab,1);
  	this.initializeAddPresetForm();
  }

  headers_res;
  per_page;
  total_page;
  current_page;
  preset_list;
  globalVarArr_dropdown_data_dropdown_data=[];

  getGlobalPresets(category,page?){
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

  changeSelectedTab(category){
  	this.selectedTab = category;
  	this.getGlobalPresets(this.selectedTab,1);
  }

  getGlobalVariable(category){
    this.loaderService.display(true);
    this.globalVarArr_dropdown_data_dropdown_data=[];
    this.quotationService.getGlobalVariable(category).subscribe(
      res=>{
        this.globalVarArr_dropdown_data_dropdown_data = res;
        if(this.updatemodal_bool){
        	this.listofShutterFinishes(this.updatePreset_Obj.shutter_material.name,this.addPresetForm);
        	this.listofShutterFinishShades(this.updatePreset_Obj.shutter_finish.name,this.addPresetForm);
					this.addPresetForm.controls['shutter_finish'].setValue(this.updatePreset_Obj.shutter_finish.name);
    			this.addPresetForm.controls['shutter_shade_code'].setValue((this.updatePreset_Obj.custom_shutter_shade_code)?this.updatePreset_Obj.shutter_shade_code:this.updatePreset_Obj.shutter_shade_code.code);
					if(this.updatePreset_Obj.category=='kitchen'){
						this.listofSkirtingHeights(this.updatePreset_Obj.skirting_config_type,this.addPresetForm);
						this.addPresetForm.controls['skirting_config_height'].setValue(this.updatePreset_Obj.skirting_config_height);
					}
        }
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  handlelistForKitchen;
  getHandleList(shutterfin_id){
    this.loaderService.display(true);
    this.quotationService.getHandleList(shutterfin_id,"").subscribe(
      res=>{
        this.handlelistForKitchen= res['handles'];
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  listofShutterFinishes(val,form,arg?){
    this.loaderService.display(true);
    form.controls['shutter_finish'].setValue("");
    form.controls['shutter_shade_code'].setValue("");
    this.quotationService.listofShutterFinishes(val).subscribe(
      res=>{
        this.globalVarArr_dropdown_data_dropdown_data['shutter_finish']=res.shutter_finishes;
        this.globalVarArr_dropdown_data_dropdown_data['shutter_shade_code']=[];
        this.loaderService.display(false);
        
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  listofShutterFinishShades(val,form,arg?){
    this.loaderService.display(true);
    form.controls['shutter_shade_code'].setValue("");
    this.quotationService.listofShutterFinishShades(val).subscribe(
      res=>{
        this.globalVarArr_dropdown_data_dropdown_data['shutter_shade_code']=res.shades;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
    if(form.controls['category'].value=='kitchen'){
      this.getHandleList(val);
    }
  }

  listofSkirtingHeights(val,form,arg?){
    this.loaderService.display(true);
    form.controls['skirting_config_height'].setValue("");
    this.quotationService.listofSkirtingConfigs(val).subscribe(
      res=>{
        this.globalVarArr_dropdown_data_dropdown_data['skirting_config_height']=res.skirting_configs;
        this.loaderService.display(false);
      },
      err=>{
        this.loaderService.display(false);
      }
    );
  }

  initializeAddPresetForm(){
  	this.addPresetForm=this.formBuilder.group({
	  	category:new FormControl("",Validators.required),
	  	core_material:new FormControl("",Validators.required),
	  	shutter_material:new FormControl("",Validators.required),
	    shutter_finish:new FormControl("",Validators.required),
	    shutter_shade_code:new FormControl("",Validators.required),
	    edge_banding_shade_code:new FormControl(""),
	    door_handle_code:new FormControl("",Validators.required),
	    shutter_handle_code:new FormControl("",Validators.required),
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
	    preset_remark:new FormControl(""),
	    preset_name:new FormControl("",Validators.required),
	    is_preset:new FormControl(true),
	    created_by_name:new FormControl(""),
	    created_by_email:new FormControl(""),
	    created_at:new FormControl("")
	  });	
  }

  onChangeOfCategory(category,form){
  	if(category=='kitchen'){
  		// this.setFormCtrlRequiredValidation(form,'countertop');
  		this.setFormCtrlRequiredValidation(form,'skirting_config_height');
  		this.setFormCtrlRequiredValidation(form,'skirting_config_type');
  		this.setFormCtrlRequiredValidation(form,'civil_kitchen');
  		this.removeFormCtrlRequiredValidation(form,'shutter_handle_code');
  	} else {
  		this.setFormCtrlRequiredValidation(form,'shutter_handle_code');
  		// this.removeFormCtrlRequiredValidation(form,'countertop');
  		this.removeFormCtrlRequiredValidation(form,'skirting_config_height');
  		this.removeFormCtrlRequiredValidation(form,'skirting_config_type');
  		this.removeFormCtrlRequiredValidation(form,'civil_kitchen');
  		this.removeFormCtrlRequiredValidation(form,'depth');
  		this.removeFormCtrlRequiredValidation(form,'drawer_height_1');
  		this.removeFormCtrlRequiredValidation(form,'drawer_height_2');
  		this.removeFormCtrlRequiredValidation(form,'drawer_height_3');
  	}
  	this.setFormvalue(null,form);
  	form.controls['category'].setValue(category);
  }
  setFormvalue(val,form){
  	form.controls['category'].setValue((val)?val.category:"");
  	form.controls['core_material'].setValue((val)?val.core_material.name:"");
  	form.controls['shutter_material'].setValue((val)?val.shutter_material.name:"");
  	form.controls['shutter_finish'].setValue((val)?val.shutter_finish.name:"");
  	form.controls['door_handle_code'].setValue((val)?val.door_handle_code:"");
  	form.controls['shutter_handle_code'].setValue((val)?val.shutter_handle_code:"");
  	form.controls['hinge_type'].setValue((val)?val.hinge_type:"");
  	form.controls['channel_type'].setValue((val)?val.channel_type:"");
  	form.controls['brand_id'].setValue((val)?val.brand_id:"");
  	form.controls['skirting_config_height'].setValue((val)?val.skirting_config_height:"");
  	form.controls['skirting_config_type'].setValue((val)?val.skirting_config_type:"");
  	form.controls['countertop'].setValue((val)?val.countertop:"");
  	form.controls['civil_kitchen'].setValue((val)?val.civil_kitchen:"");
  	form.controls['depth'].setValue((val && val.civil_kitchen)?val.civil_kitchen_parameters.depth:"");
  	form.controls['drawer_height_1'].setValue((val && val.civil_kitchen)?val.civil_kitchen_parameters.drawer_height_1:"");
  	form.controls['drawer_height_2'].setValue((val && val.civil_kitchen)?val.civil_kitchen_parameters.drawer_height_2:"");
  	form.controls['drawer_height_3'].setValue((val && val.civil_kitchen)?val.civil_kitchen_parameters.drawer_height_3:"");
  	form.controls['door_handle_code_img'].setValue((val)?val.door_handle_image:"");
  	form.controls['shutter_handle_code_img'].setValue((val)?val.shutter_handle_image:"");
  	form.controls['preset_remark'].setValue((val)?val.preset_remark:form.controls['preset_remark'].value);
  	form.controls['preset_name'].setValue((val)?val.preset_name:form.controls['preset_name'].value);
  	form.controls['is_preset'].setValue(true);
  	form.controls['created_by_name'].setValue((val)?val.preset_created_by.name:form.controls['created_by_name'].value);
  	form.controls['created_by_email'].setValue((val)?val.preset_created_by.email:form.controls['created_by_email'].value);
  	form.controls['created_at'].setValue((val)?val.created_at:form.controls['created_at'].value);
    
    if(form.controls['category'].value=='kitchen'){
      this.removeFormCtrlRequiredValidation(form,'shutter_handle_code');
      this.setFormCtrlRequiredValidation(form,'skirting_config_height');
    }else{
      this.setFormCtrlRequiredValidation(form,'shutter_handle_code');
      this.removeFormCtrlRequiredValidation(form,'skirting_config_height');
    }
    if(val){
  		if(val.custom_shutter_shade_code){
  			form.controls['shutter_shade_code_img'].setValue("");
  			form.controls['shutter_shade_code'].setValue(val.shutter_shade_code);
  		} else {
  			form.controls['shutter_shade_code_img'].setValue((val.shutter_shade_code)?val.shutter_shade_code.shade_image:"");
  			form.controls['shutter_shade_code'].setValue((val.shutter_shade_code)?val.shutter_shade_code.code:"");
  		}
  		if(val.custom_edge_banding_shade_code){
  			form.controls['edge_banding_shade_code_img'].setValue("");
  			form.controls['edge_banding_shade_code'].setValue(val.edge_banding_shade_code);
  		} else {
  			form.controls['edge_banding_shade_code_img'].setValue((val.edge_banding_shade_code)?val.edge_banding_shade_code.shade_image:"");
  			form.controls['edge_banding_shade_code'].setValue((val.edge_banding_shade_code)?val.edge_banding_shade_code.code:"");
  		}
  	} else {
  		form.controls['shutter_shade_code_img'].setValue("");
  		form.controls['edge_banding_shade_code_img'].setValue("");
  		form.controls['shutter_shade_code'].setValue("");
  		form.controls['edge_banding_shade_code'].setValue("");
  	}
  	
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

  closePresetModal(){
  	this.addPresetForm.reset();
  	this.setFormvalue("",this.addPresetForm);
  	this.updatemodal_bool=false;
		this.updatePreset_Obj = undefined;
  }

  parentModalName;
  parentModalForm;
  openModal(targetModalName,parentModal,form){
  	$(targetModalName).modal('show');
  	$(parentModal).modal('hide');
  	$(parentModal).css({"overflow-y": "auto"});
  	this.parentModalName = parentModal;
  	this.parentModalForm = form;
  }

  closeModal(targetModalName,parentModal){
  	$(targetModalName).modal('hide');
  	$(parentModal).modal('show');
  	$(parentModal).css({"overflow-y": "auto"});
  	this.parentModalName=undefined;
  	this.parentModalForm = undefined;
  	this.handles_arr=[];
  	this.handle_for = undefined;
  }

  customshadecode;
  customedgebanshadecode;
  addShadeCode(shade,custom_bool){
    if(custom_bool){
    	this.parentModalForm.controls['shutter_shade_code'].setValue(this.customshadecode);
    } else {
    	this.parentModalForm.controls['shutter_shade_code'].setValue(shade.code);
    	this.parentModalForm.controls['edge_banding_shade_code'].setValue((shade.edge_banding_shade_id)?shade.edge_banding_shade.code:"");
    	this.parentModalForm.controls['shutter_shade_code_img'].setValue(shade.shade_image);
      this.parentModalForm.controls['edge_banding_shade_code_img'].setValue((shade.edge_banding_shade_id)?shade.edge_banding_shade.shade_image:"");
    }
    this.customshadecode = undefined;
    this.successMessageShow('Shade code selected');
    this.closeModal('#shadeCodeModal',this.parentModalName);
  }

  addEdgeBanShadeCode(edgeband,custom_bool){
    if(custom_bool){
    	this.parentModalForm.controls['edge_banding_shade_code'].setValue(this.customedgebanshadecode);
    } else {
    	this.parentModalForm.controls['edge_banding_shade_code'].setValue(edgeband.code);
    	this.parentModalForm.controls['edge_banding_shade_code_img'].setValue(edgeband.shade_image);
    }
    this.customedgebanshadecode = undefined;
    this.successMessageShow('Edge banding shade code selected');
    this.closeModal('#edgebandingShadeModal',this.parentModalName);
  }

  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 20000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 20000);
  }

  handles_arr=[];
  handle_for;
	setHandleModalParams(handleFor){
		if(handleFor=='door' && this.parentModalForm.controls['category'].value=='kitchen'){
			this.handles_arr = this.handlelistForKitchen;
		} else if(handleFor=='door' && this.parentModalForm.controls['category'].value=='wardrobe'){
			this.handles_arr = this.globalVarArr_dropdown_data_dropdown_data['door_handle_code'];
		} else {
			this.handles_arr =this.globalVarArr_dropdown_data_dropdown_data['shutter_handle_code'];
		}
		this.handle_for = handleFor;
	}

	addHandleCode(handle){
		if(this.handle_for=='door'){
			this.parentModalForm.controls['door_handle_code'].setValue(handle.code);
			this.parentModalForm.controls['door_handle_code_img'].setValue(handle.handle_image);
		} else {
			this.parentModalForm.controls['shutter_handle_code'].setValue(handle.code);
			this.parentModalForm.controls['shutter_handle_code_img'].setValue(handle.handle_image);
		}
		this.successMessageShow('Handle code selected');
    this.closeModal('#handleCodeModal',this.parentModalName);
	}

	savePreset(formval){
		this.loaderService.display(true);
		var obj = {
      'boq_global_config' : {
        'is_preset':true,
        'preset_remark':formval.preset_remark,
        'preset_name':formval.preset_name,
        'core_material':formval.core_material,
        'shutter_material':formval.shutter_material,
        'shutter_finish':formval.shutter_finish,
        'shutter_shade_code':formval.shutter_shade_code,
        // 'edge_banding_shade_code':formval.edge_banding_shade_code,
        'door_handle_code': formval.door_handle_code,
        'shutter_handle_code':(formval.category=='wardrobe')?formval.shutter_handle_code:null,
        'hinge_type': formval.hinge_type,
        // 'channel_type':formval.channel_type,
        // 'brand_id':formval.brand_id,
        'skirting_config_height':(formval.category=='kitchen')?formval.skirting_config_height:null,
        'skirting_config_type':(formval.category=='kitchen')?formval.skirting_config_type:null,
        'civil_kitchen':(formval.category=='kitchen')?formval.civil_kitchen:null,
        'category':formval.category
      }
    }
    if(obj.boq_global_config.category=='kitchen'){
    	// obj['boq_global_config']['countertop']=formval.countertop;
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
      	this.getGlobalPresets(this.selectedTab,1);
      	this.successMessageShow('Preset saved successfully!');
        this.loaderService.display(false);
        $('#presetModal').modal('hide');
        this.closePresetModal();
      },
      err=>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
	}

	deletePreset(id){
		if(confirm('Are you sure you want to delete this preset?')==true){
			this.loaderService.display(true);
			this.quotationService.deleteBoqGlobalConfig(id).subscribe(
	      res=>{
	      	this.getGlobalPresets(this.selectedTab,1);
	      	this.successMessageShow('Preset deleted successfully!');
	        this.loaderService.display(false);
	      },
	      err=>{
	        this.loaderService.display(false);
	        this.errorMessageShow(JSON.parse(err['_body']).message);
	      }
	    );
		}
	}

	updatePreset(id,formval){
		this.loaderService.display(true);
		var obj = {
      'boq_global_config' : {
        'is_preset':true,
        'preset_remark':formval.preset_remark,
        'preset_name':formval.preset_name,
        'core_material':formval.core_material,
        'shutter_material':formval.shutter_material,
        'shutter_finish':formval.shutter_finish,
        'shutter_shade_code':formval.shutter_shade_code,
        // 'edge_banding_shade_code':formval.edge_banding_shade_code,
        'door_handle_code': formval.door_handle_code,
        'shutter_handle_code':(formval.category=='wardrobe')?formval.shutter_handle_code:null,
        'hinge_type': formval.hinge_type,
        // 'channel_type':formval.channel_type,
        // 'brand_id':formval.brand_id,
        'skirting_config_height':(formval.category=='kitchen')?formval.skirting_config_height:null,
        'skirting_config_type':(formval.category=='kitchen')?formval.skirting_config_type:null,
        'civil_kitchen':(formval.category=='kitchen')?formval.civil_kitchen:null,
        'category':formval.category
      }
    }
    if(obj.boq_global_config.category=='kitchen'){
    	// obj['boq_global_config']['countertop']=formval.countertop;
    }
    if(obj.boq_global_config.civil_kitchen=='true'){
      obj['boq_global_config']['civil_kitchen_parameter_attributes'] =  {
          'depth': formval.depth,
          'drawer_height_1':formval.drawer_height_1,
          'drawer_height_2':formval.drawer_height_2,
          'drawer_height_3':formval.drawer_height_3
        }
    }
    this.quotationService.updateBoqGlobalConfig(obj,id).subscribe(
      res=>{
      	this.getGlobalPresets(this.selectedTab,1);
      	this.successMessageShow('Preset updated successfully!');
        this.loaderService.display(false);
        $('#presetModal').modal('hide');
        this.closePresetModal();
      },
      err=>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
	}

	updatemodal_bool = false;
	updatePreset_Obj;
	openEditPresetModal(data){
		this.updatemodal_bool=true;
		this.updatePreset_Obj = data;
		this.setFormvalue(data,this.addPresetForm);
		this.getGlobalVariable(data.category);
		// this.listofShutterFinishes(data.shutter_material.name,this.addPresetForm);
		// this.addPresetForm.controls['shutter_finish'].setValue(data.shutter_finish.name);
    // this.addPresetForm.controls['shutter_shade_code'].setValue(data.shutter_shade_code.code);
		if(data.category=='kitchen'){
			// this.listofSkirtingHeights(data.skirting_config_type,this.addPresetForm);
			// this.addPresetForm.controls['skirting_config_height'].setValue(data.skirting_config_height);
		}
		$('#presetModal').modal('show');
	}

	
}
