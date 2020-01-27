import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmLeadsListComponent } from './cm-leads-list.component';

describe('CmLeadsListComponent', () => {
  let component: CmLeadsListComponent;
  let fixture: ComponentFixture<CmLeadsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmLeadsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmLeadsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
