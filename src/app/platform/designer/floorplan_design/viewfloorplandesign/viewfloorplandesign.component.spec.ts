import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfloorplandesignComponent } from './viewfloorplandesign.component';

describe('ViewfloorplandesignComponent', () => {
  let component: ViewfloorplandesignComponent;
  let fixture: ComponentFixture<ViewfloorplandesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewfloorplandesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfloorplandesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
