import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileWarrantyComponent } from './file-warranty.component';

describe('FileWarrantyComponent', () => {
  let component: FileWarrantyComponent;
  let fixture: ComponentFixture<FileWarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileWarrantyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
