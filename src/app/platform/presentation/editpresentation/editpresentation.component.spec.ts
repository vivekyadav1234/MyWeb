import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpresentationComponent } from './editpresentation.component';

describe('EditpresentationComponent', () => {
  let component: EditpresentationComponent;
  let fixture: ComponentFixture<EditpresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
