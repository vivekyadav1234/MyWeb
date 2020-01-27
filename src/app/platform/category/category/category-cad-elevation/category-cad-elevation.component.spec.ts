import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCadElevationComponent } from './category-cad-elevation.component';

describe('CategoryCadElevationComponent', () => {
  let component: CategoryCadElevationComponent;
  let fixture: ComponentFixture<CategoryCadElevationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryCadElevationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCadElevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
