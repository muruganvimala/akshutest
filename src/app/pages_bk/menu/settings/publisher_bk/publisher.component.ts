import { QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PhosphorComponent } from '../../../icons/phosphor/phosphor.component';


import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
declare var $: any;

import { PublisherService } from './publisher.service';
import { PublisherSortableDirective, productSortEvent } from './publisher-sortable.directive';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
  providers: [PublisherService, DecimalPipe]
})
export class PublisherComponent {
  breadCrumbItems!: Array<{}>;
  publisherList: any[] = [];
  currentPage = 1;
  totalPages = 0;
  isEditMode = false;
  publisherId: string = '';
  acronym: string = '';

  submitButtonClicked = false;
  sortColumn = 'acronym'; // default sort column
  sortOrder = 'asc';
  Id: any;
  publisherName: string = '';
  publisherForm!: UntypedFormGroup;
  totalRecords: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  searchTerm: string = "";
  pagedItems: any[] = [];
  pageSizeOptions: number[] = [6, 12, -1];
  pageSize: number = this.pageSizeOptions[0];
  pages: number[] = [];
  menuAccess: any = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false
  }
  isprogressLoading:boolean=false;

  Rolename: string | null = '';


  constructor(private apiService: ApiService, private sweetalert: SweetAlertService, private formBuilder: UntypedFormBuilder,
    public service: PublisherService) {

  }
  ngOnInit(): void {
    this.isprogressLoading=false;
    this.breadCrumbItems = [
      { label: 'Settings', active: true },
      { label: 'Publisher', active: true }
    ];
    this.getPublishers();
    this.fetchData();
    this.getRoleTableData();
    this.publisherForm = this.formBuilder.group({
      Id: [''], // Assuming Id is part of your form
      acronym: ['', [Validators.required]],
      publisherName: ['', [Validators.required]],

    });
    setTimeout(() => {
      this.isprogressLoading = true;
    }, 300);
  }

  get f() { return this.publisherForm.controls; }
  fetchData(): void {
    // Fetch your data (this.publisherList) from your API or service
    // Once data is fetched, calculate total pages and initialize pages array
    // Example:
    this.totalPages = this.pageSize === -1 ? 1 : Math.ceil(this.publisherList.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  getRoleTableData(): void {
    this.Rolename = localStorage.getItem('userRole');

    //this.menuList = [];
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.Rolename}&parentmenuid=9&childmenuid=57`).subscribe(
      (response) => {
        this.menuAccess.canView = response.canview;
        this.menuAccess.canAdd = response.caninsert;
        this.menuAccess.canUpdate = response.canupdate;
        this.menuAccess.canDelete = response.candelete;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  onSearchKeyUp(searchTerm: string): void {
    console.log(searchTerm);
    this.currentPage = 1;
    this.searchTerm = searchTerm;
    this.pagedItems = this.filteredItems();
    console.log(this.pagedItems);
    this.resetPagination();
  }
  filterByText(item: any): boolean {
    const includedColumns = ['PublisherName', 'Acronym']; // Add the column names you want to include in the filter
    // Filter by text box input for included columns only
    if (!this.searchTerm) {
      return true; // No filter applied
    }

    // Check if any of the included columns contains the search term (string or number)
    for (let key in item) {
      if (item.hasOwnProperty(key) && !includedColumns.includes(key)) {
        const value = item[key];
        if (typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          return true;
        } else if (typeof value === 'number' && value.toString().includes(this.searchTerm)) {
          return true;
        }
      }
    }

    return false;
  }


  filteredItems(): any[] {
    const pageSizeNumber = + this.pageSize;



    if (pageSizeNumber === -1) {

      this.endIndex == this.publisherList.length;

      return this.publisherList.filter(item => this.filterByText(item));

    }
    else {
      const startIndex = (this.currentPage - 1) * pageSizeNumber;
      const endIndex = startIndex + pageSizeNumber;

      this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
      let pubList = this.publisherList.filter(item => this.filterByText(item)).slice(startIndex, endIndex);
      this.endIndex = ((this.currentPage) * (this.pageSize));

      if (this.endIndex > this.publisherList.length) {
        this.endIndex = ((this.currentPage - 1) * (this.pageSize)) + (pubList.length);
      }

      if (pubList.length < this.pageSize) {
        this.endIndex = pubList.length;
      }

      return this.publisherList.filter(item =>
        this.filterByText(item))
        .slice(startIndex, endIndex);
    }

  }

  onPageSizeChange(): void {

    this.resetPagination();
    this.currentPage = 1;
    if (this.pageSize === -1) {
      this.endIndex == this.publisherList.length;
      this.pagedItems = this.filteredItems();
    }
    else {
      this.pagedItems = this.filteredItems().slice(0, this.pageSize);
    }

  }

  resetPagination(): void {
    this.currentPage = 1;
    const filteredItems = this.filteredItems();
    this.pagedItems = filteredItems.slice(0, this.pageSize === -1 ? filteredItems.length : this.pageSize);
    this.calculatePages();
  }

  calculatePages(): void {
    this.pages = [];
    let totalItems = this.publisherList.length;
    if (this.searchTerm != '') {
      totalItems = this.filteredItems().length;
    }
    let totalPages = Math.ceil(totalItems / this.pageSize);

    for (let i = 1; i <= totalPages; i++) {
      this.pages.push(i);
      // Fix: Log the value of 'i' instead of 'this.pages'
    }
  }
  resetFilters() {
    this.pageSize = this.pageSizeOptions[0]; // Set the default page size

    // Other filter-related variables can be reset here
    this.searchTerm = '';
    this.onPageSizeChange(); // Apply changes

  }


  onPageChange(page: number): void {
    if (this.pageSize === 0) {
      return; // Do nothing for the "Select" option
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
  }

  getDisplayedData() {


    const pageSizeNumber = + this.pageSize;

    if (this.pageSize === -1) {

      return this.publisherList; // Display all items
    } else {

      const startIndex = (this.currentPage - 1) * pageSizeNumber;
      const endIndex = Math.min(startIndex + pageSizeNumber, this.publisherList.length);

      return this.publisherList.slice(startIndex, endIndex);
    }
  }


  submitPubData(id: any): void {

    console.log("submit triggered");

    if (this.publisherForm.valid) {
      if (!id) {
        console.log('Performing addKPIData');
        this.addUserData();
      } else {
        console.log('Performing updateKPIData with id:', id);
        this.updateUserData(id);
        this.publisherForm.get('acronym')?.markAsTouched();
        this.publisherForm.get('publisherName')?.markAsTouched();

      }
    }

    else {
      // If the form is invalid, mark all fields as touched to display validation messages
      this.publisherForm.markAllAsTouched();
    }

  }
  addUserData(): void {

    const formData = this.publisherForm.value;
    formData.Id = 0;
    console.log(formData);

    this.apiService.postDataWithToken('Publisher/Insert', formData).subscribe(
      (Response) => {

        this.addAlert();
        $('#addUpdatePopUp').modal('hide');
        this.getPublishers();
        this.Id = '';
      },
      (error) => {
        console.error('Error:', error);
      }
    );


  }
  updateUserData(id: any) {

    const formData = this.publisherForm.value;
    formData.Id = id;
    console.log(formData);
    //console.log(biPerformanceMetric);

    this.apiService.UpdateDataWithToken('Publisher/Update', formData).subscribe(
      (Response) => {


        this.updateAlert();
        $('#addUpdatePopUp').modal('hide');
        this.getPublishers();
        this.Id = '';
      },
      (error) => {
        console.error('Error:', error);
      }

    );


  }
  addAlert() {
    Swal.fire({
      title: 'Thank you...',
      text: 'Added succesfully!',
      showConfirmButton: false, icon: 'success', timer: 3000
    });
  }
  updateAlert() {
    Swal.fire({
      title: 'Thank you...',
      text: 'Updated succesfully!',
      showConfirmButton: false, icon: 'success', timer: 3000
    });
  }

  add(id: any = 0): void {
    this.submitButtonClicked = false;
    this.isEditMode = false;
    //this.publisherForm.reset();
    this.clearForm();
    $('#addUpdatePopUp').modal('show');
  }
  edit(id: any): void {
    console.log("edit triggered")
    this.submitButtonClicked = false;
    this.getById(id);
    this.Id = id;
    $('#addUpdatePopUp').modal('show');
    this.isEditMode = true;
  }
  viewItem(id: any): void {
    this.getById(id);
    this.Id = id;
    $('#viewPopUp').modal('show');

  }
  deleteItem(id: any): void {
    this.Id = id;

    this.apiService.GetDataWithToken(`User/KPIDataDisplayById/${id}`).subscribe(
      (KPIData) => {

        $('#delItem').text(`${KPIData.data.acronym + " Publisher's " + KPIData.data.monthYear}`);

      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.apiService.GetDataWithToken(`Publisher/DisplayById/${id}`).subscribe(
      (pubData) => {
        $('#delItem').text(`${pubData.data.acronym}`);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    $('#deletePopUp').modal('show');
  }
  ConfirmDelete(): void {
    $('#deletePopUp').modal('hide');
    this.showSuccess();
  }
  showSuccess() {
    throw new Error('Method not implemented.');
  }

  clearForm() {
    this.publisherForm.reset();
    $('#id').val('');
    $('#publisherName').val('');
    $('#acronym').val('');
    $('#pubcode').val('');
    $('#contactno').val('');
    $('#emailid').val('');
    $('#country').val('');
  }
  closeForm(): void {
    //this.showFormModal = false;
    $('#addUpdatePopUp').modal('hide');
    $('#viewPopUp').modal('hide');
    this.clearForm();
    this.Id = '';
  }
  getPublishers(): void {
    this.apiService.GetDataWithToken('Publisher/Display').subscribe(
      (list) => {

        this.publisherList = list.data;
        this.totalRecords = this.publisherList.length;
        if (this.totalRecords < 6) {
          this.pageSizeOptions = [-1];
        }
        else if (this.totalRecords < 12) {
          this.pageSizeOptions = [6, -1]
        }
        else if (this.totalRecords > 12) {
          this.pageSizeOptions = [6, 12, -1]
        }
        this.pagedItems = this.filteredItems();
        this.calculatePages();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  deleteRoleData(id: any): void {
    //this.showLoader();

    this.apiService.DeleteDataWithToken(`Publisher/DeleteById/${id}`).subscribe(
      (Response) => {
        //console.log(Response);
        this.closeDeletePopUp();
        this.DeletealertWithSuccess();
        this.getPublishers();
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  DeletealertWithSuccess() {
    Swal.fire({
      title: 'Thank you...',
      text: 'Deleted succesfully!',
      showConfirmButton: false, icon: 'success', timer: 4000
    });
  }
  getById(id: any) {
    //this.showLoading();
    this.apiService.GetDataWithToken(`Publisher/DisplayById/${id}`).subscribe(
      (pubData) => {
        //console.log(KPIData.data);
        this.Id = pubData.data.id;

        // $('#acronym').val(pubData.data.acronym);
        // $('#publisherName').val(pubData.data.publisherName);

        this.publisherName = pubData.data.publisherName;
        this.acronym = pubData.data.acronym;


        console.log(pubData.data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    //this.hideLoading();
  }
  isInvalid(controlName: string): boolean {
    const control = this.publisherForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }
  closeDeletePopUp(): void {
    $('#deletePopUp').modal('hide');
  }

  //functions
  ValidateControlData(event: any, controlname: string, validateduplicate: Boolean, validatenumber: Boolean, validatespecial: Boolean, validateemail: Boolean): void {
    const publishcontrolervalue = event.target.value.trim();
    let isDuplicate: any;
    if (publishcontrolervalue) {
      if (controlname == 'acronym') {
        isDuplicate = this.publisherList.findIndex((index: any) =>
          index.acronym.toLowerCase() === publishcontrolervalue.toLowerCase());
      }
      else {
        isDuplicate = this.publisherList.findIndex((index: any) =>
          index.publisherName.toLowerCase() === publishcontrolervalue.toLowerCase());
      }
      if (validateduplicate && isDuplicate !== -1) {
        this.publisherForm.get(controlname)?.setErrors({ duplicate: true });
      }
      else if (validatenumber && /[0-9]/.test(publishcontrolervalue)) {
        this.publisherForm.get(controlname)?.setErrors({ invalidNumber: true });
      }
      else if (validatespecial && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(publishcontrolervalue)) {
        this.publisherForm.get(controlname)?.setErrors({ invalidData: true });
      }
      else {
        this.publisherForm.get(controlname)?.setErrors(null);
      }
    } else {
      this.publisherForm.get(controlname)?.setErrors({ required: true });
    }

  }


  exportExcel() {
    const element = document.getElementById('ExportTable');

    if (element) {
      // Create a worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      // Create a workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Publishers');

      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).replace(/\//g, '');
      const filename = `Publisher_Data_${currentDate}.xlsx`;

      // Save the workbook as an Excel file
      XLSX.writeFile(wb, filename);
    } else {
      console.error('Element not found');
    }
  }


  sort(column: string): void {
    console.log('sort triggered');
    //let sortSet =['asc','desc'];
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder = 'asc';
    }
    this.sortColumn = column;

    this.publisherList.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (this.sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }

  firstPage() {
    let page = 1
    if (this.pageSize === 0) {
      return; // Do nothing for the "Select" option
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);

  }

  lastPage() {
    let page = this.pages[this.pages.length - 1];
    if (this.pageSize === 0) {
      return; // Do nothing for the "Select" option
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
  }

  previousPage() {
    let page = 0;
    if (this.currentPage != 1) {
      page = this.currentPage - 1;
      if (this.pageSize === 0) {
        return; // Do nothing for the "Select" option
      }
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    }

  }

  nextPage() {
    let page = 0;
    if (this.currentPage != this.pages[this.pages.length -1]) {
      page = this.currentPage + 1;
      if (this.pageSize === 0) {
        return; // Do nothing for the "Select" option
      }
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    }

  }

}
