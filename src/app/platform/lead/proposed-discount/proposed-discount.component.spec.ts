import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposedDiscountComponent } from './proposed-discount.component';

describe('ProposedDiscountComponent', () => {
  let component: ProposedDiscountComponent;
  let fixture: ComponentFixture<ProposedDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposedDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposedDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
