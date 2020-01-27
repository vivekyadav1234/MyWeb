import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBoqComponent } from './view-boq.component';

describe('ViewBoqComponent', () => {
  let component: ViewBoqComponent;
  let fixture: ComponentFixture<ViewBoqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBoqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
