import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSignUpComponent } from './lead-sign-up.component';

describe('LeadSignUpComponent', () => {
  let component: LeadSignUpComponent;
  let fixture: ComponentFixture<LeadSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
