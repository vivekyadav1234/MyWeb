import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserOnboardComponent } from './user-onboard/user-onboard.component';
import { ViewUserOnboardComponent } from './user-onboard/view-user-onboard/view-user-onboard.component';
//import { CreateComponent } from './project/create/create.component';
//import { ViewComponent } from './project/view/view.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CustomerRoutingModule } from './customer-routing.module';
import { SharedModule }                from '../../shared/shared.module';
//import { CreatefloorplanComponent } from './floorplan/createfloorplan/createfloorplan.component';
//import { ViewfloorplanComponent } from './floorplan/viewfloorplan/viewfloorplan.component';
import { FileUploadModule } from "ng2-file-upload";

//import { EditComponent } from './project/edit/edit.component';

//import { EditfloorplanComponent } from './floorplan/editfloorplan/editfloorplan.component'; 
import { ProjectModule } from '../project/project.module';
import { FloorplansModule } from '../floorplans/floorplans.module'
import { ProfileModule } from '../profile/profile.module';
import  { PriceconfiguratorModule } from '../priceconfigurator/priceconfigurator.module';
import {AuthenticationModule} from '../../authentication/authentication.module';
import { HelpComponent } from './help/help.component';
import { ContactComponent } from './contact/contact.component';
import { TouComponent } from './tou/tou.component';
import { FaqComponent } from './faq/faq.component';
import { ArrivaeProductsComponent } from './arrivae-products/arrivae-products.component';
import { ProjectsComponent } from './projects/projects.component';
import { LogsComponent } from './logs/logs.component';
import { DiscountProposalComponent } from './discount-proposal/discount-proposal.component';
import { DesignerProposalComponent } from './designer-proposal/designer-proposal.component';
import { FilesComponent } from './files/files.component';
import { MeetComponent } from './meet/meet.component';
import { FinalDesignProposalComponent } from './final-design-proposal/final-design-proposal.component';
import { ScheduledCallsComponent } from './scheduled-calls/scheduled-calls.component';
import { ViewPresentationComponent } from './view-presentation/view-presentation.component';
import { ViewBoqComponent } from './view-boq/view-boq.component';
import { CusChangePasswordComponent } from './cus-change-password/cus-change-password.component';
import { CusViewProfileComponent } from './cus-view-profile/cus-view-profile.component';
import { SharedFilesComponent } from './shared-files/shared-files.component';
import { NextLine } from './dashboard/nextLine.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    SharedModule,
    FileUploadModule,
    ProjectModule,
    ProfileModule,
    FloorplansModule,
    AuthenticationModule,
    PriceconfiguratorModule


  ],
  declarations: [DashboardComponent,ViewUserOnboardComponent,UserOnboardComponent, HelpComponent, ContactComponent, TouComponent, FaqComponent, ArrivaeProductsComponent, ProjectsComponent, LogsComponent, DiscountProposalComponent, DesignerProposalComponent, FilesComponent, MeetComponent, FinalDesignProposalComponent, ScheduledCallsComponent, ViewPresentationComponent, ViewBoqComponent, CusChangePasswordComponent, CusViewProfileComponent, SharedFilesComponent,NextLine]
})
export class CustomerModule { }




