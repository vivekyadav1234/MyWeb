import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagedataComponent } from './managedata/managedata.component';
import {CategoryRoutingModule} from './category-routing.module';
import { Routes, RouterModule } from '@angular/router';
import {NgPipesModule} from 'ngx-pipes';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ManageElementComponent } from './manage-element/manage-element.component';
import { ManageMappingComponent } from './manage-mapping/manage-mapping.component';
import { ProjectsComponent } from './projects/projects.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { ViewBoqComponent } from './view-boq/view-boq.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { CategoryFloorplanComponent } from './category-floorplan/category-floorplan.component';
import { CategoryCadElevationComponent } from './category-cad-elevation/category-cad-elevation.component';
import { VendorComponent } from './vendor/vendor.component';
import { CollapsibleModule } from 'angular2-collapsible';
import { ShopDrawingComponent } from './shop-drawing/shop-drawing.component';
import { SdBoqComponent } from './sd-boq/sd-boq.component';
import { SdDrawingsComponent } from './sd-drawings/sd-drawings.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryProposalsComponent } from './category-proposals/category-proposals.component';
import { CategoryBoqComponent } from './category-boq/category-boq.component';
import { CategoryPptComponent } from './category-ppt/category-ppt.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { OrdersComponent } from './purchase-order/orders/orders.component';
import { TasksComponent } from './tasks/tasks.component';
import { InitialBoqsComponent } from './initial-boqs/initial-boqs.component';
import { FinalBoqApprovalsComponent } from './final-boq-approvals/final-boq-approvals.component';
import { PreProductionComponent } from './pre-production/pre-production.component';
import { CustomElementApprovalsComponent } from './custom-element-approvals/custom-element-approvals.component';
import { CadApprovalsComponent } from './cad-approvals/cad-approvals.component';
import { VendorSelectionComponent } from './vendor-selection/vendor-selection.component';
import { PoReleaseComponent } from './po-release/po-release.component';
import { PiUploadComponent } from './pi-upload/pi-upload.component';
import { PaymentsReleaseComponent } from './payments-release/payments-release.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { VendorProductComponent } from './vendor-product/vendor-product.component';
import { MasterLineItemComponent } from './master-line-item/master-line-item.component';
import { MasterVendorProductsComponent } from './master-vendor-products/master-vendor-products.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SliCreationComponent } from './sli-creation/sli-creation.component';
import { MaterialTrackingComponent } from './material-tracking/material-tracking.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { WipOrdersComponent } from './wip-orders/wip-orders.component';
import { ReleasedOrderComponent } from './released-order/released-order.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ProjectPoComponent } from './project-po/project-po.component';
import { WipOrdersOfiiceMaintainanceComponent } from './wip-orders-ofiice-maintainance/wip-orders-ofiice-maintainance.component';
import { ReleaseOrderOfficeMaintainanceComponent } from './release-order-office-maintainance/release-order-office-maintainance.component';
import { OfficePoComponent } from './office-po/office-po.component';
import { MaintainancePoComponent } from './maintainance-po/maintainance-po.component';
import { HandoverForProductionComponent } from './handover-for-production/handover-for-production.component';
import { AcceptanceComponent } from './acceptance/acceptance.component';
import { SplitComponent } from './split/split.component';
import { AssignFilesCategoryComponent } from './assign-files-category/assign-files-category.component';
import { CuttingListBomComponent } from './cutting-list-bom/cutting-list-bom.component';

@NgModule({
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgPipesModule,
    AngularMultiSelectModule,
    CollapsibleModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PdfViewerModule,
    NgSelectModule
  ],
  declarations: [ManagedataComponent, 
    ManageElementComponent, 
    ManageMappingComponent, 
    ProjectsComponent, 
    ViewCategoryComponent, 
    ViewBoqComponent, 
    ManageServicesComponent, 
    CategoryFloorplanComponent, 
    CategoryCadElevationComponent, 
    VendorComponent, 
    ShopDrawingComponent, 
    SdBoqComponent, 
    SdDrawingsComponent, 
    CategoryBoqComponent, 
    CategoryPptComponent,
    CategoryProposalsComponent,
    PurchaseOrderComponent, 
    OrdersComponent,
    TasksComponent, 
    InitialBoqsComponent, 
    FinalBoqApprovalsComponent, 
    PreProductionComponent, 
    CustomElementApprovalsComponent, 
    CadApprovalsComponent, 
    VendorSelectionComponent, 
    PoReleaseComponent, 
    PiUploadComponent, 
    PaymentsReleaseComponent,
    VendorProductComponent,
    MasterLineItemComponent,
    MaterialTrackingComponent,
    MasterVendorProductsComponent,
    SliCreationComponent,
    MasterVendorProductsComponent,
    PurchaseOrdersComponent,
    WipOrdersComponent,
    ReleasedOrderComponent,
    InventoryComponent,
    ProjectPoComponent,
    WipOrdersOfiiceMaintainanceComponent,
    ReleaseOrderOfficeMaintainanceComponent,
    OfficePoComponent,
    MaintainancePoComponent, 
    MasterVendorProductsComponent,
    HandoverForProductionComponent,
    AcceptanceComponent,
    SplitComponent,
    AssignFilesCategoryComponent,
    CuttingListBomComponent
  ]
})
export class CategoryModule { }
