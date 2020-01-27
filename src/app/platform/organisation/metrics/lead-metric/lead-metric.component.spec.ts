import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadMetricComponent } from './lead-metric.component';

describe('LeadMetricComponent', () => {
  let component: LeadMetricComponent;
  let fixture: ComponentFixture<LeadMetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadMetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
