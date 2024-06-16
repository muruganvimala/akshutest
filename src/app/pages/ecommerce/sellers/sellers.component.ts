import { Component, ViewChild } from '@angular/core';

// Get Data
import { seller1Chart, sellerList } from './data';
import { sellerModel, ChartOptions } from './sellers.model';
import { SellerService } from './sellers.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss'],
  providers: [SellerService, DecimalPipe]
})

// Seller Component
export class SellersComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  sellerData: any;

  sellerForm!: UntypedFormGroup;
  submitted: boolean = false;
  files: File[] = [];
  // Table data
  sellerList!: Observable<sellerModel[]>;
  total: Observable<number>;

  @ViewChild('addSellerModal', { static: false }) addSellerModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;

  constructor(public service: SellerService, private formBuilder: UntypedFormBuilder) {
    this.sellerList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Sellers', active: true }
    ];

    /**
* Form Validation
*/
    this.sellerForm = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required]],
      seller: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      img: [''],
    });

    // Fetch Data
    setTimeout(() => {
      this.sellerList.subscribe(x => {
        this.sellerData = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200)
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
      this.sellerForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Seller
  editSeller(id: any) {
    this.addSellerModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit seller details'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    this.uploadedFiles.push({ 'dataURL': this.sellerData[id].img, 'name': this.sellerData[id].img_alt, 'size': 1024, });

    this.sellerForm.controls['_id'].setValue(this.sellerData[id].id);
    this.sellerForm.controls['name'].setValue(this.sellerData[id].name);
    this.sellerForm.controls['seller'].setValue(this.sellerData[id].seller);
    this.sellerForm.controls['email'].setValue(this.sellerData[id].email);
    this.sellerForm.controls['phone'].setValue(this.sellerData[id].phone);
    this.sellerForm.controls['img'].setValue(this.sellerData[id].img);
  }

  // Add Seller
  saveSeller() {
    if (this.sellerForm.valid) {
      if (this.sellerForm.get('_id')?.value) {
        this.service.products = sellerList.map((order: { id: any; }) => order.id === this.sellerForm.get('_id')?.value ? { ...order, ...this.sellerForm.value } : order);
      }
      else {
        const name = this.sellerForm.get('name')?.value;
        const seller = this.sellerForm.get('seller')?.value;
        const email = this.sellerForm.get('email')?.value;
        const phone = this.sellerForm.get('phone')?.value;
        const img = this.sellerForm.get('img')?.value;
        
        sellerList.push({
          id: this.sellerData.length + 1,
          img,
          name,
          seller,
          email,
          phone,
          stock: '0',
          revenue: '0',
          chart: seller1Chart
        })
      }
      this.sellerForm.reset();
      this.uploadedFiles = [];
      this.addSellerModal?.hide()
    }
    setTimeout(() => {
      this.sellerForm.reset();
    }, 1000);
    this.submitted = true
  }


  // Delete Seller
  removeSeller(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show()
  }

  deleteSeller() {
    sellerList.splice(this.deleteId, 1)
    this.removeItemModal?.hide()
  }
}
