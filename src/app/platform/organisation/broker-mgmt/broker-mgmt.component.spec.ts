import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerMgmtComponent } from './broker-mgmt.component';

describe('BrokerMgmtComponent', () => {
  let component: BrokerMgmtComponent;
  let fixture: ComponentFixture<BrokerMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
