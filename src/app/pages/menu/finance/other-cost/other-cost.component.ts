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
import { otherCostModel } from './other-cost.model';
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
declare var $: any;

@Component({
  selector: 'app-other-cost',
  templateUrl: './other-cost.component.html',
  styleUrls: ['./other-cost.component.scss'],
  providers: [DecimalPipe, DatePipe]
})

export class OtherCostComponent {
  colorTheme: any = 'theme-blue';
  // Pagination properties
  totalRecords: number = 0;
  page: number = 0;
  itemsPerPage: number = 10; // Adjust as needed
  perPageOptions: number[] = [10, 20, 30, 40];
  //perPageOptions: number[] = [6,12,16];

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
   selectedRows: Set<otherCostModel> = new Set<otherCostModel>();
   selectedColumns: Set<string> = new Set<string>();
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  productForm!: FormGroup;
  filterForm!: FormGroup;
  tooltipvalidationform!: FormGroup;
  submitted = false;
  products: any[] = [];
  //userList: any[] = [];
   
    // Table data
    productList!: Observable<otherCostModel[]>;
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
  
    //variables
    id: number|string|undefined;
    Vch: string = '';
    supplierName: string = '';
    typeOfExpense: string = '';
    serviceLine?: string = '';
    customer?: string = '';
    description: string = '';
    invoiceNo: string = '';
    invoiceDate: Date|undefined;
    poNo?: string = '';
    poDate?: Date;
    rcm: boolean=false;
    hsnSac: number|undefined;
    qty: number|undefined;
    rate: number|undefined;
    value: number|undefined;
    fxrate?: number|undefined;
    valueInr?: number|undefined;
    vat?: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    totalInvoiceValueInr: number|undefined;
    tdsApplicable: boolean=false;
    tdsDeclaration: boolean=false;
    tdsSection: string= '';
    tdsRate: number|undefined;
    tdsValue?: number;
    budgeted: boolean=false;
    budgetedAmount: number|undefined;
    variance: string|undefined;
    type: string = '';

    //filters
    fsupplierName: string = '';

    selectedTypeOfExpense1: string|any = "Select"; 
    selectedTypeOfExpense2: string|any = "Select";
    selectedTypeOfExpense3: string|any = "Select";
    selectedTypeOfExpense4: string|any = "Select";  
    selectedTypeOfExpense5: string|any = "Select"; 
    selectedTypeOfExpense6: string|any = "Select"; 
    selectedTypeOfExpense7: string|any = "Select"; 
    formattedInvoiceDate:any;


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

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('formRef') formRef!: ElementRef;

  constructor(private http: HttpClient,private fb: UntypedFormBuilder,private datePipe: DatePipe,
    private apiService: ApiService,private sweetAlert: SweetAlertService) {

      this.productForm = this.fb.group({
    Vch: ['', Validators.required],
    supplierName: ['', [Validators.required]],
    typeOfExpense: ['', [Validators.required]],
    serviceLine: [null],
    customer: [null],
    description: ['', [Validators.required]],
    invoiceNo: ['', [Validators.required,Validators.maxLength(16)]],
    invoiceDate: [null],
    poNo: [null, [Validators.maxLength(16)]],
    poDate: [null],
    rcm: [false,Validators.required],
    hsnSac: [null,Validators.required],
    qty: [null,Validators.maxLength(8)],
    rate: [null],
    value: [null],
    fxrate: [null],
    valueInr: [null],
    vat: [''],
    cgst: [null],
    sgst: [null],
    igst: [null],
    totalInvoiceValueInr: [null,Validators.required],
    tdsApplicable: [false,Validators.required],
    tdsDeclaration: [false,Validators.required],
    tdsSection: [null],
    tdsRate: [null,Validators.required],
    tdsValue: [null,Validators.required],
    budgeted: [false,Validators.required],
    budgetedAmount: [null,Validators.required],
    variance: ['',Validators.required]  
    });

    this.filterForm = this.fb.group({
      supplierName: [null],
      typeOfExpense: [null],
      serviceLine: [null],
      customer: [null],
      invoiceNo: [null],
      invoiceDate: [null],
      poNo: [null]
    });
  }

  columnDefinitions: any[] = [    {
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
      def: 'vch',
      label: 'VCH',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'supplierName',
      label: 'Supplier Name',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'typeOfExpense',
      label: 'Type Of Expense',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'serviceLine',
      label: 'Service Line',
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
      def: 'description',
      label: 'Description',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'invoiceNo',
      label: 'Invoice No',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'invoiceDate',
      label: 'Invoice Date',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'poNo',
      label: 'Po No',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'poDate',
      label: 'Po Date',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'rcm',
      label: 'RCM',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'hsnSac',
      label: 'HsnSac',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    }
    ,{
      def: 'qty',
      label: 'Qty',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'rate',
      label: 'Rate',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'value',
      label: 'Value',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'fxrate',
      label: 'Fxrate',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'valueInr',
      label: 'ValueInr',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'vat',
      label: 'VAT',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'cgst',
      label: 'CGST',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'sgst',
      label: 'SGST',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'igst',
      label: 'IGST',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'totalInvoiceValueInr',
      label: 'Total InvoiceValueInr',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'tdsApplicable',
      label: 'TDS Applicable',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'tdsDeclaration',
      label: 'TDS Declaration',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'tdsSection',
      label: 'TDS Section',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'tdsRate',
      label: 'TDS Rate',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'tdsValue',
      label: 'TDS Value',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'budgeted',
      label: 'Budgeted',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'budgetedAmount',
      label: 'Budgeted Amount',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'variance',
      label: 'Variance',
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

    this.selectedTypeOfExpense1 = null;
    this.selectedTypeOfExpense2 = null;
    this.selectedTypeOfExpense3 = null;
    this.selectedTypeOfExpense4 = null;
    this.selectedTypeOfExpense5 = null;
    this.selectedTypeOfExpense6 = null;
    this.selectedTypeOfExpense7 = null;

    this.appRole = sessionStorage.getItem('userRole');   

    this.breadCrumbItems = [
      { label: 'Finance' },
      { label: 'Other Cost', active: true }
    ];

    this.selectedRows = new Set<otherCostModel>();
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
    this.getOtherCost();
    setTimeout(() => {
      this.closeLoader();
    }, 3000);


  }

  ngAfterViewInit(): void {
    this.formRef.nativeElement.addEventListener('scroll', this.scrollHandler.bind(this));
  }

  onInputChange(event: any,controlName: string) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.productForm.get(controlName)?.setValue(input.value);
}


  get formControls() {
    return this.productForm.controls;
  }

  calculateTDSValue() {
    const totalInvoiceValueInr = this.productForm.get('totalInvoiceValueInr')?.value;
    const tdsRate = this.productForm.get('tdsRate')?.value;
    let tdsValue = totalInvoiceValueInr * (tdsRate / 100);
    tdsValue = Number(tdsValue.toFixed(2));
    this.productForm.patchValue({ tdsValue: tdsValue });
  }

  //validation
  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  ValidateControlData(event: any, controlname: string, validateduplicate: Boolean, validatenumber: Boolean, validatespecial: Boolean, validatealpha: Boolean, IsRequired: Boolean): void {
    const controlName = event.target.value.trim();
    const controlValue = this.productForm.get(controlname)?.value;
    if (controlName) {
      const isDuplicate = this.DirectCostList.some((name: any) =>
        name.toLowerCase() === controlName.toLowerCase() && name.toLowerCase() !== this.Vch.toLowerCase()
      );
      if (validateduplicate && isDuplicate) {
        this.productForm.get(controlname)?.setErrors({ duplicate: true });
      }
      else if (validatenumber && /^-?\d+$/.test(controlName)) {
        this.productForm.get(controlname)?.setErrors({ invalidNumber: true });
      }
    else if (validatespecial && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(controlName)) {
      this.productForm.get(controlname)?.setErrors({ invalidData: true });
    }
    else if (validatealpha && !/^[a-zA-Z\s]+$/.test(controlName)) {
      this.productForm.get(controlname)?.setErrors({ invalidAlpha: true });
    }
    else if (IsRequired==false) {
      this.productForm.get(controlname)?.setErrors({ required: false });
      this.productForm.get(controlname)?.setErrors(null);
    }
    else
    {
      this.productForm.get(controlname)?.setErrors(null);
    }
  } else {
    this.productForm.get(controlname)?.setErrors({ required: true });
  }

//   if (controlName.length > 10) {
//     this.productForm.get(controlname)?.setErrors({ maxLength: true });
// } else {
//     this.productForm.get(controlname)?.setErrors(null);
// }
    
  }

  isValidEmail(email: string): boolean {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //api call
  getRoleTableData(currenturl:string): void {
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.appRole}&url=${currenturl}`).subscribe(
      (response) => {
        this.menucanview = response.canview;
        this.menucanadd = response.caninsert;
        this.menucanupdate = response.canupdate;
        this.menucandelete = response.candelete;
        //console.log('view ' + response.canview + ' insert ' + response.caninsert + ' update ' + response.canupdate + ' delete ' + response.candelete)
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('UserAccess failure','message:'+ error.error.message + ', error:'+error.error.error,);
      }
    );
  }

  getOtherCost(): void {
    //this.getKPIConfigData();
    this.apiService.GetDataWithToken('api/othercost/display').subscribe(
      (directCostList) => {
        this.dataSource = directCostList.data[0];
        this.products = directCostList.data;
        this.pagedItems = this.filteredItems();

        this.totalRecords = directCostList.data.length;

        this.originalDataSource = directCostList.data;
        this.isLoading = false;
        // this.selectedRows.clear();
        // this.pagedItems = this.filteredItems();
        // this.calculatePages();
        // this.resetPagination();
        this.applyPagination();
        //this.resetTableFilterAndPagination();
        
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Display failure','message:'+ error.error.message + ', error:'+error.error.error,);
      }
    );

  }

  deleteOtherCostData(id: any): void {
    //this.showLoader();
    this.apiService.DeleteDataWithToken(`api/othercost/deletebyid/${id}`).subscribe(
      (Response) => {
        console.log(Response);
        this.selectedRows.clear();
        this.sweetAlert.DeletealertWithSuccess();
        this.getOtherCost();
      },
      (error) => {
        console.error('Error', error);
        this.sweetAlert.failureAlert('Deletion failure','message:'+ error.error.message + ', error:'+error.error.error,);
      }
    );
  }

  getById(id: any) {
    //this.showLoading();
    this.apiService.GetDataWithToken(`api/othercost/displaybyid/${id}`).subscribe(
      (otherCost) => {
        console.log(otherCost.data);
        this.productForm.patchValue
          ({
            id: otherCost.data.id,
            Vch: otherCost.data.vch,
            supplierName: otherCost.data.supplierName,
            typeOfExpense: otherCost.data.typeOfExpense,
            serviceLine: otherCost.data.serviceLine,
            customer: otherCost.data.customer,
            description:otherCost.data.description,
            invoiceNo: otherCost.data.invoiceNo,
            invoiceDate: otherCost.data.invoiceDate,
            poNo: otherCost.data.poNo,
            poDate: otherCost.data.poDate,
            rcm: otherCost.data.rcm,
            hsnSac: otherCost.data.hsnSac,
            qty: otherCost.data.qty,
            rate: otherCost.data.rate,
            value: otherCost.data.value,
            fxrate: otherCost.data.fxrate,
            valueInr: otherCost.data.valueInr,
            vat: otherCost.data.vat,
            cgst: otherCost.data.cgst,
            sgst: otherCost.data.sgst,
            igst: otherCost.data.igst,
            totalInvoiceValueInr: otherCost.data.totalInvoiceValueInr,
            tdsApplicable: otherCost.data.tdsApplicable,
            tdsDeclaration: otherCost.data.tdsDeclaration,
            tdsSection: otherCost.data.tdsSection,
            tdsRate: otherCost.data.tdsRate,
            tdsValue: otherCost.data.tdsValue,
            budgeted: otherCost.data.budgeted,
            budgetedAmount: otherCost.data.budgetedAmount,
            variance: otherCost.data.variance,
          })

        this.id = otherCost.data.id;
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Display failure','message:'+ error.error.message + ', error:'+error.error.error,);
      }
    );
    //this.hideLoading();
  }

  addOtherCostData(): void {

    console.log('addOtherCostData triggered');
    const formData = this.productForm.value;
    formData.id = 0;
    console.log(formData);

    this.apiService.postDataWithToken('api/othercost/insert', formData).subscribe(
      (Response) => {
        console.log('data submitted');        
        this.getOtherCost();
        this.id = '';
        this.apiResponse = Response.Data;
        this.sweetAlert.addAlert();
        this.showModal?.hide();
      },
      (error) => {
        console.error('Error:', error);        
        this.sweetAlert.failureAlert('Insertion failure','message:'+ error.error.message + ', error:'+error.error.error,);
      }
    );

  }

  updateOtherCostData(id: any) {

    const formData = this.productForm.value;
    formData.id = id;

    this.apiService.UpdateDataWithToken('api/othercost/update', formData).subscribe(
      (Response) => {
        //this.apiResponse = Response.Data;
        this.isEditMode = false;
        //this.selectedRows.size  === 0;
        this.selectedRows.size === -1;
        this.selectedRows.clear();
        this.closemodal();
        setTimeout(() => {
          //this.productForm.reset();
        }, 1000);
        this.showModal?.hide()
        this.sweetAlert.updateAlert();
        //$('#addUpdatePopUp').modal('hide');
        this.getOtherCost();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Update failure','message:'+ error.error.message + ', error:'+error.error.error,);
      }

    );


  }

  submitData(id: any): void {
    console.log("submit triggerd " + id);
    console.log(this.productForm)
    // Check if the form is valid
    if (this.productForm.valid) {
      console.log("valid")
      if (!id) {
        //this.addDirectCostData();
        console.log("adding data " + id);
        this.addOtherCostData();
      }
      else {
        console.log('Performing update user with id:', id);
        this.updateOtherCostData(id);
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
      console.log('the form is invalid');
    }
  }


  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  //validation
   // File Upload
  //  imageURL: any;
  //  onUploadSuccess(event: any) {
  //    setTimeout(() => {
  //      this.uploadedFiles.push(event[0]);
  //      this.productForm.controls['img'].setValue(event[0].dataURL);
  //    }, 100);
  //  }

   // File Remove
  //  removeFile(event: any) {
  //   this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  // }

  clearForm() {

  }

  resetData() {
    if (this.id === '') {
      this.clearForm();
    }
  }

  openModal() {
    this.productForm.reset();
    this.productForm.get('typeOfExpense')?.setValue('');
    this.productForm.get('serviceLine')?.setValue('');
    this.productForm.get('rcm')?.setValue('');
    this.productForm.get('tdsApplicable')?.setValue('');
    this.productForm.get('tdsDeclaration')?.setValue('');
    this.productForm.get('tdsSection')?.setValue(null);
    this.productForm.get('budgeted')?.setValue('');
    console.log('openModal open');
    this.isEditMode = false;
    this.showModal?.show();
    }

  closemodal() {
    console.log('closemodal trigger');
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add OtherCost'
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
    this.deleteOtherCostData(selectedIds);
    this.deleteRecordModal?.hide()
    //this.masterSelected = true;
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

  scrollHandler(event: Event): void {
    const form = event.target as HTMLFormElement;
    if (form.scrollHeight > form.clientHeight) {
      form.scrollTop = 0;
    }
  }
  /**
     * Export method starts
     */
  exportToExcel() {
    const selectedColumns: (keyof otherCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof otherCostModel);
  
    // const dataToExport = this.pagedItems.map((item: any) => {
    //   const exportedItem: Record<string, any> = {};
    //   selectedColumns.forEach((column: keyof otherCostModel) => {
    //     exportedItem[column as string] = item[column];
    //   });
    //   return exportedItem;
    // });

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof otherCostModel) => {
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
    XLSX.writeFile(workbook, 'other_'+this.datePipe.transform(myDate, 'ddMMyyy')+'.xlsx');
  }
  
  exporttocsvnew(interfaces: any) { }

  exportToCsv() {
    const selectedColumns: (keyof otherCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof otherCostModel);
  
    const headerRow =
      '\uFEFF' +
      selectedColumns
        .map((column) => `"${column.toString().replace(/"/g, '""')}"`)
        .join(',');
  
    // const dataToExport = this.pagedItems.map((item: any) => {
    //   const exportedItem: Record<string, any> = {};
    //   selectedColumns.forEach((column: keyof otherCostModel) => {
    //     exportedItem[column as string] = item[column];
    //   });
    //   return exportedItem;
    // });

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof otherCostModel) => {
        exportedItem[column as string] = item[column];
      });
      return exportedItem;
    });
  
    const csvContent =
      headerRow +
      '\n' +
      dataToExport
        .map((item) =>
          selectedColumns
            .map((column) => `"${item[column as keyof otherCostModel]?.toString().replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'otherCostModel.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  

  exportToPDF() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a3'
    }) as any;
  
    const data = []; // Initialize an empty array for your tabular data
  
    // Define the headers for your table
    const headers = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof otherCostModel);
  
    // Add headers to the data array as the first row
    data.push(headers);
  
    // Iterate over your tabular data and push each row to the data array
    // this.pagedItems.forEach((item, index) => {
    //   const rowData = headers.map((column) => item[column]);
    //   data.push(rowData);
    // });
    this.filteredItems().forEach((item, index) => {
      const rowData = headers.map((column) => item[column]);
      data.push(rowData);
    });
  
    doc.autoTable({
      body: data,
      theme: 'grid',
      styles: {
        fontSize: 6, // Adjust font size as needed for readability
        cellPadding: 1,
      },
      columnStyles: {
        0: { cellWidth: 'auto' } // Adjust column widths as needed
      }
    });
  
    // Format the date and save the PDF
    const myDate = new Date();
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy'); // Ensure this is correctly implemented
    doc.save(`OtherCost_${formattedDate}.pdf`);
  }
  

   // export all
   exportToExcelAll() {
    const selectedColumns: (keyof otherCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof otherCostModel);

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
      selectedColumns.forEach((column: keyof otherCostModel) => {
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

    XLSX.writeFile(workbook, 'othercost_data_all_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }

  exportToCsvAll() {
    this.isLoading = true;
    const selectedColumns: (keyof otherCostModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof otherCostModel);

    // Extract header row
    // const headerRow = selectedColumns.map((column) => column.toString());
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

    if (this.originalDataSource.length === 0) {
      console.warn('No data to export');
      return;
    }
    const dataToExport = this.originalDataSource.map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof otherCostModel) => {
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
    link.setAttribute('download', 'Other_data_all_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.csv');
    document.body.appendChild(link);
    link.click();

    // this.service.getConsignmentsList(payload).subscribe(
    //   (data: any) => {
    //     this.isLoading = false;

    //   },
    //   (error: any) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
  }

  exportAllPdf() {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a3'
    }) as any;

    const selectedColumns: (keyof otherCostModel)[] = this.columnDefinitions
        .filter((column) => column.visible)
        .map((column) => column.def as keyof otherCostModel);

    // Define the headers for your table
    //const headers = selectedColumns.map((column) => column as string);

    const headers = ['VCH', 'Supplier Name', 'Type of Expense', 'Service Line', 'Customer', 'Description','Invoice No','Invoice Date','PO No','PO Date','RCM-Y/N','HSN/SAC','Qty','Rate','Value','FX Rate','Value - INR','VAT','CGST','SGST','IGST','Total Invoice Value - INR','TDS Applicable','TDS Declaration Y/N','TDS Section','TDS Rate','TDS Value','Budgeted Y/N','Budgeted Amount','Variance'];

    // Add headers to the data array as the first row
    //data.push(headers);
    // Add headers to the data array as the first row
    const data = [headers];

    // Iterate over your tabular data and push each row to the data array
    const dataToExport = this.originalDataSource.map((item: any) => {
        const exportedItem: Record<string, any> = {};
        selectedColumns.forEach((column: keyof otherCostModel) => {
            exportedItem[column as string] = item[column];
        });
        return exportedItem;
    });

    // Add data to the table
    dataToExport.forEach((row: any) => {
        const rowData = selectedColumns.map((column) => row[column]);
        data.push(rowData);
    });

    doc.autoTable({
        head: [headers], // Add headers to the table
        body: data.slice(1), // Exclude headers from data
        theme: 'grid',
        styles: {
            fontSize: 6, // Adjust font size as needed for readability
            cellPadding: 1,
        },
        columnStyles: {
            0: { cellWidth: 'auto' } // Adjust column widths as needed
        }
    });

    // Format the date and save the PDF
    const myDate = new Date();
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy'); // Ensure this is correctly implemented
    doc.save(`OtherCost_${formattedDate}.pdf`);
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

  applyPagination() {
    // this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    // this.endIndex = this.currentPage * this.itemsPerPage;
    // this.dataSource = this.dataSource.slice(this.startIndex, this.endIndex);
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    this.dataSource = this.dataSource.slice(this.startIndex, this.endIndex);
  }
  onPerPageChange() {
    this.page = 1; // Reset to the first page when changing items per page
    this.pageSize = this.itemsPerPage;
    this.getOtherCost();
  }
  // Handle page changes
  onPageChange(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    // console.log(this.pageSize);
    // if (this.pageSize === 0) {

    //   return; // Do nothing for the "Select" option
    // }
    // this.currentPage = page + 1;
    // console.log('in page change page', page);
    // console.log('in page change pageSize', this.pageSize);
    // const startIndex = (page - 1) * this.pageSize;
    // const endIndex = startIndex + this.pageSize;
    // this.endIndex = this.currentPage * this.itemsPerPage;
    // //this.endIndex = startIndex;
    // if (this.selectedYear != "" || this.selectedMonthYear != "" || this.selectedEndDate != "" || this.selectedStartDate != "") {
    //   console.log('start', startIndex);
    //   console.log('end', endIndex);

    //   this.startDate = startIndex.toString();
    //   this.endDate = endIndex.toString();
    //   this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    // }
    // else {
    //   this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    // }

  }
  onSearchKeyUp(searchTerm: string): void {
    this.currentPage = 1;
    this.searchTerm = searchTerm;
    this.pagedItems = this.filteredItems();
    this.resetPagination();
  }
  
  checkUncheckAll(event: any) {
    if (event.target.checked) {
      // Check all items
      console.log('check checkUncheckAll');
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
    console.log('handleRowClick event');
    // Check if the click was on the checkbox
    const checkboxClicked = (event.target as HTMLElement).tagName === 'INPUT';
    if (!checkboxClicked) {
      console.log('handleRowClick inbracket');
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
    console.log('getSelectedRowId');
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


  onPageSizeChange(): void {
    this.resetPagination();
    this.currentPage = 1; // Uncomment this line if you want to reset to the first page
    if (this.pageSize === -1) {
      this.pagedItems = this.filteredItems();
    } else {
      this.pagedItems = this.filteredItems().slice(0, this.pageSize);
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
  }


  resetPagination() {
    // this.currentPage = 1;
    // const filteredItems = this.filteredItems();
    // this.pagedItems = filteredItems.slice(0, this.pageSize === -1 ? filteredItems.length : this.pageSize);
    // this.calculatePages();
    this.currentPage = 1;
    const startIndex = 0;
    const endIndex = this.pageSize === -1 ? this.dataSource.length : this.pageSize;
    this.pagedItems = this.dataSource.slice(startIndex, endIndex);
    this.calculatePages();
  }
  calculatePages() {
    // Calculate total number of pages based on total items and page size
    // if (this.pageSize === 1) {
    //   this.pages = [1]; // If page size is -1 (All), only one page
    // } else {
    //   this.pages = [];
    //   const totalPages = Math.ceil(this.totalPages / this.pageSize);
    //   for (let i = 1; i <= totalPages; i++) {
    //     this.pages.push(i);
    //   }
    // }
    const totalPages = Math.ceil(this.dataSource.length / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
// filterByMonthYear(item: any): boolean {
  //   // Filter by selected month-year
  //   return !this.selectedMonthYear || item.monthYear === this.selectedMonthYear;
  // }

  onYearChange(): void {

    this.currentPage = 1;
    this.pagedItems = this.filteredItems();
    this.resetPagination();

  }
  filterByMonthYear(item: any): boolean {
    // Filter by selected month-year
    return !this.selectedMonthYear || item.monthYear === this.selectedMonthYear;
  }
  
  filterByText(item: any): boolean {
    const includeColumns = [''];
    // Filter by text box input for all columns
    if (!this.searchTerm) {
      return true; // No filter applied
    }
    // Check if any column contains the search term (string or number)
    for (let key in item) {
      if (item.hasOwnProperty(key) && !includeColumns.includes(key)) {
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
    const pageSizeNumber = +this.pageSize;
  
    if (pageSizeNumber === -1) {
      // No pagination
      return this.products.filter(item =>
        this.filterByText(item)
        // this.filterByTypeofEmployment(item) &&
        // this.filterByMonthYear(item) &&
        // this.filterByDateRange(item) &&
        // this.filterByYear(item)
      );
    } else {
      // Pagination applied
      const startIndex = (this.currentPage - 1) * pageSizeNumber;
      const endIndex = startIndex + pageSizeNumber;
      const filteredProducts = this.products.filter(item =>
        this.filterByText(item)
      );
  
      // Apply type of employment filter if any date-related filters are selected
      // if (this.selectedYear || this.selectedMonthYear || this.selectedEndDate || this.selectedStartDate) {
      //   return filteredProducts.filter(item =>
      //     this.filterByTypeofEmployment(item)
      //   ).slice(startIndex, endIndex);
      // } else {
      //   // No date or month-year filter selected, return all filtered products with pagination
      //   return filteredProducts.slice(startIndex, endIndex);
      // }
      return filteredProducts.slice(startIndex, endIndex);
    }
  }

  filterByYear(item: any): boolean {
    // Filter by selected year
    return !this.selectedYear || item.monthYear.includes(this.selectedYear.toString());
  }

  filterByTypeofEmployment(item: any): boolean {
    // Retrieve the selected employment type from the dropdown
    const employmentTypeElement = document.getElementById('Employmenttype') as HTMLSelectElement;
    const selectedEmploymentType = employmentTypeElement.value;

    // Check if the item's employment type matches the selected type
    if (selectedEmploymentType === "" || selectedEmploymentType === "Select") {
      // If "Select" is chosen, return true to include all items
      return true;
    } else {
      // Otherwise, return true only if the item's employment type matches the selected type
      return item.employmentType === selectedEmploymentType;
    }
  }


  filterByDateRange(item: any): boolean {
    //this.selectedStartDate = this.startDate;
    //this.selectedEndDate = this.endDate;
    if (!this.selectedStartDate || !this.selectedEndDate) {
      return true; // No filter applied if start or end date is not selected
    }
    var ssd = this.selectedStartDate.slice(' ');
    //console.log(ssd[0]);
    //console.log('start date',this.MonthNames.indexOf(ssd[0]));
    const itemDate = new Date(item.monthYear); // Replace 'date' with the actual property representing the date in your data
    const startDate = new Date(this.selectedStartDate);
    const endDate = new Date(this.selectedEndDate);

    return itemDate >= startDate && itemDate <= endDate;
  }


  submitFilter(){
    if (this.isFormEmpty()) {
      console.log('All form values are null. Skipping API request.');
      return;
    }
    console.log(this.filterForm.value);
    
    this.apiService.postDataWithToken('api/othercost/filter', this.filterForm.value).subscribe(
      (response) => {
        this.dataSource = response.data[0];
        this.products = response.data;
        this.pagedItems = this.filteredItems();

        this.totalRecords = response.data.length;

        this.originalDataSource = response.data;
        this.isLoading = false;
        // this.selectedRows.clear();
        // this.pagedItems = this.filteredItems();
        // this.calculatePages();
        // this.resetPagination();
        this.applyPagination();
        //this.resetTableFilterAndPagination();
        console.log('othercost response '+ response.data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  isFormEmpty(): boolean {
    return Object.values(this.filterForm.value).every(value => value === null);
  }

  resetFilter() {
    this.filterForm.reset();
    this.filterForm.get('typeOfExpense')?.setValue('');
    this.filterForm.get('serviceLine')?.setValue('');    
    this.getOtherCost();
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

  //Loader
  showLoader(): void {
    $('#loaderAnimation').modal('show');
  }

  closeLoader(): void {
    setTimeout(() => {
      $('#loaderAnimation').modal('hide');
      //$('.modal-backdrop.show').css('opacity','0 !important');
    }, 300);
  }

}
