import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import {NgPipesModule} from 'ngx-pipes';
import {LeadRoutingModule} from './lead-routing.module';
import { ListleadComponent } from './listlead/listlead.component';
import { UpdateleadComponent } from './updatelead/updatelead.component';
import { DeleteleadComponent } from './deletelead/deletelead.component';
import { ViewleadComponent } from './viewlead/viewlead.component';
import { EscalatedLeadsComponent } from './escalated-leads/escalated-leads.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import {OverviewModule} from '../overview/overview.module';
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
import {NgxPaginationModule} from 'ngx-pagination';
import { RequirementSheetComponent } from './requirement-sheet/requirement-sheet.component';
import { ScopeDocumentComponent } from './scope-document/scope-document.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { CustomElementComponent } from './custom-element/custom-element.component';
import { CustomViewComponent } from './custom-view/custom-view.component';
import { PaymentsComponent } from './payments/payments.component';
import { CollapsibleModule } from 'angular2-collapsible'; 
import { FilesFloorplanComponent } from './files-floorplan/files-floorplan.component';
import { FilesSiteMeasurementComponent } from './files-site-measurement/files-site-measurement.component';
import { FilesCadComponent } from './files-cad/files-cad.component';
import { FilePptComponent } from './file-ppt/file-ppt.component';
import { FileBoqComponent } from './file-boq/file-boq.component';
import { SharedTopMenuComponent } from './shared-top-menu/shared-top-menu.component';
import { SmsCallComponent } from './sms-call/sms-call.component';
import { ProposalApproveComponent } from './proposal-approve/proposal-approve.component';
import { FilePdfComponent } from './file-pdf/file-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EmailPdfViewerComponent } from './email-pdf-viewer/email-pdf-viewer.component';
import { FileWarrantyComponent } from './file-warranty/file-warranty.component';
import { SmsFloorplanFormUploadComponent } from './sms-floorplan-form-upload/sms-floorplan-form-upload.component';
import { FilesElevationComponent } from './files-elevation/files-elevation.component';
import { FilesReferenceImageComponent } from './files-reference-image/files-reference-image.component';
import { FilesThreedImageComponent } from './files-threed-image/files-threed-image.component';
import { HandoverForProductionComponent } from './handover-for-production/handover-for-production.component';
import { DesignerquestionnaireComponent } from '../../shared/designerquestionnaire/designerquestionnaire.component';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    NgPipesModule,
    RouterModule,
    LeadRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ActivityLogsModule,
    OverviewModule,
    CollapsibleModule ,
    PdfViewerModule
  ],
  
  declarations: [ListleadComponent, UpdateleadComponent, DeleteleadComponent, ViewleadComponent, EscalatedLeadsComponent, BasicInfoComponent, DetailedInfoComponent, FilesComponent, BoqComponent, PptComponent, CalenderComponent, ProposalsComponent, CreateProposalComponent, ViewProposalComponent, ProposedDiscountComponent, ProposedDiscountListComponent, RequirementSheetComponent, ScopeDocumentComponent, BookingFormComponent, CustomElementComponent, CustomViewComponent, FilesFloorplanComponent, FilesSiteMeasurementComponent, FilesCadComponent, FilePptComponent, FileBoqComponent, PaymentsComponent, SharedTopMenuComponent , SmsCallComponent, ProposalApproveComponent, FilePdfComponent, EmailPdfViewerComponent, SmsFloorplanFormUploadComponent,FileWarrantyComponent, FilesElevationComponent, FilesReferenceImageComponent, FilesThreedImageComponent, HandoverForProductionComponent]
})
export class LeadModule { }
