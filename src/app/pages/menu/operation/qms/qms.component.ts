import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-qms',
  templateUrl: './qms.component.html',
  styleUrls: ['./qms.component.scss']
})
export class QmsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Operation', active: true },
      { label: 'QMS', active: true }
    ];
  }
  

}
