import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerProposalComponent } from './designer-proposal.component';

describe('DesignerProposalComponent', () => {
  let component: DesignerProposalComponent;
  let fixture: ComponentFixture<DesignerProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
