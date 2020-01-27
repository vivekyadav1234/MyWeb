import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import {
	FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { LoaderService } from '../../../services/loader.service';
import { Routes, Router, RouterModule , ActivatedRoute} from '@angular/router';
import { Http } from '@angular/http';
import { ModularproductsService } from '../modularproducts.service';

declare var $:any;


@Component({
  selector: 'app-createmodularproduct',
  templateUrl: './createmodularproduct.component.html',
  styleUrls: ['./createmodularproduct.component.css'],
  providers: [ModularproductsService]
})
export class CreatemodularproductComponent implements OnInit {

  constructor(
  	private _tokenService: Angular2TokenService,
     private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: Http,
    private loaderService : LoaderService,
    private modularproductsService:ModularproductsService
  ) { }

  modularkitchenForm = this.formBuilder.group({
  	
  });

  ngOnInit() {
  	this.modularproductsService.getSections().subscribe(
  		res=> {
  		},
  		err => {
  			
  		}
  	 );
  }

}
