import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBoqComponent } from './category-boq.component';

describe('CategoryBoqComponent', () => {
  let component: CategoryBoqComponent;
  let fixture: ComponentFixture<CategoryBoqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryBoqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
