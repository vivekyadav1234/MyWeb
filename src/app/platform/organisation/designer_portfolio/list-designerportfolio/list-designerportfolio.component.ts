import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DesignerPortfolioService } from '../designer-portfolio.service';
import { Observable } from 'rxjs';
import { LoaderService } from '../../../../services/loader.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-list-designerportfolio',
  templateUrl: './list-designerportfolio.component.html',
  styleUrls: ['./list-designerportfolio.component.css'],
  providers: [DesignerPortfolioService]
})
export class ListDesignerportfolioComponent implements OnInit {

  designerPortfolio: any[];
  submitted = false;
  id :string;
  editPortfolioForm: FormGroup;
  role:string;
  loader :boolean;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  attachment_file: any;
  attachment_name: string;
  basefile = {};
  successMessage : string;

  constructor(
  	private router: Router,
    private designerPortfolioService:DesignerPortfolioService,
    private loaderService : LoaderService,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem('user');
    this.id = localStorage.getItem('userId');
    this.editPortfolioForm = this.formBuilder.group({
      name : new FormControl('',Validators.required),
      description: new FormControl(""),
      url: new FormControl(""),
      attachment_file: new FormControl(""),
      portfolioId : new FormControl(),
      userId : new FormControl()
    });
    this.getPortfolioList();
  }

  getPortfolioList(){

    this.loaderService.display(true);
    this.designerPortfolioService.getPortfolioList(this.id)
        .subscribe(
            portfolio => {
              this.designerPortfolio = portfolio;
              Object.keys(portfolio).map((key)=>{ this.designerPortfolio= portfolio[key];});
             
              this.loaderService.display(false);
            },
            error =>  {
              this.erroralert = true;
              this.errorMessage = <any>JSON.parse(error['_body']).message;
              this.loaderService.display(false);
              // $.notify(JSON.parse(this.errorMessage['_body']).message);
            }
        );
  }

  getPortfolioDetailsWithId(portfolioId,userId) {
    this.designerPortfolioService.getPortfolioDetailsWithId(portfolioId,userId)
        .subscribe(
          res => {
            this.editPortfolioForm.controls['name'].setValue(res['portfolio_work'].name);
            this.editPortfolioForm.controls['url'].setValue(res['portfolio_work'].url);
            this.editPortfolioForm.controls['description'].setValue(res['portfolio_work'].description);
            this.editPortfolioForm.controls['portfolioId'].setValue(portfolioId);
            this.editPortfolioForm.controls['userId'].setValue(userId);
            // this.editPortfolioForm.controls['attachment_file'].setValue(res['portfolio_work'].attachment_file);
            if(res['portfolio_work'].attachment_file != '/images/original/missing.png')
              document.getElementById('output').setAttribute('src',res['portfolio_work'].attachment_file);
            else {
              document.getElementById('output').setAttribute('src','');
            }
          },
          err => {
            
          }
        );
  }

  updatePortfolioDetails(params){
    $('#exampleModalLong').modal('hide');
    params['attachment_file'] = this.basefile;
    this.loaderService.display(true);
    this.designerPortfolioService.updatePortfolioDetails(params)
      .subscribe(
        res => {
          this.getPortfolioList();
          this.basefile = undefined;
          this.successalert = true;
          this.successMessage = 'Portfolio updated successfully!';
          this.loaderService.display(false);
           setTimeout(function() {
              this.successalert = false;
          }.bind(this), 10000);
        },
        err => {
          this.erroralert = true;
          this.errorMessage = err;
          this.loaderService.display(false);
           setTimeout(function() {
              this.erroralert = false;
          }.bind(this), 10000);
          return Observable.throw(err);
        }
      );
  }

  onEditPortfolioFormChange(event){
    var output = document.getElementById('output');
    this.attachment_file = event.srcElement.files[0];
    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      // this.basefile = base64.result;
      this.basefile = base64.result
    };
    fileReader.readAsDataURL(this.attachment_file);
    document.getElementById('output').setAttribute('src',URL.createObjectURL(event.target.files[0]));
  }

  deletePortfolio(userId,portfolioID) {
    if (confirm("Are you sure you want to permanently delete this item?")) {
      this.loaderService.display(true);
      this.designerPortfolioService.deletePortfolio(userId,portfolioID)
          .subscribe(
            res => {
              this.getPortfolioList();
              this.successMessage = 'Deleted Successfully!';
              this.successalert = true;
              this.loaderService.display(false);
              setTimeout(function() {
                this.successalert = false;
              }.bind(this), 10000);
            },
            err => {
              this.errorMessage = JSON.parse(err['_body']).message;
              this.erroralert = true;
              this.loaderService.display(false);
              setTimeout(function() {
                this.erroralert = false;
              }.bind(this), 10000);
            }
          );
    }
    return false;

  }
}
