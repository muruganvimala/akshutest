import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { customerDataModel } from './customer-data.model';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './customer-data.directive';
import { ApiService } from 'src/app/API/api.service';

interface SearchResult {
  customers: customerDataModel[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  customerFilter: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
function sort(allCustomerData: customerDataModel[], column: SortColumn, direction: string): customerDataModel[] {
if (direction === '' || column === '') {
  return allCustomerData;
} else {
  return [...allCustomerData].sort((a, b) => {
    const res = compare(a[column], b[column]);
    return direction === 'asc' ? res : -res;
  });
}
}

function matches(customer: customerDataModel, term: string, pipe: PipeTransform) {
  return customer.UA.toLowerCase().includes(term.toLowerCase())
    || customer.Year.toLowerCase().includes(term.toLowerCase())
    || customer.InvoiceNo.toLowerCase().includes(term.toLowerCase())
    || customer.InvoiceDate.toLowerCase().includes(term.toLowerCase())
    || customer.CustomerName.toLowerCase().includes(term.toLowerCase())
    || customer.CustomerAcronym.toLowerCase().includes(term.toLowerCase())
    || customer.FXRate.toLowerCase().includes(term.toLowerCase())
    || customer.CCYType.toLowerCase().includes(term.toLowerCase())
    || customer.MajorHeadServiceLine.toLowerCase().includes(term.toLowerCase())
    || customer.MinorHead.toLowerCase().includes(term.toLowerCase())
    || customer.UOM.toLowerCase().includes(term.toLowerCase())
    || customer.IRM.toLowerCase().includes(term.toLowerCase())
    || customer.SoftexNo.toLowerCase().includes(term.toLowerCase())
    || customer.EDPMSRefNo.toLowerCase().includes(term.toLowerCase())
    || customer.EBRCNo.toLowerCase().includes(term.toLowerCase())
    || customer.ADBank.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _customers$ = new BehaviorSubject<customerDataModel[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _datas$ = new Subject<void>();
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    customerFilter: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 10,
    totalRecords: 0
  };
  
  customers: any | undefined;
  constructor(private pipe: DecimalPipe, private apiservice: ApiService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._customers$.next(result.customers);
      this._total$.next(result.total);
    });
    this._search$.next();

    this.apiservice.GetDataWithToken('directcost/display').subscribe(
      (directcostList) => {
        this.customers = directcostList.data;
        console.log(this.customers);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  get customers$() { return this._customers$.asObservable(); }
  get customer() { return this.customers; }
  get total$() { return this._total$.asObservable(); }
  get datas$() { return this._datas$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get ProductFilter() { return this._state.customerFilter; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set ProductFilter(customerFilter: string) { this._set({ customerFilter }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {

    const datas = (this.customer) ?? [];
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let customers = sort(datas, sortColumn, sortDirection);

    // 2. search
    if (searchTerm) {
      customers = customers.filter(country => matches(country, searchTerm, this.pipe));
    }

    // 3. filter
    if (this.ProductFilter) {
      customers = customers.filter(country => matches(country, this.ProductFilter, this.pipe));
    }

    // 4. paginate
    this.totalRecords = customers.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }

    const total = customers.length;
    customers = customers.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({ customers, total });

  }
}