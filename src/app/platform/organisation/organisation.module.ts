import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule }  from '../../shared/shared.module';
import { NgPipesModule } from 'ngx-pipes';
//import {}
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from './catalogue/create/create.component';
import { OrganisationRoutingModule } from './organisation-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewcatalogueComponent } from './catalogue/viewcatalogue/viewcatalogue.component';
import { ListcatalogueComponent } from './catalogue/listcatalogue/listcatalogue.component';
import { ListsectionComponent } from './catalogue/listsection/listsection.component';
import { CreatesectionComponent } from './catalogue/createsection/createsection.component';
import { ViewsectionComponent } from './catalogue/viewsection/viewsection.component';
import { CreateproductComponent } from './catalogue/createproduct/createproduct.component';
import { ViewproductComponent } from './catalogue/viewproduct/viewproduct.component';
import { ProjectModule } from '../project/project.module';
import { FloorplansModule } from '../floorplans/floorplans.module'
import {ProfileModule} from '../profile/profile.module';
import { EditsectionComponent } from './catalogue/editsection/editsection.component';
import { DesignheadComponent } from './designhead/designhead.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ListportfoliodataComponent } from './portfolio/listportfoliodata/listportfoliodata.component';
import { EditportfolioComponent } from './portfolio/editportfolio/editportfolio.component';
import { GetacallbackContactDetailsComponent } from './getacallback-contact-details/getacallback-contact-details.component';
import { ViewservicedetailsComponent } from './catalogue/viewservicedetails/viewservicedetails.component';
import { ListDesignerportfolioComponent } from './designer_portfolio/list-designerportfolio/list-designerportfolio.component';
import { CreateDesignerportfolioComponent } from './designer_portfolio/create-designerportfolio/create-designerportfolio.component';
import { ViewDesignerportfolioComponent } from './designer_portfolio/view-designerportfolio/view-designerportfolio.component';
import { CsagentdashboardComponent } from './csagentdashboard/csagentdashboard.component';
import { CmDashboardComponent } from './cm-dashboard/cm-dashboard.component';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';
import { BrokerMgmtComponent } from './broker-mgmt/broker-mgmt.component';
import { ListbrokersComponent } from './broker-mgmt/listbrokers/listbrokers.component';
import { ListDesignerComponent } from './cm-dashboard/list-designer/list-designer.component';
import { ProjectListDesignerComponent } from './cm-dashboard/project-list-designer/project-list-designer.component';
import { CmLeadsListComponent } from './cm-dashboard/cm-leads-list/cm-leads-list.component';
import { DesignerMgmtComponent } from './designer-mgmt/designer-mgmt.component';
import { BrokerLeadmgmtComponent } from './broker-dashboard/broker-leadmgmt/broker-leadmgmt.component';
import { CsagentStatuslistComponent } from './csagent-statuslist/csagent-statuslist.component';
import { ListcampaignComponent } from './leadcampaign/listcampaign/listcampaign.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LeadsPriorityComponent } from './leadcampaign/leads-priority/leads-priority.component';
import { ListLeadOfLeadheadComponent } from './lead-head/list-lead-of-leadhead/list-lead-of-leadhead.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { CmWipComponent } from './cm-wip/cm-wip.component';
import { CmActionableComponent } from './cm-actionable/cm-actionable.component';
import { CmActionableListComponent } from './cm-actionable-list/cm-actionable-list.component';
import {DataTableModule} from "angular2-datatable";
import { CmDeadlinesComponent } from './cm-deadlines/cm-deadlines.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { SitesupervisorMgmtComponent } from './sitesupervisor-mgmt/sitesupervisor-mgmt.component';
import { CmSiteRequestComponent } from './cm-site-request/cm-site-request.component';
import { CmPaymentComponent } from './cm-payment/cm-payment.component';
import { CollapsibleModule } from 'angular2-collapsible';
import { CmDesignerListComponent } from './cm-designer-list/cm-designer-list.component';
import { CmMappingComponent } from './cm-mapping/cm-mapping.component';
import { ViewCatalogueComponent } from './catalogue/view-catalogue/view-catalogue.component';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { UploadComponent } from './user-mapping/upload/upload.component';
import { CmWipDashboardComponent } from './cm-dashboard/cm-wip-dashboard/cm-wip-dashboard.component';
import { MediaEngagementComponent } from './media-engagement/media-engagement.component';
import { CmDataMigrationComponent } from './cm-data-migration/cm-data-migration.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeadPriorityDisplayComponent } from './lead-head/lead-priority-display/lead-priority-display.component';
import { LeadMetricComponent } from './metrics/lead-metric/lead-metric.component';
import { MkwbusinessheadMetricComponent } from './metrics/mkwbusinesshead-metric/mkwbusinesshead-metric.component';
import { CmDesMetricComponent } from './metrics/cm-des-metric/cm-des-metric.component';
import { CommunityMetricComponent } from './metrics/community-metric/community-metric.component';
import { SalesManagerMappingComponent } from './sales-manager-mapping/sales-manager-mapping.component';
import { underScorePipe } from './underScore.pipe';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { UICarouselModule } from "ui-carousel";
import { NewViewCatalogueComponent } from './catalogue/new-view-catalogue/new-view-catalogue.component';
import { NewViewCatalogueDetailsComponent } from './catalogue/new-view-catalogue-details/new-view-catalogue-details.component';
import { SegmentCatalogueComponent } from './catalogue/segment-catalogue/segment-catalogue.component';
 
import { CmstatuslistComponent } from './cmstatuslist/cmstatuslist.component';
 
import { SortDateTimewisePipe } from './sort-date-timewise.pipe';
 


@NgModule({
  imports: [
 
    CommonModule,
    OrganisationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectModule,
    ProfileModule,
    FloorplansModule,
    SharedModule,
    NgPipesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularMultiSelectModule,
    DataTableModule,
    NgxPaginationModule,
    CollapsibleModule,
    IonRangeSliderModule,
    NgSelectModule,
    NgxImageZoomModule.forRoot(),
    Ng2CarouselamosModule,
    UICarouselModule,
    NgSelectModule
  ],


  declarations: [DashboardComponent, 
  CreateComponent, ViewcatalogueComponent, 
  ListcatalogueComponent, ListsectionComponent, 
  CreatesectionComponent, ViewsectionComponent,
   CreateproductComponent, ViewproductComponent, 
   EditsectionComponent, DesignheadComponent, PortfolioComponent,
    ListportfoliodataComponent, EditportfolioComponent,
     GetacallbackContactDetailsComponent, ViewservicedetailsComponent,
      ListDesignerportfolioComponent, CreateDesignerportfolioComponent, 
      ViewDesignerportfolioComponent, CsagentdashboardComponent, 
      CmDashboardComponent, BrokerDashboardComponent, BrokerMgmtComponent, 
      ListbrokersComponent, ListDesignerComponent, ProjectListDesignerComponent, 
      CmLeadsListComponent, DesignerMgmtComponent, BrokerLeadmgmtComponent, 
      CsagentStatuslistComponent, ListcampaignComponent, LeadsPriorityComponent, 
      ListLeadOfLeadheadComponent, CmWipComponent, CmActionableComponent, 
      CmActionableListComponent, CmDeadlinesComponent, SitesupervisorMgmtComponent,
       CmSiteRequestComponent, CmDesignerListComponent,CmPaymentComponent, 
 
       CmMappingComponent,UploadComponent,ViewCatalogueComponent,CmWipDashboardComponent, MediaEngagementComponent,CmDataMigrationComponent, LeadPriorityDisplayComponent, LeadMetricComponent, MkwbusinessheadMetricComponent, CmDesMetricComponent, CommunityMetricComponent, SalesManagerMappingComponent , underScorePipe, NewViewCatalogueComponent, NewViewCatalogueDetailsComponent, SegmentCatalogueComponent, CmstatuslistComponent,SortDateTimewisePipe]
 

})
export class OrganisationModule { }