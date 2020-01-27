import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBarsComponent } from './activity-bars.component';

describe('ActivityBarsComponent', () => {
  let component: ActivityBarsComponent;
  let fixture: ComponentFixture<ActivityBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
