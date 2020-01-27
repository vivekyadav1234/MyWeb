import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfloorplanComponent } from './viewfloorplan.component';

describe('ViewfloorplanComponent', () => {
  let component: ViewfloorplanComponent;
  let fixture: ComponentFixture<ViewfloorplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewfloorplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfloorplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
