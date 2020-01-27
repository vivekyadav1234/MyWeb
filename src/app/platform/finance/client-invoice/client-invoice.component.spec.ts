import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInvoiceComponent } from './client-invoice.component';

describe('ClientInvoiceComponent', () => {
  let component: ClientInvoiceComponent;
  let fixture: ComponentFixture<ClientInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
