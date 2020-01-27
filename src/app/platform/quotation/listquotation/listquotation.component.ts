import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../quotation.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;
import {ShareDataService} from '../share-data.service';

@Component({
  selector: 'app-listquotation',
  templateUrl: './listquotation.component.html',
  styleUrls: ['./listquotation.component.css'],
  providers: [QuotationService,ShareDataService]
})
export class ListquotationComponent implements OnInit {

	quotations: any[];
  paginationLimit: number;
  startPage: number;
	pid : number;
  pname;
  role: string;
  selectedQuotationStatus='all';
  selectBoqTypeForm1 : FormGroup;
  selectSectionTypeForm : FormGroup;
  importBoqForm : FormGroup;
  sectionsList;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  projectsList;
  importquotations;
  constructor(
  	private quotationService : QuotationService,
  	private route: ActivatedRoute,
    private router:Router,
  	private loaderService :LoaderService,
    private formBuilder: FormBuilder,
    private shareDataService :ShareDataService
  ) { this.paginationLimit = 5; this.startPage = 0;}

  showMore(){
    this.paginationLimit = Number(this.paginationLimit) + 2;
  }


  
  ngOnInit() {
    this.role= localStorage.getItem('user');
  	this.route.params.subscribe(params => {
      this.pid = params['project_id'];
    });
    this.selectBoqTypeForm1 = this.formBuilder.group({
      boqType : new FormControl("create_boq")
    });
    this.selectSectionTypeForm = this.formBuilder.group({
      sections : new FormArray([])
    });
    this.importBoqForm = this.formBuilder.group({
      project : new FormControl({value:'',disabled:true}),
      boq : new FormControl({value:'',disabled:true})
    })
    this.getSections();
    this.getQuotationListByStatus('all');
    localStorage.removeItem('boqAddedProducts');
    if(localStorage.getItem('selected_sections')){
       localStorage.removeItem('selected_sections');
    }
   
  	// this.getQuotations();
  }

  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sectionsList = res.sections;
        this.projectsList = res.projects;
        for(var k=0; k<res.projects.length;k++){
          if(res.projects[k].id==this.pid){
            this.pname = res.projects[k].name;
            break;
          }
        }
      },
      err=>{
        
      }
    );
  }
  getQuotationListByStatus(status){
    this.loaderService.display(true);
    this.selectedQuotationStatus = status;
    this.quotationService.getQuotationList(this.pid,status).subscribe(
      res => {
        this.loaderService.display(false);
        this.quotations = res.quotations;
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  importQuotationValue(pid){
    this.loaderService.display(true);
    this.quotationService.getQuotationList(pid,'all').subscribe(
      res => {
        this.loaderService.display(false);
        this.importquotations = res.quotations;
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  deleteBoq(id){
    if (confirm("Are You Sure you want to delete this boq") == true) {
      this.loaderService.display(true);
      this.quotationService.deleteQuotation(this.pid,id).subscribe(
        res => {
          this.getQuotationListByStatus(this.selectedQuotationStatus);
          this.loaderService.display(false);
          this.successalert = true;
            this.successMessage = " Deleted successfully";
            setTimeout(function() {
                this.successalert = false;
             }.bind(this), 2000);
        },
        err => {
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
        }
      );
    }
  }
  showBoqOptionsDropdown(index){
    var htmlElem = 'boqOptionsDropdown-'+index;
    document.getElementById(htmlElem).classList.toggle("show");
  }

  submitForm(form1Val,form3Val){
    if(form1Val.boqType == 'create_boq'){
      $('#createquotationModal').modal('hide');
      localStorage.setItem('boqTypeCreation','create_boq');
      //localStorage.setItem('selected_sections',JSON.stringify(form2Val.sections));
      this.router.navigateByUrl('project/'+this.pid+'/boq/create');
    } 
    if(form1Val.boqType == 'import_boq'){
      $('#createquotationModal').modal('hide');
      localStorage.setItem('boqTypeCreation','import_boq');
      localStorage.setItem('importedBoqValues',form3Val);
      this.router.navigate(['project/'+this.pid+'/boq/import_boq_create'],{ queryParams: { importBoq_id: form3Val.boq } });
    }
  }
  
  checkBoqType(val){
    var inputs;
    if(val=='create_boq') {
      inputs = document.getElementsByClassName('sectionType-class');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = false;
      }
      inputs = document.getElementsByClassName('importType-class');
      var inputs2 = document.getElementsByClassName('importType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = true;
          inputs[i].classList.remove('activeselectColor');
          inputs2[i].classList.remove('activeselectColor');
      }
      this.importBoqForm.reset();
    }
    if(val=='import_boq') {
      inputs = document.getElementsByClassName('importType-class');
      var inputs2 = document.getElementsByClassName('importType-class1');
      for(var i = 0; i < inputs.length; i++) {
          inputs[i].disabled = false;
          inputs[i].classList.add('activeselectColor');
          inputs2[i].classList.add('activeselectColor');
      }
      
      // this.selectSectionTypeForm.reset();
      // var formArray: FormArray;
      // var j =0;
      // formArray = this.selectSectionTypeForm.get('sections') as FormArray;
      // formArray.controls.forEach(() => {
      //   formArray.removeAt(j);
      //   j++;
      // });

      // inputs = document.getElementsByClassName('sectionType-class');
      // for(var i = 0; i < inputs.length; i++) {
      //     inputs[i].disabled = true;
      //     inputs[i].checked = false;
      // }
    }
  }

  onCheckChange(event) {
    var formArray: FormArray
      formArray = this.selectSectionTypeForm.get('sections') as FormArray;
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
      
    }
  }

  downloadboq(boqId){
    this.quotationService.downloadboq(boqId,this.pid).subscribe(
      res =>{
        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        var b64Data =  JSON.parse(res._body)['excel'];
        var name= JSON.parse(res._body)['name']+'.xlsx';
        var blob = this.b64toBlob(b64Data, contentType,512);
        var blobUrl = URL.createObjectURL(blob);
        // let blob = new Blob(['\ufeff' + data._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let dwldLink = document.createElement("a");
        // let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", blobUrl);
        dwldLink.setAttribute("download", name);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      err => {
        this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 2000);
      }
    );
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

  direction: number;
    isDesc: boolean = true;
    column: string = 'CategoryName';
    // Change sort function to this: 
    sort(property){
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? 1 : -1; 
    }
}
