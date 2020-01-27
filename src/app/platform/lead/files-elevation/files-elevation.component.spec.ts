import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesElevationComponent } from './files-elevation.component';

describe('FilesElevationComponent', () => {
  let component: FilesElevationComponent;
  let fixture: ComponentFixture<FilesElevationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesElevationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesElevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
