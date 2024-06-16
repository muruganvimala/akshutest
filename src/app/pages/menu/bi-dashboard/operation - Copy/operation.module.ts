import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from "ng-apexcharts";
import { OperationRoutingModule } from './operation-routing.module';
import { OperationComponent } from './Operation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Simplebar

import { SimplebarAngularModule } from 'simplebar-angular';
// Count To
import { CountUpModule } from 'ngx-countup';

import { NgxSpinnerModule } from "ngx-spinner";

// Color Picker
import { ColorPickerModule } from 'ngx-color-picker';
import { PopoverModule } from 'ngx-bootstrap/popover';

// Apex Chart Package

import { NgxEchartsModule } from 'ngx-echarts';
import { NgxSliderModule } from 'ngx-slider-v2';
import * as echarts from 'echarts';


import { TabsModule } from 'ngx-bootstrap/tabs';


// Bootstrap Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { RatingModule } from 'ngx-bootstrap/rating';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    OperationComponent
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    CountUpModule,
    FormsModule,
    NgxSliderModule,
    NgxSpinnerModule,
    ColorPickerModule,
    PopoverModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
        NgxEchartsModule.forRoot({ echarts }),

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
    RatingModule.forRoot(),
    
  ]
})
export class operationModule { }
