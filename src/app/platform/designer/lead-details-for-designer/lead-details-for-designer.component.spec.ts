import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDetailsForDesignerComponent } from './lead-details-for-designer.component';

describe('LeadDetailsForDesignerComponent', () => {
  let component: LeadDetailsForDesignerComponent;
  let fixture: ComponentFixture<LeadDetailsForDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadDetailsForDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDetailsForDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
