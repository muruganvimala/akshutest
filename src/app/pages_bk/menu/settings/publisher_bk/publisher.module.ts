import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PublisherRoutingModule } from './publisher-routing.module';
import { PublisherComponent } from './publisher.component';
import { PublisherSortableDirective } from './publisher-sortable.directive';
import { FormsModule } from '@angular/forms';


import { SharedModule } from 'src/app/shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { IconsModule } from '../../../icons/icons.module';

// Count To
import { CountUpModule } from 'ngx-countup';

// Mask
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

// Bootstrap Component

import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GridjsComponent } from '../../../table/gridjs/gridjs.component';
import { TableModule } from '../../../table/table.module';

@NgModule({
  declarations: [
    PublisherComponent,
    PublisherSortableDirective
  ],
  imports: [
    CommonModule,
    PublisherRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    
    SharedModule,
    IconsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CountUpModule,
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
    TableModule,
  ]
})
export class PublisherModule { }
