import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDesignerComponent } from './login-designer.component';

describe('LoginDesignerComponent', () => {
  let component: LoginDesignerComponent;
  let fixture: ComponentFixture<LoginDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
