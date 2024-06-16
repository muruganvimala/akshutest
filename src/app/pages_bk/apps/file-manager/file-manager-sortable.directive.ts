import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { filemanagerModel } from './file-manager.model';

export type SortColumn = keyof filemanagerModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface fileSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "'th[filesortable]','button[filesortable]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdFileSortableHeader {

  @Input() filesortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<fileSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.filesortable, direction: this.direction });
  }
}
