import {Router, ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { PresentationService } from '../presentation.service';
import { environment } from 'environments/environment';
import { LoaderService } from '../../../services/loader.service';

declare let $: any;

@Component({
  selector: 'app-viewpresentation',
  templateUrl: './viewpresentation.component.html',
  styleUrls: ['./viewpresentation.component.css'],
  providers: [PresentationService]
})
export class ViewpresentationComponent implements OnInit {

  public project_id:any
  public presentationList : any[];
  constructor(
    public activatedRoute: ActivatedRoute,
    public presentationService : PresentationService,
    private loaderService : LoaderService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.project_id = params['projectId'];
      });
    this.getPresentations();
  }

  getPresentations(){
    this.loaderService.display(true);
    this.presentationService.getPresentationList(this.project_id).subscribe(
      res => {
        Object.keys(res).map((key)=>{ this.presentationList= res[key];})
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

}
