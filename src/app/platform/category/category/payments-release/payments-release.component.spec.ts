import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsReleaseComponent } from './payments-release.component';

describe('PaymentsReleaseComponent', () => {
  let component: PaymentsReleaseComponent;
  let fixture: ComponentFixture<PaymentsReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
