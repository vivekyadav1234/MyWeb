import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLeadOfLeadheadComponent } from './list-lead-of-leadhead.component';

describe('ListLeadOfLeadheadComponent', () => {
  let component: ListLeadOfLeadheadComponent;
  let fixture: ComponentFixture<ListLeadOfLeadheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLeadOfLeadheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeadOfLeadheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
