import { NgModule }            from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule,
         ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { InputFieldComponent } from './input-field.component';
import { ErrorLabelComponent } from './error-label.component';
import { AuthLinksComponent } from '../authentication/auth-links.component';

import { ErrorMessagesPipe }   from './error-messages.pipe';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { PagenotfoundRoutingModule } from './pagenotfound/pagenotfound-routing.module';
import { SidenavigationComponent } from './sidenavigation/sidenavigation.component';
import { ReplaceChar } from './customizefilters.pipe';
import { CategoryPipe } from './category.pipe';
import {DisableControlDirective } from './disableInput.directive';
//import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { ImportPipe } from './import.pipe';
import {NgPipesModule} from 'ngx-pipes';
import { SafePipePipe } from './safe-pipe.pipe';
import { GanttChartModule } from './gantt-chart/gantt-chart.module';
import { SortPipe } from './sort.pipe';
import { SortDatewisePipe } from './sort-datewise.pipe';
import { OwnThisLookComponent } from './own-this-look/own-this-look.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CustomerFooterComponent } from './customer-footer/customer-footer.component';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';
import { LeadquestionnaireComponent } from './leadquestionnaire/leadquestionnaire.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { InviteChampionsComponent } from './invite-champions/invite-champions.component';
import { DesignerquestionnaireComponent } from './designerquestionnaire/designerquestionnaire.component';
import { PassFailPipe } from './passFail.pipe';
import { TaxTypePipe } from './taxType.pipe';
import { NgSelectModule } from '../../../node_modules/@ng-select/ng-select';

@NgModule({
    declarations: [
      InputFieldComponent,
      ErrorLabelComponent,
      ErrorMessagesPipe,
      HeaderComponent,
      FooterComponent,
      AuthLinksComponent,
      SidenavigationComponent,
      ReplaceChar,
      DisableControlDirective,
      SidenavbarComponent,
      ImportPipe,
      CategoryPipe,
      SafePipePipe,
      SortPipe,
      SortDatewisePipe,
      SortDatewisePipe,
      OwnThisLookComponent,
      CustomerFooterComponent,
      CustomerHeaderComponent,
      LeadquestionnaireComponent,
      DynamicFormComponent,
      InviteChampionsComponent,
      DesignerquestionnaireComponent,
      PassFailPipe,      
      TaxTypePipe
      

    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      NgPipesModule,
      GanttChartModule,
      ColorPickerModule,
      OwlDateTimeModule,
      OwlNativeDateTimeModule,
      NgSelectModule
    ],
    exports: [
      InputFieldComponent,
      ErrorLabelComponent,
      HeaderComponent,
      CustomerHeaderComponent,
      FooterComponent,
      CustomerFooterComponent,
      SidenavigationComponent,
      SidenavbarComponent,
      ReplaceChar,
      CategoryPipe,
      SortPipe,
      SortDatewisePipe,
      SafePipePipe,
      DisableControlDirective,
      GanttChartModule,
      ColorPickerModule,
      OwnThisLookComponent,
      LeadquestionnaireComponent,
      DynamicFormComponent,
      InviteChampionsComponent,
      DesignerquestionnaireComponent,
      PassFailPipe,
      TaxTypePipe
      
    ]
})
export class SharedModule {}
