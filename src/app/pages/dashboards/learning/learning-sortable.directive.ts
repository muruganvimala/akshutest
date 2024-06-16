import {Directive, EventEmitter, Input, Output} from '@angular/core';
import { CourseModel } from './learning.model';

export type SortColumn = keyof CourseModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface courseSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: "'th[coursesortable]','button[coursesortable]'",
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdLearningSortableHeader {

  @Input() coursesortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<courseSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.coursesortable, direction: this.direction});
  }
}
