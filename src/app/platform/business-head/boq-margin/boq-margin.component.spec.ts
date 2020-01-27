import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqMarginComponent } from './boq-margin.component';

describe('BoqMarginComponent', () => {
  let component: BoqMarginComponent;
  let fixture: ComponentFixture<BoqMarginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoqMarginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoqMarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
