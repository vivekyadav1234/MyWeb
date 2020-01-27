import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmDesignerListComponent } from './cm-designer-list.component';

describe('CmDesignerListComponent', () => {
  let component: CmDesignerListComponent;
  let fixture: ComponentFixture<CmDesignerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmDesignerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmDesignerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
