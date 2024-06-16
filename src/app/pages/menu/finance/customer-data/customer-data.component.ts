import { Component, ViewChild } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
// Data Get
import { customerDataModel } from './customer-data.model';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/API/api.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
  providers: [DecimalPipe, DatePipe]
})

export class CustomerDataComponent {

  colorTheme: any = 'theme-blue';
  // Pagination properties
  totalRecords: number = 0;
  page: number = 0;
  itemsPerPage: number = 10; // Adjust as needed
  perPageOptions: number[] = [10, 20, 30, 40];
  pageSize: number = this.perPageOptions[0];
  pages: number[] = [];

  releventMonths: any[] = [];
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 10;

  //selectedStartDate: any = "";   // need to remove
  //selectedEndDate: any = "";     // need to remove
  searchTerm: string = '';


  //apiResponse: any;
  isLoading = true;
  currentSortColumn: string = ''; // Track the current sorting column
  isSortAscending: boolean = true;

  submitButtonClicked = false;
  sortColumn = 'acronym'; // default sort column
  sortOrder = 'asc'; // default sort order
  showFilter: boolean = false;
  //selectedMonthYear: any = "";
  masterSelected = false;

  dataSource: any = [];
  originalDataSource: any = [];

  // Initialize the debounce time for column filter changes
  private columnFilterDebounceTime: number = 300;
  selectedRows: Set<customerDataModel> = new Set<customerDataModel>();
  selectedColumns: Set<string> = new Set<string>();

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  customerDataForm!: FormGroup;
  tooltipvalidationform!: FormGroup;
  submitted = false;
  customers: any[] = [];
  wholeCustomerList: any[] = [];

  // Table data
  customerList!: Observable<customerDataModel[]>;
  formsubmit!: boolean;
  isDuplicate: boolean = false;

  totalPages = 0;
  isEditMode = false;
  id: string = '';
  CustomerDataValidatedList: any[] = [];

  pagedItems: any[] = [];

  Rolename: string | null = '';
  menucanview: boolean = false;
  menucanadd: boolean = false;
  menucanupdate: boolean = false;
  menucandelete: boolean = false;

  // text based restriction variables
  alphabetsRegex = /^[a-zA-Z ]*$/; // Allow letters and spaces
  numbersRegex = /^[0-9]*$/;
  decimalRegex = /^[0-9.]*$/;
  alphanumericRegex = /^[a-zA-Z0-9 ]*$/; // Allow letters, numbers, and spaces
  alphanumericSpecialRegex = /^[a-zA-Z0-9!@#$%^&*() ]*$/; // Allow letters, numbers, special characters, and spaces
  alphabetsSpecialRegex = /^[a-zA-Z!@#$%^&*() ]*$/; // Allow letters, special characters, and spaces
  //ValidationType = ValidationType;
  //majorHeadServiceLine: string = '';
  //uom: string = '';
  //EDPMSClosure: string = '';
  //newBusiness: string = '';
  //Year: string = '';
  currentDate = new Date();
  currentMonth: number = this.currentDate.getMonth() + 1;  // JavaScript months are 0-indexed
  currentYear: number = this.currentDate.getFullYear();

  // Optionally, get month as a string name
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  currentMonthName: string = this.monthNames[this.currentDate.getMonth()];
  currentMonthYear:string = this.currentMonthName+" "+this.currentYear;

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  constructor(private formBuilder: UntypedFormBuilder, private fb: FormBuilder,
    private apiService: ApiService, private datePipe: DatePipe, 
    private sweetAlert: SweetAlertService
    ) {

    this.Rolename = sessionStorage.getItem('userRole');

    this.customerDataForm = this.fb.group({
      id: [''],
      UA: ['', [Validators.required]],
      Year: ['', [Validators.required]],
      InvoiceNo: ['', [Validators.required]],
      InvoiceDate: [''],
      CustomerName: ['', [Validators.required]],
      CustomerAcronym: ['', [Validators.required]],
      TSPage: [0, [Validators.required]],
      CCYType: ['', [Validators.required]],
      MajorHeadServiceLine: [null, [Validators.required]],
      MinorHead: ['', [Validators.required]],
      Quantity: [0, [Validators.required]],
      UOM: ['', [Validators.required]],
      Rate: [0, [Validators.required]],
      GrowssValueFc: [null,Validators.required],
      CollectionDate: ['', [Validators.required]],
      CollectionValueFC: [0, [Validators.required]],
      FXRate: [''],
      CollectionValueINR: ['', [Validators.required]],
      ForexGainLoss: [0],
      IRM: ['', [Validators.required]],
      STPISubmissionDate: ['', [Validators.required]],
      SoftexNo: ['', [Validators.required]],
      EDPMSUploadDate: ['', [Validators.required]],
      EDPMSRefNo: ['', [Validators.required]],
      EDPMSClosureYnp: ['', [Validators.required]],
      EBRCNo: ['', [Validators.required]],
      EBRCDate: ['', [Validators.required]],
      ADBank: ['', [Validators.required]],
      NewBusiness: [false, [Validators.required]],
      AgedDays: [0, [Validators.required]]
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
      def: 'ua',
      label: 'U / A',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'year',
      label: 'Year',
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
      def: 'customerName',
      label: 'Customer Name',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'customerAcronym',
      label: 'Customer Acronym',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'tspage',
      label: 'TS Page',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },

    {
      def: 'ccytype',
      label: 'CCY Type',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'majorHeadServiceLine',
      label: 'Major Head \n(ServiceLine)',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'minorHead',
      label: 'Minor Head',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'quantity',
      label: 'Quantity',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'uom',
      label: 'UOM',
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
      def: 'growssValueFc',
      label: 'Gross Value FC',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'collectionDate',
      label: 'Collection Date',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'collectionValueFc',
      label: 'Collection Value FC',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'fxrate',
      label: 'FX Rate',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'collectionValueInr',
      label: 'Collection Value INR',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'forexGainLoss',
      label: 'Forex Gain / Loss',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'irm',
      label: 'IRM',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'stpiSubmissionDate',
      label: 'STPI Submission Date',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'softexNo',
      label: 'Softex No',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'edpmsUploadDate',
      label: 'EDPMS Upload Date',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'edpmsRefNo',
      label: 'EDPMS Ref No',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'edpmsClosureYnp',
      label: 'EDPMS Closure',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'ebrcNo',
      label: 'EBRC No',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'ebrcDate',
      label: 'EBRC Date',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'adBank',
      label: 'AD Bank',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'newBusiness',
      label: 'New Business',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    },
    {
      def: 'agedDays',
      label: 'Aged Days',
      visible: true,
      sortable: true,
      filterable: true,
      filter: new FormControl(''),
      disableHide: false,
    }

  ];

  fileData: any;
  file!: File;
  arrayBuffer: any;

  forbidNonNumeric(control: FormControl) {
    const isNumeric = /^\d*$/.test(control.value);
    return isNumeric ? null : { nonNumeric: true };
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showLoader();
    }, 100);
    const currenturl = new URL(window.location.href).pathname.substring(1);
    console.log('current url: ',currenturl);
    this.Rolename = sessionStorage.getItem('userRole');
    this.breadCrumbItems = [
      { label: 'Finance' },
      { label: 'Customer Data', active: true }
    ];
    this.selectedRows = new Set<customerDataModel>();
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
    this.getCustomerData();
    setTimeout(() => {
      this.closeLoader();
    }, 3000);
    $("#sampleExcelData").hide();
    $("#sampleImportMsg").hide();

    this.customerDataForm.get('Quantity')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.updateGrossValue();
    });
    this.customerDataForm.get('Rate')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.updateGrossValue();
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.customerDataForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  updateGrossValue() {
    const quantity = this.customerDataForm.get('Quantity')?.value;
    const rate = this.customerDataForm.get('Rate')?.value;
    const grossValue = quantity * rate;
    this.customerDataForm.patchValue({ GrowssValueFc: grossValue });
    this.customerDataForm.patchValue({ CollectionValueFC: grossValue });
    //this.customerDataForm.get('GrossValueFc')?.setValue(grossValue ? grossValue.toFixed(2) : '');
    //console.log('GrossValueFc ' + grossValue);
  }


  CalculateCollectionValue()
  {
    const CollectionValueFC = this.customerDataForm.get('CollectionValueFC')?.value;
    const FXRate = this.customerDataForm.get('FXRate')?.value;
    const CollectionValueINR = CollectionValueFC * FXRate;
    this.customerDataForm.patchValue({ CollectionValueINR: CollectionValueINR });
  }

  restrictInput(event: any, regex: RegExp) {
    const input = event.target.value;
    const inputElement = event.target as HTMLInputElement;
    if (!regex.test(input)) {
      event.target.value = input.slice(0, -1); // Remove the last character
    } 
    // const formControlName = inputElement.getAttribute('formControlName');
    // if(formControlName==='Quantity' || formControlName==='Rate'){
    //   console.log('Input name:', formControlName);
    //   this.updateGrossValue();   
    // }   
  }

  changemonth(event:any){
    //const input = event.target.value;
    const input = event.target as HTMLInputElement;
    const selectedDate = input?.value;
    if(selectedDate)
      {
        const formattedDate = moment(selectedDate).format('MMM YYYY');
        this.customerDataForm.get('Year')?.setValue(formattedDate);
      }

    console.log('changemonth ' + input);
  }

  // restrictInput(event: KeyboardEvent, restrictSpecial: boolean, restrictNumbers: boolean, restrictAlphabets: boolean): void {
  //   let input = event.target as HTMLInputElement;
  //   let value = input.value;

  //   if (restrictSpecial) {
  //     // Remove special characters except for decimal points
  //     value = value.replace(/[^a-zA-Z0-9\s.]/g, '');
  //   }

  //   if (restrictNumbers) {
  //     // Remove numbers
  //     value = value.replace(/[0-9.]/g, '');
  //   }

  //   if (restrictAlphabets) {
  //     // Remove alphabetic characters
  //     value = value.replace(/[a-zA-Z]/g, '');
  //   }

  //   input.value = value; // Set the cleaned value back to the input field
  // }

  getRoleTableData(currenturl: string): void {
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.Rolename}&&url=${currenturl}`).subscribe(
      (response) => {
        this.menucanview = response.canview;
        this.menucanadd = response.caninsert;
        this.menucanupdate = response.canupdate;
        this.menucandelete = response.candelete;
        //console.log('view ' + response.canview + ' insert ' + response.caninsert + ' update ' + response.canupdate + ' delete ' + response.candelete)
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get UserAccess details', error.message);
      }
    );
  }

  getCustomerData(): void {
    this.apiService.GetDataWithToken('api/customerdata/display').subscribe(
      (list) => {
        if (!list.data) {
          console.error('Data is missing in the response');
          return;
        }
        let dataList = list.data.map((item: {
          invoiceDate: string | number | Date,
          collectionDate: string | number | Date,
          ebrcDate: string | number | Date,
          edpmsUploadDate: string | number | Date,
          stpiSubmissionDate: string | number | Date,
          newBusiness: string | boolean
        }) => ({
          ...item, // Copy all existing properties
          invoiceDate: this.datePipe.transform(item.invoiceDate, 'dd-MM-yyyy'),
          collectionDate: this.datePipe.transform(item.collectionDate, 'dd-MM-yyyy'),
          ebrcDate: this.datePipe.transform(item.ebrcDate, 'dd-MM-yyyy'),
          edpmsUploadDate: this.datePipe.transform(item.edpmsUploadDate, 'dd-MM-yyyy'),
          stpiSubmissionDate: this.datePipe.transform(item.stpiSubmissionDate, 'dd-MM-yyyy'),
          newBusiness: item.newBusiness == true ? 'Yes' : item.newBusiness == false ? 'No' : null
        }));
        console.log(dataList);
        this.dataSource = dataList;
        this.customers = dataList;
        this.pagedItems = this.filteredItems();

        this.totalRecords = dataList.length;

        this.originalDataSource = dataList;
        this.isLoading = false;
        this.selectedRows.clear();
        this.applyPagination();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get Customer data', error.message);
      }
    );
    //this.getKPIConfigData();
    

  }

  deleteCustomerData(id: any): void {
    this.apiService.DeleteDataWithToken(`api/customerdata/deletebyid/${id}`).subscribe(
      (Response) => {
        this.selectedRows.clear();
        this.sweetAlert.DeletealertWithSuccess();
        this.getCustomerData();
        this.id = '';
      },
      (error) => {
        console.error('Error', error);
        this.sweetAlert.failureAlert('Unable to delete Customer data', error.message);
      }
    );
  }

  getById(id: any) {
    //this.showLoading();
    this.apiService.GetDataWithToken(`api/customerdata/displaybyid/${id}`).subscribe(
      (CustomerData) => {
        //console.log(CustomerData.data);
        const date = new Date(CustomerData.data.invoiceDate);
        const formattedInvoiceDate = [
          date.getFullYear(),
          ('0' + (date.getMonth() + 1)).slice(-2), // Months are 0-based
          ('0' + date.getDate()).slice(-2) // Pad single digits with leading 0
        ].join('-');
        const date1 = new Date(CustomerData.data.collectionDate);
        const formattedCollectionDate = [
          date.getFullYear(),
          ('0' + (date1.getMonth() + 1)).slice(-2), // Months are 0-based
          ('0' + date1.getDate()).slice(-2) // Pad single digits with leading 0
        ].join('-');
        const date2 = new Date(CustomerData.data.stpiSubmissionDate);
        const formattedstpiSubmissionDate = [
          date.getFullYear(),
          ('0' + (date2.getMonth() + 1)).slice(-2), // Months are 0-based
          ('0' + date2.getDate()).slice(-2) // Pad single digits with leading 0
        ].join('-');

        const date3 = new Date(CustomerData.data.edpmsUploadDate);
        const formattededpmsUploadDate = [
          date.getFullYear(),
          ('0' + (date3.getMonth() + 1)).slice(-2), // Months are 0-based
          ('0' + date3.getDate()).slice(-2) // Pad single digits with leading 0
        ].join('-');

        const date4 = new Date(CustomerData.data.ebrcDate);
        const formattedebrcDate = [
          date.getFullYear(),
          ('0' + (date4.getMonth() + 1)).slice(-2), // Months are 0-based
          ('0' + date4.getDate()).slice(-2) // Pad single digits with leading 0
        ].join('-');

        this.customerDataForm.patchValue
          ({
            // customer Data
            id: CustomerData.data.id,
            UA: CustomerData.data.ua,
            Year: CustomerData.data.year,
            InvoiceNo: CustomerData.data.invoiceNo,
            InvoiceDate: formattedInvoiceDate,
            CustomerName: CustomerData.data.customerName,
            CustomerAcronym: CustomerData.data.customerAcronym,
            TSPage: CustomerData.data.tspage,
            CCYType: CustomerData.data.ccytype,
            MajorHeadServiceLine: CustomerData.data.majorHeadServiceLine,
            MinorHead: CustomerData.data.minorHead,
            Quantity: CustomerData.data.quantity,
            UOM: CustomerData.data.uom,
            Rate: CustomerData.data.rate,
            GrowssValueFc: CustomerData.data.growssValueFc,
            CollectionDate: formattedCollectionDate,
            CollectionValueFC: CustomerData.data.collectionValueFc,
            FXRate: CustomerData.data.fxrate,
            CollectionValueINR: CustomerData.data.collectionValueInr,
            ForexGainLoss: CustomerData.data.forexGainLoss,
            IRM: CustomerData.data.irm,
            STPISubmissionDate: formattedstpiSubmissionDate,
            SoftexNo: CustomerData.data.softexNo,
            EDPMSUploadDate: formattededpmsUploadDate,
            EDPMSRefNo: CustomerData.data.edpmsRefNo,
            EDPMSClosureYnp: CustomerData.data.edpmsClosureYnp,
            EBRCNo: CustomerData.data.ebrcNo,
            EBRCDate: formattedebrcDate,
            ADBank: CustomerData.data.adBank,
            NewBusiness: (CustomerData.data.newBusiness == true ? 'y' : CustomerData.data.newBusiness == false ? 'n' : ''),
            AgedDays: CustomerData.data.agedDays,
          })

        this.id = CustomerData.data.id;
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert(`Unable to get Customer data with id ${id}`, error.message);
      }
    );
    //this.hideLoading();
  }

  addCustomerData(): void {

    //console.log('Customer Data triggered');
    var formData = this.customerDataForm.value;
    //const date = new Date(formData.Year);

    // Extract the month and year using toLocaleDateString
    // const formattedDate = date.toLocaleDateString('en-GB', {
    //   month: 'short', // "short" gives the abbreviated month name.
    //   year: 'numeric' // "numeric" gives the full year.
    // });

    // Replace the space with a hyphen to get the desired format
    //formData.Year = formattedDate.replace(' ', '-');
    formData.id = 0;
    console.log(formData);

    this.apiService.postDataWithToken('api/customerdata/insert', formData).subscribe(
      (Response) => {
        //this.apiResponse = Response.Data;
        this.sweetAlert.addAlert();
        this.showModal?.hide();
        this.getCustomerData();
        this.id = '';
        this.resetData();
        this.customerDataForm.reset();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to add Customer data', error.message);
      }
    );
  }

  updateCustomerData(id: any) {

    const formData = this.customerDataForm.value;
    formData.id = id;

    this.apiService.UpdateDataWithToken('api/customerdata/update', formData).subscribe(
      (Response) => {
        //this.apiResponse = Response.Data;
        this.isEditMode = false;
        //this.selectedRows.size  === 0;
        this.selectedRows.size === -1;
        this.selectedRows.clear();
        this.closemodal();
        this.customerDataForm.reset();
        setTimeout(() => {
          //this.customerDataForm.reset();
        }, 1000);
        this.showModal?.hide()
        this.sweetAlert.updateAlert();
        //$('#addUpdatePopUp').modal('hide');
        this.getCustomerData();
        this.id = '';
        this.resetData();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert(`Unable to update Customer data with id ${id}`, error.message);
      }
    );

  }

  submitData(id: any): void {

    let yearValue = this.customerDataForm.get('Year')!.value;
    const date = new Date(yearValue);
    const formattedDate = date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output = formattedDate.replace(' ', '-');
    this.customerDataForm.get('Year')!.setValue(output);
    let isNewBusiness = this.customerDataForm.get('NewBusiness')!.value;
    this.customerDataForm.get('NewBusiness')!.setValue(isNewBusiness == 'y' ? true : false);
    //console.log(this.customerDataForm.value);
    if (this.customerDataForm.valid) {
      //console.log("valid")
      if (!id) {
        //console.log('Performing add user');
        this.addCustomerData();
        this.customerDataForm.reset();
      }
      else {
        //console.log('Performing update user with id:', id);
        this.updateCustomerData(id);
        this.customerDataForm.reset();
      }

    } else {
      // If the form is invalid, mark all fields as touched to display validation messages
      this.submitButtonClicked = true;
      this.customerDataForm.markAllAsTouched();
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
      this.customerDataForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }
  clearForm() {
    
  }

  resetData() {
    this.clearForm();
    this.customerDataForm.reset(
      {

      }
    );
  }
  openModal() {
    this.customerDataForm.reset({
      NewBusiness:'',
      UOM:'',
      MajorHeadServiceLine:'',
      EDPMSClosureYnp:'',
      Year: this.currentMonthYear
    });
    
    this.isEditMode = false;
    this.showModal?.show();
  }

  closemodal() {
    // this.majorHeadServiceLine = '';
    // this.uom = '';
    // this.EDPMSClosure = '';
    // this.newBusiness = '';
    // this.Year='';
    this.customerDataForm.reset();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Add Customer Data'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Submit'
    this.isDuplicate = false;
    // this.customerDataForm.markAsPristine();
    // this.customerDataForm.markAsUntouched();
    // this.customerDataForm.updateValueAndValidity();
    this.formsubmit = false;
    //this.customerDataForm.clearValidators();
    //this.customerDataForm.clearAsyncValidators();
    this.showModal?.hide();
    setTimeout(() => {
      this.customerDataForm.reset();
    }, 1000);

    //this.getPublishers();
    this.isEditMode = false;
  }




  // Edit Data
  editList() {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit CustomerData'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'
    this.isEditMode = true;
    const selectedIds = this.getSelectedRowId();
    this.getById(selectedIds);
    // this.formBasedOnPublisher(selectedIds);


  }
  get form() {
    return this.customerDataForm.controls;
  }

  /**
    * returns tooltip validation form
    */
  get formData() {
    return this.tooltipvalidationform.controls;
  }

  //checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items




  // Delete Product
  removeItem(id: any) {
    //console.log("delete triggered")
    //this.deleteID = id
    this.id = id;
    this.deleteRecordModal?.show();
  }

  confirmDelete() {

    const selectedIds = this.getSelectedRowId();
    this.deleteCustomerData(selectedIds);
    this.deleteRecordModal?.hide()
    this.masterSelected = false;
  }

  onInactiveClick(): void {
    // Implement logic for the "Inactive" action
    const selectedIds = this.getSelectedRowIds();
    // Implement logic for the "Inactive" action using selectedIds
    //console.log('Inactive Action - Selected IDs:', selectedIds);
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

    const selectedColumns: (keyof customerDataModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof customerDataModel);

    const dataToExport = this.filteredItems().map((item: any) => {
      const exportedItem: Record<string, any> = {};
      selectedColumns.forEach((column: keyof customerDataModel) => {
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
    XLSX.writeFile(workbook, 'Customer_Data_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');

  }

  exportToCsv() {
    const selectedColumns: (keyof customerDataModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof customerDataModel);
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
      selectedColumns.forEach((column: keyof customerDataModel) => {
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
    link.setAttribute('download', 'Customer_Data_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.csv');
    document.body.appendChild(link);
    link.click();
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
      .map((column) => column.def as keyof customerDataModel);

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
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
    doc.save(`Customer_Data_${formattedDate}.pdf`);
  }

  exportToExcelAll() {
    const selectedColumns: (keyof customerDataModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof customerDataModel);

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
      selectedColumns.forEach((column: keyof customerDataModel) => {
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

    XLSX.writeFile(workbook, 'Customer_Data_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');
  }

  exportToCsvAll() {
    this.isLoading = true;

    const selectedColumns: (keyof customerDataModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof customerDataModel);

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
      selectedColumns.forEach((column: keyof customerDataModel) => {
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
    link.setAttribute('download', 'Customer_Data_' + this.datePipe.transform(myDate, 'ddMMyyy') + '.csv');
    document.body.appendChild(link);
    link.click();
  }

  exportToPDFAll() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a3'
    }) as any;

    const data = []; // Initialize an empty array for your tabular data

    // Define the headers for your table
    const headers = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof customerDataModel);

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.wholeCustomerList.forEach((item, index) => {
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
    doc.save(`Customer_Data_${formattedDate}.pdf`);
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
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };

    container.yearSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('year');
  }
  isSelected(item: any): boolean {
    return this.selectedRows.has(item);
  }

  applyPagination() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    this.dataSource = this.dataSource.slice(this.startIndex, this.endIndex);
  }
  onPerPageChange() {
    this.page = 1; // Reset to the first page when changing items per page
    this.pageSize = this.itemsPerPage; // Update the page size
    this.getCustomerData(); // Call the method to fetch data with the updated pagination settings
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
    //console.log('sort triggered');
    //let sortSet =['asc','desc'];
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder = 'asc';
    }
    this.sortColumn = column;

    this.customers.sort((a, b) => {
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
    //console.log('Clone Action - Selected IDs:', selectedIds);
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
    //console.log('Edit Action - Selected IDs:', selectedIds);
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

  filterByText(item: any): boolean {
    this.searchTerm = this.searchTerm.trim();
    //const includeColumns = ['type', 'department', 'customer'];
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
          //console.log(`Found in ${key}: ${value}`);
          return true;
        } else if (typeof value === 'number' && value.toString().includes(this.searchTerm)) {
          //console.log(`Found in ${key}: ${value}`);
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
      return this.customers.filter(item =>
        this.filterByText(item)


      );
    } else {
      // Pagination applied
      const startIndex = (this.currentPage - 1) * pageSizeNumber;
      const endIndex = startIndex + pageSizeNumber;
      const filteredCustomers = this.customers.filter(item =>
        this.filterByText(item)
      );
      return filteredCustomers.slice(startIndex, endIndex);
    }
  }


  submitFilter() {
    const filterParam = {
      invoiceNo: $('#invoiceNo').val() === '' ? null : $('#invoiceNo').val(),
      invoiceDate: $('#invoiceDate').val() === '' ? null : $('#invoiceDate').val(),
      customerName: $('#customerName').val() === '' ? null : $('#customerName').val(),
      customerAcronym: $('#customerAcronym').val() === '' ? null : $('#customerAcronym').val(),
      ccyType: $('#ccyType').val() === '' ? null : $('#ccyType').val(),
      majorHeadServiceLine: $('#majorHeadServiceLine').val() === '' ? null : $('#majorHeadServiceLine').val(),
    }
    this.apiService.postDataWithToken('api/customerdata/filter', filterParam).subscribe(
      (response) => {
        this.dataSource = response.data;
        this.customers = response.data;
        this.pagedItems = this.filteredItems();
        this.totalRecords = response.data.length;
        this.originalDataSource = response.data;
        this.isLoading = false;
        this.selectedRows.clear();
        // this.pagedItems = this.filteredItems();
        // this.calculatePages();
        // this.resetPagination();
        this.applyPagination();
        //this.resetTableFilterAndPagination();
        //console.log(this.customers);
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to filter Customer data', error.message);
      }
    );
  }
  resetFilter() {
    $('#invoiceNo').val(''),
      $('#invoiceDate').val(''),
      $('#customerName').val(''),
      $('#customerAcronym').val(''),
      $('#ccyType').val(''),
      $('#majorHeadServiceLine').val('')
    this.getCustomerData();
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

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return [
      ('0' + date.getDate()).slice(-2),
      ('0' + (date.getMonth() + 1)).slice(-2),
      date.getFullYear(),
    ].join('-');
  }

  ddmmyyyyformatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  convertDateToISO(dateStr: string): string {
    // Split the date string into parts
    const parts = dateStr.split('-');

    // Create a new date object using year, month (zero-based index), and day
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));

    // Convert to ISO string
    const isoString = date.toISOString();

    return isoString;
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
      this.apiService.uploadExcelFile('api/customerdata/validateexcel', this.file).subscribe(
        response => {
          console.log('File uploaded successfully', response);
          this.CustomerDataValidatedList = response.data;
          console.log(this.CustomerDataValidatedList);
          $("#excelData").show();
          let isCorrectExcel = this.CustomerDataValidatedList.some(obj => obj.action === false);
          if (!isCorrectExcel) {
            console.log("is not invalid row");
            $("#importBtn").prop('disabled', false);
            $("#excelErrMsg").hide();
            $("#sampleExcelData").hide();
            $("#sampleImportMsg").hide();
          }
          else if (isCorrectExcel) {
            console.log("invalid row");
            $("#importBtn").prop('disabled', true);
            $("#excelErrMsg").show();
            //$("#sampleImportMsg").hide();
            //$("#sampleExcelData").hide();
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
    const selectedColumns: (keyof customerDataModel)[] = this.columnDefinitions
      .filter((column) => column.visible)
      .map((column) => column.def as keyof customerDataModel);
  
    // Create a headers-only array
    const headers = selectedColumns.map((column) => column as string);
    const dataToExport = [headers];
  
    // Generate worksheet and workbook
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    XLSX.writeFile(workbook, 'Customer_Data_Sample.xlsx');
  }
  
  
  importExceltoDb() {
    let isCorrectExcel = this.CustomerDataValidatedList.some(obj => obj.action === false);
    if (!isCorrectExcel) {
      this.apiService.postDataWithToken('api/customerdata/import', this.CustomerDataValidatedList).subscribe(
        (Response) => {
          this.importAlert();
          this.hideImportExcel();
          this.getCustomerData();
          //this.Id = '';
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
    this.closemodal();
    
    $('#ImportExcelPopUp').modal('show');
    $('#toBeImportedData').modal('hide');
    $("#uploadBtn").prop('disabled', true);
    $("#importBtn").prop('disabled', true);
    $("#excelData").hide();
    $("#excelErrMsg").hide();
    $("#sampleExcelData").hide();
    $("#sampleImportMsg").hide();
    $("#fileInput").val("");
  }

  hideImportExcel() {
    $('#ImportExcelPopUp').modal('hide');
  }

  ImportExcelData() {
    $('#ImportExcelPopUp').modal('hide');
  }

  importAlert() {
    Swal.fire({
      title: 'Thank you...',
      text: 'File imported succesfully!',
      showConfirmButton: false, icon: 'success', timer: 3000
    });
  }

}