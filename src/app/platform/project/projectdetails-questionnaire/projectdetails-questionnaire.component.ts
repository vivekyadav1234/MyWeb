import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { Http, Response } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Angular2TokenService } from 'angular2-token';
import { ProjectService } from '../project/project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
declare var $:any;

@Component({
  selector: 'app-projectdetails-questionnaire',
  templateUrl: './projectdetails-questionnaire.component.html',
  styleUrls: ['./projectdetails-questionnaire.component.css'],
  providers: [ProjectService]
})
export class ProjectdetailsQuestionnaireComponent implements OnInit {

  result    : any;
  role      : string;
  projectDetails : any;
  projectId : Number;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  //form      : FormGroup;
  form1     : FormGroup;
  form  = new FormGroup({
     customer_name: new FormControl("",Validators.required),
     lead_id: new FormControl(""),
     mobile_number: new FormControl("",Validators.required),
     alternate_mobile: new FormControl(""),
     email: new FormControl("",[Validators.required,Validators.pattern("[^ @]*@[^ @]*.[^ @]")]),
     city: new FormControl(""),
     property_age: new FormControl(""),
     property_usage: new FormControl(""),
     property_type: new FormControl(""),
     number_of_rooms: new FormControl(""),
     possession_status: new FormControl(""),
     use_type: new FormControl(""),
     requirement: new FormControl(""),
     budget: new FormControl(""),
     preferred_time_call_designer: new FormControl(""),
     preferred_time_site_visit: new FormControl(""),
     members_in_family: new FormControl(""),
     tentative_date_moving: new FormControl(""),
     occupation_of_customer: new FormControl("")
     });

      constructor(
        
          private route : ActivatedRoute,
          private loaderService : LoaderService,
          private projectService : ProjectService,
          private http: Http
      ) {
        
          this.role = localStorage.getItem('user');
          this.route.params.subscribe(params => {
              this.projectId = +params['projectId'];
          });
      }
      

    ngOnInit()
      
    {
     this.projectService.questionareApi().subscribe(data => {
       this.result = Array.of(data);
     });
    this.projectService.answerApi(this.projectId).subscribe(
      res => {
        this.projectDetails = res['project_detail'];
        this.form.controls['customer_name'].setValue(this.projectDetails['customer_name']);
        this.form.controls['email'].setValue(this.projectDetails['email']);
        this.form.controls['mobile_number'].setValue(this.projectDetails['mobile_number']);
        this.form.controls['alternate_mobile'].setValue(this.projectDetails['alternate_mobile']);
        this.form.controls['city'].setValue(this.projectDetails['city']);
        this.form.controls['property_age'].setValue(this.projectDetails['property_age']);
        this.form.controls['property_usage'].setValue(this.projectDetails['property_usage']);
        this.form.controls['property_type'].setValue(this.projectDetails['property_type']);
        this.form.controls['number_of_rooms'].setValue(this.projectDetails['number_of_rooms']);
        this.form.controls['possession_status'].setValue(this.projectDetails['possession_status']);
        this.form.controls['use_type'].setValue(this.projectDetails['use_type']);
        this.form.controls['requirement'].setValue(this.projectDetails['requirement']);
        this.form.controls['budget'].setValue(this.projectDetails['budget']);
        this.form.controls['preferred_time_call_designer'].setValue(this.projectDetails['preferred_time_call_designer']);
        this.form.controls['preferred_time_site_visit'].setValue(this.projectDetails['preferred_time_site_visit']);
        this.form.controls['members_in_family'].setValue(this.projectDetails['members_in_family']);
        this.form.controls['tentative_date_moving'].setValue(this.projectDetails['tentative_date_moving']);
        this.form.controls['occupation_of_customer'].setValue(this.projectDetails['occupation_of_customer']);
        this.form1.controls['project_type'].setValue(this.projectDetails['project_type']);
        this.form1.controls['kitchen'].get('platform').setValue(this.projectDetails['kitchen'].platform);
        this.form1.controls['kitchen'].get('type_of_kitchen').setValue(this.projectDetails['kitchen'].type_of_kitchen);
        this.form1.controls['kitchen'].get('shape_of_kitchen').setValue(this.projectDetails['kitchen'].shape_of_kitchen);
        this.form1.controls['kitchen'].get('preferred_material').setValue(this.projectDetails['kitchen'].preferred_material);
        this.form1.controls['kitchen'].get('preferred_finish').setValue(this.projectDetails['kitchen'].preferred_finish);
        this.form1.controls['kitchen'].get('preferred_finish_material').setValue(this.projectDetails['kitchen'].preferred_finish_material);
        this.form1.controls['kitchen'].get('more_used_by').setValue(this.projectDetails['kitchen'].more_used_by);
        this.form1.controls['kitchen'].get('other_requirments').setValue(this.projectDetails['kitchen'].other_requirments);

        this.form1.controls['kids_bedroom'].get('type_of_wardrobe').setValue(this.projectDetails['kids_bedroom'].type_of_wardrobe);
        this.form1.controls['kids_bedroom'].get('preferred_material').setValue(this.projectDetails['kids_bedroom'].preferred_material);
        this.form1.controls['kids_bedroom'].get('preferred_finish').setValue(this.projectDetails['kids_bedroom'].preferred_finish);
        this.form1.controls['kids_bedroom'].get('preferred_finish_material').setValue(this.projectDetails['kids_bedroom'].preferred_finish_material);
        this.form1.controls['kids_bedroom'].get('other_requirments').setValue(this.projectDetails['kids_bedroom'].other_requirments);

        this.form1.controls['parent_bedroom'].get('type_of_wardrobe').setValue(this.projectDetails['parent_bedroom'].type_of_wardrobe);
        this.form1.controls['parent_bedroom'].get('preferred_material').setValue(this.projectDetails['parent_bedroom'].preferred_material);
        this.form1.controls['parent_bedroom'].get('preferred_finish').setValue(this.projectDetails['parent_bedroom'].preferred_finish);
        this.form1.controls['parent_bedroom'].get('preferred_finish_material').setValue(this.projectDetails['parent_bedroom'].preferred_finish_material);
        this.form1.controls['parent_bedroom'].get('other_requirments').setValue(this.projectDetails['parent_bedroom'].other_requirments);

        this.form1.controls['guest_bedroom'].get('type_of_wardrobe').setValue(this.projectDetails['guest_bedroom'].type_of_wardrobe);
        this.form1.controls['guest_bedroom'].get('preferred_material').setValue(this.projectDetails['guest_bedroom'].preferred_material);
        this.form1.controls['guest_bedroom'].get('preferred_finish').setValue(this.projectDetails['guest_bedroom'].preferred_finish);
        this.form1.controls['guest_bedroom'].get('preferred_finish_material').setValue(this.projectDetails['guest_bedroom'].preferred_finish_material);
        this.form1.controls['guest_bedroom'].get('other_requirments').setValue(this.projectDetails['guest_bedroom'].other_requirments);

        this.form1.controls['living_room'].get('preferred_material').setValue(this.projectDetails['living_room'].preferred_material);
        this.form1.controls['living_room'].get('preferred_finish').setValue(this.projectDetails['living_room'].preferred_finish);
        this.form1.controls['living_room'].get('preferred_finish_material').setValue(this.projectDetails['living_room'].preferred_finish_material);
        this.form1.controls['living_room'].get('other_requirments').setValue(this.projectDetails['living_room'].other_requirments);

      },
      err => {
        
      }
    );

      


     this.form1 = new FormGroup({
       
       project_type: new FormControl(""),
       scope_of_work: new FormArray([]),

       kitchen: new FormGroup({
         platform         : new FormControl(""),
         type_of_kitchen  : new FormControl(""),
         shape_of_kitchen : new FormControl(""),
         furniture        : new FormArray([]),
         services         : new FormArray([]),
         appliances       : new FormArray([]),
         apliances_ii     : new FormArray([]),
         preferred_material : new FormControl(""),
         preferred_finish  : new FormControl(""),
         preferred_finish_material  : new FormControl(""),
         more_used_by     : new FormControl(""),
         other_requirments : new FormControl(""),
       }),

       master_bedroom: new FormGroup({
         furniture        : new FormArray([]),
         type_of_wardrobe : new FormControl(""),
         type_of_bed      : new FormArray([]),
         services         : new FormArray([]),
         preferred_material:new FormControl(""),
         preferred_finish : new FormControl(""),
         preferred_finish_material : new FormControl(""),
         other_requirments : new FormControl(""),
       }),

       kids_bedroom: new FormGroup({
         furniture        : new FormArray([]),
         type_of_wardrobe : new FormControl(""),
         type_of_bed      : new FormArray([]),
         services         : new FormArray([]),
         preferred_material : new FormControl(""),
         preferred_finish : new FormControl(""),
         preferred_finish_material : new FormControl(""),
         other_requirments : new FormControl("")
       }),

       parent_bedroom: new FormGroup({
         furniture        : new FormArray([]),
         type_of_wardrobe : new FormControl(""),
         type_of_bed      : new FormArray([]),
         services         : new FormArray([]),
         preferred_material : new FormControl(""),
         preferred_finish : new FormControl(""),
         preferred_finish_material : new FormControl(""),
         other_requirments : new FormControl("")
       }),

       guest_bedroom: new FormGroup({
         furniture        : new FormArray([]),
         type_of_wardrobe : new FormControl(""),
         type_of_bed      : new FormArray([]),
         services         : new FormArray([]),
         preferred_material: new FormControl(""),
         preferred_finish : new FormControl(""),
         preferred_finish_material :new FormControl(""),
         other_requirments : new FormControl("")
       }),

       living_room: new FormGroup({
         furniture        : new FormArray([]),
         services         : new FormArray([]),
         preferred_material: new FormControl(""),
         preferred_finish  : new FormControl(""),
         preferred_finish_material: new FormControl(""),
         other_requirments : new FormControl("")
       }),

       pooja_room: new FormGroup({
         furniture        : new FormArray([]),
         services         : new FormArray([])
       }),

       foyer: new FormGroup({
         furniture        : new FormArray([]),
         services         : new FormArray([])
       }),

       servents_room      : new FormControl(""),
       utility_area       : new FormControl(""),
       library            : new FormControl(""),

     });

    //  this.form.patchValue({
    //     // name: 'Todd Motto'
    //   });
  }
  
  onCheckChange(event,htmlElemName) {
    var formArray: FormArray
    if(htmlElemName== 'scope_of_work') {
      formArray = this.form1.get('scope_of_work') as FormArray;
    } else if(htmlElemName == 'kitchen_furniture') {
      formArray = this.form1.get('kitchen').get('furniture') as FormArray;
    } else if(htmlElemName == 'kitchen_services') {
      formArray = this.form1.get('kitchen').get('services') as FormArray;
    } else if(htmlElemName == 'kitchen_appliances') {
      formArray = this.form1.get('kitchen').get('appliances') as FormArray;
    } else if(htmlElemName == 'kitchen_apliances_ii') {
      formArray = this.form1.get('kitchen').get('apliances_ii') as FormArray;
    } else if(htmlElemName == 'master_bedroom_furniture') {
      formArray = this.form1.get('master_bedroom').get('furniture') as FormArray;
    } else if(htmlElemName == 'master_bedroom_services') {
      formArray = this.form1.get('master_bedroom').get('services') as FormArray;
    } else if(htmlElemName == 'master_bedroom_type_of_bed') {
      formArray = this.form1.get('master_bedroom').get('type_of_bed') as FormArray;
    } else if(htmlElemName == 'kids_bedroom_furniture') {
      formArray = this.form1.get('kids_bedroom').get('furniture') as FormArray;
    } else if(htmlElemName == 'kids_bedroom_type_of_bed') {
      formArray = this.form1.get('kids_bedroom').get('type_of_bed') as FormArray;
    } else if(htmlElemName == 'kids_bedroom_services') {
      formArray = this.form1.get('kids_bedroom').get('services') as FormArray;
    } else if(htmlElemName == 'parent_bedroom_furniture') {
      formArray = this.form1.get('parent_bedroom').get('furniture') as FormArray;
    } else if(htmlElemName == 'parent_bedroom_type_of_bed') {
      formArray = this.form1.get('parent_bedroom').get('type_of_bed') as FormArray;
    } else if(htmlElemName == 'parent_bedroom_services') {
      formArray = this.form1.get('parent_bedroom').get('services') as FormArray;
    } else if(htmlElemName == 'guest_bedroom_furniture') {
      formArray = this.form1.get('guest_bedroom').get('furniture') as FormArray;
    } else if(htmlElemName == 'guest_bedroom_type_of_bed') {
      formArray = this.form1.get('guest_bedroom').get('type_of_bed') as FormArray;
    } else if(htmlElemName == 'guest_bedroom_services') {
      formArray = this.form1.get('guest_bedroom').get('services') as FormArray;
    } else if(htmlElemName == 'living_room_furniture') {
      formArray = this.form1.get('living_room').get('furniture') as FormArray;
    } else if(htmlElemName == 'living_room_services') {
      formArray = this.form1.get('living_room').get('services') as FormArray;
    } else if(htmlElemName == 'pooja_room_services') {
      formArray = this.form1.get('pooja_room').get('services') as FormArray;
    } else if(htmlElemName == 'pooja_room_furniture') {
      formArray = this.form1.get('pooja_room').get('furniture') as FormArray;
    } else if(htmlElemName == 'foyer_services') {
      formArray = this.form1.get('foyer').get('services') as FormArray;
    } else if(htmlElemName == 'foyer_furniture') {
      formArray = this.form1.get('foyer').get('furniture') as FormArray;
    }


    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }



  product(){
    if($(".addClass").hasClass("hideClass"))
    {
      $(".addClass").removeClass("hideClass");
      $(".addClass1").addClass("hideClass");
      $(".upload1").removeClass("actBtn");
      $(".upload0").addClass("actBtn");
    }
   else
    {
      $(".addClass1").addClass("hideClass");
      $(".upload1").removeClass("actBtn");
      $(".upload0").addClass("actBtn");
    }
 }

 servicesBtn(){
   if($(".addClass1").hasClass("hideClass"))
    {
      $(".addClass1").removeClass("hideClass");
      $(".addClass").addClass("hideClass");
      $(".upload0").removeClass("actBtn");
      $(".upload1").addClass("actBtn");
    }
   else
    {
      $(".addClass").addClass("hideClass");
      $(".upload0").removeClass("actBtn");
      $(".upload1").addClass("actBtn");
    }
 }

 onSubmit(user)
 {
  this.loaderService.display(true);
   const leadRegUrl = environment.apiBaseUrl+'/v1/projects/'+this.projectId+'/update-project-details/';
   const req = this.http.patch(leadRegUrl, user);
   req.subscribe(
     res => {
       this.successalert = true;
       this.successMessage = "Form Successfully Submited !!";
       setTimeout(function() {
           this.successalert = false;
         }.bind(this), 2000);
       this.loaderService.display(false);
       //this.form.reset();
     },
     err => {
       this.erroralert = true;
       this.errorMessage= "An error has occured while submitting Form !!";
         setTimeout(function() {
             this.erroralert = false;
           }.bind(this), 2000);
          this.loaderService.display(false);
     }
   );
 }

  onSubmit2(user)
  {
    this.loaderService.display(true);
    const leadRegUrl = environment.apiBaseUrl+'/v1/projects/'+this.projectId+'/update-project-details/';
    const req = this.http.patch(leadRegUrl, user);
    req.subscribe(
      res => {
        this.successalert = true;
        this.successMessage = "Form Successfully Submited !!";
        setTimeout(function() {
            this.successalert = false;
          }.bind(this), 2000);
          this.loaderService.display(false);
      //  this.form1.reset();
      },
      err => {
        this.erroralert = true;
        this.errorMessage= "An error has occured while submitting Form !!";
          setTimeout(function() {
              this.erroralert = false;
            }.bind(this), 2000);
        this.loaderService.display(false);
      }
    );
  }

}


