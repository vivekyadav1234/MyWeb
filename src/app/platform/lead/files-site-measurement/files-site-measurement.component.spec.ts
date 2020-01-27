import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSiteMeasurementComponent } from './files-site-measurement.component';

describe('FilesSiteMeasurementComponent', () => {
  let component: FilesSiteMeasurementComponent;
  let fixture: ComponentFixture<FilesSiteMeasurementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesSiteMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesSiteMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
