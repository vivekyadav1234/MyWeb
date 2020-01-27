import { Component, OnInit ,Input, ChangeDetectorRef} from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService } from '../category.service';
import {QuotationService} from '../../../quotation/quotation.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../../lead/lead.service';
import {FinanceService} from '../../../finance/finance.service';

declare let $: any;

@Component({
  selector: 'app-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.css'],
  providers: [CategoryService,QuotationService,LeadService]
})
export class AcceptanceComponent implements OnInit {
  selectSection = 'acceptance';
  @Input() project_id:any;
  project_is_accept;
  project_list: any;
  panelDiv: boolean;
  reject: FormGroup;
  erroralert:boolean=false;
  errorMessage:string;
  successalert = false;
  successMessage : string;
  handover_id: any;
  status: string;
  url:any;
  direction:number;
  created_at='created_at';
  role:any;
  public rowSelected:any;
  constructor(
    private loaderService : LoaderService,
    private categoryService:CategoryService,
    private quotationService:QuotationService,
    public leadService : LeadService,
    private financeService:FinanceService,
    private ref:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.project_is_accept = this.project_id;
    this.role=localStorage.getItem('user');
    this.slectBtn('acceptance');
    this.getCategorisedList();
    this.getAdditionalFiles();
    //request form
    this.reject = new FormGroup({
      remark_description: new FormControl("",Validators.required),
    });
    $('[data-toggle="tooltip"]').tooltip();
  }
  
  slectBtn(section){
  	this.selectSection = section;
  }

  //to get categorised list of handover files
  all_file_list:any = [];
  slectedFile_arr = [];
  set_status:any = [];
  line_item_Arr;
  file_length;
  additionalFiles;
  currentCostQCStatus;
  currentTechQCStatus;
  currentDesignQCStatus;
  newCostQCStatus;
  newTechQCStatus;
  newDesignQCStatus;
  showQCDetails=false;
  lineMarkingCompleted=false;


  sortArrayOFItems = []; 
  
  getCategorisedList(){
    // this.status = 'pending_acceptance';
    this.loaderService.display(true);
    this.sortArrayOFItems = [];
    this.categoryService.getCategorisedList(this.project_is_accept).subscribe(
      res=>{
        res= res.json();
        
        
        this.currentCostQCStatus=res.project_handover.project_handover_qcs[1]?res.project_handover.project_handover_qcs[1].status : 'Pending';
        this.currentTechQCStatus=res.project_handover.project_handover_qcs[2]?res.project_handover.project_handover_qcs[2].status : 'Pending';
        this.currentDesignQCStatus=res.project_handover.project_handover_qcs[0]?res.project_handover.project_handover_qcs[0].status : 'Pending';

        
        // this.ref.detectChanges();

        this.newCostQCStatus=res.project_handover.project_handover_qcs[1]?res.project_handover.project_handover_qcs[1].status : 'Pending';
        this.newTechQCStatus=res.project_handover.project_handover_qcs[2]?res.project_handover.project_handover_qcs[2].status : 'Pending';
        this.newDesignQCStatus=res.project_handover.project_handover_qcs[0]?res.project_handover.project_handover_qcs[0].status : 'Pending';

        if(res.line_marking_completed){
          this.lineMarkingCompleted = res.project_handover.line_marking_completed;
        }

        this.showQCDetails=true;
        this.ref.detectChanges();


        this.project_list = res.project_handover;
        
        this.file_length = res.project_handover.all_files;
        this.all_file_list = res.project_handover;
        ///////to sort anikesh
        for(let i=0;i< this.project_list.all_files.length;i++){
          if(this.all_file_list.all_files[i] == 'Quotation'){
            this.slectedFile_arr.push('BOQ');
            this.sortArrayOFItems.push('Quotation');
            this.panelDiv = false;
          }
          else if(this.all_file_list.all_files[i] == 'BoqAndPptUpload'){
            this.slectedFile_arr.push('PPT'); 
            this.sortArrayOFItems.push('BoqAndPptUpload');
            this.panelDiv = true;
          }
          else if(this.all_file_list.all_files[i] == 'Floorplan'){
            this.slectedFile_arr.push('Floor Plan');
            this.sortArrayOFItems.push('Floorplan');

            this.panelDiv = true;
          }
          else if(this.all_file_list.all_files[i] == 'CadDrawing'){
            this.slectedFile_arr.push('Cad Drawings');
            this.sortArrayOFItems.push('CadDrawing');
            this.panelDiv = true;
          }
          else if(this.all_file_list.all_files[i] == 'Elevation'){
            this.slectedFile_arr.push('Elevations');
            this.sortArrayOFItems.push('Elevation');
            this.panelDiv = true;

          }
          else if(this.all_file_list.all_files[i] == 'ReferenceImage'){
            this.slectedFile_arr.push('Refrence Images');
            this.sortArrayOFItems.push('ReferenceImage');
            this.panelDiv = true;
          }
          else if(this.all_file_list.all_files[i] == 'SiteMeasurementRequest'){
            this.slectedFile_arr.push('Site Measurement Request');
            this.sortArrayOFItems.push('SiteMeasurementRequest');
            this.panelDiv = true;
          }
          else if(this.all_file_list.all_files[i] == 'ThreeDImage'){
            this.slectedFile_arr.push('3-D Files');
            this.sortArrayOFItems.push('ThreeDImage');
            this.panelDiv = true;
             
          }
        }
        var jsonObj = this.project_list;
        
        delete jsonObj['all_files'];
        delete jsonObj['handover_active'];
        delete jsonObj['project_handover_qcs'];
        
        this.line_item_Arr = Object.keys(jsonObj);
        
        this.loaderService.display(false);
      },
      err=>{
        
        this.loaderService.display(false);
      }
    );
  }
  getAdditionalFiles(){
    this.leadService.getAdditionalFiles(this.project_id).subscribe(
      res => {

        this.additionalFiles = res.requested_files;
        
      },
      err => {
        
      }
    );
  }

  //to get handover_id
  segment_role;
  handoverId(handover_id,role){
    this.handover_id = handover_id;
    this.segment_role=role;
  }

  //Rejected Function
  rejectFun(){
    this.status = 'rejected';
    this.loaderService.display(true);
    this.sortArrayOFItems = [];
    this.categoryService.rejectFun(this.handover_id,this.project_is_accept,this.status,this.segment_role,this.reject.value).subscribe(
      res=>{
        res= res;
        this.loaderService.display(false);
        this.successalert = true;

        this.successMessage = "Rejeccted Successfully";
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
        this.getCategorisedList();
      },
      err=>{
        
        this.erroralert = true;
        this.errorMessage = "Not Rejected";
        this.loaderService.display(false);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
    this.reject.reset();
    // location.reload();
    $('#rejectModal').modal('hide');
    this.getCategorisedList();
  }

  //Accept Function
  acceptFun(handoverId,role){
    this.status = 'accepted';
    this.loaderService.display(true);
    this.sortArrayOFItems = [];
    this.categoryService.rejectFun(handoverId,this.project_is_accept,this.status,role,this.reject.value).subscribe(
      res=>{
        res= res;
        this.loaderService.display(false);
        this.successalert = true;
        
        this.successMessage = "Accept Successfully";
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
        this.getCategorisedList();
      },
      err=>{
        
        this.erroralert = true;
        this.errorMessage = "Not Accpeted";
        this.loaderService.display(false);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
    // location.reload();
  }

  //to save panel and non-panel
  PanelNonChange(ownerable_id, event){
    var panel = event.target.value
    
    this.categoryService.PanelNonChange(ownerable_id,this.project_is_accept,panel).subscribe(
      res=>{
        res= res;
        this.loaderService.display(false);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        
        this.loaderService.display(false);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }

  //for tooltip popover
  openpopup(event,id){
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });

    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    })
  }
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }

  downloadBoq(boqId){
    
    this.loaderService.display(true);
    this.financeService.downloadBoqCheatSheet(this.project_is_accept,boqId).subscribe(
    res =>{
      this.loaderService.display(false);
      var contentType = 'application/pdf';
      
      var b64Data =  JSON.parse(res._body)['quotation_base_64'];
      var name=  JSON.parse(res._body)['boq_name'];
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
      this.successalert = true;
        this.successMessage = "Your File Downloaded Successfully";
        setTimeout(function() {
              this.successalert = false;
           }.bind(this), 2000);
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

  
  changeFileFormat(event){
    
    if(event == 'ThreeDImage'){
      return '3-D Image'

    }
    else if(event == 'ReferenceImage'){
      return 'Reference Image'

    }
    else if(event == 'CadDrawing'){
      return 'Cad Drawing'

    }else if(event == 'BoqAndPptUpload'){
      return 'PPT Upload'

    }else if(event == 'SiteMeasurementRequest'){
      return 'Site Measurement Request'

    }else if(event == 'Floorplan'){
      return ' Floor Plan / Layout'

    }else if(event == 'Elevation'){
      return 'Elevation'

    }else if(event == 'Quotation'){
      return 'Quotation'

    }else if (event=='LineMarking') {
      return 'Line Marking'
    }
  }
  PanelNonChangeForThreeD(i_id, event){
    var panel = event.target.value
    
    this.categoryService.PanelNonChangeForThreeD(i_id,this.project_is_accept,panel).subscribe(
      res=>{
        res= res;
        this.loaderService.display(false);
        setTimeout(function() {
          this.successalert = false;
        }.bind(this), 2000);
      },
      err=>{
        
        this.loaderService.display(false);
        setTimeout(function() {
          this.erroralert = false;
        }.bind(this), 2000);
      }
    );
  }
   
   toggleRow(row) {
    
    // this.handover_id = ''; 
    if (this.rowSelected === -1) {
      this.rowSelected = row.id
    }
    else {
      if (this.rowSelected == row.id) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = row.id
      }
      
      }
    this.viewChild(row)
  }
    
  
  child_list=[];
  parent_id;
  corrected_res;
  child_file_type=[];
  viewChild(obj){
      if(obj.parent_id){
        this.handover_id=obj.parent_id;
       
        
      }else{
        this.handover_id = obj.id;
        
      }  
    this.loaderService.display(true);
    console.log('child');
    this.categoryService.getViewChild(this.project_is_accept,this.handover_id).subscribe(
     
      res=>{
         //
       
         this.loaderService.display(false);
         this.child_file_type=Object.keys(res['project_handover']['child_details']);
         this.child_list = res['project_handover']['child_details'][this.child_file_type[0]];
         
          
         
        
      },
      err=>{
        this.loaderService.display(false);

      })

  }
  file_list;
    viewFile(url){
      this.file_list = url;
      
    }

    remark='';
    currentQCStatus;

    
    currentQCFileUploaded:any

    fileUpload(event,label){
     
     var fileReader;
     var base64;

     for (let file of event.target.files) {
        
        fileReader = new FileReader();
        fileReader.onload= (fileLoadedEvent) => {
        base64 = fileLoadedEvent.target;
        // this.basefile = base64.result;
        if(event.target.files.length>1){
          if(this.currentQCFileUploaded==undefined){
            this.currentQCFileUploaded=[]
          }
          this.currentQCFileUploaded.push(
            {
              "attachment": base64.result.replace('data:application/octet-stream;base64,',''),
              "file_name": file.name
              })
        }else{
        this.currentQCFileUploaded = {
          "attachment": base64.result.replace('data:application/octet-stream;base64,',''),
          "file_name": file.name
          }
        }
         };
         fileReader.readAsDataURL(file);

         
         document.getElementById(label).innerHTML = event.target.value.replace("C:\\fakepath\\",'').substring(0,20)+'...';
     }
     if(event.target.files.length>1){
      document.getElementById(label).innerHTML = event.target.files.length + ' Files Uploaded !';
     }
    
    }

    closeModal(label){
      document.getElementById(label).innerHTML ='Browse for file ... ';
      this.remark='';
      // this.newCostQCStatus=this.currentCostQCStatus;
      // this.newDesignQCStatus=this.currentDesignQCStatus;
      // this.newTechQCStatus=this.currentTechQCStatus;
      this.currentQCFileUploaded={
        "attachment":'',
        "file_name":'',
      }
      this.section='';
    }

    qcStatusChange(type_qc,status){
      if(type_qc=='tech_qc'){
        this.newTechQCStatus = status;
      }else if (type_qc=='cost_qc'){
        this.newCostQCStatus = status;
      }else if (type_qc=='design_qc'){
        this.newDesignQCStatus=status;
      }
      // this.currentQCStatus=status;
    }

    section='';
    updateQC(qcType){



      this.loaderService.display(true);
      
      if(qcType=='tech_qc'){
        this.section='custom-label-3';
        this.currentQCStatus = this.newTechQCStatus;
      }else if (qcType=='cost_qc'){
        this.section='custom-label-2'
        this.currentQCStatus = this.newCostQCStatus;
      }else if (qcType=='design_qc'){
        this.section='custom-label-1'
        this.currentQCStatus = this.newDesignQCStatus;
      }
      
      if(this.currentQCFileUploaded==undefined || (this.currentQCFileUploaded && this.currentQCFileUploaded.attachment == '')){
        this.loaderService.display(false);
        this.erroralert = true;
            // this.closeModal(this.section);
            this.errorMessage = 'Please upload a file to continue !';
            setTimeout(function() {
                  this.erroralert = false;
              }.bind(this), 3000);
      }
      else{

        this.categoryService.updateQC(this.project_id,qcType,this.currentQCStatus,this.currentQCFileUploaded,this.remark).subscribe(
      
          res=>{
            
            this.remark='';
            this.currentQCFileUploaded={
              "attachment":'',
              "file_name":'',
            };
            //  this.currentQCStatus=true;
            
            this.loaderService.display(false);
            this.successalert = true;
            if(qcType=='design_qc' && this.currentQCStatus){
              this.successMessage='File Uploaded Successfully. If Line Marking is not completed, Please initiate the Line Marking Process'
            }else{
              this.successMessage = "File Uploaded Successfully";
            }
            this.closeModal(this.section);
            this.getCategorisedList();
            setTimeout(function() {
                this.successalert = false;
              }.bind(this), 4000);
          },
          err=>{
            this.loaderService.display(false);
            this.erroralert = true;
            this.closeModal(this.section);
            this.errorMessage = <any>JSON.parse(err['_body']).message;
            setTimeout(function() {
                  this.erroralert = false;
              }.bind(this), 3000);
          })
      }
    }

    history;
    viewHistory(qcType){
      this.loaderService.display(true);
    

      this.categoryService.viewQCHistory(this.project_id,qcType).subscribe(
     
        res=>{
          //  
           this.history=res;
           this.loaderService.display(false);
        },
        err=>{
          this.loaderService.display(false);
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(err['_body']).message;
          setTimeout(function() {
                this.erroralert = false;
             }.bind(this), 3000);
  
        })
    }
    isDesc: boolean = true;
    column: string = 'created_at';
    sort(property){
      this.isDesc = !this.isDesc; //change the direction    
      this.column = property;
      this.direction = this.isDesc ? 1 : -1; 
    }

    duration=0;
    updateDuration(){
      this.loaderService.display(true);
      if(this.duration<=0){
        alert('Duration should be greater than 0');
        this.loaderService.display(false);
      }else{
        this.leadService.updateDuration(this.quotationId,this.project_id,this.duration).subscribe(
          res => {
           this.loaderService.display(false);
           
           this.successalert = true;
           this.successMessage = "Duration Updated Successfully";
           this.getCategorisedList();
             
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 4000);
          },
          err => {
            this.loaderService.display(false);
            this.erroralert = true;
            this.errorMessage = <any>JSON.parse(err['_body']).message;
            setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 3000);
          }
        );
      }
    }
    quotationId;
    getBoqDetails(boq){
      
      this.quotationId=boq.ownerable_id;
      this.duration=boq.duration || 0;
    }
}

