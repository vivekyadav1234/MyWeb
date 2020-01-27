import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import { Lead } from '../lead';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { FloorplanService } from '../../floorplans/floorplan/floorplan.service';
import { DesignerService } from '../../designer/designer.service';
import { Floorplan } from '../../floorplans/floorplan/floorplan';
import { Angular2TokenService } from 'angular2-token';
import { environment } from 'environments/environment';


declare var $:any;

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  providers: [LeadService, LoaderService, FloorplanService,DesignerService]
})
export class FilesComponent implements OnInit {
  lead_id:any;
  role:any;
  lead_details:any;
  project_id:any;
  floorplans_list:any = [];
  floorplan : Floorplan[];
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;
  submitted = false;
  lead_status;
  createRequestForm: FormGroup;
  id: any;
  warrantyDocList: any[];
  customerDetails;

  constructor(
    public activatedRoute: ActivatedRoute,
    public leadService : LeadService,
    public loaderService : LoaderService,
    public floorplanService : FloorplanService,

    private _tokenService: Angular2TokenService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute,
    private designerService: DesignerService

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.lead_id = params['leadId'];
      });
    this.route.queryParams.subscribe(params => {
      this.lead_status = params['lead_status'];
    });
    this.role = localStorage.getItem('user');
    this.fetchBasicDetails();
    this.initializeRequestForm();
  }

  initializeRequestForm(){
    this.createRequestForm = new FormGroup({
      'request_type': new FormControl("", Validators.required),
      'address': new FormControl("", Validators.required),
      'scheduled_at': new FormControl("", Validators.required),
      'project_id': new FormControl("")
    });
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.fetchFloorplans();
        this.fetchLineMarkingList();
      },
      err => {
        
      }
    );
  }

  fetchFloorplans(){
    this.leadService.getFloorplans(this.project_id).subscribe(
      res => {
        this.floorplans_list = res['floorplans'];
      },
      err => {
        
      }
    );
  }

  isProjectInWip():boolean {
    var wip_array = ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive"]
    if(this.lead_details && this.lead_details.project_details && this.lead_details.project_details.status && wip_array.includes(this.lead_details.project_details.status)){
      return true
    }
    else{
      return false
    }
  }


  state;
  displaySection(section){
    this.state = section;
    $('.right-section').css('display', 'none');
    $('.'+section).css('display', 'block');

    if(section == "site-section"){
      this.fetchSiteRequest();
    }
    else if(section == "cad-section"){
      this.fetchCadElevation();
    }
    else if(section == "ppt-section"){
      this.fetchPptList();
      this.defaultPptList();

    }
    else if(section == "boq-section"){
      this.fetchLineMarkingList();

    }
    else if(section == "pdf-file-section"){
      this.fetchPdfList();

    }
    else if(section == "reference-section"){
      this.fetcReferenceList();

    }
    else if(section == "elevation-section"){
      this.fetchElevationList();

    }
    else if(section == "threed-section"){
      this.fetchThreeDImageList();

    }

    else if(section == "warranty-document-section"){
      this.warrantyDocList = [];

    }

  }

  siteRequestList:any = [];
  fetchSiteRequest(){
    this.loaderService.display(true);
    this.leadService.fetchSiteRequest(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.siteRequestList = res['site_measurement_requests'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  cadElevationList = [];
  fetchCadElevation(){
    this.loaderService.display(true);
    this.leadService.fetchCadElevation(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.cadElevationList = res['cad_drawings'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }
  elevationFileList = [];
  fetchElevationList(){
    this.loaderService.display(true);
    this.leadService.fetchElevationList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.elevationFileList = res['elevations'];
         
      },
      err => {
        this.loaderService.display(false);
        
      }
    );

  }
  referenceImageList = [];
  fetcReferenceList(){
    this.loaderService.display(true);
    this.leadService.fetcReferenceList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.referenceImageList = res['reference_images'];
         
      },
      err => {
        this.loaderService.display(false);
        
      }
    );

  }
  threeDImageList = [];
  fetchThreeDImageList(){
    this.loaderService.display(true);
    this.leadService.fetchThreeDImageList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.threeDImageList = res['three_d_images'];
         
      },
      err => {
        this.loaderService.display(false);
        
      }
    );

  }
  pptFileList = [];
  fetchPptList(){
    this.loaderService.display(true);
    this.leadService.fetchPptlist(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
        this.pptFileList = res['boq_and_ppt_uploads'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }
  // default ppt
  ppt_list;
  view_all;
  defaultPptList(){
    this.loaderService.display(true);
    this.leadService.defaultPptList(this.project_id).subscribe(
      res => {
        
        
        // this.ppt_list = Object.keys(res);
        this.view_all = res;
         
        this.loaderService.display(false);

      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }
  boqFileList = [];
  fetchLineMarkingList(){
    this.loaderService.display(true);
    this.leadService.fetchLineMarkingList(this.project_id).subscribe(
      res => {
        this.loaderService.display(false);
       
        this.boqFileList = res['line_markings'];
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }

  callResponse: any;
  callToLead(contact){
    this.loaderService.display(true);
    this.designerService.callToLead(localStorage.getItem('userId'), contact).subscribe(
        res => {
           this.loaderService.display(false);
          if(res.inhouse_call.call_response.code == '403'){
            this.erroralert = true;
            this.errorMessage = JSON.parse(res.message.body).RestException.Message;
            setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 10000);
            //JSON.parse(temp1.body).RestException.Message
          } else {
            this.callResponse =  JSON.parse(res.inhouse_call.call_response.body);
            this.successalert = true;
            this.successMessage = 'Calling from - '+this.callResponse.Call.From;
            setTimeout(function() {
                 this.successalert = false;
            }.bind(this), 10000);
          }
        },
        err => {
          this.loaderService.display(false);
          
        }
     );
  }
  getCustomerDetails(){
    this.leadService.getCustomerCallDetails(this.lead_id).subscribe(
      res => {
        this.customerDetails = res['lead'].contacts;
      },
      err => {
        
      }
    );
  }

  pdfFileList = [];
  fetchPdfList(){
    // this.pdfFileList = [{'pdf_url':'http://localhost:4200/assets/img/file.pdf','name':'Test','id':7}]
    this.pdfFileList = [{'pdf_url':'https://delta.arrivae.com'+'/assets/img/file.pdf','name':'Test','id':this.project_id}]
    
    // this.loaderService.display(true);
    // this.leadService.fetchPdfList(this.id).subscribe(
    //   res => {
    //     this.loaderService.display(false);
    //     this.pdfFileList = res['pdfFileList'];
    //   },
    //   err => {
    //     this.loaderService.display(false);
    //     
    //   }
    // );
  }

  // warrantyDocList = [];
  // fetchWarrantyDocument(){
  //   this.loaderService.display(true);
  //   this.leadService.fetchBoqList(this.project_id).subscribe(
  //     res => {
  //       this.loaderService.display(false);
  //       this.boqFileList = res['boq_and_ppt_uploads'];
  //     },
  //     err => {
  //       this.loaderService.display(false);
  //       
  //     }
  //   );
  // }



}
