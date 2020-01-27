import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledCallsComponent } from './scheduled-calls.component';

describe('ScheduledCallsComponent', () => {
  let component: ScheduledCallsComponent;
  let fixture: ComponentFixture<ScheduledCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
