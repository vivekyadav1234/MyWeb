import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMetricComponent } from './community-metric.component';

describe('CommunityMetricComponent', () => {
  let component: CommunityMetricComponent;
  let fixture: ComponentFixture<CommunityMetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityMetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
