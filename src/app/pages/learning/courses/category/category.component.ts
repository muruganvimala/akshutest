import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from './category.model';
import { CategoryService } from './category.service';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { category } from './data';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [CategoryService, DecimalPipe]

})
export class CategoryComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  categories: any;
  files: File[] = [];
  categoryForm!: UntypedFormGroup;
  submitted = false;

  // Table data
  CategoryList!: Observable<CategoryModel[]>;
  total: Observable<number>;

  @ViewChild('addCategory', { static: false }) addCategory?: ModalDirective;

  constructor(public service: CategoryService, private formBuilder: UntypedFormBuilder) {
    this.CategoryList = service.countries$;
    this.total = service.total$;
  }


  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Courses', active: true },
      { label: 'Category', active: true }
    ];

    /**
      * Form Validation
    */
    this.categoryForm = this.formBuilder.group({
      _id: [''],
      name: [''],
      img: [''],
    });

    // Fetch Data
    setTimeout(() => {
      this.CategoryList.subscribe(x => {
        this.categories = Object.assign([], x);
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
      this.categoryForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Add Category
  saveCategory() {
    if (this.categoryForm.valid) {
      const name = this.categoryForm.get('name')?.value;
      const img = this.categoryForm.get('img')?.value;
      category.push({
        id: this.categories.length + 1,
        img,
        name,
        course: '0',
        color: 'info'
      })
      this.categoryForm.reset();
      this.addCategory?.hide()
    }
  }

}
