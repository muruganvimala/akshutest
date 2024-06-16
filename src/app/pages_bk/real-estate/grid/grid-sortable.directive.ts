import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { EstatelistModel } from './grid.model';

export type SortColumn = keyof EstatelistModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface estateSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[estatesortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdEstateListSortableHeader {

  @Input() estatesortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<estateSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.estatesortable, direction: this.direction });
  }
}
