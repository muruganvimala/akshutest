import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';

// Get Modal
import { SupportModel, AssignModel, TicketModel } from './list.model';
import { supporttickets, ticketList, assignesTickets } from './data';
import { TicketListService } from './list.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgbdTicketListSortableHeader, ticketSortEvent } from './list-sortable.directive';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [TicketListService, DecimalPipe]
})

// List component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  deleteID: any;

  ListForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;

  supportList!: SupportModel[];
  assignList!: AssignModel[];
  tickets: any;
  ticketList!: Observable<TicketModel[]>;
  total: Observable<number>;

  @ViewChildren(NgbdTicketListSortableHeader) headers!: QueryList<NgbdTicketListSortableHeader>;
  @ViewChild('addTickets', { static: false }) addTickets?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  assignto: any = [];

  constructor(public service: TicketListService, private formBuilder: UntypedFormBuilder) {
    this.ticketList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Support Tickets', active: true },
      { label: 'List View', active: true }
    ];

    /**
     * Form Validation
     */
    this.ListForm = this.formBuilder.group({
      id: [''],
      clientName: ['', [Validators.required]],
      ticketTitle: ['', [Validators.required]],
      createDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    // Fetch Data
    this.supportList = supporttickets;
    this.assignList = assignesTickets;

    setTimeout(() => {
      this.ticketList.subscribe(x => {
        this.tickets = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)

  }

  // Edit Data
  editList(id: any) {
    this.addTickets?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.tickets[id]

    // var img_data = document.getElementById('contact-img') as HTMLImageElement;
    // img_data.src = editData.img
    this.assignto = editData.assignedto;
    this.ListForm.controls['id'].setValue(editData.id);
    this.ListForm.controls['clientName'].setValue(editData.clientName);
    this.ListForm.controls['ticketTitle'].setValue(editData.ticketTitle);
    this.ListForm.controls['createDate'].setValue(editData.createDate);
    this.ListForm.controls['dueDate'].setValue(editData.dueDate);
    this.ListForm.controls['priority'].setValue(editData.priority);
    this.ListForm.controls['status'].setValue(editData.status);
  }

  // Add Assigne
  addAssign(id: any) {
    var btnAction = document.querySelector('.btn-action' + id) as HTMLImageElement;
    if (btnAction.innerHTML == 'Add') {
      this.assignto.push(this.assignList[id])
      btnAction.innerHTML = "Remove";
    } else {
      this.assignto.pop(this.assignList[id])
      btnAction.innerHTML = "Add";
    }
  }

  // add Product
  saveList() {
    if (this.ListForm.valid) {
      if (this.ListForm.get('id')?.value) {
        this.service.products = ticketList.map((order: { id: any; }) => order.id === this.ListForm.get('id')?.value ? { ...order, ...this.ListForm.value } : order);
      }
      else {
        const clientName = this.ListForm.get('clientName')?.value;
        const ticketTitle = this.ListForm.get('ticketTitle')?.value;
        const createDate = this.ListForm.get('createDate')?.value;
        const dueDate = this.ListForm.get('dueDate')?.value;
        const priority = this.ListForm.get('priority')?.value;
        const status = this.ListForm.get('status')?.value;
        ticketList.push({
          id: this.tickets.length + 1,
          assignedto: this.assignto,
          clientName,
          ticketTitle,
          createDate,
          dueDate,
          priority,
          status
        })
      }
      this.ListForm.reset();
      this.addTickets?.hide()
    }
    setTimeout(() => {
      this.ListForm.reset();
    }, 1000);
    this.submitted = true
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.tickets.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.tickets.length; i++) {
      if (this.tickets[i].state == true) {
        result = this.tickets[i].id;
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
    for (var i = 0; i < this.tickets.length; i++) {
      if (this.tickets[i].state == true) {
        result = this.tickets[i].id;
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

  // Sort Data
  onSort({ column, direction }: ticketSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.ticketsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
