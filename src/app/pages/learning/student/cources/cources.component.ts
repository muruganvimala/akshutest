import { Component } from '@angular/core';

// Get Data
import { cources } from './data';

@Component({
  selector: 'app-cources',
  templateUrl: './cources.component.html',
  styleUrls: ['./cources.component.scss']
})
export class CourcesComponent {
  breadCrumbItems!: Array<{}>;
  bsInlineValue = new Date();
  courseList: any;

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Students', active: true },
      { label: 'My Courses', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.courseList = cources
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }
}
