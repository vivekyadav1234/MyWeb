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
  selector: 'app-requirement-sheet',
  templateUrl: './requirement-sheet.component.html',
  styleUrls: ['./requirement-sheet.component.css'],
  providers: [LeadService, LoaderService, DesignerService]
})
export class RequirementSheetComponent implements OnInit {

	successalert;
  successMessage;
  erroralert;
  errorMessage;
  requirementForm : FormGroup;
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

    this.initRequirementForm();
    this.fetchBasicDetails();
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        // this.initRequirementForm();
        this.requirementForm.patchValue({project_id: this.lead_details.project_details.id});
        this.fetchRequirementForm();
        // this.requirementForm.value.project_id = this.lead_details.project_details.id;
      },
      err => {
        
      }
    );
  }

  current_requirement_form:any = {}
  fetchRequirementForm(){
    this.leadService.fetchRequirementForm(this.lead_details.project_details.id).subscribe(
      res => {
        if(res){
          this.current_requirement_form = res['project_requirement']
          this.updatePrevForm(this.current_requirement_form);
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
    // this.requirementForm.controls['requirement_sheets_attributes'].reset();
    this.requirementForm.patchValue({requirement_name: form['requirement_name']});
    this.requirementForm.patchValue({requirement_name: form['requirement_name']});
    this.requirementForm.patchValue({budget: form['budget']});
    this.requirementForm.patchValue({service: form['service']});
    this.requirementForm.patchValue({color_preference: form['color_preference']});
    for(var i = 0; i < form['requirement_sheets'].length; i++){
      this.addNestedSpace(form['requirement_sheets'][i].space_type, form['requirement_sheets'][i].space_name, form['requirement_sheets'][i].id);
      for(var j = 0; j < this.requirementForm.value.requirement_sheets_attributes[i].requirement_space_q_and_as_attributes.length; j++){
         for(var k = 0; k < form['requirement_sheets'][i]['requirement_space_q_and_as'].length; k++){
           if(form['requirement_sheets'][i]['requirement_space_q_and_as'][k]['question'] == this.requirementForm.value.requirement_sheets_attributes[i].requirement_space_q_and_as_attributes[j].question){
             (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.requirementForm.controls['requirement_sheets_attributes']).controls[i]).controls['requirement_space_q_and_as_attributes']).controls[j]).controls['answer'].setValue(form['requirement_sheets'][i]['requirement_space_q_and_as'][k]['answer']);
             (<FormGroup>(<FormArray>(<FormGroup>(<FormArray>this.requirementForm.controls['requirement_sheets_attributes']).controls[i]).controls['requirement_space_q_and_as_attributes']).controls[j]).controls['id'].setValue(form['requirement_sheets'][i]['requirement_space_q_and_as'][k]['id']);
           }
         }
      }
    }
    this.loaderService.display(false);
  }

  initRequirementForm(){
  	this.requirementForm = this.formBuilder.group({
  	  project_id : new FormControl(),
  	  requirement_name : new FormControl(),
  	  budget : new FormControl(),
  	  service: new FormControl(""),
  	  color_preference: new FormControl(),

  	  requirement_sheets_attributes: this.formBuilder.array([])
      })
  }

  buildKitchen(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  requirement_space_q_and_as_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("type"),
  	  		this.buildQA("shape"),
  	  		this.buildQA("accessories"),
  	  		this.buildQA("appliance"),
  	  		this.buildQA("core_material"),
  	  		this.buildQA("shutter_finish"),
  	  		this.buildQA("kitchen_platform_removal"),
  	  		this.buildQA("tiles_removal"),
  	  		this.buildQA("plumbing_lines"),
  	  		this.buildQA("electrical_point_shifting"),
  	  		this.buildQA("cooking"),
  	  		this.buildQA("eating_area")
  	  	]
  	  )
  	})
  }

  buildBedroom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  requirement_space_q_and_as_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wr_hinged"),
  	  		this.buildQA("wr_sliding"),
  	  		this.buildQA("bed"),
  	  		this.buildQA("mirror"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("side_table"),
  	  		this.buildQA("study_table"),
  	  		this.buildQA("book_rack"),
  	  		this.buildQA("entertainment_unit"),
  	  		this.buildQA("core_material"),
  	  		this.buildQA("shutter_finish")
  	  	]
  	  )
  	})
  }

  buildKidsRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  requirement_space_q_and_as_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wr_hinged"),
  	  		this.buildQA("wr_sliding"),
  	  		this.buildQA("bunk_bed"),
  	  		this.buildQA("mirror"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("side_table"),
  	  		this.buildQA("study_table"),
  	  		this.buildQA("book_rack"),
  	  		this.buildQA("entertainment_unit"),
  	  		this.buildQA("core_material"),
  	  		this.buildQA("shutter_finish")
  	  	]
  	  )
  	})
  }

  buildGuestRoom(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  requirement_space_q_and_as_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("wr_hinged"),
  	  		this.buildQA("wr_sliding"),
  	  		this.buildQA("mirror"),
  	  		this.buildQA("dresser"),
  	  		this.buildQA("side_table"),
  	  		this.buildQA("study_table"),
  	  		this.buildQA("book_rack"),
  	  		this.buildQA("entertainment_unit"),
  	  		this.buildQA("core_material"),
  	  		this.buildQA("shutter_finish")
  	  	]
  	  )
  	})
  }

  buildLiving(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  requirement_space_q_and_as_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("entertainment_unit"),
  	  		this.buildQA("shoe_rack"),
  	  		this.buildQA("crockery_unit"),
  	  		this.buildQA("dining_table"),
  	  		this.buildQA("core_material"),
  	  		this.buildQA("shutter_finish")
  	  	]
  	  )
  	})
  }

  buildFurniture(space,space_name,id){
  	return new FormGroup({
      id: new FormControl(id),
  	  space_type: new FormControl(space),
  	  space_name: new FormControl(space_name),
  	  requirement_space_q_and_as_attributes: this.formBuilder.array(
  	  	[
  	  		this.buildQA("vanity_unit"),
  	  		this.buildQA("mirror"),
  	  		this.buildQA("medicine_box"),
  	  		this.buildQA("utility_area_/_sink_storage_area"),
  	  		this.buildQA("console"),
  	  		this.buildQA("coffee_table"),
          this.buildQA("side_table"),
          this.buildQA("wall_shelves"),
          this.buildQA("core_material"),
          this.buildQA("shutter_finish"),
          this.buildQA("sofa"),
          this.buildQA("accessories"),
          this.buildQA("wing_chairs_/_accent_chairs"),
          this.buildQA("curtains"),
          this.buildQA("rugs"),
  	  	]
  	  )
  	})
  }

  buildQA(que,id = ""){
  	return new FormGroup({
      id: new FormControl(id),
      question: new FormControl(que),
      answer: new FormControl("")
    })
  }

  space:any = 'kitchen';
  selectSpace(event){
  	this.space = event.target.value;
  }

  addSpace(){
  	this.addNestedSpace(this.space);
  }

  addNestedSpace(space, space_name = "", id = ""){
  	const getFun = this.requirementForm.get('requirement_sheets_attributes') as FormArray;

  	if(space == "kitchen"){
  		getFun.push(this.buildKitchen(space,space_name,id));
  	}
  	else if(space == "bedroom"){
  		getFun.push(this.buildBedroom(space,space_name,id));
  	}
  	else if(space == "living_and_dining"){
  		getFun.push(this.buildLiving(space,space_name,id));
  	}
  	else if(space == "kidsroom"){
  		getFun.push(this.buildKidsRoom(space,space_name,id));
  	}
  	else if(space == "guestroom"){
  		getFun.push(this.buildGuestRoom(space,space_name,id));
  	}
  	else if(space == "other_furnitures"){
  		getFun.push(this.buildFurniture(space,space_name,id));
  	}
  }

  requirementFormSubmit(){
    this.loaderService.display(true);
    if(this.current_requirement_form && this.current_requirement_form.id){
      this.leadService.requirementFormUpdate(this.requirementForm.value, this.current_requirement_form.id).subscribe(
        res => {
          // this.requirementForm.reset();
          // this.fetchRequirementForm();
          this.successalert = true;
          this.successMessage = "Form submitted successfully";
          this.loaderService.display(false);
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 5000);
        },
        err => {
          
          this.erroralert = true;
          this.errorMessage = "Something went wrong";
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 5000);
          this.loaderService.display(false);
        });
    }
    else{
      this.leadService.requirementFormSubmit(this.requirementForm.value).subscribe(
        res => {
          // this.requirementForm.reset();
          // this.fetchRequirementForm();
          this.successalert = true;
          this.successMessage = "Form submitted successfully";
          this.loaderService.display(false);
          setTimeout(function() {
              this.successalert = false;
          }.bind(this), 5000);
        },
        err => {
          
          this.erroralert = true;
          this.errorMessage = "Something went wrong";
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 5000);
          this.loaderService.display(false);
        });
    }
  }

  changeAppliances(event,i,j){
  	if(this.requirementForm.value.requirement_sheets_attributes[i].requirement_space_q_and_as_attributes[j].answer !=null){
  		var valueArr:any = this.requirementForm.value.requirement_sheets_attributes[i].requirement_space_q_and_as_attributes[j].answer.split(",")
  	}
  	else{
  		var valueArr:any = []
  	}
  	
  	if(event.target.checked){
  		valueArr.push(event.target.value)
  	}
  	else{
  		var index = valueArr.indexOf(event.target.value, 0);
  		if (index > -1) {
  		   valueArr.splice(index, 1);
  		}
  	}

  	this.requirementForm.value.requirement_sheets_attributes[i].requirement_space_q_and_as_attributes[j].answer = valueArr.join(",")
  }

  updateService(event){
  	var valueArr:any = this.requirementForm.value.service.split(",")
  	if(event.target.checked){
  		valueArr.push(event.target.value)
  	}
  	else{
  		var index = valueArr.indexOf(event.target.value, 0);
  		if (index > -1) {
  		   valueArr.splice(index, 1);
  		}
  	}
    this.requirementForm.patchValue({service: valueArr.join(",")});
  	// this.requirementForm.value.service = valueArr.join(",")
  }

}
