import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBackgroundComponent } from './activity-background.component';

describe('ActivityBackgroundComponent', () => {
  let component: ActivityBackgroundComponent;
  let fixture: ComponentFixture<ActivityBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
