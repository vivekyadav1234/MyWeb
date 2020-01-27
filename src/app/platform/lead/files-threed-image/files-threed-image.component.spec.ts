import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesThreedImageComponent } from './files-threed-image.component';

describe('FilesThreedImageComponent', () => {
  let component: FilesThreedImageComponent;
  let fixture: ComponentFixture<FilesThreedImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesThreedImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesThreedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
