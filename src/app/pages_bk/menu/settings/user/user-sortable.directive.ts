import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { userModel } from './user.model';

export type SortColumn = keyof userModel | '';
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
export class UserSortableDirective {

  @Input() Ilistsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<IlistSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.Ilistsortable, direction: this.direction });
  }

}
