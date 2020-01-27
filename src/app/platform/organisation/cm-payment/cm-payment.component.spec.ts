import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmPaymentComponent } from './cm-payment.component';

describe('CmPaymentComponent', () => {
  let component: CmPaymentComponent;
  let fixture: ComponentFixture<CmPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
