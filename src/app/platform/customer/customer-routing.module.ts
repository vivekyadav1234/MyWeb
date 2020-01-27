import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import {CustomerGuardService} from '../../authentication/customer-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from '../project/project/create/create.component';
import { ViewComponent } from '../project/project/view/view.component';
import { EditComponent } from '../project/project/edit/edit.component';
import { CreatefloorplanComponent } from '../floorplans/floorplan/createfloorplan/createfloorplan.component';
import { ViewfloorplanComponent } from '../floorplans/floorplan/viewfloorplan/viewfloorplan.component';
import { ViewprofileComponent } from '../profile/profile/viewprofile/viewprofile.component';
import { EditprofileComponent } from '../profile/profile/editprofile/editprofile.component';
import { EditfloorplanComponent } from '../floorplans/floorplan/editfloorplan/editfloorplan.component';
import { ChangepasswordComponent } from '../../authentication/changepassword/changepassword.component';
import { UserOnboardComponent } from './user-onboard/user-onboard.component';
import { ViewUserOnboardComponent } from './user-onboard/view-user-onboard/view-user-onboard.component';
import {CreatepriceconfiguratorComponent} from '../priceconfigurator/createpriceconfigurator/createpriceconfigurator.component';
import { HelpComponent } from './help/help.component';
import { ContactComponent } from './contact/contact.component';
import { TouComponent } from './tou/tou.component';
import { FaqComponent } from './faq/faq.component';
import { ArrivaeProductsComponent } from './arrivae-products/arrivae-products.component';
import { ProjectsComponent } from './projects/projects.component';
import { LogsComponent } from './logs/logs.component';
import { DesignerProposalComponent } from './designer-proposal/designer-proposal.component';
import { DiscountProposalComponent } from './discount-proposal/discount-proposal.component';
import { FilesComponent } from './files/files.component';
import { MeetComponent } from './meet/meet.component';
import { ViewPresentationComponent } from './view-presentation/view-presentation.component';
import { ViewBoqComponent } from './view-boq/view-boq.component';
import { CusChangePasswordComponent } from './cus-change-password/cus-change-password.component';
import { CusViewProfileComponent } from './cus-view-profile/cus-view-profile.component';


const routes: Routes = [
  {
      path: '',
      canActivate: [LoggedInGuard,CustomerGuardService],
      component: DashboardComponent
   },
   
   {
     path: 'changepassword/:email',
     canActivate:[LoggedInGuard],
     component: ChangepasswordComponent
   },
  {
    path: 'projects/create',
    canActivate: [LoggedInGuard],
    component: CreateComponent
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
    path:':custId/logs',
    component: LogsComponent
  },
  {
    path:'projects/:custId/discount-proposal',
    component: DiscountProposalComponent

  },
  {
    path:'projects/:custId/files',
    component: FilesComponent

  },
  {
    path:'projects/:custId/meet-team',
    component: MeetComponent

  },

  {
    path:'projects/:custId/designer-proposal',
    component: DesignerProposalComponent

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
    path: 'customer/help',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: HelpComponent
  },
  {
    path: 'customer/contact',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: ContactComponent
  },
  {
    path: 'customer/terms-of-use',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: TouComponent
  },
  {
    path: 'customer/faq',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: FaqComponent
  },
  {
    path: 'customer/arrivae-products',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: ArrivaeProductsComponent
  },
  {
    path: 'customer/projects',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: ProjectsComponent
  },

  
  {
    path: 'customer/change-password/:email',
    canActivate: [LoggedInGuard, CustomerGuardService],
    component: CusChangePasswordComponent
  },
  {
    path: 'customer/view-profile/:custId',
    canActivate: [LoggedInGuard, CustomerGuardService],
    component: CusViewProfileComponent
  },
  {
    path: 'customer/projects/:projectId/presentation/:presentationId',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: ViewPresentationComponent
  },
  {
    path: 'customer/projects/:projectId/boq/:boqId/proposalDoc/:docId',
    canActivate: [LoggedInGuard,CustomerGuardService],
    component: ViewBoqComponent
  }
  
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CustomerGuardService]
})
export class CustomerRoutingModule { }
