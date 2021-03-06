import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { CategoryService} from '../category.service';
import { Angular2TokenService } from 'angular2-token';

@Component({
  selector: 'app-category-proposals',
  templateUrl: './category-proposals.component.html',
  styleUrls: ['./category-proposals.component.css'],
  providers: [CategoryService]
})
export class CategoryProposalsComponent implements OnInit {

	@Input() proposal_list:any = [];
	project_id;
  project_name;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;

  constructor() { }

  ngOnInit() {
  }

}
