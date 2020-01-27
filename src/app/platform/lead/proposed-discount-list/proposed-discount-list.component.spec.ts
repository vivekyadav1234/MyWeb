import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposedDiscountListComponent } from './proposed-discount-list.component';

describe('ProposedDiscountListComponent', () => {
  let component: ProposedDiscountListComponent;
  let fixture: ComponentFixture<ProposedDiscountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposedDiscountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposedDiscountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
