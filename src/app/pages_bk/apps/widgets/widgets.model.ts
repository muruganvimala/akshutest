// export interface widgetModel {
//   id: any,
//   label: string,
//   labelClass: string,
//   percentage: string,
//   percentageClass: string,
//   percentageIcon: string,
//   counter: number,
//   caption: string,
//   iconClass: string,
//   suffix: string,
//   chart: string
// }

export interface widget2Model {
  id: any,
  label?: string,
  icon?: string,
  percentage?: string,
  caption?: string,
  counters: number,
  badge?: string,
  suffix?: string,
  prefix?: string,
  iconbg?: string,
  bgColor?: string,
  textcolor?: string,
  color?: string
}
export interface browserModel {
  id: any,
  img: string,
  browsers: string
  click: string,
  rate: string
}

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series?: ApexAxisChartSeries | any;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  colors?: string[];
  yaxis?: ApexYAxis | ApexYAxis[];
  legend?: ApexLegend;
  labels?: string[] | number[];
};
