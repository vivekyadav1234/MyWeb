import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalBoqApprovalsComponent } from './final-boq-approvals.component';

describe('FinalBoqApprovalsComponent', () => {
  let component: FinalBoqApprovalsComponent;
  let fixture: ComponentFixture<FinalBoqApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalBoqApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalBoqApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
