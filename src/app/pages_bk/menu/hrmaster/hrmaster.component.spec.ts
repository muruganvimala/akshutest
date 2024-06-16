import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmasterComponent } from './hrmaster.component';

describe('HrmasterComponent', () => {
  let component: HrmasterComponent;
  let fixture: ComponentFixture<HrmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrmasterComponent]
    });
    fixture = TestBed.createComponent(HrmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
