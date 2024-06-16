import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from "ng-apexcharts";
import { BiDashboardRoutingModule } from './bi-dashboard-routing.module';
import { BiDashboardComponent } from './bi-dashboard.component';

// Simplebar

import { SimplebarAngularModule } from 'simplebar-angular';
// Count To
import { CountUpModule } from 'ngx-countup';


@NgModule({
  declarations: [
    BiDashboardComponent
  ],
  imports: [
    CommonModule,
    BiDashboardRoutingModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    CountUpModule,
  ]
})
export class BiDashboardModule { }
