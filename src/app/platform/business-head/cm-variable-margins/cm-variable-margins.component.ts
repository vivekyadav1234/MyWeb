import { Component, OnInit } from '@angular/core';
import {BusinessHeadService} from '../business-head.service';
import { LoaderService } from '../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../lead/lead.service';
declare var $:any;
@Component({
  selector: 'app-cm-variable-margins',
  templateUrl: './cm-variable-margins.component.html',
  styleUrls: ['./cm-variable-margins.component.css'],
  providers:[BusinessHeadService,LeadService]
})
export class CmVariableMarginsComponent implements OnInit {
  addLeadForm:FormGroup;
  lead_types: any;
  lead_campaigns: any;
  lead_sources: any;
  csagentsArr: any;
  dropdownList: any;
  dropdownList2: any;
  dropdownList3: any;
  dropdownList4: any;
  dropdownList5: any;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  inviteChampionForm: FormGroup;
  is_champion;

	constructor(
		private businessHeadService:BusinessHeadService,
    private loaderService:LoaderService,
    private formBuilder:FormBuilder,
    private leadService : LeadService
	) { }

	ngOnInit() {
		this.getCMList();
    this.is_champion = localStorage.getItem('isChampion');
    
    this.role= localStorage.getItem('user');
    this.role_id = localStorage.getItem('userId');
    this.loaderService.display(false);

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

  Object=Object;
  role:string;
  role_id;
	selected_cm_id="";
	successalert =false;
	successMessage:string;
	erroralert=false;
	errorMessage:string;
	cm_mkw_variable_pricing_data;
	getVariablePriceForCM(val){
			this.loaderService.display(true);
      this.businessHeadService.getVariablePriceForCM(val)
        .subscribe(
          res => {
            	
            	if(res){
            		this.cm_mkw_variable_pricing_data=res.cm_mkw_variable_pricing;
            	} else {
            		this.cm_mkw_variable_pricing_data = null;
            	}
            	this.changeSectionTab('full_home')
              this.loaderService.display(false);
            },
            error =>  {
              
               this.loaderService.display(false);
            }
        );
	}

	deleteVariablePriceInstance(id,tag){
		if(confirm('Are you sure you want to delete this instance?')== true) {
	      this.loaderService.display(true);
	      this.businessHeadService.deleteVariablePriceInstance(id,tag)
	        .subscribe(
	          res => {
              
              if(res){
                this.cm_mkw_variable_pricing_data=res.cm_mkw_variable_pricing;
              } else {
                this.cm_mkw_variable_pricing_data = null;
              }
	            this.successalert = true;
	            this.successMessage = "Instance deleted successfully";
	            setTimeout(function() {
	                this.successalert = false;
	             }.bind(this), 20000);
	              this.loaderService.display(false);
	            },
	            error =>  {
	              this.erroralert = true;
	              this.errorMessage = <any>JSON.parse(error['_body']).message;
	              setTimeout(function() {
	                this.erroralert = false;
	             }.bind(this), 20000);
	               this.loaderService.display(false);
	            }
	        );
	    }
	}

	attachment_file;
  basefile;
  onChange(event) {
  	this.basefile= undefined;
    this.attachment_file =event.target.files[0] || event.srcElement.files[0];
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(this.attachment_file.name)[1];
    var fileReader = new FileReader();
    var base64;
    if(ext == 'yml') {
      if(document.getElementById('extErrorMsg')){
        document.getElementById('extErrorMsg').classList.add('d-none')
      }
      fileReader.onload = (fileLoadedEvent) => {
        base64 = fileLoadedEvent.target;
        this.basefile = base64.result;
      };
    } else{
      document.getElementById('extErrorMsg').classList.remove('d-none');
    }
    fileReader.readAsDataURL(this.attachment_file);
  }

	import_selected_cmid="";
	import_selected_type="";
	importVariablePriceForCm(){
		this.loaderService.display(true);
		this.attachment_file= this.basefile;
    this.businessHeadService.importVariablePriceForCm(this.import_selected_cmid,this.import_selected_type,this.attachment_file)
      .subscribe(
        res => {
          	
            this.closemodal();
            if(this.selected_cm_id==res.cm_mkw_variable_pricing.cm_id){
              this.cm_mkw_variable_pricing_data = res.cm_mkw_variable_pricing;
            }
            this.successalert =true;
            this.successMessage = "Imported successfully";
            setTimeout(function() {
                this.successalert = false;
             }.bind(this), 20000);
            this.loaderService.display(false);
          },
          error =>  {
            
            this.erroralert = true;
	          this.errorMessage = <any>JSON.parse(error['_body']).message;
	              setTimeout(function() {
	                this.erroralert = false;
	            }.bind(this), 20000);
             this.loaderService.display(false);
          }
      );
	}
  closemodal(){
    this.attachment_file = undefined;
    this.basefile= undefined;
    this.import_selected_cmid = "";
    this.import_selected_type = "";
    $('#importmarginsmodal').modal('hide');
    (<HTMLInputElement>document.getElementById('upload_input')).value="";
  }
	cmList=[];
  selectedsectionName='full_home';
	getCMList() {
		this.loaderService.display(true);
    this.businessHeadService.getCommunityManagersList()
        .subscribe(
          res => {
            Object.keys(res).map((key)=>{ this.cmList= res[key];});
            if(this.role =='community_manager'){
              this.getVariablePriceForCM(this.role_id);
              this.selected_cm_id = this.role_id;
            }
            this.loaderService.display(false);
          },
          error => {
            this.erroralert = true;
            this.errorMessage=JSON.parse(error['_body']).message;
            this.loaderService.display(false);
          }
        );
  }
  changeSectionTab(val){
    this.selectedsectionName = val;
    $(".container-set .rowContainer").addClass("d-none");
    if(val=='full_home'){
      document.getElementById('fullhomeRow').classList.remove('d-none');
    } else if(val=='mkw'){
      document.getElementById('mkwRow').classList.remove('d-none');
    }
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

  numberCheck(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58)
        || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
        || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
      return false;
    }
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
}

