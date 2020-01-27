import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { environment } from '../../../../environments/environment';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { EmicalculatorService } from '../emicalculator.service';
import { LoaderService } from '../../../services/loader.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators
} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-create-emicalculator',
  templateUrl: './create-emicalculator.component.html',
  styleUrls: ['./create-emicalculator.component.css'],
  providers: [EmicalculatorService]
})
export class CreateEmicalculatorComponent implements OnInit {

	emicalculatorForm : FormGroup;
  emicalculationResponse : any;
  amtMsg = false;
  tenureMsg = false;
  output : any = 0;
  output1 : any = 0;

	constructor(
  		private emicalculatorService : EmicalculatorService,
    	private formBuilder : FormBuilder,
      private loaderService:LoaderService
  	) { }

  	ngOnInit() {
  		this.emicalculatorForm =  this.formBuilder.group({
  			principal : new FormControl("0",[Validators.required]),
  			rate: new FormControl("",[Validators.required,Validators.min(8.56)]),
  			tenure : new FormControl("0",Validators.required)
  		});
  	}

  	onSubmit(data) {
      if(data.tenure == 0) {
        this.tenureMsg = true;
      } 
      if(data.principal == 0) {
        this.amtMsg = true;
      }
      if(data.principal != 0 && data.tenure != 0) {
        this.loaderService.display(true);
        data.tenure = data.tenure * 12;
        this.emicalculatorService.calculateEmi(data).subscribe(
          res => {
            this.emicalculationResponse = res;
            this.loaderService.display(false);
          }, 
          err => {
            
            this.loaderService.display(false);
          }
        );
      }
  	}

    

    sliderOnInput(val,sliderName) {
      if(sliderName == 'loanamount') {
        this.amtMsg = false;
        var slider = document.getElementById("loanAmtRange");
        this.output = val;
      }
      if(sliderName == 'tenure') {
        this.tenureMsg = false;
        var slider = document.getElementById("tenure");
        this.output1 = val + " Year";
      }
    }

  	ngAfterViewInit() {
        document.getElementById("amtval").innerHTML = '0';
  		  document.getElementById("tenureval").innerHTML = '0';
  	}

    numberCheck(e) {
      if(!((e.keyCode > 95 && e.keyCode < 106)
          || (e.keyCode > 47 && e.keyCode < 58)
          || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40 
          || e.keyCode==110 || e.keyCode == 190 || e.keyCode == 17
          || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
        return false;
      }
    }
}
