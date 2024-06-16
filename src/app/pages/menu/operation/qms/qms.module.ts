import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { QmsRoutingModule } from './qms-routing.module';
import { QmsComponent } from './qms.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle'; 

@NgModule({
  declarations: [
    QmsComponent
  ],
  imports: [
    CommonModule,
    QmsRoutingModule,
    SharedModule,
    MatButtonToggleModule
  ]
})
export class QmsModule { }
