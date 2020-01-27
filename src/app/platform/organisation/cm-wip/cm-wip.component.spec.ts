import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmWipComponent } from './cm-wip.component';

describe('CmWipComponent', () => {
  let component: CmWipComponent;
  let fixture: ComponentFixture<CmWipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmWipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmWipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
