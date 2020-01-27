import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivaeProductsComponent } from './arrivae-products.component';

describe('ArrivaeProductsComponent', () => {
  let component: ArrivaeProductsComponent;
  let fixture: ComponentFixture<ArrivaeProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrivaeProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivaeProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
