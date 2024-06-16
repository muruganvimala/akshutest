
import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {IndirectCostModel} from './indirect-labour-cost.model';

export type SortColumn = keyof IndirectCostModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface indirectLabourCostSortEvent {
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
export class IndirectLabourCostSortableDirective {

  
  @Input() kpisortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() kpisort = new EventEmitter<indirectLabourCostSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.kpisort.emit({column: this.kpisortable, direction: this.direction});
  }

}
