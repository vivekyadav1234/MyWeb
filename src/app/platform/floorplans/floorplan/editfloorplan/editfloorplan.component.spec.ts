import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfloorplanComponent } from './editfloorplan.component';

describe('EditfloorplanComponent', () => {
  let component: EditfloorplanComponent;
  let fixture: ComponentFixture<EditfloorplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditfloorplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditfloorplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
