import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { sellerOverview } from './data';
import { Observable } from 'rxjs';
import { sellerModel } from './seller-overview.model';
import { SellerOverviewService } from './seller-overview.service';
import { DecimalPipe } from '@angular/common';
import { NgbdSellerOverviewSortableHeader, sellerSortEvent } from './seller-overview-sortable.directive';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';


@Component({
  selector: 'app-seller-overview',
  templateUrl: './seller-overview.component.html',
  styleUrls: ['./seller-overview.component.scss'],
  providers: [SellerOverviewService, DecimalPipe]
})

// Seller Overview Component
export class SellerOverviewComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  portfolioccharts: any;
  deleteID: any;
  files: File[] = [];
  overviewForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;

  sellers: any;
  sellerOverview!: Observable<sellerModel[]>;
  total: Observable<number>;

  @ViewChildren(NgbdSellerOverviewSortableHeader) headers!: QueryList<NgbdSellerOverviewSortableHeader>;
  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


  constructor(public service: SellerOverviewService, private formBuilder: UntypedFormBuilder) {
    this.sellerOverview = service.countries$;
    this.total = service.total$;
  }


  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Sellers Overview', active: true }
    ];

    // Chart Color Data Get Function
    this._portfolioccharts('["--tb-primary", "--tb-light", "--tb-secondary"]');

    /**
     * Form Validation
     */
    this.overviewForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      price: ['', [Validators.required]],
      img: ['']
    });


    // Fetch Data
    setTimeout(() => {
      this.sellerOverview.subscribe(x => {
        this.sellers = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
      this.overviewForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Sort Data
  onSort({ column, direction }: sellerSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sellersortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
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
* Realized Charts
*/
  private _portfolioccharts(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.portfolioccharts = {
      series: [{
        name: 'Earnings',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 21, 37, 23, 11, 22]
      }, {
        name: 'Orders',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 45, 64, 44, 55, 41]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 25, 21, 30, 25, 36]
      }],
      chart: {
        height: 400,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false,
        }
      },
      stroke: {
        width: [0, 2, 3],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '25%'
        }
      },
      fill: {
        opacity: [1, 0.08, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
      },
      labels: ['01/01/2022', '02/01/2022', '03/01/2022', '04/01/2022', '05/01/2022', '06/01/2022', '07/01/2022',
        '08/01/2022', '09/01/2022', '10/01/2022', '11/01/2022', '12/01/2022', '01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023'
      ],
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime'
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return "$" + y.toFixed(0);
            }
            return y;

          }
        }
      },
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._portfolioccharts('["--tb-primary", "--tb-light", "--tb-secondary"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  // Edit Data
  editList(id: any) {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.sellers[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.img_alt, 'size': 1024, });

    this.overviewForm.controls['id'].setValue(editData.id);
    this.overviewForm.controls['name'].setValue(editData.name);
    this.overviewForm.controls['category'].setValue(editData.category);
    this.overviewForm.controls['stock'].setValue(editData.stock);
    this.overviewForm.controls['price'].setValue(editData.price);
    this.overviewForm.controls['img'].setValue(editData.img);
  }

  // add Product
  saveOverview() {

    
    if (this.overviewForm.valid) {
      if (this.overviewForm.get('id')?.value) {
        this.service.products = sellerOverview.map((order: { id: any; }) => order.id === this.overviewForm.get('id')?.value ? { ...order, ...this.overviewForm.value } : order);
      }
      else {
        const name = this.overviewForm.get('name')?.value;
        const category = this.overviewForm.get('category')?.value;
        const stock = this.overviewForm.get('stock')?.value;
        const price = this.overviewForm.get('price')?.value;
        const img = this.overviewForm.get('img')?.value;
        const publishedDate = '02 May 2023';

        sellerOverview.push({
          id: this.sellers.length + 1,
          name,
          category,
          img,
          stock,
          price,
          orders: '0',
          rating: '-',
          publishedDate
        })

        this.service.products = sellerOverview
      }
      this.overviewForm.reset();
      this.uploadedFiles = [];
      this.showModal?.hide()
    }
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Add User'
    this.submitted = true
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.sellers.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.sellers.length; i++) {
      if (this.sellers[i].state == true) {
        result = this.sellers[i].id;
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
    for (var i = 0; i < this.sellers.length; i++) {
      if (this.sellers[i].state == true) {
        result = this.sellers[i].id;
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
