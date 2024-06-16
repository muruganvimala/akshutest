import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { ListService } from './list.service';
import { Observable } from 'rxjs';
import { ListModel } from './list.model';
import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { invoicesList, invoice } from './data';
import { IlistSortEvent, NgbdInvoiceListSortableHeader } from './list-sortable.directive';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ListService, DecimalPipe]
})

// List Component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  invoices: any;
  InvoiceList!: Observable<ListModel[]>;
  total: Observable<number>;
  deleteID: any;
  masterSelected!: boolean;
  invoiceCard: any;

  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChildren(NgbdInvoiceListSortableHeader) headers!: QueryList<NgbdInvoiceListSortableHeader>;

  constructor(public service: ListService) {
    this.InvoiceList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Invoice', active: true },
      { label: 'Invoice List', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.InvoiceList.subscribe(x => {
        this.invoices = Object.assign([], x);
      });
      this.invoiceCard = invoice
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)

  }

  // Sort Data
  direction: any = 'asc';
  onSort({ column, direction }: IlistSortEvent) {
    this.headers.forEach(header => {
      if (header.Ilistsortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }


  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.invoices.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.invoices.length; i++) {
      if (this.invoices[i].state == true) {
        result = this.invoices[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.invoices.length; i++) {
      if (this.invoices[i].state == true) {
        result = this.invoices[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    if (this.deleteID) {
      this.service.products = this.service.products.filter((product: any) => {
        return this.deleteID != product.id;
      });
      this.deleteID = ''
    } else {
      this.service.products = this.service.products.filter((product: any) => {
        return !this.checkedValGet.includes(product.id);
      });
    }
    this.deleteRecordModal?.hide()
    this.masterSelected = false;
  }

}
