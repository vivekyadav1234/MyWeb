import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../../../services/user-details.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../../services/loader.service';
import {CadService} from '../../../cad/cad.service';
declare var $ : any;

@Component({
  selector: 'app-shop-drawing',
  templateUrl: './shop-drawing.component.html',
  styleUrls: ['./shop-drawing.component.css'],
  providers:[CadService]
})
export class ShopDrawingComponent implements OnInit {
	role;
	successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;

  constructor(
  	private loaderService : LoaderService,
  	private cadService:CadService
  ) { }

  ngOnInit() {
  	this.loaderService.display(false);
    this.getProjectList();
  }

  project_list;
  getProjectList(){
    this.cadService.getProjectList().subscribe(
      res=>{
        this.project_list = res['projects']
      },
      err=>{
        


      });
  }

}
