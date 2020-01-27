import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignheadComponent } from './designhead.component';

describe('DesignheadComponent', () => {
  let component: DesignheadComponent;
  let fixture: ComponentFixture<DesignheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
