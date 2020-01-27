import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupBrokerComponent } from './signup-broker.component';

describe('SignupBrokerComponent', () => {
  let component: SignupBrokerComponent;
  let fixture: ComponentFixture<SignupBrokerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupBrokerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
