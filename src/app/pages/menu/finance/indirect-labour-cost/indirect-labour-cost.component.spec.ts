import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectLabourCostComponent } from './indirect-labour-cost.component';

describe('IndirectLabourCostComponent', () => {
  let component: IndirectLabourCostComponent;
  let fixture: ComponentFixture<IndirectLabourCostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndirectLabourCostComponent]
    });
    fixture = TestBed.createComponent(IndirectLabourCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
