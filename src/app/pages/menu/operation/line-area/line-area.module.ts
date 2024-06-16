import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineAreaRoutingModule } from './line-area-routing.module';
import { LineAreaComponent } from './line-area.component';

import { NgApexchartsModule,ChartComponent   } from "ng-apexcharts";
// Simplebar

import { SimplebarAngularModule } from 'simplebar-angular';
// Count To
import { CountUpModule } from 'ngx-countup';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Bootstrap Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { RatingModule } from 'ngx-bootstrap/rating';
@NgModule({
  declarations: [
    LineAreaComponent
  ],
  imports: [
    CommonModule,
    LineAreaRoutingModule,
    CommonModule,
    SimplebarAngularModule,
    CountUpModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    SimplebarAngularModule,
    TooltipModule.forRoot(),
    NgApexchartsModule,
    CountUpModule,
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot()
  ]
})
export class LineAreaModule { }
