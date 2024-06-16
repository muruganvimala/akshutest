import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITRoutingModule } from './it-routing.module';
import { ITComponent } from './it.component';


@NgModule({
  declarations: [
    ITComponent
  ],
  imports: [
    CommonModule,
    ITRoutingModule
  ]
})
export class ITModule { }
