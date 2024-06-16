import { DatePipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
declare var $: any;
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';

@Component({
  selector: 'app-forex',
  templateUrl: './forex.component.html',
  styleUrls: ['./forex.component.scss'],
  providers: [DecimalPipe, DatePipe]
})
export class ForexComponent {

  breadCrumbItems!: Array<{}>;
  forexList: any[] = [];
  wholeForexList: any[] = [];
  forexData = {
    Id: 0,
    date: Date.now(),
    usdInr: 0,
    gbpInr: 0,
    phpInr: 0,
    usdGbp: 0
  }
  currentPage = 1;
  totalPages = 0;
  isEditMode = false;
  publisherId: string = '';
  //acronym: string = '';

  submitButtonClicked = false;
  sortColumn = 'acronym'; // default sort column
  sortOrder = 'asc';
  Id: any;
  //publisherName: string = '';
  forexForm!: UntypedFormGroup;
  totalRecords: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  searchTerm: string = "";
  //startDate: string = "";
  //endDate: string = "";
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
  isDuplicateDate: boolean = false;
  dataLoaded: boolean = false;
  Rolename: string | null = '';
  //maxDate:any;
  fileData: any;
  file!: File;
  arrayBuffer: any;
  forexValidationList: any[] = [];

  constructor(private apiService: ApiService, private formBuilder: UntypedFormBuilder, private datePipe: DatePipe,
    private sweetAlert: SweetAlertService
  ) {
  }
  ngOnInit(): void {
    const currenturl = new URL(window.location.href).pathname.substring(1);
    setTimeout(() => {
      this.showLoader();
    }, 100);
    this.breadCrumbItems = [
      { label: 'Finance', active: true },
      { label: 'Forex', active: true }
    ];
    this.getForexList();
    this.fetchData();
    this.getRoleTableData(currenturl);

    this.forexForm = this.formBuilder.group({
      Id: [''],
      date: ['', Validators.required],
      usdInr: [0, [Validators.required]],
      gbpInr: [0, [Validators.required]],
      phpInr: [0, [Validators.required]],
      usdGbp: [0, [Validators.required]]
    });

    setTimeout(() => {
      this.closeLoader();
    }, 2000);

    $("#sampleExcelData").hide();
    $("#sampleImportMsg").hide();

  }

  get f() { return this.forexForm.controls; }
  fetchData(): void {
    this.totalPages = this.pageSize === -1 ? 1 : Math.ceil(this.forexList.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getRoleTableData(currenturl: string): void {
    this.Rolename = sessionStorage.getItem('userRole');

    //this.menuList = [];
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.Rolename}&&url=${currenturl}`).subscribe(
      (response) => {
        this.menuAccess.canView = response.canview;
        this.menuAccess.canAdd = response.caninsert;
        this.menuAccess.canUpdate = response.canupdate;
        this.menuAccess.canDelete = response.candelete;
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get UserAccess details', error.message);
      }
    );
  }

  submitRange() {
    let range = {
      startDate: $('#startDate').val(),
      endDate: $('#endDate').val()
    }

    this.apiService.postDataWithToken('api/forex/range', range).subscribe(
      (Response) => {
        this.forexList = Response.data.map((item: { date: string | number | Date; }) => ({
          ...item, // Copy all existing properties
          date: this.datePipe.transform(item.date, 'dd-MM-yyyy') // Transform and replace the date property
        }));
        //this.HideFilter();

        this.totalRecords = this.forexList.length;
        this.pagedItems = this.filteredItems();
        this.calculatePages();
        console.log(this.forexList);
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to filter forex', error.message);
      }
    );

  }

  filterByText(item: any): boolean {
    const includedColumns = [''];
    if (!this.searchTerm) {
      return true;
    }
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
    const filteredList = this.forexList.filter(item => this.filterByText(item));
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
      this.endIndex = this.forexList.length;
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
    let totalItems = this.forexList.length;

    let totalPages = Math.ceil(totalItems / this.pageSize);
    for (let i = 1; i <= totalPages; i++) {
      this.pages.push(i);
    }
    this.updatePaginationControls();

  }
  resetFilters() {
    $('#startDate').val('');
    $('#endDate').val('');
    this.getForexList();
    this.HideFilter();
    this.pageSize = this.pageSizeOptions[0]; // Set the default page size

    // Other filter-related variables can be reset here
    //this.startDate = '';
    //this.endDate = '';
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




  submitForexData(id: any): void {

    console.log("submit triggered");

    if (this.forexForm.valid) {
      if (!id) {
        console.log('Performing add Forex Data');

        this.addForexData();
      } else {
        console.log('Performing update Forex Data with id:', id);
        this.updateForexData(id);
      }
    }

    else {
      // If the form is invalid, mark all fields as touched to display validation messages
      this.submitButtonClicked = true;
      this.forexForm.markAllAsTouched();

    }

  }

  checkDuplicate(event: any) {
    let selectedDate = event.target.value;
    let formattedDate = selectedDate.split('-').reverse().join('-');
    let isDuplicate = this.forexList.some(item => item.date === formattedDate);
    if (isDuplicate) {
      console.log(formattedDate + ' duplicate status ' + isDuplicate);
      console.log(" duplicate date not found ");
      this.isDuplicateDate = true;
    }
    else {
      console.log(formattedDate + ' duplicate status ' + isDuplicate);
      console.log(" duplicate date found ");
      this.isDuplicateDate = false;
    }
  }



  addForexData(): void {
    const formData = this.forexForm.value;
    //formData.date = this.datePipe.transform(formData.date, 'dd-MM-yyyy');
    formData.Id = 0;
    console.log(formData);

    this.apiService.postDataWithToken('api/forex/insert', formData).subscribe(
      (Response) => {
        this.addAlert();
        $('#addUpdatePopUp').modal('hide');
        this.getForexList();
        this.Id = '';
        this.calculatePages();
        //this.startDate = '';
        //this.endDate = '';
        this.currentPage = 1;
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to add forex data', error.message);
      }
    );
  }


  updateForexData(id: any) {
    console.log('update function called with ' + id);
    const formData = this.forexForm.value;
    formData.Id = id;
    console.log(formData);
    this.apiService.UpdateDataWithToken('api/forex/update', formData).subscribe(
      (Response) => {
        this.updateAlert();
        $('#addUpdatePopUp').modal('hide');
        this.getForexList();
        this.Id = '';
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert(`Unable to update forex data with id ${id}`, error.message);
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
  importAlert() {
    Swal.fire({
      title: 'Thank you...',
      text: 'File imported succesfully!',
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
    $(".duplicateDate").hide();
    this.submitButtonClicked = false;
    this.isEditMode = false;
    this.clearForm();
    $("#date").prop('disabled', false);
    $('#addUpdatePopUp').modal('show');
    this.Id = '';
    //const now = new Date();
    //const currentDate = now.toISOString().split('T')[0];
    //$('#date').val(currentDate);

  }

  edit(id: any): void {

    console.log("edit triggered id " + id);
    this.submitButtonClicked = false;
    this.getById(id);
    this.Id = id;
    $("#date").prop('disabled', true);
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
    this.forexForm.reset();
    this.isDuplicateDate = false;
  }
  closeForm(): void {
    //this.showFormModal = false;
    $('#addUpdatePopUp').modal('hide');
    $('#viewPopUp').modal('hide');
    this.clearForm();
    this.Id = '';
  }

  getForexList(): void {
    this.apiService.GetDataWithToken('api/forex/display').subscribe(
      (list) => {
        // Assume each item in list.data has a date property you want to transform
        this.forexList = list.data.map((item: { date: string | number | Date; }) => ({
          ...item, // Copy all existing properties
          date: this.datePipe.transform(item.date, 'dd-MM-yyyy') // Transform and replace the date property
        }));
        this.wholeForexList = list.data.map((item: { date: string | number | Date; }) => ({
          ...item,
          date: this.datePipe.transform(item.date, 'dd-MM-yyyy') // Transform and replace the date property
        }));

        this.totalRecords = this.forexList.length;
        this.pagedItems = this.filteredItems();
        this.calculatePages();
        console.log(this.forexList);
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get forex data', error.message);
      }
    );
  }

  deleteForexData(id: any): void {
    //this.showLoader();
    let oldTotal = this.filteredItems().length;
    this.apiService.DeleteDataWithToken(`api/forex/deletebyid/${id}`).subscribe(
      (Response) => {
        //console.log(Response);
        this.closeDeletePopUp();
        this.DeletealertWithSuccess();
        this.getForexList();
        this.calculatePages();
        if (oldTotal == 1) {
          this.currentPage = this.pages.length - 1;
        }
      },
      (error) => {
        console.error('Error', error);
        this.sweetAlert.failureAlert(`Unable to delete forex with id ${id}`, error.message);
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
    this.apiService.GetDataWithToken(`api/forex/displaybyid/${id}`).subscribe(
      (frxData) => {
        const date = new Date(frxData.data.date);
        const formattedDate = [
          date.getFullYear(),
          ('0' + (date.getMonth() + 1)).slice(-2), // Months are 0-based
          ('0' + date.getDate()).slice(-2) // Pad single digits with leading 0
        ].join('-');
        this.forexForm.patchValue
          ({
            Id: frxData.data.id,
            date: formattedDate,
            usdInr: frxData.data.usdInr,
            gbpInr: frxData.data.gbpInr,
            phpInr: frxData.data.phpInr,
            usdGbp: frxData.data.usdGbp
          });

        this.Id = frxData.data.id;
        this.forexData.Id = frxData.data.id;
        this.forexData.date = frxData.data.date;
        this.forexData.usdInr = frxData.data.usdInr;
        this.forexData.gbpInr = frxData.data.gbpInr;
        this.forexData.phpInr = frxData.data.phpInr;
        this.forexData.usdGbp = frxData.data.usdGbp;
        //this.clearValidation();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert(`Unable to get forex with id ${id}`, error.message);
      }
    );
    //this.hideLoading();
  }
  clearValidation(): void {
    Object.keys(this.forexForm.controls).forEach(key => {
      const control = this.forexForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.forexForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }
  closeDeletePopUp(): void {
    $('#deletePopUp').modal('hide');
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return [
      ('0' + date.getDate()).slice(-2),
      ('0' + (date.getMonth() + 1)).slice(-2),
      date.getFullYear(),
    ].join('-');
  }

  exportExcel() {
    const data: any[] = this.filteredItems().map((item, index) => ({
      'ID': index + 1,
      //'Forex Date': this.formatDate(item.date),
      'Forex Date': item.date,
      'USD / INR': item.usdInr,
      'GBP / INR': item.gbpInr,
      'PHP / INR': item.phpInr,
      'USD / GBP': item.usdGbp
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'Forex_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportPdf() {
    const doc = new jsPDF() as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'Forex Date', 'USD / INR', 'GBP / INR', 'PHP / INR', 'USD / GBP'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.date,
        item.usdInr,
        item.gbpInr,
        item.phpInr,
        item.usdGbp

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

    doc.save('Forex_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.date,
        item.usdInr,
        item.gbpInr,
        item.phpInr,
        item.usdGbp
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
    link.setAttribute('download', 'Forex_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }

  exportAllExcel() {
    const data: any[] = this.wholeForexList.map((item, index) => ({
      'ID': index + 1,
      'Forex Date': item.date,
      'USD / INR': item.usdInr,
      'GBP / INR': item.gbpInr,
      'PHP / INR': item.phpInr,
      'USD / GBP': item.usdGbp
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'Forex_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportAllPdf() {
    const doc = new jsPDF() as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'Forex Date', 'USD / INR', 'GBP / INR', 'PHP / INR', 'USD / GBP'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.wholeForexList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.date,
        item.usdInr,
        item.gbpInr,
        item.phpInr,
        item.usdGbp
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

    doc.save('Forex_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportAllCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.wholeForexList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.date,
        item.usdInr,
        item.gbpInr,
        item.phpInr,
        item.usdGbp
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
    link.setAttribute('download', 'Forex_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }
  getCsvHeaders(): string {
    return 'ID,Forex Date,USD/INR,GBP/INR,PHP/INR,USD/GBP\n';
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

    this.forexList.sort((a, b) => {
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

  onFileChange(evt: any) {
    this.file = evt.target.files[0];
    if (this.file) {
      $("#uploadBtn").prop('disabled', false);
    }
    if (!this.file) {
      $("#uploadBtn").prop('disabled', true);
    }
  }

  validateExcel(): void {
    if (this.file) {
      this.apiService.uploadExcelFile('api/forex/validateexcel', this.file).subscribe(
        response => {
          console.log('File uploaded successfully', response);
          this.forexValidationList = response.data;
          $("#excelData").show();
          let isCorrectExcel = this.forexValidationList.some(obj => obj.action === false);
          if (!isCorrectExcel) {
            $("#importBtn").prop('disabled', false);
            $("#excelErrMsg").hide();
            $("#sampleExcelData").hide();
            $("#sampleImportMsg").hide();
          }
          if (isCorrectExcel) {
            $("#importBtn").prop('disabled', true);
            $("#excelErrMsg").show();
            $("#sampleExcelData").hide();
            $("#sampleImportMsg").hide();
          }
        },
        error => {
          console.error('Failed to upload file', error);
        }
      );
    } else {
      alert('Please select a file first.');
    }
  }

  getSampleExcelMsg(){
    $("#sampleExcelData").show();
    $("#sampleImportMsg").show();
  }

  getSampleTemplate() {
    const headers = [
      'ID',
      'Forex Date',
      'USD / INR',
      'GBP / INR',
      'PHP / INR',
      'USD / GBP'
    ];
  
    // Create a headers-only array
    const dataToExport = [headers];
  
    // Generate worksheet and workbook
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Format the date and export the file
    const myDate = new Date();
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy');
    XLSX.writeFile(wb, 'Forex_Data_' + formattedDate + '.xlsx');
  }

  importExceltoDb() {
    let isCorrectExcel = this.forexValidationList.some(obj => obj.action === false);
    if (!isCorrectExcel) {
      this.apiService.postDataWithToken('api/forex/bulkinsert', this.forexValidationList).subscribe(
        (Response) => {
          this.importAlert();
          this.hideImportExcel();
          this.getForexList();
          this.Id = '';
          this.calculatePages();
          this.currentPage = 1;
        },
        (error) => {
          console.error('Error:', error);
          this.sweetAlert.failureAlert('Unable to Import forex data', error.message);
        }
      );

    }
    else {

      this.sweetAlert.failureAlert('Unable to Import forex data', 'Please check the uploaded excel');
    }
  }

  showImportExcel() {
    $('#addUpdatePopUp').modal('hide');
    $('#ImportExcelPopUp').modal('show');
    $('#toBeImportedData').modal('hide');
    $("#uploadBtn").prop('disabled', true);
    $("#importBtn").prop('disabled', true);
    $("#excelData").hide();
    $("#excelErrMsg").hide();
    $("#fileInput").val("");
    $("#sampleExcelData").hide();
    $("#sampleImportMsg").hide();
  }

  hideImportExcel() {
    $('#ImportExcelPopUp').modal('hide');
  }

  ImportExcelData() {
    $('#ImportExcelPopUp').modal('hide');
  }

  ShowFilter() {
    $('#filterForm').addClass('show');
  }
  HideFilter() {
    $('#filterForm').removeClass('show');
  }

}