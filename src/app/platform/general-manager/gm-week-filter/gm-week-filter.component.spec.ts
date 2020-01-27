import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmWeekFilterComponent } from './gm-week-filter.component';

describe('GmWeekFilterComponent', () => {
  let component: GmWeekFilterComponent;
  let fixture: ComponentFixture<GmWeekFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmWeekFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmWeekFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
