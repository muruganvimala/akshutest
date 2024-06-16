import { Component, QueryList, ViewChildren } from '@angular/core';

import { StateModel, leadModel, dealModel, taskModel } from './crm.model';
import { dealData, statData, taskData } from './data';
import { CRMService } from './crm.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdCRMSortableHeader, leadSortEvent } from './crm-sortable.directive';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
  providers: [CRMService, DecimalPipe]
})
export class CrmComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  statedata!: StateModel[];

  realizedChart: any;
  balance_overviewChart: any;
  emailSentChart: any;
  usersActivityChart: any;
  syncStatusBreakdownChart: any;

  contact?: any;
  dealList!: dealModel[];
  taskList!: taskModel[];

  // Table data
  contactList!: Observable<leadModel[]>;
  total: Observable<number>;

  @ViewChildren(NgbdCRMSortableHeader) headers!: QueryList<NgbdCRMSortableHeader>;
  sortValue: any = 'Leads Score';

  constructor(public service: CRMService) {
    this.contactList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'CRM', active: true }
    ];

    // Chart Color Data Get Function
    this._realizedChart('["--tb-primary", "--tb-secondary", "--tb-danger"]');
    this._balance_overviewChart('["--tb-primary", "--tb-light","--tb-secondary"]');
    this._emailSentChart('["--tb-primary", "--tb-success", "--tb-secondary"]');
    this._usersActivityChart('["--tb-primary", "--tb-light"]');
    this._syncStatusBreakdownChart('["--tb-primary", "--tb-primary-rgb, 0.85", "--tb-primary-rgb, 0.60", "--tb-primary-rgb, 0.50", "--tb-info"]');

    // Fetch Data
    this.statedata = statData
    this.dealList = dealData
    this.taskList  =taskData

    setTimeout(() => {
      this.contactList.subscribe(x => {
        this.contact = Object.assign([], x);
      });

      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200)
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

  /**
* Realized Charts
*/
  private _realizedChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.realizedChart = {
      series: [{
        name: 'Read',
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: 'Delivery',
        data: [20, 30, 40, 80, 20, 80],
      },
      {
        name: 'Failed',
        data: [44, 76, 78, 13, 43, 10],
      }
      ],
      chart: {
        height: 403,
        type: 'radar',
        toolbar: {
          show: false
        },
      },
      stroke: {
        width: 1
      },
      fill: {
        opacity: 0.2
      },
      markers: {
        size: 3,
        hover: {
          size: 4,
        }
      },
      colors: colors,
      xaxis: {
        categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
      }
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._realizedChart('["--tb-primary", "--tb-secondary", "--tb-danger"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  /**
* Balance Overview Charts
*/
  private _balance_overviewChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.balance_overviewChart = {
      series: [{
        name: 'Total Revenue',
        data: [49, 62, 55, 67, 73, 89, 110, 120, 115, 129, 123, 133]
      }, {
        name: 'Total Expense',
        data: [62, 76, 67, 49, 63, 77, 70, 86, 92, 103, 87, 93]
      }, {
        name: 'Profit Ratio',
        data: [12, 36, 29, 33, 37, 42, 58, 67, 49, 33, 24, 18]
      }],
      chart: {
        height: 300,
        type: 'line',
        toolbar: {
          show: false
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: colors,
          opacity: 0.25
        }
      },
      markers: {
        size: 0,
        strokeColors: colors,
        strokeWidth: 2,
        strokeOpacity: 0.9,
        fillOpacity: 1,
        radius: 0,
        hover: {
          size: 5,
        }
      },
      grid: {
        show: true,
        padding: {
          top: -20,
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
        width: [2, 2, 2],
        curve: 'smooth'
      },
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._balance_overviewChart('["--tb-primary", "--tb-light","--tb-secondary"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  /**
* Email sent Charts
*/
  private _emailSentChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.emailSentChart = {
      series: [63, 87, 33],
      chart: {
        height: 363,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          track: {
            background: colors,
            opacity: 0.15,
          },
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
              color: "#87888a",
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function (w: any) {
                return 1793
              }
            }
          },
        }
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      labels: ['Sent', 'Received', 'Failed'],
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._emailSentChart('["--tb-primary", "--tb-success", "--tb-secondary"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  /**
* User Activity Charts
*/
  private _usersActivityChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.usersActivityChart = {
      series: [{
        name: 'Activ User',
        data: [44, 55, 41, 67, 22, 43]
      }, {
        name: 'New Users',
        data: [13, 23, 20, 8, 13, 27]
      }],
      chart: {
        type: 'bar',
        height: 330,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
        },
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      },
      grid: {
        show: true,
        padding: {
          top: -18,
          right: 0,
          bottom: 0,
        },
      },
      legend: {
        position: 'bottom',
      },
      fill: {
        opacity: 1
      },
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._usersActivityChart('["--tb-primary", "--tb-light"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  /**
* User Activity Charts
*/
  private _syncStatusBreakdownChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.syncStatusBreakdownChart = {
      series: [{
        name: 'Synced',
        data: [44, 55, 41, 37, 22, 43, 21]
      }, {
        name: 'Sync Needed',
        data: [53, 32, 33, 52, 13, 43, 32]
      }, {
        name: 'Never Synced',
        data: [12, 17, 11, 9, 15, 11, 20]
      }, {
        name: 'Review Needed',
        data: [9, 7, 5, 8, 6, 9, 4]
      }],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnHight: '40%',
        },
      },
      grid: {
        show: true,
        padding: {
          top: -20,
          right: 0,
          bottom: -10,
        },
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      fill: {
        opacity: 1
      },
      legend: {
        show: false,
      },
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._syncStatusBreakdownChart('["--tb-primary", "--tb-primary-rgb, 0.85", "--tb-primary-rgb, 0.60", "--tb-primary-rgb, 0.50", "--tb-info"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  // Sort Data

  sortBy({ column, direction }: leadSortEvent, value: any) {
    this.sortValue = value
    this.onSort({ column, direction })
  }

  onSort({ column, direction }: leadSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.leadsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
