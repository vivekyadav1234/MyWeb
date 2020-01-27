import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmWipDashboardComponent } from './cm-wip-dashboard.component';

describe('CmWipDashboardComponent', () => {
  let component: CmWipDashboardComponent;
  let fixture: ComponentFixture<CmWipDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmWipDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmWipDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
