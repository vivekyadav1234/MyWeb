import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmDesMetricComponent } from './cm-des-metric.component';

describe('CmDesMetricComponent', () => {
  let component: CmDesMetricComponent;
  let fixture: ComponentFixture<CmDesMetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmDesMetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmDesMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
