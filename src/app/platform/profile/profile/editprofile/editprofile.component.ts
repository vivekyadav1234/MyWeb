import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from '../../../../services/loader.service';
// import { FileUploader } from 'ng2-file-upload';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Profile } from '../profile';
import { ProfileService } from '../profile.service';
import { Routes, Router, RouterModule , ActivatedRoute} from '@angular/router';
import {CsagentService} from '../../../../platform/organisation/csagentdashboard/csagent.service';
import {SidenavbarComponent} from '../../../../shared/sidenavbar/sidenavbar.component';
declare var $:any;
@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
  providers: [ProfileService,SidenavbarComponent,CsagentService]
})

export class EditprofileComponent implements OnInit {

	observableProfile: Observable<Profile[]>
  	id: Number;
  	profile: Profile[];
    avatarFile: any;
    avatarFileName: string;
  	submitted = false;
  	name:string;
    gst_number:string;
    pan:string;
  	nickname:string;
  	contact: string;
    pincode: string;
    basefile : any;
    address_proof : any;
    instagram_handle:any;
    address_proof_fp : any;
    address_proof_name : string;
    ap_basefile : any;
    cv_basefile: any;
    loading : boolean;
    errorMessage : string;
    erroralert = false;
    successalert = false;
    successMessage : string;
    designer_cv: any;
    attachment_name: string;
    role;
  exophone: any;
  extension: any;
  constructor(
  	private profileService :ProfileService,
  	private route: ActivatedRoute,
  	private formBuilder: FormBuilder,
  	private router: Router,
    private loaderService :LoaderService,
    private sidenavbarComp:SidenavbarComponent
  ) {
    this.successalert = false;
  }

  ngOnInit() {
    this.role=localStorage.getItem('user');

  	this.route.params.subscribe(params => {
		            this.id = +params['id'];
		  	});
  	this.viewProfile(); 
  }

  viewProfile(){
    this.loaderService.display(true);
    
      this.profileService.viewProfile(this.id).subscribe(
        profile => {

          this.profile = profile;
          Object.keys(profile).map((key)=>{ this.profile= profile[key];});
          this.name=this.profile['name'];
          this.nickname = this.profile['nickname'];
          this.contact = this.profile['contact'];
          this.pincode = this.profile['pincode'];
          this.instagram_handle = this.profile['instagram_handle'];
          this.gst_number = this.profile['gst_number'];
          this.pan = this.profile['pan'];
          this.exophone = this.profile['exophone'];
          this.extension = this.profile['extension'];
          this.address_proof = this.profile['address_proof'];
          this.loaderService.display(false);
        },
        error => {
          this.errorMessage = JSON.parse(this.errorMessage['_body']).message;
          //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
          this.loaderService.display(false);
          this.router.navigateByUrl('/');
        }
      );
    
  }
   fileChange(event) {
       this.avatarFile = event.srcElement.files[0];
       this.avatarFileName = event.srcElement.files[0].name;
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.basefile = base64.result;
           };
        fileReader.readAsDataURL(this.avatarFile);
    }

    addressProofChange(event) {
       $("#file-upload").change(function(){
          $("#file-name").text(this.files[0].name);
        });
       this.address_proof = event.srcElement.files[0];
       this.address_proof_name = event.srcElement.files[0].name;
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.ap_basefile = base64.result;
           };
        fileReader.readAsDataURL(this.address_proof);
    }

    onSubmit(data, event) {
      // this.loading = true;
      this.loaderService.display(true);
    	this.submitted = true;
      data["avatar"] = this.avatarFile;
      data["avatarname"] = this.avatarFileName;
      data["address_proof"] = this.ap_basefile;
      data["address_proof_name"] = this.address_proof_name;
      data["designer_cv"] = this.cv_basefile;
    	this.profileService.updateProfile(this.id,data,this.basefile)
		    .subscribe(
		        profile => {
              this.sidenavbarComp.ngOnInit();
		          // profile = profile;
            //   Object.keys(profile).map((key)=>{ this.profile= profile[key];});
            //   this.name=this.profile['name'];
            //   this.nickname = this.profile['nickname'];
            //   this.gst_number = this.profile['gst_number'];
            //   this.pan = this.profile['pan'];
            //   this.address_proof = this.profile['address_proof'];
            //   this.contact = this.profile['contact'];
            //   this.pincode = this.profile['pincode'];
            //   // this.loading = false;
            //   this.loaderService.display(false);
              // this.successalert = true;
              // this.successMessage = "Profile updated successfully";
              // setTimeout(function() {
                         
              //   }.bind(this), 15000);
            // $.notify("Profile updated successfully");
            this.loaderService.display(false);
            this.router.navigateByUrl('profile/view/'+this.id);
		          // return profile;
		        },
		        error => {
              this.erroralert = true;
              this.errorMessage=JSON.parse(error['_body']).message;
              this.loaderService.display(false);
		        	//this.errorMessage = <any>error;
		          //$.notify('You have uploaded an invalid image file type',JSON.parse(this.errorMessage['_body']).message);
              setTimeout(function() {
                    this.router.navigateByUrl('profile/edit/'+this.id);
                }.bind(this), 5000);

		        }
		    );
    }
  uploadCV(event) {
    this.designer_cv = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.cv_basefile = base64.result;
      //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
    };
    fileReader.readAsDataURL(this.designer_cv);
  } 


}
