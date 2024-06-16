import { Component, QueryList, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as jQuery from 'jquery';

import { UserService } from './user.service';
import { userModel } from './user.model';


import { IlistSortEvent, UserSortableDirective } from './user-sortable.directive';
// Data Get


import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

import Swal from 'sweetalert2';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { filter } from 'lodash';



declare var $: any;


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, DecimalPipe, DatePipe]
})
export class UserComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  searchTerm: string = "";
  userList: any[] = [];
  userList1!: Observable<userModel[]>;
  selectedRoleId: string = '';
  roleList: { roleId: string, roleName: string }[] = [];
  currentPage = 1;
  totalPages = 0;
  totalRecords: number = 0;
  isEditMode = false;
  publisherId: string = '';
  acronym: string = '';
  monthYear: string = '';
  isDuplicate: boolean = false;
  startIndex: number = 0;
  endIndex: number = 0;
  pageSizeOptions: number[] = [6, 12, -1];
  pageSize: number = this.pageSizeOptions[0];
  pages: number[] = [];
  sortColumn = 'username'; // default sort column
  sortOrder = 'asc';
  filteredUserList: userModel[] = [];
  pagedItems: any[] = [];
  submitButtonClicked: boolean = false;
  needToActionId: any;
  Id: string = '';
  firstname: string = '';
  lastname: string = '';
  username: string = '';
  displayname: string = '';
  signature: string = '';
  emailid: string = '';
  userrole: string = '';
  password: string = '';
  formrolename: string = '';
  activestatus: boolean = false;
  userForm!: UntypedFormGroup;
  // invoices: any[]=[];
  total: Observable<number>;
  invoiceCard: any;
  filteredList: any[] = [];
  // Initialize the debounce time for column filter changes
  private columnFilterDebounceTime: number = 300;
  selectedRows: Set<userModel> = new Set<userModel>();
  selectedColumns: Set<string> = new Set<string>();
  selectedRoleName: string = "";
  menuAccess: any = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false
  }
  //isprogressLoading: boolean = false;
  totalFilteredItems: number = 0;

  Rolename: string | null = '';
  @ViewChildren(UserSortableDirective) headers!: QueryList<UserSortableDirective>;

  constructor(private http: HttpClient,private apiService: ApiService, private sweetalert: SweetAlertService,
    private formBuilder: UntypedFormBuilder, public service: UserService, private datePipe: DatePipe) {
    this.userList1 = service.countries$;
    this.total = service.total$;

  }
  loading = true;
  ngOnInit(): void {
    // Get the current URL
    const currenturl = new URL(window.location.href).pathname.substring(1);
    //this.isprogressLoading = false;
    setTimeout(() => {
      this.showLoader();
    }, 100);

    this.breadCrumbItems = [
      { label: 'Settings', active: true },
      { label: 'User', active: true }
    ];


    // Fetch Data
    // setTimeout(() => {
    //   this.userList1.subscribe(x => {
    //     this.userList = Object.assign([], x);

    //     document.getElementById('elmLoader')?.classList.add('d-none');

    //   });


    // }, 1000);
    this.getRoleTableData(currenturl);
    this.getUserList();
    this.getUserRoleList();
    this.initForm();
    this.loading = false;
    setTimeout(() => {
      this.closeLoader();
    }, 2000);

  }


  /**
   * Form Validation
   */
  initForm() {
    this.userForm = this.formBuilder.group({
      Id: [''], // Assuming Id is part of your form
      username: ['', [Validators.required]],
      displayname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      userrole: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: [''], // Define other form controls here
      signature: [''],
      emailid: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      activestatus: [false] // Assuming activestatus is a checkbox
    });
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
    const includedColumns = ['username','displayname', 'emailid'];
    // Add the column names you want to include in the filter
    // Filter by text box input for included columns only
    if (!this.searchTerm) {
      return true; // No filter applied
    }

    // Check if any of the included columns contains the search term (string or number)
    for (let key in item) {
      if (item.hasOwnProperty(key) && includedColumns.includes(key)) {
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
    const filteredList = this.userList.filter(item => this.filterByText(item));
    
    // Update totalFilteredItems with the count of filtered items
    this.totalFilteredItems = filteredList.length;
  
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
      this.endIndex = this.userList.length;
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
  
    // Use totalFilteredItems for the total items count
    let totalPages = Math.ceil(this.totalFilteredItems / this.pageSize);
    
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

  sort(column: string): void {
    console.log('sort triggered');
    //let sortSet =['asc','desc'];
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder = 'asc';
    }
    this.sortColumn = column;

    this.userList.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (this.sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }

  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }


  get f() { return this.userForm.controls; }

  openEnd() {
    document.getElementById('courseFilters')?.classList.add('show')
    document.querySelector('.backdrop3')?.classList.add('show')
  }

  closeoffcanvas() {
    document.getElementById('courseFilters')?.classList.remove('show')
    document.querySelector('.backdrop3')?.classList.remove('show')
  }


  // Function to handle filtering based on active status
  submitFilter() {
    // Get the selected role name from the dropdown
    this.selectedRoleName = $('#roleFilter').val();

    if (this.selectedRoleName !== "") {
      // Filter the userList based on the selected role name
      this.filteredList = this.userList.filter(user => user.userrole === this.selectedRoleName);
      console.log(this.selectedRoleName);
      console.log(this.filteredList);
      // Further actions with filteredList if needed
    }

    console.log("submit filter triggered selected role " + this.selectedRoleName);
  }

  getUserRoleList(): void {
    this.apiService.GetDataWithToken('Rolemaster/Display').subscribe(
      (list) => {
        this.roleList = list.data;
        console.log(this.roleList)
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  deleteItem(id: any): void {
    this.needToActionId = id;

    this.apiService.GetDataWithToken(`Usermaster/DisplayById/${id}`).subscribe(
      (userData) => {

        $('#delItem').text(`${userData.data.firstname + " / " + userData.data.displayname}`);
        this.Id = userData.data.id;

        this.firstname = userData.data.firstname;
        this.lastname = userData.data.lastname;
        this.username = userData.data.username;
        this.emailid = userData.data.emailid;
        this.userrole = userData.data.userrole;
        this.activestatus = userData.data.activestatus;
        this.displayname = userData.data.displayname;
        this.signature = userData.data.signature;
        this.password = userData.data.password;
        console.log(userData.data);

      },
      (error) => {
        console.error('Error:', error);
      }
    );

    $('#deletePopUp').modal('show');

  }
  getUserList(): void {
    this.apiService.GetDataWithToken('Usermaster/Display').subscribe(
      (list) => {
        this.userList = list.data;
        this.totalRecords = this.userList.length;
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

    this.apiService.DeleteDataWithToken(`Usermaster/DeleteById/${id}`).subscribe(
      (Response) => {
        //console.log(Response);
        this.closeDeletePopUp();
        this.sweetalert.DeletealertWithSuccess();
        this.getUserList();
        this.calculatePages();
        this.searchTerm = '';
        this.currentPage = this.pages[this.pages.length - 1];
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  updateUserData(id: any) {
    this.needToActionId = id;
    const formData = this.userForm.value;
    formData.Id = id;

    this.apiService.UpdateDataWithToken('Usermaster/Update', formData).subscribe(
      (Response) => {
        this.sweetalert.updateAlert();
        $('#addUpdatePopUp').modal('hide');
        this.getUserList();
        this.Id = '';
      },
      (error) => {
        console.error('Error:', error);
      }

    );


  }
  addUserData(): void {

    const formData = this.userForm.value;
    formData.Id = 0;
    console.log(formData);
    this.apiService.postDataWithToken('Usermaster/Insert', formData).subscribe(
      (Response) => {

        this.sweetalert.addAlert();
        $('#addUpdatePopUp').modal('hide');
        this.clearForm();
        this.getUserList();
        this.Id = '';
        this.calculatePages();
        this.searchTerm = '';

      },
      (error) => {
        console.error('Error:', error);
      }
    );


  }
  getById(id: any) {
    //this.showLoading();
    this.apiService.GetDataWithToken(`Usermaster/DisplayById/${id}`).subscribe(
      (userData) => {
        console.log(userData.data);
        const user = userData.data;
        this.userForm.patchValue({
          Id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          emailid: user.emailid,
          userrole: user.userrole,
          activestatus: user.activestatus,
          displayname: user.displayname,
          signature: user.signature,
          password: user.password,
        });
        this.firstname = user.firstname,
          this.lastname = user.lastname,
          this.username = user.username,
          this.emailid = user.emailid,
          this.userrole = user.userrole,
          this.activestatus = user.activestatus,
          this.displayname = user.displayname,
          this.signature = user.signature,
          this.password = user.password,
          this.formrolename = this.getRoleName(user.userrole),
          console.log(this.formrolename)
        this.activestatus = user.activestatus,
          this.clearValidation();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    //this.hideLoading();
  }
  clearValidation(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
      }
    });
  }

  getRoleName(roleId: number | string): string {
    const selectedRole = this.roleList.find(role => String(role.roleId) === String(roleId));
    return selectedRole ? selectedRole.roleName : '';
  }




  viewItem(id: any): void {
    this.getById(id);
    $('#viewPopUp').modal('show');
  }
  add(id: any): void {
    this.submitButtonClicked = false;
    this.isEditMode = false;
    //this.showFormModal = true;
    this.clearForm();
    $('#addUpdatePopUp').modal('show');
  }
  edit(id: any): void {
    this.Id = id;
    console.log("edit triggered")
    this.submitButtonClicked = false;
    this.getById(id);
    $('#addUpdatePopUp').modal('show');
    this.isEditMode = true;
  }


  ConfirmDelete(): void {
    $('#deletePopUp').modal('hide');
    this.showSuccess();
  }
  showSuccess() {
    throw new Error('Method not implemented.');
  }

  clearForm() {
    this.userForm.reset();
    this.Id = '';
    this.firstname = '';
    this.lastname = '';
    this.username = '';
    this.emailid = '';
    this.userrole = '';
    this.displayname = '';
    this.signature = '';
    this.activestatus = false;
    this.password = '';
    this.isDuplicate = false;


  }
  closeForm(): void {
    //this.showFormModal = false;
    $('#addUpdatePopUp').modal('hide');
    $('#viewPopUp').modal('hide');
    this.clearForm();
    this.Id = '';
  }

  closeDeletePopUp(): void {
    $('#deletePopUp').modal('hide');
  }

  submitUserData(id: any): void {
    console.log("submit triggerd")
    // Check if the form is valid
    if (this.userForm.valid) {
      if (!id) {
        console.log('Performing add user');
        this.addUserData();
      } else {
        console.log('Performing update user with id:', id);
        console.log('Performing update user with id:', id);

        const currentUserUsername = this.username; // Get the current username
        const editedUsername = this.userForm.get('username')?.value; // Get the edited username from the form
        if (editedUsername && currentUserUsername && editedUsername.toLowerCase() === currentUserUsername.toLowerCase()) {
          // If the edited username matches the current username, proceed with update without checking for duplicates
          console.log('Edited username matches current username, proceeding with update');
          this.updateUserData(id);
        } else {
          // If the edited username is different, proceed with duplicate check
          this.checkForDuplicateUsername(id);
        }



        this.userForm.get('firstname')?.markAsTouched();
        this.userForm.get('username')?.markAsTouched();
        this.userForm.get('displayname')?.markAsTouched();
        this.userForm.get('password')?.markAsTouched();
        this.userForm.get('userrole')?.markAsTouched();
        this.userForm.get('emailId')?.markAsTouched();
      }

    } else {
      // If the form is invalid, mark all fields as touched to display validation messages
      this.submitButtonClicked = true;
      this.userForm.markAllAsTouched();
    }
  }
  checkForDuplicateUsername(id: any): void {
    const editedUsername = this.userForm.get('username')?.value;
    const isDuplicate = this.userList.some(user =>
      user.username.toLowerCase() === editedUsername.toLowerCase()
    );

    if (isDuplicate) {
      // If a duplicate username is found, display error
      console.log('Duplicate username found');
      this.userForm.get('username')?.setErrors({ duplicate: true });
    } else {
      // If no duplicate username is found, proceed with update
      console.log('No duplicate username found, proceeding with update');
      this.updateUserData(id);
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }



  //to check dupliacte
  checkUserNameExistence(event: any): void {
    const username = event.target.value.trim();
    if (username) {
      const index = this.userList.findIndex((user: any) =>
        user.username.toLowerCase() === username.toLowerCase()
      );
      if (index !== -1) {
        this.userForm.get('username')?.setErrors({ duplicate: true });
      } else {
        this.userForm.get('username')?.setErrors(null);
      }
    } else {
      this.userForm.get('username')?.setErrors({ required: true });
    }
  }
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };
  //functions
  ValidateControlData(event: any, controlname: string, validateduplicate: Boolean, validatenumber: Boolean, validatespecial: Boolean, validateemail: Boolean): void {
    const controlName = event.target.value.trim();

    const originalValue = this.username;
    if (controlName) {
      if (validateduplicate && controlname === 'username') {
        const isDuplicate = this.userList.some((user: any) =>
          user.username.toLowerCase() === controlName.toLowerCase() && user.username.toLowerCase() !== originalValue.toLowerCase()
        );

        if (isDuplicate) {
          this.userForm.get(controlname)?.setErrors({ duplicate: true });
          return; // Exit the function early if duplicate found
        }
      }
      else if (validatenumber && /^\d+$/.test(controlName)) {
        this.userForm.get(controlname)?.setErrors({ invalidNumber: true });
      }
      else if (validatespecial && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(controlName)) {
        this.userForm.get(controlname)?.setErrors({ invalidData: true });
      }
      else if (validateemail && !this.isValidEmail(controlName)) {
        this.userForm.get(controlname)?.setErrors({ invalidEmail: true });
      }
      else {
        this.userForm.get(controlname)?.setErrors(null);
      }
    } else {
      this.userForm.get(controlname)?.setErrors({ required: true });
    }
  }


  isValidEmail(email: string): boolean {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  exportExcel() {
    const data: any[] = this.filteredItems().map((item, index) => ({
      'ID': index + 1,
      'First Name': item.firstname,
      'Last Name': item.lastname,
      'User Name': item.username,
      'Display Name': item.displayname,
      'Signature': item.signature,
      'Email Id': item.emailid,
      'Password': item.password = "********",
      'User Role': item.userrole,
      'Active Status': item.activestatus ? 'Active' : 'Inactive'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'User_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportPdf() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    }) as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'First Name', 'Last Name', 'User Name', 'Display Name', 'Signature', 'Email Id', 'Password', 'User Role', 'Active Status'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.firstname,
        item.lastname,
        item.username,
        item.displayname,
        item.signature,
        item.emailid,
        item.password = "*******",
        item.userrole,
        item.activestatus ? 'Active' : 'Inactive'
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

    doc.save('User_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.firstname,
        item.lastname,
        item.username,
        item.displayname,
        item.signature,
        item.emailid,
        item.password = "********",
        item.userrole,
        item.activestatus ? 'Active' : 'Inactive'
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
    link.setAttribute('download', 'User_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }

  getCsvHeaders(): string {
    return 'ID,First Name,Last Name,User Name,Display Name,Signature,Email Id,Password,User Role,Active Status\n';
  }

  exportAllExcel() {
    const data: any[] = this.userList.map((item, index) => ({
      'ID': index + 1,
      'First Name': item.firstname,
      'Last Name': item.lastname,
      'User Name': item.username,
      'Display Name': item.displayname,
      'Signature': item.signature,
      'Email Id': item.emailid,
      'Password': item.password = "********",
      'User Role': item.userrole,
      'Active Status': item.activestatus ? 'Active' : 'Inactive'


    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'User_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportAllPdf() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    }) as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'First Name', 'Last Name', 'User Name', 'Display Name', 'Signature', 'Email Id', 'Password', 'User Role', 'Active Status'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.userList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.firstname,
        item.lastname,
        item.username,
        item.displayname,
        item.signature,
        item.emailid,
        item.password = "*******",
        item.userrole,
        item.activestatus ? 'Active' : 'Inactive'
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

    doc.save('User_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportAllCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.userList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.firstname,
        item.lastname,
        item.username,
        item.displayname,
        item.signature,
        item.emailid,
        item.password = "********",
        item.userrole,
        item.activestatus ? 'Active' : 'Inactive'
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
    link.setAttribute('download', 'User_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }

  columnDefinitions: any[] = [
    {
      id: 'id',
      def: 'Id',
      label: 'Id',
      visible: false,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: true,
      isLink: true,
      isExternal: false,
    },
    {
      def: 'acronym',
      label: 'Publisher',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'monthYear',
      label: 'Month Year',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'overallPerformance',
      label: 'Overall Performance',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'schedule',
      label: 'Schedule',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'Quantity',
      label: 'Quantity',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'communication',
      label: 'Communication',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'customerSatisfaction',
      label: 'Customer Satisfaction',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'accountManagement',
      label: 'Account Management',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },


  ];

  normalizeValue(value: string): string {
    // You can customize this normalization process based on your requirements
    return value.replace('&', '').toLowerCase();  // Convert to lowercase for case-insensitive sorting
  }
  onColumnToggleChange(column: any): void {
    if (column.visible) {
      this.selectedColumns.add(column.def);
    } else {
      this.selectedColumns.delete(column.def);
    }
  }
  onDropdownClick(event: Event): void {
    // Stop the event propagation to prevent the dropdown from closing
    event.stopPropagation();
  }

  onDropdownMenuClick(event: Event): void {
    // Stop the event propagation to prevent the dropdown from closing
    event.stopPropagation();
  }
  updatePagedItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
  }

  firstPage() {

    if (this.pageSize === 0) {
      return; // Do nothing for the "Select" option
    }
    this.currentPage = 1;
    this.updatePagedItems();
    this.updatePaginationControls();

  }

  lastPage() {
    if (this.pageSize === 0) {
      return; // Do nothing for the "Select" option
    }
    this.currentPage = this.pages[this.pages.length - 1];
    this.updatePagedItems();
    this.updatePaginationControls();
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedItems();
      this.updatePaginationControls();
    }
  }

  nextPage() {
    if (this.currentPage < this.pages[this.pages.length - 1]) {
      this.currentPage++;
      this.updatePagedItems();
      this.updatePaginationControls();
    }
  }


  showLoader(): void {
    $('#loaderAnimation').modal('show');
  }

  closeLoader(): void {
    $('#loaderAnimation').modal('hide');
  }
  updatePaginationControls(): void {
    const isFirstPage = this.currentPage === 1;
    const isLastPage = this.currentPage === this.pages[this.pages.length - 1];
    $('#firstPage, #previousPage').toggleClass('disabled', isFirstPage);
    $('#nextPage, #lastPage').toggleClass('disabled', isLastPage);
  }

}