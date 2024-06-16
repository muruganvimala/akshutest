import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItoverviewComponent } from './itoverview.component';

describe('ItoverviewComponent', () => {
  let component: ItoverviewComponent;
  let fixture: ComponentFixture<ItoverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItoverviewComponent]
    });
    fixture = TestBed.createComponent(ItoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
