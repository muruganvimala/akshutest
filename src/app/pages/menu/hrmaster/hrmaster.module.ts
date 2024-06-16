import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmasterRoutingModule } from './hrmaster-routing.module';
import { HrmasterComponent } from './hrmaster.component';


@NgModule({
  declarations: [
    HrmasterComponent
  ],
  imports: [
    CommonModule,
    HrmasterRoutingModule
  ]
})
export class HrmasterModule { }
