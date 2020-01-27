import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLeadMgmtComponent } from './sales-lead-mgmt.component';

describe('SalesLeadMgmtComponent', () => {
  let component: SalesLeadMgmtComponent;
  let fixture: ComponentFixture<SalesLeadMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesLeadMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesLeadMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
