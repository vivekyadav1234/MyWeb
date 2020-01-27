import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerLeadmgmtComponent } from './broker-leadmgmt.component';

describe('BrokerLeadmgmtComponent', () => {
  let component: BrokerLeadmgmtComponent;
  let fixture: ComponentFixture<BrokerLeadmgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerLeadmgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerLeadmgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
