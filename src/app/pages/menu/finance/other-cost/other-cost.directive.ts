
import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {otherCostModel} from './other-cost.model';

export type SortColumn = keyof otherCostModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface directCostSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[appDirectCostSortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

// @Directive({
//   selector: '[appDirectCostSortable]'
// })
export class CustomerDataDirective {

  @Input() customerDataSortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() customerDataSort = new EventEmitter<directCostSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.customerDataSort.emit({column: this.customerDataSortable, direction: this.direction});
  }

}
