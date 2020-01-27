import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Routes, RouterModule , Router,ActivatedRoute, Params } from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { AbstractControl, FormControl, FormBuilder, FormArray,FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { DesignerService } from '../../designer/designer.service';
declare var $:any;

@Component({
  selector: 'app-scope-document',
  templateUrl: './scope-document.component.html',
  styleUrls: ['./scope-document.component.css'],
  providers: [LeadService, LoaderService, DesignerService]
})
export class ScopeDocumentComponent implements OnInit {

	successalert;
  successMessage;
  erroralert;
  errorMessage;
  scopeForm : FormGroup;
  lead_id:any;
  role:any;
  lead_details:any;
  lead_status;

  constructor(
  	public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public designerService : DesignerService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.loaderService.display(true);
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');

    this.initScopeForm();
    this.fetchBasicDetails();
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.scopeForm.patchValue({project_id: this.lead_details.project_details.id});
        this.fetchScopeForm();
        // this.scopeForm.value.project_id = this.lead_details.project_details.id;
        // this.scopeForm.value.client_id = this.lead_details.id;
      },
      err => {
        
      }
    );
  }

  current_scope_form:any = {}
  fetchScopeForm(){
    this.leadService.fetchScopeForm(this.lead_details.project_details.id).subscribe(
      res => {
        if(res){
          this.current_scope_form = res['scope_of_work']
          this.updatePrevForm(this.current_scope_form);
        }
        
      },
      err => {
        this.erroralert = true;
        this.errorMessage = err['statusText']+": "+JSON.parse(err['_body'])['message'];

         // this.errorMessage = JSON.parse(error['_body']).message;
         this.loaderService.display(false);
         setTimeout(function() {
            this.erroralert = false;
        }.bind(this), 5000);
        
      });
  }

  updatePrevForm(form){
  for(var i = 0; i < form['scope_spaces'].length; i++){
    this.addNestedSpace(form['scope_spaces'][i].space_type, form['scope_spaces'][i].space_name, form['scope_spaces'][i].id);
    
    for(var j = 0; j < this.scopeForm.value.scope_spaces_attributes[i].scope_qnas_attributes.length; j++){
      for(var k = 0; k < form['scope_spaces'][i]['scope_qnas'].length; k++){
        if(form['scope_spaces'][i]['scope_qnas'][k]['question'] == this.scopeForm.value.scope_spaces_attributes[i].scope_qnas_attributes[j].question){
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['arrivae_scope'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['arrivae_scope']);
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['client_scope'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['client_scope']);
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['remark'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['remark']);
          (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.scopeForm.controls['scope_spaces_attributes']).controls[i]).controls['scope_qnas_attributes']).controls[j]).controls['id'].setValue(form['scope_spaces'][i]['scope_qnas'][j]['id']);
        }
      }
        
    }
  }
}

  initScopeForm(){
  	this.scopeForm = this.formBuilder.group({
  	  project_id : new FormControl(),
  	  // client_id : new FormControl(),

  	  scope_spaces_attributes: this.formBuilder.array([])
      })
  }

  buildModularKitchen(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("base_unit"),
  	  		this.buildQA("wall_unit"),
  	  		this.buildQA("counter_top"),
  	  		this.buildQA("sink"),
  	  		this.buildQA("kitchen_hob "),
  	  		this.buildQA("kitchen_chimney"),
  	  		this.buildQA("gas_piping"),
  	  		this.buildQA("core_cutting")
  	  	]
  	  )
  	})
  }

  buildServices(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("electrical_point_shifting"),
  	  		this.buildQA("old_granite_demolition"),
  	  		this.buildQA("false_ceiling"),
  	  		this.buildQA("flooring"),
  	  		this.buildQA("painting "),
  	  		this.buildQA("wall_cladding"),
  	  		this.buildQA("dado_tile")
  	  	]
  	  )
  	})
  }

  buildComplimentaryItems(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("air_conditioner"),
  	  		this.buildQA("others")
  	  	]
  	  )
  	})
  }

  buildBoughtOutItems(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("dining_table"),
  	  		this.buildQA("sofa_set"),
  	  		this.buildQA("center_table"),
  	  		this.buildQA("others")
  	  	]
  	  )
  	})
  }

  buildMasterBedRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wardrobe"),
  	  		this.buildQA("loft"),
  	  		this.buildQA("cot"),
  	  		this.buildQA("vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("others"),
  	  	]
  	  )
  	})
  }

  buildKidsBedRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wardrobe"),
  	  		this.buildQA("loft"),
  	  		this.buildQA("cot"),
  	  		this.buildQA("vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("study_table"),
  	  		this.buildQA("others"),
  	  	]
  	  )
  	})
  }

  buildGuestBedRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wardrobe"),
  	  		this.buildQA("loft"),
  	  		this.buildQA("cot"),
  	  		this.buildQA("vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("others"),
  	  	]
  	  )
  	})
  }

  buildLivingRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("crockery_unit"),
  	  		this.buildQA("common_vanity"),
  	  		this.buildQA("tv_unit"),
  	  		this.buildQA("ledge"),
  	  	]
  	  )
  	})
  }

  buildFoyer(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("shoe_rack")
  	  	]
  	  )
  	})
  }

  buildPoojaRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  scope_qnas_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("quartz_/_granite_top"),
  	  		this.buildQA("bells"),
  	  	]
  	  )
  	})
  }

  buildQA(que, id = ""){
  	return new FormGroup({
      id: new FormControl(id),
      question: new FormControl(que),
      arrivae_scope: new FormControl("n/a"),
      client_scope: new FormControl("n/a"),
      remark: new FormControl(),
    })
  }

  space:any = 'modular_kitchen';
  selectSpace(event){
  	this.space = event.target.value;
  }

  addSpace(){
  	this.addNestedSpace(this.space);
  }

  addNestedSpace(space, space_name = "", id = ""){
  	const getFun = this.scopeForm.get('scope_spaces_attributes') as FormArray;

  	if(space == "modular_kitchen"){
  		getFun.push(this.buildModularKitchen(space,space_name,id));
  	}
  	else if(space == "services"){
  		getFun.push(this.buildServices(space,space_name,id));
  	}
  	else if(space == "complimentary_items"){
  		getFun.push(this.buildComplimentaryItems(space,space_name,id));
  	}
  	else if(space == "bought_out_items"){
  		getFun.push(this.buildBoughtOutItems(space,space_name,id));
  	}
  	else if(space == "master_bed_room"){
  		getFun.push(this.buildMasterBedRoom(space,space_name,id));
  	}
  	else if(space == "kids_bed_room"){
  		getFun.push(this.buildKidsBedRoom(space,space_name,id));
  	}
  	else if(space == "guest_bed_room"){
  		getFun.push(this.buildGuestBedRoom(space,space_name,id));
  	}
  	else if(space == "living_room"){
  		getFun.push(this.buildLivingRoom(space,space_name,id));
  	}
  	else if(space == "foyer"){
  		getFun.push(this.buildFoyer(space,space_name,id));
  	}
  	else if(space == "pooja_room"){
  		getFun.push(this.buildPoojaRoom(space,space_name,id));
  	}
  }

  scopeFormSubmit(){
    if(this.current_scope_form && this.current_scope_form.id){
    	this.leadService.scopeFormUpdate(this.scopeForm.value, this.current_scope_form.id).subscribe(
    		res => {
    			alert("Form successfully submitted");
    		},
    		err => {
    			
    			alert("Something went bad. Please try again");
    		});
    }
    else{
      this.leadService.scopeFormSubmit(this.scopeForm.value).subscribe(
        res => {
          alert("Form successfully submitted");
        },
        err => {
          
          alert("Something went bad. Please try again");
        });
    }
  }

}
