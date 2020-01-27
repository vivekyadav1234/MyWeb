import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProposalsComponent } from './list-proposals.component';

describe('ListProposalsComponent', () => {
  let component: ListProposalsComponent;
  let fixture: ComponentFixture<ListProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProposalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
