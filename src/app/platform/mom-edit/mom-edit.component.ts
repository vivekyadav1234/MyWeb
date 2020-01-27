import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService} from '../category/category/category.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { CalenderService } from '../calender/calender.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Component({
  selector: 'app-mom-edit',
  templateUrl: './mom-edit.component.html',
  styleUrls: ['./mom-edit.component.css'],
  providers: [CalenderService,ActivityLogsService]
})
export class MomEditComponent implements OnInit {

  mom:FormGroup;
	eventid: any;
	successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  view_mom:any;

  constructor(private router: Router,
  	private route : ActivatedRoute,
  	private loaderService:LoaderService,
  	public calenderService : CalenderService,
    public ActivityLogsService : ActivityLogsService
  ) { }

  ngOnInit() {
  	this.mom = new FormGroup({
      mom_description: new FormControl("",Validators.required),
    });

    this.route.queryParams.subscribe(params => {
      this.eventid = params['id'];
    });

    this.toViewMOM();
    

    $('#menu').hide();
  }

  //to get mom description
  toViewMOM(){
    this.ActivityLogsService.momView(this.eventid).subscribe(
      res => {
        this.view_mom = res;
       setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
        this.loaderService.display(false);
        setTimeout(function() {
           this.successalert = false;
        }.bind(this), 2000);
      },
      error => {
        this.erroralert = true;
        this.loaderService.display(false);
        setTimeout(function() {
            this.erroralert = false;
         }.bind(this), 2000);
      }
    );
  }

  //onsubmit function
  createMOM(){
    if (this.mom.valid) {
      this.loaderService.display(true);
      this.calenderService.updateMOMFromIcon(this.mom.value,this.eventid).subscribe(
        event => {
           
         setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
          this.successalert = true;
          this.successMessage = "MOM successfully created";
          this.loaderService.display(false);
          setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
        },
        error => {
          this.erroralert = true;
          this.errorMessage = "MOM not created";
          this.loaderService.display(false);
          setTimeout(function() {
              this.erroralert = false;
           }.bind(this), 2000);
        }
      );
      this.mom.reset();
        window.opener.location.reload(false);
    }
        setTimeout(function() {
          window.close();
        }.bind(this), 2000);
  }
}
