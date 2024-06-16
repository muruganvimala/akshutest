import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCostComponent } from './other-cost.component';

describe('OtherCostComponent', () => {
  let component: OtherCostComponent;
  let fixture: ComponentFixture<OtherCostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherCostComponent]
    });
    fixture = TestBed.createComponent(OtherCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
