import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ListModel } from './list.model';
import { Observable } from 'rxjs';

import { NgbdListSortableHeader, listSortEvent } from './list-sortable.directive';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ListService } from './list.service';
import { DecimalPipe } from '@angular/common';
import { courseList } from './data';
import Swal from 'sweetalert2';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

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
  listForm!: UntypedFormGroup;
  submitted = false;

  listData!: any;
  masterSelected!: boolean;
  files: File[] = [];

  // Table data
  CoursesList!: Observable<ListModel[]>;
  total: Observable<number>;

  @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;
  @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  deleteID: any;

  constructor(public service: ListService, private formBuilder: UntypedFormBuilder) {
    this.CoursesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Courses', active: true },
      { label: 'List View', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.CoursesList.subscribe(x => {
        this.listData = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)

    /**
     * Form Validation
     */
    this.listForm = this.formBuilder.group({
      id: [''],
      img: [''],
      name: [''],
      category: ['', [Validators.required]],
      instructor: ['', [Validators.required]],
      lessons: ['', [Validators.required]],
      students: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      fees: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  //  Filter Offcanvas Set
  openEnd() {
    document.getElementById('courseFilters')?.classList.add('show')
    document.querySelector('.backdrop3')?.classList.add('show')
  }

  closeoffcanvas() {
    document.getElementById('courseFilters')?.classList.remove('show')
    document.querySelector('.backdrop3')?.classList.remove('show')
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
      this.listForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Sort Data
  onSort({ column, direction }: listSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.listsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  // Edit Data
  editList(id: any) {
    this.addCourse?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.listData[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.img_alt, 'size': 1024, });

    this.listForm.patchValue(this.listData[id]);
  }

  /**
  * Save product
  */
  saveProduct() {
    if (this.listForm.valid) {
      if (this.listForm.get('id')?.value) {
        this.service.products = courseList.map((order: { id: any; }) => order.id === this.listForm.get('id')?.value ? { ...order, ...this.listForm.value } : order);
      }
      else {
        const name = this.listForm.get('name')?.value;
        const category = this.listForm.get('category')?.value;
        const instructor = this.listForm.get('instructor')?.value;
        const lessons = this.listForm.get('lessons')?.value;
        const students = this.listForm.get('students')?.value;
        const duration = this.listForm.get('duration')?.value;
        const fees = this.listForm.get('fees')?.value;
        const status = this.listForm.get('status')?.value;
        const img = this.listForm.get('img')?.value;

        courseList.push({
          id: this.listData.length + 1,
          category,
          img,
          name,
          instructor,
          lessons,
          students,
          duration,
          fees,
          rating: '',
          status
        })

        var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
        modaltitle.innerHTML = 'Add Course'
        var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
        modalbtn.innerHTML = 'Add Course'

        this.service.products = courseList

      }
      this.listForm.reset();
      this.uploadedFiles = [];
      this.addCourse?.hide()
    }
    this.submitted = true
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.listData.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.listData.length; i++) {
      if (this.listData[i].state == true) {
        result = this.listData[i].id;
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
    for (var i = 0; i < this.listData.length; i++) {
      if (this.listData[i].state == true) {
        result = this.listData[i].id;
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
