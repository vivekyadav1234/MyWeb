import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatequotationComponent } from './createquotation.component';

describe('CreatequotationComponent', () => {
  let component: CreatequotationComponent;
  let fixture: ComponentFixture<CreatequotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatequotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatequotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
