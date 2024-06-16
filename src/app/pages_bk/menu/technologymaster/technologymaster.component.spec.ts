import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologymasterComponent } from './technologymaster.component';

describe('TechnologymasterComponent', () => {
  let component: TechnologymasterComponent;
  let fixture: ComponentFixture<TechnologymasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologymasterComponent]
    });
    fixture = TestBed.createComponent(TechnologymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
