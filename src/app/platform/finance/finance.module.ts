import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {FinanceRoutingModule} from './finance-routing.module';
import {AuthenticationModule} from '../../authentication/authentication.module';
import { FileUploadModule } from "ng2-file-upload";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ListProposalsComponent } from './list-proposals/list-proposals.component';
import { ListBoqsComponent } from './list-boqs/list-boqs.component';
import { CollapsibleModule } from 'angular2-collapsible';
import { NgSelectModule } from '@ng-select/ng-select';
import { VendorPaymentComponent } from './vendor-payment/vendor-payment.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ClientLedgerComponent } from './client-ledger/client-ledger.component';
import { VendorLedgerComponent } from './vendor-ledger/vendor-ledger.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ClientInvoiceComponent } from './client-invoice/client-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    NgPipesModule,
    FinanceRoutingModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule,
    AuthenticationModule,
    CollapsibleModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [DashboardComponent, ListProposalsComponent, ListBoqsComponent, VendorPaymentComponent,TimeAgoPipe, ClientLedgerComponent, VendorLedgerComponent, ClientInvoiceComponent,CreateInvoiceComponent]
})
export class FinanceModule { }
