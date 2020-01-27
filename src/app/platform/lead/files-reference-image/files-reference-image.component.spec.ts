import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesReferenceImageComponent } from './files-reference-image.component';

describe('FilesReferenceImageComponent', () => {
  let component: FilesReferenceImageComponent;
  let fixture: ComponentFixture<FilesReferenceImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesReferenceImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesReferenceImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
