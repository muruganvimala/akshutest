import { Component, ViewChild } from '@angular/core';
import { EstateGridService } from './grid.service';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EstatelistModel } from './grid.model';

import { estateList } from './data';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Options } from '@angular-slider/ngx-slider';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [EstateGridService, DecimalPipe]
})

// Grid Component
export class GridComponent {
  files: File[] = [];
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  propertyForm!: UntypedFormGroup;
  submitted = false;

  products: any;
  estateList!: Observable<EstatelistModel[]>;
  total: Observable<number>;
  price: any = [500, 3800];

  bedroom: any;

  // Price Slider
  minValue = 500;
  maxValue = 3800;
  options: Options = {
    floor: 0,
    ceil: 5000
  };

  @ViewChild('addProperty', { static: false }) addProperty?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;

  constructor(public service: EstateGridService, private formBuilder: UntypedFormBuilder) {
    this.estateList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Real Estate', active: true },
      { label: 'Listing Grid', active: true }
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
    setTimeout(() => {
      this.estateList.subscribe(x => {
        this.products = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)

  }

  // Hide/Show Filter
  showFilter() {
    const filterStyle = (document.getElementById("propertyFilters") as HTMLElement).style.display;
    if (filterStyle == 'none') {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'block'
    } else {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'none'
    }
  }

  // Add to starr
  starredproduct(id: any, event: any, star: any) {
    event.target.classList.toggle('active')
    if (star == false) {
      this.products[id].starred = true
    } else {
      this.products[id].starred = false
    }
  }

  bedroomFilter(ev: any) {
    if (ev.target.value != '') {
      if (ev.target.checked == true) {
        this.service.products = estateList.filter((el: any) => {
          return el.bedroom == ev.target.value
        })
      }
    } else {
      this.service.products = estateList
    }
  }

  bathroomFilter(ev: any) {
    if (ev.target.value != '') {
      if (ev.target.checked == true) {
        this.service.products = estateList.filter((el: any) => {
          return el.bathroom == ev.target.value
        })
      }
    } else {
      this.service.products = estateList
    }
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
        const price = this.propertyForm.get('price')?.value;
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
      this.addProperty?.hide()
      this.uploadedFiles = [];
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
    estateList.splice(this.deleteID, 1)
    this.deleteRecordModal?.hide()
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

}
