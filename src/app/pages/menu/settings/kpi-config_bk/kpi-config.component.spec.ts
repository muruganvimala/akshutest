import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiConfigComponent } from './kpi-config.component';

describe('KpiConfigComponent', () => {
  let component: KpiConfigComponent;
  let fixture: ComponentFixture<KpiConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiConfigComponent]
    });
    fixture = TestBed.createComponent(KpiConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
