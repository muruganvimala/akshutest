import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AgentlistModel } from './list.model';

export type SortColumn = keyof AgentlistModel | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface agentSortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[agentsortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdAgentListSortableHeader {

  @Input() agentsortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<agentSortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.agentsortable, direction: this.direction });
  }
}
