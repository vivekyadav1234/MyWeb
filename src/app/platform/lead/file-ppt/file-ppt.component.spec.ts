import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePptComponent } from './file-ppt.component';

describe('FilePptComponent', () => {
  let component: FilePptComponent;
  let fixture: ComponentFixture<FilePptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilePptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
