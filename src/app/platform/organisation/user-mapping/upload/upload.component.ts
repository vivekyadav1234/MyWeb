import { Component, OnInit } from '@angular/core';
import {UserMappingService} from '../user-mapping.service';
import {Observable} from 'rxjs/Observable';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
declare let $: any;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [LoaderService, UserMappingService]
})
export class UploadComponent implements OnInit {

	user_id:any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
  	private loadService: LoaderService,
  	private userMappingService: UserMappingService,
  ) {
  	this.user_id = localStorage.getItem('userId');
  }

  ngOnInit() {
  }

  user_mapping;
  file_name;
  file_size;
  basefile;
  uploadFile(event) {
    $(".wait-load").css("display", "none");
    $(".fa-cloud-upload").css("display", "block");
    $(".fa-check-circle").css("display", "none");
    this.user_mapping = event.target.files[0] || event.srcElement.files[0];
    this.file_name = this.user_mapping.name;
    this.file_size = (this.user_mapping.size)/1024;
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
      //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
    };
    fileReader.readAsDataURL(this.user_mapping);
    $(".file-col").css("display", "flex")
    document.getElementById("fileName").innerHTML = this.file_name;
    document.getElementById("fileSize").innerHTML = this.file_size.toFixed(2)+ " KB";
  }

  submit(){
    $(".fa-cloud-upload").css("display", "none");
    $(".wait-load").css("display", "block");
  	this.userMappingService.uploadMapping(this.user_id,this.basefile).subscribe(
  		res => {
        $(".wait-load").css("display", "none");
        $(".fa-check-circle").css("display", "block");
        this.successalert = true;
        this.successMessage = res.message;
  		},
  		err => {
  			
        $(".wait-load").css("display", "none");
        $(".fa-cloud-upload").css("display", "block");
        this.errorMessage = JSON.parse(err._body).status+" : "+JSON.parse(err._body).error;
        this.erroralert = true;
  			// alert(JSON.parse(err._body).status+" : "+JSON.parse(err._body).error)
  		});
  }

}
