
import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {directCostModel} from './direct-cost.model';

export type SortColumn = keyof directCostModel | '';
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
export class DirectCostSortableDirective {

   
  @Input() kpisortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() kpisort = new EventEmitter<directCostSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.kpisort.emit({column: this.kpisortable, direction: this.direction});
  }

}
