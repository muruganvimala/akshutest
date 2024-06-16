import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

// Data Get
import { productModel } from './products.model';
import { ProductService } from './products.service';
import { NgbdProductsSortableHeader, productSortEvent } from './products-sortable.directive';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { productList } from './data';
import { ApiService } from 'src/app/API/api.service';
import Swal from 'sweetalert2';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [ProductService, DecimalPipe]
})

// Product Component
export class ProductsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  productForm!: UntypedFormGroup;
  submitted = false;
  products!: any;
  masterSelected!: boolean;

  // Table data
  productList!: Observable<productModel[]>;
  total: Observable<number>;

  files: File[] = [];

  @ViewChildren(NgbdProductsSortableHeader) headers!: QueryList<NgbdProductsSortableHeader>;
  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;
  content: any;

  constructor(public service: ProductService, private formBuilder: UntypedFormBuilder,private apiService: ApiService) {
    this.productList = service.countries$;
    this.total = service.total$;
  }


  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Operation' },
      { label: 'KPI', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.productList.subscribe(x => {
        this.products = Object.assign([], x);
        this.content = this.products
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)

    /**
     * Form Validation
     */
    this.productForm = this.formBuilder.group({
      id: "#VZ2101",
      // _id: "#1",
      _id: [''],
      Publisher: ['', [Validators.required]],
    MonthYear: ['', [Validators.required]],
    OverallPerformance: ['', [Validators.required]],
    Schedule: ['', [Validators.required]],
    Quality: ['', [Validators.required]],
    Communication: ['', [Validators.required]],
    CustomerSatisfaction: ['', [Validators.required]],
    AccountManagement: ['', [Validators.required]],
    PublicationSpeed: ['', [Validators.required]],
    RFT: ['', [Validators.required]],
    PE: ['', [Validators.required]],
    CE: ['', [Validators.required]],
    Typesetting: ['', [Validators.required]],
    ProjectManagement: ['', [Validators.required]]
     
    });
  }

  public items: string[] = ['Adidas', 'Boat', 'Puma', 'Realme'];

  // Sort Data
  onSort({ column, direction }: productSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.productsortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
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
      this.productForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: any) {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit KPI'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.products[id]
    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.img_alt, 'size': 1024, });
    this.productForm.controls['_id'].setValue(editData.id);
    this.productForm.controls['Publisher'].setValue(editData.Publisher);
    this.productForm.controls['MonthYear'].setValue(editData.MonthYear);
    this.productForm.controls['OverallPerformance'].setValue(editData.OverallPerformance);
    this.productForm.controls['Schedule'].setValue(editData.Schedule);
    this.productForm.controls['Quality'].setValue(editData.Quality);
    this.productForm.controls['Communication'].setValue(editData.Communication);
    this.productForm.controls['CustomerSatisfaction'].setValue(editData.CustomerSatisfaction);
    this.productForm.controls['AccountManagement'].setValue(editData.AccountManagement);
    this.productForm.controls['PublicationSpeed'].setValue(editData.PublicationSpeed);
    this.productForm.controls['RFT'].setValue(editData.RFT);
    this.productForm.controls['PE'].setValue(editData.PE);
    this.productForm.controls['CE'].setValue(editData.CE);
    this.productForm.controls['Typesetting'].setValue(editData.Typesetting);
    this.productForm.controls['ProjectManagement'].setValue(editData.ProjectManagement);
  }



  /**
  * Save product
  */
  saveProduct() {
    if (this.productForm.valid) {
      if (this.productForm.get('_id')?.value) {
        this.service.products = productList.map((order: { id: any; }) => order.id === this.productForm.get('_id')?.value ? { ...order, ...this.productForm.value } : order);
      }
      else {
        const title = this.productForm.get('title')?.value;
        const category = this.productForm.get('category')?.value;
        const stock = this.productForm.get('stock')?.value;
        const price = this.productForm.get('price')?.value;
        const img = this.productForm.get('img')?.value;
        const publish = '02 May 2023';
        // productList.push({
        //   id: this.products.length + 1,
        //   title,
        //   category,
        //   img_alt: '',
        //   img,
        //   stock,
        //   price,
        //   discount: '0',
        //   orders: '0',
        //   ratings: '',
        //   publish

        // })
      }
      this.showModal?.hide()
    }
    setTimeout(() => {
      this.productForm.reset();
    }, 1000);
    this.submitted = true
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.products.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].state == true) {
        result = this.products[i].id;

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
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].state == true) {
        result = this.products[i].id;
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
