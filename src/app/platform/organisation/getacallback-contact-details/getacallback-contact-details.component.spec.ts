import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetacallbackContactDetailsComponent } from './getacallback-contact-details.component';

describe('GetacallbackContactDetailsComponent', () => {
  let component: GetacallbackContactDetailsComponent;
  let fixture: ComponentFixture<GetacallbackContactDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetacallbackContactDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetacallbackContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
