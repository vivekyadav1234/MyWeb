import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesFloorplanComponent } from './files-floorplan.component';

describe('FilesFloorplanComponent', () => {
  let component: FilesFloorplanComponent;
  let fixture: ComponentFixture<FilesFloorplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesFloorplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesFloorplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
