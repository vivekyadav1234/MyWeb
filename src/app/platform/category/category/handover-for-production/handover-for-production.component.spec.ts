import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoverForProductionComponent } from './handover-for-production.component';

describe('HandoverForProductionComponent', () => {
  let component: HandoverForProductionComponent;
  let fixture: ComponentFixture<HandoverForProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandoverForProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandoverForProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
