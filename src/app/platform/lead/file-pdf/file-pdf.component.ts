import { Component, OnInit, Input, NgModule } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../lead.service';
import { environment } from 'environments/environment';
import { CategoryService } from 'app/platform/category/category/category.service';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

@NgModule({
  imports: [BrowserModule],

})

@Component({
  selector: 'app-file-pdf',
  templateUrl: './file-pdf.component.html',
  styleUrls: ['./file-pdf.component.css'],
  providers: [LeadService, LoaderService, CategoryService]
})
export class FilePdfComponent implements OnInit {
  @Input() pdfFileList:any = [];
  id:any;
  po_preview_pdf_url: any;
  erroralert: boolean;
  errorMessage: string;
  successalert: boolean;
  successMessage: string;
  modal:any;
  pdf_url: any;
  lead_id: any;
  lead_status: any;
  role: string;
  lead_details: any;
  project_id: any;
  constructor(
    public leadService : LeadService,
    public loaderService : LoaderService,
    public categoryService:CategoryService,
    public activatedRoute: ActivatedRoute,
    private route:ActivatedRoute,
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
  }

  filePdf:any;
  getPdf(){
    this.leadService.getPdf(this.project_id).subscribe(
      res => {
        this.filePdf = res;
      console.log("filePdf",this.filePdf);
      console.log("filePdf",this.filePdf['file_booklet.pdf']);
      },
      err => {
        
      }
    );
  }

  fetchBasicDetails(){
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      res => {
        this.lead_details = res['lead'];
        this.project_id = res['lead'].project_details.id;
        this.getPdf();
      },
      err => {
        
      }
    );
  }
  abc;
  showPDF(){
    $("#pdfViewerModal").on("contextmenu",function(e){
      return false;
    });
    this.pdf_url = this.filePdf['file_booklet.pdf'];
  }


  showPDFcustome(){
    $("#pdfViewerModal").on("contextmenu",function(e){
      return false;
    });
    this.pdf_url = this.filePdf['Customisation_booklet_A4.pdf'];

  }

  confirmAndShare(name) {
    if (confirm("Are you sure you want to share?") == true) {
      this.shareWithCustomerFile(name); 
    }
  }
  shareWithCustomerFile(name){
    this.loaderService.display(true);
    console.log("name",name)
  	this.leadService.shareWithCustomerFilePdf(this.project_id,name).subscribe(
  		res=>{
        this.loaderService.display(false);
        this.successalert = true;
        this.successMessage = "Pdf has shared successfully!";
        this.fetchPdfList();
        setTimeout(function() {
          this.successalert = false;
         }.bind(this), 800);

  		},
  		err=>{
        this.erroralert = true;
        this.errorMessage = JSON.parse(err['_body']).message;
        setTimeout(function() {
           this.erroralert = false;
         }.bind(this), 10000);

        this.loaderService.display(false);
      });

  }

  fetchPdfList(){
    this.loaderService.display(true);
    this.leadService.fetchPdfList(this.id).subscribe(
      res => {
        this.loaderService.display(false);
        this.pdfFileList = res['pdfFileList'];
        console.log(this.pdfFileList ,'this sis ssss');
      },
      err => {
        this.loaderService.display(false);
        
      }
    );
  }
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

}
