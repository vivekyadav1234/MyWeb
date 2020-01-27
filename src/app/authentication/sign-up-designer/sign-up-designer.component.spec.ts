import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpDesignerComponent } from './sign-up-designer.component';

describe('SignUpDesignerComponent', () => {
  let component: SignUpDesignerComponent;
  let fixture: ComponentFixture<SignUpDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
