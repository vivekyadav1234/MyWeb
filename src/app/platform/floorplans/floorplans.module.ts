import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FloorplanRoutingModule} from './floorplans-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { CreatefloorplanComponent } from './floorplan/createfloorplan/createfloorplan.component';
import { ViewfloorplanComponent } from './floorplan/viewfloorplan/viewfloorplan.component';
import { EditfloorplanComponent } from './floorplan/editfloorplan/editfloorplan.component'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [CreatefloorplanComponent,ViewfloorplanComponent,EditfloorplanComponent]
})
export class FloorplansModule { }

