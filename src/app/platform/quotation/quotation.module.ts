import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CreatequotationComponent } from './createquotation/createquotation.component';
import { ListquotationComponent } from './listquotation/listquotation.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule }  from '../../shared/shared.module';
import { QuotationRoutingModule } from './quotation-routing.module';
import {NgPipesModule} from 'ngx-pipes';
import { EditquotationComponent } from './editquotation/editquotation.component';
import { ViewquotationComponent } from './viewquotation/viewquotation.component';
import { ImportquotationComponent } from './importquotation/importquotation.component';
import { CreateLooseQuoteComponent } from './create-loose-quote/create-loose-quote.component';
import { CreateModularQuoteComponent } from './create-modular-quote/create-modular-quote.component';
import { ViewLooseQuoteComponent } from './view-loose-quote/view-loose-quote.component';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPaginationModule} from 'ngx-pagination';
import { GlobalvarpresetComponent } from './globalvarpreset/globalvarpreset.component';
import { CollapsibleModule } from 'angular2-collapsible';
import { MkwLayoutsComponent } from './mkw-layouts/mkw-layouts.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { UICarouselModule } from "ui-carousel";


@NgModule({
  imports: [
    CommonModule,
    QuotationRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgPipesModule,
    IonRangeSliderModule,
    NgxPaginationModule,
    CollapsibleModule,
    NgxImageZoomModule.forRoot(),
    Ng2CarouselamosModule,
    UICarouselModule
  ],
  declarations: [CreatequotationComponent, ListquotationComponent, EditquotationComponent, ViewquotationComponent, ImportquotationComponent, CreateLooseQuoteComponent, CreateModularQuoteComponent, ViewLooseQuoteComponent, GlobalvarpresetComponent, MkwLayoutsComponent],
  exports: [
    CreateLooseQuoteComponent,
    CreateModularQuoteComponent
  ]
})
export class QuotationModule { }
