import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModularQuoteComponent } from './create-modular-quote.component';

describe('CreateModularQuoteComponent', () => {
  let component: CreateModularQuoteComponent;
  let fixture: ComponentFixture<CreateModularQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModularQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModularQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
