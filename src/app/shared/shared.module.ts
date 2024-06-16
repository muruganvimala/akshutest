import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// component
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { NoAccessComponent } from './no-access/no-access.component';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    NoAccessComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [BreadcrumbsComponent,NoAccessComponent]
})
export class SharedModule { }
