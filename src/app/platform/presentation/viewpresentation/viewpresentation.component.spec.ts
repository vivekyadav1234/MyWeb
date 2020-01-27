import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpresentationComponent } from './viewpresentation.component';

describe('ViewpresentationComponent', () => {
  let component: ViewpresentationComponent;
  let fixture: ComponentFixture<ViewpresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewpresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
