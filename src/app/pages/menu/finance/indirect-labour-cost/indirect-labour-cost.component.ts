import { Component, QueryList, ViewChild, ViewChildren, OnInit, AfterViewInit, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl, FormGroupDirective } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

//import { jsPDF } from "jspdf";
import 'jspdf-autotable';
//import * as $ from 'jquery';
// Data Get
import { IndirectCostModel } from './indirect-labour-cost.model';
//import {  } from './kpi.service';
//import { NgbdKpiSortableHeader, kpiSortEvent } from './kpi-sortable.directive';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap/modal';
//import { KpiList } from './data';
import { ApiService } from 'src/app/API/api.service';
import Swal from 'sweetalert2';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { number } from 'echarts';
import { max } from 'lodash';
import { array } from '@amcharts/amcharts5';
import { months } from 'moment';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import { directCostModel } from '../direct-cost/direct-cost.model';
declare var $: any;
@Component({
  selector: 'app-indirect-labour-cost',
  templateUrl: './indirect-labour-cost.component.html',
  styleUrls: ['./indirect-labour-cost.component.scss'],
  providers: [DecimalPipe, DatePipe]
})
export class IndirectLabourCostComponent {
  colorTheme: any = 'theme-blue';
  // Pagination properties
  totalRecords: number = 0;
  page: number = 0;
  itemsPerPage: number = 10; // Adjust as needed
  perPageOptions: number[] = [10, 20, 30, 40];
  pageSize: number = this.perPageOptions[0];
  pages: number[] = [];
  modelDate!:Date;

  //year: number = 0;
  MonthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //Month: string = '';
  releventMonths: any[] = [];
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 10;

  selectedStartDate: any = "";
  selectedEndDate: any = "";
  searchTerm: string = '';


  apiResponse: any;
  isLoading = true;
  currentSortColumn: string = ''; // Track the current sorting column
  isSortAscending: boolean = true;

  submitButtonClicked = false;
  minYear = 2023;
  maxYear = new Date().getFullYear();
  sortColumn = 'acronym'; // default sort column
  sortOrder = 'asc'; // default sort order
  showFilter: boolean = false;
  formMonthYearPicker: boolean = false;
  filterMonthYearPicker: boolean = false;
  startMonthYearPicker: boolean = false;
  endMonthYearPicker: boolean = false;
  filteredMonth = '';
  filteredYear = 0;
  selectedMonthYear: any = "";
 // modelDate = '';
  formYear: number = new Date().getFullYear();
  formMonth: string = this.MonthNames[new Date().getMonth()];
  formMonthYear: string = "Select";
  startYear: number = new Date().getFullYear();
  startMonth: string = this.MonthNames[new Date().getMonth()];
  endYear: number = new Date().getFullYear();
  endMonth: string = this.MonthNames[new Date().getMonth()];
  monthYear: string = this.formMonth + " " + this.formYear;
  startDate: string = 'Select';
  endDate: string = 'Select';

  monthYearList: any[] = [];
  displayYearArr: number[] = [];
  List: any[] = [];

  //formMonthYear_Year: string = '';
  selectedMonthYearRange: any[] = [];

  masterSelected = false;

  dataSource: any = [];
  originalDataSource: any = [];

  // Initialize the debounce time for column filter changes
  private columnFilterDebounceTime: number = 300;
  selectedRows: Set<IndirectCostModel> = new Set<IndirectCostModel>();
  selectedColumns: Set<string> = new Set<string>();

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  productForm!: FormGroup;
  tooltipvalidationform!: FormGroup;
  submitted = false;
  products: any[] = [];
  //userList: any[] = [];


  // Table data
  productList!: Observable<IndirectCostModel[]>;
  //total: Observable<number>;
  formsubmit!: boolean;

  formMonthYear_Year: string = '';

  isDuplicate: boolean = false;
  isWrongDt: boolean = false;
  rangePickLimit: number = 2;

  favoriteSeason: string = "";

  currentYear = new Date().getFullYear();
  wholeCustomerList: any[] = [];
  totalPages = 0;
  isEditMode = false;
  id: string = '';
  type: string = '';
  department: string = '';
  serviceLine: string = '';
  customer: string = '';
  fc: string = '';
  fxRate: null | undefined;
  costCtc: null | undefined;
  branch: string = '';
  noofmandays: null | undefined;


  pagedItems: any[] = [];

  public DirectCostList: any[] = [];

  appRole: string | null = '';
  menucanview: boolean = false;
  menucanadd: boolean = false;
  menucanupdate: boolean = false;
  menucandelete: boolean = false;

  deleteID: any;
  content: any;

  files: File[] = [];
  inDirectCostValidationList:any[]=[];
  file: File | null = null;


  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  constructor(private http: HttpClient, private formBuilder: UntypedFormBuilder,
    private apiService: ApiService, private datePipe: DatePipe, private sweetAlert: SweetAlertService) {
    //this.productList = service.countries$;
    //this.total = service.total$;
    //console.log(this.productList);


    this.appRole = sessionStorage.getItem('userRole');

    this.productForm = this.formBuilder.group({
      //id: "#VZ2101",
      id: [''],
      year: ['', [Validators.required]],
      department: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      branch: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      fc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      fxRate: [null, [Validators.required,Validators.min(0)]],
      costCtc: [null, [Validators.required, Validators.min(0)]],
      noOfManDate: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]]

    });


  }

  columnDefinitions: any[] = [
    {
      id: 'id',
      def: 'id',
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
      def: 'year',
      label: 'Month&Year',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },


    {
      def: 'department',
      label: 'Department',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'branch',
      label: 'Branch',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'fc',
      label: 'FC',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'fxRate',
      label: 'FX Rate',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'costCtc',
      label: 'Cost(CTC)',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'noOfManDate',
      label: 'No.Of Man Days',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    }
  ];
  ngOnInit(): void {
    // Get the current URL
    const currenturl = new URL(window.location.href).pathname.substring(1);
    setTimeout(() => {
      this.showLoader();
    }, 100);
    this.appRole = sessionStorage.getItem('userRole');
    this.breadCrumbItems = [
      { label: 'Finance' },
      { label: 'InDirect Labour Cost', active: true }
    ];
    this.selectedRows = new Set<IndirectCostModel>();
    // Search logic using RxJS operators
    this.columnDefinitions.forEach((column) => {
      column.filter.valueChanges
        .pipe(
          debounceTime(this.columnFilterDebounceTime),
          distinctUntilChanged()
        )
        .subscribe((value: any) => {
          this.onColumnFilterChange(column, value);
        });
    });

    this.getRoleTableData(currenturl);
    this.getInDirectCost();
    setTimeout(() => {
      this.closeLoader();
    }, 3000);
    this.modelDate=new Date();

  }

  getRoleTableData(currenturl: string): void {
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.appRole}&url=${currenturl}`).subscribe(
      (response) => {
        this.menucanview = response.canview;
        this.menucanadd = response.caninsert;
        this.menucanupdate = response.canupdate;
        this.menucandelete = response.candelete;
        console.log('view ' + response.canview + ' insert ' + response.caninsert + ' update ' + response.canupdate + ' delete ' + response.candelete)
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get UserAccess details', error.message);
      }
    );
  }
  getInDirectCost(): void {

    this.apiService.GetDataWithToken('api/indirectlabourcost/display').subscribe(
      (indirectCostList) => {
        this.dataSource = indirectCostList.data;
        this.products = indirectCostList.data;
        this.pagedItems = this.filteredItems();
        this.totalRecords = indirectCostList.data.length;
        this.originalDataSource = indirectCostList.data;
        this.isLoading = false;
        this.selectedRows.clear();
        this.applyPagination();
        console.log(this.products);
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get InDirectcost details', error.message);
      }
    );

  }
  deleteInDirectCostData(id: any): void {
    //this.showLoader();

    this.apiService.DeleteDataWithToken(`api/indirectlabourcost/deletebyid/${id}`).subscribe(
      (Response) => {
        console.log(Response);
        this.selectedRows.clear();
        this.sweetAlert.DeletealertWithSuccess();
        this.getInDirectCost();
        this.id = '';
      },
      (error) => {
        console.error('Error', error);
        this.sweetAlert.failureAlert('Unable to get Directcost details', error.message);
      }
    );
  }
  getById(id: any) {
    //this.showLoading();
    this.apiService.GetDataWithToken(`api/indirectlabourcost/displaybyid/${id}`).subscribe(
      (InDirectCost) => {


        console.log(InDirectCost.data);
        this.productForm.patchValue
          ({
            id: InDirectCost.data.id,
            year: InDirectCost.data.year,
            department: InDirectCost.data.department,
            branch: InDirectCost.data.branch,
            fc: InDirectCost.data.fc,
            fxRate: InDirectCost.data.fxRate,
            costCtc: InDirectCost.data.costCtc,
            noOfManDate: InDirectCost.data.noOfManDate
          })

        this.id = InDirectCost.data.id;
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get Directcost details', error.message);
      }
    );
    //this.hideLoading();
  }
  formatDate(dateString: string): string {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Format the Date object to get the desired "MMM yyyy" format
    return this.datePipe.transform(date, 'MMM yyyy') || '';
  }
  addInDirectCostData(): void {

    console.log('DirectCostData triggered');
    const monthYearValue = this.productForm.get('year')?.value;

    // Set the day part to 01 to ensure only month and year are considered
    const date = new Date(monthYearValue);
    date.setDate(1);
    const MonthYear = this.datePipe.transform(date, 'MMM yyyy');
    this.productForm.patchValue({ year: MonthYear });
    const formData = this.productForm.value;
    formData.id = 0;
    console.log(formData);

    this.apiService.postDataWithToken('api/indirectlabourcost/insert', formData).subscribe(
      (Response) => {
        this.apiResponse = Response.Data;
        this.sweetAlert.addAlert();
        this.showModal?.hide();
        this.getInDirectCost();
        this.id = '';
        this.productForm.reset();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get InDirectcost details', error.message);
      }
    );


  }
  updateInDirectCostData(id: any) {
    const monthYearValue = this.productForm.get('year')?.value;

    // Set the day part to 01 to ensure only month and year are considered
    const date = new Date(monthYearValue);
    date.setDate(1);
    const MonthYear = this.datePipe.transform(date, 'MMM yyyy');
    this.productForm.patchValue({ year: MonthYear });

    const formData = this.productForm.value;
    formData.id = id;

    this.apiService.UpdateDataWithToken('api/indirectlabourcost/update', formData).subscribe(
      (Response) => {
        //this.apiResponse = Response.Data;
        this.isEditMode = false;
        //this.selectedRows.size  === 0;
        this.selectedRows.size === -1;
        this.selectedRows.clear();
        this.closemodal();
        this.productForm.reset();
        setTimeout(() => {
          //this.productForm.reset();
        }, 1000);
        this.showModal?.hide()
        this.sweetAlert.updateAlert();
        //$('#addUpdatePopUp').modal('hide');
        //this.productForm.reset();
        this.getInDirectCost();
        this.id = '';
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get InDirectcost details', error.message);
      }

    );


  }

  submitData(id: any): void {
    console.log("submit triggerd");
    console.log(this.productForm)
    // Check if the form is valid
    if (this.productForm.valid) {
      console.log('In save fisrst If');
      const monthYearValue = this.productForm.get('year')?.value;

      // Set the day part to 01 to ensure only month and year are considered
      const date = new Date(monthYearValue);
      date.setDate(1);

      // Format the MonthYear value as "Jan 2024"
      const MonthYear = this.datePipe.transform(date, 'MMM yyyy');
      console.log("valid")
      if (!id) {
        console.log('Performing add user');
        this.addInDirectCostData();
        this.productForm.reset();
      }
      else {
        console.log('Performing update user with id:', id);
        this.updateInDirectCostData(id);
        this.productForm.reset();
        // this.productForm.get('Type')?.markAsTouched();
        // this.productForm.get('Department')?.markAsTouched();
        // this.productForm.get('ServiceLine')?.markAsTouched();
        // this.productForm.get('Customer')?.markAsTouched();
        // this.productForm.get('FC')?.markAsTouched();
        // this.productForm.get('CostCtc')?.markAsTouched();
      }

    } else {
      // If the form is invalid, mark all fields as touched to display validation messages
      this.submitButtonClicked = true;
      this.productForm.markAllAsTouched();
    }
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
      this.productForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }
  clearForm() {

  }

  resetData() {
    if (this.id === '') {
      this.clearForm();
    }

  }
  openModal() {
    this.productForm.reset();
    this.isEditMode = false;
    this.showModal?.show();
  }

  closemodal() {
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add InDirectCost'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Submit'
    this.isDuplicate = false;
    this.formsubmit = false;
    this.showModal?.hide();
    setTimeout(() => {
      this.productForm.reset();
    }, 1000);

    this.isEditMode = false;

  }


  // Edit Data
  editList() {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit InDirectCost'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'
    this.isEditMode = true;
    const selectedIds = this.getSelectedRowId();
    this.getById(selectedIds);



  }
  get form() {
    return this.productForm.controls;
  }

  /**
    * returns tooltip validation form
    */
  get formData() {
    return this.tooltipvalidationform.controls;
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items




  // Delete Product
  removeItem(id: any) {
    console.log("delete triggered")
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {

    const selectedIds = this.getSelectedRowId();
    this.deleteInDirectCostData(selectedIds);
    this.deleteRecordModal?.hide()
    this.masterSelected = false;
  }

  onInactiveClick(): void {
    // Implement logic for the "Inactive" action
    const selectedIds = this.getSelectedRowIds();
    // Implement logic for the "Inactive" action using selectedIds
    console.log('Inactive Action - Selected IDs:', selectedIds);
  }
  convertToAssociativeArray(indexArray: string[]): { [key: string]: string } {
    const associativeArray: { [key: string]: string } = {};

    indexArray.forEach((camelCaseString) => {
      const words = camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Handle cases like "POStatus" or "PODueDate"
        .split(/\s+/) // Split on one or more spaces
        .filter(word => word.trim() !== ''); // Remove empty strings from the split

      const value = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Use the original camel case string as the key, and the converted string as the value
      associativeArray[camelCaseString] = value;
    });

    return associativeArray;
  }

  /**
     * Export method starts
     */
  exportToExcel() {

    const selectedColumns: (keyof IndirectCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof IndirectCostModel);

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof IndirectCostModel) => {
        exportedItem[column as string] = item[column];
      });
      return exportedItem;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(workbook,'IndirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');

  }

  exportToCsv() {
    const selectedColumns: (keyof IndirectCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof IndirectCostModel);
    // Extract header row
    // const headerRow = selectedColumns.map((column) => column.toString());
    // Extract header row with bold formatting
    const headerRow =
      '\uFEFF' +
      selectedColumns
        .map((column) => `"${column.toString().replace(/"/g, '""')}"`)
        .join(',');

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof IndirectCostModel) => {
        exportedItem[column as string] = item[column];
      });
      return exportedItem;
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headerRow,
        ...dataToExport.map((row: any) =>
          selectedColumns.map((col) => row[col]).join(',')
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const myDate = new Date();

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'IndirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.csv');
    document.body.appendChild(link);
    link.click();
  }

  exportToPDF() {
    const selectedColumns: (keyof IndirectCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof IndirectCostModel);

    // Define custom display names for the selected columns
    const selectedColumnsResult = this.convertToAssociativeArray(
      selectedColumns.map((key) => key as string)
    );

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof IndirectCostModel) => {
        exportedItem[column as string] = item[column];
      });
      return exportedItem;
    });


    const doc = new jsPDF({
      orientation: 'landscape',
      // unit: "in",
      // format: [4, 2]
    });

    // Add the title with appropriate styling and position
    doc.setFontSize(16);
    doc.text('DirectCostList', 10, 10); // Adjust position as needed

    // Define column headers
    const header = selectedColumns.map(
      (col) => selectedColumnsResult[col.toString()]
    );
    // Define column widths and align headers and data
    const columnStyles: { [key: string]: 'left' | 'center' | 'right' } = {};
    selectedColumns.forEach((col) => {
      columnStyles[col] = 'left';
    });

    // Define the background color for the header cells using headStyles
    const headStyles: {
      [key: string]: { fillColor: [number, number, number] };
    } = {
      header: { fillColor: [200, 200, 200] }, // Change the background color values
    };

    var test = dataToExport.map((row: any) =>
      selectedColumns.map((col) => row[col]));
    console.log(header);
    console.log(test);



    // Create a table with specified columns, headers, widths, and styles
    (doc as any).autoTable({
      head: [header],
      body: dataToExport.map((row: any) =>
        selectedColumns.map((col) => row[col])
      ),
      startY: 20, // Adjust the vertical position of the table
      styles: {
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      columnStyles,
      margin: { top: 20 }, // Adjust the margin to leave space for the custom header
      tableWidth: 'auto', // 'auto' or a number for a fixed width
      columnWidth: 'wrap', // 'auto', 'wrap', or a number for a fixed width
      bodyStyles: { valign: 'top' }, // Align text within cells vertically
      theme: 'grid', // Other themes are available, choose the one you prefer
      headStyles, // Apply the header background color
    });

    const myDate = new Date();
    doc.save('IndirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.pdf');
  }

  exportToExcelAll() {
    const selectedColumns: (keyof IndirectCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof IndirectCostModel);

    const isDeleted = false;
    const payload = {
      IsColumnFilter: false,
      IsTableFilter: false,
      TableColumn: '',
      TableColumnValues: [],
      FilteringByColumn: '',
      FilteringByColumnValues: [],
      Sorting: '',
      Start: 0,
      Length: -1,
      UserSiteId: [],
      UserVendorId: [],
    };
    this.isLoading = true;

    // all export


    if (this.originalDataSource.length === 0) {
      console.warn('No data to export');
      return;
    }
    const dataToExport = this.originalDataSource.map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof IndirectCostModel) => {
        exportedItem[column as string] = item[column];
      });
      return exportedItem;
    });

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const myDate = new Date();

    XLSX.writeFile(workbook, 'IndirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }

  exportToCsvAll() {
    this.isLoading = true;

    const selectedColumns: (keyof IndirectCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof IndirectCostModel);

    const headerRow =
      '\uFEFF' +
      selectedColumns
        .map((column) => `"${column.toString().replace(/"/g, '""')}"`)
        .join(',');

    const isDeleted = false;
    const payload = {
      IsColumnFilter: false,
      IsTableFilter: false,
      TableColumn: '',
      TableColumnValues: [],
      FilteringByColumn: '',
      FilteringByColumnValues: [],
      Sorting: '',
      Start: 0,
      Length: -1,
      UserSiteId: [],
      UserVendorId: [],
    };

    // export all 


    if (this.originalDataSource.length === 0) {
      console.warn('No data to export');
      return;
    }
    const dataToExport = this.originalDataSource.map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof IndirectCostModel) => {
        exportedItem[column as string] = item[column];
      });
      return exportedItem;
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headerRow,
        ...dataToExport.map((row: any) =>
          selectedColumns.map((col) => row[col]).join(',')
        ),
      ].join('\n');

    const myDate = new Date();

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'IndirectCost_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.csv');
    document.body.appendChild(link);
    link.click();
  }

  exportToPDFAll() {
    const doc = new jsPDF({
      orientation: 'landscape',
      // unit: 'pt',
      // format: 'a3'
    }) as any;
  
    const selectedColumns: (keyof IndirectCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof IndirectCostModel);
  
    const headerRow =
      '\uFEFF' +
      selectedColumns
        .map((column) => `"${column.toString().replace(/"/g, '""')}"`)
        .join(',');
  
    if (this.originalDataSource.length === 0) {
      console.warn('No data to export');
      return;
    }
  
    const dataToExport = this.originalDataSource.map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof IndirectCostModel) => {
        exportedItem[column as string] = item[column];
      });
      return exportedItem;
    });
  
    const formattedDate = this.datePipe.transform(new Date(), 'ddMMyyyy');
  
    doc.autoTable({
      head: [selectedColumns.map((col) => col.toString())],
      body: dataToExport.map((row: any) =>
        selectedColumns.map((col) => row[col])
      ),
      theme: 'grid',
      styles: {
        fontSize: 6,
        cellPadding: 1,
      },
      columnStyles: {
        0: { cellWidth: 'auto' }
      }
    });
  
    doc.save(`IndirectCostList_${formattedDate}.pdf`);
  }
  
  
  
  /**
   * Export method end
   */
 



  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  onOpenCalendarYear(container: any) {
    // container.monthSelectHandler = (event: any): void => {
    //   container._store.dispatch(container._actions.select(event.date));
    // };  

    container.yearSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('year');
  }
  isSelected(item: any): boolean {
    return this.selectedRows.has(item);
  }
  onPageSizeChange(): void {
    this.resetPagination();
    this.currentPage = 1; // Uncomment this line if you want to reset to the first page
    if (this.pageSize === -1) {
      this.pagedItems = this.filteredItems();
    } else {
      this.pagedItems = this.filteredItems().slice(0, this.pageSize);
    }

  }
  applyPagination() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    this.dataSource = this.dataSource.slice(this.startIndex, this.endIndex);
  }
  onPerPageChange() {
    this.page = 1; // Reset to the first page when changing items per page
    this.pageSize = this.itemsPerPage; // Update the page size
    this.getInDirectCost(); // Call the method to fetch data with the updated pagination settings
  }
  // Handle page changes
  onPageChange(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
  }
  onSearchKeyUp(searchTerm: string): void {
    this.currentPage = 1;
    this.searchTerm = searchTerm;
    this.pagedItems = this.filteredItems();
    this.resetPagination();
  }
  resetPagination() {
    this.currentPage = 1;
    const startIndex = 0;
    const endIndex = this.pageSize === -1 ? this.dataSource.length : this.pageSize;
    this.pagedItems = this.dataSource.slice(startIndex, endIndex);
    this.calculatePages();
  }
  calculatePages() {
    const totalPages = Math.ceil(this.dataSource.length / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  filteredItems(): any[] {
    const pageSizeNumber = +this.pageSize;

    if (pageSizeNumber === -1) {
      // No pagination
      return this.products.filter(item =>
        this.filterByText(item)
      );
    } else {
      // Pagination applied
      const startIndex = (this.currentPage - 1) * pageSizeNumber;
      const endIndex = startIndex + pageSizeNumber;
      const filteredProducts = this.products.filter(item =>
        this.filterByText(item)
     );
      return filteredProducts.slice(startIndex, endIndex);

    }
  }
  checkUncheckAll(event: any) {
    if (event.target.checked) {
      // Check all items
      this.selectedRows = new Set([...this.dataSource]);
    } else {
      // Uncheck all items
      this.selectedRows.clear();
    }

    // Update isSelected property for each item in dataSource
    this.dataSource.forEach(
      (item: any) => (item.isSelected = event.target.checked)
    );
  }
  handleRowClick(event: Event, row: any) {
    // Check if the click was on the checkbox
    const checkboxClicked = (event.target as HTMLElement).tagName === 'INPUT';

    if (!checkboxClicked) {
      // If the click was not on the checkbox, handle row click
      this.onRowClick(row);
    }
  }

  onRowClick(item: any) {
    // Toggle selection on row click
    const isSelected = this.isSelected(item);

    if (isSelected) {
      this.selectedRows.delete(item);
    } else {
      this.selectedRows.add(item);
    }

    // Update isSelected property for the clicked item
    item.isSelected = !isSelected;
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

    this.products.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (this.sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }



  sortDataSource() {
    if (this.currentSortColumn) {
      this.dataSource.sort((a: any, b: any) => {
        const valueA = a[this.currentSortColumn];
        const valueB = b[this.currentSortColumn];
        const comparison = valueA.localeCompare(valueB, undefined, {
          numeric: true,
          sensitivity: 'base',
        });

        return this.isSortAscending ? comparison : -comparison;
      });
    }
  }
  // Method to determine if multiple rows are selected
  areMultipleRowsSelected(): boolean {
    return this.selectedRows.size > 0;
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

  // Method to determine if a single row is selected
  isSingleRowSelected(): boolean {
    return this.selectedRows.size === 1;
  }

  // Method to get the IDs of selected rows
  getSelectedRowIds(): string[] {
    // return Array.from(this.selectedRows).map((row) => row.VendorCode);
    return Array.from(this.selectedRows).map((row) => row.id);
  }

  // Event handlers for action button options
  onCloneClick(): void {
    // Implement logic for the "Clone" action
    const selectedIds = this.getSelectedRowIds();
    // Implement logic for the "Clone" action using selectedIds
    console.log('Clone Action - Selected IDs:', selectedIds);
  }

  // Method to get the ID of selected row
  getSelectedRowId(): any {
    const selectedRows = Array.from(this.selectedRows).map(
      (row) => row.id
    );
    return selectedRows[0];
  }

  onEditClick(): void {
    // Implement logic for the "Edit" action
    const selectedIds = this.getSelectedRowId();
    // Implement logic for the "Edit" action using selectedIds
    console.log('Edit Action - Selected IDs:', selectedIds);
  }
  onCheckboxChange(event: any, item: any) {
    item.isSelected = event.target.checked;

    if (event.target.checked) {
      // Add the item to the selectedRows Set
      this.selectedRows.add(item);
    } else {
      // Remove the item from the selectedRows Set
      this.selectedRows.delete(item);
    }
  }




  //  Filter Offcanvas Set
  openEnd() {
    document.getElementById('courseFilters')?.classList.add('show')
    document.querySelector('.backdrop3')?.classList.add('show')
  }

  closeoffcanvas() {
    document.getElementById('courseFilters')?.classList.remove('show')
    document.querySelector('.backdrop3')?.classList.remove('show')
    this.resetFilter();
  }







  // populateMonths() {
  //   this.MonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   let year = $('#filterYear').val();
  //   console.log('selected year' + year);
  //   //this.selectedYear = year;
  //   let date = new Date();
  //   let currentMonth = date.getMonth();
  //   let currentYear = date.getFullYear();
  //   if (this.selectedYear === "2023") {
  //     this.MonthNames = this.MonthNames.slice(10, 12);
  //   }
  //   else if (this.selectedYear === currentYear.toString()) {
  //     this.MonthNames = this.MonthNames.slice(0, currentMonth + 1);
  //     console.log(currentMonth);
  //   } else {
  //     this.MonthNames = this.MonthNames.slice(0, 11);
  //   }
  //   let months = this.MonthNames;
  //   let releventMonths = [];
  //   for (let month of months) {
  //     let modifiedMonth = { monthName: month, value: month + " " + this.selectedYear };
  //     releventMonths.push(modifiedMonth);
  //   }
  //   this.releventMonths = releventMonths;

  // }






  filterByText(item: any): boolean {
    const includeColumns = ['branch', 'department', 'fc', 'year','fxRate','costCtc','noOfManDate'];
    // Filter by text box input for all columns
    if (!this.searchTerm) {
      return true; // No filter applied
    }
    // Check if any column contains the search term (string or number)
    for (let key in item) {
      if (item.hasOwnProperty(key) && includeColumns.includes(key)) {
        const value = item[key];
        if (typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          console.log(`Found in ${key}: ${value}`);
          return true;
        } else if (typeof value === 'number' && value.toString().includes(this.searchTerm)) {
          console.log(`Found in ${key}: ${value}`);
          return true;
        }
      }
    }

    return false;
  }



  ValidateControlData(event: any, controlname: string, validateduplicate: Boolean, validatenumber: Boolean, validatespecial: Boolean, validatealpha: Boolean): void {
    const controlName = event.target.value.trim();

    //const originalValue = this.username;

    // if (validateduplicate && controlname === 'username') {
    //   const isDuplicate = this.DirectCostList.some((user: any) =>
    //     user.username.toLowerCase() === controlName.toLowerCase() && user.username.toLowerCase() !== originalValue.toLowerCase()
    //   );

    //special character list ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
    if (controlName) {
      const isDuplicate = this.DirectCostList.some((name: any) =>
        name.toLowerCase() === controlName.toLowerCase() && name.toLowerCase() !== this.customer.toLowerCase()
      );
      if (validateduplicate && isDuplicate) {
        this.productForm.get(controlname)?.setErrors({ duplicate: true });
      }
      else if (validatenumber && /^\d+$/.test(controlName)) {
        this.productForm.get(controlname)?.setErrors({ invalidNumber: true });
      }
      else if (validatespecial && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(controlName)) {
        this.productForm.get(controlname)?.setErrors({ invalidData: true });
      }
      else if (validatealpha && !/^[a-zA-Z]+$/.test(controlName)) {
        this.productForm.get(controlname)?.setErrors({ invalidAlpha: true });
      }
      else {
        this.productForm.get(controlname)?.setErrors(null);
      }
    } else {
      this.productForm.get(controlname)?.setErrors({ required: true });
    }
  }
  isValidEmail(email: string): boolean {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }




  getInDirectCostFiltered(): void {
    const filterparam =
    {

      DepartmentFilter: $("#Fdepartment").val() === '' ? null : $("#Fdepartment").val(),
      FCFilter: $("#Ffc").val() === '' ? null : $("#Ffc").val(),
      BranchFilter: $("#Fbranch").val() === '' ? null : $("#Fbranch").val(),

    }
    this.apiService.postDataWithToken('api/IndirectCost/filter', filterparam).subscribe(
      (filtereddirectCostList) => {
        this.dataSource = filtereddirectCostList.data;
        this.products = filtereddirectCostList.data;
        this.pagedItems = this.filteredItems();

        this.totalRecords = filtereddirectCostList.data.length;

        this.originalDataSource = filtereddirectCostList.data;
        this.isLoading = false;
        // this.selectedRows.clear();
        // this.pagedItems = this.filteredItems();
        // this.calculatePages();
        // this.resetPagination();
        this.applyPagination();
        //this.resetTableFilterAndPagination();
        console.log(this.products);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

  }
  submitFilter(): void {
    this.getInDirectCostFiltered();
    //this.resetPagination();
  }

  resetFilter() {
    this.getInDirectCost();
    $('#Fdepartment').val("");
    $('#Ffc').val("");
    $('#Fbranch').val("");
  }








  onColumnFilterChange(column: any, filterValue: string) {
    this.isLoading = true;
    if (filterValue) {
      this.dataSource = this.originalDataSource.filter((row: any) => {
        const cellValue = row[column.def]?.toString().toLowerCase();
        const filterValue = column.filter.value.toLowerCase();
        // Check if filterValue is provided before applying the filter
        this.isLoading = false;
        // if (filterValue) {
        return cellValue.includes(filterValue);
        // }
      });
    } else {
      this.dataSource = this.originalDataSource;
      this.isLoading = false;
    }
  }

  showLoader(): void {
    $('#loaderAnimation').modal('show');
  }

  closeLoader(): void {
    setTimeout(() => {
      $('#loaderAnimation').modal('hide');
      //$('.modal-backdrop.show').css('opacity','0 !important');
    }, 300);
  }

  showImportExcel(){
    this.closemodal();
    $('#ImportExcelPopUp').modal('show');
  }

  onFileChange(evt: any) {
    this.file = evt.target.files[0];
  }
 
  hideImportExcel(){
    $('#ImportExcelPopUp').modal('hide');
  }
 
  ImportExcelData(){
    $('#ImportExcelPopUp').modal('hide');
  }
   //excel file
 
   validateExcel():void {
    if (this.file) {
      this.apiService.uploadExcelFile('api/indirectcost/validateexcel', this.file).subscribe(
        response => {
          console.log('File uploaded successfully', response);
          this.inDirectCostValidationList = response.data;
         this.file=null;       
        },
        error => {
          console.error('Failed to upload file', error);
        }
      );
    } else {
      alert('Please select a file first.');
    }
  }
 

  importExceltoDb(){
    let isCorrectExcel = this.inDirectCostValidationList.some(obj => obj.action === false);
    if(!isCorrectExcel){
      console.log('correct excel');
      this.apiService.postDataWithToken('api/indirectcost/bulkinsert', this.inDirectCostValidationList).subscribe(
        (Response) => {
          this.sweetAlert.importAlert();
          this.hideImportExcel();
          this.getInDirectCost();
          this.id = '';
          this.calculatePages();
          this.currentPage = 1;
        },
        (error) => {
          console.error('Error:', error);
          this.sweetAlert.failureAlert('Unable to Import forex data',error.message);
        }
      );

    }
    else{
      console.log('incorrect excel');
      this.sweetAlert.failureAlert('Unable to Import forex data','Please check the uploaded excel');
    }
  }

}
