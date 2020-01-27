import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionableComponent } from './actionable.component';

describe('ActionableComponent', () => {
  let component: ActionableComponent;
  let fixture: ComponentFixture<ActionableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
