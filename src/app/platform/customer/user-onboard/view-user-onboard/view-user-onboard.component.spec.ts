import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserOnboardComponent } from './view-user-onboard.component';

describe('ViewUserOnboardComponent', () => {
  let component: ViewUserOnboardComponent;
  let fixture: ComponentFixture<ViewUserOnboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserOnboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
