import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsFloorplanFormUploadComponent } from './sms-floorplan-form-upload.component';

describe('SmsFloorplanFormUploadComponent', () => {
  let component: SmsFloorplanFormUploadComponent;
  let fixture: ComponentFixture<SmsFloorplanFormUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsFloorplanFormUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsFloorplanFormUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
