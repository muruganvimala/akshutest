import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormControl,FormGroup } from '@angular/forms';
import { ApiService } from "src/app/API/api.service";
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
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
} from "ng-apexcharts";
import { widget } from "src/app/pages/apps/widgets/data";
import { an } from "@fullcalendar/core/internal-common";
import { AnyKindOfDictionary } from "lodash";

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
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-line-area",
  templateUrl: "./line-area.component.html",
  styleUrls: ["./line-area.component.scss"],
})
export class LineAreaComponent {
  breadCrumbItems!: Array<{}>;
  lineChart: any;
  multipleYAxisChart: any;
  lineAreaChart: any;
  lineColumnAreaChart: any;

  selectedPublisher: string|any;
  selectedMetrics: string|any;
  //chart
  Funnel: any
  Pyramid: any

  stackedBarChart: any;
  stackedBarChart1: any;

  Pyramidseries: any = [];
  Pyramidcategories: any = [];
  Funnelseries: any = [];
  Funnelcategories: any = [];

  PublisherSnapshotpublisherName: any = [];
  PublisherSnapshotMetrics: any = [];
  PublisherSnapshotTarget: any = [];
  PublisherSnapshotActual: any = [];

  PublisherSnapshotpublisherName1: any = [];
  PublisherSnapshotMetrics1: any = [];
  PublisherSnapshotTarget1: any = [];
  PublisherSnapshotActual1: any = [];

  publishers: string[] = ["CUP", "EUP", "IWAP", "RSC", "AIP", "APS", "APA", "ASCE", "ERS", "FRONTIERS", "OUP", "PPL", "SAGE", "TnF", "TnF Conversion", "TnF Abcats", "ASME", "COB", "GSA", "GEO", "IET", "OSA", "RS", "SFN", "ASCE CP", "AIP Conversion", "MedRxiv", "ICE", "BioRxiv", "DNS", "GSL"];
  MetricsArray: string[] = ["OverallPerfomance","Schedule","Quality","Communication","CustomerSatisfaction","AccountManagement","RFT","PublicationSpeed","Feedback","AuthorSatisfaction"];

  publishersSorted = this.publishers.slice().sort();
  metricSorted = this.MetricsArray.slice().sort();

  public targetData: any;
  public actualData: any;
  public metricsData: any;
  public groupsData: any = [];

  public series: any = [];
  public categories: any = [];
  public groups: any = [];

  currentDate: Date|any;  
  filterForm: FormGroup;

  @ViewChild("chart") chart: ChartComponent | undefined;

  public chartOptions: ChartOptions | any;
  public chartOptions1: ChartOptions | any;
  public chartOptions2: ChartOptions | any;

  constructor(private fb: FormBuilder,private apiService: ApiService) {
    this.currentDate = new Date();
    this.currentDate.setDate(1);

    const previousYear = this.currentDate.getFullYear() - 1;
    const defaultDate = new Date(previousYear, 0, 1);
    this.currentDate = defaultDate;
    this.selectedPublisher=this.publishersSorted[0];
    this.selectedMetrics=this.metricSorted[0];

    this.filterForm = this.fb.group({
      publisher: [this.publishersSorted[0]],
      metrics:[this.metricSorted[0]],
      monthYear1: [defaultDate ],
      monthYear2: [defaultDate ],
    }); 
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Apexcharts" },
      { label: "Mixed Charts", active: true },
    ];

    this.callApi("Jan 2024", "Jan 2024");
    this.callApi1("Dec 2023", "Jan 2024");
    this.callApi2("Nov 2023", "Jan 2024");
    this.PublisherSnapshotApi(this.selectedPublisher, '', this.currentDate);
    this.ServiceSnapshotApi("", this.selectedMetrics, "jan 2023");
    this._stackedBarChart('["--tb-primary", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');
    this._stackedBarChart1('["--tb-primary", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');
    //this.underperformingMetricApi("","","Bottom","Apr 2023","Mar 2024","Metric");   

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

  onDateSelected(event: Date) {
    this.filterForm.patchValue({
      monthYear1: event
    });
    
    let monthYear1Value = this.filterForm.get('monthYear1')?.value;
    const date1 = new Date(monthYear1Value);
    const formattedDate = date1.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output1 = formattedDate.replace(' ', ' ');
    this.PublisherSnapshotApi(this.selectedPublisher, '', output1);
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
    this.PublisherSnapshotApi(this.selectedPublisher, '', output1);
  }

  onMetricChange(selectedValue: any) {
    const controlName = selectedValue.target.value.trim();
    this.selectedMetrics = controlName;
    let monthYear1Value = this.filterForm.get('monthYear2')?.value;
    const date1 = new Date(monthYear1Value);
    const formattedDate = date1.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output1 = formattedDate.replace(' ', ' ');
    this.ServiceSnapshotApi("", this.selectedMetrics, output1);
  }

  onDateSelected1(event: Date) {
    this.filterForm.patchValue({
      monthYear2: event
    });
    
    let monthYear2Value = this.filterForm.get('monthYear2')?.value;
    const date1 = new Date(monthYear2Value);
    const formattedDate = date1.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
    const output1 = formattedDate.replace(' ', ' ');
    this.ServiceSnapshotApi("", this.selectedMetrics, output1);
  }
 

  underperformingMetricApi(variable1: string, variable2: string, toporBottom: string, startMonthYear: string, endMonthYear: string, metricorPublisher: string) {
    console.log("underperforming Api calling");
    this.apiService
      .GetDataWithToken(
        `api/dashboard/underperforming?variable1=${variable1}&variable2=${variable2}&toporBottom=${toporBottom}&startMonthYear=${startMonthYear}&endMonthYear=${endMonthYear}&metricorPublisher=${metricorPublisher}`
      )
      .subscribe(
        (response) => {
          this.Pyramidseries = response.data.map((item: { Count: number }) => item.Count);
          this.Pyramidcategories = response.data.map((item: { Metrics: string }) => item.Metrics);
          //this._Pyramid('["--tb-primary", "--tb-secondary", "--tb-success", "--tb-warning", "--tb-info", "--tb-danger"]');

        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }

  PublisherSnapshotApi(publisher: string, Metrics: string, currentMonth: string) {
    console.log("Publisher Snapshot Api calling");
    this.apiService
      .GetDataWithToken(
        `api/dashboard/apexkpi?PublisherName=${publisher}&Metrics=${Metrics}&fromMonthYear=${currentMonth}&toMonthYear=${currentMonth}`
      )
      .subscribe(
        (response) => {
          //this.PublisherSnapshotpublisherName = response.data.map((item: { publisherName: string }) => item.publisherName);
          this.PublisherSnapshotMetrics = response.data.map((item: { metrics: string }) => item.metrics);
          this.PublisherSnapshotTarget = response.data.map((item: { target: number }) => item.target);
          this.PublisherSnapshotActual = response.data.map((item: { actual: number }) => item.actual);
          //console.log("PublisherSnapshotMetrics " + this.PublisherSnapshotMetrics);

          this.stackedBarChart.series = [
            {
              name: "Target",
              data: this.PublisherSnapshotMetrics.map((metric: any, index: any) => ({
                x: metric,
                y: this.PublisherSnapshotTarget[index]
              })),
              zIndex: 0
            },
            {
              name: "Actual",
              data: this.PublisherSnapshotMetrics.map((metric: any, index: any) => ({
                x: metric,
                y: this.PublisherSnapshotActual[index]
              })),
              zIndex: 1
            },
          ];

          this.stackedBarChart.yaxis.categories = this.PublisherSnapshotMetrics;
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }

  ServiceSnapshotApi(publisher: string, Metrics: string, currentMonth: string) {
    this.apiService
      .GetDataWithToken(
        `api/dashboard/apexkpi?PublisherName=${publisher}&Metrics=${Metrics}&fromMonthYear=${currentMonth}&toMonthYear=${currentMonth}`
      )
      .subscribe(
        (response) => {
          this.PublisherSnapshotpublisherName1 = response.data.map((item: { publisherName: string }) => item.publisherName);
          //this.PublisherSnapshotMetrics1 = response.data.map((item: { metrics: string }) => item.metrics);
          this.PublisherSnapshotTarget1 = response.data.map((item: { target: number }) => item.target);
          this.PublisherSnapshotActual1 = response.data.map((item: { actual: number }) => item.actual);
          this.stackedBarChart1.series = [
            {
              name: "Target",
              data: this.PublisherSnapshotpublisherName1.map((publisherName: string, index: any) => ({
                x: publisherName,
                y: this.PublisherSnapshotTarget1[index]
              })),
              zIndex: 0
            },
            {
              name: "Actual",
              data: this.PublisherSnapshotpublisherName1.map((publisherName: string, index: any) => ({
                x: publisherName,
                y: this.PublisherSnapshotActual1[index]
              })),
              zIndex: 1
            },
          ];

          this.stackedBarChart.yaxis.categories = this.PublisherSnapshotMetrics1;
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }

  callApi(fromdate: string, todate: string) {
    this.apiService
      .GetDataWithToken(
        `api/dashboard/kpirecentshortfall?fromMonthYear=${fromdate}&toMonthYear=${todate}`
      )
      .subscribe(
        (response) => {
          //console.log("api response " + response.data[0].metrics);
          this.metricsData = response.data[0].metrics;
          this.targetData = response.data[0].target;
          this.actualData = response.data[0].actual;
          this.groupsData = response.data[0].biGroups;

          this.series = [
            {
              name: "Target",
              data: this.targetData,
            },
            {
              name: "Actual",
              data: this.actualData,
            },
          ];

          // this.categories = this.metricsData.map(
          //   (metric: { label: string }) => metric.label
          // );

          if (this.groupsData && this.groupsData.length > 0) {
            this.groups = this.groupsData.map(
              (group: { title: string; cols: number }) => ({
                title: group.title,
                cols: group.cols,
              })
            );
          }

          this.chartOptions = {
            series: this.series,
            chart: {
              height: 350,
              type: "line",
              stacked: false,
              toolbar: {
                show: false,
              },
            },
            stroke: {
              width: [0, 2, 5],
              curve: "smooth",
            },
            plotOptions: {
              bar: {
                columnWidth: "80%",
              },
            },
            fill: {
              opacity: [0.65, 0.25, 1],
              gradient: {
                inverseColors: false,
                shade: "light",
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100],
              },
            },
            markers: {
              size: 0,
            },
            xaxis: {
              type: "category",
              categories: this.metricsData,
              group: {
                style: {
                  fontSize: "10px",
                  fontWeight: 750,
                },
                groups: this.groups,
              },
            },
            yaxis: {
              title: {
                text: "Points",
              },
              min: 0,
            },
            tooltip: {
              shared: true,
              intersect: false,
              y: {
                formatter: function (y: any) {
                  if (typeof y !== "undefined") {
                    return y.toFixed(0) + " points";
                  }
                  return y;
                },
              },
            },
          };
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }

  callApi1(fromdate: string, todate: string) {
    this.apiService
      .GetDataWithToken(
        `api/dashboard/kpirecentshortfall?fromMonthYear=${fromdate}&toMonthYear=${todate}`
      )
      .subscribe(
        (response) => {
          console.log("api response " + response.data[0].metrics);
          this.metricsData = response.data[0].metrics;
          this.targetData = response.data[0].target;
          this.actualData = response.data[0].actual;
          this.groupsData = response.data[0].biGroups;

          this.series = [
            {
              name: "Target",
              data: this.targetData,
            },
            {
              name: "Actual",
              data: this.actualData,
            },
          ];

          // this.categories = this.metricsData.map(
          //   (metric: { label: string }) => metric.label
          // );

          if (this.groupsData && this.groupsData.length > 0) {
            this.groups = this.groupsData.map(
              (group: { title: string; cols: number }) => ({
                title: group.title,
                cols: group.cols,
              })
            );
          }

          this.chartOptions1 = {
            series: this.series,
            chart: {
              height: 350,
              type: "bar",
              stacked: true,
              toolbar: {
                show: true,
              },
            },
            stroke: {
              width: [0, 2, 5],
              curve: "smooth",
            },
            plotOptions: {
              bar: {
                columnWidth: "80%",
              },
            },
            fill: {
              opacity: [0.65, 0.25, 1],
              gradient: {
                inverseColors: false,
                shade: "light",
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100],
              },
            },
            markers: {
              size: 0,
            },
            xaxis: {
              type: "category",
              categories: this.metricsData,
              group: {
                style: {
                  fontSize: "10px",
                  fontWeight: 750,
                },
                groups: this.groups,
              },
            },
            yaxis: {
              title: {
                text: "Points",
              },
              min: 0,
            },
            tooltip: {
              shared: true,
              intersect: false,
              y: {
                formatter: function (y: any) {
                  if (typeof y !== "undefined") {
                    return y.toFixed(0) + " points";
                  }
                  return y;
                },
              },
            },
          };
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }

  callApi2(fromdate: string, todate: string) {
    this.apiService
      .GetDataWithToken(
        `api/dashboard/kpirecentshortfall?fromMonthYear=${fromdate}&toMonthYear=${todate}`
      )
      .subscribe(
        (response) => {
          console.log("api response " + response.data[0].metrics);
          this.metricsData = response.data[0].metrics;
          this.targetData = response.data[0].target;
          this.actualData = response.data[0].actual;
          this.groupsData = response.data[0].biGroups;

          this.series = [
            {
              name: "Target",
              data: this.targetData,
            },
            {
              name: "Actual",
              data: this.actualData,
            },
          ];

          // this.categories = this.metricsData.map(
          //   (metric: { label: string }) => metric.label
          // );

          if (this.groupsData && this.groupsData.length > 0) {
            this.groups = this.groupsData.map(
              (group: { title: string; cols: number }) => ({
                title: group.title,
                cols: group.cols,
              })
            );
          }

          this.chartOptions2 = {
            series: this.series,
            chart: {
              height: 350,
              type: "bar",
              stacked: false,
              toolbar: {
                show: false,
              },
            },
            stroke: {
              width: [0, 2, 5],
              curve: "smooth",
            },
            plotOptions: {
              bar: {
                columnWidth: "80%",
              },
            },
            fill: {
              opacity: [0.65, 0.25, 1],
              gradient: {
                inverseColors: false,
                shade: "light",
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100],
              },
            },
            markers: {
              size: 0,
            },
            xaxis: {
              type: "category",
              categories: this.metricsData,
              group: {
                style: {
                  fontSize: "10px",
                  fontWeight: 750,
                },
                groups: this.groups,
              },
            },
            yaxis: {
              title: {
                text: "Points",
              },
              min: 0,
            },
            tooltip: {
              shared: true,
              intersect: false,
              y: {
                formatter: function (y: any) {
                  if (typeof y !== "undefined") {
                    return y.toFixed(0) + " points";
                  }
                  return y;
                },
              },
            },
          };
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }
  /**
    * Stacked Bar Charts
     */
  private _stackedBarChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.stackedBarChart = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
          easing: "swing"
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          hideZeroBarsWhenGrouped: false,
          isDumbbell: false,
          isFunnel: false,
          isFunnel3d: true,
          dataLabels: {
            position: "center",
            total: {
              enabled: false,
              offsetX: 0,
              offsetY: 0,
              style: {
                color: "#373d3f",
                fontSize: "12px",
                fontWeight: 600
              }
            }
          }
        },
        bubble: {
          "zScaling": true
        },
        treemap: {
          borderRadius: 4,
          dataLabels: {
            format: "scale"
          }
        },
        radialBar: {
          hollow: {
            background: "#fff"
          },
          barLabels: {
            enabled: false,
            margin: 5,
            useSeriesColors: true,
            fontWeight: 600,
            fontSize: "16px"
          }
        }
      },//plotOptions end
      dataLabels: {
        style: {
            fontWeight: 700,
            colors: [
                "#fff"
            ]
        },
        background: {
            enabled: false
        },
        dropShadow: {
            enabled: true
        }
    },
      bubble: {
        "zScaling": true
      },
      treemap: {
        borderRadius: 4,
        dataLabels: {
          format: "scale"
        }
      },
      radialBar: {
        hollow: {
          background: "#fff"
        },
        barLabels: {
          enabled: false,
          margin: 5,
          useSeriesColors: true,
          fontWeight: 600,
          fontSize: "16px"
        }
      },
      stroke: {
        fill: {
            type: "solid",
            opacity: 0.85,
            gradient: {
                shade: "dark",
                type: "horizontal",
                shadeIntensity: 0.5,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [
                    0,
                    50,
                    100
                ],
                colorStops: []
            }
        }
    },
      title: {
        text: "",
        style: {
          fontWeight: 600,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
      fill: {
        gradient: {
            shade: "light",
            inverseColors: false
        }
    },
    grid: {
      padding: {
          right: 25,
          left: 15
      }
  },
  legend: {
      fontSize: 14,
      offsetY: 0,
      markers: {
          shape: "square",
          size: 8
      },
      itemMargin: {
          vertical: 0
      }
  },
      colors: colors,
    };
  }

  private _stackedBarChart1(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.stackedBarChart1 = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      title: {
        text: "",
        style: {
          fontWeight: 600,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          formatter: function (val: any) {
            return val ;
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
      colors: colors,
    };
  }

}
