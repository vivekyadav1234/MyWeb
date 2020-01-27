import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Design } from '../design';
import {FloorplanDesignService} from '../floorplan-design.service';
import { ProjectService } from '../../../project/project/project.service';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
import { QuotationService } from '../../../quotation/quotation.service';
declare var $:any;

@Component({
  selector: 'app-viewfloorplandesign',
  templateUrl: './viewfloorplandesign.component.html',
  styleUrls: ['./viewfloorplandesign.component.css'],
   providers: [FloorplanDesignService,QuotationService]
})
export class ViewfloorplandesignComponent implements OnInit {

	id: Number;
  role:string;
	fpid: Number;
	observableDesign : Observable<Design[]>;
	design : Design[];
  boqs:any[];
  designStatus : string;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,
    private designService : FloorplanDesignService,
    private loaderService : LoaderService,
    private quotationService:QuotationService
  ) { }

  ngOnInit() {

      this.role= localStorage.getItem('user');
	  	this.route.params.subscribe(params => {
		            this.id = +params['id'];
		            this.fpid = +params['fpid'];
		});
    this.route.queryParams.subscribe(params => {
        this.customer_status = params['customer_status'];
      });
    this.getDesignList();
    }

    deleteDesignalert(id:Number){
      if (confirm("Are You Sure") == true) {
        this.deleteDesign(id);
      }
    }

    deleteDesign(desid:Number) {
      this.loaderService.display(true);
		 this.observableDesign = this.designService.deleteDesign(this.id,this.fpid,desid);
        this.observableDesign.subscribe(
        result => {
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "Design deleted successfully";
          setTimeout(function() {
              this.successalert = false;
            }.bind(this), 2000);
        //  $.notify('Deleted');
          this.getDesignList();
          // this.router.navigateByUrl('/projects/'+this.id+'/floorplandesign/'+this.fpid+'/view');
        },
        error => {
          this.erroralert = true;
          this.errorMessage=JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
                this.erroralert = false;
           }.bind(this), 2000);
          //$.notify(JSON.parse(this.errorMessage['_body']).message);
          this.router.navigateByUrl('/');
        }
      );

	   }
	  editDesign(desid:Number){
    	this.router.navigateByUrl('projects/'+this.id+'/floorplandesign/'+this.fpid+'/edit/'+desid);
    }

    designApproval(desid:Number, status:string){
      this.loaderService.display(true);
      this.observableDesign = this.designService.designApproval(this.id,this.fpid,desid,status);
        this.observableDesign.subscribe(
        result => {
           this.getDesignList();
           this.loaderService.display(false);
           this.successalert = true;
           this.successMessage = "Design" + " " + status;
           //$.notify('Done!');
        },
        error => {
          this.erroralert = true;
          this.errorMessage=JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          //$.notify(JSON.parse(this.errorMessage['_body']).message);
          //this.router.navigateByUrl('/');
        }
      );
    }

  getDesignList() {
    this.observableDesign = this.designService.listDesigns(this.id,this.fpid);
    this.observableDesign.subscribe(
      design => {
        this.design = design;
        Object.keys(design).map((key)=>{ this.design= design[key];});
      },
      error => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(error['_body']).message;
        //$.notify(JSON.parse(this.errorMessage['_body']).message);
        this.router.navigateByUrl('/');
      }
    );
  }
  getBOQList(id,fpid,desid){
    this.designService.listBoqs(desid).subscribe(
      boqs => {
        this.boqs = boqs;
        Object.keys(boqs).map((key)=>{ this.boqs= boqs[key];});
       $('#boqlistModal').modal('show');
      },
      error => {
        this.erroralert = true;
        this.errorMessage = <any>JSON.parse(error['_body']).message;
      }
    );
  }
  // deleteQuotationWithId(id:number) {
  //   this.loaderService.display(true);
  //   this.quotationService.deleteQuotation(id).subscribe(
  //     result => {
  //       this.loaderService.display(false);
  //       this.successalert = true;
  //       this.successMessage = "Quotation Deleted !!";
  //       //$.notify('Deleted');
  //     },
  //     error =>{
  //       this.loaderService.display(false);
  //       this.erroralert = true;
  //       this.errorMessage = JSON.parse(error['_body']).message
  //     }
  //    );
  // }

}
