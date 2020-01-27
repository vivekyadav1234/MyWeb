import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsPriorityComponent } from './leads-priority.component';

describe('LeadsPriorityComponent', () => {
  let component: LeadsPriorityComponent;
  let fixture: ComponentFixture<LeadsPriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsPriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
