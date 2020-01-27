import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderManagerRoutingModule } from './order-manager-routing.module';
import { NgPipesModule } from 'ngx-pipes';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OrderManagerRoutingModule,
    NgPipesModule
  ],
  declarations: [DashboardComponent, OrdersComponent]
})
export class OrderManagerModule { }
