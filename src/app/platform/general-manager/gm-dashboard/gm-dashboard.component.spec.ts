import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmDashboardComponent } from './gm-dashboard.component';

describe('GmDashboardComponent', () => {
  let component: GmDashboardComponent;
  let fixture: ComponentFixture<GmDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
