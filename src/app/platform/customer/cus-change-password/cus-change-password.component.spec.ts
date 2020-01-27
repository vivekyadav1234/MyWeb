import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusChangePasswordComponent } from './cus-change-password.component';

describe('CusChangePasswordComponent', () => {
  let component: CusChangePasswordComponent;
  let fixture: ComponentFixture<CusChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
