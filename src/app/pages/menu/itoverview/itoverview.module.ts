import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItoverviewRoutingModule } from './itoverview-routing.module';
import { ItoverviewComponent } from './itoverview.component';


@NgModule({
  declarations: [
    ItoverviewComponent
  ],
  imports: [
    CommonModule,
    ItoverviewRoutingModule
  ]
})
export class ItoverviewModule { }
