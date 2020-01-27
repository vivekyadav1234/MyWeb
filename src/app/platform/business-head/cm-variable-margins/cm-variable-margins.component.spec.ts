import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmVariableMarginsComponent } from './cm-variable-margins.component';

describe('CmVariableMarginsComponent', () => {
  let component: CmVariableMarginsComponent;
  let fixture: ComponentFixture<CmVariableMarginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmVariableMarginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmVariableMarginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
