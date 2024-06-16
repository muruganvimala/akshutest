import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingComponent } from './coming.component';

describe('ComingComponent', () => {
  let component: ComingComponent;
  let fixture: ComponentFixture<ComingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComingComponent]
    });
    fixture = TestBed.createComponent(ComingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
