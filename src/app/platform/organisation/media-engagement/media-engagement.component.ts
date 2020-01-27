import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MediaEngagementService } from './media-engagement.service';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-media-engagement',
  templateUrl: './media-engagement.component.html',
  styleUrls: ['./media-engagement.component.css'],
  providers:[MediaEngagementService]
})
export class MediaEngagementComponent implements OnInit {

	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;

  mediaElementForm:FormGroup;

  constructor(
  	private loaderService:LoaderService,
  	private mediaEngService:MediaEngagementService,
  	private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
  	this.initializeForm();
  	this.getMediaElementsList(1);
  }

  headers_res;
  per_page;
  total_page;
  current_page;
  elementList=[];
  updatemodal_bool = false;
  updateElement_Obj;

  getMediaElementsList(page?){
  	this.loaderService.display(true);
  	this.mediaEngService.getMediaElementsList(page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');
        res= res.json();
        this.elementList = res.media_pages;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      });
  }

  initializeForm(){
  	this.mediaElementForm=this.formBuilder.group({
	  	title:new FormControl(""),
	  	description:new FormControl(""),
	  	url:new FormControl(""),
	    img_src:new FormControl("")
	  });
  }

  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 20000);
  }

  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 20000);
  }

  closemediaElementModal(){
  	this.mediaElementForm.reset();
  	this.setFormvalue("",this.mediaElementForm);
  	this.updatemodal_bool=false;
		this.updateElement_Obj = undefined;
    (<HTMLInputElement>document.getElementById('fileInput')).value="";
    document.getElementById("img_url").classList.add('d-none');
  }

  openEditMediaElemModal(data){
  	this.updatemodal_bool=true;
		this.updateElement_Obj = data;
		this.setFormvalue(data,this.mediaElementForm);
  }

  deleteMediaElement(elemid){
  	if(confirm('Are you sure you want to delete this element?')==true){
			this.loaderService.display(true);
			this.mediaEngService.deleteMediaElement(elemid).subscribe(
	      res=>{
	      	this.getMediaElementsList(1);
	      	this.successMessageShow('Element deleted successfully!');
	        this.loaderService.display(false);
	      },
	      err=>{
	        this.loaderService.display(false);
	        this.errorMessageShow(JSON.parse(err['_body']).message);
	      }
	    );
		}
  }

  attachment_file: any;
	attachment_name: string;
	basefile: any;
  updateMediaElement(elemid,formval){
  	var obj = {
  		'media_page':{
  			'title':formval.title,
  			'read_more_url':formval.url,
  			'logo':this.basefile,
  			'description':formval.description
  		}
  	}
  	this.loaderService.display(true);
  	this.mediaEngService.updateMediaElement(elemid,obj).subscribe(
      res=>{
        this.basefile = undefined;
      	this.getMediaElementsList(1);
      	this.successMessageShow('Element updated successfully!');
        this.loaderService.display(false);
        (<HTMLInputElement>document.getElementById('fileInput')).value="";
        (<HTMLImageElement>document.getElementById('img_url')).src="";
        $('#mediaElementModal').modal('hide');
        document.getElementById("img_url").classList.add('d-none');
        this.closemediaElementModal();
      },
      err=>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
  }


  saveMediaElement(formval){
  	var obj = {
  		'media_page':{
  			'title':formval.title,
  			'read_more_url':formval.url,
  			'logo':this.basefile,
  			'description':formval.description
  		}
  	}
  	this.loaderService.display(true);
  	this.mediaEngService.saveMediaElement(obj).subscribe(
      res=>{
      	this.getMediaElementsList(1);
        this.basefile = undefined;
      	this.successMessageShow('Element saved successfully!');
        this.loaderService.display(false);
        $('#mediaElementModal').modal('hide');
        document.getElementById("img_url").classList.add('d-none');
        (<HTMLInputElement>document.getElementById('fileInput')).value="";
        (<HTMLImageElement>document.getElementById('img_url')).src="";
        this.closemediaElementModal();
      },
      err=>{
        this.loaderService.display(false);
        this.errorMessageShow(JSON.parse(err['_body']).message);
      }
    );
  }

  setFormvalue(val,formobj){
  	formobj.controls['title'].setValue((val)?val.title:"");
  	formobj.controls['description'].setValue((val)?val.description:"");
  	formobj.controls['url'].setValue((val)?val.read_more_url:"");
  	formobj.controls['img_src'].setValue((val)?val.logo:"");
    document.getElementById("img_url").classList.remove('d-none');
  	(<HTMLImageElement>document.getElementById('img_url')).src = ((val)?val.logo:"");
  	// document.getElementById('fileInput').value=((val)?val.logo:"");
  	// document.getElementById('img_url').src = ((val)?val.logo:"");
  }

  uploadImage(event){
  	this.basefile = undefined;
	  this.attachment_file = event.srcElement.files[0];
		var fileReader = new FileReader();
		var base64;
		fileReader.onload = (fileLoadedEvent) => {
		 base64 = fileLoadedEvent.target;
		 this.basefile = base64.result;
     document.getElementById("img_url").classList.remove('d-none');
		 (<HTMLImageElement>document.getElementById("img_url")).src = base64.result;
	  };

		fileReader.readAsDataURL(this.attachment_file);

		this.attachment_file = event.target.files[0] || event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
    };
    fileReader.readAsDataURL(this.attachment_file);
  }
}
