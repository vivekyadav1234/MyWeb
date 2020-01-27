import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadPriorityDisplayComponent } from './lead-priority-display.component';

describe('LeadPriorityDisplayComponent', () => {
  let component: LeadPriorityDisplayComponent;
  let fixture: ComponentFixture<LeadPriorityDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadPriorityDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadPriorityDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
