import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlinesListComponent } from './deadlines-list.component';

describe('DeadlinesListComponent', () => {
  let component: DeadlinesListComponent;
  let fixture: ComponentFixture<DeadlinesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeadlinesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
