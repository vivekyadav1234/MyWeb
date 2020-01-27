import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MkwbusinessheadMetricComponent } from './mkwbusinesshead-metric.component';

describe('MkwbusinessheadMetricComponent', () => {
  let component: MkwbusinessheadMetricComponent;
  let fixture: ComponentFixture<MkwbusinessheadMetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MkwbusinessheadMetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MkwbusinessheadMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
