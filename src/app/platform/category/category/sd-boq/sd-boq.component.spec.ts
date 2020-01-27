import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdBoqComponent } from './sd-boq.component';

describe('SdBoqComponent', () => {
  let component: SdBoqComponent;
  let fixture: ComponentFixture<SdBoqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdBoqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
