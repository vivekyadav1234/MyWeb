import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { ListleadComponent } from './listlead/listlead.component';
import { UpdateleadComponent } from './updatelead/updatelead.component';
import { DeleteleadComponent } from './deletelead/deletelead.component';
import { ViewleadComponent } from './viewlead/viewlead.component';
import { EscalatedLeadsComponent } from './escalated-leads/escalated-leads.component';
import { ViewlogsComponent } from '../activity-logs/viewlogs/viewlogs.component';
import { OverviewCountsComponent } from '../overview/overview-counts/overview-counts.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { DetailedInfoComponent } from './detailed-info/detailed-info.component';
import { FilesComponent } from './files/files.component';
import { BoqComponent } from './boq/boq.component';
import { PptComponent } from './ppt/ppt.component';
import { CalenderComponent } from './calender/calender.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { ViewProposalComponent } from './view-proposal/view-proposal.component';
import { ProposedDiscountComponent } from './proposed-discount/proposed-discount.component';
import { ProposedDiscountListComponent } from './proposed-discount-list/proposed-discount-list.component';
import { CustomElementComponent } from './custom-element/custom-element.component';
import { CustomViewComponent } from './custom-view/custom-view.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProposalApproveComponent } from './proposal-approve/proposal-approve.component';
import { EmailPdfViewerComponent } from './email-pdf-viewer/email-pdf-viewer.component';
import { SmsFloorplanFormUploadComponent } from './sms-floorplan-form-upload/sms-floorplan-form-upload.component';
import { HandoverForProductionComponent } from './handover-for-production/handover-for-production.component';

const routes: Routes = [

  {
      path: 'list',
      canActivate: [LoggedInGuard],
      component: ListleadComponent
   },
   {
    path:'delete/:id',
    canActivate: [LoggedInGuard],
    component: DeleteleadComponent
   },
   {
    path: 'edit/:id',
    canActivate: [LoggedInGuard],
    component: UpdateleadComponent
   },
    {
    path: 'view/:id',
    canActivate: [LoggedInGuard],
    component: ViewleadComponent
   },
   {
    path:'escalated-leads',
    canActivate : [LoggedInGuard],
    component: EscalatedLeadsComponent
  },
  {
    path: 'lead/:leadId/activity-logs',
    canActivate: [LoggedInGuard],
    component: ViewlogsComponent
  },
  {
    path: 'lead/:leadId/overview',
    canActivate: [LoggedInGuard],
    component: OverviewCountsComponent
  },
  {
    path: 'lead/:leadId/basic-info',
    canActivate: [LoggedInGuard],
    component: BasicInfoComponent
  },
  {
    path: 'lead/:leadId/detailed-info',
    canActivate: [LoggedInGuard],
    component: DetailedInfoComponent
  },
  {
    path: 'lead/:leadId/files',
    canActivate: [LoggedInGuard],
    component: FilesComponent
  },
  {
    path: 'lead/:leadId/boq',
    canActivate: [LoggedInGuard],
    component: BoqComponent
  },
  {
    path: 'lead/:leadId/ppt',
    canActivate: [LoggedInGuard],
    component: PptComponent
  },
  {
    path: 'lead/:leadId/calendar',
    canActivate: [LoggedInGuard],
    component: CalenderComponent
  }
  ,
  {
    path: 'lead/:leadId/proposals',
    canActivate: [LoggedInGuard],
    component: ProposalsComponent
  },
  {
    path: 'lead/:leadId/custom-element',
    canActivate: [LoggedInGuard],
    component: CustomElementComponent
  },
  {
    path: 'lead/:leadId/custom-view',
    canActivate: [LoggedInGuard],
    component: CustomViewComponent
  },

  {
    path: 'lead/:leadId/proposals/create-proposal',
    canActivate: [LoggedInGuard],
    component: CreateProposalComponent
  },
  {
    path: 'lead/:leadId/project/:projectId/proposals/:propId/view-proposal',
    canActivate: [LoggedInGuard],
    component: ViewProposalComponent
  },


   {
    path: 'lead/:leadId/proposed-discount',
    canActivate: [LoggedInGuard],
    component: ProposedDiscountComponent
  },

  {
    path: 'lead/:leadId/proposals/proposed-discount-list',
    canActivate: [LoggedInGuard],
    component: ProposedDiscountListComponent
  },
  {
    path: 'lead/:leadId/payments',
    canActivate: [LoggedInGuard],
    component: PaymentsComponent
  },
  {
    path: 'lead/:leadId/proposal-approve',
    canActivate: [LoggedInGuard],
    component: ProposalApproveComponent
  },
  {
    path: 'lead/pdf-viewer',
    // canActivate: [LoggedInGuard],
    component: EmailPdfViewerComponent
  },
  
  {
    path: 'lead/app-sms-floorplan',
    // canActivate: [LoggedInGuard],
    component: SmsFloorplanFormUploadComponent
  },
  {
    path: 'lead/:leadId/handover-for-production',
    canActivate: [LoggedInGuard],
    component: HandoverForProductionComponent
  }
  

  



  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }