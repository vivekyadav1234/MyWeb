import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerWipDashboardComponent } from './designer-wip-dashboard.component';

describe('DesignerWipDashboardComponent', () => {
  let component: DesignerWipDashboardComponent;
  let fixture: ComponentFixture<DesignerWipDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerWipDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerWipDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
