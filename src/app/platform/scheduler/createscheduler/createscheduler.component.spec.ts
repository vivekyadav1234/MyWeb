import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateschedulerComponent } from './createscheduler.component';

describe('CreateschedulerComponent', () => {
  let component: CreateschedulerComponent;
  let fixture: ComponentFixture<CreateschedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateschedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateschedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
