import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QmsRoutingModule } from './qms-routing.module';
import { QmsComponent } from './qms.component';


@NgModule({
  declarations: [
    QmsComponent
  ],
  imports: [
    CommonModule,
    QmsRoutingModule
  ]
})
export class QmsModule { }
