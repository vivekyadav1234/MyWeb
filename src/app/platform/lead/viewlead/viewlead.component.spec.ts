import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewleadComponent } from './viewlead.component';

describe('ViewleadComponent', () => {
  let component: ViewleadComponent;
  let fixture: ComponentFixture<ViewleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
