import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-email-pdf-viewer',
  templateUrl: './email-pdf-viewer.component.html',
  styleUrls: ['./email-pdf-viewer.component.css']
})
export class EmailPdfViewerComponent implements OnInit {
  pdf_url:any;

  constructor() { }

  ngOnInit() {
    this.fetchPdfList();
  }

  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;

  afterLoadComplete(pdfData: any) {
    $('.pdfViewer').bind("contextmenu", function (e) {
      e.preventDefault();
    });
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  pdfFileList = [];
  fetchPdfList(){
    // this.pdfFileList = [{'pdf_url':'http://localhost:4200/assets/img/file.pdf','name':'Test','id':7}]
    this.pdfFileList = [{'pdf_url':'https://delta.arrivae.com'+'/assets/img/file.pdf','name':'Test','id':7}]
   
   this.pdf_url = this.pdfFileList[0].pdf_url;
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



}
