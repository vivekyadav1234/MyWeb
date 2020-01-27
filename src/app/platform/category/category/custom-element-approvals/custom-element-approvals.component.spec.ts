import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomElementApprovalsComponent } from './custom-element-approvals.component';

describe('CustomElementApprovalsComponent', () => {
  let component: CustomElementApprovalsComponent;
  let fixture: ComponentFixture<CustomElementApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomElementApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomElementApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
