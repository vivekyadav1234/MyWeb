import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmstatuslistComponent } from './cmstatuslist.component';

describe('CmstatuslistComponent', () => {
  let component: CmstatuslistComponent;
  let fixture: ComponentFixture<CmstatuslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmstatuslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmstatuslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
