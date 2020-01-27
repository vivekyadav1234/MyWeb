import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterVendorProductsComponent } from './master-vendor-products.component';

describe('MasterVendorProductsComponent', () => {
  let component: MasterVendorProductsComponent;
  let fixture: ComponentFixture<MasterVendorProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterVendorProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterVendorProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
