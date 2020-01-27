import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalatedLeadsComponent } from './escalated-leads.component';

describe('EscalatedLeadsComponent', () => {
  let component: EscalatedLeadsComponent;
  let fixture: ComponentFixture<EscalatedLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalatedLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalatedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
