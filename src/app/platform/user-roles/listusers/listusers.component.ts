import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRolesService } from '../user-roles.service';
import { Observable } from 'rxjs';
import { User } from '../user';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  EmailValidator
} from '@angular/forms';
declare var $:any;
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.css'],
  providers: [UserRolesService]
})
export class ListusersComponent implements OnInit {

  observableUsers: Observable<User[]>
  users: User[];
  role:string;
  updateRoleAccess = ['admin'];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  showvalidEmaliMsg : boolean;
  exportFileData:any;
  updatedRole =[];
  headers_res;
  per_page;
  total_page;
  current_page;
  is_arrivaechampion:boolean;
  is_champion;
  
  constructor(
  	private router: Router,
    private userRoleService:UserRolesService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.role=localStorage.getItem('user');
   }

  inviteUserForm = this.formBuilder.group({
     contact: new FormControl(''),
     name : new FormControl('',Validators.required),
     user_type : new FormControl('',Validators.required),
     email : new FormControl('',[Validators.required])
  });
  ngOnInit() {
  	this.getUserListFromService(1);
    // this.exportLeads();
    this.is_champion = localStorage.getItem('isChampion');
  }
  // ngAfterViewInit() {
  //       $('[data-toggle="tooltip"]').tooltip();
  // }
  ngOnChanges(): void {
    this.getUserListFromService();
  }
  search="";
  getUserListFromService(page?){
    this.loaderService.display(true);
    this.userRoleService.getUserList(page,this.search).subscribe(
        res => {
          this.headers_res = res.headers._headers;
          this.per_page = this.headers_res.get('x-per-page');
          this.total_page = this.headers_res.get('x-total');
          this.current_page = this.headers_res.get('x-page');

          res= res.json();
          this.users = res.users;
          this.loaderService.display(false);
        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = JSON.parse(this.errorMessage['_body']).message;
          this.loaderService.display(false);
        //  this.errorMessage = <any>error;

          //$.notify(JSON.parse(this.errorMessage['_body']).message);

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

  onDropdownChange(id,value,rowid){
    this.updatedRole[rowid] = value;
    if(this.updatedRole[rowid] != undefined && this.updatedRole[rowid] !='') {
      document.getElementById("updaterolerow"+id).classList.remove('inputBorder');
    }
  }
  updateRole(id,index) {
    if(this.updatedRole[index] != undefined && this.updatedRole[index] !='') {
      document.getElementById("updaterolerow"+id).classList.remove('inputBorder');
      this.loaderService.display(true);
      this.userRoleService.updateRole(id,this.updatedRole[index])
          .subscribe(
              res => {
                Object.keys(res).map((key)=>{ res= res[key];});
                this.users[index] = res;
                this.getUserListFromService();
                this.updatedRole[index] = undefined;
                this.loaderService.display(false);
                this.successalert = true;
                this.successMessage = "Updated Successfully!";
                $(window).scrollTop(0);
                setTimeout(function() {
                     this.successalert = false;
                }.bind(this), 5000);

              //  $.notify('Updated Successfully!');
              },
              error => {
                
                this.loaderService.display(false);
                this.erroralert = true;
                this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
                $(window).scrollTop(0);
                setTimeout(function() {
                         this.erroralert = false;
                 }.bind(this), 5000);

                //$.notify(JSON.parse(error['_body']).message);
              }
            );
    } else {
      document.getElementById("updaterolerow"+id).classList.add('inputBorder');
    }
  }
  onSubmit(data, formelem){
    if(formelem.controls['name'].errors && formelem.controls['name'].errors.required) {
      document.getElementById("name").classList.add('inputBorder');
    }
    if(formelem.controls['email'].errors && formelem.controls['email'].errors.required) {
      document.getElementById("email").classList.add('inputBorder');
    }
    if(formelem.controls['user_type'].errors && formelem.controls['user_type'].errors.required) {
      document.getElementById("user_type").classList.add('inputBorder');
    }
    if($("#arrivaeChampioncheckbox").prop('checked') == true){
      this.is_arrivaechampion = true;
    }
    else{
      this.is_arrivaechampion = false;
    }
    
    if(formelem.valid) {
      if(this.checkEmail(formelem.controls['email'].value)) {
        $('#validEmailMsg').hide();
        this.loaderService.display(true);
        this.userRoleService.inviteUser(data,this.is_arrivaechampion)
          .subscribe(
            res => {
              $('#inviteModal').modal('hide');
              document.getElementById('afterSubmitFailedErrMsg').innerHTML='';
              formelem.reset();
              this.getUserListFromService();
              this.loaderService.display(false);
              this.successalert = true;
              this.successMessage = "Successfully Invited!";
              setTimeout(function() {
                         this.successalert = false;
              }.bind(this), 5000);

              //$.notify('Successfully Invited!');
            },
            error => {
              this.loaderService.display(false);
              document.getElementById('afterSubmitFailedErrMsg').innerHTML=JSON.parse(error['_body']).message;
              this.erroralert = true;
              this.errorMessage=JSON.parse(this.errorMessage['_body']).message;
              setTimeout(function() {
                         this.erroralert = false;
               }.bind(this), 5000);

              //$.notify(JSON.parse(error['_body']).message);
            }
           );
      } else {
        $('#validEmailMsg').show();
      }
    }

    this.inviteUserForm.reset();
    $( "#arrivaeChampioncheckbox" ).prop( "checked", false );
  }

  failedMsgerrors() {
    document.getElementById('afterSubmitFailedErrMsg').innerHTML='';
  }

  onFocus(formelem,elemname) {
    if(formelem.controls[elemname].errors) {
      document.getElementById(elemname).classList.remove('inputBorder');
    }
    document.getElementById('afterSubmitFailedErrMsg').innerHTML='';
  }

  checkEmail(email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email)) {
      $('#validEmailMsg').show();
      return false;
    } else {
      $('#validEmailMsg').hide();
    }
    return true;
  }
  hideValidationMsg(){
      $('#validEmailMsg').hide();
  }

  exportLeads() {
    this.userRoleService.exportLeads().subscribe(
      data => {
        this.exportFileData  = data;
        this.downloadFile(this.exportFileData);
        // data => this.downloadFile(data)
      },
      err => {
        
      }
    );
  }
  downloadFile(data){
    // var blob = new Blob([(<any>data)], { type: 'text/csv'});
    // var url= window.URL.createObjectURL(blob);
    // window.open(url);
    // 
    let blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "user.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  //V:fuctionality for category split role featch users list
  selected_space;
  Vusers;
  getUserCategorySplit(event){
    this.selected_space = event.target.value;
    this.loaderService.display(true);
    this.userRoleService.getUserCategorySplit(this.selected_space).subscribe(
    res=>{
      this.Vusers=res.users   
      this.successalert = true;
      this.successMessage = "Type Status updated successfully";
      this.loaderService.display(false);
      setTimeout(function() {
      this.successalert = false;
      }.bind(this), 2000);
    },
    err=>{
      this.loaderService.display(false);
      
      
    });
  }   

}
