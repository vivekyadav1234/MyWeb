import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountProposalComponent } from './discount-proposal.component';

describe('DiscountProposalComponent', () => {
  let component: DiscountProposalComponent;
  let fixture: ComponentFixture<DiscountProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
