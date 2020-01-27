import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable'; 
import  { TestimonialService } from '../testimonial.service';
import { LoaderService } from '../../../services/loader.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [TestimonialService]

})
export class CreateComponent implements OnInit {
  options: RequestOptions;
    headers: Headers;
  rForm:  FormGroup;
  post: any;
  name: string ="";
  testimonial: string ="";
  profession: string ="";
  video_url: string ="";
  successalert = false;
  erroralert = false;
  successMessage : string;
  errorMessage: string;

  feature: any;

  constructor(private fb: FormBuilder,private router: Router,private loaderService : LoaderService,
     private http: Http,
     private  testserve: TestimonialService) {

          this.rForm = fb.group({
            'name': ['', Validators.required],
            'profession' : ['', Validators.required],
            'testimonial': ['', Validators.required],
            'video_url' : ['', Validators.required],
            'feature': ['']
          });



   }

  ngOnInit() {
  }
   addPost(){
      this.loaderService.display(true);
    this.testserve.postData(this.rForm.value)
    .subscribe(
    testimonial => {
          testimonial = testimonial;
          Object.keys(testimonial).map((key)=>{ testimonial= testimonial[key];});
          // Layout.initSWAL('Congrats!','success', 'You have registered successfully!');
          //$.notify('You have registered successfully!');
          this.router.navigateByUrl('/testimonial');
          this.loaderService.display(false);
          alert("Created Successfully");
          return testimonial;

        }, 
        error => {
          this.errorMessage = error;
           this.loaderService.display(false);
           // Layout.initSWAL('Oops!','error', 'Email already taken! ');
          //$.notify('error',"this.errorMessage['_body']")
          return Observable.throw(error);
        }
    );
   }
}