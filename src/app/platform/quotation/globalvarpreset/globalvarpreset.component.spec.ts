import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalvarpresetComponent } from './globalvarpreset.component';

describe('GlobalvarpresetComponent', () => {
  let component: GlobalvarpresetComponent;
  let fixture: ComponentFixture<GlobalvarpresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalvarpresetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalvarpresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
