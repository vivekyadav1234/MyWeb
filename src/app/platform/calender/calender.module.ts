import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';

import { CalenderRoutingModule } from './calender-routing.module';
import { ViewcalenderComponent } from './viewcalender/viewcalender.component';
import {CalendarComponent} from "ap-angular2-fullcalendar/src/calendar/calendar";

@NgModule({
  imports: [
    CommonModule,
    CalenderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [ViewcalenderComponent,CalendarComponent]
})
export class CalenderModule { }
