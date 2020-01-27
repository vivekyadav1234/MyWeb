import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../portfolio.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../../services/loader.service';
declare var $:any;
@Component({
  selector: 'app-listportfoliodata',
  templateUrl: './listportfoliodata.component.html',
  styleUrls: ['./listportfoliodata.component.css'],
  providers: [PortfolioService]
})
export class ListportfoliodataComponent implements OnInit {

	portfolio: any[];
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
  user_story_title: string;
  portfolio_data: any;
  description: string;
  imgsrc : string;
  attachment_File: any;
  attachment_name: string;
  basefile = {};
  submitted = false;
  id :number;
  loader :boolean;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;


  constructor(
  	private router: Router,
    private portfolioService:PortfolioService,
    private loaderService : LoaderService
  ) { }

  ngOnInit() {
  	this.portfolioListFromService();
  }
  ngAfterViewInit() {
        $('[data-toggle="tooltip"]').tooltip();
  }

  portfolioListFromService(){
     this.portfolioService.getPortFolioList().subscribe(
        portfolio => {
          this.portfolio = portfolio;
          Object.keys(portfolio).map((key)=>{ this.portfolio= portfolio[key];});
        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(this.errorMessage['_body']).message;
          // $.notify(JSON.parse(this.errorMessage['_body']).message);
        }
    );
  }

  confirmAndDelete(id:number) {
    if (confirm("Are You Sure") == true) {
      this.DeletePortfolio(id);
    }
  }

  private DeletePortfolio(id:number){
    this.loaderService.display(true);
     this.portfolioService.deletePortfolio(id).subscribe(
        portfolio => {
          this.portfolioListFromService();
          this.successalert = true;
          this.successMessage = "Portfolio Deleted Successfully !!";
          $(window).scrollTop(0);
          setTimeout(function() {
                this.successalert = false;
            }.bind(this), 2000);

        //  $.notify('Deleted Successfully!');
          this.loaderService.display(false);
        },
        error =>  {
          this.erroralert = true;
          this.errorMessage = <any>JSON.parse(error['_body']).message;
          $(window).scrollTop(0);
          setTimeout(function() {
                this.erroralert = false;
            }.bind(this), 2000);
        //  $.notify(JSON.parse(this.errorMessage['_body']).message);
           this.loaderService.display(false);
        }
    );
  }

  private getPortfolio(id:number) {
    this.id = id;
    this.portfolioService.viewPortfolioData(id).subscribe(
        res => {
          this.segment = res.portfolio.segment;
          this.imgsrc = res.portfolio.attachment_file;
          this.firstDropDownChanged(this.segment);
          this.element = res.portfolio.element;
          this.space = res.portfolio.space;
          this.spaceDropDownChanged(this.space);
          this.theme = res.portfolio.theme;
          this.lifestage = res.portfolio.lifestage;
           this.price_cents = res.portfolio.price_cents;
           this.description = res.portfolio.description;
           this.user_story_title = res.portfolio.user_story_title
           this.portfolio_data = (res.portfolio.portfolio_data != null)? JSON.stringify(res.portfolio.portfolio_data):'NA';
           // this.attachment_file = res.portfolio.attachment_file;
        },
        error => {
          
        }

      );
  }
  /*-- edit portfolio methods -- */

  firstDropDownChanged(val: any) {
    if (val == "Home") {
      this.space ='';
      this.spaces = ["Kitchen", "Bedroom", "Living"];
      this.themes = ['All','Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Indian Ethnic','Other'];
      this.elements = ['Master Bedroom','Kids Room', 'Wardrobe'];
      this.lifestages = ['Bachelor','Working Couple','Large Families','Old Age'];
    }
    else if (val == "Office") {
      this.space ='';
      this.spaces = ["Conference", "Reception", "Workstations"];
      this.themes = ['Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Other'];
      this.lifestages = [];
      this.elements = [];
    }
    else {
      this.spaces = [];
      this.themes = [];
      this.elements = [];
      this.lifestages = [];
    }
  }

  spaceDropDownChanged(val: any) {
    if (val == 'Kitchen'){
      this.lifestages = ['Bachelor','Working Couple','Large Families','Old Age'];
      this.themes = ['Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Other','Lifestage Kitchen'];
      this.element='';
      this.theme = "";
      this.lifestageFlag = true;
      this.elementsFlag = false;
    }
    else if (val == 'Bedroom') {
      this.lifestage='';
      this.elements = ['Master Bedroom','Kids Room', 'Wardrobe'];
      this.lifestageFlag = false;
      this.elementsFlag = true;
    }
    else if(val == 'Living'){
      this.lifestage='';
      this.theme = "";
      this.themes = ['Minimalist','Transitional','Contemporary','Modern','Rustic Industrial','Indian Ethnic','Other'];
      this.element='';
      this.lifestageFlag = false;
      this.elementsFlag = false;
    } else {
      this.lifestage ='';
      this.element ='';
    }
  }

  themeDropDownChanged(val:any,i:number){
    if(val=='Lifestage Kitchen') {
      this.lifestageFlag[i] = true;
    } else {
      this.lifestageFlag[i] = false;
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

  onSubmit(data) {
   $('#exampleModalLong').modal('hide');
    this.loaderService.display(true);
    this.imgsrc = "";
    data.attachment_file = this.basefile;

     let obj = {
       portfolio : {
         'segment' :data.segment,
         'theme' : (data.segment=='Home' && (data.space=='Living')||(data.space=='Kitchen')) ?data.theme:'',
         'element' : (data.segment=='Home' && data.space=='Bedroom') ?data.element:'',
         'space' : data.space,
         'attachment_file' : data.attachment_file,
        'lifestage' : (data.segment=='Home' && (data.space=='Kitchen' && data.theme == 'Lifestage Kitchen')) ? data.lifestage:'',
        'price_cents' : data.price_cents,
        'description': data.description,
        'user_story_title' : data.user_story_title,
        'portfolio_data' : (data.portfolio_data!="" && data.portfolio_data!=null && 
            data.portfolio_data!=undefined && data.portfolio_data !="NA")?JSON.parse(data.portfolio_data):''
       }
     }
    this.submitted = true;
    this.portfolioService.editPortfolio(this.id,obj)
    .subscribe(
        res => {
         this.portfolioListFromService();
         this.loaderService.display(false);
         this.successalert = true;
         this.basefile = undefined;
         this.successMessage = "Portfolio Updated Successfully !!";
         setTimeout(function() {
               this.successalert = false;
           }.bind(this), 2000);
         //$.notify('Updated Successfully!');
        },
        error => {
           this.loaderService.display(false);
           this.erroralert = true;
           this.errorMessage = JSON.parse(error['_body']).message;
           setTimeout(function() {
                 this.erroralert = false;
             }.bind(this), 2000);
          //$.notify(JSON.parse(error['_body']).message);
        }
    );
  }
  tooltipHide(){
    $('.add').tooltip('hide')
  }
}
