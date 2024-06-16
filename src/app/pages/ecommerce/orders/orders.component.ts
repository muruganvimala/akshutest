import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { OrderService } from './orders.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { OrderModel } from './orders.model';
import { orderList } from './data';
import { NgbdOrderSortableHeader, orderSortEvent } from './orders-sortable.directive';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [OrderService, DecimalPipe]
})
export class OrdersComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  linebasicChart: any;
  orders: any;
  orderForm!: UntypedFormGroup;
  submitted: boolean = false;
  masterSelected!: boolean;

  // Table data
  orderList!: Observable<OrderModel[]>;
  total: Observable<number>;
  deleteId: any;
  sortValue:any = 'Order Date'

  @ViewChildren(NgbdOrderSortableHeader) headers!: QueryList<NgbdOrderSortableHeader>;
  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


  constructor(public service: OrderService, private formBuilder: UntypedFormBuilder) {
    this.orderList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Orders', active: true }
    ];

    // Chart Color Data Get Function
    this._linebasicChart('["--tb-primary", "--tb-secondary"]');

    // Fetch Data
    setTimeout(() => {
      this.orderList.subscribe(x => {
        this.orders = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200)

    /**
 * Form Validation
 */
    this.orderForm = this.formBuilder.group({
      _id: [''],
      customer: ['', [Validators.required]],
      product: ['', [Validators.required]],
      order_date: ['', [Validators.required]],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      pay_method: ['', [Validators.required]],
      delivery_status: ['', [Validators.required]],
    });
  }

  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  /**
  * Sale Charts
  */
  private _linebasicChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.linebasicChart = {
      series: [{
        name: "New Orders",
        data: [32, 18, 13, 17, 26, 34, 47, 51, 59, 63, 44, 38, 53, 69, 72, 83, 90, 110, 130, 117, 103, 92, 95, 119, 80, 96, 116, 125]
      }, {
        name: "Return Orders",
        data: [3, 6, 2, 4, 7, 9, 15, 10, 19, 22, 27, 21, 34, 23, 29, 32, 41, 34, 29, 37, 70, 55, 49, 36, 30, 52, 38, 33]
      }],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 4
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: colors,
      xaxis: {
        type: 'datetime',
        categories: ['02/01/2023 GMT', '02/02/2023 GMT', '02/03/2023 GMT', '02/04/2023 GMT',
          '02/05/2023 GMT', '02/06/2023 GMT', '02/07/2023 GMT', '02/08/2023 GMT', '02/09/2023 GMT', '02/10/2023 GMT', '02/11/2023 GMT', '02/12/2023 GMT', '02/13/2023 GMT',
          '02/14/2023 GMT', '02/15/2023 GMT', '02/16/2023 GMT', '02/17/2023 GMT', '02/18/2023 GMT', '02/19/2023 GMT', '02/20/2023 GMT', '02/21/2023 GMT', '02/22/2023 GMT',
          '02/23/2023 GMT', '02/24/2023 GMT', '02/25/2023 GMT', '02/26/2023 GMT', '02/27/2023 GMT', '02/28/2023 GMT'
        ]
      },
      yaxis: {
        show: false,
      }
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._linebasicChart('["--tb-primary", "--tb-secondary"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  // Sort Data
  sortBy({ column, direction }: orderSortEvent, value: any) {
    this.sortValue = value
    this.onSort({ column, direction })
  }

  onSort({ column, direction }: orderSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.ordersortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  // Edit Order
  editOrder(id: any) {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    this.orderForm.controls['_id'].setValue(this.orders[id].id);
    this.orderForm.controls['order_date'].setValue(this.orders[id].order_date);
    this.orderForm.controls['product'].setValue(this.orders[id].product);
    this.orderForm.controls['name'].setValue(this.orders[id].shop[0].name);
    this.orderForm.controls['customer'].setValue(this.orders[id].customer);
    this.orderForm.controls['pay_method'].setValue(this.orders[id].pay_method);
    this.orderForm.controls['price'].setValue(this.orders[id].price);
    this.orderForm.controls['delivery_status'].setValue(this.orders[id].delivery_status);
  }

  // Add Order
  saveOrder() {
    if (this.orderForm.valid) {
      if (this.orderForm.get('_id')?.value) {
        this.service.products = orderList.map((order: { id: any; }) => order.id === this.orderForm.get('_id')?.value ? { ...order, ...this.orderForm.value } : order);
      }
      else {
        const order_date = this.orderForm.get('order_date')?.value;
        const product = this.orderForm.get('product')?.value;
        const customer = this.orderForm.get('customer')?.value;
        const pay_method = this.orderForm.get('pay_method')?.value;
        const price = this.orderForm.get('price')?.value;
        const delivery_status = this.orderForm.get('delivery_status')?.value;
        const shop = [{
          img: 'assets/images/users/avatar-1.jpg',
          name: this.orderForm.get('name')?.value
        }]
        orderList.push({
          id: this.orders.length + 1,
          order_date,
          product,
          delivery_date: '--',
          customer,
          shop,
          pay_method,
          price,
          ratings: '',
          delivery_status,
        })
      }
      this.orderForm.reset();
      this.showModal?.hide()
    }
    setTimeout(() => {
      this.orderForm.reset();
    }, 1000);
    this.submitted = true
  }

  // Delete Order
  removeOrder(id: any) {
    this.deleteId = id
    this.deleteRecordModal?.show()
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.orders.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].state == true) {
        result = this.orders[i].id;
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
      for (var i = 0; i < this.orders.length; i++) {
        if (this.orders[i].state == true) {
          result = this.orders[i].id;
          checkedVal.push(result);
        }
      }
      this.checkedValGet = checkedVal
      checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
    }


    confirmDelete() {
      if (this.deleteId) {
        this.service.products = this.service.products.filter((product:any) => {
          return this.deleteId != product.id;
        });
        this.deleteId = ''
      } else {
        this.service.products = this.service.products.filter((product:any) => {
          return !this.checkedValGet.includes(product.id);
        });
      }
      this.deleteRecordModal?.hide()
      this.masterSelected = false;
    }

}
