import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusViewProfileComponent } from './cus-view-profile.component';

describe('CusViewProfileComponent', () => {
  let component: CusViewProfileComponent;
  let fixture: ComponentFixture<CusViewProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusViewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
