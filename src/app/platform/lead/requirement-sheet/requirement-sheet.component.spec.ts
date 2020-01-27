import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSheetComponent } from './requirement-sheet.component';

describe('RequirementSheetComponent', () => {
  let component: RequirementSheetComponent;
  let fixture: ComponentFixture<RequirementSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
