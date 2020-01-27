import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import {CadService} from '../cad.service';
import { LeadService } from '../../lead/lead.service';
import { FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators } from '../../../../../node_modules/@angular/forms';
import { ReferralService } from '../../referral/referral.service';
declare var $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[CadService,LeadService,ReferralService]

})
export class DashboardComponent implements OnInit {
  basefile: any;
  attachment_file: any;
	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
  headers_res;
  per_page;
  total_page;
  current_page;
  inviteChampionForm: FormGroup;
  champion_user: any;
  champion_list_first_level: any[];
  champion_list_second_level: any[];
  champion_list_third_level: any;
  champion_types: any;
  lead_types: any;
  lead_campaigns: any;
  lead_sources: any;
  csagentsArr: any;
  dropdownList: any;
  dropdownList2: any;
  dropdownList3: any;
  dropdownList4: any;
  dropdownList5: any;
  addLeadForm: FormGroup;
  is_champion;


  constructor(
  	private loaderService : LoaderService,
  	private cadService:CadService,
    private leadService : LeadService,
    private formBuilder:FormBuilder,
    private referralService:ReferralService
  ) { }

  ngOnInit() {
  	this.loaderService.display(false);
    this.getProjectList(1);
    this.is_champion = localStorage.getItem('isChampion');
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
  project_list;
  getProjectList(page?){
    this.cadService.getProjectList(page).subscribe(
      res=>{
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.project_list = res['projects']
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

  // Add Lead code starts here
  addLeadFormSubmit(data) {
    this.loaderService.display(true);
    data['created_by'] = localStorage.getItem('userId');
    var obj = {
			lead:data
		}
    this.referralService.addLead(data)
        .subscribe(
          res => {
            this.addLeadForm.reset();
            this.loaderService.display(false);
            $('#addNewLeadModal').modal('hide');
            this.successalert = true;
            this.successMessage = "Lead created successfully !!";
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 3000);
          },
          err => {
            this.loaderService.display(false);
            this.erroralert = true;
            this.errorMessage = JSON.parse(err['_body']).message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 3000);
          }
        );
  }

	closeAddLeadModal(){
		this.addLeadForm.reset();
	}

	onChange(event) {
		document.getElementById('extErrorMsg').classList.add('d-none');
		this.basefile = undefined;
	   this.attachment_file = event.srcElement.files[0];
	   var re = /(?:\.([^.]+))?$/;
	   var ext = re.exec(this.attachment_file.name)[1];
		var fileReader = new FileReader();
		   var base64;
	   if(ext == 'xlsx' || ext == 'xls') {
			fileReader.onload = (fileLoadedEvent) => {
			 base64 = fileLoadedEvent.target;
			 this.basefile = base64.result;
		   };
		}
		else {
		  document.getElementById('extErrorMsg').classList.remove('d-none');
		}

		fileReader.readAsDataURL(this.attachment_file);
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

  onChangeOfLeadType(val){
    for(var i=0;i<this.lead_types.length;i++){
      if(val==this.lead_types[i].id){
        this.addLeadForm.controls['lead_type_name'].setValue(this.lead_types[i].name);
      }
    }
  }
  //Add Lead code ends here

}
