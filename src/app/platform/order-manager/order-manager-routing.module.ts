import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { OrderManagerService} from './order-manager.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [LoggedInGuard],
    component: DashboardComponent
  },
  {
    path: 'quotations/:quotationId/created_purchase_orders',
    canActivate: [LoggedInGuard],
    component: OrdersComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [OrderManagerService],
})
export class OrderManagerRoutingModule { }
