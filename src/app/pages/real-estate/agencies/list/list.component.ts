import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AgenciesListService } from './list.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AgencieslistModel } from './list.model';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbdAgenciesListSortableHeader, AgencySortEvent } from './list-sortable.directive';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { agencies } from './data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [AgenciesListService, DecimalPipe]
})

// List Component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  agencies: any;
  AgenciesList!: Observable<AgencieslistModel[]>;
  total: Observable<number>;

  agenciesForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;
  files: File[] = [];
  bedroom: any;

  @ViewChildren(NgbdAgenciesListSortableHeader) headers!: QueryList<NgbdAgenciesListSortableHeader>;

  @ViewChild('addAgencies', { static: false }) addAgencies?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;
  sortValue: any = 'Since';

  constructor(public service: AgenciesListService, private formBuilder: UntypedFormBuilder) {
    this.AgenciesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Agencies', active: true },
      { label: 'List View', active: true }
    ];

    /**
 * Form Validation
 */
    this.agenciesForm = this.formBuilder.group({
      id: [''],
      img: [''],
      since: ['', [Validators.required]],
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      property: ['', [Validators.required]],
      employee: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contact: ['', [Validators.required]]
    });

    // Fetch Data
    setTimeout(() => {
      this.AgenciesList.subscribe(x => {
        this.agencies = Object.assign([], x);
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
      this.agenciesForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: any) {
    this.addAgencies?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.agencies[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.imgalt, 'size': 1024, });

    this.agenciesForm.controls['id'].setValue(editData.id);
    this.agenciesForm.controls['since'].setValue(editData.since);
    this.agenciesForm.controls['name'].setValue(editData.name);
    this.agenciesForm.controls['location'].setValue(editData.location);
    this.agenciesForm.controls['property'].setValue(editData.property);
    this.agenciesForm.controls['employee'].setValue(editData.employee);
    this.agenciesForm.controls['email'].setValue(editData.email);
    this.agenciesForm.controls['contact'].setValue(editData.contact);
    this.agenciesForm.controls['img'].setValue(editData.img);
  }

  // Add Property
  saveAgencies() {
    if (this.agenciesForm.valid) {
      if (this.agenciesForm.get('id')?.value) {
        this.service.products = agencies.map((order: { id: any; }) => order.id === this.agenciesForm.get('id')?.value ? { ...order, ...this.agenciesForm.value } : order);
      }
      else {
        const name = this.agenciesForm.get('name')?.value;
        const since = this.agenciesForm.get('since')?.value;
        const location = this.agenciesForm.get('location')?.value;
        const property = this.agenciesForm.get('property')?.value;
        const employee = this.agenciesForm.get('employee')?.value;
        const email = this.agenciesForm.get('email')?.value;
        const contact = this.agenciesForm.get('contact')?.value;
        const img = this.agenciesForm.get('img')?.value;

        agencies.push({
          id: this.agencies.length + 1,
          since,
          name,
          img,
          imgalt: '',
          location,
          property,
          employee,
          email,
          contact
        })
      }
      this.agenciesForm.reset();
      this.addAgencies?.hide();
      this.uploadedFiles = [];
    }

    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add Agencies'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Add'

    this.submitted = true
  }

  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.agencies.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.agencies.length; i++) {
      if (this.agencies[i].state == true) {
        result = this.agencies[i].id;
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
    for (var i = 0; i < this.agencies.length; i++) {
      if (this.agencies[i].state == true) {
        result = this.agencies[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  confirmDelete() {
    if (this.deleteID) {
      this.service.products = this.service.products.filter((product:any) => {
        return this.deleteID != product.id;
      });
      this.deleteID = ''
    } else {
      this.service.products = this.service.products.filter((product:any) => {
        return !this.checkedValGet.includes(product.id);
      });
    }
    this.deleteRecordModal?.hide()
    this.masterSelected = false;
  }

  // Sort 
  sortBy({ column, direction }: AgencySortEvent, value: any) {
    this.sortValue = value
    this.onSort({ column, direction })
  }

  onSort({ column, direction }: AgencySortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.agencysortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
