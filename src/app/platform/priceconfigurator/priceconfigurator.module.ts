import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule }  from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { PriceconfiguratorRoutingModule } from './priceconfigurator-routing.module';
import { CreatepriceconfiguratorComponent } from './createpriceconfigurator/createpriceconfigurator.component';
import {NgPipesModule} from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    PriceconfiguratorRoutingModule,
     FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [CreatepriceconfiguratorComponent]
})
export class PriceconfiguratorModule { }
