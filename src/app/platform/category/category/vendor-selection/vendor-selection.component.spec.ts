import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSelectionComponent } from './vendor-selection.component';

describe('VendorSelectionComponent', () => {
  let component: VendorSelectionComponent;
  let fixture: ComponentFixture<VendorSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
