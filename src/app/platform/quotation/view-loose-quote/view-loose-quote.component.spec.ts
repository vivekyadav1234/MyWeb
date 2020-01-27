import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLooseQuoteComponent } from './view-loose-quote.component';

describe('ViewLooseQuoteComponent', () => {
  let component: ViewLooseQuoteComponent;
  let fixture: ComponentFixture<ViewLooseQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLooseQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLooseQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
