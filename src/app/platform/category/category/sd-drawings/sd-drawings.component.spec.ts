import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdDrawingsComponent } from './sd-drawings.component';

describe('SdDrawingsComponent', () => {
  let component: SdDrawingsComponent;
  let fixture: ComponentFixture<SdDrawingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdDrawingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdDrawingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
