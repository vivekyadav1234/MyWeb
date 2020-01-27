import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiUploadComponent } from './pi-upload.component';

describe('PiUploadComponent', () => {
  let component: PiUploadComponent;
  let fixture: ComponentFixture<PiUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
