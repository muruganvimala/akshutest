import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { EarningModel } from './earnings.model';

export type SortColumn = keyof EarningModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface earningSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "'th[earningsortable]','option[earningsortable]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdEarningSortableHeader {

  @Input() earningsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<earningSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.earningsortable, direction: this.direction});
  }
}
