import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewservicedetailsComponent } from './viewservicedetails.component';

describe('ViewservicedetailsComponent', () => {
  let component: ViewservicedetailsComponent;
  let fixture: ComponentFixture<ViewservicedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewservicedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewservicedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
