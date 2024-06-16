import { Component, OnInit, QueryList, ViewChild, ViewChildren, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import { IlistSortEvent, RoleSortableDirective } from './role-sortable.directive';

import { roleService } from './role.service';
import { roleModel } from './role.model';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { jsPDF } from 'jspdf';
import { number } from 'echarts';


declare var $: any;

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [roleService, DecimalPipe, DatePipe]
})
export class RoleComponent {

  breadCrumbItems!: Array<{}>;
  RoleList: any[] = [];
  RoleList1!: Observable<roleModel[]>;
  RoleNameCollection: string[] = [];
  currentPage = 1;
  totalPages = 0;
  isEditMode = false;
  publisherId: string = '';
  acronym: string = '';

  //table sorting
  sortColumn = { column: 'id', direction: 'asc' }; // default sort column
  sortOrder = 'asc';
  //Id: any;

  pageSizeOptions: number[] = [6, 12, -1];
  pageSize: number = this.pageSizeOptions[0];
  pages: number[] = [];
  totalRecords: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  searchTerm: string = "";
  pagedItems: any[] = [];

  submitButtonClicked = false;
  needToActionId: any;
  roleId: string = '';
  roleName: string = '';
  description: any;
  controlCenter: any;

  canview: boolean = false;
  canadd: boolean = false;
  canupdate: boolean = false;
  candelete: boolean = false;
  caninsert: boolean = false;
  isDuplicate: boolean = false;

  menucanview: boolean = false;
  menucanadd: boolean = false;
  menucanupdate: boolean = false;
  menucandelete: boolean = false;

  total: Observable<number>;
  invoiceCard: any;
  roleForm!: UntypedFormGroup;
  menuList: any[] = [];
  dataSource: any = [];

  appRole: string | null = '';
  isprogressLoading: boolean = false;

  // Initialize the debounce time for column filter changes
  private columnFilterDebounceTime: number = 300;
  selectedRows: Set<roleModel> = new Set<roleModel>();
  selectedColumns: Set<string> = new Set<string>();
  @ViewChildren(RoleSortableDirective) headers!: QueryList<RoleSortableDirective>;

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;



  constructor(private http: HttpClient,private apiService: ApiService, private sweetalert: SweetAlertService, private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef, public service: roleService, private datePipe: DatePipe) {
    this.RoleList1 = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    // Get the current URL
    const currenturl = new URL(window.location.href).pathname.substring(1);
    //this.isprogressLoading=false;
    setTimeout(() => {
      this.showLoader();
    }, 100);
    this.breadCrumbItems = [
      { label: 'Settings', active: true },
      { label: 'Role', active: true }
    ];

    //get role from sessionStorage
    this.appRole = sessionStorage.getItem('userRole');

    //menu access
    this.getRoleTableData(currenturl);

    this.getRoleNameData();
    this.getRoleMenuData(); //display grid
    this.getMenuList();//add form display

    this.roleForm = this.formBuilder.group({
      roleId: [''], // Assuming Id is part of your form
      roleName: ['', [Validators.required]],
      description: [''],
      canView: [false],
      canAdd: [false],
      canUpdate: [false],
      canDelete: [false],

    });
    setTimeout(() => {
      this.closeLoader();
    }, 2000);

    this.selectedRows = new Set<roleModel>();
  }


  //api
  getRoleNameData(): void {
    this.apiService.GetDataWithToken('Rolemaster/GetRoleNameCollection').subscribe(
      (list) => {

        this.RoleNameCollection = list.data;
        console.log(this.RoleNameCollection)
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getRoleMenuData(): void {
    this.apiService.GetDataWithToken('Rolemaster/AllRoleMenu').subscribe(
      (list) => {
        this.RoleList = list.data;
        //console.log('RoleList ' + this.RoleList)
        this.totalRecords = this.RoleList.length;

        
        this.pagedItems = this.filteredItems();
        this.calculatePages();

      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  getMenuList(): void {
    this.menuList = [];
    this.apiService.GetDataWithToken('Rolemaster/getAllMenu').subscribe(
      (list) => {
        this.menuList = list.data;
        
        // console.log('add form ' + this.menuList);
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getRoleTableData(currenturl:string): void {
    this.menuList = [];
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.appRole}&url=${currenturl}`).subscribe(
      (response) => {
        this.menucanview = response.canview;
        this.menucanadd = response.caninsert;
        this.menucanupdate = response.canupdate;
        this.menucandelete = response.candelete;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  deleteMenuRoleData(roleName: any): void {
    //this.showLoader();
    
    this.apiService.DeleteDataWithToken(`Rolemaster/DeleteRoleMenuById/${roleName}`).subscribe(
      (Response) => {
        console.log('delete triggered');
        this.closeDeletePopUp();
        this.DeletealertWithSuccess();
        this.getRoleMenuData();
        this.calculatePages();
        
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  //validation
  isInvalid(controlName: string): boolean {
    const control = this.roleForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  ValidateControlData(event: any, controlname: string, validateduplicate: Boolean, validatenumber: Boolean, validatespecial: Boolean, validateemail: Boolean): void {
    const roleName = event.target.value.trim();
    //special character list ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
    if (roleName) {
      const isDuplicate = this.RoleNameCollection.some((name: any) =>
        name.toLowerCase() === roleName.toLowerCase() && name.toLowerCase() !== this.roleName.toLowerCase()
      );
      if (validateduplicate && isDuplicate) {
        this.roleForm.get(controlname)?.setErrors({ duplicate: true });
      }
      else if (validatenumber && /^\d+$/.test(roleName)) {
        this.roleForm.get(controlname)?.setErrors({ invalidNumber: true });
      }
      else if (validatespecial && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(roleName)) {
        this.roleForm.get(controlname)?.setErrors({ invalidData: true });
      }
      else if (validateemail && !this.isValidEmail(roleName)) {
        this.roleForm.get(controlname)?.setErrors({ invalidEmail: true });
      }
      else {
        this.roleForm.get(controlname)?.setErrors(null);
      }
    } else {
      this.roleForm.get(controlname)?.setErrors({ required: true });
    }
  }

  isValidEmail(email: string): boolean {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  submitRoleData(id: any): void {

    if (this.roleForm.valid) {
      if (!id) {
        console.log('Performing addKPIData');
        this.addMenuData();
      } else {
        console.log('Performing updateKPIData with id:', id);
        this.updateMenuData(id);
        this.roleForm.get('description')?.markAsTouched();
        this.roleForm.get('roleName')?.markAsTouched();
      }
    }
    else {
      this.roleForm.markAllAsTouched();
    }
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

  add(): void {
    this.clearForm();
    //added
    //no need id for add function
    this.roleId = '';
    // 
    this.submitButtonClicked = false;
    this.isEditMode = false;
    //this.showFormModal = true;
    this.clearForm();

    $('#addUpdatePopUp').modal('show');
  }

  edit(roleName: any): void {
    console.log("edit triggered")
    this.submitButtonClicked = false;
    this.getMenuById(roleName);
    this.roleName = roleName;
    $('#addUpdatePopUp').modal('show');
    this.isEditMode = true;
  }

  //delete record 
  deleteRoleItem(roleid: any): void {

    this.apiService.DeleteDataWithToken(`Rolemaster/DeleteUserMenuInventories/${roleid}`).subscribe(
      (roleData) => {
        console.log("delete triggered")
        Swal.fire({
          title: 'Thank you...',
          text: 'Deleted succesfully!',
          showConfirmButton: false, icon: 'success', timer: 3000
        });
        this.getRoleMenuData(); //display grid
        this.getMenuList();
        this.calculatePages();//add form display
      },
      (error) => {
        console.error('Error:', error);
      }
    );

  }

  // Delete Product
  deleteItem(roleid: any): void {
    this.roleId = roleid;
    this.deleteRecordModal?.show()
  }


  confirmDelete() {
    this.deleteRoleItem(this.roleId);
    this.deleteRecordModal?.hide()
  }


  addMenuData(): void {
    const formData = this.roleForm.value;
    const menuInventories: any[] = [];
    //const menuInventories: { ParentMenuId: number, ChildMenuId: number, canview: boolean, caninsert: boolean, canupdate: boolean, candelete: boolean }[] = [];


    this.menuList.forEach(menu => {
      const viewCheckbox = document.getElementById(`viewCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
      const addCheckbox = document.getElementById(`addCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
      const updateCheckbox = document.getElementById(`updateCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
      const deleteCheckbox = document.getElementById(`deleteCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;

      const action = {
        ParentMenuId: menu.parentMenuId,
        ChildMenuId: menu.childMenuId,
        canview: viewCheckbox.checked,
        caninsert: addCheckbox.checked,
        canupdate: updateCheckbox.checked,
        candelete: deleteCheckbox.checked
      };

      menuInventories.push(action);
    });

    const payload = {
      RoleMaster: {
        RoleName: formData.roleName,
        Description: formData.description
      },
      MenuInventories: menuInventories
    };

    console.log(payload);

    this.apiService.postDataWithToken('Rolemaster/roleMenuInsert', payload).subscribe(
      (Response) => {
        this.addAlert();
        $('#addUpdatePopUp').modal('hide');
        this.getRoleMenuData(); //display grid
        this.getMenuList();//add form display
        this.roleId = '';
        
        this.calculatePages();
        this.searchTerm = '';
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  getMenuById(roleName: any) {
    //this.showLoading();
    this.apiService.GetDataWithToken(`Rolemaster/AllRoleMenuById/${roleName}`).subscribe(
      (roleData) => {
        const roleMasterData = roleData.data.roleMaster;
        // Extract menuInventories data
        const menuInventoriesData = roleData.data.menuInventories;

        // Populate roleMaster properties
        this.roleId = roleMasterData.roleId;
        this.roleName = roleMasterData.roleName;
        this.description = roleMasterData.description;
        // Set form values
        this.roleForm.patchValue({
          roleName: this.roleName,
          description: this.description
        });

        // Mark form controls as touched to trigger validation
        this.roleForm.controls['roleName'].markAsTouched();
        this.roleForm.controls['description'].markAsTouched();

        this.menuList = menuInventoriesData;

        console.log('menuList' + this.menuList);
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    //this.hideLoading();
  }

  updateMenuData(id: any) {
    const formData = this.roleForm.value;
    const menuInventories: any[] = [];

    this.menuList.forEach(menu => {
      const viewCheckbox = document.getElementById(`viewCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
      const addCheckbox = document.getElementById(`addCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
      const updateCheckbox = document.getElementById(`updateCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
      const deleteCheckbox = document.getElementById(`deleteCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;

      const action = {
        parentMenuId: menu.parentMenuId,
        childMenuId: menu.childMenuId,
        canview: viewCheckbox.checked,
        caninsert: addCheckbox.checked,
        canupdate: updateCheckbox.checked,
        candelete: deleteCheckbox.checked
      };

      menuInventories.push(action);
    });

    const payload = {
      roleMaster: {
        roleId: id,
        roleName: formData.roleName,
        description: formData.description
      },
      menuInventories: menuInventories
    };

    const payloadJson = JSON.stringify(payload);
    console.log('payload', payloadJson);

    this.apiService.UpdateDataWithToken('Rolemaster/putUserMenuInventories', payload).subscribe(
      (Response) => {
        this.updateAlert();
        $('#addUpdatePopUp').modal('hide');
        this.getRoleMenuData();
        this.roleId = '';
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  viewItem(roleName: any): void {
    this.getMenuById(roleName);
    this.roleName = roleName;
    $('#viewPopUp').modal('show');

  }
  ConfirmDelete(): void {
    $('#deletePopUp').modal('hide');
    this.showSuccess();
  }

  showSuccess() {
    throw new Error('Method not implemented.');
  }

  clearForm() {
    this.roleForm.reset();
    this.roleId = '';
    this.roleName = '';
    this.description = '';
    this.controlCenter = '';
    this.canview = false;
    this.canadd = false;
    this.canupdate = false;
    this.candelete = false;
    this.isDuplicate = false;
    // $(`#${menulist[i].id}View`).prop('checked',false);
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const inputCheckbox = checkbox as HTMLInputElement;
      inputCheckbox.checked = false;
    });

  }

  closeForm(): void {
    //this.showFormModal = false;
    this.roleForm.reset();
    // Clear the validation state of all form controls
    Object.keys(this.roleForm.controls).forEach(key => {
      this.roleForm.controls[key].setErrors(null);
    });
    $('#addUpdatePopUp').modal('hide');
    $('#viewPopUp').modal('hide');
    this.clearForm();
    this.roleId = '';
  }



  DeletealertWithSuccess() {
    Swal.fire({
      title: 'Thank you...',
      text: 'Deleted succesfully!',
      showConfirmButton: false, icon: 'success', timer: 4000
    });
  }



  closeDeletePopUp(): void {
    $('#deletePopUp').modal('hide');
  }


  checkDuplicate() {
    if (!this.roleName && this.submitButtonClicked) {
      return;
    }

    // Ensure RoleList is an array before using the some method
    if (Array.isArray(this.RoleList)) {
      const isDuplicate = this.RoleList.some((item: any) =>
        item.roleName.toLowerCase() === this.roleName.toLowerCase()
      );

      if (isDuplicate) {
        this.isDuplicate = true;
        console.log('Role already exists');
      } else {
        this.isDuplicate = false;
        console.log('No duplicate data found.');
      }
    }
  }


  exportExcel() {
    const data: any[] = this.filteredItems().map((item, index) => ({
      'ID': index + 1,
      'Role Name': item.roleMaster.roleName,
      'Description': item.roleMaster.description
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'Role_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportPdf() {
    const doc = new jsPDF() as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'Role Name', 'Description'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.roleMaster.roleName,
        item.roleMaster.description

      ];
      data.push(rowData);
    });

    // Create the auto table
    doc.autoTable({
      head: [headers], // Header row
      body: data.slice(1) // Data rows (excluding headers)
    });

    // Save the PDF
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');

    doc.save('Role_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.roleMaster.roleName,
        item.roleMaster.description


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
    link.setAttribute('download', 'Role_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');
    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }
  getCsvHeaders(): string {
    return 'ID,Role Name,Description\n';
  }
  exportAllExcel() {
    const data: any[] = this.RoleList.map((item, index) => ({
      'ID': index + 1,
      'Role Name': item.roleMaster.roleName,
      'Description': item.roleMaster.description
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'Role_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }
  exportAllPdf() {
    const doc = new jsPDF() as any;
    const data = []; // Your tabular data
    const headers = ['ID', 'Role Name', 'Description'];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.RoleList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.roleMaster.roleName,
        item.roleMaster.description

      ];
      data.push(rowData);
    });

    // Create the auto table
    doc.autoTable({
      head: [headers], // Header row
      body: data.slice(1) // Data rows (excluding headers)
    });

    // Save the PDF
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');

    doc.save('Role_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.pdf');
  }

  exportAllCsv() {
    // Construct CSV content
    let csvContent = this.getCsvHeaders(); // Get CSV headers

    // Add CSV rows
    this.RoleList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.roleMaster.roleName,
        item.roleMaster.description


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
    link.setAttribute('download', 'Role_Data' + this.datePipe.transform(myDate, 'ddMMyyyy') + '.csv');
    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }


  toggleAll(action: string) {
    // Check if action is 'View'
    if (action.toLowerCase() === 'view') {
      console.log('view Checkbox triggered');
      const mainCheckbox = document.getElementById('viewall') as HTMLInputElement;
      this.menuList.forEach(menu => {
        const viewCheckbox = document.getElementById(`viewCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
        viewCheckbox.checked = mainCheckbox.checked;
      });

    }
    else if (action.toLowerCase() === 'add') {
      console.log('add Checkbox triggered');
      const mainCheckbox = document.getElementById('addall') as HTMLInputElement;

      this.menuList.forEach(menu => {
        const addCheckbox = document.getElementById(`addCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
        addCheckbox.checked = mainCheckbox.checked;
      });
    }
    else if (action.toLowerCase() === 'update') {
      console.log('update Checkbox triggered');
      const upCheckbox = document.getElementById('updateall') as HTMLInputElement;

      this.menuList.forEach(menu => {
        const updateCheckbox = document.getElementById(`updateCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
        updateCheckbox.checked = upCheckbox.checked;
      });
    }
    else if (action.toLowerCase() === 'delete') {
      console.log('delete Checkbox triggered');
      const mainCheckbox = document.getElementById('deleteall') as HTMLInputElement;
      this.menuList.forEach(menu => {
        const deleteCheckbox = document.getElementById(`deleteCheckbox-${menu.parentMenuId}-${menu.childMenuId}`) as HTMLInputElement;
        deleteCheckbox.checked = mainCheckbox.checked;
      });
    }
    console.log('check box ' + action);

  }

  showMenu: { [key: string]: boolean } = {};
  toggleMenu(menu: any) {

    // Implement logic to show/hide the menu based on the checkbox state
    if (menu.checked) {
      // Show the menu or perform any action when the checkbox is checked
      console.log(`Menu ${menu.title} is checked`);
      // You can perform additional actions here, like showing the menu
    } else {
      // Hide the menu or perform any action when the checkbox is unchecked
      console.log(`Menu ${menu.title} is unchecked`);
      // You can perform additional actions here, like hiding the menu
    }
  }

  toggleView(menu: any): void {
    menu.canView = !menu.canView;
  }


  onSearchKeyUp(searchTerm: string): void {
    this.currentPage = 1;
    this.searchTerm = searchTerm;
    this.pagedItems = this.filteredItems();
    this.resetPagination();

  }

  filterByText(item: any): boolean {
    const includeColumns = ['roleName', 'description'];

    // Filter by roleMaster properties
    if (!this.searchTerm) {
      return true; // No filter applied
    }

    for (const key in item.roleMaster) {
      if (item.roleMaster.hasOwnProperty(key) && includeColumns.includes(key)) {
        const value = item.roleMaster[key];
        if (typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          return true;
        }
      }
    }

    // Filter by menuInventories properties
    for (const menu of item.menuInventories) {
      for (const key in menu) {
        if (menu.hasOwnProperty(key) && includeColumns.includes(key)) {
          const value = menu[key];
          if (typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase())) {
            return true;
          }
        }
      }
    }

    return false; // No match found
  }

  sort(column: string): void {
    console.log('sort triggered');
    //let sortSet =['asc','desc'];
    if (this.sortColumn.column === column) {
      // Toggle sort direction
      this.sortColumn.direction = this.sortColumn.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = { column, direction: 'asc' };
    }

    this.RoleList.sort((a, b) => {
      // Adjust access for nested structure and convert to lowercase for case-insensitive comparison
      const valueA = typeof a.roleMaster[column] === 'string' ? a.roleMaster[column].toLowerCase() : a.roleMaster[column];
      const valueB = typeof b.roleMaster[column] === 'string' ? b.roleMaster[column].toLowerCase() : b.roleMaster[column];

      if (valueA < valueB) {
        return this.sortColumn.direction === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortColumn.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Log the sorted users array to the console
    console.log(this.RoleList);
  }



  filteredItems() {
    const pageSizeNumber = +this.pageSize;
    const filteredList = this.RoleList.filter(item => this.filterByText(item));
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
      this.endIndex = this.RoleList.length;
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
    let totalItems = this.RoleList.length;
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


  // areAllChecked(action: string): boolean {
  //   return this.menuName.every(menu => menu[action]);
  // }

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
