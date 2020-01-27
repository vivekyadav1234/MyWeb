import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';

import { CreateComponent } from './project/create/create.component';
import { ViewComponent } from './project/view/view.component';
import { EditComponent } from './project/edit/edit.component';
import { ProjectmanagementComponent } from './projectmanagement/projectmanagement.component';
import { ShowQuestionnaireAnswersComponent } from './show-questionnaire-answers/show-questionnaire-answers.component'
import { ProjectdetailsQuestionnaireComponent } from './projectdetails-questionnaire/projectdetails-questionnaire.component';
import { ViewprojectdetailsQuestionnaireComponent } from './viewprojectdetails-questionnaire/viewprojectdetails-questionnaire.component';
import { CreatepresentationComponent} from '../presentation/createpresentation/createpresentation.component';
import { ViewpresentationComponent} from '../presentation/viewpresentation/viewpresentation.component';
import { EditpresentationComponent} from '../presentation/editpresentation/editpresentation.component';


const routes: Routes = [

  // {
  //   path: 'create',
  //   canActivate: [LoggedInGuard],
  //   component: CreateComponent
  // },

  // {
  //   path: 'view/:id',
  //   canActivate: [LoggedInGuard],
  //   component: ViewComponent
  // },
  // {
  //   path: 'edit/:id',
  //   canActivate: [LoggedInGuard],
  //   component: EditComponent
  // }
  {
    path: 'projects/:projectId/projectdetailsquestionnaire',
    canActivate: [LoggedInGuard],
    component: ProjectdetailsQuestionnaireComponent
  },
  {
    path: 'projects/:projectId/showquestionnaireanswers',
    canActivate: [LoggedInGuard],
    component: ShowQuestionnaireAnswersComponent
  },
  {
    path: 'projects/:projectId/projectdetailsquestionnaire/view',
    canActivate: [LoggedInGuard],
    component: ViewprojectdetailsQuestionnaireComponent
  },
  {
    path: 'projects/:projectId/presentation/create',
    canActivate: [LoggedInGuard],
    component: CreatepresentationComponent
  },

  {
    path: 'projects/:projectId/presentation/:presentationId/edit',
    canActivate: [LoggedInGuard],
    component: EditpresentationComponent
  },

  {
    path: 'projects/:projectId/presentation/view',
    canActivate: [LoggedInGuard],
    component: ViewpresentationComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
