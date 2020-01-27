import { Component, OnInit } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { LoaderService } from 'app/services/loader.service';

@Component({
  selector: 'app-sms-floorplan-form-upload',
  templateUrl: './sms-floorplan-form-upload.component.html',
  styleUrls: ['./sms-floorplan-form-upload.component.css'],
  providers:[LeadService]
})
export class SmsFloorplanFormUploadComponent implements OnInit {
  selectedFile = null;
  project_id: any;
  name: any;
  attachmentFile: any;
  file_name: any;
  successalert: boolean;
  successMessage: any;
  erroralert: boolean;
  errorMessage: any;
  attachmentFile_basefile: any;
  prev_booking_form: any;
  

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    private loaderService : LoaderService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.project_id = params['id'];
      this.name = params['name'];
    });
  }

  updateSmsFile(event){
  //   if (event.srcElement.files && event.srcElement.files[0]) {

  //     this.attachmentFile = event.srcElement.files[0];
  //     this.file_name = event.target.files[0].name;
  //     var fileReader = new FileReader();
  //     var base64;
  //      fileReader.onload = (fileLoadedEvent) => {
  //       base64 = fileLoadedEvent.target;
  //       this.attachmentFile_basefile = base64.result;
  //     fileReader.readAsDataURL(this.attachmentFile);
  //     };
  // }
  if (event.srcElement.files && event.srcElement.files[0]) {
    
    this.attachmentFile = event.srcElement.files[0];
    this.file_name = event.target.files[0].name;
    // $(':input[type="upload"]').prop('disabled', false);
    var fileReader = new FileReader();
    var base64;
     fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.attachmentFile_basefile = base64.result;
    };
    $(':input[type="upload"]').prop('disabled', false);
    fileReader.readAsDataURL(this.attachmentFile);
  }
}
  uploadFormFileEvent(){
    this.loaderService.display(true);
        this.leadService.uploadSmsFormFiles(this.project_id,this.attachmentFile_basefile,this.file_name).subscribe(
          res => {
            this.loaderService.display(false);
            this.showSuccessMessage("File uploaded successfully");
            $('.pi-file').val('');
          },
          err => {
            
            this.loaderService.display(false);
            this.showErrorMessage("Something went Bad . Please try again");
          });
    $(':input[type="upload"]').prop('disabled', true);
  }
  
  showSuccessMessage(msg){
    this.successalert = true;
      this.successMessage = msg;
      setTimeout(function() {
                this.successalert = false;
             }.bind(this), 23000);
  }

  showErrorMessage(msg){
    this.erroralert = true;
      this.errorMessage = msg;
      setTimeout(function() {
                this.successalert = false;
             }.bind(this), 23000);
  }

}
