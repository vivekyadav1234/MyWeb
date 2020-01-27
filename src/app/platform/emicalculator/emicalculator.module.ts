import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule }  from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { EmicalculatorRoutingModule } from './emicalculator-routing.module';
import { CreateEmicalculatorComponent } from './create-emicalculator/create-emicalculator.component';
import {NgPipesModule} from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    EmicalculatorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [CreateEmicalculatorComponent]
})
export class EmicalculatorModule { }
