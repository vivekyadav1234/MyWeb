import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadApprovalsComponent } from './cad-approvals.component';

describe('CadApprovalsComponent', () => {
  let component: CadApprovalsComponent;
  let fixture: ComponentFixture<CadApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
