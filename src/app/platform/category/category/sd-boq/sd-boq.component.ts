import { Component, OnInit } from '@angular/core';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { QuotationService } from '../../../quotation/quotation.service';
import {CadService} from '../../../cad/cad.service';
import {Location} from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-sd-boq',
  templateUrl: './sd-boq.component.html',
  styleUrls: ['./sd-boq.component.css'],
  providers: [ CadService,QuotationService]
})
export class SdBoqComponent implements OnInit {
	project_id;

  constructor(
  	private activatedRoute: ActivatedRoute,
    private router:Router,
    public loaderService : LoaderService,
    private quotationService : QuotationService,
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private _location: Location,
    private cadService:CadService
  ) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.project_id = params['project_id'];
      });
  	this.getBoqList();
  }

  boq_list;
  getBoqList(){
  	this.loaderService.display(true);
  	this.cadService.getQuotationList(this.project_id).subscribe(
  		res=>{
  			this.loaderService.display(false);
  			this.boq_list = res['quotations']
  		},
  		err=>{
  			

  		})

  }

}
