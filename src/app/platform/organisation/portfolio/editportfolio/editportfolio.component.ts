import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Routes, Router,RouterModule , ActivatedRoute} from '@angular/router';
import { PortfolioService } from '../portfolio.service';
import { LoaderService } from '../../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-editportfolio',
  templateUrl: './editportfolio.component.html',
  styleUrls: ['./editportfolio.component.css'],
  providers:[PortfolioService]
})
export class EditportfolioComponent implements OnInit {

  public spaces = [];
  public segments = ['Home','Office'];
  public themes = [];
  public lifestages = [];
  public elements = [];
  private lifestageFlag = false;
  private elementsFlag = false;

  segment : string;
  theme : string;
  element : string;
  space : string;
  attachment_file : any;
  lifestage : string;
   price_cents : string;
   errorMessage : string;
   erroralert = false;
   successalert = false;
   successMessage : string;

  attachment_File: any;
  attachment_name: string;
  basefile = {};
  submitted = false;
  id :number;
   loader :boolean;

  firstDropDownChanged(val: any) {
    if (val == "Home") {
      this.space = 'Kitchen';
      this.spaces = ["Kitchen", "Bedroom", "Living"];
      this.themes = ['All','Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Indian Ethnic','Other'];
    }
    else if (val == "Office") {
      this.space = 'Conference';
      this.spaces = ["Conference", "Reception", "Workstations"];
      this.themes = ['Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Other'];
      // this.lifestages = [];
      // this.elements = [];
    }
    // else {
    //   this.spaces = [];
    //   this.themes = [];
    // }
  }

   spaceDropDownChanged(val: any) {
    if (val == 'Kitchen'){
      this.lifestage = 'Bachelor';
      this.element='';
      this.lifestages = ['Bachelor','Working Couple','Large Families','Old Age'];
       //this.elements = [];
       this.lifestageFlag = true;
       this.elementsFlag = false;
       //this.createPortfolioForm.value.portfolio[i].element = "";
    }
    else if (val == 'Bedroom') {
      //this.lifestages = [];
      this.element='Master Bedroom';
      this.lifestage='';
      this.elements = ['Master Bedroom','Kids Room', 'Wardrobe'];
       this.lifestageFlag = false;
       this.elementsFlag = true;
       //this.createPortfolioForm.value.portfolio[i].lifestage = "";
    }
    else if(val == 'Living'){
      this.theme ='Minimalist';
      this.lifestage ='';
      this.element ='';
     // this.lifestages = [];
      //this.elements = [];
      this.lifestageFlag = false;
       this.elementsFlag = false;
    } else {
      this.lifestage ='';
      this.element ='';
      this.lifestageFlag = false;
      this.elementsFlag = false;
    }

   }

   onChange(event) {

    this.attachment_File = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;

    };
    fileReader.readAsDataURL(this.attachment_File);
  }

  constructor(
  	private router: Router,
    private portfolioService:PortfolioService,
    private route: ActivatedRoute,
    private loaderService : LoaderService
  ) {
  }

  ngOnInit() {
  	this.route.params.subscribe(params => {
		            this.id = +params['id'];
		  	});
  	this.portfolioService.viewPortfolioData(this.id).subscribe(
  			res => {
  				this.segment = res.portfolio.segment;
  				this.firstDropDownChanged(this.segment);
  				this.theme = res.portfolio.theme;
  				this.element = res.portfolio.element;
  				this.space = res.portfolio.space;
  				this.spaceDropDownChanged(this.space);
  				this.lifestage = res.portfolio.lifestage;
   				this.price_cents = res.portfolio.price_cents;
   				// this.attachment_file = res.portfolio.attachment_file;
  			},
  			error => {
  				
  			}

  		);
  }

  onSubmit(data) {
    this.loaderService.display(true);
    data.attachment_file = this.basefile;
     let obj = {
     	portfolio : {
     		'segment' :data.segment,
     		'theme' : data.theme,
     		'element' : data.element,
     		'space' : data.space,
     		'attachment_file' : data.attachment_file,
    		'lifestage' : data.lifestage,
    		'price_cents' : data.price_cents
     	}
     }
    this.submitted = true;
    this.portfolioService.editPortfolio(this.id,obj)
    .subscribe(
        res => {
          this.successalert = true;
          this.successMessage = "Portfolio Updated Successfully !!";
        // $.notify('Updated successfully');
         this.loaderService.display(false);
         //this.router.navigateByUrl('/portfolio/list')
        },
        error => {
          this.erroralert = true;
          this.loaderService.display(false);
          this.errorMessage = JSON.parse(error['_body']).message;
          //$.notify(JSON.parse(error['_body']).message);
        }
    );
  }

}
