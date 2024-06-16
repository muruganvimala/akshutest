import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {kpiModel} from './kpi.model';

export type SortColumn = keyof kpiModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface kpiSortEvent {
    column: SortColumn;
    direction: SortDirection;
  }

  @Directive({
    selector: 'th[kpisortable]',
    host: {
      '[class.asc]': 'direction === "asc"',
      '[class.desc]': 'direction === "desc"',
      '(click)': 'rotate()'
    }
  })
  export class NgbdKpiSortableHeader {
  
    @Input() kpisortable: SortColumn = '';
    @Input() direction: SortDirection = '';
    @Output() kpisort = new EventEmitter<kpiSortEvent>();
  
    rotate() {
      this.direction = rotate[this.direction];
      this.kpisort.emit({column: this.kpisortable, direction: this.direction});
    }
  }
  