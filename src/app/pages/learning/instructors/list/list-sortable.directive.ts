import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { InstructorListModel } from './list.model';

export type SortColumn = keyof InstructorListModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface IlistSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[Ilistsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdInstructorListSortableHeader {

  @Input() Ilistsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<IlistSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.Ilistsortable, direction: this.direction });
  }
}
