import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmActionableListComponent } from './cm-actionable-list.component';

describe('CmActionableListComponent', () => {
  let component: CmActionableListComponent;
  let fixture: ComponentFixture<CmActionableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmActionableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmActionableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
