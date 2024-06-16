import { Component, ViewChild } from '@angular/core';
import { AgentGridService } from './grid.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AgentlistModel } from '../list/list.model';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { agentlistdata } from '../list/data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [AgentGridService, DecimalPipe]
})

// Grid Component
export class GridComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  agents: any;
  AgentList!: Observable<AgentlistModel[]>;
  total: Observable<number>;

  files: File[] = [];
  agentForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;

  bedroom: any;

  @ViewChild('addAgent', { static: false }) addAgent?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;

  constructor(public service: AgentGridService, private formBuilder: UntypedFormBuilder, private datePipe: DatePipe) {
    this.AgentList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Agents', active: true },
      { label: 'Agent Grid', active: true }
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
      this.addAgent?.hide();
      this.uploadedFiles = [];
    }

    this.submitted = true
  }

  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    agentlistdata.splice(this.deleteID, 1)
    this.deleteRecordModal?.hide()
  }


}
