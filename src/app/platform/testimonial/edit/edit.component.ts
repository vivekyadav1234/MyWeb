import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ TestimonialService ]
})
export class EditComponent implements OnInit {
  options: RequestOptions;
  	headers: Headers;
	rForm:  FormGroup;
	post: any;
	index: any;
	name: string ="";
	testimonial: string ="";
	profession: string ="";
	video_url: string ="";
	id;
  feature: any;
  constructor(private fb: FormBuilder,private router: Router,
    private loaderService : LoaderService,
  	private route:ActivatedRoute,
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
  	this.route.params.subscribe(
  		params => {
  			this.id = params['id']
  		}
  	);
  	this.getDetails();
  }
  getDetails(){
  	this.testserve.getDataofTestimonial(this.id).subscribe(
  		res => {
  			this.rForm.controls['name'].setValue(res.testimonial.name);
  			this.rForm.controls['profession'].setValue(res.testimonial.profession);
  			this.rForm.controls['testimonial'].setValue(res.testimonial.testimonial);
  			this.rForm.controls['video_url'].setValue(res.testimonial.video_url);
        this.rForm.controls['feature'].setValue(res.testimonial.feature);
        // this.rForm.controls['video'].setValue(res.testimonial.video);
  		},
  		err => {
  			
  		}
  	);
  }

  updateData(){
    this.loaderService.display(true);
  	this.testserve.updateTestimonial(this.id,this.rForm.value).subscribe(

  		res => {
        this.loaderService.display(false);
  			alert("Updated Successfully");
        this.router.navigateByUrl('/testimonial');
  		},
  		err => {
  			
  			alert("Updated Failed");
  		}
  	);
  }

}
