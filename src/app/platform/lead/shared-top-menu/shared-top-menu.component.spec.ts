import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTopMenuComponent } from './shared-top-menu.component';

describe('SharedTopMenuComponent', () => {
  let component: SharedTopMenuComponent;
  let fixture: ComponentFixture<SharedTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
