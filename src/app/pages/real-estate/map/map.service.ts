/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { EstatelistModel } from '../grid/grid.model';
import { estateList } from '../grid/data'; 
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../grid/grid-sortable.directive';

interface SearchResult {
  countries: EstatelistModel[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  ProductFilter: string;
  productStatus: string;
  productPrice: number;
  productRate: number;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
function sort(countries: EstatelistModel[], column: SortColumn, direction: string): EstatelistModel[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
  
function matches(country: EstatelistModel, term: string, pipe: PipeTransform) {
  return country.type.toLowerCase().includes(term.toLowerCase())
    || country.title.toLowerCase().includes(term.toLowerCase())
    || country.location.toLowerCase().includes(term.toLowerCase())
    || country.city.toLowerCase().includes(term.toLowerCase())
    || country.bedroom.toLowerCase().includes(term.toLowerCase())
    || country.bathroom.toLowerCase().includes(term.toLowerCase())
    || country.area.toLowerCase().includes(term.toLowerCase())
    || country.rating.toLowerCase().includes(term.toLowerCase())
    || country.price.toLowerCase().includes(term.toLowerCase())
    || country.agent.toLowerCase().includes(term.toLowerCase())
    || country.requirement.toLowerCase().includes(term.toLowerCase())
    ;
}

@Injectable({ providedIn: 'root' })
export class EstateMapService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<EstatelistModel[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _datas$ = new Subject<void>();
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    ProductFilter: '',
    productStatus: '',
    productRate: 0,
    productPrice: 0,
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 4,
    totalRecords: 0
  };
  user = [];
  products: any | undefined;
  Products$: any;
  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._countries$.next(result.countries);
      this._total$.next(result.total);
    });
    this._search$.next();

    this.products = estateList.reverse();
  }

  get countries$() { return this._countries$.asObservable(); }
  get product() { return this.products; }
  get total$() { return this._total$.asObservable(); }
  get datas$() { return this._datas$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get ProductFilter() { return this._state.ProductFilter; }
  get productPrice() { return this._state.productPrice; }
  get productRate() { return this._state.productRate; }
  get productStatus() { return this._state.productStatus; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set ProductFilter(ProductFilter: string) { this._set({ ProductFilter }); }
  set productPrice(productPrice: number) { this._set({ productPrice }); }
  set productStatus(productStatus: string) { this._set({ productStatus }); }
  set productRate(productRate: number) { this._set({ productRate }); }
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

    const datas = (this.product) ?? [];
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let countries = sort(datas, sortColumn, sortDirection);

    // 2. search
    if (searchTerm) {
      countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    }

    // 3. filter
    if (this.ProductFilter) {
      countries = countries.filter(country => matches(country, this.ProductFilter, this.pipe));
    }

    // 4. paginate
    this.totalRecords = countries.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    // 5. Rate Filter       
    if (this.productRate) {
      countries = countries.filter(country => country.rating>= this.productRate);
    }
    else {
      countries = countries;
    }

    // 6.Price &  rate Filter
    if (this.productPrice) {
      countries = countries.filter(country => country.price >= Object.values(this.productPrice)[0] && country.price <= Object.values(this.productPrice)[1]);
    }
    else {
      countries = countries;
    }

    // 6 Status Filter
    // if (this.productStatus) {
    //   countries = countries.filter(country => country.status == this.productStatus);
    // }
    // else {
    //   countries = countries;
    // }

    const total = countries.length;

    countries = countries.slice(this._state.startIndex - 1, this._state.endIndex);

    
    return of({ countries, total });

  }
}
