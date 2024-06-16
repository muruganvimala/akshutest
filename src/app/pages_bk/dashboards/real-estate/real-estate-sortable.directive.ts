import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { PropertyModel } from './real-estate.model';

export type SortColumn = keyof PropertyModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface propertySortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "'th[propertysortable]','button[propertysortable]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdRealEstateSortableHeader {

  @Input() propertysortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<propertySortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.propertysortable, direction: this.direction});
  }
}
