import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadService } from '../lead.service';
import { Observable } from 'rxjs';
import {Lead} from '../lead';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-escalated-leads',
  templateUrl: './escalated-leads.component.html',
  styleUrls: ['./escalated-leads.component.css'],
  providers : [LeadService]
})
export class EscalatedLeadsComponent implements OnInit {

	escalatedLeads :any;
  csagentsArr;
  successalert = false;
  successMessage : string;
  errorMessage : string;
  erroralert = false;
  constructor(
  	private leadService:LeadService,
    private loaderService:LoaderService
  ) { }

  ngOnInit() {
  	this.getEscalatedLeads();
  }

  getEscalatedLeads() {
    this.loaderService.display(true);
  	this.leadService.escalatedleads()
  		.subscribe(
  			res => {
          this.csagentsArr = res.cs_agent_list;
          this.escalatedLeads = res.leads;
          this.loaderService.display(false);
  			},
  			err => {
  				
          this.loaderService.display(false);
  			}
  		)
  }
  direction: number;
    isDesc: boolean = true;
    column: string;
    // Change sort function to this: 
    sort(property){
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? 1 : -1; 
    }


  onDropdownChange(id,value,rowid) {
    this.assignedAgentId[rowid] = value;
    if(this.assignedAgentId[rowid] != undefined && this.assignedAgentId[rowid] !='Assign To CS Agent') {
      document.getElementById("assigndropdown"+id).classList.remove('inputBorder');
    }
  }
  assignedAgentId =[];

  assignLeadToAgent(id:number,index:number){
    if(this.assignedAgentId[index] != undefined && this.assignedAgentId[index] !='Assign To CS Agent') {
      this.loaderService.display(true);
      this.leadService.assignLeadToAgent(this.assignedAgentId[index],id)
                .subscribe(
            res => {
              Object.keys(res).map((key)=>{ res= res[key];});
              this.getEscalatedLeads();
              this.assignedAgentId[index] = undefined;
              this.loaderService.display(false);
              this.successalert = true;
              this.successMessage = "Assigned Successfully !!";
              $(window).scrollTop(0);
              setTimeout(function() {
                    this.successalert = false;
                 }.bind(this), 5000);
              //$.notify('Assigned Successfully!');
            },
            error => {
              this.erroralert = true;
              this.errorMessage=JSON.parse(error['_body']).message;
              this.loaderService.display(false);
              $(window).scrollTop(0);
              setTimeout(function() {
                    this.erroralert = false;
                 }.bind(this), 5000);
              //$.notify(JSON.parse(this.errorMessage['_body']).message);
            }
          );
    } else {
       document.getElementById("assigndropdown"+id).classList.add('inputBorder');
    }
  }
  openpopup(event){
    var thisobj=this;
    $(event.target).popover({
      trigger:'hover'
    });
   
    //$(this).popover();
    $(function () {
      $('.pop').popover({
        trigger:'hover'
      })
    }) 
  }

  
  ngOnDestroy(){
    $(function () {
      $('.pop').remove();
    })
  }
  ngAfterViewInit(){

    $(function () {
         $('.pop').popover({
           trigger:'hover'
         })
    })
  }

}
