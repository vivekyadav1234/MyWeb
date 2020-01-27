import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { QuotationService } from '../../quotation/quotation.service';
import {BusinessHeadService} from '../business-head.service';
import { LeadService } from '../../lead/lead.service';
import {Location} from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-boq-list',
  templateUrl: './boq-list.component.html',
  styleUrls: ['./boq-list.component.css'],
  providers: [ BusinessHeadService,QuotationService, LeadService]
})
export class BoqListComponent implements OnInit {
	project_id;

  constructor(
  	private activatedRoute: ActivatedRoute,
    private router:Router,
    public loaderService : LoaderService,
    private quotationService : QuotationService,
    private leadService : LeadService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private _location: Location,
    private businessHeadService:BusinessHeadService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.project_id = params['projectId'];
      });
  	this.getBoqList();
  }

  // fetchBasicDetails(){
  //   this.leadService.getLeadLogs(this.lead_id).subscribe(
  //     res => {
  //       this.lead_details = res['lead'];
  //       
  //     },
  //     err => {
  //       
  //     }
  //   );
  // }


  boq_list;
  getBoqList(){
  	this.loaderService.display(true);
  	this.businessHeadService.getQuotationList(this.project_id).subscribe(
  		res=>{
  			this.loaderService.display(false);
  			this.boq_list = res['quotations']
  		},
  		err=>{
  			

  		})

  }

}
