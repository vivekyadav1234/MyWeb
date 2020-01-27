import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLooseQuoteComponent } from './create-loose-quote.component';

describe('CreateLooseQuoteComponent', () => {
  let component: CreateLooseQuoteComponent;
  let fixture: ComponentFixture<CreateLooseQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLooseQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLooseQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
