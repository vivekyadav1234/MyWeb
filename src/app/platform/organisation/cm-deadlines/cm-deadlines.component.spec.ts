import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmDeadlinesComponent } from './cm-deadlines.component';

describe('CmDeadlinesComponent', () => {
  let component: CmDeadlinesComponent;
  let fixture: ComponentFixture<CmDeadlinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmDeadlinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmDeadlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
