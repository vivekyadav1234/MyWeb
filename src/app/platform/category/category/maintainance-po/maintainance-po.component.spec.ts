import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainancePoComponent } from './maintainance-po.component';

describe('MaintainancePoComponent', () => {
  let component: MaintainancePoComponent;
  let fixture: ComponentFixture<MaintainancePoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainancePoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainancePoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
