import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFilesCategoryComponent } from './assign-files-category.component';

describe('AssignFilesCategoryComponent', () => {
  let component: AssignFilesCategoryComponent;
  let fixture: ComponentFixture<AssignFilesCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignFilesCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignFilesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
