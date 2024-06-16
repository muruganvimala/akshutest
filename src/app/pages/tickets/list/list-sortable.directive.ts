import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { TicketModel } from './list.model';

export type SortColumn = keyof TicketModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface ticketSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[ticketsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdTicketListSortableHeader {

  @Input() ticketsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<ticketSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.ticketsortable, direction: this.direction });
  }
}
