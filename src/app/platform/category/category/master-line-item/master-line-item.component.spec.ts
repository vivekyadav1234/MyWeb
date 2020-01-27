import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLineItemComponent } from './master-line-item.component';

describe('MasterLineItemComponent', () => {
  let component: MasterLineItemComponent;
  let fixture: ComponentFixture<MasterLineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterLineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
