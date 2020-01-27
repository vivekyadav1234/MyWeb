import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { ListusersComponent } from './listusers/listusers.component';
import { UserRolesRoutingModule } from './user-roles-routing.module';
import {NgPipesModule} from 'ngx-pipes';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    UserRolesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgPipesModule,
    NgxPaginationModule,
  ],
  declarations: [ListusersComponent]
})
export class UserRolesModule { }
