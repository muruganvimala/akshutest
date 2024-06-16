import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HRRoutingModule } from './hr-routing.module';
import { HRComponent } from './hr.component';


@NgModule({
  declarations: [
    HRComponent
  ],
  imports: [
    CommonModule,
    HRRoutingModule
  ]
})
export class HRModule { }
