import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsagentdashboardComponent } from './csagentdashboard.component';

describe('CsagentdashboardComponent', () => {
  let component: CsagentdashboardComponent;
  let fixture: ComponentFixture<CsagentdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsagentdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsagentdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
