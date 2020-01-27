import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfloorplandesignComponent } from './editfloorplandesign.component';

describe('EditfloorplandesignComponent', () => {
  let component: EditfloorplandesignComponent;
  let fixture: ComponentFixture<EditfloorplandesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditfloorplandesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditfloorplandesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
