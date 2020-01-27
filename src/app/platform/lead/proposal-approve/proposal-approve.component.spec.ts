import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalApproveComponent } from './proposal-approve.component';

describe('ProposalApproveComponent', () => {
  let component: ProposalApproveComponent;
  let fixture: ComponentFixture<ProposalApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
