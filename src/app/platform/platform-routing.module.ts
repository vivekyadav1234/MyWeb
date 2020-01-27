import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../authentication/logged-out-guard.service';
import { AuthService }    from '../authentication/auth.service';
import { CmVariableMarginsComponent } from './business-head/cm-variable-margins/cm-variable-margins.component';
import { BoqMarginComponent } from './business-head/boq-margin/boq-margin.component';
import {MomCreateFormComponent} from './mom-create-form/mom-create-form.component'
import {MomEditComponent} from './mom-edit/mom-edit.component';
import { AwsDashboardComponent } from './business-head/aws-dashboard/aws-dashboard.component';
import { FhiDataComponent } from './business-head/fhi-data/fhi-data.component';
import { MkwDataComponent } from './business-head/mkw-data/mkw-data.component';
import { OrderBookComponent } from './business-head/order-book/order-book.component';
import { TrainingMaterialComponent } from './business-head/training-material/training-material.component';




const routes: Routes = [
  {
    path: 'customer',
    loadChildren: './customer/customer.module#CustomerModule',
    canLoad: [LoggedInGuard],
    //canActivate: [LoggedOutGuard]
  },
  
  {
    path: 'designer',
    loadChildren: './designer/designer.module#DesignerModule',
    canLoad: [LoggedInGuard],
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'category',
    loadChildren: './category/category/category.module#CategoryModule',
    canLoad: [LoggedInGuard],
  },
  {
    path: 'organisation',
    loadChildren: './organisation/organisation.module#OrganisationModule'
  },
  {
    path: 'project',
    loadChildren: './project/project.module#ProjectModule',
    canLoad: [LoggedInGuard]
  },
  {
    path:'profile',
    loadChildren: './profile/profile.module#ProfileModule',
    canLoad: [LoggedInGuard]
  },
  {
    path:'lead',
    loadChildren: './lead/lead.module#LeadModule'
  },
  {
    path: 'testimonial',
    loadChildren: './testimonial/testimonial.module#TestimonialModule'

  },
  {
    path: 'quotation',
    loadChildren: './quotation/quotation.module#QuotationModule'
  },
  {
    path: 'scheduler',
    loadChildren: './scheduler/scheduler.module#SchedulerModule'
  },
  {
    path: 'user-roles',
    loadChildren:'./user-roles/user-roles.module#UserRolesModule'
  },
  {
    path: 'priceconfigurator',
    loadChildren: './priceconfigurator/priceconfigurator.module#PriceconfiguratorModule',
    //canLoad: [LoggedInGuard]
  },
  {
    path: 'emicalculator',
    loadChildren: './emicalculator/emicalculator.module#EmicalculatorModule',
    canLoad: [LoggedInGuard]
  }, 
  {
    path: 'project/:projectid/modularproducts',
    loadChildren: './modularproductscatalogue/modularproductscatalogue.module#ModularproductscatalogueModule'
  },
  {
    path: 'presentation',
    loadChildren: './presentation/presentation.module#PresentationModule',
    canLoad: [LoggedInGuard]
  },
  {
    path: 'calendar',
    loadChildren: './calender/calender.module#CalenderModule',
    canLoad: [LoggedInGuard]
  },
  {
    path: 'finance',
    loadChildren: './finance/finance.module#FinanceModule',
    canLoad: [LoggedInGuard],
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'sitesupervisor',
    loadChildren: './sitesupervisor/sitesupervisor.module#SitesupervisorModule',
    canLoad: [LoggedInGuard],
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'cad',
    loadChildren: './cad/cad.module#CadModule',
    canLoad: [LoggedInGuard],
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'salesmanager',
    loadChildren: './salesmanager/salesmanager.module#SalesmanagerModule',
    canLoad: [LoggedInGuard],
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'business_head',
    loadChildren: './business-head/business-head.module#BusinessHeadModule',
    canLoad: [LoggedInGuard],
    //canActivate: [LoggedOutGuard]
  },
  {
    path: 'referral',
    loadChildren: './referral/referral.module#ReferralModule',
    canLoad: [LoggedInGuard],
  },
  {
    path: 'order_manager',
    loadChildren: './order-manager/order-manager.module#OrderManagerModule',
    canLoad: [LoggedInGuard],
  },
  {
    path: 'general-manager',
    loadChildren: './general-manager/general-manager.module#GeneralManagerModule',
    canLoad: [LoggedInGuard],
  },
  {
    path:'cm-variable-margins',
    component:CmVariableMarginsComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'change-boq-value',
    component:BoqMarginComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'aws-dashboard',
    component:AwsDashboardComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'mom-form',
    component:MomCreateFormComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'mom-edit',
    component:MomEditComponent,
    canActivate:[LoggedInGuard]
  },
  {

    path:'aws/fhi-data',
    component:FhiDataComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'aws/mkw-data',
    component:MkwDataComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'aws/order-book',
    component:OrderBookComponent,
    canActivate:[LoggedInGuard]
  },
  {

   path:'training-material',
   component:TrainingMaterialComponent,
   canActivate:[LoggedInGuard]
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [] 
})
export class PlatformRoutingModule { }
