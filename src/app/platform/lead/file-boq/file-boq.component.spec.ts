import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBoqComponent } from './file-boq.component';

describe('FileBoqComponent', () => {
  let component: FileBoqComponent;
  let fixture: ComponentFixture<FileBoqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileBoqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
