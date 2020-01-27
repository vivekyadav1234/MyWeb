import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import  { TestimonialService } from '../testimonial.service';
import { LoaderService } from '../../../services/loader.service';

declare var $:any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [TestimonialService]
})
export class ViewComponent implements OnInit {
  public testimonials: any;
  id :number;
  loader :boolean;
  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;


  constructor(private router: Router,
     private http: Http,
     private  testserve: TestimonialService,
     private loaderService : LoaderService) { }

  ngOnInit() {
    this.getTestimonials();

  }
  playVideo(id:number){
    if($("#"+id)[0].paused == true){
      $("#"+id)[0].play();
      $("#"+id).attr("controls", true);
      $("#img_"+id).hide();
    }
    else{
      $("#"+id)[0].pause();
      $("#"+id).attr("controls", false);
      $("#img_"+id).show();
    }
  }
  getTestimonials(){
    this.testserve.getData()
     .subscribe(
       res => {
         this.testimonials = res['testimonials'];
       }
       ,error => {
         
       }
     );

  }

  confirmAndDelete(id:number) {
    if (confirm("Are You Sure") == true) {
      this.DeleteTestimonial(id);
    }
  }

  private DeleteTestimonial(id:number){
    this.loaderService.display(true);
    this.testserve.deletetestimonial(id).subscribe(
      res=>{
        this.getTestimonials();
        alert("deleted succesfully");
        this.loaderService.display(false);

      },
      error =>{
          
      }

      );
  }

}
