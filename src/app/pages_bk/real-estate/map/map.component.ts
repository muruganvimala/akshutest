import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EstateMapService } from './map.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { EstatelistModel, ListingModel } from '../grid/grid.model';
import { estateList } from '../grid/data';
// leaflet map
import { latLng, tileLayer, circle, polygon, marker, icon, Layer } from 'leaflet';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [EstateMapService, DecimalPipe]
})

// Map Component
export class MapComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  propertyForm!: UntypedFormGroup;
  submitted = false;

  products: any;
  listingcards!: ListingModel[];
  estateList!: Observable<EstatelistModel[]>;
  total: Observable<number>;
  masterSelected!: boolean;

  bedroom: any;
  files: File[] = [];

  @ViewChild('addProperty', { static: false }) addProperty?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;

  constructor(public service: EstateMapService, private formBuilder: UntypedFormBuilder) {
    this.estateList = service.countries$;
    this.total = service.total$;
    this.service.ProductFilter='all'
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Real Estate', active: true },
      { label: 'Listing Map', active: true }
    ];

    /**
  * Form Validation
  */
    this.propertyForm = this.formBuilder.group({
      id: [''],
      img: [''],
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      bedroom: ['', [Validators.required]],
      bathroom: ['', [Validators.required]],
      area: ['', [Validators.required]],
      price: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });

    // Fetch Data
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


  /**
 * Basic Maps
 */
  options = {
    layers: [
      tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w",
        {
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        }
      )
    ],
    zoom: 10,
    center: latLng(39.73, -104.99)
  };
  GroupsLayers = [
    marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    marker([39.63, -105.09]).bindPopup('This is Littleton, CO.'),
    marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    marker([39.77, -105.01]).bindPopup('This is Denver, CO.'),
    marker([39.90, -105.03]).bindPopup('This is Denver, CO.'),
    marker([39.96, -105.04]).bindPopup('This is Denver, CO.'),
    marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    marker([39.70, -104.9]).bindPopup('This is Aurora, CO.'),
    marker([39.77, -105.23]).bindPopup("This is Golden, CO."),
    marker([39.80, -105.01]).bindPopup("This is Golden, CO."),
    marker([39.95, -105.09]).bindPopup("This is Golden, CO.")
  ];


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
        const img = this.propertyForm.get('img')?.value;
        const price = '$' + this.propertyForm.get('price')?.value;
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
          agent: '',
          requirement: ''
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
    this.service.products = this.service.products.filter((product:any) => {
      return this.deleteID != product.id;
    });
    this.deleteID = ''
    this.deleteRecordModal?.hide()
  }




}
