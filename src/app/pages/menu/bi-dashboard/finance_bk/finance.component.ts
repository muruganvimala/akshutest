import { Component, QueryList, ViewChild ,ChangeDetectorRef,EventEmitter, Output,ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { circle, latLng, tileLayer } from 'leaflet';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,FormArray,ReactiveFormsModule} from '@angular/forms';
import { StringChain, head } from 'lodash';
declare var $: any;

import { OnInit } from '@angular/core';

// angular materials
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import Swal from 'sweetalert2';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

const Headers: readonly string[] = [
  'Direct Cost',
  'Indirect Cost',
  'Other Cost',
  'Customer Data'
];

const ServiceLine: readonly string[] = [
  'All',
  'Content Composition',
  'Multimedia Solutions',
  'Digital Transformation',
  'Editorial Solutions',
  'Project Management'
];

const Customers: readonly string[] = [
  'All',
  'AIP',
  'APA',
  'CUP',
  'OUP'
];

const ValueTypes: readonly string[] = [
  'All',
  'INR',
  'GBP',
  'PHP',
  'USD'
];

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  providers: [DatePipe]
})

export class FinanceComponent {
  //filter
  headerList: string[] = ['All','Direct Cost', 'Indirect Cost', 'Customer Data', 'Other Cost'];
  serviceLineList: string[] = ['All','Content Composition', 'Multimedia Solutions', 'Digital Transformation', 'Editorial Solutions', 'Project Management'];
  customerList: any[] = [];
  valueTypesList: string[] = ['All','INR', 'GBP', 'PHP', 'USD'];

  //selectedHeaders = new FormControl([]);
  selectedHeaders = new FormControl<string[]>([...this.headerList]);
  selectedServiceLines = new FormControl<string[]>([...this.serviceLineList]);
  selectedCustomers = new FormControl<string[]>([...this.customerList]);
  selectedValueTypes = new FormControl<string[]>([...this.valueTypesList]);
  
  form!: FormGroup;
  marketverviewChart: any;
  columnChart: any;
  mini6Chart: any;
  mini7Chart: any;
  patternedDonutChart: any;
  simpleDonutChart: any;
  DirectCostList: any[] = [];
  InDirectCostList: any[] = [];
  CustomerDataList: any[] = [];
  OtherCostList: any[] = [];
  header: string | null = '';
  serviceLine: string | null = '';
  customer: string | null = '';
  valueType: string | null = '';
  dateRangeString = '';
  isDatePickerVisible: boolean = false;
  orderList!: any;
  currentchartmodel1:string='';
  currentchartmodel2:string='';
  currentchartmodel3:string='';
  currentchartmodel4:string='';
  currentchartmodel5:string='';
  currentchartmodel6:string='';
  currentparam:any;

 //chart data
  financechartapidata1:any;
  financechartapidata2:any;
  financechartapidata3:any;
  financechartapidata4:any;

  fStartMonth: string = 'Apr 2024';
  fEndMonth: string = 'Sep 2024';

  //month callender
  @Output() monthRangeSelected = new EventEmitter<string>();
  from!: string;
  to!: string;
  selectedRange!:string;
  currentYearIndex!: number;
  years!: Array<number>;
  months!: Array<string>;
  monthsData!: Array<{
    monthName: string,
    monthYear: number,
    isInRange: boolean,
    isLowerEdge: boolean,
    isUpperEdge: boolean
  }>;
  rangeIndexes!: Array<number | null>;  // Allow null to handle uninitialized state
  monthViewSlicesIndexes!: Array<number>;
  monthDataSlice!: Array<{
    monthName: string,
    monthYear: number,
    isInRange: boolean,
    isLowerEdge: boolean,
    isUpperEdge: boolean
  }>;
  globalIndexOffset!: number;
  calendarVisible = false;
  currentMonthYear!: string;
  //end------------

public chartOptions1: Partial<ChartOptions> | any;
public chartOptions2: Partial<ChartOptions> | any;
public chartOptions3: Partial<ChartOptions> | any;
public chartOptions4: Partial<ChartOptions> | any;
public chartOptions5: Partial<ChartOptions> | any;
public chartOptions6: Partial<ChartOptions> | any;

public chartData1: any;
public chartData2: any;
public chartData3: any;
public chartData4: any;
public chartData5: any;
public chartData6: any;
//
  report1ChartType: string = '';
  report2ChartType: string = '';

  monthRange: FormControl = new FormControl();

  productdetail: any;
  sortValue: any = 'Order Date';

  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild('productModal', { static: false }) productModal?: ModalDirective;
  @ViewChild('revenueChart') revenueChart!: ElementRef<ChartOptions>;

constructor(private apiService: ApiService, private fb: FormBuilder,private sweetalert: SweetAlertService,private cdr: ChangeDetectorRef, private datePipe: DatePipe,) {
  const today = new Date();
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const secondLastMonthDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  this.from = this.datePipe.transform(secondLastMonthDate, 'MMM yyyy') ?? '';
  this.to = this.datePipe.transform(lastMonthDate, 'MMM yyyy') ?? '';
  this.selectedRange =`${this.from} - ${this.to}`;
  
  this.currentchartmodel1="pie";
  this.currentchartmodel2="bar";
  this.currentchartmodel3="bar";
  this.currentchartmodel4="bar";

  const aparam: any = {
    heading: "all",
    serviceline: "all",
    customers: "all",
    valuetype: "all",
    startMonth: "Apr 2024",
    endMonth: "Dec 2024"
  };

this.currentparam =aparam;
}

disableAll:boolean=false;
enableAll:boolean=false;
isSelectedVal:boolean=false;

isfirstTime1:boolean=false;
isAllFound1:boolean=false;

toggle:boolean=false;

onSelectionChange1(event: MatSelectChange) {
  console.log('Current selected value:', event.value);

  // Trigger the report update
  this.financeFilterReport(
    this.selectedHeaders.value?.join(',') || '',
    this.selectedServiceLines.value?.join(',') || '',
    this.selectedCustomers.value?.join(',') || '',
    this.selectedValueTypes.value?.join(',') || '',
    this.from,
    this.to
  );
}


isfirstTime2:boolean=false;
onSelectionChange2(event: MatSelectChange) {
  const selectedValues = this.selectedServiceLines.value || [];
  const currentValue = event.value;
  console.log('Current selected value:', currentValue);
if(selectedValues.includes('All') && this.isfirstTime2==false){
  this.isfirstTime2=true;
}
else if(selectedValues.includes('All'))
{
  this.isfirstTime2=false;
}
  if (selectedValues.includes('All')) {
    if (selectedValues.length === 1) {
      // If only 'All' is selected, select all options
      this.selectedServiceLines.setValue([...this.serviceLineList]);
    }
    else if(this.isfirstTime2==false)
      {
        this.selectedServiceLines.setValue([...this.serviceLineList]);
      }
    else {
      // If 'All' is selected along with others, deselect 'All'
      const newSelectedValues = selectedValues.filter(value => value !== 'All');
      this.selectedServiceLines.setValue(newSelectedValues);
    }
  } else {
    const allOtherSelected = this.serviceLineList
      .filter(header => header !== 'All')
      .every(header => selectedValues.includes(header));
    
    if (allOtherSelected) {
      // If all other options are selected, select 'All'
      this.selectedServiceLines.setValue([...this.serviceLineList]);
    }
  }

  this.financeFilterReport(
    this.selectedHeaders.value?.join(','),
    this.selectedServiceLines.value?.join(','),
    this.selectedCustomers.value?.join(','),
    this.selectedValueTypes.value?.join(','),
    this.from,
    this.to
  );
}

isfirstTime3:boolean=false;
onSelectionChange3(event: MatSelectChange) {
  const selectedValues = this.selectedCustomers.value || [];
  const currentValue = event.value;
  console.log('Current selected value:', currentValue);
if(selectedValues.includes('All') && this.isfirstTime3==false){
  this.isfirstTime3=true;
}
else if(selectedValues.includes('All'))
{
  this.isfirstTime3=false;
}
  if (selectedValues.includes('All')) {
    if (selectedValues.length === 1) {
      // If only 'All' is selected, select all options
      this.selectedCustomers.setValue([...this.customerList]);
    }
    else if(this.isfirstTime3==false)
      {
        this.selectedCustomers.setValue([...this.customerList]);
      }
    else {
      // If 'All' is selected along with others, deselect 'All'
      const newSelectedValues = selectedValues.filter(value => value !== 'All');
      this.selectedCustomers.setValue(newSelectedValues);
    }
  } else {
    const allOtherSelected = this.customerList
      .filter(header => header !== 'All')
      .every(header => selectedValues.includes(header));
    
    if (allOtherSelected) {
      // If all other options are selected, select 'All'
      this.selectedCustomers.setValue([...this.customerList]);
    }
  }
  this.financeFilterReport(
    this.selectedHeaders.value?.join(','),
    this.selectedServiceLines.value?.join(','),
    this.selectedCustomers.value?.join(','),
    this.selectedValueTypes.value?.join(','),
    this.from,
    this.to
  );
}

isfirstTime4:boolean=false;
onSelectionChange4(event: MatSelectChange) {
  const selectedValues = this.selectedValueTypes.value || [];
  const currentValue = event.value;
  console.log('Current selected value:', currentValue);
if(selectedValues.includes('All') && this.isfirstTime4==false){
  this.isfirstTime4=true;
}
else if(selectedValues.includes('All'))
{
  this.isfirstTime4=false;
}
  if (selectedValues.includes('All')) {
    if (selectedValues.length === 1) {
      // If only 'All' is selected, select all options
      this.selectedValueTypes.setValue([...this.valueTypesList]);
    }
    else if(this.isfirstTime4==false)
      {
        this.selectedValueTypes.setValue([...this.valueTypesList]);
      }
    else {
      // If 'All' is selected along with others, deselect 'All'
      const newSelectedValues = selectedValues.filter(value => value !== 'All');
      this.selectedValueTypes.setValue(newSelectedValues);
    }
  } else {
    const allOtherSelected = this.valueTypesList
      .filter(header => header !== 'All')
      .every(header => selectedValues.includes(header));
    
    if (allOtherSelected) {
      // If all other options are selected, select 'All'
      this.selectedValueTypes.setValue([...this.valueTypesList]);
    }
  }
  this.financeFilterReport(
    this.selectedHeaders.value?.join(','),
    this.selectedServiceLines.value?.join(','),
    this.selectedCustomers.value?.join(','),
    this.selectedValueTypes.value?.join(','),
    this.from,
    this.to
  );
}

financeFilterReport(header: string|undefined,serviceLine: string|undefined,
  customer: string|undefined,
  valueType: string|undefined,
  from: string|undefined,
  to: string|undefined
) {
  console.log('financeFilterReport function triggered');

  const param = {
    heading: header,//"directcost",
    serviceline: serviceLine,// ["Content Composition", "Editorial Solutions", "Digital Transformation"],
    customers: customer,//"all",
    valueType: valueType,
    startMonth: from,//"Apr 2024",
    endMonth: to //"Sep 2024"
  }

  console.log(param);
  this.currentparam = param;
  console.log("currentparam" + this.currentparam);
  //this.getchartDataFromAPI(param, this.currentchartmodel1);
  //this.getchartDataFromAPI2(param, this.currentchartmodel2);

  //console.log(param);
  this.currentparam = param;
  console.log("currentparam" + this.currentparam);
  this.getchartDataFromAPI1(this.currentparam,this.currentchartmodel1);
  this.getchartDataFromAPI2(this.currentparam,this.currentchartmodel2);
  this.getchartDataTop10Customer(this.currentparam,this.currentchartmodel3);
  this.getchartDataExsitingandNew(this.currentparam,this.currentchartmodel4);
  this.initMixedChart5_1();
  this._lineWithDataLabelsChart('["--tb-primary", "--tb-success"]');
}

//filter

selectAllHeaders(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  
}

selectAllServiceLine(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  
}

selectAllCustomers(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
 
}

selectAllValueTypes(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  
}

 //taiga
 
readonly headerControl = new FormControl([Headers[0]]);
readonly serviceLineControl = new FormControl([ServiceLine[0]]);
readonly customerControl = new FormControl([Customers[0]]);
readonly valueTypeControl = new FormControl([ValueTypes[0]]);

showDatePicker() {
  this.isDatePickerVisible = true;
}

hideDatePicker() {
  this.isDatePickerVisible = false;
}


ngOnInit(): void {
  
  //month calendar
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  console.log('year ' + year);
  this.currentMonthYear = `${month} ${year}`;
  this.years = [2022, 2023, 2024];
  this.currentYearIndex = this.years.findIndex(year => year === new Date().getFullYear());
  this.initYearLabels();
  this.initMonthLabels();
  this.initViewSlices();
  this.initMonthsData();
  this.initRangeIndexes(); 
  this.sliceDataIntoView();

  this.getPublishers();
  this.getchartDataFromAPI1(this.currentparam,this.currentchartmodel1);
  this.getchartDataFromAPI2(this.currentparam,this.currentchartmodel2);
  this.getchartDataTop10Customer(this.currentparam,this.currentchartmodel3);
  this.getchartDataExsitingandNew(this.currentparam,this.currentchartmodel4);
  this.initMixedChart5_1();
  this._lineWithDataLabelsChart('["--tb-primary", "--tb-success"]');

}

//month callender
onClick(indexClicked: number) {
  if (this.rangeIndexes[0] === null) {
    this.rangeIndexes[0] = this.globalIndexOffset + indexClicked;
  } else if (this.rangeIndexes[1] === null) {
    this.rangeIndexes[1] = this.globalIndexOffset + indexClicked;
    this.rangeIndexes.sort((a, b) => a! - b!);  // Use non-null assertion operator
    this.monthsData.forEach((month, index) => {
      month.isInRange = this.rangeIndexes[0]! <= index && index <= this.rangeIndexes[1]!;
      month.isLowerEdge = this.rangeIndexes[0] === index;
      month.isUpperEdge = this.rangeIndexes[1] === index;
    });
    let fromMonthYear = this.monthsData[this.rangeIndexes[0]!];
    let toMonthYear = this.monthsData[this.rangeIndexes[1]!];
    this.emitData(`Range is: ${fromMonthYear.monthName} ${fromMonthYear.monthYear} to ${toMonthYear.monthName} ${toMonthYear.monthYear}`);
    this.calendarVisible = false;
    this.from=`${fromMonthYear.monthName} ${fromMonthYear.monthYear-1}`;
    this.to=`${toMonthYear.monthName} ${toMonthYear.monthYear-1}`;
    this.selectedRange=`${this.from} - ${this.to}`;
    
    $('#range').val(this.selectedRange);
    this.financeFilterReport(
      this.selectedHeaders.value?.join(','),
      this.selectedServiceLines.value?.join(','),
      this.selectedCustomers.value?.join(','),
      this.selectedValueTypes.value?.join(','),
      this.from,
      this.to
    );
  } else {
    this.initRangeIndexes();
    this.initMonthsData();
    this.onClick(indexClicked);
    this.sliceDataIntoView();
  }

}

emitData(data: string) {
  this.monthRangeSelected.emit(data);
}
sliceDataIntoView() {
  this.globalIndexOffset = this.monthViewSlicesIndexes[this.currentYearIndex];
  this.monthDataSlice = this.monthsData.slice(this.globalIndexOffset, this.globalIndexOffset + 24);
}
incrementYear() {
  if (this.currentYearIndex < this.years.length - 1) {
    this.currentYearIndex++;
    this.sliceDataIntoView();
  }
}
decrementYear() {
  if (this.currentYearIndex > 0) {
    this.currentYearIndex--;
    this.sliceDataIntoView();
  }
}
initRangeIndexes() {
  this.rangeIndexes = [null, null];
}
initMonthsData() {
  this.monthsData = [];
  this.years.forEach(year => {
    this.months.forEach(month => {
      this.monthsData.push({
        monthName: month,
        monthYear: year,
        isInRange: false,
        isLowerEdge: false,
        isUpperEdge: false
      });
    });
  });
}
initYearLabels() {
  const currentYear = new Date().getFullYear();
  const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
  this.years = range(currentYear - 1, currentYear + 5, 1);
}

initMonthLabels() {
  this.months = new Array(12).fill(0).map((_, i) => {
    return new Date(2020, i).toLocaleDateString(undefined, { month: 'short' });  // Use a fixed year to ensure correct month names
  });
}

initViewSlices() {
  this.monthViewSlicesIndexes = [];
  this.years.forEach((year, index) => {
    if (index === 0) {
      this.monthViewSlicesIndexes.push(0);
    } else if (index === 1) {
      this.monthViewSlicesIndexes.push(6);
    } else {
      this.monthViewSlicesIndexes.push(this.monthViewSlicesIndexes[index - 1] + 12);
    }
  });
}

onFocus() {
  this.calendarVisible = true;
  console.log('Input field is focused');
  // Additional logic for the focus event can go here
}

onFocusOut() {
  this.calendarVisible = false;
}

closeModal(event: Event) {
  this.calendarVisible = false;
  console.log('Modal closed');
}
//end
getPublishers(): void {
  this.apiService.GetDataWithToken('Publisher/Display').subscribe(
    (response) => {
      this.customerList = response.data;
        this.customerList = this.customerList.map(item => item.acronym);
        this.customerList.unshift('All');
        //this.selectedCustomers = new FormControl<string[]>([this.customerList[0]]);
        this.selectedCustomers = new FormControl<string[]>([...this.customerList]);
    },
    (error) => {
      //console.error('Error:', error);
    }
  );
}

    //murugan chart
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

  onChartTypeChange1(chartType: string) {
    if (chartType === 'bar') {
      this.currentchartmodel1="bar";
      this.initBarChart1_1(this.financechartapidata1);
    } else if (chartType === 'pie') {
    this.currentchartmodel1="pie";
    this.initPieChart1_2(this.financechartapidata1);
  }
    else if(chartType==='pyramid'){
      this.currentchartmodel1="pyramid";
      this.initPyramidChart1_3(this.financechartapidata1);
    }
    else if (chartType === 'area') {
      this.currentchartmodel1="area";
      this.initAreaChart1_4(this.financechartapidata1);
    } else if(chartType==='line'){
      this.currentchartmodel1="line";
      this.initLineChart1_5(this.financechartapidata1);
    }
    console.log("chart 1 tyep:  "+this.currentchartmodel1);
  } 

  onChartTypeChange2(chartType: string) {
    if (chartType === 'bar') {
      this.currentchartmodel2="bar";
      this.initBarChart2(this.financechartapidata2);
    } else if (chartType === 'pie') {
      this.currentchartmodel2="pie";
      this.initPieChart2(this.financechartapidata2);
    }
    else if(chartType==='line'){
      this.currentchartmodel2="line";
      this.initLineChart2_4(this.financechartapidata2);
    }else if(chartType==='area'){
      this.currentchartmodel2="area";
      this.initSplineAreaChart(this.financechartapidata2);
    }
    else if(chartType==='pyramid'){
      this.currentchartmodel2="pyramid";
      this.initPyramidChart2_5(this.financechartapidata2);
    }
  }
  
  onChartTypeChange3(chartType: string) {
    if (chartType === 'pie') {
      this.currentchartmodel3="pie";
      this.initPieChart3_4(this.financechartapidata3);
    } else if (chartType === 'area') {
      this.currentchartmodel3="area";
      this.initPolarAreaChart3_2(this.financechartapidata3);
    }
    else if(chartType==='bar'){
      this.currentchartmodel3="bar";
      this.initBarChart3_1(this.financechartapidata3);
    }else if(chartType==='line'){
      this.currentchartmodel3="line";
      this.initLineChart3_3(this.financechartapidata3);
    }
    else if(chartType==='pyramid'){
      this.currentchartmodel3="pyramid";
      this.initPyramidChart3_5(this.financechartapidata3);
    }
  }
  
  onChartTypeChange4(chartType: string) {
    if (chartType === 'bar') {
      this.currentchartmodel4 = "bar";
      this.initBarChart4_1(this.financechartapidata4);
    } else if (chartType === 'pie') {
      this.currentchartmodel4 = "pie";
      this.initPolarAreaChart4_2(this.financechartapidata4);
    }
    else if(chartType==='treemap'){
      this.currentchartmodel4 = "treemap";
      this.initTreeMapChart4_3(this.financechartapidata4);
    }
    else if (chartType === 'area') {
      this.currentchartmodel4 = "area";
      this.initAreaChart4_4(this.financechartapidata4);
    }
    else if(chartType==='line'){
      this.currentchartmodel4 = "line";
      this.initLineChart4_5(this.financechartapidata4);
    }
  }
  
  onChartTypeChange5(chartType: string) {
    if (chartType === 'bar') {
      this.initMixedChart5_1();
      //this.getchartDataFromAPI(this.chartData3,"bar");
    } else if (chartType === 'multiple') {
      this.initMixedChart5_2();
      //this.getchartDataFromAPI(this.chartData3,"pie");
    }
    else if(chartType==='linearea'){
      this.initMixedChart5_3();
    }else if(chartType==='line'){
      //this.initSplineAreaChart();
      //this.initLineChart5_3();
    }
  }
  onChartTypeChange6(event: any) {
    const chartType = event.target.value;
    // if (chartType === 'bar') {
    //   this.getchartDataFromAPI(this.chartData3,"bar");
    // } else if (chartType === 'pie') {
    //   this.getchartDataFromAPI(this.chartData3,"pie");
    // }
    // else if(chartType==='pyramid'){
    //   this.getchartDataFromAPI(this.chartData3,"pyramid");
    // }else if(chartType==='line'){
    //   this.initSplineAreaChart();
    // }
  }
  
  
  getchartDataFromAPI1(currentData: any, charttype: string) {
    //console.log('Calling financechart1 api');
    this.apiService.postDataWithToken(`api/dashboard/financechart1?chartType=${charttype}`, currentData).subscribe({
      next: (response) => {
        //console.log("labels " + response.data.labels);
        //console.log("series " + response.data.series);
        this.financechartapidata1= response.data
        if(charttype==='bar'){
          this.currentchartmodel1="bar";
          this.initBarChart1_1(this.financechartapidata1);
        }
        else if(charttype==='pie'){
          this.currentchartmodel1="pie";
          this.initPieChart1_2(this.financechartapidata1);
        }
        else if(charttype==='pyramid'){
          this.currentchartmodel1="pyramid";
          this.initPyramidChart1_3(this.financechartapidata1);
        }
        else if(charttype==='area'){
          this.currentchartmodel1="area";
          this.initAreaChart1_4(this.financechartapidata1);
        }else if(charttype==='line'){
          this.currentchartmodel1="line";
          this.initLineChart1_5(this.financechartapidata1);
        }  
      },
      error: (error) => {
      //console.error('Error:', error);
      this.sweetalert.failureAlert('Unable to get bi report data', error.message);
      }
    });
  }
  
  getchartDataFromAPI2(currentData: any, charttype: string) {
    //console.log('Calling financechart2 api');
    this.apiService.postDataWithToken(`api/dashboard/financechart2?chartType=${charttype}`, currentData).subscribe({
      next: (response) => {
        //console.log(response.data.labels);
        //console.log(response.data.series);
        this.financechartapidata2 = response.data;
        if (charttype === 'bar') {
          this.currentchartmodel2="bar";
          this.initBarChart2(this.financechartapidata2);
        } else if (charttype === 'pie') {
          this.currentchartmodel2="pie";
          this.initPieChart2(this.financechartapidata2);
        }
        else if(charttype==='line'){
          this.currentchartmodel2="line";
          this.initLineChart2_4(this.financechartapidata2);
        }else if(charttype==='area'){
          this.currentchartmodel2="area";
          this.initSplineAreaChart(this.financechartapidata2);
        }
        else if(charttype==='pyramid'){
          this.currentchartmodel2="pyramid";
          this.initPyramidChart2_5(this.financechartapidata2);
        }        
      },
      error: (error) => {
        ////console.error('Error:', error);
        this.sweetalert.failureAlert('Unable to get bi report data', error.message);
      }
    });
  }

  getchartDataTop10Customer(currentData: any, charttype: string) {
    //console.log('Calling financechart3 api');
    this.apiService.postDataWithToken(`api/dashboard/financecharttop10customer?chartType=${charttype}`, currentData).subscribe({
      next: (response) => {
        //console.log('financechart3 ' + response.data.labels);
        //console.log('financechart3 ' +response.data.series);
        this.financechartapidata3 = response.data;
        if(charttype==='bar'){
          this.initBarChart3_1(this.financechartapidata3);
        }
        else if(charttype==='pie'){
          this.initPolarAreaChart3_2(this.financechartapidata3);
        }
        else if(charttype==='line'){
          this.initLineChart3_3(this.financechartapidata3);
        }
        
      },
      error: (error) => {
        ////console.error('Error:', error);
        //this.sweetAlert.failureAlert('Unable to get bi report data', error.message);
      }
    });
  }

  getchartDataExsitingandNew(currentData: any, charttype: string) {
    //console.log('Calling ExsitingandNew api');
    //api/dashboard/financechart2
    this.apiService.postDataWithToken(`api/dashboard/financechartexistingandnewdata?chartType=${charttype}`, currentData).subscribe({
      next: (response) => {        
        
        this.financechartapidata4 = response.data;
        if(charttype==='bar'){
          this.currentchartmodel4="bar";
          this.initBarChart4_1(this.financechartapidata4);
        }
        else if(charttype==='pie'){
          this.currentchartmodel4="pie";
          this.initPolarAreaChart4_2(this.financechartapidata4);
        }
        else if(charttype==='treemap'){
          this.currentchartmodel4="treemap";
          this.initTreeMapChart4_3(this.financechartapidata4);
        }
        else if(charttype==='line'){
          this.currentchartmodel4="line";
          this.initLineChart4_5(this.financechartapidata4);
        }
      },
      error: (error) => {
        ////console.error('Error:', error);
        this.sweetalert.failureAlert('Unable to get bi report data', error.message);
      }
    });
  }
  
   //chart 1
   initBarChart1_1(apiData: any) {
    this.chartOptions1 = {
      series: [
        {
          name: "basic",
          data: apiData.series
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          }
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: apiData.labels
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
  }  

  initPieChart1_2(apiData: any) {
    this.chartOptions1 = {
      series: apiData.series,
      chart: {
        type: "donut",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          }
        }
      },  
      labels: apiData.labels, // Use the labels directly from the API response
      responsive: [
        {
          breakpoint: 480,
          options: {
            // chart: {
            //   width: 200
            // },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  initPyramidChart1_3(apiData: any) {
    const curcolors = this.getChartColorsArray('["--tb-primary"]');
    this.chartOptions1 = {
      series: [
        {
          name: "",
          data: apiData.series
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          distributed: true,
          barHeight: "80%",
          isFunnel: true
        }
      },
      colors: curcolors,
      dataLabels: {
        enabled: true,
        formatter: function (val:any, opt:any) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: true
        }
      },
      title: {
        text: "Pyramid Chart",
        align: "center"
      },
      xaxis: {
        categories: apiData.labels
      },
      legend: {
        show: false
      }
    };
  }

  shortenLabel(label: string, maxLength: number = 10): string {
    if (label.length > maxLength) {
      return label.slice(0, maxLength) + '...';
    }
    return label;
  }

  initAreaChart1_4(apiData: any) {
    const curcolors = this.getChartColorsArray('["--tb-primary"]');
    //console.log(" initAreaChart1_4 " + apiData.series[0]);
    const shortenedLabels = apiData.labels.map((label: string) => {
      return label.split(' ').map(word => word.charAt(0)).join('');
  });
    this.chartOptions1 = {
      series: [
        {
          name: "Percentage",
          data: apiData.series
        }
      ],
      chart: {
        type: "area",
        height: 350
      },     
      xaxis: {
        categories: shortenedLabels
      },
      yaxis: {
        title: {
          text: 'Percentage'
        },
        labels: {
          formatter: (val:any) => `${val}%`
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 5
      },
      tooltip: {
        y: {
          formatter: (val: any) => `${val}%`
        },
        x: {
          // Custom tooltip formatter to show the full label
          formatter: (val: any, opts: any) => {
            return apiData.labels[opts.dataPointIndex];
          }
        }
      }
    };    
  }

  initLineChart1_5(apiData: any) {
    const curcolors = this.getChartColorsArray('["--tb-primary"]');
    this.chartOptions1 = {
      series: [
        {
          name: "Percentage",
          data: apiData.series
        }
      ],
      chart: {
        type: "line",
        height: 350
      },     
      xaxis: {
        categories: apiData.labels,
        title: {
          text: 'Service Lines'
        }
      },
      yaxis: {
        title: {
          text: 'Percentage'
        },
        labels: {
          formatter: (val:any) => `${val}%`
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'solid'
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      markers: {
        size: 5
      },
      title: {
        text: 'Service Line Performance',
        align: 'left'
      }
    };
  }

    //chart 2
  initPieChart2(apiData: any) {
    this.chartOptions2 = {
      series: apiData.series,
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: apiData.labels,
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        formatter: function(seriesName:any, opts:any) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }
    
  initBarChart2(apiData: any) {
    this.chartOptions2 = {
      series: [
        {
          name: "basic",
          data: apiData.series
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          }
        },
        zoom: {
          enabled: false
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: apiData.labels
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
  }

  initSplineAreaChart(apiData: any) {
    //console.log('triggered initSplineAreaChart');
  
    this.chartOptions2 = {
      series: [
        {
          name: 'Service Line', // Add a name for the series
          data: apiData.series
        }
      ],
      chart: {
        type: 'area',
        height: 350
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 5, // Adjust the size of the markers
        colors: ['#FFA41B'], // Customize marker colors
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      xaxis: {
        categories: apiData.labels, // Use labels from API data as categories
        labels: {
          formatter: function(val: any) {
            return val; // Display labels as they are
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      }
    };
  }
  
  initLineChart2_4(apiData: any) {
    const curcolors = this.getChartColorsArray('["--tb-primary"]');
    this.chartOptions2 = {
      series: [
        {
          name: "Percentage",
          data: apiData.series
        }
      ],
      chart: {
        type: "line",
        height: 350
      },     
      xaxis: {
        categories: apiData.labels,
        title: {
          text: 'Service Lines'
        }
      },
      yaxis: {
        title: {
          text: 'Percentage'
        },
        labels: {
          formatter: (val:any) => `${val}%`
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'solid'
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      markers: {
        size: 5
      },
      title: {
        text: 'Service Line Performance',
        align: 'left'
      }
    };
  }

  initPyramidChart2_5(apiData: any) {
    const curcolors = this.getChartColorsArray('["--tb-primary"]');
    this.chartOptions2 = {
      series: [
        {
          name: "",
          data: apiData.series
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          distributed: true,
          barHeight: "80%",
          isFunnel: true
        }
      },
      colors: curcolors,
      dataLabels: {
        enabled: true,
        formatter: function (val:any, opt:any) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: true
        }
      },
      title: {
        text: "Pyramid Chart",
        align: "center"
      },
      xaxis: {
        categories: apiData.labels
      },
      legend: {
        show: false
      }
    };
  }
  //chart 3
  initBarChart3_1(apiData: any) {
      
    this.chartOptions3 = {
      series: [
        {
          name: "Percentage",
          data: apiData.series
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return `${val}%`;
        }
      },
      xaxis: {
        categories: apiData.labels
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal', // Can be 'vertical' or 'diagonal'
          shadeIntensity: 0.5,
          gradientToColors: undefined, // Array of colors to transition to
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      colors: [
        "#33b2df", "#546E7A", "#d4526e", "#13d8aa", "#A5978B", 
        "#2b908f", "#f9a3a4", "#90ee7e", "#f48024", "#69d2e7",
        "#FF4560", "#775DD0"
      ]
    };
  }
  
  initPolarAreaChart3_2(apiData: any) {   
    this.chartOptions3 = {
      series: apiData.series,
      chart: {
        width: 380,
        type: 'polarArea'
      },
      labels: apiData.labels,
      fill: {
        opacity: 1,
        colors: ['rgb(0, 143, 251)'] // Fill color for all values
      },
      stroke: {
        width: 1,
        colors: undefined
      },
      yaxis: {
        show: false
      },
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0
          }
        }
      },
      colors: ['rgb(0, 143, 251)'], // Apply the same fill color to all series
    };
   
  }
  
  initLineChart3_3(apiData: any) {
   
    this.chartOptions3 = {
      series: [
        {
          name: "Percentage",
          data: apiData.series // Use percentage data
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      stroke: {
        width: 7,
        curve: "smooth"
      },
      xaxis: {
        categories: apiData.labels
      },
      title: {
        text: "Social Media",
        align: "left",
        style: {
          fontSize: "16px",
          color: "#666"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 4,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: "Engagement (%)"
        },
        labels: {
          formatter: function (val: any) {
            return val + "%"; // Show percentage
          }
        }
      }
    };
  }

  initPieChart3_4(apiData: any) {
    this.chartOptions3 = {
      series: apiData.series,
      chart: {
        height: 350,
        type: "pie"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: apiData.labels,
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 0,
        offsetY: 0,
        labels: {
          useSeriesColors: true
        },
        formatter: function(seriesName:any, opts:any) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }

  initPyramidChart3_5(apiData: any) {
    const curcolors = this.getChartColorsArray('["--tb-primary"]');
    this.chartOptions3 = {
      series: [
        {
          name: "",
          data: apiData.series
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          distributed: true,
          barHeight: "80%",
          isFunnel: true
        }
      },
      colors: curcolors,
      dataLabels: {
        enabled: true,
        formatter: function (val:any, opt:any) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: true
        }
      },
      title: {
        text: "Pyramid Chart",
        align: "center"
      },
      xaxis: {
        categories: apiData.labels
      },
      legend: {
        show: false
      }
    };
  }

    //chart 4
    initBarChart4_1(apiData: any) {
      this.chartOptions4 = {
        series: [
          {
            name: "Value",
            data: apiData.series
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: false,
            dataLabels: {
              enabled: true,
              style: {
                colors: ["#fff"]
              },
              formatter: function(val: any, opt: any) {
                // Return only the value
                return val;
              },
              offsetX: 0,
              dropShadow: {
                enabled: true
              }
            }
          }
        },
        colors: [
          "#33b2df",
          "#546E7A"
        ],
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#fff"]
          },
          formatter: function(val: any, opt: any) {
            // Return only the value
            return val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: ["Existing", "New"],
          labels: {
            style: {
              fontSize: '12px',
              fontWeight: 700
            }
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        title: {
          align: "center",
          floating: true
        },
        subtitle: {
          text: "Existing and New",
          align: "center"
        },
        tooltip: {
          theme: "dark",
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function() {
                return "Value";
              }
            }
          }
        }
      };
    }

    initPolarAreaChart4_2(apiData: any) {
      this.chartOptions4 = {
        series: apiData.series,
        chart: {
          type: "polarArea",
          height: 350
        },
        stroke: {
          colors: ["#fff"]
        },
        fill: {
          opacity: 0.8
        },
        labels: apiData.labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
                height:350
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]     
    
      };
    }
    
    initTreeMapChart4_3(apiData: any) {
      this.chartOptions4 = {
        series: [
          {
            name: "Desktops",
            data: [
              {
                x: "Existing",
                y: apiData.series[0]
              }
                      
            ]
          },
          {
            name: "Mobile",
            data: [
              {
                x: "New",
                y: apiData.series[1]
              }          
            ]
          }
        ],
    
        legend: {
          show: false
        },
        chart: {
          type: "treemap",
          height:350
        },
        title: {
          text: "Multi-dimensional Treemap",
          align: "center"
        }
      };
    }

    initAreaChart4_4(apiData: any) {
      this.chartOptions4 = {
        series: [
          {
            name: "Percentage",
            data: apiData.series
          }
        ],
        chart: {
          height: 350,
          type: "area"
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        xaxis: {
          categories: [
            "Existing",
            "New"
          ]
        },
        tooltip: {
          y: {
            formatter: (val: any) => `${val}`
          },
          x: {
            formatter: (val: any, opts: any) => {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          }
        }
      };
      
    }

    initLineChart4_5(apiData: any) {
      this.chartOptions4 = {
        series: [
          {
            name: "Desktops",
            data: apiData.series
          }
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Product Trends by Month",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories:apiData.labels
        }
      };
    }
    
  //chart 5 
  
  initMixedChart5_1() {
    this.chartOptions5 = {
        series: [{
          name: 'New Business',
          type: 'column',
          data: [35,50,65]
        }, {
          name: 'Selling Cost',
          type: 'line',
          data: [40,60,80]
        }],
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
          toolbar: {
            show: false,
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [1, 1, 4]
        },
        title: {
          text: 'XYZ - Stock Analysis (2009 - 2016)',
          align: 'left',
          offsetX: 110,
          style: {
            fontWeight: 600,
          },
        },
        xaxis: {
          categories: ['Apr-24', 'May-24','jun-24'],
        },
        yaxis: [{
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#405189'
          },
          labels: {
            style: {
              colors: '#405189',
            }
          },
          title: {
            text: "Income (thousand crores)",
            style: {
              color: '#405189',
              fontWeight: 600
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: 'Income',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#405189'
          },
          labels: {
            style: {
              colors: '#405189',
            }
          },
          title: {
            text: "Operating Cashflow (thousand crores)",
            style: {
              color: '#405189',
              fontWeight: 600
            }
          },
        },
        {
          seriesName: 'Revenue',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#63ad6f'
          },
          labels: {
            style: {
              colors: '#63ad6f',
            },
          },
          title: {
            text: "Revenue (thousand crores)",
            style: {
              color: '#63ad6f',
              fontWeight: 600
            }
          }
        },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        }
  
    };
  }
  
  initMixedChart5_2() {
    this.chartOptions5 = {
      series: [
        {
          name: "New Business",
          type: "column",
          data: [35,50,65]
        },
        {
          name: "Selling Cost",
          type: "column",
          data: [33,48,50]
        },
        {
          name: "Revenue",
          type: "line",
          data: [40,60,80]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 4]
      },
      title: {
        text: "XYZ - Stock Analysis (2009 - 2016)",
        align: "left",
        offsetX: 110
      },
      xaxis: {
        categories: ['Apr-24', 'May-24','jun-24']
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#008FFB"
          },
          labels: {
            style: {
              color: "#008FFB"
            }
          },
          title: {
            text: "Income (thousand crores)",
            style: {
              color: "#008FFB"
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: "Income",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#00E396"
          },
          labels: {
            style: {
              color: "#00E396"
            }
          },
          title: {
            text: "Operating Cashflow (thousand crores)",
            style: {
              color: "#00E396"
            }
          }
        },
        {
          seriesName: "Revenue",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#FEB019"
          },
          labels: {
            style: {
              color: "#FEB019"
            }
          },
          title: {
            text: "Revenue (thousand crores)",
            style: {
              color: "#FEB019"
            }
          }
        }
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      }
    };
  }
  
  initMixedChart5_3() {
    this.chartOptions5 = {
      series: [
        {
          name: "New Business",
          type: "area",
          data: [35,50,65]
        },
        {
          name: "Selling Cost",
          type: "line",
          data: [40,60,80]
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      stroke: {
        curve: "smooth"
      },
      fill: {
        type: "solid",
        opacity: [0.35, 1]
      },
      labels:['Apr-24', 'May-24','jun-24'],
      markers: {
        size: 0
      },
      yaxis: [
        {
          title: {
            text: "Series A"
          }
        },
        {
          opposite: true,
          title: {
            text: "Series B"
          }
        }
      ],
      xaxis: {
        labels: {
          trim: false
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function(y:any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          }
        }
      }
    };
  }
  
   
  //chart 6
  private _lineWithDataLabelsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.chartOptions6 = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [3, 3],
        curve: 'straight'
      },
      series: [{
        name: "Target",
        data: [260, 240, 320, 360, 330]
      },
      {
        name: "Production",
        data: [140, 101, 160, 120, 170]
      }
      ],
      title: {
        // text: 'Average High & Low Temperature',
        align: 'left',
        style: {
          fontWeight: 400,
        },
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.2
        },
        borderColor: '#f1f1f1'
      },
      markers: {
        size: 6
      },
      xaxis: {
        categories: ['Content Composition', 'Editorial Solutions', 'Multimedia Solutions', 'Digital Transformation', 'Project Management']
      },
      axisBorder: {
        show: true,
      },
      yaxis: {
        title: {
          text: 'Temperature'
        },
        axisBorder: {
          show: true,
        },
        min: 5,
        max: 40
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: 0,
        offsetX: 0
      }
    };
  
    const attributeToMonitor = 'data-theme';
  
    const observer = new MutationObserver(() => {
      this._lineWithDataLabelsChart('["--tb-primary", "--tb-success"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }



  fullscreen(chartContainerId: string, chartTitle: string): void {
    const chartContainer = document.getElementById(chartContainerId);
    if (!chartContainer) {
      console.error("Chart container not found.");
      return;
    }
  
    const clonedChartContainer = chartContainer.cloneNode(true) as HTMLElement;
  
    const modalTitleElement = document.querySelector("#chartModal .modal-title");
    if (modalTitleElement) {
      modalTitleElement.textContent = chartTitle;
    }
  
    const modalBodyElement = document.querySelector("#chartModalBody");
    if (modalBodyElement) {
      modalBodyElement.innerHTML = ""; // Clear existing content
      modalBodyElement.appendChild(clonedChartContainer);
    }
  
    $('#chartModal').modal('show');
  }
  

 

}
