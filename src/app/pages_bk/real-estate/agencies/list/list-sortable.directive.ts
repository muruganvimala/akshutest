import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AgencieslistModel } from './list.model';

export type SortColumn = keyof AgencieslistModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface AgencySortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "'th[agencysortable]','button[agencysortable]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdAgenciesListSortableHeader {

  @Input() agencysortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<AgencySortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.agencysortable, direction: this.direction });
  }
}
