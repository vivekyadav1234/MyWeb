import { NgModule } from '@angular/core';
import { Routes, Router,RouterModule } from '@angular/router';

import { LoggedInGuard } from '../../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../../authentication/logged-out-guard.service';
import { AuthService }    from '../../../authentication/auth.service';

import { ManagedataComponent } from './managedata/managedata.component';
//import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewprofileComponent } from '../../profile/profile/viewprofile/viewprofile.component';
import { EditprofileComponent } from '../../profile/profile/editprofile/editprofile.component';
import { ManageElementComponent } from './manage-element/manage-element.component';
import { ManageMappingComponent } from './manage-mapping/manage-mapping.component';
import { ProjectsComponent } from './projects/projects.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { ViewBoqComponent } from './view-boq/view-boq.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { VendorComponent } from './vendor/vendor.component';
import { ShopDrawingComponent } from './shop-drawing/shop-drawing.component';
import { SdBoqComponent } from './sd-boq/sd-boq.component';
import { SdDrawingsComponent } from './sd-drawings/sd-drawings.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { ProjectPoComponent } from './project-po/project-po.component';
import { OfficePoComponent } from './office-po/office-po.component';
import { MaintainancePoComponent } from './maintainance-po/maintainance-po.component';
import { OrdersComponent } from './purchase-order/orders/orders.component';
import { TasksComponent } from './tasks/tasks.component';
import { VendorProductComponent } from './vendor-product/vendor-product.component';
import { MasterLineItemComponent } from './master-line-item/master-line-item.component';
import { MasterVendorProductsComponent } from './master-vendor-products/master-vendor-products.component';

const routes: Routes = [
  {
      path: '',
      canActivate: [LoggedInGuard],
      component: ManagedataComponent
   },
   {
     path: 'manage_master_data',
     canActivate: [LoggedInGuard],
     component: ManagedataComponent
   },
   {
     path: 'manage_services',
     canActivate: [LoggedInGuard],
     component: ManageServicesComponent
   },
   {
     path: 'projects',
     canActivate: [LoggedInGuard],
     component: ProjectsComponent
   },
   {
     path: 'vendors',
     canActivate: [LoggedInGuard],
     component: VendorComponent
   },
   {
     path: 'master_vendor_products',
     canActivate: [LoggedInGuard],
     component: MasterVendorProductsComponent
   },
   {
     path: 'shop_drawing',
     canActivate: [LoggedInGuard],
     component: ShopDrawingComponent
   },
   {
     path: 'shop_drawing/projects/:project_id/boq-list',
     canActivate: [LoggedInGuard],
     component: SdBoqComponent
   },
   {
     path: 'shop_drawing/projects/:project_id/boq/:quotation_id/drawings',
     canActivate: [LoggedInGuard],
     component: SdDrawingsComponent
   },
   {
     path: 'projects/:projectId/list-boqs',
     canActivate: [LoggedInGuard],
     component: ViewCategoryComponent
   },
   {
     path: 'projects/:projectId/boq/:boqId',
     canActivate: [LoggedInGuard],
     component: ViewBoqComponent
   },
   {
     path: 'manage_master_element',
     canActivate: [LoggedInGuard],
     component: ManageElementComponent
   },
   {
     path: 'manage_mapping',
     canActivate: [LoggedInGuard],
     component: ManageMappingComponent
   },
   {
     path: 'purchase_order',
     canActivate: [LoggedInGuard],
     component: PurchaseOrdersComponent
   },
   {
     path: 'project-po',
     canActivate: [LoggedInGuard],
     component: ProjectPoComponent
   },
   {
     path: 'office-po',
     canActivate: [LoggedInGuard],
     component: OfficePoComponent
   },
   {
     path: 'maintenance-po',
     canActivate: [LoggedInGuard],
     component: MaintainancePoComponent
   },
   {
     path: 'quotations/:quotationId/purchase_orders',
     canActivate: [LoggedInGuard],
     component: OrdersComponent
   },
   {
     path:'tasks',
     canActivate:[LoggedInGuard],
     component: TasksComponent
   },
   {
    path: 'vendor-product',
    canActivate: [LoggedInGuard],
    component: VendorProductComponent
  },
  {
    path: 'master_line_item',
    canActivate: [LoggedInGuard],
    component: MasterLineItemComponent
  },
  //  {
  //   path: 'manage_master_data',
  //   component: ViewprofileComponent,
  //   canActivate: [LoggedInGuard,CategoryGuardService]
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
