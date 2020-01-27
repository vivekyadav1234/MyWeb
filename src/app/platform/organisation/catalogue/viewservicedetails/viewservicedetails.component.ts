import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Catalogue } from '../catalogue';
import { CatalogueService } from '../catalogue.service';
import { Routes, RouterModule , ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
declare var Layout:any;

@Component({
  selector: 'app-viewservicedetails',
  templateUrl: './viewservicedetails.component.html',
  styleUrls: ['./viewservicedetails.component.css'],
  providers: [CatalogueService]
})
export class ViewservicedetailsComponent implements OnInit {

  id: Number;
  secid: Number;
  subsecid: Number;
  catalogue: Catalogue[];
  service: any[];
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor(
  	private catalogueService :CatalogueService,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) { }

  	ngOnInit() {
	  	this.route.params.subscribe(params => {
	            this.id = +params['id'];
	            this.secid = +params['secid'];
	            this.subsecid = +params['subsectionid'];
	      });
	    this.catalogueService.viewServiceDetails(this.id,this.subsecid).subscribe(
	        service => {
	          this.service = service;
	          Object.keys(service).map((key)=>{ this.service= service[key];});
	          this.loaderService.display(false);
	        },
	        error => {
	          this.erroralert = true;
	          this.errorMessage = JSON.parse(error['_body']).message;
	        //  Layout.notify('danger',JSON.parse(this.errorMessage['_body']).message);
	          this.loaderService.display(false);
	          setTimeout(function() {
	              this.erroralert = false;
	          }.bind(this), 10000);
	        }
	    );
 	}

 	ngAfterViewInit() {
    	this.loaderService.display(true);
  	}	

}
