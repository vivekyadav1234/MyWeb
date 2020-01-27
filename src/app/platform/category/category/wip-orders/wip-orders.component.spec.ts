import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WipOrdersComponent } from './wip-orders.component';

describe('WipOrdersComponent', () => {
  let component: WipOrdersComponent;
  let fixture: ComponentFixture<WipOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WipOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WipOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
