import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {FloorplannerRoutingModule} from './floorplanner-routing.module';
import { FloorplannereditorComponent } from './floorplannereditor/floorplannereditor.component';
import { SharedModule }  from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloorplannerRoutingModule,
    SharedModule
  ],
  declarations: [FloorplannereditorComponent]
})
export class FloorplannerModule { }
