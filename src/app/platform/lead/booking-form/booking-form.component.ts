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
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  providers: [LeadService, DesignerService]
})
export class BookingFormComponent implements OnInit {

  successalert;
  successMessage;
  erroralert;
  errorMessage;
  bookingForm : FormGroup;
  lead_id:any;
  role:any;
  lead_details:any;
  lead_status;
  booking_form_id;
  file_list;
  attachmentFile: any;
  attachmentFile_basefile: any;
  formEmpty: boolean;
  upload: boolean;
  proj_id:any;

  flag:boolean=false;
  file_name: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    private loaderService : LoaderService,
    public designerService : DesignerService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');

    this.initBookingForm();
    this.fetchBasicDetails();
    this.checkFormEmpty();
    
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.bookingForm.patchValue({project_id: this.lead_details.project_details.id});
        this.proj_id = this.lead_details.project_details.id;
        this.fetchBookingForm();
        // this.bookingForm.value.project_id = this.lead_details.project_details.id;
      },
      err => {
        
      }
    );
  }

  prev_booking_form:any = {}
  fetchBookingForm(){
    this.leadService.fetchBookingForm(this.lead_details.project_details.id).subscribe(
      res => {
        if(res != null){
          this.prev_booking_form = res['project_booking_form'];
          this.booking_form_id = this.prev_booking_form.id;
          
          this.getUploadedFiles();
          this.updatePrevForm(this.prev_booking_form)
        } else {
          this.prev_booking_form = res;
          this.checkFormEmpty();
        }
      },
      err => {
        
        this.showErrorMessage("Something went bad. Please try again");
      });
  }

  updatePrevForm(form){
    this.bookingForm.patchValue({annual_income: form['annual_income']});
    this.bookingForm.patchValue({building_name: form['building_name']});
    this.bookingForm.patchValue({city: form['city']});
    this.bookingForm.patchValue({company: form['company']});
    this.bookingForm.patchValue({current_address: form['current_address']});
    this.bookingForm.patchValue({date: form['date']});
    this.bookingForm.patchValue({designation: form['designation']});
    this.bookingForm.patchValue({flat_no: form['flat_no']});
    this.bookingForm.patchValue({floor_no: form['floor_no']});
    this.bookingForm.patchValue({landline: form['landline']});
    this.bookingForm.patchValue({location: form['location']});
    this.bookingForm.patchValue({order_date: form['order_date']});
    this.bookingForm.patchValue({order_value: form['order_value']});
    this.bookingForm.patchValue({pincode: form['pincode']});
    this.bookingForm.patchValue({possession_by: form['possession_by']});
    this.bookingForm.patchValue({primary_email: form['primary_email']});
    this.bookingForm.patchValue({primary_mobile: form['primary_mobile']});
    this.bookingForm.patchValue({profession: form['profession']});
    this.bookingForm.patchValue({professional_details: form['professional_details']});
    this.bookingForm.patchValue({other_professional_details: form['other_professional_details']});
    this.bookingForm.patchValue({secondary_email: form['secondary_email']});
    this.bookingForm.patchValue({secondary_mobile: form['secondary_mobile']});
    this.bookingForm.patchValue({billing_address: form['billing_address']});
    this.bookingForm.patchValue({address_type: form['address_type']});
    this.bookingForm.patchValue({billing_name: form['billing_name']});
    this.bookingForm.patchValue({gst_number: form['gst_number']});
  }

  initBookingForm(){
    this.bookingForm = this.formBuilder.group({
      project_id : new FormControl(),
      flat_no : new FormControl(),
      floor_no : new FormControl(),
      building_name : new FormControl(),
      location : new FormControl(),
      city : new FormControl(),
      pincode : new FormControl(),
      possession_by : new FormControl(),
      profession : new FormControl(),
      designation : new FormControl(),
      company : new FormControl(),
      professional_details : new FormControl(),
      other_professional_details: new FormControl(),
      annual_income : new FormControl(),
      landline : new FormControl(),
      primary_mobile : new FormControl(),
      secondary_mobile : new FormControl(),
      primary_email : new FormControl(),
      secondary_email : new FormControl(),
      current_address : new FormControl(),
      order_value : new FormControl(),
      order_date : new FormControl(),
      file:new FormControl(),
      billing_address: new FormControl(),
      gst_number: new FormControl(),
      billing_name:new FormControl(),
      address_type:new FormControl(),

    })
  }

  bookingFormSubmit(){
    if((this.prev_booking_form != undefined) && this.prev_booking_form['id'] ){
      // if((this.prev_booking_form != undefined) && !this.prev_booking_form && this.prev_booking_form['id'] ){
      this.leadService.bookingFormUpdate(this.prev_booking_form['id'],this.bookingForm.value).subscribe(
      res => {
         
        this.showSuccessMessage("Form successfully submitted");
        this.fetchBookingForm();
        this.formEmpty = false;
        this.fetchBasicDetails();
          },
      err => {
        
        this.showErrorMessage("Something went bad. Please try again");
      });
    }
    else{
      this.leadService.bookingFormSubmit(this.bookingForm.value).subscribe(
      res => {
         
        this.showSuccessMessage("Form successfully submitted");
        this.fetchBookingForm();
        this.formEmpty = false;
        this.fetchBasicDetails();
      },
      err => {
        
        this.showErrorMessage("Something went bad. Please try again");
      });
    }
  }

  getUploadedFiles(){
  //   this.file_list = [
  //     {
  //         "id": 2,
  //         "project_booking_form_id": 20,
  //         "attachment_file_file_name": "1.jpg",
  //         "attachment_file_content_type": "image/jpeg",
  //         "attachment_file_file_size": 174736,
  //         "created_at": "2018-10-21T23:37:50.848+05:30",
  //         "url": "//s3.amazonaws.com/arrivae-development/project_booking_form_files/attachment_files/000/000/002/original/1.jpg?1540145270"
  //     },
  //     {
  //         "id": 3,
  //         "project_booking_form_id": 20,
  //         "attachment_file_file_name": "2.jpg",
  //         "attachment_file_content_type": "image/jpeg",
  //         "attachment_file_file_size": 3782452,
  //         "created_at": "2018-10-21T23:38:11.536+05:30",
  //         "url": "//s3.amazonaws.com/arrivae-development/project_booking_form_files/attachment_files/000/000/003/original/2.jpg?1540145291"
  //     },
  //     {
  //         "id": 4,
  //         "project_booking_form_id": 20,
  //         "attachment_file_file_name": "1614.pdf",
  //         "attachment_file_content_type": "application/pdf",
  //         "attachment_file_file_size": 514102,
  //         "created_at": "2018-10-21T23:40:01.199+05:30",
  //         "url": "//s3.amazonaws.com/arrivae-development/project_booking_form_files/attachment_files/000/000/004/original/1614.pdf?1540145401"
  //     }
  // ];
  this.leadService.getUploadedFiles(this.lead_details.project_details.id).subscribe(
     res => {
       this.file_list = res.project_booking_form.project_booking_form_files;
       this.checkFormEmpty();
     
     },
     err => {
       
       this.showErrorMessage("Something went bad. Please try again");
     });
  }

  downloadBookingForm(){
    
    // document.getElementById("abc").value = '';
    this.leadService.downloadBookingForm(this.prev_booking_form['id']).subscribe(
     res => {
      this.showSuccessMessage("Form successfully downloaded");
      if(res.file_name != null){
        var contentType = 'application/pdf';
        var b64Data = res.project_booking_form_base_64;
        var name= res.file_name;
        var blob = this.b64toBlob(b64Data, contentType,512);
        var blobUrl = URL.createObjectURL(blob);
        // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let dwldLink = document.createElement("a");
        // let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) { //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", blobUrl);
        dwldLink.setAttribute("download", name);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
        var contentType = 'application/pdf';
        var b64Data = res.project_booking_form_base_64;
        var name= res.file_name;
        var blob = this.b64toBlob(b64Data, contentType,512);
        var blobUrl = URL.createObjectURL(blob);
        // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let dwldLink1 = document.createElement("a");
        // let url = URL.createObjectURL(blob);
        let isSafariBrowser1 = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser1) { //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
        }
        
        
        
        }
        },
        err => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(err['_body']).message;
        setTimeout(function() {
        this.erroralert = false;
        // this.loaderService.display(false);
        }.bind(this), 2000);
        }
        );

  }
  deleteFile(id){
    this.loaderService.display(true);
    this.leadService.deleteFile(this.prev_booking_form['id'],id).subscribe(
      res => {
        this.loaderService.display(false);
        this.showSuccessMessage("File deleted successfully");
        for(var l=0;l<this.file_list.length;l++){
          if(this.file_list[l].id == id){
          this.file_list.splice(l, 1);
          
          }
          }
      },
      err => {
        
        this.loaderService.display(false);
        this.showErrorMessage("Something went bad. Please try again");
      });
  }

  updateFile(event){
    if (event.srcElement.files && event.srcElement.files[0]) {
      this.attachmentFile = event.srcElement.files[0];
      this.file_name = event.target.files[0].name;
      $(':input[type="upload"]').prop('disabled', false);
  }
}
  
uploadFileEvent(){
  this.loaderService.display(true);
  var fileReader = new FileReader();
      var base64;
      fileReader.onload = (fileLoadedEvent) => {
        base64 = fileLoadedEvent.target;
        this.attachmentFile_basefile = base64.result;
        this.leadService.uploadFiles(this.prev_booking_form['id'],this.attachmentFile_basefile,this.file_name).subscribe(
          res => {
            this.loaderService.display(false);
            

            this.showSuccessMessage("File uploaded successfully");

            this.fetchBasicDetails();
            $('#uploadInput').val('');
            // this.formEmpty = false;
            
          },
          err => {
            
            this.loaderService.display(false);
            this.showErrorMessage("Something went Bad . Please try again");
          });
    };
    fileReader.readAsDataURL(this.attachmentFile);
    $(':input[type="upload"]').prop('disabled', true);
}
  
  b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  
  var byteCharacters = atob(b64Data);
  var byteArrays = [];
  
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  var slice = byteCharacters.slice(offset, offset + sliceSize);
  
  var byteNumbers = new Array(slice.length);
  for (var i = 0; i < slice.length; i++) {
  byteNumbers[i] = slice.charCodeAt(i);
  }
  
  var byteArray = new Uint8Array(byteNumbers);
  
  byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
  }

  checkFormEmpty(){
    
    
    if(this.prev_booking_form != undefined){
      this.prev_booking_form.forEach(elem=>{
        if((elem.value === null && elem.value === "")){
          this.flag = true;
        } 
        });
        this.formEmpty =  this.flag; 
    } else {
      this.formEmpty = true;
    }
      
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


  selectAddress(value){
    this.loaderService.display(true);
    if (value == 1) {
      var address = "Same as Shipping address"
      this.leadService.selectAddressOf(this.proj_id,address).subscribe(
        res => {
          if(res.billing_address == null){
            this.showErrorMessage("Address not present");
            this.loaderService.display(false);
          }
          if (res.billing_address != null) {
            this.bookingForm.controls['billing_address'].setValue(res.billing_address);
            this.loaderService.display(false); 
          } 
        },
        err => {
          
          this.loaderService.display(false);
          this.showErrorMessage("Address not present");
      });
    } 
    else if (value == 2) {
      var address = "Same as Communication address"
      this.leadService.selectAddressOf(this.proj_id,address).subscribe(
        res => {
          if(res.billing_address == null){
            this.showErrorMessage("Address not present");
            this.loaderService.display(false);
          }
          if (res.billing_address != null) {
            this.bookingForm.controls['billing_address'].setValue(res.billing_address);
            this.loaderService.display(false);  
          }
        },
        err => {
          
          this.loaderService.display(false);
          this.showErrorMessage("Address not present");
      });
    }
    else if (value == 3) {
      this.loaderService.display(false);
      this.bookingForm.controls['billing_address'].setValue("");
    }
  }

}

