import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPdfViewerComponent } from './email-pdf-viewer.component';

describe('EmailPdfViewerComponent', () => {
  let component: EmailPdfViewerComponent;
  let fixture: ComponentFixture<EmailPdfViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailPdfViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
