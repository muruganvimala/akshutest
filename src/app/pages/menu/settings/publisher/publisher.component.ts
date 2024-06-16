import { QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PhosphorComponent } from '../../../icons/phosphor/phosphor.component';


import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
declare var $: any;

import { PublisherService } from './publisher.service';
import { PublisherSortableDirective, productSortEvent } from './publisher-sortable.directive';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NoAccessComponent } from 'src/app/shared/no-access/no-access.component';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
  providers: [PublisherService, DecimalPipe, DatePipe]

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
  dataLoaded: boolean = false;

  Rolename: string | null = '';


  constructor(private http: HttpClient,private apiService: ApiService, private sweetalert: SweetAlertService, private formBuilder: UntypedFormBuilder,
    public service: PublisherService, private datePipe: DatePipe) {

  }
  ngOnInit(): void {
    //this.dataLoaded = false;
    // Get the current URL
    const currenturl = new URL(window.location.href).pathname.substring(1);
    setTimeout(() => {
      this.showLoader();
    }, 100);
    this.breadCrumbItems = [
      { label: 'Settings', active: true },
      { label: 'Publisher', active: true }
    ];
    this.getPublishers();
    this.fetchData();
    this.getRoleTableData(currenturl);
    this.publisherForm = this.formBuilder.group({
      Id: [''], // Assuming Id is part of your form
      acronym: ['', [Validators.required]],
      publisherName: ['', [Validators.required]],
    });

    setTimeout(() => {
      this.closeLoader();
    }, 2000);

  }

  get f() { return this.publisherForm.controls; }
  fetchData(): void {
    // Fetch your data (this.publisherList) from your API or service
    // Once data is fetched, calculate total pages and initialize pages array
    // Example:
    this.totalPages = this.pageSize === -1 ? 1 : Math.ceil(this.publisherList.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  getRoleTableData(currenturl:string): void {
    this.Rolename = sessionStorage.getItem('userRole');
    //this.menuList = [];
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.Rolename}&url=${currenturl}`).subscribe(
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
    this.currentPage = 1;
    this.searchTerm = searchTerm;
    this.pagedItems = this.filteredItems();
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



  filteredItems() {
    const pageSizeNumber = +this.pageSize;
    const filteredList = this.publisherList.filter(item => this.filterByText(item));
    let startIndex = 0;
    let endIndex = filteredList.length;
    if (pageSizeNumber !== -1) {
      startIndex = (this.currentPage - 1) * pageSizeNumber;
      endIndex = Math.min(startIndex + pageSizeNumber, filteredList.length);
    }
    this.startIndex = startIndex + 1;
    this.endIndex = endIndex;
    this.updatePaginationControls();
    return filteredList.slice(startIndex, endIndex);
  }

  onPageSizeChange(): void {

    this.resetPagination();
    this.currentPage = 1;
    if (this.pageSize === -1) {
      this.pagedItems = this.filteredItems();
      this.endIndex = this.publisherList.length;
    } else {
      this.pagedItems = this.filteredItems().slice(0, this.pageSize);
      this.calculatePages();
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
    }
    this.updatePaginationControls();

  }
  resetFilters() {
    this.pageSize = this.pageSizeOptions[0]; // Set the default page size

    // Other filter-related variables can be reset here
    this.searchTerm = '';
    this.onPageSizeChange(); // Apply changes

  }


  onPageChange(page: number): void {
    if (this.pageSize === 0) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    this.calculatePages();
  }




  submitPubData(id: any): void {

    console.log("submit triggered");

    if (this.publisherForm.valid) {
      if (!id) {
        console.log('Performing addKPIData');
        this.addUserData();
      } else {
        console.log('Performing updateKPIData with id:', id);

        const currentUserUsername = this.acronym; // Get the current username
        const editedUsername = this.publisherForm.get('acronym')?.value; // Get the edited username from the form
        if (editedUsername && currentUserUsername && editedUsername.toLowerCase() === currentUserUsername.toLowerCase()) {
          // If the edited username matches the current username, proceed with update without checking for duplicates
          console.log('Edited username matches current username, proceeding with update');
          this.updateUserData(id);
        } else {
          // If the edited username is different, proceed with duplicate check
          this.checkForDuplicateUsername(id);
        }
        this.publisherForm.get('acronym')?.markAsTouched();
        this.publisherForm.get('publisherName')?.markAsTouched();

      }
    }

    else {
      // If the form is invalid, mark all fields as touched to display validation messages
      this.submitButtonClicked = true;
      this.publisherForm.markAllAsTouched();
    }

  }
  checkForDuplicateUsername(id: any): void {
    const editedUsername = this.publisherForm.get('acronym')?.value;
    const isDuplicate = this.publisherList.some(user =>
      user.acronym.toLowerCase() === editedUsername.toLowerCase()
    );

    if (isDuplicate) {
      // If a duplicate username is found, display error
      console.log('Duplicate username found');
      this.publisherForm.get('acronym')?.setErrors({ duplicate: true });
    } else {
      // If no duplicate username is found, proceed with update
      console.log('No duplicate username found, proceeding with update');
      this.updateUserData(id);
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
        this.calculatePages();
        this.searchTerm = '';
        this.currentPage = 1;
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
    console.log("edit triggered id " + id);
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
    let oldTotal = this.filteredItems().length;
    this.apiService.DeleteDataWithToken(`Publisher/DeleteById/${id}`).subscribe(
      (Response) => {
        //console.log(Response);
        this.closeDeletePopUp();
        this.DeletealertWithSuccess();
        this.getPublishers();
        this.calculatePages();
        if (oldTotal == 1) {
          this.currentPage = this.pages.length - 1;
        }
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
        this.publisherForm.patchValue
          ({
            Id: pubData.data.id,
            publisherName: pubData.data.publisherName,
            acronym: pubData.data.acronym
          });

        this.Id = pubData.data.id;

        this.publisherName = pubData.data.publisherName;
        this.acronym = pubData.data.acronym;

        console.log(pubData.data);
        this.clearValidation();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    //this.hideLoading();
  }
  clearValidation(): void {
    Object.keys(this.publisherForm.controls).forEach(key => {
      const control = this.publisherForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
      }
    });
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
    const originalValue=this.acronym;
    let isDuplicate: any;
    if (publishcontrolervalue) {
      if (controlname == 'acronym') {
        isDuplicate = this.publisherList.findIndex((index: any) =>
          index.acronym.toLowerCase() === publishcontrolervalue.toLowerCase() && index.acronym.toLowerCase() !== originalValue.toLowerCase());
      }
      else {
        isDuplicate = this.publisherList.findIndex((index: any) =>
          index.publisherName.toLowerCase() === publishcontrolervalue.toLowerCase());
      }


      if (validateduplicate && isDuplicate !== -1) {
        this.publisherForm.get(controlname)?.setErrors({ duplicate: true });
      }
      else if (validatenumber && /^\d+$/.test(publishcontrolervalue)) {
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
    const data: any[] = this.filteredItems().map((item, index) => ({
      'ID': index + 1,
      'Publisher Acronym': item.acronym,
      'Publisher Name': item.publisherName
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'Publisher_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportPdf() {
    const doc = new jsPDF() as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'Publisher Acronym', 'Publisher Name'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.acronym,
        item.publisherName,

      ];
      data.push(rowData);
    });

    // Create the auto table
    doc.autoTable({
      head: [headers], // Header row
      body: data.slice(1) // Data rows (excluding headers)
    });

    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');

    doc.save('Publisher_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.acronym,
        item.publisherName,


      ];
      csvContent += rowData.join(',') + '\n'; // Join row data with commas and add a new line
    });

    // Encode CSV content
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    link.setAttribute('download', 'Publisher_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }
  exportAllExcel() {
    const data: any[] = this.publisherList.map((item, index) => ({
      'ID': index + 1,
      'Publisher Acronym': item.acronym,
      'Publisher Name': item.publisherName
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'Publisher_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportAllPdf() {
    const doc = new jsPDF() as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'Publisher Acronym', 'Publisher Name'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.publisherList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.acronym,
        item.publisherName,

      ];
      data.push(rowData);
    });

    // Create the auto table
    doc.autoTable({
      head: [headers], // Header row
      body: data.slice(1) // Data rows (excluding headers)
    });

    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');

    doc.save('Publisher_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportAllCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.publisherList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.acronym,
        item.publisherName,


      ];
      csvContent += rowData.join(',') + '\n'; // Join row data with commas and add a new line
    });

    // Encode CSV content
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    link.setAttribute('download', 'Publisher_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }
  getCsvHeaders(): string {
    return 'ID,Publisher Acronym,Publisher Name\n';
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
    this.updatePaginationControls();

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
    this.updatePaginationControls();
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
    this.updatePaginationControls();
  }

  nextPage() {
    let page = 0;
    if (this.currentPage != this.pages[this.pages.length - 1]) {
      page = this.currentPage + 1;
      if (this.pageSize === 0) {
        return; // Do nothing for the "Select" option
      }
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    }
    this.updatePaginationControls();

  }

  showLoader(): void {
    $('#loaderAnimation').modal('show');
  }

  closeLoader(): void {

    $('#loaderAnimation').modal('hide');

  }
  updatePaginationControls() {
    const isFirstPage = this.currentPage === this.pages[0];
    const isLastPage = this.currentPage === this.pages[this.pages.length - 1];
    $('#firstPage, #previousPage').toggleClass('disabled', isFirstPage);
    $('#nextPage, #lastPage').toggleClass('disabled', isLastPage);
  }

}
