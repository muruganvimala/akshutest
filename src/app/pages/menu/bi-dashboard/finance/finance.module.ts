import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FinanceComponent } from './finance.component';
import { CommonModule } from '@angular/common';
import { FinanceRoutingModule } from './finance-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import * as echarts from 'echarts';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FlatpickrModule } from 'angularx-flatpickr';

// angular materials
import { MatSelectModule } from '@angular/material/select'; 
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    FinanceComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    SharedModule,
    FormsModule,
	  ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    CountUpModule,
    NgApexchartsModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    ProgressbarModule.forRoot(),
    LeafletModule,
    NgxEchartsModule.forRoot({ echarts }),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FlatpickrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FinanceRoutingModule,
    SharedModule,
    FormsModule,
	  ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    CountUpModule,
    NgApexchartsModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    ProgressbarModule.forRoot(),
    LeafletModule,
    NgxEchartsModule.forRoot({ echarts }),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FlatpickrModule.forRoot(),
    FormsModule,   
    MatSelectModule,
    MatInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FinanceModule { }
