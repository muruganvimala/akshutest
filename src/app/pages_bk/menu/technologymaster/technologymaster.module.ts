import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnologymasterRoutingModule } from './technologymaster-routing.module';
import { TechnologymasterComponent } from './technologymaster.component';


@NgModule({
  declarations: [
    TechnologymasterComponent
  ],
  imports: [
    CommonModule,
    TechnologymasterRoutingModule
  ]
})
export class TechnologymasterModule { }
