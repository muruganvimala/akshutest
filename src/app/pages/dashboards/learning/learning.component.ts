import { Component, QueryList, ViewChildren } from '@angular/core';

import { InstructorModel, CourseModel } from './learning.model';
import { instructor, recentcourse } from './data';
import { Observable } from 'rxjs';
import { NgbdLearningSortableHeader, courseSortEvent } from './learning-sortable.directive';
import { LearningService } from './learning.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss'],
  providers: [LearningService, DecimalPipe]
})

// Learning Component
export class LearningComponent {

  totalstudentsChart: any;
  totalcoursesChart: any;
  strokedradialbarChart: any;
  areasplineChart: any;

  instructordata!: InstructorModel[];
  coursedata!: CourseModel[];

  // Table data
  courseList!: Observable<InstructorModel[]>;
  total: Observable<number>;

  sortValue: any = 'Course Name';

  @ViewChildren(NgbdLearningSortableHeader) headers!: QueryList<NgbdLearningSortableHeader>;

  constructor(public service: LearningService) {
    this.courseList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this._totalstudentsChart('["--tb-light", "--tb-secondary", "--tb-light", "--tb-light", "--tb-light", "--tb-light","--tb-light"]')
    this._totalcoursesChart('["--tb-info", "--tb-secondary", "--tb-primary", "--tb-primary", "--tb-primary", "--tb-primary","--tb-primary"]')
    this._strokedradialbarChart('["--tb-primary"]')
    this._areasplineChart('["--tb-primary", "--tb-secondary"]')

    // Fetch Data
    this.instructordata = instructor
    setTimeout(() => {
      this.courseList.subscribe(x => {
        this.coursedata = Object.assign([], x);
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

  // Total Student Chart
  private _totalstudentsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.totalstudentsChart = {
      series: [{
        name: 'Total Students',
        data: [33, 56, 37, 51, 42, 83, 71]
      }],
      chart: {
        height: 95,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          distributed: true,
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
        padding: {
          top: -15,
          right: 0,
          left: 0,
          bottom: -10
        },
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
      colors: colors,
      xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        labels: {
          show: false,
        }
      },
      yaxis: {
        show: false,
      },
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._totalstudentsChart('["--tb-light", "--tb-secondary", "--tb-light", "--tb-light", "--tb-light", "--tb-light","--tb-light"]')
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  // Total Courses Chart
  private _totalcoursesChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.totalcoursesChart = {
      series: [{
        name: 'Total Courses',
        data: [33, 56, 37, 51, 42, 83, 71]
      }],
      chart: {
        height: 95,
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
        padding: {
          top: -15,
          right: 0,
          left: 0,
          bottom: -10
        },
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
      colors: colors,
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          show: false,
        }
      },
      yaxis: {
        show: false,
      },
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._totalcoursesChart('["--tb-info", "--tb-secondary", "--tb-primary", "--tb-primary", "--tb-primary", "--tb-primary","--tb-primary"]')
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
    // observer.disconnect();
  }

  // Total Courses Chart
  private _strokedradialbarChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.strokedradialbarChart = {
      series: [67],
      chart: {
        height: 320,
        type: 'radialBar',
        // offsetY: -2  
      },
      plotOptions: {
        radialBar: {
          startAngle: -120,
          endAngle: 120,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 80
            },
            value: {
              offsetY: 30,
              fontSize: '20px',
              color: "#87888a",
              formatter: function (val: any) {
                return val + "%";
              }
            }
          }
        }
      },
      grid: {
        show: false,
        padding: {
          top: -15,
          right: 0,
          left: 0,
          bottom: -10
        },
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        },
      },
      stroke: {
        dashArray: 4
      },
      labels: ['Daily Goal'],
      colors: colors
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._strokedradialbarChart('["--tb-primary"]')
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
    // observer.disconnect();
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
      this._areasplineChart('["--tb-primary", "--tb-secondary"]')
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
    // observer.disconnect();
  }

  // Sort Data
  sortBy({ column, direction }: courseSortEvent, value: any) {
    this.sortValue = value
    this.onSort({ column, direction })
  }

  onSort({ column, direction }: courseSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.coursesortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
