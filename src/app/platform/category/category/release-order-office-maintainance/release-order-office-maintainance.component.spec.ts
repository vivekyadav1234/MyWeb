import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseOrderOfficeMaintainanceComponent } from './release-order-office-maintainance.component';

describe('ReleaseOrderOfficeMaintainanceComponent', () => {
  let component: ReleaseOrderOfficeMaintainanceComponent;
  let fixture: ComponentFixture<ReleaseOrderOfficeMaintainanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseOrderOfficeMaintainanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseOrderOfficeMaintainanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
