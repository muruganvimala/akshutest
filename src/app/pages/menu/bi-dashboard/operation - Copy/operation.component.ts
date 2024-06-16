import { Component, QueryList, ViewChild, ViewChildren, OnInit, AfterViewInit, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartComponent } from "ng-apexcharts";
import { instructor, statData } from './data';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopPageModel,browserModel } from './operation.model';
import { InstructorModel } from './operation.model';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DecimalPipe,DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
//import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Options } from '@angular-slider/ngx-slider';

import { ColorPickerService, Cmyk } from 'ngx-color-picker';


import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


//import { InstructorModel, CourseModel } from './learning.model';
//import { instructor, recentcourse } from './data';
import { Observable } from 'rxjs';
//import { NgbdLearningSortableHeader, courseSortEvent } from './learning-sortable.directive';
//import { LearningService } from './learning.service';


import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip
} from 'ng-apexcharts';

import * as ApexCharts from 'apexcharts';

import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { forEach } from 'lodash';
import { kpiModel } from './kpi.model'
import { el } from '@fullcalendar/core/internal-common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;

  
};
declare var $: any;
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
  providers: [DecimalPipe,DatePipe]
})
export class OperationComponent {

   /// sample 
   totalrevenueChart: any;
  totalincomeChart: any;
  propertysaleChart: any;
  propetryrentChart: any;
  currentDate: any;



  

 charttype : string = 'area';

 chartaggregatetype : string = 'area';

 UnderPerformingServicescharttype : string = 'pie';

 UnderperformingPublishercharttype : string = 'pie';

 LeadingReliableContributorscharttype  : string = 'pie';

 ConsistentlyPerformingcharttype : string = 'pie';

   //// date selection
   componentcolor: any = '#405189';
  monolith: any = '#0AB39C';
  nano: any = '#3577F1';
  color: any;

  colorTheme: any = 'theme-blue';
  bsConfig?: Partial<BsDatepickerConfig>;
  minDate: any;
  maxDate: any;
  defaultdate: any = new Date();
  dateform!: UntypedFormGroup;
  
  disabledDates: any;
  bsInlineValue = new Date();
  mytime: Date = new Date()
  myTime: Date = new Date();
  minTime: Date = new Date();
  maxTime: Date = new Date();

  dataSource: any = [];
  products: any[] = [];
  pagedItems: any[] = [];
  totalRecords: number = 0;
  originalDataSource: any = [];
  isLoading = true;

  sortValue: any = 'Publisher ascending';
  sortColumn = 'acronym'; // default sort column
  sortOrder = 'asc'; // default sort order
page: number = 0;
itemsPerPage: number = 10; // Adjust as needed
perPageOptions: number[] = [10, 20, 30,40];
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


  selectedMonthYear: any = "";



  
  public publisherList: any[] = [];
  kpiConfigList: any[] = [];
  public KPIList: any[] = [];
  selectedRows: Set<kpiModel> = new Set<kpiModel>();
  selectedColumns: Set<string> = new Set<string>();
  
  totalPages = 0;
currentSortColumn: string = ''; // Track the current sorting column
isSortAscending: boolean = true;

  selectedYear: any = "";
  masterSelected = false;

  public color1: string = '#C8A6A9';
  public color2: string = '#F6A8AE';

  actualvaluecolour : string = "#008FFB"; //"#C8A6A9";
  targetvaluecolour : string = "--tb-success";//"#F6A8AE";

  titelblockchart : any;

  public titelmonthvaluearray: any[]=[];
  public titelmontharray: any[]=[];
  public titleonemonthdata: any[] = []; 
  public previoustitlemonthdata : any[] = [];
  titleValue: any = 0;
  titelarrowcolour : any= "";
  titelarrowdirection : any = "";
  prevoiusvalue : any = 0;
  aveg : any = 0;

  /// value
  valuemonthselection : number= 1;
  public valuewiseonemonth : any[]=[];
  Onemonthvaluedata: any[] = [];
  public valuewisethreemonth : any[]=[];
  threemonthvaluedata: any[] = [];
  public valuewisesixmonth : any[]=[];
  sixmonthvaluedata: any[] = [];
  public valuewise12month : any[]=[];
  twelvemonthvaluedata: any[] = [];
  public valuewiseallmonth : any[]=[];
  allmonthvaluedata: any[] = [];


  /// aggregate
  aggregatemonthselection : number= 1;
  public aggregatewiseonemonth : any[]=[];
  Onemonthaggregatedata: any[] = [];
  public aggregatewisethreemonth : any[]=[];
  threemonthaggregatedata: any[] = [];
  public aggregatewisesixmonth : any[]=[];
  sixmonthaggregatedata: any[] = [];
  public aggregatewise12month : any[]=[];
  twelvemonthaggregatedata: any[] = [];
  public aggregatewiseallmonth : any[]=[];
  allmonthaggregatedata: any[] = [];

  
  

  public chartOptions: any;
  public BiReportList: any[] =[];
  public UnderperformingPublishers: any[] =[];
  public UnderPerformingServices: any[] =[];
  public LeadingReliableContributorsPublisher : any [] = [];
  public ConsistentlyPerformingMetric: any [] = [];
  areasplineChart: any;
  lineColumnAreaChart: any;
  UnderperformingPublishersvaluemonthselection : number= 1;
  UnderperformingServicesvaluemonthselection : number= 1;
  LeadingReliableContributorsmonthselection : number= 1;
  ConsistentlyPerformingmonthselection : number= 1;
  UnderperformingPublishersPieChart:any;
  UnderPerformingServicesPieChart:any;
  Funnel: any;
  Pyramid: any;
  simpleDonutChart: any;
  
  public series: any = [];
  public categories: any = [];
  public groups : any= [];

  Overalldata : any = [];
  
  public _BiReportList: any[] = [];
  months = [
    ['Jan', 'Feb', 'Mar'],
    ['Apr', 'May', 'Jun'],
    ['Jul', 'Aug', 'Sep'],
    ['Oct', 'Nov', 'Dec']
  ];
  rangeFrom:string="";
  rangeTo:string="";

  currentMMYY: string = "";
  previousMMYY: string = "";
  selectedPublisher:string="";
  currentYear = new Date().getFullYear();  // Set initial year to the current year
  minYear = 2023;  // Define minimum year
  maxYear = new Date().getFullYear();  // Define maximum year
  selectionStart: { month: string, year: number } | null = null;
  selectionEnd: { month: string, year: number } | null = null;
  private flatMonths = this.months.flat();
  
  currentTab = 'pageViews';
  pageoverviewChart: any;
  clicksChart: any;
  columnChart: any;

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
  
  public cmykValue: string = '';
  newstatData: any;
  public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);
  //@ViewChild('Last1M') Last1M: ElementRef;
  
  constructor(private apiService: ApiService, private cpService: ColorPickerService, private sweetAlert: SweetAlertService,private formBuilder: UntypedFormBuilder,private datePipe:DatePipe,private router: Router) {
    this.minTime.setHours(8);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(23);
    this.maxTime.setMinutes(55);
    //this.oneyear();
    this.dateform = this.formBuilder.group({
      sdate: [this.previousMMYY],
      edate: [this.currentMMYY]
    });

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.currentDate = { from: firstDay, to: lastDay }
  }

  tickValue = 5;
  tickValueoptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: 'Line' },
      { value: 2, legend: 'Bar' },
      { value: 3, legend: 'Area' },
      { value: 4, legend: 'Scatter' }
      
    ]
  };

  ngOnInit(): void {
    //this.getBiReport("jan 2024", "mar 2024");
    setTimeout(() => {
      this.showLoader();
    }, 100);

    
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, showWeekNumbers: false });
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    
    this.dateform.controls['sdate'].setValue(this.previousMMYY);
    this.dateform.controls['edate'].setValue(this.currentMMYY);

    

    var currentdate = this.datePipe.transform( new Date(),'yyyy-MM-dd');
    var d = new Date(new Date());
    //d.setFullYear(d.getFullYear() - 1);

    //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
    var year = new Date().getFullYear();
    var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
    var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
    this.currentMMYY = currentmmyyyy;
    this.previousMMYY = previousmmyyyy;

    console.log('previous month year ', previousmmyyyy);
    //<HTMLInputElement>document.getElementById('startDate').value = '123344565';
    //(<HTMLInputElement>document.getElementById("startDate")).value = '7778';
    console.log('current month year ', currentmmyyyy);
    var currentdatetime = this.datePipe.transform( new Date(),'MMM yyyy')?.toString();
    console.log('current date',currentdatetime?.toString());
    this.disabledDates = [
      new Date()
    ];

    

    
    //this.oneyear();
    
    this._UnderperformingServices('["#008FFB","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY);
    this._UnderperformingPublishers('["#008FFB","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY);
    this._LeadingReliableContributors('["#008FFB","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY)
    this._ConsistentlyPerforming('["#008FFB","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY);
    ////this._areasplineChart('["#C8A6A9", "#F6A8AE"]')
    //this._simpleDonutChart('["#C8A6A9", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');
    //this.getKPIData();
    //this.getKPIConfigData();
   
    //this._pageoverviewChartnew('["#C8A6A9", "#F6A8AE"]');
    
    //this._clicksChartnew('["#F6A8AE", "#C8A6A9"]');
    //this._columnChartnew('["#C8A6A9-text-emphasis"]');

    //this._totalrevenueChart('["#C8A6A9"]');
    //this._totalincomeChart('["--tb-success"]');
    //this._propertysaleChart('["--tb-danger"]');
    //this._propetryrentChart('["--tb-info"]');
    this.KPIonemonth();
    this.onemonth();
    this.onemonthaggregate();
    //this.onemonthaggregate();
    
    setTimeout(() => {
      this.closeLoader();
    }, 3000);
  }

 
  incrementYear(): void {
    if (this.currentYear < this.maxYear) {
      this.currentYear++;
      //this.resetSelection();
    }
  }

  decrementYear(): void {
    if (this.currentYear > this.minYear) {
      this.currentYear--;
      //this.resetSelection();
    }
  }

  selectMonth(month: string): void {
    const newSelection = { month, year: this.currentYear };
    if (!this.selectionStart || this.selectionEnd) {
      // Start a new selection or reset the selection
      this.selectionStart = newSelection;
      this.selectionEnd = null;
    } else {
      // Set the end of the selection
      this.selectionEnd = newSelection;
      // Correct the order if necessary
      if (this.isBefore(this.selectionEnd, this.selectionStart)) {
        // Swap if the end is before the start
        [this.selectionStart, this.selectionEnd] = [this.selectionEnd, this.selectionStart];
      }
      // Display an alert with the selected range
      this.displaySelectedRange();
    }
  }


  isBefore(selection1: { month: string, year: number }, selection2: { month: string, year: number }): boolean {
    // First, compare the years
    if (selection1.year !== selection2.year) {
      return selection1.year < selection2.year;
    }
    // Only if the years are the same, then compare the month indices
    return this.flatMonths.indexOf(selection1.month) < this.flatMonths.indexOf(selection2.month);
  }

 
  
  displaySelectedRange(): void {
    if (this.selectionStart && this.selectionEnd) {
      this.rangeFrom = `${this.selectionStart.month} ${this.selectionStart.year}`;
      this.rangeTo = `${this.selectionEnd.month} ${this.selectionEnd.year}`;
      this.selectedPublisher=$('#Publisher').val();
      this.getBiReport(this.rangeFrom,this.rangeTo,$('#Publisher').val());
    }
  }

  isSelectedMonth(month: string, year: number): boolean|null {
    // Returns true if the month and year exactly match the start or end selection
    return (this.selectionStart && month === this.selectionStart.month && year === this.selectionStart.year) ||
           (this.selectionEnd && month === this.selectionEnd.month && year === this.selectionEnd.year);
  }
  
  isInRange(month: string, year: number): boolean {
    // Check if the month is between the selected start and end
    if (!this.selectionStart || !this.selectionEnd || this.selectionStart === this.selectionEnd) return false;
  
    const startIndex = this.flatMonths.indexOf(this.selectionStart.month) + this.selectionStart.year * 12;
    const endIndex = this.flatMonths.indexOf(this.selectionEnd.month) + this.selectionEnd.year * 12;
    const currentIndex = this.flatMonths.indexOf(month) + year * 12;
  
    return currentIndex > Math.min(startIndex, endIndex) && currentIndex < Math.max(startIndex, endIndex);
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
  
  submitFilter() {
    console.log('In submit filter');
     console.log($('#startDate').val());
     this.previousMMYY = $('#startDate').val();
     this.currentMMYY = $('#endDate').val()
     
     //this._UnderperformingServices('["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY);
     //this._UnderperformingPublishers('["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY);
     //this._LeadingReliableContributors('["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY)
     //this._ConsistentlyPerforming('["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]',this.previousMMYY,this.currentMMYY);

     
  }

 
  getBiReport(from: string, to: string, publisherName: string): void {
    const range = {
      from: from,
      to: to,
      publisherName: publisherName
    };
    this.apiService.postDataWithToken('KPI/SSP_BIReport', range).subscribe({
      next: (response) => {
        this.BiReportList = response.data;
        console.log(`Showing data range from ${range.from} to ${range.to}`);
        console.log(this.BiReportList);
        this.updateChart(this.BiReportList); // Call updateChart with the new data
      },
      error: (error) => {
        console.error('Error:', error);
        //this.sweetAlert.failureAlert('Unable to get bi report data', error.message);
      }
    });
  }

  updateChart(data: any[]): void {
    
      this.chartOptions = {
        series: [
          {
            name: "Target",
            data: data.map(item => item.metricsData.target)
          },
          {
            name: "Actual",
            data: data.map(item => item.metricsData.actual)
          }
        ],
        chart: {
          height: 500,
          type: "area"
        },
        xaxis: {
          categories: data.map(item => item.metrics)
        },
        // xaxis: {
        //   categories: data.map(item => item.monthYear)
        // },
        tooltip: {
          enabled: true
        }
      };    
  } 

  /////////////////////////////////////////////////////////////////////////////////

  private _columnChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.columnChart = {
      series: [{
        data: [30, 57, 25, 33, 20, 39, 47, 36, 22, 51, 38, 27, 38, 49, 42, 58, 33, 46, 40, 34, 41, 53, 19, 23, 36, 52, 58, 43]
      }],
      chart: {
        height: 373,
        type: 'bar',
        toolbar: {
          show: false,
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        type: 'datetime',
        categories: ['01/01/2023 GMT', '01/02/2023 GMT', '01/03/2023 GMT', '01/04/2023 GMT',
          '01/05/2023 GMT', '01/06/2023 GMT', '01/07/2023 GMT', '01/08/2023 GMT', '01/09/2023 GMT', '01/10/2023 GMT', '01/11/2023 GMT', '01/12/2023 GMT', '01/13/2023 GMT',
          '01/14/2023 GMT', '01/15/2023 GMT', '01/16/2023 GMT', '01/17/2023 GMT', '01/18/2023 GMT', '01/19/2023 GMT', '01/20/2023 GMT', '01/21/2023 GMT', '01/22/2023 GMT',
          '01/23/2023 GMT', '01/24/2023 GMT', '01/25/2023 GMT', '01/26/2023 GMT', '01/27/2023 GMT', '01/28/2023 GMT'
        ],
      },
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._columnChart('["#C8A6A9-text-emphasis"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

// Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  // private _pageoverviewChart(colors: any) {
  //   colors = this.getChartColorsArray(colors);
  //   this.pageoverviewChart = {
  //     series: [{
  //       name: 'Website',
  //       data: [12, 14.65, 28.24, 25.02, 19.65, 23, 21.18, 23.65, 20.32, 18, 12.65, 28.32]
  //     },
  //     {
  //       name: 'Social Media',
  //       data: [26, 24.65, 18.24, 29.02, 23.65, 27, 21.18, 24.65, 27.32, 25, 24.65, 29.32]
  //     },
  //     {
  //       name: 'Others',
  //       data: [-10, -17.32, -15.45, -12.30, -19.15, -15.45, -11, -14.32, -15.67, -10, -17.32, -19.2]
  //     }
  //     ],
  //     chart: {
  //       type: 'bar',
  //       height: 373,
  //       stacked: true,
  //       toolbar: {
  //         show: false
  //       }
  //     },
  //     stroke: {
  //       width: 5,
  //       colors: "#000",
  //       lineCap: 'round',
  //     },
  //     plotOptions: {
  //       bar: {
  //         columnWidth: '25%',
  //         borderRadius: 5,
  //         lineCap: 'round',
  //         borderRadiusOnAllStackedSeries: true

  //       },
  //     },
  //     colors: colors,
  //     fill: {
  //       opacity: 1
  //     },
  //     dataLabels: {
  //       enabled: false,
  //       textAnchor: 'top',
  //     },
  //     legend: {
  //       show: true,
  //       position: 'top',
  //       horizontalAlign: 'right',
  //     },
  //     xaxis: {
  //       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //       labels: {
  //         rotate: -90
  //       },
  //       axisTicks: {
  //         show: true,
  //       },
  //       axisBorder: {
  //         show: true,
  //         stroke: {
  //           width: 1
  //         },
  //       },
  //     },
  //     responsive: [
  //       {
  //         breakpoint: 992,
  //         options: {
  //           plotOptions: {
  //             bar: {
  //               columnWidth: '50px',
  //             }
  //           },
  //         }
  //       },
  //       {
  //         breakpoint: 600,
  //         options: {
  //           plotOptions: {
  //             bar: {
  //               columnWidth: '70px',
  //             }
  //           },
  //         }
  //       }
  //     ]
  //   }
  //   const attributeToMonitor = 'data-theme';

  //   const observer = new MutationObserver(() => {
  //     this._pageoverviewChart('["--tb-light", "#C8A6A9", "#F6A8AE"]');
  //   });
  //   observer.observe(document.documentElement, {
  //     attributes: true,
  //     attributeFilter: [attributeToMonitor]
  //   });

  // }

  changeTab(tab: string, charts: any) {
    this.currentTab = tab;

    if (charts === '1') {
       this.onemonth(); //this._pageoverviewChartnew('["--tb-light", "#C8A6A9", "#F6A8AE"]');
    } else if (charts === '2') {
      this.onemonthaggregate();
    } else {
      this._columnChart('["#C8A6A9-text-emphasis"]');
    }
  }

  
  // Area Spline Chart

  private _areasplineChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.areasplineChart = {
      series: [{
        name: 'This Month',
        data: [49, 54, 48, 54, 67, 88, 96, 102, 120, 133]
      }, {
        name: 'Last Month',
        data: [57, 66, 74, 63, 55, 70, 84, 97, 112, 99]
      }],
      chart: {
        height: 320,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      fill: {
        type: ['gradient', 'gradient'],
        gradient: {
          shadeIntensity: 1,
          type: "vertical",
          inverseColors: false,
          opacityFrom: 0.2,
          opacityTo: 0.0,
          stops: [50, 70, 100, 100]
        },
      },
      markers: {
        size: 4,
        strokeColors: colors,
        strokeWidth: 1,
        strokeOpacity: 0.9,
        fillOpacity: 1,
        hover: {
          size: 6,
        }
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        group: {
          style: {
            fontSize: '10px',
            fontWeight: 700
          },
          groups: [
            { title: '2020', cols: 4 },
            { title: '2021', cols: 4 }
          ]
        },
        labels: {
          rotate: -90
        },
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          stroke: {
            width: 1
          },
        },
      },
      stroke: {
        width: [2, 2],
        curve: 'smooth'
      },
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._areasplineChart('["#C8A6A9", "#F6A8AE"]')
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
    // observer.disconnect();
  }


    /**
  * Simple Pie Chart
  */
  
  

  public oneyear()
  {
     console.log('In oneyear');
     this.series.length =0;
     this.categories.length = 0;
     this.groups.length= 0;
     this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=mar 2024&eMonthyear=mar 2024')
     .subscribe(
       res => {
         
         console.log('One month data',res.data);
         this.BiReportList = res.data;
         setTimeout(() => {
          if(this.BiReportList.length > 0)
          {
           this._lineColumnAreaChart('["#ABDBE3", "#76B5C5", "#EAB676","#1E81B0","#E8A2CF","#CFBDF3","#E4D58D","#F6A8AE","#C8A6A9"]',this.BiReportList);
          }
          else
          {
              this.lineColumnAreaChart = {
           series: this.series,
           chart: {
             height: 350,
             type: 'bar',
             stacked: false,
             toolbar: {
               show: false,
             }
           },
           stroke: {
             width: [0, 2, 5],
             curve: 'smooth'
           },
           plotOptions: {
             bar: {
               columnWidth: '50%'
             }
           },
           fill: {
             opacity: [0.65, 0.25, 1],
             gradient: {
               inverseColors: false,
               shade: 'light',
               type: "vertical",
               opacityFrom: 0.85,
               opacityTo: 0.55,
               stops: [0, 100, 100, 100]
             }
           },
           markers: {
             size: 0
           },
           xaxis: {
             type: 'category',
             categories: this.categories,
             group: {
               style: {
                 fontSize: '10px',
                 fontWeight: 750
               },
               groups: this.groups
             }
           },
           yaxis: {
             title: {
               text: 'Points',
             },
             min: 0
           },
           tooltip: {
             shared: true,
             intersect: false,
             y: {
               formatter: function (y: any) {
                 if (typeof y !== "undefined") {
                   return y.toFixed(0)  + " points";
                 }
                 return y;
     
               }
             }
           },
           
               };
          }
           //console.log('local storage count is ' + sessionStorage.length);
         }, 1000);
       },
      
     );

    
    
  }

  public sixmonth()
  {
   
     console.log('In sixmonth');
     this.lineColumnAreaChart = null;
     this.series.length =0;
     this.categories.length = 0;
     this.groups.length= 0;
     this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=oct 2023&eMonthyear=mar 2024')
     .subscribe(
       res => {
         console.log('login api triggered');
         console.log(res.data);
         this.BiReportList = res.data;
         setTimeout(() => {
          if(this.BiReportList.length > 0)
          {
           this._lineColumnAreaChart('["#ABDBE3", "#76B5C5", "#EAB676","#1E81B0","#E8A2CF","#CFBDF3","#E4D58D","#F6A8AE","#C8A6A9"]',this.BiReportList);
          }
          else
          {
              this.lineColumnAreaChart = {
           series: this.series,
           chart: {
             height: 350,
             type: 'bar',
             stacked: false,
             toolbar: {
               show: false,
             }
           },
           stroke: {
             width: [0, 2, 5],
             curve: 'smooth'
           },
           plotOptions: {
             bar: {
               columnWidth: '50%'
             }
           },
           fill: {
             opacity: [0.65, 0.25, 1],
             gradient: {
               inverseColors: false,
               shade: 'light',
               type: "vertical",
               opacityFrom: 0.85,
               opacityTo: 0.55,
               stops: [0, 100, 100, 100]
             }
           },
           markers: {
             size: 0
           },
           xaxis: {
             type: 'category',
             categories: this.categories,
             group: {
               style: {
                 fontSize: '10px',
                 fontWeight: 750
               },
               groups: this.groups
             }
           },
           yaxis: {
             title: {
               text: 'Points',
             },
             min: 0
           },
           tooltip: {
             shared: true,
             intersect: false,
             y: {
               formatter: function (y: any) {
                 if (typeof y !== "undefined") {
                   return y.toFixed(0)  + " points";
                 }
                 return y;
     
               }
             }
           },
           
               };
          }
           console.log('local storage count is ' + sessionStorage.length);
         }, 1000);
       },
      
     );

    
    
     
  }

  public twomonth()
  {
     console.log('In twomonth');
     this.lineColumnAreaChart = null;
     this.series.length =0;
     this.categories.length = 0;
     this.groups.length= 0;
     this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=feb 2024&eMonthyear=mar 2024')
     .subscribe(
       res => {
         //console.log('login api triggered');
         console.log('two month data:',res.data);
         this.BiReportList = res.data;
         setTimeout(() => {
          if(this.BiReportList.length > 0)
          {
           this._lineColumnAreaChart('["#ABDBE3", "#76B5C5", "#EAB676","#1E81B0","#E8A2CF","#CFBDF3","#E4D58D","#F6A8AE","#C8A6A9"]', this.BiReportList);
          }
          else
          {
              this.lineColumnAreaChart = {
           series: this.series,
           chart: {
             height: 350,
             type: 'bar',
             stacked: false,
             toolbar: {
               show: false,
             }
           },
           stroke: {
             width: [0, 2, 5],
             curve: 'smooth'
           },
           plotOptions: {
             bar: {
               columnWidth: '50%'
             }
           },
           fill: {
             opacity: [0.65, 0.25, 1],
             gradient: {
               inverseColors: false,
               shade: 'light',
               type: "vertical",
               opacityFrom: 0.85,
               opacityTo: 0.55,
               stops: [0, 100, 100, 100]
             }
           },
           markers: {
             size: 0
           },
           xaxis: {
             type: 'category',
             categories: this.categories,
             group: {
               style: {
                 fontSize: '10px',
                 fontWeight: 750
               },
               groups: this.groups
             }
           },
           yaxis: {
             title: {
               text: 'Points',
             },
             min: 0
           },
           tooltip: {
             shared: true,
             intersect: false,
             y: {
               formatter: function (y: any) {
                 if (typeof y !== "undefined") {
                   return y.toFixed(0)  + " points";
                 }
                 return y;
     
               }
             }
           },
           
               };
          }
           //console.log('local storage count is ' + sessionStorage.length);
         }, 1000);
       },
      
     );

     
    
  }



  /**
   * UnderperformingPublishers chart
   * 
   */

   /**
    * Simple Pie Chart
    */
  private _UnderperformingServices(colors: any,smonth?: string, emonth?: string) {
    
    this.apiService.GetDataWithToken('api/dashboard/UnderPerformingServices?bottom=Bottom&sMonthyear='+smonth+'&eMonthyear='+emonth+'&metric=Metric')
    .subscribe(
      res => {
        console.log('this.UnderPerformingServices',res.data);
        this.UnderPerformingServices = res.data;
       
        setTimeout(() => {
          this.__UnderPerformingServices(colors,this.UnderPerformingServices)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  public UnderperformingServicescharttype(type: string)
  {
     console.log('chart type in value tab',type);
     if(this.UnderperformingPublishersvaluemonthselection == 1)
     {
       this.UnderPerformingServicescharttype=type;
       var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._UnderperformingServices(c,this.previousMMYY,this.currentMMYY);
     }
     else if(this.UnderperformingPublishersvaluemonthselection == 2)
     {
      this.UnderPerformingServicescharttype=type;
       this._UnderperformingServicesThreemonth();
     }
     else if(this.UnderperformingPublishersvaluemonthselection == 3)
     {
      this.UnderPerformingServicescharttype=type;
       this._UnderperformingServicesSixmonth();
     }
     else if(this.UnderperformingPublishersvaluemonthselection == 4)
     {
      this.UnderPerformingServicescharttype=type;
       this._UnderperformingServicesTwelvemonth();
     }
     else
     {
      this.UnderPerformingServicescharttype=type;
       this._UnderperformingServicesAllmonth();
     }
  }

  public _UnderperformingServicescall(month : number)
  {

      if(month == 1)
      {
        this.UnderperformingPublishersvaluemonthselection =1;
        var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._UnderperformingServices(c,this.previousMMYY,this.currentMMYY);
      }
      else if(month == 3)
      {
        this.UnderperformingPublishersvaluemonthselection =2;
         this._UnderperformingServicesThreemonth();
      }
      else if(month == 6)
      {
        this.UnderperformingPublishersvaluemonthselection =3;
         this._UnderperformingServicesSixmonth();
      }
      else if(month == 12)
      {
        this.UnderperformingPublishersvaluemonthselection =4;
         this._UnderperformingServicesTwelvemonth();
      }
      else
      {
        this.UnderperformingPublishersvaluemonthselection =5;
        this._UnderperformingServicesAllmonth();
      }
  }

  private _UnderperformingServicesThreemonth() {
    
    this.apiService.GetDataWithToken('api/dashboard/UnderPerformingServices?bottom=Bottom&sMonthyear=jan 2024&eMonthyear=mar 2024&metric=Metric')
    .subscribe(
      res => {
        console.log('this.UnderPerformingServices',res.data);
        this.UnderPerformingServices = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderPerformingServices(c,this.UnderPerformingServices)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  /// paramiters colors: any,smonth?: string, emonth?: string
  private _UnderperformingServicesSixmonth() {
    
    this.apiService.GetDataWithToken('api/dashboard/UnderPerformingServices?bottom=Bottom&sMonthyear=oct 2023&eMonthyear=mar 2024&metric=Metric')
    .subscribe(
      res => {
        console.log('this.UnderPerformingServices',res.data);
        this.UnderPerformingServices = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderPerformingServices(c,this.UnderPerformingServices)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

/// paramiters colors: any,smonth?: string, emonth?: string
  private _UnderperformingServicesTwelvemonth() {
    
    this.apiService.GetDataWithToken('api/dashboard/UnderPerformingServices?bottom=Bottom&sMonthyear=feb 2023&eMonthyear=mar 2024&metric=Metric')
    .subscribe(
      res => {
        console.log('this.UnderPerformingServices',res.data);
        this.UnderPerformingServices = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderPerformingServices(c,this.UnderPerformingServices)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

////// paramiters colors: any,smonth?: string, emonth?: string
  private _UnderperformingServicesAllmonth() {
    
    this.apiService.GetDataWithToken('api/dashboard/UnderPerformingServices?bottom=Bottom&sMonthyear=jan 2023&eMonthyear=mar 2024&metric=Metric')
    .subscribe(
      res => {
        console.log('this.UnderPerformingServices',res.data);
        this.UnderPerformingServices = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderPerformingServices(c,this.UnderPerformingServices)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private __UnderPerformingServices(colors: any,chartdata?: any)
  {
       this.UnderPerformingServices =  chartdata;

      var resultPublisher = this.UnderPerformingServices.map(function(a) {return a.metrics;});
      console.log(resultPublisher);

      var resultcount = this.UnderPerformingServices.map(function(a) {return a.count;});
      console.log('__UnderPerformingServices:', resultcount);

      colors = this.getChartColorsArray(colors);


      
      
      if(this.UnderPerformingServicescharttype == 'pie')
      {
        this.UnderPerformingServicesPieChart = {
          series: resultcount,
          chart: {
            height: 300,
            type: this.UnderPerformingServicescharttype,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true,
            }
          },
          labels: resultPublisher,
          legend: {
            position: "bottom",
          },
          dataLabels: {
            dropShadow: {
              enabled: false,
            },
          },
          colors: colors,
        };
      }
      else if (this.UnderPerformingServicescharttype == 'polarArea')
      {
        this.UnderPerformingServicesPieChart = {
          series: resultcount,
      chart: {
        type: "polarArea",
        width: 400,
      },
      labels: resultPublisher,
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      legend: {
        position: "bottom",
      },
      colors: colors,
        };
      }
      else
      {


        this.UnderPerformingServicesPieChart = {
          series: [{
            data:resultcount
          }
          ],
          chart: {
            type: this.UnderPerformingServicescharttype,
            height: 300,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true,
            }
          },
          dataLabels: {
            enabled: false,
          },
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          xaxis: {
            categories: resultPublisher,
            tickPlacement: 'on',
            labels: {
              rotate: -45,
              rotateAlways: true,
            },
            axisBorder: {
              show: true,
              stroke: {
                width: 1
              },
            },
          },
          labels: resultPublisher,
          legend: {
            position: 'top',
          },
          fill: {
            opacity: 1
          },
          colors: colors,
          
        };
        
      }
     
     
      
      
      const attributeToMonitor = 'data-theme';

      const observer = new MutationObserver(() => {
        this.__UnderPerformingServices('["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]');
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [attributeToMonitor]
      });



  }


  public UnderperformingPublisherscharttype(type: string)
  {
     console.log('chart type in value tab',type);
     if(this.UnderperformingServicesvaluemonthselection == 1)
     {
       this.UnderperformingPublishercharttype=type;
       var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._UnderperformingPublishers(c,this.previousMMYY,this.currentMMYY);
     }
     else if(this.UnderperformingServicesvaluemonthselection == 2)
     {
      this.UnderperformingPublishercharttype=type;
       this._UnderperformingPublishersThreeMonth();
     }
     else if(this.UnderperformingServicesvaluemonthselection == 3)
     {
      this.UnderperformingPublishercharttype=type;
       this._UnderperformingPublishersSixMonth();
     }
     else if(this.UnderperformingServicesvaluemonthselection == 4)
     {
      this.UnderperformingPublishercharttype=type;
       this._UnderperformingPublishersTwelvemonth();
     }
     else
     {
      this.UnderperformingPublishercharttype=type;
       this._UnderperformingPublishersAllMonth();
     }
  }

  public _UnderperformingPublisherscall(month : number)
  {

      if(month == 1)
      {
        this.UnderperformingServicesvaluemonthselection =1;
        var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._UnderperformingPublishers(c,this.previousMMYY,this.currentMMYY);
      }
      else if(month == 3)
      {
        this.UnderperformingServicesvaluemonthselection =2;
         this._UnderperformingPublishersThreeMonth();
      }
      else if(month == 6)
      {
        this.UnderperformingServicesvaluemonthselection =3;
         this._UnderperformingPublishersSixMonth();
      }
      else if(month == 12)
      {
        this.UnderperformingServicesvaluemonthselection =4;
         this._UnderperformingPublishersTwelvemonth();
      }
      else
      {
        this.UnderperformingServicesvaluemonthselection =5;
        this._UnderperformingPublishersAllMonth();
      }
  }



  private _UnderperformingPublishers(colors: any,smonth?: string, emonth?: string) {

    this.apiService.GetDataWithToken('api/dashboard/UnderperformingPublishers?bottom=Bottom&sMonthyear='+smonth+'&eMonthyear='+emonth+'&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.UnderperformingPublishers',res.data);
        this.UnderperformingPublishers = res.data;
       
        setTimeout(() => {
          this.__UnderperformingPublishers(colors,this.UnderperformingPublishers)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private _UnderperformingPublishersThreeMonth() {

    this.apiService.GetDataWithToken('api/dashboard/UnderperformingPublishers?bottom=Bottom&sMonthyear=jan 2024&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.UnderperformingPublishers',res.data);
        this.UnderperformingPublishers = res.data;
        var c = '["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderperformingPublishers(c,this.UnderperformingPublishers)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private _UnderperformingPublishersSixMonth() {

    this.apiService.GetDataWithToken('api/dashboard/UnderperformingPublishers?bottom=Bottom&sMonthyear=oct 2023&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.UnderperformingPublishers',res.data);
        this.UnderperformingPublishers = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderperformingPublishers(c,this.UnderperformingPublishers)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private _UnderperformingPublishersTwelvemonth() {

    this.apiService.GetDataWithToken('api/dashboard/UnderperformingPublishers?bottom=Bottom&sMonthyear=feb 2023&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.UnderperformingPublishers',res.data);
        this.UnderperformingPublishers = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderperformingPublishers(c,this.UnderperformingPublishers)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private _UnderperformingPublishersAllMonth() {

    this.apiService.GetDataWithToken('api/dashboard/UnderperformingPublishers?bottom=Bottom&sMonthyear=jan 2023&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.UnderperformingPublishers',res.data);
        this.UnderperformingPublishers = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__UnderperformingPublishers(c,this.UnderperformingPublishers)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private __UnderperformingPublishers(colors: any,chartdata?: any)
  {
      this.UnderperformingPublishers =  chartdata;

      var resultPublisher = this.UnderperformingPublishers.map(function(a) {return a.publisherName;});
      console.log(resultPublisher);

      var resultcount = this.UnderperformingPublishers.map(function(a) {return a.count;});
      console.log(resultcount);

      colors = this.getChartColorsArray(colors);
    
      // this.UnderperformingPublishersPieChart = {
      //   series: resultcount,

      //   chart: {
      //     height: 300,
      //     type: "pie",
      //   },
      //   labels: resultPublisher,
      //   legend: {
      //     position: "bottom",
      //   },
      //   dataLabels: {
      //     dropShadow: {
      //       enabled: false,
      //     },
      //   },
      //   colors: colors,
      // };


      if(this.UnderperformingPublishercharttype == 'pie')
      {
        this.UnderperformingPublishersPieChart = {
          series: resultcount,
          chart: {
            height: 300,
            type: this.UnderperformingPublishercharttype,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true,
            }
          },
          labels: resultPublisher,
          legend: {
            position: "bottom",
          },
          dataLabels: {
            dropShadow: {
              enabled: false,
            },
          },
          colors: colors,
        };
      }
      else if (this.UnderperformingPublishercharttype == 'polarArea')
      {
        this.UnderperformingPublishersPieChart = {
          series: resultcount,
      chart: {
        type: "polarArea",
        width: 400,
      },
      labels: resultPublisher,
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      legend: {
        position: "bottom",
      },
      colors: colors,
        };
      }
      else
      {

        this.UnderperformingPublishersPieChart = {
        series: [{
          data:resultcount
        }
        ],
        chart: {
          type: this.UnderperformingPublishercharttype,
          height: 300,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true,
          }
        },
        dataLabels: {
          enabled: false,
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: resultPublisher,
          tickPlacement: 'on',
          labels: {
            rotate: -45,
            rotateAlways: true,
          },
          axisBorder: {
            show: true,
            stroke: {
              width: 1
            },
          },
        },
        labels: resultPublisher,
        legend: {
          position: 'top',
        },
        fill: {
          opacity: 1
        },
        colors: colors,
        
      };
     

      }
     
      
      const attributeToMonitor = 'data-theme';

      const observer = new MutationObserver(() => {
        this.__UnderperformingPublishers('["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]');
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [attributeToMonitor]
      });



  }


  public _LeadingReliableContributorscharttype(type: string)
  {
     console.log('chart type in value tab',type);
     if(this.LeadingReliableContributorsmonthselection == 1)
     {
       this.LeadingReliableContributorscharttype=type;
       var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._LeadingReliableContributors(c,this.previousMMYY,this.currentMMYY);
     }
     else if(this.LeadingReliableContributorsmonthselection == 2)
     {
      this.LeadingReliableContributorscharttype=type;
       this._LeadingReliableContributorsThreeMonth();
     }
     else if(this.LeadingReliableContributorsmonthselection == 3)
     {
      this.LeadingReliableContributorscharttype=type;
       this._LeadingReliableContributorsSixMonth();
     }
     else if(this.LeadingReliableContributorsmonthselection == 4)
     {
      this.LeadingReliableContributorscharttype=type;
       this._LeadingReliableContributorsTwelvemonth();
     }
     else
     {
      this.LeadingReliableContributorscharttype=type;
       this._LeadingReliableContributorsAllmonth();
     }
  }

  public _LeadingReliableContributorscall(month : number)
  {

      if(month == 1)
      {
        this.LeadingReliableContributorsmonthselection =1;
        var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._LeadingReliableContributors(c,this.previousMMYY,this.currentMMYY);
      }
      else if(month == 3)
      {
        this.LeadingReliableContributorsmonthselection =2;
         this._LeadingReliableContributorsThreeMonth();
      }
      else if(month == 6)
      {
        this.LeadingReliableContributorsmonthselection =3;
         this._LeadingReliableContributorsSixMonth();
      }
      else if(month == 12)
      {
        this.LeadingReliableContributorsmonthselection =4;
         this._LeadingReliableContributorsTwelvemonth();
      }
      else
      {
        this.LeadingReliableContributorsmonthselection =5;
        this._LeadingReliableContributorsAllmonth();
      }
  }


  private _LeadingReliableContributors(colors: any,smonth?: string, emonth?: string) {

    this.apiService.GetDataWithToken('api/dashboard/LeadingReliableContributors?top=Top&sMonthyear='+smonth+'&eMonthyear='+emonth+'&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.LeadingReliableContributorsPublisher',res.data);
        this.LeadingReliableContributorsPublisher  = res.data;
        
        setTimeout(() => {
          this.__LeadingReliableContributors(colors,this.LeadingReliableContributorsPublisher)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private _LeadingReliableContributorsThreeMonth() {

    this.apiService.GetDataWithToken('api/dashboard/LeadingReliableContributors?top=Top&sMonthyear=jan 2024&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.LeadingReliableContributorsPublisher',res.data);
        this.LeadingReliableContributorsPublisher  = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__LeadingReliableContributors(c,this.LeadingReliableContributorsPublisher)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private _LeadingReliableContributorsSixMonth() {

    this.apiService.GetDataWithToken('api/dashboard/LeadingReliableContributors?top=Top&sMonthyear=oct 2023&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.LeadingReliableContributorsPublisher',res.data);
        this.LeadingReliableContributorsPublisher  = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__LeadingReliableContributors(c,this.LeadingReliableContributorsPublisher)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }


  private _LeadingReliableContributorsTwelvemonth() {

    this.apiService.GetDataWithToken('api/dashboard/LeadingReliableContributors?top=Top&sMonthyear=feb 2023&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.LeadingReliableContributorsPublisher',res.data);
        this.LeadingReliableContributorsPublisher  = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__LeadingReliableContributors(c,this.LeadingReliableContributorsPublisher)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }


  private _LeadingReliableContributorsAllmonth() {

    this.apiService.GetDataWithToken('api/dashboard/LeadingReliableContributors?top=Top&sMonthyear=jan 2023&eMonthyear=mar 2024&Publisher=Publisher')
    .subscribe(
      res => {
        console.log('this.LeadingReliableContributorsPublisher',res.data);
        this.LeadingReliableContributorsPublisher  = res.data;
        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        setTimeout(() => {
          this.__LeadingReliableContributors(c,this.LeadingReliableContributorsPublisher)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );

  }

  private __LeadingReliableContributors(colors: any,chartdata?: any)
  {
       this.UnderperformingPublishers =  chartdata;

      var resultPublisher = this.UnderperformingPublishers.map(function(a) {return a.publisherName;});
      console.log(resultPublisher);

      var resultcount = this.UnderperformingPublishers.map(function(a) {return a.count;});
      console.log(resultcount);

      colors = this.getChartColorsArray(colors);
    


      if(this.LeadingReliableContributorscharttype == 'pie')
      {
        this.Pyramid = {
          series: resultcount,
          chart: {
            height: 300,
            type: this.LeadingReliableContributorscharttype,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true,
            }
          },
          labels: resultPublisher,
          legend: {
            position: "bottom",
          },
          dataLabels: {
            dropShadow: {
              enabled: false,
            },
          },
          colors: colors,
        };
      }
      else if (this.LeadingReliableContributorscharttype == 'polarArea')
      {
        this.Pyramid = {
          series: resultcount,
      chart: {
        type: "polarArea",
        width: 400,
      },
      labels: resultPublisher,
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      legend: {
        position: "bottom",
      },
      colors: colors,
        };
      }
      else
      {

        this.Pyramid = {
        series: [{
          data:resultcount
        }
        ],
        chart: {
          type: this.LeadingReliableContributorscharttype,
          height: 300,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true,
          }
        },
        dataLabels: {
          enabled: false,
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: resultPublisher,
          tickPlacement: 'on',
          labels: {
            rotate: -45,
            rotateAlways: true,
          },
          axisBorder: {
            show: true,
            stroke: {
              width: 1
            },
          },
        },
        labels: resultPublisher,
        legend: {
          position: 'top',
        },
        fill: {
          opacity: 1
        },
        colors: colors,
        
      };
     

      }

      // this.Pyramid = {
      //   series: [
      //     {
      //       name: "",
      //       data: resultcount
      //     }
      //   ],
      //   chart: {
      //     type: "bar",
      //     height: 350
      //   },
      //   plotOptions: {
      //     bar: {
      //       borderRadius: 0,
      //       horizontal: true,
      //       distributed: true,
      //       barHeight: "80%",
      //       isFunnel: true
      //     }
      //   },
      //   colors:
      //     colors
      //   ,
      //   dataLabels: {
      //     enabled: true,
      //     formatter: function (val: any, opt: any) {
      //       return opt.w.globals.labels[opt.dataPointIndex];
      //     },
      //     dropShadow: {
      //       enabled: true
      //     }
      //   },
      //   title: {
      //     text: "Publisher",
      //     align: "center"
      //   },
      //   xaxis: {
      //     categories: resultPublisher
      //   },
      //   legend: {
      //     show: false
      //   }
      // };



      const attributeToMonitor = 'data-theme';
  
      const observer = new MutationObserver(() => {
        this.__LeadingReliableContributors('["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]');
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [attributeToMonitor]
      });


  }


  public _ConsistentlyPerformingcharttype(type: string)
  {
     console.log('chart type in value tab',type);
     if(this.ConsistentlyPerformingmonthselection == 1)
     {
       this.ConsistentlyPerformingcharttype=type;
       var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._ConsistentlyPerforming(c,this.previousMMYY,this.currentMMYY);
     }
     else if(this.ConsistentlyPerformingmonthselection == 2)
     {
      this.ConsistentlyPerformingcharttype=type;
       this._ConsistentlyPerformingYhreeMonth();
     }
     else if(this.ConsistentlyPerformingmonthselection == 3)
     {
      this.ConsistentlyPerformingcharttype=type;
       this._ConsistentlyPerformingSixMonth();
     }
     else if(this.ConsistentlyPerformingmonthselection == 4)
     {
      this.ConsistentlyPerformingcharttype=type;
       this._ConsistentlyPerformingTwelvemonth();
     }
     else
     {
      this.ConsistentlyPerformingcharttype=type;
       this._ConsistentlyPerformingAllmonth();
     }
  }

  public ConsistentlyPerformingcall(month : number)
  {

      if(month == 1)
      {
        this.ConsistentlyPerformingmonthselection =1;
        var d = new Date(new Date());
        //d.setFullYear(d.getFullYear() - 1);

        //console.log('current month:', this.MonthNames[d.getMonth()-1] + d.getMonth() );
        var year = new Date().getFullYear();
        var  previousmmyyyy = this.MonthNames[d.getMonth()-2] +' '+ (d.getFullYear() - 1);
        var  currentmmyyyy = this.MonthNames[d.getMonth()] +' '+ (d.getFullYear());
        this.currentMMYY = currentmmyyyy;
        this.previousMMYY = previousmmyyyy;

        var c = '["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
        this._ConsistentlyPerforming(c,this.previousMMYY,this.currentMMYY);
      }
      else if(month == 3)
      {
        this.ConsistentlyPerformingmonthselection =2;
         this._ConsistentlyPerformingYhreeMonth();
      }
      else if(month == 6)
      {
        this.ConsistentlyPerformingmonthselection =3;
         this._ConsistentlyPerformingSixMonth();
      }
      else if(month == 12)
      {
        this.ConsistentlyPerformingmonthselection =4;
         this._ConsistentlyPerformingTwelvemonth();
      }
      else
      {
        this.ConsistentlyPerformingmonthselection =5;
        this._ConsistentlyPerformingAllmonth();
      }
  }


  private _ConsistentlyPerforming(colors: any,smonth?: string, emonth?: string) {

   //{{ApiHostLocal}}/api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=Apr 2023&eMonthyear=Mar 2024&metric=Metric
   //kpi/dashboard/ConsistentlyPerforming?top=Top&sMonthyear='+smonth+'&eMonthyear='+emonth+'&metric=Metric
    this.apiService.GetDataWithToken('api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear='+smonth+'&eMonthyear='+emonth+'&metric=Metric')
    .subscribe(
      res => {
        console.log('this.ConsistentlyPerformingMetric',res.data);
        this.ConsistentlyPerformingMetric  = res.data;
        console.log(this.ConsistentlyPerformingMetric);
       
        setTimeout(() => {
          this.__ConsistentlyPerforming(colors,this.ConsistentlyPerformingMetric)
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );
  }

  
  private _ConsistentlyPerformingYhreeMonth() {

    //{{ApiHostLocal}}/api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=Apr 2023&eMonthyear=Mar 2024&metric=Metric
    //kpi/dashboard/ConsistentlyPerforming?top=Top&sMonthyear='+smonth+'&eMonthyear='+emonth+'&metric=Metric
     this.apiService.GetDataWithToken('api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=jan 2024&eMonthyear=mar 2024&metric=Metric')
     .subscribe(
       res => {
         console.log('this.ConsistentlyPerformingMetric',res.data);
         this.ConsistentlyPerformingMetric  = res.data;
         console.log(this.ConsistentlyPerformingMetric);
         var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
         setTimeout(() => {
           this.__ConsistentlyPerforming(c,this.ConsistentlyPerformingMetric)
           //console.log('local storage count is ' + sessionStorage.length);
         }, 1000);
       },
      
     );
   }

   
   
  private _ConsistentlyPerformingSixMonth() {

    //{{ApiHostLocal}}/api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=Apr 2023&eMonthyear=Mar 2024&metric=Metric
    //kpi/dashboard/ConsistentlyPerforming?top=Top&sMonthyear='+smonth+'&eMonthyear='+emonth+'&metric=Metric
     this.apiService.GetDataWithToken('api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=oct 2023&eMonthyear=mar 2024&metric=Metric')
     .subscribe(
       res => {
         console.log('this.ConsistentlyPerformingMetric',res.data);
         this.ConsistentlyPerformingMetric  = res.data;
         console.log(this.ConsistentlyPerformingMetric);
         var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
         setTimeout(() => {
           this.__ConsistentlyPerforming(c,this.ConsistentlyPerformingMetric)
           //console.log('local storage count is ' + sessionStorage.length);
         }, 1000);
       },
      
     );
   }

   
   
  private _ConsistentlyPerformingTwelvemonth() {

    //{{ApiHostLocal}}/api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=Apr 2023&eMonthyear=Mar 2024&metric=Metric
    //kpi/dashboard/ConsistentlyPerforming?top=Top&sMonthyear='+smonth+'&eMonthyear='+emonth+'&metric=Metric
     this.apiService.GetDataWithToken('api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=feb 2023&eMonthyear=mar 2024&metric=Metric')
     .subscribe(
       res => {
         console.log('this.ConsistentlyPerformingMetric',res.data);
         this.ConsistentlyPerformingMetric  = res.data;
         console.log(this.ConsistentlyPerformingMetric);
         var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
         setTimeout(() => {
           this.__ConsistentlyPerforming(c,this.ConsistentlyPerformingMetric)
           //console.log('local storage count is ' + sessionStorage.length);
         }, 1000);
       },
      
     );
   }

   
   
  private _ConsistentlyPerformingAllmonth() {

    //{{ApiHostLocal}}/api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=Apr 2023&eMonthyear=Mar 2024&metric=Metric
    //kpi/dashboard/ConsistentlyPerforming?top=Top&sMonthyear='+smonth+'&eMonthyear='+emonth+'&metric=Metric
     this.apiService.GetDataWithToken('api/dashboard/ConsistentlyPerforming?top=Top&sMonthyear=jan 2013&eMonthyear=mar 2024&metric=Metric')
     .subscribe(
       res => {
         console.log('this.ConsistentlyPerformingMetric',res.data);
         this.ConsistentlyPerformingMetric  = res.data;
         console.log(this.ConsistentlyPerformingMetric);
         var c = '["#008FFB","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]';
         setTimeout(() => {
           this.__ConsistentlyPerforming(c,this.ConsistentlyPerformingMetric)
           //console.log('local storage count is ' + sessionStorage.length);
         }, 1000);
       },
      
     );
   }
 


  private __ConsistentlyPerforming(colors: any,chartdata?: any)
  {
       this.UnderperformingPublishers =  chartdata;

      var resultMetrics = this.UnderperformingPublishers.map(function(a) {return a.metrics;});
      console.log(resultMetrics);

      var resultcount = this.UnderperformingPublishers.map(function(a) {return a.count;});
      console.log(resultcount);

      colors = this.getChartColorsArray(colors);
      
      // this.Funnel = {
      //   series: [
      //     {
      //       name: "Metrics Series",
      //       data: resultcount
      //     }
      //   ],
      //   chart: {
      //     type: "bar",
      //     height: 350
      //   },
      //   plotOptions: {
      //     bar: {
      //       borderRadius: 0,
      //       horizontal: true,
      //       barHeight: "80%",
      //       isFunnel: true
      //     }
      //   },
      //   colors: colors,
      //   dataLabels: {
      //     enabled: true,
      //     formatter: function (val: any, opt: any) {
      //       return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      //     },
      //     dropShadow: {
      //       enabled: true
      //     }
      //   },
      //   title: {
      //     text: "Metrics Series",
      //     align: "center"
      //   },
      //   xaxis: {
      //     categories: resultMetrics
      //   },
      //   legend: {
      //     show: false
      //   }
      // };

     
      // const attributeToMonitor = 'data-theme';
  
      // const observer = new MutationObserver(() => {
      //   this.__ConsistentlyPerforming('["#C8A6A9","#F6A8AE","#E4D58D","#CFBDF3","#118DFF","#1E81B0","#EAB676","#76B5C5","#ABDBE3","#BCEA91","#C8A6A9","#F5C4AF"]');
      // });
      // observer.observe(document.documentElement, {
      //   attributes: true,
      //   attributeFilter: [attributeToMonitor]
      // });


      if(this.ConsistentlyPerformingcharttype == 'pie')
      {
        this.simpleDonutChart = {
          series: resultcount,
          chart: {
            height: 300,
            type: this.ConsistentlyPerformingcharttype,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true,
            }
          },
          labels: resultMetrics,
          legend: {
            position: "bottom",
          },
          dataLabels: {
            dropShadow: {
              enabled: false,
            },
          },
          colors: colors,
        };
      }
      else if (this.ConsistentlyPerformingcharttype == 'polarArea')
      {
        this.simpleDonutChart = {
          series: resultcount,
      chart: {
        type: "polarArea",
        width: 400,
      },
      labels: resultMetrics,
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      legend: {
        position: "bottom",
      },
      colors: colors,
        };
      }
      else
      {

        this.simpleDonutChart = {
        series: [{
          data:resultcount
        }
        ],
        chart: {
          type: this.ConsistentlyPerformingcharttype,
          height: 300,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true,
          }
        },
        dataLabels: {
          enabled: false,
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: resultMetrics,
          tickPlacement: 'on',
          labels: {
            rotate: -45,
            rotateAlways: true,
          },
          axisBorder: {
            show: true,
            stroke: {
              width: 1
            },
          },
        },
        labels: resultMetrics,
        legend: {
          position: 'top',
        },
        fill: {
          opacity: 1
        },
        colors: colors,
        
      };
     

      }


      // this.simpleDonutChart = {
      //   series: resultcount,
      //   chart: {
      //     height: 300,
      //     type: "donut",
      //   },
      //   labels: resultMetrics,
      //   legend: {
      //     position: "bottom",
      //   },
      //   dataLabels: {
      //     dropShadow: {
      //       enabled: false,
      //     },
      //   },
      //   colors: colors,
      // };
  
      
      const attributeToMonitor = 'data-theme';
  
      const observer = new MutationObserver(() => {
        this._simpleDonutChart('["#C8A6A9", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [attributeToMonitor]
      });

      


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
  /**
  * Simple Donut Chart
  */
  private _simpleDonutChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.simpleDonutChart = {
      series: [44, 55, 41, 17, 15],
      chart: {
        height: 300,
        type: "donut",
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: colors,
    };

    
    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._simpleDonutChart('["#C8A6A9", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

   /**
  * Line, Column & Area Charts
  */
   private _lineColumnAreaChart(colors: any,chartdata ?: any) {
   

    this.BiReportList = chartdata;
    
    //console.log(this.BiReportList);

    var result = this.BiReportList.map(function(a) {return a.monthYear;});

    //console.log(result);

    let monthYearPushArray = [];
for(let i = 0; i < result.length ; i++){
  if(monthYearPushArray.indexOf(result[i]) === -1) {
    monthYearPushArray.push(result[i]);
  } else {
    //console.log(`${result[i]} is already pushed into array`);
  }
}

//console.log('Final monthYear Array: ', monthYearPushArray)


var resultpublisherName = this.BiReportList.map(function(a) {return a.publisherName;});

console.log(resultpublisherName);

let publisherNamePushArray = [];
for(let i = 0; i < resultpublisherName.length ; i++){
if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
  publisherNamePushArray.push(resultpublisherName[i]);
} else {
//console.log(`${result[i]} is already pushed into array`);
}
}

//console.log('Final publisherName Array: ', publisherNamePushArray)


var resultmetrics = this.BiReportList.map(function(a) {return a.metrics;});

//console.log(resultmetrics);

let metricsPushArray = [];
for(let i = 0; i < resultmetrics.length ; i++){
if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
  metricsPushArray.push(resultmetrics[i]);
} else {
//console.log(`${result[i]} is already pushed into array`);
}
}

//console.log('Final metrics Array: ', metricsPushArray)

var targetnums:number[] = []; 
for(let m=0; m < metricsPushArray.length; m++)
{
       var nums:number[] = [];
         // schedule
       var metrics = metricsPushArray[m];
       //console.log('metrics:',metrics);
       for(let p = 0; p < publisherNamePushArray.length ; p++)
       {
            var publisherName = publisherNamePushArray[p];
            var ddddd =   this.BiReportList.filter(person => person.metrics == metrics && person.publisherName == publisherName);
            
            if(ddddd.length == 0)
            {
              for(let my=0; my< monthYearPushArray.length; my++)
              {
                nums.push(0);
                //targetnums.push(0);
              }
            }
            else
            {
              for(let b = 0;  b <ddddd.length; b++)
              {
                        var dd = ddddd[b].actual;
                        ///var tardd = ddddd[b].target;
                        //let data = { dd  }
                        nums.push(dd);
                        //targetnums.push(tardd);
              }
            }
       }
       
        var _ddddd =   this.BiReportList.filter(person => person.metrics == metrics );
        ///var tar =   _ddddd[0];
           //console.log("metricsPushArray[m]:-",_ddddd);
           //targetnums.push(tar.target);

        let modifiedMonth = { name: metricsPushArray[m], type: "column",data:nums };
        //console.log(modifiedMonth);
        this.series.push(modifiedMonth);

   
}

for(let m=0; m < metricsPushArray.length; m++)
{
  var _metrics = metricsPushArray[m];
  for(let my=0; my< monthYearPushArray.length; my++)
  {
    var _my = monthYearPushArray[my];
    var _ddddd =   this.BiReportList.filter(person => person.metrics == _metrics && person.monthYear == _my);
    targetnums.push(_ddddd[0].target);
  }
}

console.log('all target:',targetnums);
let targetall = { name: "Target", type: "line",data:targetnums };

this.series.push(targetall);


console.log('series:',this.series);  

for(let p = 0; p < publisherNamePushArray.length ; p++)
{
  let modifiedgroups = { title: publisherNamePushArray[p], cols:  monthYearPushArray.length };
      for(let my=0; my< monthYearPushArray.length; my++)
      {
        this.categories.push(monthYearPushArray[my]);
      }
      console.log(this.categories);
      this.groups.push(modifiedgroups)

      console.log(this.groups);
}


    colors = this.getChartColorsArray(colors);
    this.lineColumnAreaChart = {
      series: this.series,
      chart: {
        height: 350,
        type: 'bar',
        stacked: false,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true
        },
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      fill: {
        opacity: [0.65, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'category',
        categories: this.categories,
        group: {
          style: {
            fontSize: '10px',
            fontWeight: 750
          },
          groups: this.groups
        }
      },
      yaxis: {
        title: {
          text: 'Points',
        },
        min: 0
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0)  + " points";
            }
            return y;

          }
        }
      },
      colors: colors
    };

    
    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._lineColumnAreaChart('["#ABDBE3", "#76B5C5", "#EAB676","#1E81B0","#E8A2CF","#CFBDF3","#E4D58D","#F6A8AE","#C8A6A9"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }



  getKPIData(): void {



    //this.getKPIConfigData();
    this.apiService.GetDataWithToken('User/KPIDataDisplaybyConfig').subscribe(
      (kpiList) => {
        this.dataSource  = kpiList.data;
        this.products = kpiList.data;
        console.log('KPI',this.products);
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
        //console.log(this.products);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  
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
   
  return this.selectedPublisher.length === 0 || this.selectedPublisher.includes(item.acronym);
    
  
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
  
  handleRowClick(event: Event, row: any) {
    // Check if the click was on the checkbox
    const checkboxClicked = (event.target as HTMLElement).tagName === 'INPUT';
  
    if (!checkboxClicked) {
      // If the click was not on the checkbox, handle row click
      this.onRowClick(row);
    }
  }
  
  isSelected(item: any): boolean {
    return this.selectedRows.has(item);
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
  
  
applyPagination() {
  this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
  this.endIndex = this.currentPage * this.itemsPerPage;
  //console.log(this.startIndex);
  //console.log(this.endIndex);
  this.dataSource = this.dataSource.slice(this.startIndex, this.endIndex);
  //console.log(this.dataSource.slice(this.startIndex, this.endIndex));
}

onPerPageChange(event : any) {
  // this.page = 1; // Reset to the first page when changing items per page
  // this.getKPIData();
  console.log(event.target.value);
  this.pageSize = event.target.value;
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

getKPIConfigData(): void {
  this.apiService.GetDataWithToken('PublisherConfig/Display').subscribe(
    (Response) => {
      this.kpiConfigList = Response.data;
      //this.calculatePages();
      console.log('kpiConfigList data:',this.kpiConfigList);
    },
    (error) => {
      console.error('Error:', error);
    }
  );

}
  
findpublisher(publisher: string): any[] {
  return  this.kpiConfigList.filter(p => p.publisherName.contains(publisher));
}

chart: any;
  // Render All chart when Change Tab
  renderCharts(charts: any) {
    if (charts === '1') {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalrevenueChart);
    } else if (charts === '2') {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalincomeChart);
    } else if (charts === '3') {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.propertysaleChart);
    } else {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.propetryrentChart);
    }
  }


  private _totalrevenueChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.totalrevenueChart = {
      series: [{
        name: 'Income',
        data: [26, 24.65, 18.24, 29.02, 23.65, 27, 21.18, 24.65, 27.32, 25, 24.65, 29.32]
      }],
      chart: {
        type: 'bar',
        height: 328,
        stacked: true,
        toolbar: {
          show: false
        },
        redrawOnParentResize: true
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          lineCap: 'round',
          borderRadiusOnAllStackedSeries: true
        },
      },
      grid: {
        padding: {
          left: 0,
          right: 0,
          top: -15,
          bottom: -15
        }
      },
      colors: colors,
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: false,
        textAnchor: 'top',
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (y: any) {
            return y.toFixed(0) + "k";
          }
        },
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'right',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          rotate: -90
        },
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          stroke: {
            width: 1
          },
        },
      }
    }
    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._totalrevenueChart('["#C8A6A9"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }


  /**
  * Total Income Charts
  */
  private _totalincomeChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.totalincomeChart = {
      series: [{
        name: "Income",
        data: [32, 18, 13, 17, 26, 34, 47, 51, 59, 63, 44, 38, 53, 69, 72, 83, 90, 110, 130, 117, 103, 92, 95, 119, 80, 96, 116, 125]
      }],
      chart: {
        height: 328,
        type: 'line',
        toolbar: {
          show: false
        },
        redrawOnParentResize: true
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 4
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: colors,
      xaxis: {
        type: 'datetime',
        categories: ['02/01/2023 GMT', '02/02/2023 GMT', '02/03/2023 GMT', '02/04/2023 GMT',
          '02/05/2023 GMT', '02/06/2023 GMT', '02/07/2023 GMT', '02/08/2023 GMT', '02/09/2023 GMT', '02/10/2023 GMT', '02/11/2023 GMT', '02/12/2023 GMT', '02/13/2023 GMT',
          '02/14/2023 GMT', '02/15/2023 GMT', '02/16/2023 GMT', '02/17/2023 GMT', '02/18/2023 GMT', '02/19/2023 GMT', '02/20/2023 GMT', '02/21/2023 GMT', '02/22/2023 GMT',
          '02/23/2023 GMT', '02/24/2023 GMT', '02/25/2023 GMT', '02/26/2023 GMT', '02/27/2023 GMT', '02/28/2023 GMT'
        ]
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (y: any) {
            return "$" + y.toFixed(0);
          }
        },
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._totalincomeChart('["--tb-success"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

    /**
* Property Type Charts
*/
private _propertysaleChart(colors: any) {
  colors = this.getChartColorsArray(colors);
  this.propertysaleChart = {
    series: [{
      name: "Property Rent",
      data: [30, 57, 25, 33, 20, 27, 38, 49, 42, 58, 33, 46, 40, 34, 41, 53, 19, 23, 36, 52, 58, 43]
    }],
    chart: {
      height: 328,
      type: 'bar',
      toolbar: {
        show: false,
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '30%',
        distributed: true,
        borderRadius: 5,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      type: 'datetime',
      categories: ['01/01/2023 GMT', '01/02/2023 GMT', '01/03/2023 GMT', '01/04/2023 GMT',
        '01/05/2023 GMT', '01/06/2023 GMT', '01/07/2023 GMT', '01/08/2023 GMT', '01/09/2023 GMT', '01/10/2023 GMT', '01/11/2023 GMT', '01/12/2023 GMT', '01/13/2023 GMT',
        '01/14/2023 GMT', '01/15/2023 GMT', '01/16/2023 GMT', '01/17/2023 GMT', '01/18/2023 GMT', '01/19/2023 GMT', '01/20/2023 GMT', '01/21/2023 GMT', '01/22/2023 GMT'
      ],
    }
  }

  // const attributeToMonitor = 'data-theme';

  // const observer = new MutationObserver(() => {
  //   this._propertysaleChart('["--tb-danger"]');
  // });
  // observer.observe(document.documentElement, {
  //   attributes: true,
  //   attributeFilter: [attributeToMonitor]
  // });
}

 /**
* Property Type Charts
*/
private _propetryrentChart(colors: any) {
  colors = this.getChartColorsArray(colors);
  this.propetryrentChart = {
    series: [{
      name: 'Property Rent',
      data: [31, 40, 28, 43, 59, 87, 75, 60, 51, 66, 109, 100]
    }],
    chart: {
      height: 328,
      type: 'area',
      toolbar: {
        show: false
      }
    },
    fill: {
      opacity: "0.01",
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    colors: colors,
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        rotate: -90
      },
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        stroke: {
          width: 1
        },
      },
    }
  }

  // const attributeToMonitor = 'data-theme';

  // const observer = new MutationObserver(() => {
  //   this._propetryrentChart('["--tb-info"]');
  // });
  // observer.observe(document.documentElement, {
  //   attributes: true,
  //   attributeFilter: [attributeToMonitor]
  // });
}


/**
* Clicks Charts
*/
private _clicksChartnew(colors: any, _actualdata?:  any , _targetdata?: any ,_publishernamenew?: any ) {
  console.log('aggreget data:',_actualdata);
  console.log('aggreget target data:',_targetdata);
  console.log('aggreget publisher data:',_publishernamenew);
  colors = this.getChartColorsArray(colors);
  this.clicksChart = {
    series: [{
      name: 'Actual',
      data: _actualdata
      
    },
    {
      "name": "Target",
      "data": _targetdata
    }],
    chart: {
      type: this.chartaggregatetype,
      height: 383,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: _publishernamenew,
      tickPlacement: 'on',
      labels: {
        rotate: -35,
        rotateAlways: true,
      },
      axisBorder: {
        show: true,
        stroke: {
          width: 1
        },
      },
    },
    legend: {
      position: 'top',
    },
    fill: {
      opacity: 1
    },
    colors: colors,
  }

  const attributeToMonitor = 'data-theme';

  const observer = new MutationObserver(() => {
    this._clicksChartnew('["#C8A6A9", "#F6A8AE"]');
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [attributeToMonitor]
  });
}



 /**
* Page Overview Charts
* 
*/




private _pageoverviewChartnewvaluefirstmonth(colors: any, _actualdata?:  any , _targetdata?: any ,_publishernamenew?: any ) {
 console.log('in chart method data check 1',_actualdata);
 console.log('in chart method target check 1',_targetdata);
 //console.log('in chart method data check 2',_publishernamenew);
console.log('chart type in one month result:',this.charttype);
console.log('in method', colors);
  colors = this.getChartColorsArray(colors);
  this.pageoverviewChart = {
    series: [{
      name: 'Actual',
      data:_actualdata
    },{
      name: 'Target',
      data:_targetdata
    }
    ],
    chart: {
      type: this.charttype,
      height: 500,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true,
      }
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    xaxis: {
      categories: _publishernamenew,
      tickPlacement: 'on',
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
      axisBorder: {
        show: true,
        stroke: {
          width: 1
        },
      },
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.2
      },
      borderColor: '#f1f1f1'
    },
    legend: {
      position: 'top',
    },
    fill: {
      opacity: 1
    },
    colors: colors,
    
  }
  const attributeToMonitor = 'data-theme';

  const observer = new MutationObserver(() => {
    this._pageoverviewChartnewvaluefirstmonth('["#C8A6A9", "#F6A8AE"]');
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [attributeToMonitor]
  });

}

// private _pageoverviewChartnewvaluetwomonth(colors: any, _actualdata?:  any , _publishernamenew?: any ) {
//   console.log('in chart method data check 1',_actualdata);
//   console.log('in chart method data check 2',_publishernamenew);
 
//    colors = this.getChartColorsArray(colors);
//    this.pageoverviewChart = {
//      series: [{
//        name: 'Actual',
//        data:[
//          "98.00",
//          "88.50",
//          "75.75",
//          "69.00",
//          "100.00",
//          "53.00",
//          "62.33",
//          "87.00",
//          "87.00"
//        ]
//      }
//      ],
//      chart: {
//        type: this.charttype,
//        height: 373,
//        stacked: true,
//        toolbar: {
//          show: true
//        },
//        zoom: {
//          enabled: true
//        },
//      },
//      stroke: {
//        width: 5,
//        colors: "#000",
//        lineCap: 'round',
//      },
//      plotOptions: {
//        bar: {
//          columnWidth: '25%',
//          borderRadius: 5,
//          lineCap: 'round',
//          borderRadiusOnAllStackedSeries: true
 
//        },
//      },
//      colors: colors,
//      fill: {
//        opacity: 1
//      },
//      dataLabels: {
//        enabled: false,
//        textAnchor: 'top',
//      },
//      legend: {
//        show: true,
//        position: 'top',
//        horizontalAlign: 'center',
//      },
//      xaxis: {
//        categories: [
//          "APA",
//          "APS",
//          "ASCE",
//          "ASME",
//          "BioRxiv",
//          "OUP",
//          "RSC",
//          "SAGE",
//          "SFN"
//        ],
//        labels: {
//          rotate: -90
//        },
//        axisTicks: {
//          show: true,
//        },
//        axisBorder: {
//          show: true,
//          stroke: {
//            width: 1
//          },
//        },
//      },
//      responsive: [
//        {
//          breakpoint: 992,
//          options: {
//            plotOptions: {
//              bar: {
//                columnWidth: '50px',
//              }
//            },
//          }
//        },
//        {
//          breakpoint: 600,
//          options: {
//            plotOptions: {
//              bar: {
//                columnWidth: '70px',
//              }
//            },
//          }
//        }
//      ]
//    }
//    const attributeToMonitor = 'data-theme';
 
//    const observer = new MutationObserver(() => {
//      this._pageoverviewChart('["#C8A6A9", "#F6A8AE"]');
//    });
//    observer.observe(document.documentElement, {
//      attributes: true,
//      attributeFilter: [attributeToMonitor]
//    });
 
//  }
 
 valuetwomonthdatacall()
 {
    // this._pageoverviewChartnewvaluetwomonth('["#C8A6A9", "#F6A8AE"]');
 }


aggrigettwomonthcall()
{
  this._clicksChartnewtwomonth('["#C8A6A9", "#F6A8AE"]');
}


// aggrigetonemonthcall()
// {
//   this._clicksChartnew('["#F6A8AE", "#C8A6A9"]');
// }

// AggregatechangeWebsite(e : any) {


//   if(this.valuemonthselection == 1)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.Onemonthvaluedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.Onemonthvaluedata.map(function(a) {return a.data;});
//     var _targetvalue = this.Onemonthvaluedata.map(function(a) {return a.targetvalue;});
//     this.charttype=e.target.value;
//     this._pageoverviewChartnewvaluefirstmonth('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue,_publisherName);
    
//   }
//   else if(this.valuemonthselection == 2)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.threemonthvaluedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.threemonthvaluedata.map(function(a) {return a.data;});
//     var _targetvalue = this.threemonthvaluedata.map(function(a) {return a.targetvalue;});
//     this.charttype=e.target.value;
//     this._pageoverviewChartnewvaluefirstmonth('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue,_publisherName);
//   }
//   else if(this.valuemonthselection == 3)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
//     var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
//     this.charttype=e.target.value;
//     this._pageoverviewChartnewvaluefirstmonth('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue,_publisherName);
//   }
//   else if(this.valuemonthselection == 4)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.twelvemonthvaluedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.twelvemonthvaluedata.map(function(a) {return a.data;});
//     var _targetvalue = this.twelvemonthvaluedata.map(function(a) {return a.targetvalue;});
//     this.charttype=e.target.value;
//     this._pageoverviewChartnewvaluefirstmonth('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue,_publisherName);
//   }
//   else
//   {
//     console.log(e.target.value);
//     var _publisherName = this.allmonthvaluedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.allmonthvaluedata.map(function(a) {return a.data;});
//     var _targetvalue = this.allmonthvaluedata.map(function(a) {return a.targetvalue;});
//     this.charttype=e.target.value;
//     this._pageoverviewChartnewvaluefirstmonth('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue,_publisherName);
//   }
// }

public Valuecharttype(type: string)
  {
     console.log('chart type in value tab',type);
     if(this.valuemonthselection == 1)
     {
       var _publisherName = this.Onemonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.Onemonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.Onemonthvaluedata.map(function(a) {return a.targetvalue;});
       this.charttype=type;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
       
     }
     else if(this.valuemonthselection == 2)
     {
       var _publisherName = this.threemonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.threemonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.threemonthvaluedata.map(function(a) {return a.targetvalue;});
       this.charttype=type;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
       var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
       this.charttype=type;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {
       var _publisherName = this.twelvemonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.twelvemonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.twelvemonthvaluedata.map(function(a) {return a.targetvalue;});
       this.charttype=type;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
       var _publisherName = this.allmonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.allmonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.allmonthvaluedata.map(function(a) {return a.targetvalue;});
       this.charttype=type;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
  }



public Aggregatecharttype(type: string)
{
  console.log('chart type in Aggregate tab',type);
  if(this.aggregatemonthselection == 1)
  {
    var _publisherName = this.Onemonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.Onemonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.Onemonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.chartaggregatetype =type;
    var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    
  }
  else if(this.aggregatemonthselection == 2)
  {
    var _publisherName = this.threemonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.threemonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.threemonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.chartaggregatetype =type;
    var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }
  else if(this.aggregatemonthselection == 3)
  {
    var _publisherName = this.sixmonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.sixmonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.sixmonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.chartaggregatetype =type;
    var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }
  else if(this.aggregatemonthselection == 4)
  {
    var _publisherName = this.twelvemonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.twelvemonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.twelvemonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.chartaggregatetype =type;
    var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }
  else
  {
    var _publisherName = this.allmonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.allmonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.allmonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.chartaggregatetype =type;
    var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }

}  



public Publisherascending()
{
  this.sortValue = "Publisher ascending";
    if(this.currentTab == "pageViews")
    {
       if(this.valuemonthselection == 1)
       {

        var Sorderdata = this.Onemonthvaluedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA < typeB)
            //sort string ascending
            return -1;
          if (typeA > typeB) return 1;
          return 0; //default return value (no sorting)
        });

        //console.log('sorted:', _publisherName);
        var  _publisherName= Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
       }
       else if(this.valuemonthselection == 2)
     {
      // var Sorderdata =  this.threemonthvaluedata.sort((a, b) => {
      //   return a.targetvalue - b.targetvalue;
      // });

      var Sorderdata = this.threemonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA < typeB)
          //sort string ascending
          return -1;
        if (typeA > typeB) return 1;
        return 0; //default return value (no sorting)
      });

       var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
      // var Sorderdata =  this.sixmonthvaluedata.sort((a, b) => {
      //   return a.targetvalue - b.targetvalue;
      // });

      var Sorderdata = this.sixmonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA < typeB)
          //sort string ascending
          return -1;
        if (typeA > typeB) return 1;
        return 0; //default return value (no sorting)
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {

      var Sorderdata = this.twelvemonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA < typeB)
          //sort string ascending
          return -1;
        if (typeA > typeB) return 1;
        return 0; //default return value (no sorting)
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
      
      var Sorderdata = this.allmonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA < typeB)
          //sort string ascending
          return -1;
        if (typeA > typeB) return 1;
        return 0; //default return value (no sorting)
      });
      
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }

    }
    else if(this.currentTab == "Clicks")
    {
      if(this.aggregatemonthselection == 1)
      {
  

        var Sorderdata = this.Onemonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA < typeB)
            //sort string ascending
            return -1;
          if (typeA > typeB) return 1;
          return 0; //default return value (no sorting)
        });

        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
        
      }
      else if(this.aggregatemonthselection == 2)
      {
        
       
        var Sorderdata = this.threemonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA < typeB)
            //sort string ascending
            return -1;
          if (typeA > typeB) return 1;
          return 0; //default return value (no sorting)
        });
  
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
      else if(this.aggregatemonthselection == 3)
      {
  
      
        
        var Sorderdata = this.sixmonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA < typeB)
            //sort string ascending
            return -1;
          if (typeA > typeB) return 1;
          return 0; //default return value (no sorting)
        });
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
      else if(this.aggregatemonthselection == 4)
      {
       

        var Sorderdata = this.twelvemonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA < typeB)
            //sort string ascending
            return -1;
          if (typeA > typeB) return 1;
          return 0; //default return value (no sorting)
        });
  
  
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
      else
      {
  
          var Sorderdata = this.allmonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA < typeB)
            //sort string ascending
            return -1;
          if (typeA > typeB) return 1;
          return 0; //default return value (no sorting)
        });
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
    }
}


public Publisherdescending()
{
  this.sortValue = "Publisher descending";
    if(this.currentTab == "pageViews")
    {
       if(this.valuemonthselection == 1)
       {

        var Sorderdata = this.Onemonthvaluedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA > typeB)
            //sort string ascending
            return -1;
          if (typeA < typeB) return 1;
          return 0; //default return value (no sorting)
        });

        //console.log('sorted:', _publisherName);
        var  _publisherName= Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
       }
       else if(this.valuemonthselection == 2)
     {
      // var Sorderdata =  this.threemonthvaluedata.sort((a, b) => {
      //   return a.targetvalue - b.targetvalue;
      // });

      var Sorderdata = this.threemonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA > typeB)
          //sort string ascending
          return -1;
        if (typeA < typeB) return 1;
        return 0; //default return value (no sorting)
      });

       var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
      // var Sorderdata =  this.sixmonthvaluedata.sort((a, b) => {
      //   return a.targetvalue - b.targetvalue;
      // });

      var Sorderdata = this.sixmonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA > typeB)
          //sort string ascending
          return -1;
        if (typeA < typeB) return 1;
        return 0; //default return value (no sorting)
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {

      var Sorderdata = this.twelvemonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA > typeB)
          //sort string ascending
          return -1;
        if (typeA < typeB) return 1;
        return 0; //default return value (no sorting)
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
      
      var Sorderdata = this.allmonthvaluedata.sort((a, b) => {
        var typeA = a.publishername.toLowerCase(),
          typeB = b.publishername.toLowerCase();
        if (typeA > typeB)
          //sort string ascending
          return -1;
        if (typeA < typeB) return 1;
        return 0; //default return value (no sorting)
      });
      
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }

    }
    else if(this.currentTab == "Clicks")
    {
      if(this.aggregatemonthselection == 1)
      {
  

        var Sorderdata = this.Onemonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA > typeB)
            //sort string ascending
            return -1;
          if (typeA < typeB) return 1;
          return 0; //default return value (no sorting)
        });

        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
        
      }
      else if(this.aggregatemonthselection == 2)
      {
        
       
        var Sorderdata = this.threemonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA > typeB)
            //sort string ascending
            return -1;
          if (typeA < typeB) return 1;
          return 0; //default return value (no sorting)
        });
  
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
      else if(this.aggregatemonthselection == 3)
      {
  
      
        
        var Sorderdata = this.sixmonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA > typeB)
            //sort string ascending
            return -1;
          if (typeA < typeB) return 1;
          return 0; //default return value (no sorting)
        });
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
      else if(this.aggregatemonthselection == 4)
      {
       

        var Sorderdata = this.twelvemonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA > typeB)
            //sort string ascending
            return -1;
          if (typeA < typeB) return 1;
          return 0; //default return value (no sorting)
        });
  
  
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
      else
      {
  
          var Sorderdata = this.allmonthaggregatedata.sort((a, b) => {
          var typeA = a.publishername.toLowerCase(),
            typeB = b.publishername.toLowerCase();
          if (typeA > typeB)
            //sort string ascending
            return -1;
          if (typeA < typeB) return 1;
          return 0; //default return value (no sorting)
        });
        var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
        var _resultvalue = Sorderdata.map(function(a) {return a.data;});
        var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
    }
    
}

public Targetascending()
{
  this.sortValue = "Target ascending";
  if(this.currentTab == "pageViews")
  {
     if(this.valuemonthselection == 1)
     {

      var Sorderdata =  this.Onemonthvaluedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });

      var  _publisherName= Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 2)
     {
      var Sorderdata =  this.threemonthvaluedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });

       var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
      var Sorderdata =  this.sixmonthvaluedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {

      var Sorderdata =  this.twelvemonthvaluedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
      var Sorderdata =  this.allmonthvaluedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });
      
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }

  }
  else if(this.currentTab == "Clicks")
  {
    if(this.aggregatemonthselection == 1)
    {

      var Sorderdata =  this.Onemonthaggregatedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      
    }
    else if(this.aggregatemonthselection == 2)
    {
      
      var Sorderdata =  this.threemonthaggregatedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 3)
    {

      var Sorderdata =  this.sixmonthaggregatedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 4)
    {
      var Sorderdata =  this.twelvemonthaggregatedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });


      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else
    {

      var Sorderdata =  this.allmonthaggregatedata.sort((a, b) => {
        return a.targetvalue - b.targetvalue;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
  }
}


public Targetdescending()
{
  this.sortValue = "Target descending";
  if(this.currentTab == "pageViews")
  {
     if(this.valuemonthselection == 1)
     {

      var Sorderdata =  this.Onemonthvaluedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });

      var  _publisherName= Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 2)
     {
      var Sorderdata =  this.threemonthvaluedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });

       var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
      var Sorderdata =  this.sixmonthvaluedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {

      var Sorderdata =  this.twelvemonthvaluedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
      var Sorderdata =  this.allmonthvaluedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });
      
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }

  }
  else if(this.currentTab == "Clicks")
  {
    if(this.aggregatemonthselection == 1)
    {

      var Sorderdata =  this.Onemonthaggregatedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      
    }
    else if(this.aggregatemonthselection == 2)
    {
      
      var Sorderdata =  this.threemonthaggregatedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 3)
    {

      var Sorderdata =  this.sixmonthaggregatedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 4)
    {
      var Sorderdata =  this.twelvemonthaggregatedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });


      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else
    {
      var Sorderdata =  this.allmonthaggregatedata.sort((a, b) => {
        return b.targetvalue - a.targetvalue;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
  }
}

public Actualascending()
{
  this.sortValue = "Actual ascending";
  if(this.currentTab == "pageViews")
  {
     if(this.valuemonthselection == 1)
     {

      var Sorderdata =  this.Onemonthvaluedata.sort((a, b) => {
        return a.data - b.data;
      });

      var  _publisherName= Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 2)
     {
      var Sorderdata =  this.threemonthvaluedata.sort((a, b) => {
        return a.data - b.data;
      });

       var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
      var Sorderdata =  this.sixmonthvaluedata.sort((a, b) => {
        return a.data - b.data;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {

      var Sorderdata =  this.twelvemonthvaluedata.sort((a, b) => {
        return a.data - b.data;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
      var Sorderdata =  this.allmonthvaluedata.sort((a, b) => {
        return a.data - b.data;
      });
      
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
  }
  else if(this.currentTab == "Clicks")
  {
    if(this.aggregatemonthselection == 1)
    {

      var Sorderdata =  this.Onemonthaggregatedata.sort((a, b) => {
        return a.data - b.data;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      
    }
    else if(this.aggregatemonthselection == 2)
    {
      
      var Sorderdata =  this.threemonthaggregatedata.sort((a, b) => {
        return a.data - b.data;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 3)
    {

      var Sorderdata =  this.sixmonthaggregatedata.sort((a, b) => {
        return a.data - b.data;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 4)
    {
      var Sorderdata =  this.twelvemonthaggregatedata.sort((a, b) => {
        return a.data - b.data;
      });


      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else
    {

      var Sorderdata =  this.allmonthaggregatedata.sort((a, b) => {
        return a.data - b.data;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
  }
}

public Actualdescending()
{
  this.sortValue = "Actual descending";
  if(this.currentTab == "pageViews")
  {
     if(this.valuemonthselection == 1)
     {

      var Sorderdata =  this.Onemonthvaluedata.sort((a, b) => {
        return b.data - a.data;
      });

      var  _publisherName= Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 2)
     {
      var Sorderdata =  this.threemonthvaluedata.sort((a, b) => {
        return b.data - a.data;
      });

       var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
      var Sorderdata =  this.sixmonthvaluedata.sort((a, b) => {
        return b.data - a.data;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
       var _resultvalue = Sorderdata.map(function(a) {return a.data;});
       var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {

      var Sorderdata =  this.twelvemonthvaluedata.sort((a, b) => {
        return b.data - a.data;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
      var Sorderdata =  this.allmonthvaluedata.sort((a, b) => {
        return b.data - a.data;
      });
      
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
   

  }
  else if(this.currentTab == "Clicks")
  {
    if(this.aggregatemonthselection == 1)
    {

      var Sorderdata =  this.Onemonthaggregatedata.sort((a, b) => {
        return b.data - a.data;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      
    }
    else if(this.aggregatemonthselection == 2)
    {
      
      var Sorderdata =  this.threemonthaggregatedata.sort((a, b) => {
        return b.data - a.data;
      });

      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 3)
    {

      var Sorderdata =  this.sixmonthaggregatedata.sort((a, b) => {
        return b.data - a.data;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 4)
    {
      var Sorderdata =  this.twelvemonthaggregatedata.sort((a, b) => {
        return b.data - a.data;
      });


      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else
    {

      var Sorderdata =  this.allmonthaggregatedata.sort((a, b) => {
        return b.data - a.data;
      });
      var _publisherName = Sorderdata.map(function(a) {return a.publishername;});
      var _resultvalue = Sorderdata.map(function(a) {return a.data;});
      var _targetvalue = Sorderdata.map(function(a) {return a.targetvalue;});
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
  }
}

// Valuechangechart(e: any)
// {

//   //console.log(e.target.value);

//   if(this.aggregatemonthselection == 1)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.Onemonthaggregatedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.Onemonthaggregatedata.map(function(a) {return a.data;});
//     var _targetvalue = this.Onemonthaggregatedata.map(function(a) {return a.targetvalue;});
//     this.chartaggregatetype =e.target.value;
//     this._clicksChartnew('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue ,_publisherName); 
    
//   }
//   else if(this.aggregatemonthselection == 2)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.threemonthaggregatedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.threemonthaggregatedata.map(function(a) {return a.data;});
//     var _targetvalue = this.threemonthaggregatedata.map(function(a) {return a.targetvalue;});
//     this.chartaggregatetype =e.target.value;
//     this._clicksChartnew('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue ,_publisherName); 
//   }
//   else if(this.aggregatemonthselection == 3)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.sixmonthaggregatedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.sixmonthaggregatedata.map(function(a) {return a.data;});
//     var _targetvalue = this.sixmonthaggregatedata.map(function(a) {return a.targetvalue;});
//     this.chartaggregatetype =e.target.value;
//     this._clicksChartnew('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue ,_publisherName); 
//   }
//   else if(this.aggregatemonthselection == 4)
//   {
//     console.log(e.target.value);
//     var _publisherName = this.twelvemonthaggregatedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.twelvemonthaggregatedata.map(function(a) {return a.data;});
//     var _targetvalue = this.twelvemonthaggregatedata.map(function(a) {return a.targetvalue;});
//     this.chartaggregatetype =e.target.value;
//     this._clicksChartnew('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue ,_publisherName); 
//   }
//   else
//   {
//     console.log(e.target.value);
//     var _publisherName = this.allmonthaggregatedata.map(function(a) {return a.publishername;});
//     var _resultvalue = this.allmonthaggregatedata.map(function(a) {return a.data;});
//     var _targetvalue = this.allmonthaggregatedata.map(function(a) {return a.targetvalue;});
//     this.chartaggregatetype =e.target.value;
//     this._clicksChartnew('["#C8A6A9", "#F6A8AE"]',_resultvalue,_targetvalue ,_publisherName); 
//   }


// }


private _clicksChartnewtwomonth(colors: any) {
  colors = this.getChartColorsArray(colors);
  this.clicksChart = {
    series: [{
      name: 'Actual',
      data: 
      [
        "98.00",
        "88.75",
        "77.00",
        "69.83",
        "100.00",
        "63.00",
        "62.50",
        "91.25",
        "80.00"
      ]
    },
    {
    "name": "Target",
    "type": "line",
    "data": [
      99,
      99,
      99,
      99,
      18,
      80,
      0,
      2,
      99,
      99
    ]
  }],
    chart: {
      type: this.chartaggregatetype,
      height: 373,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      },
    },
    stroke: {
      width: 3,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    xaxis: {
      categories: [
        "APA",
        "APS",
        "ASCE",
        "ASME",
        "BioRxiv",
        "OUP",
        "RSC",
        "SAGE",
        "SFN"
      ],
    },
    legend: {
      position: 'top',
    },
    fill: {
      opacity: 1
    },
    colors: colors,
  }

  const attributeToMonitor = 'data-theme';

  const observer = new MutationObserver(() => {
    this._clicksChartnewtwomonth('["#C8A6A9", "#F6A8AE"]');
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [attributeToMonitor]
  });
}

/**
* Column Charts
*/
private _columnChartnew(colors: any) {
  colors = this.getChartColorsArray(colors);
  this.columnChart = {
    series: [{
      data: [30, 57, 25, 33, 20, 39, 47, 36, 22, 51, 38, 27, 38, 49, 42, 58, 33, 46, 40, 34, 41, 53, 19, 23, 36, 52, 58, 43]
    }],
    chart: {
      height: 373,
      type: 'bar',
      toolbar: {
        show: false,
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      type: 'datetime',
      categories: ['01/01/2023 GMT', '01/02/2023 GMT', '01/03/2023 GMT', '01/04/2023 GMT',
        '01/05/2023 GMT', '01/06/2023 GMT', '01/07/2023 GMT', '01/08/2023 GMT', '01/09/2023 GMT', '01/10/2023 GMT', '01/11/2023 GMT', '01/12/2023 GMT', '01/13/2023 GMT',
        '01/14/2023 GMT', '01/15/2023 GMT', '01/16/2023 GMT', '01/17/2023 GMT', '01/18/2023 GMT', '01/19/2023 GMT', '01/20/2023 GMT', '01/21/2023 GMT', '01/22/2023 GMT',
        '01/23/2023 GMT', '01/24/2023 GMT', '01/25/2023 GMT', '01/26/2023 GMT', '01/27/2023 GMT', '01/28/2023 GMT'
      ],
    },
  }

  const attributeToMonitor = 'data-theme';

  const observer = new MutationObserver(() => {
    this._columnChart('["#C8A6A9-text-emphasis"]');
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [attributeToMonitor]
  });
}


KPIonemonth()
{
  this.Overalldata.length = 0;
  //this.valuemonthselection =1;
  //console.log('In oneyear');
  //Overalldata : any = [];
  this.titleonemonthdata = [];
  this.previoustitlemonthdata = [];
  // this.valuewiseonemonth = [];
  // this.Onemonthvaluedata = [];
  this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=mar 2024&eMonthyear=mar 2024')
  .subscribe(
    res => {
      
      //console.log('One month data',res.data);
      this.titleonemonthdata = res.data;
      //this.Onemonthvaluedata = res.data;
      setTimeout(() => {
       if(this.titleonemonthdata.length > 0)
       {

        var overallofonemonth=0;
        let onemonthdata = this.titleonemonthdata;
        //console.log('one month data',onemonthdata);
        var result = onemonthdata.map(function(a) {return a.monthYear;});
   
           let monthYearPushArray = [];
         for(let i = 0; i < result.length ; i++){
         if(monthYearPushArray.indexOf(result[i]) === -1) {
           monthYearPushArray.push(result[i]);
         } else {
           //console.log(`${result[i]} is already pushed into array`);
         }
         }
         //console.log('Final monthYear Array  one month: ', monthYearPushArray)
           var resultpublisherName = onemonthdata.map(function(a) {return a.publisherName;});
   
           console.log(resultpublisherName);
   
           let publisherNamePushArray = [];
           for(let i = 0; i < resultpublisherName.length ; i++){
           if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
           publisherNamePushArray.push(resultpublisherName[i]);
           } else {
           //console.log(`${result[i]} is already pushed into array`);
           }
           }
           console.log('Final publisherName Array one month: ', publisherNamePushArray)
   
         var resultmetrics = onemonthdata.map(function(a) {return a.metrics;});
   
         let metricsPushArray = [];
         for(let i = 0; i < resultmetrics.length ; i++){
         if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
         metricsPushArray.push(resultmetrics[i]);
         } else {
         //console.log(`${result[i]} is already pushed into array`);
         }
         }
   
         //console.log('Final metrics Array one month: ', metricsPushArray)
   
         var _my = monthYearPushArray[0];
         
         for(let o=0; o< publisherNamePushArray.length; o++)
         {
           var publisher = publisherNamePushArray[o];
           var _ddddd =   onemonthdata.filter(person => person.publisherName == publisher);
           var actualdata = 0;
           var targetdata = 0;
           for(let p=0; p< _ddddd.length; p++)
           {
                actualdata =  actualdata + _ddddd[p].actual;
                targetdata = targetdata + _ddddd[p].target;
           }
           var valuetype = actualdata/_ddddd.length;
           var targettype = targetdata/_ddddd.length;
           var aggregatetype = valuetype/monthYearPushArray.length;
           let targetall = { publishername: publisher , totalofactual: actualdata, targetvalue:Math.round(targettype),  data:Math.round(valuetype), aggregate: aggregatetype.toFixed(2)};
           overallofonemonth = overallofonemonth + Math.round(valuetype);
   
           //this.Onemonthvaluedata.push(targetall);
         }
       
         console.log('total of overall:', overallofonemonth);
         const _statData = 
          {
              title: 'KPI',
              count: (overallofonemonth/publisherNamePushArray.length).toFixed(3),
              counttyyp: 'k',
              avg: '06.41% Last Month',
              icon: 'bi bi-arrow-up',
              color: 'success'
          };
          
         this.titleValue = (overallofonemonth/publisherNamePushArray.length).toFixed(3);
         this.Overalldata.push(_statData);
         console.log('overall KPI:', this.Overalldata);
         this.newstatData = this.Overalldata;
         this.Titlechart("","");
         //var _publisherName = this.Onemonthvaluedata.map(function(a) {return a.publishername;});
         //var _resultvalue = this.Onemonthvaluedata.map(function(a) {return a.data;});
         //var _targetvalue = this.Onemonthvaluedata.map(function(a) {return a.targetvalue;});
          //var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
           //console.log('colour update',c);   //'["+ #C8A6A9", "#F6A8AE"]'
        //this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue ,_publisherName); 
       }
      
        //console.log('local storage count is ' + sessionStorage.length);
      }, 200);
    },
   
  );

  this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=feb 2024&eMonthyear=feb 2024')
  .subscribe(
    res => {
      
      //console.log('One month data',res.data);
      this.previoustitlemonthdata = res.data;
      //this.Onemonthvaluedata = res.data;
      console.log('title preoius month data:',this.previoustitlemonthdata);
      setTimeout(() => {
       if(this.previoustitlemonthdata.length > 0)
       {

        var overallofonemonth=0;
        let onemonthdata = this.previoustitlemonthdata;
        //console.log('one month data',onemonthdata);
        var result = onemonthdata.map(function(a) {return a.monthYear;});
   
           let monthYearPushArray = [];
         for(let i = 0; i < result.length ; i++){
         if(monthYearPushArray.indexOf(result[i]) === -1) {
           monthYearPushArray.push(result[i]);
         } else {
           //console.log(`${result[i]} is already pushed into array`);
         }
         }
         //console.log('Final monthYear Array  one month: ', monthYearPushArray)
           var resultpublisherName = onemonthdata.map(function(a) {return a.publisherName;});
   
           console.log(resultpublisherName);
   
           let publisherNamePushArray = [];
           for(let i = 0; i < resultpublisherName.length ; i++){
           if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
           publisherNamePushArray.push(resultpublisherName[i]);
           } else {
           //console.log(`${result[i]} is already pushed into array`);
           }
           }
           console.log('Final publisherName Array one month: ', publisherNamePushArray)
   
         var resultmetrics = onemonthdata.map(function(a) {return a.metrics;});
   
         let metricsPushArray = [];
         for(let i = 0; i < resultmetrics.length ; i++){
         if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
         metricsPushArray.push(resultmetrics[i]);
         } else {
         //console.log(`${result[i]} is already pushed into array`);
         }
         }
   
         //console.log('Final metrics Array one month: ', metricsPushArray)
   
         var _my = monthYearPushArray[0];
         
         for(let o=0; o< publisherNamePushArray.length; o++)
         {
           var publisher = publisherNamePushArray[o];
           var _ddddd =   onemonthdata.filter(person => person.publisherName == publisher);
           var actualdata = 0;
           var targetdata = 0;
           for(let p=0; p< _ddddd.length; p++)
           {
                actualdata =  actualdata + _ddddd[p].actual;
                targetdata = targetdata + _ddddd[p].target;
           }
           var valuetype = actualdata/_ddddd.length;
           var targettype = targetdata/_ddddd.length;
           var aggregatetype = valuetype/monthYearPushArray.length;
           let targetall = { publishername: publisher , totalofactual: actualdata, targetvalue:Math.round(targettype),  data:Math.round(valuetype), aggregate: aggregatetype.toFixed(2)};
           overallofonemonth = overallofonemonth + Math.round(valuetype);
   
           //this.Onemonthvaluedata.push(targetall);
         }
       
         console.log('total of overall:', overallofonemonth);
         const _statData = 
          {
              title: 'KPI',
              count: (overallofonemonth/publisherNamePushArray.length).toFixed(3),
              counttyyp: 'k',
              avg: '06.41% Last Month',
              icon: 'bi bi-arrow-up',
              color: 'success'
          };
          
          console.log('Feb month calcultions:',(overallofonemonth/publisherNamePushArray.length).toFixed(3));
         this.prevoiusvalue  = (overallofonemonth/publisherNamePushArray.length).toFixed(3);
         //this.Overalldata.push(_statData);
         //console.log('overall KPI:', this.Overalldata);
         this.newstatData = this.Overalldata;
         console.log('last mar month:',this.titleValue);
         console.log('last mar month:',this.prevoiusvalue);
         this.aveg  =((this.titleValue -this.prevoiusvalue) /this.prevoiusvalue).toFixed(4);

         if(this.aveg > 0)
         {
          this.titelarrowcolour = "success";
          this.titelarrowdirection = "bi bi-arrow-up";
         }
         else
         {
          this.titelarrowcolour = "danger";
          this.titelarrowdirection = "bi-arrow-down";
         }
         //var _publisherName = this.Onemonthvaluedata.map(function(a) {return a.publishername;});
         //var _resultvalue = this.Onemonthvaluedata.map(function(a) {return a.data;});
         //var _targetvalue = this.Onemonthvaluedata.map(function(a) {return a.targetvalue;});
          //var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
           //console.log('colour update',c);   //'["+ #C8A6A9", "#F6A8AE"]'
        //this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue ,_publisherName); 
       }
      
        //console.log('local storage count is ' + sessionStorage.length);
      }, 200);
    },
   
  );

 
}

KPIthreemonth()
{
  //this.valuemonthselection =2;
  this.Overalldata.length = 0;
  //console.log('In three month');
  this.titleonemonthdata = [];
  this.previoustitlemonthdata = [];
  this.valuewisethreemonth = [];
  this. threemonthvaluedata = [];
  this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=jan 2024&eMonthyear=mar 2024')
  .subscribe(
    res => {
      console.log('One month data',res.data);
      this.titleonemonthdata = res.data;

      setTimeout(() => {
        if(this.titleonemonthdata.length > 0)
        {
          var overallofonemonth=0;
          var tvmonth= this.titleonemonthdata;

          console.log('two month data',tvmonth);
          var result = tvmonth.map(function(a) {return a.monthYear;});

     let monthYearPushArray = [];
   for(let i = 0; i < result.length ; i++){
   if(monthYearPushArray.indexOf(result[i]) === -1) {
     monthYearPushArray.push(result[i]);
   } else {
     //console.log(`${result[i]} is already pushed into array`);
   }
   }

   console.log('Final monthYear Array  one month: ', monthYearPushArray)


     var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});

     console.log(resultpublisherName);

     let publisherNamePushArray = [];
     for(let i = 0; i < resultpublisherName.length ; i++){
     if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
     publisherNamePushArray.push(resultpublisherName[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
     console.log('Final publisherName Array one month: ', publisherNamePushArray)

   var resultmetrics = tvmonth.map(function(a) {return a.metrics;});


   let metricsPushArray = [];
   for(let i = 0; i < resultmetrics.length ; i++){
   if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
   metricsPushArray.push(resultmetrics[i]);
   } else {
   //console.log(`${result[i]} is already pushed into array`);
   }
   }

   console.log('Final metrics Array one month: ', metricsPushArray)


      for(let o=0; o< publisherNamePushArray.length; o++)
      {
        var publisher = publisherNamePushArray[o];
        var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
        var actualdata = 0;
        var tagetdata =0;
        var monthname= "";
        var monthwisedataactual = 0;
        var monthwisedatatarget = 0;
          console.log('two publisher wise data:',_ddddd);

        for(let m=0; m< monthYearPushArray.length; m++)
        {
              monthname = monthYearPushArray[m];
              var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);

              var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }
      
                 console.log('metricsPushArray2 data 2:',metricsPushArray2);
                 console.log('monthwise data data 2:',monthwise);

              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;
             for(let f=0; f< monthwise.length; f++)
             {
               actualdata =  actualdata + monthwise[f].actual; 
               tagetdata = tagetdata +  monthwise[f].target;
             }

             
           var _monthwisedatatarget = _monthwisedatatarget + tagetdata/metricsPushArray2.length;
           var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;

           console.log('month wise value data calculation:',monthname, _monthwisedata);
           monthwisedataactual =  _monthwisedata;
           monthwisedatatarget = _monthwisedatatarget;
              }   
                
        }

        console.log('month wise value data calculation publisher:',publisher, monthwisedataactual);
        var valuetype = actualdata/_ddddd.length;
        var targettype = tagetdata/_ddddd.length; 
        var aggregatetype = monthwisedataactual/monthYearPushArray.length;
        let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget), totalofactual: actualdata,  data:Math.round(monthwisedataactual), aggregate: aggregatetype.toFixed(2)};
        overallofonemonth = overallofonemonth + Math.round(monthwisedataactual);
        console.log('two publisher wise data:',targetall);
        //this.threemonthvaluedata.push(targetall);
          
      }

      this.titelmonthvaluearray = [];
      this.titelmontharray = [];
      for(let v=0; v< monthYearPushArray.length; v++)
      {
        var mmyyyy= monthYearPushArray[v];
        var _monthYear =   tvmonth.filter(person => person.monthYear == mmyyyy);
        var  monthtotal=0;
          for(let b=0; b< _monthYear.length; b++)
          {
            monthtotal = monthtotal + _monthYear[b].actual;
          }
          var cal =(monthtotal/publisherNamePushArray.length)/monthYearPushArray.length;
          this.titelmonthvaluearray.push((cal/monthYearPushArray.length).toFixed(3)); //(cal/publisherNamePushArray.length).toFixed(2));
          this.titelmontharray.push(mmyyyy.charAt(0));
          //console.log("monthwise data of chart:",mmyyyy);

          //let monthwisecal = { monthyyyy:mmyyyy.charAt(0) ,  totalofactual: (monthtotal/publisherNamePushArray.length).toFixed(2)};


      }

      console.log('total of overall:', overallofonemonth);
      const _statData = 
       {
           title: 'KPI',
           count: (overallofonemonth/publisherNamePushArray.length).toFixed(3),
           counttyyp: 'k',
           avg: '06.41% Last Month',
           icon: 'bi bi-arrow-up',
           color: 'success'
       };
       this.titleValue =((overallofonemonth/publisherNamePushArray.length)/monthYearPushArray.length).toFixed(3);
       this.Overalldata.push(_statData);
       console.log('overall KPI:', this.Overalldata);
        this.newstatData = this.Overalldata;

        this.Titlechart(this.titelmonthvaluearray,this.titelmontharray);
      // var _publisherName = this.threemonthvaluedata.map(function(a) {return a.publishername;});
      // var _resultvalue = this.threemonthvaluedata.map(function(a) {return a.data;});
      // var _targetvalue = this.threemonthvaluedata.map(function(a) {return a.targetvalue;});
      // console.log('three month newchartpublisher:',_publisherName);
      // console.log('three month newchartvalue:',_resultvalue);
      // console.log('three month publisher wise data:',this.threemonthvaluedata);
      //var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        //this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
       }
       
    }, 1000); 

    });


    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=oct 2023&eMonthyear=dec 2023')
    .subscribe(
      res => {
        console.log('One month data',res.data);
        this.previoustitlemonthdata = res.data;
  
        setTimeout(() => {
          if(this.previoustitlemonthdata.length > 0)
          {
            var overallofonemonth=0;
            var tvmonth= this.previoustitlemonthdata;
  
            console.log('two month data',tvmonth);
            var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var tagetdata =0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
            console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);
  
                var resultm = monthwise.map(function(a) {return a.metrics;});
  
         
                let metricsPushArray2 = [];
                for(let i = 0; i < resultm.length ; i++){
                if(metricsPushArray2.indexOf(resultm[i]) === -1) {
                metricsPushArray2.push(resultm[i]);
                } else {
                //console.log(`${result[i]} is already pushed into array`);
                }
                }
        
                   console.log('metricsPushArray2 data 2:',metricsPushArray2);
                   console.log('monthwise data data 2:',monthwise);
  
                if(monthwise.length > 0)
                {
                  var _monthwisedatatarget = 0;
                  var  _monthwisedata = 0;
               for(let f=0; f< monthwise.length; f++)
               {
                 actualdata =  actualdata + monthwise[f].actual; 
                 tagetdata = tagetdata +  monthwise[f].target;
               }
  
               
             var _monthwisedatatarget = _monthwisedatatarget + tagetdata/metricsPushArray2.length;
             var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;
  
             console.log('month wise value data calculation:',monthname, _monthwisedata);
             monthwisedataactual =  _monthwisedata;
             monthwisedatatarget = _monthwisedatatarget;
                }   
                  
          }
  
          console.log('month wise value data calculation publisher:',publisher, monthwisedataactual);
          var valuetype = actualdata/_ddddd.length;
          var targettype = tagetdata/_ddddd.length; 
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget), totalofactual: actualdata,  data:Math.round(monthwisedataactual), aggregate: aggregatetype.toFixed(2)};
          overallofonemonth = overallofonemonth + Math.round(monthwisedataactual);
          //console.log('two publisher wise data:',targetall);
          //this.threemonthvaluedata.push(targetall);
            
        }
  
        console.log('total of overall:', overallofonemonth);
        const _statData = 
         {
             title: 'KPI',
             count: (overallofonemonth/publisherNamePushArray.length).toFixed(3),
             counttyyp: 'k',
             avg: '06.41% Last Month',
             icon: 'bi bi-arrow-up',
             color: 'success'
         };
         this.prevoiusvalue =((overallofonemonth/publisherNamePushArray.length)/monthYearPushArray.length).toFixed(3);
         this.Overalldata.push(_statData);
         console.log('overall KPI:', this.Overalldata);
         this.newstatData = this.Overalldata;
  
          this.aveg  =((this.titleValue -this.prevoiusvalue) /this.prevoiusvalue).toFixed(4);

         if(this.aveg > 0)
         {
          this.titelarrowcolour = "success";
          this.titelarrowdirection = "bi bi-arrow-up";
         }
         else
         {
          this.titelarrowcolour = "danger";
          this.titelarrowdirection = "bi-arrow-down";
         }
        // var _publisherName = this.threemonthvaluedata.map(function(a) {return a.publishername;});
        // var _resultvalue = this.threemonthvaluedata.map(function(a) {return a.data;});
        // var _targetvalue = this.threemonthvaluedata.map(function(a) {return a.targetvalue;});
        // console.log('three month newchartpublisher:',_publisherName);
        // console.log('three month newchartvalue:',_resultvalue);
        // console.log('three month publisher wise data:',this.threemonthvaluedata);
        //var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          //this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
         }
         
      }, 1000); 
  
      });  

}

KPIsixmonth()
{
  //this.valuemonthselection =3;
  this.Overalldata.length = 0;
  //console.log('In three month');
  this.titleonemonthdata = [];
  this.previoustitlemonthdata = [];
    this.valuewisesixmonth = [];
    this. sixmonthvaluedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=oct 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.titleonemonthdata = res.data;
  
        setTimeout(() => {
          if(this.titleonemonthdata.length > 0)
          {
            var overallofonemonth=0;
              var tvmonth= this.titleonemonthdata;
  
              console.log('two month data',tvmonth);
          var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata =0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
         
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);
   
                var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }

              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;

                for(let f=0; f< monthwise.length; f++)
                {
                  actualdata =  actualdata + monthwise[f].actual; 
                  targetdata = targetdata + monthwise[f].target;
                }

                var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
           var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;

           console.log('month wise value data calculation:',monthname, _monthwisedata);
           monthwisedataactual =  _monthwisedata;
           monthwisedatatarget = _monthwisedatatarget;

              }
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = targetdata/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget),totalofactual: actualdata,  data:monthwisedataactual.toFixed(2), aggregate: aggregatetype.toFixed(2)};
          overallofonemonth = overallofonemonth + Math.round(monthwisedataactual);
          //console.log('two publisher wise data:',targetall);
          //this.sixmonthvaluedata.push(targetall);
           
        }

      this.titelmonthvaluearray = [];
      this.titelmontharray = [];
      for(let v=0; v< monthYearPushArray.length; v++)
      {
        var mmyyyy= monthYearPushArray[v];
        var _monthYear =   tvmonth.filter(person => person.monthYear == mmyyyy);
        var  monthtotal=0;
          for(let b=0; b< _monthYear.length; b++)
          {
            monthtotal = monthtotal + _monthYear[b].actual;
          }
          this.titelmonthvaluearray.push((monthtotal/publisherNamePushArray.length).toFixed(2));
          this.titelmontharray.push(mmyyyy.charAt(0));
          //console.log("monthwise data of chart:",mmyyyy);

          //let monthwisecal = { monthyyyy:mmyyyy.charAt(0) ,  totalofactual: (monthtotal/publisherNamePushArray.length).toFixed(2)};


      }

      this.Titlechart(this.titelmonthvaluearray,this.titelmontharray);
        this.titleValue = ((overallofonemonth/publisherNamePushArray.length)/monthYearPushArray.length).toFixed(3);
        // var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
        // var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
        // var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
        // console.log('six month newchartpublisher:',_publisherName);
        // console.log('six month newchartvalue:',_resultvalue);
        // console.log('six month publisher wise data:',this.sixmonthvaluedata);
        // var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          //this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
         }
         }, 1000); 
  
      });


      this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=apr 2023&eMonthyear=sep 2023')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.titleonemonthdata = res.data;
  
        setTimeout(() => {
          if(this.titleonemonthdata.length > 0)
          {
            var overallofonemonth=0;
              var tvmonth= this.titleonemonthdata;
  
              console.log('two month data',tvmonth);
          var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata =0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
         
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);
   
                var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }

              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;

                for(let f=0; f< monthwise.length; f++)
                {
                  actualdata =  actualdata + monthwise[f].actual; 
                  targetdata = targetdata + monthwise[f].target;
                }

                var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
           var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;

           console.log('month wise value data calculation:',monthname, _monthwisedata);
           monthwisedataactual =  _monthwisedata;
           monthwisedatatarget = _monthwisedatatarget;

              }
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = targetdata/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget),totalofactual: actualdata,  data:monthwisedataactual.toFixed(2), aggregate: aggregatetype.toFixed(2)};
          overallofonemonth = overallofonemonth + Math.round(monthwisedataactual);
          //console.log('two publisher wise data:',targetall);
          //this.sixmonthvaluedata.push(targetall);
           
        }
        this.prevoiusvalue = ((overallofonemonth/publisherNamePushArray.length)/monthYearPushArray.length).toFixed(3);
        
        this.aveg  =((this.titleValue -this.prevoiusvalue) /this.prevoiusvalue).toFixed(4);

        if(this.aveg > 0)
        {
         this.titelarrowcolour = "success";
         this.titelarrowdirection = "bi bi-arrow-up";
        }
        else
        {
         this.titelarrowcolour = "danger";
         this.titelarrowdirection = "bi-arrow-down";
        }
        // var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
        // var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
        // var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
        // console.log('six month newchartpublisher:',_publisherName);
        // console.log('six month newchartvalue:',_resultvalue);
        // console.log('six month publisher wise data:',this.sixmonthvaluedata);
        // var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          //this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
         }
         }, 1000); 
  
      });
}


KPItwelvemonth()
{
  //this.valuemonthselection =3;
  this.Overalldata.length = 0;
  //console.log('In three month');
  this.titleonemonthdata = [];
    this.valuewisesixmonth = [];
    this. sixmonthvaluedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=feb 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.titleonemonthdata = res.data;
  
        setTimeout(() => {
          if(this.titleonemonthdata.length > 0)
          {
            var overallofonemonth=0;
              var tvmonth= this.titleonemonthdata;
  
              console.log('two month data',tvmonth);
          var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata =0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
         
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);
   
                var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }

              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;

                for(let f=0; f< monthwise.length; f++)
                {
                  actualdata =  actualdata + monthwise[f].actual; 
                  targetdata = targetdata + monthwise[f].target;
                }

                var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
           var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;

           console.log('month wise value data calculation:',monthname, _monthwisedata);
           monthwisedataactual =  _monthwisedata;
           monthwisedatatarget = _monthwisedatatarget;

              }
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = targetdata/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget),totalofactual: actualdata,  data:monthwisedataactual.toFixed(2), aggregate: aggregatetype.toFixed(2)};
          overallofonemonth = overallofonemonth + Math.round(monthwisedataactual);
          //console.log('two publisher wise data:',targetall);
          //this.sixmonthvaluedata.push(targetall);
           
        }


        this.titelmonthvaluearray = [];
      this.titelmontharray = [];
      for(let v=0; v< monthYearPushArray.length; v++)
      {
        var mmyyyy= monthYearPushArray[v];
        var _monthYear =   tvmonth.filter(person => person.monthYear == mmyyyy);
        var  monthtotal=0;
          for(let b=0; b< _monthYear.length; b++)
          {
            monthtotal = monthtotal + _monthYear[b].actual;
          }
          this.titelmonthvaluearray.push((monthtotal/publisherNamePushArray.length).toFixed(2));
          this.titelmontharray.push(mmyyyy.charAt(0));
          //console.log("monthwise data of chart:",mmyyyy);

          //let monthwisecal = { monthyyyy:mmyyyy.charAt(0) ,  totalofactual: (monthtotal/publisherNamePushArray.length).toFixed(2)};


      }
      this.Titlechart(this.titelmonthvaluearray,this.titelmontharray);
        this.titleValue = ((overallofonemonth/publisherNamePushArray.length)/monthYearPushArray.length).toFixed(3);
        // var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
        // var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
        // var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
        // console.log('six month newchartpublisher:',_publisherName);
        // console.log('six month newchartvalue:',_resultvalue);
        // console.log('six month publisher wise data:',this.sixmonthvaluedata);
        // var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          //this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
         }
         }, 1000); 
  
      });
}


Titlechart(valuedata : any, monthcat: any)
{

  if(valuedata.length > 0)
  {
    this.titelblockchart={

      series: [{
        name: 'Total Sessions',
        data: valuedata
    }],
    chart: {
        height: 124,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: false,
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    colors: ['#3762ea','#1e1a22'],
    xaxis: {
        categories: monthcat,
        labels: {
            style: {
                fontSize: '10px',
            },
        }
    },
    yaxis: {
        show: false,
    },
    };
  }
  else
  {
    this.titelblockchart={

      series: [{
        name: 'Total Sessions',
        data: [31, 40, 28, 51, 42, 109, 103]
    }],
    chart: {
        height: 124,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: false,
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    colors: ['#3762ea','#1e1a22'],
    xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        labels: {
            style: {
                fontSize: '10px',
            },
        }
    },
    yaxis: {
        show: false,
    },
    };
  }
 
     
}

onemonth()
{
  this.valuemonthselection =1;
  console.log('In oneyear');
  this.valuewiseonemonth = [];
  this.Onemonthvaluedata = [];
  this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=mar 2024&eMonthyear=mar 2024')
  .subscribe(
    res => {
      
      console.log('One month data',res.data);
      this.valuewiseonemonth = res.data;
      //this.Onemonthvaluedata = res.data;
      setTimeout(() => {
       if(this.valuewiseonemonth.length > 0)
       {

        //var overallofonemonth=0;
        let onemonthdata = this.valuewiseonemonth;
        console.log('one month data',onemonthdata);
        var result = onemonthdata.map(function(a) {return a.monthYear;});
   
           let monthYearPushArray = [];
         for(let i = 0; i < result.length ; i++){
         if(monthYearPushArray.indexOf(result[i]) === -1) {
           monthYearPushArray.push(result[i]);
         } else {
           //console.log(`${result[i]} is already pushed into array`);
         }
         }
         //console.log('Final monthYear Array  one month: ', monthYearPushArray)
           var resultpublisherName = onemonthdata.map(function(a) {return a.publisherName;});
   
           console.log(resultpublisherName);
   
           let publisherNamePushArray = [];
           for(let i = 0; i < resultpublisherName.length ; i++){
           if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
           publisherNamePushArray.push(resultpublisherName[i]);
           } else {
           //console.log(`${result[i]} is already pushed into array`);
           }
           }
           console.log('Final publisherName Array one month: ', publisherNamePushArray)
   
         var resultmetrics = onemonthdata.map(function(a) {return a.metrics;});
   
         let metricsPushArray = [];
         for(let i = 0; i < resultmetrics.length ; i++){
         if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
         metricsPushArray.push(resultmetrics[i]);
         } else {
         //console.log(`${result[i]} is already pushed into array`);
         }
         }
   
         //console.log('Final metrics Array one month: ', metricsPushArray)
   
         var _my = monthYearPushArray[0];
         
         for(let o=0; o< publisherNamePushArray.length; o++)
         {
           var publisher = publisherNamePushArray[o];
           var _ddddd =   onemonthdata.filter(person => person.publisherName == publisher);
           var actualdata = 0;
           var targetdata = 0;
           for(let p=0; p< _ddddd.length; p++)
           {
                actualdata =  actualdata + _ddddd[p].actual;
                targetdata = targetdata + _ddddd[p].target;
           }
           var valuetype = actualdata/_ddddd.length;
           var targettype = targetdata/_ddddd.length;
           var aggregatetype = valuetype/monthYearPushArray.length;
           let targetall = { publishername: publisher , totalofactual: actualdata, targetvalue:Math.round(targettype),  data:Math.round(valuetype), aggregate: aggregatetype.toFixed(2)};
           //overallofonemonth = overallofonemonth + Math.round(valuetype);
   
           this.Onemonthvaluedata.push(targetall);
         }
       
         //console.log('total of overall:', overallofonemonth);
        //  const _statData = 
        //   {
        //       title: 'KPI',
        //       count: (overallofonemonth/publisherNamePushArray.length).toFixed(2),
        //       counttyyp: 'k',
        //       avg: '06.41% Last Month',
        //       icon: 'bi bi-arrow-up',
        //       color: 'success'
        //   };
          
      
         console.log('one month publisher wise data:',this.Onemonthvaluedata);
         //this.Overalldata.push(_statData);
        //console.log('overall KPI:', this.Overalldata);
         //this.newstatData = this.Overalldata;
         var _publisherName = this.Onemonthvaluedata.map(function(a) {return a.publishername;});
         var _resultvalue = this.Onemonthvaluedata.map(function(a) {return a.data;});
         var _targetvalue = this.Onemonthvaluedata.map(function(a) {return a.targetvalue;});
          var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
           console.log('colour update',c);   //'["+ #C8A6A9", "#F6A8AE"]'
        this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue ,_publisherName); 
       }
       else
       {
        this.pageoverviewChart = {
          series: [{
            name: 'Actual',
            data:[],
          }
          ],
          chart: {
            type: this.charttype,
            height: 373,
            stacked: true,
            toolbar: {
              show: true
            }
          },
          
          plotOptions: {
            bar: {
              columnWidth: '25%',
              borderRadius: 5,
              lineCap: 'round',
              borderRadiusOnAllStackedSeries: true
      
            },
          },
          colors: [],
          fill: {
            opacity: 1
          },
          dataLabels: {
            enabled: false,
            textAnchor: 'top',
          },
          legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'center',
          },
          xaxis: {
            categories: [],
            labels: {
              rotate: -90
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              stroke: {
                width: 1
              },
            },
          },
          responsive: [
            {
              breakpoint: 992,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: '50px',
                  }
                },
              }
            },
            {
              breakpoint: 600,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: '70px',
                  }
                },
              }
            }
          ]
        }
       }
        //console.log('local storage count is ' + sessionStorage.length);
      }, 200);
    },
   
  );


}


threemonthva()
{
  this.valuemonthselection =2;


  console.log('In three month');
  this.valuewisethreemonth = [];
  this. threemonthvaluedata = [];
  this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=jan 2024&eMonthyear=mar 2024')
  .subscribe(
    res => {
      console.log('One month data',res.data);
      this.valuewisethreemonth = res.data;

      setTimeout(() => {
        if(this.valuewisethreemonth.length > 0)
        {
            var tvmonth= this.valuewisethreemonth;

            console.log('two month data',tvmonth);
  var result = tvmonth.map(function(a) {return a.monthYear;});

     let monthYearPushArray = [];
   for(let i = 0; i < result.length ; i++){
   if(monthYearPushArray.indexOf(result[i]) === -1) {
     monthYearPushArray.push(result[i]);
   } else {
     //console.log(`${result[i]} is already pushed into array`);
   }
   }

   console.log('Final monthYear Array  one month: ', monthYearPushArray)


     var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});

     console.log(resultpublisherName);

     let publisherNamePushArray = [];
     for(let i = 0; i < resultpublisherName.length ; i++){
     if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
     publisherNamePushArray.push(resultpublisherName[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
     console.log('Final publisherName Array one month: ', publisherNamePushArray)

   var resultmetrics = tvmonth.map(function(a) {return a.metrics;});


   let metricsPushArray = [];
   for(let i = 0; i < resultmetrics.length ; i++){
   if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
   metricsPushArray.push(resultmetrics[i]);
   } else {
   //console.log(`${result[i]} is already pushed into array`);
   }
   }

   console.log('Final metrics Array one month: ', metricsPushArray)


      for(let o=0; o< publisherNamePushArray.length; o++)
      {
        var publisher = publisherNamePushArray[o];
        var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
        var actualdata = 0;
        var tagetdata =0;
        var monthname= "";
        var monthwisedataactual = 0;
        var monthwisedatatarget = 0;
          console.log('two publisher wise data:',_ddddd);

        for(let m=0; m< monthYearPushArray.length; m++)
        {
              monthname = monthYearPushArray[m];
              var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);

              var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }
      
                 console.log('metricsPushArray2 data 2:',metricsPushArray2);
                 console.log('monthwise data data 2:',monthwise);

              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;
             for(let f=0; f< monthwise.length; f++)
             {
               actualdata =  actualdata + monthwise[f].actual; 
               tagetdata = tagetdata +  monthwise[f].target;
             }

             
           var _monthwisedatatarget = _monthwisedatatarget + tagetdata/metricsPushArray2.length;
           var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;

           console.log('month wise value data calculation:',monthname, _monthwisedata);
           monthwisedataactual =  _monthwisedata;
           monthwisedatatarget = _monthwisedatatarget;
              }   
                
        }

        console.log('month wise value data calculation publisher:',publisher, monthwisedataactual);
        var valuetype = actualdata/_ddddd.length;
        var targettype = tagetdata/_ddddd.length; 
        var aggregatetype = monthwisedataactual/monthYearPushArray.length;
        let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget/monthYearPushArray.length), totalofactual: actualdata,  data:Math.round(monthwisedataactual/monthYearPushArray.length), aggregate: aggregatetype.toFixed(2)};
        
        //console.log('two publisher wise data:',targetall);
        this.threemonthvaluedata.push(targetall);
          // for(let p=0; p< _ddddd.length; p++)
          //   {
          //     for(let m=0; m< monthYearPushArray.length; m++)
          //     {
          //         monthname = monthYearPushArray[m];
          //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
          //         console.log('two publisher wise data:',_mmyy);
          //         // for(let v=0; v< _mmyy.length; v++)
          //         // {
          //         //   actualdata =  actualdata + _mmyy[v].actual;
          //         // }
                  
          //     }
          //   }
              //actualdata =  actualdata + _ddddd[p].actual;
        
       
        //console.log('two publisher wise data:',targetall);
      }

      var _publisherName = this.threemonthvaluedata.map(function(a) {return a.publishername;});
      var _resultvalue = this.threemonthvaluedata.map(function(a) {return a.data;});
      var _targetvalue = this.threemonthvaluedata.map(function(a) {return a.targetvalue;});
      console.log('three month newchartpublisher:',_publisherName);
      console.log('three month newchartvalue:',_resultvalue);
      console.log('three month publisher wise data:',this.threemonthvaluedata);
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
       }
       else
       {
        this.pageoverviewChart = {
          series: [{
            name: 'Actual',
            data:[],
          }
          ],
          chart: {
            type: this.charttype,
            height: 373,
            stacked: true,
            toolbar: {
              show: true
            }
          },
          
          plotOptions: {
            bar: {
              columnWidth: '25%',
              borderRadius: 5,
              lineCap: 'round',
              borderRadiusOnAllStackedSeries: true
      
            },
          },
          colors: [],
          fill: {
            opacity: 1
          },
          dataLabels: {
            enabled: false,
            textAnchor: 'top',
          },
          legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'center',
          },
          xaxis: {
            categories: [],
            labels: {
              rotate: -90
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              stroke: {
                width: 1
              },
            },
          },
          responsive: [
            {
              breakpoint: 992,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: '50px',
                  }
                },
              }
            },
            {
              breakpoint: 600,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: '70px',
                  }
                },
              }
            }
          ]
        }

      }}, 1000); 

    });

 


  
  }


  sixmonthvalue()
  {
    this.valuemonthselection =3;
    console.log('In three month');
    this.valuewisesixmonth = [];
    this. sixmonthvaluedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=oct 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.valuewisesixmonth = res.data;
  
        setTimeout(() => {
          if(this.valuewisesixmonth.length > 0)
          {
              var tvmonth= this.valuewisesixmonth;
  
              console.log('two month data',tvmonth);
    var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata =0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
         
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);
   
                var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }

              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;

                for(let f=0; f< monthwise.length; f++)
                {
                  actualdata =  actualdata + monthwise[f].actual; 
                  targetdata = targetdata + monthwise[f].target;
                }

                var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
           var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;

           console.log('month wise value data calculation:',monthname, _monthwisedata);
           monthwisedataactual =  _monthwisedata;
           monthwisedatatarget = _monthwisedatatarget;

              }


               
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = targetdata/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget/monthYearPushArray.length),totalofactual: actualdata,  data:(monthwisedataactual/monthYearPushArray.length).toFixed(2), aggregate: aggregatetype.toFixed(2)};
          
          //console.log('two publisher wise data:',targetall);
          this.sixmonthvaluedata.push(targetall);
            // for(let p=0; p< _ddddd.length; p++)
            //   {
            //     for(let m=0; m< monthYearPushArray.length; m++)
            //     {
            //         monthname = monthYearPushArray[m];
            //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
            //         console.log('two publisher wise data:',_mmyy);
            //         // for(let v=0; v< _mmyy.length; v++)
            //         // {
            //         //   actualdata =  actualdata + _mmyy[v].actual;
            //         // }
                    
            //     }
            //   }
                //actualdata =  actualdata + _ddddd[p].actual;
          
         
          //console.log('two publisher wise data:',targetall);
        }
  
        var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
        var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
        var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
        console.log('six month newchartpublisher:',_publisherName);
        console.log('six month newchartvalue:',_resultvalue);
        console.log('six month publisher wise data:',this.sixmonthvaluedata);
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
         }
         else
         {
          this.pageoverviewChart = {
            series: [{
              name: 'Actual',
              data:[],
            }
            ],
            chart: {
              type: this.charttype,
              height: 373,
              stacked: true,
              toolbar: {
                show: true
              }
            },
            
            plotOptions: {
              bar: {
                columnWidth: '25%',
                borderRadius: 5,
                lineCap: 'round',
                borderRadiusOnAllStackedSeries: true
        
              },
            },
            colors: [],
            fill: {
              opacity: 1
            },
            dataLabels: {
              enabled: false,
              textAnchor: 'top',
            },
            legend: {
              show: true,
              position: 'top',
              horizontalAlign: 'center',
            },
            xaxis: {
              categories: [],
              labels: {
                rotate: -90
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                stroke: {
                  width: 1
                },
              },
            },
            responsive: [
              {
                breakpoint: 992,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '50px',
                    }
                  },
                }
              },
              {
                breakpoint: 600,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '70px',
                    }
                  },
                }
              }
            ]
          }
  
        }}, 1000); 
  
      });
  
   
  }


  twelvemonthvalue()
  {
    this.valuemonthselection =4;
    console.log('In Twelve month');
    this.valuewise12month = [];
    this. twelvemonthvaluedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=feb 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.valuewise12month = res.data;
  
        setTimeout(() => {
          if(this.valuewise12month.length > 0)
          {
              var tvmonth= this.valuewise12month;
  
              console.log('two month data',tvmonth);
    var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata = 0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
         
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);

                var resultm = monthwise.map(function(a) {return a.metrics;});

       
                let metricsPushArray2 = [];
                for(let i = 0; i < resultm.length ; i++){
                if(metricsPushArray2.indexOf(resultm[i]) === -1) {
                metricsPushArray2.push(resultm[i]);
                } else {
                //console.log(`${result[i]} is already pushed into array`);
                }
                }
  
                if(monthwise.length > 0)
                {
                    var _monthwisedatatarget = 0;
                    var  _monthwisedata = 0;

                    for(let f=0; f< monthwise.length; f++)
                    {
                      actualdata =  actualdata + monthwise[f].actual;   
                      targetdata = targetdata + monthwise[f].target; 
                    }

                    var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
                    var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;
         
                    console.log('month wise value data calculation:',monthname, _monthwisedata);
                    monthwisedataactual =  _monthwisedata;
                    monthwisedatatarget = _monthwisedatatarget;
                }

                
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = targetdata/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(monthwisedatatarget/monthYearPushArray.length), totalofactual: actualdata,  data:Math.round(monthwisedataactual/monthYearPushArray.length), aggregate: aggregatetype.toFixed(2)};
          
          //console.log('two publisher wise data:',targetall);
          this.twelvemonthvaluedata.push(targetall);
            // for(let p=0; p< _ddddd.length; p++)
            //   {
            //     for(let m=0; m< monthYearPushArray.length; m++)
            //     {
            //         monthname = monthYearPushArray[m];
            //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
            //         console.log('two publisher wise data:',_mmyy);
            //         // for(let v=0; v< _mmyy.length; v++)
            //         // {
            //         //   actualdata =  actualdata + _mmyy[v].actual;
            //         // }
                    
            //     }
            //   }
                //actualdata =  actualdata + _ddddd[p].actual;
          
          //console.log('two publisher wise data:',targetall);
        }
  
        var _publisherName = this.twelvemonthvaluedata.map(function(a) {return a.publishername;});
        var _resultvalue = this.twelvemonthvaluedata.map(function(a) {return a.data;});
        var _targetvalue = this.twelvemonthvaluedata.map(function(a) {return a.targetvalue;});
        console.log('six month newchartpublisher:',_publisherName);
        console.log('six month newchartvalue:',_resultvalue);
        console.log('six month publisher wise data:',this.twelvemonthvaluedata);
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
         }
         else
         {
          this.pageoverviewChart = {
            series: [{
              name: 'Actual',
              data:[],
            }
            ],
            chart: {
              type: this.charttype,
              height: 373,
              stacked: true,
              toolbar: {
                show: true
              }
            },
            
            plotOptions: {
              bar: {
                columnWidth: '25%',
                borderRadius: 5,
                lineCap: 'round',
                borderRadiusOnAllStackedSeries: true
        
              },
            },
            colors: [],
            fill: {
              opacity: 1
            },
            dataLabels: {
              enabled: false,
              textAnchor: 'top',
            },
            legend: {
              show: true,
              position: 'top',
              horizontalAlign: 'center',
            },
            xaxis: {
              categories: [],
              labels: {
                rotate: -90
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                stroke: {
                  width: 1
                },
              },
            },
            responsive: [
              {
                breakpoint: 992,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '50px',
                    }
                  },
                }
              },
              {
                breakpoint: 600,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '70px',
                    }
                  },
                }
              }
            ]
          }
  
        }}, 1000); 
  
      });
  
   
  }



  allmonthvalue()
  {
    this.valuemonthselection =5;
    console.log('In Twelve month');
    this.valuewiseallmonth = [];
    this. allmonthvaluedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=jan 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.valuewiseallmonth = res.data;
  
        setTimeout(() => {
          if(this.valuewiseallmonth.length > 0)
          {
              var tvmonth= this.valuewiseallmonth;
  
              console.log('two month data',tvmonth);
    var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata = 0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
          
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);
     
                var resultm = monthwise.map(function(a) {return a.metrics;});

       
                let metricsPushArray2 = [];
                for(let i = 0; i < resultm.length ; i++){
                if(metricsPushArray2.indexOf(resultm[i]) === -1) {
                metricsPushArray2.push(resultm[i]);
                } else {
                //console.log(`${result[i]} is already pushed into array`);
                }
                }
  
                if(monthwise.length > 0)
                {
                  var _monthwisedatatarget = 0;
                  var  _monthwisedata = 0;
                  for(let f=0; f< monthwise.length; f++)
                  {
                    actualdata =  actualdata + monthwise[f].actual;    
                    targetdata = targetdata + monthwise[f].target;
                  }

                  var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
                  var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;

                  console.log('month wise value data calculation:',monthname, _monthwisedata);
                  monthwisedataactual =  _monthwisedata;
                  monthwisedatatarget = _monthwisedatatarget;

                }

                
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = targetdata/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, totalofactual: actualdata,targetvalue:Math.round(monthwisedatatarget/monthYearPushArray.length),  data:Math.round(monthwisedataactual/monthYearPushArray.length), aggregate: aggregatetype.toFixed(2)};
          
          //console.log('two publisher wise data:',targetall);
          this.allmonthvaluedata.push(targetall);
            // for(let p=0; p< _ddddd.length; p++)
            //   {
            //     for(let m=0; m< monthYearPushArray.length; m++)
            //     {
            //         monthname = monthYearPushArray[m];
            //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
            //         console.log('two publisher wise data:',_mmyy);
            //         // for(let v=0; v< _mmyy.length; v++)
            //         // {
            //         //   actualdata =  actualdata + _mmyy[v].actual;
            //         // }
                    
            //     }
            //   }
                //actualdata =  actualdata + _ddddd[p].actual;
          
          //console.log('two publisher wise data:',targetall);
        }
  
        var _publisherName = this.allmonthvaluedata.map(function(a) {return a.publishername;});
        var _resultvalue = this.allmonthvaluedata.map(function(a) {return a.data;});
        var _targetvalue = this.allmonthvaluedata.map(function(a) {return a.targetvalue;});
        console.log('six month newchartpublisher:',_publisherName);
        console.log('six month newchartvalue:',_resultvalue);
        console.log('six month publisher wise data:',this.allmonthvaluedata);
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName); 
         }
         else
         {
          this.pageoverviewChart = {
            series: [{
              name: 'Actual',
              data:[],
            }
            ],
            chart: {
              type: this.charttype,
              height: 373,
              stacked: true,
              toolbar: {
                show: true
              }
            },
            
            plotOptions: {
              bar: {
                columnWidth: '25%',
                borderRadius: 5,
                lineCap: 'round',
                borderRadiusOnAllStackedSeries: true
        
              },
            },
            colors: [],
            fill: {
              opacity: 1
            },
            dataLabels: {
              enabled: false,
              textAnchor: 'top',
            },
            legend: {
              show: true,
              position: 'top',
              horizontalAlign: 'center',
            },
            xaxis: {
              categories: [],
              labels: {
                rotate: -90
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                stroke: {
                  width: 1
                },
              },
            },
            responsive: [
              {
                breakpoint: 992,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '50px',
                    }
                  },
                }
              },
              {
                breakpoint: 600,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '70px',
                    }
                  },
                }
              }
            ]
          }
  
        }}, 1000); 
  
      });
  
   
  }



  onemonthaggregate()
  {
    this.aggregatemonthselection =1;
    console.log('In aggregate one month');
    this.aggregatewiseonemonth = [];
    this.Onemonthaggregatedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=mar 2024&eMonthyear=mar 2024')
    .subscribe(
      res => {
        
        console.log('One month aggregate data',res.data);
        this.aggregatewiseonemonth = res.data;
        //this.Onemonthvaluedata = res.data;
        setTimeout(() => {
         if(this.aggregatewiseonemonth.length > 0)
         {
  
          let onemonthdata = this.aggregatewiseonemonth;
          console.log('one month aggregate data',onemonthdata);
          var result = onemonthdata.map(function(a) {return a.monthYear;});
     
             let monthYearPushArray = [];
           for(let i = 0; i < result.length ; i++){
           if(monthYearPushArray.indexOf(result[i]) === -1) {
             monthYearPushArray.push(result[i]);
           } else {
             //console.log(`${result[i]} is already pushed into array`);
           }
           }
           //console.log('Final monthYear Array  one month: ', monthYearPushArray)
             var resultpublisherName = onemonthdata.map(function(a) {return a.publisherName;});
     
             console.log(resultpublisherName);
     
             let publisherNamePushArray = [];
             for(let i = 0; i < resultpublisherName.length ; i++){
             if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
             publisherNamePushArray.push(resultpublisherName[i]);
             } else {
             //console.log(`${result[i]} is already pushed into array`);
             }
             }
             console.log('Final publisherName aggregate Array one month: ', publisherNamePushArray)
     
           var resultmetrics = onemonthdata.map(function(a) {return a.metrics;});
     
           let metricsPushArray = [];
           for(let i = 0; i < resultmetrics.length ; i++){
           if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
           metricsPushArray.push(resultmetrics[i]);
           } else {
           //console.log(`${result[i]} is already pushed into array`);
           }
           }
     
           //console.log('Final metrics Array one month: ', metricsPushArray)
     
           var _my = monthYearPushArray[0];
           
           for(let o=0; o< publisherNamePushArray.length; o++)
           {
             var publisher = publisherNamePushArray[o];
             var _ddddd =   onemonthdata.filter(person => person.publisherName == publisher);
             var actualdata = 0;
             var targetdata = 0;
             for(let p=0; p< _ddddd.length; p++)
             {
                  actualdata =  actualdata + _ddddd[p].actual;
                  targetdata = targetdata + _ddddd[p].target;
             }
             var valuetype = actualdata/_ddddd.length;
             var targettype = targetdata/_ddddd.length;
             var aggregatetype = valuetype/monthYearPushArray.length;
             let targetall = { publishername: publisher , totalofactual: actualdata, targetvalue:Math.round(targettype),  data:Math.round(aggregatetype), aggregate: aggregatetype.toFixed(2)};
            
     
             this.Onemonthaggregatedata.push(targetall);
           }
         
           console.log('one month aggregate publisher wise data:',this.Onemonthaggregatedata);
     
           var _publisherName = this.Onemonthaggregatedata.map(function(a) {return a.publishername;});
           var _resultvalue = this.Onemonthaggregatedata.map(function(a) {return a.data;});
           var _targetvalue = this.Onemonthaggregatedata.map(function(a) {return a.targetvalue;});
           var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
          this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
         }
         else
         {
          this.clicksChart = {
            series: [{
              name: 'Actual',
              data: []
              
            },
            {
              "name": "Target",
              "data": []
            }],
            chart: {
              type: this.chartaggregatetype,
              height: 373,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              },
            },
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            xaxis: {
              categories: [],
              labels: {
                rotate: -90
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                stroke: {
                  width: 1
                },
              },
            },
            legend: {
              position: 'top',
            },
            fill: {
              opacity: 1
            },
            colors: [],
          }
         }
          //console.log('local storage count is ' + sessionStorage.length);
        }, 1000);
      },
     
    );
  }
 
  threemonthvaaggregate()
  {
    this.aggregatemonthselection =2;

    console.log('In three  month aggregate');
    this.aggregatewisethreemonth= [];
    this. threemonthaggregatedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=jan 2024&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('One month data',res.data);
        this.aggregatewisethreemonth = res.data;
  
        setTimeout(() => {
          if(this.aggregatewisethreemonth.length > 0)
          {
              var tvmonth= this.aggregatewisethreemonth;
  
              console.log('two month data',tvmonth);
    var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       //console.log('Final publisherName aggregate Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
    // console.log('Final metrics Array aggregate  one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var tagetdata =0;
          var monthname= "";
         
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
          console.log('two publisher wise aggregate data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);

 
                var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }

              if(monthwise.length > 0)
              {

                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;
                for(let f=0; f< monthwise.length; f++)
                {
                  actualdata =  actualdata + monthwise[f].actual; 
                  tagetdata = tagetdata +  monthwise[f].target;
                }

                var _monthwisedatatarget = _monthwisedatatarget + tagetdata/metricsPushArray2.length;
                var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;
     
                console.log('month wise value data calculation:',monthname, _monthwisedata);
                monthwisedataactual =  _monthwisedata;
                monthwisedatatarget = _monthwisedatatarget;

              }
                
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = monthwisedatatarget/monthYearPushArray.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(targettype), totalofactual: actualdata,  data:Math.round(aggregatetype), aggregate: aggregatetype.toFixed(2)};
          
          //console.log('two publisher wise data:',targetall);
          this.threemonthaggregatedata.push(targetall);
            // for(let p=0; p< _ddddd.length; p++)
            //   {
            //     for(let m=0; m< monthYearPushArray.length; m++)
            //     {
            //         monthname = monthYearPushArray[m];
            //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
            //         console.log('two publisher wise data:',_mmyy);
            //         // for(let v=0; v< _mmyy.length; v++)
            //         // {
            //         //   actualdata =  actualdata + _mmyy[v].actual;
            //         // }
                    
            //     }
            //   }
                //actualdata =  actualdata + _ddddd[p].actual;
          
         
          //console.log('two publisher wise data:',targetall);
        }
  
        var _publisherName = this.threemonthaggregatedata.map(function(a) {return a.publishername;});
        var _resultvalue = this.threemonthaggregatedata.map(function(a) {return a.data;});
        var _targetvalue = this.threemonthaggregatedata.map(function(a) {return a.targetvalue;});
        console.log('three month aggregate newchartpublisher:',_publisherName);
        console.log('three month aggregate newchartvalue:',_resultvalue);
        console.log('three month aggregate publisher wise data:',this.threemonthaggregatedata);
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
      }
      else
      {
       this.clicksChart = {
         series: [{
           name: 'Actual',
           data: []
           
         },
         {
           "name": "Target",
           "data": []
         }],
         chart: {
           type: this.chartaggregatetype,
           height: 373,
           toolbar: {
             show: true
           },
           zoom: {
             enabled: true
           },
         },
         responsive: [{
           breakpoint: 480,
           options: {
             legend: {
               position: 'bottom',
               offsetX: -10,
               offsetY: 0
             }
           }
         }],
         xaxis: {
           categories: [],
           labels: {
             rotate: -90
           },
           axisTicks: {
             show: true,
           },
           axisBorder: {
             show: true,
             stroke: {
               width: 1
             },
           },
         },
         legend: {
           position: 'top',
         },
         fill: {
           opacity: 1
         },
         colors: [],
       }
      }
      
      }, 1000); 
  
      });
  

  }

  sixmonthaggregate()
  {
    this.aggregatemonthselection =3;
    console.log('In three month');
    this.aggregatewisesixmonth= [];
    this.sixmonthaggregatedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=oct 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.aggregatewisesixmonth = res.data;
  
        setTimeout(() => {
          if(this.aggregatewisesixmonth.length > 0)
          {
              var tvmonth= this.aggregatewisesixmonth;
  
              console.log('two month data',tvmonth);
    var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata =0;
          var monthname= "";
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
  
         
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);

                var resultm = monthwise.map(function(a) {return a.metrics;});

       
                let metricsPushArray2 = [];
                for(let i = 0; i < resultm.length ; i++){
                if(metricsPushArray2.indexOf(resultm[i]) === -1) {
                metricsPushArray2.push(resultm[i]);
                } else {
                //console.log(`${result[i]} is already pushed into array`);
                }
                }

                if(monthwise.length > 0)
                {
                  var _monthwisedatatarget = 0;
                  var  _monthwisedata = 0;
                     for(let f=0; f< monthwise.length; f++)
                    {
                      actualdata =  actualdata + monthwise[f].actual; 
                      targetdata = targetdata + monthwise[f].target;
                    }

                    var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
                    var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;
         
                    console.log('month wise value data calculation:',monthname, _monthwisedata);
                    monthwisedataactual =  _monthwisedata;
                    monthwisedatatarget = _monthwisedatatarget;
                }


                
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = monthwisedatatarget/monthYearPushArray.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(targettype),totalofactual: actualdata,  data:aggregatetype.toFixed(2), aggregate: aggregatetype.toFixed(2)};
          
          //console.log('two publisher wise data:',targetall);
          this.sixmonthaggregatedata.push(targetall);
            // for(let p=0; p< _ddddd.length; p++)
            //   {
            //     for(let m=0; m< monthYearPushArray.length; m++)
            //     {
            //         monthname = monthYearPushArray[m];
            //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
            //         console.log('two publisher wise data:',_mmyy);
            //         // for(let v=0; v< _mmyy.length; v++)
            //         // {
            //         //   actualdata =  actualdata + _mmyy[v].actual;
            //         // }
                    
            //     }
            //   }
                //actualdata =  actualdata + _ddddd[p].actual;
          
         
          //console.log('two publisher wise data:',targetall);
        }
  
        var _publisherName = this.sixmonthaggregatedata.map(function(a) {return a.publishername;});
        var _resultvalue = this.sixmonthaggregatedata.map(function(a) {return a.data;});
        var _targetvalue = this.sixmonthaggregatedata.map(function(a) {return a.targetvalue;});
        console.log('six month newchartpublisher:',_publisherName);
        console.log('six month newchartvalue:',_resultvalue);
        console.log('six month publisher wise data:',this.sixmonthaggregatedata);
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
         }
         else
         {
          this.clicksChart = {
            series: [{
              name: 'Actual',
              data: []
              
            },
            {
              "name": "Target",
              "data": []
            }],
            chart: {
              type: this.chartaggregatetype,
              height: 373,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              },
            },
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            xaxis: {
              categories: [],
              labels: {
                rotate: -90
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                stroke: {
                  width: 1
                },
              },
            },
            legend: {
              position: 'top',
            },
            fill: {
              opacity: 1
            },
            colors: [],
          }
        
        
        }}, 1000); 
  
      });
  }

  twelvemonthaggregate()
  {
    this.aggregatemonthselection =4;
    console.log('In Twelve month aggregate');
    this.aggregatewise12month = [];
    this.twelvemonthaggregatedata= [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=feb 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('Twelve month aggregate data',res.data);
        this.aggregatewise12month = res.data;
  
        setTimeout(() => {
          if(this.aggregatewise12month.length > 0)
          {
              var tvmonth= this.aggregatewise12month;
  
              console.log('Twelve month aggregate data',tvmonth);
    var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       //console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata = 0;
          var monthname= "";
          
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
         
          //console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);

                var resultm = monthwise.map(function(a) {return a.metrics;});

       
              let metricsPushArray2 = [];
              for(let i = 0; i < resultm.length ; i++){
              if(metricsPushArray2.indexOf(resultm[i]) === -1) {
              metricsPushArray2.push(resultm[i]);
              } else {
              //console.log(`${result[i]} is already pushed into array`);
              }
              }

              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;
                for(let f=0; f< monthwise.length; f++)
                {
                  actualdata =  actualdata + monthwise[f].actual;   
                  targetdata = targetdata + monthwise[f].target; 
                }

                var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
                var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;
     
                console.log('month wise value data calculation:',monthname, _monthwisedata);
                monthwisedataactual =  _monthwisedata;
                monthwisedatatarget = _monthwisedatatarget;

              }

                
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = monthwisedatatarget/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, targetvalue:Math.round(targettype), totalofactual: actualdata,  data:Math.round(aggregatetype), aggregate: aggregatetype.toFixed(2)};
          
          //console.log('two publisher wise data:',targetall);
          this.twelvemonthaggregatedata.push(targetall);
            // for(let p=0; p< _ddddd.length; p++)
            //   {
            //     for(let m=0; m< monthYearPushArray.length; m++)
            //     {
            //         monthname = monthYearPushArray[m];
            //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
            //         console.log('two publisher wise data:',_mmyy);
            //         // for(let v=0; v< _mmyy.length; v++)
            //         // {
            //         //   actualdata =  actualdata + _mmyy[v].actual;
            //         // }
                    
            //     }
            //   }
                //actualdata =  actualdata + _ddddd[p].actual;
          
          //console.log('two publisher wise data:',targetall);
        }
  
        var _publisherName = this.twelvemonthaggregatedata.map(function(a) {return a.publishername;});
        var _resultvalue = this.twelvemonthaggregatedata.map(function(a) {return a.data;});
        var _targetvalue = this.twelvemonthaggregatedata.map(function(a) {return a.targetvalue;});
        console.log('six month newchartpublisher:',_publisherName);
        console.log('six month newchartvalue:',_resultvalue);
        console.log('six month publisher wise data:',this.twelvemonthaggregatedata);
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
         }
         else
         {
          this.clicksChart = {
            series: [{
              name: 'Actual',
              data: []
              
            },
            {
              "name": "Target",
              "data": []
            }],
            chart: {
              type: this.chartaggregatetype,
              height: 373,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              },
            },
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            xaxis: {
              categories: [],
              labels: {
                rotate: -90
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                stroke: {
                  width: 1
                },
              },
            },
            legend: {
              position: 'top',
            },
            fill: {
              opacity: 1
            },
            colors: [],
          }
  
        }}, 1000); 
  
      });
  }

  allmonthaggregate()
  {
    this.aggregatemonthselection =5;
    console.log('In Twelve month');
    this.aggregatewiseallmonth = [];
    this.allmonthaggregatedata = [];
    this.apiService.GetDataWithToken('api/dashboard/LastMonthChart?sMonthyear=jan 2023&eMonthyear=mar 2024')
    .subscribe(
      res => {
        console.log('six month data',res.data);
        this.aggregatewiseallmonth = res.data;
  
        setTimeout(() => {
          if(this.aggregatewiseallmonth.length > 0)
          {
              var tvmonth= this.aggregatewiseallmonth;
  
              //console.log('two month data',tvmonth);
    var result = tvmonth.map(function(a) {return a.monthYear;});
  
       let monthYearPushArray = [];
     for(let i = 0; i < result.length ; i++){
     if(monthYearPushArray.indexOf(result[i]) === -1) {
       monthYearPushArray.push(result[i]);
     } else {
       //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     //console.log('Final monthYear Array  one month: ', monthYearPushArray)
  
  
       var resultpublisherName = tvmonth.map(function(a) {return a.publisherName;});
  
       console.log(resultpublisherName);
  
       let publisherNamePushArray = [];
       for(let i = 0; i < resultpublisherName.length ; i++){
       if(publisherNamePushArray.indexOf(resultpublisherName[i]) === -1) {
       publisherNamePushArray.push(resultpublisherName[i]);
       } else {
       //console.log(`${result[i]} is already pushed into array`);
       }
       }
       console.log('Final publisherName Array one month: ', publisherNamePushArray)
  
     var resultmetrics = tvmonth.map(function(a) {return a.metrics;});
  
  
     let metricsPushArray = [];
     for(let i = 0; i < resultmetrics.length ; i++){
     if(metricsPushArray.indexOf(resultmetrics[i]) === -1) {
     metricsPushArray.push(resultmetrics[i]);
     } else {
     //console.log(`${result[i]} is already pushed into array`);
     }
     }
  
     console.log('Final metrics Array one month: ', metricsPushArray)
  
  
        for(let o=0; o< publisherNamePushArray.length; o++)
        {
          var publisher = publisherNamePushArray[o];
          var _ddddd =   tvmonth.filter(person => person.publisherName == publisher);
          var actualdata = 0;
          var targetdata = 0;
          var monthname= "";
                    
          var monthwisedataactual = 0;
          var monthwisedatatarget = 0;
         
          console.log('two publisher wise data:',_ddddd);
  
          for(let m=0; m< monthYearPushArray.length; m++)
          {
                monthname = monthYearPushArray[m];
                var monthwise =  _ddddd.filter(m=> m.monthYear == monthname);

                var resultm = monthwise.map(function(a) {return a.metrics;});

       
                let metricsPushArray2 = [];
                for(let i = 0; i < resultm.length ; i++){
                if(metricsPushArray2.indexOf(resultm[i]) === -1) {
                metricsPushArray2.push(resultm[i]);
                } else {
                //console.log(`${result[i]} is already pushed into array`);
                }
                }
  
              if(monthwise.length > 0)
              {
                var _monthwisedatatarget = 0;
                var  _monthwisedata = 0;
                for(let f=0; f< monthwise.length; f++)
                {
                  actualdata =  actualdata + monthwise[f].actual;    
                  targetdata = targetdata + monthwise[f].target;
                }

                var _monthwisedatatarget = _monthwisedatatarget + targetdata/metricsPushArray2.length;
                var  _monthwisedata = _monthwisedata + actualdata/metricsPushArray2.length;
     
                console.log('month wise value data calculation:',monthname, _monthwisedata);
                monthwisedataactual =  _monthwisedata;
                monthwisedatatarget = _monthwisedatatarget;

              }
                
  
          }
  
          var valuetype = actualdata/_ddddd.length;
          var targettype = monthwisedatatarget/_ddddd.length;
          var aggregatetype = monthwisedataactual/monthYearPushArray.length;
          let targetall = { publishername: publisher ,monthyyyy:monthname, totalofactual: actualdata,targetvalue:Math.round(targettype),  data:Math.round(aggregatetype), aggregate: aggregatetype.toFixed(2)};
          
          //console.log('two publisher wise data:',targetall);
          this.allmonthaggregatedata.push(targetall);
            // for(let p=0; p< _ddddd.length; p++)
            //   {
            //     for(let m=0; m< monthYearPushArray.length; m++)
            //     {
            //         monthname = monthYearPushArray[m];
            //         var _mmyy =  _ddddd.filter(m=> m.monthYear == monthname);
            //         console.log('two publisher wise data:',_mmyy);
            //         // for(let v=0; v< _mmyy.length; v++)
            //         // {
            //         //   actualdata =  actualdata + _mmyy[v].actual;
            //         // }
                    
            //     }
            //   }
                //actualdata =  actualdata + _ddddd[p].actual;
          
          //console.log('two publisher wise data:',targetall);
        }
  
        var _publisherName = this.allmonthaggregatedata.map(function(a) {return a.publishername;});
        var _resultvalue = this.allmonthaggregatedata.map(function(a) {return a.data;});
        var _targetvalue = this.allmonthaggregatedata.map(function(a) {return a.targetvalue;});
        console.log('six month newchartpublisher:',_publisherName);
        console.log('six month newchartvalue:',_resultvalue);
        console.log('six month publisher wise data:',this.allmonthaggregatedata);
        var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
        this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
         }
         else
         {
          
          this.clicksChart = {
            series: [{
              name: 'Actual',
              data: []
              
            },
            {
              "name": "Target",
              "data": []
            }],
            chart: {
              type: this.chartaggregatetype,
              height: 373,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              },
            },
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            xaxis: {
              categories: [],
              labels: {
                rotate: -90
              },
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                stroke: {
                  width: 1
                },
              },
            },
            legend: {
              position: 'top',
            },
            fill: {
              opacity: 1
            },
            colors: [],
          }

        }}, 1000); 
  
      });
  
  }

  updateFirestoreColor(e : any)
  {
     console.log(e.target.value);
     console.log('test colour');
  }


  public onEventLog(event: string, data: any): void {
    console.log(event, data);
    console.log("only colour",data.color);
    if(this.valuemonthselection == 1)
    {
      var _publisherName = this.Onemonthvaluedata.map(function(a) {return a.publishername;});
      var _resultvalue = this.Onemonthvaluedata.map(function(a) {return a.data;});
      var _targetvalue = this.Onemonthvaluedata.map(function(a) {return a.targetvalue;});
      this.actualvaluecolour = data.color;
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
    }
    else if(this.valuemonthselection == 2)
     {
       var _publisherName = this.threemonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.threemonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.threemonthvaluedata.map(function(a) {return a.targetvalue;});
       this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 3)
     {
       var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
       this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else if(this.valuemonthselection == 4)
     {
       var _publisherName = this.twelvemonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.twelvemonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.twelvemonthvaluedata.map(function(a) {return a.targetvalue;});
       this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }
     else
     {
       var _publisherName = this.allmonthvaluedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.allmonthvaluedata.map(function(a) {return a.data;});
       var _targetvalue = this.allmonthvaluedata.map(function(a) {return a.targetvalue;});
       this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
     }

     if(this.aggregatemonthselection == 1)
     {
       var _publisherName = this.Onemonthaggregatedata.map(function(a) {return a.publishername;});
       var _resultvalue = this.Onemonthaggregatedata.map(function(a) {return a.data;});
       var _targetvalue = this.Onemonthaggregatedata.map(function(a) {return a.targetvalue;});
       this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
       this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
     }
     else if(this.aggregatemonthselection == 2)
   {
     var _publisherName = this.threemonthaggregatedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.threemonthaggregatedata.map(function(a) {return a.data;});
     var _targetvalue = this.threemonthaggregatedata.map(function(a) {return a.targetvalue;});
     this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
   }
   else if(this.aggregatemonthselection == 3)
   {
     var _publisherName = this.sixmonthaggregatedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.sixmonthaggregatedata.map(function(a) {return a.data;});
     var _targetvalue = this.sixmonthaggregatedata.map(function(a) {return a.targetvalue;});
     this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
   }
   else if(this.aggregatemonthselection == 4)
   {
     var _publisherName = this.twelvemonthaggregatedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.twelvemonthaggregatedata.map(function(a) {return a.data;});
     var _targetvalue = this.twelvemonthaggregatedata.map(function(a) {return a.targetvalue;});
     this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
   }
   else
   {
     var _publisherName = this.allmonthaggregatedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.allmonthaggregatedata.map(function(a) {return a.data;});
     var _targetvalue = this.allmonthaggregatedata.map(function(a) {return a.targetvalue;});
     this.actualvaluecolour = data.color;
       var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
   }
  }

  public onEventLogTraget(event: string, data: any): void {
    console.log(event, data);
    console.log("only colour",data.color);
    if(this.aggregatemonthselection == 1)
    {
      var _publisherName = this.Onemonthaggregatedata.map(function(a) {return a.publishername;});
      var _resultvalue = this.Onemonthaggregatedata.map(function(a) {return a.data;});
      var _targetvalue = this.Onemonthaggregatedata.map(function(a) {return a.targetvalue;});
      this.targetvaluecolour = data.color;
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
      this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
    }
    else if(this.aggregatemonthselection == 2)
  {
    var _publisherName = this.threemonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.threemonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.threemonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.targetvaluecolour = data.color;
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }
  else if(this.aggregatemonthselection == 3)
  {
    var _publisherName = this.sixmonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.sixmonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.sixmonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.targetvaluecolour = data.color;
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }
  else if(this.aggregatemonthselection == 4)
  {
    var _publisherName = this.twelvemonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.twelvemonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.twelvemonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.targetvaluecolour = data.color;
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }
  else
  {
    var _publisherName = this.allmonthaggregatedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.allmonthaggregatedata.map(function(a) {return a.data;});
    var _targetvalue = this.allmonthaggregatedata.map(function(a) {return a.targetvalue;});
    this.targetvaluecolour = data.color;
      var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._clicksChartnew(c,_resultvalue,_targetvalue ,_publisherName); 
  }

  if(this.valuemonthselection == 1)
  {
    var _publisherName = this.Onemonthvaluedata.map(function(a) {return a.publishername;});
    var _resultvalue = this.Onemonthvaluedata.map(function(a) {return a.data;});
    var _targetvalue = this.Onemonthvaluedata.map(function(a) {return a.targetvalue;});
    this.targetvaluecolour = data.color;
    var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
    this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
  }
  else if(this.valuemonthselection == 2)
   {
     var _publisherName = this.threemonthvaluedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.threemonthvaluedata.map(function(a) {return a.data;});
     var _targetvalue = this.threemonthvaluedata.map(function(a) {return a.targetvalue;});
     this.targetvaluecolour = data.color;
     var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
   }
   else if(this.valuemonthselection == 3)
   {
     var _publisherName = this.sixmonthvaluedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.sixmonthvaluedata.map(function(a) {return a.data;});
     var _targetvalue = this.sixmonthvaluedata.map(function(a) {return a.targetvalue;});
     this.targetvaluecolour = data.color;
     var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
   }
   else if(this.valuemonthselection == 4)
   {
     var _publisherName = this.twelvemonthvaluedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.twelvemonthvaluedata.map(function(a) {return a.data;});
     var _targetvalue = this.twelvemonthvaluedata.map(function(a) {return a.targetvalue;});
     this.targetvaluecolour = data.color;
     var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
   }
   else
   {
     var _publisherName = this.allmonthvaluedata.map(function(a) {return a.publishername;});
     var _resultvalue = this.allmonthvaluedata.map(function(a) {return a.data;});
     var _targetvalue = this.allmonthvaluedata.map(function(a) {return a.targetvalue;});
     this.targetvaluecolour = data.color;
     var c = '["'+this.actualvaluecolour+'","'+ this.targetvaluecolour+'"]';
     this._pageoverviewChartnewvaluefirstmonth(c,_resultvalue,_targetvalue,_publisherName);
   }

  }  
  public onChangeColor(color: string): void {
    console.log('Color changed:', color);
  }

  public onChangeColorCmyk(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);

    if (hsva) {
      const rgba = this.cpService.hsvaToRgba(hsva);

      return this.cpService.rgbaToCmyk(rgba);
    }

    return new Cmyk(0, 0, 0, 0);
  }

  public onChangeColorHex8(color: string): string {
    const hsva = this.cpService.stringToHsva(color, true);

    if (hsva) {
      return this.cpService.outputFormat(hsva, 'rgba', null);
    }

    return '';
  }

}
