import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { OrganisationGuardService } from '../../authentication/organisation-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent} from './catalogue/create/create.component';
import { ViewcatalogueComponent } from './catalogue/viewcatalogue/viewcatalogue.component';
import { ListcatalogueComponent } from './catalogue/listcatalogue/listcatalogue.component';
import { ListsectionComponent } from './catalogue/listsection/listsection.component';
import { CreatesectionComponent } from './catalogue/createsection/createsection.component';
import { ViewsectionComponent } from './catalogue/viewsection/viewsection.component';
import { CreateproductComponent } from './catalogue/createproduct/createproduct.component';
import { ViewproductComponent } from './catalogue/viewproduct/viewproduct.component';
import { ViewservicedetailsComponent } from './catalogue/viewservicedetails/viewservicedetails.component';
import { CreateComponent as CreateProjectComponent} from '../project/project/create/create.component';
import { ViewComponent } from '../project/project/view/view.component';
import { EditComponent } from '../project/project/edit/edit.component';
import { ProjectmanagementComponent } from '../project/projectmanagement/projectmanagement.component';
import { CreatefloorplanComponent } from '../floorplans/floorplan/createfloorplan/createfloorplan.component';
import { ViewfloorplanComponent } from '../floorplans/floorplan/viewfloorplan/viewfloorplan.component';
import { ViewprofileComponent } from '../profile/profile/viewprofile/viewprofile.component';
import { EditprofileComponent } from '../profile/profile/editprofile/editprofile.component';
import { EditfloorplanComponent } from '../floorplans/floorplan/editfloorplan/editfloorplan.component';
import { DesignheadComponent } from './designhead/designhead.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ListportfoliodataComponent } from './portfolio/listportfoliodata/listportfoliodata.component';
import { EditportfolioComponent } from './portfolio/editportfolio/editportfolio.component';
import { ListDesignerportfolioComponent } from './designer_portfolio/list-designerportfolio/list-designerportfolio.component';
import { CreateDesignerportfolioComponent } from './designer_portfolio/create-designerportfolio/create-designerportfolio.component';
import { ViewDesignerportfolioComponent } from './designer_portfolio/view-designerportfolio/view-designerportfolio.component';
import { GetacallbackContactDetailsComponent } from './getacallback-contact-details/getacallback-contact-details.component';
import { CsagentdashboardComponent } from './csagentdashboard/csagentdashboard.component';
import { CmDashboardComponent } from './cm-dashboard/cm-dashboard.component';
import { CmLeadsListComponent } from './cm-dashboard/cm-leads-list/cm-leads-list.component';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component';
import { BrokerMgmtComponent } from './broker-mgmt/broker-mgmt.component';
import { ListbrokersComponent } from './broker-mgmt/listbrokers/listbrokers.component';
import { ListDesignerComponent } from './cm-dashboard/list-designer/list-designer.component';
import { ProjectListDesignerComponent } from './cm-dashboard/project-list-designer/project-list-designer.component';
import { DesignerMgmtComponent } from './designer-mgmt/designer-mgmt.component';
import { BrokerLeadmgmtComponent } from './broker-dashboard/broker-leadmgmt/broker-leadmgmt.component';
import { CsagentStatuslistComponent } from './csagent-statuslist/csagent-statuslist.component';
import { ListcampaignComponent } from './leadcampaign/listcampaign/listcampaign.component';
import { LeadsPriorityComponent } from './leadcampaign/leads-priority/leads-priority.component';
import { ListLeadOfLeadheadComponent } from './lead-head/list-lead-of-leadhead/list-lead-of-leadhead.component';
import { CmWipComponent } from './cm-wip/cm-wip.component';
import { CmActionableComponent } from './cm-actionable/cm-actionable.component';
import { CmActionableListComponent } from './cm-actionable-list/cm-actionable-list.component';
import { CmDeadlinesComponent } from './cm-deadlines/cm-deadlines.component';
import { SitesupervisorMgmtComponent } from './sitesupervisor-mgmt/sitesupervisor-mgmt.component';
import { CmSiteRequestComponent } from './cm-site-request/cm-site-request.component';
import { CmPaymentComponent } from './cm-payment/cm-payment.component';
import { CmDesignerListComponent } from './cm-designer-list/cm-designer-list.component';
import { ViewCatalogueComponent } from './catalogue/view-catalogue/view-catalogue.component';
import { UploadComponent } from './user-mapping/upload/upload.component';
import { CmMappingComponent } from './cm-mapping/cm-mapping.component';
import { MediaEngagementComponent } from './media-engagement/media-engagement.component';
import { CmWipDashboardComponent } from './cm-dashboard/cm-wip-dashboard/cm-wip-dashboard.component';
import { CmDataMigrationComponent } from './cm-data-migration/cm-data-migration.component';
import { LeadPriorityDisplayComponent } from './lead-head/lead-priority-display/lead-priority-display.component';
import { LeadMetricComponent } from './metrics/lead-metric/lead-metric.component';
import { MkwbusinessheadMetricComponent } from './metrics/mkwbusinesshead-metric/mkwbusinesshead-metric.component';
import { CmDesMetricComponent } from './metrics/cm-des-metric/cm-des-metric.component';
import { CommunityMetricComponent } from './metrics/community-metric/community-metric.component';
import { SalesManagerMappingComponent } from './sales-manager-mapping/sales-manager-mapping.component';
import { NewViewCatalogueComponent } from './catalogue/new-view-catalogue/new-view-catalogue.component';
import { NewViewCatalogueDetailsComponent } from './catalogue/new-view-catalogue-details/new-view-catalogue-details.component';
import { SegmentCatalogueComponent } from './catalogue/segment-catalogue/segment-catalogue.component';
import { CmstatuslistComponent } from './cmstatuslist/cmstatuslist.component';
 
const routes: Routes = [
  {
      path: '',
      canActivate: [LoggedInGuard, OrganisationGuardService],
      component: DashboardComponent
   },
  {
    path: 'designhead',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: DesignheadComponent
  },
  {
    path: 'tagging/cm-mapping',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmMappingComponent
  },
  {
    path: 'lead_campaigns/list',
    canActivate: [LoggedInGuard],
    component: ListcampaignComponent
  },
  {
    path: 'user-mapping/upload',
    canActivate: [LoggedInGuard],
    component: UploadComponent
  },
  {
    path: 'lead_priorities/list',
    canActivate: [LoggedInGuard],
    component: LeadsPriorityComponent
  },
  {
    path: 'csagent',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CsagentdashboardComponent
  },
  {
    path: 'community_manager',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmDashboardComponent
  },
  {
    path: 'list-designer',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: ListDesignerComponent
  },

  {
    path: 'community_manager/wip',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmWipDashboardComponent
  },
  {
    path: 'community_manager/wip/leads',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmWipComponent
  },
  {
    path: 'community_manager/designer-list',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmDesignerListComponent
  },

  {
    path: 'community_manager/deadlines',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmDeadlinesComponent
  },

  {
    path: 'community_manager/actionable',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmActionableComponent
  },

  {
    path: 'community_manager/actionable/list',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmActionableListComponent
  },
  {
    path: 'community_manager/site-request',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmSiteRequestComponent
  },
  {
    path: 'community_manager/payments',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmPaymentComponent
  },

  {
    path: 'project-list-of_designer/:designerid',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: ProjectListDesignerComponent
  },
  {
    path: 'community_manager/leads',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: CmLeadsListComponent
  },
  {
    path: 'leads',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: ListLeadOfLeadheadComponent
  },
  {
    path: 'broker',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: BrokerDashboardComponent
  },
  {
    path: 'broker/leads',
    canActivate: [LoggedInGuard, OrganisationGuardService],
    component: BrokerLeadmgmtComponent
  },
  {
    path: 'brokermanagement',
    canActivate: [LoggedInGuard],
    component: BrokerMgmtComponent
  },
  {
    path:'designermanagement',
    canActivate: [LoggedInGuard],
    component: DesignerMgmtComponent
  },
  {
    path:'sitesupervisor-management',
    canActivate: [LoggedInGuard],
    component: SitesupervisorMgmtComponent
  },
  {
    path: 'portfolio/create',
    canActivate: [LoggedInGuard],
    component: PortfolioComponent
  },
  {
    path: 'brokers/list',
    canActivate: [LoggedInGuard],
    component: ListbrokersComponent
  },
  {
    path: 'portfolio',
    canActivate: [LoggedInGuard],
    component: ListportfoliodataComponent
  },
  {
    path: 'designer-portfolios/list',
    canActivate: [LoggedInGuard],
    component: ListDesignerportfolioComponent
  },
  {
    path: 'designer-portfolios/addportfolio',
    canActivate: [LoggedInGuard],
    component: CreateDesignerportfolioComponent
  },
  {  
    path: 'designer-portfolios/viewportfolio/:portfolioid',
    canActivate: [LoggedInGuard],
    component: ViewDesignerportfolioComponent
  },
  {
    path: 'portfolio/edit/:id',
    canActivate: [LoggedInGuard],
    component: EditportfolioComponent
  },
  {
    path: 'catalogue/sections',
    canActivate: [LoggedInGuard],
    component: ListcatalogueComponent
  },
  {
    path: 'catalogue/section/:id/subsections',
    canActivate: [LoggedInGuard],
    component: CreatesectionComponent
  },
  {
    path: 'catalogue/section/:secid/subsection/:id/product',
    canActivate: [LoggedInGuard],
    component: CreateproductComponent
  },
  {
    path: 'catalogue/section/:secid/subsection/:subsectionid/product/:id',
    canActivate: [LoggedInGuard],
    component: ViewproductComponent
  },
  {
    path: 'catalogue/section/:secid/subsection/:subsectionid/service/:id',
    canActivate: [LoggedInGuard],
    component: ViewservicedetailsComponent
  },
  {
    path: 'projects/create',
    canActivate: [LoggedInGuard],
    component: CreateComponent
  },

  {
    path: 'projects/assigndesigner',
    canActivate: [LoggedInGuard,OrganisationGuardService],
    component: ProjectmanagementComponent
  },
  {
    path: 'projects/view/:id',
    canActivate: [LoggedInGuard],
    component: ViewComponent
  },
  {
    path: 'projects/edit/:id',
    canActivate: [LoggedInGuard],
    component: EditComponent
  },
  {
    path: 'projects/:id/floorplan/view/:fpid',
    component: ViewfloorplanComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'projects/:id/floorplan/create',
    component: CreatefloorplanComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'projects/:id/floorplan/edit/:fpid',
    component: EditfloorplanComponent,
    canActivate: [LoggedInGuard]
  }
  ,
  {
    path: 'profile/view/:id',
    component: ViewprofileComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'profile/edit/:id',
    component: EditprofileComponent,
    canActivate: [LoggedInGuard]
  }, 
  {
    path: 'contactleads',
    component: GetacallbackContactDetailsComponent,
    canActivate: [LoggedInGuard,OrganisationGuardService]
  },
  {
    path: 'csagent_list',
    component: CsagentStatuslistComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path: 'cm_list',
    component: CmstatuslistComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'catalogue',
    component:NewViewCatalogueComponent,
    canActivate:[LoggedInGuard]
  },

  {
    path:'catalogue/filter/:catalogue_type/:id',
    component:SegmentCatalogueComponent,
    canActivate:[LoggedInGuard]
  },

  {
    path:'catalogue/product/:id',
    component:NewViewCatalogueDetailsComponent,
    canActivate:[LoggedInGuard]
  },

  {
    path:'mediaengagement/list',
    component:MediaEngagementComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'cm-data-migration',
    component: CmDataMigrationComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'lead-priority-list',
    component: LeadPriorityDisplayComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'lead-metrics',
    component:LeadMetricComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'community-metrics',
    component:CommunityMetricComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'mkw-businesshead-metrics',
    component:MkwbusinessheadMetricComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'cm-and-designer-metrics',
    component:CmDesMetricComponent,
    canActivate:[LoggedInGuard]
  },
  {
    path:'sales-mapping',
    component:SalesManagerMappingComponent,
    canActivate:[LoggedInGuard]
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[OrganisationGuardService]
})
export class OrganisationRoutingModule { }
