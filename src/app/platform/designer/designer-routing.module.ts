import { NgModule } from '@angular/core';
import { Routes, Router,RouterModule } from '@angular/router';

import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import {DesignerGuardService} from '../../authentication/designer-guard.service';
import { ViewComponent } from '../project/project/view/view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewprofileComponent } from '../profile/profile/viewprofile/viewprofile.component';
import { EditprofileComponent } from '../profile/profile/editprofile/editprofile.component';
import { CreatefloorplandesignComponent } from './floorplan_design/createfloorplandesign/createfloorplandesign.component';
import { EditfloorplandesignComponent } from './floorplan_design/editfloorplandesign/editfloorplandesign.component';
import { ViewfloorplandesignComponent } from './floorplan_design/viewfloorplandesign/viewfloorplandesign.component';
import { ViewfloorplanComponent } from '../floorplans/floorplan/viewfloorplan/viewfloorplan.component';
import { LeadDetailsForDesignerComponent } from './lead-details-for-designer/lead-details-for-designer.component';
import { ActionableComponent } from './actionable/actionable.component';
import { DeadlinesComponent } from './deadlines/deadlines.component';
import { WipComponent } from './wip/wip.component';
import { ActionableListComponent } from './actionable-list/actionable-list.component';
import { DeadlinesListComponent } from './deadlines-list/deadlines-list.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { DesignerWipDashboardComponent } from './designer-wip-dashboard/designer-wip-dashboard.component';
import { DesignerTasksComponent } from './designer-tasks/designer-tasks.component';
import { ClientTasksComponent } from './client-tasks/client-tasks.component';
import { DesignerBoqComponent } from './designer-boq/designer-boq.component';



const routes: Routes = [
  {
      path: '',
      canActivate: [LoggedInGuard,DesignerGuardService],
      component: DashboardComponent
   },
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
    path: 'projects/view/:id',
    canActivate: [LoggedInGuard],
    component: ViewComponent
  },
  {
    path: 'projects/:id/floorplandesign/:fpid/create',
    canActivate: [LoggedInGuard],
    component: CreatefloorplandesignComponent
  },
   {
    path: 'projects/:id/floorplandesign/:fpid/view',
    canActivate: [LoggedInGuard],
    component: ViewfloorplandesignComponent
  },
  {
    path: 'projects/:id/floorplandesign/:fpid/edit/:desid',
    canActivate: [LoggedInGuard],
    component: EditfloorplandesignComponent
  },
  {
    path: 'projects/:id/floorplan/view/:fpid',
    component: ViewfloorplanComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/leads',
    component: LeadDetailsForDesignerComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/actionable',
    component: ActionableComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/actionable/list',
    component: ActionableListComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/deadlines',
    component: DeadlinesComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/deadlines/list',
    component: DeadlinesListComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/wip',
    component: WipComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/designer-wip-dashboard',
    component: DesignerWipDashboardComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'designer/questionnaire/:userId',
    component: QuestionnaireComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'tasks/task-list',
    component: DesignerTasksComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'tasks/project-tasks/projects/:projectId',
    component: ClientTasksComponent,
    canActivate: [LoggedInGuard]

  },
  {
    path: 'tasks/task-boq/quotation/:quoteId',
    component: DesignerBoqComponent,
    canActivate: [LoggedInGuard]

  }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[DesignerGuardService]
})
export class DesignerRoutingModule { }
