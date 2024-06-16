import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { IlistSortEvent, NgbdInstructorListSortableHeader } from './list-sortable.directive';
import { InstructorListModel } from './list.model';
import { InstructorListService } from './list.service';
import { DecimalPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { instructorList } from './data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [InstructorListService, DecimalPipe]
})

// List Component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  totalinstructorChart: any;
  totalcoursesChart: any;
  instuctoractivity: any;
  files: File[] = [];
  deleteID: any;

  ListForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;

  instructors: any;
  InstructorList!: Observable<InstructorListModel[]>;
  total: Observable<number>;

  @ViewChildren(NgbdInstructorListSortableHeader) headers!: QueryList<NgbdInstructorListSortableHeader>;
  @ViewChild('addInstructor', { static: false }) addInstructor?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;


  constructor(public service: InstructorListService, private formBuilder: UntypedFormBuilder) {
    this.InstructorList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Instructors', active: true },
      { label: 'List View', active: true }
    ];

    // Chart Color Data Get Function
    this._totalinstructorChart('["--tb-primary"]');
    this._totalcoursesChart('["--tb-secondary"]');
    this._instuctoractivity('["--tb-primary", "--tb-light", "--tb-secondary"]');

    /**
     * Form Validation
     */
    this.ListForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      total_course: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      students: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      status: ['', [Validators.required]],
      img: ['']
    });


    // Fetch Data
    setTimeout(() => {
      this.InstructorList.subscribe(x => {
        this.instructors = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)

  }

  // File Upload
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
      this.ListForm.controls['img'].setValue(event[0].dataURL);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
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
* Total Instructors Charts
*/
  private _totalinstructorChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.totalinstructorChart = {
      series: [84],
      chart: {
        height: 170,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '75%'
          },
          track: {
            margin: 0,
          },
          dataLabels: {
            show: false
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Instructor Total'],
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._totalinstructorChart('["--tb-primary"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  /**
* Total Course Charts
*/
  private _totalcoursesChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.totalcoursesChart = {
      series: [33],
      chart: {
        height: 170,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '75%'
          },
          track: {
            margin: 0,
          },
          dataLabels: {
            show: false
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Instructor Total'],
      colors: colors,
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._totalcoursesChart('["--tb-secondary"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  /**
* Instructor Activity Charts
*/
  private _instuctoractivity(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.instuctoractivity = {
      series: [{
        name: "New Orders",
        data: [32, 18, 13, 17, 26, 34, 47, 51, 59, 63, 44, 38, 53, 69, 72, 83, 90, 110, 130, 117, 103, 92, 95, 119, 80, 96, 116, 125]
      }, {
        name: "Return Orders",
        data: [3, 6, 2, 4, 7, 9, 15, 10, 19, 22, 27, 21, 34, 23, 29, 32, 41, 34, 29, 37, 70, 55, 49, 36, 30, 52, 38, 33]
      }],
      chart: {
        height: 190,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'right',
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
        show: false,
      }
    }

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._instuctoractivity('["--tb-primary", "--tb-light", "--tb-secondary"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  // Edit Data
  editList(id: any) {
    this.addInstructor?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    var editData = this.instructors[id]

    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.img_alt, 'size': 1024, });

    this.ListForm.controls['id'].setValue(editData.id);
    this.ListForm.controls['name'].setValue(editData.name);
    this.ListForm.controls['email'].setValue(editData.email);
    this.ListForm.controls['total_course'].setValue(editData.total_course);
    this.ListForm.controls['experience'].setValue(editData.experience);
    this.ListForm.controls['students'].setValue(editData.students);
    this.ListForm.controls['contact'].setValue(editData.contact);
    this.ListForm.controls['status'].setValue(editData.status);
    this.ListForm.controls['img'].setValue(editData.img);
  }

  // add Product
  saveList() {
    if (this.ListForm.valid) {
      if (this.ListForm.get('id')?.value) {
        this.service.products = instructorList.map((order: { id: any; }) => order.id === this.ListForm.get('id')?.value ? { ...order, ...this.ListForm.value } : order);
      }
      else {
        const name = this.ListForm.get('name')?.value;
        const email = this.ListForm.get('email')?.value;
        const total_course = this.ListForm.get('total_course')?.value;
        const experience = this.ListForm.get('experience')?.value;
        const students = this.ListForm.get('students')?.value;
        const contact = this.ListForm.get('contact')?.value;
        const status = this.ListForm.get('status')?.value;
        const img = this.ListForm.get('img')?.value;
        instructorList.push({
          id: this.instructors.length + 1,
          img,
          name,
          email,
          total_course,
          experience,
          students,
          rating: '',
          contact,
          status
        })
        this.service.products = instructorList
      }
      this.uploadedFiles = [];
      this.addInstructor?.hide()

      var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
      modaltitle.innerHTML = 'Add Instructor'
      var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
      modalbtn.innerHTML = 'Add Instructor'
    }
    setTimeout(() => {
      this.ListForm.reset();
    }, 0);
    this.submitted = true
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.instructors.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.instructors.length; i++) {
      if (this.instructors[i].state == true) {
        result = this.instructors[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.instructors.length; i++) {
      if (this.instructors[i].state == true) {
        result = this.instructors[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    if (this.deleteID) {
      this.service.products = this.service.products.filter((product: any) => {
        return this.deleteID != product.id;
      });
      this.deleteID = ''
    } else {
      this.service.products = this.service.products.filter((product: any) => {
        return !this.checkedValGet.includes(product.id);
      });
    }
    this.deleteRecordModal?.hide()
    this.masterSelected = false;
  }

  // Sort Data
  onSort({ column, direction }: IlistSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.Ilistsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
