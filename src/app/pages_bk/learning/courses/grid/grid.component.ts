import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { GridService } from './grid.service';
import { DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridModel } from './grid.model';

import Swal from 'sweetalert2';
import { courseGrid } from './data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [GridService, DecimalPipe]
})
export class GridComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  listForm!: UntypedFormGroup;
  submitted = false;

  listData!: any;
  masterSelected!: boolean;
  files: File[] = [];
  // Table data
  CoursesList!: Observable<GridModel[]>;
  total: Observable<number>;

  @ViewChild('addCourse', { static: false }) addCourse?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  deleteID: any;

  constructor(public service: GridService, private formBuilder: UntypedFormBuilder) {
    this.CoursesList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Courses', active: true },
      { label: 'Grid View', active: true }
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
      name: [''],
      img: [''],
      category: ['', [Validators.required]],
      instructor: ['', [Validators.required]],
      lessons: ['', [Validators.required]],
      students: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      fees: ['', [Validators.required]],
      coursestatus: ['', [Validators.required]]
    });
  }


  /**
 * Returns form
 */
  get form() {
    return this.listForm.controls;
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

  // Edit Data
  editList(id: any) {
    this.addCourse?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.listData[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.img_alt, 'size': 1024, });

    this.listForm.controls['id'].setValue(editData.id);
    this.listForm.controls['name'].setValue(editData.name);
    this.listForm.controls['category'].setValue(editData.category);
    this.listForm.controls['instructor'].setValue(editData.instructor);
    this.listForm.controls['lessons'].setValue(editData.lessons);
    this.listForm.controls['students'].setValue(editData.students);
    this.listForm.controls['duration'].setValue(editData.duration);
    this.listForm.controls['fees'].setValue(editData.fees);
    this.listForm.controls['coursestatus'].setValue(editData.coursestatus);
    this.listForm.controls['img'].setValue(editData.img);
  }

  /**
  * Save product
  */
  saveProduct() {
    if (this.listForm.valid) {
      if (this.listForm.get('id')?.value) {
        this.service.products = courseGrid.map((order: { id: any; }) => order.id === this.listForm.get('id')?.value ? { ...order, ...this.listForm.value } : order);
      }
      else {
        const name = this.listForm.get('name')?.value;
        const category = this.listForm.get('category')?.value;
        const instructor = this.listForm.get('instructor')?.value;
        const lessons = this.listForm.get('lessons')?.value;
        const students = this.listForm.get('students')?.value;
        const duration = this.listForm.get('duration')?.value;
        const fees = this.listForm.get('fees')?.value;
        const coursestatus = this.listForm.get('coursestatus')?.value;
        const img = this.listForm.get('img')?.value;

        courseGrid.push({
          id: this.listData.length + 1,
          category,
          img,
          name,
          instructor,
          lessons,
          students,
          duration,
          profile: 'assets/images/users/48/avatar-2.jpg',
          fees,
          status: '',
          coursestatus,
          color: 'info'
        })
        this.service.products = courseGrid

      }
      this.listForm.reset();
      this.uploadedFiles = [];
      this.addCourse?.hide()


      var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
      modaltitle.innerHTML = 'Add Course'
      var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
      modalbtn.innerHTML = 'Add Course'
    }

    this.submitted = true
  }


  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    courseGrid.splice(this.deleteID, 1)
    this.deleteRecordModal?.hide()
  }

}
