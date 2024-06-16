import { Component, ViewChild } from '@angular/core';
import { OrderService } from './customers.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { customerModel } from './customers.model';
import { DecimalPipe } from '@angular/common';
import { customerList } from './data';
import { ModalDirective } from 'ngx-bootstrap/modal';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [OrderService, DecimalPipe]
})

// customer component
export class CustomersComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  customers: any;
  customerForm!: UntypedFormGroup;
  submitted: boolean = false;
  public Editor = ClassicEditor;

  // Table data
  customerList!: Observable<customerModel[]>;
  total: Observable<number>;
  deleteId: any;

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


  constructor(public service: OrderService, private formBuilder: UntypedFormBuilder) {
    this.customerList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Customers', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.customerList.subscribe(x => {
        this.customers = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200)

    /**
 * Form Validation
 */
    this.customerForm = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      create_date: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  // Edit Customer
  editCustomer(id:any) {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Customer'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    this.customerForm.controls['_id'].setValue(this.customers[id].id);
    this.customerForm.controls['email'].setValue(this.customers[id].email);
    this.customerForm.controls['phone'].setValue(this.customers[id].phone);
    this.customerForm.controls['name'].setValue(this.customers[id].customer[0].name);
    this.customerForm.controls['create_date'].setValue(this.customers[id].create_date);
    this.customerForm.controls['status'].setValue(this.customers[id].status);
  }

  // Add Customer
  saveCustomer() {
    if (this.customerForm.valid) {
      if (this.customerForm.get('_id')?.value) {
        this.service.products = customerList.map((order: { id: any; }) => order.id === this.customerForm.get('_id')?.value ? { ...order, ...this.customerForm.value } : order);
        var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
        modaltitle.innerHTML = 'Add Customer'
        var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
        modalbtn.innerHTML = 'Add Customer'
      }
      else {
        const email = this.customerForm.get('email')?.value;
        const phone = this.customerForm.get('phone')?.value;
        const create_date = this.customerForm.get('create_date')?.value;
        const status = this.customerForm.get('status')?.value;
        const customer = [{
          img: 'assets/images/users/avatar-1.jpg',
          name: this.customerForm.get('name')?.value
        }]

        customerList.push({
          id: this.customers.length + 1,
          email,
          phone,
          create_date,
          customer,
          status,
        })
      }
      this.customerForm.reset();
      this.showModal?.hide()
    }
    setTimeout(() => {
      this.customerForm.reset();
    }, 1000);
    this.submitted = true
  }

  // Delete Customer
  removeCustomer(id: any) {
    this.deleteId = id;
    this.deleteRecordModal?.show()
  }

  deleteCustomer() {
    customerList.splice(this.deleteId,1)
    this.deleteRecordModal?.hide()
  }

  // follow unfollow button
  followbtn(ev: any) {
    ev.target.closest('button').classList.toggle('active')
  }

}
