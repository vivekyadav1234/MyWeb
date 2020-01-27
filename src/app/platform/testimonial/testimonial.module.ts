import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { TestimonialRoutingModule } from './testimonial-routing.module';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    TestimonialRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    TestimonialRoutingModule
  ],
  declarations: [CreateComponent, ViewComponent, EditComponent]
})
export class TestimonialModule { }
