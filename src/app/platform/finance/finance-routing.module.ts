import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import {FinanceService} from './finance.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListProposalsComponent } from './list-proposals/list-proposals.component';
import { ListBoqsComponent } from './list-boqs/list-boqs.component';
import { VendorPaymentComponent } from './vendor-payment/vendor-payment.component';
import { ClientLedgerComponent } from './client-ledger/client-ledger.component';
import { VendorLedgerComponent } from './vendor-ledger/vendor-ledger.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ClientInvoiceComponent } from './client-invoice/client-invoice.component';
const routes: Routes = [
  {
      path: '',
      canActivate: [LoggedInGuard],
      component: DashboardComponent
  },
  {
  	path: 'project/:id/list-proposals',
      canActivate: [LoggedInGuard],
      component: ListProposalsComponent
  },
  {
  	path: 'project/:id/list-boqs',
      canActivate: [LoggedInGuard],
      component: ListBoqsComponent
  },
  {
    path: 'vendor-payment',
      canActivate: [LoggedInGuard],
      component: VendorPaymentComponent
  },
  {
    path: 'client-ledger',
      canActivate: [LoggedInGuard],
      component: ClientLedgerComponent
  },
  {
    path: 'vendor-ledger',
      canActivate: [LoggedInGuard],
      component: VendorLedgerComponent
  },
  {
    path: 'client-invoice',
    component: ClientInvoiceComponent
  }
  // {
  //   path: 'create-invoice',
  //     canActivate: [LoggedInGuard],
  //     component: CreateInvoiceComponent
  // }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FinanceService]
})
export class FinanceRoutingModule { }
