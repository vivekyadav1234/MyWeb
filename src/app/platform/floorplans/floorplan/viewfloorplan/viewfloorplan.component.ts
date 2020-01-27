import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Floorplan } from '../floorplan';
import { FloorplanService } from '../floorplan.service';
import { ProjectService } from '../../../project/project/project.service';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-viewfloorplan',
  templateUrl: './viewfloorplan.component.html',
  styleUrls: ['./viewfloorplan.component.css'],
   providers: [ProjectService,FloorplanService]

})
export class ViewfloorplanComponent implements OnInit {

	id: Number;
	role:string;
	fpid: Number;
	observableFloorplan : Observable<Floorplan[]>;
	floorplan : Floorplan[];
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  customer_status;


  constructor(
  	private route: ActivatedRoute,
  	private router: Router,
    private floorplanService : FloorplanService,
     private loaderService : LoaderService,
  ) { }

  ngOnInit() {

  		this.role = localStorage.getItem('user');
	  	this.route.params.subscribe(params => {
	            this.id = +params['id'];
	            this.fpid = +params['fpid'];
	    });
      this.route.queryParams.subscribe(params => {
        this.customer_status = params['customer_status'];
      });
      this.getFloorplanDetails(); 
  }

  getFloorplanDetails(){
    this.loaderService.display(true);
    this.observableFloorplan = this.floorplanService.viewFloorplanDetails(this.id,this.fpid);
      this.observableFloorplan.subscribe(
        floorplan => {
          this.floorplan = floorplan;
          Object.keys(floorplan).map((key)=>{ this.floorplan= floorplan[key];});
          this.loaderService.display(false);
        },
        error => {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(error['_body']).message;
          this.loaderService.display(false);
          setTimeout(function() {
                 this.erroralert = false;
            }.bind(this), 5000);
          //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
          this.router.navigateByUrl('/');
        }
      );
  }

  confirmAndDelete(){
    if (confirm("Are You Sure") == true) {
      this.deleteFloorplan();
    }
  }

 	deleteFloorplan(){
  	this.loaderService.display(true);
    this.observableFloorplan = this.floorplanService.deleteFloorPlan(this.id,this.fpid);
      this.observableFloorplan.subscribe(
        result => {
          this.successalert = true;
          this.successMessage = "Floorplan Deleted!!";

        	//$.notify('Deleted');
        	this.loaderService.display(false);
          setTimeout(function() {
               this.router.navigateByUrl('projects/view/'+this.id);
           }.bind(this), 2000);

        },
        error => {
          this.erroralert = true;
        this.errorMessage=JSON.parse(error['_body']).message;

        	this.loaderService.display(false);
        	//$.notify('error',JSON.parse(this.errorMessage['_body']).message);
        	this.router.navigateByUrl('/');
        }
    );
  }

  editFloorplan(){
  	this.router.navigateByUrl('projects/'+this.id+'/floorplan/edit/'+this.fpid);
  }




}
