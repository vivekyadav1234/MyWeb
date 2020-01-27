import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMappingComponent } from './manage-mapping.component';

describe('ManageMappingComponent', () => {
  let component: ManageMappingComponent;
  let fixture: ComponentFixture<ManageMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
