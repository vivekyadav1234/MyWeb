import { Component, EventEmitter, Input, OnInit, Output, NgZone } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {Angular2TokenService } from 'angular2-token';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

// import { Catalogue } from '../catalogue';
// import { CatalogueService } from '../catalogue.service';
import { Router, Routes, RouterModule , ActivatedRoute} from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;



@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

	private productUrl = environment.apiBaseUrl+'/v1/portfolios';
  options: RequestOptions;

  private spaces = [];
  private themes = [];
  private lifestage = [];
  private elements = [];
  private themeFlag= [];
  private lifestageFlag = [];
  private elementsFlag = [];

  firstDropDownChanged(val: any,i:number) {
    if (val == "Home") {
      this.spaces[i] = ["Kitchen", "Bedroom", "Living"];
      this.themes[i] = ['All','Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Indian Ethnic','Other'];
    }
    else if (val == "Office") {
      this.spaces[i] = ["Conference", "Reception", "Workstations"];
      this.themes[i] = [];
    }
    else {
      this.spaces[i] = [];
      this.themes[i] = [];
    }
  }

  spaceDropDownChanged(val: any,i:number) {
    if (val == 'Kitchen'){
      this.lifestage[i] = ['Bachelor','Working Couple','Large Families','Old Age'];
      this.elements[i] = [];
      this.lifestageFlag[i] = false;
      this.elementsFlag[i] = false;
      this.themeFlag[i] = true;
      this.themes[i] = ['All','Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Indian Ethnic','Other','Lifestage Kitchen'];
      this.createPortfolioForm.value.portfolio[i].element = "";
      this.createPortfolioForm.value.portfolio[i].lifestage = "";
    }
    else if (val == 'Bedroom') {
      this.lifestage[i] = [];
      this.themes[i]=[];
      this.elements[i] = ['Master Bedroom','Kids Room', 'Wardrobe'];
      this.lifestageFlag[i] = false;
      this.elementsFlag[i] = true;
      this.themeFlag[i] = false;
      this.createPortfolioForm.value.portfolio[i].lifestage = "";
    }
    else if(val == 'Living'){
      this.lifestage[i] = [];
      this.elements[i] = [];
      this.themes[i] = ['All','Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Indian Ethnic','Other'];
      this.createPortfolioForm.value.portfolio[i].lifestage = "";
      this.createPortfolioForm.value.portfolio[i].element = "";
      this.lifestageFlag[i] = false;
      this.elementsFlag[i] = false;
      this.themeFlag[i] = true;
    }
  }

  themeDropDownChanged(val:any,i:number){
    if(val=='Lifestage Kitchen') {
      this.lifestageFlag[i] = true;
    } else {
      this.lifestageFlag[i] = false;
    }
  }

  createPortfolioForm: FormGroup;
  id: Number;
  attachment_file: any;
  attachment_name: string;
  basefile = {};

  constructor(
    private formBuilder: FormBuilder,
      private http: Http,
    // private productService :ProductService,
    private authService : AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService : LoaderService,
    private zone: NgZone

  ) {
  		this.options = this.authService.getHeaders();
  }

  submitted = false;
  errorMessage: string;
  successMessage: string;

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //         this.id = +params['id'];
    // });

    this.createPortfolioForm = this.formBuilder.group({
      portfolio: this.formBuilder.array( [this.buildItem('')])
    })
  }

  buildItem(val: string) {
    return new FormGroup({
      segment: new FormControl(val, Validators.required),
      space: new FormControl(""),
      theme: new FormControl(""),
      price_cents: new FormControl(""),
      user_story_title: new FormControl(""),
      //portfolio_data: new FormControl(""),
      description: new FormControl(""),
      attachment_file: new FormControl(""),
      lifestage: new FormControl(""),
      element: new FormControl("")
    })
  }

  getJobAttributes(createPortfolioForm){
    return createPortfolioForm.get('portfolio').controls
  }

  pushJobAttributes(createPortfolioForm){
    return createPortfolioForm.get('portfolio').push(this.buildItem(''))
  }

  onChange(event,i) {
    this.attachment_file = event.srcElement.files[0];
    if((this.attachment_file.size/1024) > 120) {
      document.getElementById('errorsize'+i).innerHTML = 'File size should not exceed 120kb.';
    }
    var fileReader = new FileReader();

    var base64;
    fileReader.onload = (fileLoadedEvent) => {
        var image = new Image();
        // image.onload = function () {
        //   if(image.width > 1010 || image.height > 583){
        //     document.getElementById('errorresolution'+i).innerHTML= 'Uploaded image width = '+image.width+" and height = "+
        //                                                   image.height+' is greater than the expected dimensions.';
        //   } if(image.width < 1010 || image.height < 583){
        //     document.getElementById('errorresolution'+i).innerHTML= 'Uploaded image width = '+image.width+" and height = "+
        //                                                   image.height+' is less than the expected dimensions.';
        //   }

        // };
        image.src = fileReader.result;
          base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile[i] = base64.result
    };
    fileReader.readAsDataURL(this.attachment_file);
  }


  onSubmit(data) {
    let arr = this.basefile;
    this.loaderService.display(true);
    data.portfolio.forEach(function (value, i) {
      value.attachment_file = arr[i];
    });
    this.submitted = true;
    this.http.post(this.productUrl, data,
          this.options).map((res: Response) => res.json())
    .subscribe(
        product => {
          product = product;
         this.loaderService.display(false);
          location.reload();
          this.successMessage = 'uploaded successfully';
          return product;
        },
        error => {
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(error['_body']).message;
          //alert(this.errorMessage['_body']);
          //return Observable.throw(error);
        }
    );
  }
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }


}
