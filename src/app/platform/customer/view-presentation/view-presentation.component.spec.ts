import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPresentationComponent } from './view-presentation.component';

describe('ViewPresentationComponent', () => {
  let component: ViewPresentationComponent;
  let fixture: ComponentFixture<ViewPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
