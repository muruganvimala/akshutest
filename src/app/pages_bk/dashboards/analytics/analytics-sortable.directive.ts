import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { TopPageModel, browserModel } from './analytics.model';

export type SortColumn = keyof browserModel | '';
export type SortColumn1 = keyof TopPageModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

export interface SortEvent1 {
  column1: SortColumn1;
  direction: SortDirection;
}

@Directive({
  selector: "'th[sortable]','th[sortable1]','button[sortable]','a[sortable1]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdAnalyticsSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() sortable1: SortColumn1 = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() sort1 = new EventEmitter<SortEvent1>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
    this.sort1.emit({column1: this.sortable1, direction: this.direction});
  }
}
