 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesignerRoutingModule } from './designer-routing.module';
import { SharedModule }                from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
//import { EditprofileComponent } from './profile/editprofile/editprofile.component';
//import { ViewprofileComponent } from './profile/viewprofile/viewprofile.component';
import { CreatefloorplandesignComponent } from './floorplan_design/createfloorplandesign/createfloorplandesign.component';
import { EditfloorplandesignComponent } from './floorplan_design/editfloorplandesign/editfloorplandesign.component';
import { ViewfloorplandesignComponent } from './floorplan_design/viewfloorplandesign/viewfloorplandesign.component';
import { ProjectModule } from '../project/project.module';
import{ FloorplansModule} from '../floorplans/floorplans.module';
import {ProfileModule} from '../profile/profile.module';
import { Routes, RouterModule } from '@angular/router';
import {NgPipesModule} from 'ngx-pipes';
import { LeadDetailsForDesignerComponent } from './lead-details-for-designer/lead-details-for-designer.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ActionableComponent } from './actionable/actionable.component';
import { DeadlinesComponent } from './deadlines/deadlines.component';
import { WipComponent } from './wip/wip.component';
import { ActionableListComponent } from './actionable-list/actionable-list.component';
import { DeadlinesListComponent } from './deadlines-list/deadlines-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { DesignerWipDashboardComponent } from './designer-wip-dashboard/designer-wip-dashboard.component';
import { DesignerTasksComponent } from './designer-tasks/designer-tasks.component';
import { ClientTasksComponent } from './client-tasks/client-tasks.component';
import { DesignerBoqComponent } from './designer-boq/designer-boq.component';
import { OrderModule } from 'ngx-order-pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { InviteChampionsComponent } from '../../shared/invite-champions/invite-champions.component';

@NgModule({
  imports: [
    CommonModule,
    DesignerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ProjectModule,
    FloorplansModule,
    ProfileModule,
    RouterModule,
    NgPipesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    OrderModule,
    NgSelectModule
    


  ],
  declarations: [ DashboardComponent, CreatefloorplandesignComponent, 
  EditfloorplandesignComponent, ViewfloorplandesignComponent, 
  LeadDetailsForDesignerComponent, ActionableComponent, DeadlinesComponent,
   WipComponent, ActionableListComponent, DeadlinesListComponent, 
   QuestionnaireComponent, DesignerWipDashboardComponent, DesignerTasksComponent, 
   ClientTasksComponent, DesignerBoqComponent],
})
export class DesignerModule { }
