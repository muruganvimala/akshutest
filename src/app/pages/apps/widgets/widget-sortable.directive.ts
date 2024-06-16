import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { browserModel } from './widgets.model';

export type SortColumn = keyof browserModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface widgetSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[widgetsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdWidgetSortableHeader {

  @Input() widgetsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() widgetsort = new EventEmitter<widgetSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.widgetsort.emit({ column: this.widgetsortable, direction: this.direction });
  }
}
