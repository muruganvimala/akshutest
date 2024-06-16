import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiDashboardRoutingModule } from './bi-dashboard-routing.module';
import { BiDashboardComponent } from './bi-dashboard.component';


@NgModule({
  declarations: [
    BiDashboardComponent
  ],
  imports: [
    CommonModule,
    BiDashboardRoutingModule
  ]
})
export class BiDashboardModule { }
