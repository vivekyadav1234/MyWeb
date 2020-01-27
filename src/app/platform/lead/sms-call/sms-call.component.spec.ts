import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsCallComponent } from './sms-call.component';

describe('SmsCallComponent', () => {
  let component: SmsCallComponent;
  let fixture: ComponentFixture<SmsCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
