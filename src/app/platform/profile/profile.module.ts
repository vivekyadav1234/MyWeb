import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import {EditprofileComponent} from './profile/editprofile/editprofile.component';
import {ViewprofileComponent} from './profile/viewprofile/viewprofile.component';
import {NgPipesModule} from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [EditprofileComponent,ViewprofileComponent]
})
export class ProfileModule { }
