import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCountsComponent } from './overview-counts.component';

describe('OverviewCountsComponent', () => {
  let component: OverviewCountsComponent;
  let fixture: ComponentFixture<OverviewCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
