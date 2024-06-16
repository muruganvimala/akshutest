import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiDashboardComponent } from './bi-dashboard.component';

describe('BiDashboardComponent', () => {
  let component: BiDashboardComponent;
  let fixture: ComponentFixture<BiDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiDashboardComponent]
    });
    fixture = TestBed.createComponent(BiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
