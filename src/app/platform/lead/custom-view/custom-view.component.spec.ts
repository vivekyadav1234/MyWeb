import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomViewComponent } from './custom-view.component';

describe('CustomViewComponent', () => {
  let component: CustomViewComponent;
  let fixture: ComponentFixture<CustomViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
