import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmActionableComponent } from './cm-actionable.component';

describe('CmActionableComponent', () => {
  let component: CmActionableComponent;
  let fixture: ComponentFixture<CmActionableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmActionableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmActionableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
