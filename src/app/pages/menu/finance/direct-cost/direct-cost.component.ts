import { Component, QueryList, ViewChild, ViewChildren, OnInit, AfterViewInit, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl, FormGroupDirective } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
//import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
//import * as $ from 'jquery';
// Data Get
import { directCostModel } from './direct-cost.model';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import { List } from 'echarts';

declare var $: any;
@Component({
  selector: 'app-direct-cost',
  templateUrl: './direct-cost.component.html',
  styleUrls: ['./direct-cost.component.scss'],
  providers: [DecimalPipe, DatePipe]
})
export class DirectCostComponent {
  colorTheme: any = 'theme-blue';
  // Pagination properties
  totalRecords: number = 0;
  page: number = 0;
  itemsPerPage: number = 10; // Adjust as needed
  perPageOptions: number[] = [10, 20, 30, 40];
  pageSize: number = this.perPageOptions[0];
  pages: number[] = [];

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
  selectedYear: any = "";

  apiResponse: any;
  isLoading = true;
  currentSortColumn: string = ''; // Track the current sorting column
  isSortAscending: boolean = true;
  totalRecordsDisplayed: number = 0;
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
  modelDate = '';
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
  currentdate: string = '';
  monthYearList: any[] = [];
  displayYearArr: number[] = [];


  //formMonthYear_Year: string = '';
  selectedMonthYearRange: any[] = [];

  masterSelected = false;

  dataSource: any = [];
  originalDataSource: any = [];

  // Initialize the debounce time for column filter changes
  private columnFilterDebounceTime: number = 300;
  selectedRows: Set<directCostModel> = new Set<directCostModel>();
  selectedColumns: Set<string> = new Set<string>();

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  productForm!: FormGroup;
  tooltipvalidationform!: FormGroup;
  submitted = false;
  products: any[] = [];
  //userList: any[] = [];


  // Table data
  productList!: Observable<directCostModel[]>;
  //total: Observable<number>;
  formsubmit!: boolean;

  formMonthYear_Year: string = '';

  isDuplicate: boolean = false;
  isWrongDt: boolean = false;
  rangePickLimit: number = 2;

  favoriteSeason: string = "";

  currentYear = new Date().getFullYear();

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

  fileData: any;
  file: File | null = null;

  arrayBuffer: any;
  importedData!: any[];
  DirectCostValidationList:any[]=[];

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  constructor(private http: HttpClient, private formBuilder: UntypedFormBuilder,
    private apiService: ApiService, private datePipe: DatePipe, private sweetAlert: SweetAlertService) {
    //this.productList = service.countries$;
    //this.total = service.total$;
    //console.log(this.productList);
    this.selectedYear = "";


    this.appRole = sessionStorage.getItem('userRole');

    this.productForm = this.formBuilder.group({
      //id: "#VZ2101",
      id: [''],
      year: ['', [Validators.required]],
      type: ['', [Validators.required]],
      department: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      serviceLine: ['', [Validators.required]],
      customer: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      fc: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      fxRate: [null, [Validators.required,Validators.min(0)]],
      costCtc: [null, [Validators.required, Validators.min(0)]],
      branch: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      noOfManDate: [null, [Validators.min(0)]],

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
      def: 'type',
      label: 'Type',
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
      def: 'serviceLine',
      label: 'ServiceLine',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'customer',
      label: 'Customer',
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
      def: 'branch',
      label: 'Branch',
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
      { label: 'Direct Cost', active: true }
    ];
    this.selectedRows = new Set<directCostModel>();
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
    this.getDirectCost();
    setTimeout(() => {
      this.closeLoader();
    }, 3000);


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

  getDirectCost(): void {
    const startIndex = (this.page - 1) * this.itemsPerPage; // Calculate the start index for pagination
    const endIndex = startIndex + this.itemsPerPage;
    this.isLoading = true;
    //this.getKPIConfigData();
    this.apiService.GetDataWithToken('api/directcost/display').subscribe(
      (directCostList) => {
        this.dataSource = directCostList.data;
        this.products = directCostList.data;
        this.pagedItems = this.filteredItems();
        console.log(this.pagedItems)

        this.totalRecords = directCostList.data.length;
        console.log(this.totalRecords)

        this.originalDataSource = directCostList.data;
        this.isLoading = false;
        this.selectedRows.clear();
        this.applyPagination();
        console.log(this.products);
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get Directcost details', error.message);
      }
    );

  }
  getDirectCostFiltered(): void {
    const filterparam =
    {
      typeFilter: $("#Femploymenttype").val() === '' ? null : $("#Femploymenttype").val(),
      departmentFilter: $("#Fdepartment").val() === '' ? null : $("#Fdepartment").val(),
      serviceLineFilter: $("#FserviceLine").val() === '' ? null : $("#FserviceLine").val(),
      customerFilter: $("#Fcustomer").val() === '' ? null : $("#Fcustomer").val(),
      fcFilter: $("#Ffc").val() === '' ? null : $("#Ffc").val(),
      branchFilter: $("#Fbranch").val() === '' ? null : $("#Fbranch").val(),

    }
    this.apiService.postDataWithToken('api/directcost/filter', filterparam).subscribe(
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
        this.sweetAlert.failureAlert('Unable to get filter details', error.message);
      }
    );

  }
  deleteDirectCostData(id: any): void {
    //this.showLoader();

    this.apiService.DeleteDataWithToken(`api/directcost/deletebyid/${id}`).subscribe(
      (Response) => {
        console.log(Response);
        this.selectedRows.clear();
        this.sweetAlert.DeletealertWithSuccess();
        this.getDirectCost();
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
    this.apiService.GetDataWithToken(`api/directcost/displaybyid/${id}`).subscribe(
      (DirectCost) => {


        console.log(DirectCost.data);
        this.productForm.patchValue
          ({
            id: DirectCost.data.id,
            type: DirectCost.data.type,
            year: DirectCost.data.year,
            department: DirectCost.data.department,
            serviceLine: DirectCost.data.serviceLine,
            customer: DirectCost.data.customer,
            fc: DirectCost.data.fc,
            fxRate: DirectCost.data.fxRate,
            costCtc: DirectCost.data.costCtc,
            branch: DirectCost.data.branch,
            noOfManDate: DirectCost.data.noOfManDate
          })

        this.id = DirectCost.data.id;




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
  addDirectCostData(): void {

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

    this.apiService.postDataWithToken('api/directcost/insert', formData).subscribe(
      (Response) => {
        this.apiResponse = Response.Data;
        this.sweetAlert.addAlert();
        this.showModal?.hide();
        this.getDirectCost();
        this.id = '';
        this.productForm.reset();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get Directcost details', error.message);
      }
    );


  }
  updateDirectCostData(id: any) {
    const monthYearValue = this.productForm.get('year')?.value;

    // Set the day part to 01 to ensure only month and year are considered
    const date = new Date(monthYearValue);
    date.setDate(1);
    const MonthYear = this.datePipe.transform(date, 'MMM yyyy');
    this.productForm.patchValue({ year: MonthYear });

    const formData = this.productForm.value;
    formData.id = id;

    this.apiService.UpdateDataWithToken('api/directcost/update', formData).subscribe(
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
        this.getDirectCost();
        this.id = '';
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get Directcost details', error.message);
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

        this.addDirectCostData();
        this.productForm.reset();
      }
      else {
        console.log('Performing update user with id:', id);
        this.updateDirectCostData(id);
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
  submitFilter(): void {
    this.getDirectCostFiltered();
    //this.resetPagination();
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


  openModal() {
    this.menucanadd=true;
    this.productForm.reset();
    this.isEditMode = false;
    this.showModal?.show();
    
    
  }

  closemodal() {
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add DirectCost'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Submit'
    this.isDuplicate = false;
    // this.productForm.markAsPristine();
    // this.productForm.markAsUntouched();
    // this.productForm.updateValueAndValidity();
    this.formsubmit = false;
    //this.productForm.clearValidators();
    //this.productForm.clearAsyncValidators();
    this.showModal?.hide();
    setTimeout(() => {
      this.productForm.reset();
    }, 1000);

    //this.getPublishers();
    this.isEditMode = false;

  }


  // Edit Data
  editList() {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit DirectCost'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'
    this.isEditMode = true;
    const selectedIds = this.getSelectedRowId();
    this.getById(selectedIds);
    // this.formBasedOnPublisher(selectedIds);


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
    this.deleteDirectCostData(selectedIds);
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

    const selectedColumns: (keyof directCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof directCostModel);

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof directCostModel) => {
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
    XLSX.writeFile(workbook,'DirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');

  }

  exportToCsv() {
    const selectedColumns: (keyof directCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof directCostModel);
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
      selectedColumns.forEach((column: keyof directCostModel) => {
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
    link.setAttribute('download', 'DirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.csv');
    document.body.appendChild(link);
    link.click();
  }

  exportToPDF() {
    const selectedColumns: (keyof directCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof directCostModel);

    // Define custom display names for the selected columns
    const selectedColumnsResult = this.convertToAssociativeArray(
      selectedColumns.map((key) => key as string)
    );

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof directCostModel) => {
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
    doc.save('DirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.pdf');
  }

  exportToExcelAll() {
    const selectedColumns: (keyof directCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof directCostModel);

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
      selectedColumns.forEach((column: keyof directCostModel) => {
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

    XLSX.writeFile(workbook, 'DirectCost' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }

  exportToCsvAll() {
    this.isLoading = true;

    const selectedColumns: (keyof directCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof directCostModel);

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
      selectedColumns.forEach((column: keyof directCostModel) => {
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
    link.setAttribute('download', 'DirectCost_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.csv');
    document.body.appendChild(link);
    link.click();
  }

  exportToPDFAll() {
    const doc = new jsPDF({
      orientation: 'landscape',
      // unit: 'pt',
      // format: 'a3'
    }) as any;
  
    const selectedColumns: (keyof directCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof directCostModel);
  
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
      selectedColumns.forEach((column: keyof directCostModel) => {
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
  
    doc.save(`DirectCostList_${formattedDate}.pdf`);
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
  applyPagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
  }
  onPerPageChange() {
    this.currentPage = 1;
    this.applyPagination();
  }

  onPageChange(page: number): void {
    console.log('Received page change event. New page:', page);
    this.currentPage = page;
    console.log('Updated currentPage value:', this.currentPage);
    this.updatePaginationIndices();
}


  updatePaginationIndices(): void {
    // Calculate startIndex based on the currentPage and itemsPerPage
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;

    // Calculate endIndex based on the totalRecords and itemsPerPage
    if (this.currentPage < Math.ceil(this.totalRecords / this.itemsPerPage)) {
      // If it's not the last page
      this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalRecords);
    } else {
      // If it's the last page
      this.endIndex = this.totalRecords;
    }
    this.pagedItems = this.filteredItems().slice(this.startIndex, this.endIndex);
  }


  onSearchKeyUp(searchTerm: string): void {
    this.currentPage = 1; // Reset current page to 1 when search term changes
    this.searchTerm = searchTerm;
    if(searchTerm=='')
      {
        this.getDirectCost();
      }
    this.resetPagination();
    this.filteredItems();
    this.calculatePages(); // Update pagination after updating the search term
    this.applyPagination();
    this.updatePaginationIndices(); // Apply pagination after updating the search term
  }





  onPageSizeChange(): void {

    if (this.pageSize === -1) {
      this.resetPagination();
      this.pagedItems = this.filteredItems();
    } else {
      this.updatePaginationIndices(); // Ensure pagination is applied with the updated page size
    }
  }



  resetPagination() {
   // this.currentPage = 1;
    const startIndex = 0;
    const endIndex = this.pageSize === -1 ? this.dataSource.length : this.pageSize;
    this.pagedItems = this.dataSource.slice(startIndex, endIndex);
    this.calculatePages();
  }

  calculatePages() {
    const filteredItemCount = this.filteredItems().length;
    this.totalRecords = filteredItemCount;

    const totalPages = Math.ceil(filteredItemCount / this.itemsPerPage);

    if (this.currentPage > totalPages && totalPages !== 0) {
      this.currentPage = totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, filteredItemCount);

    this.totalRecordsDisplayed = endIndex - startIndex;
    this.updatePaginationIndices();
  }

  filterByText(item: any): boolean {
    const includeColumns = ['type', 'department', 'customer','serviceLine','fc','fxRate','costCtc','branch','year'];
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
  filteredItems(): any[] {
    const pageSizeNumber = +this.itemsPerPage;

    if (pageSizeNumber === -1) {
      return this.products.filter(item => this.filterByText(item));
    } else {
      const filteredItems = this.products.filter(item => this.filterByText(item));
      const startIndex = (this.currentPage - 1) * pageSizeNumber;
      const endIndex = Math.min(startIndex + pageSizeNumber, filteredItems.length);
      return filteredItems.slice(startIndex, endIndex);
    }
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

  //  Filter Offcanvas Set
  openEnd() {
    document.getElementById('courseFilters')?.classList.add('show')
    document.querySelector('.backdrop3')?.classList.add('show')
  }

  closeoffcanvas() {
    document.getElementById('courseFilters')?.classList.remove('show')
    document.querySelector('.backdrop3')?.classList.remove('show')
   // this.resetFilter();
  }

  populateMonths() {
    this.MonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let year = $('#filterYear').val();
    console.log('selected year' + year);
    //this.selectedYear = year;
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    if (this.selectedYear === "2023") {
      this.MonthNames = this.MonthNames.slice(10, 12);
    }
    else if (this.selectedYear === currentYear.toString()) {
      this.MonthNames = this.MonthNames.slice(0, currentMonth + 1);
      console.log(currentMonth);
    } else {
      this.MonthNames = this.MonthNames.slice(0, 11);
    }
    let months = this.MonthNames;
    let releventMonths = [];
    for (let month of months) {
      let modifiedMonth = { monthName: month, value: month + " " + this.selectedYear };
      releventMonths.push(modifiedMonth);
    }
    this.releventMonths = releventMonths;

  }

  resetFilter() {
    this.getDirectCost();
    $('#Femploymenttype').val("");
    $('#Fdepartment').val("");
    $('#FserviceLine').val("");
    $('#Fcustomer').val("");
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

  //import excel
  importFromExcel(file: File, sheetName: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          reject(`Sheet "${sheetName}" not found in the Excel file.`);
          return;
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        resolve(jsonData);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsArrayBuffer(file);
    });

  }

  open() {
    $('#upload').modal('show');
  }

  close() {
    $('#upload').modal('hide');
  }


  onFileChange(evt: any) {
    this.file = evt.target.files[0];
  }


  showImportExcel() {
    //this.closemodal();
    $('#ImportExcelPopUp').modal('show');
  }

  hideImportExcel() {
    $('#ImportExcelPopUp').modal('hide');
  }

  ImportExcelData() {
    $('#ImportExcelPopUp').modal('hide');
  }


  //excel file
 
  validateExcel():void {
    if (this.file) {
      this.apiService.uploadExcelFile('api/directcost/validateexcel', this.file).subscribe(
        response => {
          console.log('File uploaded successfully', response);
          this.DirectCostValidationList = response.data;
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
    let isCorrectExcel = this.DirectCostValidationList.some(obj => obj.action === false);
    if(!isCorrectExcel){
      console.log('correct excel');
      this.apiService.postDataWithToken('api/directcost/bulkinsert', this.DirectCostValidationList).subscribe(
        (Response) => {
          this.sweetAlert.importAlert();
          this.hideImportExcel();
          this.getDirectCost();
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
