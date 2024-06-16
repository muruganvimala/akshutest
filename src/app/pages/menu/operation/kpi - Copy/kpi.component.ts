import { Component, QueryList, ViewChild, ViewChildren, OnInit, AfterViewInit, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { DecimalPipe,DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl,FormGroupDirective } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
//import { jsPDF } from "jspdf";
import 'jspdf-autotable';
//import * as $ from 'jquery';


// Data Get
import { kpiModel } from './kpi.model';
//import { KpiService } from './kpi.service';
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

//declare var jsPDF: any;
declare var $: any;
@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
  providers: [DecimalPipe,DatePipe]
})
export class KpiComponent {

  colorTheme: any = 'theme-blue';
// Pagination properties
totalRecords: number = 0;
page: number = 0;
itemsPerPage: number = 10; // Adjust as needed
perPageOptions: number[] = [10, 20, 30,40];
pageSize: number = this.perPageOptions[0];
pages: number[] = [];

  //year: number = 0;
  MonthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //Month: string = '';
  releventMonths: any[] = [];
currentPage: number = 0;
startIndex: number = 0;
endIndex: number = 10;
selectedPublisher :string [] = [];
  selectedStartDate: any = "";
  selectedEndDate: any = "";
  searchTerm: string = '';

  

isLoading = true;
currentSortColumn: string = ''; // Track the current sorting column
isSortAscending: boolean = true;

  selectedYear: any = "";
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


formYear: number = new Date().getFullYear();
  formMonth: string = this.MonthNames[new Date().getMonth()];
  formMonthYear: string = "Select";
  startYear: number = new Date().getFullYear();
  startMonth: string = this.MonthNames[new Date().getMonth()];
  endYear: number = new Date().getFullYear();
  endMonth: string = this.MonthNames[new Date().getMonth()];
  monthYear: string = this.formMonth + " " + this.formYear;
  startDate:string ='Select';
  endDate:string='Select';

  monthYearList: any[] = [];
  displayYearArr: number[] = [];


  //formMonthYear_Year: string = '';
  selectedMonthYearRange: any[] = [];

masterSelected = false;

dataSource: any = [];
originalDataSource: any = [];

// Initialize the debounce time for column filter changes
private columnFilterDebounceTime: number = 300;
selectedRows: Set<kpiModel> = new Set<kpiModel>();
selectedColumns: Set<string> = new Set<string>();




// bread crumb items
breadCrumbItems!: Array<{}>;
productForm!: FormGroup;
tooltipvalidationform!: FormGroup;
submitted = false;
products: any[] = [];
//userList: any[] = [];


// Table data
productList!: Observable<kpiModel[]>;
//total: Observable<number>;
formsubmit!: boolean;

formMonthYear_Year: string = '';
  
  isDuplicate: boolean = false;
  isWrongDt: boolean = false;
  rangePickLimit: number = 2;

favoriteSeason: string = "";
  sweetAlertService: any;
  currentYear = new Date().getFullYear();
  
  totalPages = 0;
  isEditMode = false;
  KPIId: string = '';
  publisherId: string = '';
  acronym: string = '';
  overallPerformance: number | null = 0;
  schedule: number | null = 0;
  quality: number | null = 0;
  communication: number | null = 0;
  customerSatisfaction: number | null = 0;
  accountManagement: number | null = 0;
  rft: number | null = 0;
  publicationSpeed: number | null = 0;
  feedback: number | null = 0;
  authorSatisfaction: number | null = 0;
  apiResponse: any;
  currentdate: string = '';
  modelDate = '';
  


  pagedItems: any[] = [];
  public publisherList: any[] = [];
  kpiConfigList: any[] = [];
  public KPIList: any[] = [];

  appRole:string|null='';
  menucanview: boolean = false;
  menucanadd: boolean = false;
  menucanupdate: boolean = false;
  menucandelete: boolean = false;

  
  //year: number = 0;
  
  //Month: string = '';
  



files: File[] = [];

//@ViewChildren(NgbdKpiSortableHeader) headers!: QueryList<NgbdKpiSortableHeader>;

@ViewChild('showModal', { static: false }) showModal?: ModalDirective;
@ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
deleteID: any;
content: any;

constructor(private http: HttpClient,private formBuilder: UntypedFormBuilder,  private apiService :ApiService,private datePipe:DatePipe) {
  //this.productList = service.countries$;
  //this.total = service.total$;
  //console.log(this.productList);
   this.selectedYear = "";
  
   this.appRole = sessionStorage.getItem('userRole');

  this.productForm = this.formBuilder.group({
    id: "#VZ2101",
    _id: [''],
    Publisher: ['', [Validators.required]],
  MonthYear: ['', [Validators.required]],
  OverallPerformance: ['', ],
  Schedule: ['', ],
  Quality: ['', ],
  Communication: ['', ],
  CustomerSatisfaction: ['', ],
  AccountManagement: ['', ],
  PublicationSpeed: ['', ],
  RFT: ['', ],
  Feedback: ['', ],
  AuthorSatisfaction: ['', ],
  
   
  });

  
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
    def: 'quality',
    label: 'Quality',
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

  {
    def: 'rft',
    label: 'RFT',
    visible: true,
    sortable: true,
    filterable: true,
    filter: new FormControl(''),
    disableHide: false,
  },
  {
    def: 'publicationSpeed',
    label: 'Publication Speed',
    visible: true,
    sortable: true,
    filterable: true,
    filter: new FormControl(''),
    disableHide: false,
  },
  {
    def: 'feedback',
    label: 'Feedback',
    visible: true,
    sortable: true,
    filterable: true,
    filter: new FormControl(''),
    disableHide: false,
  },
  {
    def: 'authorSatisfaction',
    label: 'Author Satisfaction',
    visible: true,
    sortable: true,
    filterable: true,
    filter: new FormControl(''),
    disableHide: false,
  },
];



ngOnInit(): void {
  // Get the current URL
  const currenturl = new URL(window.location.href).pathname.substring(1);
  /**
   * BreadCrumb
   */
  this.appRole = sessionStorage.getItem('userRole');

  setTimeout(() => {
    this.showLoader();
  }, 100);

  this.breadCrumbItems = [
    { label: 'Operation' },
    { label: 'KPI', active: true }
  ];

  this.selectedRows = new Set<kpiModel>();
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

  // Fetch Data
  // setTimeout(() => {
  //   // this.productList.subscribe(x => {
  //   //   this.products = Object.assign([], x);
  //   //   this.content = this.products
  //   // });
  //   this.getRoleTableData();
  //   this.getPublishers();
  //   this.getKPIData();

  //   //this.getKPIConfigData();
   
  //   document.getElementById('elmLoader')?.classList.add('d-none')
  // }, 1000)
  this.getRoleTableData(currenturl);
  this.getPublishers();
  this.getKPIData();
  setTimeout(() => {
    this.closeLoader();
  }, 3000);

    
}

public items: string[] = ['Adidas', 'Boat', 'Puma', 'Realme'];

// ngAfterViewInit(): void {
//   this.getKPIData();
  
// }

getRoleTableData(currenturl:string): void {
  this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${this.appRole}&url=${currenturl}`).subscribe(
    (response) => {
      this.menucanview=response.canview;
      this.menucanadd =response.caninsert;
      this.menucanupdate = response.canupdate;
      this.menucandelete= response.candelete;
      console.log('view ' + response.canview + ' insert ' + response.caninsert+ ' update ' + response.canupdate+ ' delete ' + response.candelete)
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}

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
  this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
  this.endIndex = this.currentPage * this.itemsPerPage;
  //console.log(this.startIndex);
  //console.log(this.endIndex);
  this.dataSource = this.dataSource.slice(this.startIndex, this.endIndex);
  //console.log(this.dataSource.slice(this.startIndex, this.endIndex));
}

onPerPageChange() {
  // this.page = 1; // Reset to the first page when changing items per page
  // this.getKPIData();

  this.resetPagination();
  this.currentPage = 1;
  if (this.pageSize === -1) {
    this.pagedItems = this.filteredItems();
  } else {
    this.pagedItems = this.filteredItems().slice(0, this.pageSize);
    this.calculatePages();
  }
  
}
// Handle page changes
onPageChange(page: number): void {

  // if (this.pageSize === 0) {
  //   return;
  // }
  // this.currentPage = page;
  // const startIndex = (page - 1) * this.pageSize;
  // const endIndex = startIndex + this.pageSize;
  // this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
  // this.calculatePages();
  


  //console.log(this.pageSize);
  if (this.pageSize === 0) {
    
    return; // Do nothing for the "Select" option
  }
  
  
  console.log('in page change page',page);
  //console.log('in page change pageSize',this.pageSize);
  
  const startIndex = (page) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  //this.startIndex = (this.currentPage)*this.pageSize;
  //this.endIndex = endIndex; //this.currentPage * this.itemsPerPage;

  this.startIndex = page*10;
        
  if(this.totalRecords < 10)
  {
    this.endIndex = this.totalRecords;
  }
  else
  {
    console.log('current page:',this.currentPage);

    if(page > this.currentPage)
    {
      console.log("In If currentPage ", this.currentPage);
      this.currentPage = this.currentPage--;
      this.endIndex = this.currentPage * this.itemsPerPage;
    }
    else
    {
      this.currentPage = page+1;
      console.log("In else currentPage ", this.currentPage);
      this.endIndex = this.currentPage * this.itemsPerPage;
    }
      
    // else
    // {
    //   this.currentPage=this.currentPage+1;
      
    // }
    
  }


  console.log('start',startIndex);
    console.log('end',endIndex);
  // console.log('start',startIndex);
  //         console.log('end',endIndex);
  //         console.log('end global',this.endIndex);

  //this.endIndex = startIndex;
  if(this.selectedPublisher.length > 0 || this.selectedYear != "" || this.selectedMonthYear != "" || this.selectedEndDate != "" || this.selectedStartDate != "" || this.searchTerm != ""){
          
    console.log('If condition',this.selectedPublisher.length);
    console.log('start',this.startIndex);
    console.log('end',this.endIndex);
          //this.startDate = startIndex.toString();
          //this.endDate = endIndex.toString();
       this.pagedItems = this.filteredItems().slice(this.startIndex, this.endIndex);
   }
  //  else
  //  {
  //   //this.startDate = startIndex.toString();
  //     if(this.searchTerm != "")
  //     {
  //       console.log('start',this.startIndex+10);
  //       console.log('end',this.endIndex);
  // console.log('this.currentPage',this.currentPage);
  // this.pagedItems = this.filteredItems().slice(this.startIndex, this.endIndex);
  
  //     }
   
    
  //  }
  

}
onSearchKeyUp(searchTerm: string): void {
  //this.currentPage = 1;
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



getPublishers(): void {
  // publisher list form kpi config Publisher/Display
  this.apiService.GetDataWithToken('Publisher/Display').subscribe(
    (list) => {

      this.publisherList = list.data;
      console.log(this.publisherList);
    },
    (error) => {
      //console.error('Error:', error);
    }
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

// onSort(column: any) {
  
//   if (column.sortable) {
    
//     this.currentSortColumn = column.def;
//     if (this.currentSortColumn === column.def) {
//       // Toggle sorting direction if clicking on the same column
//       this.isSortAscending = !this.isSortAscending;
//       console.log('In if', this.isSortAscending);
//     } else {
//       // Set the new sorting column and direction
//       this.currentSortColumn = column.def;
//       this.isSortAscending = true;
//       console.log('In else ', this.isSortAscending);
//     }

//     // Sort the dataSource array
//     this.sortDataSource();

//     // Apply pagination and update UI
//     //this.applyPagination();
//   }
// }


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

formBasedOnPublisher(publisher: any) {


  let pubId = parseInt(publisher);
  console.log('pub id', publisher);

  this.apiService.GetDataWithToken(`PublisherConfig/DisplayById/${pubId}`).subscribe(
    (Response) => {

      if (Response.data.overallPerfomanceRequired) {
        $('#overallPerformance').show();

      }
      else if (!Response.data.overallPerfomanceRequired) {
        $('#overallPerformance').hide();
      }
      if (Response.data.scheduleRequired) {
        $('#schedule').show();
      }
      else if (!Response.data.scheduleRequired) {
        $('#schedule').hide();
      }
      if (Response.data.qualityRequired) {
        $('#quality').show();
      }
      else if (!Response.data.qualityRequired) {
        $('#quality').hide();
      }
      if (Response.data.communicationRequired) {
        $('#communication').show();
      }
      else if (!Response.data.communicationRequired) {
        $('#communication').hide();
      }
      if (Response.data.customerSatisfactionRequired) {
        $('#customerSatisfaction').show();
      }
      else if (!Response.data.customerSatisfactionRequired) {
        $('#customerSatisfaction').hide();
      }
      if (Response.data.accountManagementRequired) {
        $('#accountManagement').show();
      }
      else if (!Response.data.accountManagementRequired) {
        $('#accountManagement').hide();
      }
      if (Response.data.rftRequired) {
        $('#rft').show();
        console.log(pubId + " rft " + true);
      }
      else if (!Response.data.rftRequired) {
        $('#rft').hide();
        console.log(pubId + " rft " + true);
      }
      if (Response.data.publicationSpeedRequired) {
        $('#publicationSpeed').show();
      }
      else if (!Response.data.publicationSpeedRequired) {
        $('#publicationSpeed').hide();
      }
      if (Response.data.feedbackRequired) {
        $('#feedback').show();
      }
      else if (!Response.data.feedbackRequired) {
        $('#feedback').hide();
      }
      if (Response.data.authorsatisficationRequired) {
        $('#authorsatisfication').show();
      }
      else if (!Response.data.authorsatisficationRequired) {
        $('#authorsatisfication').hide();
      }
      console.log(Response.data);
    },
    (error) => {
      console.error('Error:', error);
    }
  );

}


onPublisherChange(onPublisherId : string): void {
  console.log('in publisher change ID', onPublisherId);
  //this.getKPIConfigData();
  // this.currentPage = 1;
   this.pagedItems = this.filteredItems();
   this.resetPagination();
}
getKPIData(): void {
  //this.getKPIConfigData();
  this.apiService.GetDataWithToken('User/KPIDataDisplaybyConfig').subscribe(
    (kpiList) => {
      this.dataSource  = kpiList.data;
      this.products = kpiList.data;
      this.pagedItems = this.filteredItems();

      this.totalRecords = kpiList.data.length;
      
      this.originalDataSource = kpiList.data;
      this.isLoading = false;
      //this.selectedRows.clear();
      //this.pagedItems = this.filteredItems();
       // this.calculatePages();
      //this.resetPagination();
      //this.applyPagination();
      //this.resetTableFilterAndPagination();
      console.log(this.products);
    },
    (error) => {
      console.error('Error:', error);
    }
  );

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
  const filteredItems = this.filteredItems();
  this.pagedItems = filteredItems.slice(0, this.pageSize === -1 ? filteredItems.length : this.pageSize);
  this.calculatePages();
}
calculatePages() {
  // Calculate total number of pages based on total items and page size
  if (this.pageSize === 1) {
    this.pages = [1]; // If page size is -1 (All), only one page
} else {
    this.pages = [];
    const totalPages = Math.ceil(this.totalPages / this.pageSize);
    for (let i = 1; i <= totalPages; i++) {
        this.pages.push(i);
    }
}
}



// filterByMonthYear(item: any): boolean {
//   // Filter by selected month-year
//   return !this.selectedMonthYear || item.monthYear === this.selectedMonthYear;
// }

onYearChange(): void {

  this.currentPage = 1;
  this.pagedItems = this.filteredItems();
  this.resetPagination();
  if (this.selectedYear != "") {
    //$('#filterMonthYear_month').prop('disabled', false);
  }
 // this.populateMonths();
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

filterByMonthYear(item: any): boolean {
  // Filter by selected month-year
  return !this.selectedMonthYear || item.monthYear === this.selectedMonthYear;
}

filterByYear(item: any): boolean {
  // Filter by selected year
  return !this.selectedYear || item.monthYear.includes(this.selectedYear.toString());
}


filterByText(item: any): boolean {
  const excludedColumns = ['publisher', 'publisherId', 'id'];
  // Filter by text box input for all columns
  if (!this.searchTerm) {
    return true; // No filter applied
  }
  // Check if any column contains the search term (string or number)
  for (let key in item) {
    if (item.hasOwnProperty(key) && !excludedColumns.includes(key)) {
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

// filterByYear(item: any): boolean {
//   // Filter by selected year
//   return !this.selectedYear || item.monthYear.includes(this.selectedYear.toString());
// }

filteredItems(): any[] {
  const pageSizeNumber = +this.pageSize;
 
  if (pageSizeNumber === -1) {

    console.log('filteredItems if',pageSizeNumber);
    return this.products.filter(item =>
      this.filterByText(item)
      && this.filterByAcronym(item)
      && this.filterByMonthYear(item)
      && this.filterByDateRange(item)
      && this.filterByYear(item)
    );

  }
  else {
    const startIndex = (this.currentPage - 1) * pageSizeNumber;
    const endIndex = startIndex + pageSizeNumber;

    //console.log(startIndex);

    //console.log(endIndex);

    // console.log( this.products.filter(item =>
    //   this.filterByText(item)
    // ).slice(startIndex, endIndex));

    if(this.searchTerm)
    {
      var newkpi =  this.products.filter(item =>
        this.filterByText(item)
        //&& this.filterByAcronym(item)
        //&& this.filterByMonthYear(item)
        //&& this.filterByDateRange(item)
        //&& this.filterByYear(item)
      );
        //.slice(startIndex, endIndex);
  
        this.dataSource= newkpi;
        this.totalRecords = newkpi.length;
        this.startIndex = (this.currentPage-1)*10;
        
        if(this.totalRecords < 10)
        {
          this.endIndex = newkpi.length;
        }
        else
        {
          this.endIndex = this.currentPage * this.itemsPerPage;
        }
    }
    else
    {
      
      //this.pagedItems = this.filteredItems().slice(0, this.pageSize);
      //console.log('filteredItems searchTerm', newkpi.length);
      //console.log('startIndex searchTerm', startIndex);
      //console.log('endIndex searchTerm', endIndex);  
      //console.log('this.products.length',this.products);
        //this.products = this.originalDataSource;

       //console.log('selectedYear:',this.selectedYear);

        if(this.selectedPublisher.length >= 0 || this.selectedYear != "" || this.selectedMonthYear != "" || this.selectedEndDate != "" || this.selectedStartDate != ""){
          
          
         var newkpi =  this.products.filter(item =>
          this.filterByText(item)
          && this.filterByAcronym(item)
          && this.filterByMonthYear(item)
          && this.filterByDateRange(item)
          && this.filterByYear(item)
        );
          //.slice(startIndex, this.endIndex);

          //this.currentPage =1;
          this.dataSource= newkpi;

          //console.log(newkpi.length);
    
          this.totalRecords = newkpi.length;



          return this.products   //.slice(startIndex, endIndex); 
          .filter(item =>
             this.filterByMonthYear(item)
             && this.filterByAcronym(item)
             && this.filterByMonthYear(item)
             && this.filterByDateRange(item)
             && this.filterByYear(item)
           )
             .slice(startIndex, endIndex);


        
          


        }
        else
        {

       console.log($('#perPage').val());


         if($('#perPage').val() == 10)
         {
          this.totalRecords = this.products.length;
          //this.endIndex = this.currentPage * this.itemsPerPage;

          const startIndex = (this.currentPage - 1) * pageSizeNumber;
          const endIndex = startIndex + pageSizeNumber;

            
              //this.endIndex = 10;
            return this.products   //.slice(startIndex, endIndex); 
            .filter(item =>
                this.filterByText(item)
                && this.filterByAcronym(item)
                && this.filterByMonthYear(item)
                && this.filterByDateRange(item)
                && this.filterByYear(item)
              )
                .slice(startIndex, endIndex);
         }
         else
         {
          this.totalRecords = this.products.length;
          //this.endIndex = this.currentPage * this.itemsPerPage;

          this.startIndex = (this.currentPage - 1) * pageSizeNumber;
          //this.endIndex = startIndex + pageSizeNumber;
          this.endIndex = this.currentPage * this.itemsPerPage;

         
          //this.endIndex = 10;
        return this.products   //.slice(startIndex, endIndex); 
         .filter(item =>
            this.filterByText(item)
            && this.filterByAcronym(item)
            && this.filterByMonthYear(item)
            && this.filterByDateRange(item)
            && this.filterByYear(item)
          )
            .slice(this.startIndex, this.endIndex);
         }
          
        }

    }

    console.log("start index",this.startIndex);
    console.log("end index",this.endIndex);
   // this.applyPagination();
    return this.products.filter(item =>
      this.filterByText(item)
      && this.filterByAcronym(item)
      && this.filterByMonthYear(item)
      && this.filterByDateRange(item)
      && this.filterByYear(item)
    )
      .slice(this.startIndex, this.endIndex);
  }

}


filterByAcronym(item: any): boolean {
  // Filter by selected acronym
  //console.log("submit filter triggered selected publisher 223  "+ this.selectedPublisher.length);
  //console.log("submit filter triggered selected publisher 223  "+ this.selectedPublisher[0]);
  //console.log(item);
// const isDuplicate = item.some((item : any )=> item.acronym === this.selectedPublisher);
// console.log(isDuplicate);ZX
//return !this.selectedPublisher || item.acronym.includes(this.selectedPublisher)
//return !this.selectedPublisher ||  item.acronym === this.selectedPublisher;

return this.selectedPublisher.length === 0 || this.selectedPublisher.includes(item.acronym);
// var flag=false;
// if(this.selectedPublisher.length == 0)
// {
//   return  !flag;
// }
//   else
//   {

//     if(this.selectedPublisher.length == 1)
//    {
      
//      if(this.selectedPublisher[0] === "")
//      {
//       console.log(this.selectedPublisher);
//       flag= true;
//         return   flag;
//      }
//       else
//       return !this.selectedPublisher ||  item.acronym.includes(this.selectedPublisher[0]); //) === this.selectedPublisher[0];
      
//    }
//    else
//    {
//      for(var i=0; i < this.selectedPublisher.length; i++)
//      {
//        if(item.acronym.includes(this.selectedPublisher[i]))
//        {
//         flag= true;
//         return !this.selectedPublisher ||  flag;
//        }

//      }
//      return !this.selectedPublisher ||  flag;
//    }

//   } 
  
  

}
filterByDateRange(item: any): boolean {
  //this.selectedStartDate = this.startDate;
  //this.selectedEndDate = this.endDate;
  if (!this.selectedStartDate || !this.selectedEndDate) {
    return true; // No filter applied if start or end date is not selected
  }
  var ssd =this.selectedStartDate.slice(' ');
  //console.log(ssd[0]);
  //console.log('start date',this.MonthNames.indexOf(ssd[0]));
  const itemDate = new Date(item.monthYear); // Replace 'date' with the actual property representing the date in your data
  const startDate = new Date(this.selectedStartDate);
  const endDate = new Date(this.selectedEndDate);

  return itemDate >= startDate && itemDate <= endDate;
}

// resetFilters(): void {
//   $('.MonthYearRange').prop('checked', false);
//   this.pageSize = this.perPageOptions[0]; // Set the default page size
//   this.selectedPublisher = ''; // Clear selected publisher
//   this.selectedStartDate = ''; // Clear selected start date
//   this.selectedEndDate = ''; // Clear selected end date
//   this.selectedYear = ""; // Clear selected year
//   this.selectedMonthYear = '';
//   this.searchTerm = '';
  
//   this.onPageSizeChange(); // Apply changes
// }

resetFilter() {
  this.getKPIData();
  $('#PubFilter').val("");
  $('#yearFilter').val("");
  $('#filterMonthYear').val("");
  $('#startDate').val("");
  $('#endDate').val("");
  //this.selectedPublisher.pop(); 
  //this.selectedPublisher  =[];
   this.selectedPublisher.length = 0;
   this.selectedYear = "";
   this.selectedMonthYear = "";
   this.selectedStartDate="";
   this.selectedEndDate="";
 
}


submitFilter() {

  
  //console.log($('#PubFilter').val());
  //this.selectedPublisher.push(pub);
  //this.selectedPublisher = $('#PubFilter').val();
  
  //this.currentPage = 1;

  const pubsele = $('#PubFilter').val() as string [];
 // if(this.selectedPublisher.length === 0)
   if(pubsele[0]!="")
    this.selectedPublisher = pubsele as string[];
  else
    this.selectedPublisher = [];

  // if(this.selectedPublisher!=""){
  //   //this.onPublisherChange();
    
  // }
  //this.selectedPublisher = $('#PubFilter').val();


  
  console.log(" submit filter triggered selected publisher  "+ this.selectedPublisher);
   this.selectedYear = $('#yearFilter').val();
  console.log(" submit filter triggered selected year  "+ this.selectedYear);
  if($('#filterMonthYear').val() !="Select"){
    this.selectedMonthYear = $('#filterMonthYear').val();
    console.log(" submit filter triggered selected month year  "+ this.selectedMonthYear);
  }
  if($('#startDate').val() !="Select"){
   this.selectedStartDate = $('#startDate').val();
    console.log(" submit filter triggered selected start month year  "+ this.selectedStartDate);
  }
  if($('#endDate').val() !="Select"){
    this.selectedEndDate = $('#endDate').val();
    console.log(" submit filter triggered selected end month year  "+ this.selectedEndDate);
  }
  
  //this.resetPagination();

}



getKPIConfigData(): void {
  this.apiService.GetDataWithToken('PublisherConfig/Display').subscribe(
    (Response) => {
      this.kpiConfigList = Response.data;
      //this.calculatePages();
      console.log(this.kpiConfigList);
    },
    (error) => {
      console.error('Error:', error);
    }
  );

}




  // Handle search term changes
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



deleteKPIData(id: any): void {
  //this.showLoader();

  this.apiService.DeleteDataWithToken(`User/DeleteKPI/${id}`).subscribe(
    (Response) => {
      console.log(Response);
      Swal.fire({
        title: 'Thank you...',
        text: 'Deleted succesfully!',
        showConfirmButton: false, icon: 'success', timer: 4000
      });
      this.getKPIData();
    },
    (error) => {
      console.error('Error', error);
    }
  );
}
getById(id: any) {
  //this.showLoading();
  this.apiService.GetDataWithToken(`User/KPIDataDisplayById/${id}`).subscribe(
    (KPIData) => {

  
      console.log(KPIData.data);

  this.productForm.controls['_id'].setValue(KPIData.data.id);
  this.productForm.controls['Publisher'].setValue(KPIData.data.publisherId);
  this.productForm.controls['MonthYear'].setValue(KPIData.data.monthYear);
  this.productForm.controls['OverallPerformance'].setValue(KPIData.data.overallPerformance);
  this.productForm.controls['Schedule'].setValue(KPIData.data.schedule);
  this.productForm.controls['Quality'].setValue(KPIData.data.quality);
  this.productForm.controls['Communication'].setValue(KPIData.data.communication);
  this.productForm.controls['CustomerSatisfaction'].setValue(KPIData.data.customerSatisfaction);
  this.productForm.controls['AccountManagement'].setValue(KPIData.data.accountManagement);
  this.productForm.controls['PublicationSpeed'].setValue(KPIData.data.publicationSpeed);
  this.productForm.controls['RFT'].setValue(KPIData.data.rft);
  this.productForm.controls['Feedback'].setValue(KPIData.data.feedback);
  this.productForm.controls['AuthorSatisfaction'].setValue(KPIData.data.authorSatisfaction);

  
    },
    (error) => {
      console.error('Error:', error);
    }
  );
  //this.hideLoading();
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
  if (this.KPIId === '') {
    this.clearForm();
  }

}
addKPIData(): void {

  console.log('submitKPIData triggered');
  const biPerformanceMetric = {

    publisherId: this.publisherId,
    //monthYear: this.monthYear,
    overallPerformance: this.overallPerformance,
    schedule: this.schedule,
    quality: this.quality,
    communication: this.communication,
    customerSatisfaction: this.customerSatisfaction,
    accountManagement: this.accountManagement,
    rft: this.rft,
    publicationSpeed: this.publicationSpeed,
    feedback: this.feedback,
    authorSatisfaction: this.authorSatisfaction,

  }

  this.apiService.postDataWithToken('User/KPIDataInsert', biPerformanceMetric).subscribe(
    (Response) => {
      this.apiResponse = Response.Data;
      //this.addAlert();
      //$('#addUpdatePopUp').modal('hide');
      this.getKPIData();
      this.KPIId = '';
    },
    (error) => {
      console.error('Error:', error);
    }
  );


}

openModal() {
  this.isEditMode = false;
  this.showModal?.show();
}

closemodal()
{
  var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
  modaltitle.innerHTML = 'Add KPI'
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
  
  this.getPublishers();
  this.isEditMode =false;
  
}


// Edit Data
editList() {
  this.showModal?.show()
  var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
  modaltitle.innerHTML = 'Edit KPI'
  var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
  modalbtn.innerHTML = 'Update'
  this.isEditMode = true;
  const selectedIds = this.getSelectedRowId();
  this.getById(selectedIds);
  this.formBasedOnPublisher(selectedIds);
  

}




/**
* Save product
*/
saveProduct() {
  console.log(this.productForm.valid);
  if (this.productForm.valid) {
    console.log('In save fisrst If');
    this.currentdate="";
    var currentdatetime = this.datePipe.transform( new Date(),'yyyy-MM-ddTh:mm:ss')?.toString();
    console.log(currentdatetime?.toString());
   
      this.publisherId = this.productForm.get('Publisher')?.value;
      const MonthYear = this.productForm.get('MonthYear')?.value;
      this.overallPerformance = this.productForm.get('OverallPerformance')?.value;
      this.schedule= this.productForm.get('Schedule')?.value;
      this.quality= this.productForm.get('Quality')?.value;
      this.communication= this.productForm.get('Communication')?.value;
      this.customerSatisfaction= this.productForm.get('CustomerSatisfaction')?.value;
      this.accountManagement= this.productForm.get('AccountManagement')?.value;
      this.rft= this.productForm.get('RFT')?.value;
      this.publicationSpeed= this.productForm.get('PublicationSpeed')?.value;
      this.feedback= this.productForm.get('Feedback')?.value;
      this.authorSatisfaction= this.productForm.get('AuthorSatisfaction')?.value;

      //console.log('Date',this.datePipe.transform( MonthYear,'MMM YYYY'));
      
  if(this.isEditMode)
  {
    const selectedIds = this.getSelectedRowId();

    //const MY = this.datePipe.transform( MonthYear,'MMM YYYY')?.toString();
    const biPerformanceMetric = {
      id:selectedIds,
      publisherId: this.publisherId,
      monthYear: MonthYear,
      overallPerformance: Number(this.overallPerformance),
      schedule: Number(this.schedule),
      quality: Number(this.quality),
      communication: Number(this.communication),
      customerSatisfaction: Number(this.customerSatisfaction),
      accountManagement: Number(this.accountManagement),
      rft: Number(this.rft),
      publicationSpeed: Number(this.publicationSpeed),
      feedback: Number( this.feedback),
      authorSatisfaction: Number( this.authorSatisfaction),
      insertedDate: "2024-02-15T13:13:24",
      updatedDate: "2024-02-15T13:13:24"
    
    }
    console.log(biPerformanceMetric);

    this.apiService.UpdateDataWithToken('User/UpdateKPI', biPerformanceMetric).subscribe(
      (Response) => {
        
        //this.apiResponse = Response.Data;
        this.isEditMode = false;
        //this.selectedRows.size  === 0;
        this.selectedRows.size  === -1;
        this.selectedRows.clear();
        this.closemodal();
        setTimeout(() => {
          //this.productForm.reset();
        }, 1000);
        this.showModal?.hide()
        Swal.fire({
          title: 'Thank you...',
          text: 'Updated succesfully!',
          showConfirmButton: false, icon: 'success', timer: 4000
        });
        this.getKPIData();
        this.KPIId = '';
      },
      (error) => {
        console.error('Error:', error);
      }

    );
    
  }
  else
  {

    const MY = this.datePipe.transform( MonthYear,'MMM YYYY')?.toString();

    if (Array.isArray(this.products)) {
      const isDuplicate = this.products.some((item: any) =>
        item.publisherId === this.publisherId && item.monthYear === MY
      );

      if (isDuplicate) {
        this.isDuplicate = true;
        console.log('Publisher has already entered data for this month.');

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Publisher has already entered data for this month.</a>'
        });
      } else {
        this.isDuplicate = false;
        console.log('No duplicate data found.');


        this.apiService.GetDataWithToken('User/KPIDataDisplaybyConfig').subscribe(
          (kpiList) => {
            this.KPIList  = kpiList.data;
            console.log(this.KPIList);
           
           
          },
          (error) => {
            console.error('Error:', error);
          });
         
          const  pub = this.publisherList.find(item => item.id == this.publisherId);
          console.log('publish:',pub);
          const item = this.products.reduce((prev, current) => (+prev.id > +current.id) ? prev : current)
          // it returns  { id: 1500, name: 'Kouros', family: 'Shahmir' }
                    // var Maxid =  this.KPIList.find(v=>  max(v.id));
                     console.log(item.id+1);
    const biPerformanceMetric = {
      //id:item.id+1,
      publisherId: this.publisherId,
      acronym: pub.publisherName,
      publisher : pub.acronym,
      monthYear: MY,
      overallPerformance: this.overallPerformance,
      schedule: this.schedule,
      quality: this.quality,
      communication: this.communication,
      customerSatisfaction: this.customerSatisfaction,
      accountManagement: this.accountManagement,
      rft: this.rft,
      publicationSpeed: this.publicationSpeed,
      feedback: this.feedback,
      authorSatisfaction:  this.authorSatisfaction
      
    
    }
    
       console.log(biPerformanceMetric);
    
        this.apiService.postDataWithToken('User/KPIDataInsert', biPerformanceMetric).subscribe(
          (Response) => {
            this.apiResponse = Response.Data;
            
            setTimeout(() => {
              this.productForm.reset();
            }, 1000);
            this.showModal?.hide()
            Swal.fire({
              title: 'Success!',
              text: 'KPI save successfully',
              showConfirmButton: false, icon: 'success', timer: 4000
            })
            this.getKPIData();
            this.KPIId = '';
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    

      }
    }

    
          
        
        

  }


  }
  else
  {

    console.log(this.productForm.valid);
      console.log('main else');
      // this.productForm.clearValidators();  
      // this.productForm.markAsPristine();
      //   this.productForm.markAsUntouched();
      //   this.productForm.updateValueAndValidity();
        
    setTimeout(() => {
      //this.productForm.reset();
    }, 1000);
    this.formsubmit = true;

  }
 
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
  this.deleteID = id
  this.deleteRecordModal?.show()
}

confirmDelete() {

  const selectedIds = this.getSelectedRowId();
  this.deleteKPIData(selectedIds);
  this.deleteRecordModal?.hide()
  this.masterSelected = false;
}

onInactiveClick(): void {
  // Implement logic for the "Inactive" action
  const selectedIds = this.getSelectedRowIds();
  // Implement logic for the "Inactive" action using selectedIds
  console.log('Inactive Action - Selected IDs:', selectedIds);
}

/**
   * Export method starts
   */
exportToExcel() {
  const selectedColumns: (keyof kpiModel)[] = this.columnDefinitions
    .filter((column) => column.visible)
    .map((column) => column.def as keyof kpiModel);

  const dataToExport = this.dataSource.map((item: any) => {
    const exportedItem: Record<string, any> = {};
    selectedColumns.forEach((column: keyof kpiModel) => {
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
  XLSX.writeFile(workbook, 'kpi_'+this.datePipe.transform(myDate, 'ddMMyyy')+'.xlsx');
}

exporttocsvnew(interfaces: any) {}

exportToCsv() {
  const selectedColumns: (keyof kpiModel)[] = this.columnDefinitions
    .filter((column) => column.visible)
    .map((column) => column.def as keyof kpiModel);
  // Extract header row
  // const headerRow = selectedColumns.map((column) => column.toString());
  // Extract header row with bold formatting
  const headerRow =
    '\uFEFF' +
    selectedColumns
      .map((column) => `"${column.toString().replace(/"/g, '""')}"`)
      .join(',');

  const dataToExport = this.dataSource.map((item: any) => {
    const exportedItem: Record<string, any> = {};
    selectedColumns.forEach((column: keyof kpiModel) => {
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
  link.setAttribute('download', 'kpi_'+this.datePipe.transform(myDate, 'ddMMyyy') +'.csv');
  document.body.appendChild(link);
  link.click();
}

exportToPDF() {
  const selectedColumns: (keyof kpiModel)[] = this.columnDefinitions
    .filter((column) => column.visible)
    .map((column) => column.def as keyof kpiModel);

  // Define custom display names for the selected columns
  const selectedColumnsResult = this.convertToAssociativeArray(
    selectedColumns.map((key) => key as string)
  );

  const dataToExport = this.dataSource.map((item: any) => {
    const exportedItem: Record<string, any> = {};
    selectedColumns.forEach((column: keyof kpiModel) => {
      exportedItem[column as string] = item[column];
    });
    return exportedItem;
  });

 
  const doc = new jsPDF({
    orientation: 'landscape',
    // unit: "in",
    // format: [4, 2]
  });
  doc.text('Consignment Receipt List', 1, 1);

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
    margin: { top: 10 }, // Adjust the margin to leave space for the custom header
    tableWidth: 'auto', // 'auto' or a number for a fixed width
    columnWidth: 'wrap', // 'auto', 'wrap', or a number for a fixed width
    bodyStyles: { valign: 'top' }, // Align text within cells vertically
    theme: 'grid', // Other themes are available, choose the one you prefer
    headStyles, // Apply the header background color
  });

  const myDate = new Date();
  doc.save('kpi_'+this.datePipe.transform(myDate, 'ddMMyyy')+'.pdf');
}

exportToExcelAll() {
  const selectedColumns: (keyof kpiModel)[] = this.columnDefinitions
    .filter((column) => column.visible)
    .map((column) => column.def as keyof kpiModel);

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
  this.isLoading = false;

  //// all export


  if (this.originalDataSource.length === 0) {
    console.warn('No data to export');
    return;
  }
  const dataToExport = this.originalDataSource.map((item: any) => {
    const exportedItem: Record<string, any> = {};
    selectedColumns.forEach((column: keyof kpiModel) => {
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

  XLSX.writeFile(workbook, 'kpi_'+this.datePipe.transform(myDate, 'ddMMyyy') +'.xlsx');

  // this.service.getConsignmentsList(payload).subscribe(
  //   (data: any) => {
  //     this.isLoading = false;
     
  //   },
  //   (error: any) => {
  //     console.error('Error fetching data:', error);
  //   }
  // );
}

exportToCsvAll() {
  this.isLoading = false

  const selectedColumns: (keyof kpiModel)[] = this.columnDefinitions
    .filter((column) => column.visible)
    .map((column) => column.def as keyof kpiModel);

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

//// export all 


if (this.originalDataSource.length === 0) {
  console.warn('No data to export');
  return;
}
const dataToExport = this.originalDataSource.map((item: any) => {
  const exportedItem: Record<string, any> = {};
  selectedColumns.forEach((column: keyof kpiModel) => {
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
link.setAttribute('download', 'kpi_'+this.datePipe.transform(myDate, 'ddMMyyy') +'.csv');
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
/**
 * Export method end
 */



resetTableFilterAndPagination() {
  // Reset the filter input field
  this.dataSource.filter = '';

  // Reset filter input values in your column definitions
  this.columnDefinitions.forEach((column) => {
    column.filter.setValue('');
  });

  // Reset the sort
  this.currentSortColumn = '';
  this.isSortAscending = true;

  // Reset the pagination to the first page
  this.page = 1;
  this.itemsPerPage = 10; // Set to your initial page size

  this.getKPIData();

  this.selectedRows.clear();
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
