import { Component, QueryList, ViewChildren } from '@angular/core';
import { SubscriptionModel } from './subscriptions.model';
import { Observable } from 'rxjs';
import { SubscriptionService } from './subscriptions.service';
import { DecimalPipe } from '@angular/common';
import { NgbdSubscriptionSortableHeader, SortEvent } from './subscriptions-sortable.directive';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  providers: [SubscriptionService, DecimalPipe]
})
export class SubscriptionsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  subscriptions: any;

  // Table data
  SubscriptionList!: Observable<SubscriptionModel[]>;
  total: Observable<number>;

  @ViewChildren(NgbdSubscriptionSortableHeader) headers!: QueryList<NgbdSubscriptionSortableHeader>;

  constructor(public service: SubscriptionService) {
    this.SubscriptionList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Students', active: true },
      { label: 'My Subscriptions', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.SubscriptionList.subscribe(x => {
        this.subscriptions = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }


  
  // Sort Data
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
