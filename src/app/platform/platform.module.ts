 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
// import { ReplaceChar } from '../shared/customizefilters.pipe';
import { PlatformRoutingModule } from './platform-routing.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DesignerModule } from './designer/designer.module';
import { CustomerModule } from './customer/customer.module';
import { OrganisationModule } from './organisation/organisation.module'
import { ProjectModule } from './project/project.module';
import { ProfileModule } from './profile/profile.module';
import { LeadModule } from './lead/lead.module';
import { SharedModule } from '../shared/shared.module';
import { QuotationModule } from './quotation/quotation.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TestimonialModule } from './testimonial/testimonial.module';
import { ModularproductscatalogueModule } from './modularproductscatalogue/modularproductscatalogue.module';
import { PresentationModule } from './presentation/presentation.module';
import { CalenderModule } from './calender/calender.module';
import { FinanceModule } from './finance/finance.module';
import { CategoryModule} from './category/category/category.module';
import { SitesupervisorModule } from './sitesupervisor/sitesupervisor.module';
import { ReferralModule } from './referral/referral.module';
import { OrderManagerModule } from './order-manager/order-manager.module';
import { GeneralManagerModule } from './general-manager/general-manager.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { CmVariableMarginsComponent } from './business-head/cm-variable-margins/cm-variable-margins.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoqMarginComponent } from './business-head/boq-margin/boq-margin.component';
import { AwsDashboardComponent } from './business-head/aws-dashboard/aws-dashboard.component';
import { MomCreateFormComponent } from './mom-create-form/mom-create-form.component';
import { MomEditComponent } from './mom-edit/mom-edit.component';
import { ViewlogsComponent } from './activity-logs/viewlogs/viewlogs.component';
import { FhiDataComponent } from './business-head/fhi-data/fhi-data.component';
import { MkwDataComponent } from './business-head/mkw-data/mkw-data.component';
import { OrderBookComponent } from './business-head/order-book/order-book.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { TrainingMaterialComponent } from './business-head/training-material/training-material.component';
import { EmbedVideo } from 'ngx-embed-video';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentViewModule } from 'ngx-document-view';


@NgModule({
  imports: [
    CommonModule,
    PlatformRoutingModule,
    DesignerModule,
    CustomerModule,
    OrganisationModule,
    ProjectModule,
    ProfileModule,
    LeadModule,
    QuotationModule,
    SchedulerModule,
    TestimonialModule,
    ModularproductscatalogueModule,
    PresentationModule,
    CalenderModule,
    FinanceModule,
    CategoryModule,
    SitesupervisorModule,
    ReferralModule,
    OrderManagerModule,
    GeneralManagerModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    SharedModule,
    ChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
    NgxPaginationModule,
    HttpClientModule,
    EmbedVideo.forRoot(),
    PdfViewerModule,
    DocumentViewModule,
    NgSelectModule

  ],
  declarations: [CmVariableMarginsComponent,
  BoqMarginComponent,
  MomCreateFormComponent,
  AwsDashboardComponent,
  MomEditComponent,
  FhiDataComponent,
  MkwDataComponent,
  OrderBookComponent,
  MomEditComponent,
  TrainingMaterialComponent
  ],

})
export class PlatformModule { }
