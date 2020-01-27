import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDrawingComponent } from './shop-drawing.component';

describe('ShopDrawingComponent', () => {
  let component: ShopDrawingComponent;
  let fixture: ComponentFixture<ShopDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
