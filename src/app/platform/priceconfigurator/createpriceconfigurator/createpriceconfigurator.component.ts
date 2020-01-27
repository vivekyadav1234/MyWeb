import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { environment } from '../../../../environments/environment';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { PriceconfiguratorService } from '../priceconfigurator.service';
import { LoaderService } from '../../../services/loader.service';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-createpriceconfigurator',
  templateUrl: './createpriceconfigurator.component.html',
  styleUrls: ['./createpriceconfigurator.component.css'],
  providers: [ PriceconfiguratorService]
})
export class CreatepriceconfiguratorComponent implements OnInit {


	onboard: any;
  errorMessage: string;
  food:string;
  food_type: string;
  family_size: string;
  food_option: string;
  utensil_used: string;
  vegetable_cleaning:string;
  cleaning_frequency:string;
  storage_utensils:string;
  kind_of_food:string;
  size_of_utensils:string;
  habit:string;
  section:Object;
  priceconfiguratorObj={};
  total_price_cents = 0;
  priceConfiguratorId : number;
  responseObj : any;
  hob_check : string;
  chimney_check : string;
  platform_check : string;
  kitchen_type :string;
  finish_type : string;
  designRefId: any;
  designImageURL:any;
  
  constructor(
  	private route: ActivatedRoute,
    private router: Router,
    private priceConfiguratorService: PriceconfiguratorService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService

  ) { }

  ngOnInit() {
    //this.getSpecification();
  }

  fetchDesigns(designRefId){
    this.loaderService.display(true);
    this.priceConfiguratorService.fetchDesign(designRefId).subscribe(
      res=> {
        Object.keys(res).map((key)=>{ this.designImageURL= res[key];});
        this.loaderService.display(false);
        window.scrollTo(0, 0);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  
  // showImages(){
  //   $('.carouselImgDiv').css({'display': 'block'});
  // }

  ngOnChanges(): void {
    //this.getSpecification();
  }

  	onDropdownChange(id,value){
  		if(id == "food"){
  			this.food = value;
        this.createPriceConfigurator(id,value);
  		} else if(id == "food_type"){
  			this.food_type = value;
        this.createPriceConfigurator(id,value);
       
   		}else if(id == "family_size"){
  			this.family_size = value;
        this.createPriceConfigurator(id,value);
        
  		}else if(id == "utensil_used"){
  			this.utensil_used = value;
        this.createPriceConfigurator(id,value);
       
  		}else if(id == "vegetable_cleaning"){
  			this.vegetable_cleaning = value;
        this.createPriceConfigurator(id,value);
  		}else if(id == "cleaning_frequency"){
  			this.cleaning_frequency = value;
        this.createPriceConfigurator(id,value);
        
  		}else if(id == "storage_utensils"){
  			this.storage_utensils = value;
        this.createPriceConfigurator(id,value);
  		}else if(id == "kind_of_food"){
  			this.kind_of_food = value;
        this.createPriceConfigurator(id,value);
  		}else if(id == "size_of_utensils"){
  			this.size_of_utensils = value;
        this.createPriceConfigurator(id,value);
  		}else if(id == "habit"){
  			this.habit = value;
        this.createPriceConfigurator(id,value);
  		} else if(id== 'food_option') {
        this.food_option = value;
        this.createPriceConfigurator(id,value);
      }else if(id == "kitchen_type"){
        this.kitchen_type = value;
        this.createPriceConfigurator(id,value);
      }
      else if(id == "finish_type"){
        this.finish_type = value;
        this.createPriceConfigurator(id,value);
      }
	  }
    


    getSpecification() {
      this.priceConfiguratorService.getSectionSpecification()
            .subscribe(
              res=>{
                this.section = res;
                Object.keys(res).map((key)=>{ this.section= res[key];});
              },
              error=>{
                this.errorMessage = <any>error;
                $.notify(JSON.parse(this.errorMessage['_body']).message);
              });
    }

    createPriceConfigurator(id:string,value:string) {
      this.priceconfiguratorObj[id]= value;
      this.priceConfiguratorService.createPriceConfigurator(this.responseObj,this.priceconfiguratorObj,this.hob_check,this.platform_check,this.chimney_check)
          .subscribe(
            res=>{
              this.responseObj = res;
              this.hob_check = res.price_configurator.hob_check;
              this.chimney_check = res.price_configurator.chimney_check;
              this.platform_check = res.price_configurator.platform_check;
              this.total_price_cents = res.total_price_cents;
              this.priceConfiguratorId = res.price_configurator.id;
            },
             error=>{
                this.errorMessage = <any>error;
                
              }
            );
    }
    
	addClass(addClassId,removeClassId){
    //$('.imgDiv').removeClass('divBorder');
    var id = '#'+addClassId;
    $(id).addClass('divBorder');
    id = '#'+removeClassId;
    $(id).removeClass('divBorder');
  };
}

