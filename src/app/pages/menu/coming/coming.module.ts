import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComingRoutingModule } from './coming-routing.module';
import { ComingComponent } from './coming.component';


@NgModule({
  declarations: [
    ComingComponent
  ],
  imports: [
    CommonModule,
    ComingRoutingModule
  ]
})
export class ComingModule { }
