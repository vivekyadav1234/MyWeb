import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { PresentationRoutingModule } from './presentation-routing.module';
import { ViewpresentationComponent } from './viewpresentation/viewpresentation.component';
import { CreatepresentationComponent } from './createpresentation/createpresentation.component';
import { EditpresentationComponent } from './editpresentation/editpresentation.component';

@NgModule({
  imports: [
    CommonModule,
    PresentationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgxPaginationModule
  ],
  declarations: [ViewpresentationComponent, CreatepresentationComponent, EditpresentationComponent]
})
export class PresentationModule { }
