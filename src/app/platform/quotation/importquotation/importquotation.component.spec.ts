import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportquotationComponent } from './importquotation.component';

describe('ImportquotationComponent', () => {
  let component: ImportquotationComponent;
  let fixture: ComponentFixture<ImportquotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportquotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportquotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
