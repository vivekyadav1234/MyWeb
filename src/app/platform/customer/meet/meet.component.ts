import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import  { CustomerService} from '../customer.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';

declare var $:any;

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css'],
  providers: [ CustomerService ]
})
export class MeetComponent implements OnInit {

  activeTab:any = 'initialProposal';
  team:any = [];
  project_id:any;
  // @Input() team:any = {};

  constructor(
    private customerService : CustomerService,
    public activatedRoute: ActivatedRoute, 
  ) { }

  ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
          this.project_id = params['custId'];
          this.getTeam();
        });
  }

  getTeam(){
    this.customerService.getTeam(this.project_id).subscribe(
        res => {
          this.team = res;
        },
        err => {
          
        });
  }

}
