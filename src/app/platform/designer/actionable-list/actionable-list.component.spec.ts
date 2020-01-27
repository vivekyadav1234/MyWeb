import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionableListComponent } from './actionable-list.component';

describe('ActionableListComponent', () => {
  let component: ActionableListComponent;
  let fixture: ComponentFixture<ActionableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
