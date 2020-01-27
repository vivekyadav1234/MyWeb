import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDesignProposalComponent } from './final-design-proposal.component';

describe('FinalDesignProposalComponent', () => {
  let component: FinalDesignProposalComponent;
  let fixture: ComponentFixture<FinalDesignProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalDesignProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalDesignProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
