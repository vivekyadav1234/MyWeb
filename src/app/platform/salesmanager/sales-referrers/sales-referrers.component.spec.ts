import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReferrersComponent } from './sales-referrers.component';

describe('SalesReferrersComponent', () => {
  let component: SalesReferrersComponent;
  let fixture: ComponentFixture<SalesReferrersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReferrersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReferrersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
