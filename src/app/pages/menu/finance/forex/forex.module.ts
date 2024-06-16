import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ForexRoutingModule } from './forex-routing.module';
import { ForexComponent } from './forex.component';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
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
import { TableModule } from '../../../table/table.module';


@NgModule({
  declarations: [
    ForexComponent
  ],
  imports: [
    CommonModule,
    ForexRoutingModule,
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
    BsDropdownModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForexModule { }
