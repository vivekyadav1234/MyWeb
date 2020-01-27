 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {SitesupervisorRoutingModule} from './sitesupervisor-routing.module';
import {AuthenticationModule} from '../../authentication/authentication.module';
import { FileUploadModule } from "ng2-file-upload";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ListRequestComponent } from './list-request/list-request.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { ListProjectrequestComponent } from './list-projectrequest/list-projectrequest.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule, 
    FileUploadModule,
    AuthenticationModule,
    SitesupervisorRoutingModule
  ],
  declarations: [DashboardComponent, ListRequestComponent, ListProjectsComponent, ListProjectrequestComponent]
})
export class SitesupervisorModule { }
