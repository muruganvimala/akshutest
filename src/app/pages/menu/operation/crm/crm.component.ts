import { Component, QueryList, ViewChildren,ViewChild, ElementRef,OnInit  } from '@angular/core';
import { FormBuilder, FormControl,FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/API/api.service';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { StateModel, leadModel, dealModel, taskModel } from './crm.model';
import { dealData, statData, taskData } from './data';
import { CRMService } from './crm.service';
import { DecimalPipe, DatePipe  } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdCRMSortableHeader, leadSortEvent } from './crm-sortable.directive';
import { ApexOptions } from 'ng-apexcharts';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};



@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
  providers: [CRMService, DecimalPipe]
})
//CrmComponent
export class CrmComponent {
  colorTheme: any = 'theme-blue';
  currentDate: Date|any;  
  selectedPublisher: string|any;
  publisher:string | any;
  defaultIndex = 0;
  filterForm: FormGroup;

  
  constructor(private fb: FormBuilder, private apiService: ApiService,private http: HttpClient) {
    this.currentDate = new Date();
    this.currentDate.setDate(1);

    this.filterForm = this.fb.group({
      publisher: [this.publishersSorted[0]], // Set the default value here
      monthYear1: [this.currentDate],
      monthYear2: [this.currentDate]
    });   
    
  }
  
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      publisher: [this.publishersSorted[0]], // Set the default value here
      monthYear1: [this.currentDate],
      monthYear2: [this.currentDate]
    });    
        
  }

  onDateSelected(event: Date) {
    this.filterForm.patchValue({
      monthYear1: event
    });
    console.log('onDateSelected');
  }

  onDateSelected1(event: Date) {
    this.filterForm.patchValue({  
      monthYear2: event
    });
    console.log('onDateSelected 1');
  }

  onPublisherChange(selectedValue: any) {
    const controlName = selectedValue.target.value.trim();
    this.selectedPublisher = controlName;
    let monthYear1Value = this.filterForm.get('monthYear1')?.value;
    const date1 = new Date(monthYear1Value);
    const formattedDate = date1.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output1 = formattedDate.replace(' ', ' ');

    let monthYear2Value = this.filterForm.get('monthYear2')?.value;
    const date2 = new Date(monthYear2Value);
    const formattedDate1 = date2.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output2 = formattedDate1.replace(' ', ' ');
    this.callApi(this.selectedPublisher,'AccountManagement',output1,output2);
    // Call your API or perform other actions based on the selected publisher
    //this.callApi(this.selectedPublisher);
  }

  onSelected(event: any) {
    let selectedOption = event.target.value;
    let monthYear1Value = this.filterForm.get('monthYear1')?.value;
    const date1 = new Date(monthYear1Value);
    const formattedDate = date1.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output1 = formattedDate.replace(' ', '-');

    let monthYear2Value = this.filterForm.get('monthYear2')?.value;
    const date2 = new Date(monthYear2Value);
    const formattedDate1 = date2.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output2 = formattedDate1.replace(' ', '-');
    console.log("selectedOption " + selectedOption + " monthYear1 : "+ output1 + " monthYear2 : "+ output2)  
  }

  callApi(publisher: string,metrics:string,fromdate:string,todate:string) {
    this.apiService.GetDataWithToken(`User/apexkpi?PublisherName=${publisher}&Metrics=${metrics}&fromMonthYear=${fromdate}&toMonthYear=${todate}`).subscribe(
      (response) => {
        console.log('response ' + response.data.monthYear);
        console.log('response ' + response.data.target);
        console.log('response ' + response.data.actual);     
        // this.monthYear=response.data.monthYear;
        // this.target =response.data.target;   
        // this.actual =response.data.actual;   
       
		},
      (error) => {
        console.error('Error:', error);
        //this.sweetAlert.failureAlert('Display failure','message:'+ error.error.message + ', error:'+error.error.error,);
      }
	  );    
  }

  publishers: string[] = [
    "CUP",
    "EUP",
    "IWAP",
    "RSC",
    "AIP",
    "APS",
    "APA",
    "ASCE",
    "ERS",
    "FRONTIERS",
    "OUP",
    "PPL",
    "SAGE",
    "TnF",
    "TnF Conversion",
    "TnF Abcats",
    "ASME",
    "COB",
    "GSA",
    "GEO",
    "IET",
    "OSA",
    "RS",
    "SFN",
    "ASCE CP",
    "AIP Conversion",
    "MedRxiv",
    "ICE",
    "BioRxiv",
    "DNS",
    "GSL"
  ]; 

  publishersSorted = this.publishers.slice().sort();

  @ViewChild("chart") chart: ChartComponent|undefined;
  @ViewChild('datepicker') datepicker!: BsDatepickerDirective;

  public chartOptions: ChartOptions = {
    series: [
      {
        name: "Target",
        data: [28, 29, 33, 36, 32, 32, 33,44]
      },
      {
        name: "Actual",
        data: [12, 11, 14, 18, 17, 13, 13,55]
      }
    ],
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      }
    },
    colors: ["#77B6EA", "#545454"],
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: "smooth"
    },
    title: {
      text: "Target & Actual",
      align: "left"
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5
      }
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug"],
      title: {
        text: "Publisher"
      }
    },
    yaxis: {
      title: {
        text: "Value"
      },
      min: 5,
      max: 40
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  };

  
  //function
  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
}