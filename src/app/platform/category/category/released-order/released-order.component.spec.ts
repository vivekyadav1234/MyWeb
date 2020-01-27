import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasedOrderComponent } from './released-order.component';

describe('ReleasedOrderComponent', () => {
  let component: ReleasedOrderComponent;
  let fixture: ComponentFixture<ReleasedOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasedOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
