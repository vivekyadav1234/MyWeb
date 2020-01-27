import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsagentStatuslistComponent } from './csagent-statuslist.component';

describe('CsagentStatuslistComponent', () => {
  let component: CsagentStatuslistComponent;
  let fixture: ComponentFixture<CsagentStatuslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsagentStatuslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsagentStatuslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
