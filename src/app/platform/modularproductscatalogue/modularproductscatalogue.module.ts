import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { ModularProductCatlogueRoutingModule } from './modularproductscatalogue-routing.module';
import { CreatemodularproductComponent } from './createmodularproduct/createmodularproduct.component';

@NgModule({
  imports: [
    CommonModule,
    ModularProductCatlogueRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [CreatemodularproductComponent]
})
export class ModularproductscatalogueModule { }
