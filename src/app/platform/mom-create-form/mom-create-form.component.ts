import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService} from '../category/category/category.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { CalenderService } from '../calender/calender.service';
// import { ViewlogsComponent } from '../activity-logs/viewlogs/viewlogs.component';
// import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Component({
  selector: 'app-mom-create-form',
  templateUrl: './mom-create-form.component.html',
  styleUrls: ['./mom-create-form.component.css'],
  providers: [CalenderService]
})
export class MomCreateFormComponent implements OnInit {

  mom:FormGroup;
  eventid: any;
  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  successresult: any;

  constructor(private router: Router,
    private route : ActivatedRoute,
    private loaderService:LoaderService,
    public calenderService : CalenderService,
    // public reloadComponent : ViewlogsComponent,
    ) { }

  ngOnInit() {
    this.mom = new FormGroup({
      mom_description: new FormControl("",Validators.required),
    });

    this.route.queryParams.subscribe(params => {
        this.eventid = params['id'];
      });

    
    $('#menu').hide();
  }

  //onsubmit function
  createMOM(){
    if (this.mom.valid) {
      this.loaderService.display(true);
      this.calenderService.createMOMFromIcon(this.mom.value,this.eventid).subscribe(
        event => {
         setTimeout(function() {
             this.successalert = false;
          }.bind(this), 2000);
          this.successalert = true;
          window.opener.location.reload(false);
          this.successMessage = "MOM successfully created";
          this.loaderService.display(false);
          setTimeout(function() {
            this.successalert = false;
          }.bind(this), 3000);
          if(event.status == 200){
            setTimeout(function() {
            window.close();
            }.bind(this), 3000);
          }
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
      // this.reloadComponent.ngOnInit();
      // window.opener.location.reload(false);
    }
  }

}
