import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import  { CustomerService} from '../customer.service';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [CustomerService]
})
export class ProjectsComponent implements OnInit {
	options: RequestOptions;
    headers: Headers;
    wipList: any = [];

  constructor(
  	private router: Router,private loaderService : LoaderService,
     private http: Http,
     private  cmserve: CustomerService

  	) { }

  ngOnInit() {
  	this.getWipList();
  }
  getWipList(){
  	this.loaderService.display(true);
    this.cmserve.getProjectList().subscribe(
      res => {
        // this.usersList = res.leads;
        this.wipList = res.leads;
        this.loaderService.display(false);
       
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
}


