import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiConfigRoutingModule } from './kpi-config-routing.module';
import { KpiConfigComponent } from './kpi-config.component';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    KpiConfigComponent
  ],
  imports: [
    CommonModule,
    KpiConfigRoutingModule,
    FormsModule,
    SharedModule,
    BsDropdownModule
  ]
})
export class KpiConfigModule { }
