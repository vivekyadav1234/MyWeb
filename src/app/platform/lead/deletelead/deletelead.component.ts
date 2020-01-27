import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import {Lead} from '../lead';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-deletelead',
  templateUrl: './deletelead.component.html',
  styleUrls: ['./deletelead.component.css'],
  providers: [LeadService]
})
export class DeleteleadComponent implements OnInit {
	id:Number;
	errorMessage: any;
  constructor(
  	private router: Router,
    private leadService:LeadService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
		            this.id = +params['id'];
		  	});
  	this.leadService.deleteLead(this.id)
  		.subscribe(
  			leads => {
  				$.notify('Deleted Successfully!');
	          this.router.navigateByUrl('lead/list');
	        },
	        error =>  {
	          this.errorMessage = <any>error;
	          $.notify('error',JSON.parse(this.errorMessage['_body']).message);
            
	        }
  		);
  }

}
