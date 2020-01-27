import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WipOrdersOfiiceMaintainanceComponent } from './wip-orders-ofiice-maintainance.component';

describe('WipOrdersOfiiceMaintainanceComponent', () => {
  let component: WipOrdersOfiiceMaintainanceComponent;
  let fixture: ComponentFixture<WipOrdersOfiiceMaintainanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WipOrdersOfiiceMaintainanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WipOrdersOfiiceMaintainanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
