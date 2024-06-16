import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { OrderModel } from './orders.model';

export type SortColumn = keyof OrderModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface orderSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "'th[ordersortable]','button[ordersortable]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdOrderSortableHeader {

  @Input() ordersortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<orderSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.ordersortable, direction: this.direction});
  }
}
