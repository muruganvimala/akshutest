import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EstateListService } from './list.service';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// get Data
import { EstatelistModel, ListingModel } from '../grid/grid.model';
import { estateList, listinglistcard } from '../grid/data';
// modal
import { ModalDirective } from 'ngx-bootstrap/modal';
// sweet alert
import Swal from 'sweetalert2';
// sorting
import { NgbdEstateListSortableHeader, estateSortEvent } from '../grid/grid-sortable.directive';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [EstateListService, DecimalPipe]
})

// List Component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  propertyForm!: UntypedFormGroup;
  submitted = false;

  products: any;
  listingcards!: ListingModel[];
  estateList!: Observable<EstatelistModel[]>;
  total: Observable<number>;
  masterSelected!: boolean;
  files: File[] = [];
  bedroom: any;

  @ViewChildren(NgbdEstateListSortableHeader) headers!: QueryList<NgbdEstateListSortableHeader>;

  @ViewChild('addProperty', { static: false }) addProperty?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;

  constructor(public service: EstateListService, private formBuilder: UntypedFormBuilder) {
    this.estateList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Real Estate', active: true },
      { label: 'Listing List', active: true }
    ];



    /**
  * Form Validation
  */
    this.propertyForm = this.formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      bedroom: ['', [Validators.required]],
      bathroom: ['', [Validators.required]],
      area: ['', [Validators.required]],
      price: ['', [Validators.required]],
      agent: ['', [Validators.required]],
      requirement: ['', [Validators.required]],
      city: ['', [Validators.required]],
      img: ['']
    });

    // Fetch Data
    this.listingcards = listinglistcard;

    setTimeout(() => {
      this.estateList.subscribe(x => {
        this.products = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }


  // File Upload
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
      this.propertyForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: any) {
    this.addProperty?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.products[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.imgalt, 'size': 1024, });

    this.propertyForm.controls['id'].setValue(editData.id);
    this.propertyForm.controls['title'].setValue(editData.title);
    this.propertyForm.controls['type'].setValue(editData.type);
    this.propertyForm.controls['city'].setValue(editData.city);
    this.propertyForm.controls['bedroom'].setValue(editData.bedroom);
    this.propertyForm.controls['bathroom'].setValue(editData.bathroom);
    this.propertyForm.controls['area'].setValue(editData.area);
    this.propertyForm.controls['price'].setValue(editData.price);
    this.propertyForm.controls['agent'].setValue(editData.agent);
    this.propertyForm.controls['requirement'].setValue(editData.requirement);
    this.propertyForm.controls['img'].setValue(editData.img);
  }

  // Add Property
  saveProperty() {
    if (this.propertyForm.valid) {
      if (this.propertyForm.get('id')?.value) {
        this.service.products = estateList.map((order: { id: any; }) => order.id === this.propertyForm.get('id')?.value ? { ...order, ...this.propertyForm.value } : order);
      }
      else {
        const title = this.propertyForm.get('title')?.value;
        const type = this.propertyForm.get('type')?.value;
        const city = this.propertyForm.get('city')?.value;
        const bedroom = this.propertyForm.get('bedroom')?.value;
        const bathroom = this.propertyForm.get('bathroom')?.value;
        const area = this.propertyForm.get('area')?.value;
        const price = '$' + this.propertyForm.get('price')?.value;
        const agent = this.propertyForm.get('agent')?.value;
        const requirement = this.propertyForm.get('requirement')?.value;
        const img = this.propertyForm.get('img')?.value;
        const color = (type == 'Villa' ? type == 'Residency' ? 'danger' : 'success' : 'info')

        estateList.push({
          id: this.products.length + 1,
          type,
          color,
          title,
          img,
          imgalt: '',
          location: city,
          city,
          bedroom,
          bathroom,
          area,
          rating: '',
          price,
          starred: false,
          agent,
          requirement
        })

        this.service.products = estateList
      }
      this.propertyForm.reset();
      this.uploadedFiles = [];
      this.addProperty?.hide()
    }
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add Property list'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Add'

    this.submitted = true
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



  // Sort Data
  onSort({ column, direction }: estateSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.estatesortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
