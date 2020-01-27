import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFloorplanComponent } from './category-floorplan.component';

describe('CategoryFloorplanComponent', () => {
  let component: CategoryFloorplanComponent;
  let fixture: ComponentFixture<CategoryFloorplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryFloorplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFloorplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
