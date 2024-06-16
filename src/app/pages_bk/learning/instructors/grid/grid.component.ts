import { Component, ViewChild } from '@angular/core';
import { InstructorGridService } from './grid.service';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { InstructorGridModel } from './grid.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { instructorGrid } from './data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [InstructorGridService, DecimalPipe]
})

// Grid Component

export class GridComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  instuctoractivity: any;
  files: File[] = [];
  deleteID: any;

  GridForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;

  instructors: any;
  InstructorList!: Observable<InstructorGridModel[]>;
  total: Observable<number>;

  @ViewChild('addInstructor', { static: false }) addInstructor?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


  constructor(public service: InstructorGridService, private formBuilder: UntypedFormBuilder) {
    this.InstructorList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Instructors', active: true },
      { label: 'Grid View', active: true }
    ];

    /**
     * Form Validation
     */
    this.GridForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      total_course: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      students: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      status: ['', [Validators.required]],
      img: ['']
    });


    // Fetch Data
    setTimeout(() => {
      this.InstructorList.subscribe(x => {
        this.instructors = Object.assign([], x);
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
      this.GridForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: any) {
    this.addInstructor?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.instructors[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.img_alt, 'size': 1024, });

    this.GridForm.controls['id'].setValue(editData.id);
    this.GridForm.controls['name'].setValue(editData.name);
    this.GridForm.controls['email'].setValue(editData.email);
    this.GridForm.controls['total_course'].setValue(editData.total_course);
    this.GridForm.controls['experience'].setValue(editData.experience);
    this.GridForm.controls['students'].setValue(editData.students);
    this.GridForm.controls['contact'].setValue(editData.contact);
    this.GridForm.controls['status'].setValue(editData.status);
    this.GridForm.controls['img'].setValue(editData.img);
  }

  // add Product
  saveGrid() {
    if (this.GridForm.valid) {
      if (this.GridForm.get('id')?.value) {
        this.service.products = instructorGrid.map((order: { id: any; }) => order.id === this.GridForm.get('id')?.value ? { ...order, ...this.GridForm.value } : order);
      }
      else {
        const name = this.GridForm.get('name')?.value;
        const email = this.GridForm.get('email')?.value;
        const total_course = this.GridForm.get('total_course')?.value;
        const experience = this.GridForm.get('experience')?.value;
        const students = this.GridForm.get('students')?.value;
        const contact = this.GridForm.get('contact')?.value;
        const status = this.GridForm.get('status')?.value;
        const img = this.GridForm.get('img')?.value;

        instructorGrid.push({
          id: this.instructors.length + 1,
          img,
          name,
          email,
          total_course,
          designation: '',
          rating: '',
          contact,
          status, 
          experience,
          students
        })

        this.service.products = instructorGrid
      }
      this.GridForm.reset();
      this.uploadedFiles = [];
      this.addInstructor?.hide()
    }
    this.submitted = true

    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add Instructor'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Add Instructor'
  }

  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    instructorGrid.splice(this.deleteID, 1)
    this.deleteRecordModal?.hide()
  }

}
