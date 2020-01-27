import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListquotationComponent } from './listquotation.component';

describe('ListquotationComponent', () => {
  let component: ListquotationComponent;
  let fixture: ComponentFixture<ListquotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListquotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListquotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
