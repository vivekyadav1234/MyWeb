import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesupervisorMgmtComponent } from './sitesupervisor-mgmt.component';

describe('SitesupervisorMgmtComponent', () => {
  let component: SitesupervisorMgmtComponent;
  let fixture: ComponentFixture<SitesupervisorMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesupervisorMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesupervisorMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
