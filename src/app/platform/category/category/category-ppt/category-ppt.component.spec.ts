import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPptComponent } from './category-ppt.component';

describe('CategoryPptComponent', () => {
  let component: CategoryPptComponent;
  let fixture: ComponentFixture<CategoryPptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryPptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
