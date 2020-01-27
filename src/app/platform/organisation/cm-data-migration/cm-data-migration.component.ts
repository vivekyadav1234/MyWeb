import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import {LeadService} from '../../lead/lead.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cm-data-migration',
  templateUrl: './cm-data-migration.component.html',
  styleUrls: ['./cm-data-migration.component.css'],
  providers:[LeadService]
})
export class CmDataMigrationComponent implements OnInit {

	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  migrationForm:FormGroup = new FormGroup({
  	'from_id':new FormControl("",Validators.required),
  	'to_id':new FormControl("",Validators.required)
  })
  constructor(
  	private leadService:LeadService,
		private loaderService:LoaderService
  ) { }

  ngOnInit() {
  	this.getCmList();
  }

  cmlistArr;
  getCmList(){
  	this.loaderService.display(true);
  	this.leadService.getCmList().subscribe(
  		res=>{
  			this.cmlistArr=res.community_managers;
  			this.loaderService.display(false);
  		},
  		err=>{
        this.loaderService.display(false);
  		}
  	);
  }

  migrateData(formval){
  	if(confirm('Are you sure you want to migrate the data?')){
	  	this.loaderService.display(true);
	  	this.leadService.migrateCMData(formval.from_id,formval.to_id).subscribe(
	  		res=>{
	  			this.successalert = true;
	        this.successMessage = res.message;
	        this.cmAssignedData(formval.from_id,'new','from');
	        this.cmAssignedData(formval.to_id,'new','to');
	        setTimeout(function() {
		          this.successalert = false;
		      	}.bind(this), 15000);

	  			this.loaderService.display(false);
	  		},
	  		err=>{
	  			this.errorMessageShow(JSON.parse(err['_body']).message);
	        this.loaderService.display(false);
	  		}
	  	);
	  }
  }
  errorMessageShow(msg){
  	this.erroralert = true;
    this.errorMessage=msg;
    setTimeout(function() {
      this.erroralert = false;
   	}.bind(this), 15000);
  }
  old_from_cm_data_count;
  old_to_cm_data_count;
  new_from_cm_data_count;
  new_to_cm_data_count;

  cmAssignedData(cmid,arg1,arg2){
  	if(arg1=='old' && arg2=='from'){
  		this.old_from_cm_data_count = undefined;
  		this.new_from_cm_data_count = undefined
  	} else if(arg1=='old' && arg2=='to'){
  		this.old_to_cm_data_count = undefined;
  		this.new_to_cm_data_count = undefined
  	}
		if(cmid!=undefined){
			this.loaderService.display(true);
	  	this.leadService.cmAssignedData(cmid).subscribe(
	  		res=>{
	  			this.setCountInfo(arg1,arg2,res.cm_data);
	  			this.loaderService.display(false);
	  		},
	  		err=>{
	  			this.errorMessageShow(JSON.parse(err['_body']).message);
	        this.loaderService.display(false);
	  		}
	  	);
	  }
  }

  setCountInfo(arg1,arg2,data){
  	var input = ((arg1=='old')?((arg2=='from')?'1':'2'):((arg2=='from')?'3':'4'));
  	switch (input) {
  		case "1":
  			this.old_from_cm_data_count = data;
  			break;
  		case "2":
  			this.old_to_cm_data_count = data;
  			break;
  		case "3":
  			this.new_from_cm_data_count = data;
  			break;
  		case "4":
  			this.new_to_cm_data_count = data;
  			break;
  		default:
  			break;
  	}
  }
}
