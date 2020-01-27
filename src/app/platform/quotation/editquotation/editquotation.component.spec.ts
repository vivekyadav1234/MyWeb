import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditquotationComponent } from './editquotation.component';

describe('EditquotationComponent', () => {
  let component: EditquotationComponent;
  let fixture: ComponentFixture<EditquotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditquotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditquotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
