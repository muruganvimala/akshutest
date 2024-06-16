import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AgentListService } from './list.service';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AgentlistModel } from './list.model';
import { NgbdAgentListSortableHeader, agentSortEvent } from './list-sortable.directive';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { agentlistdata } from './data';
// Date Format
import { DatePipe } from '@angular/common';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [AgentListService, DecimalPipe]
})

// list Component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  agents: any;
  AgentList!: Observable<AgentlistModel[]>;
  total: Observable<number>;

  agentForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;

  bedroom: any;

  files: File[] = [];
  @ViewChildren(NgbdAgentListSortableHeader) headers!: QueryList<NgbdAgentListSortableHeader>;

  @ViewChild('addAgent', { static: false }) addAgent?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;

  constructor(public service: AgentListService, private formBuilder: UntypedFormBuilder, private datePipe: DatePipe) {
    this.AgentList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Agents', active: true },
      { label: 'Agent List', active: true }
    ];

    /**
 * Form Validation
 */
    this.agentForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      status: ['', [Validators.required]],
      location: ['', [Validators.required]],
      img: ['']
    });

    // Fetch Data
    setTimeout(() => {
      this.AgentList.subscribe(x => {
        this.agents = Object.assign([], x);
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
      this.agentForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: any) {
    this.addAgent?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.agents[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.imgalt, 'size': 1024, });

    this.agentForm.controls['id'].setValue(editData.id);
    this.agentForm.controls['name'].setValue(editData.name);
    this.agentForm.controls['location'].setValue(editData.location);
    this.agentForm.controls['email'].setValue(editData.email);
    this.agentForm.controls['contact'].setValue(editData.contact);
    this.agentForm.controls['status'].setValue(editData.status);
    this.agentForm.controls['img'].setValue(editData.img);
  }

  // Add Property
  saveProperty() {
    if (this.agentForm.valid) {
      if (this.agentForm.get('id')?.value) {
        this.service.products = agentlistdata.map((order: { id: any; }) => order.id === this.agentForm.get('id')?.value ? { ...order, ...this.agentForm.value } : order);
      }
      else {
        const name = this.agentForm.get('name')?.value;
        const location = this.agentForm.get('location')?.value;
        const email = this.agentForm.get('email')?.value;
        const contact = this.agentForm.get('contact')?.value;
        const status = this.agentForm.get('status')?.value;
        const img = this.agentForm.get('img')?.value;
        const joiningdate = this.datePipe.transform(new Date(), "dd MMM, yyyy") || ''
        agentlistdata.push({
          id: this.agents.length + 1,
          joiningdate,
          name,
          img,
          imgalt: '',
          property: '',
          location,
          email,
          contact,
          status,
          new: false
        })

        this.service.products = agentlistdata
      }
      this.agentForm.reset();
      this.uploadedFiles = [];
      this.addAgent?.hide()
    }

    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add Agent'
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
    this.agents.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.agents.length; i++) {
      if (this.agents[i].state == true) {
        result = this.agents[i].id;
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
    for (var i = 0; i < this.agents.length; i++) {
      if (this.agents[i].state == true) {
        result = this.agents[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
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

  // Sort Data
  onSort({ column, direction }: agentSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.agentsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
