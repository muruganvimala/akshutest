import { Component, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
// Data get
import { productgridModel } from './products-grid.model';
import { productList } from './data';
import { ProductGridService } from './products-grid.service';
import { Options } from '@angular-slider/ngx-slider';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss'],
  providers: [ProductGridService, DecimalPipe]
})
export class ProductsGridComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  products!: any;
  allproducts!: any;

  // Table data
  productList!: Observable<productgridModel[]>;
  total: Observable<number>;

  // Price Slider
  minValue = 0;
  maxValue = 1000;
  options: Options = {
    floor: 0,
    ceil: 1000
  };

  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteId: any;

  constructor(public service: ProductGridService) {
    this.productList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Products Grid', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.productList.subscribe(x => {
        this.products = Object.assign([], x);
        this.allproducts = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }

  /**
* Range Slider Wise Data Filter
*/
  valueChange(value: number, boundary: boolean): void {
    if (value > 0 && value < 1000) {
      if (boundary) {
        this.minValue = value;
      } else {
        this.maxValue = value;
      }
    }
  }

  // Remove Product
  removeItem(id: any) {
    this.deleteId = id;
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    productList.splice(this.deleteId, 1)
    this.deleteRecordModal?.hide()
  }

  // Category Filter
  categoryFilter(category: any) {
    this.service.products = productList.filter((product: any) => {
      return product.category == category
    });
  }

  discountRates: number[] = [];
  // Discount Filter
  changeDiscount(e: any) {
    if (e.target.checked) {
      this.discountRates.push(e.target.defaultValue)

      this.service.products = productList.filter((product: any) => {
        return product.ratings > e.target.defaultValue;
      });
    } else {
      for (var i = 0; i < this.discountRates.length; i++) {
        if (this.discountRates[i] === e.target.defaultValue) {
          this.discountRates.splice(i, 1)
        }
      }
    }
  }


}
