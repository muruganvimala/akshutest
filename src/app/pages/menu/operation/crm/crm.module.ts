import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CrmRoutingModule } from './crm-routing.module';
import { CrmComponent } from './crm.component';
import { FormsModule } from '@angular/forms';

import { NgApexchartsModule,ChartComponent } from "ng-apexcharts";
// Simplebar

import { SimplebarAngularModule } from 'simplebar-angular';
// Count To
import { CountUpModule } from 'ngx-countup';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    CrmComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    CountUpModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class CrmModule { }
