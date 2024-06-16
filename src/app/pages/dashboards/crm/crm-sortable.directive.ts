import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { leadModel } from './crm.model';

export type SortColumn = keyof leadModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface leadSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "'th[leadsortable]','button[leadsortable]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdCRMSortableHeader {

  @Input() leadsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<leadSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.leadsortable, direction: this.direction});
  }
}
