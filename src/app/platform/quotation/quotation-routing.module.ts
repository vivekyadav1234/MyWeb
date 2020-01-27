import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '../../authentication/logged-in-guard.service';
import { LoggedOutGuard } from '../../authentication/logged-out-guard.service';
import { AuthService }    from '../../authentication/auth.service';
import { CreatequotationComponent } from './createquotation/createquotation.component';
import { ListquotationComponent } from './listquotation/listquotation.component';
import { EditquotationComponent } from './editquotation/editquotation.component';
import { ViewquotationComponent } from './viewquotation/viewquotation.component';
import { ImportquotationComponent } from './importquotation/importquotation.component';
import { CreateModularQuoteComponent } from './create-modular-quote/create-modular-quote.component';
import { CreateLooseQuoteComponent } from './create-loose-quote/create-loose-quote.component';
import { ViewLooseQuoteComponent } from './view-loose-quote/view-loose-quote.component';
import { GlobalvarpresetComponent } from './globalvarpreset/globalvarpreset.component';
import { MkwLayoutsComponent } from './mkw-layouts/mkw-layouts.component';

const routes: Routes = [
  	{
	    path: 'project/:project_id/boq/create',
	    canActivate: [LoggedInGuard],
	    component: CreatequotationComponent
 	 },
 	 {
	    path: 'lead/:lead_id/project/:project_id/boq_modular/create',
	    canActivate: [LoggedInGuard],
	    // component: CreatequotationComponent
	    component:CreateModularQuoteComponent
 	 },
 	 {
 	 	path: 'lead/:lead_id/project/:project_id/boq/import_boq_create',
	    canActivate: [LoggedInGuard],
	    component: ImportquotationComponent
 	 }, 
 	 {
	    path: 'project/:project_id/list_of_boqs',
	    canActivate: [LoggedInGuard],
	    component: ListquotationComponent
 	 },
 	 {
 	 	path: 'project/:project_id/boq/:boqid/edit',
 	 	canActivate: [LoggedInGuard],
	    component: EditquotationComponent
 	 } ,
 	 {
 	 	path: 'project/:project_id/boq/:boqid',
 	 	canActivate: [LoggedInGuard],
	    component: ViewquotationComponent
 	 },
 	 {
 	 	path: 'lead/:lead_id/project/:project_id/boq_modular/:boqid',
 	 	canActivate: [LoggedInGuard],
	  component: ViewLooseQuoteComponent
 	 } ,
 	 {
 	 	 path:'set_global_variable_preset',
 	 	 canActivate:[LoggedInGuard],
 	 	 component: GlobalvarpresetComponent
 	 },
 	 {
 	 		path:'mkw_layouts/list',
 	 		canActivate:[LoggedInGuard],
 	 		component: MkwLayoutsComponent
 	 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }