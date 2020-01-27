import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { CreateComponent } from './project/create/create.component';
import { ViewComponent } from './project/view/view.component';
import {EditComponent } from './project/edit/edit.component'
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { ProjectmanagementComponent } from './projectmanagement/projectmanagement.component';
import { NgPipesModule } from 'ngx-pipes';
import { ProjectdetailsQuestionnaireComponent } from './projectdetails-questionnaire/projectdetails-questionnaire.component';
import { ViewprojectdetailsQuestionnaireComponent } from './viewprojectdetails-questionnaire/viewprojectdetails-questionnaire.component';
import { ShowQuestionnaireAnswersComponent } from './show-questionnaire-answers/show-questionnaire-answers.component';
import { PresentationModule } from '../presentation/presentation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ProjectRoutingModule,
    NgPipesModule,
    PresentationModule
  ],
  declarations: [CreateComponent,ViewComponent,EditComponent, ProjectmanagementComponent, ProjectdetailsQuestionnaireComponent, ViewprojectdetailsQuestionnaireComponent, ShowQuestionnaireAnswersComponent]
})
export class ProjectModule { }
